# CLAUDE.md

**The operating rules live in [`AGENTS.md`](AGENTS.md) and apply here unchanged.**
Read that file first. It is the single copy on purpose: two sets of rules for
two agents drift apart, and the ones about pushing to `main` are exactly the
ones you do not want two versions of.

This file exists because Claude Code loads `CLAUDE.md` automatically and does
not load `AGENTS.md`. That is not hypothetical — the import routine ran
seventeen firings on a branch that did not carry `AGENTS.md` and never saw a
word of it.

## What this repository is

An al-folio Jekyll site. Most of the work is the **encyclopedia of argument
forms** under `assets/arguments/`, built from `EncyclopediaOfArguments/`.

- **`EncyclopediaOfArguments/LATEX_STYLE_GUIDE.md` is the standard.** Notation,
  the schema, the prose, provenance per source, difficulty. Read the section
  that covers what you are about to touch; it is long because each rule in it
  was bought with a mistake.
- `.claude/skills/import-entries/SKILL.md` is the import procedure. All three
  inventories are exhausted, so it is history rather than a live task.

## Before you push anything

```bash
cd EncyclopediaOfArguments/latexgen
python3 build.py --write      # normalise, generate, and re-check every proof
python3 svg.py                # typeset; only recompiles what changed
python3 inventory.py --locks  # nothing on offer that a problem set already set
cd ../.. && node --test "_tests/*.test.mjs"
```

All four must be clean. `build.py` refuses a table that does not recompute, a
tree node that is not a subformula, a proof with a dead line or a missing
reiteration, and a quote it cannot find in `SOURCE_QUOTES.md`.

## Two things that will bite

**Generated fields are not yours to edit.** `display.*`, `truth_table.*`,
`tree.latex`, the whole `nd` profile and `difficulty.table`/`.tree` are written
by `build.py` from `premises`, `conclusion` and `latexgen/proofs.py`. Hand-edit
one and the next build silently reverts it.

**`argument-db.json` merges badly.** It is one large file that two branches
edit at once, and git will line-merge it, report success and drop an entry —
which has happened. `assets/arguments/entries.txt` is the manifest that catches
it; run `python3 EncyclopediaOfArguments/latexgen/manifest.py --check-merge`
after any merge that touches the database.
