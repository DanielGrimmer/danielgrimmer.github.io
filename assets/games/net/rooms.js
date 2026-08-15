/**
 * The room pools.
 *
 * Fixed lists, not generators. Clients may only ever touch a document whose id
 * is on one, and the Security Rules carry the same lists — so the number of
 * documents a collection can ever hold is twenty, no matter what anybody sends.
 * That is what keeps document creation from being an unbounded cost on a plan
 * whose quota, once spent, takes the games offline for the day.
 *
 * Keep these in step with `_firebase/firestore.rules`. If you add a name here
 * and not there, joining that room will simply be refused; there is a test that
 * reads the rules file and compares the two.
 *
 * Names are speakable: "join GreenField" survives a phone call in a way that a
 * hex code does not.
 *
 * Soccer Hockey and its sandbox share this list. Escher Chess has its own,
 * further down.
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

/**
 * Escher Chess keeps its own collection, and its own names.
 *
 * Its own documents, because a chess log landing in a room a Soccer Hockey game
 * is being played in is not something a counting rule could sort out
 * afterwards. Its own *names* because the two games have nothing to do with
 * each other and a room name is the one piece of the machinery a player says
 * out loud: "meet me in ImpossibleCastle" belongs to one of these games and not
 * the other. The twenty-document ceiling that keeps this project inside a free
 * plan holds per collection, so a second list of twenty costs nothing.
 *
 * The names are V1.2's, which were the ones with the jokes in them, with ten
 * more in the same register to fill the pool out.
 */
export const ESCHER_COLLECTION = 'escherRooms';

export const ESCHER_ROOM_NAMES = Object.freeze([
  'RelativityRoom',
  'MobiusCheck',
  'ImpossibleCastle',
  'WaterfallWar',
  'MysteriousMoves',
  'ParadoxPawn',
  'InfiniteKnight',
  'MirroredGambit',
  'TessellatedTactics',
  'RecursiveRook',
  'AscendingBishop',
  'BelvedereBoard',
  'PenroseStairs',
  'MetamorphosisMate',
  'DrosteDefence',
  'SkyAndWater',
  'CircleLimit',
  'DayAndNight',
  'ReptileRank',
  'CurvedSpace',
]);

/**
 * Which pool a collection draws on.
 *
 * Everything that walks the pool — choosing a room, validating a link, filling
 * the "join by name" list — goes through here rather than reaching for
 * `ROOM_NAMES`, so adding a third game means adding a line here and not hunting
 * for the places that assumed there was only one list.
 */
const POOLS = Object.freeze({
  [ROOMS_COLLECTION]: ROOM_NAMES,
  [SANDBOX_COLLECTION]: ROOM_NAMES,
  [ESCHER_COLLECTION]: ESCHER_ROOM_NAMES,
});

export const namesFor = (collection) => POOLS[collection] ?? ROOM_NAMES;

export function isRoomName(name, names = ROOM_NAMES) {
  return typeof name === 'string' && names.includes(name);
}

/** The room asked for in the URL, if it is one we recognise. */
export function roomFromLocation(search = '', names = ROOM_NAMES) {
  const asked = new URLSearchParams(search).get('room');
  return isRoomName(asked, names) ? asked : null;
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
export const LAST_ESCHER_KEY = 'dg.lastEscher';

export function rememberRoom(storage, name, key = LAST_ROOM_KEY, names = ROOM_NAMES) {
  if (!isRoomName(name, names)) return;
  try {
    storage?.setItem(key, name);
  } catch {
    // Private mode, or storage full. Losing the memory is not worth an error.
  }
}

export function recallRoom(storage, key = LAST_ROOM_KEY, names = ROOM_NAMES) {
  try {
    const name = storage?.getItem(key);
    return isRoomName(name, names) ? name : null;
  } catch {
    return null;
  }
}

/** A link that drops someone straight into this room. */
export function shareLink(origin, pathname, room) {
  return `${origin}${pathname}?room=${encodeURIComponent(room)}`;
}

/** Two unclaimed chairs. Shared by every kind of room this project has. */
export function blankSeats() {
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
    seats: blankSeats(),
    moves: [],
  };
}

/**
 * An unplayed Escher Chess room.
 *
 * `board` names which of the published boards is being played, and is fixed at
 * creation: the two players must agree about it before either can read the
 * log, and a room that changed size mid-game would invalidate every move in it.
 */
export function emptyEscherRoomDoc(name, board) {
  return {
    version: 1,
    name,
    game: 'escher-chess',
    board,
    seats: blankSeats(),
    moves: [],
  };
}

/**
 * Can this room be played on the board the arriving player came for?
 *
 * The board is recorded in the room, and it must be, because a move means
 * nothing without it. But choosing a room used to ignore it entirely, so
 * pressing the button marked 8×8 would drop you into whatever board the room
 * happened to have been created with — which is what it did.
 *
 * Three ways a room can serve you:
 *
 * 1. It does not exist. Whoever gets there first creates it, on their board.
 * 2. It is already on that board.
 * 3. It holds a game, and the game is over as far as this arrival is concerned
 *    — an empty room's stale log is cleared on the way in, and the board may
 *    change at that same moment, because there is then nothing left for the
 *    change to invalidate.
 *
 * The fourth case is a room that exists, is on the other board, and has never
 * been played in: somebody opened the page and closed the tab. Nothing in the
 * log to clear means no reset to ride along with, so that room is passed over
 * here. The published rules also allow the board of an empty room to be set
 * outright, which is what stops those accumulating.
 */
export function escherRoomServes(room, boardId) {
  if (!room?.exists) return true;
  if (room.board === boardId) return true;
  return Array.isArray(room.moves) && room.moves.length > 0;
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
    seats: blankSeats(),
    config,
    moves: [],
  };
}
