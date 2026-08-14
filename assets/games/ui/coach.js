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

import { goalApproaches, squareKey } from '../core/rules.js?v=4.2.0';
import { replayFrames } from '../core/game.js?v=4.2.0';

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
    title: 'One Ball, Two Goals',
    body:
      'The ball is the orange circle in the middle. The single gaps in the black ' +
      "walls are the two goals. Player 1's goal is the one at the top right, " +
      "Player 2's goal is at the bottom left.\n\n" +
      'The yellow highlighted squares show where the ball can go next: short ' +
      'steps to the squares around it, and longer passes further out. Remember ' +
      'the star-shape they make around the ball, you will want to recognize it ' +
      'later.',
    hint: 'Click any yellow highlighted square to move the ball there.',
    done: (ctx) => ctx.moveCount >= 1,
  },
  {
    id: 'trail',
    title: 'There is No Going Back',
    body:
      'Every square the ball leaves is marked with a ✕ and can never be used ' +
      'again. Squares only ever close up, they never open: that is what will ' +
      'eventually force a goal (or a tie if the ball runs out of anywhere to go).',
    hint: 'Push it around a little and watch the available spaces thin out.',
    done: (ctx) => ctx.moveCount >= 4,
  },
  {
    id: 'wrap',
    title: "It's Pac-Man's World, and We're Just Living In It",
    body:
      'The left-most and right-most columns are connected (like in Pac-Man). ' +
      'Move the ball towards the left or right so that the star pattern crosses ' +
      'the “seam”. Now move the ball across the seam. The board is a cylinder, ' +
      'and the ball leaving one side arrives on the other.',
    hint: 'Walk the ball off the left or right edge and see where it comes back.',
    done: (ctx) => ctx.hasWrapped,
  },
  {
    id: 'dots',
    title: "You Miss 100% of the Shots You Don't Take",
    body:
      'The six dotted squares in front of each goal are the only ones that can ' +
      'reach it on the next turn. So to score, you must start your turn on one ' +
      'of them. Land on one too early, though, and your opponent will simply ' +
      'knock the ball away, and then that dot is burnt. Use them all up and the ' +
      'goal is sealed for good. You must be clever…',
    hint: 'Get the ball onto one of the dots.',
    done: (ctx) => ctx.hasReachedApproach,
  },
  {
    id: 'strategy',
    title: 'Clever Girl…',
    body:
      'To score, you need for your opponent to move onto one of your dots. You ' +
      'must somehow force them to hand you victory. Late in the game, you will ' +
      'both have very few options left.',
    hint: 'Play a game through to the end.',
    done: (ctx) => ctx.isOver,
  },
]);

/**
 * Shown once every step is finished. The instruction to separate matters more
 * than any of the rules: the real game only works if you cannot see each
 * other's screen.
 */
export const BASKETBALL_OUTRO = Object.freeze({
  title: 'Now the Real Game Begins',
  body:
    'That is the whole interface. The real game is played exactly the same way ' +
    'except on a slightly bigger board. The “trick” only works if the two ' +
    'players are looking at separate screens (on separate devices) and do not ' +
    'talk to each other until the first game is over. So if you and your ' +
    'opponent have been working through this tutorial together (on one device) you ' +
    'need to split up now. The next screen will make sure that you are paired ' +
    'up into the same game room.',
  /** Where the closing button goes. */
  href: '/soccer-hockey/',
  cta: 'Play the Real Game →',
});

/**
 * The note above the two replay boards, once the real game has finished. The
 * one place in the game where the thing being demonstrated is said out loud.
 *
 * Only the two second-person openings are assembled: which sport each player
 * had depends on the seat, and a spectator holds neither. Everything after that
 * is the same for everybody and is left as one block of prose, because that is
 * what it is — the copy is meant to be edited here, not reasoned about.
 */
export function replayNote(config, seat) {
  const yours = config.seats[seat ?? 0].sport;
  const theirs = config.seats[seat === 1 ? 0 : 1].sport;

  const opening =
    seat === null
      ? 'Both boards below show the game that has just finished, from two ' +
        `radically different perspectives. ${config.seats[0].name} thought they ` +
        `were playing ${config.seats[0].sport}, whereas ${config.seats[1].name} ` +
        `thought they were playing ${config.seats[1].sport};`
      : 'Both boards below show the game you just played, from two radically ' +
        `different perspectives. Whereas you thought you were playing ${yours}, ` +
        `your opponent thought you were playing ${theirs};`;

  const divergence =
    seat === null
      ? 'But the two players saw completely different things. Almost nothing ' +
        'about the one perspective agrees with the other.'
      : 'But your friend saw something completely different. Almost nothing ' +
        'about their perspective agrees with yours.';

  return {
    title: 'It Was Both Soccer and Hockey, At Once',
    body:
      `${opening} And this is more than just an aesthetic difference (no mere ` +
      'palette swap). Compare the pattern of available moves on each board, the ' +
      'Soccer player can kick the ball three spaces to the right, whereas the ' +
      'Hockey player can move it four spaces.\n\n' +
      'Now advance through the replay. Every move is exactly as it was actually ' +
      `made, in the order it was made. ${divergence} What seems like a short ` +
      'move to the Soccer player, seems like a long move to the Hockey player ' +
      'and vice versa. In general, you will disagree about what column the ' +
      "ball/puck stands in, as well as the shape of the trails of ✕'s.\n\n" +
      'Nonetheless, you both agree where the two goals are and who ultimately ' +
      'won the game. What structural features of the game are common across the ' +
      'two perspectives, allowing for this kind of consensus? What kind of ' +
      "mathematical transformation relates the two players' different " +
      'representations of this common structure? These kinds of dual ' +
      'representations of one underlying structure are now-common on the front ' +
      'lines of physics: the AdS-CFT correspondence, T-duality in String ' +
      'Theory, etc.\n\n' +
      'My research seeks to draw epistemic and metaphysical consequences from ' +
      'the possibility of such dualities: Are space and time aspects of ' +
      'things-in-themselves, or rather an organizational framework which we ' +
      'apply to the world? Could an alien society use completely different ' +
      'categories and intuitions to make sense of the world? How did we come to ' +
      'have our basic metaphysical concepts (quid facti), and what justifies ' +
      'our continued use of them (quid juris)? That is, which are ' +
      'universal/objective, and which are idiosyncratic/contingent, e.g., upon ' +
      'our particular evolutionary history?',
  };
}
