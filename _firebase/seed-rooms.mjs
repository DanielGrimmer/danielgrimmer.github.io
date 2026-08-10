/**
 * Seed the pre-created room pool.
 *
 * The Security Rules deny `create` to every client, which is what keeps
 * document creation from being an unbounded cost. The pool therefore has to be
 * written once with admin credentials, which bypass rules. Run this again at
 * any time: it only fills in rooms that are missing, and never touches a room
 * that already exists (so a game in progress is safe).
 *
 * Usage
 * -----
 *   1. Firebase console -> Project settings -> Service accounts
 *      -> "Generate new private key". Save the JSON somewhere OUTSIDE this
 *      repository. It is a real secret, unlike the web API key.
 *
 *   2. In a scratch directory:
 *        npm init -y && npm install firebase-admin
 *        GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json \
 *          node /path/to/_firebase/seed-rooms.mjs
 *
 *   3. Delete the key when you are done, or keep it somewhere safe. Do not
 *      commit it.
 *
 * Options
 * -------
 *   --count=20        how many rooms to create (default 20)
 *   --collection=...  target collection (default dualityRooms)
 *   --dry-run         report what would be written, write nothing
 *
 * Twenty is generous: rooms are reused, and one frees itself five minutes
 * after its players stop reporting in.
 */

// firebase-admin is imported lazily inside main(), so --dry-run works with
// plain node and the helpers below stay importable without installing anything.

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const COUNT = Number(args.count ?? 20);
const COLLECTION = String(args.collection ?? 'dualityRooms');
const DRY_RUN = Boolean(args['dry-run']);

/**
 * Room names are drawn from a fixed list so they are speakable down a phone —
 * "join GreenField" beats reading out a hex code.
 */
const ADJECTIVES = [
  'Red', 'Blue', 'Green', 'Gold', 'Silver', 'Bronze', 'Purple', 'Orange',
  'White', 'Black', 'Amber', 'Coral', 'Ivory', 'Jade', 'Onyx', 'Pearl',
  'Rust', 'Sable', 'Teal', 'Umber', 'Violet', 'Cobalt', 'Crimson', 'Slate',
  'Copper',
];
const NOUNS = ['Puck', 'Goal', 'Field', 'Rink', 'Net', 'Stripes', 'Skates', 'Whistle'];

export function roomNames(count) {
  // 25 adjectives and 8 nouns are coprime, so stepping both together walks all
  // 200 pairs before repeating — and consecutive rooms look nothing alike,
  // which matters when two people are reading names to each other.
  const names = [];
  const limit = ADJECTIVES.length * NOUNS.length;
  for (let i = 0; names.length < count && i < limit; i++) {
    const name = `${ADJECTIVES[i % ADJECTIVES.length]}${NOUNS[i % NOUNS.length]}`;
    if (!names.includes(name)) names.push(name);
  }
  return names;
}

/** An unplayed room. `moves` is the whole game state; seats start empty. */
export function emptyRoom(name) {
  return {
    version: 1,
    name,
    game: 'soccer-hockey',
    params: { width: 11, height: 13, duality: 4 },
    seats: [
      { uid: null, claimedAt: null, lastSeen: null },
      { uid: null, claimedAt: null, lastSeen: null },
    ],
    moves: [],
  };
}

async function main() {
  const names = roomNames(COUNT);
  if (names.length < COUNT) {
    console.warn(`Only ${names.length} distinct names available; seeding that many.`);
  }

  if (DRY_RUN) {
    console.log(`[dry run] would seed ${names.length} rooms into ${COLLECTION}:`);
    console.log(names.join(', '));
    return;
  }

  const { initializeApp, applicationDefault } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');

  initializeApp({ credential: applicationDefault() });
  const db = getFirestore();

  let created = 0;
  let skipped = 0;
  for (const name of names) {
    const ref = db.collection(COLLECTION).doc(name);
    const snap = await ref.get();
    if (snap.exists) {
      skipped++;
      continue;
    }
    await ref.set(emptyRoom(name));
    created++;
  }

  console.log(`${COLLECTION}: ${created} created, ${skipped} already present.`);
  console.log('Rooms in the pool are never created by clients, only claimed.');
}

// Only run when invoked directly, so the helpers above stay unit-testable.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
