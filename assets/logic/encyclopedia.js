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

const DB_URL = "/argument-db.json";

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
  for (const e of entries) {
    e._lookAlikes = [...e._lookAlikes].filter((id) => id !== e.id);
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
    .replace(/`([^`]+)`/g, "<code>$1</code>")
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
  return `<span class="ae-f">${escapeHtml(formula)}</span>`;
}

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
      `<span class="ae-chip ae-chip-accent">${escapeHtml(used.join(", "))}</span>`,
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
  const prems = asArray(entry.display?.premises);
  const concl = entry.display?.conclusion || "";
  const turnstile = entry.display?.turnstiles?.table || "⊨";

  const rows = prems.map(
    (p, i) =>
      `<div class="ae-seq-prem"><span class="ae-seq-num">${i + 1}.</span>${f(p)}</div>`,
  );

  const body = prems.length
    ? rows.join("") +
      `<div class="ae-seq-bar"></div>` +
      `<div class="ae-seq-concl"><span class="ae-seq-num">∴</span>${f(concl)}</div>`
    : // Not `⊢`: a no-premise entry is a *claimed* theorem, not a proved one,
      // and four of them are invalid. `∴` asserts nothing either way.
      `<div class="ae-seq-concl"><span class="ae-seq-num">∴</span>${f(concl)}</div>`;

  const atoms = entry.metrics?.atom_count;
  const scale = atoms ? `${atoms} atom${atoms === 1 ? "" : "s"}` : "";

  let note;
  if (spoilers) {
    note = prems.length
      ? [`${prems.length} premise${prems.length === 1 ? "" : "s"}`, scale]
          .filter(Boolean)
          .join(" · ")
      : `No premises — the conclusion is offered as a theorem in its own right.${scale ? ` ${scale}.` : ""}`;
  } else {
    note = prems.length
      ? `${prems.length} premise${prems.length === 1 ? "" : "s"} · ${f(entry.display?.sequent || "")}`
      : `No premises — the conclusion is asserted as a theorem. ${f(entry.display?.sequent || "")}`;
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
  if (valid) {
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
  const premCount = asArray(entry.display?.premises).length;

  // `columns` is premises followed by the conclusion. Splitting on the premise
  // count, rather than assuming the last column, keeps a no-premise theorem
  // (where columns is just the conclusion) correct.
  const head =
    `<tr>` +
    atoms.map((a) => `<th>${escapeHtml(a)}</th>`).join("") +
    cols
      .map(
        (c, i) =>
          `<th class="${i === 0 || i === premCount ? "ae-tt-split" : ""}">${escapeHtml(c)}</th>`,
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
        `<td class="${premCount === 0 ? "ae-tt-split" : "ae-tt-split"}">${escapeHtml(r.conclusion ?? "")}</td>` +
        `<td class="ae-tt-split ae-tt-mark">${r.countermodel ? "←" : ""}</td>`;

      return `<tr class="${cls}">${cells}</tr>`;
    })
    .join("");

  const legend =
    `<div class="ae-tt-legend">` +
    `<span><span class="ae-swatch" style="background:var(--ae-accent-soft)"></span>all premises true</span>` +
    `<span><span class="ae-swatch" style="background:var(--ae-invalid-bg)"></span>countermodel — premises true, conclusion false</span>` +
    `</div>`;

  return {
    hint: `${tt.rows.length} rows, ${atoms.length} atom${atoms.length === 1 ? "" : "s"}`,
    html:
      `<div class="ae-table-wrap"><table class="ae-tt"><thead>${head}</thead><tbody>${body}</tbody></table></div>` +
      legend,
  };
}

/* ------------------------------------------------------------- the tree */

function buildTree(entry, spoilers = false) {
  const t = entry.tree;
  if (!t || !t.tree) return null;

  const roots =
    `<div class="ae-tree-roots">` +
    asArray(t.roots)
      .map(
        (r, i) =>
          `<div class="ae-tree-root"><span class="ae-seq-num">${i + 1}.</span>${f(r)}</div>`,
      )
      .join("") +
    `</div>`;

  // "2 open branches" is the verdict in other words, so under spoilers the
  // hint reports only the size of the job, not how it comes out.
  const branches = (t.closed_branches || 0) + (t.open_branches || 0);
  const hint = spoilers
    ? `${branches} branch${branches === 1 ? "" : "es"}, depth ${t.branch_depth}`
    : `${t.closed_branches} closed` +
      (t.open_branches ? `, ${t.open_branches} open` : "") +
      `, depth ${t.branch_depth}`;

  return {
    hint,
    html:
      `<p style="font-size:.84rem;color:var(--ae-muted);margin:0 0 .5rem">` +
      `The premises and the <em>negated</em> conclusion, stacked. A branch closes (<strong>×</strong>) ` +
      `when it holds a sentence and its negation; a branch that runs out of rules while still open (<strong>○</strong>) ` +
      `is a countermodel.</p>` +
      roots +
      `<div class="ae-tree">${treeNode(t.tree)}</div>`,
  };
}

function treeNode(node) {
  const parts = [];

  for (const a of asArray(node.added)) {
    parts.push(
      `<div class="ae-tree-line">${f(a.formula)}` +
        `<span class="ae-tree-from">${escapeHtml(a.rule || "")} from ${escapeHtml(a.from || "")}</span></div>`,
    );
  }

  if (node.status === "closed") {
    parts.push(`<div class="ae-tree-status ae-tree-closed">× closed</div>`);
  } else if (node.status === "open") {
    parts.push(`<div class="ae-tree-status ae-tree-open">○ open</div>`);
    if (node.model) {
      parts.push(
        `<div class="ae-tree-model">${escapeHtml(assignmentText(node.model))}` +
          (asArray(node.unconstrained).length
            ? ` &nbsp;(${escapeHtml(asArray(node.unconstrained).join(", "))} unconstrained)`
            : "") +
          `</div>`,
      );
    }
  }

  const kids = asArray(node.children);
  if (kids.length) {
    if (node.branched_on) {
      parts.push(
        `<div class="ae-tree-branch">branches on ${escapeHtml(node.branch_rule || "")} ` +
          `applied to <span class="ae-f">${escapeHtml(node.branched_on)}</span></div>`,
      );
    }
    parts.push(
      `<ul>${kids.map((k) => `<li>${treeNode(k)}</li>`).join("")}</ul>`,
    );
  }

  return parts.join("");
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
    ? renderFitch(lines)
    : `<div class="ae-missing">A proof exists and has been machine-checked ` +
      `(<code>verified: true</code>), but <code>argument-db.json</code> does not yet ` +
      `carry its lines — only the profile above. Have <code>build.py</code> emit an ` +
      `<code>nd.proof</code> array and it will render here as a Fitch proof.</div>`;

  return {
    hint: spoilers
      ? "try it, then look"
      : `${nd.lines} lines, ${nd.uses_indirect_proof ? "indirect" : "direct"}`,
    html: profile + rules + `<div style="margin-top:.9rem">${proof}</div>`,
  };
}

/*
 * Fitch renderer, waiting on data. The shape it expects is the obvious one —
 * `{n, formula, rule, cites: [], depth}` per line, depth 0 at the top level —
 * and it is written now so that the day `nd.proof` appears, nothing else has
 * to change. If the emitted shape differs, this is the one function to adjust.
 */
function renderFitch(lines) {
  const rows = lines
    .map((l) => {
      const indent = 0.9 * (l.depth || 0);
      const cites = asArray(l.cites).join(", ");
      return (
        `<div style="display:flex;gap:.7rem;align-items:baseline;padding:.12rem 0">` +
        `<span class="ae-seq-num">${escapeHtml(l.n ?? "")}</span>` +
        `<span style="padding-left:${indent}rem;padding-right:.5rem;` +
        `border-left:${l.depth ? "1px solid var(--ae-rule-2)" : "none"}">` +
        `${f(l.formula || "")}</span>` +
        `<span class="ae-tree-from">${escapeHtml(l.rule || "")}${cites ? ` ${cites}` : ""}</span>` +
        `</div>`
      );
    })
    .join("");
  return `<div class="ae-tree">${rows}</div>`;
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
  const display = asArray(entry.display?.premises);

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
      `<div class="ae-rel-seq">${f(target.display?.sequent || "")}</div>` +
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
    `<div class="ae-card-seq">${f(entry.display?.sequent || "")}</div>` +
    `<div class="ae-card-meta">` +
    `<span>${entry.metrics?.atom_count} atoms · ${entry.verdict?.rows} rows</span>` +
    `<span>table ${escapeHtml(entry.difficulty?.table || "—")}` +
    ` · tree ${escapeHtml(entry.difficulty?.tree || "—")}` +
    `${entry.nd?.exists ? ` · nd ${escapeHtml(entry.difficulty?.nd || "—")}` : ""}</span>` +
    (who ? `<span>${escapeHtml(who)}</span>` : "") +
    `</div></a>`
  );
}
