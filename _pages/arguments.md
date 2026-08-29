---
layout: page
permalink: /arguments/
title: argument forms # the navbar label, lower-case like its siblings
display_title: Argument Forms
description: A browsable encyclopedia of propositional argument forms, each one taken from somewhere it actually turned up in philosophy, with its truth table, truth tree and natural-deduction analysis.
nav: true
nav_order: 6
dropdown: true
children:
  - title: browse
    permalink: /arguments/
  - title: practice
    permalink: /arguments/practice/
---

<!--
  The navbar renders a dropdown's parent as `href="#"` (see header.liquid in
  the al_folio_core gem), so this page is not reachable from the parent label
  — the `browse` child above is what links to it. Same arrangement, and same
  reason, as _pages/games.md.

  Everything on this page is drawn client-side from /argument-db.json by
  assets/logic/browse.js. The stylesheet and both scripts live in
  assets/logic/, outside assets/css/, so purgecss never sees them: almost every
  class name here only ever appears inside a JS template string, and purgecss
  would strip the lot.
-->

<link rel="stylesheet" href="{{ '/assets/logic/encyclopedia.css' | relative_url }}" />

<div class="ae-scope">

  <div id="ae-intro">
  <p>
    Every form in here has been seen in the wild. The inclusion criterion is not
    that an argument is instructive in the abstract — it is that somebody,
    somewhere in the philosophical literature, actually used this form, argued
    about it, or got caught out by it. So this is really a catalogue of episodes
    in philosophy that happen to have a shape: the Dutch book argument, Pollock's
    pink elephant, the <em>ratio</em>/<em>obiter</em> distinction in case law,
    Curry's paradox, the Axiom of Choice.
  </p>

  <p>
    Every verdict is machine-verified. The truth tables, countermodels, trees and
    metrics are computed from the formulas rather than asserted, and the
    natural-deduction proofs are checked by a Fitch checker. Each entry hides its
    table, tree and proof behind a toggle, so you can attempt the thing before
    you see the answer — or go straight to
    <a href="{{ '/arguments/practice/' | relative_url }}">practice</a>, which
    draws one at random and hides the answer by default.
  </p>
  </div>

  <div id="ae-app">
    <p class="ae-loading">Loading the argument database…</p>
  </div>

</div>

<script type="module" src="{{ '/assets/logic/browse.js' | relative_url }}"></script>

<noscript>
  <p><strong>This page needs JavaScript</strong> — the catalogue is built in the
  browser from the argument database. The database itself is a plain JSON file
  at <a href="{{ '/argument-db.json' | relative_url }}">/argument-db.json</a> if
  you would rather read it directly.</p>
</noscript>
