---
name: import-entries
description: Import the next two or three argument forms from the course inventory into the encyclopedia database. Use when asked to import inventory rows, add entries to argument-db.json, or work the import queue. Runs hourly as a Routine.
---

# Importing inventory rows into the encyclopedia

Two or three forms per run, from `EncyclopediaOfArguments/Argument Form
Inventory (2026-08-28).md`, onto the branch `claude/inventory-import` and its
one standing pull request. Nothing reaches the live site until Daniel merges.

**Read `EncyclopediaOfArguments/LATEX_STYLE_GUIDE.md` first**, every run. §§1–6
are the notation, §7 the schema, §11b the import contract, §13 the prose. This
file is the procedure; that file is the standard.

## 1. Get on the branch

```bash
cd /home/user/danielgrimmer.github.io
git fetch origin
git checkout -B claude/inventory-import origin/claude/inventory-import 2>/dev/null \
  || git checkout -B claude/inventory-import origin/main
git merge --no-edit origin/main          # keep up with main
```

If the branch has been merged and deleted, start it again from `origin/main`.

## 2. Take the next candidates

```bash
cd EncyclopediaOfArguments/latexgen
python3 inventory.py --status
python3 inventory.py --next 3
```

The queue is recomputed from the inventory and the database every time, so
there is no progress file to fall out of step. A candidate carries its
`sequent`, `premises`, `conclusion`, the inventory's `name` and `where`, the
`section` it sits in, and a `problem_set` map (see §5).

`--status` also counts what the queue refuses: rows already in the database,
quarantined exam rows, rows holding more than one sequent, and rows whose
formulas will not parse. Those last two are work for a person; log them (§7)
rather than trying to force them.

## 3. Write the entry

Add it to `assets/arguments/argument-db.json` following §7 of the style guide.
What the build will fix for you: atom names, parentheses, the display strings,
the truth-table columns, the tree node formulas, the `nd` profile, and all four
LaTeX blocks. What you must supply:

- **`id`** — a short kebab-case slug, unique. It is the route; never change one.
- **`premises` / `conclusion`** — from the candidate, in ASCII.
- **`names`** — the inventory's name first if it has one. Name the *form*.
- **`english`** — `{gloss, faithful}`. Ordinary English, no symbols. For a bare
  schema like `p⊃q, p ∴ q` there may be nothing to gloss; then omit it rather
  than inventing a story.
- **`appearances`** — see §4.
- **`interest`** — see §4.
- **`tags`**, **`difficulty`** (one of easy/medium/hard per method — a hard
  table can be an easy derivation), **`course`** (see §5).
- **The truth table, tree and verdict data.** Compute them; do not transcribe.
  `latexgen/tables.py` and `trees.py` build the blocks from the structured
  data, and `build.py` recomputes every value and stops if one disagrees.
- **The derivation**, for a valid form: a new entry in `latexgen/proofs.py`,
  written with the entry's final atom names. `nd.check()` verifies it.
- For an invalid form, **`nd.note`**: where the attempt at a derivation breaks
  down. "No derivation" alone is a wasted field.

## 4. Provenance, when the source is the course

Most of this inventory has no philosophical champion behind it. **That is fine
and you should say so plainly.** The course itself is the appearance:

```json
{ "type": "used", "fidelity": "our reconstruction", "who": "PHIL 1115",
  "work": "Lecture 10 Handout", "locus": "L10§2", "url": null,
  "quote": "..." }
```

Use `where` from the candidate for `work` and `locus`. `L` is a lecture, `PS` a
problem set, `P1`/`P2` the midterm practice sets, `SG` the study guide. Quote
the handout only if you have the text; otherwise leave `quote` out rather than
paraphrasing into quotation marks. Restall-sourced rows name Restall's *Logic*
and the chapter.

`interest` may be as modest as the truth allows — *"One of the course's own
worked examples: the first derivation students meet, and the shape every later
proof by cases is built on."* Do not manufacture philosophical significance. A
short honest note is worth more than an invented one, and these can be
deepened later.

## 5. `course`, and what must not be practised

```json
"course": {
  "used_in": ["Lecture 10"],
  "problem_set": { "tree": "PS4.2a" },
  "quarantined": false,
  "note": "instructor-facing; never rendered as body copy",
  "earliest_lecture": { "table": 4, "tree": 6, "nd": 10, "note": null }
}
```

**`problem_set` is load-bearing.** A form set as graded work is not a fair
random draw *in that method* — the student has already been asked to build that
very tree — so `practice.js` drops that pair. The other methods stay open.
Copy the candidate's `problem_set` map verbatim; it is derived from the
inventory's own "where" column.

**Exam appearances are not recorded** and are free to practise: the site is
unreachable during the exam and there is far too much of it to memorise. The
six forms §8 quarantines are a different matter — `inventory.py` never offers
them, and if you meet one another way, `course.quarantined: true`.

**Check for a near-duplicate before writing.** `p∨q, p ∴ ∼q` and
`f∨d, d ∴ ∼f` are different formulas but the same lesson. Search the database;
if one exists, either skip the row (log it) or set `looks_like` to the entry it
resembles and say in `interest` how they differ.

## 6. Build, verify, push

```bash
cd EncyclopediaOfArguments/latexgen
python3 build.py --write     # normalise, generate, verify
python3 svg.py               # typeset — 4 blocks per entry
cd ../.. && node --test "_tests/*.test.mjs"
```

All three must be clean. `build.py` refuses an entry whose table does not
recompute, whose tree node is not a subformula, or whose proof does not check;
`svg.py` fails on LaTeX that will not compile; the tests check the rest. **Do
not push with any of them red** — fix or drop the entry.

Then commit and push, and open the pull request if there is not one already:

```bash
git add -A && git commit -m "Import <n> forms from the course inventory: <names>"
git push -u origin claude/inventory-import
```

The PR body should say what the queue looks like now (`inventory.py --status`)
and list what was skipped this run.

## 7. When a row will not go in

Skip it and record it in `EncyclopediaOfArguments/IMPORT_LOG.md` — one line,
the sequent, and the reason. Never import something half-met, and never stop
the routine over one bad row. Reasons that come up: the row holds two sequents;
its formulas will not parse; the verdict disagrees with what the table
computes; no derivation can be found for a valid form; it duplicates an entry
already present.

If the queue is empty, say so in the log, do nothing else, and stop.

## Rules that hold whatever else happens

1. **Route on `id`.** Never `canonical.canon`.
2. **`course.quarantined` never reaches the site**, and neither does anything
   the inventory marks `EX`.
3. **Never hand-edit generated fields.** `display.*`, `truth_table.columns`,
   `truth_table.latex*`, `tree.latex`, `nd.latex` and the `nd` profile are all
   written by `build.py`.
4. **Never edit `main` directly.** Everything goes to the branch.
5. **A form with no appearance does not belong here** — but the course is an
   appearance, and saying "this is one of our own worked examples" is an
   honest one.
