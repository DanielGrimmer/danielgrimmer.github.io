---
layout: page
permalink: /escher-chess/
title: escher chess # the navbar label, lower-case like its siblings
display_title: The Escher Chess Duality Game # the <h1> on the page itself
description: A chess variant with a mystery at its heart. Two players, two boards that cannot both be right — and yet are.
nav: false # surfaced via the 'games' dropdown in _pages/games.md
---

<!--
  The same structure as the Soccer Hockey landing page, with this game's own
  prose: the wordmark, the claim beside the chess-set illusion, the firewall,
  the doors in their required order, and the aside.

  The theme prints `display_title` and `description` as the heading and the
  line under it, so the page itself starts with the wordmark.
-->

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" />
<link rel="stylesheet" href="{{ '/assets/games/ui/board.css' | relative_url }}?v=4.27.0" />
<link rel="stylesheet" href="{{ '/assets/games/ui/pages.css' | relative_url }}?v=4.27.0" />

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
        on an 8×8 one. You and your opponent look at different boards, and
        there are two seemingly contradictory ways of seeing the game that
        turn out to be perfectly coherent with each other.
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
            Separate devices for the games, and say nothing to each other but
            your moves — by file and rank, and nothing else — until it is over.
            Then call each other, put both screens side by side, and compare
            notes. That is when it lands.
          </p>
        </div>

        <p>
          There are four screens, and they go in this order. It is not a
          suggestion: each one is written assuming you have done the one before,
          and taken out of order they spoil each other. The two tutorials are
          played alone, or with somebody next to you; the two games need a
          friend on their own device.
        </p>

        <ol class="dg-doors">
          <li class="dg-door">
            <span class="dg-door-n">1</span>
            <span>
              <span class="dg-door-title">The 5×10 tutorial</span>
              <span class="dg-door-note">
                A few minutes, on your own. The same game with the strangeness
                switched off, so that you learn your own pieces before anything
                is hidden from you.
              </span>
            </span>
            <a class="dg-btn dg-btn-primary" href="{{ '/assets/EscherChess/EscherChessTutorialV4.0.html' | relative_url }}">Tutorial</a>
          </li>
          <li class="dg-door">
            <span class="dg-door-n">2</span>
            <span>
              <span class="dg-door-title">The 5×10 game</span>
              <span class="dg-door-note">
                With a friend, on separate devices, in the same room name.
              </span>
            </span>
            <a class="dg-btn dg-btn-primary" href="{{ '/assets/EscherChess/EscherChessGameV4.0.html' | relative_url }}">Play</a>
          </li>
          <li class="dg-door">
            <span class="dg-door-n">3</span>
            <span>
              <span class="dg-door-title">The 8×8 tutorial</span>
              <span class="dg-door-note">
                Shorter, and again on your own. Two pieces on the wider board are
                not the ones you have been playing with: the knight moves
                differently, and there is a queen. This is where you meet them.
              </span>
            </span>
            <a class="dg-btn" href="{{ '/assets/EscherChess/EscherChessTutorialV4.0.html?board=escher-8x8' | relative_url }}">Tutorial</a>
          </li>
          <li class="dg-door">
            <span class="dg-door-n">4</span>
            <span>
              <span class="dg-door-title">The 8×8 game</span>
              <span class="dg-door-note">
                The same trick, with more pieces and more of them strange, so it
                takes longer to see. Separate devices and no talking, exactly as
                before.
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
          <li>a way to talk <em>afterwards</em></li>
        </ul>
        <div class="dg-aside-foot">
          It is a complete-information game: nothing is hidden from you, you
          know exactly what your opponent is trying to do and exactly how they
          can do it. They will still surprise you. You will not be told how your
          opponent's pieces move — working that out from watching them is the
          game.
        </div>
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
  CHECKLIST.md section E apply to both games.

  No sandbox here, unlike Soccer Hockey: the rules are specific enough that
  letting a player design pieces would be a different activity rather than a
  closer look at this one.
-->
