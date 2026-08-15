/**
 * The move palette: which relative moves are legal, as one seat sees them.
 *
 * A flat grid, deliberately — this is a diagram of displacements, not a board,
 * and drawing it in the same isometric projection would invite the reader to
 * count squares on it as though the ball were standing there. The centre cell
 * is the ball; every other cell is a move you can switch on or off.
 *
 * Two of these sit under the two boards, one per lens. They show the *same*
 * move set: tick a cell on the soccer palette and a cell lights up somewhere
 * else entirely on the hockey one. That is the duality in its smallest possible
 * form — no game, no trail, just the relabelling.
 */

import {
  paletteGeometry,
  offsetAtCell,
  cellForOffset,
  offsetThroughLens,
  offsetFromLens,
} from '../core/sandbox.js?v=4.3.0';

export function createPaletteView(container, { theme }) {
  const root = document.createElement('div');
  root.className = 'dg-palette';
  root.dataset.theme = theme;

  const grid = document.createElement('div');
  grid.className = 'dg-palette-grid';

  const note = document.createElement('div');
  note.className = 'dg-palette-note';

  root.append(grid, note);
  container.replaceChildren(root);

  let onToggle = null;
  grid.addEventListener('click', (event) => {
    const cell = event.target.closest('.dg-palette-cell');
    if (!cell || cell.dataset.centre === 'true' || !onToggle) return;
    onToggle({ row: Number(cell.dataset.row), col: Number(cell.dataset.col) });
  });

  /**
   * @param {object} config the current sandbox configuration
   * @param {number} seat whose palette this is
   * @param {{onToggle: (offset: [number, number]) => void, editable: boolean}} handlers
   */
  function render(config, seat, { onToggle: handler = null, editable = true } = {}) {
    const geometry = paletteGeometry(config.board);

    // Where each canonical offset lands on *this* seat's palette. An offset
    // with nowhere to land is counted rather than dropped silently.
    const lit = new Set();
    let hidden = 0;
    for (const offset of config.moveSet) {
      const cell = cellForOffset(geometry, offsetThroughLens(config, seat, offset));
      if (cell) lit.add(`${cell.row},${cell.col}`);
      else hidden++;
    }

    grid.style.setProperty('--dg-palette-cols', String(geometry.cols));
    grid.replaceChildren();
    for (let row = 0; row < geometry.rows; row++) {
      for (let col = 0; col < geometry.cols; col++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'dg-palette-cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        const isCentre = row === geometry.centreRow && col === geometry.centreCol;
        cell.dataset.centre = String(isCentre);
        cell.dataset.on = String(lit.has(`${row},${col}`));
        cell.disabled = isCentre || !editable;
        const [dr, dc] = offsetAtCell(geometry, { row, col });
        cell.title = isCentre ? 'The ball' : `${dc} across, ${dr} down`;
        cell.setAttribute(
          'aria-label',
          isCentre ? 'The ball' : `Move ${dc} across and ${dr} down`
        );
        grid.append(cell);
      }
    }

    note.textContent = hidden
      ? `${hidden} move${hidden === 1 ? '' : 's'} cannot be drawn on a board this wide.`
      : '';

    onToggle = handler
      ? (cell) => handler(offsetFromLens(config, seat, offsetAtCell(geometry, cell)))
      : null;
  }

  return {
    render,
    destroy() {
      container.replaceChildren();
    },
  };
}
