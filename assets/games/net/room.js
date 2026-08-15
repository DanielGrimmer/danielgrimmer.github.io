/**
 * The Firestore transport: everything that talks to the network.
 *
 * Deliberately thin, and the only part of the game that cannot be tested from a
 * terminal. All the decisions — who holds which seat, whether a seat has been
 * abandoned, whether a move is legal — live in the pure modules under core/ and
 * are exercised there. This file does no reasoning; it reads documents, writes
 * documents, and hands the results to code that does.
 *
 * A room document is:
 *
 *   { version, name, game, seats: [seat, seat], moves: [move, ...] }
 *
 * The move log *is* the game state. Whose turn it is falls out of its length,
 * which is what lets a Security Rule refuse a move from anybody but the seat on
 * move — a rule cannot replay a board, but it can count.
 *
 * What a move *is* never reaches this file. Soccer Hockey writes `{row, col}`
 * and Escher Chess writes `{from, to, promote}`; both are checked by the engine
 * before they are sent and neither is understood by the rules, which only ever
 * count. So `appendMove` takes whatever map its caller hands it, and the two
 * games differ by a collection name.
 */

import { firebaseConfig, appCheckSiteKey } from '../../SoccerHockey/firebaseConfig.js?v=4.6.0';
import {
  ROOM_NAMES,
  ROOMS_COLLECTION,
  SANDBOX_COLLECTION,
  ESCHER_COLLECTION,
  emptyRoomDoc,
  emptySandboxDoc,
  isRoomName,
} from './rooms.js?v=4.6.0';
import {
  claimSeat,
  touchSeat,
  releaseSeat,
  normaliseSeats,
  findOpenRoom,
  isAbandonedGame,
  seatOf,
  HEARTBEAT_MS,
} from '../core/seats.js?v=4.6.0';

/** While it is your move, beat faster so the other side can see you are there. */
const ACTIVE_HEARTBEAT_MS = 15 * 1000;

/**
 * Turn a Firebase error into something worth reading.
 *
 * These all mean "somebody has to change a setting in the console", and the
 * console is not where the person hitting the error is looking. Naming the
 * exact switch beats a stack trace.
 */
export function explain(err) {
  const code = err?.code ?? '';
  switch (code) {
    case 'auth/admin-restricted-operation':
    case 'auth/operation-not-allowed':
      return (
        'Firebase refused to create an anonymous account. Two switches to check, ' +
        'both under Authentication in the Firebase console: Sign-in method → ' +
        'Anonymous must read Enabled, and Settings → User actions must have ' +
        '“Enable create (sign-up)” ticked. That second one blocks every sign-up, ' +
        'anonymous included, and is easy to miss.'
      );
    case 'auth/network-request-failed':
      return 'Could not reach Firebase. Check the network, and any extension blocking Google domains.';
    /*
     * The key in firebaseConfig.js is not one this project will accept. Usually
     * it was deleted or restricted in the Google Cloud console — a referrer
     * restriction that does not list this site looks exactly the same from here
     * as a key that no longer exists.
     */
    case 'auth/api-key-not-valid':
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    case 'auth/invalid-api-key':
      return (
        'Firebase rejected this page’s API key. Either the key in ' +
        'assets/SoccerHockey/firebaseConfig.js is no longer one of the ' +
        'project’s keys, or its restrictions do not allow this site. Google ' +
        'Cloud console → APIs & Services → Credentials, in project ' +
        'soccerhockeyduality: the key there must match the one in that file, ' +
        'and its website restrictions must include this page’s origin.'
      );
    case 'permission-denied':
      return (
        'The Firestore rules refused that. Check the block for this collection ' +
        'in _firebase/firestore.rules is what is actually published in the ' +
        'console — and, if App Check enforcement has just been switched on, ' +
        'that this page is sending a token.'
      );
    // App Check itself, which surfaces before the rules ever run.
    case 'appCheck/recaptcha-error':
    case 'appCheck/fetch-status-error':
    case 'appCheck/throttled':
      return (
        'App Check could not vouch for this page. Usually reCAPTCHA is blocked ' +
        'by an extension or a privacy setting; on a machine that is not the ' +
        'live site, it needs a debug token registered in the console.'
      );
    case 'unavailable':
      return 'Firestore is unreachable right now — the network dropped, or the daily quota is spent.';
    case 'failed-precondition':
      return 'Firestore rejected the write. If this is persistent, the rules and the client disagree about the room shape.';
    default:
      return err?.message ?? String(err);
  }
}

const SDK = 'https://www.gstatic.com/firebasejs/11.3.1';

let sdk = null;
let app = null;
let db = null;
let auth = null;

/**
 * Fetch the Firebase SDK on demand rather than at parse time.
 *
 * Imported statically, an unreachable gstatic.com stops the whole module graph
 * before a line of the page runs — the shell never renders and the player sees
 * "Connecting…" for ever with nothing to act on. Loading it here means the page
 * draws itself first and a blocked or offline network becomes a message.
 */
async function loadSdk() {
  if (sdk) return sdk;
  try {
    const mods = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-auth.js`),
      import(`${SDK}/firebase-firestore.js`),
      // Only fetched when there is a key to use it with, so a project without
      // App Check pays nothing for the option.
      appCheckSiteKey ? import(`${SDK}/firebase-app-check.js`) : Promise.resolve({}),
    ]);
    sdk = Object.assign({}, ...mods);
    return sdk;
  } catch (cause) {
    throw new Error(
      'could not load the Firebase library — check the network is not blocking gstatic.com',
      { cause }
    );
  }
}

/**
 * App Check: proof that a request came from this site rather than from a script
 * holding a copy of the config.
 *
 * It is the only defence available against the one thing that can actually take
 * these games down. The project is on the free plan, where exceeding the daily
 * write quota disables Firestore rather than costing anything — and a Security
 * Rule cannot help, because it judges each write alone and has no memory. So
 * rate limiting has to happen before the rules run, which is what this is.
 *
 * Three things it deliberately does not do:
 *
 * - **Fail loudly.** Until enforcement is switched on in the console, a missing
 *   token changes nothing, so a reCAPTCHA that will not load must not stop the
 *   page. After enforcement it becomes a permission error, which `explain`
 *   names.
 * - **Run without a key.** No key, no App Check, no reCAPTCHA script, no
 *   third-party request. That is the state this ships in.
 * - **Block local work.** Off the live site it asks for a debug token instead,
 *   which is registered by hand in the console and is the only way to keep
 *   playing locally once enforcement is on.
 */
function startAppCheck(s, instance) {
  if (!appCheckSiteKey || typeof s.initializeAppCheck !== 'function') return;
  const local = ['localhost', '127.0.0.1', ''].includes(location.hostname);
  // Must be set before initializeAppCheck; prints a token to the console for
  // registering under App Check -> Apps -> Manage debug tokens.
  if (local) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  try {
    s.initializeAppCheck(instance, {
      provider: new s.ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    console.warn('App Check did not start; requests will go out unattested.', err);
  }
}

async function ensureApp() {
  const s = await loadSdk();
  if (!app) {
    app = s.initializeApp(firebaseConfig);
    // Before the first read or write, so that no request goes out unattested.
    startAppCheck(s, app);
    db = s.getFirestore(app);
    auth = s.getAuth(app);
  }
  return { sdk: s, app, db, auth };
}

/**
 * Sign in anonymously. No login, no prompt — the browser is simply given a
 * stable id so that a seat can belong to somebody rather than to whoever writes
 * first.
 */
export async function signIn() {
  const { sdk: fb, auth: a } = await ensureApp();
  if (a.currentUser) return a.currentUser.uid;
  await fb.signInAnonymously(a);
  if (a.currentUser) return a.currentUser.uid;
  // Some browsers settle the user on the next tick rather than on the promise.
  return new Promise((resolve, reject) => {
    const stop = fb.onAuthStateChanged(
      a,
      (user) => {
        if (!user) return;
        stop();
        resolve(user.uid);
      },
      reject
    );
  });
}

/**
 * Requires the SDK to be loaded already; every caller awaits ensureApp first.
 *
 * The collection is a parameter because the sandbox keeps its own documents
 * under the same twenty names. Seat handling is identical for both — claiming,
 * beating and releasing a chair does not care what is on the table — so those
 * functions take a collection and the sandbox reuses them whole.
 */
function roomRef(name, collection = ROOMS_COLLECTION) {
  return sdk.doc(db, collection, name);
}

/**
 * Read every room in the pool so a free one can be chosen.
 *
 * A room that does not exist yet reads as empty rather than as an error: the
 * pool is materialised lazily, on first use, by whoever gets there first.
 */
async function readPool(collection = ROOMS_COLLECTION) {
  await ensureApp();
  const snapshots = await Promise.all(
    ROOM_NAMES.map(async (name) => {
      try {
        const snap = await sdk.getDoc(roomRef(name, collection));
        return { id: name, exists: snap.exists(), ...(snap.data() ?? emptyRoomDoc(name)) };
      } catch {
        return { id: name, exists: false, ...emptyRoomDoc(name) };
      }
    })
  );
  return snapshots.map((r) => ({ ...r, seats: normaliseSeats(r.seats) }));
}

/**
 * Pick a room, in order of how much the choice was actually somebody's.
 *
 * 1. The one in the link. An invite always wins.
 * 2. The one this browser was last in, if its seat is still ours. That is a
 *    returning player, and sending them anywhere else loses their game.
 * 3. Whatever the pool suggests — see `findOpenRoom`.
 */
export async function chooseRoom({
  preferred = null,
  remembered = null,
  uid = null,
  now,
  collection = ROOMS_COLLECTION,
}) {
  if (isRoomName(preferred)) return preferred;

  if (uid && isRoomName(remembered)) {
    const mine = await peekRoom({ name: remembered, collection });
    if (mine && seatOf(mine.seats, uid) !== null) return remembered;
  }

  const pool = await readPool(collection);
  const open = findOpenRoom(pool, now);
  return open ? open.id : ROOM_NAMES[0];
}

/**
 * Take a seat, in a transaction so two people arriving together cannot be given
 * the same chair. Creates the room document if this is its first use.
 *
 * @returns {{seat: number|null, outcome: string, room: object}}
 */
export async function joinRoom({ name, uid, now, collection = ROOMS_COLLECTION, blank = null }) {
  const { sdk: fb, db: d } = await ensureApp();
  const joined = await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, collection);
    const snap = await tx.get(ref);
    const room = snap.exists() ? snap.data() : (blank ?? emptyRoomDoc(name));

    const result = claimSeat(room.seats, { uid, now });
    const next = { ...room, seats: result.seats.map((s) => ({ ...s })) };

    if (!snap.exists()) tx.set(ref, next);
    else tx.update(ref, { seats: next.seats });

    return {
      seat: result.seat,
      outcome: result.outcome,
      room: next,
      // Judged against the seats as they stood *before* this claim: whether
      // anybody was still in the room when we walked in.
      abandoned: isAbandonedGame(room.seats, {
        moves: room.moves,
        outcome: result.outcome,
        now,
      }),
    };
  });

  /*
   * A room forgets a game nobody is left to finish.
   *
   * A separate write rather than part of the claim above, because the published
   * rule for a seat operation requires the move count not to change — clearing
   * the log alongside a claim is refused, while clearing it on its own is
   * exactly the reset the rule already allows. It only runs when a stranger
   * walks into an empty room holding somebody else's finished game, so the
   * extra round trip costs nothing that anybody waits on.
   */
  if (joined.abandoned && joined.seat !== null) {
    try {
      await resetRoom({ name, collection });
      return { ...joined, room: { ...joined.room, moves: [] } };
    } catch {
      // Refused or offline: the stale log stays, and the page says so.
    }
  }
  return joined;
}

/** Read a room without joining it. Used to check a remembered room is still ours. */
async function peekRoom({ name, collection = ROOMS_COLLECTION }) {
  await ensureApp();
  try {
    const snap = await sdk.getDoc(roomRef(name, collection));
    if (!snap.exists()) return null;
    const room = snap.data();
    return { ...room, seats: normaliseSeats(room.seats), moves: Array.isArray(room.moves) ? room.moves : [] };
  } catch {
    return null;
  }
}

/** Report in. `active` marks a beat that followed real interaction. */
export async function heartbeat({ name, uid, now, active = false, collection = ROOMS_COLLECTION }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, collection);
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const room = snap.data();
    if (seatOf(room.seats, uid) === null) return; // spectators do not beat
    const seats = touchSeat(room.seats, { uid, now, active }).map((s) => ({ ...s }));
    tx.update(ref, { seats });
  });
}

/** Give the seat up immediately rather than making the next player wait it out. */
export async function leaveRoom({ name, uid, collection = ROOMS_COLLECTION }) {
  const { sdk: fb, db: d } = await ensureApp();
  try {
    await fb.runTransaction(d, async (tx) => {
      const ref = roomRef(name, collection);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const seats = releaseSeat(snap.data().seats, { uid }).map((s) => ({ ...s }));
      tx.update(ref, { seats });
    });
  } catch {
    // A tab being closed is not worth an error; the seat times out regardless.
  }
}

/**
 * Append one move. Transactional so that two clients cannot both write the
 * same index, and so a move computed against a stale board is rejected rather
 * than silently overwriting the other player's.
 */
export async function appendMove({
  name,
  uid,
  move,
  expectedLength,
  collection = ROOMS_COLLECTION,
}) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, collection);
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('room has gone');
    const room = snap.data();
    const moves = Array.isArray(room.moves) ? room.moves : [];

    if (moves.length !== expectedLength) {
      throw new Error('the board moved under you');
    }
    if (seatOf(room.seats, uid) !== moves.length % 2) {
      throw new Error('not your turn');
    }

    tx.update(ref, { moves: [...moves, move] });
  });
}

/** Start a fresh game in the same room, keeping both seats. */
export async function resetRoom({ name, collection = ROOMS_COLLECTION }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, collection);
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    if (!(snap.data().moves ?? []).length) return; // the rule refuses a no-op reset
    tx.update(ref, { moves: [] });
  });
}

/** Live updates. Returns an unsubscribe function. */
export async function watchRoom(name, onChange, onError, collection = ROOMS_COLLECTION) {
  await ensureApp();
  return sdk.onSnapshot(
    roomRef(name, collection),
    (snap) => {
      if (!snap.exists()) return;
      const room = snap.data();
      onChange({
        ...room,
        seats: normaliseSeats(room.seats),
        moves: Array.isArray(room.moves) ? room.moves : [],
      });
    },
    onError
  );
}

/* -------------------------------------------------------------- sandbox ---- */

/**
 * The sandbox, where both players may change anything at any time.
 *
 * No turn order and no seat-on-move check: with both boards on both screens
 * there is nothing left to keep secret, and taking turns to adjust a slider
 * would only be in the way. Holding a seat is still required — that is what
 * stops a third browser reaching in — and it is what gives the page presence.
 */
export async function joinSandbox({ name, uid, now, config }) {
  return joinRoom({
    name,
    uid,
    now,
    collection: SANDBOX_COLLECTION,
    blank: emptySandboxDoc(name, config),
  });
}

/**
 * Write a new configuration. The move log goes with it: a board of a different
 * size has different squares, so the old moves would be nonsense on it.
 */
export async function setSandboxConfig({ name, uid, config, collection = SANDBOX_COLLECTION }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, collection);
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('sandbox has gone');
    if (seatOf(snap.data().seats, uid) === null) throw new Error('you are watching, not playing');
    tx.update(ref, { config, moves: [] });
  });
}

/** Push the ball. Either player, any time — see above. */
export async function appendSandboxMove({
  name,
  uid,
  move,
  expectedLength,
  collection = SANDBOX_COLLECTION,
}) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, collection);
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('sandbox has gone');
    const room = snap.data();
    const moves = Array.isArray(room.moves) ? room.moves : [];
    if (seatOf(room.seats, uid) === null) throw new Error('you are watching, not playing');
    if (moves.length !== expectedLength) throw new Error('the board moved under you');
    tx.update(ref, { moves: [...moves, move] });
  });
}

/** Put the board back to its opening position, keeping the configuration. */
export async function resetSandbox({ name, uid, collection = SANDBOX_COLLECTION }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, collection);
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    if (seatOf(snap.data().seats, uid) === null) throw new Error('you are watching, not playing');
    tx.update(ref, { moves: [] });
  });
}

export function watchSandbox(name, onChange, onError) {
  return watchRoom(name, onChange, onError, SANDBOX_COLLECTION);
}

/* ----------------------------------------------------------- Escher Chess ---- */

/*
 * Escher Chess in four lines, because the transport genuinely is the same. Its
 * rooms differ from Soccer Hockey's by a collection name and by carrying which
 * board is being played; everything about seats, heartbeats, abandonment and
 * appending under a length check is shared, and so are the Security Rules'
 * shape.
 */
/**
 * Start again, possibly on the other board.
 *
 * A move means nothing without the board it was played on, so the board is
 * fixed for the whole of a game — but a reset empties the log, and at that
 * moment there is nothing left for a change to invalidate. Which is what lets
 * one room host the five-file game and then the eight-file one, rather than
 * being stuck with whichever was played in it first. The Security Rule draws
 * the line in the same place.
 */
async function resetEscherRoom({ name, board = null }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, ESCHER_COLLECTION);
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const room = snap.data();
    if (!(room.moves ?? []).length) return; // the rule refuses a no-op reset
    tx.update(ref, board && board !== room.board ? { moves: [], board } : { moves: [] });
  });
}

export const escher = Object.freeze({
  choose: (opts) => chooseRoom({ ...opts, collection: ESCHER_COLLECTION }),
  join: (opts) => joinRoom({ ...opts, collection: ESCHER_COLLECTION }),
  beat: (opts) => heartbeat({ ...opts, collection: ESCHER_COLLECTION }),
  leave: (opts) => leaveRoom({ ...opts, collection: ESCHER_COLLECTION }),
  append: (opts) => appendMove({ ...opts, collection: ESCHER_COLLECTION }),
  reset: (opts) => resetEscherRoom(opts),
  watch: (name, onChange, onError) => watchRoom(name, onChange, onError, ESCHER_COLLECTION),
});


export { HEARTBEAT_MS, ACTIVE_HEARTBEAT_MS, ROOM_NAMES, SANDBOX_COLLECTION, ESCHER_COLLECTION };
