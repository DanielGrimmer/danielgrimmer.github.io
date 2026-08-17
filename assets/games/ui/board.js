/**
 * Isometric board renderer.
 *
 * Draws a per-seat view (from `viewOf`) as the V3.1 board: one cube per square,
 * three CSS-transformed faces each, lifting under the cursor. Those transforms
 * are tuned for a 40px tile, so the tile size is never changed — the whole
 * board is scaled to fit its container instead, which is what lets it work on
 * a phone. V3.1 declared `clamp(25px, 3vw, 25px)`, whose minimum equals its
 * maximum, so its board was permanently fixed-size.
 *
 * The renderer knows nothing about rules, networks or whose turn it is. It is
 * handed a view and a click handler, and it draws.
 */

const TILE = 40;
const HALF_DIAGONAL = TILE / 1.41; // how far one step moves a cube on screen
const SQUASH_X = 0.8;
const SQUASH_Y = 0.4;
/*
 * Each sprite's size on screen, and how far it stands off its tile. A puck
 * lies flat on the ice, so it is barely lifted at all; a ball sits up on the
 * turf. Board units — the 0.4 vertical squash flattens the lift on screen.
 */
const BALLS = {
  soccer: { width: 18, height: 18, lift: 12 },
  hockey: { width: 22, height: 15, lift: 4 },
  basketball: { width: 18, height: 18, lift: 12 },
};
/** The goal sprite is one tile side wide, drawn in an 88px box (see board.css). */
const GOAL_BOX = 88;

/** Where a square sits, before the board-wide squash. */
function isoPosition(row, col, height) {
  return {
    left: (col - row + (height - 1)) * HALF_DIAGONAL,
    top: (col + row) * HALF_DIAGONAL,
  };
}

function layoutSize(width, height) {
  const span = (width - 1 + (height - 1)) * HALF_DIAGONAL;
  return { width: span + TILE, height: span + TILE };
}

function keyOf(sq) {
  return `${sq.row},${sq.col}`;
}

export function createBoardView(container, { board, theme, interactive = true }) {
  const frame = document.createElement('div');
  frame.className = 'dg-board-frame';
  // A replay board still lifts its cubes under the cursor — that is most of the
  // charm — but it must not offer a pointer, which promises a click it will
  // not accept.
  frame.dataset.interactive = String(interactive);

  const surface = document.createElement('div');
  surface.className = 'dg-board';
  surface.dataset.theme = theme;

  const ball = BALLS[theme] ?? BALLS.soccer;
  const layout = layoutSize(board.width, board.height);
  surface.style.width = `${layout.width}px`;
  surface.style.height = `${layout.height}px`;

  frame.append(surface);
  container.replaceChildren(frame);

  /** row,col -> the cube element, so redraws mutate rather than rebuild. */
  const cells = new Map();

  /*
   * The ball is drawn once, above the whole board, rather than inside a cube.
   *
   * A cell that sets z-index opens a stacking context, so a ball parked inside
   * one cannot rise above the cube in front however high its own z-index goes.
   * Raising the whole cell instead brings its coloured side faces up with it,
   * which paints a slab of court wall across its neighbour. Its own layer
   * avoids both: the ball stands on the surface, as a ball does.
   */
  const ballEl = document.createElement('div');
  ballEl.className = 'dg-ball';
  ballEl.style.width = `${ball.width}px`;
  ballEl.style.height = `${ball.height}px`;
  ballEl.hidden = true;

  /*
   * A cage or a hoop standing in each goal mouth. Which column that is depends
   * on the seat's view, so they are parked off-board until the first render.
   */
  const goalFar = document.createElement('div');
  goalFar.className = 'dg-goal dg-goal-far';
  goalFar.hidden = true;
  const goalNear = document.createElement('div');
  goalNear.className = 'dg-goal dg-goal-near';
  goalNear.hidden = true;

  for (let row = 0; row < board.height; row++) {
    for (let col = 0; col < board.width; col++) {
      const cell = document.createElement('div');
      cell.className = 'dg-cell';
      const { left, top } = isoPosition(row, col, board.height);
      cell.style.left = `${left}px`;
      cell.style.top = `${top}px`;
      // Painter's order. Depth on an isometric board runs along row + col, not
      // along the DOM order, so without this a far cube can paint over a near
      // one and swallow the ball sitting on it.
      cell.dataset.depth = String(row + col);
      cell.style.zIndex = String(row + col);
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      // Mown stripes. The checker runs along row + col so it stays a stripe
      // under the isometric projection rather than a chequerboard.
      cell.dataset.shade = (row + col) % 2 === 0 ? 'a' : 'b';

      const top_ = document.createElement('div');
      top_.className = 'dg-face dg-top';
      const glyph = document.createElement('span');
      glyph.className = 'dg-glyph';
      top_.append(glyph);

      const left_ = document.createElement('div');
      left_.className = 'dg-face dg-left';
      const right_ = document.createElement('div');
      right_.className = 'dg-face dg-right';

      cell.append(top_, left_, right_);
      surface.append(cell);
      cells.set(`${row},${col}`, { cell, glyph });
    }
  }

  surface.append(goalFar, goalNear, ballEl);

  let onSquare = null;
  if (interactive) {
    surface.addEventListener('click', (event) => {
      const cell = event.target.closest('.dg-cell');
      if (!cell || !cell.classList.contains('is-legal') || !onSquare) return;
      onSquare({ row: Number(cell.dataset.row), col: Number(cell.dataset.col) });
    });
  }

  /**
   * Scale the board to the width available, then reserve the space it actually
   * paints into.
   *
   * The height cannot be computed from the layout box: each cube's side faces
   * are translated well below its own square, so the board paints lower than it
   * measures. Reserving only the layout height let the board sit on top of the
   * buttons underneath it. Measuring the cells settles it.
   */
  function fit() {
    const available = container.clientWidth || frame.clientWidth || layout.width;
    const rendered = layout.width * SQUASH_X;
    const scale = Math.min(1, available / rendered);
    surface.style.setProperty('--dg-fit', String(scale));
    frame.style.width = `${rendered * scale}px`;

    const top = frame.getBoundingClientRect().top;
    let bottom = top;
    for (const { cell } of cells.values()) {
      const rect = cell.getBoundingClientRect();
      if (rect.bottom > bottom) bottom = rect.bottom;
    }
    frame.style.height = `${Math.ceil(bottom - top)}px`;
  }

  function render(view, { showApproaches = true, onSquare: handler = null } = {}) {
    onSquare = handler;

    const legal = new Set(view.legalMoves.map(keyOf));
    const blocked = new Set((view.blockedMoves ?? []).map(keyOf));
    const visited = new Set(view.visited.map(keyOf));
    const approaches = showApproaches ? new Set(view.goalApproaches.map(keyOf)) : new Set();
    const ballKey = keyOf(view.ball);
    /*
     * The square the ball left last, which with the ball itself is the whole of
     * the last move. Its cross is drawn solid while the older ones stay
     * translucent — enough to find at a glance, and no arrow to clutter a board
     * whose whole business is the shape the crosses make. `visited` is pushed
     * to in move order, so the newest is simply the last of them.
     */
    const latestKey = view.visited.length ? keyOf(view.visited[view.visited.length - 1]) : null;

    for (const [key, { cell, glyph }] of cells) {
      const [row, col] = key.split(',').map(Number);
      const isGoalRow = row === 0 || row === board.height - 1;
      const isWall = isGoalRow && col !== view.goalCol;

      cell.classList.toggle('is-wall', isWall);
      cell.classList.toggle('is-legal', legal.has(key));
      // Still part of the star, but closed. Shown lit but muted, so the shape
      // survives the trail eating into it.
      cell.classList.toggle('is-blocked', blocked.has(key));
      cell.classList.toggle('is-ball', key === ball);
      cell.classList.toggle('is-visited', key !== ball && visited.has(key));
      cell.classList.toggle('is-latest', key !== ball && key === latestKey);
      cell.classList.toggle('is-playable', !isWall && legal.has(key));

      // A spent square is a cross and an approach is a dot, so the three read as
      // different kinds of thing rather than as three sizes of the same circle.
      // The ball itself is the drawn element, not a glyph.
      let text = '';
      if (!isWall && key !== ballKey) {
        if (visited.has(key)) text = '✕';
        else if (approaches.has(key)) text = '•';
      }
      glyph.textContent = text;
    }

    // Park the ball on its tile: centre of the cube's top, lifted a little so
    // it reads as standing on the court rather than painted onto it. The lift
    // is in board units, which the 0.4 vertical squash then flattens.
    const here = isoPosition(view.ball.row, view.ball.col, board.height);
    ballEl.hidden = false;
    ballEl.style.left = `${here.left + TILE / 2 - ball.width / 2}px`;
    ballEl.style.top = `${here.top + TILE / 2 - ball.height / 2 - ball.lift}px`;

    // The furniture stands on the goal mouth of each end row, at the depth of
    // the tile it stands on, so cubes in front of it still paint over it.
    for (const [el, row] of [
      [goalFar, 0],
      [goalNear, board.height - 1],
    ]) {
      const at = isoPosition(row, view.goalCol, board.height);
      el.hidden = false;
      el.style.left = `${at.left + TILE / 2 - GOAL_BOX / 2}px`;
      el.style.top = `${at.top + TILE / 2 - GOAL_BOX / 2}px`;
      el.style.zIndex = String(row + view.goalCol);
    }

    fit();
  }

  const onResize = () => fit();
  window.addEventListener('resize', onResize);

  return {
    render,
    fit,
    destroy() {
      window.removeEventListener('resize', onResize);
      container.replaceChildren();
    },
  };
}
