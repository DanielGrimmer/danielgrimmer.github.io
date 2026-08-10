import test from 'node:test';
import assert from 'node:assert/strict';

import { validMultipliers, mod } from '../assets/games/core/duality.js';
import { isPlayable } from '../assets/games/core/rules.js';
import {
  makeConfig,
  initialGame,
  applyMove,
  legalMovesFor,
  isLegalMove,
  replay,
  replayFrames,
  viewOf,
  squareFromView,
  sidewaysReach,
  reframe,
  reframeSquare,
  STATUS,
} from '../assets/games/core/game.js';
import { SOCCER_HOCKEY, BASKETBALL_TUTORIAL } from '../assets/games/core/presets.js';

test('presets', async (t) => {
  await t.test('soccer hockey is 11x13 with duality 4', () => {
    assert.equal(SOCCER_HOCKEY.board.width, 11);
    assert.equal(SOCCER_HOCKEY.board.height, 13);
    assert.equal(SOCCER_HOCKEY.duality, 4);
  });

  await t.test('the tutorial is the same engine with the duality switched off', () => {
    assert.equal(BASKETBALL_TUTORIAL.duality, 1);
    const [a, b] = BASKETBALL_TUTORIAL.lenses;
    for (let c = 0; c < BASKETBALL_TUTORIAL.board.width; c++) {
      assert.equal(a.toView(c), b.toView(c), 'both seats must see the same board');
    }
  });

  await t.test('each seat perceives its own sideways reach', () => {
    assert.deepEqual(sidewaysReach(SOCCER_HOCKEY, 0), [1, 3]);
    assert.deepEqual(sidewaysReach(SOCCER_HOCKEY, 1), [1, 4]);
  });

  await t.test('rejects lens multipliers that contradict the stated duality', () => {
    assert.throws(
      () => makeConfig({ width: 11, height: 13, duality: 4, lensMultipliers: [1, 5] }),
      RangeError
    );
  });
});

test('playing a game', async (t) => {
  await t.test('starts at the centre, seat 0 to move', () => {
    const g = initialGame(SOCCER_HOCKEY);
    assert.deepEqual({ row: g.row, col: g.col }, { row: 6, col: 5 });
    assert.equal(g.turn, 0);
    assert.equal(g.outcome.status, STATUS.PLAYING);
    assert.equal(g.visited.length, 0);
  });

  await t.test('a move burns the square it leaves and passes the turn', () => {
    const g0 = initialGame(SOCCER_HOCKEY);
    const g1 = applyMove(SOCCER_HOCKEY, g0, { row: 5, col: 5 });
    assert.deepEqual({ row: g1.row, col: g1.col }, { row: 5, col: 5 });
    assert.deepEqual([...g1.visited], [{ row: 6, col: 5 }]);
    assert.equal(g1.turn, 1);
    assert.ok(!isLegalMove(SOCCER_HOCKEY, g1, { row: 6, col: 5 }), 'cannot go back');
  });

  await t.test('rejects an illegal move rather than accepting it quietly', () => {
    const g = initialGame(SOCCER_HOCKEY);
    assert.throws(() => applyMove(SOCCER_HOCKEY, g, { row: 6, col: 0 }), /illegal move/);
  });

  await t.test('state is frozen, so a renderer cannot corrupt it', () => {
    const g = initialGame(SOCCER_HOCKEY);
    assert.throws(() => {
      'use strict';
      g.row = 99;
    }, TypeError);
  });

  await t.test('reaching the top goal scores for seat 0, whoever pushed it', () => {
    let g = initialGame(SOCCER_HOCKEY);
    for (const sq of [
      { row: 5, col: 5 },
      { row: 4, col: 5 },
      { row: 3, col: 5 },
      { row: 2, col: 5 },
      { row: 1, col: 5 },
    ]) {
      g = applyMove(SOCCER_HOCKEY, g, sq);
    }
    const mover = g.turn; // whoever is on move now walks it in
    g = applyMove(SOCCER_HOCKEY, g, { row: 0, col: 5 });
    assert.equal(g.outcome.status, STATUS.WON);
    assert.equal(g.outcome.winner, 0);
    assert.equal(mover, 1, 'seat 1 scored the own goal in this line');
  });

  await t.test('reaching the bottom goal scores for seat 1', () => {
    let g = initialGame(SOCCER_HOCKEY);
    for (const sq of [
      { row: 7, col: 5 },
      { row: 8, col: 5 },
      { row: 9, col: 5 },
      { row: 10, col: 5 },
      { row: 11, col: 5 },
      { row: 12, col: 5 },
    ]) {
      g = applyMove(SOCCER_HOCKEY, g, sq);
    }
    assert.equal(g.outcome.winner, 1);
  });

  await t.test('no move is legal once the game is over', () => {
    let g = initialGame(SOCCER_HOCKEY);
    for (const sq of [
      { row: 5, col: 5 },
      { row: 4, col: 5 },
      { row: 3, col: 5 },
      { row: 2, col: 5 },
      { row: 1, col: 5 },
      { row: 0, col: 5 },
    ]) {
      g = applyMove(SOCCER_HOCKEY, g, sq);
    }
    assert.deepEqual(legalMovesFor(SOCCER_HOCKEY, g), []);
    assert.throws(() => applyMove(SOCCER_HOCKEY, g, { row: 1, col: 5 }), /game is over/);
  });

  await t.test('stalemate is declared exactly when no legal move remains', () => {
    // Hand-built dead end: sit on the goal mouth with the field burned behind.
    const cfg = SOCCER_HOCKEY;
    const visited = [];
    for (let r = 0; r < cfg.board.height; r++) {
      for (let c = 0; c < cfg.board.width; c++) {
        if (isPlayable(cfg.board, r, c) && !(r === 1 && c === 5) && !(r === 0 && c === 5)) {
          visited.push({ row: r, col: c });
        }
      }
    }
    const nearlyDead = Object.freeze({
      row: 1,
      col: 5,
      visited: Object.freeze(visited),
      turn: 0,
      outcome: Object.freeze({ status: STATUS.PLAYING, winner: null }),
    });
    // Its only move is into the goal, which ends the game as a win not a tie.
    assert.deepEqual(legalMovesFor(cfg, nearlyDead), [{ row: 0, col: 5 }]);
    const done = applyMove(cfg, nearlyDead, { row: 0, col: 5 });
    assert.equal(done.outcome.status, STATUS.WON);
  });
});

test('the move log is the state', async (t) => {
  const log = [
    { row: 5, col: 5 },
    { row: 5, col: 6 },
    { row: 6, col: 6 },
  ];

  await t.test('replay reproduces a game exactly', () => {
    let stepwise = initialGame(SOCCER_HOCKEY);
    for (const sq of log) stepwise = applyMove(SOCCER_HOCKEY, stepwise, sq);
    assert.deepEqual(replay(SOCCER_HOCKEY, log), stepwise);
  });

  await t.test('replay is deterministic', () => {
    assert.deepEqual(replay(SOCCER_HOCKEY, log), replay(SOCCER_HOCKEY, log));
  });

  await t.test('frames give one state per move, for stepping through the reveal', () => {
    const frames = replayFrames(SOCCER_HOCKEY, log);
    assert.equal(frames.length, log.length + 1);
    assert.deepEqual(frames.at(-1), replay(SOCCER_HOCKEY, log));
    assert.equal(frames[0].visited.length, 0);
  });

  await t.test('a corrupt log is rejected rather than replayed into nonsense', () => {
    assert.throws(() => replay(SOCCER_HOCKEY, [{ row: 0, col: 0 }]), /illegal move/);
  });
});

test('two seats, one world', async (t) => {
  const log = [
    { row: 5, col: 5 },
    { row: 5, col: 8 },
    { row: 6, col: 8 },
  ];
  const game = replay(SOCCER_HOCKEY, log);

  await t.test('the seats disagree about where the ball is', () => {
    const soccer = viewOf(SOCCER_HOCKEY, game, 0);
    const hockey = viewOf(SOCCER_HOCKEY, game, 1);
    assert.equal(soccer.ball.row, hockey.ball.row, 'rows are shared');
    assert.notEqual(soccer.ball.col, hockey.ball.col, 'columns are not');
  });

  await t.test('but agree about the goal, and about how many moves there are', () => {
    const soccer = viewOf(SOCCER_HOCKEY, game, 0);
    const hockey = viewOf(SOCCER_HOCKEY, game, 1);
    assert.equal(soccer.goalCol, hockey.goalCol);
    assert.equal(soccer.goalCol, SOCCER_HOCKEY.board.goalCol);
    assert.equal(soccer.legalMoves.length, hockey.legalMoves.length);
    assert.equal(soccer.visited.length, hockey.visited.length);
  });

  await t.test('INVARIANT: legal moves correspond one-to-one under the duality', () => {
    // The claim the whole game rests on, checked across every valid board.
    for (const width of [5, 7, 9, 11, 13]) {
      for (const duality of validMultipliers(width)) {
        const cfg = makeConfig({ width, height: 11, duality });
        let g = initialGame(cfg);
        for (let step = 0; step < 12 && g.outcome.status === STATUS.PLAYING; step++) {
          const seen = [0, 1].map((seat) => viewOf(cfg, g, seat));
          const [a, b] = seen.map((v) =>
            new Set(v.legalMoves.map((s) => `${s.row},${s.col}`))
          );
          assert.equal(a.size, b.size, `w=${width} a=${duality}`);
          // each of seat 0's moves is seat 1's move, relabelled
          for (const sq of seen[0].legalMoves) {
            const canonical = squareFromView(cfg, 0, sq);
            const asSeat1 = cfg.lenses[1].toView(canonical.col);
            assert.ok(b.has(`${sq.row},${asSeat1}`), `w=${width} a=${duality} move ${sq.row},${sq.col}`);
          }
          const options = legalMovesFor(cfg, g);
          g = applyMove(cfg, g, options[step % options.length]);
        }
      }
    }
  });

  await t.test('a click on a seat board maps back to the same canonical square', () => {
    for (const seat of [0, 1]) {
      const v = viewOf(SOCCER_HOCKEY, game, seat);
      for (const sq of v.legalMoves) {
        const canonical = squareFromView(SOCCER_HOCKEY, seat, sq);
        assert.ok(isLegalMove(SOCCER_HOCKEY, game, canonical));
      }
    }
  });

  await t.test('only one seat is on move', () => {
    const a = viewOf(SOCCER_HOCKEY, game, 0);
    const b = viewOf(SOCCER_HOCKEY, game, 1);
    assert.notEqual(a.isMyTurn, b.isMyTurn);
  });
});

test('no canonical frame is privileged', async (t) => {
  // Rewriting the bookkeeping frame must leave both players' boards untouched.
  const log = [
    { row: 5, col: 5 },
    { row: 5, col: 8 },
    { row: 6, col: 8 },
  ];

  await t.test('every reframing gives both seats an identical board', () => {
    const base = SOCCER_HOCKEY;
    const original = replay(base, log);
    for (const k of validMultipliers(base.board.width)) {
      const reframed = reframe(base, k);
      const movedLog = log.map((sq) => reframeSquare(base, k, sq));
      const game = replay(reframed, movedLog);

      for (const seat of [0, 1]) {
        assert.deepEqual(
          viewOf(reframed, game, seat),
          viewOf(base, original, seat),
          `seat ${seat} noticed the frame change k=${k}`
        );
      }
    }
  });

  await t.test('reframing preserves the duality between the seats', () => {
    for (const k of validMultipliers(11)) {
      assert.equal(reframe(SOCCER_HOCKEY, k).duality, SOCCER_HOCKEY.duality);
    }
  });

  await t.test('the goal column is fixed by every reframing', () => {
    for (const k of validMultipliers(11)) {
      assert.equal(reframeSquare(SOCCER_HOCKEY, k, { row: 0, col: 5 }).col, 5);
    }
  });
});

test('the tutorial behaves like a plain one-board game', async (t) => {
  await t.test('both seats see identical views throughout', () => {
    let g = initialGame(BASKETBALL_TUTORIAL);
    for (let i = 0; i < 6 && g.outcome.status === STATUS.PLAYING; i++) {
      assert.deepEqual(
        { ...viewOf(BASKETBALL_TUTORIAL, g, 0), seat: null, isMyTurn: null },
        { ...viewOf(BASKETBALL_TUTORIAL, g, 1), seat: null, isMyTurn: null }
      );
      const options = legalMovesFor(BASKETBALL_TUTORIAL, g);
      g = applyMove(BASKETBALL_TUTORIAL, g, options[i % options.length]);
    }
  });

  await t.test('its long sideways pass survives the cylinder', () => {
    const g = initialGame(BASKETBALL_TUTORIAL);
    const cols = legalMovesFor(BASKETBALL_TUTORIAL, g)
      .filter((s) => s.row === g.row)
      .map((s) => mod(s.col - g.col, BASKETBALL_TUTORIAL.board.width));
    assert.deepEqual(cols.sort((a, b) => a - b), [1, 3, 6, 8]); // +/-1 and +/-3
  });
});
