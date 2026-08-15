# Escher Chess — v1.2 (archived)

The original Escher Chess implementation, kept verbatim as it stood before the
rewrite. Nothing here is served: this directory begins with an underscore, so
Jekyll skips it.

This is now the only copy. V4.0 replaced these pages, and the originals were
moved out of `assets/EscherChess/` once nothing linked to them. Its
`firebaseConfig.js` came along too — it was byte-identical to the Soccer Hockey
one, which is the copy V4.0 actually imports.

The Firestore collection these pages used, `EscherChessGames`, is being deleted
along with this archive, so they will not work even if opened directly.

## What is here

| File | What it is |
| --- | --- |
| `EscherChessDemoV1.2.html` | The tutorial: ordinary chess, no duality |
| `EscherChessGameV1.2.html` | The real game, on a 5×13 or 8×8 board |
| `EscherChessLogic.js` | ~1,400 lines: rules, rendering, Firestore, and the rules text |
| `EscherChessMoves5x13.js`, `EscherChessMoves8x8.js` | Move tables, per piece **per side** |
| `DemoChessMoves*.js` | The same tables again, for the duality-off tutorial |
| `PermutationMatrices.js` | The file relabelling, as explicit 5×5 and 8×8 matrices |
| `EscherChessGameRooms.js` | Room names |
| `EscherChessStyle.css` | The flat board, whose palette V4.0 keeps |
| `EscherChessIllusion.png`, `EscherChessLogo.png` | Artwork |

## Why it was replaced

The same reason Soccer Hockey V3.1 was: one long document per page, with the
rules restated in several places and no way to test any of it. Specifically:

1. **The duality was written out twice, by hand.** Each piece's moves are listed
   separately for White and for Black, in `EscherChessMoves*.js`, with the
   relabelling already applied by whoever typed them. Nothing checked that the
   two halves were actually duals, which is precisely the property the game is
   made of. V4.0 writes one table, as the owner sees it, and applies the lens.
2. **Both players were told the answer.** The rules text on the game page
   explained how the opponent's pieces move. Working that out is the game, so
   V4.0's `viewOf` hands a seat its own legal moves and nothing else.
3. **The 8×8 rook was not self-dual.** The printed rules gave it range 2, which
   is not a union of orbits of the duality number on eight files — so the piece
   that was meant to reassure a new player was strange too. V4.0 uses range 4 on
   both boards, and there is a test.
4. **State was a board array, not a move log.** Which meant no replay, and rules
   that could not be policed by a Security Rule — a rule cannot read a board,
   but it can count moves and check parity.
5. Player assignment came from a site-wide visitor counter in `sharedData`,
   cached in `localStorage`; the same defect Soccer Hockey V3.1 had.

## What was worth keeping

**`PermutationMatrices.js`.** Its two matrices are the only surviving written
record of which relabelling this game uses, and they were the third independent
check on V4.0's lens — the booklet figures and the file anagrams being the other
two. The comments say `x -> 2x - 1 (mod 5)` and `x -> -3x + 4 (mod 8)`; the code
underneath says `-2x + 2` and `3x - 1`, and the code is what ran. V4.0's lenses
are the inverses of these, because V4.0 takes White's board as canonical where
V1.2 took the other one.

**The board's palette.** `#f0d9b5` light, `#b58863` dark, carried into
`ui/board.css` unchanged.

**The file names.** `D R E A M` / `A R M E D` and `E D S U C A H L` /
`C D H U E A S L` — the second pair being the two lines of the game's logo read
alternately, CHES + DUAL and ESCH + DUAL. These are not decoration: matching the
names is what fixes the lens, so the anagrams are the permutation written down.
