/**
 * The two published Escher Chess boards.
 *
 * ## What the two players share, and what they do not
 *
 * There is no shared board. Each player has their own, and the only thing that
 * passes between them is a sentence: "the pawn on D3 to D5". So what they share
 * is the *names* of the files and the numbers of the ranks; what they do not
 * share is which file sits next to which. White's five files read ARMED left to
 * right and Black's read DREAM, so "one file across" is a step to a different
 * name for each of them — and that, rather than anything about the names, is
 * the whole duality.
 *
 * A square is therefore a name and a number, and each player's board is one
 * arrangement of those squares. Black's arrangement is White's turned around
 * and relabelled: ranks run from the far end, files come out in the other
 * order. `lens` carries the composite of the two, because that is what a
 * renderer needs to place a piece, and `flipsRanks` carries the half of the
 * turn that a lens cannot express. Ranks are never *relabelled*, only drawn
 * from the other end, which is why every constraint the duality imposes falls
 * on files alone.
 *
 * ## Two things that pin the lens down
 *
 * The lens is not free. Two facts fix it, and both are worth checking against
 * whenever it is touched:
 *
 * 1. **The names must agree.** `files[BLACK][lens.toView(f)]` has to equal
 *    `files[WHITE][f]` for every file, or the two players are talking about
 *    different squares and the game is not playable at all. There is a test.
 * 2. **The booklets' figures.** The V3 rules show each player their opponent's
 *    opening position drawn on their own board: `BBRKR` on the narrow board and
 *    `QNNKRBBR` on the wide one, as White sees them. Also tested.
 *
 * Getting these two to agree is what the file labels are chosen for. White's
 * eight files spell CHES + DUAL read alternately and Black's spell ESCH + DUAL
 * — the two lines of the game's logo — and the narrow board's are ARMED and
 * DREAM. The anagrams are not decoration: they are the record of which
 * permutation this is.
 *
 * ## Canonical
 *
 * Canonical files are White's ordering and canonical rank 0 is White's back
 * rank. That is bookkeeping rather than a claim: the engine reads both seats
 * through their lenses and never asks which one is the identity.
 */

import { Lens, dualityBetween } from '../core/duality.js?v=4.11.0';
import { PIECE, makePieces, ESCHER_DIALS, dualityReport } from './pieces.js?v=4.11.0';

const { PAWN: P, KNIGHT: N, BISHOP: B, ROOK: R, QUEEN: Q, KING: K } = PIECE;

export const SIDE = Object.freeze({ WHITE: 0, BLACK: 1 });

/**
 * An army: its rows nearest-rank-first, each row left to right **as White sees
 * it**.
 *
 * One army serves both sides, because the two are the same men facing each
 * other — which is a half turn, and a half turn reverses files as well as
 * ranks. That reversal is why ordinary chess puts White's queen to the left of
 * their king and Black's to the right of theirs, from each player's own seat,
 * and it is applied here rather than written out twice.
 */
const NARROW_ARMY = Object.freeze([
  [R, N, K, N, R],
  [P, B, P, B, P],
  [null, P, null, P, null],
]);

const WIDE_ARMY = Object.freeze([
  [R, N, B, Q, K, B, N, R],
  [P, P, P, P, P, P, P, P],
]);

/**
 * Everything about a width that is *not* free.
 *
 * The lens and the file names are locked together: change either and the two
 * players stop naming the same square the same way. Kept in one table so that
 * the three boards below are each three lines, and so that a fourth could not
 * be added with a lens that did not match its names.
 */
const FAMILIES = Object.freeze({
  5: Object.freeze({
    multiplier: 3,
    offset: 3,
    army: NARROW_ARMY,
    files: Object.freeze([
      Object.freeze(['A', 'R', 'M', 'E', 'D']),
      Object.freeze(['D', 'R', 'E', 'A', 'M']),
    ]),
  }),
  8: Object.freeze({
    multiplier: 5,
    offset: 4,
    army: WIDE_ARMY,
    files: Object.freeze([
      Object.freeze(['C', 'D', 'H', 'U', 'E', 'A', 'S', 'L']),
      Object.freeze(['E', 'D', 'S', 'U', 'C', 'A', 'H', 'L']),
    ]),
  }),
});

/**
 * A board from its width, its height and its dials.
 *
 * `lens` and `files` come from the family and are not negotiable; `mirror`
 * substitutes the plain reflection for the duality, which is what the tutorial
 * wants and what "duality off" means on a board with two players sitting
 * opposite each other.
 */
function boardFor({ id, label, width, height, dials, mirror = false }) {
  const family = FAMILIES[width];
  if (!family) throw new RangeError(`no Escher Chess board is ${width} files wide`);
  return makeBoard({
    id,
    label,
    width,
    height,
    multiplier: mirror ? width - 1 : family.multiplier,
    offset: mirror ? width - 1 : family.offset,
    army: family.army,
    dials,
    files: mirror
      ? [family.files[0], [...family.files[0]].reverse()]
      : family.files,
  });
}

/**
 * @param {object} spec
 * @param {number} spec.width
 * @param {number} spec.height
 * @param {number} spec.multiplier  of Black's lens: canonical file -> Black's
 * @param {number} spec.offset      of Black's lens
 * @param {string[][]} spec.army    rows nearest-first, as White reads them
 * @param {string[][]} spec.files   each side's names, in that side's own order
 */
function makeBoard({ id, label, width, height, multiplier, offset, army, dials, files }) {
  const lenses = Object.freeze([
    // White's ordering is the canonical one, so White's lens does nothing.
    new Lens({ width, multiplier: 1, offset: 0 }),
    new Lens({ width, multiplier, offset }),
  ]);

  const pieces = makePieces(dials);

  /*
   * Where a side's men stand, in canonical terms.
   *
   * Both halves of the half turn are here. `height - 1 - ownRank` puts Black's
   * near rank at the far end of the canonical board; `width - 1 - i` reads the
   * army row backwards, because Black's leftmost column is the one White sees
   * last. The lens then says which canonical file that column is.
   */
  const placement = [];
  for (const side of [SIDE.WHITE, SIDE.BLACK]) {
    const lens = lenses[side];
    const turned = side === SIDE.BLACK;
    army.forEach((row, ownRank) => {
      row.forEach((type, i) => {
        if (!type) return;
        const column = turned ? width - 1 - i : i;
        placement.push(
          Object.freeze({
            type,
            side,
            rank: turned ? height - 1 - ownRank : ownRank,
            file: lens.toCanonical(column),
          })
        );
      });
    });
  }

  const named = Object.freeze(files.map((f) => Object.freeze([...f])));
  assertNamesAgree(named, lenses);
  assertEveryManCanMove(placement, pieces);

  return Object.freeze({
    id,
    label,
    width,
    height,
    lenses,
    /** Black sits opposite: their board draws rank 0 at the far end. */
    flipsRanks: Object.freeze([false, true]),
    /** Each side's file names, in that side's own left-to-right order. */
    files: named,
    pieces,
    placement: Object.freeze(placement),
    /** Reaching the far end promotes. No queen to promote to on the narrow board. */
    promotesTo: Object.freeze(dials.queen ? [Q, R, B, N] : [R, B, N]),
    /*
     * How one player reads the other's file steps, read off the lenses rather
     * than written down, so that a sandbox turning the dials cannot leave this
     * saying something false.
     */
    duality: dualityReport(pieces, {
      width,
      duality: dualityBetween(lenses[SIDE.BLACK], lenses[SIDE.WHITE]),
    }),
  });
}

/**
 * Every man on the board must have a move set.
 *
 * Not hypothetical: the sandbox's queen dial is separate from the army, and
 * switching to the eight-file board while it was off put queens on the board
 * with no way to move them. Undefined then propagated as far as check
 * detection before anything complained, which is a long way from the cause.
 */
function assertEveryManCanMove(placement, pieces) {
  for (const { type } of placement) {
    if (!pieces[type]) {
      throw new RangeError(`a ${type} is on the board but has no moves in this rule set`);
    }
  }
}

/**
 * The condition without which there is no game: both players must be able to
 * say "D3" and mean the same square.
 *
 * Checked at construction rather than in a test alone, because the sandbox will
 * build boards at runtime and a board whose names disagree is not a variant, it
 * is a broken game.
 */
function assertNamesAgree(files, lenses) {
  const [white, black] = files;
  for (let f = 0; f < white.length; f++) {
    const seen = black[lenses[SIDE.BLACK].toView(f)];
    if (seen !== white[f]) {
      throw new RangeError(
        `the two boards disagree about file ${f}: White calls it ${white[f]}, ` +
          `Black calls the same square ${seen}`
      );
    }
  }
}

/**
 * Five files, ten ranks. The simpler game, and the one to learn on: the knight
 * and bishop swap without the knight needing to be widened, and there is no
 * queen to complicate the order in which the lessons arrive.
 *
 * Thirteen ranks was the published height and playtested long — several moves
 * before either side could touch the other.
 */
export const NARROW = boardFor({
  id: 'escher-5x10',
  label: 'Escher Chess (5×10)',
  width: 5,
  height: 10,
  dials: ESCHER_DIALS.narrow,
});

/**
 * Eight by eight, standard armies, and a queen. Here the knight wants widening.
 *
 * The file names are the game's logo read two ways: taking White's alternately
 * gives CHES and DUAL, Black's gives ESCH and DUAL.
 */
export const WIDE = boardFor({
  id: 'escher-8x8',
  label: 'Escher Chess (8×8)',
  width: 8,
  height: 8,
  dials: ESCHER_DIALS.wide,
});

/**
 * The tutorial: ordinary chess, on the narrow board.
 *
 * "Duality off" is not the identity lens. Two players sitting opposite each
 * other still see the files in opposite orders — that is true of a normal chess
 * set — so the tutorial's lens is the plain mirror, and Black's names are
 * White's backwards. Every piece is then self-dual, both boards agree about
 * everything, and whatever a player learns here about their own pieces is true
 * of their opponent's too. Which is exactly what stops being true next door.
 */
export const TUTORIAL = boardFor({
  id: 'escher-tutorial',
  label: 'Escher Chess (tutorial)',
  width: 5,
  height: 10,
  dials: ESCHER_DIALS.narrow,
  mirror: true,
});

export const BOARDS = Object.freeze({
  [NARROW.id]: NARROW,
  [WIDE.id]: WIDE,
  [TUTORIAL.id]: TUTORIAL,
});
