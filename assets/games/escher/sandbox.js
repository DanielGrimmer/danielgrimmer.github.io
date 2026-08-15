/**
 * The Escher Chess sandbox: which dials there are, and what turning them costs.
 *
 * The Soccer Hockey sandbox opens up the *board* — its width, its height, its
 * duality number, which relative moves exist. Here almost none of that is free.
 * The widths, the multiplier and the offset are locked together, because they
 * are what makes the knight and the bishop trade places and what makes the file
 * names come out as ARMED / DREAM and as the two lines of the logo. Turn any
 * one of them and there is no game left to play with.
 *
 * What *is* free is the pieces, and that turns out to be the more interesting
 * half anyway. Every dial below changes which pieces survive the crossing, and
 * `dualityReport` says so immediately. Shorten the rook on the eight-wide board
 * and watch it stop being its own dual — that is the defect the V3 rules had,
 * and it is one click away.
 *
 * Nothing here throws. Two people are editing one document over a network, so a
 * briefly nonsensical value has to be survivable: `normaliseDials` clamps and
 * returns something the engine will accept, whatever it is handed.
 */

import { boardFor, armyNeeds, WIDTHS } from './presets.js?v=4.3.0';
import { PIECE } from './pieces.js?v=4.3.0';

/**
 * The bounds. Restated in `_firebase/firestore.rules`, which is what actually
 * protects the database — this file only keeps the page honest.
 */
export const LIMITS = Object.freeze({
  widths: WIDTHS,
  height: Object.freeze({ min: 6, max: 14 }),
  rookRange: Object.freeze({ min: 1, max: 8 }),
  bishopRange: Object.freeze({ min: 1, max: 8 }),
  knightWiden: Object.freeze({ min: 0, max: 3 }),
});

/** The published narrow game, which is where the sandbox opens. */
export const DEFAULT_DIALS = Object.freeze({
  width: 5,
  height: 10,
  rookRange: 4,
  bishopRange: 2,
  knightWiden: 0,
  queen: false,
  jumpyForward: true,
});

/** The published games, as dial settings, for the "put it back" button. */
export const PUBLISHED = Object.freeze({
  'escher-5x10': DEFAULT_DIALS,
  'escher-8x8': Object.freeze({
    width: 8,
    height: 8,
    rookRange: 4,
    bishopRange: 2,
    knightWiden: 1,
    queen: true,
    jumpyForward: true,
  }),
});

const clamp = (value, { min, max }, fallback) => {
  const n = Math.trunc(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
};

/**
 * Anything into a usable set of dials. Never throws, never returns something
 * `boardFor` will refuse.
 */
export function normaliseDials(dials = {}) {
  const width = LIMITS.widths.includes(Number(dials.width))
    ? Number(dials.width)
    : DEFAULT_DIALS.width;
  return Object.freeze({
    width,
    height: clamp(dials.height, LIMITS.height, DEFAULT_DIALS.height),
    rookRange: clamp(dials.rookRange, LIMITS.rookRange, DEFAULT_DIALS.rookRange),
    bishopRange: clamp(dials.bishopRange, LIMITS.bishopRange, DEFAULT_DIALS.bishopRange),
    knightWiden: clamp(dials.knightWiden, LIMITS.knightWiden, DEFAULT_DIALS.knightWiden),
    /*
     * Forced on where the army has one — the eight-file board — because a piece
     * standing on the board with no move set is not a variant, it is a crash.
     * The dial is therefore only a choice on the narrow board, where turning it
     * on means "a pawn reaching the far rank may become a queen".
     */
    queen: Boolean(dials.queen) || queenIsCompulsory(width),
    jumpyForward: dials.jumpyForward !== false,
  });
}

/** Is a queen on this width's board whether anybody asked for one or not? */
export const queenIsCompulsory = (width) => armyNeeds(width).includes(PIECE.QUEEN);

/** Turn one dial, and get back a whole valid set. */
export function turn(dials, name, value) {
  return normaliseDials({ ...normaliseDials(dials), [name]: value });
}

/** Are these the settings of one of the published games? */
export function publishedId(dials) {
  const want = normaliseDials(dials);
  for (const [id, published] of Object.entries(PUBLISHED)) {
    if (Object.keys(want).every((k) => want[k] === published[k])) return id;
  }
  return null;
}

/** The board these dials describe. */
export function boardFromDials(dials) {
  const settled = normaliseDials(dials);
  return boardFor({
    id: `sandbox-${settled.width}x${settled.height}`,
    label: `Escher Chess (${settled.width}×${settled.height})`,
    width: settled.width,
    height: settled.height,
    dials: settled,
  });
}

/* ------------------------------------------------------------ over the wire ---- */

/**
 * Firestore stores plain numbers and booleans happily, so a dial set travels as
 * itself. `decodeDials` still goes through `normaliseDials`, because the
 * document may have been written by a page older or newer than this one.
 */
export const encodeDials = (dials) => ({ ...normaliseDials(dials) });
export const decodeDials = (raw) => normaliseDials(raw ?? {});

/* ------------------------------------------------------------ what it costs ---- */

const PIECE_NAME = Object.freeze({
  [PIECE.PAWN]: 'pawn',
  [PIECE.KNIGHT]: 'knight',
  [PIECE.BISHOP]: 'bishop',
  [PIECE.ROOK]: 'rook',
  [PIECE.QUEEN]: 'queen',
  [PIECE.KING]: 'king',
});

/**
 * One line per piece: what your opponent's copy of it is really doing.
 *
 * The order is fixed rather than following the object's keys, so that a line
 * does not jump around the panel when the queen is switched on.
 */
const ORDER = [PIECE.PAWN, PIECE.KNIGHT, PIECE.BISHOP, PIECE.ROOK, PIECE.QUEEN, PIECE.KING];

export function describeBoard(board) {
  const out = [];
  for (const name of ORDER) {
    const entry = board.duality[name];
    if (!entry) continue;
    out.push({
      piece: PIECE_NAME[name],
      selfDual: entry.selfDual,
      dualTo: entry.dualTo ? PIECE_NAME[entry.dualTo] : null,
      text: entry.selfDual
        ? 'the same piece for both of you'
        : entry.dualTo
          ? `your opponent's moves like your ${PIECE_NAME[entry.dualTo]}`
          : 'nothing either of you has',
    });
  }
  return out;
}

/**
 * The one line above the table: whether this setting still has the property the
 * game was designed around.
 *
 * Written as a single sentence, and a warning beats a description — the same
 * rule the Soccer Hockey sandbox's note follows, for the same reason. A player
 * turning dials wants to know what they have just broken, not to read a
 * paragraph confirming that nothing happened.
 */
export function verdictFor(board) {
  const swap =
    board.duality[PIECE.KNIGHT]?.dualTo === PIECE.BISHOP &&
    board.duality[PIECE.BISHOP]?.dualTo === PIECE.KNIGHT;
  const rookHolds = board.duality[PIECE.ROOK]?.selfDual === true;

  if (!swap && !rookHolds) {
    return (
      'Neither the knight–bishop swap nor the rook survives these settings. ' +
      'Every piece now looks strange, which is a worse game than one where ' +
      'most things look normal and a few do not.'
    );
  }
  if (!swap) {
    return (
      'The knight and the bishop no longer trade places. That swap is the ' +
      'trick the whole game is built on — without it there is a duality here, ' +
      'but nothing recognisable comes out of it.'
    );
  }
  if (!rookHolds) {
    return (
      'The rook is no longer its own dual. This is exactly the defect the ' +
      'printed rules had: with the rook strange too, nothing on the board ' +
      'reassures a new player that they have understood anything.'
    );
  }
  return (
    'These settings keep both halves of the design: the knight and the bishop ' +
    'trade places, and the rook is the same piece to both of you.'
  );
}
