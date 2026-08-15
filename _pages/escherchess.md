---
layout: page
permalink: /escher-chess/
title: escher chess
description: A chess variant with a mystery at its heart. Two players, two boards that cannot both be right — and yet are.
nav: false # surfaced via the 'games' dropdown in _pages/games.md
---

A chess variant for two players, played first on a 5×10 board and then on an 8×8
one. You and your opponent look at different boards, and there are two seemingly
contradictory ways of seeing the game that turn out to be perfectly coherent
with each other.

It is a complete-information game: nothing is hidden from you, you know exactly
what your opponent is trying to do and exactly how they can do it. They will
still surprise you.

You will not be told how your opponent's pieces move. Working that out from
watching them is the game.

## The order of play

There are four screens, and they go in this order. It is not a suggestion:
each one is written assuming you have done the one before, and taken out of
order they spoil each other. The two tutorials are played alone, or with
somebody next to you; the two games need a friend on their own device.

<style>
  .ec-path { list-style: none; padding: 0; margin: 1.5rem 0 1rem; counter-reset: ec; }
  .ec-path li {
    display: grid;
    grid-template-columns: 2rem 1fr;
    gap: 0 0.9rem;
    align-items: baseline;
    padding: 0.85rem 0;
    border-top: 1px solid var(--global-divider-color);
  }
  .ec-path li:last-child { border-bottom: 1px solid var(--global-divider-color); }
  .ec-path li::before {
    counter-increment: ec;
    content: counter(ec);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--global-theme-color);
  }
  .ec-path a {
    font-weight: 600;
    color: var(--global-theme-color);
    text-decoration: none;
    border-bottom: 1px solid transparent;
  }
  .ec-path a:hover { border-bottom-color: var(--global-theme-color); }
  .ec-path .ec-note {
    grid-column: 2;
    margin: 0.2rem 0 0;
    font-size: 0.92rem;
    color: var(--global-text-color-light);
  }
</style>

<ol class="ec-path">
  <li>
    <a href="{{ '/assets/EscherChess/EscherChessTutorialV4.0.html' | relative_url }}">The 5×10 tutorial</a>
    <p class="ec-note">
      A few minutes, on your own. The same game with the strangeness switched
      off, so that you learn your own pieces before anything is hidden from you.
    </p>
  </li>
  <li>
    <a href="{{ '/assets/EscherChess/EscherChessGameV4.0.html' | relative_url }}">The 5×10 game</a>
    <p class="ec-note">
      With a friend, on separate devices, in the same room name. Say nothing to
      each other but your moves — by file and rank, and nothing else — until it
      is over. Then call each other, put both screens side by side, and compare
      notes. That is when it lands.
    </p>
  </li>
  <li>
    <a href="{{ '/assets/EscherChess/EscherChessTutorialV4.0.html?board=escher-8x8' | relative_url }}">The 8×8 tutorial</a>
    <p class="ec-note">
      Shorter, and again on your own. Two pieces on the wider board are not the
      ones you have been playing with: the knight moves differently, and there
      is a queen. This is where you meet them.
    </p>
  </li>
  <li>
    <a href="{{ '/assets/EscherChess/EscherChessGameV4.0.html?board=escher-8x8' | relative_url }}">The 8×8 game</a>
    <p class="ec-note">
      The same trick, with more pieces and more of them strange, so it takes
      longer to see. Separate devices and no talking, exactly as before.
    </p>
  </li>
</ol>

Each screen hands you the next one when you are finished with it, so you can
start at the top and never come back here.

<!--
  Both pages are V4.0, in assets/EscherChess/, built on the shared modules in
  assets/games/ — see assets/games/README.md. The V1.2 pages they replaced are
  gone from assets/, kept verbatim in _archive/escher-chess-v1.2/.

  Shares the Firebase Firestore project with Soccer Hockey (same
  firebaseConfig.js) but its own collection, escherRooms, so the notes in
  CHECKLIST.md section E apply to both games.

  No sandbox here, unlike Soccer Hockey: the rules are specific enough that
  letting a player design pieces would be a different activity rather than a
  closer look at this one.
-->
