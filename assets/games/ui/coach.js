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

import { goalApproaches, squareKey } from '../core/rules.js?v=4.24.0';
import { replayFrames } from '../core/game.js?v=4.24.0';

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
      'The basketball starts in the middle. The gaps in the black walls are the ' +
      "two goals. Player 1's goal is the one at the top right, Player 2's goal " +
      "is at the bottom left.\n\n" +
      'The highlighted squares show where the ball can go next: a short step to ' +
      'an adjacent square or a longer pass further out. Remember the star-shape ' +
      'they make around the ball, you will want to recognize it later.',
    hint: 'Click any gold square to move the ball there.',
    done: (ctx) => ctx.moveCount >= 1,
  },
  {
    id: 'trail',
    title: 'There is No Going Back',
    body:
      'Every square the ball leaves is marked with a ✕ and can never be used ' +
      'again. Squares only ever close up, they never open: that is what will ' +
      'eventually force a goal (or a tie if the ball runs out of places to go).',
    hint: 'Push it around a little and watch the available spaces thin out.',
    done: (ctx) => ctx.moveCount >= 4,
  },
  {
    id: 'wrap',
    title: "It's Pac-Man's World, and We're Just Living In It",
    body:
      'The left-most and right-most columns are the same edge. Walk the ball ' +
      'sideways until the star crosses the seam, then step across it: the board ' +
      'is a cylinder, and what leaves one side arrives on the other.',
    hint: 'Take the ball off the left or right edge and see where it comes back.',
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
    'friend have been working through this tutorial together (on one device) you ' +
    'need to split up now. The next screen will make sure that you are paired ' +
    'up into the same game room.',
  /**
   * Straight to the game. Sending them to the landing page first would only
   * ask them to press a second button saying the same thing.
   */
  href: '/assets/SoccerHockey/SoccerHockeyGameV4.0.html',
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

  /*
   * Who thought they were playing what. Said in the second person to the two
   * people it happened to, and in the third to anybody who wandered in.
   */
  const whoThought =
    seat === null
      ? `${config.seats[0].name} thought they were playing ${config.seats[0].sport}; ` +
        `${config.seats[1].name} thought they were playing ${config.seats[1].sport}`
      : `You thought you were playing ${yours}; your friend thought they were ` +
        `playing ${theirs}`;

  return {
    title: 'It was both Soccer and Hockey, at once',
    /**
     * Short, and above the boards. The comparison that used to live here is now
     * the two lists below them, where it can be read at a glance against the
     * thing it is about; everything this paragraph has to do is get the reader
     * to the replay.
     */
    body:
      `Both boards below show the game ${seat === null ? 'that has just finished' : 'you just played'}. ` +
      `${whoThought} — and this is no palette swap. Step the replay through and ` +
      'watch the two accounts refuse to line up.',
    /**
     * The punchline as two lists rather than a paragraph: what survived the
     * crossing and what did not. Every line is checkable against the two boards
     * on screen, which is the only reason it is worth saying at all.
     */
    agree: Object.freeze([
      'which row the ball stands in',
      'where the two goals are',
      'who won',
    ]),
    disagree: Object.freeze([
      'which column it stands in',
      "the shape of the trail of ✕'s",
      'whether a short or long pass was just made',
    ]),
    /**
     * Carried below the two boards rather than above them. The reveal only
     * works if the boards are reached quickly; the questions they raise keep
     * perfectly well until after somebody has stepped through the replay.
     */
    after:
      'This raises some interesting questions: What is the common structure to ' +
      'both accounts to form the basis of what you agree upon? What kind of ' +
      'transformation carries one perspective onto the other? Dual descriptions ' +
      'of one structure are ordinary in physics now: AdS/CFT, T-duality.\n\n' +
      'My own philosophical research asks what follows from the possibility of ' +
      'such dualities. Are space and time aspects of the world-in-itself, or ' +
      'rather are they merely an organizational structure which we are bringing ' +
      'to the table? Could an alien society use completely different categories ' +
      'and intuitions to make sense of the world? How did we come to have our ' +
      'basic metaphysical concepts (quid facti), and what justifies our ' +
      'continued use of them (quid juris)? That is: which of them are universal ' +
      'and objective, and which are idiosyncratic and contingent — upon our ' +
      'particular evolutionary history, for instance?',
  };
}
