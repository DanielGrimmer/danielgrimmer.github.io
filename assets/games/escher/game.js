/**
 * Escher Chess: the state, the legal moves, and the end of the game.
 *
 * The move log is the state. A move is `{from, to}` in canonical coordinates,
 * plus a `promote` when a pawn reaches the far end; which piece moved, what it
 * took, and whether anyone is in check all fall out of replaying the log from
 * the opening position. There is no castling and no en passant to remember, so
 * the log really is the whole story — which is what lets a Security Rule police
 * a game it cannot understand, by counting moves and checking parity.
 *
 * ## Keeping the secret
 *
 * The point of the game is that you are never told how your opponent's pieces
 * move; you work it out. So `viewOf` gives a seat its *own* legal moves and
 * nothing else. The enemy's reachable squares are computed here — they have to
 * be, to know whether a king is in check — but they never reach the view, so
 * they are not sitting in the page for anyone who thinks to look.
 *
 * Check is announced as a fact and never as a diagram: a player told "you are
 * in check" has to work out which piece is doing it, which is the game working
 * as intended rather than a missing feature.
 */

import { mod } from '../core/duality.js?v=4.26.0';
import { PIECE } from './pieces.js?v=4.26.0';
import { SIDE } from './presets.js?v=4.26.0';

export const STATUS = Object.freeze({
  PLAYING: 'playing',
  CHECKMATE: 'checkmate',
  STALEMATE: 'stalemate',
});

export const squareKey = (rank, file) => `${rank},${file}`;

const other = (side) => (side === SIDE.WHITE ? SIDE.BLACK : SIDE.WHITE);

/* ------------------------------------------------------------- the state ---- */

export function initialGame(board) {
  const men = new Map();
  for (const { type, side, rank, file } of board.placement) {
    // `moved` is what `initialOnly` asks about. Carried on the man rather than
    // inferred from where it stands, because this army has pawns on two ranks:
    // a rank test would deny the second rank its double step, and would hand a
    // fresh one to any pawn that later arrived on a starting square.
    men.set(squareKey(rank, file), Object.freeze({ type, side, moved: false }));
  }
  return freezeGame({
    men,
    turn: SIDE.WHITE,
    outcome: outcomeOf(board, men, SIDE.WHITE),
    lastMove: null,
  });
}

/**
 * `lastMove` is carried along rather than recomputed because a frame from the
 * middle of a replay has no log to look back at. It is not a secret: both
 * players watched the move happen, and reading the enemy's moves is the game.
 */
function freezeGame({ men, turn, outcome, lastMove }) {
  return Object.freeze({
    men,
    turn,
    outcome: Object.freeze(outcome),
    lastMove: lastMove ? Object.freeze({ ...lastMove }) : null,
  });
}

export const pieceAt = (game, rank, file) => game.men.get(squareKey(rank, file)) ?? null;

/* ------------------------------------------------------------- the moves ---- */

/**
 * A piece's move set in canonical terms.
 *
 * The table is written as the owner sees it, so both halves need undoing: file
 * steps come back through that side's lens, and ranks are negated for the side
 * whose board is drawn from the other end. Do the second and forget the first
 * and you have ordinary chess with a mirror; do both and you have this game.
 */
export function canonicalMoves(board, type, side) {
  const lens = board.lenses[side];
  const flip = board.flipsRanks[side] ? -1 : 1;
  return board.pieces[type].map((m) => ({
    ...m,
    step: [flip * m.step[0], lens.canonicalDelta(m.step[1])],
  }));
}

/** Squares strictly between two points of a file. Only ever called with dFile 0. */
function between(fromRank, toRank, file) {
  const out = [];
  const stride = Math.sign(toRank - fromRank);
  for (let r = fromRank + stride; r !== toRank; r += stride) out.push(squareKey(r, file));
  return out;
}

/**
 * Everywhere a piece could go if its own king's safety were no concern.
 *
 * `capturesOnly` is what attack detection wants: a pawn's push threatens
 * nothing, so a king may stand in front of one.
 */
export function pseudoMoves(board, game, { rank, file }, { capturesOnly = false } = {}) {
  const man = pieceAt(game, rank, file);
  if (!man) return [];
  const out = [];
  /*
   * Two entries in a move table can name one square. The rook reaches three
   * files each way, but a board five files wide only has four other files, so
   * "three to the right" and "two to the left" are the same move. Without this
   * the square would be offered twice, and a promotion four times over.
   */
  const seen = new Set();

  for (const m of canonicalMoves(board, man.type, man.side)) {
    if (capturesOnly && m.forbidsCapture) continue;
    if (m.initialOnly && man.moved) continue;

    const toRank = rank + m.step[0];
    const toFile = mod(file + m.step[1], board.width);
    if (toRank < 0 || toRank >= board.height) continue;

    const target = pieceAt(game, toRank, toFile);
    if (target && target.side === man.side) continue;
    if (m.requiresCapture && !target && !capturesOnly) continue;
    if (m.forbidsCapture && target) continue;
    if (!m.jumpy && between(rank, toRank, file).some((k) => game.men.has(k))) continue;

    const key = squareKey(toRank, toFile);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ rank: toRank, file: toFile });
  }
  return out;
}

/** Could `side` capture this square next move? The question check is made of. */
export function isAttacked(board, game, square, side) {
  for (const [key, man] of game.men) {
    if (man.side !== side) continue;
    const [rank, file] = key.split(',').map(Number);
    const reach = pseudoMoves(board, game, { rank, file }, { capturesOnly: true });
    if (reach.some((s) => s.rank === square.rank && s.file === square.file)) return true;
  }
  return false;
}

function kingSquare(game, side) {
  for (const [key, man] of game.men) {
    if (man.side === side && man.type === PIECE.KING) {
      const [rank, file] = key.split(',').map(Number);
      return { rank, file };
    }
  }
  return null;
}

export function inCheck(board, game, side) {
  const king = kingSquare(game, side);
  return king ? isAttacked(board, game, king, other(side)) : false;
}

/** The board after a move, with no legality asked and no outcome computed. */
function afterMove(board, game, { from, to, promote }) {
  const men = new Map(game.men);
  const man = men.get(squareKey(from.rank, from.file));
  men.delete(squareKey(from.rank, from.file));
  const promoted =
    man.type === PIECE.PAWN && to.rank === lastRankFor(board, man.side) && promote
      ? { ...man, type: promote }
      : man;
  men.set(squareKey(to.rank, to.file), Object.freeze({ ...promoted, moved: true }));
  return men;
}

const lastRankFor = (board, side) => (side === SIDE.WHITE ? board.height - 1 : 0);

/**
 * The moves a piece may actually make: pseudo-moves that do not leave, or
 * abandon, its own king in check.
 */
export function legalMovesFrom(board, game, square) {
  const man = pieceAt(game, square.rank, square.file);
  if (!man || game.outcome.status !== STATUS.PLAYING) return [];
  return pseudoMoves(board, game, square).filter((to) => {
    const men = afterMove(board, game, { from: square, to });
    return !inCheck(board, { ...game, men }, man.side);
  });
}

/** Every legal move for the side to play. */
export function legalMoves(board, game, side = game.turn) {
  const out = [];
  for (const [key, man] of game.men) {
    if (man.side !== side) continue;
    const [rank, file] = key.split(',').map(Number);
    const from = { rank, file };
    for (const to of legalMovesFrom(board, game, from)) {
      const promotes = man.type === PIECE.PAWN && to.rank === lastRankFor(board, side);
      if (promotes) for (const type of board.promotesTo) out.push({ from, to, promote: type });
      else out.push({ from, to });
    }
  }
  return out;
}

function outcomeOf(board, men, turn) {
  const game = { men, turn, outcome: { status: STATUS.PLAYING, winner: null } };
  if (legalMoves(board, game, turn).length > 0) return { status: STATUS.PLAYING, winner: null };
  return inCheck(board, game, turn)
    ? { status: STATUS.CHECKMATE, winner: other(turn) }
    : { status: STATUS.STALEMATE, winner: null };
}

export function isLegalMove(board, game, move) {
  return legalMoves(board, game).some(
    (m) =>
      m.from.rank === move.from.rank &&
      m.from.file === move.from.file &&
      m.to.rank === move.to.rank &&
      m.to.file === move.to.file &&
      (m.promote ?? null) === (move.promote ?? null)
  );
}

export function applyMove(board, game, move) {
  if (game.outcome.status !== STATUS.PLAYING) {
    throw new Error(`the game is over (${game.outcome.status})`);
  }
  if (!isLegalMove(board, game, move)) {
    throw new Error(
      `illegal move ${squareKey(move.from.rank, move.from.file)} -> ` +
        `${squareKey(move.to.rank, move.to.file)}${move.promote ? ` = ${move.promote}` : ''}`
    );
  }
  const captured = game.men.has(squareKey(move.to.rank, move.to.file));
  const { type, side } = pieceAt(game, move.from.rank, move.from.file);
  const men = afterMove(board, game, move);
  const turn = other(game.turn);
  return freezeGame({
    men,
    turn,
    outcome: outcomeOf(board, men, turn),
    lastMove: {
      from: Object.freeze({ ...move.from }),
      to: Object.freeze({ ...move.to }),
      promote: move.promote ?? null,
      type,
      side,
      captured,
    },
  });
}

/** Fold a log into a game. How a room's state is reconstructed. */
export function replay(board, moves) {
  return moves.reduce((game, move) => applyMove(board, game, move), initialGame(board));
}

/** Every prefix, for stepping through the reveal. */
export function replayFrames(board, moves) {
  const frames = [initialGame(board)];
  for (const move of moves) frames.push(applyMove(board, frames[frames.length - 1], move));
  return frames;
}

/* -------------------------------------------------------------- the view ---- */

/** Canonical square -> where this seat draws it. */
export function toView(board, seat, { rank, file }) {
  return {
    rank: board.flipsRanks[seat] ? board.height - 1 - rank : rank,
    file: board.lenses[seat].toView(file),
  };
}

/** And back, for a square somebody clicked on. */
export function fromView(board, seat, { rank, file }) {
  return {
    rank: board.flipsRanks[seat] ? board.height - 1 - rank : rank,
    file: board.lenses[seat].toCanonical(file),
  };
}

/**
 * The board as one seat sees it.
 *
 * Everything a renderer needs, and deliberately nothing more. `legalMoves` is
 * this seat's own; there is no list of where the enemy could go, because
 * working that out is the game. `check` is a bare flag for the same reason —
 * you are told you are in check, not which piece is doing it.
 */
export function viewOf(board, game, seat, { hotSeat = false } = {}) {
  /*
   * `hotSeat` is for the tutorial, where one person plays both sides at one
   * screen: the board stays in this seat's frame and the moves offered are
   * whoever's turn it is. It must never be set by a networked page, and it is
   * safe where it is used because the tutorial board has the duality switched
   * off — both players' boards agree, so there is nothing there to give away.
   */
  const live = game.outcome.status === STATUS.PLAYING;
  const mover = hotSeat ? game.turn : seat;
  const mine = live && game.turn === mover;

  /*
   * `mine` on a man means "yours to pick up", which at a shared screen is the
   * side on move rather than the side whose board this is. Everywhere else the
   * two are the same thing.
   */
  const men = [];
  for (const [key, man] of game.men) {
    const [rank, file] = key.split(',').map(Number);
    men.push({ ...man, ...toView(board, seat, { rank, file }), mine: man.side === mover });
  }

  return {
    seat,
    men,
    files: board.files[seat],
    /** Rank *labels* are shared; only the order they are drawn in differs. */
    rankLabels: Array.from({ length: board.height }, (_, i) =>
      board.flipsRanks[seat] ? board.height - i : i + 1
    ),
    myMoves: mine
      ? legalMoves(board, game, mover).map((m) => ({
          from: toView(board, seat, m.from),
          to: toView(board, seat, m.to),
          promote: m.promote ?? null,
        }))
      : [],
    check: inCheck(board, game, hotSeat ? game.turn : seat),
    isMyTurn: mine,
    /** Where the board just changed, so a renderer can point at it. */
    lastMove: game.lastMove
      ? {
          ...game.lastMove,
          from: toView(board, seat, game.lastMove.from),
          to: toView(board, seat, game.lastMove.to),
          mine: game.lastMove.side === seat,
        }
      : null,
    outcome: game.outcome,
    turn: game.turn,
  };
}
