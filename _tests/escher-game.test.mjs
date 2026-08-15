import test from 'node:test';
import assert from 'node:assert/strict';

import { NARROW, WIDE, TUTORIAL, SIDE } from '../assets/games/escher/presets.js';
import { PIECE } from '../assets/games/escher/pieces.js';
import {
  STATUS,
  initialGame,
  pieceAt,
  canonicalMoves,
  legalMoves,
  legalMovesFrom,
  isLegalMove,
  applyMove,
  replay,
  replayFrames,
  inCheck,
  isAttacked,
  toView,
  fromView,
  viewOf,
} from '../assets/games/escher/game.js';

/** Chess letters: knight is N, because king already has the K. */
const LETTER = {
  [PIECE.PAWN]: 'P',
  [PIECE.KNIGHT]: 'N',
  [PIECE.BISHOP]: 'B',
  [PIECE.ROOK]: 'R',
  [PIECE.QUEEN]: 'Q',
  [PIECE.KING]: 'K',
};

/** What a seat sees on one rank, left to right. */
const rowSeenBy = (board, game, seat, viewRank) => {
  const view = viewOf(board, game, seat);
  return Array.from({ length: board.width }, (_, file) => {
    const man = view.men.find((m) => m.rank === viewRank && m.file === file);
    return man ? LETTER[man.type] : '.';
  }).join('');
};

const steps = (moves) => moves.map((m) => `${m.step[0]},${m.step[1]}`).sort();

test('the boards match the rule booklets', async (t) => {
  /*
   * The figures in the booklets show White's board with Black's men on it. If
   * these two rows are right, the lens, the rotation and the starting position
   * are all right together — they are the only things that could make them
   * wrong.
   */
  await t.test('five wide: White sees Black as B,B,R,K,R', () => {
    const game = initialGame(NARROW);
    assert.equal(rowSeenBy(NARROW, game, SIDE.WHITE, NARROW.height - 1), 'BBRKR');
    assert.equal(rowSeenBy(NARROW, game, SIDE.WHITE, NARROW.height - 2), 'NNPPP');
  });

  await t.test('and White sees their own men the way the booklet writes them', () => {
    const game = initialGame(NARROW);
    assert.equal(rowSeenBy(NARROW, game, SIDE.WHITE, 0), 'RBKBR');
    assert.equal(rowSeenBy(NARROW, game, SIDE.WHITE, 1), 'PNPNP');
    assert.equal(rowSeenBy(NARROW, game, SIDE.WHITE, 2), '.P.P.');
  });

  await t.test('eight wide: White sees Black as Q,N,N,K,R,B,B,R', () => {
    const game = initialGame(WIDE);
    assert.equal(rowSeenBy(WIDE, game, SIDE.WHITE, WIDE.height - 1), 'QNNKRBBR');
    assert.equal(rowSeenBy(WIDE, game, SIDE.WHITE, 0), 'RNBQKBNR');
  });

  await t.test('each player sees their own army standard, and nearest to them', () => {
    for (const board of [NARROW, WIDE]) {
      for (const seat of [SIDE.WHITE, SIDE.BLACK]) {
        const view = viewOf(board, initialGame(board), seat);
        const back = view.men.filter((m) => m.rank === 0);
        assert.ok(back.every((m) => m.mine), `seat ${seat} on ${board.id}: own men at rank 0`);
        const backRow = rowSeenBy(board, initialGame(board), seat, 0);
        assert.equal(backRow, board.width === 5 ? 'RBKBR' : 'RNBQKBNR');
      }
    }
  });

  await t.test('rank labels are shared, and only the order they are drawn differs', () => {
    const white = viewOf(NARROW, initialGame(NARROW), SIDE.WHITE);
    const black = viewOf(NARROW, initialGame(NARROW), SIDE.BLACK);
    assert.deepEqual(white.rankLabels, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.deepEqual(black.rankLabels, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
  });

  await t.test('the file names are ARMED one way and DREAM the other', () => {
    assert.deepEqual(NARROW.files[SIDE.WHITE].join(''), 'ARMED');
    assert.deepEqual(NARROW.files[SIDE.BLACK].join(''), 'DREAM');
  });
});

test('a square is a square, whoever is looking', async (t) => {
  await t.test('every canonical square round-trips through both seats', () => {
    for (const board of [NARROW, WIDE]) {
      for (let rank = 0; rank < board.height; rank++) {
        for (let file = 0; file < board.width; file++) {
          for (const seat of [SIDE.WHITE, SIDE.BLACK]) {
            const there = toView(board, seat, { rank, file });
            assert.deepEqual(fromView(board, seat, there), { rank, file });
          }
        }
      }
    }
  });

  await t.test('the two seats disagree about where a square is, except by accident', () => {
    const disagreements = [];
    for (let file = 0; file < NARROW.width; file++) {
      const w = toView(NARROW, SIDE.WHITE, { rank: 4, file });
      const b = toView(NARROW, SIDE.BLACK, { rank: 4, file });
      if (w.file !== b.file) disagreements.push(file);
    }
    assert.ok(disagreements.length >= NARROW.width - 1, 'at most one file can agree');
  });
});

test('pieces move as their owner expects', async (t) => {
  await t.test("a side's own moves come back unchanged through its own lens", () => {
    /*
     * White's lens is the identity and White's ranks are not flipped, so
     * White's canonical moves are the table — but compared as squares, not as
     * labels. On five files a step of three right and one of two left name the
     * same square, and `canonicalDelta` returns the shorter of the two.
     */
    const squares = (moves) =>
      [...new Set(moves.map((m) => `${m.step[0]},${((m.step[1] % 5) + 5) % 5}`))].sort();
    for (const type of Object.keys(NARROW.pieces)) {
      assert.deepEqual(squares(canonicalMoves(NARROW, type, SIDE.WHITE)), squares(NARROW.pieces[type]));
    }
  });

  await t.test('and a square is never offered twice, however the table names it', () => {
    // The rook reaches four files each way on a board five files wide, so its
    // table names every reachable square twice over.
    const game = initialGame(NARROW);
    for (const [key] of game.men) {
      const [rank, file] = key.split(',').map(Number);
      const to = legalMovesFrom(NARROW, game, { rank, file });
      const unique = new Set(to.map((s) => `${s.rank},${s.file}`));
      assert.equal(to.length, unique.size, `duplicate destinations from ${key}`);
    }
  });

  await t.test("Black's pawns advance towards White", () => {
    for (const board of [NARROW, WIDE]) {
      const push = canonicalMoves(board, PIECE.PAWN, SIDE.BLACK).find(
        (m) => m.forbidsCapture && Math.abs(m.step[0]) === 1
      );
      assert.equal(push.step[0], -1, 'down the canonical board');
      assert.equal(push.step[1], 0, 'and straight up its own file');
    }
  });

  await t.test("White sees Black's pawns capture two files away, not one", () => {
    // The moment the game stops looking normal. Five wide: two. Eight: three.
    const across = (board) =>
      [
        ...new Set(
          canonicalMoves(board, PIECE.PAWN, SIDE.BLACK)
            .filter((m) => m.requiresCapture)
            .map((m) => Math.abs(m.step[1]))
        ),
      ];
    assert.deepEqual(across(NARROW), [2]);
    assert.deepEqual(across(WIDE), [3]);
  });

  await t.test('the tutorial has no duality at all, so both sides look alike', () => {
    for (const type of Object.keys(TUTORIAL.pieces)) {
      // Same shapes, only up-ended: ordinary chess.
      const white = steps(canonicalMoves(TUTORIAL, type, SIDE.WHITE));
      const black = canonicalMoves(TUTORIAL, type, SIDE.BLACK)
        .map((m) => `${-m.step[0]},${m.step[1]}`)
        .sort();
      assert.deepEqual(black, white);
    }
  });
});

test('playing a game', async (t) => {
  await t.test('White opens, and has moves to make', () => {
    const game = initialGame(NARROW);
    assert.equal(game.turn, SIDE.WHITE);
    assert.equal(game.outcome.status, STATUS.PLAYING);
    assert.ok(legalMoves(NARROW, game).length > 0);
    assert.ok(legalMoves(NARROW, game).every((m) => pieceAt(game, m.from.rank, m.from.file).side === SIDE.WHITE));
  });

  await t.test('a move moves the piece and passes the turn', () => {
    const game = initialGame(NARROW);
    const move = legalMoves(NARROW, game)[0];
    const next = applyMove(NARROW, game, move);
    assert.equal(pieceAt(next, move.from.rank, move.from.file), null);
    assert.ok(pieceAt(next, move.to.rank, move.to.file));
    assert.equal(next.turn, SIDE.BLACK);
  });

  await t.test('an illegal move is refused rather than half-applied', () => {
    const game = initialGame(NARROW);
    assert.throws(
      () => applyMove(NARROW, game, { from: { rank: 0, file: 0 }, to: { rank: 7, file: 0 } }),
      /illegal move/
    );
    assert.equal(initialGame(NARROW).men.size, game.men.size);
  });

  await t.test('the log is the state: replaying it gives the same position', () => {
    const moves = [];
    let game = initialGame(NARROW);
    for (let i = 0; i < 12 && game.outcome.status === STATUS.PLAYING; i++) {
      const move = legalMoves(NARROW, game)[0];
      moves.push(move);
      game = applyMove(NARROW, game, move);
    }
    const again = replay(NARROW, moves);
    assert.deepEqual([...again.men.entries()].sort(), [...game.men.entries()].sort());
    assert.equal(again.turn, game.turn);
    assert.equal(replayFrames(NARROW, moves).length, moves.length + 1);
  });

  await t.test('nobody may move into check', () => {
    // Every legal move leaves your own king safe. Checked exhaustively over a
    // real game rather than on a contrived position.
    let game = initialGame(NARROW);
    for (let i = 0; i < 20 && game.outcome.status === STATUS.PLAYING; i++) {
      for (const move of legalMoves(NARROW, game)) {
        const after = applyMove(NARROW, game, move);
        assert.ok(!inCheck(NARROW, after, game.turn), 'left its own king in check');
      }
      game = applyMove(NARROW, game, legalMoves(NARROW, game)[0]);
    }
  });

  await t.test('a game reaches an end, and the end is one of the three', () => {
    let game = initialGame(WIDE);
    let guard = 0;
    while (game.outcome.status === STATUS.PLAYING && guard++ < 400) {
      const moves = legalMoves(WIDE, game);
      game = applyMove(WIDE, game, moves[guard % moves.length]);
    }
    assert.ok([STATUS.CHECKMATE, STATUS.STALEMATE].includes(game.outcome.status), game.outcome.status);
    if (game.outcome.status === STATUS.CHECKMATE) {
      assert.ok(inCheck(WIDE, game, game.turn), 'checkmate means the side to move is in check');
      assert.equal(game.outcome.winner, game.turn === SIDE.WHITE ? SIDE.BLACK : SIDE.WHITE);
    } else {
      assert.ok(!inCheck(WIDE, game, game.turn), 'stalemate means it is not');
    }
  });
});

test('what a player is allowed to see', async (t) => {
  /*
   * The game is that you have to work out how your opponent's pieces move. A
   * view that carried their reachable squares would hand that over to anybody
   * who opened the console, so it does not carry them.
   */
  await t.test('a view holds this seat\'s moves and no others', () => {
    const game = initialGame(NARROW);
    const white = viewOf(NARROW, game, SIDE.WHITE);
    const black = viewOf(NARROW, game, SIDE.BLACK);
    assert.ok(white.myMoves.length > 0);
    assert.deepEqual(black.myMoves, [], 'not their turn, so nothing to offer');
    assert.equal('theirMoves' in white, false);
    assert.equal('attacked' in white, false);
  });

  await t.test('and every move it does hold is one of that seat\'s own', () => {
    const game = initialGame(NARROW);
    const view = viewOf(NARROW, game, SIDE.WHITE);
    for (const m of view.myMoves) {
      const from = fromView(NARROW, SIDE.WHITE, m.from);
      assert.equal(pieceAt(game, from.rank, from.file).side, SIDE.WHITE);
    }
  });

  await t.test('check is a flag, not a diagram', () => {
    const view = viewOf(NARROW, initialGame(NARROW), SIDE.WHITE);
    assert.equal(view.check, false);
    assert.equal(typeof view.check, 'boolean');
  });

  await t.test('the enemy men are visible — their moves are not', () => {
    const view = viewOf(NARROW, initialGame(NARROW), SIDE.WHITE);
    const theirs = view.men.filter((m) => !m.mine);
    assert.ok(theirs.length > 0, 'you can see the pieces');
    assert.ok(theirs.every((m) => m.type && !('moves' in m)));
  });
});

test('promotion', async (t) => {
  await t.test('the narrow board offers everything but a queen', () => {
    assert.deepEqual([...NARROW.promotesTo].sort(), [PIECE.BISHOP, PIECE.KNIGHT, PIECE.ROOK].sort());
    assert.ok(WIDE.promotesTo.includes(PIECE.QUEEN));
  });

  await t.test('a pawn reaching the end is offered each choice as a separate move', () => {
    // A lone White pawn one step from the far rank, with both kings out of the way.
    const men = new Map([
      ['8,2', { type: PIECE.PAWN, side: SIDE.WHITE }],
      ['0,0', { type: PIECE.KING, side: SIDE.WHITE }],
      ['5,4', { type: PIECE.KING, side: SIDE.BLACK }],
    ]);
    const game = { men, turn: SIDE.WHITE, outcome: { status: STATUS.PLAYING, winner: null } };
    const promotions = legalMoves(NARROW, game).filter((m) => m.to.rank === NARROW.height - 1);
    assert.deepEqual(
      [...new Set(promotions.map((m) => m.promote))].sort(),
      [...NARROW.promotesTo].sort()
    );
    const asRook = promotions.find((m) => m.promote === PIECE.ROOK);
    const after = applyMove(NARROW, game, asRook);
    assert.equal(pieceAt(after, asRook.to.rank, asRook.to.file).type, PIECE.ROOK);
  });
});
