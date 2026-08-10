/**
 * Seat claiming: who is allowed to move, and when a seat comes free again.
 *
 * Pure functions over a seats record, with the clock passed in. Nothing here
 * reads `Date.now()` or touches the network, so every rule below is testable
 * without a browser, a server or a wait.
 *
 * This replaces the v3.1 arrangement, where a browser's seat came from the
 * parity of a *site-wide* visitor counter and was then cached in localStorage
 * forever. That had three failure modes, all fixed here: two players in the
 * same room could be handed the same seat, a returning visitor could never
 * swap sides, and anyone opening the game without first visiting the tutorial
 * got no seat at all and could never move.
 *
 * "Abandoned" means the browser stopped reporting in, not that the player
 * stopped moving: a seat is held for as long as its tab keeps beating, so
 * thinking for twenty minutes never costs anyone their seat.
 */

export const SEAT_COUNT = 2;

/** A seat is abandoned once its tab has been silent this long. */
export const SEAT_TTL_MS = 5 * 60 * 1000;

/**
 * How often a live tab should report in. Four beats may be missed before a
 * seat is considered abandoned, so a dropped packet costs nobody their place.
 *
 * The interval is a quota decision as much as a UX one. The project runs on
 * Firebase's free Spark plan, where exceeding a daily quota disables the
 * service rather than billing for it, and every beat is a write that also
 * pushes a snapshot read to each listener. A tab that is hidden should stop
 * beating entirely; see _firebase/README.md for the arithmetic.
 */
export const HEARTBEAT_MS = 60 * 1000;

export const OUTCOME = Object.freeze({
  RESUMED: 'resumed',
  CLAIMED: 'claimed',
  SPECTATOR: 'spectator',
});

function frozenSeat(seat) {
  return Object.freeze({
    uid: seat?.uid ?? null,
    claimedAt: seat?.claimedAt ?? null,
    lastSeen: seat?.lastSeen ?? null,
  });
}

export function emptySeats() {
  return Object.freeze(Array.from({ length: SEAT_COUNT }, () => frozenSeat(null)));
}

/** Tolerates a missing or short record, so a half-written room document is survivable. */
export function normaliseSeats(seats) {
  const list = Array.isArray(seats) ? seats : [];
  return Object.freeze(Array.from({ length: SEAT_COUNT }, (_, i) => frozenSeat(list[i])));
}

function assertUid(uid) {
  if (typeof uid !== 'string' || uid.length === 0) {
    throw new TypeError('a seat needs a non-empty uid');
  }
}

function assertNow(now) {
  if (!Number.isFinite(now)) throw new TypeError(`now must be a finite timestamp, got ${now}`);
}

/** Occupied by someone who has reported in recently enough. */
export function isHeld(seat, now, ttl = SEAT_TTL_MS) {
  assertNow(now);
  if (!seat || seat.uid == null) return false;
  if (seat.lastSeen == null) return false;
  return now - seat.lastSeen <= ttl;
}

/** Claimed once, but silent for longer than the TTL. Free for the taking. */
export function isStale(seat, now, ttl = SEAT_TTL_MS) {
  if (!seat || seat.uid == null) return false;
  return !isHeld(seat, now, ttl);
}

export function isVacant(seat, now, ttl = SEAT_TTL_MS) {
  return !seat || seat.uid == null || isStale(seat, now, ttl);
}

/** Which seat this uid sits in, whether or not it has gone quiet. */
export function seatOf(seats, uid) {
  if (typeof uid !== 'string' || !uid) return null;
  const index = normaliseSeats(seats).findIndex((s) => s.uid === uid);
  return index === -1 ? null : index;
}

/**
 * Claim a seat for `uid`.
 *
 * Your own seat comes back to you even if it went stale, so a refresh, a
 * dropped connection or a sleeping phone does not lose your place — only
 * someone else actively taking the seat does. Otherwise the first vacant seat
 * is taken. With both seats held by others you become a spectator, which is a
 * real outcome rather than the silent dead end v3.1 left you in.
 */
export function claimSeat(seats, { uid, now, ttl = SEAT_TTL_MS }) {
  assertUid(uid);
  assertNow(now);
  const current = normaliseSeats(seats);

  const mine = seatOf(current, uid);
  if (mine !== null) {
    return {
      seats: writeSeat(current, mine, { uid, claimedAt: current[mine].claimedAt ?? now, lastSeen: now }),
      seat: mine,
      outcome: OUTCOME.RESUMED,
    };
  }

  const free = current.findIndex((s) => isVacant(s, now, ttl));
  if (free === -1) {
    return { seats: current, seat: null, outcome: OUTCOME.SPECTATOR };
  }

  return {
    seats: writeSeat(current, free, { uid, claimedAt: now, lastSeen: now }),
    seat: free,
    outcome: OUTCOME.CLAIMED,
  };
}

/**
 * Take both seats for one browser — the tutorial on a single laptop, with a
 * button to swap which side you are playing. Only ever used locally.
 */
export function claimAllSeats(seats, { uid, now }) {
  assertUid(uid);
  assertNow(now);
  return Object.freeze(
    normaliseSeats(seats).map(() => frozenSeat({ uid, claimedAt: now, lastSeen: now }))
  );
}

/** Report in. A no-op for anyone not holding a seat. */
export function touchSeat(seats, { uid, now }) {
  assertUid(uid);
  assertNow(now);
  const current = normaliseSeats(seats);
  const mine = seatOf(current, uid);
  if (mine === null) return current;
  return writeSeat(current, mine, { ...current[mine], lastSeen: now });
}

/** Give up a seat deliberately — a "leave" button, or a tab closing. */
export function releaseSeat(seats, { uid }) {
  assertUid(uid);
  const current = normaliseSeats(seats);
  const mine = seatOf(current, uid);
  if (mine === null) return current;
  return writeSeat(current, mine, { uid: null, claimedAt: null, lastSeen: null });
}

function writeSeat(seats, index, value) {
  return Object.freeze(seats.map((seat, i) => (i === index ? frozenSeat(value) : seat)));
}

/** For a lobby: is there room here? */
export function occupancy(seats, now, ttl = SEAT_TTL_MS) {
  const current = normaliseSeats(seats);
  const held = current.filter((s) => isHeld(s, now, ttl)).length;
  return {
    held,
    vacant: SEAT_COUNT - held,
    status: held === 0 ? 'empty' : held < SEAT_COUNT ? 'joinable' : 'full',
  };
}

/**
 * Pick a room from the pre-created pool: an empty one if there is one,
 * otherwise one with a seat going spare, otherwise nothing.
 * @param {{id:string, seats:any}[]} rooms
 */
export function findOpenRoom(rooms, now, ttl = SEAT_TTL_MS) {
  const rated = rooms.map((room) => ({ room, ...occupancy(room.seats, now, ttl) }));
  return (
    rated.find((r) => r.status === 'empty')?.room ??
    rated.find((r) => r.status === 'joinable')?.room ??
    null
  );
}

/**
 * Whether this uid may move right now, given whose turn the engine says it is.
 *
 * Asks whether the uid holds *the seat on move*, rather than looking up "their"
 * seat — in hot-seat one browser holds both, and asking the second question
 * would let it play only one side.
 */
export function mayMove(seats, { uid, turn, now, ttl = SEAT_TTL_MS }) {
  if (typeof uid !== 'string' || !uid) return false;
  const seat = normaliseSeats(seats)[turn];
  if (!seat || seat.uid !== uid) return false;
  return isHeld(seat, now, ttl);
}
