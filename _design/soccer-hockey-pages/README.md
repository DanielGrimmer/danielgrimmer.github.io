# Soccer Hockey — page designs, ready to implement

You are looking at a design handoff that was unzipped into this repo. Everything
in this folder is reference material and instructions; one file outside it is
real source you can use as-is.

## Read these in order

1. `IMPLEMENTATION.md` — the plan: file map, ground rules, markup per page,
   and how to check your work. Start here.
2. `COPY.md` — every string, final. Do not retype copy out of the design file;
   take it from here.
3. `design/Soccer Hockey - pages.dc.html` — open it in a browser. It draws all
   five screens at desktop width. This is the target, and it is inline-styled,
   so any element's exact type, colour and spacing can be read off it.

## What shipped with it

- `assets/games/ui/pages.css` (outside this folder, already at its final path) —
  the page furniture, written to match the design. Load it after `board.css`.
  You should not need to invent CSS; if you do, add it to this file with a
  comment saying why.

## What is already live on main, and must not be re-done

- `assets/games/ui/board.css` — board surfaces, cube faces, sprite balls, goal
  furniture, floodlit dark mode
- `assets/games/ui/board.js` — per-theme ball size and lift, stripe shading,
  goal placement
- `assets/games/img/*.png` — the seven sprites

The board is finished. This job is the page around it.

## Scope in one line

Restyle and re-lay-out four pages — the landing page, the Basketball tutorial,
the game page (pairing / playing / reveal) and the sandbox — without changing a
single rule of the game, any module in `assets/games/core/`, or any behaviour.
