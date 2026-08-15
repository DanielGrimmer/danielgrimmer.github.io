/**
 * The two published Escher Chess boards.
 *
 * ## What the two players share, and what they do not
 *
 * They share the *names* of the files and the numbers of the ranks. That is the
 * communication channel: White says "the pawn on D3 to D5" and Black finds the
 * pawn on their own D file. What they do not share is which file is next to
 * which. White's board reads ARMED left to right, Black's reads DREAM, so
 * "one file across" is a step in a different order for each of them — and that,
 * rather than anything about the names, is the whole duality.
 *
 * Matching the names up gives Black's file position b as White's `2b + 4 (mod
 * 5)`. Black also sits opposite, so their board is turned around: files mirror
 * and ranks run 13 down to 1 away from them. Composing the mirror with the
 * relabelling gives `3b + 2`, which is the map the rule booklets' figures show
 * — White's board with Black's men on it.
 *
 * Here the two are kept apart. `lens` carries the composite, because that is
 * what a renderer needs to place a piece; `flipsRanks` carries the half of the
 * rotation that lenses cannot express. Ranks are never relabelled, only drawn
 * from the other end, which is why every constraint the duality imposes falls
 * on files alone.
 *
 * ## Canonical
 *
 * Canonical files are White's ordering and canonical rank 0 is White's back
 * rank. That is bookkeeping rather than a claim: the engine reads both seats
 * through their lenses and never asks which one is the identity.
 */

import { Lens, dualityBetween } from '../core/duality.js?v=4.2.3';
import { PIECE, makePieces, ESCHER_DIALS, dualityReport } from './pieces.js?v=4.2.3';

const { PAWN: P, KNIGHT: N, BISHOP: B, ROOK: R, QUEEN: Q, KING: K } = PIECE;

export const SIDE = Object.freeze({ WHITE: 0, BLACK: 1 });

/**
 * A side's own rows, nearest first, written in that side's own file order.
 * Both sides get the same list — one army, described once — and each is placed
 * through its own lens.
 */
const NARROW_ARMY = Object.freeze([
  [R, B, K, B, R],
  [P, N, P, N, P],
  [null, P, null, P, null],
]);

const WIDE_ARMY = Object.freeze([
  [R, N, B, Q, K, B, N, R],
  [P, P, P, P, P, P, P, P],
]);

/**
 * @param {object} spec
 * @param {number} spec.width
 * @param {number} spec.height
 * @param {number} spec.multiplier  of Black's lens: canonical file -> Black's
 * @param {number} spec.offset      of Black's lens
 * @param {string[][]} spec.army    a side's rows, nearest first, in its own order
 */
function makeBoard({ id, label, width, height, multiplier, offset, army, dials, files }) {
  const lenses = Object.freeze([
    // White's ordering is the canonical one, so White's lens does nothing.
    new Lens({ width, multiplier: 1, offset: 0 }),
    new Lens({ width, multiplier, offset }),
  ]);

  const pieces = makePieces(dials);

  /*
   * Where a side's men stand, in canonical terms. A row given as "nearest
   * first" is that side's own rank 0, 1, 2 …, which for Black counts down from
   * the far end — the same reversal their board draws.
   */
  const placement = [];
  for (const side of [SIDE.WHITE, SIDE.BLACK]) {
    const lens = lenses[side];
    army.forEach((row, ownRank) => {
      row.forEach((type, ownFile) => {
        if (!type) return;
        placement.push(
          Object.freeze({
            type,
            side,
            rank: side === SIDE.WHITE ? ownRank : height - 1 - ownRank,
            file: lens.toCanonical(ownFile),
          })
        );
      });
    });
  }

  return Object.freeze({
    id,
    label,
    width,
    height,
    lenses,
    /** Black sits opposite: their board draws rank 0 at the far end. */
    flipsRanks: Object.freeze([false, true]),
    /** Each side's file names, in that side's own left-to-right order. */
    files: Object.freeze(files.map((f) => Object.freeze([...f]))),
    pieces,
    placement: Object.freeze(placement),
    /** The rank a side's pawns start on, in canonical terms; for `initialOnly`. */
    pawnRanks: Object.freeze([1, height - 2]),
    /** Reaching the far end promotes. No queen to promote to on the narrow board. */
    promotesTo: Object.freeze(dials.queen ? [Q, R, B, N] : [R, B, N]),
    /*
     * How one player reads the other's file steps — three on both published
     * boards, and read off the lenses rather than written down, so that a
     * sandbox turning the dials cannot leave this saying something false.
     */
    duality: dualityReport(pieces, {
      width,
      duality: dualityBetween(lenses[SIDE.BLACK], lenses[SIDE.WHITE]),
    }),
  });
}

/**
 * Five files, ten ranks. The simpler game, and the one to learn on: the knight
 * and bishop swap without the knight needing to be widened, and there is no
 * queen to complicate the order in which the lessons arrive.
 *
 * Thirteen ranks was the published height and playtested long — several moves
 * before either side could touch the other.
 */
export const NARROW = makeBoard({
  id: 'escher-5x10',
  label: 'Escher Chess (5×10)',
  width: 5,
  height: 10,
  // Black's lens: canonical -> Black's own file order. The inverse of the
  // `3b + 2` that the booklet figures show.
  multiplier: 2,
  offset: 1,
  army: NARROW_ARMY,
  dials: ESCHER_DIALS.narrow,
  files: [
    ['A', 'R', 'M', 'E', 'D'],
    ['D', 'R', 'E', 'A', 'M'],
  ],
});

/** Eight by eight, standard armies, and a queen. Here the knight wants widening. */
export const WIDE = makeBoard({
  id: 'escher-8x8',
  label: 'Escher Chess (8×8)',
  width: 8,
  height: 8,
  multiplier: 3,
  offset: 3,
  army: WIDE_ARMY,
  dials: ESCHER_DIALS.wide,
  files: [
    ['C', 'D', 'H', 'U', 'E', 'A', 'S', 'L'],
    ['C', 'D', 'H', 'U', 'E', 'A', 'S', 'L'],
  ],
});

/**
 * The tutorial: the same game with the duality switched off, so both boards
 * agree and nothing is strange. Whatever a player learns here about their own
 * pieces is true of their opponent's too — which is exactly what stops being
 * true next door.
 */
export const TUTORIAL = makeBoard({
  id: 'escher-tutorial',
  label: 'Escher Chess (tutorial)',
  width: 5,
  height: 10,
  multiplier: 1,
  offset: 0,
  army: NARROW_ARMY,
  dials: ESCHER_DIALS.narrow,
  files: [
    ['A', 'R', 'M', 'E', 'D'],
    ['A', 'R', 'M', 'E', 'D'],
  ],
});

export const BOARDS = Object.freeze({ [NARROW.id]: NARROW, [WIDE.id]: WIDE, [TUTORIAL.id]: TUTORIAL });
