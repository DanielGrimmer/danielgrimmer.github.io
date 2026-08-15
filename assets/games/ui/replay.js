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
 * The boards are left to speak for themselves. An earlier version captioned
 * every move with its own arithmetic ("1 across" beside "4 across"); it was
 * accurate and it flattened the thing into a spot-the-difference puzzle. The
 * note above the boards says what to look for once, and then stops talking.
 */

import { replayFrames, viewOf } from '../core/game.js?v=4.2.3';
import { createBoardView } from './board.js?v=4.2.3';

/** How long each move is held when the replay is playing itself. */
const AUTOPLAY_MS = 1100;

/** Frame 0 is the kick-off, so a log of n moves has n + 1 frames. */
export function frameCount(moves) {
  return moves.length + 1;
}

export function clampFrame(index, total) {
  if (!Number.isFinite(index)) return 0;
  return Math.max(0, Math.min(total - 1, Math.trunc(index)));
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
    const head = element('div', 'dg-replay-head', labels[i]);
    head.classList.add('dg-replay-label');

    const mount = element('div', 'dg-replay-board');

    side.append(head, mount);
    boards.append(side);
    return { seat, mount, view: null };
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
    for (const side of sides) side.view.render(viewOf(config, frame, side.seat));

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
