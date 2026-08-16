import test from 'node:test';
import assert from 'node:assert/strict';

import {
  LIMITS,
  DEFAULT_SPEC,
  paletteGeometry,
  offsetAtCell,
  cellForOffset,
  withinPalette,
  toggleOffset,
  derivedMoveSet,
  normaliseSpec,
  configFromSpec,
  trivialityOf,
  TRIVIAL,
  describeSpec,
  nearestMultiplier,
  changeDials,
  encodeSpec,
  decodeSpec,
  offsetThroughLens,
  offsetFromLens,
} from '../assets/games/core/sandbox.js';
import { validMultipliers } from '../assets/games/core/duality.js';
import { legalMovesFor, sidewaysReach, initialGame, applyMove, STATUS } from '../assets/games/core/game.js';
import { goalApproaches } from '../assets/games/core/rules.js';
import { SOCCER_HOCKEY } from '../assets/games/core/presets.js';

const published = normaliseSpec(DEFAULT_SPEC).spec;

test('the palette', async (t) => {
  await t.test('is nine rows at most, however tall the board', () => {
    assert.equal(paletteGeometry({ width: 11, height: 13 }).rows, 9);
    assert.equal(paletteGeometry({ width: 11, height: 5 }).rows, 5);
  });

  await t.test('a cell and its offset are inverse', () => {
    const geometry = paletteGeometry({ width: 11, height: 13 });
    for (let row = 0; row < geometry.rows; row++) {
      for (let col = 0; col < geometry.cols; col++) {
        const offset = offsetAtCell(geometry, { row, col });
        assert.deepEqual(cellForOffset(geometry, offset), { row, col });
      }
    }
  });

  await t.test('refuses a row step it cannot draw, and wraps a column step it can', () => {
    const geometry = paletteGeometry({ width: 11, height: 13 });
    assert.equal(cellForOffset(geometry, [9, 0]), null);
    // The board is a cylinder: eleven columns to the left is standing still,
    // and six to the right is five to the left.
    assert.deepEqual(cellForOffset(geometry, [0, -6]), cellForOffset(geometry, [0, 5]));
  });

  await t.test('an even width still shows both halves', () => {
    const geometry = paletteGeometry({ width: 10, height: 13 });
    assert.equal(withinPalette(geometry, [0, 5]), true);
    assert.equal(withinPalette(geometry, [0, -5]), true);
    assert.deepEqual(cellForOffset(geometry, [0, 5]), cellForOffset(geometry, [0, -5]));
  });
});

test('editing the move set', async (t) => {
  await t.test('toggling adds, then removes', () => {
    const once = toggleOffset([], [1, 2]);
    assert.deepEqual(once, [[1, 2]]);
    assert.deepEqual(toggleOffset(once, [1, 2]), []);
  });

  await t.test('standing still is not a move you can switch on', () => {
    assert.deepEqual(toggleOffset([], [0, 0]), []);
  });

  await t.test('a canonical offset survives a trip through a lens and back', () => {
    const config = SOCCER_HOCKEY;
    for (const seat of [0, 1]) {
      for (const offset of config.moveSet) {
        const seen = offsetThroughLens(config, seat, offset);
        assert.deepEqual(offsetFromLens(config, seat, seen), [offset[0], offset[1]]);
      }
    }
  });

  await t.test('the two seats see the same move set differently', () => {
    const config = SOCCER_HOCKEY;
    const across = (seat) =>
      new Set(config.moveSet.map((o) => Math.abs(offsetThroughLens(config, seat, o)[1])));
    assert.notDeepEqual([...across(0)].sort(), [...across(1)].sort());
  });
});

test('normalising a specification', async (t) => {
  await t.test('the default is the published game, and needs no correcting', () => {
    const { spec, notes } = normaliseSpec(DEFAULT_SPEC);
    assert.deepEqual(notes, []);
    assert.equal(spec.width, SOCCER_HOCKEY.board.width);
    assert.equal(spec.height, SOCCER_HOCKEY.board.height);
    assert.equal(spec.duality, SOCCER_HOCKEY.duality);
    assert.deepEqual(
      spec.moveSet.map((o) => [...o]),
      SOCCER_HOCKEY.moveSet.map((o) => [...o])
    );
  });

  await t.test('a duality number sharing a factor with the width is refused, with the valid list', () => {
    const { spec, notes } = normaliseSpec({ ...DEFAULT_SPEC, width: 12, duality: 4 });
    assert.match(notes.join(' '), /cannot share any prime factors/);
    assert.match(notes.join(' '), new RegExp(validMultipliers(12).join(', ')));
    // The nearest legal value, not 1: answering a complaint about the number by
    // making the two boards identical would be a worse outcome than the fault.
    assert.equal(spec.duality, 5);
    assert.notEqual(trivialityOf(spec), TRIVIAL.IDENTITY);
  });

  await t.test('the duality number is bounded by the width, not wrapped around it', () => {
    // Reducing mod the width would turn 12 on a board 11 wide into 1, which is
    // the single value that collapses the whole thing.
    assert.equal(normaliseSpec({ ...DEFAULT_SPEC, duality: 12 }).spec.duality, 10);
    assert.equal(normaliseSpec({ ...DEFAULT_SPEC, duality: 0 }).spec.duality, 1);
    assert.equal(normaliseSpec({ ...DEFAULT_SPEC, duality: -4 }).spec.duality, 1);
    for (const d of [1, 4, 10]) {
      assert.equal(normaliseSpec({ ...DEFAULT_SPEC, duality: d }).spec.duality, d);
    }
  });

  await t.test('sizes are clamped rather than refused', () => {
    assert.equal(normaliseSpec({ width: 2 }).spec.width, LIMITS.minWidth);
    assert.equal(normaliseSpec({ width: 999 }).spec.width, LIMITS.maxWidth);
    assert.equal(normaliseSpec({ height: 999 }).spec.height, LIMITS.maxHeight);
  });

  await t.test('moves that no longer fit the board are dropped, and said to be', () => {
    const { spec, notes } = normaliseSpec({
      width: 5,
      height: 5,
      duality: 2,
      moveSet: [
        [1, 1],
        [8, 0],
      ],
    });
    assert.deepEqual(spec.moveSet, [[1, 1]]);
    assert.match(notes.join(' '), /outside the new board/);
  });

  await t.test('nonsense of every kind still yields something runnable', () => {
    for (const rubbish of [
      {},
      null,
      { width: 'wide', height: NaN, duality: {} },
      { width: 11, height: 13, duality: 4, moveSet: 'not a list' },
      { width: 11, height: 13, duality: 4, moveSet: [[0, 0], ['a', 'b'], [1]] },
      { width: 7, height: 7, duality: -3 },
    ]) {
      const { spec } = normaliseSpec(rubbish ?? undefined);
      assert.doesNotThrow(() => configFromSpec(spec), `threw on ${JSON.stringify(rubbish)}`);
    }
  });

  await t.test('an empty move set is allowed, and simply has no moves', () => {
    const { spec } = normaliseSpec({ ...DEFAULT_SPEC, moveSet: [] });
    const config = configFromSpec(spec);
    assert.deepEqual(legalMovesFor(config, initialGame(config)), []);
  });

  await t.test('the two trivial choices are recognised, and nothing else is', () => {
    const at = (duality) => trivialityOf(normaliseSpec({ ...DEFAULT_SPEC, duality }).spec);
    assert.equal(at(1), TRIVIAL.IDENTITY);
    assert.equal(at(10), TRIVIAL.MIRROR); // width 11, so 10 ≡ −1: a reflection
    assert.equal(at(4), null);
    assert.equal(trivialityOf(published), null);
  });
});

test('the one line under the dials', async (t) => {
  const line = (spec) => {
    const r = normaliseSpec(spec);
    return describeSpec(r.spec, r.notes);
  };

  await t.test('shows the arithmetic when there is nothing to complain about', () => {
    // The published dials: 4 × 3 = 12 ≡ 1 (mod 11). Printing the product is
    // what makes the claim above the boards checkable rather than a promise.
    assert.equal(
      line(DEFAULT_SPEC),
      '4 × 3 = 12 ≡ 1 (mod 11) — three across for Player 1 is one across for Player 2.'
    );
  });

  await t.test('the arithmetic is right for every legal duality on a few widths', () => {
    for (const width of [5, 9, 11, 13]) {
      for (let duality = 2; duality < width - 1; duality++) {
        const r = normaliseSpec({ ...DEFAULT_SPEC, width, duality, height: 13 });
        // A refused duality is corrected, and then it is not this test's case.
        if (r.spec.duality !== duality) continue;
        const said = describeSpec(r.spec, []);
        const [, a, b, product, modulus] = said.match(/^(\d+) × (\d+) = (\d+) ≡ 1 \(mod (\d+)\)/);
        assert.equal(Number(a), duality);
        assert.equal(Number(a) * Number(b), Number(product));
        assert.equal(Number(product) % Number(modulus), 1, `${a} × ${b} is not 1 mod ${modulus}`);
      }
    }
  });

  await t.test('names each trivial choice for what it is', () => {
    assert.match(line({ ...DEFAULT_SPEC, duality: 1 }), /identical/);
    assert.match(line({ ...DEFAULT_SPEC, duality: 10 }), /mirror images/);
  });

  /*
   * The bug this replaced: refusing a duality number used to fall back to 1,
   * which then also tripped the triviality note, so a single mistake produced
   * two complaints — the second of which was only a consequence of the first.
   */
  await t.test('shows one thing at a time, and the correction wins', () => {
    const messy = normaliseSpec({ width: 999, height: 999, duality: 6, moveSet: [[8, 8]] });
    assert.ok(messy.notes.length > 1, 'this case really does have several faults');
    const shown = describeSpec(messy.spec, messy.notes);
    assert.equal(shown, messy.notes[0]);
    assert.doesNotMatch(shown, /identical|mirror images/);
  });
});

test('choosing a legal duality number for you', async (t) => {
  await t.test('lands on the nearest one', () => {
    assert.equal(nearestMultiplier(4, 12), 5);
    assert.equal(nearestMultiplier(6, 9), 5);
  });

  await t.test('breaks a tie away from the two boring answers', () => {
    // 7 and 11 are both two away from 9 on a board 12 wide, but 11 is width − 1
    // and would hand back a mirror image.
    assert.equal(nearestMultiplier(9, 12), 7);
  });

  await t.test('always returns something coprime with the width', () => {
    for (let width = 3; width <= 19; width++) {
      for (let want = 1; want < width; want++) {
        const got = nearestMultiplier(want, width);
        assert.ok(validMultipliers(width).includes(got), `${want} on ${width} gave ${got}`);
      }
    }
  });
});

test('a configuration built from a specification', async (t) => {
  await t.test('reproduces the published game exactly', () => {
    const config = configFromSpec(published);
    assert.equal(config.duality, SOCCER_HOCKEY.duality);
    assert.deepEqual(sidewaysReach(config, 0), sidewaysReach(SOCCER_HOCKEY, 0));
    assert.deepEqual(sidewaysReach(config, 1), sidewaysReach(SOCCER_HOCKEY, 1));
  });

  await t.test('an edited move set is used as given, not re-derived', () => {
    const { spec } = normaliseSpec({ ...DEFAULT_SPEC, moveSet: [[1, 0], [-1, 0]] });
    const config = configFromSpec(spec);
    assert.equal(config.moveSet.length, 2);
    assert.deepEqual(sidewaysReach(config, 0), []);
  });

  await t.test('every valid duality number on a given width builds', () => {
    for (const duality of validMultipliers(11)) {
      const { spec } = normaliseSpec({ width: 11, height: 13, duality });
      assert.doesNotThrow(() => configFromSpec(spec), `duality ${duality}`);
    }
  });

  await t.test('an asymmetric move set gets approaches that can actually score', () => {
    // Only downward moves: seat 1's goal is reachable, seat 0's is not.
    const { spec } = normaliseSpec({ ...DEFAULT_SPEC, moveSet: [[1, 0], [1, 1]] });
    const config = configFromSpec(spec);
    const approaches = goalApproaches(config.board, config.moveSet, []);
    // An approach square must be one from which a goal is a legal move.
    for (const square of approaches) {
      const onward = legalMovesFor(config, { ...initialGame(config), ...square, visited: [] });
      assert.ok(
        onward.some((s) => s.row === 0 || s.row === config.board.height - 1),
        `${square.row},${square.col} cannot reach a goal`
      );
    }
  });
});

test('crossing the wire', async (t) => {
  await t.test('a specification survives encoding and decoding unchanged', () => {
    const encoded = encodeSpec(published);
    assert.ok(encoded.moveSet.every((o) => typeof o.dr === 'number' && typeof o.dc === 'number'));
    assert.deepEqual(decodeSpec(encoded), published);
  });

  await t.test('nested arrays never leave, because Firestore will not take them', () => {
    for (const value of Object.values(encodeSpec(published))) {
      if (!Array.isArray(value)) continue;
      assert.ok(value.every((item) => !Array.isArray(item)));
    }
  });

  await t.test('a missing or damaged document decodes to the published game', () => {
    assert.deepEqual(decodeSpec(undefined), published);
    assert.deepEqual(decodeSpec({ width: 11, height: 13, duality: 4, moveSet: null }), published);
  });
});

test('the sandbox still plays', async (t) => {
  await t.test('a small board with a hand-made move set runs to an outcome', () => {
    const { spec } = normaliseSpec({
      width: 5,
      height: 5,
      duality: 2,
      moveSet: [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ],
    });
    const config = configFromSpec(spec);
    let game = initialGame(config);
    let guard = 0;
    while (game.outcome.status === STATUS.PLAYING && guard++ < 200) {
      const next = legalMovesFor(config, game)[0];
      game = applyMove(config, game, next);
    }
    assert.notEqual(game.outcome.status, STATUS.PLAYING);
  });
});

test('turning a dial', async (t) => {
  const edited = normaliseSpec({ ...DEFAULT_SPEC, moveSet: [[1, 0], [0, 1], [0, 3]] }).spec;

  await t.test('a height change keeps a hand-edited move set — the lens has not moved', () => {
    const { spec } = changeDials(edited, { width: 11, height: 9, duality: 4 });
    assert.deepEqual(spec.moveSet, edited.moveSet);
  });

  await t.test('a duality change re-derives it, so neither star is the privileged one', () => {
    const { spec } = changeDials(edited, { width: 11, height: 13, duality: 5 });
    assert.notDeepEqual(spec.moveSet, edited.moveSet);
    assert.deepEqual(spec.moveSet, derivedMoveSet({ width: 11, height: 13, duality: 5 }));
  });

  await t.test('a width change re-derives it too', () => {
    const { spec } = changeDials(edited, { width: 13, height: 13, duality: 4 });
    assert.deepEqual(spec.moveSet, derivedMoveSet({ width: 13, height: 13, duality: 4 }));
  });

  /*
   * The claim the re-derivation exists to make good on: each player's own
   * single sideways step is legal for them, and so is whatever the other
   * player's single step looks like from where they are standing. Neither ends
   * up with the tidy pattern and the other with the leftovers.
   */
  await t.test('every duality number leaves both seats a step of one, and the other seat’s', () => {
    for (const width of [7, 11, 13]) {
      for (const duality of validMultipliers(width)) {
        if (duality === 1) continue; // both lenses the identity; nothing to balance
        const { spec } = changeDials(normaliseSpec({ width, height: 13, duality: 1 }).spec, {
          width,
          height: 13,
          duality,
        });
        const config = configFromSpec(spec);
        const reach0 = sidewaysReach(config, 0);
        const reach1 = sidewaysReach(config, 1);
        assert.ok(reach0.includes(1), `seat 0 lost its single step at ${width}/${duality}`);
        assert.ok(reach1.includes(1), `seat 1 lost its single step at ${width}/${duality}`);
        assert.equal(reach0.length, reach1.length, `lopsided reach at ${width}/${duality}`);
      }
    }
  });
});
