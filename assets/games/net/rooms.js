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

export function isRoomName(name) {
  return typeof name === 'string' && ROOM_NAMES.includes(name);
}

/** The room asked for in the URL, if it is one we recognise. */
export function roomFromLocation(search = '') {
  const asked = new URLSearchParams(search).get('room');
  return isRoomName(asked) ? asked : null;
}

/** A link that drops someone straight into this room. */
export function shareLink(origin, pathname, room) {
  return `${origin}${pathname}?room=${encodeURIComponent(room)}`;
}

/** An unplayed room. Must match what the Security Rules will accept on create. */
export function emptyRoomDoc(name) {
  return {
    version: 1,
    name,
    game: 'soccer-hockey',
    seats: [
      { uid: null, claimedAt: null, lastSeen: null, lastActive: null },
      { uid: null, claimedAt: null, lastSeen: null, lastActive: null },
    ],
    moves: [],
  };
}
