/**
 * Flat board renderer for Escher Chess.
 *
 * The Soccer Hockey board is isometric because a ball rolling over a court
 * wants depth. Chess wants none: the whole point is reading a grid at a glance,
 * and a 5×10 board seen in perspective is a corridor. So this is a plain grid,
 * with the same discipline as the other renderer — it is handed a per-seat view
 * from `viewOf`, and it draws. It knows nothing about rules, networks, or the
 * duality.
 *
 * ## Two things worth knowing about the drawing
 *
 * **Squares are coloured by where they are drawn, not by which square they
 * are.** Each player therefore sees a proper chequerboard, and their own bishop
 * keeps to one colour, which is a genuine aid to learning your own pieces. The
 * price is that one square is light on your board and dark on your opponent's,
 * because the file orders differ — visible side by side in the reveal, where it
 * is the point rather than a bug.
 *
 * **Nothing here reveals the enemy's move set.** The view carries this seat's
 * own legal moves and no others, so there is nothing to leak; the renderer only
 * has to avoid inventing something. In particular a king in check is outlined
 * and the attacking piece is not, because working out what is attacking you is
 * the game.
 *
 * ## Sizing
 *
 * Squares are sized in whole pixels rather than the board being scaled as a
 * whole, so glyphs stay crisp. Width always wins: a board may be shorter than
 * `MIN_SQUARE` would like rather than overflow its column, since two of these
 * stand side by side in the reveal.
 */

const MIN_SQUARE = 26;
const MAX_SQUARE = 58;
/** Of the viewport, so a ten-rank board still leaves the coach box visible. */
const HEIGHT_SHARE = 0.72;

/**
 * Solid glyphs for both sides, coloured by CSS.
 *
 * The outline set (♔♕♖…) is drawn by most fonts as a much thinner shape than
 * the solid set, so a board using both looks like two different piece sets. One
 * shape, two fills, and an outline for contrast reads better — and survives
 * dark mode, where a black-filled glyph on a dark square disappears.
 *
 * Every glyph carries U+FE0E, VARIATION SELECTOR-15, which asks for text
 * presentation. Only the pawn actually needs it: U+265F is the one piece in the
 * set with an emoji form, so several platforms hand it to the colour emoji
 * font, which paints its own black pawn and ignores `color` entirely. White's
 * pawns came out black while White's every other piece was white. The selector
 * costs nothing on the five that were never at risk, and stops the next font
 * update from doing the same to one of them.
 */
const TEXT_PRESENTATION = '\uFE0E';

const GLYPH = Object.freeze({
  pawn: `♟${TEXT_PRESENTATION}`,
  knight: `♞${TEXT_PRESENTATION}`,
  bishop: `♝${TEXT_PRESENTATION}`,
  rook: `♜${TEXT_PRESENTATION}`,
  queen: `♛${TEXT_PRESENTATION}`,
  king: `♚${TEXT_PRESENTATION}`,
});

const SIDE_NAME = ['White', 'Black'];

const keyOf = (sq) => `${sq.rank},${sq.file}`;

/**
 * Same square? **Returns a real boolean**, and that is not a detail.
 *
 * Written as `a && b && a.rank === b.rank …` this yields `undefined` when
 * either side is missing — and `classList.toggle(name, undefined)` is treated
 * as *no second argument*, which means it flips the class instead of clearing
 * it. With nothing selected and no move played yet, every square therefore
 * turned its own highlight on at the first paint and flipped it again at every
 * repaint. The board came up entirely lit and flickered on each click, and it
 * only settled once a real last move existed to compare against.
 */
const sameSquare = (a, b) =>
  Boolean(a && b && a.rank === b.rank && a.file === b.file);

/**
 * @param {HTMLElement} container
 * @param {object} opts
 * @param {number} opts.width   files
 * @param {number} opts.height  ranks
 * @param {boolean} [opts.interactive]  false for a replay board
 * @param {boolean} [opts.showFiles]    the tutorial hides them; see below
 * @param {string} [opts.label]         announced to screen readers
 */
export function createChessboard(
  container,
  { width, height, interactive = true, showFiles = true, label = '' }
) {
  const frame = document.createElement('div');
  frame.className = 'dg-chess';
  frame.dataset.interactive = String(interactive);
  frame.style.setProperty('--dg-files', String(width));
  frame.style.setProperty('--dg-ranks', String(height));

  const grid = document.createElement('div');
  grid.className = 'dg-chess-grid';
  if (label) grid.setAttribute('aria-label', label);
  // Not `role="grid"`: that promises rows and gridcells, and this is a set of
  // buttons. A group keeps the label without lying about the structure.
  grid.setAttribute('role', 'group');

  /** view `rank,file` -> its square element. Built once; render mutates. */
  const squares = new Map();
  const rankLabels = [];
  const fileLabels = [];

  /*
   * Rank 0 of a view is that seat's own back rank, and a player looks at their
   * own men from the near edge, so the rows are laid out from the far end down.
   */
  for (let row = height - 1; row >= 0; row--) {
    const tag = document.createElement('div');
    tag.className = 'dg-chess-rank';
    grid.append(tag);
    rankLabels[row] = tag;

    for (let file = 0; file < width; file++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'dg-square';
      // Drawn position, not canonical: see the note at the top of the file.
      cell.dataset.shade = (row + file) % 2 === 0 ? 'dark' : 'light';
      cell.dataset.rank = String(row);
      cell.dataset.file = String(file);
      cell.disabled = true;

      const glyph = document.createElement('span');
      glyph.className = 'dg-man';
      cell.append(glyph);

      grid.append(cell);
      squares.set(`${row},${file}`, { cell, glyph });
    }
  }

  // The bottom-left corner is empty; then one label under each file.
  const corner = document.createElement('div');
  corner.className = 'dg-chess-corner';
  grid.append(corner);
  for (let file = 0; file < width; file++) {
    const tag = document.createElement('div');
    tag.className = 'dg-chess-file';
    grid.append(tag);
    fileLabels[file] = tag;
  }

  /* The promotion chooser, built once and shown when a pawn arrives. */
  const promo = document.createElement('div');
  promo.className = 'dg-promo';
  promo.hidden = true;

  frame.append(grid, promo);
  container.replaceChildren(frame);

  let onMove = null;
  /** Which of my men is picked up. Purely a drawing concern, so it lives here. */
  let selected = null;
  let pending = null;
  let view = null;

  const myMovesFrom = (from) => (view?.myMoves ?? []).filter((m) => sameSquare(m.from, from));

  const squareFor = (key) => {
    const [rank, file] = key.split(',').map(Number);
    return { rank, file };
  };

  /** "D3", in this seat's own names. Both seats use the same ones. */
  const labelOf = (key) => {
    const { rank, file } = squareFor(key);
    const name = showFiles ? view.files[file] : `file ${file + 1}`;
    return `${name}${showFiles ? '' : ', rank '}${view.rankLabels[rank]}`;
  };

  function clearSelection() {
    selected = null;
    pending = null;
    promo.hidden = true;
    if (view) paint();
  }

  function choosePromotion(from, to, options) {
    pending = { from, to };
    promo.replaceChildren(
      ...options.map((type) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dg-promo-choice';
        // Coloured as the pawn that is arriving, not as the seat: at a shared
        // screen those differ on every other move.
        btn.dataset.side = String(view.men.find((m) => sameSquare(m, from))?.side ?? view.seat);
        btn.textContent = GLYPH[type];
        btn.title = type;
        btn.setAttribute('aria-label', `promote to ${type}`);
        btn.addEventListener('click', () => {
          const move = { from, to, promote: type };
          clearSelection();
          onMove?.(move);
        });
        return btn;
      })
    );
    promo.hidden = false;
    paint();
  }

  function pick(square) {
    if (!view) return;

    if (selected) {
      const options = myMovesFrom(selected).filter((m) => sameSquare(m.to, square));
      if (options.length > 1) {
        // A pawn reaching the far end; the same destination with several pieces
        // to become.
        choosePromotion(selected, square, options.map((m) => m.promote));
        return;
      }
      if (options.length === 1) {
        const move = { from: selected, to: square, promote: options[0].promote ?? null };
        clearSelection();
        onMove?.(move);
        return;
      }
    }

    const here = view.men.find((m) => sameSquare(m, square));
    // Clicking your own man picks it up, or puts it down again.
    if (here?.mine && myMovesFrom(square).length > 0 && !sameSquare(selected, square)) {
      selected = square;
      pending = null;
      promo.hidden = true;
      paint();
      return;
    }
    clearSelection();
  }

  if (interactive) {
    grid.addEventListener('click', (event) => {
      const cell = event.target.closest('.dg-square');
      if (!cell) return;
      pick({ rank: Number(cell.dataset.rank), file: Number(cell.dataset.file) });
    });
  }

  /** Redraw from the current view and the current selection. */
  function paint() {
    const men = new Map(view.men.map((m) => [keyOf(m), m]));
    const froms = new Set(view.myMoves.map((m) => keyOf(m.from)));
    const targets = selected ? new Set(myMovesFrom(selected).map((m) => keyOf(m.to))) : new Set();
    const king = view.check
      ? view.men.find((m) => m.mine && m.type === 'king')
      : null;

    for (const [key, { cell, glyph }] of squares) {
      const man = men.get(key) ?? null;
      const here = squareFor(key);
      const canStart = interactive && view.isMyTurn && man?.mine && froms.has(key);
      const canLand = interactive && targets.has(key);

      cell.classList.toggle('is-selected', sameSquare(selected, here));
      cell.classList.toggle('is-target', canLand);
      cell.classList.toggle('is-take', canLand && !!man);
      cell.classList.toggle('is-from', sameSquare(view.lastMove?.from, here));
      cell.classList.toggle('is-to', sameSquare(view.lastMove?.to, here));
      cell.classList.toggle('is-check', !!king && sameSquare(king, here));
      // A disabled square is not a tab stop, which is what makes arrowing round
      // a 5x10 board bearable: only the squares you can act on take focus.
      cell.disabled = !(canStart || canLand) || pending !== null;

      glyph.textContent = man ? GLYPH[man.type] : '';
      if (man) {
        glyph.dataset.side = String(man.side);
        cell.setAttribute(
          'aria-label',
          `${labelOf(key)}: ${SIDE_NAME[man.side] ?? 'a'} ${man.type}`
        );
      } else {
        delete glyph.dataset.side;
        cell.setAttribute('aria-label', labelOf(key));
      }
    }
  }

  /**
   * How much room there actually is, which is not simply `container.clientWidth`.
   *
   * The board is `max-content` wide, and a grid or flex column defaults to
   * `min-width: auto` — so a column holding an over-wide board stretches to fit
   * it, and then reports that stretched width as the space available. Measuring
   * that would settle at "as large as `MAX_SQUARE` allows" and quietly overflow
   * the page. Collapsing the board first breaks the loop: with nothing to
   * stretch around, the column reports its real share.
   */
  function available() {
    const held = frame.style.width;
    frame.style.width = '0px';
    const room = container.clientWidth;
    frame.style.width = held;
    return room;
  }

  /**
   * Size the squares to the space available.
   *
   * Whole pixels, and width beats every other consideration: overflowing the
   * column would push the second board off the screen in the reveal, whereas a
   * board smaller than `MIN_SQUARE` is merely small.
   */
  function fit() {
    const room = available();
    if (!room) return;
    const gutter = Math.max(18, Math.round(room * 0.05));
    const byWidth = Math.floor((room - gutter) / width);
    const byHeight = Math.floor((window.innerHeight * HEIGHT_SHARE) / height);
    const size = Math.min(byWidth, Math.max(MIN_SQUARE, Math.min(byHeight, MAX_SQUARE)));
    frame.style.setProperty('--dg-square', `${Math.max(8, size)}px`);
    frame.style.setProperty('--dg-gutter', `${gutter}px`);
  }

  /**
   * @param {object} next   a view from `viewOf`
   * @param {object} [opts]
   * @param {(move: {from: object, to: object, promote: string|null}) => void} [opts.onMove]
   */
  function render(next, { onMove: handler = null } = {}) {
    const changed = view?.turn !== next.turn || view?.seat !== next.seat;
    view = next;
    onMove = handler;
    /*
     * A new position invalidates whatever was picked up under the old one. The
     * turn changing is the usual way that happens; a board reset, which can
     * leave the turn alone, is caught by the piece no longer having anywhere to
     * go.
     */
    if (changed || (selected && myMovesFrom(selected).length === 0)) {
      selected = null;
      pending = null;
      promo.hidden = true;
    }

    /*
     * The tutorial draws no file names at all.
     *
     * Not decoration: the game's secret is that the two players' files are in
     * different orders, and a tutorial that taught one player "the files read
     * ARMED" would have them walk into the real game already primed to notice
     * that their opponent's do not. Working that out is the mystery. The rank
     * numbers stay, since both players agree about those.
     */
    next.files.forEach((name, file) => {
      fileLabels[file].textContent = showFiles ? name : '';
    });
    next.rankLabels.forEach((name, rank) => {
      rankLabels[rank].textContent = String(name);
    });

    paint();
    fit();
  }

  const onResize = () => fit();
  window.addEventListener('resize', onResize);

  return {
    render,
    fit,
    /** For a page that wants to cancel a half-made move, e.g. on disconnect. */
    clearSelection,
    destroy() {
      window.removeEventListener('resize', onResize);
      container.replaceChildren();
    },
  };
}
