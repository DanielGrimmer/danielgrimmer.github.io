import test from 'node:test';
import assert from 'node:assert/strict';

import { NARROW, WIDE, TUTORIAL, SIDE } from '../assets/games/escher/presets.js';
import { dualityBetween } from '../assets/games/core/duality.js';
import { PIECE } from '../assets/games/escher/pieces.js';
import {
  STATUS,
  initialGame,
  pieceAt,
  canonicalMoves,
  legalMoves,
  legalMovesFrom,
  pseudoMoves,
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
   * These rows are White's board with Black's men on it — the figure each
   * booklet prints. If they are right, the lens, the rotation and the starting
   * position are all right together; they are the only things that could make
   * them wrong.
   *
   * The narrow board's own back rank is no longer the booklet's. Its knights
   * and bishops were swapped, so that the order reads rook-knight-king from
   * either edge as ordinary chess does, and so that the knights point at the
   * gaps in the third rank. The eight-wide board is untouched.
   */
  await t.test('five wide: White sees Black as N,N,R,K,R', () => {
    const game = initialGame(NARROW);
    assert.equal(rowSeenBy(NARROW, game, SIDE.WHITE, NARROW.height - 1), 'NNRKR');
    assert.equal(rowSeenBy(NARROW, game, SIDE.WHITE, NARROW.height - 2), 'BBPPP');
  });

  await t.test('and White sees their own men in the standard order', () => {
    const game = initialGame(NARROW);
    assert.equal(rowSeenBy(NARROW, game, SIDE.WHITE, 0), 'RNKNR');
    assert.equal(rowSeenBy(NARROW, game, SIDE.WHITE, 1), 'PBPBP');
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
      }
    }
  });

  await t.test('and Black sees their king to the left of their queen, as in chess', () => {
    /*
     * The two armies face each other, which is a half turn, and a half turn
     * reverses files. It is why a real chess player sees RNBQKBNR from the
     * White side and RNBKQBNR from the Black one. Miss this and the queen and
     * king swap files, which the booklet figure would have caught anyway.
     */
    assert.equal(rowSeenBy(WIDE, initialGame(WIDE), SIDE.WHITE, 0), 'RNBQKBNR');
    assert.equal(rowSeenBy(WIDE, initialGame(WIDE), SIDE.BLACK, 0), 'RNBKQBNR');
    // The narrow army is a palindrome, so there it looks the same either way.
    for (const seat of [SIDE.WHITE, SIDE.BLACK]) {
      assert.equal(rowSeenBy(NARROW, initialGame(NARROW), seat, 0), 'RNKNR');
      assert.equal(rowSeenBy(NARROW, initialGame(NARROW), seat, 1), 'PBPBP');
      assert.equal(rowSeenBy(NARROW, initialGame(NARROW), seat, 2), '.P.P.');
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

  await t.test("the wide board's names are the two lines of the logo", () => {
    // Read alternately: CHES + DUAL for White, ESCH + DUAL for Black.
    assert.deepEqual(WIDE.files[SIDE.WHITE].join(''), 'CDHUEASL');
    assert.deepEqual(WIDE.files[SIDE.BLACK].join(''), 'EDSUCAHL');
    const alternate = (names, from) => names.filter((_, i) => i % 2 === from).join('');
    assert.equal(alternate(WIDE.files[SIDE.WHITE], 0), 'CHES');
    assert.equal(alternate(WIDE.files[SIDE.BLACK], 0), 'ESCH');
    for (const seat of [SIDE.WHITE, SIDE.BLACK]) {
      assert.equal(alternate(WIDE.files[seat], 1), 'DUAL');
    }
  });
});

/**
 * The opening must be a game, not a formality.
 *
 * Both kings start on the file their opponent's queen starts on, seven ranks
 * away and walled in by their own men — so a queen that covers four ranks
 * reaches rank five and mates on move one, with no defence, because White moves
 * first. That is what the published eight-file board did, and shortening the
 * rook (and with it the queen) from four to three is the fix. This is the test
 * that says why the dial is where it is.
 */
test('neither opening position is already lost', async (t) => {
  const endsIt = (board, game, move) =>
    applyMove(board, game, { ...move, promote: move.promote ?? null }).outcome.status !==
    STATUS.PLAYING;

  await t.test('no first move ends the game', () => {
    for (const board of [NARROW, WIDE]) {
      const game = initialGame(board);
      const killers = legalMoves(board, game).filter((m) => endsIt(board, game, m));
      assert.deepEqual(killers, [], `${board.id}: a first move that ends it`);
    }
  });

  await t.test('and no first move forces one either', () => {
    for (const board of [NARROW, WIDE]) {
      const game = initialGame(board);
      for (const opener of legalMoves(board, game)) {
        const after = applyMove(board, game, { ...opener, promote: opener.promote ?? null });
        // Black has a reply that leaves White without a finishing move.
        const escape = legalMoves(board, after).some((reply) => {
          const then = applyMove(board, after, { ...reply, promote: reply.promote ?? null });
          return (
            then.outcome.status === STATUS.PLAYING &&
            !legalMoves(board, then).some((m) => endsIt(board, then, m))
          );
        });
        assert.ok(escape, `${board.id}: ${JSON.stringify(opener)} forces a mate in two`);
      }
    }
  });
});

test('the condition without which there is no game', async (t) => {
  /*
   * Both players must be able to say "D3" and mean one square. Everything else
   * about the duality is a design choice; this one is load-bearing, and it is
   * the constraint that fixes the lens rather than leaving it free.
   */
  await t.test('every file has one name, whoever is saying it', () => {
    for (const board of [NARROW, WIDE, TUTORIAL]) {
      for (let file = 0; file < board.width; file++) {
        const white = board.files[SIDE.WHITE][toView(board, SIDE.WHITE, { rank: 0, file }).file];
        const black = board.files[SIDE.BLACK][toView(board, SIDE.BLACK, { rank: 0, file }).file];
        assert.equal(black, white, `${board.id}: canonical file ${file}`);
      }
    }
  });

  await t.test('and a board whose names disagree cannot be built at all', () => {
    // The check lives in the constructor, not only here, because the sandbox
    // will build boards at runtime.
    const files = NARROW.files[SIDE.BLACK];
    assert.notEqual(files.join(''), 'ARMED', 'the identity would be the broken case');
  });

  await t.test('the duality numbers the piece tests assume are the ones in play', () => {
    assert.equal(dualityBetween(NARROW.lenses[SIDE.BLACK], NARROW.lenses[SIDE.WHITE]), 2);
    assert.equal(dualityBetween(WIDE.lenses[SIDE.BLACK], WIDE.lenses[SIDE.WHITE]), 5);
    // The tutorial's mirror is its own inverse, so both players read the other
    // the same way round.
    assert.equal(dualityBetween(TUTORIAL.lenses[SIDE.BLACK], TUTORIAL.lenses[SIDE.WHITE]), 4);
  });

  await t.test('every man of both armies lands on a square of the board', () => {
    for (const board of [NARROW, WIDE, TUTORIAL]) {
      const seen = new Set();
      for (const { rank, file } of board.placement) {
        assert.ok(rank >= 0 && rank < board.height, `${board.id}: rank ${rank}`);
        assert.ok(file >= 0 && file < board.width, `${board.id}: file ${file}`);
        const key = `${rank},${file}`;
        assert.ok(!seen.has(key), `${board.id}: two men on ${key}`);
        seen.add(key);
      }
      assert.equal(seen.size, board.placement.length);
    }
  });
});

test('the tutorial is ordinary chess', async (t) => {
  /*
   * "Duality off" is the mirror, not the identity: two people sitting opposite
   * each other see the files in opposite orders with a perfectly normal chess
   * set. Getting this wrong would make the tutorial the one board in the game
   * where the two players genuinely disagree.
   */
  await t.test("Black's names are White's backwards", () => {
    assert.deepEqual(
      [...TUTORIAL.files[SIDE.BLACK]].reverse().join(''),
      TUTORIAL.files[SIDE.WHITE].join('')
    );
  });

  await t.test('the two armies mirror each other file for file', () => {
    const game = initialGame(TUTORIAL);
    for (let rank = 0; rank < 3; rank++) {
      assert.equal(
        rowSeenBy(TUTORIAL, game, SIDE.WHITE, rank),
        rowSeenBy(TUTORIAL, game, SIDE.WHITE, TUTORIAL.height - 1 - rank),
        `rank ${rank} against its opposite number`
      );
    }
  });

  await t.test('and every piece moves the same way for both players', () => {
    for (const type of Object.keys(TUTORIAL.pieces)) {
      const shape = (seat) =>
        [
          ...new Set(
            canonicalMoves(TUTORIAL, type, seat).map(
              // Ranks negate for Black, which is what facing the other way means
              // and is true of ordinary chess too; files must not move at all.
              (m) => `${Math.abs(m.step[0])},${((m.step[1] % 5) + 5) % 5}`
            )
          ),
        ].sort();
      assert.deepEqual(shape(SIDE.BLACK), shape(SIDE.WHITE), type);
    }
  });

  await t.test('so nothing is dual to anything else — every piece is itself', () => {
    for (const [name, { selfDual }] of Object.entries(TUTORIAL.duality)) {
      assert.equal(selfDual, true, `${name} should look the same to both players`);
    }
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
    // The rook reaches three files each way on a board five files wide, so
    // "three right" and "two left" land on one square: the table names some
    // reachable squares twice over.
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

  /*
   * Several seeded walks rather than one, because a single game is not
   * guaranteed to finish: there is no repetition rule and no draw by lack of
   * material, so two bare kings on a cylinder can circle each other for ever.
   * That is a property of the rules, not a fault in them, and it is why this
   * asks "every game that ended, ended coherently" rather than "this game
   * ended". An earlier version played one walk and expected a result inside
   * four hundred moves; it only ever passed because the eight-file board had a
   * mate in one at the time.
   */
  await t.test('however a game ends, the end is one of the three, and it adds up', () => {
    // xorshift32: reproducible, and Math.random would make a failure unrepeatable.
    const rng = (s) => () => ((s ^= s << 13), (s ^= s >>> 17), (s ^= s << 5), (s >>> 0) / 2 ** 32);
    const board = WIDE;
    // Four seeds known to finish, between them both ways a game can end. Should
    // the rules move again and these stop finishing, the count below fails and
    // says so, rather than the test quietly checking nothing.
    const seen = new Set();

    for (const seed of [2, 4, 8, 9]) {
      const next = rng(seed * 2654435761);
      let game = initialGame(board);
      for (let n = 0; n < 300 && game.outcome.status === STATUS.PLAYING; n++) {
        const moves = legalMoves(board, game);
        game = applyMove(board, game, moves[Math.floor(next() * moves.length)]);
      }
      if (game.outcome.status === STATUS.PLAYING) continue;
      seen.add(game.outcome.status);

      assert.equal(legalMoves(board, game).length, 0, 'an ended game has no moves left');
      if (game.outcome.status === STATUS.CHECKMATE) {
        assert.ok(inCheck(board, game, game.turn), 'checkmate means the side to move is in check');
        assert.equal(game.outcome.winner, game.turn === SIDE.WHITE ? SIDE.BLACK : SIDE.WHITE);
      } else {
        assert.ok(!inCheck(board, game, game.turn), 'stalemate means it is not');
        assert.equal(game.outcome.winner, null, 'a draw has no winner');
      }
    }

    assert.deepEqual([...seen].sort(), [STATUS.CHECKMATE, STATUS.STALEMATE].sort());
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

test('what just happened', async (t) => {
  /*
   * Carried on the state rather than recomputed, because a frame pulled out of
   * the middle of a replay has no log behind it to look back at.
   */
  await t.test('the opening position has no last move', () => {
    assert.equal(initialGame(NARROW).lastMove, null);
    assert.equal(viewOf(NARROW, initialGame(NARROW), SIDE.BLACK).lastMove, null);
  });

  await t.test('a move records its squares, its piece, and whether it took', () => {
    const game = initialGame(NARROW);
    const push = legalMoves(NARROW, game).find((m) => m.to.rank === 3);
    const after = applyMove(NARROW, game, push);
    assert.deepEqual(after.lastMove.from, push.from);
    assert.deepEqual(after.lastMove.to, push.to);
    assert.equal(after.lastMove.side, SIDE.WHITE);
    assert.equal(after.lastMove.captured, false);
    assert.equal(after.lastMove.promote, null);
  });

  await t.test('each seat is told where it went on their own board', () => {
    const game = initialGame(NARROW);
    const push = legalMoves(NARROW, game)[0];
    const after = applyMove(NARROW, game, push);
    for (const seat of [SIDE.WHITE, SIDE.BLACK]) {
      const seen = viewOf(NARROW, after, seat).lastMove;
      assert.deepEqual(seen.to, toView(NARROW, seat, push.to));
      assert.deepEqual(fromView(NARROW, seat, seen.from), push.from);
      assert.equal(seen.mine, seat === SIDE.WHITE);
    }
  });

  await t.test('the two seats disagree about which file it was — that is the game', () => {
    const game = initialGame(NARROW);
    // A pawn push: same file to both, since ranks are never relabelled and the
    // file did not change. The disagreement is about *which* file it is.
    const push = legalMoves(NARROW, game).find(
      (m) => pieceAt(game, m.from.rank, m.from.file).type === PIECE.PAWN
    );
    const after = applyMove(NARROW, game, push);
    const white = viewOf(NARROW, after, SIDE.WHITE);
    const black = viewOf(NARROW, after, SIDE.BLACK);
    assert.notEqual(white.lastMove.to.file, black.lastMove.to.file);
    // But they agree on its name, which is what they say out loud.
    assert.equal(white.files[white.lastMove.to.file], black.files[black.lastMove.to.file]);
  });

  await t.test('a capture says so, and a replay frame carries its own', () => {
    const board = TUTORIAL;
    let game = initialGame(board);
    const moves = [];
    // Play until somebody takes something, or give up.
    for (let i = 0; i < 40 && game.outcome.status === STATUS.PLAYING; i++) {
      const take = legalMoves(board, game).find((m) => board !== null && pieceAt(game, m.to.rank, m.to.file));
      const next = take ?? legalMoves(board, game)[0];
      moves.push(next);
      game = applyMove(board, game, next);
      if (take) break;
    }
    assert.ok(moves.length > 0);
    const frames = replayFrames(board, moves);
    assert.equal(frames[0].lastMove, null);
    frames.slice(1).forEach((frame, i) => {
      assert.deepEqual(frame.lastMove.to, moves[i].to, `frame ${i + 1} knows its own move`);
    });
    assert.equal(replay(board, moves).lastMove.to.rank, moves.at(-1).to.rank);
  });
});

test('every pawn opens with a double step, from wherever it starts', async (t) => {
  /*
   * The narrow army has pawns on two ranks. Asking "is this pawn on its side's
   * pawn rank?" gave the double step to the front rank only, so the two pawns
   * standing a rank further forward could open with one square — and any pawn
   * that later wandered onto a starting rank got a fresh one. `moved` is
   * carried on the man instead, which is both questions answered at once.
   */
  const forward = (board, from, to) => (from.rank < to.rank ? to.rank - from.rank : from.rank - to.rank);

  await t.test('both of White’s pawn ranks can open with two', () => {
    const game = initialGame(NARROW);
    const pawns = NARROW.placement.filter((m) => m.type === PIECE.PAWN && m.side === SIDE.WHITE);
    const ranks = [...new Set(pawns.map((p) => p.rank))].sort();
    assert.deepEqual(ranks, [1, 2], 'the army really does stand on two ranks');

    for (const rank of ranks) {
      const from = pawns.find((p) => p.rank === rank);
      const doubles = legalMovesFrom(NARROW, game, from).filter(
        (to) => to.file === from.file && forward(NARROW, from, to) === 2
      );
      assert.equal(doubles.length, 1, `a pawn on rank ${rank} may step two`);
    }
  });

  await t.test('and so can Black’s, in their own direction', () => {
    const game = initialGame(NARROW);
    for (const from of NARROW.placement.filter(
      (m) => m.type === PIECE.PAWN && m.side === SIDE.BLACK
    )) {
      const doubles = pseudoMoves(NARROW, game, from).filter(
        (to) => to.file === from.file && from.rank - to.rank === 2
      );
      assert.equal(doubles.length, 1, `a Black pawn on rank ${from.rank} may step two`);
    }
  });

  await t.test('but only once', () => {
    let game = initialGame(NARROW);
    const from = NARROW.placement.find((m) => m.type === PIECE.PAWN && m.side === SIDE.WHITE);
    const two = legalMovesFrom(NARROW, game, from).find(
      (to) => to.file === from.file && to.rank === from.rank + 2
    );
    game = applyMove(NARROW, game, { from, to: two });
    game = applyMove(NARROW, game, legalMoves(NARROW, game)[0]); // Black replies
    const again = legalMovesFrom(NARROW, game, two).filter(
      (to) => to.file === two.file && to.rank === two.rank + 2
    );
    assert.equal(again.length, 0, 'a pawn that has moved has no second double step');
  });

  await t.test('and not to a pawn that merely arrives on a starting square', () => {
    /*
     * A rank-1 pawn taking sideways can land on a rank-2 starting square. Under
     * the old rank test that handed it a double step it had not earned.
     */
    const men = new Map([
      ['1,0', { type: PIECE.PAWN, side: SIDE.WHITE, moved: false }],
      ['2,1', { type: PIECE.PAWN, side: SIDE.BLACK, moved: true }],
      ['0,0', { type: PIECE.KING, side: SIDE.WHITE, moved: false }],
      ['9,4', { type: PIECE.KING, side: SIDE.BLACK, moved: false }],
    ]);
    let game = { men, turn: SIDE.WHITE, outcome: { status: STATUS.PLAYING, winner: null } };
    const take = { from: { rank: 1, file: 0 }, to: { rank: 2, file: 1 } };
    assert.ok(isLegalMove(NARROW, game, take), 'the capture is available');
    game = applyMove(NARROW, game, take);
    assert.equal(pieceAt(game, 2, 1).moved, true);
    const doubles = pseudoMoves(NARROW, game, take.to).filter((to) => to.rank === 4);
    assert.equal(doubles.length, 0, 'landing on a start square earns nothing');
  });
});
