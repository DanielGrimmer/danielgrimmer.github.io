import test from 'node:test';
import assert from 'node:assert/strict';

import {
  contextFor,
  stepIndex,
  isStalled,
  scriptProgress,
  nextScripted,
  beatIndex,
  beatNote,
  TUTORIAL_SCRIPT,
  SCRIPT_MOVES,
  ESCHER_STEPS,
  ESCHER_OUTRO,
  revealNote,
  pieceRevelations,
  unchangedPieces,
  strangePieces,
} from '../assets/games/escher/coach.js';
import { TUTORIAL, NARROW, WIDE, SIDE } from '../assets/games/escher/presets.js';
import {
  initialGame,
  applyMove,
  isLegalMove,
  pieceAt,
  inCheck,
  STATUS,
} from '../assets/games/escher/game.js';

const asMove = (m) => ({ from: m.from, to: m.to, promote: null });
const played = (n) => SCRIPT_MOVES.slice(0, n).map(asMove);

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
    SCRIPT_MOVES.forEach((step, i) => {
      const man = pieceAt(game, step.from.rank, step.from.file);
      assert.ok(man, `move ${i + 1}: a piece stands on the from-square`);
      assert.equal(man.side, game.turn, `move ${i + 1}: it belongs to the side to play`);
      assert.ok(isLegalMove(TUTORIAL, game, asMove(step)), `move ${i + 1} is legal`);
      game = applyMove(TUTORIAL, game, asMove(step));
    });
    assert.equal(game.outcome.status, STATUS.PLAYING, 'and the script does not end the game');
  });

  await t.test('and the last one gives check, which is what step four promises', () => {
    let game = initialGame(TUTORIAL);
    SCRIPT_MOVES.forEach((step, i) => {
      game = applyMove(TUTORIAL, game, asMove(step));
      const check = inCheck(TUTORIAL, game, game.turn);
      // Nothing before the end should be checking anybody: the steps up to
      // there are about how the pieces move, not about the king.
      assert.equal(check, i === SCRIPT_MOVES.length - 1, `after move ${i + 1}`);
    });
  });

  await t.test('the captures land where the copy says they do', () => {
    let game = initialGame(TUTORIAL);
    const takes = [];
    SCRIPT_MOVES.forEach((step, i) => {
      if (pieceAt(game, step.to.rank, step.to.file)) takes.push(i + 1);
      game = applyMove(TUTORIAL, game, asMove(step));
    });
    // Rook takes bishop, pawn takes rook across the seam. The bishop's own
    // wrapping move used to be a capture too; with a rook that reaches three
    // the black rook stops a rank short, and the bishop lands in front of it.
    assert.deepEqual(takes, [10, 13]);
  });

  /*
   * The script's shape is load-bearing for the copy: step four ends on a check
   * that takes the rook two moves to deliver, because three ranks is as far as
   * a rook goes and the king is eight ranks away. Lengthen the rook again and
   * these numbers move.
   */
  await t.test('the check takes two rook moves, with a black move between them', () => {
    assert.equal(SCRIPT_MOVES.length, 17);
    const last = SCRIPT_MOVES.slice(-3);
    assert.deepEqual(last[0].from, { rank: 0, file: 0 }, 'white rook leaves rank 1');
    assert.deepEqual(last[0].to, { rank: 3, file: 0 }, 'three ranks, no further');
    assert.deepEqual(last[2].from, last[0].to, 'and the same rook goes on');
    assert.deepEqual(last[2].to, { rank: 6, file: 0 }, 'three more');
  });

  await t.test('the wrapping moves really do cross the seam', () => {
    const wraps = SCRIPT_MOVES.map((s, i) => [i + 1, Math.abs(s.to.file - s.from.file)])
      .filter(([, span]) => span > TUTORIAL.width / 2)
      .map(([n]) => n);
    assert.deepEqual(wraps, [7, 8, 9, 13]);
  });

  await t.test('a select beat points at the piece the next move uses', () => {
    for (const [i, beat] of TUTORIAL_SCRIPT.entries()) {
      if (beat.kind !== 'select') continue;
      const next = TUTORIAL_SCRIPT[i + 1];
      assert.ok(next && next.kind === 'move', `beat ${i} is followed by a move`);
      assert.deepEqual(beat.from, next.from, `beat ${i} names that move's piece`);
      assert.equal(beat.to, null, 'and asks for no destination');
    }
  });

  await t.test('every beat names a step that exists, and carries an instruction', () => {
    const ids = new Set(ESCHER_STEPS.map((s) => s.id));
    for (const [i, beat] of TUTORIAL_SCRIPT.entries()) {
      assert.ok(ids.has(beat.step), `beat ${i} belongs to a real step`);
      assert.ok(['move', 'select'].includes(beat.kind));
      assert.equal(typeof beat.note, 'string');
      assert.ok(beat.note.length > 0, `beat ${i} has a note`);
    }
  });
});

test('the board is offered one move at a time', async (t) => {
  await t.test('the next move is the next unplayed one', () => {
    for (let n = 0; n < SCRIPT_MOVES.length; n++) {
      assert.deepEqual(nextScripted(played(n)), SCRIPT_MOVES[n], `after ${n} moves`);
    }
  });

  await t.test('and there is none left once the script is spent', () => {
    assert.equal(nextScripted(played(SCRIPT_MOVES.length)), null);
  });

  await t.test('a log that diverges counts only its matching prefix', () => {
    const wrong = [...played(3), { from: { rank: 0, file: 0 }, to: { rank: 4, file: 0 } }];
    assert.equal(scriptProgress(wrong), 3);
    // Which is what makes undo work: dropping a move steps the script back.
    assert.equal(scriptProgress(played(5).slice(0, -1)), 4);
  });
});

test('the instructions advance one at a time', async (t) => {
  await t.test('a select beat is finished by picking that piece up', () => {
    const first = TUTORIAL_SCRIPT[0];
    assert.equal(first.kind, 'select');
    assert.equal(beatIndex([], null), 0, 'and not before');
    assert.equal(beatIndex([], first.from), 1, 'and is, once the piece is held');
    assert.equal(beatIndex([], { rank: 0, file: 0 }), 0, 'holding something else does nothing');
  });

  await t.test('a move beat ignores the selection entirely', () => {
    // Beat 1 is a move; picking its piece up does not satisfy it.
    assert.equal(beatIndex([], TUTORIAL_SCRIPT[1].from), 1);
    assert.equal(beatIndex(played(1), null), 2);
  });

  await t.test('playing the whole script walks every beat exactly once', () => {
    const seen = [];
    let moves = [];
    let selected = null;
    for (let guard = 0; guard < 50; guard++) {
      const i = beatIndex(moves, selected);
      if (i >= TUTORIAL_SCRIPT.length) break;
      seen.push(i);
      const beat = TUTORIAL_SCRIPT[i];
      if (beat.kind === 'select') selected = beat.from;
      else {
        moves = [...moves, asMove(beat)];
        selected = null;
      }
    }
    assert.deepEqual(seen, TUTORIAL_SCRIPT.map((_, i) => i));
  });

  await t.test('the hint is whichever instruction is outstanding', () => {
    const ctx = contextFor(TUTORIAL, [], null);
    assert.equal(beatNote(ctx), TUTORIAL_SCRIPT[0].note);
    const after = contextFor(TUTORIAL, played(SCRIPT_MOVES.length), null);
    assert.equal(beatNote(after), '', 'and nothing once the script is done');
  });
});

test('the steps follow the script', async (t) => {
  await t.test('each step ends exactly where its beats run out', () => {
    const boundaries = [];
    for (let n = 0; n <= SCRIPT_MOVES.length; n++) {
      boundaries.push(stepIndex(ESCHER_STEPS, contextFor(TUTORIAL, played(n), null)));
    }
    // Three pawn moves, three showing jumpiness, three across the seam, eight
    // to the check. The first step needs its select beat too, hence the
    // leading 0.
    assert.deepEqual(
      boundaries,
      [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4]
    );
  });

  await t.test('and there are four of them', () => {
    assert.equal(ESCHER_STEPS.length, 4);
    assert.deepEqual(
      ESCHER_STEPS.map((s) => s.id),
      ['pawns', 'jumpy', 'wrap', 'check']
    );
  });

  await t.test('skipping a step moves past it without satisfying it', () => {
    const ctx = contextFor(TUTORIAL, [], null);
    assert.equal(stepIndex(ESCHER_STEPS, ctx, new Set(['pawns'])), 1);
  });

  await t.test('a game that ends early stalls rather than asking the impossible', () => {
    const ctx = { ...contextFor(TUTORIAL, [], null), isOver: true };
    assert.equal(isStalled(ESCHER_STEPS, ctx), true);
    const finished = { ...ctx, beat: TUTORIAL_SCRIPT.length };
    assert.equal(isStalled(ESCHER_STEPS, finished), false);
  });

  await t.test('every step has an id, a hint and a test it can pass', () => {
    const ids = new Set();
    const ctx = contextFor(TUTORIAL, [], null);
    for (const step of ESCHER_STEPS) {
      assert.ok(step.id && !ids.has(step.id), `${step.id} is unique`);
      ids.add(step.id);
      for (const field of ['title', 'body']) {
        assert.equal(typeof step[field], 'string');
        assert.ok(step[field].length > 0, `${step.id}.${field}`);
      }
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
    assert.deepEqual(narrow, [
      'their knights moved like bishops',
      'their bishops like knights',
    ]);
    assert.deepEqual(unchangedPieces(NARROW), ['rook']);
    assert.deepEqual(strangePieces(NARROW), ['pawn', 'king']);
  });

  // The same duality, one more piece to be strange about — which is the whole
  // reason this sentence is generated rather than typed out.
  await t.test('the eight-file board gets its queen named too', () => {
    assert.deepEqual(pieceRevelations(WIDE), pieceRevelations(NARROW));
    assert.deepEqual(strangePieces(WIDE), ['pawn', 'king', 'queen']);
    assert.match(revealNote(WIDE, SIDE.WHITE).body, /pawns, kings and queens were very strange/);
    assert.match(revealNote(NARROW, SIDE.WHITE).body, /pawns and kings were very strange/);
  });

  await t.test('and the tutorial board, where nothing swaps, produces no swaps', () => {
    assert.deepEqual(pieceRevelations(TUTORIAL), []);
    assert.deepEqual(strangePieces(TUTORIAL), []);
    assert.equal(unchangedPieces(TUTORIAL).length, Object.keys(TUTORIAL.duality).length);
  });

  await t.test('both players are told they had the normal pieces', () => {
    for (const seat of [SIDE.WHITE, SIDE.BLACK]) {
      const note = revealNote(NARROW, seat);
      assert.match(note.title, /Both Playing with the Normal Pieces/);
      assert.match(note.body, /The left-hand one is the board you were looking at/);
      assert.match(note.body, /their knights moved like bishops; their bishops like knights/);
    }
  });

  await t.test('a spectator is not addressed as a player', () => {
    const note = revealNote(WIDE, null);
    assert.ok(!/the game you just played/.test(note.body));
    assert.ok(!/your opponent/.test(note.body));
    assert.match(note.body, /the game that has just finished/);
  });

  // Reversed once already, and the two are easy to swap back: the claim is
  // that the choice between the two descriptions is a matter of where you
  // started, not of which one is entitled to be called true.
  await t.test('the closing line has the Latin the right way round', () => {
    assert.match(revealNote(NARROW, SIDE.WHITE).after, /quid facti rather than quid juris/);
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
