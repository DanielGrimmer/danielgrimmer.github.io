/**
 * The tutorial coach.
 *
 * V3.1 taught the game with a wall of text above the board, which meant reading
 * everything before understanding any of it, and re-reading it afterwards to
 * find the bit that mattered. This replaces that with a panel that watches what
 * you actually do and moves on when you have done it — the rule about the board
 * wrapping arrives when you walk off the edge, not four paragraphs earlier.
 *
 * Deliberately not modal. A pop-up that must be dismissed interrupts the thing
 * it is trying to teach, and this game is learned by pushing the ball around.
 * The panel sits beside the board, play is never blocked, and any step can be
 * skipped.
 *
 * The step logic is pure: `contextFor` reduces a move log to a handful of facts,
 * and each step decides from those facts alone whether it is finished. So the
 * whole tutorial can be driven from a list of moves in a test, with no DOM.
 */

import { goalApproaches, squareKey } from '../core/rules.js';
import { replayFrames } from '../core/game.js';

/**
 * Did this move cross the seam? On a cylinder the short way round is the only
 * way round, so a column jump of more than half the board means it wrapped.
 */
export function isWrapMove(from, to, width) {
  return Math.abs(to.col - from.col) > width / 2;
}

/**
 * Reduce a game to the facts the steps care about. Each is cumulative — once
 * true it stays true — so the tutorial only ever moves forwards.
 */
export function contextFor(config, moves) {
  const frames = replayFrames(config, moves);
  const approaches = new Set(
    goalApproaches(config.board, config.moveSet, []).map((s) => squareKey(s.row, s.col))
  );

  let hasWrapped = false;
  let hasReachedApproach = false;

  for (let i = 0; i < moves.length; i++) {
    const from = frames[i];
    const to = frames[i + 1];
    if (isWrapMove(from, to, config.board.width)) hasWrapped = true;
    if (approaches.has(squareKey(to.row, to.col))) hasReachedApproach = true;
  }

  const last = frames[frames.length - 1];
  return {
    moveCount: moves.length,
    hasWrapped,
    hasReachedApproach,
    isOver: last.outcome.status !== 'playing',
    outcome: last.outcome,
  };
}

/**
 * The first step not yet finished and not skipped. Returns `steps.length` when
 * every step is done, which the page shows as the closing note.
 */
export function stepIndex(steps, ctx, skipped = new Set()) {
  const i = steps.findIndex((step) => !skipped.has(step.id) && !step.done(ctx));
  return i === -1 ? steps.length : i;
}

/**
 * The game has finished but the tutorial has not. Easily done: a determined
 * player can walk straight into a goal in three moves and never meet the
 * cylinder. Without this the panel would sit there asking for something the
 * dead board can no longer provide.
 */
export function isStalled(steps, ctx, skipped = new Set()) {
  return ctx.isOver && stepIndex(steps, ctx, skipped) < steps.length;
}

export const STALLED_HINT = 'That game is over — press “Start again” and pick up where you left off.';

/**
 * The basketball tutorial, in the order the board teaches it. Each step ends on
 * something the player does, never on a timer or a "next" button.
 */
export const BASKETBALL_STEPS = Object.freeze([
  {
    id: 'welcome',
    title: 'Two goals, one ball',
    body:
      'You are both players for now. Player 1 is trying to reach the goal at the ' +
      'top, Player 2 the one at the bottom — the single gaps in the black walls. ' +
      'Play both sides yourself, or take turns with whoever is sitting next to you.',
    hint: 'The yellow squares are where the ball can go. Click one.',
    done: (ctx) => ctx.moveCount >= 1,
  },
  {
    id: 'trail',
    title: 'The ball burns its path',
    body:
      'Every square the ball leaves is marked and can never be used again. That ' +
      'is what stops the game going round in circles forever — and what will ' +
      'eventually strand somebody.',
    hint: 'Push it around a little and watch your options thin out.',
    done: (ctx) => ctx.moveCount >= 4,
  },
  {
    id: 'wrap',
    title: 'There are no side edges',
    body:
      'Top and bottom are walls. Left and right are not: the board is a cylinder, ' +
      'and the ball leaving one side arrives on the other, like Pac-Man. This is ' +
      'not decoration. It is the reason the real game can work at all.',
    hint: 'Walk the ball off the left or right edge and see where it comes back.',
    done: (ctx) => ctx.hasWrapped,
  },
  {
    id: 'dots',
    title: 'The only ways in',
    body:
      'The dotted squares in front of each goal are the only ones that can reach ' +
      'it next turn, so you must start a turn on one to score. Land on one early, ' +
      'though, and your opponent simply knocks the ball away — and that dot is ' +
      'burnt. Use up all of them and the goal is sealed for good.',
    hint: 'Get the ball onto one of the dots.',
    done: (ctx) => ctx.hasReachedApproach,
  },
  {
    id: 'strategy',
    title: 'So you cannot just charge',
    body:
      'Winning means making your opponent move the ball onto one of your dots, ' +
      'rather than stepping onto it yourself. Every move is forced eventually — ' +
      'the trail sees to that. Play on until somebody scores or nobody can move.',
    hint: 'Finish a game to the end.',
    done: (ctx) => ctx.isOver,
  },
]);

/**
 * Shown once every step is finished. The instruction to separate matters more
 * than any of the rules: the real game only works if you cannot see each
 * other's screen.
 */
export const BASKETBALL_OUTRO = Object.freeze({
  title: 'Now the real game',
  body:
    'That is the whole of the interface — the real game is played exactly like ' +
    'this. What changes is that there is something in it worth discovering, and ' +
    'you will only discover it if you are looking at your own screen and nobody ' +
    "else's. If the two of you have been sharing this one, move to separate " +
    'devices now, join the same room, and do not talk during the first game.',
});
