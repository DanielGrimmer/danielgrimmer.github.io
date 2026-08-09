---
layout: page
permalink: /escher-chess/
title: escher chess
description: A chess variant with a mystery at its heart. Two players, two boards that cannot both be right — and yet are.
nav: false # surfaced via the 'games' dropdown in _pages/games.md
---

A chess variant for two players, played on either a 5×13 or an 8×8 board. You and
your opponent look at different boards, and there are two seemingly contradictory
ways of seeing the game that turn out to be perfectly coherent with each other.

It is a complete-information game: nothing is hidden from you, you know exactly
what your opponent is trying to do and exactly how they can do it. They will
still surprise you.

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
  <a href="{{ '/assets/EscherChess/EscherChessDemoV1.2.html' | relative_url }}">Start with the tutorial</a>
  <a href="{{ '/assets/EscherChess/EscherChessGameV1.2.html' | relative_url }}">Go straight to the game</a>
</div>

**Read the tutorial page before playing.** The mystery only works if the two of
you are seated apart, in separate browser sessions, in the same game room, and
not talking during the first game. Afterwards, play again looking at each other's
screens and compare notes — that's when it lands. The 5×13 board is the easier
of the two despite its odd shape; start there.

<!--
  Static bundle in assets/EscherChess/. Shares the Firebase Firestore project
  with Soccer Hockey (same firebaseConfig.js), so the notes in CHECKLIST.md
  section E apply to both games.
-->
