import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PIECE,
  makePieces,
  assertDualBlocking,
  knightMoves,
  bishopMoves,
  rookMoves,
  pawnMoves,
  destinations,
  throughLens,
  dualityReport,
  describeDuality,
  ESCHER_DIALS,
  NARROW_PIECES,
  WIDE_PIECES,
} from '../assets/games/escher/pieces.js';

/**
 * How White reads Black's file steps: the inverse of Black's lens multiplier
 * (3 on the narrow board, 5 on the wide one). `escher-game.test.mjs` pins these
 * two numbers against the boards themselves, so that changing a lens cannot
 * quietly leave this file testing a duality nobody plays.
 */
const NARROW = { width: 5, duality: 2 };
const WIDE = { width: 8, duality: 5 };

const same = (a, b, width) => {
  const x = [...destinations(a, width)].sort();
  const y = [...destinations(b, width)].sort();
  return x.length === y.length && x.every((k, i) => k === y[i]);
};

test('the constraint the duality puts on this file', async (t) => {
  /*
   * The lens preserves displacements but not the squares in between. Ranks are
   * never relabelled, so only a move with no file step passes over squares both
   * players agree about.
   */
  await t.test('a blockable move with a sideways step is refused outright', () => {
    const wrong = {
      [PIECE.ROOK]: [
        { step: [0, 2], jumpy: false, requiresCapture: false, forbidsCapture: false },
      ],
    };
    assert.throws(() => assertDualBlocking(wrong), RangeError);
    assert.throws(() => assertDualBlocking(wrong), /disagree about which squares/);
  });

  await t.test('and every published piece passes it', () => {
    assert.doesNotThrow(() => assertDualBlocking(NARROW_PIECES));
    assert.doesNotThrow(() => assertDualBlocking(WIDE_PIECES));
  });

  await t.test('a rook that is blockable forward is fine — ranks are not relabelled', () => {
    assert.doesNotThrow(() => makePieces({ ...ESCHER_DIALS.narrow, jumpyForward: false }));
    const blockable = rookMoves({ range: 4, jumpyForward: false });
    for (const m of blockable) {
      if (!m.jumpy) assert.equal(m.step[1], 0, 'only file-step-zero moves may be blockable');
    }
  });

  await t.test('nothing a pawn does breaks the constraint, either way round', () => {
    for (const jumpyForward of [true, false]) {
      for (const m of pawnMoves({ jumpyForward })) {
        if (!m.jumpy) assert.equal(m.step[1], 0, 'only file-step-zero moves may be blockable');
        if (m.requiresCapture) assert.ok(m.jumpy, 'a diagonal take must jump');
      }
    }
  });

  await t.test('one dial governs every forward move in the game', () => {
    const openings = (jumpyForward) => [
      ...pawnMoves({ jumpyForward }).filter((m) => m.initialOnly),
      ...rookMoves({ range: 4, jumpyForward }).filter((m) => m.step[1] === 0),
    ];
    assert.ok(openings(true).every((m) => m.jumpy), 'all jumpy: nothing is ever obstructed');
    assert.ok(openings(false).every((m) => !m.jumpy), 'and the other way, uniformly');
  });
});

test('the knight and the bishop trade places', async (t) => {
  /*
   * The heart of the design. On five files a standard knight already lands on
   * the bishop's squares when read through the lens; on eight it does not, and
   * one extra file of reach is what restores it.
   */
  await t.test('five files wants a standard knight, and nothing else works', () => {
    const bishop = bishopMoves({ range: 2 });
    const works = [0, 1, 2, 3].filter((widen) =>
      same(throughLens(knightMoves({ widen }), NARROW), bishop, NARROW.width)
    );
    assert.deepEqual(works, [0]);
    assert.equal(ESCHER_DIALS.narrow.knightWiden, 0);
  });

  await t.test('eight files wants one extra file, and nothing else works', () => {
    const bishop = bishopMoves({ range: 2 });
    const works = [0, 1, 2, 3].filter((widen) =>
      same(throughLens(knightMoves({ widen }), WIDE), bishop, WIDE.width)
    );
    assert.deepEqual(works, [1]);
    assert.equal(ESCHER_DIALS.wide.knightWiden, 1);
  });

  await t.test('and the swap runs both ways on both boards', () => {
    for (const [board, pieces] of [[NARROW, NARROW_PIECES], [WIDE, WIDE_PIECES]]) {
      assert.ok(
        same(throughLens(pieces[PIECE.KNIGHT], board), pieces[PIECE.BISHOP], board.width),
        `knight -> bishop on ${board.width}`
      );
      assert.ok(
        same(throughLens(pieces[PIECE.BISHOP], board), pieces[PIECE.KNIGHT], board.width),
        `bishop -> knight on ${board.width}`
      );
    }
  });
});

test('the rook is the piece that looks normal', async (t) => {
  /*
   * Which is what buys the order the lessons arrive in: pawns advance normally,
   * the minor pieces swap, and the rook reassures you that nothing else is
   * wrong — until you meet a pawn capture.
   */
  await t.test('the published range is self-dual on both boards', () => {
    assert.equal(ESCHER_DIALS.narrow.rookRange, 3);
    assert.equal(ESCHER_DIALS.wide.rookRange, 3);
    for (const [board, pieces] of [[NARROW, NARROW_PIECES], [WIDE, WIDE_PIECES]]) {
      assert.ok(
        same(throughLens(pieces[PIECE.ROOK], board), pieces[PIECE.ROOK], board.width),
        `rook self-dual on ${board.width}`
      );
    }
  });

  /*
   * The cost of shortening the rook, stated so it cannot be forgotten: on eight
   * files it no longer covers its own rank. The square it misses is the one
   * directly opposite, four files away, which is its own fixed point under the
   * duality — the reason the piece stays self-dual without it.
   */
  await t.test('it reaches every file on five, and all but the far one on eight', () => {
    const sideways = (board) =>
      new Set(
        rookMoves({ range: ESCHER_DIALS.wide.rookRange })
          .filter(({ step }) => step[0] === 0)
          .map(({ step }) => ((step[1] % board.width) + board.width) % board.width)
      );
    assert.equal(sideways(NARROW).size, NARROW.width - 1, 'every file but its own on five');
    assert.equal(sideways(WIDE).size, WIDE.width - 2, 'all but one on eight');
    assert.equal(sideways(WIDE).has(WIDE.width / 2), false, 'and the one missed is the far one');
  });

  await t.test('three is the floor: anything shorter is not self-dual on eight', () => {
    // The defect the V3 rules would have had at two: {+-1, +-2} maps to
    // {+-2, +-3}, because the orbit {1, 5} is not complete until three.
    for (const range of [1, 2]) {
      const rook = rookMoves({ range });
      assert.ok(!same(throughLens(rook, WIDE), rook, WIDE.width), `range ${range} on eight`);
    }
    // On five files range two was already fine, which is why only the 8x8 broke.
    const short = rookMoves({ range: 2 });
    assert.ok(same(throughLens(short, NARROW), short, NARROW.width));
  });
});

test('what every piece becomes', async (t) => {
  await t.test('five wide: knight and bishop swap, rook holds, the rest are their own', () => {
    const report = dualityReport(NARROW_PIECES, NARROW);
    assert.deepEqual(report[PIECE.ROOK], { selfDual: true, dualTo: PIECE.ROOK });
    assert.deepEqual(report[PIECE.KNIGHT], { selfDual: false, dualTo: PIECE.BISHOP });
    assert.deepEqual(report[PIECE.BISHOP], { selfDual: false, dualTo: PIECE.KNIGHT });
    assert.deepEqual(report[PIECE.PAWN], { selfDual: false, dualTo: null });
    assert.deepEqual(report[PIECE.KING], { selfDual: false, dualTo: null });
    assert.equal(PIECE.QUEEN in report, false, 'no queen on the narrow board');
  });

  await t.test('eight wide: the same, and the queen becomes a rook-and-knight', () => {
    const report = dualityReport(WIDE_PIECES, WIDE);
    assert.deepEqual(report[PIECE.ROOK], { selfDual: true, dualTo: PIECE.ROOK });
    assert.deepEqual(report[PIECE.KNIGHT], { selfDual: false, dualTo: PIECE.BISHOP });
    assert.deepEqual(report[PIECE.PAWN], { selfDual: false, dualTo: null });
    assert.deepEqual(report[PIECE.KING], { selfDual: false, dualTo: null });
    // Not one of ours, so the report says so; it is the compound piece.
    assert.deepEqual(report[PIECE.QUEEN], { selfDual: false, dualTo: null });

    const empress = [...WIDE_PIECES[PIECE.ROOK], ...WIDE_PIECES[PIECE.KNIGHT]];
    assert.ok(
      same(throughLens(WIDE_PIECES[PIECE.QUEEN], WIDE), empress, WIDE.width),
      'the enemy queen moves as a rook and a knight together'
    );
    assert.ok(
      same(throughLens(empress, WIDE), WIDE_PIECES[PIECE.QUEEN], WIDE.width),
      'and it reads back as a queen'
    );
  });

  await t.test('the sign of the duality number does not matter to these pieces', () => {
    /*
     * Every published move set is closed under negating its file step, so
     * reading it x2 and reading it x-2 land on the same squares. Which is why
     * the boards could carry the wrong one of a +-pair for a while without any
     * of these tests noticing — worth stating, since a hand-edited set from the
     * sandbox need not be symmetric, and there the sign will matter.
     */
    for (const [board, pieces] of [[NARROW, NARROW_PIECES], [WIDE, WIDE_PIECES]]) {
      const mirrored = { width: board.width, duality: board.width - board.duality };
      for (const name of Object.keys(pieces)) {
        assert.ok(
          same(throughLens(pieces[name], board), throughLens(pieces[name], mirrored), board.width),
          `${name} on ${board.width}`
        );
      }
    }
  });

  await t.test('reading it through twice gets you back where you started', () => {
    // On eight files 3 is its own inverse; on five it is not, so the round trip
    // there is x2 then x3.
    for (const [board, pieces, back] of [
      [NARROW, NARROW_PIECES, 3],
      [WIDE, WIDE_PIECES, 5],
    ]) {
      for (const name of Object.keys(pieces)) {
        const there = throughLens(pieces[name], board);
        const andBack = throughLens(there, { width: board.width, duality: back });
        assert.ok(same(andBack, pieces[name], board.width), `${name} on ${board.width}`);
      }
    }
  });

  await t.test('the report reads as English', () => {
    const lines = describeDuality(dualityReport(NARROW_PIECES, NARROW));
    assert.ok(lines.some((l) => /rook: unchanged/.test(l)));
    assert.ok(lines.some((l) => /knight.*moves like your bishop/.test(l)));
    assert.ok(lines.some((l) => /king: not like any piece/.test(l)));
  });
});

test('the pawn, which is where it stops looking normal', async (t) => {
  await t.test('the push is self-dual, so pawns advance normally for both', () => {
    const pushes = pawnMoves().filter((m) => !m.requiresCapture);
    for (const board of [NARROW, WIDE]) {
      assert.ok(same(throughLens(pushes, board), pushes, board.width));
    }
  });

  await t.test('the captures are not, and reach further on the wider board', () => {
    const takes = pawnMoves().filter((m) => m.requiresCapture);
    const across = (board) =>
      [...new Set(throughLens(takes, board).map(({ step }) => Math.abs(step[1])))].sort();
    assert.deepEqual(across(NARROW), [2]); // one file becomes two
    assert.deepEqual(across(WIDE), [3]); // one file becomes three
  });
});
