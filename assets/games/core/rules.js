/**
 * Board geometry and move generation, in canonical coordinates.
 *
 * There is exactly one legal-move function here. The v3.1 bundle had two — one
 * in the demo, one in the game — and they disagreed: the game's forgot to
 * exclude the walled-off goal-row squares, so a player whose only moves were
 * into blocked cells was never declared stalemated and the game hung.
 */

import { mod, modInverse, signedRep, areCoprime, validMultipliers } from './duality.js?v=4.4.0';

/** @typedef {{row:number, col:number}} Square */
/** @typedef {[number, number]} Offset  a [rowStep, colStep] pair */

export function makeBoard({ width, height }) {
  if (!Number.isInteger(width) || width < 3) {
    throw new RangeError(`width must be an integer >= 3, got ${width}`);
  }
  if (!Number.isInteger(height) || height < 3) {
    throw new RangeError(`height must be an integer >= 3, got ${height}`);
  }
  const goalCol = Math.floor(width / 2);
  return Object.freeze({
    width,
    height,
    goalCol,
    /** The single opening at each end; the rest of those rows is wall. */
    goalRows: Object.freeze({ top: 0, bottom: height - 1 }),
    start: Object.freeze({ row: Math.floor(height / 2), col: goalCol }),
  });
}

/** Is this square part of the field at all? Goal rows are wall except at goalCol. */
export function isPlayable(board, row, col) {
  if (row < 0 || row >= board.height) return false;
  const isGoalRow = row === board.goalRows.top || row === board.goalRows.bottom;
  return !isGoalRow || mod(col, board.width) === board.goalCol;
}

export function squareKey(row, col) {
  return `${row},${col}`;
}

/**
 * The move set of the published game, derived from the duality number.
 *
 * Sideways steps are {0, +/-1, +/-a^-1} in canonical columns, which the dual
 * seat reads as {0, +/-a, +/-1}: for width 11 and a = 4 that is "one or three
 * across" against "one or four across". The longer passes follow the same
 * pattern, +/-(a^-1 - 1) against +/-(a - 1).
 *
 * Reproduced from v3.1's `initializeMoveMarks`, including its two quirks:
 * offsets are clipped to the 9-row move palette the old UI drew, and there is a
 * hand-tuned special case for width 5.
 */
export function dualMoveSet({ width, height, duality }) {
  if (!areCoprime(duality, width)) {
    throw new RangeError(
      `duality number ${duality} must be coprime with width ${width}; ` +
        `valid: ${validMultipliers(width).join(', ')}`
    );
  }
  const a = mod(duality, width);
  const d = signedRep(modInverse(a, width), width);

  let offsets = [
    [1, -d],
    [1, -1],
    [1, 0],
    [1, 1],
    [1, d],
    [0, -d],
    [0, -1],
    [0, 1],
    [0, d],
    [-1, -d],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [-1, d],
  ];

  if (0 < a && a < width / 2 && 0 < d && d < width / 2 && a !== 1) {
    offsets.push([2, -d + 1], [3, 0], [2, d - 1], [-2, -d + 1], [-3, 0], [-2, d - 1]);
  }

  if ((a === 2 || a === 3) && width === 5) {
    offsets = [
      [-2, 2],
      [2, 2],
      [-1, 1],
      [1, 1],
      [-1, -1],
      [1, -1],
      [-2, -2],
      [2, -2],
    ];
  }

  return clipToMovePalette(offsets, { width, height });
}

/**
 * v3.1 laid its move set out on a palette grid of `min(9, height)` rows and
 * `width` columns centred on the board centre, and silently dropped anything
 * that fell outside. That clipping is a UI artefact rather than a rule, but it
 * is load-bearing for narrow boards, so it is preserved here rather than
 * quietly changing how the sandbox behaves.
 */
function clipToMovePalette(offsets, { width, height }) {
  const paletteHeight = Math.min(9, height);
  const centreRow = Math.floor(paletteHeight / 2);
  const centreCol = Math.floor(width / 2);
  const kept = offsets.filter(([dr, dc]) => {
    const r = centreRow + dr;
    const c = centreCol + dc;
    return r >= 0 && r < paletteHeight && c >= 0 && c < width;
  });
  return Object.freeze(dedupeOffsets(kept));
}

function dedupeOffsets(offsets) {
  const seen = new Set();
  const out = [];
  for (const [dr, dc] of offsets) {
    if (dr === 0 && dc === 0) continue;
    const k = `${dr},${dc}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(Object.freeze([dr, dc]));
  }
  return out;
}

/**
 * Every square the move set points at from (row, col) that is part of the field
 * — on the board and not wall — whether or not it has already been used.
 *
 * This is the star the tutorial asks the player to memorise. It is the same
 * shape wherever the ball stands, which is the fact the duality rests on, so it
 * is worth being able to draw it whole even where the trail has eaten into it.
 */
export function moveTargets(board, offsets, { row, col }) {
  const out = [];
  const seen = new Set();
  for (const [dr, dc] of offsets) {
    const newRow = row + dr;
    const newCol = mod(col + dc, board.width);
    if (!isPlayable(board, newRow, newCol)) continue;
    const key = squareKey(newRow, newCol);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ row: newRow, col: newCol });
  }
  return out;
}

function burnedSet(visited) {
  return visited instanceof Set ? visited : new Set(visited.map((s) => squareKey(s.row, s.col)));
}

/**
 * Every square reachable in one move from (row, col), given the squares already
 * burned. Excludes moves off the top and bottom edges, into the wall beside a
 * goal, and onto any previously visited square.
 */
export function legalMoves(board, offsets, { row, col, visited = [] }) {
  const burned = burnedSet(visited);
  return moveTargets(board, offsets, { row, col }).filter(
    (sq) => !burned.has(squareKey(sq.row, sq.col))
  );
}

/** The arms of the star that the trail has already closed off. */
export function blockedMoves(board, offsets, { row, col, visited = [] }) {
  const burned = burnedSet(visited);
  return moveTargets(board, offsets, { row, col }).filter((sq) =>
    burned.has(squareKey(sq.row, sq.col))
  );
}

/**
 * The squares from which a goal can be reached next move — the bullet points
 * the board marks.
 *
 * Walked backwards, out of each goal mouth along the *negated* offsets. For the
 * published move set, which is symmetric under negation, that is the same list
 * as walking forwards; for a hand-edited one it is not, and walking forwards
 * would mark squares the ball could never actually score from.
 */
export function goalApproaches(board, offsets, visited = []) {
  const reversed = offsets.map(([dr, dc]) => [-dr, -dc]);
  const out = new Map();
  for (const goalRow of [board.goalRows.top, board.goalRows.bottom]) {
    for (const sq of legalMoves(board, reversed, { row: goalRow, col: board.goalCol, visited })) {
      out.set(squareKey(sq.row, sq.col), sq);
    }
  }
  return [...out.values()];
}

/** Which seat, if any, scores by landing here. Seat 0 defends downward, seat 1 upward. */
export function scoringSeat(board, row) {
  if (row === board.goalRows.top) return 0;
  if (row === board.goalRows.bottom) return 1;
  return null;
}
