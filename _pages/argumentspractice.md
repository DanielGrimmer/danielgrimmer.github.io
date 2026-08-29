---
layout: page
permalink: /arguments/practice/
title: practice # the navbar label, lower-case like its siblings
display_title: Practice
description: Draw an argument form at random and work it out before you look. The verdict, the table, the tree and the proof all stay hidden until you ask for them.
nav: false # surfaced via the 'argument forms' dropdown in _pages/arguments.md
---

<!--
  Surfaced as the last child of the 'argument forms' dropdown; see
  _pages/arguments.md. Shares assets/arguments/encyclopedia.{css,js} with the
  catalogue and adds assets/arguments/practice.js for the draw.

  The filename has no hyphen on purpose: al-folio's own _pages files are all
  single words, and Jekyll takes the URL from `permalink` regardless.
-->

<link rel="stylesheet" href="{{ '/assets/arguments/encyclopedia.css' | relative_url }}" />

<div class="ae-scope">

  <p>
    Pick what you want to work on, then draw a problem. You get the argument
    form and nothing else — no verdict, no commentary — so the question is
    genuinely open. The worked answer is one click away when you want it, and
    the full encyclopedia entry is linked underneath.
  </p>

  <div id="ae-practice">
    <p class="ae-loading">Loading the argument database…</p>
  </div>

</div>

<script type="module" src="{{ '/assets/arguments/practice.js' | relative_url }}"></script>

<noscript>
  <p><strong>This page needs JavaScript.</strong> The
  <a href="{{ '/arguments/browse/' | relative_url }}">catalogue</a> has the same entries
  in a browsable list.</p>
</noscript>
