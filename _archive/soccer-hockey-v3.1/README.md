# Soccer Hockey — v3.1 (archived)

The original Soccer Hockey Duality Game, kept verbatim as it stood before the
rewrite. Nothing here is served: this directory begins with an underscore, so
Jekyll skips it.

The live copies of these files are still at `assets/SoccerHockey/`. They stay in
place and keep working until the rewrite replaces them.

## What is here

| File | What it is |
| --- | --- |
| `SoccerHockeyDemoV3.1.html` | The basketball-themed tutorial: 9×11, no duality, teaches the interface |
| `SoccerHockeyGameV3.1.html` | The real game: 11×13, duality number 4 |
| `SoccerHockeyGameRooms.js` | Ten hard-coded room names |
| `firebaseConfig.js` | Firebase project `soccerhockeyduality` — shared with Escher Chess |
| `firestore.rules` | The Security Rules as of Aug 2026, transcribed from the console |

## Why it is being replaced

Each file is a single ~1,000-line HTML document with its CSS and an ES module
inline. The demo and the game reimplement the same rules separately, which is
how they came to disagree. Known defects, all reproduced in the files above:

1. **Opening the game directly softlocks it.** `userType` is assigned only by
   the demo page, and the game page has no control to set it, so
   `isPlayersTurn()` is false forever.
2. **Player assignment is a site-wide counter.** Seat parity comes from a global
   visitor count rather than from the room, and is cached in `localStorage`
   permanently.
3. **Stalemate is miscounted.** `getValidMovesFromPosition` does not exclude the
   walled-off goal-row squares, so a player whose only moves are into blocked
   cells gets no tie declared and the game hangs. The demo has this guard
   (line 323); the game lost it.
4. **The duality number is not synced.** `width`, `height` and `b` are in the
   Firestore document, but `a` is read from a DOM input, so the two players can
   silently diverge.
5. **The reveal is protected only by scroll position.** Both boards are in the
   page from the start.
6. Duplicate `id="resetButton"`; a dead `checkGameOver()` calling an undefined
   `getValidMoves()`; `--cell-size: clamp(25px, 3vw, 25px)` has min == max, so
   the board never scales on small screens.

## What is worth keeping

The look. The isometric board — three CSS-transformed faces per cube, and the
`translateY(-15px)` lift on hover — carries over to the rewrite, along with both
palettes:

| | top | left | right |
| --- | --- | --- | --- |
| Basketball (demo) | `#dfbb85` | `#981717` | `#f9c852` |
| Soccer | `#98e070` | `#8B4513` | `#A0522D` |
| Hockey | `#e0f4ff` | `#c0e8ff` | `#a0dcff` |

Valid-move highlight is `#ffffcc` with a `#FFD700` border on the top face only.
