# The Duality Games

Two-player games in which each player sees a different board and neither of them
is wrong. They are playable illustrations of a question from the philosophy of
physics: when two theories are dual, and each describes everything perfectly
well in its own terms, which one tells us what the world is really like?

This is the single entry point for everything about the games. The site's own
[README](../../README.md) covers the website around them.

| Game | Live pages | State |
| --- | --- | --- |
| Soccer Hockey | `assets/SoccerHockey/…V3.1.html` | V3.1, being replaced by V4.0 |
| Escher Chess | `assets/EscherChess/…V1.2.html` | V1.2, untouched so far |

Each game has a tutorial page and a real game page. The tutorial teaches the
interface with the duality switched off; the real game turns it on. Landing
pages are `_pages/soccerhockey.md`, `_pages/escherchess.md`, grouped under
`_pages/games.md`.

## Where things live

| | |
| --- | --- |
| Shared rules engine | `assets/games/core/` |
| Tests | `_tests/*.test.mjs` — run with `node --test _tests/*.test.mjs` |
| Firestore rules, room seeding, console steps | [`_firebase/`](../../_firebase/README.md) |
| The pre-rewrite bundle, kept verbatim | [`_archive/soccer-hockey-v3.1/`](../../_archive/soccer-hockey-v3.1/README.md) |

The rebuilt pages ship as **V4.0**, continuing the numbering of the pages they
replace. The engine is not versioned separately; the page filenames carry it.

## The engine

```
core/duality.js   Modular arithmetic on Z_w; the Lens each seat reads through
core/rules.js     Board geometry, move-set derivation, legal moves
core/game.js      Game state, move log, replay, per-seat views, reframing
core/seats.js     Seat claiming, heartbeats, who may move
core/presets.js   The two published configurations, and the palettes
core/index.js     Barrel
```

Pure functions over plain data — no DOM, no network, no framework — so the same
files run in the browser and under `node --test`.

### One world, two lenses

There is one game state, stored in **canonical** columns that belong to neither
player. Each seat holds a `Lens`: an affine map on `Z_w` fixing the goal column.
Canonical is bookkeeping, not a player. No code path assumes either seat's lens
is the identity, and `reframe(config, k)` rewrites a game into a different
canonical frame while leaving both seats' views pointwise identical — there is a
test for that across every valid frame.

Two consequences fall out of the fixed point and the multiplier:

- Because the lens fixes the goal column, **both players agree where the goals
  are**, which is what keeps the illusion standing.
- Because displacements scale by the multiplier alone, **one player's "three
  across" is the other's "four across"** — `4 × 3 = 12 ≡ 1 (mod 11)`. The
  soccer player can kick 3 sideways but not 4; the hockey player can hit 4 but
  not 3; they are describing the same moves.

The duality number must be coprime with the width, which is what makes the map a
bijection. For the published board it is 4 on `Z_11`, which has order 5 and so
generates the quadratic residues rather than all of `Z_11*`; a primitive root
(2, 6, 7, 8) would give order 10.

The tutorial is the same engine with duality 1: both lenses are the identity, so
the two views coincide and there is nothing to reveal. In V3.1 the tutorial was
a *second implementation* of the same rules, which is how the real game came to
lose a stalemate guard the tutorial kept.

## Running the tests

```sh
node --test _tests/*.test.mjs                      # 102 tests
node --test --test-reporter=dot _tests/*.test.mjs
```

Node 18+. Nothing to install: `node:test` is built in and the engine has no
dependencies. `assets/games/package.json` exists only to mark this subtree as ES
modules — the repository root stays CommonJS because `purgecss.config.js` uses
`module.exports`. Tests also run in CI via `.github/workflows/tests.yml`, kept
separate from the deploy workflow so a failing test never blocks publishing a
typo fix.

The suite covers the modular arithmetic, lens round-trips, exact agreement with
V3.1's column formula, the derived move sets, win and stalemate conditions,
replay determinism, frame-independence, seat claiming and abandonment, and the
property that both seats' legal moves correspond one-to-one across every valid
board size and duality number. Four V3.1 bugs are pinned as regression tests.

## Rebuild status

Done:

1. **Rules audit.** See `_firebase/`.
2. **Engine extracted, with tests.** Fixes the stalemate bug and removes the
   tutorial/game divergence that caused it.
3. **Seat claiming.** Fixes the softlock on opening the game directly, the
   collision where two players in a room could be handed the same seat, and the
   permanently cached side.

Next:

4. **Move log as the state**, so a room stores the moves rather than a snapshot
   and the security rules can enforce "only the seat whose turn it is may add a
   move".
5. **The V4.0 pages**: seat claiming wired to a Firebase uid, the reveal
   delivered as a replay of the same move log through the other lens, and the
   page furniture restyled to match the site. The isometric boards, the hover
   lift and both palettes carry over unchanged.
6. **Escher Chess** onto the same engine.
