---
layout: page
permalink: /soccer-hockey/
title: soccer hockey # the navbar label, lower-case like its siblings
display_title: The Soccer-Hockey Duality Game # the <h1> on the page itself
description: Soccer and Hockey are very different games... or aren't they?
nav: false # surfaced via the 'games' dropdown in _pages/games.md
---

This game must be played with a friend. There is a mystery at the heart of this
game which the two players should try to solve together after playing their
first game. In brief, there are two seemingly contradictory ways of looking at
this game which are nonetheless somehow perfectly coherent with each other. In
order to preserve the mystery until the end of the first game, however, **there
must be a strict firewall** between you and your friend. While you can be
sitting side-by-side for the tutorial, it will be important for the real game
that you are on **separate devices**, that you **do not peak** at each other's
screens, and **do not talk** to each other (e.g., mute your audio call). During
the first game, each player should be focused solely upon their own game
experience. After this, once you begin comparing notes, the nature of the game's
central mystery will become apparent.

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
  <a href="{{ '/assets/SoccerHockey/SoccerHockeyTutorialV4.0.html' | relative_url }}">Start with the tutorial (Basketball)</a>
  <a href="{{ '/assets/SoccerHockey/SoccerHockeyGameV4.0.html' | relative_url }}">Go straight to the game (Soccer or Hockey)</a>
  <a href="{{ '/assets/SoccerHockey/SoccerHockeySandboxV4.0.html' | relative_url }}">The sandbox (after your first game)</a>
</div>

While the tutorial can be played side-by-side on one device, you will ultimately
need to open this webpage on two separate devices. Once you get into the same
game room, the game state will be synchronized automatically behind the scenes.

<!--
  Both pages are V4.0. The tutorial needs nothing but a browser; the game needs
  Anonymous Authentication and the dualityRooms rules from _firebase/. The V3.1
  pages they replaced are gone from assets/, kept verbatim in
  _archive/soccer-hockey-v3.1/.

  Firebase web API keys are designed to be public — access is controlled by
  Firestore Security Rules, not by keeping the key secret — so the key in
  firebaseConfig.js is not a leak. The rules are in _firebase/.
-->
