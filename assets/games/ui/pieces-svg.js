/**
 * The chess pieces, drawn rather than typed.
 *
 * They were Unicode glyphs (♟♞♝♜♛♚) coloured by CSS, which is compact and
 * wrong. A browser picks a fallback font per *codepoint*, and U+265F — the
 * pawn — is the one piece in the set with an emoji form, so several platforms
 * hand it to a colour emoji font. That font paints its own black pawn and
 * ignores `color`, which is how White's pawns came out black while White's
 * every other piece came out white. U+FE0E, the text-presentation selector,
 * asks the platform not to do this and is not always obeyed; and even where the
 * colour was right, the pawn was drawn in a different face from its neighbours,
 * because nothing says one fallback font must supply all six.
 *
 * Shapes settle it. One silhouette per piece, all drawn to the same 45-unit
 * grid in the same weight, filled with `currentColor` and outlined in the
 * contrasting colour — so the two sides are one set of pieces in two colours,
 * which is what a chess set is, and no font is involved at any point.
 *
 * Deliberately simple, and deliberately mine: the well-known free piece sets
 * carry attribution requirements that do not belong in the middle of a game
 * page. These are geometry — circles, trapezia and one horse — which is enough
 * to be read instantly at 26 pixels, the smallest a square ever gets.
 */

/** Every piece is drawn on this grid and scaled by the square. */
const BOX = 45;

/**
 * Paths are filled with `currentColor` and stroked with the edge colour, both
 * set in CSS from the piece's side. A shape is a list so that a piece can be
 * several strokes of the same brush — a base bar under a body, say — without
 * needing a group per piece.
 */
const SHAPES = Object.freeze({
  /*
   * Shorter and narrower than everything else, deliberately. A pawn and a
   * bishop are both a head over a collar over a base, and at twenty-six pixels
   * the pointed mitre alone was not enough to tell them apart at a glance —
   * so the pawn is also visibly the smallest piece on the board, as it is in
   * every real set.
   */
  pawn: [
    'M22.5 11a4.9 4.9 0 0 1 2.9 8.9c2.5 1.5 4.2 4.4 4.7 8.2H15.4c.5-3.8 2.2-6.7 4.7-8.2A4.9 4.9 0 0 1 22.5 11z',
    'M15 29h15c-.4 3.6-1.7 6.1-3.1 7.9H18.1c-1.4-1.8-2.7-4.3-3.1-7.9z',
    'M12.5 37.5h20a2 2 0 0 1 2 2v1.5h-24V39.5a2 2 0 0 1 2-2z',
  ],
  rook: [
    'M10.5 8.5h5.5v3.5h4.5V8.5h4v3.5h4.5V8.5h5.5v8.5l-3 3v11l3 3.5v3H10.5v-3l3-3.5v-11l-3-3z',
    'M8.5 37.5h28a2 2 0 0 1 2 2v1.5h-32V39.5a2 2 0 0 1 2-2z',
  ],
  bishop: [
    'M22.5 6.5c.9 1.6 2.2 2.7 3.5 4 2.1 2.1 3.6 4.3 3.6 7.2 0 4.2-3.1 7.2-7.1 8.6-4-1.4-7.1-4.4-7.1-8.6 0-2.9 1.5-5.1 3.6-7.2 1.3-1.3 2.6-2.4 3.5-4z',
    'M14.5 28.5h16c-.4 4-1.8 6.6-3.3 8.5H17.8c-1.5-1.9-2.9-4.5-3.3-8.5z',
    'M9.5 37.5h26a2 2 0 0 1 2 2v1.5h-30V39.5a2 2 0 0 1 2-2z',
  ],
  knight: [
    // The one piece that is not a solid of revolution: a head in profile,
    // facing the side the player is attacking towards.
    'M17.5 6.5c1.4 1.9 2 3.4 2.1 5.1 2.9-.6 5.9-.1 8.4 1.7 3.4 2.4 5 6.3 5 11.2 0 4.6-1.4 8.2-2 12H20.6c.4-4.3 2.2-7.2 4.6-9.6 1.2-1.2 1.6-2.3 1.2-3-.5-.8-1.6-.7-2.7.1-2.2 1.6-4.2 3-6.5 3.4-2.6.5-4.6-.6-5.4-2.6-.8-2 .1-4.2 1.9-6.3 1.4-1.6 2.6-2.9 3-4.6l-2.6-1.2 3.4-6.2z',
    'M9.5 37.5h26a2 2 0 0 1 2 2v1.5h-30V39.5a2 2 0 0 1 2-2z',
  ],
  queen: [
    'M9 15.5a2.4 2.4 0 1 1 2.9 2.35L14.5 24l2.6-8.3a2.4 2.4 0 1 1 2.6-.6l2.8 8.4 2.8-8.4a2.4 2.4 0 1 1 2.6.6L30.5 24l2.6-6.15A2.4 2.4 0 1 1 36 15.5c0 1.2-.9 2.2-2 2.4l-2 12.1H13l-2-12.1c-1.1-.2-2-1.2-2-2.4z',
    'M13.5 32.5h18c-.3 2.4-.9 3.9-1.6 5h-14.8c-.7-1.1-1.3-2.6-1.6-5z',
    'M9.5 37.5h26a2 2 0 0 1 2 2v1.5h-30V39.5a2 2 0 0 1 2-2z',
  ],
  king: [
    'M21.2 4.5h2.6v2.6h2.6v2.6h-2.6v3.1h-2.6v-3.1h-2.6V7.1h2.6z',
    'M22.5 13.5c5.5 0 10 3.6 10 8.4 0 3.4-2 6.3-4.4 8.2H16.9c-2.4-1.9-4.4-4.8-4.4-8.2 0-4.8 4.5-8.4 10-8.4z',
    'M14.5 31.5h16c-.3 2.5-1 4.3-1.8 5.5H16.3c-.8-1.2-1.5-3-1.8-5.5z',
    'M9.5 37.5h26a2 2 0 0 1 2 2v1.5h-30V39.5a2 2 0 0 1 2-2z',
  ],
});

const NS = 'http://www.w3.org/2000/svg';

/**
 * One piece, as an `<svg>` ready to drop into a square.
 *
 * Built with `createElementNS` rather than `innerHTML` because SVG in an HTML
 * document needs the namespace to render at all, and because nothing here is
 * ever assembled from a string.
 */
export function pieceSvg(type) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${BOX} ${BOX}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  for (const d of SHAPES[type] ?? []) {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  }
  return svg;
}

export const PIECE_SHAPES = Object.keys(SHAPES);
