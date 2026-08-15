import test from 'node:test';
import assert from 'node:assert/strict';

import {
  contextFor,
  stepIndex,
  isStalled,
  scriptProgress,
  nextScripted,
  TUTORIAL_SCRIPT,
  ESCHER_STEPS,
  ESCHER_OUTRO,
  revealNote,
  pieceRevelations,
  unchangedPieces,
} from '../assets/games/escher/coach.js';
import { TUTORIAL, NARROW, WIDE, SIDE } from '../assets/games/escher/presets.js';
import {
  initialGame,
  applyMove,
  isLegalMove,
  pieceAt,
  STATUS,
} from '../assets/games/escher/game.js';

const asMove = (m) => ({ from: m.from, to: m.to, promote: null });
const played = (n) => TUTORIAL_SCRIPT.slice(0, n).map(asMove);

test('the scripted opening', async (t) => {
  /*
   * The tutorial plays a fixed game and offers one move at a time, so each
   * step's text can point at something the previous moves put on the board.
   * That only works while the script is playable — and it is written against a
   * starting position that lives in presets.js, so moving a piece there could
   * silently strand it. This is the test that would catch that.
   */
  await t.test('every move is legal, in order, from the opening position', () => {
    let game = initialGame(TUTORIAL);
    TUTORIAL_SCRIPT.forEach((step, i) => {
      const man = pieceAt(game, step.from.rank, step.from.file);
      assert.ok(man, `move ${i + 1}: a piece stands on the from-square`);
      assert.equal(man.side, game.turn, `move ${i + 1}: it belongs to the side to play`);
      assert.ok(isLegalMove(TUTORIAL, game, asMove(step)), `move ${i + 1} is legal`);
      game = applyMove(TUTORIAL, game, asMove(step));
    });
    assert.equal(game.outcome.status, STATUS.PLAYING, 'and the script does not end the game');
  });

  await t.test('the sides alternate, White first', () => {
    let game = initialGame(TUTORIAL);
    for (const step of TUTORIAL_SCRIPT) {
      assert.equal(pieceAt(game, step.from.rank, step.from.file).side, game.turn);
      game = applyMove(TUTORIAL, game, asMove(step));
    }
  });

  await t.test('the four moves it advertises as captures really are', () => {
    let game = initialGame(TUTORIAL);
    const takes = [];
    TUTORIAL_SCRIPT.forEach((step, i) => {
      if (pieceAt(game, step.to.rank, step.to.file)) takes.push(i + 1);
      game = applyMove(TUTORIAL, game, asMove(step));
    });
    // Moves 7, 10 and 13 in the brief: bishop takes rook, rook takes bishop,
    // pawn takes rook across the seam.
    assert.deepEqual(takes, [7, 10, 13]);
  });

  await t.test('the three wrapping moves really do cross the seam', () => {
    const wraps = TUTORIAL_SCRIPT.map((s, i) => [i + 1, Math.abs(s.to.file - s.from.file)])
      .filter(([, span]) => span > TUTORIAL.width / 2)
      .map(([n]) => n);
    // Bishop off the right edge, rook one step sideways, knight across, and the
    // pawn's capture at the end.
    assert.deepEqual(wraps, [7, 8, 9, 13]);
  });

  await t.test('every entry names a step that exists, and carries a hint', () => {
    const ids = new Set(ESCHER_STEPS.map((s) => s.id));
    for (const [i, step] of TUTORIAL_SCRIPT.entries()) {
      assert.ok(ids.has(step.step), `move ${i + 1} belongs to a real step`);
      assert.equal(typeof step.note, 'string');
      assert.ok(step.note.length > 0, `move ${i + 1} has a note`);
    }
  });
});

test('the board is offered one move at a time', async (t) => {
  await t.test('the next move is the next unplayed one', () => {
    for (let n = 0; n < TUTORIAL_SCRIPT.length; n++) {
      assert.deepEqual(nextScripted(played(n)), TUTORIAL_SCRIPT[n], `after ${n} moves`);
    }
  });

  await t.test('and there is none left once the script is spent', () => {
    assert.equal(nextScripted(played(TUTORIAL_SCRIPT.length)), null);
  });

  await t.test('a log that diverges counts only its matching prefix', () => {
    const wrong = [...played(3), { from: { rank: 0, file: 0 }, to: { rank: 4, file: 0 } }];
    assert.equal(scriptProgress(wrong), 3);
    // Which is what makes undo work: dropping a move steps the script back.
    assert.equal(scriptProgress(played(5).slice(0, -1)), 4);
  });
});

test('the steps follow the script', async (t) => {
  await t.test('each step ends exactly where its moves run out', () => {
    const boundaries = [];
    for (let n = 0; n <= TUTORIAL_SCRIPT.length; n++) {
      boundaries.push(stepIndex(ESCHER_STEPS, contextFor(TUTORIAL, played(n))));
    }
    // Three pawn moves, two minor pieces, one rook, three wrapping, four taking.
    assert.deepEqual(boundaries, [0, 0, 0, 1, 1, 2, 3, 3, 3, 4, 4, 4, 4, 5]);
  });

  await t.test('and the last one is free play, finished by a check', () => {
    const last = ESCHER_STEPS[ESCHER_STEPS.length - 1];
    const done = contextFor(TUTORIAL, played(TUTORIAL_SCRIPT.length));
    assert.equal(last.done(done), false, 'playing the script is not enough');
    assert.equal(last.done({ ...done, hasChecked: true }), true);
    assert.equal(last.done({ ...done, isOver: true }), true, 'or a finished game');
  });

  await t.test('skipping a step moves past it without satisfying it', () => {
    const ctx = contextFor(TUTORIAL, []);
    assert.equal(stepIndex(ESCHER_STEPS, ctx, new Set(['pawns'])), 1);
  });

  await t.test('a game that ends early stalls rather than asking the impossible', () => {
    const ctx = { ...contextFor(TUTORIAL, []), isOver: true };
    assert.equal(isStalled(ESCHER_STEPS, ctx), true);
    const finished = { ...ctx, scripted: TUTORIAL_SCRIPT.length, hasChecked: true };
    assert.equal(isStalled(ESCHER_STEPS, finished), false);
  });

  await t.test('every step has an id, a hint and a test it can pass', () => {
    const ids = new Set();
    const ctx = contextFor(TUTORIAL, []);
    for (const step of ESCHER_STEPS) {
      assert.ok(step.id && !ids.has(step.id), `${step.id} is unique`);
      ids.add(step.id);
      for (const field of ['title', 'body']) {
        assert.equal(typeof step[field], 'string');
        assert.ok(step[field].length > 0, `${step.id}.${field}`);
      }
      // A scripted step gives its hint as a function of where the script is.
      const hint = typeof step.hint === 'function' ? step.hint(ctx) : step.hint;
      assert.equal(typeof hint, 'string');
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
