---
layout: page
permalink: /escher-chess/
title: escher chess
description: A chess variant with a mystery at its heart. Two players, two boards that cannot both be right — and yet are.
nav: false # surfaced via the 'games' dropdown in _pages/games.md
---

A chess variant for two players, played on either a 5×10 or an 8×8 board. You and
your opponent look at different boards, and there are two seemingly contradictory
ways of seeing the game that turn out to be perfectly coherent with each other.

It is a complete-information game: nothing is hidden from you, you know exactly
what your opponent is trying to do and exactly how they can do it. They will
still surprise you.

You will not be told how your opponent's pieces move. Working that out from
watching them is the game.

<style>
  .ec-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1.75rem 0; }
  .ec-actions a {
    display: inline-block;
    padding: 0.5rem 1.1rem;
    border: 1px solid var(--global-theme-color);
    border-radius: 4px;
    color: var(--global-theme-color);
    text-decoration: none;
    transition: background-color 0.15s ease, color 0.15s ease;
  }
  .ec-actions a:hover {
    background-color: var(--global-theme-color);
    color: var(--global-bg-color);
  }
</style>

<div class="ec-actions">
  <a href="{{ '/assets/EscherChess/EscherChessTutorialV4.0.html' | relative_url }}">Start with the tutorial</a>
  <a href="{{ '/assets/EscherChess/EscherChessGameV4.0.html' | relative_url }}">Go straight to the game</a>
  <a href="{{ '/assets/EscherChess/EscherChessGameV4.0.html?board=escher-8x8' | relative_url }}">The 8×8 game</a>
</div>

**Play the tutorial first.** It is the same game with the strangeness switched
off, and it takes a couple of minutes. Then the mystery only works if the two of
you are on separate devices, in the same game room, and say nothing to each
other during the first game except your moves — by file and rank, and nothing
else. Afterwards, call each other, look at both screens together, and compare
notes; that is when it lands. The 5×10 board is the easier of the two despite
its odd shape, so start there.

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
