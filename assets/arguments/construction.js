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
  { id: "pairs", title: "Negation and scope", note: "Compare three placements of negation in one table." },
  { id: "further", title: "Repeated atoms and longer formulas", note: "Keep track of repeated letters as you work through these selected formulas." },
  { id: "three-letters", title: "Three letters", note: "Three different letters need eight rows. Begin with all three true: p stays true for four rows, q for two rows at a time, and r alternates on every row." },
];

export const EXERCISES = CONNECTIVES.map((c) => ({
  id: `connective-${c.key}`, stage: "connectives", formula: simple(c.key),
}));

// Preserve the formula IDs, including links published before each trio became
// one problem. PROBLEMS below groups this inventory into the numbered sequence.
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

export const PROBLEMS = [];
for (const exercise of EXERCISES) {
  const previous = PROBLEMS[PROBLEMS.length - 1];
  if (exercise.group && previous?.group === exercise.group) {
    previous.exercises.push(exercise);
  } else {
    PROBLEMS.push({ id: exercise.id, stage: exercise.stage, group: exercise.group, exercises: [exercise] });
  }
}

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

const assignments = (atoms) => Array.from({ length: 2 ** atoms.length }, (_, row) =>
  Object.fromEntries(atoms.map((a, i) => [a, !(row & (1 << (atoms.length - i - 1)))])));

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
  const rows = assignments(atoms).map((model) => ({ model, values: columns.map((node) => evaluate(node, model)) }));
  return { atoms, tokens, columns, main, rows };
}

export function workedTable(formula) {
  const formulas = Array.isArray(formula) ? formula : [formula];
  const tables = formulas.map(tableData);
  const atoms = [...new Set(tables.flatMap((t) => t.atoms))];
  const tokens = tables.flatMap((table, i) => table.tokens.map((t, j) => ({
    ...t, main: t.node === formulas[i],
    divider: i < tables.length - 1 && j === table.tokens.length - 1,
  })));
  const tf = (v) => v ? "T" : "F";
  const atomCells = (tag, value) => atoms.map((a, i) => `<${tag}${tag === "th" ? ' scope="col"' : ""} class="ae-ct-atom${i === atoms.length - 1 ? " ae-ct-divider" : ""}">${value(a)}</${tag}>`).join("");
  const tokenCells = (tag, value) => tokens.map((t) => {
    const label = tag === "th" && t.node ? ` aria-label="${esc(formulaText(t.node))}${t.main ? " (main column, M)" : ""}"` : "";
    return `<${tag}${tag === "th" ? ' scope="col"' : ""}${label} class="${t.node ? "ae-ct-op" : "ae-ct-syntax"}${t.main ? " ae-ct-main" : ""}${t.divider ? " ae-ct-divider" : ""}">${value(t)}</${tag}>`;
  }).join("");

  // The visual layout follows the handout exactly: blank below every atom
  // inside the formula. Accessible labels describe this same table's columns.
  const visual = `<table class="ae-construction-table" aria-label="Truth table for ${esc(formulas.map((f) => formulaText(f)).join("; "))}. M marks ${formulas.length > 1 ? "each formula's main column" : "the main column"}."><thead><tr>` +
    atomCells("th", (a) => `<i>${a}</i>`) +
    tokenCells("th", (t) => t.atom ? `<i>${t.text}</i>` : esc(t.text)) +
    `</tr></thead><tbody>` + assignments(atoms).map((model) => `<tr>` +
      atomCells("td", (a) => tf(model[a])) +
      tokenCells("td", (t) => t.node ? tf(evaluate(t.node, model)) : "") + `</tr>`).join("") +
    `</tbody><tfoot><tr>` + atomCells("td", () => ".") +
    tokenCells("td", (t) => t.node ? (t.main ? "M" : ".") : "") +
    `</tr></tfoot></table>`;
  return `<div class="ae-ct-scroll" tabindex="0" role="region" aria-label="Worked truth table">${visual}</div>` +
    (formulas.length > 1
      ? `<p>Note: When a negation appears right in front of a letter, the first step is to calculate its negation, then compute the binary connective. By contrast, when the whole formula is negated you first calculate the binary connective and then negate that result.</p>`
      : `<p>The column marked <strong>M</strong> gives the value of the whole formula in each row. ` +
        `The other connective columns show the intermediate work.</p>`);
}

export const exerciseLink = (exercise) => `#constructing-tables/${exercise.id}`;

export function constructionIndex(hash) {
  if (hash === "#constructing-tables" || hash === "#constructing-tables/") return 0;
  if (!hash.startsWith("#constructing-tables/")) return -1;
  return PROBLEMS.findIndex((p) => p.exercises.some((e) => exerciseLink(e) === hash));
}

export function renderConstruction(root, hash) {
  const index = constructionIndex(hash);
  const legacy = LEGACY_EXERCISES.find((e) => exerciseLink(e) === hash);
  const problem = PROBLEMS[index] || (legacy && { ...legacy, exercises: [legacy] });
  if (!problem) {
    root.innerHTML = `<p>This practice problem could not be found. <a href="#constructing-tables">Begin with the five connectives.</a></p>`;
    return;
  }
  const stage = STAGES.find((s) => s.id === problem.stage);
  const formulas = problem.exercises.map((e) => e.formula);
  const grouped = formulas.length > 1;
  const stageLinks = STAGES.map((s, i) => `<a class="ae-chip${s === stage ? " ae-chip-on" : ""}" href="${exerciseLink(PROBLEMS.find((p) => p.stage === s.id))}"${s === stage ? ' aria-current="step"' : ""}>${i + 1}. ${s.title}</a>`).join("");
  const nav = (i, label) => PROBLEMS[i]
    ? `<a class="ae-btn" href="${exerciseLink(PROBLEMS[i])}">${label}</a>`
    : `<button type="button" class="ae-btn" disabled>${label}</button>`;
  root.innerHTML =
    `<h2>Constructing truth tables</h2>` +
    `<p>Work through each problem on paper, before checking your calculations, and moving on to the next problem</p>` +
    `<nav class="ae-chiprow ae-ct-stages" aria-label="Construction stages">${stageLinks}</nav>` +
    `<p>${index < 0 ? "This formula is available as additional practice. You can also return to the numbered sequence above." : stage.note}</p>` +
    `<div class="ae-problem"><h3 id="ae-ct-heading" tabindex="-1">${index < 0 ? "Additional practice" : `Problem ${index + 1} of ${PROBLEMS.length}`}</h3>` +
    `<p class="ae-task">${grouped ? "Construct the truth table for these three formulas side-by-side. Show the intermediate values under each connective and mark each main column with M." : "Construct the truth table for this formula. Show the intermediate values under each connective and mark the main column with M."}</p>` +
    `<div class="ae-ct-formula${grouped ? " ae-ct-formulas" : ""}"${grouped ? ' tabindex="0" role="region" aria-label="Formulas to compare"' : ""}>${formulas.map((f, i) => `<span>${esc(formulaText(f))}${i < formulas.length - 1 ? "," : ""}</span>`).join("")}</div>` +
    `<details class="ae-reveal"><summary>Show the worked table</summary><div class="ae-reveal-body">${workedTable(formulas)}</div></details>` +
    `<p><a href="${exerciseLink(problem)}">Link to this problem</a></p></div>` +
    (index >= 0 ? `<nav class="ae-ct-navigation" aria-label="Construction problems">${nav(index - 1, "Previous problem")}${nav(index + 1, "Next problem")}</nav>` : "") +
    (index === PROBLEMS.length - 1 ? `<p>You have reached the end of the sequence. <a href="#constructing-tables">Start again</a>, or try <a href="#arguments">assessing arguments</a> after Lecture 4.</p>` : "");
}
