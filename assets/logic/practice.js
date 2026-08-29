/*
 * The practice drill at /arguments/practice/.
 *
 * One argument at a time, drawn at random, with the answer hidden. What is
 * visible on a draw is the sequent, the English gloss and the provenance;
 * the verdict, the commentary, the table, the tree and the ND analysis are all
 * behind reveals. `interest` counts as an answer, not as context — it tends to
 * open with a phrase like "the argument is valid vacuously", which settles the
 * question before the reader has looked at it.
 *
 * The draw is a shuffled bag, not a coin flip. With 35 entries, sampling with
 * replacement repeats inside the first handful of clicks and students notice;
 * drawing without replacement guarantees every form in the filtered set comes
 * up once before any comes up twice. The bag survives a reload via
 * localStorage, so closing the tab does not restart the cycle.
 */

import {
  loadDatabase,
  filterEntries,
  renderEntry,
  escapeHtml,
  asArray,
} from "./encyclopedia.js";

const STORE_KEY = "phil1115.practice.v1";

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

  root.innerHTML = shell(db);

  const els = {
    controls: root.querySelector("#ae-p-controls"),
    stage: root.querySelector("#ae-stage"),
    draw: root.querySelector("#ae-draw"),
    progress: root.querySelector("#ae-progress"),
  };

  // `method` is what the student is practising. It makes `difficulty` and
  // `lecture` method-relative and reorders the reveals so the panel they want
  // is the first one — an entry can be an easy Lecture 4 table and a hard
  // Lecture 11 natural deduction at once.
  const state = {
    method: "table",
    difficulty: "",
    maxAtoms: "",
    lecture: "",
    ...loadState().filters,
  };

  let bag = loadState().bag || [];
  let seen = new Set(loadState().seen || []);
  let current = null;

  const pool = () =>
    filterEntries(db.entries, {
      method: state.method,
      difficulty: state.difficulty,
      maxAtoms: state.maxAtoms,
      lecture: state.lecture,
      requireNd: state.method === "nd",
    });

  function persist() {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({ filters: state, bag, seen: [...seen] }),
      );
    } catch {
      // A student in a private window, or with storage disabled. The drill
      // still works for the session; only the memory of it is lost.
    }
  }

  function refill(available) {
    // Refill with whatever is in the filtered set but not yet seen this cycle.
    // Changing a filter mid-cycle therefore keeps the student's progress
    // instead of silently restarting it.
    const ids = available.map((e) => e.id);
    const fresh = ids.filter((id) => !seen.has(id));
    if (fresh.length) return shuffle(fresh);
    seen = new Set();
    return shuffle(ids);
  }

  function draw() {
    const available = pool();

    if (!available.length) {
      current = null;
      els.stage.innerHTML =
        `<div class="ae-empty"><p><strong>No form matches those filters.</strong></p>` +
        `<p>Natural deduction is only offered on forms that have a proof, so ` +
        `pairing it with a tight lecture limit can empty the set.</p></div>`;
      updateProgress(available);
      return;
    }

    const ids = new Set(available.map((e) => e.id));
    bag = bag.filter((id) => ids.has(id));
    if (!bag.length) bag = refill(available);

    // Avoid handing back the argument already on screen when more than one is
    // available — a "random" button that redraws the same problem reads as
    // broken even when it is behaving correctly.
    let id = bag.pop();
    if (id === current?.id && bag.length) {
      const swap = bag.pop();
      bag.push(id);
      id = swap;
    }

    seen.add(id);
    current = db.byId.get(id);
    persist();

    els.stage.innerHTML = renderEntry(current, db, {
      spoilers: true,
      method: state.method,
    });
    els.stage.insertAdjacentHTML(
      "beforeend",
      `<p style="margin-top:1.5rem;font-size:.85rem">` +
        `<a href="/arguments/#/${encodeURIComponent(id)}">Open the full encyclopedia entry ` +
        `for this form →</a> <span style="color:var(--ae-muted)">(shows the answer, ` +
        `the commentary and the related forms)</span></p>`,
    );
    updateProgress(available);
    els.stage.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function updateProgress(available) {
    const total = available.length;
    const done = available.filter((e) => seen.has(e.id)).length;
    els.progress.textContent = total
      ? `${done} of ${total} in this set seen — no repeats until you have seen them all`
      : "";
  }

  els.draw.addEventListener("click", draw);

  els.controls.addEventListener("change", (ev) => {
    const sel = ev.target.closest("select[data-ae-key]");
    if (!sel) return;
    state[sel.dataset.aeKey] = sel.value;
    bag = []; // the filtered set changed; rebuild on the next draw
    persist();
    updateProgress(pool());
  });

  root.querySelector("#ae-reset").addEventListener("click", () => {
    seen = new Set();
    bag = [];
    persist();
    updateProgress(pool());
  });

  // Restore the controls, then open with a problem already on screen — landing
  // on an empty page with one button is a worse invitation than landing on a
  // problem.
  for (const sel of els.controls.querySelectorAll("select[data-ae-key]")) {
    sel.value = state[sel.dataset.aeKey] || "";
  }
  draw();
}

/* Fisher–Yates, so every ordering is equally likely. */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}

/* ------------------------------------------------------------- markup */

function shell(db) {
  return (
    `<div id="ae-p-controls" class="ae-controls">` +
    `<div class="ae-selects">` +
    select("method", "practising", [
      ["table", "truth table"],
      ["tree", "truth tree"],
      ["nd", "natural deduction"],
    ]) +
    select("difficulty", "difficulty", [
      ["", "any"],
      ["easy", "easy"],
      ["medium", "medium"],
      ["hard", "hard"],
    ]) +
    select("maxAtoms", "at most … atoms", [
      ["", "any"],
      ...Array.from({ length: db.maxAtoms }, (_, i) => [
        String(i + 1),
        `${i + 1} atom${i ? "s" : ""}`,
      ]),
    ]) +
    select("lecture", "only what we have covered", [
      ["", "any lecture"],
      ...Array.from({ length: db.maxLecture }, (_, i) => [
        String(i + 1),
        `through Lecture ${i + 1}`,
      ]),
    ]) +
    `</div>` +
    `<div class="ae-practice-bar">` +
    `<button type="button" id="ae-draw" class="ae-btn ae-btn-primary">Random argument</button>` +
    `<button type="button" id="ae-reset" class="ae-btn">start the cycle over</button>` +
    `<span id="ae-progress" class="ae-progress"></span>` +
    `</div></div>` +
    `<div id="ae-stage"></div>`
  );
}

function select(key, label, options) {
  const opts = options
    .map(
      ([value, text]) =>
        `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`,
    )
    .join("");
  return (
    `<label class="ae-field"><span>${escapeHtml(label)}</span>` +
    `<select data-ae-key="${escapeHtml(key)}">${opts}</select></label>`
  );
}
