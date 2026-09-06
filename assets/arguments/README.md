# The argument-form encyclopedia

A browsable catalogue of propositional argument forms, built for PHIL 1115
(First-Order Logic, Yale) but meant to be useful to anyone. Published at:

- **[/arguments/](https://danielgrimmer.github.io/arguments/)** — the overview
- **[/arguments/browse/](https://danielgrimmer.github.io/arguments/browse/)** — the catalogue
- **[/arguments/practice/](https://danielgrimmer.github.io/arguments/practice/)** — construction practice and random argument/proof practice
- **[/arguments/practice/#constructing-tables](https://danielgrimmer.github.io/arguments/practice/#constructing-tables)** — the fixed Lecture 3 starting sequence

Everything the site needs is in this folder. The three Jekyll pages live in
`_pages/` because Jekyll requires it, and they do nothing but load these files.

## What this is, and what makes it unusual

**Every form here has been seen in the wild.** The inclusion criterion is not
that an argument is instructive in the abstract — it is that somebody, somewhere
in the philosophical literature, actually used it, argued about it, or got
caught out by it. That is what `appearances` records: one entry per episode,
with a source and usually a URL. So this is really a catalogue of episodes in
philosophy that happen to have a shape — the Dutch book argument, Pollock's pink elephant, the
*ratio*/*obiter* distinction in case law, Curry's paradox, the Axiom of Choice.

A few entries carry `appearances_pending: true` instead. These are forms
proposed for the course that no one has yet been credited with using, and the
page prints **Provenance pending** where the citations would go. They are the
exception the criterion admits to rather than a hole in it: a form that says
*not yet* is honest in a way that either dropping it or crediting it to nobody
in particular would not be. Finding one a source is standing work.

**Every verdict is machine-verified.** Truth tables, countermodels, trees and
metrics are computed from the formulas; nothing is asserted on authority.

## Files

| File | What it is |
| --- | --- |
| `argument-db.json` | The database. Generated upstream — see *Do not hand-edit* below |
| `encyclopedia.js` | Data loading, search, filters, and every renderer. All schema knowledge lives here |
| `browse.js` | The catalogue controller: search, facets, and the `#/<id>` routes |
| `practice.js` | Activity routing, the random draw and its shuffled bag |
| `construction.js` | The fixed calculation sequence and worked intermediate columns; see `docs/truth-table-construction.md` |
| `encyclopedia.css` | All styles, scoped to `.ae-scope` |
| `svg/` | The typeset LaTeX, one SVG per (form, view) — table, compact table, tree, derivation — plus `index.json`; a build artifact, see below |

The pages are `_pages/arguments.md` (the overview, and the navbar dropdown parent),
`_pages/argumentsbrowse.md` and `_pages/argumentspractice.md`.

## The typeset blocks in `svg/`

Each entry carries the LaTeX for its truth table, its tree and its derivation,
in exactly the notation the course uses — and that LaTeX is what the reader
sees. It cannot be rendered in the browser: KaTeX and MathJax typeset formulas,
and a Fitch derivation and a tableau are neither. So the blocks are compiled by
LaTeX and the output is committed here, one file per (form, method):

```
cd EncyclopediaOfArguments/latexgen
python3 svg.py              # regenerate all 123
python3 svg.py --only peirce-law
python3 svg.py --check      # is anything stale?
```

It needs a TeX installation with `qtree` and `fitch`, plus `dvisvgm`. The route
is `latex` → DVI → `dvisvgm`, deliberately: DVI is dvisvgm's native input, its
PDF path wants a Ghostscript older than most machines have, and a generic
PDF-to-SVG converter scrambles qtree and fitch — both draw with subsetted
Type-1 fonts whose glyph mapping does not survive.

Three things happen to each SVG on the way out, and all three are load-bearing:

- **Every id is prefixed with `<id>-<method>`.** Several of these end up inlined
  in one page, and dvisvgm names its glyphs `g0-88`, `g1-24`, … — unprefixed,
  a tree would be drawn with a truth table's glyphs.
- **The ink becomes `currentColor`.** This is why the page inlines the SVG
  rather than using `<img>`: an `<img>` cannot see the host page's colour, and
  the site has a dark mode.
- **The absolute width and height become an `em` width**, taken from the real
  typeset width at 11pt. So a table sits at the same size relative to the prose
  as it does in the handout, at whatever text size the reader has chosen. A
  block wider than the column scrolls rather than shrinking.

Because GitHub Pages builds with Jekyll alone and has no LaTeX, these are a
build artifact that lives in the repo — which means the one thing that can go
wrong is silent staleness. `index.json` records the hash of the block each SVG
came from; `svg.py --check` reports drift, and `_tests/argument-forms.test.mjs`
fails on it.

The HTML renderers in `encyclopedia.js` (`buildTruthTable`, `buildTree`,
`renderFitch`) are not dead code. Each stays in place underneath as the
fallback, so a form whose SVG has not been generated yet, or a reader behind
something that blocks the fetch, still gets a readable table, tree and proof.

## Growing it

**Replace `argument-db.json`. Nothing else needs touching.** The facet
dropdowns, the atom-count and lecture ranges, and the search index are all
derived from the file at load time, so new entries, new tags and new facet
values appear on their own.

Two caveats:

- **The JSON is both authored and generated, and the line between them is
  exact.** The authored fields -- `premises`, `conclusion`, `names`, `english`,
  `interest`, `appearances`, `tags`, `course`, `difficulty.nd` -- are edited in
  `argument-db.json` directly; the derivations are authored in
  `latexgen/proofs.py`. Everything else (`display.*`, `truth_table.*`, `tree.*`,
  the `nd` profile and LaTeX, `difficulty.table`/`.tree`, the manifest) is
  written by `build.py --write` from those, and an edit to a generated field is
  silently reverted on the next build. `build.py` validates as it goes and
  refuses a valid entry with no proof, a proof that does not check, a table that
  does not recompute, a tree node that is not a subformula, or a quote it cannot
  find. `EncyclopediaOfArguments/LATEX_STYLE_GUIDE.md` §7 lists every field and
  which side of the line it is on.
- **Formulas are fully parenthesised, and `build.py` enforces it.** This
  course's language puts a parenthesis around every binary application and lets
  you drop only the outermost pair, so `p & q ∨ r` and `p ⊃ q ⊃ p` are not
  formulas. A normalisation pass reprints every stored formula that way — the
  ASCII sources, the display strings, the formulas on tree nodes and the lines
  of each derivation — on every build, idempotently. New entries can be written
  with whatever parentheses come naturally; the build settles the spelling.
- **The file used to sit at the repo root.** It moved here when the
  encyclopedia was packaged into one folder. If you regenerate it, drop it at
  `assets/arguments/argument-db.json` — a copy left at the root is served but
  read by nothing.

At ~12 KB per entry, the single-fetch design gets uncomfortable somewhere around
200–300 entries. When it does, the fix is to have Jekyll emit a small index
(ids, sequents, tags, difficulty, verdict) plus one file per entry at build
time, and fetch the heavy `truth_table` and `tree` blocks only on reveal.

## Things that are easy to get wrong

These are load-bearing. Each one is a correctness bug, not a styling choice.

1. **Route on `id`, never on `canonical.canon`.** `canon` is canonical only up
   to classical equivalence, so *every n-atom tautology collapses to the same
   value* — Peirce's Law, the contraction axiom and assertion all come out
   `P2-f`. Six entries are flagged `canonical.degenerate` for this. `canon` is
   for dedup and cross-referencing; `id` is the URL.

2. **`course.quarantined` entries are dropped at load.** True means the form is
   reserved for an exam and must not appear on the public site or in practice
   sets. None are set today; the filter is in `prepare()` from day one, so
   setting the flag is all it takes to pull a form.

3. **`course.note` is instructor-facing.** It carries ⚠ warnings about
   attribution hazards and what the encoding loses. It renders only inside the
   closed "Instructor note" disclosure at the foot of an entry, never as body
   copy.

4. **The formulas are built from the ASCII source, *not* from `display` — and
   this is a deliberate departure from the original brief.** The generator emits
   `display.premises`, `display.conclusion` and `display.sequent` with *minimal*
   parentheses, and for a left-nested conditional that is not merely terse but
   wrong. `notation.precedence` declares the conditional right-associative, so
   Peirce's Law, whose source is `((p > q) > p) > p`, is emitted as
   `p ⊃ q ⊃ p ⊃ p` — which re-parses as `p ⊃ (q ⊃ (p ⊃ p))`. That is a different
   formula, and a tautology in every logic, when the entire interest of Peirce's
   Law is that it is not.

   **Seven formulas across seven entries are affected**, all of them the
   substructural ones where the nesting carries the point: `peirce-law`,
   `contraction-w`, `curry-complete`, `curry-contraction-only`,
   `abelian-axiom`, `fixed-point-type`, `assertion-t`. The bad strings propagate
   into `truth_table.columns`, `tree.roots`, `tree.*.from` and
   `tree.*.branched_on`, since those quote the display forms.

   `attachFormulas()` therefore rebuilds each formula from the ASCII in
   `premises` / `conclusion` — which carries the author's own parentheses and is
   unambiguous — translated through the database's own `notation.ascii` map, and
   builds a per-entry repair map so the table headers and the tree can be
   corrected by exact match. `sequentText()` assembles the sequent from those
   parts rather than reading `display.sequent`.

   **The real fix belongs in `build.py`:** emit `display` with enough
   parentheses to survive a round trip through the stated precedence. When that
   lands, this whole layer can be deleted and `display` read directly again.
   `_tests/argument-forms.test.mjs` fails if any entry regresses.

5. **`appearances[].fidelity` matters.** `verbatim` / `paraphrase` /
   `our reconstruction` are styled differently, and the label rides with the
   quote rather than sitting only in the header. Presenting a reconstruction as
   a quotation is how a site ends up appearing to attribute to the *Stanford
   Encyclopedia* something it does not say.

6. **An invalid entry has no ND proof, and that is not an error.** `nd.exists`
   is `false` and `nd.note` says where a proof attempt breaks down — "`o` occurs
   in no premise, so no rule can ever introduce it" is the point of the
   exercise. It renders; it is not hidden.

7. **The prose fields carry Markdown.** `interest`, `countermodel_gloss` and
   `course.note` use `**bold**` and `` `code` ``. `md()` handles exactly that
   much and escapes first — it is not a general Markdown parser and should not
   become one.

8. **`repairs_to` is the most important relation.** It links an invalid form to
   the valid one you get by adding the missing premise, and that link *is* the
   pedagogy: the open branch names the premise you supplied without noticing.
   It renders in both directions — `prepare()` builds the reverse edges, since
   the data only stores one way round. `looks_like` links forms readers confuse,
   and is likewise made symmetric.

9. **`tree` is a structure ready to draw**, not a picture. Each node has `added`
   (`{formula, from, rule}`), `children`, and `status` (`open`/`closed`/`null`);
   branch points carry `branched_on` and `branch_rule`; open leaves carry
   `model` and `unconstrained`. Closed branches are marked ×, open ones ○. It is
   drawn as nested lists rather than SVG: a tree six branch-points deep is wider
   than any phone, and nesting turns depth into indentation.

## Spoilers: what counts as the answer

`renderEntry(entry, db, { spoilers })` is the whole mechanism. The catalogue
passes `false`, the practice page passes `true`. Under `spoilers` the reader
gets the sequent, the English gloss and the provenance; everything else is
behind a reveal.

**The verdict leaks from more places than you would expect.** Each of these was
found by drawing all 35 entries and scanning the visible text, and each is
withheld under `spoilers` and restored with the verdict:

- `display.sequent` and `display.turnstiles` encode it directly: ⊨/⊭, ⊢/⊬, ⊢ND/⊬ND.
- The `defect` tag facet names the fault — `vacuous validity`, `is/ought gap`,
  `missing bridge premise`. The `nonclassical` facet does too: `classical-fails`.
- The tree's open-branch count. "2 open" is "invalid" in other words.
- The ND hint. "No proof exists — why?" answers the question being asked.
- Some `appearances[].quote` text. One verbatim SEP passage contains `⊭`; two of
  our own reconstructions read "show that this argument is tree-invalid".
  Rewriting a source is not an option, so under `spoilers` the attribution stays
  visible and only the quoted text goes behind a small disclosure.

`interest` counts as an answer too — it routinely opens with a clause like "the
argument is valid vacuously".

**If you add a field to the entry view, ask first whether it gives away
validity.**

## Course-exact LaTeX blocks

Each entry is to carry a LaTeX block per method, set in the PHIL 1115 house
notation, so the encyclopedia reads as an extension of the course handouts.
**[`EncyclopediaOfArguments/LATEX_STYLE_GUIDE.md`](../../EncyclopediaOfArguments/LATEX_STYLE_GUIDE.md)
is the spec** — macros, both table layouts, the tree and Fitch conventions, the
JSON schema for the blocks, and the traps.

Two things from it that bear on this folder's code:

- The blocks use `qtree` and `fitch`, **neither of which any browser maths
  renderer supports**. They are the canonical print artifact; the site keeps
  rendering from the structured data, as it does today.
- The blocks must be built from the ASCII in `premises`/`conclusion`, not from
  `display.*`, for the reason in item 4 above.

## Natural-deduction proofs are not in the data yet

`nd` carries the *profile* of each proof — `lines`, `rules_used`,
`subproof_count`, `max_subproof_depth`, `assumption_count`,
`uses_indirect_proof`, `verified` — but not the proof lines. All 18 valid
entries report `verified: true`, so the proofs exist and were checked by a Fitch
checker upstream; they are simply not serialised into `argument-db.json`.

Until they are, the ND panel shows the profile and says plainly that the lines
are not in the file. **`renderFitch()` is already written and waiting**: have
`build.py` emit an `nd.proof` array of `{n, formula, rule, cites, depth}`
objects (depth 0 at the top level) and the proofs render with no other change.
If the emitted shape differs, `renderFitch()` is the one function to adjust.

Invalid entries are unaffected — they carry `nd.note` and it renders today.

## Two CSS rules that are not decoration

- **`.ae-scope [hidden] { display: none !important }`.** The page scripts swap
  views with `el.hidden`, and the UA's `[hidden] { display: none }` loses to any
  author-origin `display` rule — `.ae-list` is a grid, `.ae-status` is a flex
  row. Without this, the entire catalogue renders underneath each entry.
- **`min-width: 0` on grid items.** A grid item's `min-width` defaults to `auto`,
  so it refuses to shrink below its content — and the cards contain
  `white-space: nowrap` sequents. Without it the page scrolls sideways on a
  phone instead of the sequent scrolling inside its own box.

This stylesheet also lives outside `assets/css/` deliberately, so **purgecss
never sees it**: nearly every class name appears only inside a JS template
string and would otherwise be stripped.

## Scope

A pilot slice: 35 entries (18 valid, 17 invalid), 1–6 atoms, 48 appearances,
out of a larger inventory still being mined. The schema is stable.

**Propositional logic only.** Predicate-logic forms need a different identity
scheme and a model-theoretic spectrum (smallest countermodel domain, countermodel
counts at |D| = 1, 2, 3) rather than a truth table. The renderer is built for
that: `renderEvidence()` runs a list of section builders, each returning `null`
when its data is absent, so a later entry carrying a `spectrum` block instead of
`truth_table` is one new builder in that list and nothing else.
