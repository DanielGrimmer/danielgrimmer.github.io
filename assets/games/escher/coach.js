/**
 * Escher Chess: everything the two pages say out loud.
 *
 * The tutorial's steps and the reveal's prose live here rather than in the
 * pages, for the same reason the Soccer Hockey copy does — this is the file to
 * edit when the wording is wrong, and it should be readable by somebody who
 * does not want to read a page of DOM plumbing to reach it.
 *
 * The order of the steps is the order the board teaches in, and each ends on
 * something the player *does* rather than on a "next" button. The tutorial is
 * played by one person at one screen, both sides, so nothing here is secret:
 * its board has the duality switched off, and every word below is true of both
 * armies. That stops being so on the next screen, which is the point.
 */

import { replayFrames, inCheck } from './game.js?v=4.7.0';
import { SIDE } from './presets.js?v=4.7.0';
import { PIECE } from './pieces.js?v=4.7.0';

/**
 * A square, written the way the board is labelled: rank first, then file, both
 * counting from one, both as White sees them.
 *
 * The tutorial draws no file letters, so a square has no name a player could
 * type — but it still has a position, and this is the only place the script
 * needs to say one. Canonical coordinates are zero-based, hence the offsets.
 */
const at = (rank, file) => Object.freeze({ rank: rank - 1, file: file - 1 });

const isSquare = (a, b) => a.rank === b.rank && a.file === b.file;

/**
 * The opening, move by move.
 *
 * The tutorial plays a fixed game, and offers exactly one legal move at a time
 * until it runs out. That is a stronger hand on the tiller than "move any
 * piece", and it has to be: each step's text points at something the previous
 * moves put on the board — a pawn for the bishop to leap, a rook for the bishop
 * to take, a piece parked beside the seam — and a player who wandered off would
 * be reading commentary about a position they no longer have.
 *
 * `step` groups the moves under the step that teaches them. `note` is the hint
 * while that move is the one outstanding.
 */
export const TUTORIAL_SCRIPT = Object.freeze(
  [
    // Step 1 — pawns, and how to work the board at all.
    ['pawns', at(2, 3), at(3, 3), 'Click the white pawn in front of the king, then the square ahead of it.'],
    ['pawns', at(9, 1), at(7, 1), 'Now Black\u2019s left-hand pawn, two squares to rank 7 \u2014 any pawn may open with a double step, from wherever it starts.'],
    ['pawns', at(2, 5), at(4, 5), 'White\u2019s right-hand pawn, two squares to rank 4.'],

    // Step 2 — the minor pieces, and the first surprise.
    ['minor', at(10, 2), at(8, 3), 'Black\u2019s knight out to rank 8. It steps over its own men, as a knight always has.'],
    ['minor', at(2, 2), at(4, 4), 'White\u2019s left bishop, two squares up the diagonal to rank 4 \u2014 straight over the pawn you just pushed.'],

    // Step 3 — the rook, which is the same lesson from the other direction.
    ['rook', at(10, 1), at(6, 1), 'Black\u2019s left rook, four squares down to rank 6, over its own pawn on the way.'],

    // Step 4 — the board has no left or right edge.
    ['wrap', at(4, 4), at(6, 1), 'The bishop again, two more up the diagonal: off the right-hand edge and back on the left, taking the rook.'],
    ['wrap', at(10, 5), at(10, 1), 'Black\u2019s other rook, one square sideways across the same seam.'],
    ['wrap', at(1, 2), at(2, 5), 'And White\u2019s knight across it, to rank 2.'],

    // Step 5 — taking, including across the seam.
    ['captures', at(10, 1), at(6, 1), 'The rook four squares down again, taking the bishop.'],
    ['captures', at(4, 5), at(5, 5), 'White\u2019s pawn one square, to rank 5.'],
    ['captures', at(10, 3), at(10, 2), 'Black\u2019s king, one square sideways.'],
    ['captures', at(5, 5), at(6, 1), 'And the pawn takes \u2014 diagonally, across the seam, onto the rook.'],
  ].map(([step, from, to, note]) => Object.freeze({ step, from, to, note }))
);

/** How much of the script has been played, from the beginning, in order. */
export function scriptProgress(moves) {
  let i = 0;
  while (
    i < TUTORIAL_SCRIPT.length &&
    i < moves.length &&
    isSquare(moves[i].from, TUTORIAL_SCRIPT[i].from) &&
    isSquare(moves[i].to, TUTORIAL_SCRIPT[i].to)
  ) {
    i += 1;
  }
  return i;
}

/** The one move the board should offer, or null once the script is spent. */
export const nextScripted = (moves) => TUTORIAL_SCRIPT[scriptProgress(moves)] ?? null;

/** How many of the script's moves belong to a step, cumulatively. */
const throughStep = (id) => TUTORIAL_SCRIPT.filter((m) => m.step === id).length +
  TUTORIAL_SCRIPT.findIndex((m) => m.step === id);

/**
 * Reduce a game to the facts the steps care about. Each is cumulative — once
 * true it stays true — so the tutorial only ever moves forwards.
 */
export function contextFor(board, moves) {
  const frames = replayFrames(board, moves);

  let hasChecked = false;
  for (let i = 0; i < moves.length; i++) {
    // Check is asked of the side about to move, which is whoever did not just
    // move — the only king a move can newly expose.
    if (inCheck(board, frames[i + 1], frames[i + 1].turn)) hasChecked = true;
  }

  const last = frames[frames.length - 1];
  return {
    moveCount: moves.length,
    scripted: scriptProgress(moves),
    hasChecked,
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
 * The game has finished but the tutorial has not. It cannot happen while the
 * script is running — the script does not end a game — but the last step is
 * free play, and a fool's mate there would otherwise leave the panel asking for
 * something a dead board can no longer provide.
 */
export function isStalled(steps, ctx, skipped = new Set()) {
  return ctx.isOver && stepIndex(steps, ctx, skipped) < steps.length;
}

export const STALLED_HINT =
  'That game is over \u2014 press \u201cStart again\u201d and pick up where you left off.';

/** While the script runs, the hint is whatever the next move is. */
const scriptHint = (ctx) => TUTORIAL_SCRIPT[ctx.scripted]?.note ?? '';

/**
 * The tutorial, in the order the board teaches it.
 *
 * The first five steps are the scripted opening; the sixth hands the board
 * back. Deliberately short — every clause a player has to hold in their head is
 * one more thing between them and the real game, and the real game is where the
 * point is.
 */
export const ESCHER_STEPS = Object.freeze([
  {
    id: 'pawns',
    title: 'Pawns, and How to Move Them',
    body:
      'Chess, on a board five files wide and ten ranks deep. You are playing ' +
      'both sides here; White moves first, and the back rank reads rook, ' +
      'knight, king, knight, rook.\n\n' +
      'Click a piece and it lights up along with everywhere it may go; click ' +
      'one of those squares to move it. For the next few minutes only one move ' +
      'will be offered at a time, so that the board ends up in a position ' +
      'worth talking about. Pawns first: forward one, or two from where they ' +
      'start, and diagonally when they take.',
    hint: scriptHint,
    done: (ctx) => ctx.scripted >= throughStep('pawns'),
  },
  {
    id: 'minor',
    title: 'Everything Jumps',
    body:
      'A knight leaps in every version of chess, so its first move here looks ' +
      'ordinary. Watch the bishop that follows it: in normal chess that bishop ' +
      'is shut in behind its own pawn, and here it simply goes over.\n\n' +
      'That is the first real rule, and it has no exceptions: every piece here ' +
      'moves the way a knight moves \u2014 straight to its destination, never ' +
      'minding what stands ' +
      'between. Nothing on this board can be blocked.\n\n' +
      'And notice how far the bishop went: two squares, and no further. ' +
      'Everything here is short range, which is what stops a board where ' +
      'nothing can be blocked from ending on move three.',
    hint: scriptHint,
    done: (ctx) => ctx.scripted >= throughStep('minor'),
  },
  {
    id: 'rook',
    title: 'And the Rook Is No Different',
    body:
      'Four squares along a rank or a file, straight over its own pawn. The ' +
      'same two rules again: it jumps, and it stops.\n\n' +
      'That is the whole of the piece list now. Rooks reach four, bishops ' +
      'reach two, knights leap as they always did, pawns push one or two and ' +
      'take diagonally, and the king goes one square in any direction. There ' +
      'is no queen on this board, no castling, and no en passant.',
    hint: scriptHint,
    done: (ctx) => ctx.scripted >= throughStep('rook'),
  },
  {
    id: 'wrap',
    title: "It's Pac-Man's World, and We're Just Living In It",
    body:
      'The board has no left edge and no right edge. The two outside files are ' +
      'neighbours, so a piece that walks off one side arrives on the other \u2014 ' +
      'exactly as in Pac-Man. The next three moves all cross that seam.\n\n' +
      'Watch the bishop especially. It changes the colour of the square it ' +
      'stands on, which a bishop can never do in ordinary chess. Five is an odd ' +
      'number, so the chequerboard does not quite meet itself coming round.\n\n' +
      'This matters more than it sounds. Five files wide, a rook reaching four ' +
      'squares sideways can reach every other file on the board, from anywhere.',
    hint: scriptHint,
    done: (ctx) => ctx.scripted >= throughStep('wrap'),
  },
  {
    id: 'captures',
    title: 'Taking',
    body:
      'Move onto an enemy piece and you take it; that is all there is to it. ' +
      'The last of these is a pawn taking diagonally across the seam, which is ' +
      'the kind of capture that will catch you out later if you have not seen ' +
      'one before.',
    hint: scriptHint,
    done: (ctx) => ctx.scripted >= TUTORIAL_SCRIPT.length,
  },
  {
    id: 'check',
    title: 'Now Play It Out',
    body:
      'The board is yours from here \u2014 both sides of it. Play on until one ' +
      'of the kings is in check.\n\n' +
      'The goal is the ordinary one: trap the enemy king. Checkmate wins; a ' +
      'player with no legal move who is not in check draws. You will be told ' +
      'when a king is in check, and you will not be told what is giving the ' +
      'check \u2014 there is a reason for that, and it will become clear on the ' +
      'next screen.',
    hint: 'Play both sides on, and put one of the kings in check.',
    done: (ctx) => ctx.hasChecked || ctx.isOver,
  },
]);

/**
 * Shown once every step is finished.
 *
 * The instruction to separate matters more than any of the rules: the game only
 * works if the two players cannot see each other's screen, and it is the one
 * thing a player can get wrong in a way that cannot be undone.
 */
export const ESCHER_OUTRO = Object.freeze({
  title: 'Now the Real Game Begins',
  body:
    'That is the whole tutorial. Every rule you have just learnt is true of ' +
    'your own pieces in the real game, on a board of exactly this size.\n\n' +
    'It is not true of your friend\u2019s. You will not be told how their pieces ' +
    'move; you have to work it out from watching them, which is the game. So ' +
    'the two of you need separate screens, on separate devices, and you must ' +
    'not talk to each other about what you can see until the first game is ' +
    'over.\n\n' +
    'One thing this board did not show you: in the real game the files are ' +
    'lettered, and those letters are the entire channel between you. Announce ' +
    'your moves by file and rank \u2014 \u201cthe knight on E2 to M4\u201d \u2014 and nothing ' +
    'else. The next screen will put you both in the same room.',
  href: '/assets/EscherChess/EscherChessGameV4.0.html',
  cta: 'Play the Real Game \u2192',
});

/* --------------------------------------------------------------- the reveal ---- */

const PIECE_NAME = Object.freeze({
  [PIECE.PAWN]: 'pawn',
  [PIECE.KNIGHT]: 'knight',
  [PIECE.BISHOP]: 'bishop',
  [PIECE.ROOK]: 'rook',
  [PIECE.QUEEN]: 'queen',
  [PIECE.KING]: 'king',
});

/**
 * What each piece turned out to be, in one line apiece.
 *
 * Read off `board.duality` rather than written down, so that it cannot end up
 * describing a board nobody is playing on. A piece that is dual to nothing gets
 * no line: "your king is not like anything" is a sentence that teaches nobody
 * anything, and the table reads better as a short list of surprises.
 */
export function pieceRevelations(board) {
  const out = [];
  for (const [name, { selfDual, dualTo }] of Object.entries(board.duality)) {
    if (selfDual) continue;
    if (!dualTo) continue;
    out.push(`Their ${PIECE_NAME[name]} has been moving like your ${PIECE_NAME[dualTo]}.`);
  }
  return out;
}

/** The pieces that looked normal, which is the other half of the story. */
export function unchangedPieces(board) {
  return Object.entries(board.duality)
    .filter(([, d]) => d.selfDual)
    .map(([name]) => PIECE_NAME[name]);
}

/**
 * The note above the two replay boards, once the real game has finished. The
 * one place in the game where the thing being demonstrated is said out loud.
 */
export function revealNote(board, seat) {
  const files = board.files;
  const yours = files[seat ?? SIDE.WHITE].join('');
  const theirs = files[seat === SIDE.BLACK ? SIDE.WHITE : SIDE.BLACK].join('');

  const opening =
    seat === null
      ? 'Both boards below show the game that has just finished. They are the ' +
        'same game — the same moves, in the same order — drawn once for each ' +
        'player.'
      : 'Both boards below show the game you just played. They are the same ' +
        'game — the same moves, in the same order — drawn once for each of you. ' +
        'The left-hand one is the board you were looking at.';

  const swaps = pieceRevelations(board);
  const held = unchangedPieces(board);

  const table = swaps.length
    ? `${swaps.join(' ')}${
        held.length
          ? ` The ${held.join(' and ')} was the same piece for both of you, which ` +
            'is why nothing looked wrong for the first few moves.'
          : ''
      }`
    : '';

  return {
    title: 'You Were Not Playing the Same Game',
    body:
      `${opening} And yet you never once disagreed about a move: every time one ` +
      'of you said “D3 to D5”, the other found a legal move of their own and ' +
      'played it.\n\n' +
      `You were not reading the board the same way. Your five files ran ${yours}; ` +
      `theirs ran ${theirs}. Both of you were right, because a file is a name, ` +
      'not a place, and the two of you never had to agree about which name sat ' +
      'next to which.\n\n' +
      `${table}\n\n` +
      'Step through the replay and watch a single move land on two different ' +
      'squares. Nothing has been recomputed or dramatised: this is the log, ' +
      'folded twice.',
    after:
      'This is a duality in the sense the word carries in physics: two ' +
      'descriptions of one system, neither of them the true one, related by a ' +
      'dictionary that translates every statement of the first into a statement ' +
      'of the second. Nobody here was mistaken. There was no fact of the matter ' +
      'about whose bishop was a bishop, and the game was still perfectly ' +
      'well-defined — somebody won it.\n\n' +
      'My research is about what follows from that. If two theories are related ' +
      'this way, the question of which one is *true* stops being a question ' +
      'about the world and becomes a question about the language you happened ' +
      'to start in — a matter of quid juris rather than quid facti.',
  };
}
