import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ROOM_NAMES,
  ROOMS_COLLECTION,
  SANDBOX_COLLECTION,
  LAST_ROOM_KEY,
  LAST_SANDBOX_KEY,
  isRoomName,
  roomFromLocation,
  shareLink,
  rememberRoom,
  recallRoom,
  emptyRoomDoc,
  emptySandboxDoc,
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

  await t.test('a sandbox carries its configuration, and no nested arrays', () => {
    const doc = emptySandboxDoc('RedPuck', { width: 11, height: 13, duality: 4, moveSet: [{ dr: 1, dc: 0 }] });
    assert.equal(doc.game, 'sandbox');
    assert.deepEqual(doc.moves, []);
    assert.ok(doc.config.moveSet.every((o) => !Array.isArray(o)));
  });
});
