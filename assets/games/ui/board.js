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

  const surface = document.createElement('div');
  surface.className = 'dg-board';
  surface.dataset.theme = theme;

  const layout = layoutSize(board.width, board.height);
  surface.style.width = `${layout.width}px`;
  surface.style.height = `${layout.height}px`;

  frame.append(surface);
  container.replaceChildren(frame);

  /** row,col -> the cube element, so redraws mutate rather than rebuild. */
  const cells = new Map();

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
      cell.style.zIndex = String(row + col);
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);

      const top_ = document.createElement('div');
      top_.className = 'dg-face dg-top';
      const glyph = document.createElement('span');
      glyph.className = 'dg-glyph';
      // The ball is drawn rather than typed: a glyph sits on its font's
      // baseline, which left it low in the square and at the mercy of whatever
      // font happened to load.
      const ballEl = document.createElement('span');
      ballEl.className = 'dg-ball';
      top_.append(glyph, ballEl);

      const left_ = document.createElement('div');
      left_.className = 'dg-face dg-left';
      const right_ = document.createElement('div');
      right_.className = 'dg-face dg-right';

      cell.append(top_, left_, right_);
      surface.append(cell);
      cells.set(`${row},${col}`, { cell, glyph });
    }
  }

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
    const ball = keyOf(view.ball);

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
      cell.classList.toggle('is-playable', !isWall && legal.has(key));

      // A spent square is a cross and an approach is a dot, so the three read as
      // different kinds of thing rather than as three sizes of the same circle.
      // The ball itself is the drawn element, not a glyph.
      let text = '';
      if (!isWall && key !== ball) {
        if (visited.has(key)) text = '✕';
        else if (approaches.has(key)) text = '•';
      }
      glyph.textContent = text;
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
