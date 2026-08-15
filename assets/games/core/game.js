/**
 * Game state: one neutral descriptor, rendered through a lens per seat.
 *
 * State is stored in canonical columns and never in either player's. Each seat
 * gets its view by applying its own lens, and `reframe` rewrites a game into a
 * different canonical frame while leaving both seats' views pointwise
 * unchanged — the canonical frame is bookkeeping, and nothing depends on which
 * one is chosen.
 *
 * Moves are a plain list. A game is the fold of `applyMove` over that list, so
 * a room can store the log rather than a snapshot, and the post-game replay is
 * the same fold run through the other lens.
 */

import { Lens, mod, signedRep, modInverse, dualityBetween } from './duality.js?v=4.7.0';
import {
  makeBoard,
  dualMoveSet,
  legalMoves,
  blockedMoves,
  goalApproaches,
  scoringSeat,
  squareKey,
} from './rules.js?v=4.7.0';

export const STATUS = Object.freeze({
  PLAYING: 'playing',
  WON: 'won',
  TIE: 'tie',
});

/**
 * @param {{width:number, height:number, duality?:number, lensMultipliers?:number[],
 *          moveSet?:[number,number][], id?:string, label?:string, seats?:object[]}} spec
 */
export function makeConfig(spec) {
  const board = makeBoard({ width: spec.width, height: spec.height });
  const duality = spec.duality ?? 1;
  const lensMultipliers = spec.lensMultipliers ?? [1, duality];
  if (lensMultipliers.length !== 2) {
    throw new RangeError(`expected exactly 2 lens multipliers, got ${lensMultipliers.length}`);
  }

  const lenses = lensMultipliers.map(
    (multiplier) => new Lens({ width: board.width, multiplier, fixedPoint: board.goalCol })
  );

  const actualDuality = dualityBetween(lenses[0], lenses[1]);
  if (spec.duality != null && actualDuality !== mod(duality, board.width)) {
    throw new RangeError(
      `lens multipliers [${lensMultipliers}] give duality ${actualDuality}, not ${duality}`
    );
  }

  const moveSet =
    spec.moveSet != null
      ? Object.freeze(spec.moveSet.map((o) => Object.freeze([...o])))
      : dualMoveSet({ width: board.width, height: board.height, duality: actualDuality });

  return Object.freeze({
    id: spec.id ?? 'custom',
    label: spec.label ?? 'Custom game',
    board,
    lenses: Object.freeze(lenses),
    duality: actualDuality,
    moveSet,
    seats: Object.freeze((spec.seats ?? [{ name: 'Player 1' }, { name: 'Player 2' }]).map(Object.freeze)),
  });
}

export function initialGame(config) {
  return Object.freeze({
    row: config.board.start.row,
    col: config.board.start.col,
    visited: Object.freeze([]),
    turn: 0,
    outcome: Object.freeze({ status: STATUS.PLAYING, winner: null }),
  });
}

export function legalMovesFor(config, game) {
  if (game.outcome.status !== STATUS.PLAYING) return [];
  return legalMoves(config.board, config.moveSet, game);
}

export function isLegalMove(config, game, square) {
  return legalMovesFor(config, game).some((s) => s.row === square.row && s.col === square.col);
}

/**
 * Apply one move, in canonical coordinates. Landing in a goal scores for the
 * seat that goal belongs to, whoever pushed it there — an own goal counts.
 */
export function applyMove(config, game, square) {
  if (game.outcome.status !== STATUS.PLAYING) {
    throw new Error(`game is over (${game.outcome.status}); no further moves`);
  }
  if (!isLegalMove(config, game, square)) {
    throw new Error(`illegal move to ${squareKey(square.row, square.col)}`);
  }

  const visited = Object.freeze([...game.visited, Object.freeze({ row: game.row, col: game.col })]);
  const next = { row: square.row, col: mod(square.col, config.board.width), visited };

  const scorer = scoringSeat(config.board, next.row);
  if (scorer !== null) {
    return Object.freeze({
      ...next,
      turn: game.turn,
      outcome: Object.freeze({ status: STATUS.WON, winner: scorer }),
    });
  }

  const onward = legalMoves(config.board, config.moveSet, next);
  if (onward.length === 0) {
    return Object.freeze({
      ...next,
      turn: game.turn,
      outcome: Object.freeze({ status: STATUS.TIE, winner: null }),
    });
  }

  return Object.freeze({
    ...next,
    turn: game.turn === 0 ? 1 : 0,
    outcome: Object.freeze({ status: STATUS.PLAYING, winner: null }),
  });
}

/** Fold a move log into a game. This is how a room's state is reconstructed. */
export function replay(config, moves) {
  return moves.reduce((game, square) => applyMove(config, game, square), initialGame(config));
}

/** Every prefix of the log, for stepping through the reveal. */
export function replayFrames(config, moves) {
  const frames = [initialGame(config)];
  for (const square of moves) {
    frames.push(applyMove(config, frames[frames.length - 1], square));
  }
  return frames;
}

/**
 * The board as one seat sees it. Everything a renderer needs, with columns
 * already pushed through that seat's lens.
 */
export function viewOf(config, game, seat) {
  const lens = config.lenses[seat];
  if (!lens) throw new RangeError(`no seat ${seat}`);
  const toView = (sq) => ({ row: sq.row, col: lens.toView(sq.col) });

  return {
    seat,
    goalCol: lens.toView(config.board.goalCol),
    ball: toView(game),
    visited: game.visited.map(toView),
    legalMoves: legalMovesFor(config, game).map(toView),
    /**
     * The arms of the star that are already burnt. Drawn as part of the star but
     * plainly unavailable, so its shape stays recognisable once the trail has
     * eaten into it — and once it is bent around the seam.
     */
    blockedMoves:
      game.outcome.status === STATUS.PLAYING
        ? blockedMoves(config.board, config.moveSet, game).map(toView)
        : [],
    goalApproaches: goalApproaches(config.board, config.moveSet, game.visited).map(toView),
    /** What this seat believes its move set to be, e.g. {1,3} against {1,4}. */
    moveSet: config.moveSet.map(([dr, dc]) => [dr, lens.viewDelta(dc)]),
    outcome: game.outcome,
    turn: game.turn,
    isMyTurn: game.outcome.status === STATUS.PLAYING && game.turn === seat,
  };
}

/** A seat clicked a square on its own board; which canonical square is that? */
export function squareFromView(config, seat, viewSquare) {
  const lens = config.lenses[seat];
  if (!lens) throw new RangeError(`no seat ${seat}`);
  return { row: viewSquare.row, col: lens.toCanonical(viewSquare.col) };
}

/** The sideways step lengths a seat perceives, e.g. [1, 3] for soccer. */
export function sidewaysReach(config, seat, maxRowStep = 1) {
  const lens = config.lenses[seat];
  const mags = new Set();
  for (const [dr, dc] of config.moveSet) {
    if (Math.abs(dr) > maxRowStep) continue;
    const step = Math.abs(lens.viewDelta(dc));
    if (step !== 0) mags.add(step);
  }
  return [...mags].sort((x, y) => x - y);
}

/**
 * Rewrite a configuration into a different canonical frame: canonical column c
 * becomes k*(c - goalCol) + goalCol. Each seat's lens picks up a factor of
 * k^-1 and each move offset a factor of k, so no seat can tell the difference.
 * `reframeSquare` maps stored squares and logged moves into the new frame.
 */
export function reframe(config, k) {
  const { width } = config.board;
  const inv = modInverse(k, width);
  return makeConfig({
    id: config.id,
    label: config.label,
    width,
    height: config.board.height,
    lensMultipliers: config.lenses.map((l) => mod(l.multiplier * inv, width)),
    moveSet: config.moveSet.map(([dr, dc]) => [dr, signedRep(k * dc, width)]),
    seats: [...config.seats],
  });
}

export function reframeSquare(config, k, square) {
  const { width, goalCol } = config.board;
  return { row: square.row, col: mod(k * (square.col - goalCol) + goalCol, width) };
}
