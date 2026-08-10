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
  claimAllSeats,
  touchSeat,
  releaseSeat,
  occupancy,
  findOpenRoom,
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

test('one laptop, two players', async (t) => {
  await t.test('hot seat takes both places for a single browser', () => {
    const seats = claimAllSeats(emptySeats(), { uid: 'laptop', now: T0 });
    assert.equal(seatOf(seats, 'laptop'), 0);
    assert.ok(seats.every((s) => s.uid === 'laptop'));
    assert.equal(occupancy(seats, T0).status, 'full');
  });

  await t.test('and may move on either side, so the swap button works', () => {
    const seats = claimAllSeats(emptySeats(), { uid: 'laptop', now: T0 });
    assert.ok(mayMove(seats, { uid: 'laptop', turn: 0, now: T0 }));
    assert.ok(mayMove(seats, { uid: 'laptop', turn: 1, now: T0 }));
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
