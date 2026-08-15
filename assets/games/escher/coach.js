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

import { mod, signedRep } from '../core/duality.js?v=4.5.0';
import { replayFrames, inCheck, squareKey } from './game.js?v=4.5.0';
import { SIDE } from './presets.js?v=4.5.0';
import { PIECE } from './pieces.js?v=4.5.0';

/**
 * Did this move cross the seam? On a cylinder the short way round is the only
 * way round, so a file jump of more than half the board means it wrapped.
 */
export function isWrapMove(from, to, width) {
  return Math.abs(to.file - from.file) > width / 2;
}

/**
 * Did this move pass over an occupied square?
 *
 * Which is the whole of "all movement is jumpy", and the one rule a player can
 * be shown rather than told. Only straight lines have an inside, so anything
 * that is not a rank, a file or a diagonal is skipped; the file step is taken
 * the short way round, since that is the way the piece actually went.
 */
export function leapsSomething(before, move, width) {
  const dRank = move.to.rank - move.from.rank;
  const dFile = signedRep(move.to.file - move.from.file, width);
  const span = Math.max(Math.abs(dRank), Math.abs(dFile));
  if (span < 2) return false;
  const straight = dRank === 0 || dFile === 0 || Math.abs(dRank) === Math.abs(dFile);
  if (!straight) return false;

  const stepRank = Math.sign(dRank);
  const stepFile = Math.sign(dFile);
  for (let i = 1; i < span; i++) {
    const rank = move.from.rank + stepRank * i;
    const file = mod(move.from.file + stepFile * i, width);
    if (before.men.has(squareKey(rank, file))) return true;
  }
  return false;
}

/**
 * Reduce a game to the facts the steps care about. Each is cumulative — once
 * true it stays true — so the tutorial only ever moves forwards.
 */
export function contextFor(board, moves) {
  const frames = replayFrames(board, moves);

  let hasWrapped = false;
  let hasLeapt = false;
  let hasChecked = false;
  let hasTaken = false;

  for (let i = 0; i < moves.length; i++) {
    const move = frames[i + 1].lastMove;
    if (isWrapMove(move.from, move.to, board.width)) hasWrapped = true;
    if (leapsSomething(frames[i], move, board.width)) hasLeapt = true;
    if (move.captured) hasTaken = true;
    // Check is asked of the side about to move, which is whoever did not just
    // move — the only king a move can newly expose.
    if (inCheck(board, frames[i + 1], frames[i + 1].turn)) hasChecked = true;
  }

  const last = frames[frames.length - 1];
  return {
    moveCount: moves.length,
    hasWrapped,
    hasLeapt,
    hasChecked,
    hasTaken,
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
 * The game has finished but the tutorial has not — a fool's mate is four moves
 * away and takes nobody past the second step. Without this the panel would sit
 * asking for something a dead board can no longer provide.
 */
export function isStalled(steps, ctx, skipped = new Set()) {
  return ctx.isOver && stepIndex(steps, ctx, skipped) < steps.length;
}

export const STALLED_HINT =
  'That game is over — press “Start again” and pick up where you left off.';

/**
 * The tutorial, in the order the board teaches it.
 *
 * Deliberately short. Every clause a player has to hold in their head is one
 * more thing standing between them and the real game, and the real game is
 * where the point is.
 */
export const ESCHER_STEPS = Object.freeze([
  {
    id: 'welcome',
    title: 'A Narrower Board',
    body:
      'Chess, on a board five files wide and ten ranks deep. You are playing ' +
      'both sides here; White moves first.\n\n' +
      'Five files and a ten-rank run change the game more than they sound like ' +
      'they should. There is nowhere to hide a king sideways, and the two ' +
      'armies start far enough apart that you get several moves to look at ' +
      'yours before anything is at stake. Use them.',
    hint: 'Move any piece.',
    done: (ctx) => ctx.moveCount >= 1,
  },
  {
    id: 'jumpy',
    title: 'Everything Jumps',
    body:
      'Every piece moves the way a knight moves in ordinary chess: it goes ' +
      'straight to its destination and never minds what is in the way. Rooks ' +
      'and bishops leap over your own pawns from the very first move, which is ' +
      'why this game opens quickly.\n\n' +
      'There is one rule, and it has no exceptions. Nothing here can be blocked.',
    hint: 'Move a rook or a bishop over a piece standing in its way.',
    done: (ctx) => ctx.hasLeapt,
  },
  {
    id: 'short',
    title: 'And Nothing Reaches Far',
    body:
      'In exchange, everything is short range. A rook goes up to four squares ' +
      'along a rank or a file; a bishop up to two along a diagonal. Every pawn ' +
      'may still open with a double step, from wherever it starts — including ' +
      'the two that begin a rank further forward. On this board there is no ' +
      'queen, no castling and no en passant, and a pawn reaching the far rank ' +
      'promotes.\n\n' +
      'A leaping piece that could also cross the whole board would end the game ' +
      'on about move three, so the two rules pay for each other.',
    hint: 'Play on a little, and take something.',
    done: (ctx) => ctx.hasTaken,
  },
  {
    id: 'cylinder',
    title: "It's Pac-Man's World, and We're Just Living In It",
    body:
      'The leftmost and rightmost files are neighbours. Walk a piece off one ' +
      'side of the board and it arrives on the other, exactly as in ' +
      'Pac-Man.\n\n' +
      'This matters more than it sounds. Five files wide, a rook reaching four ' +
      'squares sideways can reach every other file on the board, from anywhere.',
    hint: 'Move a piece off one side of the board and back on the other.',
    done: (ctx) => ctx.hasWrapped,
  },
  {
    id: 'check',
    title: 'Check, and Mate',
    body:
      'The goal is the ordinary one: trap the enemy king. Checkmate wins; a ' +
      'player with no legal move who is not in check draws.\n\n' +
      'You will be told when a king is in check. You will not be told what is ' +
      'giving the check, and there is a reason for that which will become clear ' +
      'on the next screen.',
    hint: 'Put one of the two kings in check.',
    done: (ctx) => ctx.hasChecked,
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
    'It is not true of your friend’s. You will not be told how their pieces ' +
    'move; you have to work it out from watching them, which is the game. So ' +
    'the two of you need separate screens, on separate devices, and you must ' +
    'not talk to each other about what you can see until the first game is ' +
    'over.\n\n' +
    'One thing this board did not show you: in the real game the files are ' +
    'lettered, and those letters are the entire channel between you. Announce ' +
    'your moves by file and rank — “the knight on E2 to M4” — and nothing else. ' +
    'The next screen will put you both in the same room.',
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
