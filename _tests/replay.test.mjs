import test from 'node:test';
import assert from 'node:assert/strict';

import { frameCount, clampFrame, reachText, moverAt } from '../assets/games/ui/replay.js';
import {
  replayFrames,
  viewOf,
  legalMovesFor,
  applyMove,
  initialGame,
  STATUS,
} from '../assets/games/core/game.js';
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

/*
 * What the reveal claims, checked against the engine. The note above the boards
 * tells the player that the two perspectives disagree about the column and the
 * trail but agree about the goals and the winner; if any of that stopped being
 * true the page would be lying to them in prose.
 */
test('what the two boards do and do not agree about', async (t) => {
  const moves = someGame();
  const frames = replayFrames(config, moves);

  await t.test('the game used for these checks is a real one of some length', () => {
    assert.ok(moves.length >= 5, `expected a few moves, got ${moves.length}`);
  });

  await t.test('the goals stand in the same column on both boards', () => {
    for (const frame of frames) {
      assert.equal(viewOf(config, frame, 0).goalCol, viewOf(config, frame, 1).goalCol);
    }
  });

  await t.test('both boards agree who won, and when the game ended', () => {
    for (const frame of frames) {
      assert.deepEqual(viewOf(config, frame, 0).outcome, viewOf(config, frame, 1).outcome);
    }
  });

  await t.test('the ball is on the same row on both boards, always', () => {
    for (const frame of frames) {
      assert.equal(viewOf(config, frame, 0).ball.row, viewOf(config, frame, 1).ball.row);
    }
  });

  await t.test('but the two boards disagree about the column, and soon', () => {
    const differs = frames.filter(
      (frame) => viewOf(config, frame, 0).ball.col !== viewOf(config, frame, 1).ball.col
    );
    assert.ok(differs.length >= frames.length - 2, 'the two boards should part company at once');
  });

  await t.test('and about the shape of the trail', () => {
    const last = frames[frames.length - 1];
    const trail = (seat) =>
      viewOf(config, last, seat)
        .visited.map((s) => `${s.row},${s.col}`)
        .join(' ');
    assert.notEqual(trail(0), trail(1));
  });
});

test('the boards and the credits', async (t) => {
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
