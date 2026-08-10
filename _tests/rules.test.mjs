import test from 'node:test';
import assert from 'node:assert/strict';

import { validMultipliers, signedRep, modInverse } from '../assets/games/core/duality.js';
import {
  makeBoard,
  isPlayable,
  dualMoveSet,
  moveTargets,
  legalMoves,
  blockedMoves,
  goalApproaches,
  scoringSeat,
  squareKey,
} from '../assets/games/core/rules.js';

const board = makeBoard({ width: 11, height: 13 });
const moves = dualMoveSet({ width: 11, height: 13, duality: 4 });

test('board geometry', async (t) => {
  await t.test('the goal is the middle column of each end row', () => {
    assert.equal(board.goalCol, 5);
    assert.deepEqual(board.start, { row: 6, col: 5 });
  });

  await t.test('goal rows are wall except at the goal mouth', () => {
    for (let c = 0; c < board.width; c++) {
      assert.equal(isPlayable(board, 0, c), c === 5, `top row col ${c}`);
      assert.equal(isPlayable(board, 12, c), c === 5, `bottom row col ${c}`);
      assert.equal(isPlayable(board, 6, c), true, `mid row col ${c}`);
    }
  });

  await t.test('off the top and bottom is not playable', () => {
    assert.equal(isPlayable(board, -1, 5), false);
    assert.equal(isPlayable(board, 13, 5), false);
  });

  await t.test('scoring seats', () => {
    assert.equal(scoringSeat(board, 0), 0);
    assert.equal(scoringSeat(board, 12), 1);
    assert.equal(scoringSeat(board, 6), null);
  });
});

test('the derived move set', async (t) => {
  await t.test('rejects a duality number sharing a factor with the width', () => {
    assert.throws(() => dualMoveSet({ width: 12, height: 13, duality: 4 }), RangeError);
  });

  await t.test('gives soccer 1-and-3 sideways, hockey 1-and-4', () => {
    const near = moves.filter(([dr]) => Math.abs(dr) <= 1);
    const soccer = new Set(near.map(([, dc]) => Math.abs(dc)));
    const hockey = new Set(near.map(([, dc]) => Math.abs(signedRep(4 * dc, 11))));
    soccer.delete(0);
    hockey.delete(0);
    assert.deepEqual([...soccer].sort(), [1, 3]);
    assert.deepEqual([...hockey].sort(), [1, 4]);
  });

  await t.test('matches v3.1 offsets exactly for the published board', () => {
    const expected = [
      [1, -3], [1, -1], [1, 0], [1, 1], [1, 3],
      [0, -3], [0, -1], [0, 1], [0, 3],
      [-1, -3], [-1, -1], [-1, 0], [-1, 1], [-1, 3],
      [2, -2], [3, 0], [2, 2], [-2, -2], [-3, 0], [-2, 2],
    ];
    assert.deepEqual(
      moves.map((o) => [...o]).sort(byOffset),
      expected.sort(byOffset)
    );
  });

  await t.test('is symmetric under negation, so approaches equal departures', () => {
    const keys = new Set(moves.map(([dr, dc]) => `${dr},${dc}`));
    for (const [dr, dc] of moves) {
      assert.ok(keys.has(`${-dr},${-dc}`), `missing inverse of ${dr},${dc}`);
    }
  });

  await t.test('long passes are +/-(a^-1 - 1) against +/-(a - 1)', () => {
    const far = moves.filter(([dr]) => Math.abs(dr) === 2).map(([, dc]) => Math.abs(dc));
    assert.deepEqual([...new Set(far)], [2]); // a^-1 - 1 = 3 - 1
    const dual = moves
      .filter(([dr]) => Math.abs(dr) === 2)
      .map(([, dc]) => Math.abs(signedRep(4 * dc, 11)));
    assert.deepEqual([...new Set(dual)], [3]); // a - 1 = 4 - 1
  });
});

test('legal moves', async (t) => {
  await t.test('from the centre, all offsets land on the field', () => {
    const found = legalMoves(board, moves, { row: 6, col: 5, visited: [] });
    assert.equal(found.length, moves.length);
  });

  await t.test('never returns a walled-off goal-row square', () => {
    // From row 1 the raw offsets reach (0, 2), (0, 4), (0, 6), (0, 8) — all wall.
    const found = legalMoves(board, moves, { row: 1, col: 5, visited: [] });
    for (const sq of found) {
      assert.ok(isPlayable(board, sq.row, sq.col), `${squareKey(sq.row, sq.col)} should be playable`);
    }
    const intoTopRow = found.filter((s) => s.row === 0);
    assert.deepEqual(intoTopRow, [{ row: 0, col: 5 }]);
  });

  await t.test('REGRESSION: the v3.1 stalemate bug', () => {
    // v3.1 counted moves into blocked goal-row cells as legal, so a player with
    // no real move was never declared stalemated and the game hung. Sitting on
    // the goal mouth with every playable neighbour burned must yield zero.
    const visited = [];
    for (let r = 0; r < board.height; r++) {
      for (let c = 0; c < board.width; c++) {
        if (isPlayable(board, r, c) && !(r === 0 && c === 5)) visited.push({ row: r, col: c });
      }
    }
    const found = legalMoves(board, moves, { row: 0, col: 5, visited });
    assert.equal(found.length, 0, 'blocked wall squares must not count as escapes');
  });

  await t.test('wraps around the cylinder', () => {
    const found = legalMoves(board, moves, { row: 6, col: 0, visited: [] });
    assert.ok(found.some((s) => s.col === 10), 'stepping left from column 0 reaches column 10');
    assert.ok(found.every((s) => s.col >= 0 && s.col < board.width));
  });

  await t.test('does not revisit burned squares', () => {
    const visited = [{ row: 7, col: 5 }];
    const found = legalMoves(board, moves, { row: 6, col: 5, visited });
    assert.ok(!found.some((s) => s.row === 7 && s.col === 5));
  });

  await t.test('accepts a Set of keys as well as a list of squares', () => {
    const asList = legalMoves(board, moves, { row: 6, col: 5, visited: [{ row: 7, col: 5 }] });
    const asSet = legalMoves(board, moves, { row: 6, col: 5, visited: new Set(['7,5']) });
    assert.deepEqual(asSet, asList);
  });
});

test('the star keeps its shape as the trail eats into it', async (t) => {
  await t.test('targets ignore the trail; legal moves do not', () => {
    const at = { row: 6, col: 5 };
    const clean = moveTargets(board, moves, at);
    assert.deepEqual(legalMoves(board, moves, { ...at, visited: [] }), clean);

    const visited = [{ row: 5, col: 5 }, { row: 7, col: 5 }];
    assert.deepEqual(moveTargets(board, moves, at), clean, 'the star does not shrink');
    assert.equal(legalMoves(board, moves, { ...at, visited }).length, clean.length - 2);
  });

  await t.test('legal and blocked partition the star exactly', () => {
    const at = { row: 6, col: 5 };
    const visited = [{ row: 5, col: 5 }, { row: 6, col: 8 }, { row: 9, col: 1 }];
    const star = moveTargets(board, moves, at).map((s) => squareKey(s.row, s.col)).sort();
    const open = legalMoves(board, moves, { ...at, visited }).map((s) => squareKey(s.row, s.col));
    const shut = blockedMoves(board, moves, { ...at, visited }).map((s) => squareKey(s.row, s.col));

    assert.deepEqual([...open, ...shut].sort(), star, 'every arm is either open or shut');
    assert.equal(open.filter((k) => shut.includes(k)).length, 0, 'and never both');
    // (9,1) was never an arm of this star, so it must not appear as blocked
    assert.ok(!shut.includes('9,1'));
    assert.deepEqual(shut.sort(), ['5,5', '6,8']);
  });

  await t.test('the star is the same shape wherever the ball stands', () => {
    const shapeAt = (row, col) =>
      moveTargets(board, moves, { row, col })
        .map((s) => `${s.row - row},${((s.col - col + 11) % 11)}`)
        .sort();
    // away from the goal rows, where nothing is clipped, the offsets are identical
    assert.deepEqual(shapeAt(6, 5), shapeAt(6, 0), 'including across the seam');
    assert.deepEqual(shapeAt(6, 5), shapeAt(5, 9));
  });
});

test('goal approaches are the bullet points', async (t) => {
  await t.test('eight per goal on the published board', () => {
    const approaches = goalApproaches(board, moves, []);
    const top = approaches.filter((s) => s.row <= 3);
    assert.equal(top.length, 8);
    // five at row 1, two at row 2, one at row 3
    assert.equal(top.filter((s) => s.row === 1).length, 5);
    assert.equal(top.filter((s) => s.row === 2).length, 2);
    assert.equal(top.filter((s) => s.row === 3).length, 1);
  });

  await t.test('six per goal on the tutorial board, as its text claims', () => {
    const demoBoard = makeBoard({ width: 9, height: 11 });
    const demoMoves = [
      [2, -2], [3, 0], [2, 2],
      [1, -1], [1, 0], [1, 1],
      [0, -3], [0, -1], [0, 1], [0, 3],
      [-1, -1], [-1, 0], [-1, 1],
      [-2, -2], [-3, 0], [-2, 2],
    ];
    const top = goalApproaches(demoBoard, demoMoves, []).filter((s) => s.row <= 3);
    assert.equal(top.length, 6);
  });
});

test('move sets stay coherent across every valid board', () => {
  for (const width of [5, 7, 9, 11, 13]) {
    for (const duality of validMultipliers(width)) {
      const b = makeBoard({ width, height: 13 });
      const set = dualMoveSet({ width, height: 13, duality });
      assert.ok(set.length > 0, `w=${width} a=${duality} produced no moves`);
      for (const [dr, dc] of set) {
        assert.ok(Number.isInteger(dr) && Number.isInteger(dc));
        assert.ok(!(dr === 0 && dc === 0), 'a move must go somewhere');
      }
      // the inverse used to build the set really is the inverse
      assert.equal((duality * modInverse(duality, width)) % width, 1);
      assert.ok(b.goalCol < width);
    }
  }
});

function byOffset(a, b) {
  return a[0] - b[0] || a[1] - b[1];
}
