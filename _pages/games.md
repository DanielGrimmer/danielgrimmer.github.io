---
layout: page
permalink: /games/
title: duality games
description: Two-player games in which each player sees a different board — and neither of them is wrong.
nav: true
nav_order: 5
dropdown: true
children:
  - title: overview
    permalink: /games/
  - title: divider
  - title: soccer hockey duality
    permalink: /soccer-hockey/
  - title: escher chess
    permalink: /escher-chess/
---

<!--
  The navbar renders a dropdown's parent as `href="#"` (see header.liquid in the
  al_folio_core gem), so this page is not reachable from the parent label. The
  `overview` child above is what links to it. It also needs its own `permalink`
  regardless: without one Jekyll still publishes the file at /_pages/games/ and
  lists that URL in sitemap.xml.
-->

Two theories are **dual** when they look nothing alike and yet say precisely the
same thing: every state, every observable and every prediction on one side has a
counterpart on the other, and no experiment can pull them apart. Physics has real
examples. The AdS/CFT correspondence relates a theory of gravity in a curved
spacetime to a quantum field theory living on that spacetime's boundary — a
different number of dimensions, different objects, arguably a different space
altogether.

Which leaves the question I keep returning to in my work: if each description
accounts for everything there is to account for, which one tells us what the world
is _really_ like? Or is the question itself confused?

These games are that question, made playable. In each of them you and your
opponent are given different-looking boards, and each of you is told — truthfully
— that you are playing the game in front of you. You are not playing the same
game as your opponent. You are also not playing a different one.

<!--
  Styled inline rather than with the theme's `btn` classes: those are only given a
  border inside `.publications` (Bootstrap compat is off in al-folio v1.x), so
  they render as bare links anywhere else. Inline styles also survive purgecss,
  which only rewrites _site/assets/css/*.css. Same approach as the two game pages.
-->
<style>
  .dg-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1.25rem;
    margin: 2rem 0;
  }
  .dg-card {
    display: flex;
    flex-direction: column;
    padding: 1.25rem 1.4rem 1.4rem;
    border: 1px solid var(--global-divider-color);
    border-radius: 6px;
    background-color: var(--global-card-bg-color);
  }
  .dg-card h3 {
    margin: 0 0 0.6rem;
    font-size: 1.15rem;
  }
  .dg-card h3 a {
    color: var(--global-theme-color);
    text-decoration: none;
  }
  .dg-card p {
    margin: 0 0 1.1rem;
  }
  .dg-card .dg-play {
    margin-top: auto;
    display: inline-block;
    align-self: flex-start;
    padding: 0.45rem 1rem;
    border: 1px solid var(--global-theme-color);
    border-radius: 4px;
    color: var(--global-theme-color);
    text-decoration: none;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }
  .dg-card .dg-play:hover {
    background-color: var(--global-theme-color);
    color: var(--global-bg-color);
  }
</style>

<div class="dg-cards">
  <div class="dg-card">
    <h3><a href="{{ '/soccer-hockey/' | relative_url }}">Soccer Hockey Duality</a></h3>
    <p>
      One of you is playing soccer. The other is playing hockey. Every move made in
      one game is a legal, sensible move in the other, because the two boards are
      different representations of a single underlying game state.
    </p>
    <a class="dg-play" href="{{ '/soccer-hockey/' | relative_url }}">How to play →</a>
  </div>

  <div class="dg-card">
    <h3><a href="{{ '/escher-chess/' | relative_url }}">Escher Chess</a></h3>
    <p>
      A chess variant on a 5×13 or 8×8 board. You and your opponent see different
      boards, and there are two apparently contradictory ways of reading the game
      that turn out to be perfectly consistent with one another.
    </p>
    <a class="dg-play" href="{{ '/escher-chess/' | relative_url }}">How to play →</a>
  </div>
</div>

## What you need

Both games are played in the browser, and both need **a second player**. For the
real thing you also need to _not_ be able to see each other's screen — that is the
whole point of the exercise. Open the game on your own devices, join the same
room, and the state syncs between you. Each game comes with a tutorial that is
fine to play side by side; the game itself is not.

Afterwards, play a second time looking at each other's screens, and compare notes.
That is when it lands.

Soccer Hockey then has a third screen — a sandbox, opened from the end of the
reveal — where the board size, the duality number and the moves themselves
become dials the two of you share.

## Further reading

The philosophical case behind these games is set out in _Dualities, Quantum
Mechanics, and the Uncommon Common Core_ (with Enrico Cinti and Rasmus Jaksland),
[_The British Journal for the Philosophy of Science_](https://www.journals.uchicago.edu/doi/10.1086/730421),
and the broader view of spacetime structure it belongs to is developed in my
[DPhil thesis]({{ '/publications/' | relative_url }}).
