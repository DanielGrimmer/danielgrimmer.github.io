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

/** How recently a seat must have interacted to count as "thinking". */
export const ACTIVE_MS = 45 * 1000;

export const PRESENCE = Object.freeze({
  EMPTY: 'empty',
  ACTIVE: 'active',
  IDLE: 'idle',
  GONE: 'gone',
});

function frozenSeat(seat) {
  return Object.freeze({
    uid: seat?.uid ?? null,
    claimedAt: seat?.claimedAt ?? null,
    /** Last heartbeat: the tab is open and connected. */
    lastSeen: seat?.lastSeen ?? null,
    /** Last interaction: a mouse move, key or tap. Someone is actually there. */
    lastActive: seat?.lastActive ?? null,
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

/**
 * Report in. A no-op for anyone not holding a seat.
 *
 * `active` marks a beat that followed real interaction — a mouse move, a key,
 * a tap — as opposed to a tab merely being open. That is the difference between
 * an opponent who is thinking and one who has wandered off, which matters when
 * you cannot see them and silence is otherwise indistinguishable from a fault.
 */
export function touchSeat(seats, { uid, now, active = false }) {
  assertUid(uid);
  assertNow(now);
  const current = normaliseSeats(seats);
  const mine = seatOf(current, uid);
  if (mine === null) return current;
  return writeSeat(current, mine, {
    ...current[mine],
    lastSeen: now,
    lastActive: active ? now : current[mine].lastActive,
  });
}

/**
 * What to say about the other chair.
 *
 * `gone` means the tab stopped reporting in; `idle` means it is there but
 * nobody has touched it lately; `active` means somebody is at the controls.
 */
export function presenceOf(seat, now, { ttl = SEAT_TTL_MS, activeWithin = ACTIVE_MS } = {}) {
  assertNow(now);
  if (!seat || seat.uid == null) return PRESENCE.EMPTY;
  if (!isHeld(seat, now, ttl)) return PRESENCE.GONE;
  if (seat.lastActive != null && now - seat.lastActive <= activeWithin) return PRESENCE.ACTIVE;
  return PRESENCE.IDLE;
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

/** When this room last had a tab reporting in. Zero if it never has. */
export function lastActivity(seats) {
  return normaliseSeats(seats).reduce((latest, s) => Math.max(latest, s.lastSeen ?? 0), 0);
}

/**
 * Pick a room from the pool for somebody who did not arrive by invite link.
 *
 * Three tiers, and the order carries most of the design:
 *
 * 1. **Somebody waiting to start.** One live occupant and no moves played: a
 *    player who has opened the game and is waiting for their friend. Joining
 *    them is what lets two people meet without swapping a link at all — the
 *    second one simply follows a minute later. A room that is *mid-game*, or
 *    sitting on a finished one, is deliberately not in this tier: whoever is
 *    there is busy, or reading their reveal, and does not want company.
 * 2. **An empty room, the one quiet longest.** Not the first in the list —
 *    always taking index 0 funnels every unaccompanied arrival into the same
 *    room, which is both where stale state accumulates and where two unrelated
 *    people are most likely to collide.
 *
 * Nothing suitable returns null, which with twenty rooms means twenty games are
 * in progress at once. The caller decides what to do about that.
 *
 * `moves` is read but never required: a pool entry without one is treated as an
 * unplayed room, which is what a room document that does not exist yet is.
 *
 * @param {{id:string, seats:any, moves?:any[]}[]} rooms
 */
export function findOpenRoom(rooms, now, ttl = SEAT_TTL_MS) {
  if (!Array.isArray(rooms) || rooms.length === 0) return null;

  const rated = rooms.map((room) => ({
    room,
    held: occupancy(room.seats, now, ttl).held,
    played: Array.isArray(room.moves) ? room.moves.length : 0,
    quiet: lastActivity(room.seats),
  }));

  // Freshest arrival first: if two people are somehow waiting, the one who sat
  // down most recently is the likelier to be the friend who just clicked.
  const waiting = rated
    .filter((r) => r.held === 1 && r.played === 0)
    .sort((a, b) => b.quiet - a.quiet);
  if (waiting.length) return waiting[0].room;

  const free = rated.filter((r) => r.held === 0).sort((a, b) => a.quiet - b.quiet);
  return free.length ? free[0].room : null;
}

/**
 * Should this room's game be thrown away as this player sits down?
 *
 * Yes when nobody was left in it and the newcomer is not the one coming back.
 * A room that everybody walked out of is holding a finished game that belongs
 * to strangers, and inheriting it drops the next arrival straight into somebody
 * else's reveal. Resuming your own seat is the exception that matters: both
 * players dropping for ten minutes and returning is a dropped connection, not
 * an abandoned game, and their uids are still in the chairs to prove it.
 */
export function isAbandonedGame(seats, { moves, outcome, now, ttl = SEAT_TTL_MS }) {
  const played = Array.isArray(moves) ? moves.length : 0;
  if (played === 0) return false;
  if (outcome === OUTCOME.RESUMED) return false;
  return occupancy(seats, now, ttl).held === 0;
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
