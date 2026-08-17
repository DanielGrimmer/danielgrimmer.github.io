---
layout: page
permalink: /soccer-hockey/
title: soccer hockey # the navbar label, lower-case like its siblings
display_title: The Soccer-Hockey Duality Game # the <h1> on the page itself
description: Soccer and Hockey are very different games... or aren't they?
nav: false # surfaced via the 'games' dropdown in _pages/games.md
---

<!--
  The design's chrome strip and its own <h1>/lede are deliberately absent: this
  page sits inside the site's layout, so the navbar is the way home and
  `_layouts/page.liquid` already prints `display_title` and `description` as the
  heading and the line under it. Printing them again here would say everything
  twice. What the hero holds instead is the opening claim, beside the board.

  Tokens are scoped to `.dg .dg-scope` rather than the body for the same reason:
  the page does not own the body. See the head of pages.css.
-->

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" />
<link rel="stylesheet" href="{{ '/assets/games/ui/board.css' | relative_url }}?v=4.33.0" />
<link rel="stylesheet" href="{{ '/assets/games/ui/pages.css' | relative_url }}?v=4.33.0" />

<div class="dg dg-scope">
  <div class="dg-wrap">
    <div class="dg-hero">
      <p>
        There is a mystery at the heart of this game: there are two flatly
        contradictory ways of seeing this game which are nonetheless perfectly
        coherent with each other. You and a friend are meant to solve this
        mystery together, after playing through the game.
      </p>
      <!-- Half turf, half ice, seam down the middle. Drawn by the script below. -->
      <div class="dg-hero-board" id="heroBoard"></div>
    </div>

    <div class="dg-choices">
      <div>
        <div class="dg-firewall">
          <div class="dg-label dg-label-red">The firewall</div>
          <p>
            You and your friend must play on separate devices. No peeking at
            each other's screen. No talking — mute the call. For the first game,
            each of you should attend only to your own board. Breaking the
            firewall spoils the mystery.
          </p>
        </div>

        <ol class="dg-doors">
          <li class="dg-door">
            <span class="dg-door-n">1</span>
            <span>
              <span class="dg-door-title">Learn the controls on the practice court</span>
              <span class="dg-door-note">
                Basketball, duality switched off. Fine to play alone or side by
                side, on one device.
              </span>
            </span>
            <a class="dg-btn dg-btn-primary" href="{{ '/assets/SoccerHockey/SoccerHockeyTutorialV4.0.html' | relative_url }}">Tutorial</a>
          </li>
          <li class="dg-door">
            <span class="dg-door-n">2</span>
            <span>
              <span class="dg-door-title">Split up, and play the real game</span>
              <span class="dg-door-note">
                Soccer or Hockey, duality turned on. You will be paired into a
                room automatically.
              </span>
            </span>
            <a class="dg-btn dg-btn-primary" href="{{ '/assets/SoccerHockey/SoccerHockeyGameV4.0.html' | relative_url }}">Play</a>
          </li>
          <!--
            Locked in appearance, reachable in fact. The design draws this third
            action as plain text, and it is right that it should not invite a
            click — but the sandbox is otherwise only reachable from the reveal,
            and a player coming back a day later would have no route to it at
            all. So it keeps the muted label and is a link underneath.
          -->
          <li class="dg-door" data-locked="true">
            <span class="dg-door-n">3</span>
            <span>
              <span class="dg-door-title">Look under the hood, together</span>
              <span class="dg-door-note">
                The sandbox opens every dial. Don't touch this until the first
                game is over.
              </span>
            </span>
            <a class="dg-label" href="{{ '/assets/SoccerHockey/SoccerHockeySandboxV4.0.html' | relative_url }}">after game 1</a>
          </li>
        </ol>
      </div>

      <aside class="dg-aside">
        <div class="dg-label">You will need</div>
        <ul>
          <li>a friend</li>
          <li>two devices, two screens</li>
          <li>about twenty minutes</li>
          <li>a way to talk <em>afterwards</em></li>
        </ul>
      </aside>
    </div>
  </div>
</div>

<script type="module">
  /*
   * The hero board: half soccer pitch, half hockey rink, with the seam running
   * down the middle of the picture. It is the page's claim in one image, and it
   * is never played — no click handler and no trail.
   *
   * What it does draw is a real position, by the real renderer: the ball at
   * mid-field and an approach dot on every square from which a goal can be
   * reached. No star of legal moves — this is a picture of a game, and a lit
   * star reads as an invitation to click one.
   *
   * The dots are the picture's one piece of sleight of hand, and the only part
   * of it that is really two boards. On the turf they are the soccer player's,
   * on the ice the hockey player's, because that is what each of them would
   * have in front of them. Four of them shift a square outwards as they cross
   * the seam, which is the whole duality showing itself in the smallest
   * possible way: the same eight squares, counted with a different reach.
   *
   * The split is by *screen* position rather than by grid, because the board is
   * drawn isometrically: a column is a diagonal on screen, so colouring by
   * `col` alone would put the seam on the diagonal. `col - row` is constant
   * along a screen-vertical line, which is the line we want.
   *
   * Per-cube rather than per-board, which the renderer already allows: it sets
   * `data-theme` on the surface, and one rule in pages.css lets a cube restate
   * the rink's surface colours from a `data-surface` of its own. No fork.
   */
  import { SOCCER_HOCKEY } from '{{ "/assets/games/core/presets.js" | relative_url }}?v=4.33.0';
  import { initialGame, viewOf, squareFromView } from '{{ "/assets/games/core/game.js" | relative_url }}?v=4.33.0';
  import { createBoardView } from '{{ "/assets/games/ui/board.js" | relative_url }}?v=4.33.0';

  /*
   * Follow the site's own light/dark toggle rather than the operating system.
   *
   * This is the one page of the four that sits inside the theme, so it is the
   * one place the two can disagree: al-folio writes the reader's choice to
   * `data-theme`, board.css and pages.css read `data-dg-theme`, and without
   * this a reader who has turned the site dark on a light machine gets a chalk
   * panel in the middle of a night-coloured page. Mirrored rather than merged,
   * because the standalone pages have no toggle to follow and should keep
   * taking the system's word for it.
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

  const config = SOCCER_HOCKEY;
  const { width, height } = config.board;

  /*
   * Mid-field, one file to the turf side of the goal's own file — the ball's
   * real starting square stands on the seam, and the ball belongs on the grass.
   * Named in view coordinates, since that is where the picture is composed, and
   * put back through the lens so the dots come out of the ordinary rules rather
   * than being drawn by hand.
   */
  const stand = squareFromView(config, 0, {
    row: Math.floor(height / 2),
    col: Math.floor(width / 2) - 1,
  });
  const game = { ...initialGame(config), ...stand };
  const view = viewOf(config, game, 0);
  /** The same approach squares, as the seat on the other side of the seam reads them. */
  const iceDots = new Set(
    viewOf(config, game, 1).goalApproaches.map(({ row, col }) => `${row},${col}`)
  );

  const board = createBoardView(document.getElementById('heroBoard'), {
    board: config.board,
    theme: 'soccer',
    interactive: false,
  });
  board.render({ ...view, legalMoves: [], blockedMoves: [] });

  /*
   * Which side of the seam each cube falls on. `seam` is chosen so the divide
   * runs through the middle of the drawing rather than through the middle of
   * the grid.
   *
   * Cubes landing exactly on it alternate. They have to: the seam cubes sit one
   * directly above another on screen, so there is no third direction for the
   * line to lean and a hard choice either way would bulge the pitch or the rink
   * out by a full cube. Anchored at the bottom, so the cube nearest the reader
   * is turf, which is the half the ball is standing on.
   */
  const seam = Math.round((width - height) / 2);
  const lowestSeamRow = Math.min(height - 1, width - 1 - seam);
  for (const cell of document.querySelectorAll('#heroBoard .dg-cell')) {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const side = col - row - seam;
    const ice = side > 0 || (side === 0 && (lowestSeamRow - row) % 2 === 1);
    if (!ice) continue;
    cell.dataset.surface = 'hockey';
    /*
     * Redraw this cube's dot, or take it away. The renderer has already put the
     * soccer player's dots down across the whole board, and on this side of the
     * seam they are the wrong ones. Safe to write over: the hero has no trail,
     * so a dot is the only glyph any cube can be carrying.
     */
    cell.querySelector('.dg-glyph').textContent = iceDots.has(`${row},${col}`) ? '•' : '';
  }
</script>
