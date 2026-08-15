/**
 * Escher Chess: what each piece does, and which piece it turns into when read
 * through the other player's labelling.
 *
 * Every move here is written **as the owner sees it**. Both players are handed
 * the same rules in their own labelling — that is what makes this a duality
 * rather than an asymmetry — so one table serves both, and the lens is applied
 * later, when a move set is put into canonical terms or drawn on a board.
 *
 * Steps are `[dRank, dFile]`, rank first, matching the `[dRow, dCol]` of the
 * Soccer Hockey engine. The V1.2 bundle wrote them file-first; the tables here
 * are not interchangeable with those.
 *
 * The one hard constraint the duality imposes on this file:
 *
 *   A move may be blockable only if its file step is zero.
 *
 * The lens preserves displacements but not the squares in between — two files
 * apart for you is six files apart for your opponent, and "the square between"
 * is not the same square. Ranks are never relabelled, so a move straight up a
 * file passes over squares both players agree about, and may be blocked. Escher
 * Chess takes the simplifying option and makes everything jumpy, but the
 * constraint is checked rather than assumed, because a future dial could
 * violate it silently.
 */

import { mod, signedRep } from '../core/duality.js?v=4.3.1';

export const PIECE = Object.freeze({
  PAWN: 'pawn',
  KNIGHT: 'knight',
  BISHOP: 'bishop',
  ROOK: 'rook',
  QUEEN: 'queen',
  KING: 'king',
});

/**
 * @typedef {object} Move
 * @property {[number, number]} step   [dRank, dFile], as the owner sees it
 * @property {boolean} jumpy           may pass over occupied squares
 * @property {boolean} requiresCapture only legal onto an enemy piece (pawn takes)
 * @property {boolean} forbidsCapture  only legal onto an empty square (pawn push)
 * @property {boolean} initialOnly     only from the piece's starting square
 */

function move(step, extra = {}) {
  return Object.freeze({
    step: Object.freeze([step[0], step[1]]),
    jumpy: true,
    requiresCapture: false,
    forbidsCapture: false,
    initialOnly: false,
    ...extra,
  });
}

/** Both signs of both components, minus the ones that go nowhere. */
function spread(pairs) {
  const out = [];
  for (const [r, f] of pairs) {
    for (const dr of new Set([r, -r])) {
      for (const df of new Set([f, -f])) {
        if (dr === 0 && df === 0) continue;
        out.push([dr, df]);
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------- the pieces ---- */

/**
 * Straight lines, `range` squares in each of the four directions.
 *
 * The sideways range is the one dial the duality actually constrains: it has to
 * be a union of orbits of multiplication by the duality number, or the rook is
 * not the same piece to both players. On five files that means 2 or more (and 2
 * is already every file); on eight it means 3 or more. Four is the published
 * choice — every file reachable on both boards.
 *
 * The forward range is unconstrained, since ranks are never relabelled. It is
 * set equal to the sideways range so that one sentence describes the piece.
 */
export function rookMoves({ range, jumpyForward = true }) {
  const out = [];
  for (let n = 1; n <= range; n++) {
    out.push(move([0, n]), move([0, -n]));
    out.push(move([n, 0], { jumpy: jumpyForward }), move([-n, 0], { jumpy: jumpyForward }));
  }
  return out;
}

export function bishopMoves({ range }) {
  const out = [];
  for (let n = 1; n <= range; n++) for (const s of spread([[n, n]])) out.push(move(s));
  return out;
}

/**
 * `widen` pushes both arms one file further out.
 *
 * On five files a standard knight already lands on the bishop's squares when
 * read through the lens, and no widening is wanted. On eight it does not, and
 * widening by one restores the swap: {(±1,±3),(±2,±2)} reads as the two-step
 * bishop. There is a test that pins both, and that no other widening works.
 */
export function knightMoves({ widen = 0 } = {}) {
  return spread([
    [2, 1 + widen],
    [1, 2 + widen],
  ]).map((s) => move(s));
}

export function kingMoves() {
  return spread([[1, 0], [0, 1], [1, 1]]).map((s) => move(s));
}

export function queenMoves({ rookRange, bishopRange, jumpyForward = true }) {
  return [...rookMoves({ range: rookRange, jumpyForward }), ...bishopMoves({ range: bishopRange })];
}

/**
 * Pawns are the piece that gives the game away.
 *
 * The push has no file step, so it is self-dual: both players agree that pawns
 * advance up their own file, and nothing looks wrong for the first few moves.
 * The captures are not dual to anything, which is why the enemy's pawn
 * structure looks like nonsense until you meet it — and then explains itself.
 */
export function pawnMoves({ doubleStep = true, jumpyForward = true } = {}) {
  const out = [
    // One square: nothing to jump over, and `forbidsCapture` is what stops a
    // pawn taking straight ahead.
    move([1, 0], { forbidsCapture: true }),
    move([1, 1], { requiresCapture: true }),
    move([1, -1], { requiresCapture: true }),
  ];
  /*
   * The opening double step is the one place "all movement is jumpy" has teeth
   * for a pawn: jumpy, it can leap a piece standing directly in front of it.
   * Ordinary chess says it cannot. Both are dual-safe, since the step has no
   * file component; this follows the rook's setting so that one word in the
   * dials governs every forward move in the game.
   */
  if (doubleStep) {
    out.push(move([2, 0], { forbidsCapture: true, initialOnly: true, jumpy: jumpyForward }));
  }
  return out;
}

/* ------------------------------------------------------------- a rule set ---- */

/**
 * Assemble one game's pieces from its dials, and check the blocking constraint
 * on the way out. A rule set is frozen: the sandbox will hand round copies with
 * different dials rather than mutating this one.
 */
export function makePieces({
  rookRange,
  bishopRange = 2,
  knightWiden = 0,
  jumpyForward = true,
  queen = false,
  doubleStep = true,
}) {
  const pieces = {
    [PIECE.PAWN]: pawnMoves({ doubleStep, jumpyForward }),
    [PIECE.KNIGHT]: knightMoves({ widen: knightWiden }),
    [PIECE.BISHOP]: bishopMoves({ range: bishopRange }),
    [PIECE.ROOK]: rookMoves({ range: rookRange, jumpyForward }),
    [PIECE.KING]: kingMoves(),
  };
  if (queen) pieces[PIECE.QUEEN] = queenMoves({ rookRange, bishopRange, jumpyForward });

  assertDualBlocking(pieces);

  return Object.freeze(
    Object.fromEntries(Object.entries(pieces).map(([k, v]) => [k, Object.freeze(v)]))
  );
}

/**
 * The one thing a set of Escher Chess pieces can get wrong on its own.
 *
 * Exported rather than inlined so that a hand-edited move set — from a sandbox,
 * or from the other player's browser — can be put through the same check as the
 * published ones before anybody tries to play with it.
 */
export function assertDualBlocking(pieces) {
  for (const [name, moves] of Object.entries(pieces)) {
    for (const m of moves) {
      if (m.step[1] !== 0 && !m.jumpy) {
        throw new RangeError(
          `${name} has a blockable move with a sideways step (${m.step}); the two ` +
            'players would disagree about which squares it passes over'
        );
      }
    }
  }
  return pieces;
}

/* --------------------------------------------------------- the duality ---- */

/**
 * The squares a move set reaches, as keys, with file steps reduced mod the
 * width. Two labels for one square — `+4` and `-4` on eight files — must not
 * count as two different moves, which is what makes this the right comparison.
 */
export function destinations(moves, width) {
  return new Set(moves.map(({ step }) => `${step[0]},${mod(step[1], width)}`));
}

/** The same moves as the *other* player reads them. */
export function throughLens(moves, { width, duality }) {
  return moves.map((m) =>
    Object.freeze({ ...m, step: Object.freeze([m.step[0], signedRep(m.step[1] * duality, width)]) })
  );
}

function sameSquares(a, b, width) {
  const x = destinations(a, width);
  const y = destinations(b, width);
  return x.size === y.size && [...x].every((k) => y.has(k));
}

/**
 * What each piece turns into when read through the other player's labelling.
 *
 * The whole design of the game is in this table. A piece that comes back as
 * itself looks normal to both players; a pair that swaps is the trick; a piece
 * that maps to nothing recognisable is a shock waiting to happen, which is
 * fine, so long as it is the shock you intended.
 *
 * @returns {Record<string, {selfDual: boolean, dualTo: string|null}>}
 */
export function dualityReport(pieces, { width, duality }) {
  const names = Object.keys(pieces);
  const out = {};
  for (const name of names) {
    const image = throughLens(pieces[name], { width, duality });
    const match = names.find((other) => sameSquares(image, pieces[other], width)) ?? null;
    out[name] = { selfDual: match === name, dualTo: match };
  }
  return Object.freeze(out);
}

/** One line per piece, for a rules page or a sandbox panel. */
export function describeDuality(report) {
  return Object.entries(report).map(([name, { selfDual, dualTo }]) => {
    if (selfDual) return `${name}: unchanged — both players see the same piece`;
    if (dualTo) return `${name}: your opponent's ${name} moves like your ${dualTo}`;
    return `${name}: not like any piece either of you has`;
  });
}

/* ------------------------------------------------------- what is published ---- */

/**
 * The settled dials. The rook is four in both games and jumpy in every
 * direction, so "all movement is jumpy, and long pieces reach four" covers the
 * whole rule set — which matters more here than in most games, because every
 * clause you add to your own rules is a clause your opponent has to infer.
 */
export const ESCHER_DIALS = Object.freeze({
  narrow: Object.freeze({ rookRange: 4, bishopRange: 2, knightWiden: 0, queen: false }),
  wide: Object.freeze({ rookRange: 4, bishopRange: 2, knightWiden: 1, queen: true }),
});

export const NARROW_PIECES = makePieces(ESCHER_DIALS.narrow);
export const WIDE_PIECES = makePieces(ESCHER_DIALS.wide);
