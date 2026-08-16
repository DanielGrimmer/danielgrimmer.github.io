/**
 * The sandbox: the published game with its lid off.
 *
 * Everything the two players were not allowed to change during the real game —
 * the board size, the duality number, and which relative moves are legal at all
 * — becomes an editable, shared configuration. The reveal shows that one game
 * has two faces; this is where you get to ask which parts of that were
 * essential and which were the particular numbers I happened to choose.
 *
 * Pure, like the rest of core/. Nothing here draws or transmits anything; it
 * turns a plain, possibly nonsense specification into a valid one, says what it
 * had to change, and hands back a config the engine already knows how to run.
 *
 * The invariant that matters: `normaliseSpec` never throws and never returns
 * something `makeConfig` will reject. Two people are editing this document at
 * once over a network, so a value that briefly makes no sense is normal, and
 * must not take the page down for both of them.
 */

import { mod, areCoprime, validMultipliers } from './duality.js?v=4.22.0';
import { dualMoveSet } from './rules.js?v=4.22.0';
import { makeConfig } from './game.js?v=4.22.0';

/**
 * Wider and taller than this and two boards no longer fit side by side at a
 * size anybody can read. The caps are the same order as v3.1's, which allowed
 * 20 by 22.
 */
export const LIMITS = Object.freeze({
  minWidth: 3,
  maxWidth: 19,
  minHeight: 3,
  maxHeight: 21,
  /** The palette cannot hold more than this, so nor can a legitimate move set. */
  maxOffsets: 200,
});

/** Where the sandbox starts: the published game, so it is recognisable. */
export const DEFAULT_SPEC = Object.freeze({ width: 11, height: 13, duality: 4 });

/*
 * The palette is the grid of relative moves — v3.1 called them move marks. It
 * is `min(9, height)` rows by `width` columns, centred on the ball, and it is
 * also the clip that `dualMoveSet` applies. Both must agree: an offset the
 * palette cannot draw is one the engine will silently drop, and a checkbox that
 * unticks itself is worse than no checkbox.
 */
export function paletteGeometry({ width, height }) {
  const rows = Math.min(9, height);
  return Object.freeze({
    rows,
    cols: width,
    centreRow: Math.floor(rows / 2),
    centreCol: Math.floor(width / 2),
  });
}

/** Palette cell -> the displacement it stands for, in that palette's own terms. */
export function offsetAtCell(geometry, { row, col }) {
  return [row - geometry.centreRow, col - geometry.centreCol];
}

/**
 * Displacement -> its palette cell, or null when the palette cannot show it.
 *
 * The three candidates for the column are the same column: the board is a
 * cylinder, so a displacement of dc and one of dc ± width land on the same
 * square. On an odd width only one of them is ever in range and the loop is
 * decoration; on an even width the two halves of the palette meet, and without
 * this a move would be drawable on one board and invisible on the other.
 */
export function cellForOffset(geometry, [dr, dc]) {
  const row = geometry.centreRow + dr;
  if (row < 0 || row >= geometry.rows) return null;
  for (const candidate of [dc, dc - geometry.cols, dc + geometry.cols]) {
    const col = geometry.centreCol + candidate;
    if (col >= 0 && col < geometry.cols) return { row, col };
  }
  return null;
}

/** Is this displacement one the palette can hold at all? */
export function withinPalette(geometry, offset) {
  return cellForOffset(geometry, offset) !== null;
}

function offsetKey([dr, dc]) {
  return `${dr},${dc}`;
}

/** Add the offset if absent, drop it if present. Standing still is not a move. */
export function toggleOffset(moveSet, offset) {
  if (offset[0] === 0 && offset[1] === 0) return moveSet;
  const key = offsetKey(offset);
  const without = moveSet.filter((o) => offsetKey(o) !== key);
  return without.length === moveSet.length ? [...moveSet, [...offset]] : without;
}

/**
 * The move set the published game would derive for these numbers.
 *
 * Balanced between the seats by construction. The canonical set contains ±1 and
 * ±a⁻¹, so the soccer player sees {1, a⁻¹} and the hockey player sees {a, 1}:
 * each gets their own single step across, plus whatever the *other* player's
 * single step looks like from where they are standing. Neither is the one with
 * the tidy pattern.
 */
export function derivedMoveSet({ width, height, duality }) {
  return dualMoveSet({ width, height, duality }).map((o) => [...o]);
}

/**
 * Turn one of the dials.
 *
 * A hand-edited move set is kept when only the height changes, because the
 * height does not touch the lens. Changing the width or the duality number
 * re-derives it, and that is the point rather than a convenience: the move set
 * is stored in canonical columns, which are the soccer player's, so carrying it
 * across a change of lens silently preserves the soccer player's star and hands
 * the hockey player whatever falls out. Re-deriving gives both of them the
 * balanced pattern again.
 */
export function changeDials(previous, { width, height, duality }) {
  const lensMoved = Number(width) !== previous.width || Number(duality) !== previous.duality;
  return normaliseSpec({
    width,
    height,
    duality,
    moveSet: lensMoved ? null : previous.moveSet,
  });
}

/**
 * Take whatever arrived — from an input box, from the other player's browser,
 * from a document written by an older version of this page — and return
 * something the engine will accept, plus a note for anything that had to be
 * changed under the player's hands.
 */
export function normaliseSpec(spec = {}) {
  const width = clampInt(spec.width, LIMITS.minWidth, LIMITS.maxWidth, DEFAULT_SPEC.width);
  const height = clampInt(spec.height, LIMITS.minHeight, LIMITS.maxHeight, DEFAULT_SPEC.height);

  const sizeNotes = [];
  if (width !== spec.width && Number.isFinite(spec.width)) {
    sizeNotes.push(`Width has to be between ${LIMITS.minWidth} and ${LIMITS.maxWidth}.`);
  }
  if (height !== spec.height && Number.isFinite(spec.height)) {
    sizeNotes.push(`Height has to be between ${LIMITS.minHeight} and ${LIMITS.maxHeight}.`);
  }

  /*
   * The duality number lives in 1..width-1, and is clamped there rather than
   * reduced modulo the width. Reducing is arithmetically the same and worse to
   * use: typing 12 on a board 11 wide would silently become 1, which is the one
   * value that makes the whole thing collapse. A spinner that stops at the ends
   * of the range is what somebody turning a dial expects.
   */
  const valid = validMultipliers(width);
  let duality = clampInt(spec.duality, 1, width - 1, 1);
  let dualityNote = null;

  // It also has to be invertible mod the width, or it is not a relabelling of
  // the columns at all — two of them would collide.
  if (!areCoprime(duality, width)) {
    dualityNote =
      `The duality number (here ${duality}) cannot share any prime factors with ` +
      `the board width (here ${width}). On a board ${width} wide the duality ` +
      `number must be one of: ${valid.join(', ')}.`;
    // The nearest legal value rather than 1: falling back to 1 would answer a
    // complaint about the number by quietly making the two boards identical.
    duality = nearestMultiplier(duality, width);
  }

  const geometry = paletteGeometry({ width, height });
  let moveSet = Array.isArray(spec.moveSet) ? spec.moveSet.map(readOffset).filter(Boolean) : null;
  let movesNote = null;

  if (moveSet === null) {
    moveSet = derivedMoveSet({ width, height, duality });
  } else {
    const kept = dedupe(moveSet.filter((o) => withinPalette(geometry, o)));
    if (kept.length !== moveSet.length) {
      movesNote = 'Some moves fell outside the new board and were dropped.';
    }
    moveSet = kept.slice(0, LIMITS.maxOffsets);
  }

  // Ordered by how much the reader needs to hear it, because only the first is
  // ever shown. Two notes at once read as two faults.
  const notes = [dualityNote, movesNote, ...sizeNotes].filter(Boolean);
  return { spec: Object.freeze({ width, height, duality, moveSet }), notes, validMultipliers: valid };
}

/**
 * The legal duality number closest to the one asked for.
 *
 * Ties are broken away from 1 and width − 1, because those are the two that
 * give a board with nothing to see. Substituting a value nobody asked for is
 * already a liberty; substituting a boring one would be a worse one.
 */
export function nearestMultiplier(want, width) {
  const trivial = (d) => d === 1 || d === width - 1;
  return [...validMultipliers(width)].sort(
    (a, b) =>
      Math.abs(a - want) - Math.abs(b - want) ||
      Number(trivial(a)) - Number(trivial(b)) ||
      a - b
  )[0];
}

/** Build a runnable config. Only ever called with a spec `normaliseSpec` returned. */
export function configFromSpec(spec) {
  return makeConfig({
    id: 'sandbox',
    label: 'Sandbox',
    width: spec.width,
    height: spec.height,
    duality: spec.duality,
    moveSet: spec.moveSet,
    seats: [
      { name: 'Player 1', theme: 'soccer', sport: 'Soccer', surface: 'Soccer Field', goalCorner: 'top right' },
      { name: 'Player 2', theme: 'hockey', sport: 'Hockey', surface: 'Hockey Rink', goalCorner: 'bottom left' },
    ],
  });
}

/**
 * The two ways of choosing a duality number that give nothing away.
 *
 * 1 leaves both lenses the identity — the sandbox's version of the tutorial.
 * width − 1 is ≡ −1, so it negates every column displacement: the second board
 * is the first one reflected, which looks like a difference and is not one.
 * Both are worth saying out loud rather than leaving somebody wondering why the
 * boards have stopped being interesting.
 */
export const TRIVIAL = Object.freeze({ IDENTITY: 'identity', MIRROR: 'mirror' });

export function trivialityOf({ width, duality }) {
  const d = mod(duality, width);
  if (d === 1) return TRIVIAL.IDENTITY;
  if (d === width - 1) return TRIVIAL.MIRROR;
  return null;
}

/**
 * The single line of feedback under the dials.
 *
 * One line, never two. A correction always wins: being told that the number was
 * refused *and* that the boards are now identical reads as two separate faults,
 * when the second is only a consequence of the first. Where nothing had to be
 * corrected, the line describes what the current numbers actually give you.
 */
export function describeSpec(spec, notes = []) {
  if (notes.length) return notes[0];
  switch (trivialityOf(spec)) {
    case TRIVIAL.IDENTITY:
      return 'Duality number 1 makes the two boards identical (up to a palette swap).';
    case TRIVIAL.MIRROR:
      return (
        'When the duality number is one less than the width (as it is now) the ' +
        'two boards are mirror images of each other.'
      );
    default:
      return '';
  }
}

/* --------------------------------------------------------- serialisation ---- */

/*
 * Firestore has no nested arrays, so `[[1, 3], [0, 1]]` cannot be stored as it
 * stands. A list of maps can be, and survives a round trip unchanged.
 */

export function encodeSpec(spec) {
  return {
    width: spec.width,
    height: spec.height,
    duality: spec.duality,
    moveSet: spec.moveSet.map(([dr, dc]) => ({ dr, dc })),
  };
}

export function decodeSpec(raw) {
  if (!raw || typeof raw !== 'object') return normaliseSpec(DEFAULT_SPEC).spec;
  return normaliseSpec({
    width: raw.width,
    height: raw.height,
    duality: raw.duality,
    moveSet: Array.isArray(raw.moveSet) ? raw.moveSet.map((o) => [o?.dr, o?.dc]) : null,
  }).spec;
}

/* ---------------------------------------------------------------- local ---- */

function clampInt(value, min, max, fallback) {
  const n = Math.trunc(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function readOffset(raw) {
  if (!Array.isArray(raw) || raw.length !== 2) return null;
  const dr = Math.trunc(Number(raw[0]));
  const dc = Math.trunc(Number(raw[1]));
  if (!Number.isFinite(dr) || !Number.isFinite(dc)) return null;
  if (dr === 0 && dc === 0) return null;
  return [dr, dc];
}

function dedupe(offsets) {
  const seen = new Set();
  const out = [];
  for (const offset of offsets) {
    const key = offsetKey(offset);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(offset);
  }
  return out;
}

/** Exported for the palette: a canonical offset as one seat perceives it. */
export function offsetThroughLens(config, seat, [dr, dc]) {
  return [dr, config.lenses[seat].viewDelta(dc)];
}

/** And back: a displacement a seat pointed at, in canonical terms. */
export function offsetFromLens(config, seat, [dr, dc]) {
  return [dr, config.lenses[seat].canonicalDelta(dc)];
}
