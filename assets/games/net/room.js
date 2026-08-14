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
 *   { version, name, game, seats: [seat, seat], moves: [{row, col}, ...] }
 *
 * The move log *is* the game state. Whose turn it is falls out of its length,
 * which is what lets a Security Rule refuse a move from anybody but the seat on
 * move — a rule cannot replay a board, but it can count.
 */

import { firebaseConfig } from '../../SoccerHockey/firebaseConfig.js';
import {
  ROOM_NAMES,
  ROOMS_COLLECTION,
  SANDBOX_COLLECTION,
  emptyRoomDoc,
  emptySandboxDoc,
  isRoomName,
} from './rooms.js?v=4.2.0';
import {
  claimSeat,
  touchSeat,
  releaseSeat,
  normaliseSeats,
  findOpenRoom,
  seatOf,
  HEARTBEAT_MS,
} from '../core/seats.js?v=4.2.0';

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
    case 'permission-denied':
      return (
        'The Firestore rules refused that. Check the dualityRooms block from ' +
        '_firebase/firestore.rules is what is actually published in the console.'
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
    const [appMod, authMod, dbMod] = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-auth.js`),
      import(`${SDK}/firebase-firestore.js`),
    ]);
    sdk = { ...appMod, ...authMod, ...dbMod };
    return sdk;
  } catch (cause) {
    throw new Error(
      'could not load the Firebase library — check the network is not blocking gstatic.com',
      { cause }
    );
  }
}

async function ensureApp() {
  const s = await loadSdk();
  if (!app) {
    app = s.initializeApp(firebaseConfig);
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
export async function readPool(collection = ROOMS_COLLECTION) {
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

/** Pick a room: the one asked for, else one with somebody already waiting. */
export async function chooseRoom({ preferred = null, now, collection = ROOMS_COLLECTION }) {
  if (isRoomName(preferred)) return preferred;
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
  return fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, collection);
    const snap = await tx.get(ref);
    const room = snap.exists() ? snap.data() : (blank ?? emptyRoomDoc(name));

    const result = claimSeat(room.seats, { uid, now });
    const next = { ...room, seats: result.seats.map((s) => ({ ...s })) };

    if (!snap.exists()) tx.set(ref, next);
    else tx.update(ref, { seats: next.seats });

    return { seat: result.seat, outcome: result.outcome, room: next };
  });
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
export async function appendMove({ name, uid, square, expectedLength }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name);
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

    tx.update(ref, { moves: [...moves, { row: square.row, col: square.col }] });
  });
}

/** Start a fresh game in the same room, keeping both seats. */
export async function resetRoom({ name }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name);
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
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
export async function setSandboxConfig({ name, uid, config }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, SANDBOX_COLLECTION);
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('sandbox has gone');
    if (seatOf(snap.data().seats, uid) === null) throw new Error('you are watching, not playing');
    tx.update(ref, { config, moves: [] });
  });
}

/** Push the ball. Either player, any time — see above. */
export async function appendSandboxMove({ name, uid, square, expectedLength }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, SANDBOX_COLLECTION);
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error('sandbox has gone');
    const room = snap.data();
    const moves = Array.isArray(room.moves) ? room.moves : [];
    if (seatOf(room.seats, uid) === null) throw new Error('you are watching, not playing');
    if (moves.length !== expectedLength) throw new Error('the board moved under you');
    tx.update(ref, { moves: [...moves, { row: square.row, col: square.col }] });
  });
}

/** Put the ball back in the middle, keeping the configuration. */
export async function resetSandbox({ name, uid }) {
  const { sdk: fb, db: d } = await ensureApp();
  await fb.runTransaction(d, async (tx) => {
    const ref = roomRef(name, SANDBOX_COLLECTION);
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    if (seatOf(snap.data().seats, uid) === null) throw new Error('you are watching, not playing');
    tx.update(ref, { moves: [] });
  });
}

export function watchSandbox(name, onChange, onError) {
  return watchRoom(name, onChange, onError, SANDBOX_COLLECTION);
}

export { HEARTBEAT_MS, ACTIVE_HEARTBEAT_MS, ROOM_NAMES, SANDBOX_COLLECTION };

/** Reset module state. Only used when a page wants a clean slate. */
export function _resetForTests() {
  app = null;
  db = null;
  auth = null;
}
