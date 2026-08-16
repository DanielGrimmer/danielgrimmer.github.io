/**
 * The reveal: the finished game, drawn twice at once.
 *
 * Both panels below are the same move log. The left one is folded through one
 * seat's lens and the right one through the other's, frame by frame, in step.
 * Nothing is recomputed and nothing is faked — the frames are the same fold
 * that produced the game in the first place, and each board is drawn by the
 * same renderer the live game used.
 *
 * ## What this module does and does not know
 *
 * It owns the transport: the two panels, the buttons, the scrubber, the arrow
 * keys, and keeping both boards on the same frame. It knows nothing about what
 * a frame contains. Both duality games want exactly this screen and have
 * nothing else in common, so the caller hands over already-folded frames, a
 * factory that mounts one seat's board, and a function that says what move you
 * are looking at. Ball, trail and cube in one game; rook, check and chequerboard
 * in the other; identical machinery either way.
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
 * @param {object} spec
 * @param {object[]} spec.moves         the log, for counting only
 * @param {object[]} spec.frames        one per move plus the opening position
 * @param {number[]} spec.seatOrder     which seat each panel shows, left first
 * @param {(string|{name: string, note: string})[]} spec.labels  a heading per
 *   panel, in the same order. A pair is drawn as two: the board's name at one
 *   end of the rule and what it is showing at the other.
 * @param {(mount: HTMLElement, seat: number) => {render: Function, destroy: Function}}
 *   spec.createSeatView  mounts one seat's board; `render` is handed a frame
 * @param {(index: number) => string} spec.describe  the counter in the controls
 * @param {((index: number) => string)|undefined} spec.caption  an optional line
 *   under the controls, for anything that will not fit on one short row
 */
export function createReplayView(
  container,
  { moves, frames, seatOrder, labels, createSeatView, describe, caption = null }
) {
  const total = frameCount(moves);

  const boards = element('div', 'dg-replay-boards');
  const sides = seatOrder.map((seat, i) => {
    const side = element('div', 'dg-replay-side');
    const head = element('div', 'dg-replay-head');
    if (typeof labels[i] === 'string') {
      head.append(element('span', 'dg-replay-label', labels[i]));
    } else {
      head.append(
        element('span', 'dg-replay-label', labels[i].name),
        element('span', 'dg-label', labels[i].note)
      );
    }

    const mount = element('div', 'dg-replay-board');

    side.append(head, mount);
    boards.append(side);
    return { seat, mount, view: null };
  });

  const controls = element('div', 'dg-replay-controls');
  const first = element('button', 'dg-btn dg-step', '⏮');
  const back = element('button', 'dg-btn dg-step', '◀');
  const play = element('button', 'dg-btn dg-btn-primary', 'Play the game back');
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

  // Whatever will not fit on the controls row: whose move you are looking at.
  const note = caption ? element('div', 'dg-replay-note') : null;
  container.replaceChildren(boards, controls, ...(note ? [note] : []));

  for (const side of sides) side.view = createSeatView(side.mount, side.seat);

  let index = 0;
  let timer = null;

  function paint() {
    const frame = frames[index];
    for (const side of sides) side.view.render(frame);

    count.textContent = describe(index);
    if (note) note.textContent = caption(index);
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
    play.textContent = 'Play the game back';
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
