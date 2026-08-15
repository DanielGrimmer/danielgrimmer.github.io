import test from 'node:test';
import assert from 'node:assert/strict';

import {
  LIMITS,
  DEFAULT_DIALS,
  PUBLISHED,
  normaliseDials,
  turn,
  publishedId,
  boardFromDials,
  describeBoard,
  verdictFor,
  encodeDials,
  decodeDials,
  queenIsCompulsory,
} from '../assets/games/escher/sandbox.js';
import { NARROW, WIDE, SIDE } from '../assets/games/escher/presets.js';
import { PIECE } from '../assets/games/escher/pieces.js';

test('the dials never produce a board the engine will refuse', async (t) => {
  /*
   * Two people are editing one document over a network, so a briefly
   * nonsensical value has to survive rather than throw. Every one of these was
   * a real shape a half-typed input box can be in.
   */
  await t.test('nonsense clamps instead of throwing', () => {
    for (const bad of [
      {},
      null,
      { width: 7 },
      { width: '5' },
      { height: 'tall' },
      { height: -100 },
      { height: 1e9 },
      { rookRange: 0 },
      { rookRange: NaN },
      { knightWiden: 99 },
      { bishopRange: Infinity },
      { queen: 'yes' },
    ]) {
      const dials = normaliseDials(bad ?? undefined);
      assert.ok(LIMITS.widths.includes(dials.width));
      assert.ok(dials.height >= LIMITS.height.min && dials.height <= LIMITS.height.max);
      assert.doesNotThrow(() => boardFromDials(dials), JSON.stringify(bad));
    }
  });

  await t.test('and a board built from any of them still names its files agreeably', () => {
    // `makeBoard` refuses a board whose two players disagree, so reaching this
    // point at all is the assertion; the check is restated for the reader.
    for (const width of LIMITS.widths) {
      for (let height = LIMITS.height.min; height <= LIMITS.height.max; height++) {
        const board = boardFromDials({ ...DEFAULT_DIALS, width, height });
        for (let f = 0; f < width; f++) {
          assert.equal(
            board.files[SIDE.BLACK][board.lenses[SIDE.BLACK].toView(f)],
            board.files[SIDE.WHITE][f]
          );
        }
      }
    }
  });

  await t.test('turning one dial leaves the others alone', () => {
    const next = turn(DEFAULT_DIALS, 'rookRange', 2);
    assert.equal(next.rookRange, 2);
    for (const key of Object.keys(DEFAULT_DIALS)) {
      if (key !== 'rookRange') assert.equal(next[key], DEFAULT_DIALS[key], key);
    }
  });

  await t.test('a round trip over the wire changes nothing', () => {
    for (const dials of Object.values(PUBLISHED)) {
      assert.deepEqual(decodeDials(encodeDials(dials)), normaliseDials(dials));
    }
    // And a document written by some other version still lands somewhere legal.
    assert.deepEqual(decodeDials({ width: 5, height: 10, mystery: true }).width, 5);
  });
});

test('the sandbox opens on the published games', async (t) => {
  await t.test('and rebuilds them exactly', () => {
    for (const [id, published] of [
      ['escher-5x10', NARROW],
      ['escher-8x8', WIDE],
    ]) {
      const built = boardFromDials(PUBLISHED[id]);
      assert.equal(built.width, published.width);
      assert.equal(built.height, published.height);
      assert.deepEqual(built.duality, published.duality);
      assert.deepEqual(
        built.placement.map((m) => `${m.type}${m.side}${m.rank},${m.file}`).sort(),
        published.placement.map((m) => `${m.type}${m.side}${m.rank},${m.file}`).sort()
      );
    }
  });

  await t.test('and recognises them when it sees them', () => {
    assert.equal(publishedId(PUBLISHED['escher-5x10']), 'escher-5x10');
    assert.equal(publishedId(PUBLISHED['escher-8x8']), 'escher-8x8');
    assert.equal(publishedId(turn(PUBLISHED['escher-8x8'], 'rookRange', 3)), null);
  });
});

test('the read-out says what a dial just cost', async (t) => {
  await t.test('the published games keep both halves of the design', () => {
    for (const dials of Object.values(PUBLISHED)) {
      const verdict = verdictFor(boardFromDials(dials));
      assert.match(verdict, /keep both halves/);
    }
  });

  await t.test('shortening the rook on eight files reproduces the printed defect', () => {
    // The V3 booklet gave the rook range 2, which is not a union of orbits of
    // the duality number on eight files.
    const board = boardFromDials(turn(PUBLISHED['escher-8x8'], 'rookRange', 2));
    assert.equal(board.duality[PIECE.ROOK].selfDual, false);
    assert.match(verdictFor(board), /defect the printed rules had/);
    // The swap survives, which is why the defect was easy to miss.
    assert.equal(board.duality[PIECE.KNIGHT].dualTo, PIECE.BISHOP);
  });

  await t.test('un-widening the knight on eight files collapses the swap', () => {
    const board = boardFromDials(turn(PUBLISHED['escher-8x8'], 'knightWiden', 0));
    assert.equal(board.duality[PIECE.KNIGHT].dualTo, null);
    assert.match(verdictFor(board), /no longer trade places/);
  });

  await t.test('and widening it on five files does the same', () => {
    const board = boardFromDials(turn(PUBLISHED['escher-5x10'], 'knightWiden', 1));
    assert.equal(board.duality[PIECE.KNIGHT].dualTo, null);
  });

  await t.test('every piece gets exactly one line, in a fixed order', () => {
    const narrow = describeBoard(boardFromDials(PUBLISHED['escher-5x10']));
    assert.deepEqual(
      narrow.map((r) => r.piece),
      ['pawn', 'knight', 'bishop', 'rook', 'king']
    );
    // Switching the queen on adds a line and moves nothing else.
    const withQueen = describeBoard(boardFromDials(turn(PUBLISHED['escher-5x10'], 'queen', true)));
    assert.deepEqual(
      withQueen.map((r) => r.piece),
      ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']
    );
  });

  await t.test('the queen is a rook-and-knight compound, and says so', () => {
    const rows = describeBoard(boardFromDials(PUBLISHED['escher-8x8']));
    const queen = rows.find((r) => r.piece === 'queen');
    // Not one of ours, so it reads as "nothing either of you has" — which is
    // true, and better than naming a piece that is not on the board.
    assert.equal(queen.dualTo, null);
    assert.match(queen.text, /nothing either of you has/);
  });
});

test('a dial can never leave a man on the board with no way to move', async (t) => {
  /*
   * The bug this is here for: switching from five files to eight kept `queen:
   * false` from the narrow dials, but the eight-file army has a queen in it.
   * `board.pieces.queen` was then undefined, and undefined travelled as far as
   * check detection before anything complained.
   */
  await t.test('switching to the eight-file board brings the queen with it', () => {
    const wide = turn({ ...DEFAULT_DIALS, queen: false }, 'width', 8);
    assert.equal(wide.queen, true);
    assert.doesNotThrow(() => boardFromDials(wide));
  });

  await t.test('and it stays a real choice on the narrow board', () => {
    assert.equal(queenIsCompulsory(5), false);
    assert.equal(queenIsCompulsory(8), true);
    assert.equal(normaliseDials({ ...DEFAULT_DIALS, queen: false }).queen, false);
    assert.equal(normaliseDials({ ...DEFAULT_DIALS, queen: true }).queen, true);
    // Turning it on there means a pawn may become one.
    assert.ok(boardFromDials({ ...DEFAULT_DIALS, queen: true }).promotesTo.includes(PIECE.QUEEN));
    assert.ok(!boardFromDials(DEFAULT_DIALS).promotesTo.includes(PIECE.QUEEN));
  });

  await t.test('every reachable dial setting builds a board that can be played', () => {
    for (const width of LIMITS.widths) {
      for (const queen of [false, true]) {
        for (const jumpyForward of [false, true]) {
          for (const knightWiden of [0, 1, 2, 3]) {
            const board = boardFromDials({
              ...DEFAULT_DIALS,
              width,
              queen,
              jumpyForward,
              knightWiden,
            });
            for (const { type } of board.placement) {
              assert.ok(board.pieces[type], `${width}/${queen}: a ${type} with no moves`);
            }
          }
        }
      }
    }
  });
});
