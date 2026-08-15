import test from 'node:test';
import assert from 'node:assert/strict';

import {
  Lens,
  mod,
  signedRep,
  gcd,
  modInverse,
  validMultipliers,
  dualityBetween,
  lensOrder,
} from '../assets/games/core/duality.js';

test('modular helpers', async (t) => {
  await t.test('mod is non-negative', () => {
    assert.equal(mod(-1, 11), 10);
    assert.equal(mod(-15, 11), 7);
    assert.equal(mod(27, 11), 5);
  });

  await t.test('signedRep picks the short way round', () => {
    assert.equal(signedRep(1, 11), 1);
    assert.equal(signedRep(10, 11), -1);
    assert.equal(signedRep(8, 11), -3);
    assert.equal(signedRep(12, 11), 1);
  });

  await t.test('gcd and modInverse', () => {
    assert.equal(gcd(4, 11), 1);
    assert.equal(gcd(4, 8), 4);
    assert.equal(modInverse(4, 11), 3);
    assert.throws(() => modInverse(4, 8), RangeError);
  });

  await t.test('every valid multiplier is invertible', () => {
    for (const w of [5, 9, 11, 13, 16]) {
      for (const m of validMultipliers(w)) {
        assert.equal(mod(m * modInverse(m, w), w), 1, `${m} mod ${w}`);
      }
    }
  });
});

test('Lens', async (t) => {
  const width = 11;
  const goalCol = 5;

  await t.test('rejects a multiplier sharing a factor with the width', () => {
    assert.throws(() => new Lens({ width: 12, multiplier: 4, fixedPoint: 6 }), RangeError);
  });

  await t.test('fixes the goal column, so both seats agree where the goals are', () => {
    for (const m of validMultipliers(width)) {
      const lens = new Lens({ width, multiplier: m, fixedPoint: goalCol });
      assert.equal(lens.toView(goalCol), goalCol, `multiplier ${m}`);
    }
  });

  await t.test('round-trips every column', () => {
    for (const m of validMultipliers(width)) {
      const lens = new Lens({ width, multiplier: m, fixedPoint: goalCol });
      for (let c = 0; c < width; c++) {
        assert.equal(lens.toCanonical(lens.toView(c)), c);
        assert.equal(lens.toView(lens.toCanonical(c)), c);
      }
    }
  });

  await t.test('is a bijection on the columns', () => {
    const lens = new Lens({ width, multiplier: 4, fixedPoint: goalCol });
    const seen = new Set();
    for (let c = 0; c < width; c++) seen.add(lens.toView(c));
    assert.equal(seen.size, width);
  });

  await t.test('reproduces v3.1 exactly: view = (a * canonical + b) mod w', () => {
    // v3.1 stored b = (centre - a*centre) mod w and computed a*col + b.
    for (const w of [5, 9, 11, 13]) {
      const centre = Math.floor(w / 2);
      for (const a of validMultipliers(w)) {
        const b = mod(centre - a * centre, w);
        const lens = new Lens({ width: w, multiplier: a, fixedPoint: centre });
        assert.equal(lens.offset, b, `offset for a=${a} w=${w}`);
        for (let c = 0; c < w; c++) {
          assert.equal(lens.toView(c), mod(a * c + b, w), `a=${a} w=${w} col=${c}`);
        }
      }
    }
  });

  await t.test('displacements scale by the multiplier alone', () => {
    const lens = new Lens({ width, multiplier: 4, fixedPoint: goalCol });
    assert.equal(lens.viewDelta(1), 4);
    assert.equal(lens.viewDelta(3), 1); // 4*3 = 12 = 1 (mod 11) — the whole trick
    assert.equal(lens.viewDelta(-3), -1);
    assert.equal(lens.viewDelta(2), -3);
  });

  await t.test('inverse and compose', () => {
    const lens = new Lens({ width, multiplier: 4, fixedPoint: goalCol });
    assert.equal(lens.inverse().multiplier, 3);
    assert.equal(lens.compose(lens.inverse()).multiplier, 1);
    for (let c = 0; c < width; c++) {
      assert.equal(lens.inverse().toView(lens.toView(c)), c);
    }
  });
});

test('the published duality', async (t) => {
  const width = 11;
  const goalCol = 5;
  const soccer = new Lens({ width, multiplier: 1, fixedPoint: goalCol });
  const hockey = new Lens({ width, multiplier: 4, fixedPoint: goalCol });

  await t.test('relates the two seats by 4', () => {
    assert.equal(dualityBetween(soccer, hockey), 4);
    assert.equal(dualityBetween(hockey, soccer), 3); // and back by its inverse
  });

  await t.test('multiplier 4 has order 5 on Z_11, so it is not a primitive root', () => {
    assert.equal(lensOrder(4, 11), 5);
    const generated = new Set();
    let acc = 1;
    for (let i = 0; i < 5; i++) {
      acc = mod(acc * 4, 11);
      generated.add(acc);
    }
    // exactly the quadratic residues mod 11
    assert.deepEqual([...generated].sort((a, b) => a - b), [1, 3, 4, 5, 9]);
    for (const primitive of [2, 6, 7, 8]) {
      assert.equal(lensOrder(primitive, 11), 10, `${primitive} should be primitive`);
    }
  });
});

/*
 * A lens is `view = m * canonical + b`. Soccer Hockey writes it with a fixed
 * point because both players must agree where the goals are; Escher Chess
 * cannot, because its eight-wide relabelling leaves no file alone at all.
 */
test('a lens written as an offset', async (t) => {
  await t.test('the two forms agree wherever a fixed point exists', () => {
    for (let width = 3; width <= 13; width++) {
      for (const m of validMultipliers(width)) {
        for (let f = 0; f < width; f++) {
          const byPoint = new Lens({ width, multiplier: m, fixedPoint: f });
          const byOffset = new Lens({ width, multiplier: m, offset: byPoint.offset });
          for (let c = 0; c < width; c++) {
            assert.equal(byOffset.toView(c), byPoint.toView(c), `w${width} m${m} f${f} c${c}`);
          }
        }
      }
    }
  });

  await t.test('exactly one of the two is required', () => {
    assert.throws(() => new Lens({ width: 8, multiplier: 3 }), RangeError);
    assert.throws(
      () => new Lens({ width: 8, multiplier: 3, fixedPoint: 0, offset: 0 }),
      RangeError
    );
  });

  await t.test('offset zero and multiplier one is the identity', () => {
    const lens = new Lens({ width: 8, multiplier: 1, offset: 0 });
    for (let c = 0; c < 8; c++) assert.equal(lens.toView(c), c);
    assert.equal(lens.fixedPoints().length, 8);
    // Ambiguous rather than absent: every column qualifies, so none is "the" one.
    assert.equal(lens.fixedPoint, null);
  });

  await t.test('a view maps back to the column it came from', () => {
    for (let width = 3; width <= 13; width++) {
      for (const m of validMultipliers(width)) {
        for (let b = 0; b < width; b++) {
          const lens = new Lens({ width, multiplier: m, offset: b });
          for (let c = 0; c < width; c++) {
            assert.equal(lens.toCanonical(lens.toView(c)), c);
          }
        }
      }
    }
  });

  await t.test('composing with its own inverse gives the identity, offsets and all', () => {
    for (let width = 3; width <= 13; width++) {
      for (const m of validMultipliers(width)) {
        for (let b = 0; b < width; b++) {
          const lens = new Lens({ width, multiplier: m, offset: b });
          const round = lens.compose(lens.inverse());
          assert.equal(round.multiplier, 1, `w${width} m${m} b${b}`);
          assert.equal(round.offset, 0, `w${width} m${m} b${b}`);
        }
      }
    }
  });
});

/*
 * The two published Escher Chess relabellings, checked against the V3 rule
 * booklets rather than against the old code. Each player's own back rank is
 * standard in their own labelling; the figures in the booklet show what the
 * *other* player sees, and that is what these reproduce.
 */
test('the Escher Chess lenses', async (t) => {
  const seenThrough = (lens, ownRank) => {
    const out = Array(ownRank.length);
    ownRank.forEach((piece, i) => (out[lens.toView(i)] = piece));
    return out;
  };

  await t.test('eight wide is 3c - 1, and leaves no file alone', () => {
    const lens = new Lens({ width: 8, multiplier: 3, offset: -1 });
    assert.deepEqual(lens.fixedPoints(), []);
    assert.equal(lens.fixedPoint, null);
    // Black's own back rank is standard chess; White sees this.
    assert.deepEqual(
      seenThrough(lens, ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']),
      ['Q', 'N', 'N', 'K', 'R', 'B', 'B', 'R']
    );
  });

  await t.test('five wide is 3c + 2, and leaves the last file alone', () => {
    const lens = new Lens({ width: 5, multiplier: 3, offset: 2 });
    assert.deepEqual(lens.fixedPoints(), [4]);
    assert.equal(lens.fixedPoint, 4);
    assert.deepEqual(seenThrough(lens, ['R', 'B', 'K', 'B', 'R']), ['B', 'B', 'R', 'K', 'R']);
    // The rank behind it: pawns on the outer and middle files, knights between.
    assert.deepEqual(seenThrough(lens, ['P', 'N', 'P', 'N', 'P']), ['N', 'N', 'P', 'P', 'P']);
  });

  await t.test('each board relates the two players by a duality of the right order', () => {
    // Eight wide, 3 is its own inverse: the two players see each other alike.
    const wide = new Lens({ width: 8, multiplier: 3, offset: -1 });
    assert.equal(wide.inverse().multiplier, 3);
    assert.equal(lensOrder(3, 8), 2);
    // Five wide they do not: White reads Black's steps x3, Black reads White's x2.
    const narrow = new Lens({ width: 5, multiplier: 3, offset: 2 });
    assert.equal(narrow.inverse().multiplier, 2);
    assert.equal(lensOrder(3, 5), 4);
  });
});
