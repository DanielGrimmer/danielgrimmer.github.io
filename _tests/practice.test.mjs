import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const moduleFrom = async (file) => import(`data:text/javascript;base64,${Buffer.from(readFileSync(new URL(file, import.meta.url), 'utf8') + `\n//# sourceURL=${file}\n`).toString('base64')}`);
// The renderer registers a delegated click listener at load. These tests
// exercise its HTML output; live clicks and answer resets are checked in-browser.
globalThis.document = { addEventListener() {} };
const { assessmentSymbol, renderCard, renderEntry, problemStatement, difficultyLabel } = await moduleFrom('../assets/arguments/encyclopedia.js');
delete globalThis.document;
const { METHOD_KEYS, practiceLink, parsePracticeLink, resolvePracticeLink, canPractise } = await moduleFrom('../assets/arguments/practice-links.js');
const raw = JSON.parse(readFileSync(new URL('../assets/arguments/argument-db.json', import.meta.url), 'utf8'));
const entries = raw.entries.map((e) => ({ ...e, _premises: e.display.premises, _conclusion: e.display.conclusion, _lookAlikes: e.looks_like }));
const db = { entries, byId: new Map(entries.map((e) => [e.id, e])) };
const plain = (html) => html.replace(/<[^>]+>/g, '');

test('catalogue notation follows the verdict even without display turnstiles', () => {
  for (const e of entries) {
    const symbol = e.verdict.valid ? '⊨' : '⊭';
    assert.equal(assessmentSymbol(e), symbol, e.id);
    const card = plain(renderCard(e, `#/${e.id}`));
    assert.ok(card.includes(symbol), e.id);
    assert.ok(!card.includes(e.verdict.valid ? '⊭' : '⊨'), e.id);
  }
  const converse = db.byId.get('disguised-converse');
  assert.equal(converse.display.turnstiles, undefined);
  const page = renderEntry(converse, db);
  const sequents = [...page.matchAll(/class="ae-(?:seq-note|rel-seq)"[^>]*>(.*?)<\/div>/gs)];
  assert.ok(sequents.length > 1);
  assert.ok(sequents.every((m) => !plain(m[1]).includes('⊨')));
});

test('unknown assessments and unanswered practice use neutral therefore notation', () => {
  for (const valid of [undefined, null, 'false']) {
    for (const method of METHOD_KEYS) {
      assert.equal(assessmentSymbol({ verdict: { valid }, display: { turnstiles: { table: '⊨' } } }, method), '∴');
    }
  }
  assert.equal(assessmentSymbol({ verdict: { valid: false }, display: { turnstiles: { table: '⊨' } } }), '⊭');
  for (const e of entries) {
    const prompt = plain(problemStatement(e));
    assert.match(prompt, /∴/);
    assert.doesNotMatch(prompt, /[⊨⊭⊢⊬]/);
  }
});

test('practice links restore every available argument and method independently of filters', () => {
  for (const e of entries) {
    for (const method of METHOD_KEYS) {
      const hash = practiceLink(e.id, method);
      assert.deepEqual(parsePracticeLink(hash), { id: e.id, method });
      const restored = resolvePracticeLink(hash, db);
      if (canPractise(e, method)) assert.deepEqual(restored, { entry: e, method });
      else assert.equal(restored, null);
      assert.doesNotMatch(hash, /answer|reveal/);
    }
  }
});

test('shared URLs cannot bypass problem-set locks, quarantine, or missing proofs', () => {
  const base = entries.find((e) => canPractise(e, 'nd'));
  for (const method of METHOD_KEYS) {
    for (const e of [
      { ...base, course: { quarantined: true } },
      { ...base, course: { problem_set: { [method]: 'PS1' } } },
    ]) {
      assert.equal(resolvePracticeLink(practiceLink(e.id, method), { byId: new Map([[e.id, e]]) }), null);
    }
  }
  assert.equal(canPractise({ ...base, verdict: { valid: false } }, 'nd'), false);
  assert.equal(canPractise({ ...base, nd: { exists: false } }, 'nd'), false);
  for (const hash of ['#arguments', '#arguments/missing/table', '#arguments/%E0%A4%A/table', '#arguments/a/tree/answer', '#arguments/a/unknown', '#arguments/<script>/table']) {
    assert.equal(resolvePracticeLink(hash, db), null);
  }
});

test('optional difficulty labels preserve the underlying filter values', () => {
  assert.equal(difficultyLabel('extremely hard'), 'extremely hard (optional)');
  assert.equal(difficultyLabel('easy'), 'easy');
  assert.equal(difficultyLabel(null), null);
});
