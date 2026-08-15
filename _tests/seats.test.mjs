import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SEAT_TTL_MS,
  HEARTBEAT_MS,
  ACTIVE_MS,
  PRESENCE,
  presenceOf,
  SEAT_COUNT,
  OUTCOME,
  emptySeats,
  normaliseSeats,
  isHeld,
  isStale,
  isVacant,
  seatOf,
  claimSeat,
  touchSeat,
  releaseSeat,
  occupancy,
  findOpenRoom,
  pickRoom,
  isAbandonedGame,
  lastActivity,
  mayMove,
} from '../assets/games/core/seats.js';

const T0 = 1_000_000; // an arbitrary fixed clock; nothing here reads Date.now()

test('seat records', async (t) => {
  await t.test('start empty and frozen', () => {
    const seats = emptySeats();
    assert.equal(seats.length, SEAT_COUNT);
    assert.deepEqual([...seats], [
      { uid: null, claimedAt: null, lastSeen: null, lastActive: null },
      { uid: null, claimedAt: null, lastSeen: null, lastActive: null },
    ]);
    assert.throws(() => {
      'use strict';
      seats[0].uid = 'x';
    }, TypeError);
  });

  await t.test('a truncated or missing record is survivable', () => {
    assert.equal(normaliseSeats(undefined).length, SEAT_COUNT);
    assert.equal(normaliseSeats([{ uid: 'a', lastSeen: T0 }]).length, SEAT_COUNT);
    assert.equal(normaliseSeats([{ uid: 'a', lastSeen: T0 }])[1].uid, null);
  });

  await t.test('heartbeat interval leaves plenty of room inside the TTL', () => {
    assert.ok(HEARTBEAT_MS * 4 < SEAT_TTL_MS, 'several beats may be missed before eviction');
    assert.equal(SEAT_TTL_MS, 5 * 60 * 1000);
  });
});

test('claiming', async (t) => {
  await t.test('the first two arrivals get the two seats', () => {
    let seats = emptySeats();
    const a = claimSeat(seats, { uid: 'alice', now: T0 });
    assert.equal(a.seat, 0);
    assert.equal(a.outcome, OUTCOME.CLAIMED);

    const b = claimSeat(a.seats, { uid: 'bob', now: T0 + 1000 });
    assert.equal(b.seat, 1);
    assert.equal(b.outcome, OUTCOME.CLAIMED);
    assert.notEqual(a.seat, b.seat, 'two players must never share a seat');
  });

  await t.test('REGRESSION: two players in a room never collide', () => {
    // v3.1 derived the seat from a site-wide counter's parity, so two players
    // could both be handed "even" and neither could move.
    let seats = emptySeats();
    const taken = new Set();
    for (const uid of ['alice', 'bob']) {
      const res = claimSeat(seats, { uid, now: T0 });
      seats = res.seats;
      assert.equal(taken.has(res.seat), false, `${uid} was given an occupied seat`);
      taken.add(res.seat);
    }
    assert.deepEqual([...taken].sort(), [0, 1]);
  });

  await t.test('REGRESSION: a third arrival is a spectator, not a dead end', () => {
    // v3.1 gave a seatless visitor no feedback at all: isPlayersTurn() was
    // simply false forever and the board silently refused every click.
    let seats = emptySeats();
    seats = claimSeat(seats, { uid: 'alice', now: T0 }).seats;
    seats = claimSeat(seats, { uid: 'bob', now: T0 }).seats;
    const third = claimSeat(seats, { uid: 'carol', now: T0 });
    assert.equal(third.seat, null);
    assert.equal(third.outcome, OUTCOME.SPECTATOR);
    assert.deepEqual(third.seats, seats, 'a spectator must not disturb the seating');
  });

  await t.test('rejoining returns your own seat rather than taking another', () => {
    let seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    const again = claimSeat(seats, { uid: 'alice', now: T0 + 5000 });
    assert.equal(again.seat, 0);
    assert.equal(again.outcome, OUTCOME.RESUMED);
    assert.equal(again.seats[1].uid, null, 'the second seat stays free');
  });

  await t.test('rejoining keeps the original claim time but refreshes the beat', () => {
    let seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    const again = claimSeat(seats, { uid: 'alice', now: T0 + 90_000 });
    assert.equal(again.seats[0].claimedAt, T0);
    assert.equal(again.seats[0].lastSeen, T0 + 90_000);
  });

  await t.test('a uid must be supplied', () => {
    assert.throws(() => claimSeat(emptySeats(), { uid: '', now: T0 }), TypeError);
    assert.throws(() => claimSeat(emptySeats(), { uid: 'a', now: NaN }), TypeError);
  });
});

test('abandonment is silence, not inactivity', async (t) => {
  await t.test('a seat is held for as long as the tab reports in', () => {
    let seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    // Twenty minutes of hard thinking, with the tab still open.
    for (let t = HEARTBEAT_MS; t <= 20 * 60 * 1000; t += HEARTBEAT_MS) {
      seats = touchSeat(seats, { uid: 'alice', now: T0 + t });
      assert.ok(isHeld(seats[0], T0 + t), `lost the seat after ${t}ms of thinking`);
    }
    assert.equal(seatOf(seats, 'alice'), 0);
  });

  await t.test('a seat goes stale only once the tab has been quiet past the TTL', () => {
    const seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    assert.ok(isHeld(seats[0], T0 + SEAT_TTL_MS), 'still held right up to the limit');
    assert.ok(!isHeld(seats[0], T0 + SEAT_TTL_MS + 1));
    assert.ok(isStale(seats[0], T0 + SEAT_TTL_MS + 1));
    assert.ok(isVacant(seats[0], T0 + SEAT_TTL_MS + 1));
  });

  await t.test('someone else may take an abandoned seat', () => {
    const seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    const bob = claimSeat(seats, { uid: 'bob', now: T0 + SEAT_TTL_MS + 1 });
    assert.equal(bob.seat, 0);
    assert.equal(bob.outcome, OUTCOME.CLAIMED);
    assert.equal(bob.seats[0].uid, 'bob');
    assert.equal(seatOf(bob.seats, 'alice'), null, 'alice has genuinely lost it');
  });

  await t.test('but you get your own seat back if nobody took it', () => {
    const seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    const back = claimSeat(seats, { uid: 'alice', now: T0 + 60 * 60 * 1000 });
    assert.equal(back.seat, 0);
    assert.equal(back.outcome, OUTCOME.RESUMED);
  });

  await t.test('a beat from someone with no seat changes nothing', () => {
    const seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    assert.deepEqual(touchSeat(seats, { uid: 'nobody', now: T0 + 10 }), seats);
  });
});

test('leaving', async (t) => {
  await t.test('releasing frees the seat at once, without waiting out the TTL', () => {
    const seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    const freed = releaseSeat(seats, { uid: 'alice' });
    assert.equal(freed[0].uid, null);
    assert.equal(occupancy(freed, T0).status, 'empty');
    assert.equal(claimSeat(freed, { uid: 'bob', now: T0 }).seat, 0);
  });

  await t.test('releasing a seat you do not hold is harmless', () => {
    const seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    assert.deepEqual(releaseSeat(seats, { uid: 'bob' }), seats);
  });

  await t.test('you can swap sides after leaving — v3.1 cached this forever', () => {
    let seats = emptySeats();
    seats = claimSeat(seats, { uid: 'alice', now: T0 }).seats; // seat 0
    seats = claimSeat(seats, { uid: 'bob', now: T0 }).seats; // seat 1
    seats = releaseSeat(seats, { uid: 'alice' });
    seats = releaseSeat(seats, { uid: 'bob' });
    assert.equal(claimSeat(seats, { uid: 'bob', now: T0 }).seat, 0, 'bob may now sit on the other side');
  });
});

test('who may move', async (t) => {
  let seats = emptySeats();
  seats = claimSeat(seats, { uid: 'alice', now: T0 }).seats;
  seats = claimSeat(seats, { uid: 'bob', now: T0 }).seats;

  await t.test('only the seat whose turn it is', () => {
    assert.ok(mayMove(seats, { uid: 'alice', turn: 0, now: T0 }));
    assert.ok(!mayMove(seats, { uid: 'alice', turn: 1, now: T0 }));
    assert.ok(mayMove(seats, { uid: 'bob', turn: 1, now: T0 }));
    assert.ok(!mayMove(seats, { uid: 'bob', turn: 0, now: T0 }));
  });

  await t.test('never a spectator', () => {
    assert.ok(!mayMove(seats, { uid: 'carol', turn: 0, now: T0 }));
    assert.ok(!mayMove(seats, { uid: 'carol', turn: 1, now: T0 }));
  });

  await t.test('and not from a seat that has gone quiet', () => {
    assert.ok(!mayMove(seats, { uid: 'alice', turn: 0, now: T0 + SEAT_TTL_MS + 1 }));
  });
});

test('telling whether the other chair is occupied', async (t) => {
  await t.test('an unclaimed seat is empty', () => {
    assert.equal(presenceOf(emptySeats()[0], T0), PRESENCE.EMPTY);
    assert.equal(presenceOf(undefined, T0), PRESENCE.EMPTY);
  });

  await t.test('a seat whose tab has stopped reporting is gone', () => {
    const seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    assert.equal(presenceOf(seats[0], T0 + SEAT_TTL_MS + 1), PRESENCE.GONE);
  });

  await t.test('reporting in without interacting is idle, not active', () => {
    let seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    seats = touchSeat(seats, { uid: 'alice', now: T0 + 60_000 });
    // claimSeat does not set lastActive, and a plain beat does not either
    assert.equal(presenceOf(seats[0], T0 + 60_000), PRESENCE.IDLE);
  });

  await t.test('a beat that followed real interaction is active', () => {
    let seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    seats = touchSeat(seats, { uid: 'alice', now: T0 + 60_000, active: true });
    assert.equal(presenceOf(seats[0], T0 + 60_000), PRESENCE.ACTIVE);
  });

  await t.test('activity decays back to idle while the tab stays open', () => {
    let seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    seats = touchSeat(seats, { uid: 'alice', now: T0, active: true });
    const later = T0 + ACTIVE_MS + 1;
    seats = touchSeat(seats, { uid: 'alice', now: later }); // still beating, not touching
    assert.equal(presenceOf(seats[0], later), PRESENCE.IDLE, 'present but not at the controls');
    assert.notEqual(presenceOf(seats[0], later), PRESENCE.GONE, 'and certainly not gone');
  });

  await t.test('interaction is remembered across quiet beats', () => {
    let seats = claimSeat(emptySeats(), { uid: 'alice', now: T0 }).seats;
    seats = touchSeat(seats, { uid: 'alice', now: T0, active: true });
    seats = touchSeat(seats, { uid: 'alice', now: T0 + 1000 });
    assert.equal(seats[0].lastActive, T0, 'a quiet beat must not erase it');
  });
});

test('finding a room in the pool', async (t) => {
  const held = (uid, now) => ({ uid, claimedAt: now, lastSeen: now });

  await t.test('joins someone already waiting before opening a fresh room', () => {
    // Otherwise two people arriving independently each get a room of their own
    // and never meet, which is exactly the wrong default for a two-player game.
    const rooms = [
      { id: 'full', seats: [held('a', T0), held('b', T0)] },
      { id: 'empty', seats: emptySeats() },
      { id: 'half', seats: [held('c', T0), null] },
    ];
    assert.equal(findOpenRoom(rooms, T0).id, 'half');
  });

  await t.test('leaves alone somebody who is already playing, or reading a reveal', () => {
    // A lone occupant with moves on the board is not waiting for company. This
    // is what stopped an unaccompanied arrival being dropped into the middle
    // of somebody else's game — or, worse, straight into their reveal.
    const rooms = [
      { id: 'midgame', seats: [held('c', T0), null], moves: [{ row: 6, col: 5 }] },
      { id: 'empty', seats: emptySeats() },
    ];
    assert.equal(findOpenRoom(rooms, T0).id, 'empty');
  });

  await t.test('spreads unaccompanied arrivals rather than funnelling them into the first room', () => {
    // Always taking index 0 makes one room both the stalest and the most
    // crowded. The quietest free room wins instead.
    const rooms = [
      { id: 'busy-recently', seats: [{ uid: null, lastSeen: null }, { uid: null, lastSeen: null }], moves: [] },
      { id: 'never-used', seats: emptySeats() },
    ];
    rooms[0].seats = [
      { uid: 'a', claimedAt: T0, lastSeen: T0 },
      { uid: null, claimedAt: null, lastSeen: null },
    ];
    // Long enough ago that the seat is stale, so the room counts as free.
    assert.equal(findOpenRoom(rooms, T0 + SEAT_TTL_MS + 1).id, 'never-used');
  });

  await t.test('opens an empty room only when there is nobody to join', () => {
    const rooms = [
      { id: 'full', seats: [held('a', T0), held('b', T0)] },
      { id: 'empty', seats: emptySeats() },
    ];
    assert.equal(findOpenRoom(rooms, T0).id, 'empty');
  });

  await t.test('two arrivals in sequence land in the same room', () => {
    const pool = [
      { id: 'one', seats: emptySeats() },
      { id: 'two', seats: emptySeats() },
    ];
    const first = findOpenRoom(pool, T0);
    first.seats = claimSeat(first.seats, { uid: 'alice', now: T0 }).seats;
    const second = findOpenRoom(pool, T0 + 5000);
    assert.equal(second.id, first.id, 'the second player must be sent to the first');
    const claim = claimSeat(second.seats, { uid: 'bob', now: T0 + 5000 });
    assert.equal(claim.seat, 1);
  });

  await t.test('counts a room whose players have gone as empty again', () => {
    const rooms = [{ id: 'stale', seats: [held('a', T0), held('b', T0)] }];
    assert.equal(findOpenRoom(rooms, T0), null);
    assert.equal(findOpenRoom(rooms, T0 + SEAT_TTL_MS + 1).id, 'stale');
  });

  await t.test('returns nothing when every room is genuinely busy', () => {
    const rooms = [{ id: 'full', seats: [held('a', T0), held('b', T0)] }];
    assert.equal(findOpenRoom(rooms, T0), null);
  });
});

test('a room that everybody walked out of', async (t) => {
  const held = (uid, now) => ({ uid, claimedAt: now, lastSeen: now });
  const moves = [{ row: 6, col: 5 }, { row: 5, col: 5 }];

  await t.test('forgets its game, so the next arrival does not inherit it', () => {
    const gone = [held('a', T0), held('b', T0)];
    assert.equal(
      isAbandonedGame(gone, { moves, outcome: OUTCOME.CLAIMED, now: T0 + SEAT_TTL_MS + 1 }),
      true
    );
  });

  await t.test('but not while anybody is still in it', () => {
    const one = [held('a', T0), { uid: null, claimedAt: null, lastSeen: null }];
    assert.equal(isAbandonedGame(one, { moves, outcome: OUTCOME.CLAIMED, now: T0 }), false);
  });

  await t.test('and not for the player coming back to their own seat', () => {
    // Both tabs dropping for ten minutes is a bad connection, not an abandoned
    // game — and their uids are still in the chairs to prove it.
    const gone = [held('a', T0), held('b', T0)];
    assert.equal(
      isAbandonedGame(gone, { moves, outcome: OUTCOME.RESUMED, now: T0 + SEAT_TTL_MS + 1 }),
      false
    );
  });

  await t.test('an unplayed room has nothing to forget', () => {
    const gone = [held('a', T0), held('b', T0)];
    for (const empty of [[], undefined]) {
      assert.equal(
        isAbandonedGame(gone, { moves: empty, outcome: OUTCOME.CLAIMED, now: T0 + SEAT_TTL_MS + 1 }),
        false
      );
    }
  });

  await t.test('a room nobody has ever used reports no activity', () => {
    assert.equal(lastActivity(emptySeats()), 0);
    assert.equal(lastActivity([held('a', T0), held('b', T0 + 50)]), T0 + 50);
  });
});

/**
 * Choosing a room, once the pool has been read.
 *
 * Split out of the transport so the decision can be tested without a network,
 * because it had a real defect: it looked only at the chairs. Escher Chess
 * rooms record which board is being played, and pressing the button marked 8×8
 * would land you in whichever room had a free chair — often a five-file one.
 */
test('picking a room out of the pool', async (t) => {
  const NOW = 1_000_000;
  const seat = (uid, at = NOW) => ({ uid, claimedAt: at, lastSeen: at, lastActive: at });
  const empty = () => [{ uid: null }, { uid: null }];
  const NAMES = ['RelativityRoom', 'MobiusCheck', 'ImpossibleCastle'];
  const WIDE = 'escher-8x8';
  const NARROW = 'escher-5x10';
  const serves = (board) => (room) =>
    !room.exists || room.board === board || (room.moves ?? []).length > 0;

  await t.test('with nothing to say about boards it is findOpenRoom', () => {
    const pool = [
      { id: 'RelativityRoom', exists: true, seats: [seat('a'), seat('b')], moves: [] },
      { id: 'MobiusCheck', exists: false, seats: empty(), moves: [] },
    ];
    assert.equal(pickRoom(pool, { now: NOW, names: NAMES }), 'MobiusCheck');
  });

  // The reported bug, exactly: the only free room was a five-file one, and the
  // player had pressed the button for the eight-file board.
  await t.test('a free room on the other board is passed over', () => {
    const pool = [
      { id: 'RelativityRoom', exists: true, board: NARROW, seats: empty(), moves: [] },
      { id: 'MobiusCheck', exists: false, seats: empty(), moves: [] },
    ];
    assert.equal(pickRoom(pool, { now: NOW, names: NAMES, accept: serves(WIDE) }), 'MobiusCheck');
    // And is exactly the room to use when it is the board you came for.
    assert.equal(pickRoom(pool, { now: NOW, names: NAMES, accept: serves(NARROW) }), 'RelativityRoom');
  });

  await t.test('and so is somebody waiting on the other board', () => {
    const pool = [
      { id: 'RelativityRoom', exists: true, board: NARROW, seats: [seat('a'), { uid: null }], moves: [] },
      { id: 'MobiusCheck', exists: false, seats: empty(), moves: [] },
    ];
    assert.equal(pickRoom(pool, { now: NOW, names: NAMES, accept: serves(WIDE) }), 'MobiusCheck');
  });

  // Its stale log is cleared as the newcomer sits down, and the board can be
  // changed at that same moment.
  await t.test('but an abandoned game on the other board is fair game', () => {
    const pool = [
      { id: 'RelativityRoom', exists: true, board: NARROW, seats: empty(), moves: [{}, {}] },
    ];
    assert.equal(pickRoom(pool, { now: NOW, names: NAMES, accept: serves(WIDE) }), 'RelativityRoom');
  });

  await t.test('when nothing serves, the fallback is not a room just refused', () => {
    const pool = [
      { id: 'RelativityRoom', exists: true, board: NARROW, seats: [seat('a'), seat('b')], moves: [] },
      { id: 'MobiusCheck', exists: true, board: WIDE, seats: [seat('a'), seat('b')], moves: [] },
    ];
    // Both are full, so there is no open room — but the one handed back is at
    // least on the right board.
    assert.equal(pickRoom(pool, { now: NOW, names: NAMES, accept: serves(WIDE) }), 'MobiusCheck');
  });

  await t.test('and an empty pool falls back to the first name there is', () => {
    assert.equal(pickRoom([], { now: NOW, names: NAMES }), 'RelativityRoom');
    assert.equal(pickRoom([], { now: NOW, names: [] }), null);
  });
});
