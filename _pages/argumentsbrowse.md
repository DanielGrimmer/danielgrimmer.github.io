---
layout: page
permalink: /arguments/browse/
title: browse # the navbar label, lower-case like its siblings
display_title: Browse the Argument Forms
description: Every form in the encyclopedia, searchable by name, prose, tag, source, figure or rule of natural deduction.
nav: false # surfaced via the 'argument forms' dropdown in _pages/arguments.md
---

<!--
  The catalogue. Surfaced as the second child of the 'argument forms' dropdown;
  see _pages/arguments.md, which is the overview this page sits behind.

  Everything here is drawn client-side from argument-db.json by
  assets/arguments/browse.js, which also owns the `#/<id>` routes: an entry is
  a hash on this page rather than a page of its own, so a form's permalink is
  /arguments/browse/#/ex-falso.

  The stylesheet and both scripts live in assets/arguments/, outside
  assets/css/, so purgecss never sees them: almost every class name here only
  ever appears inside a JS template string, and purgecss would strip the lot.
-->

<link rel="stylesheet" href="{{ '/assets/arguments/encyclopedia.css' | relative_url }}" />

<div class="ae-scope">

  <div id="ae-intro">
  <p>
    Search across everything — names, prose, tags, sources, figures, the number
    of atoms, and which rules a proof uses. The filters and the selected form
    both live in the address bar, so any view you reach is a link you can hand
    to somebody. New to this? Start with the
    <a href="{{ '/arguments/' | relative_url }}">overview</a>, or go straight to
    <a href="{{ '/arguments/practice/' | relative_url }}">practice</a>.
  </p>
  </div>

  <div id="ae-app">
    <p class="ae-loading">Loading the argument database…</p>
  </div>

</div>

<script type="module" src="{{ '/assets/arguments/browse.js' | relative_url }}"></script>

<noscript>
  <p><strong>This page needs JavaScript</strong> — the catalogue is built in the
  browser from the argument database. The database itself is a plain JSON file
  at <a href="{{ '/assets/arguments/argument-db.json' | relative_url }}">/assets/arguments/argument-db.json</a>
  if you would rather read it directly.</p>
</noscript>
