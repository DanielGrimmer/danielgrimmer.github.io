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

/*
 * The LaTeX blocks. These are generated by EncyclopediaOfArguments/latexgen and
 * folded into the database; the tests here are the cheap invariants that catch
 * a bad regeneration. Whether they *compile* is checked by building them with
 * pdflatex, which needs a TeX toolchain and so is not run here.
 */
test('every entry carries its method blocks', async (t) => {
  await t.test('a table and a tree for all 35', () => {
    for (const e of entries) {
      assert.ok(e.truth_table.latex?.includes('\\begin{tabular}'), `${e.id}: no table block`);
      assert.ok(e.tree.latex?.includes('\\Tree'), `${e.id}: no tree block`);
    }
  });

  await t.test('a proof exactly when the argument is valid', () => {
    for (const e of entries) {
      assert.equal(!!e.nd.latex, e.verdict.valid, `${e.id}: nd.latex should track validity`);
      assert.equal(!!e.nd.proof, e.verdict.valid, `${e.id}: nd.proof should track validity`);
    }
  });

  await t.test('blocks are fragments, not whole documents', () => {
    for (const e of entries) {
      for (const blk of [e.truth_table.latex, e.tree.latex, e.nd.latex].filter(Boolean)) {
        assert.ok(!blk.includes('\\documentclass'), `${e.id}: block carries a preamble`);
        assert.ok(!blk.includes('\\usepackage'), `${e.id}: block loads a package`);
      }
    }
  });

  await t.test('the house macros are used, never the raw glyphs', () => {
    // \supset for \Cond and friends would look right today and diverge the day
    // notation.sty is re-skinned.
    const banned = [/\\supset/, /\\leftrightarrow/, /\\rightarrow(?!s)/, /\\lnot/, /\\neg\b/, /\\wedge/, /\\lor\b/];
    for (const e of entries) {
      for (const blk of [e.truth_table.latex, e.tree.latex, e.nd.latex].filter(Boolean)) {
        for (const re of banned) assert.ok(!re.test(blk), `${e.id}: raw glyph ${re} in a block`);
      }
    }
  });

  await t.test('falsum never appears inside a formula', () => {
    // \Falsum is a proof-level marker: it stands alone on an ND line and never
    // occurs in a truth-table column or a tree node.
    for (const e of entries) {
      assert.ok(!e.truth_table.latex.includes('\\Falsum'), `${e.id}: ⊥ in a truth table`);
      assert.ok(!e.tree.latex.includes('\\Falsum'), `${e.id}: ⊥ in a tree`);
    }
  });

  await t.test('the tree is rooted at the premises and the negated conclusion', () => {
    for (const e of entries) {
      if (e.premises.length) assert.match(e.tree.latex, /X:/, `${e.id}: tree does not label the premises`);
      if (e.conclusion.trim() === '!') {
        // A contradiction claim, X ⊢: rooted at the premises alone. There is no
        // negated conclusion to stack, because ⊥ is not a formula.
        assert.doesNotMatch(e.tree.latex, /\\Neg A:/, `${e.id}: falsum entry should have no ∼A root`);
        assert.match(e.tree.latex, /Start from \$X\$:/, `${e.id}: wrong preamble for a contradiction`);
      } else {
        assert.match(e.tree.latex, /\\Neg A:/, `${e.id}: tree does not label the negated conclusion`);
      }
    }
  });

  await t.test('a falsum conclusion is rendered one-sided, never as a column', () => {
    // ⊥ is a proof-level marker: it belongs on an ND line and nowhere else.
    const falsums = entries.filter((e) => e.conclusion.trim() === '!');
    assert.equal(falsums.length, 3, 'expected three contradiction entries');
    for (const e of falsums) {
      assert.ok(!e.truth_table.latex.includes('Conclusion'), `${e.id}: table still has a conclusion group`);
      assert.match(e.nd.latex, /\\Falsum/, `${e.id}: the proof should end in ⊥`);
    }
  });

  await t.test('the stored nd profile describes the proof actually shown', () => {
    for (const e of entries.filter((x) => x.nd.proof)) {
      const proof = e.nd.proof;
      assert.equal(e.nd.lines, proof.length, `${e.id}: line count`);
      assert.equal(
        e.nd.max_subproof_depth,
        Math.max(...proof.map((l) => l.depth ?? 0)),
        `${e.id}: depth`
      );
      const used = new Set(proof.map((l) => l.rule).filter((r) => r !== 'Pr'));
      assert.deepEqual([...used].sort(), [...e.nd.rules_used].sort(), `${e.id}: rules used`);
      // The premise lines must be the entry's premises, in order.
      const prs = proof.filter((l) => l.rule === 'Pr').map((l) => l.f);
      assert.deepEqual(prs, e.premises, `${e.id}: premise lines`);
      assert.equal(proof.at(-1).f, e.conclusion, `${e.id}: last line is not the conclusion`);
      assert.equal(proof.at(-1).depth ?? 0, 0, `${e.id}: proof ends inside a subproof`);
    }
  });

  await t.test('every proof citation is accessible', () => {
    // The classic invisible Fitch error: citing across a subproof that closed.
    for (const e of entries.filter((x) => x.nd.proof)) {
      const proof = e.nd.proof;
      const depth = new Map(proof.map((l) => [l.n, l.depth ?? 0]));
      const order = proof.map((l) => l.n);
      const pos = new Map(order.map((n, i) => [n, i]));
      const reachable = (m, k) => {
        if (!pos.has(m) || pos.get(m) >= pos.get(k)) return false;
        const span = order.slice(pos.get(m), pos.get(k) + 1);
        return Math.min(...span.map((j) => depth.get(j))) >= depth.get(m);
      };
      for (const l of proof) {
        for (const c of l.cites ?? []) {
          assert.ok(reachable(c, l.n), `${e.id}: line ${l.n} cites inaccessible line ${c}`);
        }
        for (const [a, b] of l.subs ?? []) {
          assert.equal(proof.find((x) => x.n === a)?.rule, 'As', `${e.id}: ${a}-${b} does not open with As`);
          assert.ok(pos.get(b) < pos.get(l.n), `${e.id}: line ${l.n} cites ${a}-${b} before it ends`);
        }
      }
    }
  });

  await t.test('the preamble the blocks need is recorded', () => {
    for (const p of ['FOL_Yale/notation', 'qtree', 'fitch', 'mathtools', 'calc', 'graphicx']) {
      assert.ok(db.latex_requires.includes(p), `latex_requires is missing ${p}`);
    }
    // \treebox belongs to qtree.sty; saving into it makes trees vanish.
    assert.match(db.latex_macros.treebox, /aetreebox/);
  });
});

test('the practice page has a well-formed problem set', async (t) => {
  // A practice problem is a (form, method) pair, not a form: the same argument
  // can be an easy table and a hard derivation.
  const pairs = [];
  for (const e of entries) {
    for (const m of ['table', 'tree', 'nd']) {
      if (m === 'nd' && !e.nd.exists) continue;
      pairs.push([e.id, m, e.difficulty[m]]);
    }
  }

  await t.test('every offered pair carries a difficulty', () => {
    for (const [id, m, level] of pairs) {
      assert.ok(['easy', 'medium', 'hard'].includes(level), `${id}/${m}: difficulty is ${level}`);
    }
  });

  await t.test('the pair count matches the blocks that exist', () => {
    // 35 tables + 35 trees + 18 derivations.
    assert.equal(pairs.length, 88);
    assert.equal(pairs.filter(([, m]) => m === 'nd').length, 18);
  });

  await t.test('natural deduction is offered only on valid forms', () => {
    for (const [id, m] of pairs.filter(([, m]) => m === 'nd')) {
      assert.ok(entries.find((e) => e.id === id).verdict.valid, `${id} is invalid but offered for ND`);
    }
  });

  await t.test('every difficulty level is reachable for every method', () => {
    // If a level had no problems the chip would be a dead end.
    for (const m of ['table', 'tree', 'nd']) {
      for (const level of ['easy', 'medium', 'hard']) {
        const n = pairs.filter(([, mm, l]) => mm === m && l === level).length;
        assert.ok(n > 0, `no ${level} ${m} problems`);
      }
    }
  });
});

/*
 * The typeset blocks.
 *
 * Each entry's LaTeX is compiled to an SVG by
 * `EncyclopediaOfArguments/latexgen/svg.py` and committed under
 * `assets/arguments/svg/`, because GitHub Pages builds with Jekyll alone and
 * has no LaTeX. That makes the SVGs a build artifact living in the repo, and
 * the one failure mode of such a thing is silent staleness: the database gets
 * regenerated, the pictures do not, and the site shows last week's proof.
 * `index.json` records the hash of the block each SVG came from, so the drift
 * is detectable, and this is where it is detected.
 */
test('every LaTeX block has a current SVG', async (t) => {
  const svgDir = new URL('../assets/arguments/svg/', import.meta.url);
  const index = JSON.parse(readFileSync(new URL('index.json', svgDir)));
  const holder = { table: 'truth_table', tree: 'tree', nd: 'nd' };

  const blocks = [];
  for (const e of entries) {
    for (const m of ['table', 'tree', 'nd']) {
      const latex = e[holder[m]]?.latex;
      if (latex) blocks.push([e.id, m, latex]);
    }
  }

  await t.test('there is one block per practice problem', () => {
    assert.equal(blocks.length, 88);
  });

  await t.test('the SVG matches the block it was made from', async () => {
    const { createHash } = await import('node:crypto');
    for (const [id, m, latex] of blocks) {
      const digest = createHash('sha256').update(latex).digest('hex').slice(0, 16);
      assert.equal(index[`${id}|${m}`], digest, `${id}/${m}: SVG is stale — rerun latexgen/svg.py`);
    }
  });

  await t.test('the index has nothing the database no longer has', () => {
    const live = new Set(blocks.map(([id, m]) => `${id}|${m}`));
    for (const key of Object.keys(index)) {
      assert.ok(live.has(key), `${key}: SVG left over from a block that is gone`);
    }
  });

  await t.test('each SVG is inlinable: themed, fluid, and id-safe', () => {
    for (const [id, m] of blocks) {
      const svg = readFileSync(new URL(`${id}-${m}.svg`, svgDir), 'utf8');

      // The page has a dark mode and the SVG is inlined, not <img>-ed, so the
      // ink has to inherit from the surrounding text.
      assert.match(svg, /fill='currentColor'/, `${id}/${m}: no currentColor fill`);
      assert.ok(!/stroke='#0{3,6}'/.test(svg), `${id}/${m}: a stroke is still hard black`);

      // Absolute width and height would pin the block to one size; the
      // generator replaces them with an em width taken from the real one.
      assert.ok(!/<svg[^>]*\sheight='/.test(svg), `${id}/${m}: still carries an absolute height`);
      assert.match(svg, /style='width:[\d.]+em;height:auto'/, `${id}/${m}: no em width`);

      // Several of these go into one page. Unprefixed ids would collide and a
      // tree would be drawn with a truth table's glyphs.
      for (const [, ident] of svg.matchAll(/id='([^']+)'/g)) {
        assert.ok(ident.startsWith(`${id}-${m}-`), `${id}/${m}: unprefixed id ${ident}`);
      }
      for (const [, ref] of svg.matchAll(/xlink:href='#([^']+)'/g)) {
        assert.ok(ref.startsWith(`${id}-${m}-`), `${id}/${m}: unprefixed reference ${ref}`);
      }
    }
  });
});

/*
 * The headline answer that opens every revealed panel. Three claim shapes: a
 * form with no premises asserts a theorem, a form concluding falsum asserts
 * that its premises are inconsistent, and everything else is an argument.
 */
test('every entry has an answer the reveal can lead with', () => {
  for (const e of entries) {
    const shape = !e.premises.length ? 'theorem' : e.conclusion === '!' ? 'inconsistency' : 'argument';
    assert.equal(typeof e.verdict.valid, 'boolean', `${e.id}: no verdict`);
    if (shape === 'theorem') {
      // A theorem claim's answer is "the conclusion is a tautology" — so the
      // table had better agree.
      const allTrue = e.truth_table.rows.every((r) => r.conclusion === 'T');
      assert.equal(allTrue, e.verdict.valid, `${e.id}: tautology claim disagrees with its table`);
    }
    if (shape === 'inconsistency') {
      // A falsum conclusion is only valid if nothing satisfies the premises.
      assert.equal(e.verdict.premises_satisfiable, !e.verdict.valid,
        `${e.id}: inconsistency claim disagrees with its premise rows`);
    }
  }
});
