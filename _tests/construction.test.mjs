import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Browser modules use .js without a package-wide ESM declaration. Loading this
// self-contained module as ESM also works on the deployment's Node 20 runtime.
const source = readFileSync(new URL('../assets/arguments/construction.js', import.meta.url), 'utf8');
const { EXERCISES, LEGACY_EXERCISES, CONNECTIVES, formulaText, tableData, workedTable, exerciseLink, constructionIndex, renderConstruction } =
  await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const find = (id) => EXERCISES.find((e) => e.id === id);
const finalColumn = (id) => {
  const { rows, main } = tableData(find(id).formula);
  return rows.map((r) => r.values[main] ? 'T' : 'F').join('');
};

test('the fixed sequence begins with exactly the five course connectives', () => {
  assert.equal(EXERCISES.length, 35);
  assert.deepEqual(EXERCISES.slice(0, 5).map((e) => formulaText(e.formula)), ['∼p', 'p & q', 'p ∨ q', 'p ⊃ q', 'p ≡ q']);
  assert.deepEqual(CONNECTIVES.map((c) => finalColumn(`connective-${c.key}`)), ['FT', 'TFFF', 'TTTF', 'TFTT', 'TFFT']);
  assert.deepEqual(EXERCISES.map((e) => e.stage), [...Array(5).fill('connectives'), ...Array(12).fill('pairs'), ...Array(16).fill('further'), ...Array(2).fill('three-letters')]);
});

test('four pages compare all three placements of negation for every binary connective', () => {
  for (const op of ['and', 'or', 'cond', 'bicond']) {
    const trio = EXERCISES.filter((e) => e.group === op);
    assert.equal(trio.length, 3);
    assert.equal(EXERCISES.indexOf(trio[2]) - EXERCISES.indexOf(trio[0]), 2);
    assert.deepEqual(trio.map((e) => [e.formula.op, e.formula.args.findIndex((n) => n.op)]), [[op, 0], ['neg', 0], [op, 1]]);
    for (const e of trio) assert.equal(tableData(e.formula).columns.length, 2);
    const root = { innerHTML: '' };
    renderConstruction(root, exerciseLink(trio[1]));
    assert.equal((root.innerHTML.match(/Show the worked table/g) || []).length, 3);
    for (const e of trio) assert.ok(root.innerHTML.includes(exerciseLink(e)));
    assert.ok(root.innerHTML.includes(`href="${exerciseLink(EXERCISES[EXERCISES.indexOf(trio[2]) + 1])}">Next page`));
    assert.match(root.innerHTML, /How to check the calculations/);
    assert.doesNotMatch(root.innerHTML, /<details[^>]* open/);
  }
});

test('later stages retain the same mixed order across page loads', async () => {
  const secondLoad = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}#second-load`);
  assert.deepEqual(secondLoad.EXERCISES.map((e) => e.id), EXERCISES.map((e) => e.id));
  for (const stage of ['pairs', 'further']) {
    const ids = EXERCISES.filter((e) => e.stage === stage).map((e) => e.id);
    assert.notDeepEqual(ids, [...ids].sort());
  }
});

test('every intermediate value and column position agrees with the course generator', () => {
  const ascii = (s) => s.replace(/[∼∨⊃≡]/g, (c) => ({ '∼': '~', '∨': '|', '⊃': '>', '≡': '=' })[c]);
  const checked = [...EXERCISES, ...LEGACY_EXERCISES];
  const input = checked.map((e) => ascii(formulaText(e.formula)));
  const oracle = JSON.parse(execFileSync('python3', ['-c', `
import json, sys
from formula import parse, atoms_of, evaluate, main_connective_index
from tables import models
out = []
for src in json.load(sys.stdin):
    root, tokens = parse(src)
    atoms = atoms_of(root)
    columns = [t.node for t in tokens if t.kind in ('op', 'neg')]
    out.append(dict(atoms=atoms, tokens=[t.text for t in tokens],
        main=main_connective_index(tokens, root),
        rows=[dict(model=m, values=[evaluate(n, m) for n in columns]) for m in models(atoms)]))
print(json.dumps(out))
`], { cwd: new URL('../EncyclopediaOfArguments/latexgen/', import.meta.url), input: JSON.stringify(input), encoding: 'utf8' }));
  for (const [i, e] of checked.entries()) {
    const actual = tableData(e.formula);
    assert.deepEqual({ atoms: actual.atoms, tokens: actual.tokens.map((t) => ascii(t.text)), main: actual.main, rows: actual.rows }, oracle[i], e.id);
  }
});

test('repeated atoms keep one input column and one truth value per row', () => {
  for (const id of ['same-atom-biconditional', 'same-atom-conditional']) {
    assert.deepEqual(tableData(find(id).formula).atoms, ['p']);
    assert.equal(tableData(find(id).formula).rows.length, 2);
  }
  assert.equal(finalColumn('same-atom-biconditional'), 'TT');
  assert.equal(finalColumn('same-atom-conditional'), 'FT');
  assert.equal(finalColumn('same-atom-conjunction'), 'FF');
  assert.equal(finalColumn('lecture-three-example'), 'FTTF');
});

test('all problems stay within the introductory workload, without duplicate formulas', () => {
  assert.equal(new Set(EXERCISES.map((e) => formulaText(e.formula))).size, EXERCISES.length);
  for (const e of EXERCISES) {
    const table = tableData(e.formula);
    assert.ok(table.atoms.length <= (e.stage === 'three-letters' ? 3 : 2), e.id);
    assert.ok(table.columns.length >= 1 && table.columns.length <= 4, e.id);
    assert.ok(table.main >= 0, e.id);
  }
});

test('one course-style table marks the main occurrence and leaves internal atoms blank', () => {
  for (const e of EXERCISES) {
    const html = workedTable(e.formula);
    const visual = html.slice(0, html.indexOf('</table>'));
    assert.equal((visual.match(/>M<\/td>/g) || []).length, 1, e.id);
    for (const cell of visual.matchAll(/<td class="ae-ct-syntax">(.*?)<\/td>/g)) assert.equal(cell[1], '', e.id);
    assert.equal((html.match(/<table /g) || []).length, 1);
    assert.match(html, /aria-label="Truth table for /);
    assert.match(html, /<th scope="col" aria-label=".*? \(main column, M\)"/);
    assert.doesNotMatch(html, /aria-hidden="true"|Read table by subformula|ae-construction-readable/);
  }
  // The lecture example's answer belongs under the middle conjunction, not
  // the last column. Negations can instead put the answer at the far left.
  assert.equal(tableData(find('lecture-three-example').formula).main, 1);
  assert.equal(tableData(find('negated-compound').formula).main, 0);
});

test('construction shows progress out of 35 and keeps each answer hidden', () => {
  const root = { innerHTML: '' };
  for (const [i, exercise] of EXERCISES.entries()) {
    renderConstruction(root, exerciseLink(exercise));
    assert.match(root.innerHTML, new RegExp(`>Problem ${i + 1} of 35</h3>`));
    assert.doesNotMatch(root.innerHTML, /<details[^>]* open|Read table by subformula/);
    assert.match(root.innerHTML, /Work through each problem on paper, before checking your calculations, and moving on to the next problem/);
  }
});

test('all problem links restore their position and malformed links cannot select an exercise', () => {
  assert.equal(new Set(EXERCISES.map((e) => e.id)).size, EXERCISES.length);
  for (const [i, e] of EXERCISES.entries()) assert.equal(constructionIndex(exerciseLink(e)), i);
  assert.equal(constructionIndex('#constructing-tables'), 0);
  assert.equal(constructionIndex('#arguments'), -1);
  assert.equal(constructionIndex('#constructing-tables/not-a-problem'), -1);
  assert.equal(constructionIndex('#constructing-tables/<script>'), -1);
});

test('exactly two final problems introduce all eight three-letter assignments', () => {
  assert.equal(EXERCISES.filter((e) => tableData(e.formula).atoms.length === 3).length, 2);
  for (const e of EXERCISES.slice(-2)) {
    const data = tableData(e.formula);
    assert.equal(e.stage, 'three-letters');
    assert.deepEqual(data.atoms, ['p', 'q', 'r']);
    assert.deepEqual(data.rows.map(({model}) => Object.values(model).map((v) => v ? 'T' : 'F').join('')), ['TTT', 'TTF', 'TFT', 'TFF', 'FTT', 'FTF', 'FFT', 'FFF']);
  }
});

test('the five replaced formulas remain accessible through their published links', () => {
  const root = { innerHTML: '' };
  assert.equal(LEGACY_EXERCISES.length, 5);
  for (const e of LEGACY_EXERCISES) {
    renderConstruction(root, exerciseLink(e));
    assert.match(root.innerHTML, /Additional practice/);
    assert.match(root.innerHTML, /Show the worked table/);
    assert.doesNotMatch(root.innerHTML, /could not be found|Problem \d+ of/);
  }
});
