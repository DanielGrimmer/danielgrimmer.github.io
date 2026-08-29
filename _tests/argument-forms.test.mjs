import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const db = JSON.parse(readFileSync(new URL('../assets/arguments/argument-db.json', import.meta.url)));
const entries = db.entries;

/*
 * One parser, two alphabets, and the precedence the database itself declares in
 * `notation.precedence`: biconditional loosest, then the conditional
 * (right-associative), disjunction, conjunction, negation tightest.
 *
 * The point of parsing both spellings of a formula is that a formula shown to a
 * student has to *mean* what its source means. Character-level equality is not
 * the test; structural equality is.
 */
const ASCII = { NEG: '~', AND: '&', OR: '|', IMP: '>', IFF: '=', BOT: '!' };
const GLYPH = { NEG: '∼', AND: '&', OR: '∨', IMP: '⊃', IFF: '≡', BOT: '⊥' };

function parse(source, alphabet) {
  const { NEG, AND, OR, IMP, IFF, BOT } = alphabet;
  const tokens = [];
  for (let i = 0; i < source.length; ) {
    const ch = source[i];
    if (/\s/.test(ch)) { i += 1; continue; }
    if ([NEG, AND, OR, IMP, IFF, BOT, '(', ')'].includes(ch)) { tokens.push(ch); i += 1; continue; }
    const name = /^[A-Za-z][A-Za-z0-9]*/.exec(source.slice(i));
    if (!name) throw new Error(`unexpected ${ch} in ${source}`);
    tokens.push(name[0]);
    i += name[0].length;
  }

  let pos = 0;
  const peek = () => tokens[pos];
  const eat = () => tokens[pos++];

  const unit = () => {
    if (peek() === '(') { eat(); const v = iff(); if (eat() !== ')') throw new Error(`unbalanced ${source}`); return v; }
    if (peek() === NEG) { eat(); return ['~', unit()]; }
    if (peek() === BOT) { eat(); return ['falsum']; }
    return ['atom', eat()];
  };
  const and = () => { let v = unit(); while (peek() === AND) { eat(); v = ['&', v, and()]; } return v; };
  const or = () => { let v = and(); while (peek() === OR) { eat(); v = ['|', v, or()]; } return v; };
  const imp = () => { const v = or(); if (peek() === IMP) { eat(); return ['>', v, imp()]; } return v; };
  const iff = () => { const v = imp(); if (peek() === IFF) { eat(); return ['=', v, iff()]; } return v; };

  const tree = iff();
  if (pos !== tokens.length) throw new Error(`trailing input in ${source}`);
  return tree;
}

const show = (n) =>
  n[0] === 'atom' ? n[1] : n[0] === 'falsum' ? '!' : n[0] === '~' ? `~${show(n[1])}` : `(${show(n[1])} ${n[0]} ${show(n[2])})`;

/** The conversion the site performs: ASCII source through `notation.ascii`. */
const glyphs = { '~': '∼', '&': '&', '|': '∨', '>': '⊃', '=': '≡', '!': '⊥', ...(db.notation?.ascii ?? {}) };
const toGlyphs = (s) => [...String(s)].map((c) => glyphs[c] ?? c).join('');

const formulasOf = (e) => [...e.premises.map((p, i) => [p, e.display.premises[i]]), [e.conclusion, e.display.conclusion]];

test('the notation block is the one the renderer assumes', async (t) => {
  await t.test('every ASCII connective maps to its house glyph', () => {
    assert.deepEqual(db.notation.ascii, { '~': '∼', '&': '&', '|': '∨', '>': '⊃', '=': '≡', '!': '⊥' });
  });

  await t.test('the conditional is right-associative, which is what makes parenthesising matter', () => {
    assert.match(db.notation.precedence, /conditional \(right-associative\)/);
  });
});

test('what the site renders means what the source means', async (t) => {
  await t.test('converting the ASCII preserves the structure of every formula', () => {
    for (const e of entries) {
      for (const [ascii] of formulasOf(e)) {
        assert.deepEqual(
          parse(toGlyphs(ascii), GLYPH),
          parse(ascii, ASCII),
          `${e.id}: ${ascii} changed meaning when converted to house glyphs`
        );
      }
    }
  });

  await t.test('every formula survives a round trip, so none is silently unparseable', () => {
    let checked = 0;
    for (const e of entries) {
      for (const [ascii] of formulasOf(e)) {
        assert.ok(parse(ascii, ASCII), `${e.id}: could not parse ${ascii}`);
        checked += 1;
      }
    }
    assert.ok(checked >= 100, `expected to have checked the whole database, got ${checked}`);
  });
});

/*
 * The reason the renderer does not simply print `display`. These assertions
 * describe a bug in the upstream generator, so they are written to fail loudly
 * when it is FIXED as well as if it gets worse — a green suite here is the
 * signal that `assets/arguments/encyclopedia.js` can drop `attachFormulas()`
 * and read `display` directly again.
 */
const BROKEN = [
  'peirce-law',
  'contraction-w',
  'curry-complete',
  'abelian-axiom',
  'fixed-point-type',
  'curry-contraction-only',
  'assertion-t',
];

test('the display fields drop parentheses the precedence needs', async (t) => {
  const mismatched = [];
  for (const e of entries) {
    for (const [ascii, display] of formulasOf(e)) {
      if (show(parse(ascii, ASCII)) !== show(parse(display, GLYPH))) mismatched.push(e.id);
    }
  }

  await t.test('exactly the known substructural entries are affected', () => {
    assert.deepEqual(
      [...new Set(mismatched)].sort(),
      [...BROKEN].sort(),
      'the set of entries whose display strings re-parse wrongly has changed — if build.py now ' +
        'emits full parentheses, delete attachFormulas()/fixFormula() and read display directly'
    );
  });

  await t.test("Peirce's Law is the clearest case", () => {
    const peirce = entries.find((e) => e.id === 'peirce-law');
    assert.equal(peirce.conclusion, '((p > q) > p) > p');
    assert.equal(peirce.display.conclusion, 'p ⊃ q ⊃ p ⊃ p');
    // Right-associativity re-reads the display string as a different formula.
    assert.equal(show(parse(peirce.display.conclusion, GLYPH)), '(p > (q > (p > p)))');
    // What the site actually shows keeps the source's own nesting.
    assert.equal(show(parse(toGlyphs(peirce.conclusion), GLYPH)), '(((p > q) > p) > p)');
  });

  await t.test('the corrected rendering carries visible parentheses', () => {
    for (const id of BROKEN) {
      const e = entries.find((x) => x.id === id);
      const rendered = [...e.premises, e.conclusion].map(toGlyphs).join('  ');
      assert.match(rendered, /\(/, `${id} should render with parentheses`);
    }
  });
});

test('the database holds together', async (t) => {
  await t.test('ids are unique, since they are the routes', () => {
    const ids = entries.map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  await t.test('relations resolve, in both directions', () => {
    const ids = new Set(entries.map((e) => e.id));
    // `looks_like` is a bare string in every entry that has one, never an array.
    // The renderer normalises with asArray(); iterating it directly walks the
    // characters of the id instead, which is how this was first written.
    const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
    for (const e of entries) {
      for (const other of asArray(e.repairs_to)) assert.ok(ids.has(other), `${e.id} repairs_to a missing ${other}`);
      for (const other of asArray(e.looks_like)) assert.ok(ids.has(other), `${e.id} looks_like a missing ${other}`);
    }
  });

  await t.test('a proof exists exactly when the argument is valid', () => {
    for (const e of entries) {
      assert.equal(e.nd.exists, e.verdict.valid, `${e.id}`);
      // An invalid entry earns its keep by saying where the attempt breaks down.
      if (!e.verdict.valid) assert.ok(e.nd.note, `${e.id} is invalid but has no nd.note`);
    }
  });

  await t.test('every form has been seen in the wild, which is the inclusion criterion', () => {
    for (const e of entries) {
      assert.ok(e.appearances?.length, `${e.id} has no appearance and does not belong in the encyclopedia`);
      for (const a of e.appearances) {
        assert.ok(['verbatim', 'paraphrase', 'our reconstruction'].includes(a.fidelity), `${e.id}: ${a.fidelity}`);
        assert.ok(['used', 'discussed', 'diagnosed'].includes(a.type), `${e.id}: ${a.type}`);
      }
    }
  });

  await t.test('the truth table columns are the premises then the conclusion', () => {
    // The renderer relies on this to rebuild the headers positionally.
    for (const e of entries) {
      assert.equal(
        e.truth_table.columns.length,
        e.premises.length + 1,
        `${e.id}: header count does not match premises + conclusion`
      );
    }
  });

  await t.test('nothing is quarantined yet, and the renderer drops it when something is', () => {
    for (const e of entries) assert.notEqual(e.course?.quarantined, true, `${e.id} is quarantined and must be filtered`);
  });
});
