import test from 'node:test';
import assert from 'node:assert/strict';

import {
  frameCount,
  clampFrame,
  stepSummary,
  reachText,
  moverAt,
} from '../assets/games/ui/replay.js';
import { replayFrames, viewOf, legalMovesFor, applyMove, initialGame, STATUS } from '../assets/games/core/game.js';
import { SOCCER_HOCKEY } from '../assets/games/core/presets.js';

const config = SOCCER_HOCKEY;

/** Walk the board by always taking the first legal move, to get a real log. */
function someGame(limit = 40) {
  const moves = [];
  let game = initialGame(config);
  while (game.outcome.status === STATUS.PLAYING && moves.length < limit) {
    const next = legalMovesFor(config, game)[0];
    moves.push(next);
    game = applyMove(config, game, next);
  }
  return moves;
}

test('frame arithmetic', async (t) => {
  await t.test('a log of n moves has n + 1 frames, the first being the kick-off', () => {
    assert.equal(frameCount([]), 1);
    assert.equal(frameCount([{ row: 5, col: 5 }]), 2);
  });

  await t.test('frames are clamped rather than allowed to run off either end', () => {
    assert.equal(clampFrame(-4, 10), 0);
    assert.equal(clampFrame(99, 10), 9);
    assert.equal(clampFrame(3, 10), 3);
    assert.equal(clampFrame(3.7, 10), 3);
    assert.equal(clampFrame(NaN, 10), 0);
  });
});

test('a move, measured through each seat', async (t) => {
  const from = { row: 6, col: 5 };

  await t.test('one across for soccer is four across for hockey', () => {
    const to = { row: 5, col: 6 };
    assert.equal(stepSummary(config, { seat: 0, from, to }).across, 1);
    assert.equal(stepSummary(config, { seat: 1, from, to }).across, 4);
  });

  await t.test('three across for soccer is only one across for hockey', () => {
    const to = { row: 5, col: 8 };
    assert.equal(stepSummary(config, { seat: 0, from, to }).across, 3);
    assert.equal(stepSummary(config, { seat: 1, from, to }).across, 1);
  });

  await t.test('a move across the seam counts the short way round', () => {
    // Column 10 to column 0 is one step on a cylinder, not ten.
    const summary = stepSummary(config, { seat: 0, from: { row: 6, col: 10 }, to: { row: 6, col: 0 } });
    assert.equal(summary.across, 1);
  });

  await t.test('the row step names the goal it heads for, by sport', () => {
    const up = stepSummary(config, { seat: 0, from, to: { row: 5, col: 5 } });
    assert.equal(up.rows, 1);
    assert.equal(up.towards, 'Soccer');
    assert.equal(up.rowsText, 'and 1 row towards the Soccer goal');

    const down = stepSummary(config, { seat: 0, from, to: { row: 9, col: 5 } });
    assert.equal(down.rows, 3);
    assert.equal(down.towards, 'Hockey');
    assert.equal(down.rowsText, 'and 3 rows towards the Hockey goal');
  });

  await t.test('a move along one row names no goal', () => {
    const summary = stepSummary(config, { seat: 0, from, to: { row: 6, col: 8 } });
    assert.equal(summary.rows, 0);
    assert.equal(summary.towards, null);
    assert.equal(summary.rowsText, 'along the same row');
    assert.equal(summary.acrossText, '3 across');
  });

  await t.test('a move straight up a column says so rather than reading "0 across"', () => {
    const summary = stepSummary(config, { seat: 0, from, to: { row: 3, col: 5 } });
    assert.equal(summary.across, 0);
    assert.equal(summary.acrossText, 'no sideways step');
  });

  await t.test('there is no seat 2', () => {
    assert.throws(() => stepSummary(config, { seat: 2, from, to: { row: 5, col: 5 } }), RangeError);
  });
});

test('what the two boards agree about', async (t) => {
  const moves = someGame();
  const frames = replayFrames(config, moves);

  await t.test('the game used for these checks is a real one of some length', () => {
    assert.ok(moves.length >= 5, `expected a few moves, got ${moves.length}`);
  });

  await t.test('every move has the same row step and the same goal on both boards', () => {
    for (let i = 1; i < frames.length; i++) {
      const args = { from: frames[i - 1], to: frames[i] };
      const mine = stepSummary(config, { ...args, seat: 0 });
      const theirs = stepSummary(config, { ...args, seat: 1 });
      assert.equal(mine.rows, theirs.rows, `move ${i} disagreed about the row step`);
      assert.equal(mine.towards, theirs.towards, `move ${i} disagreed about the goal`);
    }
  });

  await t.test('the goals stand in the same column on both boards', () => {
    for (const frame of frames) {
      assert.equal(viewOf(config, frame, 0).goalCol, viewOf(config, frame, 1).goalCol);
    }
  });

  await t.test('but the ball does not stay in the same column', () => {
    const differs = frames.some(
      (frame) => viewOf(config, frame, 0).ball.col !== viewOf(config, frame, 1).ball.col
    );
    assert.ok(differs, 'the two boards should part company almost at once');
  });

  await t.test('the ball is on the same row on both boards, always', () => {
    for (const frame of frames) {
      assert.equal(viewOf(config, frame, 0).ball.row, viewOf(config, frame, 1).ball.row);
    }
  });
});

test('captions and credits', async (t) => {
  await t.test('each seat is told the reach it actually perceives', () => {
    assert.equal(reachText(config, 0), '1 or 3');
    assert.equal(reachText(config, 1), '1 or 4');
  });

  await t.test('the kick-off has no mover; after that the seats alternate', () => {
    const moves = someGame(6);
    const frames = replayFrames(config, moves);
    assert.equal(moverAt(frames, 0), null);
    assert.equal(moverAt(frames, 1), 0);
    assert.equal(moverAt(frames, 2), 1);
    assert.equal(moverAt(frames, 3), 0);
  });
});
