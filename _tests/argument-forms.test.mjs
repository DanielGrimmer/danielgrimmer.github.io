import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const db = JSON.parse(readFileSync(new URL('../assets/arguments/argument-db.json', import.meta.url)));
const entries = db.entries;
const BANDS = ['easy', 'medium', 'hard', 'extremely hard'];

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
    // An atom is a letter with an optional subscript: `p`, `p_1`, `a_D`.
    const name = /^[A-Za-z][A-Za-z0-9]*(_[A-Za-z0-9]+)?/.exec(source.slice(i));
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
 * Full parenthesisation.
 *
 * Lecture 2 settles this: the language is officially fully parenthesised, and
 * the only licence is to drop the *outermost* pair -- "we'll only ever drop
 * outermost parentheses, never inner ones" -- and not even those when the main
 * connective is a negation. So there is no precedence convention in this
 * course, and `p & q ∨ r` and `p ⊃ q ⊃ p` are not formulas at all.
 *
 * The database used to store display strings with every parenthesis precedence
 * could justify dropped, which is lossy: seven entries re-parsed as different
 * formulas, and a tree that peeled `q & s` off the end of
 * `∼(p & r ∨ p & s ∨ q & r ∨ q & s)` was asking the reader to guess how the
 * disjunction grouped. `latexgen/build.py` now normalises every stored formula,
 * and this is what holds it there.
 */

/** A formula printed the way the course writes it. */
function canon(node, outermost = false) {
  if (node[0] === 'atom') return node[1];
  if (node[0] === 'falsum') return '!';
  if (node[0] === '~') return `~${canon(node[1])}`;
  const inner = `${canon(node[1])} ${node[0]} ${canon(node[2])}`;
  return outermost ? inner : `(${inner})`;
}

const printed = (src, alphabet) => {
  const tree = parse(src, alphabet);
  return canon(tree, tree[0] !== '~');
};

test('every stored formula is fully parenthesised', async (t) => {
  const collapse = (s) => s.replace(/\s+/g, ' ').trim();
  const fromGlyph = { '∼': '~', '∨': '|', '⊃': '>', '≡': '=', '⊥': '!' };
  const toAscii = (s) => [...s].map((c) => fromGlyph[c] ?? c).join('');

  await t.test('the ASCII sources are already canonical', () => {
    for (const e of entries) {
      for (const src of [...e.premises, e.conclusion]) {
        if (src === '!') continue;
        assert.equal(collapse(src), collapse(printed(src, ASCII)), `${e.id}: ${src}`);
      }
    }
  });

  await t.test('display is exactly the source, transliterated', () => {
    for (const e of entries) {
      for (const [ascii, display] of formulasOf(e)) {
        assert.equal(display, toGlyphs(ascii), `${e.id}: display drifted from the source`);
      }
    }
  });

  await t.test('every tree node names a formula, not a chain', () => {
    const walk = (node, out) => {
      for (const a of node.added ?? []) {
        if (a.formula) out.push(a.formula);
        if (a.from) out.push(a.from);
      }
      if (node.branched_on) out.push(node.branched_on);
      for (const k of node.children ?? []) walk(k, out);
      return out;
    };
    for (const e of entries) {
      const shown = [...(e.tree.roots ?? [])];
      if (e.tree.tree) walk(e.tree.tree, shown);
      for (const s of shown) {
        const ascii = toAscii(s);
        if (ascii === '!' || ascii === '~!') continue;
        assert.equal(collapse(ascii), collapse(printed(ascii, ASCII)), `${e.id}: tree node ${s}`);
      }
    }
  });

  await t.test('every derivation line is canonical too', () => {
    for (const e of entries) {
      for (const line of e.nd.proof ?? []) {
        if (line.f === '!') continue;
        assert.equal(collapse(line.f), collapse(printed(line.f, ASCII)), `${e.id} line ${line.n}`);
      }
    }
  });

  await t.test('no group holds two binary connectives', () => {
    // The direct statement of the rule: inside any one pair of parentheses
    // (and at the top level) there is exactly one binary connective, because
    // every application has its own pair. This is what makes associativity
    // unobservable — the Python generator groups & and ∨ to the left and this
    // file's parser groups them to the right, and neither is ever asked to
    // choose.
    const groups = (src) => {
      const counts = [0];
      for (const ch of src) {
        if (ch === '(') counts.push(0);
        else if (ch === ')') counts.pop();
        else if ('&|>='.includes(ch)) counts[counts.length - 1] += 1;
      }
      return counts[0];
    };
    const worst = (src) => {
      // Re-run per group and keep the largest, by scanning each nesting level.
      let max = 0;
      const stack = [0];
      for (const ch of src) {
        if (ch === '(') stack.push(0);
        else if (ch === ')') max = Math.max(max, stack.pop());
        else if ('&|>='.includes(ch)) stack[stack.length - 1] += 1;
      }
      return Math.max(max, ...stack);
    };
    for (const e of entries) {
      for (const src of [...e.premises, e.conclusion]) {
        assert.ok(worst(src) <= 1, `${e.id}: ${src} runs connectives together`);
        assert.ok(groups(src) <= 1, `${e.id}: ${src} runs connectives together at the top level`);
      }
    }
  });

  await t.test("Peirce's Law is the clearest case", () => {
    const peirce = entries.find((e) => e.id === 'peirce-law');
    assert.equal(peirce.conclusion, '((p > q) > p) > p');
    // It used to be stored as `p ⊃ q ⊃ p ⊃ p`, which right-associativity
    // re-reads as `p ⊃ (q ⊃ (p ⊃ p))` — a different, and valid, formula.
    assert.equal(peirce.display.conclusion, '((p ⊃ q) ⊃ p) ⊃ p');
    assert.equal(show(parse(peirce.display.conclusion, GLYPH)), '(((p > q) > p) > p)');
  });
});

/*
 * Complete tables.
 *
 * Long tables used to be elided down to the first row, the countermodels and
 * the last, with a \vdots between. That saves paper and loses the point: a
 * truth table is an exhaustive check, and the sixty-four-row Dutch book form
 * is worth showing precisely because sixty-three rows behave and one does not.
 */
test('every truth table is listed in full', () => {
  for (const e of entries) {
    const block = e.truth_table.latex;
    assert.ok(!block.includes('\\vdots'), `${e.id}: table is elided`);
    // One \\ per row, plus the header. A premise-less entry is a claim that
    // its one formula is a tautology, so its table is the single-formula
    // layout and carries an extra row marking the main connective.
    const chrome = e.premises.length ? 1 : 2;
    const breaks = (block.match(/\\\\/g) ?? []).length;
    assert.equal(breaks, e.verdict.rows + chrome,
      `${e.id}: ${breaks - chrome} rows typeset, ${e.verdict.rows} in the data`);
    assert.equal(e.truth_table.rows.length, e.verdict.rows, `${e.id}: stored rows`);
  }
});

/*
 * Difficulty is authored, so no test can check that a score is *right*. What
 * it can check is that a score which departs from §14's criteria says so:
 * `latexgen/difficulty.py --diff` reports the departures, and an author who
 * means one writes the reason in `course.note`. That is what keeps four
 * hundred entries scored over four hundred hours on one scale.
 */
test('every difficulty is a band, and a departure from the rubric is explained', async (t) => {
  await t.test('the bands are the four the practice chips offer', () => {
    for (const e of entries) {
      for (const m of ['table', 'tree']) {
        assert.ok(BANDS.includes(e.difficulty[m]), `${e.id}/${m}: ${e.difficulty[m]}`);
      }
      // A form with no derivation has no derivation to score.
      assert.equal(e.difficulty.nd === null, !e.nd.exists, `${e.id}: nd score and nd.exists disagree`);
      if (e.nd.exists) {
        assert.ok(BANDS.includes(e.difficulty.nd), `${e.id}/nd`);
      }
    }
  });

  await t.test('the top band stays rare enough to mean something', () => {
    // `extremely hard` is a warning label rather than a fourth slice: it says
    // an item will eat an evening, which stops being information the moment a
    // dozen entries wear it. Calibrated at two or three per method; if a new
    // import pushes a method past four, the threshold has drifted and wants
    // raising rather than the entry excusing.
    for (const m of ['table', 'tree', 'nd']) {
      const worn = entries.filter((e) => e.difficulty[m] === 'extremely hard');
      assert.ok(worn.length >= 1 && worn.length <= 4,
        `${m}: ${worn.length} entries are extremely hard (${worn.map((e) => e.id).join(', ')})`);
    }
  });

  await t.test('search_sharpness is the countermodel share, on invalid forms only', () => {
    for (const e of entries) {
      const sharp = e.difficulty.search_sharpness;
      assert.equal(sharp != null, !e.verdict.valid, `${e.id}: sharpness and verdict disagree`);
      if (sharp != null) {
        const share = e.verdict.countermodel_count / e.verdict.rows;
        assert.ok(Math.abs(sharp - share) < 1e-4, `${e.id}: ${sharp} is not ${share}`);
      }
    }
  });

  await t.test('the measured scores are the measurements (§14.1, §14.2)', () => {
    // Tables and trees are computed and written by build.py, so a departure is
    // a bug rather than a judgement. Recomputed here from the same definitions
    // — connectives per row, and rule applications non-branching-first — so
    // that an edit to one implementation without the other is caught.
    const conn = (src) => (src.trim() === '!' ? 0 : [...src].filter((c) => '~&|>='.includes(c)).length);
    const apps = (entry) => {
      const walk = (node, inherited) => {
        const sources = [];
        for (const a of node.added ?? []) if (!sources.includes(a.from)) sources.push(a.from);
        let n = sources.filter((f) => f !== inherited).length;
        if (node.branched_on) n += 1;
        for (const k of node.children ?? []) n += walk(k, node.branched_on);
        return n;
      };
      return walk(entry.tree.tree, undefined);
    };
    const band = (v, e, m, x) => (v >= x ? 'extremely hard' : v <= e ? 'easy' : v <= m ? 'medium' : 'hard');

    for (const e of entries) {
      const calls = ([...e.premises, e.conclusion].reduce((n, f) => n + conn(f), 0)) * e.verdict.rows;
      assert.equal(e.difficulty.table, band(calls, 48, 160, 256), `${e.id}: ${calls} calls`);
      assert.equal(e.difficulty.tree, band(apps(e), 3, 7, 16), `${e.id}: ${apps(e)} applications`);
    }
  });

  await t.test('an nd score against the rubric is one the entry accounts for', async () => {
    // The derivation score is authored, so this checks the discipline rather
    // than the arithmetic: run `difficulty.py --diff`, and every entry it
    // names must say why in course.note.
    const { execFileSync } = await import('node:child_process');
    const dir = new URL('../EncyclopediaOfArguments/latexgen/', import.meta.url).pathname;
    let out;
    try {
      out = execFileSync('python3', ['difficulty.py', '--diff'], { cwd: dir, encoding: 'utf8' });
    } catch {
      return; // no python here; the audit is a tool, not a gate
    }
    for (const line of out.split('\n')) {
      const hit = /^\*\s+(\S+)\s+(table|tree|nd)\s/.exec(line);
      if (!hit) continue;
      assert.equal(hit[2], 'nd', `${hit[1]}/${hit[2]} is measured, so a departure is a bug`);
      const e = entries.find((x) => x.id === hit[1]);
      assert.ok(e?.course?.note,
        `${hit[1]}: the nd score departs from §14.3 with no reason in course.note`);
    }
  });
});

/*
 * The manifest, and the merge it exists to catch.
 *
 * `argument-db.json` is one large file that two branches edit at once: the
 * import branch appends entries at the end, main rewrites derived values
 * throughout. Git line-merges that, reports success, and can silently drop an
 * entry — which it did on the first import merge, losing two forms that
 * nothing noticed until they were looked for by name. `entries.txt` is one id
 * per line, so appends and edits never touch the same line and a merge cannot
 * lose one. When the two disagree, the JSON is what got damaged.
 */
test('every entry the manifest lists is still in the database', () => {
  const manifest = readFileSync(new URL('../assets/arguments/entries.txt', import.meta.url), 'utf8')
    .split('\n')
    .filter(Boolean);
  const present = entries.map((e) => e.id);
  for (const id of manifest) {
    assert.ok(present.includes(id),
      `${id} is in entries.txt but not in argument-db.json — a merge dropped it`);
  }
  assert.deepEqual(present, manifest, 'the database and the manifest are out of step');
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

  await t.test('a proof exists exactly when the argument is valid, or says why not', () => {
    for (const e of entries) {
      // The one exception is a valid form whose derivation is deliberately not
      // carried, which must say so in the data and explain itself. It exists
      // because the twelve rules can make a short theorem's proof enormous —
      // a fact about the system, not about the entry — and a 260-line
      // derivation is not something to print or draw as practice.
      if (e.verdict.valid && e.nd.proof_omitted) {
        assert.equal(e.nd.exists, false, `${e.id}: proof_omitted but nd.exists`);
        assert.ok(e.nd.note, `${e.id}: proof_omitted with no nd.note saying why`);
        continue;
      }
      assert.equal(e.nd.exists, e.verdict.valid, `${e.id}`);
      // An invalid entry earns its keep by saying where the attempt breaks down.
      if (!e.verdict.valid) assert.ok(e.nd.note, `${e.id} is invalid but has no nd.note`);
    }
  });

  await t.test('every form has been seen in the wild, or admits that it has not', () => {
    for (const e of entries) {
      // The inclusion criterion used to be an appearance, full stop. It is now
      // an appearance *or* an explicit `appearances_pending`, which carries the
      // brainstormed candidates -- forms proposed for the course rather than
      // drawn from a source. The flag is what keeps that an admission instead
      // of an omission: the page prints "provenance pending" where the
      // citations would go, so a reader is told the gap is a gap.
      if (!e.appearances?.length) {
        assert.equal(e.appearances_pending, true,
          `${e.id} has no appearance and is not marked appearances_pending`);
        continue;
      }
      // And the flag is not a decoration on an entry that has provenance.
      assert.ok(!e.appearances_pending,
        `${e.id} has ${e.appearances.length} appearance(s) and should not be marked pending`);
      for (const a of e.appearances) {
        assert.ok(['verbatim', 'paraphrase', 'our reconstruction'].includes(a.fidelity), `${e.id}: ${a.fidelity}`);
        assert.ok(['used', 'discussed', 'diagnosed'].includes(a.type), `${e.id}: ${a.type}`);
        // An appearance that cannot be followed up is not provenance.
        assert.ok(a.who, `${e.id}: an appearance with no one attached to it`);
        assert.ok(a.work, `${e.id}: ${a.who}'s appearance names no work`);
        if (a.url) assert.match(a.url, /^https:\/\//, `${e.id}: ${a.url} is not a link a reader can follow`);
      }
    }
  });

  await t.test('every entry has a name to be known by', () => {
    for (const e of entries) {
      const names = Array.isArray(e.names) ? e.names : [e.names];
      assert.ok(names[0] && names[0].trim(), `${e.id} has no display name`);
    }
  });

  await t.test('an English gloss says whether it is faithful', () => {
    // The one thing a gloss must declare. It is not checked for spoilers: the
    // practice page shows the sequent alone, so the gloss is never read before
    // the answer, and a form whose whole subject is validity should be free to
    // say so.
    for (const e of entries) {
      for (const item of e.english ?? []) {
        if (!item?.gloss) continue;
        assert.equal(typeof item.faithful, 'boolean',
          `${e.id}: the gloss does not say whether it is faithful`);
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
      const carried = e.verdict.valid && !e.nd.proof_omitted;
      assert.equal(!!e.nd.latex, carried, `${e.id}: nd.latex should track validity`);
      assert.equal(!!e.nd.proof, carried, `${e.id}: nd.proof should track validity`);
    }
  });

  await t.test('an omitted proof stays the rare exception it is meant to be', () => {
    // "No proof written" is exactly what a lazy import looks like, so this is
    // capped rather than trusted: if it starts spreading, the reason is being
    // used as an excuse and wants looking at rather than raising.
    const omitted = entries.filter((e) => e.nd.proof_omitted);
    assert.ok(omitted.length <= 2,
      `${omitted.length} entries omit their derivation (${omitted.map((e) => e.id).join(', ')})`);
    for (const e of omitted) {
      assert.ok(e.verdict.valid, `${e.id}: proof_omitted on an invalid entry means nothing`);
      assert.equal(e.difficulty.nd, null, `${e.id}: no derivation carried, so no derivation score`);
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
    // Not every contradiction claim is true -- a jointly satisfiable set
    // reads `X ⊬ND`, and has an `nd.note` in place of a proof (§13.2).
    const falsums = entries.filter((e) => e.conclusion.trim() === '!');
    assert.equal(falsums.length, 12, 'expected twelve contradiction entries');
    for (const e of falsums) {
      assert.ok(!e.truth_table.latex.includes('Conclusion'), `${e.id}: table still has a conclusion group`);
      if (e.verdict.valid) {
        assert.match(e.nd.latex, /\\Falsum/, `${e.id}: the proof should end in ⊥`);
      } else {
        assert.ok(e.nd.note, `${e.id}: a satisfiable set needs an nd.note in place of a proof`);
      }
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
      if (e.course?.problem_set?.[m]) continue;
      pairs.push([e.id, m, e.difficulty[m]]);
    }
  }

  await t.test('every offered pair carries a difficulty', () => {
    for (const [id, m, level] of pairs) {
      assert.ok(BANDS.includes(level), `${id}/${m}: difficulty is ${level}`);
    }
  });

  await t.test('the pair count matches the blocks that exist', () => {
    // Derived, not pinned: the database grows every time the import routine
    // runs, and a hard-coded count would fail on the hour rather than on a
    // fault. A table and a tree for every entry, a derivation for every valid
    // one, less whatever has been set as graded work.
    const valid = entries.filter((e) => e.nd.exists).length;
    const locked = entries.reduce(
      (n, e) => n + Object.keys(e.course?.problem_set ?? {}).length, 0);
    assert.equal(pairs.length, entries.length * 2 + valid - locked);
    assert.equal(pairs.filter(([, m]) => m === 'nd').length,
      valid - entries.filter((e) => e.course?.problem_set?.nd).length);
  });

  await t.test('nothing set as graded work is offered in that method', () => {
    // A form a student met on a problem set is not a fair random draw in the
    // method they were set: they have already been asked to build that tree.
    // The other methods stay open. Exam appearances are deliberately not
    // recorded — the site is unreachable during the exam.
    for (const e of entries) {
      const locked = e.course?.problem_set ?? {};
      for (const m of Object.keys(locked)) {
        assert.ok(['table', 'tree', 'nd'].includes(m), `${e.id}: ${m} is not a method`);
        assert.ok(!pairs.some(([id, mm]) => id === e.id && mm === m),
          `${e.id}/${m} is set at ${locked[m]} and must not be drawn`);
        assert.ok(!/^EX/.test(locked[m]), `${e.id}: ${locked[m]} is exam material, which is free to practise`);
      }
    }
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
  // `table-compact` is the "portion of a truth table" companion: the rows that
  // carry the argument, with the rest elided. It is a handout aid, not a
  // replacement — only the full table is the exhaustive check.
  const blockOf = (e, m) =>
    m === 'table-compact'
      ? e.truth_table.latex_compact
      : m === 'table'
        ? e.truth_table.latex
        : m === 'tree'
          ? e.tree.latex
          : e.nd.latex;

  const blocks = [];
  for (const e of entries) {
    for (const m of ['table', 'table-compact', 'tree', 'nd']) {
      const latex = blockOf(e, m);
      if (latex) blocks.push([e.id, m, latex]);
    }
  }

  await t.test('one block per practice problem, plus a compact table each', () => {
    // A table, a compact table and a tree for every entry, a derivation for
    // every valid one. Derived rather than pinned: the database grows.
    const valid = entries.filter((e) => e.nd.exists).length;
    assert.equal(blocks.length, entries.length * 3 + valid);
    assert.equal(blocks.filter(([, m]) => m === 'table-compact').length, entries.length);
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

/*
 * What may name a proposition.
 *
 * Lecture 2 gives the alphabet and it is short: "lower case letters (e.g. p,
 * q, r, etc.) potentially with subscripts (e.g. p_2, q_3, r_5)". So `bl`,
 * `ls`, `aS` and `bpq` are not names of propositions, however mnemonic. The
 * subscripts are stored inline (`o1`) and typeset as subscripts — `o_{1}` in
 * the LaTeX, `o<sub>1</sub>` on the page.
 *
 * `latexgen/build.py` renames on every build: each atom keeps its initial,
 * which is where the mnemonic value lives, and takes a subscript only when it
 * would otherwise collide with another atom in the same entry.
 */
test('every atom is a name the language allows', async (t) => {
  const legal = /^[a-z](_[A-Za-z0-9]+)?$/;

  await t.test('the atom lists are legal', () => {
    for (const e of entries) {
      for (const a of e.truth_table.atoms) {
        assert.match(a, legal, `${e.id}: ${a} is not a lower-case letter with an optional subscript`);
      }
    }
  });

  await t.test('the formulas use no others', () => {
    for (const e of entries) {
      const known = new Set(e.truth_table.atoms);
      for (const src of [...e.premises, e.conclusion, ...(e.nd.proof ?? []).map((l) => l.f)]) {
        for (const [, name] of src.matchAll(/([A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)?)/g)) {
          assert.ok(known.has(name), `${e.id}: ${name} is not one of its atoms`);
        }
      }
    }
  });

  await t.test('a subscripted atom is typeset as one', () => {
    for (const e of entries) {
      const subscripted = e.truth_table.atoms.filter((a) => a.includes('_'));
      if (!subscripted.length) continue;
      for (const block of [e.truth_table.latex, e.tree.latex, e.nd.latex].filter(Boolean)) {
        // `a_D` must reach the page as `a_{D}`, never as a bare `a_D`.
        assert.ok(!/[a-z]_(?!\{)/.test(block),
          `${e.id}: an atom is printed without braces around its subscript`);
        for (const atom of subscripted) {
          const [head, tail] = atom.split('_');
          assert.ok(block.includes(`${head}_{${tail}}`) || !block.includes(head),
            `${e.id}: ${atom} is not typeset as a subscript`);
        }
      }
    }
  });
});

/*
 * Sibling subproofs.
 *
 * Two subproofs can sit at the same depth with nothing between them — the two
 * halves of a biconditional proof, the two cases of a proof by cases. Drawing
 * the scope lines from depth alone runs them together, so the second
 * assumption looks like it belongs inside the first case, and a citation from
 * the second reaching into the first looks accessible when it is not.
 */
test('sibling subproofs are drawn, and checked, as two', async (t) => {
  const siblings = [];
  for (const e of entries) {
    const proof = e.nd.proof ?? [];
    proof.forEach((line, i) => {
      const before = proof[i - 1];
      if (before && line.rule === 'As' && (before.depth ?? 0) >= (line.depth ?? 0)) {
        siblings.push([e.id, line.n]);
      }
    });
  }

  await t.test('the proofs that have them are the ones that should', () => {
    // Every biconditional introduction and every proof by cases.
    assert.ok(siblings.length >= 7, `only ${siblings.length} sibling subproofs found`);
  });

  await t.test('each one closes before the next opens', () => {
    for (const [id, n] of siblings) {
      const block = entries.find((e) => e.id === id).nd.latex;
      const at = block.indexOf(`\\hypo{${n}}`);
      assert.ok(at > 0, `${id}: line ${n} is not in the derivation`);
      const between = block.slice(0, at).split('\n').slice(-3).join('\n');
      assert.match(between, /\\close/,
        `${id}: line ${n} opens a sibling subproof with no \\close before it`);
    }
  });
});

/*
 * Inconsistency claims.
 *
 * An entry whose conclusion is falsum is not an argument for a sentence; it is
 * the claim that its premises cannot all be true. `⊥` is a formula and `X ⊢ ⊥`
 * is exactly what its derivation establishes, so falsum belongs on the right
 * of a turnstile — but not after `∴`, and not as a truth-table column that
 * would read F all the way down, and not as a negated conclusion at the head
 * of a tree.
 */
test('an inconsistency claim is not dressed as an argument', () => {
  const claims = entries.filter((e) => e.conclusion === '!');
  assert.equal(claims.length, 12);
  for (const e of claims) {
    assert.ok(e.premises.length, `${e.id}: an inconsistency claim needs premises`);
    assert.ok(!e.truth_table.latex.includes('Conclusion'),
      `${e.id}: the table has a conclusion column`);
    assert.ok(!e.tree.latex.includes('\\Falsum'),
      `${e.id}: the tree stacks a negated falsum`);
    assert.ok(!e.tree.latex.includes('\\Neg A'),
      `${e.id}: the tree labels a negated conclusion`);
    // The derivation is the one place falsum is the goal, and it is reached.
    if (e.nd.exists) {
      assert.equal(e.nd.proof.at(-1).f, '!', `${e.id}: the derivation should end at ⊥`);
    }
  }
});

/*
 * Citation style, which the handouts settle.
 *
 * A rule that discharges one subproof cites its first and last line with a
 * comma — `⊃I,2,6`, `∼I,3,6` — because the rule name already says a subproof
 * is being discharged and there is nothing for a range to disambiguate. A rule
 * that discharges two needs the en dash: `∨E,1,2--3,4--5` would otherwise be
 * five numbers with no way to tell which pairs go together.
 */
test('a discharged subproof is cited the way the handouts cite it', async (t) => {
  const single = ['CondI', 'NegI'];
  const double = ['DisjE', 'BicondI'];

  await t.test('citations live in the justification column, not the formula', () => {
    for (const e of entries) {
      if (!e.nd.exists) continue;
      // `nd` is a three-column array and `\by` fills the third, which is why
      // the citations line up without a hand-tuned \quad. Mixing the two
      // spellings in one display roughly triples its width, so there is no
      // half-measure: no \mathmakebox, no \widthof, no inline \quad citation.
      assert.ok(!e.nd.latex.includes('\\mathmakebox'),
        `${e.id}: a citation is still padded into the formula column`);
      assert.ok(!e.nd.latex.includes('\\widthof'), `${e.id}: leftover width machinery`);
      // A derivation with no non-premise line -- `begging-the-question`,
      // where the premise already is the conclusion -- cites nothing, and
      // that is correct rather than an omission: there is no rule applied
      // for a \by to name.
      if (e.nd.proof.some((line) => line.rule !== 'Pr')) {
        assert.match(e.nd.latex, /\\by\{/, `${e.id}: no \\by citations at all`);
      }
    }
  });

  await t.test('premises and assumptions carry no justification', () => {
    for (const e of entries) {
      for (const line of e.nd.proof ?? []) {
        const at = e.nd.latex.indexOf(`{${line.n}}{`);
        if (at < 0) continue;
        const rest = e.nd.latex.slice(at, e.nd.latex.indexOf('\n', at));
        if (line.rule === 'Pr' || line.rule === 'As') {
          assert.ok(!rest.includes('\\by{'), `${e.id} line ${line.n}: a hypo with a citation`);
        }
      }
    }
  });

  await t.test('one subproof, two line numbers, no dash', () => {
    let seen = 0;
    for (const e of entries) {
      for (const line of e.nd.proof ?? []) {
        if ((line.subs ?? []).length !== 1) continue;
        assert.ok(single.includes(line.rule), `${e.id}: ${line.rule} discharges one subproof`);
        const [a, b] = line.subs[0];
        assert.ok(e.nd.latex.includes(`\\by{\\${line.rule}}{${a},${b}}`)
          || e.nd.latex.includes(`,${a},${b}}`),
          `${e.id}: ${line.rule} does not cite ${a},${b} with a comma`);
        seen += 1;
      }
      // `\by` passes refs through `\ndref`, which makes the en dash itself.
      assert.ok(!/\\by\{[^}]*\}\{[^}]*\\text\{--\}/.test(e.nd.latex ?? ''),
        `${e.id}: a \\by reference spells its range with \\text{--}`);
    }
    assert.ok(seen > 0, 'no single-subproof citation found at all');
  });

  await t.test('two subproofs, two ranges, plain hyphens', () => {
    for (const e of entries) {
      for (const line of e.nd.proof ?? []) {
        if ((line.subs ?? []).length !== 2) continue;
        assert.ok(double.includes(line.rule), `${e.id}: ${line.rule} discharges two subproofs`);
        for (const [a, b] of line.subs) {
          assert.ok(e.nd.latex.includes(`${a}-${b}`),
            `${e.id}: ${line.rule} does not cite ${a}-${b} as a range`);
        }
      }
    }
  });
});

/*
 * The vertical bar inside a tree node marks a resolution: the formulas below
 * it came out of the formula above it. The handouts write
 * `$l & d$ ✓ \\ $|$ \\ $l$ \\ $d$`, so there is one bar per resolution, not
 * one per node.
 */
test('every resolution inside a node is marked with a bar', () => {
  for (const e of entries) {
    const block = e.tree.latex;
    let bars = 0;
    const walk = (node, isRoot) => {
      // A bar separates a resolution from what is above it *in the same node*.
      // The root has the stacked premises above it, so its first group takes
      // one; a child node's first group has nothing above it and takes none.
      let source = null;
      let first = true;
      for (const a of node.added ?? []) {
        if (a.from !== source) {
          if (!first || isRoot) bars += 1;
          first = false;
          source = a.from;
        }
      }
      for (const k of node.children ?? []) walk(k, false);
    };
    walk(e.tree.tree, true);
    const groups = bars;
    const drawn = (block.match(/\$\\vert\$/g) ?? []).length;
    assert.equal(drawn, groups, `${e.id}: ${drawn} bars for ${groups} resolutions`);
  }
});

/* A package that is declared and never used is a preamble a handout cannot
 * take as it stands. `\ding` was never called; `\checkmark` is amssymb's. */
test('every declared package is one the blocks use', () => {
  const db2 = JSON.parse(readFileSync(new URL('../assets/arguments/argument-db.json', import.meta.url)));
  assert.ok(!db2.latex_requires.includes('pifont'), 'pifont is declared but nothing uses \\ding');
  const all = entries
    .flatMap((e) => [e.truth_table.latex, e.truth_table.latex_compact, e.tree.latex, e.nd.latex])
    .filter(Boolean)
    .join('\n');
  assert.ok(!all.includes('\\ding'), 'something uses \\ding after all');
});

/*
 * The compact table keeps the rows a reader would point at, and says so with a
 * \vdots wherever it left some out.
 */
test('the compact table keeps the rows that carry the argument', () => {
  for (const e of entries) {
    const compact = e.truth_table.latex_compact;
    assert.ok(compact, `${e.id}: no compact table`);
    const rows = e.truth_table.rows;
    // Data rows only: the single-formula layout ends with a marker row that
    // carries `.` and `M` rather than truth values.
    const kept = compact
      .split('\n')
      .filter((l) => l.includes('\\uv{') || /^\s+[TF] &/.test(l))
      .filter((l) => !l.includes('}{M}') && !l.includes('}{.}')).length;
    assert.ok(kept >= 1, `${e.id}: the compact table kept no rows`);

    if (kept < rows.length) {
      assert.match(compact, /\\vdots/, `${e.id}: rows elided with no vdots to say so`);
    } else {
      // Nothing elided means the two views are the same table, and the site
      // drops the switch rather than offer a button that changes nothing.
      assert.equal(compact, e.truth_table.latex, `${e.id}: kept every row but is not the full table`);
    }

    // What it keeps, by shape.
    const values = (r) => Object.values(r.assignment);
    const ends = rows.filter((r) => values(r).every((v) => v === 'T') || values(r).every((v) => v === 'F')).length;
    const live = rows.filter((r) => r.premises_all_true).length;
    const fails = rows.filter((r) => r.conclusion === 'F').length;
    if (!e.premises.length) {
      // A claimed theorem keeps the ends when the conclusion never fails, and
      // otherwise exactly the rows where it does.
      assert.equal(kept, fails || ends, `${e.id}: a premise-less claim keeps the wrong rows`);
    } else if (!live) {
      assert.equal(kept, ends, `${e.id}: unsatisfiable premises should keep the ends`);
    } else if (e.conclusion.trim() === '!') {
      // A falsum conclusion reads 'F' on every row (§6.6), so "the conclusion
      // is false" is true everywhere and points at nothing. The only rows
      // where a satisfiable set's claim could be wrong are its live ones.
      assert.equal(kept, live, `${e.id}: a satisfiable set should keep only its live rows`);
    } else {
      const wrong = rows.filter((r) => r.premises_all_true || r.conclusion === 'F').length;
      assert.equal(kept, wrong, `${e.id}: ${kept} rows kept, ${wrong} where something could go wrong`);
    }
  }
});

// A course appearance's `quote` has to be the handout's words, not ours. The
// import routine reads the inventory, which is a table of sequents and the
// problem sets they were set in, so it has no handout prose to quote -- and
// twice it filled the field with a sentence of its own describing where the
// form was set, which on the page reads as the source saying that about
// itself. `build.py` refuses to write such a database; this says the same
// thing about the one that is checked in, so a hand edit cannot slip past.
test('a course quote is a passage we hold, not a sentence about the course', () => {
  const corpus = readFileSync(new URL('../EncyclopediaOfArguments/SOURCE_QUOTES.md', import.meta.url), 'utf8');
  const flat = corpus.split(/\s+/).join(' ');
  // Restall and last year's papers count too: the routine works from the
  // inventories, which summarise those sources rather than reproducing them.
  const courseWork =
    /lecture|problem set|\bPS\s*\d|study guide|midterm|handout|restall|old-ps|old-exam|last year/i;

  let checked = 0;
  for (const e of entries) {
    for (const a of e.appearances ?? []) {
      const quote = (a.quote ?? '').trim();
      if (!quote) continue;
      if (a.who !== 'PHIL 1115' && !courseWork.test(a.work ?? '')) continue;
      checked += 1;
      assert.ok(
        flat.includes(quote.split(/\s+/).join(' ')),
        `${e.id}: this is in no handout we hold, so it is ours, not the source's -- ` +
          `put it in interest and drop the quote: "${quote}"`
      );
    }
  }
  assert.ok(checked > 0, 'no course quotes were checked -- the test has stopped looking');
});


// The practice lock, checked from the other end. `inventory.py --status` looks
// forward -- which inventory rows are not entries yet. This looks back: a form
// can reach the database from somewhere else entirely (peirce-law and
// distribution both came in from the SEP) and then nothing ever compares it
// against the inventory row that sets it, so the lock is never written and the
// practice page offers a student the exercise they were graded on. Both of
// those had happened by the time this test was written.
test('no entry offers a method the problem sets already set', () => {
  const inventory = readFileSync(
    new URL('../EncyclopediaOfArguments/Argument Form Inventory (2026-08-28).md', import.meta.url), 'utf8');

  // Section 1 is a positional grid -- Form, Verdict, Table, Tree, ND -- so the
  // column a locus sits in names the method. The later sections put everything
  // in one "where" column and name the method in parentheses. Read both, the
  // way inventory.py's problem_sets() does.
  const rows = [];
  let section = '';
  for (const line of inventory.split('\n')) {
    if (line.startsWith('## ')) section = line.slice(3).trim();
    if (!line.startsWith('|')) continue;
    const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    if (cells.length < 2 || /^[-: ]*$/.test(cells.join(''))) continue;
    if (cells[0] === 'Form' || cells[0] === 'Sequent') continue;
    rows.push({ section, cells });
  }

  const setsOf = (row) => {
    const out = {};
    if (row.section.startsWith('1.') && row.cells.length >= 5) {
      ['table', 'tree', 'nd'].forEach((method, i) => {
        const hit = /\b(PS[\w.]*\d[\w.]*)/.exec(row.cells[2 + i]);
        if (hit) out[method] = hit[1].replace(/[.;)]+$/, '');
      });
      return out;
    }
    for (const chunk of row.cells.slice(2).join(' ').split(/[;,]/)) {
      const locus = /^\s*\*?\*?([A-Za-z0-9.§-]+)/.exec(chunk);
      if (!locus || !/^PS\d/.test(locus[1])) continue;
      const inside = /\(([^)]*)\)/.exec(chunk);
      const text = (inside ? inside[1] : chunk).toLowerCase();
      const found = text.includes('all three') ? ['table', 'tree', 'nd']
        : ['table', 'tree', 'nd'].filter((m) => text.includes(m));
      for (const m of found) if (!(m in out)) out[m] = locus[1];
    }
    return out;
  };

  const TURNSTILES = ['⊢ND', '⊬ND', '⊨', '⊭', '⊢', '⊬', '∴'];
  const split = (text) => {
    const body = text.trim();
    for (const t of TURNSTILES) {
      const at = body.indexOf(t);
      if (at === -1) continue;
      const left = body.slice(0, at).trim();
      const right = body.slice(at + t.length).trim();
      return {
        premises: left ? left.split(',').map((s) => s.trim()).filter(Boolean) : [],
        // A one-sided turnstile -- `X ⊢` -- says the premises are inconsistent,
        // which the database records as a ⊥ conclusion.
        conclusion: right || '⊥',
      };
    }
    // No turnstile at all: sections 4 and 5 list theorems, tautologies and
    // equivalences as bare formulas, which is a claim with no premises. Missing
    // this is how PS3.1's tree of the distribution conditional stayed invisible.
    return body ? { premises: [], conclusion: body } : null;
  };

  // Two sequents have the same shape when they differ only in which atoms they
  // use and in the order of the premises -- which is the comparison the
  // importer makes, and the one that matters here: PS3.1's tree is the same
  // exercise whatever the letters are called.
  const shape = (premises, conclusion, alphabet) => {
    const rename = new Map();
    const relabel = (s) => s.replace(/[A-Za-z](_[A-Za-z0-9]+)?/g, (atom) => {
      if (!rename.has(atom)) rename.set(atom, `a${rename.size}`);
      return rename.get(atom);
    });
    // The conclusion is relabelled first so that two sequents whose premises
    // are listed in different orders still agree: the sorted premises alone
    // would let the numbering drift with the order.
    const c = relabel(printed(conclusion, alphabet));
    return `${premises.map((p) => relabel(printed(p, alphabet))).sort().join(' , ')} :: ${c}`;
  };

  const byShape = new Map();
  for (const e of entries) {
    const k = shape(e.premises, e.conclusion, ASCII);
    if (!byShape.has(k)) byShape.set(k, []);
    byShape.get(k).push(e);
  }

  const gaps = new Set();
  let matched = 0;
  for (const row of rows) {
    const sets = setsOf(row);
    if (!Object.keys(sets).length) continue;
    for (const quoted of row.cells[0].match(/`[^`]+`/g) ?? []) {
      const seq = split(quoted.slice(1, -1));
      if (!seq) continue;
      let k;
      try { k = shape(seq.premises, seq.conclusion, GLYPH); } catch { continue; }
      for (const e of byShape.get(k) ?? []) {
        matched += 1;
        for (const [method, locus] of Object.entries(sets)) {
          if (!(e.course?.problem_set ?? {})[method]) {
            gaps.add(`${e.id}: ${method} is on offer, but ${locus} set it`);
          }
        }
      }
    }
  }

  assert.ok(matched > 0, 'no inventory row matched any entry -- the test has stopped looking');
  assert.deepEqual([...gaps], [], 'the practice page would hand a student graded work');
});

// A citation a reader cannot follow is not provenance, and a fabricated one is
// worse. The comprehensive inventory names SEP articles by title rather than by
// URL, so an importer has to construct the link — and the inventory's own §2.8
// records that the traditional square of opposition lives at `square`, not the
// `square-of-opposition` anyone would guess. This checks the shape of what gets
// written, which is the part a test can check.
test('every source link is one a reader could follow', () => {
  const seen = new Set();
  for (const e of entries) {
    for (const a of e.appearances ?? []) {
      if (!a.url) continue;
      assert.match(a.url, /^https:\/\//, `${e.id}: ${a.url} is not an https link`);
      if (!/plato\.stanford\.edu/.test(a.url)) continue;
      // The SEP's canonical shape. A trailing slash matters: without it the
      // site redirects, and a link that redirects is a link nobody checked.
      assert.match(a.url, /^https:\/\/plato\.stanford\.edu\/entries\/[a-z0-9-]+\/$/,
        `${e.id}: ${a.url} is not a canonical SEP entry URL`);
      seen.add(a.url);
    }
  }
  assert.ok(seen.size > 0, 'no SEP links found — the test has stopped looking');
});

// Superlatives about the database go stale the moment the routine imports
// something bigger, and this has now happened three times — twice in a firing's
// prose, once in a correction written to fix one of those. A claim to be the
// longest derivation is checkable, so it is checked.
test('an entry claiming to be the longest derivation is the longest', () => {
  const withProofs = entries.filter((e) => e.nd?.exists);
  const max = Math.max(...withProofs.map((e) => e.nd.lines));
  for (const e of entries) {
    if (!/longest derivation in the database|the longest in the database/i.test(e.interest ?? '')) continue;
    assert.equal(e.nd?.lines, max,
      `${e.id} claims the longest derivation at ${e.nd?.lines} lines, but the longest is ${max}`);
  }
});
