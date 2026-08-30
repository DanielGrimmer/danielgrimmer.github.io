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

**⚠ Check the merge did not eat an entry. Every time.**

`argument-db.json` is one large file that both branches edit — this branch
appends entries at the end, `main` rewrites derived values throughout — and git
will line-merge that, *report success*, and silently drop an entry. It has
already happened once, costing two imported forms that nothing noticed until
they were looked for by name.

```bash
python3 EncyclopediaOfArguments/latexgen/manifest.py --check-merge
```

It compares the database against `assets/arguments/entries.txt` **as of both
merge parents**, so it cannot be fooled by regenerating the manifest from a
damaged database. Run it while the merge is still open — before you resolve
anything — and again after committing it.

Two generated files conflict routinely, and **neither is ever resolved by
hand**: `assets/arguments/entries.txt`, which is the manifest working as
intended (one id per line conflicts where the JSON quietly does not), and
`assets/arguments/svg/index.json`, the block-hash index. Resolve the database
first, then regenerate both:

```bash
cd EncyclopediaOfArguments/latexgen && python3 build.py --write && python3 svg.py
git add -A
```

**If entries are reported lost, the database is what got damaged.** Take this
branch's copy wholesale and let the build reapply `main`'s changes:

```bash
git show origin/claude/inventory-import:assets/arguments/argument-db.json > assets/arguments/argument-db.json
cd EncyclopediaOfArguments/latexgen && python3 build.py --write
```

Everything `main` changes about an existing entry is derived and `build.py`
recomputes it, so this direction loses nothing — except an authored
`difficulty.nd` that `main` changed, which `python3 difficulty.py --diff` will
then report.

## 2. Take the next candidates

```bash
cd EncyclopediaOfArguments/latexgen
python3 inventory.py --status
python3 inventory.py --next 3
```

The queue is recomputed from the inventory and the database every time, so
there is no progress file to fall out of step. A candidate carries its
`sequent`, `premises`, `conclusion`, the inventory's `name` and `where`, the
`section` it sits in, a `source`, and a `problem_set` map (see §5).

`--status` also counts what the queue refuses: rows already in the database,
quarantined exam rows, rows holding more than one sequent, and rows whose
formulas will not parse. Those last two are work for a person; log them (§7)
rather than trying to force them.

### Which inventory

**Work the course inventory until it is empty, then the imports.**

```bash
python3 inventory.py --status --source imports
python3 inventory.py --next 3 --source imports
```

`--source course` is the default and covers what this year's course does. When
its queue reaches zero, switch: `--source imports` reads
`Argument Form Inventory — Imports (2026-08-28).md`, which is Restall's
propositional chapters, last year's papers, and a brainstormed candidate list.
Do not mix sources within one firing — the provenance rules differ and keeping
a run to one source keeps the commit legible.

**Read §11c of the style guide before the first imports run.** It is short and
it is the whole difference. In brief: Restall rows cite Restall's *Logic* with
a chapter-and-exercise `locus`; archive rows say **2025** in the `work` so they
do not read as this year's; **nothing in the file is a practice lock**, and
`inventory.py` correctly writes an empty `problem_set` for every row.

**The brainstorm section has no source, and that is a stopping condition.** An
entry needs at least one appearance and a test enforces it. Where the inventory
names a champion — Stalnaker and Lewis for conditional excluded middle, Curry
for the Curry sequent, Ross for Ross's paradox, or a Restall exercise it flags
as *"already Restall"* — cite the champion and import normally. Where it names
none, **log the row (§8) and take the next one.** Do not promote "a form worth
having" into an appearance; that is manufacturing provenance under a new name.

## 3. Compute the structured data

**Never hand-write a truth table or a tableau.** `latexgen/derive.py` computes
them from the sequent — the table, the verdict and its countermodels, the
tableau with every `from` link, the branch models, the metrics and the premise
analysis — and it reproduces all 35 of the original entries exactly, so it is
the thing to trust.

```python
import sys; sys.path.insert(0, "EncyclopediaOfArguments/latexgen")
from derive import derive
d = derive(["p > q", "~q"], "~p")
# d["verdict"], d["truth_table"], d["tree"], d["metrics"], d["premise_analysis"]
```

Write the entry by taking those wholesale and adding the prose around them.
`python3 derive.py "p > q" "~q" --conclusion "~p"` prints the lot if you would
rather look first, and `--check` re-verifies it against the existing database.

Omit `canonical`: it is an identity scheme from an upstream generator and
nothing on the site reads it. Route on `id`.

## 4. Write the prose

Add the entry to `assets/arguments/argument-db.json` following §7 of the style
guide. What the build will fix for you: atom names, parentheses, the display
strings, the truth-table columns, the tree node formulas, the `nd` profile, and
all four LaTeX blocks. What you must supply:

- **`id`** — a short kebab-case slug, unique. It is the route; never change one.
- **`premises` / `conclusion`** — from the candidate, in ASCII.
- **`names`** — the inventory's name first if it has one. Name the *form*.
- **`english`** — `{gloss, faithful}`. Ordinary English, no symbols. For a bare
  schema like `p⊃q, p ∴ q` there may be nothing to gloss; then omit it rather
  than inventing a story.
- **`appearances`** — see §5.
- **`interest`** — see §5.
- **`tags`** and **`course`** (see §6).
- **`difficulty.nd`** only — `easy`, `medium` or `hard`, or `null` on an
  invalid form. Score it against **§14.3 of the style guide**: count the five
  triggers; none is easy, one or two medium, three or more hard. **The table
  and tree scores are not yours to write** — `build.py` computes them from
  truth-functional calls and rule applications (§14.1, §14.2), and computes
  `search_sharpness` too. Then check yourself:

  ```bash
  python3 difficulty.py --diff
  ```

  It should print nothing. If it names your entry's `nd`, either take its
  suggestion or say in `course.note` why not; the test suite fails otherwise.
- **The structured data**, from `derive.py` — see §3.
- **The derivation**, for a valid form: a new entry in `latexgen/proofs.py`,
  written with the entry's final atom names. `nd.check()` verifies it, and it
  now refuses a proof with a **dead line** — a derived line that nothing later
  cites and no rule discharges (§6.5). The trap is ⊥: there is no explosion
  rule, so reaching a contradiction never gives you a formula on the spot.
  Open a subproof on the negation of what you want and reach ⊥ *inside* it;
  do not reach ⊥ first and then reach it again under the assumption.
- For an invalid form, **`nd.note`**: where the attempt at a derivation breaks
  down. "No derivation" alone is a wasted field.

## 5. Provenance, when the source is the course

Most of this inventory has no philosophical champion behind it. **That is fine
and you should say so plainly.** The course itself is the appearance:

```json
{ "type": "used", "fidelity": "our reconstruction", "who": "PHIL 1115",
  "work": "Lecture 10 Handout", "locus": "L10§2", "url": null }
```

Use `where` from the candidate for `work` and `locus`. `L` is a lecture, `PS` a
problem set, `P1`/`P2` the midterm practice sets, `SG` the study guide.

### `quote`: you have nothing to put in it

**Leave it out.** Not as a style preference, but as a fact about what you can
see. The inventory is a table of sequents and the problem-set columns they were
set in. It holds no handout prose, and you have no handouts. So there is no
course passage you are in a position to quote, and a sentence of your own
describing where the form was set ("Set by table and tree; the derivation
appears only as a study-guide question") is not a quote of anything: inside
quotation marks attributed to the handout, it reads as the source saying that
about itself. What you know about where the form was set goes in `work` and
`locus`, which exist for it; anything further goes in `interest`, where our own
voice belongs.

This is enforced rather than merely asked. `build.py` refuses to write the
database when a course appearance carries a `quote` that is not in
`EncyclopediaOfArguments/SOURCE_QUOTES.md` verbatim, and
`_tests/argument-forms.test.mjs` checks the same thing. Both read `who` and
`work`, so spelling the source differently does not get past them.

**`SOURCE_QUOTES.md` is not yours to add to.** It holds handout passages a
person has read and copied in. A passage you composed is precisely what the
check exists to catch, so putting one there to make a build pass defeats the
only guard on this and is worse than the original mistake. When a build fails
this way the fix is always to delete the `quote`. Your diff should never touch
that file:

```bash
git diff --name-only origin/main...HEAD | grep SOURCE_QUOTES && echo "STOP: revert this"
```

Restall-sourced rows name Restall's *Logic*
and the chapter.

`interest` may be as modest as the truth allows — *"One of the course's own
worked examples: the first derivation students meet, and the shape every later
proof by cases is built on."* Do not manufacture philosophical significance. A
short honest note is worth more than an invented one, and these can be
deepened later.

## 6. `course`, and what must not be practised

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
Copy the candidate's `problem_set` map; it is derived mechanically from the
inventory's own "where" column and errs toward withholding, so drop an entry
from it if the locus plainly is not a set question and say so in `course.note`.

**Exam appearances are not recorded** and are free to practise: the site is
unreachable during the exam and there is far too much of it to memorise. The
six forms §8 quarantines are a different matter — `inventory.py` never offers
them, and if you meet one another way, `course.quarantined: true`.

**Check for a near-duplicate before writing.** `p∨q, p ∴ ∼q` and
`f∨d, d ∴ ∼f` are different formulas but the same lesson. Search the database;
if one exists, either skip the row (log it) or set `looks_like` to the entry it
resembles and say in `interest` how they differ.

**And check the locks that are already there**, not only the one you are
writing:

```bash
python3 EncyclopediaOfArguments/latexgen/inventory.py --locks
```

It walks every inventory row that records a problem-set question, matches it to
the entry carrying that form by shape, and names any method still on offer.
This catches what §6 above cannot: a form that reached the database from
somewhere else entirely, so that nothing ever compared it against the row that
sets it. `peirce-law` and `distribution` both came in from the SEP and both sat
on the practice page for weeks as questions PS5.7 and PS3.1 had set. If it names
an entry, write the lock — including on entries you did not import.

## 7. Build, verify, push

```bash
cd EncyclopediaOfArguments/latexgen
python3 build.py --write     # normalise, generate, verify
python3 svg.py               # typeset — 4 blocks per entry
python3 inventory.py --locks # nothing on offer that a problem set set
cd ../.. && node --test "_tests/*.test.mjs"
```

All three must be clean. `build.py` refuses an entry whose table does not
recompute, whose tree node is not a subformula, or whose proof does not check;
`svg.py` fails on LaTeX that will not compile; the tests check the rest. **Do
not push with any of them red** — fix or drop the entry.

Then commit and push:

```bash
git add -A && git commit -m "Import <n> forms from the course inventory: <names>"
git push -u origin claude/inventory-import
```

There is a standing pull request against `main` and pushing to the branch adds
to it; **you do not need to open one, and in a Routine firing you cannot** —
those sessions have no GitHub tools. If the pull request has been merged and
the branch deleted, restart the branch from `origin/main` (§1), push, and write
one line in the log saying a new pull request is needed. Daniel opens it.

Say what the queue looks like now (`inventory.py --status`) and what was
skipped in the commit message, since that is the only report that reaches the
pull request.

## 7a. Read what you wrote

Before committing, read the entry's prose back. The build checks that the logic
holds together; nothing checks that a sentence says what you meant. The first
import run left `⊃I and ⊃I's reductio-flavoured cousin ∼I` in an `interest`,
where the second `⊃I` should have been a pronoun — the sort of thing that
survives every test and embarrasses on the page.

Two more the first run got right and are worth keeping right:

- **`cli_ref`** is a reference into the course's own numbering. If you do not
  have one, write `"—"`; the renderer drops it. Do not invent one.
- **`looks_like`** whenever another entry is the same lesson in different
  letters, and say in `interest` how they differ.

## 8. When a row will not go in

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
   `truth_table.latex*`, `tree.latex`, `nd.latex`, the `nd` profile, and
   `difficulty.table` / `.tree` / `.search_sharpness` are all written by
   `build.py`.
4. **Never edit `main` directly.** Everything goes to the branch.
5. **A form with no appearance does not belong here** — but the course is an
   appearance, and saying "this is one of our own worked examples" is an
   honest one.
