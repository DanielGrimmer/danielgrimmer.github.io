import test from 'node:test';
import assert from 'node:assert/strict';

import { BASKETBALL_TUTORIAL } from '../assets/games/core/presets.js';
import { initialGame, legalMovesFor, applyMove, STATUS } from '../assets/games/core/game.js';
import {
  isWrapMove,
  contextFor,
  stepIndex,
  isStalled,
  STALLED_HINT,
  BASKETBALL_STEPS,
  BASKETBALL_OUTRO,
} from '../assets/games/ui/coach.js';

const config = BASKETBALL_TUTORIAL;
const W = config.board.width; // 9

test('spotting a wrap', async (t) => {
  await t.test('a step across the seam counts', () => {
    assert.ok(isWrapMove({ col: 8 }, { col: 0 }, W), 'off the right edge');
    assert.ok(isWrapMove({ col: 0 }, { col: 8 }, W), 'off the left edge');
    assert.ok(isWrapMove({ col: 1 }, { col: 7 }, W), 'a long pass across the seam');
  });

  await t.test('an ordinary step does not', () => {
    assert.ok(!isWrapMove({ col: 4 }, { col: 5 }, W));
    assert.ok(!isWrapMove({ col: 4 }, { col: 1 }, W));
    assert.ok(!isWrapMove({ col: 4 }, { col: 4 }, W));
  });
});

test('the context is a summary of what you have done', async (t) => {
  await t.test('an untouched board has done nothing', () => {
    const ctx = contextFor(config, []);
    assert.deepEqual(
      { ...ctx, wrapsAt: [...ctx.wrapsAt], approachesAt: [...ctx.approachesAt], outcome: null },
      {
        moveCount: 0,
        wrapsAt: [],
        approachesAt: [],
        hasWrapped: false,
        hasReachedApproach: false,
        isOver: false,
        outcome: null,
      }
    );
  });

  await t.test('records when each thing happened, not merely that it did', () => {
    const ctx = contextFor(config, wrapEarlyThenDot());
    assert.deepEqual([...ctx.wrapsAt], [2], 'the seam was crossed on move 2');
    assert.deepEqual([...ctx.approachesAt], [4], 'a dot was reached on move 4');
  });

  await t.test('facts are cumulative — nothing becomes untrue later', () => {
    const wrapping = walkToSeam();
    const ctx = contextFor(config, wrapping);
    assert.ok(ctx.hasWrapped);
    // keep playing; the fact must survive
    let game = initialGame(config);
    for (const m of wrapping) game = applyMove(config, game, m);
    const more = [...wrapping];
    for (let i = 0; i < 3 && game.outcome.status === STATUS.PLAYING; i++) {
      const next = legalMovesFor(config, game)[0];
      more.push(next);
      game = applyMove(config, game, next);
    }
    assert.ok(contextFor(config, more).hasWrapped, 'a wrap cannot be undone by playing on');
  });

  await t.test('notices reaching a square that can score', () => {
    const moves = walkToGoalApproach();
    assert.ok(contextFor(config, moves).hasReachedApproach);
  });

  await t.test('notices the game ending', () => {
    const moves = walkIntoTopGoal();
    const ctx = contextFor(config, moves);
    assert.ok(ctx.isOver);
    assert.equal(ctx.outcome.status, STATUS.WON);
  });
});

test('stepping through the tutorial', async (t) => {
  await t.test('starts on the first step', () => {
    assert.equal(stepIndex(BASKETBALL_STEPS, contextFor(config, [])), 0);
    assert.equal(BASKETBALL_STEPS[0].id, 'welcome');
  });

  await t.test('a single move clears the welcome', () => {
    const one = [legalMovesFor(config, initialGame(config))[0]];
    assert.equal(BASKETBALL_STEPS[stepIndex(BASKETBALL_STEPS, contextFor(config, one))].id, 'trail');
  });

  await t.test('the wrap step waits for an actual wrap, not for a move count', () => {
    // Eight moves that never cross the seam must not satisfy it.
    const straight = walkWithoutWrapping(8);
    const ctx = contextFor(config, straight);
    assert.ok(ctx.moveCount >= 4, 'past the trail step');
    assert.ok(!ctx.hasWrapped);
    assert.equal(BASKETBALL_STEPS[stepIndex(BASKETBALL_STEPS, ctx)].id, 'wrap');
  });

  await t.test('and clears once the ball crosses it', () => {
    const ctx = contextFor(config, walkToSeam());
    assert.ok(ctx.hasWrapped);
    assert.notEqual(BASKETBALL_STEPS[stepIndex(BASKETBALL_STEPS, ctx)].id, 'wrap');
  });

  await t.test('a skipped step is passed over without blocking', () => {
    const ctx = contextFor(config, walkWithoutWrapping(8));
    const stuck = stepIndex(BASKETBALL_STEPS, ctx);
    assert.equal(BASKETBALL_STEPS[stuck].id, 'wrap', 'held on the unmet step');

    const moved = stepIndex(BASKETBALL_STEPS, ctx, new Set(['wrap']));
    assert.ok(moved > stuck, 'skipping must advance');
    assert.notEqual(BASKETBALL_STEPS[moved]?.id, 'wrap');
  });

  await t.test('every step is reachable and none is finished at the start', () => {
    const fresh = contextFor(config, []);
    for (const step of BASKETBALL_STEPS) {
      assert.equal(step.doneAt(fresh, 0), null, `${step.id} should not start finished`);
      assert.ok(step.title && step.body && step.hint, `${step.id} needs its copy`);
    }
  });

  /*
   * The bug this file exists to keep fixed.
   *
   * The facts used to be cumulative booleans over the whole log, so anything a
   * player did before being asked counted as having been taught it. Wander into
   * the seam while reading step 2 and step 3 never appeared; touch a scoring dot
   * on the way past and step 4 never appeared either. Both are easy to do by
   * accident, and the player is never told what they missed.
   */
  await t.test('REGRESSION: doing it before you were asked does not skip the step', () => {
    // Crosses the seam on move 2 and stands on a dot on move 4 — both of them
    // during the first two steps, neither of them asked for.
    const ctx = contextFor(config, wrapEarlyThenDot());
    assert.deepEqual([...ctx.wrapsAt], [2]);
    assert.deepEqual([...ctx.approachesAt], [4]);

    // The cumulative reading called both lessons learnt and jumped to the last
    // step. The tutorial must still be on the one that teaches the cylinder.
    assert.equal(BASKETBALL_STEPS[stepIndex(BASKETBALL_STEPS, ctx)].id, 'wrap');

    // And once the seam is crossed on purpose, the dot step is next — not
    // skipped over on the strength of that accidental landing on move 4.
    const wrapped = { ...ctx, moveCount: 6, wrapsAt: Object.freeze([2, 6]) };
    assert.equal(BASKETBALL_STEPS[stepIndex(BASKETBALL_STEPS, wrapped)].id, 'dots');
  });

  await t.test('REGRESSION: and each step is met by play that follows it', () => {
    const wrap = BASKETBALL_STEPS.find((s) => s.id === 'wrap');
    const dots = BASKETBALL_STEPS.find((s) => s.id === 'dots');
    const ctx = { moveCount: 9, wrapsAt: [2], approachesAt: [3], isOver: false, outcome: null };
    assert.equal(wrap.doneAt(ctx, 4), null, 'a wrap before the step began does not count');
    assert.equal(dots.doneAt(ctx, 4), null, 'nor does a dot');
    assert.equal(wrap.doneAt(ctx, 1), 2, 'one during the step does');
    assert.equal(dots.doneAt(ctx, 2), 3);
  });

  await t.test('giving up on a step does not hand the next one your earlier play', () => {
    const ctx = contextFor(config, wrapEarlyThenDot());
    // Skipping the seam step at move 4 must not let the dot reached *on* move 4
    // satisfy the step that follows it.
    const skipped = new Map([['wrap', ctx.moveCount]]);
    assert.equal(BASKETBALL_STEPS[stepIndex(BASKETBALL_STEPS, ctx, skipped)].id, 'dots');
  });

  /*
   * The stalled hint says: press "Start again" and pick up where you left off.
   * It used to drop the reader back on step one, because the move log is the
   * state and clearing it cleared their place too. `floor` is what the page
   * banks before wiping the log.
   */
  await t.test('REGRESSION: Start again keeps your place in the lesson', () => {
    const quick = walkIntoTopGoal();
    const dead = contextFor(config, quick);
    assert.ok(isStalled(BASKETBALL_STEPS, dead), 'the board is finished, the tutorial is not');
    const stuckAt = stepIndex(BASKETBALL_STEPS, dead);

    const fresh = contextFor(config, []);
    assert.equal(stepIndex(BASKETBALL_STEPS, fresh), 0, 'a bare fresh board reads step one');
    assert.equal(
      stepIndex(BASKETBALL_STEPS, fresh, new Map(), stuckAt),
      stuckAt,
      'carrying the floor keeps the step the reader was on'
    );
    assert.ok(!isStalled(BASKETBALL_STEPS, fresh, new Map(), stuckAt), 'and it is playable again');
  });

  await t.test('and the tutorial goes on from that floor rather than restarting', () => {
    const floor = 2; // the seam step
    assert.equal(BASKETBALL_STEPS[floor].id, 'wrap');
    const seam = contextFor(config, walkToSeam());
    assert.equal(
      BASKETBALL_STEPS[stepIndex(BASKETBALL_STEPS, seam, new Map(), floor)].id,
      'dots',
      'one wrap on the new board advances it, with no need to redo steps one and two'
    );
  });

  await t.test('a game won in three moves leaves the tutorial stalled, and says so', () => {
    // The shortest possible game: straight up the middle and in. Nothing about
    // the cylinder or the dots has been met, so the panel must redirect rather
    // than ask a dead board for another move.
    const quick = walkIntoTopGoal();
    const ctx = contextFor(config, quick);
    assert.ok(ctx.isOver);
    assert.ok(stepIndex(BASKETBALL_STEPS, ctx) < BASKETBALL_STEPS.length, 'steps remain');
    assert.ok(isStalled(BASKETBALL_STEPS, ctx));
    assert.match(STALLED_HINT, /Start again/);
  });

  await t.test('a game still in play is never stalled', () => {
    assert.ok(!isStalled(BASKETBALL_STEPS, contextFor(config, [])));
    assert.ok(!isStalled(BASKETBALL_STEPS, contextFor(config, walkWithoutWrapping(6))));
  });

  await t.test('finishing the tutorial properly is not a stall', () => {
    const all = finishedContext(40);
    assert.ok(!isStalled(BASKETBALL_STEPS, all), 'every step done means finished, not stuck');
  });

  await t.test('the outro appears only once every step is done', () => {
    assert.equal(stepIndex(BASKETBALL_STEPS, finishedContext(99)), BASKETBALL_STEPS.length);
    assert.ok(BASKETBALL_OUTRO.body.includes('separate'), 'it must tell them to split up');
  });
});

// --- helpers: real games, played by the engine ------------------------------

/**
 * A context in which every step has been met, in order: a wrap and a dot late
 * enough that each falls after the step before it finished. Written out rather
 * than played, because what is being checked is the walk over the steps.
 */
function finishedContext(moveCount) {
  return {
    moveCount,
    wrapsAt: [10],
    approachesAt: [20],
    hasWrapped: true,
    hasReachedApproach: true,
    isOver: true,
    outcome: { status: STATUS.WON, winner: 0 },
  };
}

/**
 * Four moves that break both of the old cumulative flags: a long pass across
 * the seam on move 2 — the earliest a wrap is possible from the opening — and a
 * landing on a scoring dot on move 4. Neither was asked for; both used to count.
 */
function wrapEarlyThenDot() {
  let game = initialGame(config);
  const moves = [];
  for (const square of [{ row: 7, col: 2 }, { row: 7, col: 8 }]) {
    assert.ok(
      legalMovesFor(config, game).some((m) => m.row === square.row && m.col === square.col),
      `${JSON.stringify(square)} is legal`
    );
    moves.push(square);
    game = applyMove(config, game, square);
  }
  while (moves.length < 4) {
    const pick = legalMovesFor(config, game).filter(
      (m) => m.row !== 0 && m.row !== config.board.height - 1
    )[0];
    assert.ok(pick, 'the helper needs a non-scoring move');
    moves.push(pick);
    game = applyMove(config, game, pick);
  }
  return moves;
}

/** Walk the ball sideways until it crosses the seam. */
function walkToSeam() {
  let game = initialGame(config);
  const moves = [];
  for (let i = 0; i < 12; i++) {
    const sideways = legalMovesFor(config, game).filter((m) => m.row === game.row);
    // always take the biggest rightward step available, so we reach the edge
    const pick = sideways.sort((a, b) => rightward(b, game.col) - rightward(a, game.col))[0];
    if (!pick) break;
    moves.push(pick);
    const before = { col: game.col };
    game = applyMove(config, game, pick);
    if (isWrapMove(before, game, W)) return moves;
  }
  throw new Error('helper failed to produce a wrapping move');
}

function rightward(square, fromCol) {
  return (square.col - fromCol + W) % W;
}

/** Moves that never cross the seam and never end the game. */
function walkWithoutWrapping(count) {
  let game = initialGame(config);
  const moves = [];
  for (let i = 0; i < count; i++) {
    const options = legalMovesFor(config, game)
      .filter((m) => !isWrapMove(game, m, W))
      .filter((m) => m.row !== 0 && m.row !== config.board.height - 1)
      // stay near the middle so the ball does not drift into the seam
      .sort(
        (a, b) =>
          Math.abs(a.col - config.board.goalCol) - Math.abs(b.col - config.board.goalCol)
      );
    const pick = options[0];
    if (!pick) break;
    moves.push(pick);
    game = applyMove(config, game, pick);
  }
  assert.ok(moves.length >= 4, `helper managed only ${moves.length} safe moves`);
  return moves;
}

function walkToGoalApproach() {
  let game = initialGame(config);
  const moves = [];
  // straight up the middle: row 5 -> 1 puts it on a dot in front of the top goal
  for (const row of [4, 3, 2, 1]) {
    const pick = legalMovesFor(config, game).find((m) => m.row === row && m.col === game.col);
    if (!pick) break;
    moves.push(pick);
    game = applyMove(config, game, pick);
  }
  return moves;
}

function walkIntoTopGoal() {
  const moves = walkToGoalApproach();
  let game = initialGame(config);
  for (const m of moves) game = applyMove(config, game, m);
  const scoring = legalMovesFor(config, game).find((m) => m.row === 0);
  assert.ok(scoring, 'from a dot the goal must be reachable');
  return [...moves, scoring];
}
