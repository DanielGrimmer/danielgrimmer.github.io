import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isWrapMove,
  leapsSomething,
  contextFor,
  stepIndex,
  isStalled,
  ESCHER_STEPS,
  ESCHER_OUTRO,
  revealNote,
  pieceRevelations,
  unchangedPieces,
} from '../assets/games/escher/coach.js';
import { TUTORIAL, NARROW, WIDE, SIDE } from '../assets/games/escher/presets.js';
import { initialGame, applyMove, legalMoves, STATUS } from '../assets/games/escher/game.js';

/** Walk the board, preferring moves that satisfy a predicate, to build a log. */
function playUntil(board, wants, limit = 60) {
  const moves = [];
  let game = initialGame(board);
  while (game.outcome.status === STATUS.PLAYING && moves.length < limit) {
    const options = legalMoves(board, game);
    const next = options.find((m) => wants(board, game, m)) ?? options[0];
    moves.push(next);
    game = applyMove(board, game, next);
    if (wants(board, game, next) && contextFor(board, moves)) break;
  }
  return moves;
}

test('what the tutorial watches for', async (t) => {
  await t.test('a wrap is a file jump longer than half the board', () => {
    assert.equal(isWrapMove({ file: 0 }, { file: 4 }, 5), true);
    assert.equal(isWrapMove({ file: 4 }, { file: 0 }, 5), true);
    assert.equal(isWrapMove({ file: 1 }, { file: 3 }, 5), false);
    assert.equal(isWrapMove({ file: 0 }, { file: 1 }, 5), false);
  });

  await t.test('a leap needs something in the way, and a straight line to leap along', () => {
    const men = new Map([
      ['1,2', { type: 'pawn', side: 0 }],
      ['2,2', { type: 'pawn', side: 0 }],
    ]);
    const before = { men };
    // Straight up the file, over the pawn on rank 1.
    assert.equal(leapsSomething(before, { from: { rank: 0, file: 2 }, to: { rank: 3, file: 2 } }, 5), true);
    // One square: nothing in between at all.
    assert.equal(leapsSomething(before, { from: { rank: 0, file: 2 }, to: { rank: 1, file: 2 } }, 5), false);
    // A knight's move has no inside, so it never counts as a leap.
    assert.equal(leapsSomething(before, { from: { rank: 0, file: 2 }, to: { rank: 2, file: 3 } }, 5), false);
    // An empty line is not a leap either.
    assert.equal(leapsSomething({ men: new Map() }, { from: { rank: 0, file: 0 }, to: { rank: 3, file: 0 } }, 5), false);
  });

  await t.test('the file step is measured the short way round the cylinder', () => {
    // On five files, 0 -> 4 is one step left, not four steps right, so there is
    // nothing in between and nothing to leap.
    const men = new Map([['0,1', { type: 'pawn', side: 0 }], ['0,2', { type: 'pawn', side: 0 }]]);
    assert.equal(leapsSomething({ men }, { from: { rank: 0, file: 0 }, to: { rank: 0, file: 4 } }, 5), false);
  });

  await t.test('an empty log has satisfied nothing', () => {
    const ctx = contextFor(TUTORIAL, []);
    assert.deepEqual(ctx, {
      moveCount: 0,
      hasWrapped: false,
      hasLeapt: false,
      hasChecked: false,
      hasTaken: false,
      isOver: false,
      outcome: ctx.outcome,
    });
    assert.equal(stepIndex(ESCHER_STEPS, ctx), 0);
  });

  await t.test('the very first move leaps, because everything jumps', () => {
    // Both back ranks are behind two ranks of pawns, so a rook or bishop
    // opening necessarily passes over something. This is the step-2 promise.
    const moves = playUntil(TUTORIAL, (board, game, m) => m.from.rank === 0);
    const ctx = contextFor(TUTORIAL, moves.slice(0, 1));
    assert.equal(ctx.hasLeapt, true, 'a back-rank piece got out on move one');
  });

  await t.test('the steps advance, and only ever forwards', () => {
    let seen = 0;
    const facts = [
      { moveCount: 0, hasLeapt: false, hasTaken: false, hasWrapped: false, hasChecked: false, isOver: false },
      { moveCount: 1, hasLeapt: false, hasTaken: false, hasWrapped: false, hasChecked: false, isOver: false },
      { moveCount: 2, hasLeapt: true, hasTaken: false, hasWrapped: false, hasChecked: false, isOver: false },
      { moveCount: 3, hasLeapt: true, hasTaken: true, hasWrapped: false, hasChecked: false, isOver: false },
      { moveCount: 4, hasLeapt: true, hasTaken: true, hasWrapped: true, hasChecked: false, isOver: false },
      { moveCount: 5, hasLeapt: true, hasTaken: true, hasWrapped: true, hasChecked: true, isOver: false },
    ];
    for (const ctx of facts) {
      const at = stepIndex(ESCHER_STEPS, ctx);
      assert.ok(at >= seen, `step ${at} after ${seen}`);
      seen = at;
    }
    assert.equal(seen, ESCHER_STEPS.length, 'the last fact finishes the tutorial');
  });

  await t.test('skipping a step moves past it without satisfying it', () => {
    const ctx = contextFor(TUTORIAL, []);
    assert.equal(stepIndex(ESCHER_STEPS, ctx, new Set(['welcome'])), 1);
  });

  await t.test('a game that ends early stalls rather than asking the impossible', () => {
    const ctx = { moveCount: 4, hasLeapt: false, hasTaken: false, hasWrapped: false, hasChecked: true, isOver: true };
    assert.equal(isStalled(ESCHER_STEPS, ctx), true);
    // And a finished tutorial is not stalled, however the game ended.
    const done = { ...ctx, hasLeapt: true, hasTaken: true, hasWrapped: true };
    assert.equal(isStalled(ESCHER_STEPS, done), false);
  });

  await t.test('every step has an id, a hint and a test it can pass', () => {
    const ids = new Set();
    for (const step of ESCHER_STEPS) {
      assert.ok(step.id && !ids.has(step.id), `${step.id} is unique`);
      ids.add(step.id);
      for (const field of ['title', 'body', 'hint']) {
        assert.equal(typeof step[field], 'string');
        assert.ok(step[field].length > 0, `${step.id}.${field}`);
      }
      assert.equal(typeof step.done, 'function');
    }
  });

  await t.test('the way out goes straight to the game', () => {
    assert.match(ESCHER_OUTRO.href, /EscherChessGameV4\.0\.html$/);
    assert.match(ESCHER_OUTRO.body, /separate screens/);
  });
});

test('the reveal describes the board it is actually on', async (t) => {
  await t.test('the swaps are read off the board, not written down', () => {
    const narrow = pieceRevelations(NARROW);
    assert.ok(narrow.some((l) => /knight has been moving like your bishop/.test(l)));
    assert.ok(narrow.some((l) => /bishop has been moving like your knight/.test(l)));
    // A piece that is dual to nothing gets no line: naming it teaches nobody.
    assert.ok(!narrow.some((l) => /king/.test(l)));
    assert.deepEqual(unchangedPieces(NARROW), ['rook']);
  });

  await t.test('and the tutorial board, where nothing swaps, produces no swaps', () => {
    assert.deepEqual(pieceRevelations(TUTORIAL), []);
    assert.equal(unchangedPieces(TUTORIAL).length, Object.keys(TUTORIAL.duality).length);
  });

  await t.test('each seat is told its own file order, and its opponent’s', () => {
    const white = revealNote(NARROW, SIDE.WHITE);
    assert.match(white.body, /ran ARMED/);
    assert.match(white.body, /theirs ran DREAM/);
    const black = revealNote(NARROW, SIDE.BLACK);
    assert.match(black.body, /ran DREAM/);
    assert.match(black.body, /theirs ran ARMED/);
  });

  await t.test('a spectator is not addressed as a player', () => {
    const note = revealNote(WIDE, null);
    assert.ok(!/the game you just played/.test(note.body));
    assert.match(note.body, /the game that has just finished/);
  });

  await t.test('the note has all three parts, everywhere', () => {
    for (const board of [NARROW, WIDE]) {
      for (const seat of [SIDE.WHITE, SIDE.BLACK, null]) {
        const note = revealNote(board, seat);
        for (const field of ['title', 'body', 'after']) {
          assert.equal(typeof note[field], 'string');
          assert.ok(note[field].trim().length > 0, `${board.id}/${seat}/${field}`);
        }
      }
    }
  });
});
