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

import { replayFrames, inCheck } from './game.js?v=4.8.0';
import { SIDE } from './presets.js?v=4.8.0';
import { PIECE } from './pieces.js?v=4.8.0';

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
 * The tutorial, beat by beat.
 *
 * A beat is one instruction. Most ask for a move; a few ask only that a piece
 * be *picked up*, so that the reader can be told what to look at before they
 * commit to anything. That distinction is the whole reason this is a list of
 * beats rather than a list of moves: "click the bishop and notice it can jump
 * the pawn" has to land before "now jump it", and a move-only script cannot say
 * the first half.
 *
 * While the script is running the board offers exactly one move — but it marks
 * every move the selected piece could legally make, because seeing the shape of
 * the pattern is most of what these steps are teaching.
 */
export const TUTORIAL_SCRIPT = Object.freeze(
  [
    // Step 1 — pawns, and how to work the board at all.
    ['pawns', 'select', at(2, 3), null,
      'Click the white pawn in front of the king. Note that its two possible moves are then marked.'],
    ['pawns', 'move', at(2, 3), at(3, 3),
      'Move this central white pawn one space forward (from rank 2 to rank 3).'],
    ['pawns', 'move', at(9, 1), at(7, 1),
      'Now advance black’s left-most pawn two spaces (from rank 9 to rank 7).'],
    ['pawns', 'move', at(2, 5), at(4, 5),
      'Lastly, move white’s right-most pawn two spaces (from rank 2 to rank 4).'],

    // Step 2 — jumpy and short-ranged, shown on three different pieces.
    ['jumpy', 'move', at(10, 2), at(8, 3),
      'Move black’s left knight into the central file. So far, so normal.'],
    ['jumpy', 'select', at(2, 2), null,
      'Now click on white’s left bishop. Notice that it can move between the two pawns on its left (as usual) but it can also jump over the pawn to its right.'],
    ['jumpy', 'move', at(2, 2), at(4, 4),
      'Notice also that bishops are short-ranged in Escher Chess: it can move at most two spaces diagonally. Now have this bishop jump over the central pawn.'],
    ['jumpy', 'move', at(10, 1), at(6, 1),
      'Lastly, have black’s left-most rook move four spaces forward (from rank 10 to rank 6), jumping over the pawn. It too is short-ranged in Escher Chess, moving at most four spaces in any direction.'],

    // Step 3 — the board has no left or right edge.
    ['wrap', 'move', at(4, 4), at(6, 1),
      'Click on white’s bishop on rank 4. Its usual X-shaped pattern of available moves wraps around the board’s “seam”, allowing it to take the black rook on rank 6. Do so, noting that this bishop has just moved from a dark square to a light one.'],
    ['wrap', 'move', at(10, 5), at(10, 1),
      'Rooks too can move across the seam. Move black’s last rook one square sideways across it (from the right-most file to the left-most file).'],
    ['wrap', 'move', at(1, 2), at(2, 5),
      'Knights too, of course, can cross the seam. Move white’s left knight one space forward and two to the left, wrapping around the board.'],

    // Step 4 — captures, and a check to finish on.
    ['check', 'move', at(10, 1), at(6, 1), 'Have black’s rook take the white bishop on rank 6.'],
    ['check', 'move', at(4, 5), at(5, 5), 'Now advance white’s right-most pawn.'],
    ['check', 'move', at(10, 3), at(10, 2), 'Move black’s king one space to the left.'],
    ['check', 'move', at(5, 5), at(6, 1), 'White’s rank 5 pawn can now take the black rook.'],
    ['check', 'move', at(10, 2), at(9, 1), 'Move black’s king diagonally onto rank 9.'],
    ['check', 'move', at(1, 1), at(5, 1),
      'Move white’s left-most rook four spaces forward, putting the king in check.'],
  ].map(([step, kind, from, to, note]) => Object.freeze({ step, kind, from, to, note }))
);

/** Just the moves, in order — what the board actually plays through. */
export const SCRIPT_MOVES = Object.freeze(TUTORIAL_SCRIPT.filter((b) => b.kind === 'move'));

/** How many of the script's moves have been played, from the start, in order. */
export function scriptProgress(moves) {
  let i = 0;
  while (
    i < SCRIPT_MOVES.length &&
    i < moves.length &&
    isSquare(moves[i].from, SCRIPT_MOVES[i].from) &&
    isSquare(moves[i].to, SCRIPT_MOVES[i].to)
  ) {
    i += 1;
  }
  return i;
}

/** The one move the board should offer, or null once the script is spent. */
export const nextScripted = (moves) => SCRIPT_MOVES[scriptProgress(moves)] ?? null;

/**
 * Which beat is outstanding.
 *
 * A `select` beat is satisfied by picking that piece up, which is why the
 * selection has to reach this far. Everything before it in the list is settled
 * by the move count alone.
 */
export function beatIndex(moves, selected = null) {
  const done = scriptProgress(moves);
  let played = 0;
  for (const [i, beat] of TUTORIAL_SCRIPT.entries()) {
    if (beat.kind === 'move') {
      if (played === done) return i;
      played += 1;
    } else if (played === done && !(selected && isSquare(selected, beat.from))) {
      return i;
    }
  }
  return TUTORIAL_SCRIPT.length;
}

/** The instruction to show, or '' once the script is finished. */
export const beatNote = (ctx) => TUTORIAL_SCRIPT[beatIndex(ctx.moves, ctx.selected)]?.note ?? '';

/** How far through the script a step's own beats reach. */
const throughStep = (id) =>
  TUTORIAL_SCRIPT.length - [...TUTORIAL_SCRIPT].reverse().findIndex((b) => b.step === id);

/**
 * Reduce a game to the facts the steps care about. Each is cumulative — once
 * true it stays true — so the tutorial only ever moves forwards.
 *
 * `selected` is not a fact about the game at all; it is what the player is
 * holding. It is here because a `select` beat is finished by picking a piece up
 * and nothing else, and the panel has to be able to say so.
 */
export function contextFor(board, moves, selected = null) {
  const frames = replayFrames(board, moves);

  let hasChecked = false;
  for (let i = 0; i < moves.length; i++) {
    // Check is asked of the side about to move, which is whoever did not just
    // move — the only king a move can newly expose.
    if (inCheck(board, frames[i + 1], frames[i + 1].turn)) hasChecked = true;
  }

  const last = frames[frames.length - 1];
  return {
    moves,
    selected,
    moveCount: moves.length,
    scripted: scriptProgress(moves),
    beat: beatIndex(moves, selected),
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
 * script is running, since the script does not end a game — but it is cheap
 * insurance against a step that can no longer be satisfied.
 */
export function isStalled(steps, ctx, skipped = new Set()) {
  return ctx.isOver && stepIndex(steps, ctx, skipped) < steps.length;
}

export const STALLED_HINT =
  'That game is over — press “Start again” and pick up where you left off.';

/**
 * The tutorial, in the order the board teaches it. Four steps, then the board
 * is handed back.
 */
export const ESCHER_STEPS = Object.freeze([
  {
    id: 'pawns',
    title: 'Pawns, and How to Move Them',
    body:
      'Note that this chess board is five files wide and ten ranks deep. But ' +
      'it gets weirder than that. Follow the blue instructions below as you ' +
      'read along. Let’s get some pawns in position.',
    hint: beatNote,
    done: (ctx) => ctx.beat >= throughStep('pawns'),
  },
  {
    id: 'jumpy',
    title: 'Everything is Jumpy (and Short-Ranged)',
    body:
      'In Escher Chess, every piece is jumpy (like a knight in classic chess) ' +
      'and short-ranged. Let’s now see this with knights, bishops, and rooks.',
    hint: beatNote,
    done: (ctx) => ctx.beat >= throughStep('jumpy'),
  },
  {
    id: 'wrap',
    title: "It's Pac-Man's World, and We're Just Living In It",
    body:
      'Here is another twist. In Escher Chess, the left-most and right-most ' +
      'files are connected (like in Pac-Man). Let’s see how this works in ' +
      'practice.',
    hint: beatNote,
    done: (ctx) => ctx.beat >= throughStep('wrap'),
  },
  {
    id: 'check',
    title: 'Checking the King',
    body:
      'As usual, the goal of Escher Chess is to check and ultimately ' +
      'check-mate the opponent’s King. Let’s play a bit more until a king ' +
      'gets checked.',
    hint: beatNote,
    done: (ctx) => ctx.beat >= TUTORIAL_SCRIPT.length,
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
    'The board is yours from here on out; feel free to continue playing to ' +
    'check mate if you like.\n\n' +
    'That is the whole tutorial. In the real game, one of you will play with ' +
    'the pieces just described, whereas you will see your opponent playing ' +
    'with even stranger pieces. You will not be told how their pieces move; ' +
    'you have to work it out from watching them. This confusion is part of the ' +
    'game.\n\n' +
    'The “trick” only works if the two players are looking at separate screens ' +
    '(on separate devices) and do not talk to each other until the first game ' +
    'is over. So if you and your friend have been working through this ' +
    'tutorial together (on one device) you need to split up now. The next ' +
    'screen will make sure that you are paired up into the same game room.',
  href: '/assets/EscherChess/EscherChessGameV4.0.html',
  cta: 'Play the Real Game →',
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
