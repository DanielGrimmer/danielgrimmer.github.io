# Duality Games engine

Shared rules engine for the duality games. Pure functions over plain data — no
DOM, no network, no framework — so the same files run in the browser and under
`node --test`.

The rebuilt games ship as **V4.0**, continuing the numbering of the pages they
replace (`SoccerHockeyGameV3.1.html` and friends, kept in
`_archive/soccer-hockey-v3.1/`). The engine itself is not versioned separately;
the page filenames carry the version.

```
core/duality.js   Modular arithmetic on Z_w; the Lens each seat reads through
core/rules.js     Board geometry, move-set derivation, legal moves
core/game.js      Game state, move log, replay, per-seat views, reframing
core/presets.js   The two published configurations, and the palettes
core/index.js     Barrel
```

## The idea

There is one game state, stored in **canonical** columns that belong to neither
player. Each seat holds a `Lens` — an affine map on `Z_w` fixing the goal
column — and sees the board through it. Canonical is bookkeeping, not a player:
no code path assumes either seat's lens is the identity, and `reframe(config, k)`
rewrites a game into a different canonical frame while leaving both seats' views
pointwise identical. There is a test for that.

Because the fixed point is the goal column, both players agree where the goals
are. Because displacements scale by the multiplier alone, one player's "three
across" is the other's "four across" — `4 x 3 = 12 = 1 (mod 11)`.

The tutorial is the same engine with duality 1: both lenses are the identity, so
the two views coincide. In the old bundle the tutorial was a second
implementation of the same rules, which is how it came to have a stalemate guard
the real game was missing.

## Running the tests

```sh
node --test _tests/*.test.mjs          # 70 tests
node --test --test-reporter=dot _tests/*.test.mjs
```

Requires Node 18+. Nothing to install — `node:test` is built in, and the engine
has no dependencies. `assets/games/package.json` exists only to mark this
subtree as ES modules; the repository root stays CommonJS because
`purgecss.config.js` uses `module.exports`.

The suite covers the modular arithmetic, lens round-trips, exact agreement with
the v3.1 column formula, the derived move sets, win and stalemate conditions,
replay determinism, frame-independence, and the property that the two seats'
legal moves correspond one-to-one across every valid board size and duality
number. It also pins the v3.1 stalemate bug as a regression test.
