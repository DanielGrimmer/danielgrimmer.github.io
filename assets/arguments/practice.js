/*
 * The practice drill at /arguments/practice/.
 *
 * Two questions, one button, one problem. Which methods do you want to
 * practise, and at what difficulty — then draw. Everything else is deliberately
 * absent: no search, no facets, no metrics. A student arriving between classes
 * should be able to get a problem in two clicks and read nothing.
 *
 * A problem is a **(form, method) pair**, not a form. The same argument can be
 * an easy truth table and a hard derivation, which is why the database scores
 * difficulty per method (`difficulty.table` / `.tree` / `.nd`), and why the bag
 * is drawn over pairs: you can meet one form twice in a session, once as a
 * table and once as a tree, and they are genuinely different exercises.
 *
 * What is withheld, and why. For a table or a tree the student is asked to
 * *assess* the form, so nothing may say whether it is valid: not the turnstile
 * (⊨ against ⊭), not the verdict, not the tags. For natural deduction the task
 * is to derive the conclusion, so validity is given away by the asking — every
 * ND problem is drawn from the valid entries, because an invalid one has no
 * derivation to find.
 */

import {
  loadDatabase,
  methodPanel,
  problemStatement,
  hydrateSvgs,
  escapeHtml,
  asArray,
} from "./encyclopedia.js";

const STORE = "phil1115.practice.v3";

const METHODS = [
  { key: "table", label: "Truth tables", verb: "truth table" },
  { key: "tree", label: "Truth trees", verb: "truth tree" },
  { key: "nd", label: "Natural deduction", verb: "natural deduction" },
];
const LEVELS = ["easy", "medium", "hard"];

const root = document.getElementById("ae-practice");
if (root) start();

async function start() {
  let db;
  try {
    db = await loadDatabase();
  } catch (err) {
    root.innerHTML =
      `<div class="ae-empty"><p><strong>The argument database did not load.</strong></p>` +
      `<p>${escapeHtml(err.message)}</p></div>`;
    return;
  }

  // Nothing is chosen to begin with, and the button stays dark until both
  // questions have an answer. A default set of chips would be a set of answers
  // the student did not give: it looks like a filter they chose, and the first
  // problem then arrives from a pool they never picked. Better that the page
  // asks, and waits.
  const saved = load();
  const state = {
    methods: new Set(saved.methods ?? []),
    levels: new Set(saved.levels ?? []),
  };
  let bag = saved.bag ?? [];
  let seen = new Set(saved.seen ?? []);
  let current = null;

  root.innerHTML = shell();
  const els = {
    chips: root.querySelector("#ae-choices"),
    draw: root.querySelector("#ae-draw"),
    stage: root.querySelector("#ae-stage"),
    count: root.querySelector("#ae-count"),
  };

  /** Every (form, method) pair the current choices allow. */
  function pool() {
    const out = [];
    for (const e of db.entries) {
      for (const m of METHODS) {
        if (!state.methods.has(m.key)) continue;
        // Natural deduction only ever offers valid forms: an invalid one has
        // no derivation, so there would be nothing to find.
        if (m.key === "nd" && !e.nd?.exists) continue;
        const level = e.difficulty?.[m.key];
        if (!level || !state.levels.has(level)) continue;
        out.push(`${e.id}|${m.key}`);
      }
    }
    return out;
  }

  function persist() {
    try {
      localStorage.setItem(
        STORE,
        JSON.stringify({
          methods: [...state.methods],
          levels: [...state.levels],
          bag,
          seen: [...seen],
        }),
      );
    } catch {
      // Private window, or storage switched off. The drill still works; only
      // the memory of it between visits is lost.
    }
  }

  function refresh() {
    const ready = state.methods.size > 0 && state.levels.size > 0;
    const n = ready ? pool().length : 0;
    // Three messages, because the button is dark for three different reasons
    // and "0 problems" would explain none of them.
    els.count.textContent = !ready
      ? "Choose at least one method and one difficulty."
      : n
        ? `${n} problem${n === 1 ? "" : "s"} match`
        : "No problems match those choices.";
    els.draw.disabled = !ready || n === 0;
    for (const b of els.chips.querySelectorAll("button[data-group]")) {
      const on =
        b.dataset.group === "method"
          ? state.methods.has(b.dataset.value)
          : state.levels.has(b.dataset.value);
      b.setAttribute("aria-pressed", String(on));
      b.classList.toggle("ae-chip-on", on);
    }
  }

  function draw() {
    const available = pool();
    if (!available.length) return;

    const allowed = new Set(available);
    bag = bag.filter((k) => allowed.has(k));
    if (!bag.length) {
      const fresh = available.filter((k) => !seen.has(k));
      if (!fresh.length) seen = new Set();
      bag = shuffle(fresh.length ? fresh : available);
    }

    let key = bag.pop();
    // Re-drawing the problem already on screen reads as a broken button.
    if (key === current && bag.length) {
      const swap = bag.pop();
      bag.push(key);
      key = swap;
    }
    current = key;
    seen.add(key);
    persist();

    const [id, method] = key.split("|");
    const entry = db.byId.get(id);
    const m = METHODS.find((x) => x.key === method);

    // "Assess" for a table or a tree, because the verdict is the question.
    // "Prove" for a derivation, because the verdict is given and the
    // derivation is the question.
    const task =
      method === "nd"
        ? `Use the <strong>natural deduction</strong> method to prove the following argument form:`
        : `Use the <strong>${m.verb}</strong> method to assess the following argument form:`;

    els.stage.innerHTML =
      `<div class="ae-problem">` +
      `<p class="ae-task">${task}</p>` +
      problemStatement(entry) +
      `<details class="ae-reveal"><summary>Show the answer</summary>` +
      `<div class="ae-reveal-body">${methodPanel(entry, method)}</div></details>` +
      `<p class="ae-entry-link">` +
      `<a href="/arguments/browse/#/${encodeURIComponent(id)}">` +
      `Open the encyclopedia entry for this form →</a></p>` +
      `</div>`;
    // Fetch the typeset answer now rather than on reveal: it is behind a
    // <details>, so by the time the student clicks it is already there.
    hydrateSvgs(els.stage);
    els.stage.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  els.chips.addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-group]");
    if (!b) return;
    const set = b.dataset.group === "method" ? state.methods : state.levels;
    const v = b.dataset.value;
    if (set.has(v)) set.delete(v);
    else set.add(v);
    bag = [];
    persist();
    refresh();
  });

  els.draw.addEventListener("click", draw);
  refresh();
}

function shell() {
  const group = (name, items) =>
    items
      .map(
        (i) =>
          `<button type="button" class="ae-chip ae-chip-toggle" ` +
          `data-group="${name}" data-value="${i.key}" aria-pressed="false">` +
          `${escapeHtml(i.label)}</button>`,
      )
      .join("");

  return (
    `<div id="ae-choices" class="ae-choices">` +
    `<div class="ae-choice">` +
    `<h3>Which method would you like to practise?</h3>` +
    `<div class="ae-chiprow">${group("method", METHODS)}</div>` +
    `</div>` +
    `<div class="ae-choice">` +
    `<h3>How hard?</h3>` +
    `<div class="ae-chiprow">${group(
      "level",
      LEVELS.map((l) => ({ key: l, label: l[0].toUpperCase() + l.slice(1) })),
    )}</div>` +
    `</div>` +
    `<div class="ae-drawrow">` +
    `<button type="button" id="ae-draw" class="ae-btn ae-btn-primary">New problem</button>` +
    `<span id="ae-count" class="ae-progress"></span>` +
    `</div></div>` +
    `<div id="ae-stage"></div>`
  );
}

/* Fisher–Yates: every ordering equally likely. */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE)) || {};
  } catch {
    return {};
  }
}
