import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ROOM_NAMES,
  ESCHER_ROOM_NAMES,
  ROOMS_COLLECTION,
  SANDBOX_COLLECTION,
  ESCHER_COLLECTION,
  LAST_ROOM_KEY,
  LAST_SANDBOX_KEY,
  LAST_ESCHER_KEY,
  isRoomName,
  namesFor,
  roomFromLocation,
  shareLink,
  rememberRoom,
  recallRoom,
  emptyRoomDoc,
  emptySandboxDoc,
  emptyEscherRoomDoc,
  escherRoomServes,
} from '../assets/games/net/rooms.js';

/** Enough of the Storage interface to exercise the helpers. */
function fakeStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    seen: map,
  };
}

test('the pool', async (t) => {
  await t.test('is a fixed list of twenty speakable names', () => {
    assert.equal(ROOM_NAMES.length, 20);
    assert.equal(new Set(ROOM_NAMES).size, 20);
    assert.ok(ROOM_NAMES.every((n) => /^[A-Za-z]+$/.test(n)));
  });

  await t.test('the two collections are distinct', () => {
    assert.notEqual(ROOMS_COLLECTION, SANDBOX_COLLECTION);
  });

  await t.test('only names on the list are names', () => {
    assert.equal(isRoomName('RedPuck'), true);
    assert.equal(isRoomName('redpuck'), false);
    assert.equal(isRoomName(''), false);
    assert.equal(isRoomName(null), false);
  });

  await t.test('a room in the query string is read, and anything else ignored', () => {
    assert.equal(roomFromLocation('?room=TealField'), 'TealField');
    assert.equal(roomFromLocation('?room=../../etc/passwd'), null);
    assert.equal(roomFromLocation(''), null);
  });

  await t.test('a share link round-trips through roomFromLocation', () => {
    const link = shareLink('https://example.com', '/game.html', 'JadeStripes');
    assert.equal(roomFromLocation(new URL(link).search), 'JadeStripes');
  });
});

test('Escher Chess has its own pool', async (t) => {
  await t.test('twenty speakable names of its own', () => {
    assert.equal(ESCHER_ROOM_NAMES.length, 20);
    assert.equal(new Set(ESCHER_ROOM_NAMES).size, 20);
    assert.ok(ESCHER_ROOM_NAMES.every((n) => /^[A-Za-z]+$/.test(n)));
  });

  // The point of a second list. "Meet me in ImpossibleCastle" says which game
  // as well as which room, and a link pasted into the wrong page is refused
  // rather than quietly opening an empty room of the same name next door.
  await t.test('and shares none of them with Soccer Hockey', () => {
    const shared = ESCHER_ROOM_NAMES.filter((n) => ROOM_NAMES.includes(n));
    assert.deepEqual(shared, []);
  });

  await t.test('each collection draws on the right pool', () => {
    assert.equal(namesFor(ROOMS_COLLECTION), ROOM_NAMES);
    assert.equal(namesFor(SANDBOX_COLLECTION), ROOM_NAMES);
    assert.equal(namesFor(ESCHER_COLLECTION), ESCHER_ROOM_NAMES);
  });

  await t.test('a name is only a name against its own pool', () => {
    assert.equal(isRoomName('ParadoxPawn', ESCHER_ROOM_NAMES), true);
    assert.equal(isRoomName('ParadoxPawn'), false);
    assert.equal(isRoomName('RedPuck', ESCHER_ROOM_NAMES), false);
    assert.equal(roomFromLocation('?room=MobiusCheck', ESCHER_ROOM_NAMES), 'MobiusCheck');
    assert.equal(roomFromLocation('?room=MobiusCheck'), null);
  });

  await t.test('and what is remembered is checked against it too', () => {
    const storage = fakeStorage();
    rememberRoom(storage, 'PenroseStairs', LAST_ESCHER_KEY, ESCHER_ROOM_NAMES);
    assert.equal(recallRoom(storage, LAST_ESCHER_KEY, ESCHER_ROOM_NAMES), 'PenroseStairs');
    // A Soccer Hockey name in the Escher slot is not a room this game has.
    rememberRoom(storage, 'RedPuck', LAST_ESCHER_KEY, ESCHER_ROOM_NAMES);
    assert.equal(recallRoom(storage, LAST_ESCHER_KEY, ESCHER_ROOM_NAMES), 'PenroseStairs');
  });
});

/**
 * The lists in the Security Rules are the ones that actually decide, and they
 * are a hand-kept copy of the ones above. A name added here and not there does
 * not fail loudly — it fails as "joining that room is refused", which looks
 * like a network problem from the outside.
 */
test('the published rules carry the same pools', async (t) => {
  const rules = readFileSync(new URL('../_firebase/firestore.rules', import.meta.url), 'utf8');

  const blockFor = (collection) => {
    const start = rules.indexOf(`match /${collection}/{roomId}`);
    assert.notEqual(start, -1, `no rules block for ${collection}`);
    const next = rules.indexOf('match /', start + 1);
    return rules.slice(start, next === -1 ? rules.length : next);
  };

  const knownIn = (collection) => {
    const found = /function known\(\)\s*\{\s*return roomId in \[([^\]]*)\]/.exec(
      blockFor(collection)
    );
    assert.ok(found, `no known() list for ${collection}`);
    return found[1]
      .split(',')
      .map((s) => s.trim().replace(/^'|'$/g, ''))
      .filter(Boolean);
  };

  await t.test('Soccer Hockey and its sandbox', () => {
    assert.deepEqual(knownIn(ROOMS_COLLECTION), [...ROOM_NAMES]);
    assert.deepEqual(knownIn(SANDBOX_COLLECTION), [...ROOM_NAMES]);
  });

  await t.test('Escher Chess', () => {
    assert.deepEqual(knownIn(ESCHER_COLLECTION), [...ESCHER_ROOM_NAMES]);
  });
});

test('remembering the last room', async (t) => {
  await t.test('a name written is a name read back', () => {
    const storage = fakeStorage();
    rememberRoom(storage, 'OnyxSkates');
    assert.equal(recallRoom(storage), 'OnyxSkates');
  });

  await t.test('the game and the sandbox remember separately', () => {
    const storage = fakeStorage();
    rememberRoom(storage, 'RedPuck', LAST_ROOM_KEY);
    rememberRoom(storage, 'BlueGoal', LAST_SANDBOX_KEY);
    assert.equal(recallRoom(storage, LAST_ROOM_KEY), 'RedPuck');
    assert.equal(recallRoom(storage, LAST_SANDBOX_KEY), 'BlueGoal');
  });

  await t.test('a name off the list is never written, nor read back', () => {
    const storage = fakeStorage({ [LAST_ROOM_KEY]: 'SomewhereElse' });
    assert.equal(recallRoom(storage), null);
    rememberRoom(storage, 'NotARoom');
    assert.equal(storage.seen.get(LAST_ROOM_KEY), 'SomewhereElse');
  });

  await t.test('storage that throws, or is absent, is survivable', () => {
    const hostile = {
      getItem() {
        throw new Error('private mode');
      },
      setItem() {
        throw new Error('quota');
      },
    };
    assert.doesNotThrow(() => rememberRoom(hostile, 'RedPuck'));
    assert.equal(recallRoom(hostile), null);
    assert.doesNotThrow(() => rememberRoom(undefined, 'RedPuck'));
    assert.equal(recallRoom(undefined), null);
  });
});

test('the documents a room starts life as', async (t) => {
  await t.test('a game room begins unplayed, with both chairs empty', () => {
    const doc = emptyRoomDoc('RedPuck');
    assert.equal(doc.name, 'RedPuck');
    assert.equal(doc.version, 1);
    assert.deepEqual(doc.moves, []);
    assert.equal(doc.seats.length, 2);
    assert.ok(doc.seats.every((s) => s.uid === null));
  });

  // Which board is recorded at creation, because a move means nothing without
  // it — and because it is what the arriving player asked for.
  await t.test('an Escher room is born knowing which board it is', () => {
    const doc = emptyEscherRoomDoc('ParadoxPawn', 'escher-8x8');
    assert.equal(doc.game, 'escher-chess');
    assert.equal(doc.board, 'escher-8x8');
    assert.deepEqual(doc.moves, []);
    assert.equal(escherRoomServes({ ...doc, exists: true }, 'escher-8x8'), true);
    assert.equal(escherRoomServes({ ...doc, exists: true }, 'escher-5x10'), false);
  });

  await t.test('a sandbox carries its configuration, and no nested arrays', () => {
    const doc = emptySandboxDoc('RedPuck', { width: 11, height: 13, duality: 4, moveSet: [{ dr: 1, dc: 0 }] });
    assert.equal(doc.game, 'sandbox');
    assert.deepEqual(doc.moves, []);
    assert.ok(doc.config.moveSet.every((o) => !Array.isArray(o)));
  });
});

/**
 * Choosing a room used to ignore which board it was playing, so the button
 * marked 8×8 dropped you wherever there was a free chair — and if that room had
 * been created by somebody who came for the five-file game, that is what you
 * got. This is the predicate that stops it.
 */
test('a room has to be playing the board you came for', async (t) => {
  const WIDE = 'escher-8x8';
  const NARROW = 'escher-5x10';
  const room = (over) => ({ exists: true, board: NARROW, moves: [], ...over });

  await t.test('a room that does not exist yet will be created on it', () => {
    assert.equal(escherRoomServes({ exists: false }, WIDE), true);
    assert.equal(escherRoomServes(undefined, WIDE), true);
  });

  await t.test('a room already on it serves', () => {
    assert.equal(escherRoomServes(room({ board: WIDE }), WIDE), true);
  });

  // Its stale log is cleared as the newcomer sits down, and the board may
  // change at that same moment, because there is nothing left to invalidate.
  await t.test('and so does one holding a game, whichever board that was on', () => {
    assert.equal(escherRoomServes(room({ moves: [{}, {}] }), WIDE), true);
  });

  await t.test('but a room on the other board with nothing in it does not', () => {
    assert.equal(escherRoomServes(room(), WIDE), false);
    // Which is only about the other board: on its own it is perfectly usable.
    assert.equal(escherRoomServes(room(), NARROW), true);
  });
});
