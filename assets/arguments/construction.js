/* Lecture 3 practice: a fixed sequence of formulas, independent of the
 * encyclopedia's argument forms and their method-specific difficulty scores.
 * Each syntax-tree occurrence owns its column, including repeated formulas.
 */

export const CONNECTIVES = [
  { key: "neg", symbol: "∼", name: "Negation" },
  { key: "and", symbol: "&", name: "Conjunction" },
  { key: "or", symbol: "∨", name: "Disjunction" },
  { key: "cond", symbol: "⊃", name: "Conditional" },
  { key: "bicond", symbol: "≡", name: "Biconditional" },
];

const atom = (name) => ({ atom: name });
const unary = (arg) => ({ op: "neg", args: [arg] });
const binary = (op, left, right) => ({ op, args: [left, right] });
const p = () => atom("p");
const q = () => atom("q");
const r = () => atom("r");
const simple = (op) => op === "neg" ? unary(p()) : binary(op, p(), q());
const symbol = (op) => CONNECTIVES.find((c) => c.key === op).symbol;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[c]);

export const STAGES = [
  { id: "connectives", title: "The five connectives", note: "Start with one connective at a time." },
  { id: "pairs", title: "Negation and scope", note: "Compare three placements of negation. Complete all three tables on paper before opening their worked answers." },
  { id: "further", title: "Repeated atoms and longer formulas", note: "Keep track of repeated letters as you work through these selected formulas." },
  { id: "three-letters", title: "Three letters", note: "Three different letters need eight rows. Begin with all three true: p stays true for four rows, q for two rows at a time, and r alternates on every row." },
];

export const EXERCISES = CONNECTIVES.map((c) => ({
  id: `connective-${c.key}`, stage: "connectives", formula: simple(c.key),
}));

// Each consecutive trio shares a page. Count formulas, not pages, so the
// introductory sequence is still 35 problems, with independent answer reveals.
for (const op of ["cond", "and", "or", "bicond"]) {
  EXERCISES.push(
    { id: `pair-${op}-neg-left`, stage: "pairs", group: op, formula: binary(op, unary(p()), q()) },
    { id: `pair-neg-${op}`, stage: "pairs", group: op, formula: unary(simple(op)) },
    { id: `pair-${op}-neg-right`, stage: "pairs", group: op, formula: binary(op, p(), unary(q())) },
  );
}

// These five formulas left the numbered sequence when the negation trios were
// introduced. Preserve their published URLs and answers as additional practice.
export const LEGACY_EXERCISES = [
  ["pair-cond-or-left", binary("cond", simple("or"), q())],
  ["pair-or-and-right", binary("or", p(), simple("and"))],
  ["pair-bicond-and-left", binary("bicond", simple("and"), q())],
  ["pair-cond-bicond-left", binary("cond", simple("bicond"), q())],
  ["pair-and-cond-left", binary("and", simple("cond"), q())],
].map(([id, formula]) => ({ id, stage: "pairs", formula }));

// Also shuffled once. IDs preserve links when the teaching selection changes.
const selected = [
  ["nested-biconditional", binary("bicond", binary("bicond", p(), q()), p())],
  ["negated-nested-conditional", unary(binary("cond", p(), binary("and", q(), p())))],
  ["same-atom-conjunction", binary("and", p(), unary(p()))],
  ["negated-self-biconditional", unary(binary("bicond", p(), p()))],
  ["same-atom-conditional", binary("cond", p(), unary(p()))],
  ["two-compound-conjuncts", binary("and", binary("or", unary(p()), q()), binary("cond", p(), q()))],
  ["conditional-comparison", binary("bicond", binary("cond", p(), q()), binary("or", unary(p()), q()))],
  ["negated-disjunction-conjunction", unary(binary("and", binary("or", p(), q()), unary(q())))],
  ["biconditional-antecedent", binary("cond", binary("bicond", p(), q()), binary("cond", q(), p()))],
  ["negated-compound", unary(binary("or", binary("and", p(), q()), unary(p())))],
  ["lecture-three-example", binary("and", binary("or", p(), q()), unary(binary("and", p(), q())))],
  ["conditional-and-negation", binary("and", binary("cond", p(), q()), unary(q()))],
  ["negated-conditional-biconditional", unary(binary("bicond", binary("cond", p(), q()), p()))],
  ["reversed-conjunctions", binary("bicond", binary("and", p(), q()), binary("and", q(), p()))],
  ["repeated-disjunct", binary("or", binary("and", p(), unary(q())), p())],
  ["same-atom-biconditional", binary("bicond", p(), p())],
];
EXERCISES.push(...selected.map(([id, formula]) => ({ id, stage: "further", formula })));
EXERCISES.push(
  { id: "three-letter-conditional", stage: "three-letters", formula: binary("cond", binary("and", p(), q()), r()) },
  { id: "three-letter-negation", stage: "three-letters", formula: binary("and", binary("or", p(), q()), unary(r())) },
);

export function formulaText(node, outermost = true) {
  if (node.atom) return node.atom;
  if (node.op === "neg") return `∼${formulaText(node.args[0], false)}`;
  const text = `${formulaText(node.args[0], false)} ${symbol(node.op)} ${formulaText(node.args[1], false)}`;
  return outermost ? text : `(${text})`;
}

export function evaluate(node, model) {
  if (node.atom) return model[node.atom];
  const a = evaluate(node.args[0], model);
  if (node.op === "neg") return !a;
  const b = evaluate(node.args[1], model);
  switch (node.op) {
    case "and": return a && b;
    case "or": return a || b;
    case "cond": return !a || b;
    case "bicond": return a === b;
    default: throw new Error(`Unknown connective: ${node.op}`);
  }
}

export function tableData(formula) {
  const atoms = [];
  const tokens = [];
  function walk(node, outermost = false) {
    if (node.atom) {
      if (!atoms.includes(node.atom)) atoms.push(node.atom);
      tokens.push({ text: node.atom, atom: true });
    } else if (node.op === "neg") {
      tokens.push({ text: "∼", node });
      walk(node.args[0]);
    } else {
      if (!outermost) tokens.push({ text: "(" });
      walk(node.args[0]);
      tokens.push({ text: symbol(node.op), node });
      walk(node.args[1]);
      if (!outermost) tokens.push({ text: ")" });
    }
  }
  walk(formula, true);
  const columns = tokens.filter((t) => t.node).map((t) => t.node);
  const main = columns.indexOf(formula);
  const rows = Array.from({ length: 2 ** atoms.length }, (_, row) => {
    const model = Object.fromEntries(atoms.map((a, i) => [a, !(row & (1 << (atoms.length - i - 1)))]));
    return { model, values: columns.map((node) => evaluate(node, model)) };
  });
  return { atoms, tokens, columns, main, rows };
}

export function workedTable(formula) {
  const { atoms, tokens, rows } = tableData(formula);
  const tf = (v) => v ? "T" : "F";
  const atomCells = (tag, value) => atoms.map((a, i) => `<${tag}${tag === "th" ? ' scope="col"' : ""} class="ae-ct-atom${i === atoms.length - 1 ? " ae-ct-divider" : ""}">${value(a)}</${tag}>`).join("");
  const tokenCells = (tag, value) => tokens.map((t) => {
    const label = tag === "th" && t.node ? ` aria-label="${esc(formulaText(t.node))}${t.node === formula ? " (main column, M)" : ""}"` : "";
    return `<${tag}${tag === "th" ? ' scope="col"' : ""}${label} class="${t.node ? "ae-ct-op" : "ae-ct-syntax"}${t.node === formula ? " ae-ct-main" : ""}">${value(t)}</${tag}>`;
  }).join("");

  // The visual layout follows the handout exactly: blank below every atom
  // inside the formula. Accessible labels describe this same table's columns.
  const visual = `<table class="ae-construction-table" aria-label="Truth table for ${esc(formulaText(formula))}. M marks the main column."><thead><tr>` +
    atomCells("th", (a) => `<i>${a}</i>`) +
    tokenCells("th", (t) => t.atom ? `<i>${t.text}</i>` : esc(t.text)) +
    `</tr></thead><tbody>` + rows.map(({ model }) => `<tr>` +
      atomCells("td", (a) => tf(model[a])) +
      tokenCells("td", (t) => t.node ? tf(evaluate(t.node, model)) : "") + `</tr>`).join("") +
    `</tbody><tfoot><tr>` + atomCells("td", () => ".") +
    tokenCells("td", (t) => t.node ? (t.node === formula ? "M" : ".") : "") +
    `</tr></tfoot></table>`;
  return `<div class="ae-ct-scroll" tabindex="0" role="region" aria-label="Worked truth table">${visual}</div>` +
    `<p>The column marked <strong>M</strong> gives the value of the whole formula in each row. ` +
    `The other connective columns show the intermediate work.</p>`;
}

export const exerciseLink = (exercise) => `#constructing-tables/${exercise.id}`;

export function constructionIndex(hash) {
  if (hash === "#constructing-tables" || hash === "#constructing-tables/") return 0;
  if (!hash.startsWith("#constructing-tables/")) return -1;
  return EXERCISES.findIndex((e) => exerciseLink(e) === hash);
}

export function renderConstruction(root, hash) {
  const index = constructionIndex(hash);
  const exercise = EXERCISES[index] || LEGACY_EXERCISES.find((e) => exerciseLink(e) === hash);
  if (!exercise) {
    root.innerHTML = `<p>This practice problem could not be found. <a href="#constructing-tables">Begin with the five connectives.</a></p>`;
    return;
  }
  const stage = STAGES.find((s) => s.id === exercise.stage);
  const page = exercise.group ? EXERCISES.filter((e) => e.group === exercise.group) : [exercise];
  const first = EXERCISES.indexOf(page[0]);
  const last = EXERCISES.indexOf(page[page.length - 1]);
  const stageLinks = STAGES.map((s, i) => `<a class="ae-chip${s === stage ? " ae-chip-on" : ""}" href="${exerciseLink(EXERCISES.find((e) => e.stage === s.id))}"${s === stage ? ' aria-current="step"' : ""}>${i + 1}. ${s.title}</a>`).join("");
  const nav = (i, label) => EXERCISES[i]
    ? `<a class="ae-btn" href="${exerciseLink(EXERCISES[i])}">${label}</a>`
    : `<button type="button" class="ae-btn" disabled>${label}</button>`;
  root.innerHTML =
    `<h2>Constructing truth tables</h2>` +
    `<p>Work through each problem on paper, before checking your calculations, and moving on to the next problem</p>` +
    `<nav class="ae-chiprow ae-ct-stages" aria-label="Construction stages">${stageLinks}</nav>` +
    `<p>${index < 0 ? "This formula is available as additional practice. You can also return to the numbered sequence above." : stage.note}</p>` +
    (exercise.group ? `<p><strong>${esc(CONNECTIVES.find((c) => c.key === exercise.group).name)}:</strong> ` +
      `first negate the left-hand letter, then the whole formula, then the right-hand letter. Compare the three M columns row by row.</p>` : "") +
    page.map((item) => `<div class="ae-problem"><h3${item === exercise ? ' id="ae-ct-heading" tabindex="-1"' : ""}>${index < 0 ? "Additional practice" : `Problem ${EXERCISES.indexOf(item) + 1} of ${EXERCISES.length}`}</h3>` +
    `<p class="ae-task">Construct the truth table for this formula. Show the intermediate values under each connective and mark the main column with M.</p>` +
    `<p class="ae-ct-formula">${esc(formulaText(item.formula))}</p>` +
    `<details class="ae-reveal"><summary>Show the worked table</summary><div class="ae-reveal-body">${workedTable(item.formula)}</div></details>` +
    `<p><a href="${exerciseLink(item)}">Link to this problem</a></p></div>`).join("") +
    (exercise.group ? `<details class="ae-reveal"><summary>How to check the calculations</summary><div class="ae-reveal-body">` +
      `<p>When only a letter is negated, calculate its negation first, then apply the binary connective. When the whole formula is negated, calculate the binary connective first, then reverse that result.</p>` +
      `<p>For example, take the row where p and q are both true. In the first table, ∼p is F, so the main step is F ${esc(symbol(exercise.group))} T. ` +
      `In the second, first calculate T ${esc(symbol(exercise.group))} T, then negate the result. In the third, ∼q is F, so the main step is T ${esc(symbol(exercise.group))} F. ` +
      `The three main-column values in that row are ${page.map((e) => evaluate(e.formula, { p: true, q: true }) ? "T" : "F").join(", ")}, respectively.</p>` +
      `<p>If a result differs from yours, find the first incorrect intermediate value and work outward. Different placements can sometimes give the same M column; check every row.</p></div></details>` : "") +
    (index >= 0 ? `<nav class="ae-ct-navigation" aria-label="Construction problems">${nav(first - 1, "Previous page")}${nav(last + 1, "Next page")}</nav>` : "") +
    (index === EXERCISES.length - 1 ? `<p>You have reached the end of the sequence. <a href="#constructing-tables">Start again</a>, or try <a href="#arguments">assessing arguments</a> after Lecture 4.</p>` : "");
}
