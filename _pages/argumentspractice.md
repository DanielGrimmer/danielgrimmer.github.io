---
layout: page
permalink: /arguments/practice/
title: practice # the navbar label, lower-case like its siblings
display_title: Practice
description: Draw an argument form at random and work it out before you look. The verdict, the table, the tree and the proof all stay hidden until you ask for them.
nav: false # surfaced via the 'argument forms' dropdown in _pages/arguments.md
---

<!--
  Surfaced as the second child of the 'argument forms' dropdown; see
  _pages/arguments.md. Shares assets/arguments/encyclopedia.{css,js} with the
  catalogue and adds assets/arguments/practice.js for the draw.

  The filename has no hyphen on purpose: al-folio's own _pages files are all
  single words, and Jekyll takes the URL from `permalink` regardless.
-->

<link rel="stylesheet" href="{{ '/assets/arguments/encyclopedia.css' | relative_url }}" />

<div class="ae-scope">

  <p>
    Pick a method, then draw. You get the argument, an English rendering of it,
    and a note on where it comes from — nothing else. Decide whether it is valid
    <em>before</em> you open anything: the verdict, the commentary, the truth
    table, the tree and the natural-deduction analysis are each behind their own
    toggle, so you can check one step at a time rather than seeing the whole
    answer at once.
  </p>

  <p>
    The draw is a shuffled bag rather than a coin flip — you will see every form
    in the filtered set once before any of them comes round again, and the site
    remembers where you were if you close the tab. The
    <em>only what we have covered</em> filter uses the earliest lecture at which
    each method becomes available, which is tracked separately per method: the
    same argument can be a Lecture 4 truth table and a Lecture 11 proof.
  </p>

  <div id="ae-practice">
    <p class="ae-loading">Loading the argument database…</p>
  </div>

</div>

<script type="module" src="{{ '/assets/arguments/practice.js' | relative_url }}"></script>

<noscript>
  <p><strong>This page needs JavaScript.</strong> The
  <a href="{{ '/arguments/' | relative_url }}">catalogue</a> has the same entries
  in a browsable list.</p>
</noscript>
