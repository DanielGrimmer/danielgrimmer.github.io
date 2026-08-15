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
  NARROW_TUTORIAL,
  WIDE_TUTORIAL,
  TUTORIALS,
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

import { legalMovesFrom } from '../assets/games/escher/game.js';

const asMove = (m) => ({ from: m.from, to: m.to, promote: null });
/** The first `n` scripted moves of a tutorial, as a log. */
const log = (t, n) => t.moves.slice(0, n).map(asMove);

const BOTH = [
  ['the 5x10 tutorial', NARROW_TUTORIAL],
  ['the 8x8 tutorial', WIDE_TUTORIAL],
];

/*
 * Each tutorial plays a fixed game and offers one move at a time, so every
 * step's text can point at something the previous moves put on the board. That
 * only works while the script is playable — and both are written against
 * starting positions that live in presets.js, so moving a piece there, or
 * changing what a piece does, could silently strand one. These are the tests
 * that would catch it, and they run over both scripts.
 */
for (const [name, tut] of BOTH) {
  test(`${name}: the scripted opening`, async (t) => {
    const board = tut.board;

    await t.test('every move is legal, in order, from the opening position', () => {
      let game = initialGame(board);
      tut.moves.forEach((step, i) => {
        const man = pieceAt(game, step.from.rank, step.from.file);
        assert.ok(man, `move ${i + 1}: a piece stands on the from-square`);
        assert.equal(man.side, game.turn, `move ${i + 1}: it belongs to the side to play`);
        assert.ok(isLegalMove(board, game, asMove(step)), `move ${i + 1} is legal`);
        game = applyMove(board, game, asMove(step));
      });
      assert.equal(game.outcome.status, STATUS.PLAYING, 'and the script does not end the game');
    });

    await t.test('and the last move gives check, which is what the last step promises', () => {
      let game = initialGame(board);
      tut.moves.forEach((step, i) => {
        game = applyMove(board, game, asMove(step));
        // Nothing before the end should be checking anybody: the steps up to
        // there are about how the pieces move, not about the king.
        assert.equal(
          inCheck(board, game, game.turn),
          i === tut.moves.length - 1,
          `after move ${i + 1}`
        );
      });
    });

    await t.test('a select beat points at the piece the next move uses', () => {
      for (const [i, beat] of tut.script.entries()) {
        if (beat.kind !== 'select') continue;
        const next = tut.script[i + 1];
        assert.ok(next && next.kind === 'move', `beat ${i} is followed by a move`);
        assert.deepEqual(beat.from, next.from, `beat ${i} names that move's piece`);
        assert.equal(beat.to, null, 'and asks for no destination');
      }
    });

    await t.test('every beat names a step that exists, and carries an instruction', () => {
      const ids = new Set(tut.steps.map((s) => s.id));
      for (const [i, beat] of tut.script.entries()) {
        assert.ok(ids.has(beat.step), `beat ${i} belongs to a real step`);
        assert.ok(['move', 'select'].includes(beat.kind));
        assert.equal(typeof beat.note, 'string');
        assert.ok(beat.note.length > 0, `beat ${i} has a note`);
      }
    });

    // Every step must be reachable and finishable, or the panel sticks.
    await t.test('the steps run out exactly when the script does', () => {
      const ids = tut.steps.map((s) => s.id);
      assert.deepEqual([...new Set(tut.script.map((b) => b.step))], ids, 'in script order');
      const done = contextFor(board, tut.script, log(tut, tut.moves.length), null);
      assert.equal(stepIndex(tut.steps, done), tut.steps.length);
      const start = contextFor(board, tut.script, [], null);
      assert.equal(stepIndex(tut.steps, start), 0);
    });

    await t.test('the board offers the next unplayed move, and then nothing', () => {
      for (let n = 0; n < tut.moves.length; n++) {
        assert.deepEqual(nextScripted(tut.script, log(tut, n)), tut.moves[n], `after ${n}`);
      }
      assert.equal(nextScripted(tut.script, log(tut, tut.moves.length)), null);
    });

    await t.test('playing the whole script walks every beat exactly once', () => {
      const seen = [];
      let moves = [];
      let selected = null;
      for (let guard = 0; guard < 60; guard++) {
        const i = beatIndex(tut.script, moves, selected);
        if (i >= tut.script.length) break;
        seen.push(i);
        const beat = tut.script[i];
        if (beat.kind === 'select') selected = beat.from;
        else {
          moves = [...moves, asMove(beat)];
          selected = null;
        }
      }
      assert.deepEqual(seen, tut.script.map((_, i) => i));
    });

    await t.test('every step has an id, a hint and a test it can pass', () => {
      const ids = new Set();
      const ctx = contextFor(board, tut.script, [], null);
      for (const step of tut.steps) {
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

    await t.test('the way out goes somewhere real, and says what it is', () => {
      for (const field of ['title', 'body', 'href', 'cta']) {
        assert.equal(typeof tut.outro[field], 'string');
        assert.ok(tut.outro[field].length > 0, field);
      }
      assert.match(tut.outro.href, /EscherChessGameV4\.0\.html/);
      assert.match(tut.outro.body, /separate|Separate/);
    });
  });
}

test('the two tutorials are told apart by the board they prepare you for', async (t) => {
  await t.test('keyed by the real board, not the practice one', () => {
    assert.equal(TUTORIALS[NARROW.id], NARROW_TUTORIAL);
    assert.equal(TUTORIALS[WIDE.id], WIDE_TUTORIAL);
    assert.equal(TUTORIALS[NARROW_TUTORIAL.board.id], undefined);
  });

  // Each practice board is its own real board with the duality switched off,
  // so nothing taught on it can be false of either army.
  await t.test('each practises on a board of the right size, with no duality', () => {
    for (const [real, tut] of [[NARROW, NARROW_TUTORIAL], [WIDE, WIDE_TUTORIAL]]) {
      assert.equal(tut.board.width, real.width);
      assert.equal(tut.board.height, real.height);
      assert.ok(
        Object.values(tut.board.duality).every((d) => d.selfDual),
        `${tut.board.id}: every piece is its own dual`
      );
    }
  });

  await t.test('and each sends you on to its own game', () => {
    assert.ok(!NARROW_TUTORIAL.outro.href.includes('board='), 'the narrow game is the default');
    assert.match(WIDE_TUTORIAL.outro.href, /board=escher-8x8/);
  });
});

/* ------------------------------------------------ the narrow script in detail ---- */

test('the 5x10 script, move by move', async (t) => {
  const tut = NARROW_TUTORIAL;

  await t.test('the captures land where the copy says they do', () => {
    let game = initialGame(TUTORIAL);
    const takes = [];
    tut.moves.forEach((step, i) => {
      if (pieceAt(game, step.to.rank, step.to.file)) takes.push(i + 1);
      game = applyMove(TUTORIAL, game, asMove(step));
    });
    // Rook takes bishop, pawn takes rook across the seam. The bishop's own
    // wrapping move used to be a capture too; with a rook that reaches three
    // the black rook stops a rank short, and the bishop lands in front of it.
    assert.deepEqual(takes, [10, 13]);
  });

  /*
   * Step four ends on a check that takes the rook two moves to deliver, because
   * three ranks is as far as a rook goes and the king is eight ranks away.
   * Lengthen the rook again and these numbers move.
   */
  await t.test('the check takes two rook moves, with a black move between them', () => {
    assert.equal(tut.moves.length, 17);
    const last = tut.moves.slice(-3);
    assert.deepEqual(last[0].from, { rank: 0, file: 0 }, 'white rook leaves rank 1');
    assert.deepEqual(last[0].to, { rank: 3, file: 0 }, 'three ranks, no further');
    assert.deepEqual(last[2].from, last[0].to, 'and the same rook goes on');
    assert.deepEqual(last[2].to, { rank: 6, file: 0 }, 'three more');
  });

  await t.test('the wrapping moves really do cross the seam', () => {
    const wraps = tut.moves
      .map((s, i) => [i + 1, Math.abs(s.to.file - s.from.file)])
      .filter(([, span]) => span > TUTORIAL.width / 2)
      .map(([n]) => n);
    assert.deepEqual(wraps, [7, 8, 9, 13]);
  });

  await t.test('each step ends exactly where its beats run out', () => {
    const boundaries = [];
    for (let n = 0; n <= tut.moves.length; n++) {
      boundaries.push(stepIndex(tut.steps, contextFor(TUTORIAL, tut.script, log(tut, n), null)));
    }
    // Three pawn moves, three showing jumpiness, three across the seam, eight
    // to the check. The first step needs its select beat too, hence the
    // leading 0.
    assert.deepEqual(boundaries, [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4]);
  });

  await t.test('and there are four steps', () => {
    assert.deepEqual(tut.steps.map((s) => s.id), ['pawns', 'jumpy', 'wrap', 'check']);
  });
});

/* -------------------------------------------------- the wide script in detail ---- */

/*
 * What the second tutorial exists for. The reader has played a whole game by
 * now; the only things they have not met are the knight, which is a file wider
 * on eight files, and the queen, who is not on the narrow board at all.
 */
test('the 8x8 script teaches the two pieces that are new', async (t) => {
  const tut = WIDE_TUTORIAL;
  const board = tut.board;
  /** The position a beat is looked at from: every move before it, played. */
  const positionAt = (beat) => {
    let game = initialGame(board);
    for (const b of tut.script.slice(0, tut.script.indexOf(beat))) {
      if (b.kind === 'move') game = applyMove(board, game, asMove(b));
    }
    return game;
  };
  const selectBeat = (step) => tut.script.find((b) => b.kind === 'select' && b.step === step);

  await t.test('three steps: the board, the queen, the knight', () => {
    assert.deepEqual(tut.steps.map((s) => s.id), ['board', 'queen', 'knight']);
  });

  // Selected on an otherwise empty rank, so the gap is unmistakable: three
  // squares each way on eight files reaches six of the seven other files.
  await t.test('the queen is shown where her blind square is visible', () => {
    const beat = selectBeat('queen');
    const game = positionAt(beat);
    assert.equal(pieceAt(game, beat.from.rank, beat.from.file).type, 'queen');
    const rank = new Set(
      legalMovesFrom(board, game, beat.from)
        .filter((s) => s.rank === beat.from.rank)
        .map((s) => s.file)
    );
    assert.equal(rank.size, 6, 'six of the seven other files');
    assert.equal(rank.has((beat.from.file + 4) % 8), false, 'and never the one opposite');
  });

  // Eight destinations, none of them a two-and-one: that is the whole lesson.
  await t.test('the knight is shown standing in the open, with all eight', () => {
    const beat = selectBeat('knight');
    const game = positionAt(beat);
    assert.equal(pieceAt(game, beat.from.rank, beat.from.file).type, 'knight');
    const to = legalMovesFrom(board, game, beat.from);
    assert.equal(to.length, 8);
    for (const s of to) {
      const dr = Math.abs(s.rank - beat.from.rank);
      const df = Math.min((s.file - beat.from.file + 8) % 8, (beat.from.file - s.file + 8) % 8);
      assert.ok(
        (dr === 2 && df === 2) || (dr === 1 && df === 3),
        `${dr},${df} is two-and-two or one-and-three`
      );
    }
  });

  await t.test('and the check at the end is the knight, from a wrapping square', () => {
    const last = tut.script[tut.script.length - 1];
    const game = positionAt(last);
    assert.equal(pieceAt(game, last.from.rank, last.from.file).type, 'knight');
    const df = Math.min((last.to.file - last.from.file + 8) % 8, (last.from.file - last.to.file + 8) % 8);
    assert.equal(df, 3, 'three files, which on eight is across the seam');
    const after = applyMove(board, game, asMove(last));
    assert.ok(inCheck(board, after, after.turn));
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
