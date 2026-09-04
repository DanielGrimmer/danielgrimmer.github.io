---
layout: page
permalink: /escher-chess/
title: escher chess # the navbar label, lower-case like its siblings
display_title: The Escher Chess Duality Game # the <h1> on the page itself
description: An Escher-inspired chess variant with a mystery at its heart.
nav: false # surfaced via the 'games' dropdown in _pages/games.md
---

<!--
  The same structure as the Soccer Hockey landing page, with this game's own
  prose: the wordmark, the claim beside the chess-set illusion, the firewall,
  the doors in their required order, and the aside.

  The theme prints `display_title` and `description` as the heading and the
  line under it, so the page itself starts with the wordmark.
-->

<!-- The three families, served from this repository; see fonts.css. -->
<link rel="stylesheet" href="{{ '/assets/games/ui/fonts.css' | relative_url }}?v=4.37.0" />
<link rel="stylesheet" href="{{ '/assets/games/ui/board.css' | relative_url }}?v=4.37.0" />
<link rel="stylesheet" href="{{ '/assets/games/ui/pages.css' | relative_url }}?v=4.37.0" />

<div class="dg dg-scope">
  <div class="dg-wrap">
    <!--
      The wordmark, rebuilt as text rather than shipped as a picture: five
      columns reading ESCHR over CHESS, with DUAL ghosted into the gaps. As SVG
      it stays sharp at any size and takes its two colours from the palette, so
      it holds up in both schemes — a raster of black-on-white would glare in
      the dark one.
    -->
    <div style="padding: 2.75rem 2.75rem 0; display: flex; justify-content: center">
      <svg
        viewBox="0 0 1040 260"
        role="img"
        aria-label="Escher Chess — dual"
        style="width: min(34rem, 100%); height: auto; display: block"
        font-family="var(--dg-sans)"
        font-weight="500"
        font-size="84"
        text-anchor="middle"
      >
        <title>Escher Chess</title>
        <g fill="var(--dg-ink)">
          <text x="40" y="78">E</text><text x="278" y="78">S</text><text x="516" y="78">C</text><text x="754" y="78">H</text><text x="992" y="78">R</text>
          <text x="40" y="238">C</text><text x="278" y="238">H</text><text x="516" y="238">E</text><text x="754" y="238">S</text><text x="992" y="238">S</text>
        </g>
        <g fill="var(--dg-rule-2)">
          <text x="159" y="158">D</text><text x="397" y="158">U</text><text x="635" y="158">A</text><text x="873" y="158">L</text>
        </g>
      </svg>
    </div>

    <div class="dg-hero" id="ecHero" style="padding-top: 1.75rem">
      <p>
        A chess variant for two players, played first on a 5×10 board and then
        on an 8×8 one. In each case, there are two flatly contradictory ways of
        seeing this game which somehow turn out to be perfectly coherent with
        each other.
      </p>
      <!--
        The chess-set illusion: one set drawn from two irreconcilable
        viewpoints at once, which is this game's claim in one image. The file
        is not in the repository yet — until it is committed at this path the
        error handler folds the hero to a single column and nothing is missed.
      -->
      <img
        src="{{ '/assets/EscherChess/img/escher-set.png' | relative_url }}"
        alt="A chess set drawn from two contradictory viewpoints at once"
        style="max-width: 100%; height: auto"
        onerror="this.hidden = true; document.getElementById('ecHero').style.gridTemplateColumns = '1fr'"
      />
    </div>

    <div class="dg-choices" style="padding-top: 0.375rem">
      <div>
        <div class="dg-firewall">
          <div class="dg-label dg-label-red">The firewall</div>
          <p>
            You and your friend must play on separate devices. No peeking at
            each other's screen. No talking — mute the call. For the first game,
            each of you should attend only to your own board. Breaking the
            firewall spoils the mystery. Call each other afterwards.
          </p>
        </div>

        <p>
          There is a tutorial and a game in both sizes (5×10 and 8×8). Please
          play them in the correct order as they build upon each other. Taken
          out of order they will spoil each other. The two tutorials can be
          played alone, or side-by-side with your friend. But the two games
          require that you use separate devices.
        </p>

        <ol class="dg-doors">
          <li class="dg-door">
            <span class="dg-door-n">1</span>
            <span>
              <span class="dg-door-title">The 5×10 tutorial</span>
              <span class="dg-door-note">
                It will only take a few minutes to familiarize yourself with the
                new board shape and the slightly funny pieces.
              </span>
            </span>
            <a class="dg-btn dg-btn-primary" href="{{ '/assets/EscherChess/EscherChessTutorialV4.0.html' | relative_url }}">Tutorial</a>
          </li>
          <li class="dg-door">
            <span class="dg-door-n">2</span>
            <span>
              <span class="dg-door-title">The 5×10 game</span>
              <span class="dg-door-note">
                Play with a friend on separate devices. Chat afterwards.
              </span>
            </span>
            <a class="dg-btn dg-btn-primary" href="{{ '/assets/EscherChess/EscherChessGameV4.0.html' | relative_url }}">Play</a>
          </li>
          <li class="dg-door">
            <span class="dg-door-n">3</span>
            <span>
              <span class="dg-door-title">The 8×8 tutorial</span>
              <span class="dg-door-note">
                Another (even shorter) tutorial to familiarize yourself with how
                the pieces behave on the new board.
              </span>
            </span>
            <a class="dg-btn" href="{{ '/assets/EscherChess/EscherChessTutorialV4.0.html?board=escher-8x8' | relative_url }}">Tutorial</a>
          </li>
          <li class="dg-door">
            <span class="dg-door-n">4</span>
            <span>
              <span class="dg-door-title">The 8×8 game</span>
              <span class="dg-door-note">
                Play with a friend on separate devices. Chat afterwards.
              </span>
            </span>
            <a class="dg-btn" href="{{ '/assets/EscherChess/EscherChessGameV4.0.html?board=escher-8x8' | relative_url }}">Play</a>
          </li>
        </ol>

        <p class="dg-door-note" style="margin-top: 1.375rem">
          Each screen hands you the next one when you are finished with it, so
          you can start at the top and never come back here.
        </p>
      </div>

      <aside class="dg-aside">
        <div class="dg-label">You will need</div>
        <ul>
          <li>a friend</li>
          <li>two devices, two screens</li>
          <li>about thirty minutes per game</li>
          <li>a way to talk <em>afterwards</em></li>
        </ul>
      </aside>
    </div>
  </div>
</div>

<script type="module">
  /*
   * Follow the site's own light/dark toggle rather than the operating system —
   * the same mirror as the Soccer Hockey landing page, for the same reason:
   * al-folio writes the reader's choice to `data-theme`, the game stylesheets
   * read `data-dg-theme`, and this is a page where both are in play.
   */
  const root = document.documentElement;
  const followSiteTheme = () => {
    const chosen = root.getAttribute('data-theme');
    if (chosen) root.setAttribute('data-dg-theme', chosen);
    else root.removeAttribute('data-dg-theme');
  };
  followSiteTheme();
  new MutationObserver(followSiteTheme).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
</script>

<!--
  Both pages are V4.0, in assets/EscherChess/, built on the shared modules in
  assets/games/ — see assets/games/README.md. The V1.2 pages they replaced are
  gone from assets/, kept verbatim in _archive/escher-chess-v1.2/.

  Shares the Firebase Firestore project with Soccer Hockey (same
  firebaseConfig.js) but its own collection, escherRooms, so the notes in
  _firebase/README.md apply to both games.

  No sandbox here, unlike Soccer Hockey: the rules are specific enough that
  letting a player design pieces would be a different activity rather than a
  closer look at this one.
-->
