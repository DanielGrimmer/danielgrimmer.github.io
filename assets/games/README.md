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
| Escher Chess | `assets/EscherChess/…V4.0.html` | tutorial, game |

Soccer Hockey has three pages: a tutorial, which teaches the interface with the
duality switched off; the real game, which turns it on and ends in the reveal;
and a sandbox, which opens every dial. Escher Chess has the first two and no
sandbox: its rules are specific enough that designing pieces would be a
different activity rather than a closer look at this one.

Escher Chess is played in four sittings, in order — 5×10 tutorial, 5×10 game,
8×8 tutorial, 8×8 game — and the order is load-bearing rather than advisory:
the second tutorial is written for somebody who has seen the first reveal, and
teaches only the two pieces the wider board changes, in three moves. It also
does not start from the opening position: a queen has four moves from her own
back rank and seven of her own men in the way, so the practice board puts her
and the knight where the whole of each pattern fits on the screen without
running off the side, and puts the black king where the queen's answer to it is
a check and the king's answer to that is to step onto the one file she cannot
reach. That position is a diagram in `escher/presets.js` — `layout`, read by
`fromDiagram` — and it is the one place in the game where a starting position is
chosen rather than derived; the comment above it says what every square is for.

Both tutorials are the one page, picked apart by `?board=`; `escher/coach.js`
holds a `TUTORIALS` table keyed by the *real* board each one prepares you for.

Landing pages are `_pages/soccerhockey.md`, `_pages/escherchess.md`, grouped
under `_pages/games.md`.

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

escher/pieces.js  Escher Chess: the piece move sets, and what each becomes
escher/presets.js The two published boards: lenses, armies, file names
escher/game.js    Escher Chess state: legal moves, check, mate, the log
escher/coach.js   Escher Chess: the tutorial steps and the reveal's prose
```

Pure functions over plain data — no DOM, no network, no framework — so the same
files run in the browser and under `node --test`.

Around that sit the two impure layers, each with one job:

```
net/rooms.js      The fixed room pool; share links
net/room.js       Firestore: sign in, claim a seat, append a move, watch
ui/board.js       The isometric board renderer (Soccer Hockey)
ui/chessboard.js  The flat board renderer (Escher Chess)
ui/board.css      Page furniture, the palettes, the move-set grid
ui/coach.js       Tutorial steps and the reveal's prose — all copy lives here
ui/replay.js      The reveal's transport: two panels in step. Game-agnostic
ui/palette.js     The move-set editor, drawn once per lens
img/              Ball, puck, goal and hoop sprites for the isometric board
```

Pages, in the order a pair of players meets them: the tutorial (no network,
duality off), the real game (one board each, ending in the reveal), and — for
Soccer Hockey only — the sandbox (both boards, every dial shared). Each is a
thin HTML file over those modules; none of them holds a rule.

Every intra-project import carries a `?v=` token. GitHub Pages serves assets
with a ten-minute max-age, so an edited module keeps loading from cache while
the page itself is refetched — which looks exactly like a change that never
shipped. Bump them together, and the build stamp at the foot of each page
reports which set the browser actually ran.

### One world, two lenses

There is one game state, stored in **canonical** columns that belong to neither
player. Each seat holds a `Lens`: an affine map on `Z_w`, written
`view = multiplier * canonical + offset`. Soccer Hockey gives it a *fixed
point* instead — the goal column, which cannot move because both players have
to agree where the goals are — and that is the same thing said differently. A
fixed point is a luxury rather than a feature of affine maps, though: Escher
Chess's eight-wide relabelling is `3c - 1 (mod 8)`, and `f = 3f - 1` has no
solution because `2f` is never odd. There, no file is agreed upon at all.
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
node --test _tests/*.test.mjs                      # 379 tests
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

**Reused with a seam cut.** `ui/replay.js` was written around a config and a
move log rather than around Soccer Hockey, but it still reached for that game's
fold and renderer; it now takes both from its caller and owns only the
transport. `ui/coach.js` was not generalised at all — the tutorial steps and the
reveal prose are one game's own, so Escher Chess got `escher/coach.js` rather
than a shared abstraction over two sets of English.

**Soccer Hockey's own.** `core/rules.js` (one ball, a trail, two goal mouths),
`core/game.js`'s notion of a game state, `core/presets.js`, and the isometric
cube renderer in `ui/board.js` — though that last one is worth reading closely
rather than rewriting, since the projection and the scaling are fiddly and
already work on a phone.

The question that had to be settled first was whether chess pieces can be
expressed as a move log at all. They can — no castling and no en passant means
`{from, to, promote}` is the whole story — so the net/ layer and the Security
Rules came free, because the rule counts moves rather than understanding them.

**Escher Chess** is now on the same footing: `escher/` holds its pieces, boards,
engine and copy; `ui/chessboard.js` draws it; and its two pages live in
`assets/EscherChess/…V4.0.html`. V1.2 is archived verbatim in
`_archive/escher-chess-v1.2/`, along with a note on what it got wrong and the
three things from it that were worth keeping.

What the second game actually cost, module by module, is the answer to the
question the split was made for:

| | reused | changed | new |
| --- | --- | --- | --- |
| `core/duality.js` | ✓ | a lens may be given an offset | |
| `core/seats.js` | ✓ | | |
| `net/rooms.js`, `net/room.js` | ✓ | a move is any map; a collection is a parameter | |
| `ui/replay.js` | ✓ | the fold and the renderer are now the caller's | |
| `ui/board.css` | ✓ | one section for the flat board | |
| the game itself | | | `escher/*`, `ui/chessboard.js` |

`ui/replay.js` was the interesting one. It used to import Soccer Hockey's
`replayFrames`, `viewOf` and `createBoardView` directly; it now takes frames, a
per-seat board factory and a caption function, and owns only the transport —
the two panels, the buttons, the scrubber, the arrow keys, and keeping both
boards on the same frame. That is genuinely all it should ever have owned.

Escher's rooms are `escherRooms`, with its own block in
`_firebase/firestore.rules`. The block has to be published before the pages
work; the collection does not exist until the rules allow it to.

An Escher room records which board it is played on, and that field is fixed for
the whole of a game — a move means nothing without the board it was played on.
It may change at exactly one moment: a reset, when the log is emptied and there
is nothing left for the change to invalidate. That is what lets one room host
the five-file game and then the eight-file one, rather than being stuck with
whichever was played in it first, and the rule draws the line in the same place
the client does.

### What the two players share

The *names*, and nothing else. There is no shared board: each player has their
own, and all that passes between them is a sentence. White says "the pawn on D3
to D5" and Black finds the pawn on their own D file. What they do not share is
which file is next to which — White's five files read ARMED left to right and
Black's read DREAM — so "one file across" is a step to a different name for each
of them, and that is the whole duality. Ranks are shared outright; Black simply
draws them from the other end.

So a square is a name and a number, and each board is one arrangement of those
squares. Black's is White's turned around and relabelled. `presets.js` keeps the
two halves apart: `lens` carries the composite, because that is what places a
piece, and `flipsRanks` carries the half of the rotation a lens cannot express.

**The lens is not free.** Two facts pin it down, and both are tested:

1. *The names must agree.* `files[BLACK][lens.toView(f)] === files[WHITE][f]`
   for every file, or the two players are naming different squares and there is
   no game at all. `makeBoard` refuses to build a board that fails it.
2. *The booklets' figures.* The V3 rules show each player their opponent's
   opening position drawn on their own board — `BBRKR` on the narrow board and
   `QNNKRBBR` on the wide one, as White sees them.

Getting those two to agree is what the file names are chosen for, and the
anagrams are the record of which permutation this is: ARMED / DREAM on the
narrow board, and on the wide one the two lines of the logo, `CDHUEASL` and
`EDSUCAHL`, which read alternately as CHES + DUAL and ESCH + DUAL.

One trap, which cost a debugging session: **the armies face each other, and a
half turn reverses files as well as ranks**. It is why a chess player sees
`RNBQKBNR` from the White side and `RNBKQBNR` from the Black one, and why the
army is written down once, as White reads it, and turned around for Black. Miss
it and the queen and king swap files — which the booklet figure catches.

Black's lens is `3f + 3 (mod 5)` and `5f + 4 (mod 8)`, so White reads Black's
file steps as `x2` and `x5` respectively. Since every published move set is
closed under negating its file step, `x2` and `x-2` land on the same squares —
which is why the boards could carry the wrong one of a ± pair for a while
without any piece test noticing. Anything hand-editing a move set later would
need no such symmetry, and there the sign would matter.

The design turns on which pieces survive the relabelling:

| | five wide | eight wide |
| --- | --- | --- |
| Knight | becomes a bishop | becomes a bishop, once widened a file |
| Bishop | becomes a knight | becomes a knight |
| Rook (range 4) | unchanged | unchanged |
| Queen | — | becomes a rook-and-knight compound |
| Pawn, King | nothing recognisable | nothing recognisable |

That table is what sets the order in which a player works the game out, and it
is worth protecting. Pawns *advance* self-dually, so nothing looks wrong for the
first few moves. The minor pieces swap as soon as they develop. The rook looks
normal, which is what makes the swap read as a curiosity rather than as chaos —
weaken the rook below range 3 on the eight-wide board and it stops being
self-dual, and the reassurance goes with it. Pawn *captures* are the first real
shock, and explain the enemy's strange-looking pawn structure after the fact.
The king is last, and is the endgame's puzzle.

`dualityReport` computes that table from the dials, so changing a range says
immediately what it costs.

### Keeping the secret

You are never told how your opponent's pieces move, so `viewOf` hands a seat its
*own* legal moves and nothing else. The enemy's reachable squares are computed —
they have to be, to know whether a king is in check — but they never reach the
view, so they are not sitting in the page for anybody who opens a console.
Check is a bare flag rather than a diagram: you are told you are in check and
left to work out which piece is doing it. `ui/chessboard.js` keeps the same
bargain — it outlines your own king and never the piece attacking it.

`ui/chessboard.js` colours its squares by where they are *drawn* rather than by
which square they are, so each player sees a proper chequerboard and their own
bishop keeps to one colour. The price is that a square is light on your board
and dark on your opponent's, which is a good thing to see side by side in the
reveal. Its one subtlety is sizing: the board is `max-content` wide, so a
`1fr` column would stretch around it and then report that stretched width as
the space available. `fit()` collapses the board before measuring, and
`.dg-chess-pair` uses `minmax(0, 1fr)`.

Still open on the Firebase side: App Check, and restricting the web API key to
the site's own referrer. Both are in [`_firebase/`](../../_firebase/README.md).
