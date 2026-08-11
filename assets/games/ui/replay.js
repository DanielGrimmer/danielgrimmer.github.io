/**
 * The reveal: the finished game, drawn twice at once.
 *
 * Both panels below are the same move log. The left one is folded through one
 * seat's lens and the right one through the other's, frame by frame, in step.
 * Nothing is recomputed and nothing is faked — `replayFrames` is the same fold
 * that produced the game in the first place, and `viewOf` is the same function
 * each player's live board was drawn with.
 *
 * Showing both at once rather than offering a switch is deliberate. A switch
 * asks the viewer to remember what they just saw; two boards side by side ask
 * nothing. And what changes between them is not one detail — the ball stands in
 * a different column, the trail is a different shape, the star around the ball
 * is a different width. Only the row and the goal column survive the crossing,
 * and that is easier to notice when both are on screen together.
 *
 * The measuring and phrasing are pure functions, exported and tested. The DOM
 * factory underneath them does no arithmetic of its own.
 */

import { replayFrames, viewOf, sidewaysReach } from '../core/game.js?v=4.1.5';
import { createBoardView } from './board.js?v=4.1.5';

/** How long each move is held when the replay is playing itself. */
export const AUTOPLAY_MS = 1100;

/** Frame 0 is the kick-off, so a log of n moves has n + 1 frames. */
export function frameCount(moves) {
  return moves.length + 1;
}

export function clampFrame(index, total) {
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(total - 1, Math.trunc(index)));
}

/**
 * One move, measured as the given seat sees it.
 *
 * `across` is the whole point: the canonical sideways step passes through that
 * seat's lens, so the same move is three columns on one board and four on the
 * other. The row step does not pass through anything — rows are not permuted —
 * so `rows` and `towards` come out the same on both boards, which is what makes
 * the difference in `across` stand out rather than look like general noise.
 */
export function stepSummary(config, { seat, from, to }) {
  const lens = config.lenses[seat];
  if (!lens) throw new RangeError(`no seat ${seat}`);

  const across = Math.abs(lens.viewDelta(to.col - from.col));
  const rows = Math.abs(to.row - from.row);
  // Seat 0 scores on row 0 and seat 1 on the last row, so the direction of the
  // row step names a goal, and naming it by sport keeps both captions in the
  // same words.
  const towards = rows === 0 ? null : config.seats[to.row < from.row ? 0 : 1].sport;

  return {
    across,
    rows,
    towards,
    acrossText: across === 0 ? 'no sideways step' : `${across} across`,
    rowsText:
      rows === 0
        ? 'along the same row'
        : `and ${rows} row${rows === 1 ? '' : 's'} towards the ${towards} goal`,
  };
}

/** "1 or 3" — the sideways steps a seat believes its short passes to have. */
export function reachText(config, seat) {
  return sidewaysReach(config, seat, 1).join(' or ');
}

/** Who played the move that produced frame `index`, or null for the kick-off. */
export function moverAt(frames, index) {
  return index <= 0 ? null : frames[index - 1].turn;
}

/* ------------------------------------------------------------------- DOM ---- */

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/**
 * @param {HTMLElement} container must already be visible: the boards measure
 *   themselves as they are built, and a hidden parent measures as zero.
 * @param {{config: object, moves: object[], seatOrder: number[], labels: string[]}} spec
 */
export function createReplayView(container, { config, moves, seatOrder, labels }) {
  const frames = replayFrames(config, moves);
  const total = frameCount(moves);

  const boards = element('div', 'dg-replay-boards');
  const sides = seatOrder.map((seat, i) => {
    const side = element('div', 'dg-replay-side');
    const head = element('div', 'dg-replay-head');
    head.append(
      element('div', 'dg-replay-label', labels[i]),
      element('div', 'dg-replay-reach', `Short passes reach ${reachText(config, seat)} columns.`)
    );

    const mount = element('div', 'dg-replay-board');
    const caption = element('div', 'dg-replay-caption');
    const across = element('span', 'dg-replay-across');
    const rows = element('span', 'dg-replay-rows');
    caption.append(across, rows);

    side.append(head, mount, caption);
    boards.append(side);
    return { seat, mount, across, rows, view: null };
  });

  const controls = element('div', 'dg-replay-controls');
  const first = element('button', 'dg-btn dg-step', '⏮');
  const back = element('button', 'dg-btn dg-step', '◀');
  const play = element('button', 'dg-btn dg-btn-primary', 'Play');
  const forward = element('button', 'dg-btn dg-step', '▶');
  const last = element('button', 'dg-btn dg-step', '⏭');
  for (const [button, label] of [
    [first, 'Back to the kick-off'],
    [back, 'Previous move'],
    [forward, 'Next move'],
    [last, 'Jump to the end'],
  ]) {
    button.type = 'button';
    button.title = label;
    button.setAttribute('aria-label', label);
  }
  play.type = 'button';

  const scrub = document.createElement('input');
  scrub.type = 'range';
  scrub.className = 'dg-replay-scrub';
  scrub.min = '0';
  scrub.max = String(total - 1);
  scrub.step = '1';
  scrub.value = '0';
  scrub.setAttribute('aria-label', 'Move');

  const count = element('div', 'dg-replay-count');

  controls.append(first, back, play, forward, last, scrub, count);
  container.replaceChildren(boards, controls);

  for (const side of sides) {
    side.view = createBoardView(side.mount, {
      board: config.board,
      theme: config.seats[side.seat].theme,
      interactive: false,
    });
  }

  let index = 0;
  let timer = null;

  function paint() {
    const frame = frames[index];
    for (const side of sides) {
      side.view.render(viewOf(config, frame, side.seat));
      if (index === 0) {
        side.across.textContent = 'The kick-off.';
        side.rows.textContent = '';
      } else {
        const summary = stepSummary(config, {
          seat: side.seat,
          from: frames[index - 1],
          to: frames[index],
        });
        side.across.textContent = summary.acrossText;
        side.rows.textContent = summary.rowsText;
      }
    }

    const mover = moverAt(frames, index);
    count.textContent =
      index === 0
        ? `Before the first move — ${moves.length} moves to come`
        : `Move ${index} of ${moves.length} — played by ${config.seats[mover].name}, ` +
          `the ${config.seats[mover].sport ?? 'other'} player`;

    scrub.value = String(index);
    first.disabled = index === 0;
    back.disabled = index === 0;
    forward.disabled = index === total - 1;
    last.disabled = index === total - 1;
  }

  function show(next) {
    index = clampFrame(next, total);
    paint();
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    play.textContent = 'Play';
  }

  function start() {
    if (timer) return stop();
    // Pressing play at the end means "again", not "nothing happens".
    if (index === total - 1) show(0);
    play.textContent = 'Pause';
    timer = setInterval(() => {
      if (index >= total - 1) return stop();
      show(index + 1);
    }, AUTOPLAY_MS);
  }

  const stepBy = (delta) => {
    stop();
    show(index + delta);
  };

  first.addEventListener('click', () => stepBy(-total));
  back.addEventListener('click', () => stepBy(-1));
  forward.addEventListener('click', () => stepBy(1));
  last.addEventListener('click', () => stepBy(total));
  play.addEventListener('click', start);
  scrub.addEventListener('input', () => {
    stop();
    show(Number(scrub.value));
  });

  const onKey = (event) => {
    if (event.key === 'ArrowLeft') stepBy(-1);
    else if (event.key === 'ArrowRight') stepBy(1);
    else return;
    event.preventDefault();
  };
  window.addEventListener('keydown', onKey);

  paint();

  return {
    show,
    get index() {
      return index;
    },
    destroy() {
      stop();
      window.removeEventListener('keydown', onKey);
      for (const side of sides) side.view.destroy();
      container.replaceChildren();
    },
  };
}
