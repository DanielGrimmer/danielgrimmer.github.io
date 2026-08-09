---
layout: page
permalink: /games/
title: games
description: Two-player games built around the philosophy of dualities.
nav: true
nav_order: 5
dropdown: true
children:
  - title: soccer hockey duality
    permalink: /soccer-hockey/
  - title: escher chess
    permalink: /escher-chess/
---

<!--
  This page needs a `permalink` even though the navbar only ever uses the two
  children above. Without one, Jekyll still renders the file and publishes it at
  /_pages/games/ — an empty page, listed in sitemap.xml for search engines to
  find. Giving it a real URL and real content fixes that.
-->

Two games, each built around the same idea: two players, two different-looking
boards, one underlying reality. Both need a second player and a bit of nerve.

- [**Soccer Hockey Duality**]({{ '/soccer-hockey/' | relative_url }}) — one of you
  is playing soccer, the other hockey, and neither of you is wrong.
- [**Escher Chess**]({{ '/escher-chess/' | relative_url }}) — a chess variant with
  a mystery at its heart, on a 5×13 or 8×8 board.

They are playable illustrations of a question I work on in the
[philosophy of physics]({{ '/publications/' | relative_url }}): when two theories
are dual to one another, and each describes the world perfectly well in its own
terms, which one tells us what the world is really like?
