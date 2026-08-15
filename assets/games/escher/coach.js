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

import { replayFrames, inCheck } from './game.js?v=4.12.0';
import { NARROW, WIDE, TUTORIAL, TUTORIAL_WIDE } from './presets.js?v=4.12.0';
import { PIECE } from './pieces.js?v=4.12.0';

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
const NARROW_SCRIPT = [
    // Step 1 — pawns, and how to work the board at all.
    ['pawns', 'select', at(2, 3), null,
      'Click the white pawn in front of the king. Note that its two possible moves are then marked.'],
    ['pawns', 'move', at(2, 3), at(3, 3),
      'Move this central white pawn one space forward (from rank 2 to rank 3).'],
    // One space, not two. A rook that reaches three needs its own pawn on rank
    // 8 rather than rank 7 if it is to jump the thing later on.
    ['pawns', 'move', at(9, 1), at(8, 1),
      'Now advance black’s left-most pawn one space (from rank 9 to rank 8).'],
    ['pawns', 'move', at(2, 5), at(4, 5),
      'Lastly, move white’s right-most pawn two spaces (from rank 2 to rank 4).'],

    // Step 2 — jumpy and short-ranged, shown on three different pieces.
    ['jumpy', 'move', at(10, 2), at(8, 3),
      'Move black’s left knight into the central file. So far, so normal.'],
    ['jumpy', 'select', at(2, 2), null,
      'Now click on white’s left bishop. As we shall see, it is jumpy and short-ranged (just like everything else).'],
    ['jumpy', 'move', at(2, 2), at(4, 4),
      'Notice that it can move between the two pawns on its left (as usual) but it can also jump over the pawn to its right. Moreover, note that bishops are short-ranged in Escher Chess: it can move at most two spaces diagonally. Now have this bishop jump over the central pawn.'],
    ['jumpy', 'move', at(10, 1), at(7, 1),
      'Lastly, have black’s left-most rook move three spaces forward (from rank 10 to rank 7), jumping over the pawn. It too is short-ranged in Escher Chess, moving at most three spaces in any direction.'],

    // Step 3 — the board has no left or right edge.
    ['wrap', 'move', at(4, 4), at(6, 1),
      'Click on white’s bishop on rank 4. Its usual X-shaped pattern of available moves wraps around the board’s “seam”. Take it across, onto the square directly in front of the black rook, noting that this bishop has just moved from a dark square to a light one.'],
    ['wrap', 'move', at(10, 5), at(10, 1),
      'Rooks too can move across the seam. Move black’s rook on rank 10 one square sideways across it (from the right-most file to the left-most file).'],
    ['wrap', 'move', at(1, 2), at(2, 5),
      'Knights too, of course, can cross the seam. Move white’s left knight one space forward and two to the left, wrapping around the board.'],

    // Step 4 — captures, and a check to finish on.
    ['check', 'move', at(7, 1), at(6, 1),
      'Have black’s forward rook take the white bishop in front of it. Only that rook can: the other one is four ranks away, which is one rank further than a rook goes.'],
    ['check', 'move', at(4, 5), at(5, 5), 'Now advance white’s right-most pawn.'],
    ['check', 'move', at(10, 3), at(10, 2), 'Move black’s king one space to the left.'],
    ['check', 'move', at(5, 5), at(6, 1), 'White’s rank 5 pawn can now take the black rook.'],
    ['check', 'move', at(10, 2), at(9, 1), 'Move black’s king diagonally onto rank 9.'],
    /*
     * Two rook moves rather than one. Three ranks is as far as a rook reaches,
     * and rank 1 to the king on rank 9 is eight — so the rook has to walk, and
     * Black gets a move in between. That in-between move earns its place by
     * showing a pawn's double step jumping something, which nothing else in the
     * script does.
     */
    ['check', 'move', at(1, 1), at(4, 1),
      'Move white’s left-most rook three spaces forward.'],
    ['check', 'move', at(9, 3), at(7, 3),
      'Advance the central black pawn two spaces, jumping over the knight.'],
    ['check', 'move', at(4, 1), at(7, 1),
      'Now move white’s left-most rook three spaces forward again, jumping over your own pawn on the way. The black king is in check.'],
];

/**
 * The eight-file tutorial, played after the first real game is over.
 *
 * Much shorter, because almost nothing is new: this reader has already learnt
 * that everything is jumpy, that everything is short-ranged, and that the board
 * is a cylinder. Two pieces are not the ones they learnt. The knight is a file
 * wider here, and there is a queen, who does not exist on the narrow board at
 * all — and with her comes the one fact about eight files that catches people
 * out, which is that three squares each way no longer covers a rank.
 */
const WIDE_SCRIPT = [
  // Step 1 — where you are.
  ['board', 'select', at(2, 5), null,
    'Click the white pawn in front of the king. Its two moves are marked, exactly as before: every pawn here stands on its own opening rank, so every one of them still has its double step.'],
  ['board', 'move', at(2, 5), at(4, 5),
    'Push it two.'],
  ['board', 'move', at(7, 5), at(5, 5),
    'And black’s pawn down to meet it.'],

  // Step 2 — the queen, and the blind square she and the rooks share.
  ['queen', 'move', at(1, 4), at(3, 2),
    'Bring the queen out two squares diagonally, to the left. She jumps her own pawn on the way, as everything on this board does.'],
  ['queen', 'move', at(8, 7), at(6, 5),
    'Black brings out a knight. Do not worry about what it did just yet.'],
  ['queen', 'select', at(3, 2), null,
    'Now click the queen. Everything she can reach is marked: three squares along the rank or the file, two along a diagonal. Look along her own rank, though. Six squares are marked and one is not — and there is nothing standing on it. Three each way on eight files leaves exactly one square out of reach: the one directly opposite. Your rooks have the same blind spot.'],
  ['queen', 'move', at(3, 2), at(3, 7),
    'Note also that three of her moves along that rank are on the far side of the seam. Take her three squares to the left, off the edge and back on the other side.'],

  // Step 3 — the knight, which is the piece that has actually changed.
  ['knight', 'move', at(8, 2), at(6, 4),
    'Black develops the other knight.'],
  ['knight', 'move', at(1, 2), at(3, 4),
    'Now white’s left knight. On the narrow board it moved two and one; here it moves two and two, or one and three. Take it two forward and two to the right.'],
  ['knight', 'move', at(7, 2), at(6, 2),
    'Black advances a pawn.'],
  ['knight', 'move', at(3, 4), at(5, 6),
    'Two and two again, into the middle of the board.'],
  ['knight', 'move', at(7, 8), at(6, 8),
    'And another black pawn.'],
  ['knight', 'select', at(5, 6), null,
    'Click the knight. Standing in the open it shows the whole shape at once: eight squares in a ring, four of them two-and-two and four of them one-and-three. Two are across the seam — three files is very nearly half of eight, so this piece leaves the board and comes back almost every time it moves.'],
  ['knight', 'move', at(5, 6), at(6, 3),
    'Take it one forward and three to the left, over the seam. That is check: from there it attacks the square the black king is standing on, and a knight cannot be blocked. The board is yours.'],
];

const WIDE_STEPS = [
  {
    id: 'board',
    title: 'The Same Game, a Wider Board',
    body:
      'Eight files, eight ranks, and the pieces set out as in ordinary chess — ' +
      'one rank of pawns, and a queen. Everything you have just learnt still ' +
      'holds: every piece is jumpy, every piece is short-ranged, and the left ' +
      'and right edges are joined. Only two pieces are not the ones you played ' +
      'with, and this is where you meet them.',
  },
  {
    id: 'queen',
    title: 'The Queen, and Her Blind Spot',
    body:
      'There is no queen on the narrow board, so she is new — but there is ' +
      'nothing to learn about her that you do not know. She is a rook and a ' +
      'bishop at once: three squares along a rank or a file, two along a ' +
      'diagonal, all of it jumpy, all of it wrapping.',
  },
  {
    id: 'knight',
    title: 'The Knight Is Wider Here',
    body:
      'The knight is the one piece whose move genuinely changes with the size ' +
      'of the board. On five files it went two and one. On eight it goes two ' +
      'and two, or one and three. Why it should depend on the board at all is ' +
      'worth wondering about; the game will answer it.',
  },
];

/** Just the moves of a script, in order — what the board plays through. */
export const scriptMoves = (script) => script.filter((b) => b.kind === 'move');

/** How many of a script's moves have been played, from the start, in order. */
export function scriptProgress(script, moves) {
  const wanted = scriptMoves(script);
  let i = 0;
  while (
    i < wanted.length &&
    i < moves.length &&
    isSquare(moves[i].from, wanted[i].from) &&
    isSquare(moves[i].to, wanted[i].to)
  ) {
    i += 1;
  }
  return i;
}

/** The one move the board should offer, or null once the script is spent. */
export const nextScripted = (script, moves) =>
  scriptMoves(script)[scriptProgress(script, moves)] ?? null;

/**
 * Which beat is outstanding.
 *
 * A `select` beat is satisfied by picking that piece up, which is why the
 * selection has to reach this far. Everything before it in the list is settled
 * by the move count alone.
 */
export function beatIndex(script, moves, selected = null) {
  const done = scriptProgress(script, moves);
  let played = 0;
  for (const [i, beat] of script.entries()) {
    if (beat.kind === 'move') {
      if (played === done) return i;
      played += 1;
    } else if (played === done && !(selected && isSquare(selected, beat.from))) {
      return i;
    }
  }
  return script.length;
}

/**
 * The instruction to show, or '' once the script is finished.
 *
 * Read off the context rather than taking a script of its own, because it is
 * every step's `hint` and the page calls it with nothing but the context.
 */
export const beatNote = (ctx) => ctx.script[beatIndex(ctx.script, ctx.moves, ctx.selected)]?.note ?? '';

/**
 * Reduce a game to the facts the steps care about. Each is cumulative — once
 * true it stays true — so the tutorial only ever moves forwards.
 *
 * `selected` is not a fact about the game at all; it is what the player is
 * holding. It is here because a `select` beat is finished by picking a piece up
 * and nothing else, and the panel has to be able to say so.
 */
export function contextFor(board, script, moves, selected = null) {
  const frames = replayFrames(board, moves);

  let hasChecked = false;
  for (let i = 0; i < moves.length; i++) {
    // Check is asked of the side about to move, which is whoever did not just
    // move — the only king a move can newly expose.
    if (inCheck(board, frames[i + 1], frames[i + 1].turn)) hasChecked = true;
  }

  const last = frames[frames.length - 1];
  return {
    script,
    moves,
    selected,
    moveCount: moves.length,
    scripted: scriptProgress(script, moves),
    beat: beatIndex(script, moves, selected),
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
 * One practice board's worth of teaching: its script, its steps, its closing
 * note, and the board the whole thing is written against.
 *
 * A step is finished when the script has run past the last beat belonging to
 * it, which is why the steps are built from the script rather than beside it —
 * inserting a beat cannot then leave a step ending in the wrong place.
 */
function makeTutorial({ board, script, steps, outro }) {
  const beats = Object.freeze(
    script.map(([step, kind, from, to, note]) => Object.freeze({ step, kind, from, to, note }))
  );
  const through = (id) => beats.length - [...beats].reverse().findIndex((b) => b.step === id);
  return Object.freeze({
    board,
    script: beats,
    moves: Object.freeze(scriptMoves(beats)),
    steps: Object.freeze(
      steps.map(({ id, title, body }) =>
        Object.freeze({ id, title, body, hint: beatNote, done: (ctx) => ctx.beat >= through(id) })
      )
    ),
    outro,
  });
}

/**
 * The narrow tutorial, in the order the board teaches it. Four steps, then the
 * board is handed back.
 */
const NARROW_STEPS = [
  {
    id: 'pawns',
    title: 'Pawns, and How to Move Them',
    body:
      'Note that this chess board is five files wide and ten ranks deep. But ' +
      'it gets weirder than that. Follow the blue instructions below as you ' +
      'read along. Let’s get some pawns in position.',
  },
  {
    id: 'jumpy',
    title: 'Everything is Jumpy (and Short-Ranged)',
    body:
      'In Escher Chess, every piece is jumpy (like a knight in classic chess) ' +
      'and short-ranged. Let’s now see this with knights, bishops, and rooks.',
  },
  {
    id: 'wrap',
    title: "It's Pac-Man's World, and We're Just Living In It",
    body:
      'Here is another twist. In Escher Chess, the left-most and right-most ' +
      'files are connected (like in Pac-Man). Let’s see how this works in ' +
      'practice.',
  },
  {
    id: 'check',
    title: 'Checking the King',
    body:
      'As usual, the goal of Escher Chess is to check and ultimately ' +
      'check-mate the opponent’s King. Let’s play a bit more until a king ' +
      'gets checked.',
  },
];

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

/**
 * The eight-file tutorial's closing note.
 *
 * Says less about not talking, because this reader has already done that once
 * and found out why — and more about the fact that the trick is the same trick,
 * so that they go in looking rather than waiting to be surprised.
 */
const WIDE_OUTRO = Object.freeze({
  title: 'Now the Wider Game',
  body:
    'The board is yours from here on out; play on if you like.\n\n' +
    'That is everything that changes. The same trick is waiting on this board ' +
    'as on the last one: one of you will play with the pieces just described, ' +
    'and will watch the other play with something else. You know what to do ' +
    'this time — watch what their pieces actually do, rather than what you ' +
    'expect them to.\n\n' +
    'Separate screens, separate devices, and nothing said to each other but ' +
    'your moves until the game is over. There are more pieces on this board ' +
    'and more of them are strange, so it takes longer to see. That is the ' +
    'point of playing it second.',
  href: '/assets/EscherChess/EscherChessGameV4.0.html?board=escher-8x8',
  cta: 'Play the 8×8 Game →',
});

/* ------------------------------------------------------- the two tutorials ---- */

export const NARROW_TUTORIAL = makeTutorial({
  board: TUTORIAL,
  script: NARROW_SCRIPT,
  steps: NARROW_STEPS,
  outro: ESCHER_OUTRO,
});

export const WIDE_TUTORIAL = makeTutorial({
  board: TUTORIAL_WIDE,
  script: WIDE_SCRIPT,
  steps: WIDE_STEPS,
  outro: WIDE_OUTRO,
});

/**
 * Keyed by the *real* board each one prepares you for, since that is what the
 * page is asked for in its query string — `?board=escher-8x8` means "the
 * tutorial for the eight-file game", not "the eight-file practice board".
 */
export const TUTORIALS = Object.freeze({
  [NARROW.id]: NARROW_TUTORIAL,
  [WIDE.id]: WIDE_TUTORIAL,
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

const plural = (name) => `${PIECE_NAME[name]}s`;

/** "pawns and kings", "pawns, kings and queens". */
const list = (names) =>
  names.length <= 1
    ? (names[0] ?? '')
    : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;

/**
 * The pieces that turned out to be somebody else's, as clauses.
 *
 * Read off `board.duality` rather than written down, so the paragraph cannot
 * end up describing a board nobody is playing on — the five-file and eight-file
 * games swap different pieces, and only one of them is ever on screen. The
 * first clause carries the verb and the rest elide it, which is how the
 * sentence is spoken.
 */
export function pieceRevelations(board) {
  const out = [];
  for (const [name, { selfDual, dualTo }] of Object.entries(board.duality)) {
    if (selfDual || !dualTo) continue;
    out.push(`their ${plural(name)}${out.length ? '' : ' moved'} like ${plural(dualTo)}`);
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
 * The pieces that are like nothing at all in the other description.
 *
 * A duality does not have to send every piece to another piece: on both
 * published boards the pawn and the king come out as things that are not in the
 * opponent's set at all, and saying so is more honest than leaving them out.
 */
export function strangePieces(board) {
  return Object.entries(board.duality)
    .filter(([, d]) => !d.selfDual && !d.dualTo)
    .map(([name]) => PIECE_NAME[name]);
}

/** "…their knights moved like bishops; …; and while their rooks were still rooks, …" */
function whatTheirPiecesWere(board) {
  const swaps = pieceRevelations(board);
  const held = unchangedPieces(board).map((n) => `${n}s`);
  const odd = strangePieces(board).map((n) => `${n}s`);

  const tail = held.length
    ? odd.length
      ? `while their ${list(held)} were still ${list(held)}, their ${list(odd)} were very strange`
      : `their ${list(held)} were still ${list(held)}`
    : odd.length
      ? `their ${list(odd)} were very strange`
      : '';

  if (!swaps.length) return tail ? `${tail[0].toUpperCase()}${tail.slice(1)}.` : '';
  return `${swaps.join('; ')}${tail ? `; and ${tail}` : ''}.`;
}

/**
 * The note above the two replay boards, once the real game has finished. The
 * one place in the game where the thing being demonstrated is said out loud.
 */
export function revealNote(board, seat) {
  const opening =
    seat === null
      ? 'Both boards below show the game that has just finished, but from two ' +
        'radically different perspectives. The left-hand one is White’s board, ' +
        'whereas the right-hand board is what Black saw. Now advance through ' +
        'the replay. Every move is exactly as it was actually made, in the ' +
        'order it was made. But the two players saw something completely ' +
        'different.'
      : 'Both boards below show the game you just played, but from two ' +
        'radically different perspectives. The left-hand one is the board you ' +
        'were looking at, whereas the right-hand board is what your opponent ' +
        'saw. Now advance through the replay. Every move is exactly as it was ' +
        'actually made, in the order it was made. But your friend saw ' +
        'something completely different.';

  const theirs = whatTheirPiecesWere(board);
  const both =
    seat === null
      ? 'Each of them thought they were playing with the normal pieces whereas ' +
        `their opponent had very strange pieces: ${theirs} Both of them thought ` +
        'this! Nonetheless, they agreed about when every piece was captured and ' +
        'whenever the king was in check. Weird!'
      : 'You both thought you were playing with the normal pieces whereas your ' +
        `opponent had very strange pieces: ${theirs} You both thought this! ` +
        'Nonetheless, you both agree when every piece was captured and whenever ' +
        'the king was in check. Weird!';

  return {
    title: 'You Were Both Playing with the Normal Pieces!',
    body: `${opening}\n\n${both}`,
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
      'to start in — a matter of quid facti rather than quid juris.',
  };
}
