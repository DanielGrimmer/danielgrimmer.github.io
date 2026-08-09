---
layout: page
permalink: /publications/
title: publications
description: Generated from <code>_bibliography/papers.bib</code>. Adding a BibTeX entry there adds it here.
nav: true
nav_order: 1
---

<!-- _pages/publications.md -->

{% include bib_search.liquid %}

<!--
  Two lists, split on the `status` field in the .bib. The headings sit outside
  the .publications wrapper on purpose: inside it, a level-two heading picks up the large
  grey styling used for the year markers and reads as one of them.
-->

## Currently under peer review

<div class="publications">
{% bibliography --query @*[status=submitted] %}
</div>

## Peer-reviewed publications and graduate theses

<div class="publications">
{% bibliography --query @*[status!=submitted] %}
</div>
