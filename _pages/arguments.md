---
layout: page
permalink: /arguments/
title: argument forms # the navbar label, lower-case like its siblings
display_title: Argument Forms
description: An encyclopedia of the argument forms that actually turn up in philosophical writing — each with its truth table, its truth tree, and a note on where it was found.
nav: true
nav_order: 6
dropdown: true
children:
  - title: overview
    permalink: /arguments/
  - title: divider
  - title: browse
    permalink: /arguments/browse/
  - title: practice
    permalink: /arguments/practice/
---

<!--
  The overview. The navbar renders a dropdown's parent as `href="#"` (see
  header.liquid in the al_folio_core gem), so this page is not reachable from
  the parent label — the `overview` child above is what links to it. It also
  needs its own `permalink` regardless: without one Jekyll still publishes the
  file at /_pages/arguments/ and lists that URL in sitemap.xml. Same
  arrangement, and same reasons, as _pages/games.md.

  This page is static prose. The catalogue is _pages/argumentsbrowse.md and the
  drill is _pages/argumentspractice.md; everything they run on is documented in
  assets/arguments/README.md.
-->

Most logic courses teach argument forms with invented examples: if it rains the
match is cancelled, all men are mortal, some such. This is a catalogue of the
other kind. **Every form here has been seen in the wild** — the criterion for
inclusion is not that an argument is instructive in the abstract, but that
somebody, somewhere in the philosophical literature, actually used it, argued
about it, or got caught out by it.

So it is really a catalogue of episodes in philosophy that happen to have a
shape. The Dutch book argument for probabilism, and the exact line where it
crosses from _is_ to _ought_. Pollock's pink elephant, and why a defeater is not
a denial. The _ratio_/_obiter_ distinction as courts actually deploy it. Curry's
paradox, and which structural rule you have to give up. The Axiom of Choice, in
its finite shadow. Each entry says where it was found and quotes the source.

**Every verdict is machine-verified.** The truth tables, countermodels, trees
and metrics are computed from the formulas rather than asserted on anybody's
authority, and the natural-deduction proofs are checked by a Fitch checker.
Where a form is invalid, the entry does not merely say so — it shows you the
countermodel, names the premise you were supplying without noticing, and links
to the repaired form that adding it produces.

<!--
  Styled inline rather than with the theme's `btn` classes: those are only given
  a border inside `.publications` (Bootstrap compat is off in al-folio v1.x), so
  they render as bare links anywhere else. Inline styles also survive purgecss,
  which only rewrites _site/assets/css/*.css. Same approach as _pages/games.md.
-->
<style>
  .ae-doors {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1.25rem;
    margin: 2rem 0;
  }
  .ae-door {
    display: flex;
    flex-direction: column;
    padding: 1.25rem 1.4rem 1.4rem;
    border: 1px solid var(--global-divider-color);
    border-radius: 6px;
    background-color: var(--global-card-bg-color);
  }
  .ae-door h3 {
    margin: 0 0 0.6rem;
    font-size: 1.15rem;
  }
  .ae-door h3 a {
    color: var(--global-theme-color);
    text-decoration: none;
  }
  .ae-door p {
    margin: 0 0 1.1rem;
  }
  .ae-door .ae-go {
    margin-top: auto;
    display: inline-block;
    align-self: flex-start;
    padding: 0.45rem 1rem;
    border: 1px solid var(--global-theme-color);
    border-radius: 4px;
    color: var(--global-theme-color);
    text-decoration: none;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }
  .ae-door .ae-go:hover {
    background-color: var(--global-theme-color);
    color: var(--global-bg-color);
  }
</style>

<div class="ae-doors">
  <div class="ae-door">
    <h3><a href="{{ '/arguments/browse/' | relative_url }}">Browse</a></h3>
    <p>The whole catalogue, searchable by name, prose, tag, source, figure or
    rule. Read an entry with its table, tree and commentary open.</p>
    <a class="ae-go" href="{{ '/arguments/browse/' | relative_url }}">Open the catalogue →</a>
  </div>

  <div class="ae-door">
    <h3><a href="{{ '/arguments/practice/' | relative_url }}">Practice</a></h3>
    <p>One argument at a time, drawn at random, with the answer hidden. Decide
    for yourself, then reveal as much or as little as you need.</p>
    <a class="ae-go" href="{{ '/arguments/practice/' | relative_url }}">Draw an argument →</a>
  </div>
</div>

## What is in an entry

Each form is presented three ways, because a first-order logic course teaches
three methods and they illuminate different things:

- **The truth table** settles the question by brute force, and shows you exactly
  which row breaks an invalid argument. Some of them are needles: the Dutch book
  form used in lecture has one countermodel in sixty-four rows.
- **The truth tree** shows you _why_. A branch that closes is a contradiction
  you were forced into; a branch that stays open is a countermodel the tree
  built for you.
- **The natural-deduction analysis** asks whether you can derive it. Where no
  proof exists, the entry says where the attempt breaks down — and that is
  usually the most interesting sentence on the page. "`o` occurs in no premise,
  so no rule can ever introduce it" is about as clean a statement of Hume's gap
  as a formal system can offer.

Alongside those: the provenance, with quotations marked as verbatim, paraphrase
or our own reconstruction; the tags, including what exactly has gone wrong with
an invalid form; and a deletion test showing which premises were doing work and
which were idle all along.

## For students in PHIL 1115

The practice page can restrict itself to what we have covered. Each form records
the earliest lecture at which each method becomes available — separately per
method, because the same argument can be a Lecture 4 truth table and a Lecture
11 proof — so you can ask for problems you actually have the tools for.

A word on notation. Formulas are set in the course's symbols: `∼` for negation,
`&` for conjunction, `∨` for disjunction, `⊃` for the conditional, `≡` for the
biconditional, and `⊥` for falsum. The turnstile changes with the method: `⊨`
for semantic consequence, `⊢` for the tree, `⊢ND` for a derivation — and each
gets a slash through it where the argument fails.

## Scope

This is a pilot slice — thirty-five forms out of a much larger inventory still
being mined, and the collection will grow. It is propositional logic only for
now; predicate-logic forms need a different treatment, since a truth table is no
longer the right kind of evidence for them.

Corrections and suggestions are welcome, particularly a form you have seen in
print that ought to be here.
