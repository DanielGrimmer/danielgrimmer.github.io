/**
 * The two published configurations.
 *
 * The tutorial is the same engine with duality 1: both lenses are the identity,
 * so the two views coincide and there is nothing to reveal. That is exactly
 * what a practice board is. In v3.1 the tutorial was a separate implementation,
 * which is how it ended up with a stalemate guard the real game lacked.
 */

import { makeConfig } from './game.js?v=4.22.0';

/*
 * A seat's `theme` is a name, not a palette: the colours themselves live in
 * `ui/board.css`, keyed on `[data-theme]`. Keeping a second copy here — as an
 * earlier version did — gives you two places to change a colour and one place
 * to forget.
 */

/**
 * The tutorial: 9x11, no duality, eight neighbours plus a few long passes.
 * Offsets copied from v3.1's demo page.
 */
export const BASKETBALL_TUTORIAL = makeConfig({
  id: 'basketball-tutorial',
  label: 'Basketball (tutorial)',
  width: 9,
  height: 11,
  duality: 1,
  moveSet: [
    [2, -2],
    [3, 0],
    [2, 2],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, -3],
    [0, -1],
    [0, 1],
    [0, 3],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [-2, -2],
    [-3, 0],
    [-2, 2],
  ],
  seats: [
    { name: 'Player 1', theme: 'basketball', goalCorner: 'top right' },
    { name: 'Player 2', theme: 'basketball', goalCorner: 'bottom left' },
  ],
});

/** The real game: 11x13, duality number 4. Seat 0 reads soccer, seat 1 hockey. */
export const SOCCER_HOCKEY = makeConfig({
  id: 'soccer-hockey',
  label: 'Soccer Hockey Duality',
  width: 11,
  height: 13,
  duality: 4,
  /*
   * `goalCorner` is where that seat is trying to reach, in the words a player
   * can act on. Seat 0 always defends row 0, which the isometric projection
   * puts at the top right; seat 1 has the far end, at the bottom left. Which
   * sport you are handed is unrelated to which way you are heading, and the two
   * being independent is exactly what makes it easy to lose track of.
   */
  seats: [
    { name: 'Player 1', theme: 'soccer', sport: 'Soccer', surface: 'Soccer Field', goalCorner: 'top right' },
    { name: 'Player 2', theme: 'hockey', sport: 'Hockey', surface: 'Hockey Rink', goalCorner: 'bottom left' },
  ],
});
