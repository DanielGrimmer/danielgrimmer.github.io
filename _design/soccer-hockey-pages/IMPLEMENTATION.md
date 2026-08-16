# Implementation plan

## Ground rules

1. **No behaviour changes.** `assets/games/core/*` is off limits. The page
   scripts keep the same logic; you are changing the markup they render into and
   the CSS that styles it.
2. **Keep every hook.** Every `id` a page script reads must survive with the
   same name — `status`, `board`, `coach`, `coachProgress`, `coachTitle`,
   `coachBody`, `coachHint`, `playReal`, `coachSkip`, `undo`, `reset`,
   `buildStamp`, and whatever the game and sandbox pages use. Read each page's
   `<script type="module">` first and list its `getElementById` calls before you
   touch that page's markup. Wrappers and classes may change freely; ids may not.
3. **Do not touch the board.** `board.css`, `board.js` and `assets/games/img/`
   are done. If a board looks wrong, the fault is in the page, not the renderer.
4. **Load order.** In each standalone page's `<head>`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" />
   <link rel="stylesheet" href="../games/ui/board.css?v=4.18.0" />
   <link rel="stylesheet" href="../games/ui/pages.css?v=4.18.0" />
   ```
   `pages.css` must come after `board.css`.
5. **Bump the cache busters together.** Every `?v=` token on a page, the
   `const BUILD` in its module, and the new `pages.css` link go to the same new
   version in the same commit. A page running mixed versions is the failure mode
   these tokens exist to make visible.
6. **Both colour schemes.** `pages.css` carries a floodlit palette that fires on
   `prefers-color-scheme: dark`, matching the board's own dark mode. Check every
   page in both. Nothing may hard-code a colour that only works in one.
7. **No build step, no dependencies, no framework.** Plain HTML, ES modules,
   hand-written CSS, exactly as now.
8. **Sizes are in the design.** Where this document says "as in the design",
   open `design/Soccer Hockey - pages.dc.html` and read the inline styles.

## File map

| Screen | Repo file | Work |
| --- | --- | --- |
| Landing (4a) | `_pages/soccerhockey.md` | new body markup, scoped wrapper |
| Tutorial (4b) | `assets/SoccerHockey/SoccerHockeyTutorialV4.0.html` | new markup, same script |
| Pairing (5a) | `assets/SoccerHockey/SoccerHockeyGameV4.0.html` | waiting state |
| Live game (5b) | same file | playing state |
| Reveal (5c) | same file (+ `assets/games/ui/replay.js`) | replay + ledger |
| Sandbox (6a) | `assets/SoccerHockey/SoccerHockeySandboxV4.0.html` | new markup, same dials |
| all | `assets/games/ui/pages.css` | shipped; extend only if needed |

Do them in that order. Commit per screen, so a regression is bisectable.

## The shape every standalone page takes

```html
<body class="dg">
  <div class="dg-wrap">
    <div class="dg-chrome">
      <a href="/soccer-hockey/">← Soccer Hockey</a>
      <span class="dg-label">Room GreenField · playing</span>
    </div>
    <div class="dg-page">
      <header class="dg-head">
        <div>
          <h1>Soccer</h1>
          <div class="dg-head-sub">…</div>
        </div>
        <div class="dg-label">…</div>
      </header>
      …
    </div>
    <p class="dg-build">Build <span id="buildStamp">—</span></p>
  </div>
</body>
```

The chrome strip replaces the old `.dg-masthead`: the way home on the left, where
you are on the right. The page's own `h1` lives below it, not in it.

## 4a — the landing page (`_pages/soccerhockey.md`)

Keep the front matter and `layout: page` exactly as it is. This page sits inside
the site's own layout, so it does **not** get a chrome strip — the theme's navbar
is the way home. Scope the tokens to a wrapper instead of the body:

```html
<link rel="stylesheet" href="{{ '/assets/games/ui/pages.css' | relative_url }}" />
<div class="dg dg-scope">
  <div class="dg-hero">
    <div>
      <h1 class="dg-title-xl">The Soccer-Hockey Duality Game</h1>
      <p class="dg-lede">Soccer and Hockey are very different games… or aren't they?</p>
    </div>
    <div class="dg-hero-board" id="heroBoard"></div>
  </div>
  …
</div>
```

Structure below the hero, as in the design: one paragraph, then
`.dg-firewall`, then `ol.dg-doors` with three `li.dg-door` (the third
`data-locked="true"`), and `aside.dg-aside` in a 1fr/300px grid beside them.
Keep the existing `display_title` in the front matter; if the theme prints it,
drop the `h1` here rather than showing the title twice.

**The hero board.** Half turf, half ice, seam down the vertical centre of the
page, ball at mid-field on the turf side. It is decorative and never played, so
render it with the existing renderer and no click handler:

- `createBoardView(el, { board: config.board, theme: 'soccer', interactive: false })`
- render a view whose ball is at `row = floor(H / 2)`, `col = floor(W / 2) - 1`
  with no trail
- the split is by screen position, not by grid: with
  `seam = Math.round((W - H) / 2)` (= −1 on the 11×13 board), a cube is ice when
  `col - row > seam`, turf when `col - row < seam`, and cubes exactly on the seam
  alternate — anchored so the **lowest** seam cube (largest `col + row`) is turf.
- implement it by setting `data-theme` per cube rather than per board: add a
  `cellTheme` hook to `board.js` **only if** you cannot do it from the page; a
  `data-surface="hockey"` attribute on the cell plus three rules in
  `pages.css` is the cheaper route. Do not fork the renderer.

If that proves fiddly, ship the landing page with a plain soccer board and raise
it — a wrong seam is worse than no seam.

## 4b — the tutorial

Order on the page, top to bottom:

1. chrome strip — `← Soccer Hockey` / `Practice court · duality off`
2. `header.dg-head` — `h1` "Basketball", sub line, `no opponent needed` label
3. `details.dg-rules` — **above** the board, folded shut
4. `div.dg-layout` — `aside.dg-coach` then the play column

In the coach panel, `.dg-coach-progress` now holds the existing step text plus
five ticks:

```html
<div class="dg-coach-progress">
  <span id="coachProgress">Step 3 of 5</span>
  <span class="dg-steps" id="coachSteps">
    <span class="dg-step-tick" data-state="done"></span>
    …
  </span>
</div>
```

Set `data-state` to `done` / `here` / `` from the same index `drawCoach`
already computes. Ticks are decoration: if the index is unavailable, omit them.

The play column:

```html
<div class="dg-play">
  <div class="dg-status" id="status">
    <span id="statusText">…</span>
    <span class="dg-status-move" id="statusMove">move 5</span>
  </div>
  <div class="dg-goal-hint" data-end="yours">your goal ↗</div>
  <div class="dg-court"><div id="board"></div></div>
  <div class="dg-goal-hint" data-end="theirs">↙ their goal</div>
  <div class="dg-legend-row">…</div>
  <div class="dg-bar">
    <button class="dg-btn" id="undo" type="button">Take that back</button>
    <button class="dg-btn" id="reset" type="button">Start again</button>
  </div>
</div>
```

`#status` is now a flex row with two children, so write the status sentence into
`#statusText` and the move count into `#statusMove`. That is a two-line change in
the page's `draw()`; keep `statusEl.dataset.tone` as it is.

## 5a / 5b / 5c — the game page

One file, three states. Read the file first and map its existing ids; the states
below are what each id set should look like once styled.

**5a, waiting.** Two columns, 1fr / 360px:

- left: `h1` "You are in room GreenField", one paragraph, `.dg-firewall`
  ("From here on"), then the board wrapped in `.dg-board-asleep` with the
  caption "your pitch, asleep until they arrive" under it
- right: `aside.dg-room` — two `.dg-presence` rows (you `data-state="waiting"`,
  your friend `data-state="absent"`), `Copy the invite link` as
  `.dg-btn.dg-btn-primary.dg-btn-wide`, then "or join by name" with
  `.dg-field`, then a closing note above a rule

**5b, playing.** The room panel collapses to one line at the foot
(`.dg-room-foot`) and the board goes full width: header with `h1` "Soccer" (or
"Hockey") and a presence line, then `.dg-status`, goal hints, `.dg-pitch`,
`.dg-legend-row`, `.dg-room-foot`. No coach panel on this page.

**5c, the reveal.** Keep `replay.js` driving the two boards. Above them: the
`The reveal` label, `h1` "It was both Soccer and Hockey, at once", and the
outcome sentence. Then `.dg-replay-boards` with two `.dg-replay-head` +
board pairs, `.dg-replay-controls` (◀ / Play the game back / ▶ / scrub /
`.dg-replay-count`), then `.dg-ledger` with two `.dg-ledger-col`
(`data-side="agree"` and `data-side="disagree"`), then `.dg-outro`: the
philosophy paragraph beside `.dg-outro-actions` — sandbox, play again, read more.

The long prose in `coach.js`'s `replayNote()` is now split: the short opening
stays as the paragraph above the boards, the comparison becomes the two ledger
lists, and the philosophy paragraph becomes `.dg-outro`'s text. Trim
`replayNote` rather than printing all of it twice.

## 6a — the sandbox

`header.dg-head` with `h1` "Under the hood" and a `talking allowed now` label,
then `.dg-sandbox-intro` (1fr / 320px): the paragraph plus `ul.dg-claims` on the
left, `.dg-dials` on the right — three `label` + `input` rows with
`data-dial="duality"` on the third, the `.dg-dial-note` line, and two buttons.
Below: the two boards side by side in `.dg-replay-boards`, each with a
`.dg-replay-head`, its board, `.dg-palette-title`, and its palette grid.
Palettes keep their existing markup and `data-on` / `data-centre` attributes;
add `data-theme` to the `.dg-palette` element so the centre cell shows the right
sprite. Close with a `.dg-legend-row`.

## Verification

For each page, in both light and dark:

1. No console errors, and the build stamp shows the version you just bumped to.
2. Every interaction still works: moves, undo, reset, skip, the coach advancing,
   pairing, the replay scrubber, every dial.
3. No horizontal scrollbar at 1280px, 1024px and 390px wide.
4. The board is untouched — same surfaces, sprites, goal furniture and hover
   lift as on main today.
5. Type is Spectral for headings and status, IBM Plex Sans for body, IBM Plex
   Mono for the small upper-case labels. Nothing renders in Roboto.
6. Compare against the matching screen in the design file, side by side.

## When you are unsure

Prefer the design file over this document, and this document over your own
taste. If the two disagree, or if something in the game's behaviour would have
to change to match the design, stop and say so rather than inventing a third
answer.
