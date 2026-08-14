/**
 * The room pool.
 *
 * A fixed list, not a generator. Clients may only ever touch a document whose
 * id is on it, and the Security Rules carry the same list — so the number of
 * documents this project can ever hold is twenty, no matter what anybody sends.
 * That is what keeps document creation from being an unbounded cost on a plan
 * whose quota, once spent, takes the games offline for the day.
 *
 * Keep this in step with `_firebase/firestore.rules`. If you add a name
 * here and not there, joining that room will simply be refused.
 *
 * Names are speakable: "join GreenField" survives a phone call in a way that a
 * hex code does not.
 */

export const ROOM_NAMES = Object.freeze([
  'RedPuck',
  'BlueGoal',
  'GreenField',
  'GoldRink',
  'SilverNet',
  'BronzeStripes',
  'PurpleSkates',
  'OrangeWhistle',
  'WhitePuck',
  'BlackGoal',
  'AmberField',
  'CoralRink',
  'IvoryNet',
  'JadeStripes',
  'OnyxSkates',
  'PearlWhistle',
  'RustPuck',
  'SableGoal',
  'TealField',
  'UmberRink',
]);

export const ROOMS_COLLECTION = 'dualityRooms';

/**
 * The sandbox keeps its own document per room name, not a field on the game's.
 *
 * A game room is under a strict rule — only the seat on move may append, and
 * only one move at a time — because the whole point is that neither player can
 * meddle. The sandbox is the opposite: both players may change anything at any
 * moment. Those two contracts do not belong in one document, and separating
 * them means a bug in the loose rule cannot reach a game in progress.
 *
 * Sharing the room *names* is deliberate, though: whoever you just played, you
 * carry on with, by following the same link.
 */
export const SANDBOX_COLLECTION = 'dualitySandboxes';

export function isRoomName(name) {
  return typeof name === 'string' && ROOM_NAMES.includes(name);
}

/** The room asked for in the URL, if it is one we recognise. */
export function roomFromLocation(search = '') {
  const asked = new URLSearchParams(search).get('room');
  return isRoomName(asked) ? asked : null;
}

/*
 * The room a browser was last in, kept locally.
 *
 * Firebase hands the same anonymous uid back to a returning browser, so a seat
 * can still be yours a day later — but only if we know which room to look in.
 * The invite link carries that; arriving from the site's own menu does not, and
 * without this a returning player is handed a stranger's room instead of their
 * own game. Storage is passed in rather than reached for, so this is testable
 * and so a browser with storage disabled degrades to the pool logic.
 */
export const LAST_ROOM_KEY = 'dg.lastRoom';
export const LAST_SANDBOX_KEY = 'dg.lastSandbox';

export function rememberRoom(storage, name, key = LAST_ROOM_KEY) {
  if (!isRoomName(name)) return;
  try {
    storage?.setItem(key, name);
  } catch {
    // Private mode, or storage full. Losing the memory is not worth an error.
  }
}

export function recallRoom(storage, key = LAST_ROOM_KEY) {
  try {
    const name = storage?.getItem(key);
    return isRoomName(name) ? name : null;
  } catch {
    return null;
  }
}

/** A link that drops someone straight into this room. */
export function shareLink(origin, pathname, room) {
  return `${origin}${pathname}?room=${encodeURIComponent(room)}`;
}

function emptySeats() {
  return [
    { uid: null, claimedAt: null, lastSeen: null, lastActive: null },
    { uid: null, claimedAt: null, lastSeen: null, lastActive: null },
  ];
}

/** An unplayed room. Must match what the Security Rules will accept on create. */
export function emptyRoomDoc(name) {
  return {
    version: 1,
    name,
    game: 'soccer-hockey',
    seats: emptySeats(),
    moves: [],
  };
}

/**
 * A fresh sandbox. `config` is an encoded spec — plain numbers and a list of
 * `{dr, dc}` maps, because Firestore will not store a nested array.
 */
export function emptySandboxDoc(name, config) {
  return {
    version: 1,
    name,
    game: 'sandbox',
    seats: emptySeats(),
    config,
    moves: [],
  };
}
