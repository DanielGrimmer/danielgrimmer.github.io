/*
 * Shared engine for the argument-form encyclopedia: loads the database, builds
 * the search and facet indexes, and renders an entry.
 *
 * Both pages import from here. `browse.js` drives the catalogue and the
 * per-entry hash routes; `practice.js` drives the random draw. Neither of them
 * knows anything about the JSON's shape — that knowledge is all in this file,
 * so when the schema grows only this file changes.
 *
 * Rules taken from the project brief and enforced here rather than in the
 * pages, because getting any of them wrong is a correctness bug, not a styling
 * one:
 *
 *   1. Route on `id`, never on `canonical.canon`. `canon` collapses every
 *      n-atom tautology to the same value (Peirce's Law, contraction and
 *      assertion are all `P2-f`), so it cannot identify an entry.
 *   2. `course.quarantined` entries are dropped at load, before anything can
 *      see them — they are reserved for exams. None are set today; the filter
 *      is here from day one so that setting one is all it takes.
 *   3. `course.note` is instructor-facing and never rendered as body copy.
 *   4. Render `display.*`, never the ASCII in `premises`/`conclusion`.
 *   5. `appearances[].fidelity` changes how a quote is presented.
 *   6. An invalid entry has no ND proof and that is not an error: `nd.note`
 *      says where the attempt breaks down, and it is a teaching field.
 *   7. Prose fields carry Markdown bold and inline code.
 *
 * On the evidence block (brief, "Scope and status"): predicate-logic entries
 * will not carry `truth_table`. Nothing below assumes it exists — the section
 * builders are a list, each one returns null when its data is absent, and the
 * detail view renders whatever comes back. A later `spectrum` block is a new
 * builder in that list and nothing else.
 */

// The database sits beside this file so the whole encyclopedia is one folder.
// Absolute, not relative: it must resolve the same from /arguments/ and from
// /arguments/practice/, which are different directory depths.
const DB_URL = "/assets/arguments/argument-db.json";

/*
 * The typeset blocks.
 *
 * Every entry carries the LaTeX for its table, its tree and its derivation, in
 * exactly the notation the course uses -- and that LaTeX is what the reader
 * should see, not an HTML approximation of it. No browser maths engine can
 * help: KaTeX and MathJax typeset formulas, and a Fitch derivation and a
 * tableau are neither. So `EncyclopediaOfArguments/latexgen/svg.py` runs the
 * blocks through LaTeX and commits the SVG output here, one file per
 * (form, method), and the page fetches the picture on demand.
 *
 * The HTML renderers below are not dead: each one stays in place underneath as
 * the fallback, so an entry whose SVG has not been generated yet, or a reader
 * behind something that blocks the fetch, still gets a readable table, tree and
 * proof. `svgFigure` puts the fallback in the slot and `hydrateSvgs` replaces
 * it if -- and only if -- the real thing arrives.
 */
const SVG_BASE = "/assets/arguments/svg/";
const svgCache = new Map();

function svgFigure(entry, method, fallback) {
  if (!fallback) return "";
  return (
    `<div class="ae-svg-scroll" data-ae-svg="${escapeHtml(entry.id)}-${method}">` +
    `<div class="ae-svg-fallback">${fallback}</div></div>`
  );
}

/**
 * Swap every SVG slot under `root` for its typeset picture.
 *
 * Failure is deliberately silent: the fallback is already on the page and is
 * correct, so a missing or unreachable SVG costs the reader nothing.
 */
export function hydrateSvgs(root) {
  const slots = root.querySelectorAll("[data-ae-svg]:not([data-ae-svg-done])");
  return Promise.all(
    [...slots].map(async (el) => {
      const name = el.dataset.aeSvg;
      let pending = svgCache.get(name);
      if (!pending) {
        pending = fetch(`${SVG_BASE}${encodeURIComponent(name)}.svg`).then((r) =>
          r.ok ? r.text() : Promise.reject(new Error(String(r.status))),
        );
        svgCache.set(name, pending);
      }
      try {
        const text = await pending;
        const at = text.indexOf("<svg");
        if (at < 0) return;
        el.innerHTML = text.slice(at);
        el.dataset.aeSvgDone = "1";
      } catch {
        // Keep the fallback.
      }
    }),
  );
}

/*
 * The headline answer.
 *
 * Whatever method the reader worked, the first thing they want on opening the
 * answer is whether they got it right -- so this goes at the top of every
 * revealed panel, ahead of the table or the tree or the proof.
 *
 * Three shapes, because the database holds three kinds of claim. A form with no
 * premises asserts a *theorem*, so its answer is whether the conclusion is a
 * tautology. A form whose conclusion is falsum asserts that its premises are
 * *inconsistent*, so its answer is whether they are. Everything else is an
 * ordinary argument, and its answer is valid or invalid.
 */
/*
 * An entry whose conclusion is falsum is not an argument for a sentence. It is
 * the claim that its premises are inconsistent, and that is how it should read.
 *
 * `⊥` is a perfectly good formula of this language and `X ⊢ ⊥` is exactly what
 * the derivation establishes, so falsum stays wherever a turnstile makes it a
 * claim *about* the set. What it cannot do is sit after `∴`: nobody concludes
 * falsum, and the truth table and the tree do not treat it as a conclusion
 * either — the table has no conclusion column and the tree stacks no negated
 * conclusion. So the stacked display drops the `∴` line and asks the question
 * the two methods are actually answering.
 */
export function claimsInconsistency(entry) {
  return entry.conclusion === "!";
}

export function answerLine(entry) {
  const valid = !!entry.verdict?.valid;
  const noPremises = !asArray(entry._premises).length;
  const claimsContradiction = claimsInconsistency(entry);

  let text;
  if (noPremises) {
    text = valid
      ? `<strong>Valid</strong> — the conclusion is a <strong>tautology</strong>.`
      : `<strong>Invalid</strong> — the conclusion is <strong>not</strong> a tautology.`;
  } else if (claimsContradiction) {
    text = valid
      ? `<strong>Inconsistent.</strong> No assignment makes all of these sentences true.`
      : `<strong>Consistent.</strong> Some assignment makes all of these sentences true.`;
  } else {
    text = valid ? `<strong>Valid.</strong>` : `<strong>Invalid.</strong>`;
  }

  return (
    `<p class="ae-answer ${valid ? "ae-answer-valid" : "ae-answer-invalid"}">` +
    text +
    `</p>`
  );
}

/** One correct answer, not the only one. */
const ALTERNATIVES = {
  tree:
    `<p class="ae-alt">The order in which the rules are applied is up to you, so ` +
    `a correct tree need not look like this one. What is fixed is the outcome: ` +
    `every completed tree for this form closes on the same branches.</p>`,
  nd:
    `<p class="ae-alt">This is <em>a</em> proof, not <em>the</em> proof. A ` +
    `derivation that reaches the conclusion from the premises by the rules is ` +
    `correct however different it looks from this one.</p>`,
};

/* ------------------------------------------------------------------ data */

let dbPromise = null;

/**
 * Fetch and prepare the database once per page load. Resolves to
 * `{ meta, entries, byId, facets, maxAtoms, maxLecture }`.
 */
export function loadDatabase() {
  if (dbPromise) return dbPromise;

  dbPromise = fetch(DB_URL, { cache: "no-cache" })
    .then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    })
    .then(prepare);

  return dbPromise;
}

function prepare(raw) {
  // Rule 2: quarantined entries never enter the working set.
  const entries = (raw.entries || []).filter((e) => !e.course?.quarantined);

  const byId = new Map(entries.map((e) => [e.id, e]));

  // `repairs_to` and `looks_like` are stored one way round. The brief wants
  // both directions rendered, so the reverse edges are built here. The build
  // refuses to emit dangling references, but a hand-broken file should degrade
  // to a missing link rather than to a crash, so unknown ids are dropped.
  for (const e of entries) {
    e._repairedBy = [];
    e._lookAlikes = new Set();
  }
  for (const e of entries) {
    const target = byId.get(e.repairs_to);
    if (target) target._repairedBy.push(e.id);

    for (const other of asArray(e.looks_like)) {
      if (!byId.has(other)) continue;
      e._lookAlikes.add(other);
      byId.get(other)._lookAlikes.add(e.id);
    }
  }
  const map = glyphMap(raw.notation);
  for (const e of entries) {
    e._lookAlikes = [...e._lookAlikes].filter((id) => id !== e.id);
    attachFormulas(e, map);
    e._haystack = haystack(e);
  }

  return {
    meta: {
      schemaVersion: raw.schema_version,
      generated: raw.generated,
      notation: raw.notation,
      ndRules: raw.nd_rules || [],
      facetNames: raw.facets || [],
      total: entries.length,
      valid: entries.filter((e) => e.verdict?.valid).length,
      appearances: entries.reduce(
        (n, e) => n + asArray(e.appearances).length,
        0,
      ),
    },
    entries,
    byId,
    facets: collectFacets(entries, raw.facets || []),
    maxAtoms: Math.max(...entries.map((e) => e.metrics?.atom_count || 0)),
    maxLecture: Math.max(
      ...entries.flatMap((e) => Object.values(lectureMap(e))),
      0,
    ),
  };
}

function asArray(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

/* ------------------------------------------------- notation and formulas */

/*
 * WHY THE FORMULAS ARE NOT TAKEN FROM `display`.
 *
 * The generator emits `display.premises`, `display.conclusion` and
 * `display.sequent` with *minimal* parentheses. For a left-nested conditional
 * that is not merely terse, it is wrong: `notation.precedence` declares the
 * conditional right-associative, so Peirce's Law, whose source is
 * `((p > q) > p) > p`, comes out as `p ⊃ q ⊃ p ⊃ p` — which re-parses as
 * `p ⊃ (q ⊃ (p ⊃ p))`, a different formula, and one that is a tautology in
 * every logic where Peirce's Law is the interesting case precisely because it
 * is not. Seven entries are affected, all of them the substructural ones where
 * the nesting is the whole point: peirce-law, contraction-w, curry-complete,
 * curry-contraction-only, abelian-axiom, fixed-point-type, assertion-t.
 *
 * So the house-glyph formulas are built here from the ASCII source in
 * `premises` / `conclusion`, which carries the author's own parentheses and is
 * unambiguous, translated through the database's own `notation.ascii` map.
 * The real fix belongs in `build.py`; when `display` becomes trustworthy this
 * whole block can go and the `display` fields can be read directly again.
 */

const GLYPH_FALLBACK = {
  "~": "∼",
  "&": "&",
  "|": "∨",
  ">": "⊃",
  "=": "≡",
  "!": "⊥",
};

function glyphMap(notation) {
  return { ...GLYPH_FALLBACK, ...(notation?.ascii || {}) };
}

function toGlyphs(src, map) {
  if (!src) return "";
  let out = "";
  for (const ch of String(src)) out += map[ch] ?? ch;
  return out;
}

/**
 * Attach corrected formulas to an entry, plus a repair map from the
 * generator's display strings to ours. The map is what lets the truth-table
 * headers and the tree — which quote `display` strings rather than the ASCII —
 * be corrected too, by exact match within this entry only.
 */
/*
 * The formulas, in the house glyphs.
 *
 * The ASCII in `premises` / `conclusion` is the source, and it is fully
 * parenthesised: this course's language officially puts a parenthesis around
 * every binary application, and Lecture 2 licenses dropping only the
 * *outermost* pair, never an inner one. So there is no precedence convention
 * to apply and nothing to reconstruct -- transliterating the source character
 * by character gives the formula exactly as the handouts write it.
 *
 * That is a recent guarantee. The database used to store display strings with
 * every parenthesis precedence could justify dropped, which is lossy for the
 * conditional -- `p ⊃ q ⊃ p` names nothing in particular -- and this function
 * carried a repair map to undo it. `latexgen/build.py` now normalises the
 * database itself, so the repair is gone and the test suite fails if any
 * stored formula drifts back.
 */
function attachFormulas(e, map) {
  e._premises = asArray(e.premises).map((x) => toGlyphs(x, map));
  e._conclusion = toGlyphs(e.conclusion, map);
}

/** A formula quoted from the database's own display strings. */
function fixFormula(entry, s) {
  return s;
}

/** The sequent, assembled from the corrected parts rather than read whole. */
function sequentText(entry, turnstile) {
  const prems = asArray(entry._premises);
  const left = prems.join(", ");
  return left
    ? `${left}  ${turnstile} ${entry._conclusion}`
    : `${turnstile} ${entry._conclusion}`;
}

export { sequentText };

/** The per-method earliest lecture, as a plain `{table, tree, nd}` of numbers. */
function lectureMap(entry) {
  const src = entry.course?.earliest_lecture || {};
  const out = {};
  for (const method of ["table", "tree", "nd"]) {
    if (typeof src[method] === "number") out[method] = src[method];
  }
  return out;
}

export { lectureMap, asArray };

/* --------------------------------------------------------------- search */

/*
 * The brief asks for search "across everything — names, prose, tags, source,
 * figure, number of atoms, verdict, which ND rules a proof uses". Each entry
 * gets one lower-cased haystack string built once at load; a query is ANDed
 * over whitespace-separated terms, so "quine invalid" narrows rather than
 * widens. At 35 entries this is instant, and it stays acceptable into the
 * hundreds — the point at which it stops being acceptable is the point at
 * which the single-file fetch also has to go.
 */
function haystack(e) {
  const parts = [
    e.id,
    e.cli_ref,
    ...asArray(e.names),
    e.interest,
    e.countermodel_gloss,
    e.display?.sequent,
    ...asArray(e.display?.premises),
    e.display?.conclusion,
    ...asArray(e._premises),
    e._conclusion,
    ...asArray(e.premises),
    e.conclusion,
    ...asArray(e.english).map((g) => g.gloss),
    e.verdict?.valid ? "valid provable" : "invalid countermodel",
    `${e.metrics?.atom_count} atoms`,
    ...asArray(e.metrics?.connectives),
    ...asArray(e.nd?.rules_used),
    e.nd?.note,
    ...asArray(e.course?.used_in),
  ];

  for (const values of Object.values(e.tags || {})) parts.push(...asArray(values));

  for (const a of asArray(e.appearances)) {
    parts.push(a.who, a.work, a.locus, a.quote, a.type, a.fidelity);
  }

  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function matchesQuery(entry, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  return terms.every((t) => entry._haystack.includes(t));
}

/* --------------------------------------------------------------- facets */

function collectFacets(entries, facetNames) {
  const out = {};
  for (const name of facetNames) {
    const counts = new Map();
    for (const e of entries) {
      for (const v of asArray(e.tags?.[name])) {
        counts.set(v, (counts.get(v) || 0) + 1);
      }
    }
    out[name] = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, count }));
  }

  const extra = (key, values) => {
    const counts = new Map();
    for (const e of entries) {
      for (const v of values(e)) counts.set(v, (counts.get(v) || 0) + 1);
    }
    out[key] = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))
      .map(([value, count]) => ({ value, count }));
  };

  extra("connective", (e) => asArray(e.metrics?.connectives));
  extra("nd_rule", (e) => asArray(e.nd?.rules_used));
  extra("appearance", (e) => [
    ...new Set(asArray(e.appearances).map((a) => a.type)),
  ]);

  return out;
}

/**
 * The single filter predicate both pages share. Every key is optional; an
 * absent or empty value means "don't filter on this".
 *
 * `method` is the practice method (table/tree/nd). It makes `difficulty` and
 * `lecture` method-relative, which is the whole point of those two fields
 * being per-method in the data: an argument can be a Lecture 4 truth table and
 * a Lecture 11 natural deduction at the same time.
 */
export function filterEntries(entries, f = {}) {
  const method = f.method || null;

  return entries.filter((e) => {
    if (f.query && !matchesQuery(e, f.query)) return false;

    if (f.valid === "valid" && !e.verdict?.valid) return false;
    if (f.valid === "invalid" && e.verdict?.valid) return false;

    if (f.maxAtoms && (e.metrics?.atom_count || 0) > Number(f.maxAtoms)) {
      return false;
    }
    if (f.minAtoms && (e.metrics?.atom_count || 0) < Number(f.minAtoms)) {
      return false;
    }

    if (f.difficulty) {
      const levels = method
        ? [e.difficulty?.[method]]
        : Object.values(e.difficulty || {}).filter(
            (v) => typeof v === "string",
          );
      if (!levels.includes(f.difficulty)) return false;
    }

    if (f.lecture) {
      const lectures = lectureMap(e);
      // Practising one method: that method must be reachable by the chosen
      // lecture. Browsing with no method: any method reachable will do.
      const relevant = method
        ? [lectures[method]]
        : Object.values(lectures);
      const reachable = relevant.filter((n) => typeof n === "number");
      if (!reachable.length) return false;
      if (!reachable.some((n) => n <= Number(f.lecture))) return false;
    }

    // Practising natural deduction only makes sense on entries that have one.
    // The `nd.note` on an invalid entry is a fine thing to read, but it is not
    // a problem to attempt, so it is excluded from an ND practice set.
    if (f.requireNd && !e.nd?.exists) return false;

    for (const [facet, value] of Object.entries(f.tags || {})) {
      if (!value) continue;
      if (!asArray(e.tags?.[facet]).includes(value)) return false;
    }

    if (f.connective && !asArray(e.metrics?.connectives).includes(f.connective)) {
      return false;
    }
    if (f.ndRule && !asArray(e.nd?.rules_used).includes(f.ndRule)) return false;
    if (
      f.appearance &&
      !asArray(e.appearances).some((a) => a.type === f.appearance)
    ) {
      return false;
    }

    return true;
  });
}

/* ------------------------------------------------------------- markdown */

/*
 * Brief item 7: the prose fields carry `**bold**` and `` `code` ``. They carry
 * nothing else — no links, no lists, no headings — so a full Markdown parser
 * would be 40 KB to do the work of six lines. Escaping happens first and the
 * only tags ever produced are <strong>, <code> and <em>, which is what makes
 * this safe to hand an innerHTML.
 */
export function md(text) {
  if (!text) return "";
  return escapeHtml(String(text))
    // A backticked span is a formula almost everywhere in this database, so
    // its atoms get their subscripts. Anything that is not made only of
    // formula characters — `argument-db.json`, a file name — is left alone.
    .replace(/`([^`]+)`/g, (whole, span) =>
      /^[A-Za-z0-9 ()~&amp;|>=!∼∨⊃≡⊥⊨⊭⊢⊬,.∴]+$/.test(span)
        ? `<code>${subscripts(span)}</code>`
        : `<code>${span}</code>`,
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:!?)]|$)/g, "$1<em>$2</em>")
    .replace(/ -- /g, " — ");
}

export function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** A formula in house glyphs. Rule 4: callers pass `display.*`, never ASCII. */
function f(formula) {
  return `<span class="ae-f">${subscripts(escapeHtml(formula))}</span>`;
}

/*
 * Digits after a letter are a subscript, not a suffix.
 *
 * Lecture 2 gives the whole alphabet of propositional names: "lower case
 * letters (e.g. p, q, r) potentially with subscripts (e.g. p_2, q_3, r_5)".
 * The database stores those inline as `p1`, `o2`, since one token is easier to
 * parse and to search than a token plus markup, and they are set as real
 * subscripts here and as `p_{1}` in the LaTeX.
 */
function subscripts(escaped) {
  return escaped.replace(/([a-z])([0-9]+)/g, "$1<sub>$2</sub>");
}

export { subscripts };

export { f as formula };

/* ------------------------------------------------------- entry rendering */

/**
 * Render one entry.
 *
 * `opts.spoilers` is the only thing that differs between the two pages:
 *   false (browse)   — verdict, commentary and relations are shown outright.
 *   true  (practice) — the reader gets the sequent, the English gloss and the
 *                      provenance, and everything that would give away the
 *                      answer sits behind a reveal. `interest` counts as
 *                      giving it away: it routinely says "the argument is
 *                      valid vacuously" in its first clause.
 *
 * `opts.method` names the method being practised, which is used to order the
 * reveals so the one the reader wants is first.
 */
export function renderEntry(entry, db, opts = {}) {
  const spoilers = !!opts.spoilers;
  const method = opts.method || null;

  const out = [];

  if (opts.backHref) {
    out.push(
      `<a class="ae-back" href="${escapeHtml(opts.backHref)}">← ${escapeHtml(
        opts.backLabel || "all argument forms",
      )}</a>`,
    );
  }

  out.push(renderHead(entry, spoilers));
  out.push(renderSequent(entry, spoilers));
  out.push(renderEnglish(entry));

  if (!spoilers) {
    out.push(renderVerdictBanner(entry));
    out.push(renderInterest(entry));
  }

  // Provenance is visible on both pages: the reader's Q3 choice, and the
  // encyclopedia's reason to exist. It is placed before the reveals so that a
  // practice reader meets the philosophy before the answer.
  out.push(renderAppearances(entry, spoilers));
  out.push(renderTags(entry, opts));

  if (spoilers) {
    out.push(
      section(
        "The answer",
        [
          revealPanel(
            "Verdict",
            renderVerdictBanner(entry, true) +
              renderInterest(entry, true) +
              renderTags(entry, { onlyFacets: ["defect", "nonclassical"] }),
            "valid or invalid?",
          ),
        ].join(""),
      ),
    );
  }

  out.push(renderEvidence(entry, spoilers, method));
  out.push(renderPremiseAnalysis(entry));

  if (!spoilers) out.push(renderRelations(entry, db));
  out.push(renderMetrics(entry));
  out.push(renderInstructor(entry));

  return out.filter(Boolean).join("");
}

function section(title, body) {
  if (!body) return "";
  return `<section class="ae-section"><h3>${escapeHtml(title)}</h3>${body}</section>`;
}

function revealPanel(label, body, hint) {
  if (!body) return "";
  const h = hint
    ? `<span class="ae-reveal-hint">${escapeHtml(hint)}</span>`
    : "";
  return `<details class="ae-reveal"><summary>${escapeHtml(label)}${h}</summary><div class="ae-reveal-body">${body}</div></details>`;
}

export { revealPanel, section };

function renderHead(entry, spoilers) {
  const names = asArray(entry.names);
  const title = names[0] || entry.id;
  const akas = names.slice(1);

  const bits = [];
  if (entry.cli_ref && entry.cli_ref !== "—") {
    bits.push(`<span class="ae-chip">${escapeHtml(entry.cli_ref)}</span>`);
  }
  if (!spoilers) {
    bits.push(
      entry.verdict?.valid
        ? `<span class="ae-chip ae-chip-valid">valid</span>`
        : `<span class="ae-chip ae-chip-invalid">invalid</span>`,
    );
  }
  const used = asArray(entry.course?.used_in);
  if (used.length) {
    bits.push(
      `<span class="ae-chip ae-chip-accent ae-chip-wrap">${escapeHtml(used.join(", "))}</span>`,
    );
  }

  return (
    `<h2 class="ae-title">${escapeHtml(title)}</h2>` +
    (akas.length
      ? `<p class="ae-akas">also: ${escapeHtml(akas.join(" · "))}</p>`
      : "") +
    (bits.length ? `<div class="ae-tagrow">${bits.join("")}</div>` : "")
  );
}

/*
 * The sequent, set as a stack rather than as the one-line `display.sequent`.
 * A six-premise Dutch book on one line is unreadable on a phone and the reader
 * loses track of which premise is which — and premise *numbers* are exactly
 * what `premise_analysis` and the tree's `from` fields refer back to.
 */
/*
 * IMPORTANT: `display.sequent` and `display.turnstiles` both encode the
 * verdict — a valid form gets ⊨ / ⊢ / ⊢ND, an invalid one gets ⊭ / ⊬ / ⊬ND.
 * Printing either on the practice page tells the student the answer before
 * they have looked at the argument, which defeats the whole page. Under
 * `spoilers` the one-line sequent and the turnstile are both withheld; the
 * stacked premises and conclusion above them say everything else.
 */
function renderSequent(entry, spoilers = false) {
  const prems = asArray(entry._premises);
  const concl = entry._conclusion || "";
  const turnstile = entry.display?.turnstiles?.table || "⊨";

  const rows = prems.map(
    (p, i) =>
      `<div class="ae-seq-prem"><span class="ae-seq-num">${i + 1}.</span>${f(p)}</div>`,
  );

  const inconsistency = claimsInconsistency(entry);

  const body = inconsistency
    ? // No `∴ ⊥`. See claimsInconsistency: the claim is about the set.
      rows.join("")
    : prems.length
      ? rows.join("") +
        `<div class="ae-seq-bar"></div>` +
        `<div class="ae-seq-concl"><span class="ae-seq-num">∴</span>${f(concl)}</div>`
      : // Not `⊢`: a no-premise entry is a *claimed* theorem, not a proved one,
        // and four of them are invalid. `∴` asserts nothing either way.
        `<div class="ae-seq-concl"><span class="ae-seq-num">∴</span>${f(concl)}</div>`;

  const atoms = entry.metrics?.atom_count;
  const scale = atoms ? `${atoms} atom${atoms === 1 ? "" : "s"}` : "";

  let note;
  if (inconsistency) {
    note = spoilers
      ? `${prems.length} sentences · are they consistent?`
      : `${prems.length} sentences · ${f(sequentText(entry, turnstile))}`;
  } else if (spoilers) {
    note = prems.length
      ? [`${prems.length} premise${prems.length === 1 ? "" : "s"}`, scale]
          .filter(Boolean)
          .join(" · ")
      : `No premises — the conclusion is offered as a theorem in its own right.${scale ? ` ${scale}.` : ""}`;
  } else {
    note = prems.length
      ? `${prems.length} premise${prems.length === 1 ? "" : "s"} · ${f(sequentText(entry, turnstile))}`
      : `No premises — the conclusion is asserted as a theorem. ${f(sequentText(entry, turnstile))}`;
  }

  // The screen-reader turnstile is withheld under spoilers for the same reason
  // the printed one is: it is the answer.
  const sr = spoilers
    ? ""
    : ` <span class="ae-sr">turnstile ${escapeHtml(turnstile)}</span>`;

  return (
    `<div class="ae-sequent"><div class="ae-seq-stack">${body}</div>` +
    `<div class="ae-seq-note">${note}${sr}</div></div>`
  );
}

function renderEnglish(entry) {
  const glosses = asArray(entry.english);
  if (!glosses.length) return "";

  const items = glosses
    .map((g) => {
      // `faithful: false` marks a gloss that reads naturally but does not
      // track the formalisation. Saying so is the honest thing, and it is
      // itself a teaching point about formalisation.
      const flag = g.faithful
        ? ""
        : ` <span class="ae-chip ae-chip-warn">loose rendering</span>`;
      return `<p>${md(g.gloss)}${flag}</p>`;
    })
    .join("");

  return section("In English", `<div class="ae-prose">${items}</div>`);
}

function renderVerdictBanner(entry, bare = false) {
  const v = entry.verdict || {};
  const valid = !!v.valid;

  let text;
  if (claimsInconsistency(entry)) {
    // Not "valid, but vacuously": there is no conclusion here, and calling it
    // vacuous invites the reader to look for one. See claimsInconsistency.
    text = valid
      ? `<strong>Inconsistent.</strong> Of ${v.rows} rows, <strong>none</strong> ` +
        `makes all of these sentences true, so together they entail anything at ` +
        `all — which is the same as saying they say nothing.`
      : `<strong>Consistent.</strong> Some of the ${v.rows} rows make all of ` +
        `these sentences true, so they do not entail a contradiction.`;
  } else if (valid) {
    if (v.premises_satisfiable === false) {
      text =
        `<strong>Valid</strong> — but vacuously. Of ${v.rows} rows, ` +
        `<strong>none</strong> makes every premise true, so there is no row ` +
        `on which the conclusion could fail.`;
    } else {
      text =
        `<strong>Valid.</strong> ${v.premise_true_rows} of ${v.rows} rows ` +
        `make every premise true, and the conclusion is true on all of them.`;
    }
  } else {
    const n = v.countermodel_count || 0;
    const sharp = entry.difficulty?.search_sharpness;
    const sharpNote =
      typeof sharp === "number" && sharp > 0 && sharp <= 0.05
        ? ` That is a needle: <strong>${(sharp * 100).toFixed(1)}%</strong> of rows. Reading straight down the table, it is easy to miss.`
        : "";
    text =
      `<strong>Invalid.</strong> ${n} countermodel${n === 1 ? "" : "s"} in ` +
      `${v.rows} rows — ${n === 1 ? "a row" : "rows"} where every premise is ` +
      `true and the conclusion is false.${sharpNote}`;
  }

  const cms = asArray(v.countermodels).slice(0, 3);
  const cmHtml = cms.length
    ? `<div style="margin-top:.5rem">${cms
        .map((m) => f(assignmentText(m)))
        .join("<br>")}</div>`
    : "";

  const gloss = entry.countermodel_gloss
    ? `<div class="ae-prose" style="margin-top:.7rem">${md(entry.countermodel_gloss)}</div>`
    : "";

  const banner =
    `<div class="ae-verdict ${valid ? "ae-verdict-valid" : "ae-verdict-invalid"}">` +
    `${text}${cmHtml}${gloss}</div>`;

  return bare ? banner : `<div class="ae-section">${banner}</div>`;
}

function assignmentText(model) {
  return Object.entries(model)
    .map(([k, v]) => `${k} = ${v}`)
    .join(",  ");
}

/** An assignment as markup, so its atoms keep their subscripts. */
function assignmentHtml(model) {
  return subscripts(escapeHtml(assignmentText(model)));
}

function renderInterest(entry, bare = false) {
  if (!entry.interest) return "";
  const body = `<div class="ae-prose">${paragraphs(entry.interest)}</div>`;
  return bare
    ? `<div style="margin-top:.9rem">${body}</div>`
    : section("Why this form is interesting", body);
}

function paragraphs(text) {
  return String(text)
    .split(/\n\s*\n/)
    .map((p) => `<p>${md(p.trim())}</p>`)
    .join("");
}

/* ---------------------------------------------------------- appearances */

const FIDELITY = {
  verbatim: {
    cls: "ae-app-verbatim",
    label: "verbatim",
    chip: "ae-chip-accent",
  },
  paraphrase: { cls: "ae-app-paraphrase", label: "paraphrase", chip: "" },
  "our reconstruction": {
    cls: "ae-app-reconstruction",
    label: "our reconstruction",
    chip: "ae-chip-warn",
  },
};

/*
 * Neutral wordings on purpose. `diagnosed` sits on 7 valid entries as well as
 * 13 invalid ones, so glossing it as "diagnosed the fallacy" would both give
 * away the verdict and, on those 7, simply be false — the diagnosis is of what
 * the form does, not of a mistake in it.
 */
const APPEARANCE_TYPE = {
  used: "used the argument",
  discussed: "discussed the form",
  diagnosed: "diagnosed the form",
};

/*
 * Provenance is shown on both pages — it is the reason the encyclopedia
 * exists, and it is what the practice page offers instead of the answer. But
 * the *quotes* are not always safe: one verbatim SEP passage contains `⊭`, and
 * a couple of our own reconstructions read "show that this argument is
 * tree-invalid". Rewriting a source to hide the verdict is not an option, so
 * under spoilers the attribution (who, work, locus, link) stays visible and
 * only the quoted text sits behind a one-click reveal.
 */
function renderAppearances(entry, spoilers = false) {
  const apps = asArray(entry.appearances);
  if (!apps.length) return "";

  const items = apps
    .map((a) => {
      const fid = FIDELITY[a.fidelity] || {
        cls: "ae-app-paraphrase",
        label: a.fidelity || "",
        chip: "",
      };

      const where = [a.work, a.locus].filter(Boolean).join(", ");
      const whereHtml = a.url
        ? `<a class="ae-app-where" href="${escapeHtml(a.url)}" target="_blank" rel="noopener">${escapeHtml(where)} ↗</a>`
        : `<span class="ae-app-where">${escapeHtml(where)}</span>`;

      // Rule 5: the fidelity label rides with the quote, not just in the
      // header, so a reconstruction can never be read as a quotation even by
      // someone who skims the block and copies the indented text.
      const quoteBody = a.quote
        ? `<p class="ae-app-quote ${fid.cls}">${md(a.quote)}` +
          `<span class="ae-chip ${fid.chip}" style="margin-left:.5rem">${escapeHtml(fid.label)}</span></p>`
        : "";

      // "our reconstruction" is already possessive, so it does not take "the".
      const summaryLabel =
        a.fidelity === "our reconstruction"
          ? "show our reconstruction"
          : `show the ${fid.label} passage`;

      const quote =
        quoteBody && spoilers
          ? `<details class="ae-reveal ae-app-reveal"><summary>${escapeHtml(summaryLabel)}` +
            `<span class="ae-reveal-hint">may state the verdict</span></summary>` +
            `<div class="ae-reveal-body">${quoteBody}</div></details>`
          : quoteBody;

      return (
        `<div class="ae-appearance"><div class="ae-app-head">` +
        `<span class="ae-app-who">${escapeHtml(a.who || "—")}</span>` +
        `<span class="ae-chip">${escapeHtml(APPEARANCE_TYPE[a.type] || a.type || "")}</span>` +
        `</div>${whereHtml}${quote}</div>`
      );
    })
    .join("");

  return section(
    apps.length === 1 ? "Where it shows up" : `Where it shows up (${apps.length})`,
    items,
  );
}

/* ----------------------------------------------------------------- tags */

const FACET_LABEL = {
  defect: "defect",
  topic: "topic",
  figure: "figure",
  nonclassical: "non-classical",
};

/*
 * Two of the four facets name the fault rather than the subject: `defect`
 * carries values like "vacuous validity", "is/ought gap" and "missing bridge
 * premise", and `nonclassical` carries "classical-fails" and "lem-fails-team".
 * Either one answers the question the practice page is asking, so under
 * spoilers only `topic` and `figure` — the philosophical hook — are shown, and
 * the other two appear with the verdict.
 */
const SPOILER_FREE_FACETS = new Set(["topic", "figure"]);

function renderTags(entry, opts) {
  const rows = [];
  for (const [facet, values] of Object.entries(entry.tags || {})) {
    if (opts.onlyFacets) {
      if (!opts.onlyFacets.includes(facet)) continue;
    } else if (opts.spoilers && !SPOILER_FREE_FACETS.has(facet)) {
      continue;
    }

    const list = asArray(values);
    if (!list.length) continue;

    const chips = list
      .map((v) =>
        opts.onTag
          ? `<button type="button" class="ae-chip" data-ae-facet="${escapeHtml(facet)}" data-ae-value="${escapeHtml(v)}">${escapeHtml(v)}</button>`
          : `<span class="ae-chip">${escapeHtml(v)}</span>`,
      )
      .join("");

    rows.push(
      `<div class="ae-tagrow"><span>${escapeHtml(FACET_LABEL[facet] || facet)}</span>${chips}</div>`,
    );
  }
  if (!rows.length) return "";
  return section(
    "Tags",
    `<div style="display:grid;gap:.45rem">${rows.join("")}</div>`,
  );
}

/* ------------------------------------------------------------- evidence */

/*
 * The three (for now) evidence blocks. Each builder returns null when the
 * entry has no data for it, so a future predicate-logic entry with a
 * model-theoretic spectrum instead of a truth table drops in as a fourth
 * builder and the detail view needs no change at all.
 */
function renderEvidence(entry, spoilers, method) {
  const builders = [
    { key: "table", label: "Truth table", build: buildTruthTable },
    { key: "tree", label: "Truth tree", build: buildTree },
    { key: "nd", label: "Natural deduction", build: buildNd },
  ];

  // Put the method being practised first; otherwise keep table/tree/nd order.
  if (method) {
    builders.sort((a, b) =>
      a.key === method ? -1 : b.key === method ? 1 : 0,
    );
  }

  const panels = builders
    .map(({ key, label, build }) => {
      const built = build(entry, spoilers);
      if (!built) return "";
      // The turnstile is ⊨/⊭ by verdict, so it only goes in the heading when
      // the answer is already on the page.
      const turnstile = spoilers ? null : entry.display?.turnstiles?.[key];
      const heading = turnstile ? `${label}  ${turnstile}` : label;
      return revealPanel(heading, built.html, built.hint);
    })
    .filter(Boolean)
    .join("");

  if (!panels) return "";

  return section(
    spoilers ? "Work it out, then check" : "The three methods",
    panels,
  );
}

/* ------------------------------------------------------------ the table */

function buildTruthTable(entry) {
  const tt = entry.truth_table;
  if (!tt || !asArray(tt.rows).length) return null;

  const atoms = asArray(tt.atoms);
  const cols = asArray(tt.columns);
  const premCount = asArray(entry._premises).length;

  // `columns` is the premises followed by the conclusion, in the generator's
  // own display strings. Rebuild it positionally from the corrected formulas
  // when the shape matches, and fall back to the repair map if it ever doesn't.
  // An inconsistency claim has no conclusion column. A column of falsum would
  // be F all the way down and say nothing; the question is whether any row
  // makes the premises true. The typeset table is one-sided for the same
  // reason, and this keeps the fallback matching it.
  const oneSided = claimsInconsistency(entry);
  const headers =
    cols.length === premCount + 1
      ? oneSided
        ? [...entry._premises]
        : [...entry._premises, entry._conclusion]
      : cols.map((c) => fixFormula(entry, c));

  // `columns` is premises followed by the conclusion. Splitting on the premise
  // count, rather than assuming the last column, keeps a no-premise theorem
  // (where columns is just the conclusion) correct.
  const head =
    `<tr>` +
    atoms.map((a) => `<th>${subscripts(escapeHtml(a))}</th>`).join("") +
    headers
      .map(
        (c, i) =>
          `<th class="${i === 0 || i === premCount ? "ae-tt-split" : ""}">${subscripts(escapeHtml(c))}</th>`,
      )
      .join("") +
    `<th class="ae-tt-split"></th>` +
    `</tr>`;

  const body = tt.rows
    .map((r) => {
      const cls = r.countermodel
        ? "ae-tt-cm"
        : r.premises_all_true
          ? "ae-tt-live"
          : "";

      const cells =
        atoms
          .map((a) => `<td>${escapeHtml(r.assignment?.[a] ?? "")}</td>`)
          .join("") +
        asArray(r.premises)
          .map(
            (v, i) =>
              `<td class="${i === 0 ? "ae-tt-split" : ""}">${escapeHtml(v)}</td>`,
          )
          .join("") +
        (oneSided
          ? ""
          : `<td class="ae-tt-split">${escapeHtml(r.conclusion ?? "")}</td>`) +
        `<td class="ae-tt-split ae-tt-mark">${r.countermodel ? "←" : ""}</td>`;

      return `<tr class="${cls}">${cells}</tr>`;
    })
    .join("");

  const legend =
    `<div class="ae-tt-legend">` +
    `<span><span class="ae-swatch" style="background:var(--ae-accent-soft)"></span>all premises true</span>` +
    (oneSided
      ? ""
      : `<span><span class="ae-swatch" style="background:var(--ae-invalid-bg)"></span>countermodel — premises true, conclusion false</span>`) +
    `</div>`;

  return {
    hint: `${tt.rows.length} rows, ${atoms.length} atom${atoms.length === 1 ? "" : "s"}`,
    html:
      // The legend explains the row shading, and the shading is a feature of
      // the HTML table only -- the typeset table marks nothing, exactly as it
      // does in the handout. So the legend goes inside the fallback and leaves
      // with it. The countermodels themselves are named in the verdict.
      svgFigure(
        entry,
        "table",
        `<div class="ae-table-wrap"><table class="ae-tt"><thead>${head}</thead><tbody>${body}</tbody></table></div>` +
          legend,
      ),
  };
}

/* ------------------------------------------------------------- the tree */

/*
 * The tableau, drawn as a branching diagram.
 *
 * It used to be a nested list, which is not what a truth tree is: the whole
 * point of the notation is that a branch point is a *fork*, and two sibling
 * branches are alternatives rather than a sequence. So the nodes are laid out
 * as a real tree, with the connectors drawn in CSS -- a stub down from the
 * parent, a horizontal rule spanning the children, a stub down into each.
 *
 * Every tree in the database is strictly binary: a node has either no children
 * or exactly two, because the branching rules all split in two and the
 * non-branching rules add to the node they are already in. The layout below
 * assumes nothing stronger than "zero or more", but that is why it stays
 * narrow enough to read.
 *
 * The `from` annotations the data carries are not printed. The handouts do not
 * annotate their trees, and at eighteen branches the labels would triple the
 * width; they are attached as tooltips instead, so the information is there for
 * anyone who wants it and costs nothing to anyone who does not.
 */
function buildTree(entry, spoilers = false) {
  const t = entry.tree;
  if (!t || !t.tree) return null;

  const resolved = collectResolved(t.tree);
  // `∼⊥` is stored as the negated conclusion but never stacked: an
  // inconsistency claim's tree starts from the premises alone, because it is
  // asking whether they can all be true. The typeset tree omits it too.
  const roots = asArray(t.roots)
    .filter((r) => !(claimsInconsistency(entry) && (r === "∼⊥" || r === "⊥")))
    .map((r, i) => treeFormula(entry, r, resolved, i + 1))
    .join("");

  const branches = (t.closed_branches || 0) + (t.open_branches || 0);
  const hint = spoilers
    ? `${branches} branch${branches === 1 ? "" : "es"}, depth ${t.branch_depth}`
    : `${t.closed_branches} closed` +
      (t.open_branches ? `, ${t.open_branches} open` : "") +
      `, depth ${t.branch_depth}`;

  return {
    hint,
    html:
      (claimsInconsistency(entry)
        ? `<p class="ae-tree-key">The sentences themselves, stacked — there is no ` +
          `conclusion to negate. A branch closes (<strong>x</strong>) when it holds a ` +
          `sentence and its negation; a branch still open when the rules run out ` +
          `(<strong>o</strong>) satisfies them all, so the set is consistent exactly ` +
          `when some branch stays open.</p>`
        : `<p class="ae-tree-key">The premises and the <em>negated</em> conclusion, ` +
          `stacked. A branch closes (<strong>x</strong>) when it holds a sentence and ` +
          `its negation; a branch still open when the rules run out (<strong>o</strong>) ` +
          `is a countermodel.</p>`) +
      svgFigure(
        entry,
        "tree",
        `<div class="ae-t-scroll"><div class="ae-t">` +
          `<div class="ae-t-node"><div class="ae-t-box ae-t-root">${roots}</div>` +
          treeKids(t.tree, entry, resolved) +
          `</div></div></div>`,
      ) +
      ALTERNATIVES.tree,
  };
}

/** Every formula some rule application consumed, so it takes a checkmark. */
function collectResolved(node, out) {
  out = out || new Set();
  for (const k of asArray(node.children)) {
    for (const a of asArray(k.added)) if (a.from) out.add(a.from);
    collectResolved(k, out);
  }
  for (const a of asArray(node.added)) if (a.from) out.add(a.from);
  if (node.branched_on) out.add(node.branched_on);
  return out;
}

function treeFormula(entry, shown, resolved, num) {
  const fixed = fixFormula(entry, shown);
  const tick = resolved.has(shown)
    ? `<span class="ae-t-tick">✓</span>`
    : "";
  const n = num ? `<span class="ae-t-n">${num}.</span>` : "";
  return `<div class="ae-t-line">${n}${f(fixed)}${tick}</div>`;
}

function treeKids(node, entry, resolved) {
  const kids = asArray(node.children);
  if (!kids.length) return "";
  return (
    `<div class="ae-t-kids">` +
    kids
      .map(
        (k) =>
          `<div class="ae-t-kid"><div class="ae-t-node">` +
          treeBox(k, entry, resolved) +
          treeKids(k, entry, resolved) +
          `</div></div>`,
      )
      .join("") +
    `</div>`
  );
}

function treeBox(node, entry, resolved) {
  const rows = asArray(node.added)
    .map((a) => {
      const fixed = fixFormula(entry, a.formula);
      const tick = resolved.has(a.formula) ? `<span class="ae-t-tick">✓</span>` : "";
      // The rule and its source ride along as a tooltip rather than as print.
      const why = a.rule
        ? ` title="${escapeHtml(`${a.rule} from ${a.from || ""}`.trim())}"`
        : "";
      return `<div class="ae-t-line"${why}>${f(fixed)}${tick}</div>`;
    })
    .join("");

  let mark = "";
  if (node.status === "closed") {
    mark = `<div class="ae-t-mark ae-t-closed">x</div>`;
  } else if (node.status === "open") {
    mark = `<div class="ae-t-mark ae-t-open">o</div>`;
    if (node.model) {
      mark += `<div class="ae-t-model">${assignmentHtml(node.model)}</div>`;
    }
  }
  return `<div class="ae-t-box">${rows}${mark}</div>`;
}

/* --------------------------------------------------------------- the ND */

function buildNd(entry, spoilers = false) {
  const nd = entry.nd;
  if (!nd) return null;

  // Rule 6: no proof on an invalid entry is not an error, and `nd.note` is the
  // exercise. It gets rendered as the panel's content, not suppressed.
  if (!nd.exists) {
    return {
      // "no proof exists" is the verdict. Under spoilers the panel invites the
      // attempt instead, and the reader finds out by opening it.
      hint: spoilers ? "try it, then look" : "no proof exists — why?",
      html:
        `<div class="ae-prose">${paragraphs(nd.note || "No derivation exists.")}</div>`,
    };
  }

  const stat = (k, v) =>
    `<div class="ae-stat"><span class="ae-stat-k">${escapeHtml(k)}</span><span class="ae-stat-v">${escapeHtml(v)}</span></div>`;

  const profile =
    `<div class="ae-nd-profile">` +
    stat("lines", nd.lines) +
    stat("subproofs", nd.subproof_count) +
    stat("max depth", nd.max_subproof_depth) +
    stat("assumptions", nd.assumption_count) +
    stat("shape", nd.uses_indirect_proof ? "indirect" : "direct") +
    `</div>`;

  const rules =
    `<div class="ae-tagrow"><span>rules used</span>` +
    asArray(nd.rules_used)
      .map((r) => `<span class="ae-chip ae-chip-accent">${escapeHtml(r)}</span>`)
      .join("") +
    `</div>`;

  // If a later build serialises the proof lines, they render here and this
  // whole branch of the function stops being the interesting one. Until then,
  // say plainly what is and is not in the file rather than implying the proof
  // is being withheld as a spoiler.
  const lines = asArray(nd.proof);
  const proof = lines.length
    ? svgFigure(entry, "nd", renderFitch(lines)) + ALTERNATIVES.nd
    : `<div class="ae-missing">This entry has a machine-checked proof, but its ` +
      `lines are not in <code>argument-db.json</code> — only the profile above.</div>`;

  // The derivation first: on the practice page this panel *is* the answer, and
  // a reader who opened it wants the proof, not its measurements. The profile
  // follows as a summary of what they just read.
  return {
    hint: spoilers
      ? "try it, then look"
      : `${nd.lines} lines, ${nd.uses_indirect_proof ? "indirect" : "direct"}`,
    html:
      proof +
      `<div style="margin-top:1.1rem">` +
      rules +
      `<div style="margin-top:.7rem">${profile}</div></div>`,
  };
}

/*
 * Fitch renderer, waiting on data. The shape it expects is the obvious one —
 * `{n, formula, rule, cites: [], depth}` per line, depth 0 at the top level —
 * and it is written now so that the day `nd.proof` appears, nothing else has
 * to change. If the emitted shape differs, this is the one function to adjust.
 */
/*
 * A Fitch derivation, drawn from `nd.proof`. Each line is
 * `{n, f, rule, depth, cites?, subs?}` -- the same objects the Python checker
 * verifies, so what a reader sees here is exactly what was checked.
 *
 * The scope lines are the whole visual grammar of a Fitch proof, so they are
 * drawn as real rules rather than indentation: one vertical rule per open
 * subproof, and a horizontal stroke under the last assumption of each, which is
 * what separates what is *assumed* from what is *derived*.
 */
const ND_RULE_LABEL = {
  Pr: "", As: "", Reit: "R",
  ConjI: "&I", ConjE: "&E", DisjI: "∨I", DisjE: "∨E",
  CondI: "⊃I", CondE: "⊃E", NegI: "∼I", NegE: "∼E",
  BicondI: "≡I", BicondE: "≡E", FalsumI: "⊥I",
};

function ndCitation(line) {
  const label = ND_RULE_LABEL[line.rule] ?? line.rule;
  if (!label) return "";
  const bits = asArray(line.cites).map(String);
  // A discharged subproof is cited as a range, with an en dash.
  for (const [a, b] of asArray(line.subs)) bits.push(`${a}–${b}`);
  return bits.length ? `${label}, ${bits.join(", ")}` : label;
}

/*
 * Which subproofs each line is inside, outermost first.
 *
 * Depth says how deep a line is; this says *which* subproofs it is in, and the
 * two come apart wherever subproofs are siblings — the two halves of a
 * biconditional proof, the two cases of a proof by cases. Those sit at the
 * same depth with no line between them at a shallower one, so drawing the
 * scope lines from depth alone runs them together and the second assumption
 * looks like it belongs to the first case. An assumption is what opens a
 * subproof, so an `As` line at depth d ends every subproof at depth d or
 * deeper and starts a fresh one. `latexgen/nd.py` computes the same paths, and
 * checks citations against them.
 */
function ndScopes(lines) {
  const out = [];
  let path = [];
  let made = 0;
  for (const l of lines) {
    const d = l.depth || 0;
    if (l.rule === "As") path = path.slice(0, Math.max(d - 1, 0)).concat(++made);
    else path = path.slice(0, d);
    out.push(path);
  }
  return out;
}

function renderFitch(lines) {
  const scope = ndScopes(lines);
  const rows = lines
    .map((l, i) => {
      const depth = l.depth || 0;
      const next = lines[i + 1];
      // The stroke goes under the last assumption of a run of them.
      const lastAssumption =
        (l.rule === "Pr" || l.rule === "As") &&
        !(next && (next.depth || 0) === depth && (next.rule === "Pr" || next.rule === "As"));

      // A line that starts a subproof its predecessor was not inside gets a
      // break above it, so two sibling cases read as two.
      const prev = scope[i - 1] || [];
      const restart =
        depth > 0 &&
        i > 0 &&
        scope[i].length <= prev.length &&
        scope[i][scope[i].length - 1] !== prev[scope[i].length - 1];

      const bars = Array.from(
        { length: depth },
        () => `<span class="ae-nd-bar"></span>`,
      ).join("");

      return (
        `<div class="ae-nd-line${restart ? " ae-nd-restart" : ""}">` +
        `<span class="ae-nd-n">${escapeHtml(l.n ?? "")}</span>` +
        `<span class="ae-nd-scope">${bars}` +
        `<span class="ae-nd-body${lastAssumption ? " ae-nd-assumed" : ""}">` +
        `${f(latexToGlyphs(l.f))}</span><span class="ae-nd-fill"></span></span>` +
        `<span class="ae-nd-cite">${escapeHtml(ndCitation(l))}</span>` +
        `</div>`
      );
    })
    .join("");
  return `<div class="ae-nd">${rows}</div>`;
}

/** ASCII source (`p > ~q`) into the house glyphs the rest of the page uses. */
function latexToGlyphs(src) {
  const map = { "~": "∼", "&": "&", "|": "∨", ">": "⊃", "=": "≡", "!": "⊥" };
  return [...String(src ?? "")].map((c) => map[c] ?? c).join("");
}


/* ------------------------------------------------- premises + relations */

/*
 * The brief calls this "a whole second exercise": which premise can you delete
 * without changing the verdict? So it is a reveal of its own, phrased as the
 * question rather than as a data dump.
 */
function renderPremiseAnalysis(entry) {
  const pa = asArray(entry.premise_analysis);
  if (!pa.length) return "";

  const idle = pa.filter((p) => p.idle);
  const display = asArray(entry._premises);

  const items = pa
    .map((p) => {
      const text = display[p.index] ?? p.premise;
      const chip = p.idle
        ? `<span class="ae-chip ae-chip-warn">idle</span>`
        : `<span class="ae-chip ae-chip-valid">load-bearing</span>`;
      const detail =
        typeof p.countermodels_without_it === "number"
          ? `<span class="ae-tree-from">delete it → ${p.countermodels_without_it} countermodel${p.countermodels_without_it === 1 ? "" : "s"}</span>`
          : "";
      return `<li><span class="ae-seq-num">${p.index + 1}.</span>${f(text)}${chip}${detail}</li>`;
    })
    .join("");

  const verdict = idle.length
    ? `<p class="ae-prose" style="margin-top:.7rem"><strong>${idle.length} idle premise${idle.length === 1 ? "" : "s"}.</strong> ` +
      `Deleting ${idle.length === 1 ? "it" : "them"} changes nothing — the argument was never using ${idle.length === 1 ? "it" : "them"}.</p>`
    : `<p class="ae-prose" style="margin-top:.7rem">Every premise is load-bearing: delete any one and the verdict changes.</p>`;

  return section(
    "Premises",
    revealPanel(
      "Which premise could you delete?",
      `<ul class="ae-premise-list">${items}</ul>${verdict}`,
      "the deletion test",
    ),
  );
}

/*
 * Brief item 8: `repairs_to` is the most important relation, and it is
 * rendered in both directions — an invalid form points at its repair, and the
 * repair points back at the form it fixes.
 */
function renderRelations(entry, db) {
  const cards = [];

  const card = (kind, id, blurb) => {
    const target = db.byId.get(id);
    if (!target) return "";
    const name = asArray(target.names)[0] || id;
    return (
      `<a class="ae-relation" href="#/${encodeURIComponent(id)}">` +
      `<span class="ae-rel-kind">${escapeHtml(kind)}</span>` +
      `<span class="ae-rel-name">${escapeHtml(name)}</span>` +
      `<div class="ae-rel-seq">${f(sequentText(target, target.display?.turnstiles?.table || "⊨"))}</div>` +
      (blurb
        ? `<p class="ae-prose" style="margin:.35rem 0 0;font-size:.85rem;color:var(--ae-muted)">${escapeHtml(blurb)}</p>`
        : "") +
      `</a>`
    );
  };

  if (entry.repairs_to) {
    cards.push(
      card(
        "repairs to",
        entry.repairs_to,
        "Add the missing premise and the argument goes through. The open branch above names the premise you were supplying without noticing.",
      ),
    );
  }

  for (const id of asArray(entry._repairedBy)) {
    cards.push(
      card(
        "repairs",
        id,
        "This is the form that needed fixing; the entry you are reading is the fix.",
      ),
    );
  }

  for (const id of asArray(entry._lookAlikes)) {
    cards.push(card("easily confused with", id, ""));
  }

  const html = cards.filter(Boolean).join("");
  if (!html) return "";
  return section("Related forms", `<div class="ae-relations">${html}</div>`);
}

function renderMetrics(entry) {
  const m = entry.metrics || {};
  const d = entry.difficulty || {};

  const stat = (k, v) =>
    v == null || v === ""
      ? ""
      : `<div class="ae-stat"><span class="ae-stat-k">${escapeHtml(k)}</span><span class="ae-stat-v">${escapeHtml(v)}</span></div>`;

  const sharp =
    typeof d.search_sharpness === "number"
      ? `${(d.search_sharpness * 100).toFixed(2)}%`
      : null;

  const body =
    `<div class="ae-nd-profile">` +
    stat("atoms", m.atom_count) +
    stat("premises", m.premise_count) +
    stat("formula depth", m.max_formula_depth) +
    stat("table", d.table) +
    stat("tree", d.tree) +
    stat("nd", d.nd) +
    (sharp ? stat("countermodels ÷ rows", sharp) : "") +
    `</div>` +
    (asArray(m.connectives).length
      ? `<div class="ae-tagrow"><span>connectives</span>${asArray(m.connectives)
          .map((c) => `<span class="ae-chip">${escapeHtml(c)}</span>`)
          .join("")}</div>`
      : "") +
    (sharp
      ? `<p class="ae-prose" style="margin-top:.7rem;font-size:.85rem;color:var(--ae-muted)">` +
        `Countermodels as a share of rows. <strong>Lower is harder</strong> — the fewer the rows that ` +
        `break the argument, the further you read before finding one.</p>`
      : "");

  return section("Measurements", revealPanel("Metrics and difficulty", body));
}

/*
 * Brief item 3: `course.note` is instructor-facing and carries ⚠ warnings
 * about attribution hazards. Not body copy — a closed disclosure, labelled as
 * such, at the very bottom of the entry.
 */
function renderInstructor(entry) {
  const note = entry.course?.note;
  if (!note) return "";

  const lectures = lectureMap(entry);
  const reach = Object.entries(lectures)
    .map(([k, v]) => `${k} from Lecture ${v}`)
    .join(" · ");
  const extra = entry.course?.earliest_lecture?.note;

  return (
    `<details class="ae-reveal ae-instructor"><summary>Instructor note` +
    `<span class="ae-reveal-hint">not part of the entry</span></summary>` +
    `<div class="ae-reveal-body"><div class="ae-prose">${paragraphs(note)}` +
    (reach ? `<p style="font-size:.85rem;color:var(--ae-muted)">Earliest: ${escapeHtml(reach)}.` +
      (extra ? ` ${escapeHtml(extra)}` : "") + `</p>` : "") +
    `</div></div></details>`
  );
}

/* --------------------------------------------------------------- shared */

/**
 * One method's worked answer, on its own — what the practice page reveals.
 *
 * `renderEntry` builds the whole entry: verdict, commentary, provenance, tags,
 * relations, metrics. The practice page wants none of that; it wants the table,
 * or the tree, or the derivation, and nothing else. So the three builders are
 * reachable individually here.
 */
export function methodPanel(entry, method) {
  const build = { table: buildTruthTable, tree: buildTree, nd: buildNd }[method];
  const built = build ? build(entry, false) : null;
  if (!built) return "";
  // The verdict leads. A reader who has just worked a table wants to know
  // whether they got it right before they start comparing rows.
  return answerLine(entry) + built.html;
}

/** The premises over the conclusion, with no turnstile — see below. */
export function problemStatement(entry) {
  // The turnstile is ⊨ or ⊭ by verdict, so it cannot appear on a page that is
  // asking the reader to work the verdict out. renderSequent's spoiler mode
  // withholds it, and this is the same stack without the surrounding chrome.
  const prems = asArray(entry._premises);
  const rows = prems
    .map(
      (p, i) =>
        `<div class="ae-seq-prem"><span class="ae-seq-num">${i + 1}.</span>${f(p)}</div>`,
    )
    .join("");
  const concl = `<div class="ae-seq-concl"><span class="ae-seq-num">∴</span>${f(entry._conclusion)}</div>`;
  // An inconsistency claim has no conclusion to state; see claimsInconsistency.
  const stack = claimsInconsistency(entry)
    ? rows
    : prems.length
      ? rows + `<div class="ae-seq-bar"></div>` + concl
      : concl;
  return `<div class="ae-sequent"><div class="ae-seq-stack">${stack}</div></div>`;
}

/** The card used in the catalogue and in the practice history. */
export function renderCard(entry, href) {
  const names = asArray(entry.names);
  const tags = [
    ...asArray(entry.tags?.defect).slice(0, 2),
    ...asArray(entry.tags?.topic).slice(0, 1),
  ];

  const apps = asArray(entry.appearances);
  const who = apps.length ? apps[0].who : null;

  return (
    `<a class="ae-card" href="${escapeHtml(href)}">` +
    `<div class="ae-card-top">` +
    `<span class="ae-card-name">${escapeHtml(names[0] || entry.id)}</span>` +
    (entry.verdict?.valid
      ? `<span class="ae-chip ae-chip-valid">valid</span>`
      : `<span class="ae-chip ae-chip-invalid">invalid</span>`) +
    tags
      .map((t) => `<span class="ae-chip">${escapeHtml(t)}</span>`)
      .join("") +
    `</div>` +
    `<div class="ae-card-seq">${f(sequentText(entry, entry.display?.turnstiles?.table || "⊨"))}</div>` +
    `<div class="ae-card-meta">` +
    `<span>${entry.metrics?.atom_count} atoms · ${entry.verdict?.rows} rows</span>` +
    `<span>table ${escapeHtml(entry.difficulty?.table || "—")}` +
    ` · tree ${escapeHtml(entry.difficulty?.tree || "—")}` +
    `${entry.nd?.exists ? ` · nd ${escapeHtml(entry.difficulty?.nd || "—")}` : ""}</span>` +
    (who ? `<span>${escapeHtml(who)}</span>` : "") +
    `</div></a>`
  );
}
