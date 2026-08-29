/*
 * The catalogue at /arguments/ — search, facets, and the per-entry views.
 *
 * The whole encyclopedia is one page. An entry is addressed by the hash
 * `#/<id>`, which gives every form a shareable, bookmarkable URL and a working
 * back button without a page load. Rule 1 of the brief: the route is `id`,
 * never `canonical.canon`.
 *
 * The catalogue's own state also lives in the hash — `#q=peirce&defect=idle+premise` —
 * so a filtered view is a link you can hand to a student.
 */

import {
  loadDatabase,
  filterEntries,
  renderCard,
  renderEntry,
  escapeHtml,
  asArray,
} from "./encyclopedia.js";

const root = document.getElementById("ae-app");
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
    // The catalogue's standing introduction. It belongs to the list, not to an
    // entry, so it is hidden along with the controls on a detail route.
    intro: document.getElementById("ae-intro"),
    controls: root.querySelector("#ae-controls"),
    list: root.querySelector("#ae-list"),
    detail: root.querySelector("#ae-detail"),
    status: root.querySelector("#ae-status"),
    search: root.querySelector("#ae-q"),
  };

  const state = readHashFilters();

  // Reflect restored state into the controls before the first paint, so a
  // shared filtered link shows its own filters rather than empty selects.
  const sync = () => {
    els.search.value = state.query || "";
    for (const sel of els.controls.querySelectorAll("select[data-ae-key]")) {
      const key = sel.dataset.aeKey;
      const facet = sel.dataset.aeFacet;
      sel.value = facet ? state.tags?.[facet] || "" : state[key] || "";
    }
  };

  const route = () => {
    const hash = location.hash.slice(1);
    if (hash.startsWith("/")) {
      const id = decodeURIComponent(hash.slice(1));
      const entry = db.byId.get(id);
      if (entry) return showDetail(entry);
      // An id that is not in the working set — either a typo, or an entry that
      // has since been quarantined. Say which, rather than showing a blank.
      els.detail.innerHTML =
        `<div class="ae-empty"><p><strong>No form with the id <code>${escapeHtml(id)}</code>.</strong></p>` +
        `<p>It may have been withdrawn, or reserved for an exam.</p>` +
        `<p><a href="#">← all argument forms</a></p></div>`;
      els.detail.hidden = false;
      setListChrome(false);
      return;
    }
    Object.assign(state, readHashFilters());
    sync();
    showList();
  };

  function setListChrome(visible) {
    if (els.intro) els.intro.hidden = !visible;
    els.controls.hidden = !visible;
    els.list.hidden = !visible;
    els.status.hidden = !visible;
  }

  function showDetail(entry) {
    setListChrome(false);
    els.detail.hidden = false;
    els.detail.innerHTML = renderEntry(entry, db, {
      spoilers: false,
      backHref: "#",
      backLabel: "all argument forms",
      onTag: true,
    });
    document.title = `${asArray(entry.names)[0] || entry.id} · argument forms`;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function showList() {
    els.detail.hidden = true;
    setListChrome(true);
    document.title = "argument forms";

    const results = filterEntries(db.entries, state);

    els.status.innerHTML =
      `<span><strong>${results.length}</strong> of ${db.entries.length} forms</span>` +
      (results.length
        ? `<span>${results.filter((e) => e.verdict?.valid).length} valid, ` +
          `${results.filter((e) => !e.verdict?.valid).length} invalid</span>`
        : "") +
      (isFiltered(state)
        ? `<button type="button" class="ae-btn" id="ae-clear">clear filters</button>`
        : "");

    const clear = els.status.querySelector("#ae-clear");
    if (clear) {
      clear.addEventListener("click", () => {
        for (const k of Object.keys(state)) delete state[k];
        state.tags = {};
        writeHashFilters(state);
        sync();
        showList();
      });
    }

    els.list.innerHTML = results.length
      ? results
          .map((e) => `<li>${renderCard(e, `#/${encodeURIComponent(e.id)}`)}</li>`)
          .join("")
      : `<li><div class="ae-empty"><p><strong>Nothing matches.</strong></p>` +
        `<p>Every form here has been seen in the wild, so the catalogue is ` +
        `deliberately narrow. Try dropping a filter.</p></div></li>`;
  }

  // Search is debounced so that typing does not re-render on every keystroke;
  // 120ms is under the threshold at which the list feels laggy.
  let timer;
  els.search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      state.query = els.search.value;
      writeHashFilters(state);
      showList();
    }, 120);
  });

  els.controls.addEventListener("change", (ev) => {
    const sel = ev.target.closest("select[data-ae-key]");
    if (!sel) return;
    const facet = sel.dataset.aeFacet;
    if (facet) {
      state.tags = state.tags || {};
      if (sel.value) state.tags[facet] = sel.value;
      else delete state.tags[facet];
    } else {
      if (sel.value) state[sel.dataset.aeKey] = sel.value;
      else delete state[sel.dataset.aeKey];
    }
    writeHashFilters(state);
    showList();
  });

  // A tag chip inside a detail view filters the catalogue by that value —
  // the shortest path from "this is tagged suppressed premise" to "show me
  // every form with a suppressed premise".
  els.detail.addEventListener("click", (ev) => {
    const chip = ev.target.closest("button[data-ae-facet]");
    if (!chip) return;
    for (const k of Object.keys(state)) delete state[k];
    state.tags = { [chip.dataset.aeFacet]: chip.dataset.aeValue };
    writeHashFilters(state);
  });

  window.addEventListener("hashchange", route);
  route();
}

function isFiltered(state) {
  if (state.query) return true;
  if (Object.values(state.tags || {}).some(Boolean)) return true;
  return [
    "valid",
    "maxAtoms",
    "difficulty",
    "lecture",
    "connective",
    "ndRule",
    "appearance",
  ].some((k) => state[k]);
}

/* -------------------------------------------------------- hash as state */

const FILTER_KEYS = [
  "query",
  "valid",
  "maxAtoms",
  "difficulty",
  "lecture",
  "connective",
  "ndRule",
  "appearance",
];

function readHashFilters() {
  const state = { tags: {} };
  const hash = location.hash.slice(1);
  if (!hash || hash.startsWith("/")) return state;

  const params = new URLSearchParams(hash);
  for (const [k, v] of params) {
    if (!v) continue;
    if (k === "q") state.query = v;
    else if (FILTER_KEYS.includes(k)) state[k] = v;
    else state.tags[k] = v; // the four tag facets, keyed by facet name
  }
  return state;
}

function writeHashFilters(state) {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  for (const k of FILTER_KEYS) {
    if (k !== "query" && state[k]) params.set(k, state[k]);
  }
  for (const [facet, value] of Object.entries(state.tags || {})) {
    if (value) params.set(facet, value);
  }

  const next = params.toString();
  // replaceState rather than assigning location.hash: typing in the search box
  // should not push thirty entries onto the back stack.
  history.replaceState(null, "", next ? `#${next}` : location.pathname);
}

/* ------------------------------------------------------------- markup */

function shell(db) {
  return (
    `<div id="ae-controls" class="ae-controls">` +
    `<label class="ae-sr" for="ae-q">Search argument forms</label>` +
    `<input id="ae-q" class="ae-search" type="search" autocomplete="off" ` +
    `placeholder="Search names, prose, tags, sources, figures, ND rules — try “Dutch book”, “idle premise”, “Quine”, “NegI”">` +
    `<div class="ae-selects">` +
    select("valid", "verdict", [
      ["", "any"],
      ["valid", `valid (${db.meta.valid})`],
      ["invalid", `invalid (${db.meta.total - db.meta.valid})`],
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
    select("lecture", "reachable by", [
      ["", "any lecture"],
      ...Array.from({ length: db.maxLecture }, (_, i) => [
        String(i + 1),
        `Lecture ${i + 1}`,
      ]),
    ]) +
    facetSelect(db, "defect", "defect") +
    facetSelect(db, "topic", "topic") +
    facetSelect(db, "figure", "figure") +
    facetSelect(db, "nonclassical", "non-classical") +
    select(
      "ndRule",
      "ND rule used",
      [["", "any"], ...db.facets.nd_rule.map((o) => [o.value, `${o.value} (${o.count})`])],
    ) +
    select(
      "appearance",
      "appearance",
      [
        ["", "any"],
        ...db.facets.appearance.map((o) => [o.value, `${o.value} (${o.count})`]),
      ],
    ) +
    `</div></div>` +
    `<div id="ae-status" class="ae-status"></div>` +
    `<ul id="ae-list" class="ae-list"></ul>` +
    `<div id="ae-detail" class="ae-detail" hidden></div>`
  );
}

function select(key, label, options, facet) {
  const opts = options
    .map(
      ([value, text]) =>
        `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`,
    )
    .join("");
  const facetAttr = facet ? ` data-ae-facet="${escapeHtml(facet)}"` : "";
  return (
    `<label class="ae-field"><span>${escapeHtml(label)}</span>` +
    `<select data-ae-key="${escapeHtml(key)}"${facetAttr}>${opts}</select></label>`
  );
}

function facetSelect(db, facet, label) {
  const values = db.facets[facet] || [];
  if (!values.length) return "";
  return select(
    facet,
    label,
    [["", "any"], ...values.map((o) => [o.value, `${o.value} (${o.count})`])],
    facet,
  );
}
