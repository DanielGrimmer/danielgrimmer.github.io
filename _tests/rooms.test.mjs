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
  nextRoomName,
  shareLink,
  rememberRoom,
  recallRoom,
  emptyRoomDoc,
  emptySandboxDoc,
  emptyEscherRoomDoc,
  escherRoomServes,
  ESCHER_BOARD_ROOMS,
  escherNamesFor,
  escherBoardOf,
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

test('the next room along', async (t) => {
  await t.test('is the next name in the pool, and wraps', () => {
    for (let i = 0; i < ROOM_NAMES.length; i++) {
      const expected = ROOM_NAMES[(i + 1) % ROOM_NAMES.length];
      assert.equal(nextRoomName(ROOM_NAMES[i]), expected);
    }
    assert.equal(nextRoomName(ROOM_NAMES.at(-1)), ROOM_NAMES[0], 'the last wraps to the first');
  });

  await t.test('is the same answer for both players, which is the point', () => {
    // Neither of them may speak; both press the same button and must arrive in
    // the same room. Nothing about it may depend on who is asking or when.
    const here = 'GreenField';
    assert.equal(nextRoomName(here), nextRoomName(here));
  });

  await t.test('walks the whole pool without repeating before it wraps', () => {
    const seen = new Set();
    let at = ROOM_NAMES[0];
    for (let i = 0; i < ROOM_NAMES.length; i++) {
      seen.add(at);
      at = nextRoomName(at);
    }
    assert.equal(seen.size, ROOM_NAMES.length);
    assert.equal(at, ROOM_NAMES[0]);
  });

  await t.test('an unknown name starts the pool over rather than stranding anybody', () => {
    assert.equal(nextRoomName('NotARoom'), ROOM_NAMES[0]);
    assert.equal(nextRoomName(''), ROOM_NAMES[0]);
    assert.equal(nextRoomName(undefined), ROOM_NAMES[0]);
  });

  await t.test('respects a pool it is handed', () => {
    assert.equal(nextRoomName(ESCHER_ROOM_NAMES[0], ESCHER_ROOM_NAMES), ESCHER_ROOM_NAMES[1]);
  });
});

test('REGRESSION: a sandbox move is checked before it is sent', async (t) => {
  /*
   * The live bug: the sandbox page passed the move under the key `square`, so
   * `move` arrived undefined and Firestore refused the write with
   * "Unsupported field value: undefined (found in document …)" — naming the
   * document instead of the mistake. The guard throws before any network is
   * touched, which is also what makes it testable here.
   */
  const { appendSandboxMove } = await import('../assets/games/net/room.js');

  await t.test('undefined is named for what it is', async () => {
    await assert.rejects(
      appendSandboxMove({ name: 'GreenField', uid: 'me', square: { row: 1, col: 2 }, expectedLength: 0 }),
      /needs \{row, col\}, got undefined/
    );
  });

  await t.test('and so is a malformed square', async () => {
    for (const move of [null, {}, { row: 1 }, { row: '1', col: 2 }, { row: 1.5, col: 2 }]) {
      await assert.rejects(
        appendSandboxMove({ name: 'GreenField', uid: 'me', move, expectedLength: 0 }),
        TypeError,
        `move=${JSON.stringify(move)} should be refused`
      );
    }
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
    // As sets: the rules list membership, and halving the pool reordered the
    // module's list without changing what is in it. The rules file did not
    // move, so there is nothing to republish.
    assert.deepEqual([...knownIn(ESCHER_COLLECTION)].sort(), [...ESCHER_ROOM_NAMES].sort());
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
    // Empty, so the other board may take it over and rebrand it on arrival.
    assert.equal(escherRoomServes({ ...doc, exists: true }, 'escher-5x10'), true);
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

  /*
   * REGRESSION, inverted from what this test used to pin. A log with moves in
   * it may be somebody's game in progress, and this predicate cannot see the
   * seats to tell — accepting it is how the button marked 5×10 landed a
   * player in the middle of an eight-file game. An *empty* room is the safe
   * one to take: its board is changed as the newcomer sits down, in the write
   * the published isRebrand rule allows.
   */
  await t.test('a room mid-game on the other board is passed over', () => {
    assert.equal(escherRoomServes(room({ moves: [{}, {}] }), WIDE), false);
    // On its own board a game in progress is fine — you might be resuming it.
    assert.equal(escherRoomServes(room({ moves: [{}, {}] }), NARROW), true);
  });

  await t.test('and an empty room on the other board is rebrandable, so it serves', () => {
    assert.equal(escherRoomServes(room(), WIDE), true);
    assert.equal(escherRoomServes(room(), NARROW), true);
  });
});

/*
 * The structural fix under the predicate: the pool is halved by board, so a
 * room's *name* settles which board it plays before any document is read.
 */
test('the Escher pool is halved by board', async (t) => {
  const narrow = ESCHER_BOARD_ROOMS['escher-5x10'];
  const wide = ESCHER_BOARD_ROOMS['escher-8x8'];

  await t.test('ten names each, disjoint, and together the whole pool', () => {
    assert.equal(narrow.length, 10);
    assert.equal(wide.length, 10);
    assert.equal(new Set([...narrow, ...wide]).size, 20);
    assert.deepEqual([...narrow, ...wide].sort(), [...ESCHER_ROOM_NAMES].sort());
  });

  await t.test('escherNamesFor hands out the half, or the whole pool for an unknown board', () => {
    assert.deepEqual(escherNamesFor('escher-5x10'), narrow);
    assert.deepEqual(escherNamesFor('escher-8x8'), wide);
    assert.deepEqual(escherNamesFor('nonsense'), ESCHER_ROOM_NAMES);
    assert.deepEqual(escherNamesFor(undefined), ESCHER_ROOM_NAMES);
  });

  await t.test('escherBoardOf inverts it, and refuses names outside the pool', () => {
    for (const name of narrow) assert.equal(escherBoardOf(name), 'escher-5x10');
    for (const name of wide) assert.equal(escherBoardOf(name), 'escher-8x8');
    assert.equal(escherBoardOf('GreenField'), null);
    assert.equal(escherBoardOf(undefined), null);
  });

  await t.test('the two rooms whose boards players have already seen keep them', () => {
    // Both observed live before the pool was halved; the partition is chosen
    // so that neither room changes its board under its current occupants.
    assert.equal(escherBoardOf('RelativityRoom'), 'escher-5x10');
    assert.equal(escherBoardOf('InfiniteKnight'), 'escher-8x8');
  });
});
