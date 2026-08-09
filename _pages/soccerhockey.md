---
layout: page
permalink: /soccer-hockey/
title: soccer hockey
description: A two-player game where each player sees a different — but equivalent — version of the same match.
nav: true
nav_order: 5
---

Two players sit at separate screens and play what each believes is an ordinary
game. One is playing soccer. The other is playing hockey. Neither can see the
other's board, and neither is wrong: the two boards are different
representations of one and the same underlying game state, related by a duality.
Every move made in one is a legal, sensible move in the other.

It is a playable version of a question I work on in the
[philosophy of physics]({{ '/publications/' | relative_url }}): when two
theories are dual to one another, and each describes the world perfectly well in
its own terms, which one is telling us what the world is really like? See
*Dualities, Quantum Mechanics, and the Uncommon Common Core* on the
publications page.

<!--
  Styled locally rather than with the theme's `btn` classes: those are only given
  a border inside `.publications` (Bootstrap compat is off in al-folio v1.x), so
  they render as bare links anywhere else. Inline styles also survive purgecss,
  which only rewrites _site/assets/css/*.css.
-->
<style>
  .sh-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1.75rem 0; }
  .sh-actions a {
    display: inline-block;
    padding: 0.5rem 1.1rem;
    border: 1px solid var(--global-theme-color);
    border-radius: 4px;
    color: var(--global-theme-color);
    text-decoration: none;
    transition: background-color 0.15s ease, color 0.15s ease;
  }
  .sh-actions a:hover {
    background-color: var(--global-theme-color);
    color: var(--global-bg-color);
  }
</style>

<div class="sh-actions">
  <a href="{{ '/assets/SoccerHockey/SoccerHockeyDemoV3.1.html' | relative_url }}">Start with the tutorial</a>
  <a href="{{ '/assets/SoccerHockey/SoccerHockeyGameV3.1.html' | relative_url }}">Go straight to the game</a>
</div>

**You need a second player**, and for the real game you need to *not* be able to
see each other's screens — that is the whole point. Open the page separately on
your own devices and join the same game room; the state syncs between you. The
tutorial can be played side by side.

<!--
  The game is a static bundle in assets/SoccerHockey/ (two HTML files plus two ES
  modules). It talks to a Firebase Firestore project for room state.

  Firebase web API keys are designed to be public — access is controlled by
  Firestore Security Rules, not by keeping the key secret — so the key in
  firebaseConfig.js is not a leak. But it does mean the rules are the only thing
  guarding that database. See CHECKLIST.md item G1 before relying on this.
-->
