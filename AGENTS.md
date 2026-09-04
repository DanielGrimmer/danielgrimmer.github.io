# Operating Rules

- GitHub `main` is the authoritative shared version of this project.
- Before beginning substantive work, fetch `origin main` and make sure the task is based on the current `origin/main`.
- Before pushing, fetch `origin main` again.
- Push to `main` only when the user explicitly asks you to push.
- When pushing directly to `main`, use the equivalent of `git push origin HEAD:main`.
- Never force-push.
- If a push would be non-fast-forward or there is any merge conflict, stop and tell the user rather than resolving it automatically.
- Avoid unnecessary file moves or renames.
- Keep changes focused on the requested task.

# What this repository is

An al-folio Jekyll site, deployed to GitHub Pages by `.github/workflows/deploy.yml`
on every push to `main`. Most of the work is the **encyclopedia of argument
forms** under `assets/arguments/`, built from `EncyclopediaOfArguments/`; the
rest is a personal academic site and two small networked games under
`assets/games/`, `assets/SoccerHockey/` and `assets/EscherChess/`.

- **`EncyclopediaOfArguments/LATEX_STYLE_GUIDE.md` is the standard** for the
  encyclopedia: notation, the schema, the prose, provenance per source,
  difficulty. Read the section that covers what you are about to touch; it is
  long because each rule in it was bought with a mistake.
- `EncyclopediaOfArguments/IMPORTING.md` is the archived import procedure. All
  three inventories are exhausted, so it is history rather than a live task.
- `_firebase/README.md` covers the games' Firestore project, and
  `_firebase/firestore.rules` is the whole published rules file. The rules
  cannot be tested from this repository.
- `docs/open-items.md` is the list of what is still outstanding; `docs/` is
  excluded from the build.

# Before you push anything

```bash
cd EncyclopediaOfArguments/latexgen
python3 build.py --write      # normalise, generate, and re-check every proof
python3 svg.py                # typeset; only recompiles what changed
python3 inventory.py --locks  # nothing on offer that a problem set already set
cd ../.. && node --test "_tests/*.test.mjs"
```

All four must be clean. `build.py` refuses a table that does not recompute, a
tree node that is not a subformula, a proof with a dead line or a missing
reiteration, and a quote it cannot find in `SOURCE_QUOTES.md`. The test suite
covers both the games and the encyclopedia; it also runs as the `test` job of
`.github/workflows/deploy.yml`, and a red suite holds the deploy. Run it here
first all the same: a failed deploy leaves the previous build live, silently.

# Rules for the encyclopedia that hold whatever else happens

1. **Route on `id`.** Never `canonical.canon`. An `id` is the URL; never
   change one.
2. **`course.quarantined` never reaches the site**, and neither does anything
   the inventory marks `EX`. `course.note` is instructor-facing and is never
   rendered as body copy.
3. **Generated fields are not yours to edit.** `display.*`,
   `truth_table.columns`, `truth_table.latex*`, `tree.latex`, `nd.latex`, the
   whole `nd` profile, and `difficulty.table` / `.tree` / `.search_sharpness`
   are written by `build.py` from `premises`, `conclusion` and
   `latexgen/proofs.py`. Hand-edit one and the next build silently reverts it.
4. **A form with no appearance does not belong here** — but the course is an
   appearance, and `appearances_pending: true` is an honest one while a
   citation is being found.
5. **Quotes are verbatim.** A `quote` from the course, Restall or the archive
   must appear in `SOURCE_QUOTES.md`, and the build refuses one that does not.
   A paraphrase is not a quote; delete it rather than improve it.

# One thing that will bite

**`argument-db.json` merges badly.** It is one large file that two branches
edit at once, and git will line-merge it, report success and drop an entry —
which has happened. `assets/arguments/entries.txt` is the manifest that catches
it; run `python3 EncyclopediaOfArguments/latexgen/manifest.py --check-merge`
after any merge that touches the database, and never resolve `entries.txt` or
`assets/arguments/svg/index.json` by hand — resolve the database, then
regenerate both with `build.py --write` and `svg.py`.
