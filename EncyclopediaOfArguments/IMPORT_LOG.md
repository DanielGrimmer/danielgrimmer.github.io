# Import log

Rows from the inventories that the hourly import routine met and did not
import, with the reason. Kept so that a queue which stops moving is visible
rather than silent; see `.claude/skills/import-entries/SKILL.md` §7.

Nothing here is a failure of the routine. A row holding two sequents is two
entries and a judgement about which to write; a row whose verdict disagrees
with the computed table is a question for a person. Both belong here rather
than in the database.

**Two inventories now feed the queue**, the course inventory first and the
imports inventory after it. A row with no source behind it is **not** a reason
to land here. §3 of the imports file is a brainstormed candidate list, and
those forms are imported with `appearances_pending: true`, which prints
*Provenance pending* on the page where the citations would go. The gap is
stated rather than hidden, and it is a debt to be paid later by someone with a
library — not a reason to refuse the form or to invent a source for it.

**What the table is.** Every sequent in it is suppressed from the queue, so a
row lands here when the routine should not be offered it again — usually
because it was skipped, but also when it was imported under a shape the row's
own spelling does not give (the queue matches on shape, so it would otherwise
be offered a second time). The reason column says which.

| Date | Sequent | Why the queue no longer offers it |
| --- | --- | --- |
| 2026-08-30 | `p∨q, p ∴ ∼q` (inventory name: "Affirming a disjunct") | Duplicates `affirming-a-disjunct` already in the database (`f∨d, d ∴ ∼f`) — same form, renamed atoms, per §6's own worked example of exactly this pair. |
| 2026-08-30 | `(p&q)&∼p` (inventory name: "contradiction") | Not skipped — imported as `conjunction-with-its-own-negation`, but reshaped as `(p&q)&∼p ⊢ ⊥` rather than the bare `⊨ (p&q)&∼p` reading `split_sequent` gives a turnstile-free row by default. The row's own annotation names the derivation target directly — **ND untouched (`⊢ND ⊥` in 4 lines)** — which only makes sense if the goal is `⊥`, not the formula; §11c calls this the author's judgement to make. Logged so the row is not re-offered under a shape the database does not carry. |
| 2026-08-30 | `p≡q ≡ ∼(∼p∨∼q)∨∼(p∨q)` (locus PS2.4c) | Duplicates `biconditional-as-agreement` already in the database, which carries this exact claim from this exact locus (`(p = q) = (~(~p \| ~q) \| ~(p \| q))`). The row is genuinely ambiguous unbracketed — `≡` is right-associative in `split_sequent`, so the raw row parses as `p ≡ (q ≡ X)` rather than the intended `(p ≡ q) ≡ X` — and the queue's shape-based dedup does not see through that, offering the row again under the wrong bracketing. It is the same form under the reading the course actually poses. |

## Resolved

Rows that were logged and are now importable again, because what blocked them
has been fixed. **The sequents here are deliberately not in backticks**: the
queue reads only the table above, so a row moved down here is offered again on
the next firing.

**p≡(q≡r) ≡ (p≡q)≡r — associativity of ≡ (P1.4, table).** Logged 2026-08-30
because `subformula_index` raised while building its index: the theorem's own
two sides both flatten to *p = q = r* under `flat()`'s equal-precedence
elision, which is not an accident of this entry but what associativity *means*.

The diagnosis was right and the conclusion was that it needed a tooling change.
It did, and the change was smaller than expected: the raise was **eager**,
firing while the index was built rather than when an ambiguous key was looked
up. Nothing in this entry's tree ever looks that key up — every node carries
the fully parenthesised spelling, which is always its own unambiguous key — so
the entry was refused over a string it does not use. `subformula_index` now
reports ambiguous keys instead of raising on them, and `build.py` refuses the
*node*, naming both candidates. An entry may contain an ambiguous spelling; it
may not silently resolve one.

Verified both ways round: with a canonical root the entry builds (and fails
only for want of a derivation), and with the elided root it is refused by name.
The 152-line derivation the firing had already written by hand is the
remaining work.

**2026-08-30, later firing: the derivation is written.** 269 lines, not 152 —
two directions of ≡I, each forking on the two atoms its own assumption does
not already fix, eight leaves in total. Imported as
`associativity-of-biconditional`. It is now the longest derivation in the
database by a wide margin (previous longest: 80 lines), and its authored
`difficulty.nd` is `extremely hard` under the band a concurrent firing added
while this one was in progress (all five §14.3 triggers, well past the
29-line floor).

Assembled and checked outside the repo first (a small Python builder driving
`nd.check()` directly, one case per possible polarity pairing of a `≡`
node's two sides), then serialised into `proofs.py` — by hand at this length
invites exactly the invisible line-number slip §6.7 warns about. Merging
this firing's branch against a concurrent one picked up a same-day policy
change to `\Reit` (a `⊥I` may not cite its own subproof's opening assumption
directly; reiterate it first), which the excluded-middle pattern this proof
leans on four times over was written before. Re-checked and fixed in the
generator rather than by hand for the same reason.

Writing it surfaced a real bug rather than a style question, and it needed a
second tooling change: `derive.py`'s `countermodel` flag was computed as
`live and c is False`, where `c` is `None` (not `False`) for a falsum
conclusion — so a satisfiable premise set with a `!` conclusion always came
back `verdict.valid: True`, whatever the premises actually were. Every
falsum-conclusion entry on file so far happens to be a genuine inconsistency
(where the bug is invisible: no live row exists either way), so nothing
caught it until this firing's other two rows needed it to work correctly.
Fixed by treating `c is None` the same as `c is False` for this purpose, in
both the table's `countermodel` flag and `derive()`'s own `premise_analysis`.
`derive.py --check` still reproduces all existing entries.

Two entries from the course inventory's §5 needed the fix: `{p&q, ~p|~r,
~q|s}` (L6§2, tree, motivating example) and the astrolabe puzzle `{a|b, b>a,
~(a&c)}` (PS3.3, tree) are both *satisfiable* claims — `X ⊬ND ⊥` — which is a
shape no entry carried before. Imported as `lecture6-satisfiable-set` and
`astrolabe-puzzle`. Two consequences worth recording:

- `_tests/argument-forms.test.mjs` had two spots that assumed every
  falsum-conclusion entry is valid (a hardcoded count, and an unconditional
  `nd.latex` match) — true of the five that existed, but not of these two.
  Updated both to branch on `verdict.valid` and to expect seven. A third spot
  (the compact-table shape test) assumed a falsum conclusion's `conclusion:
  'F'` column varies row to row the way an ordinary conclusion's does; it
  doesn't (§6.6 — ⊥ reads false on every row), so for a *satisfiable*
  falsum-conclusion entry the test now checks against the live rows alone,
  matching what `tables.py`'s own `compact_filter` already computed.
- The astrolabe puzzle's problem-set locus (`PS3.3`, tree) did not reach
  `course.problem_set` automatically: `inventory.py`'s `problem_sets()` reads
  the "where" text from `row["cells"][2:]`, which is right for a three-plus
  column table but empty for §5's two-column `Claim | Where (method)` format,
  where the locus sits in `cells[1]`. Set by hand from the raw row instead of
  fixing the parser, since this section only has the two rows above and a
  parser change was more machinery than the fact warranted; `inventory.py
  --locks` confirms the lock is correctly honoured either way.

Course inventory queue is now empty (0 candidates). The next firing switches
to `--source imports` per §11c.

**2026-08-30, first `imports`-source firing.** Course queue confirmed empty
(`inventory.py --status` — 0 candidates), so this firing worked
`--source imports` for the first time, taking the top three rows off
Restall's Chapter 3 bank per §11c: `permutation` (Ex 3.4.8, `p⊃(q⊃r) ⊢
q⊃(p⊃r)`), `contraction-detached` (Ex 3.4.14, `p⊃(p⊃q) ⊢ p⊃q`), and
`resolution` (Ex 3.4.16, `p∨q, ∼q∨r ⊢ p∨r`). All three verified valid by
`derive.py`, matching Restall's own verdicts. Appearances cite `Greg
Restall, Logic` with the exercise number as `locus`, `fidelity: our
reconstruction`, no `quote` (§11c — the inventory summarises Restall, it
does not reproduce him, and `build.py` now checks Restall appearances
against `SOURCE_QUOTES.md` exactly as it checks the course's). No
`problem_set`: nothing in this file is a practice lock.

`contraction-detached` is a near-duplicate by content, not by shape, of the
existing `contraction-w` (`⊢ (p⊃(p⊃q))⊃(p⊃q)`) — the same principle Restall
poses as a premise-conclusion pair rather than as a theorem. Not the same
formula, so not skipped, but `looks_like: contraction-w` and `interest`
says how they differ (one `⊃I` shorter, since the outer conditional arrives
as a premise instead of needing to be built).

`resolution`'s derivation is the one worth flagging: proving a disjunction
has no direct route the way `⊃I` gives one, so it costs a full case split
on the first premise, a second case split nested inside one of those cases,
and — because there is no explosion rule — a reductio nested inside *that*
to cash the resulting contradiction out as the wanted disjunction. Five
subproofs, three deep. Checked against `nd.check()` directly before being
written into `proofs.py`, the same way the 269-line biconditional proof was
two firings ago — worth doing again at five subproofs rather than trusting
hand-counted `subs` ranges.

**The sandbox had no LaTeX toolchain at all** — `svg.py` failed outright,
`FileNotFoundError: latex`. Installed via `apt-get`:
`texlive-latex-base texlive-latex-recommended texlive-latex-extra
texlive-pictures texlive-binaries dvisvgm`, plus, once `fitch.sty` was
present but `qtree.sty` was not, `texlive-humanities` (`apt-file search
qtree.sty` found it there — it is not in `texlive-pictures` as the name
would suggest). This is a fresh container each firing, so the next one
needs the same install; worth a `session-start-hook` if these firings are
going to keep needing `svg.py`, rather than re-discovering this each time.

`build.py --write`, `svg.py`, `svg.py --check`, `inventory.py --locks`, and
`node --test "_tests/*.test.mjs"` all clean (511/511). Imports queue: 33
candidates left of 48 (15 now in the database, up from 12 already there
before this firing — the pre-existing 12 predate this firing's work).

**2026-08-30, second `imports`-source firing.** Course queue still empty, so
this firing continued down Restall's Chapter 3 bank where the previous one
left off: `prefixing` (Ex 3.4.11, `p⊃q ⊢ (r⊃p)⊃(r⊃q)`), `material-
implication-drill` (Ex 3.4.13, `p ⊢ ∼p⊃q`), and `permutation-converse` (Ex
3.4.18, `p⊃(q⊃r) ⊢ (p⊃q)⊃r`, **invalid** — the first invalid entry this
inventory has produced). All three verdicts checked against `derive.py` and
match Restall's own. Appearances cite `Greg Restall, Logic` with the
exercise locus, `fidelity: our reconstruction`, no `quote` (§11c). `prefixing`
also carries a second appearance to last year's archive — §2 names the same
sequent as `OLD-PS3 Q12`, done there by tree and table, so this entry's ND
derivation is its third method rather than its first outing; no
`problem_set` was added for either appearance, since neither is this year's
course.

`material-implication-drill` is a near-duplicate by derivation shape, not by
formula, of the existing `negative-paradox` (`∼p ⊢ p⊃r`, Lecture 11): the
same assume-collide-reductio route, with `∼p` doing by assumption what
`negative-paradox`'s premise hands over directly. `looks_like: negative-
paradox`, and `interest` says how they differ. `permutation-converse`
similarly gets `looks_like: permutation`, being the sharp invalid pair
Restall poses against it (Ex 3.4.8), and its `interest` also flags the
near-miss against `exportation`'s valid `(p&q)⊃r` reading of the same
`p⊃(q⊃r)`.

Both new derivations (`prefixing`, `material-implication-drill`) checked
against `nd.check()` directly before being written into `proofs.py`.
`permutation-converse`'s `nd.note` and `countermodel_gloss` were checked
against the stored countermodels (`{p:F,q:T,r:F}` and `{p:F,q:F,r:F}`) —
both `q` values, `p` and `r` fixed — before being written down, per this
file's standing caution about superlatives and countermodel claims.

**The sandbox again had no LaTeX toolchain**, this being a fresh container;
reinstalled the same packages as the first firing's note, and additionally
needed `texlive-science` for `stmaryrd.sty` — declared in the block preamble
(§0.1) but not pulled in by any package on the first firing's install list,
so it went unnoticed until this firing's `svg.py` run hit it. Worth folding
into that `session-start-hook` suggestion if one gets written.

`build.py --write`, `python3 difficulty.py --diff` (clean), `svg.py`,
`svg.py --check`, `inventory.py --locks`, and `node --test
"_tests/*.test.mjs"` all clean (511/511). Imports queue: 30 candidates left
of 48 (18 now in the database).
