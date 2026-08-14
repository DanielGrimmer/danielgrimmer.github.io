# The Duality Games

Two-player games in which each player sees a different board and neither of them
is wrong. They are playable illustrations of a question from the philosophy of
physics: when two theories are dual, and each describes everything perfectly
well in its own terms, which one tells us what the world is really like?

This is the single entry point for everything about the games. The site's own
[README](../../README.md) covers the website around them.

| Game | Live pages | State |
| --- | --- | --- |
| Soccer Hockey | `assets/SoccerHockey/…V4.0.html` | **V4.0, rebuilt on this engine and live** |
| Escher Chess | `assets/EscherChess/…V1.2.html` | V1.2, untouched so far |

Soccer Hockey has three pages: a tutorial, which teaches the interface with the
duality switched off; the real game, which turns it on and ends in the reveal;
and a sandbox, which opens every dial. Escher Chess still has the two it always
had. Landing pages are `_pages/soccerhockey.md`, `_pages/escherchess.md`,
grouped under `_pages/games.md`.

## Where things live

| | |
| --- | --- |
| Shared rules engine | `assets/games/core/` |
| Tests | `_tests/*.test.mjs` — run with `node --test _tests/*.test.mjs` |
| Firestore rules and console steps | [`_firebase/`](../../_firebase/README.md) |
| The pre-rewrite bundle, kept verbatim | [`_archive/soccer-hockey-v3.1/`](../../_archive/soccer-hockey-v3.1/README.md) |

The rebuilt pages ship as **V4.0**, continuing the numbering of the pages they
replace. The engine is not versioned separately; the page filenames carry it.

## The engine

```
core/duality.js   Modular arithmetic on Z_w; the Lens each seat reads through
core/rules.js     Board geometry, move-set derivation, legal moves
core/game.js      Game state, move log, replay, per-seat views, reframing
core/seats.js     Seat claiming, heartbeats, who may move
core/presets.js   The two published configurations
core/sandbox.js   Editable configurations: validation, the move palette
```

Pure functions over plain data — no DOM, no network, no framework — so the same
files run in the browser and under `node --test`.

Around that sit the two impure layers, each with one job:

```
net/rooms.js      The fixed room pool; share links
net/room.js       Firestore: sign in, claim a seat, append a move, watch
ui/board.js       The isometric board renderer
ui/board.css      Page furniture, the palettes, the move-set grid
ui/coach.js       Tutorial steps and the reveal's prose — all copy lives here
ui/replay.js      The reveal: both seats' boards, stepping through one move log
ui/palette.js     The move-set editor, drawn once per lens
```

Three pages, in the order a pair of players meets them: the tutorial (no
network, duality off), the real game (one board each, ending in the reveal), and
the sandbox (both boards, every dial shared). Each is a thin HTML file over
those modules; none of them holds a rule.

Every intra-project import carries a `?v=` token. GitHub Pages serves assets
with a ten-minute max-age, so an edited module keeps loading from cache while
the page itself is refetched — which looks exactly like a change that never
shipped. Bump them together, and the build stamp at the foot of each page
reports which set the browser actually ran.

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
node --test _tests/*.test.mjs                      # 208 tests
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

The reveal's claims are tested too — that both seats agree about the goal
column, the row and the winner, and disagree about the ball's column and the
shape of the trail. The page asserts all five of those in prose, so they are
checked rather than trusted.

What cannot be tested here is anything that needs the network: the Firestore
rules, seat claiming against a live room, and two browsers in the same game.
That is why `net/` is kept as thin as it is — it reads and writes documents and
decides nothing.

## Status

Soccer Hockey is **done and live at V4.0**. The rewrite closed every defect
listed in the archive's README, and the pages now carry:

- one rules engine shared by the tutorial and the game, so they cannot drift
  apart the way V3.1's two implementations did;
- the move log as the room's state, which is what lets a Security Rule refuse a
  move from anybody but the seat on move — a rule cannot replay a board, but it
  can count;
- seats claimed against a Firebase anonymous uid, with heartbeats, a five-minute
  abandonment timeout, and presence ("your opponent is here, and moving about");
- a room pool of twenty fixed names, matched by the published rules, so document
  creation can never be unbounded on a free plan;
- the guided tutorial, which advances on what the player does rather than on a
  Next button;
- **the reveal**: both seats' boards side by side at full size, stepping through
  the one move log together;
- **the sandbox**, reached from the end of the reveal with the room name in the
  link, so both players land in it together. Both boards on both screens, and
  the width, the height, the duality number and the move set all shared and all
  editable. The move set is edited through a palette drawn once per lens: tick a
  cell on the soccer grid and a different cell lights up on the hockey one,
  which is the duality with the game taken away from it.

### Which room you land in

The invite link always wins. Failing that, the room this browser was last in, if
its seat is still yours — a returning player keeps their game, which is what the
anonymous uid is for. Failing *that*, `findOpenRoom` takes somebody who is
waiting to start (one live occupant, no moves played) before an empty room, and
picks the empty room quiet longest rather than the first in the list.

The two rules that stop a stranger inheriting a game:

- A room with a lone occupant who has already started is not offered. They are
  playing, or reading their reveal, and are not waiting for company.
- A room everybody walked out of forgets its game as the next person sits down
  — unless that person is resuming their own seat, which is a dropped
  connection rather than an abandoned game. This is a second write rather than
  part of the claim: the published rule for a seat operation requires the move
  count not to change, while a bare reset is already allowed.

The design assumes two people who know each other and can talk on another
channel — the reveal does not land otherwise — so pairing strangers is not a
goal, and spreading arrivals across rooms costs nothing.

### The sandbox

Deliberately loose. There is no turn order — with nothing left to
hide, taking turns to adjust a number would only be in the way — and no value
you can type into it can break it: `normaliseSpec` never throws and never
returns something the engine will refuse, because two people are editing one
document over a network and a briefly nonsensical value has to be survivable.
It also degrades to a private, local sandbox if Firebase cannot be reached at
all, since it is the one screen that still means something on your own.

### What Escher Chess can take from this

Next job, and the reason the layers are split where they are. Roughly:

**Reusable unchanged.** `core/duality.js` is arithmetic, not a game: a `Lens` is
an affine map on `Z_w` and knows nothing about balls or goals. `core/seats.js`
is about chairs, heartbeats and abandonment, and would not notice what is being
played. `net/rooms.js` and `net/room.js` read and write documents whose only
game-specific field is the move log. `ui/board.css`'s page furniture, and the
whole room/seat/presence half of a page, carry straight over.

**Reusable with a seam to cut.** `ui/replay.js` and `ui/coach.js` are written
around a config and a move log rather than around Soccer Hockey, but the reveal
prose and the tutorial steps are Soccer Hockey's own, and want lifting out into
a per-game module. `core/sandbox.js` generalises the same way: the palette
geometry is general, the specific dials are not.

**Soccer Hockey's own.** `core/rules.js` (one ball, a trail, two goal mouths),
`core/game.js`'s notion of a game state, `core/presets.js`, and the isometric
cube renderer in `ui/board.js` — though that last one is worth reading closely
rather than rewriting, since the projection and the scaling are fiddly and
already work on a phone.

The obvious question to settle first is whether chess pieces can be expressed as
a move log at all. If they can, the whole net/ layer and the Security Rules come
free, because the rule counts moves rather than understanding them.

**Escher Chess** is otherwise untouched, and still V1.2 on the old bundle.

Still open on the Firebase side: App Check, and restricting the web API key to
the site's own referrer. Both are in [`_firebase/`](../../_firebase/README.md).
