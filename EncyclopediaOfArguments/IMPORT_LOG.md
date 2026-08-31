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
| 2026-08-30 | `p≡q, p≡∼q ⊢ ∼p` (OLD-PS3 Q11) | Same unsatisfiable premise pair as `vacuous-validity-unsat-premises` already in the database (`p = q, p = ~q`), differing only in the arbitrary conclusion drawn from the contradiction (`∼p` here, `r` there) — the inventory's own note calls it "the tree version of our PS2.2d table item", i.e. the identical lesson in a different method, not a different form. Importing it would restate `vacuous-validity-unsat-premises` under a second conclusion letter rather than teach anything new. |
| 2026-08-31 | `⊢ (p ⊃ q) ∨ (p ⊃ r)` (CLI-106, comprehensive §1 rank 5) | No philosopher or champion named in the row, unlike its rank-4 and rank-6 neighbours (van Fraassen, Aristotle) — its own cell only compares it to the course's own *valid* twin `⊢ (q⊃p) ∨ (p⊃r)` (L11/PS5.6) and calls it "the near-miss". §11d's fallback for an unclear SEP article is to name the philosopher the row itself names; here none is named, and §1 carries no `sep` line either, so there is nothing to attribute this to. `appearances_pending` is not a substitute — §13.1 marks that flag as an exception specific to the imports inventory's §3, not a general escape from having a source. Left for a person with a library to find an actual champion, or to import once one turns up; the other three rows from this position in the queue (CLI-107, 108, 109) all name one and are imported this firing. |
| 2026-08-31 | `p ⊃ q, r ⊃ s ⊢ p ⊃ s` (CLI-110, comprehensive §1 rank 9) | No philosopher named. "The four-terms / equivocation skeleton" names a classical fallacy of the syllogistic tradition generally, not a person the row attributes it to, and §1's own `sep` line is empty for this row. Left for a person with a library to find an actual champion. |
| 2026-08-31 | `p ⊃ m, s ⊃ m ⊢ s ⊃ p` (CLI-112, comprehensive §1 rank 11) | Same reason as CLI-110: "undistributed middle, propositional shadow" names the fallacy, not a philosopher, and no `sep` line to check against. |
| 2026-08-31 | `(p ∨ q) ⊃ r ⊢ ∼(p ∨ q) ⊃ ∼r` (CLI-113, comprehensive §1 rank 12) | "Illicit contraposition" names the fallacy, not a person, and no `sep` line. Same reason as CLI-110/112. |
| 2026-08-31 | `p ⊃ r ⊢ (p ⊃ q) & (q ⊃ r)` (CLI-115, comprehensive §1 rank 14) | No philosopher named — "a real implication must factor through a middle term" states the relevance intuition itself, attributing it to no one, and no `sep` line. |
| 2026-08-31 | `(p & q) ⊃ r, r ⊢ p & q` (CLI-116, comprehensive §1 rank 15) | "Affirming the consequent" names the fallacy, not a person. Same reason as CLI-110/112/113. |
| 2026-08-31 | `(p1⊃q1)&(p2⊃q2), p1 ⊢ q1&q2` (CLI-121, comprehensive §1b) | "The scope fallacy" (necessity of the consequence read as necessity of the consequent) is described but attributed to no one in the row. |
| 2026-08-31 | `⊢ ((p1∨q1)&(p2∨q2)) ⊃ ((p1&p2)∨(q1&q2))` (CLI-124, comprehensive §1b) | `□(A∨B) ⊃ □A∨□B`, compared only to its ∃-analogue (CLI-125) and to the quantifier form it previews — no philosopher named. |
| 2026-08-31 | `(a1⊃b1)&(a2⊃b2), a0 ⊢ b1&b2` (CLI-126, comprehensive §1b) | "Factual detachment in deontic dress" — the scope fallacy again, no person named, its valid twin (deontic detachment) also unattributed in the row. |
| 2026-08-31 | `b∨∼b, b⊃a, ∼b⊃c, (u∨w)⊃∼f ⊢ ∼f` (CLI-127, comprehensive §1b) | The fatalism chain reads like Aristotle's sea battle or a Taylor-style fatalism argument, but the row names neither — attributing it to either would be a guess, not a reading of the row. |
| 2026-08-31 | `t ⊃ (d∨f), d ⊃ t, t ⊢ d` (CLI-129, comprehensive §1b) | "Base-rate neglect", the disease/test example — no person named in the row. |
| 2026-08-31 | `p&(q∨r), q⊃s, r⊃t ⊢ p&(s&t)` (CLI-130, comprehensive §1b) | The row names "Adams' half-essentialness", and Ernest W. Adams is a real, checkable logician (*The Logic of Conditionals*, 1965/1975) — but a dedicated check could not confirm "half-essentialness" as his genuine terminology. The verified, related term in his own work is "marginal essentialness of premises" (Adams 1981, *Journal of Philosophical Logic* 10), a different paper and not obviously the same concept. Attributing the row's own label to Adams without that confirmation risks putting a term in his mouth he may never have used — exactly the error §13.1 calls the worst in the file. Left for a person with the actual paper in hand to confirm the term (or correct the inventory) before this is imported. |
| 2026-08-31 | `c⊃a, c⊃b, a, b ⊢ c` (CLI-131, comprehensive §1b) | "Agglomeration", and the open branch is called "the lottery paradox" — but the row names no person (not Kyburg, to whom the paradox is usually credited in the literature). |
| 2026-08-31 | `Kbr, Ki ⊢ Kb` (CLI-132, comprehensive §1b) | "The Red Barn" — a named case, not a named person; the row credits no one. |
| 2026-08-31 | `∼p∨q, ∼q∨r, ∼p∨∼r ⊢ p` (CLI-149, comprehensive §1b) | No philosopher named — "three propositions each individually neutral on `p`" describes the shape, not a source, and §1 carries no `sep` line. |
| 2026-08-31 | `⊢ p ⊃ (q⊃p)` (CLI-203, comprehensive §2.1) | Duplicates `positive-paradox` already in the database (`p ⊢ q⊃p`) — the closed axiom and the premised sequent are the same principle one deduction-theorem step apart, and §2's own `sep` line lists eight articles with no way to tell which covers this row, so there is no independent source to justify treating them as separate entries. |

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

**2026-08-30, third `imports`-source firing.** Course queue empty; continued
Restall's Chapter 3 bank: `converse-error` (Ex 3.4.17, `p⊃q ∴ q⊃p`,
**invalid** — Restall's own sharp pairing against the valid 3.4.8/3.4.11
already in the database), `peirce-detached` (Ex 3.9, `(r⊃∼w)⊃r ∴ r`, valid),
and `conditional-crossover` (Ex 3.10, `(j⊃c)&(e⊃d) ∴ (j⊃d)∨(e⊃c)`, valid —
the item the inventory itself calls "the most startling item in the book").
All three verdicts checked against `derive.py` before writing.

`converse-error` gets `looks_like: contraposition`: it is precisely the
error a student makes by dropping the negations from `contraposition`'s
valid `p⊃q ≡ ∼q⊃∼p`, and its single countermodel (`p=F, q=T`) was checked
against `derive.py`'s output before going into `interest`.

`peirce-detached`'s derivation is `peirce-law`'s own proof with the
outermost assumption-and-⊃I removed — the Peircean conditional arrives as a
premise here rather than something to introduce, so the same nested reductio
runs one level shallower. `looks_like: peirce-law`. Checked against
`nd.check()` directly (13 lines) before being written into `proofs.py`.

`conditional-crossover`'s first proof attempt (case split on the atom `c`,
then re-deriving `∼j` from `j⊃c` and `∼c` before applying the vacuous-
conditional move) ran 30 lines with all five §14.3 triggers present — which
would have made it a fifth `extremely hard` derivation against the guide's
own warning that the band is meant to stay at two or three per method and
the test suite fails at five. Found a shorter route instead (case split on
`j` directly, so the `∼j` branch already has what it needs without
re-deriving it): 27 lines, same five triggers, but under the 29-line
threshold, so it scores `hard`. This is a case of finding a better proof,
not of scoring around the label — the entry did not change, the search did.
While searching this proof it became clear that the premise's second
conjunct, `e⊃d`, is never touched by either branch; checked independently
that `j⊃c` alone already entails the conclusion (`derive.py`, 0
countermodels), and said so in `interest` rather than leaving it implicit.

`build.py --write`, `python3 difficulty.py --diff` (clean — the `nd`
difficulty of all three matched the rubric without an override), `svg.py`,
`svg.py --check`, `inventory.py --locks`, and `node --test
"_tests/*.test.mjs"` all clean (512/512). `extremely hard` (nd) count
unchanged at 3. Imports queue: 27 candidates left of 48 (21 now in the
database).

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled `texlive-latex-base texlive-latex-recommended
texlive-latex-extra texlive-pictures texlive-binaries dvisvgm
texlive-humanities texlive-science` via `apt-get`, matching the two prior
firings' notes. The `session-start-hook` suggestion from those two notes is
still open.

**2026-08-30, fourth `imports`-source firing.** Course queue still empty;
continued mining Restall's Chapter 3 bank ("What is worth mining") and last
year's archive ("Also worth taking"): `disguised-converse` (Ex 3.6,
`∼(b&∼s) ∴ s⊃b`, **invalid** — the material conditional `b⊃s` written as a
negated conjunction, concluding its own converse), `orange-blossom` (Ex 3.5,
`(j&∼b)⊃∼j ∴ j⊃b`, valid — Restall's "counterintuitively valid" advertising
example), and `antecedent-strengthening-converse` (OLD-PS3 Q10,
`((p&q)⊃r)⊃(p⊃r)`, **not a tautology** — the converse of antecedent
strengthening, whose valid direction, `p⊃q ⊨ (p&r)⊃q`, is itself still
queued as an import candidate). All three verdicts and countermodels
checked against `derive.py` before writing.

`disguised-converse` gets `looks_like: converse-error`: the premise
`∼(b&∼s)` is `converse-error`'s own conditional dressed in a negated-
conjunction spelling, and `interest` also reports that the entry's own
`premise_analysis` marks the premise `idle` — the countermodel to `s⊃b`
alone survives untouched with the premise added back.

`orange-blossom` gets `looks_like: contraction-detached`: unpacked with
`exportation` and `contraposition` (both already separate entries), the
premise `(j&∼b)⊃∼j` is exactly `contraction-detached`'s own antecedent
pattern, `j⊃(j⊃b)`, in disguise — checked against a brute-force truth-table
script before it went into `interest`, not just asserted. Its derivation
(assume `j`, then a nested reductio on `∼b`) is 9 lines with two triggers
(an undictated reductio, a subproof inside a subproof) — `medium`, matching
`difficulty.py`'s own suggestion.

`antecedent-strengthening-converse` has no partner to set `looks_like`
against yet — the valid principle it is a converse of is still an
unimported imports-queue candidate (`p⊃q ⊨ (p&r)⊃q`) — so `course.note`
says so, for whoever imports that one next to link them.

`build.py --write`, `python3 difficulty.py --diff` (clean), `svg.py`,
`svg.py --check`, `inventory.py --locks`, and `node --test
"_tests/*.test.mjs"` all clean (512/512). Imports queue: 24 candidates left
of 48 (24 now in the database).

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled `texlive-latex-base texlive-latex-extra
texlive-fonts-recommended texlive-pictures texlive-science dvisvgm` via
`apt-get`, matching every prior firing's note. The `session-start-hook`
suggestion from those notes is still open.

**2026-08-30, fifth `imports`-source firing.** Course queue confirmed empty
again. Three from the imports queue: `antecedent-strengthening` (OLD-PS2
Q2(b), `p⊃q ⊨ (p&r)⊃q`, valid), `redundant-disjunct` (OLD-PS5 Q6, `⊢
((p∨q)⊃p)≡(q⊃p)`, valid, an ungraded bonus there), and
`two-switches-lightbulb` (Restall Ch 6 p.65, `(p&q)⊃r ⊨ (p⊃r)∨(q⊃r)`, valid
— the overlap §1 already flags: "already Restall p.65 (two-switches
lightbulb) — import with his vehicle"). One row skipped as a duplicate and
logged in the table above (`p≡q, p≡∼q ⊢ ∼p`).

`antecedent-strengthening` completes the pair `antecedent-strengthening-
converse` was left waiting for four firings ago: `looks_like` set both ways,
and the converse's `course.note` and `interest` updated to drop the "not yet
imported" caveat and name it directly.

`redundant-disjunct`'s derivation needed `∨E` for one direction of the
`BicondI` (the other is dictated — assume `q`, build the disjunction,
eliminate) — the case that assumes `p` has to reiterate it to close, per
§6.4's rule for a case whose assumption is its own conclusion.
`difficulty.py --diff` caught that its `nd` was scored `medium` by hand when
the rubric says `hard`: the "more than ten derived lines" trigger counts
every non-`Pr` line, assumptions included, not just the lines that derive
something new, and the six assumptions across two nested `BicondI` halves
push a 14-line proof over that count. Took the rubric's suggestion rather
than argue `course.note`.

`two-switches-lightbulb`'s derivation does not split symmetrically on `p`
and `q` the way the tautology form might suggest: it rules out `p` alone
(assuming `p` and `q` together already trips the premise to `r`, which
would secure the disjunction outright, so the reductio rules `p` out on its
own) and then builds `p⊃r` vacuously from that `∼p`, never touching `q`
directly. The technique — force one disjunct's negation, squeeze the other
out of the contradiction — is the same one `the-monster`'s proof already
uses; said so in `interest` and in `course.note` as a pairing suggestion,
without setting `looks_like`, since the two forms differ in more than
letters (one carries a premise, the other is a bare tautology).

`build.py --write`, `python3 difficulty.py --diff` (clean after the
`redundant-disjunct` correction), `svg.py`, `svg.py --check`,
`inventory.py --locks`, and `node --test "_tests/*.test.mjs"` all clean
(512/512). `extremely hard` (nd) count unchanged at 3. Imports queue: 21
candidates left of 48 (27 now in the database).

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled `texlive-latex-base texlive-latex-recommended
texlive-latex-extra texlive-pictures texlive-binaries dvisvgm
texlive-humanities texlive-science texlive-fonts-recommended` via
`apt-get`, matching every prior firing's note. The `session-start-hook`
suggestion from those notes is still open.

## 2026-08-31 — course inventory now empty; three from the imports brainstorm

The course inventory (`inventory.py --status`) reports zero candidates left,
so this firing worked `--source imports` exclusively, taking its next three:
§3, the brainstormed candidate list.

`conditional-excluded-middle` (`⊢ (p⊃q)∨(p⊃∼q)`, valid). Named champions —
Stalnaker and Lewis — so cited rather than left `appearances_pending`, but
the champions have no single primary text on hand to quote from directly.
Fetched Egré & Rott's SEP entry "The Logic of Conditionals" (§3.3) instead,
which states the fact this entry needs verbatim: Stalnaker's system is
"C2 with the incorporation of CEM into VC" — Lewis's own axiomatization plus
this one further axiom. `interest` is careful to say what is and is not
being claimed: for material `⊃` the schema is a one-line tautology (proved
here), and the genuine dispute is over the identically-shaped axiom for a
conditional sensitive to non-actual worlds, not over this entry's own
material-conditional instance. Lives up to the inventory's "Monster-tier"
billing on `nd`: neither disjunct is dictated, so the proof has to open with
an undictated `q ∨ ∼q` lemma (the `excluded-middle` shape) before `∨E` can
even start. 22 lines, `hard`.

`bivalence-pigeonhole` (`⊢ (p≡q)∨(q≡r)∨(p≡r)`, valid). No champion named in
the brainstorm entry, so `appearances: []` and `appearances_pending: true`;
`interest` says a logic text's discussion of bivalence as a pigeonhole
principle would settle it. The derivation is the longest now in the
database (106 lines, surpassing `biconditional-as-agreement`'s 85) — three
`p∨∼p`-shaped lemmas feeding a case split that is deliberately lopsided:
when `p` and `q` already agree the first disjunct settles it without
touching `r` at all, and only the two disagreement branches open the third
lemma. `extremely hard` on `nd`, the fourth entry to wear that band and
exactly at the cap the test suite enforces (`worn.length <= 4`) — noted in
case a fifth ever arrives and the threshold needs raising rather than
excusing.

`self-undermining-biconditional` (`p⊃∼p ≡ ∼p`, valid). No champion named;
`appearances_pending: true`. Strengthens the existing
`self-undermining-conditional` (`c⊃∼c ⊢ ∼c`, PS2.8b/PS4.2b) to a full
equivalence — `looks_like` set to it, one-directional, per the existing
convention of pointing the newer/more-specific entry at the earlier one
rather than editing back. The → half repeats that entry's reductio
verbatim on `p`; the ← half is the vacuous direction. `interest` also flags
the near-miss with Aristotle's thesis (`∼(p⊃∼p)`), which looks like a
mirror image but is classically contingent rather than a theorem — worth
distinguishing since a reader who has just seen this entry is primed to
expect the same verdict.

Checked `SOURCE_QUOTES.md` was not touched (only course/Restall/archive
appearances are checked against it, and none of these three are). Checked
the CEM quote against the fetched SEP page directly rather than composing
one, per the two things past firings got wrong: it is the source's own
sentence, not a description of where the form was set wearing quotation
marks, and the "longest derivation" and "fourth extremely-hard entry"
claims in `bivalence-pigeonhole`'s `interest`/comment were checked against
`nd.lines` and the actual count across the database, not asserted from
impression.

`build.py --write`, `python3 difficulty.py --diff` (clean, 0 differ),
`svg.py` (12 SVGs, 4 blocks × 3 entries), `svg.py --check`,
`inventory.py --locks` (0 practicable methods locked), `manifest.py
--check-merge` (108 entries, nothing lost), and `node --test
"_tests/*.test.mjs"` (512/512) all clean. `extremely hard` (nd) count now 4
of 4 allowed. Imports queue: 17 candidates left of 48 (30 now in the
database).

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled the same package list as every prior firing via `apt-get`. The
`session-start-hook` suggestion from those notes is still open.

**2026-08-31, sixth `imports`-source firing.** Course queue still empty.
Three from §3's "Named-form completions" and "Discussion-question material":
`destructive-dilemma` (`p⊃q, r⊃s, ∼q∨∼s ⊢ ∼p∨∼r`, valid), the disjunction
identity `p∨q ≡ (p⊃q)⊃q` (imported as `disjunction-from-conditional`), and
Ross's paradox (`p ⊢ p∨q`, imported as `ross-paradox`).

`destructive-dilemma` looks like `constructive-dilemma`'s mirror image and
is not one to derive: the constructive form gets each disjunct by a bare
`⊃E`, but a negative conclusion names no elimination rule, so each case
here opens its own reductio (assume the antecedent, collide with the
disjunct naming its negation, cited outward rather than reiterated, per the
De Morgan I precedent) before `∨I` has anything to extend. Sixteen lines,
`hard` against the sibling entry's `medium` -- same two premises, same
shape, and the difference is entirely in what the goal does and does not
name. No champion in the row, so `appearances_pending`.

The disjunction identity was the one that took redrafting. The straight
proof of its `⊃`-direction is the six-line proof-by-cases `curry-sequent`
and everything else in this database already builds; the converse needed
`p∨q` out of `(p⊃q)⊃q`, and `p∨q` is not conditional-shaped, so the first
draft built `∼p` and `∼q` separately before assembling a vacuous `p⊃q` from
them -- 29 lines, which is `ND_EXTREME_LINES`, and with all five triggers
already present that would have been a fifth `extremely hard` nd entry
against a cap of four. Rewriting it to refute each disjunct only where it
is needed -- once directly against the reductio assumption, once again
after `(p⊃q)⊃q` hands back `q` -- dropped it to 24 lines with the same five
triggers, which is `hard` rather than the band the cap forbids. Worth
recording since the difference is not in what the proof shows, only in how
much of the refutation work it repeats. `appearances_pending`; no champion
in the row, and the "cf. OLD-PS5 Q6" aside in the source names a near
neighbour, not an appearance.

Ross's paradox is `addition`'s one-line `∨I` read as an instruction --
"post the letter" licenses "post it or burn it" by the same rule that
licenses the parallel indicative inference, and the puzzle is entirely
about what the imperative reading is doing that the truth-functional one
is not. This row does name a champion, so it is not `appearances_pending`:
fetched McNamara and Van De Putte's SEP entry "Deontic Logic" (§6.3) rather
than guessing a slug, confirmed the current byline before writing `who`,
and quoted its own sentence naming Ross (1941) verbatim rather than
composing one -- the primary 1941 paper itself is not something this
routine has on hand to quote.

Caught one error before pushing: the disjunction identity's `interest`
carried a garbled fragment (`⊃q, p, q`) left over from redrafting the proof
sentence above, not something `build.py`'s atom-renaming pass produced --
worth naming because it read at first like a renaming bug and was not one.
Fixed by re-reading the entry back per §7a rather than trusting the first
draft.

`build.py --write`, `python3 difficulty.py --diff` (clean, 0 differ),
`svg.py` (12 SVGs, 4 blocks × 3 entries), `svg.py --check`,
`inventory.py --locks` (0 practicable methods locked), `manifest.py
--check-merge` (114 entries, nothing lost), and `node --test
"_tests/*.test.mjs"` (513/513) all clean. `extremely hard` (nd) count
unchanged at 4 of 4 allowed. Imports queue: 11 candidates left of 48 (36
now in the database).

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled the same package list as every prior firing via `apt-get`. The
`session-start-hook` suggestion from those notes is still open.

**2026-08-31, `imports`-source firing.** Course queue still empty
(`inventory.py --status`). The imports queue held exactly two rows, both
from Restall's Chapter 7 and both De Morgan directions the two existing
entries had already left as open loops:
`de-morgan-disjunction-easy` (`∼(A∨B) ⊢ ∼A&∼B`, Ex {7.1}, item 4 of 5,
valid) and `de-morgan-conjunction-hard` (`∼(A&B) ⊢ ∼A∨∼B`, "the hard De
Morgan," Ex {7.2}, item 2 of 5, valid). Both cleared the queue; the imports
inventory now reports zero candidates left.

Checked both against the database before writing. `de-morgan-conjunction-hard`
is exactly the row `de-morgan-conjunction-easy`'s own `course.note` already
named as "still in the imports queue" — no new lookup needed, just closing
the loop. `de-morgan-disjunction-easy` is the → half of the existing
`de-morgan-disjunction` biconditional, and that entry's `course.note` records
PS5.4 as having set precisely this direction for graded ND work — so rather
than treat it as a plain duplicate (per the near-duplicate check in §6) or
leave it a silent gap in ND practice, it is imported as its own entry
(`looks_like: de-morgan-disjunction`, mirroring the precedent
`de-morgan-conjunction-easy` already set for isolating one half of a
biconditional Restall poses as a standalone exercise) with its
`course.problem_set` left empty per §11c's rule for this file, and the PS5.4
relationship stated directly in `course.note` instead so a reader is told
the gap is accounted for, not hidden. `inventory.py --locks` still reports
zero after the import, confirming no lock was missed.

`de-morgan-disjunction-easy`'s two reductios are each dictated (their
subgoals `~p` and `~q` are themselves negations), so `nd` is `easy`, an
overridden `medium` from `difficulty.py`'s blunt `uses_indirect_proof` check
— the same false positive already on record for `double-negation-elimination`,
explained the same way in `course.note`. `de-morgan-conjunction-hard`'s
reductio assumes the negation of a disjunctive goal, which is genuinely
undictated, plus one subproof nested inside another and 15 derived lines:
three real triggers, `hard`, and `difficulty.py --diff` agrees.

`build.py --write`, `python3 difficulty.py --diff` (2 differ: the
pre-existing `double-negation-elimination` override and the new
`de-morgan-disjunction-easy` override, both already explained in
`course.note`), `svg.py` (8 SVGs, 4 blocks × 2 entries), `svg.py --check`,
`inventory.py --locks` (0 practicable methods locked), `manifest.py
--check-merge` (123 entries before, 125 after, nothing lost — the branch
was already up to date with `main`, no merge to resolve this firing), and
`node --test "_tests/*.test.mjs"` (513/513) all clean. `extremely hard`
(nd) count unchanged at 4 of 4 allowed. Imports queue: 0 candidates left of
48 (47 now in the database, 1 settled). Comprehensive queue (untouched this
firing, since the imports queue was non-empty and sources are not mixed
within a firing): 114 candidates.

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled `texlive-latex-base texlive-latex-recommended
texlive-latex-extra texlive-pictures texlive-binaries dvisvgm
texlive-humanities texlive-science texlive-fonts-recommended` via
`apt-get`, matching every prior firing's note. The `session-start-hook`
suggestion from those notes is still open.

**2026-08-31, first `comprehensive`-source firing.** Course queue and
imports queue both confirmed empty (`inventory.py --status`,
`--status --source imports`), so this firing works the Comprehensive Logic
Inventory (the SEP sweep) for the first time. Read §11d before starting.

Took the first three candidates (`inventory.py --next 3 --source
comprehensive`), all from §1 ("THE VOID"), which carries no `*SEP:*` line —
confirmed by reading the section header directly. Per §11d's fallback for
an unclear article, each is attributed to the philosopher the row itself
names, not guessed at a SEP slug:

- **`abelian-axiom-nested`** (CLI-101, `⊢ (((p⊃(q&r))⊃(q&r))⊃p)`). The
  file's own §6.1 item 9 cross-references this row explicitly as "Three-atom
  version (CLI-101, §1 rank 1)" of the axiom already in the database as
  `abelian-axiom`. Rather than treat that as coincidence, reused
  `abelian-axiom`'s own verified appearance (Meyer & Slaney, SEP's
  *Relevance Logic* article) wholesale — not a fresh guess, but the same
  attribution already confirmed for the identical axiom schema, now
  instantiated with `q & r` in place of `q`. `looks_like: abelian-axiom`.
  Countermodel (`p=F, q=T, r=T`, 1 of 8) matches the row's own stated
  countermodel exactly.
- **`boethius-thesis`** (CLI-102, `⊢ ((p&q)⊃r)⊃∼((p&q)⊃∼r)`). No existing
  entry (checked `who`/`work`/`id` for "boethius" first). §1 has no `sep`
  field, so the appearance names Boethius directly, per Kneale & Kneale's
  reading of *De Syllogismo Hypothetico* 843D, `url: null`, `fidelity: our
  reconstruction` — no verbatim text available, so `quote` is left out
  rather than composed. The file's own §6.5 records that this exact
  attribution is contested (Wansing argues Kneale & Kneale misread
  Boethius; Bonevac & Dever cannot find the related Abelard principle in
  him at all), so that caveat is written into `course.note`
  (instructor-facing, never rendered) rather than dropped or overclaimed in
  `interest`. Countermodel count (6 of 8) matches the row exactly.
- **`quantifier-shift-2x2`** (CLI-105, the quantifier-shift fallacy
  `(∀x)(∃y)Rxy ⊬ (∃x)(∀y)Ryx` eliminated over a two-element domain). The
  row itself names a real, checkable source — "Restall works this exact
  propositional tree in Box 9.1 (p. 102)" — so the appearance is Restall's
  *Logic* directly (`who: "Greg Restall"`, `url: null`), the same format
  already used for Restall citations from the imports inventory. The
  relational atoms `Raa, Rab, Rba, Rbb` were written as given and left for
  `build.py` to legalise (`R` is not a legal first letter — atoms must be
  lower-case — and the legaliser's own rule of "first letter is the name,
  rest is the subscript" does the right thing here: `Raa → r_aa`, etc.,
  confirmed in the build's own rename log). Countermodel count (2 of 16)
  matches the row exactly.

Checked all three against the database by id, by content (`Boethius`,
`quantifier`/`shift`/`Restall`), and by shape before writing — no
near-duplicates. All three are invalid, so no `proofs.py` entry: each
carries an `nd.note` describing where a derivation attempt breaks down,
checked against the actual computed tree rather than composed on
intuition. Every stated countermodel and countermodel count was checked
against `derive()`'s own output before writing, per the file's own
standing caution (§0) that classical verdicts here are independently
recomputed and can differ from a source's own system — none did, here, but
none of the three needed the connexive/relevance caveat in `interest`
either, since the classical countermodel counts already agreed with the
file's own recomputed ones.

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled the same `texlive-*`/`dvisvgm` package list as every prior
firing via `apt-get`. The `session-start-hook` suggestion from those notes
is still open.

`build.py --write` (atoms renamed as expected; difficulty scores newly
written for all three, no `None`s left), `python3 difficulty.py --diff` (2
differ, both pre-existing overrides already explained in `course.note` —
`double-negation-elimination` and `de-morgan-disjunction-easy` — nothing
from this firing), `svg.py` (9 SVGs, 3 blocks × 3 invalid entries),
`svg.py --check` (every SVG current), `inventory.py --locks` (0
practicable methods locked), `manifest.py --check-merge` (128 entries, 125
expected from the merge parents plus 3 new, nothing lost — the branch was
already up to date with `main`, no merge to resolve this firing), and
`node --test "_tests/*.test.mjs"` (513/513) all clean. `extremely hard`
count unchanged at 4 of 4 (nd) — this firing added none, since all three
entries are invalid and carry no `nd` score. `git diff --name-only
origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md` confirmed
empty; none of the three appearances is a course appearance, so none
needed it. Comprehensive queue: 111 candidates left of 274 (72 now in the
database, 3 quarantined, 82 unreadable, 6 settled). Course and imports
queues untouched this firing (both already empty) and remain at 0.

**2026-08-31, second `comprehensive`-source firing.** Course and imports
queues re-confirmed empty; continued the Comprehensive Logic Inventory
where the last firing left off, still §1 ("THE VOID"), still no `sep`
line. Took `--next 4` rather than 3, since the row at position 0
(CLI-106) turned out to have no named champion — logged above, in the
skip table, rather than imported.

- **`aristotle-second-thesis`** (CLI-107, `⊢ ∼((p⊃(q&r)) & (∼p⊃(q&r)))`).
  The row names "Aristotle's Second Thesis" directly. Fetched SEP's
  *Connexive Logic* article (Wansing) to confirm the exact schema and its
  source rather than guess: it gives `∼((A→B) ∧ (∼A→B))`, attributes the
  label to McCall (2012), and cites *Prior Analytics* II.4, 57b3–14 — the
  same passage that grounds Aristotle's Thesis proper. This instance's
  schema matches exactly, substituting `q & r` for the bare consequent, so
  the appearance names Aristotle directly (`work: "Prior Analytics (per
  Storrs McCall's reading)"`, `locus: "II.4, 57b3–14"`, `url: null`) —
  not the SEP article, per §11d's rule for a section with no `sep` line.
  Countermodel count (2 of 8) matches the row exactly.
- **`abelard-first-principle`** (CLI-108,
  `⊢ ∼(((p∨q)⊃r) & ((p∨q)⊃∼r))`). The row names "Abelard's First
  Principle". Same SEP article gives `∼((A→B) ∧ (A→∼B))` for this one,
  attributes it (via Martin 2004) to Abelard's *Dialectica*, and notes
  Routley and Angell later gave the same schema other names without
  crediting him. Confirmed Martin's actual citation independently
  (Christopher J. Martin, "Logic", in *The Cambridge Companion to
  Abelard*, 2004, pp. 158–199) rather than take the SEP article's word for
  it, since that citation — not the SEP page — is what the appearance
  names, again per §11d. No precise page-in-*Dialectica* locus was found
  for this specific principle, so the citation stops at Martin's chapter
  rather than inventing one. Countermodel count (2 of 8) matches.
- **`boethius-nested-consequent`** (CLI-109, `p⊃(q⊃r) ⊢ ∼(p⊃(q⊃∼r))`).
  The row's own description is "Boethius nested one level", but checked
  the claim rather than passed it through: a genuine nested instance of
  Boethius' Thesis would negate the inner conditional outright
  (`∼(q⊃r)`), and this row instead flips only its consequent (`q⊃∼r`) —
  a different formula, not a substitution instance of the theorem already
  in the database as `boethius-thesis`. Imported it anyway, since the row
  does name Boethius and the file's own closing note on §1 groups CLI-109
  with CLI-102 and CLI-108 under "vacuous truth is the culprit" — but
  `type: "discussed"` rather than `"used"`, and both `interest` and
  `course.note` say plainly that this is a cousin, not a literal
  instance, so no connexive-logic verdict is claimed for it (unlike the
  other two, which are exact substitution instances and do stay theorems
  under a connexive reading). Countermodel count (6 of 8) matches.

**A real bug in `derive.py` surfaced while checking `aristotle-second-
thesis`, not something specific to this import.** Its truth table came
back invalid (2 countermodels), but its tableau came back fully closed —
tree and table disagreeing about the same entry. Traced it to `closes()`
(then at line 134): it detected a branch contradiction by string surgery
— "does some formula on the branch start with `∼`, and if so is the rest
of that string, after dropping the first character, also on the branch"
— rather than by checking, structurally, whether one formula's main
connective is negation over another. `∼p ⊃ (q & r)` renders as a string
starting with `∼` purely because its *antecedent* is a negated atom; its
main connective is `⊃`, and it is not the negation of `p ⊃ (q & r)`. With
both on the same branch (from `&`-splitting the assumed conjunction), the
old check closed the branch on a false contradiction — reporting the
theorem *valid* by tree while it is *invalid* by table, and invalid in
fact (2 real countermodels). Rewrote `closes()` to take the branch's
parsed `Node`s instead of `show()`-rendered strings, and to check each
formula's actual top-level connective against `negate()` of the others,
rather than truncate the string. Verified three ways before trusting it:
`derive.py --check` still reproduces all existing entries; a fresh scan
comparing `derive()`'s table verdict against its own tree verdict across
all 131 entries (128 existing plus the three new) turned up zero
mismatches, where it had found exactly one (`aristotle-second-thesis`)
before the fix; and `aristotle-second-thesis`'s tree, rebuilt after the
fix, now opens on exactly the two rows the table already gave as
countermodels. No other of the 128 pre-existing entries was affected —
the bug needed a conditional with a negated-atom antecedent sitting
alongside the same conditional's unnegated form on one branch, a shape
that happens to be exactly what `aristotle-second-thesis` decomposes
into and that nothing already in the database triggers.

Neither `abelard-first-principle` (antecedent a disjunction) nor
`boethius-nested-consequent` (no negated-atom antecedent at the point
where its branches split) triggers the shape the bug needed, so both
were already correct on the first `derive()` call and are unchanged by
the fix, beyond being re-embedded for consistency —
`boethius-nested-consequent`'s tree was `hard` (9 rule applications) in
both the pre-fix and post-fix run. Only `aristotle-second-thesis`
moved: from the bug's spurious `easy` (tree fully closed, nothing left
to explore) to the correct `hard` (8 applications, 3 open branches) —
`build.py --write`'s difficulty diff printed exactly that one change and
nothing else.

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled the same `texlive-*`/`dvisvgm` package list as every prior
firing via `apt-get` (two unrelated packages, `mesa` and `ruby3.2`,
404'd from the mirror and were left uninstalled — neither is on the
package list this project needs, and `latex`/`dvisvgm` both resolved
afterward).

`build.py --write` (three entries normalised, atoms already legal so no
renames; the one difficulty note was `aristotle-second-thesis`'s tree
score correcting itself post-fix, above), `python3 difficulty.py --diff`
(2 differ, both pre-existing overrides already explained in
`course.note` — `double-negation-elimination` and
`de-morgan-disjunction-easy` — nothing from this firing), `svg.py` (9 new
SVGs on the first pass, 1 more — `aristotle-second-thesis`'s tree — after
the `derive.py` fix and re-embed), `svg.py --check` (every SVG current),
`inventory.py --locks` (0 practicable methods locked), `manifest.py
--check-merge` (131 entries, 128 expected from the merge parents plus 3
new, nothing lost — the branch was already up to date with `main`, no
merge to resolve this firing), and `node --test "_tests/*.test.mjs"`
(513/513) all clean. `extremely hard` count unchanged at 4 of 4 (nd) —
all three new entries are invalid and carry no `nd` score. `git diff
--name-only origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md`
confirmed empty; none of the three appearances is a course appearance, so
none needed it. Comprehensive queue: 107 candidates left of 274 (75 now
in the database, 3 quarantined, 82 unreadable, 7 settled — CLI-106 newly
logged above). Course and imports queues untouched this firing (both
already empty) and remain at 0.

## 2026-08-31 (continued) — three more from the Comprehensive Logic
Inventory: McCarthy, Peirce, van Benthem

Course and imports queues both still empty (checked again this firing);
comprehensive is the only source with anything left. Took the next three
candidates §1/§1b offered — CLI-110, CLI-111, CLI-112 — of which only
CLI-111 names a philosopher in the row (McCarthy's qualification
problem). CLI-110 and CLI-112 are logged above, same reason as CLI-106:
a named fallacy, not a named person, and §1 carries no `sep` line to
check against either. Skipped past them to CLI-122 (Peircean future
excluded middle, via the two-history modal expansion in §1b) and CLI-137
(van Benthem's goodness/badness preference identity, §1b), both of which
do name a philosopher, and imported those alongside CLI-111 —
`mccarthy-qualification-problem`, `peircean-future-excluded-middle`,
`van-benthem-goodness-preference`. All three invalid (two blocks each,
no `nd`), `appearances` attributed per §11d's fallback — the philosopher
the row names, `fidelity: "our reconstruction"`, `url: null`, no `quote`
— since none of the three has a `sep` line and none was read from an
actual SEP article. `derive.py`'s countermodels matched the inventory
row's own counts exactly for all three before anything was written
(McCarthy 1 of 8, Peirce 2 of 16, van Benthem 6 of 16). Checked the
database for near-duplicates first — `peirce-law` and `peirce-detached`
share a surname but not a form, no other collision — and considered
`looks_like` against `distributed-knowledge` for the McCarthy entry
(both an "invisible premise" shape) but left it unset: the two forms are
not the same schema in different letters, only the same theme, and
`looks_like` is for the former.

**A real bug in `tables.py` surfaced while checking
`van-benthem-goodness-preference`, not something specific to this
import.** Its table is the premise-less, single-formula layout (§4.1),
which pads every non-connective position — atoms, parentheses — with a
`\phantom{...}` spacer so that a value under a connective lines up with
the same column width on every row. The text those phantoms measure came
from `_tok_latex()`, which for a connective token maps through `GLYPH`
correctly but for anything else — atoms included — returned the token's
raw ASCII (`t.text`) rather than routing it through `atom_latex()`, the
function that braces a subscript (`g_x` → `g_{x}`). `argument_table()`
already calls `atom_latex()` on its own atom cells and was never
affected; nothing before this entry had put a subscripted atom in the
*premise-less* layout, so the bug had nothing to trip it. The result was
`\phantom{g_x}` reaching the page instead of `\phantom{g_{x}}` — legal
LaTeX (a single-character subscript needs no braces to compile) but a
violation of the house rule that a subscript is always braced, caught by
`node --test`'s "a subscripted atom is typeset as one" check, which
failed on exactly this entry and nothing else (511/513 before the fix,
513/513 after). Fixed by making the non-connective branch of
`_tok_latex()` return `atom_latex(t.text)` instead of `t.text` — a
no-op on parentheses, correct bracing on a subscripted atom. Verified by
re-running `build.py --write` (a clean second pass, no further notes)
and `svg.py` (2 more SVGs regenerated — the one entry's table and
compact table — everything else already current and untouched).

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled the same package list as every prior firing —
`texlive-latex-base`, `texlive-latex-extra`, `texlive-fonts-recommended`,
`dvisvgm`, `texlive-pictures` (for `qtree`), `texlive-humanities` (also
`qtree` — `texlive-pictures` alone did not carry it this time) and
`texlive-science` (for `fitch`) — via `apt-get`. All resolved.

`build.py --write` (three entries normalised: atoms renamed to legal
form on the first pass — `ab → a_b`, `f1/f2/g1/g2 → f_1/f_2/g_1/g_2`,
`Bx/By/Gx/Gy → b_x/b_y/g_x/g_y` — plus the three difficulty scores each
method computed; a second clean pass after the `tables.py` fix printed no
further notes), `python3 difficulty.py --diff` (2 differ, both
pre-existing overrides already explained in `course.note` —
`double-negation-elimination` and `de-morgan-disjunction-easy` — nothing
from this firing), `svg.py` (9 new SVGs on the first pass, 2 more after
the `tables.py` fix and re-embed), `svg.py --check` (every SVG current),
`inventory.py --locks` (0 practicable methods locked), `manifest.py
--check-merge` (134 entries, 131 expected from the merge parents plus 3
new, nothing lost — the branch was already up to date with `main`, no
merge to resolve this firing), and `node --test "_tests/*.test.mjs"`
(513/513, after the `tables.py` fix). `extremely hard` count unchanged
at 4 of 4 (nd) — all three new entries are invalid and carry no `nd`
score. `git diff --name-only origin/main...HEAD --
EncyclopediaOfArguments/SOURCE_QUOTES.md` confirmed empty; none of the
three appearances is a course appearance, so none needed it.
Comprehensive queue: 104 candidates left of 274 (78 now in the database,
3 quarantined, 82 unreadable, 7 settled — CLI-110 and CLI-112 newly
logged above). Course and imports queues remain at 0.

## 2026-08-31 (continued) — three more from the Comprehensive Logic
Inventory: Sobel, Ockham, Boole

Course and imports queues both re-confirmed empty
(`inventory.py --status`, `--status --source imports`); comprehensive is
the only source with anything left. `inventory.py --next 3 --source
comprehensive` offered CLI-113, CLI-114, CLI-115, of which only CLI-114
names a real, checkable person in the row (the "Sobel-sequence"
intuition). CLI-113 and CLI-115 are logged above, same reason as CLI-110
et al.: a named fallacy or intuition, not a named person. Widened the
search (`--next 20`) rather than stop at one importable row out of
three, and worked forward in queue order evaluating each row for an
explicit named philosopher before importing or logging it — eleven more
rows skipped and logged above (CLI-116, 121, 124, 126, 127, 129, 130,
131, 132), stopping once three were in hand: `sobel-sequence-defeater`
(CLI-114), `theological-fatalism-minus-necessity` (CLI-128), and
`boole-cancellation-fallacy` (CLI-138). All three invalid, so two blocks
each and no `proofs.py` entry.

`sobel-sequence-defeater` (`p⊃q, (p&r)⊃∼q ⊢ ∼r`, 2 of 8 countermodels,
matching the row exactly) is a material-conditional skeleton of the
phenomenon the conditionals literature calls a Sobel sequence, after
Howard Sobel — verified via a dedicated research pass (Lewis's
*Counterfactuals*, 1973, crediting an unpublished Sobel manuscript; the
term itself popularised later, in the literature on counterfactuals) *before*
writing the appearance, rather than trusting the row's own label at
face value. `appearances` cites the manuscript as reported by Lewis
(`fidelity: "our reconstruction"`, `url: null`, no `quote` — nothing
verbatim is on hand), `type: "diagnosed"` since the entry stages the
shape of Sobel's phenomenon in material `⊃` rather than reproducing his
own counterfactual argument, and `interest` says so directly: the real
Sobel-sequence effect is about non-monotonic revision under a shifting
counterfactual context, which `⊃` has no mechanism to model. The valid
twin from the same two premises, `∼(p & r)`, is stated in `interest` and
checked against `derive.py` before being written down, per the file's
standing caution about a claim quoted from the computed data.

`theological-fatalism-minus-necessity` (`k, k⊃t, n⊃∼f ⊢ ∼f`, 1 of 16,
matching the row exactly) is the cleanest of the three: the classical
foreknowledge-implies-no-freedom chain needs a fourth premise, `t⊃n`
("a true past fact is a necessary one"), that this row omits, and the
single open branch (`k=T, t=T, n=F, f=T`) is exactly William of Ockham's
own move against the argument — a past truth that depends on the future
is a *soft* fact, not a *hard* one, and does not inherit necessity.
Verified the citation chain independently (Ockham's *Tractatus de
Praedestinatione et de Praescientia Dei..., c. 1321–23*, standard
translation by Marilyn McCord Adams and Norman Kretzmann) rather than
trust the row's bare "Ockhamism" label, and `course.note` flags —
following `boethius-thesis`'s own precedent — that "Ockhamist" here is
the modern analytic-philosophy-of-religion label for Ockham's move, not
a quotation from the Latin. `type: "diagnosed"`, `fidelity: "our
reconstruction"`, `url: null`, no `quote`.

`boole-cancellation-fallacy` (`(p&q) ≡ (p&r) ⊢ q ≡ r`, 2 of 8, matching
the row exactly) is George Boole's own algebra of logic tempting a
cancellation it cannot license: `(p&q)≡(p&r)` reads like `pq=pr`, and
ordinary algebra cancels the `p`, but classical logic has no such law.
A dedicated research pass confirmed the chapter reference before
writing it down rather than guessing one: Chapter II §14 of *Laws of
Thought* (1854) is where Boole notes division has no general logical
interpretation, and Chapter V ("Of the Fundamental Principles of
Symbolical Reasoning, and of the Expansion or Development of
Expressions...") supplies the Development/Expansion theorem in its
place — not Chapter VII, which is "Of Elimination", a plausible-looking
guess that turned out wrong on checking. `course.note` also cites
Hailperin's "Boole's Algebra Isn't Boolean Algebra" (*Mathematics
Magazine* 54(4), 1981) for a reader who wants the full history.
`type: "diagnosed"`, `fidelity: "our reconstruction"`, `url: null`, no
`quote`.

All three countermodel counts and the associated `interest` claims
(the valid twin `∼(p&r)`, the single open branch's exact assignment,
the "1 of 16" / "2 of 8" counts) were checked against `derive.py`'s own
output before being written down, per the file's standing caution about
a superlative or a countermodel claim not matching the computed data —
none of the three make a superlative claim, and all three countermodel
counts matched the inventory rows exactly on the first check. Checked
the database for near-duplicates and existing `sobel`/`ockham`/`boole`
ids first — none found. `course.note` on `sobel-sequence-defeater`
notes the thematic (not schema-level) connection to the existing
`antecedent-strengthening`, so no `looks_like` was set anywhere.

**The sandbox again had no LaTeX toolchain in this fresh container**;
reinstalled `texlive-latex-base texlive-latex-recommended
texlive-latex-extra texlive-pictures texlive-binaries dvisvgm
texlive-humanities texlive-science texlive-fonts-recommended` via
`apt-get`, matching every prior firing's note.

`build.py --write` (three entries normalised, no atom renames needed —
all atoms already legal single letters; difficulty scores newly written
for all three), `python3 difficulty.py --diff` (2 differ, both
pre-existing overrides already explained in `course.note` —
`double-negation-elimination` and `de-morgan-disjunction-easy` —
nothing from this firing), `svg.py` (9 SVGs, 3 blocks × 3 invalid
entries), `svg.py --check` (every SVG current), `inventory.py --locks`
(0 practicable methods locked), `manifest.py --check-merge` (137
entries, 134 expected from the merge parents plus 3 new, nothing lost —
the branch was already up to date with `main`, no merge to resolve this
firing), and `node --test "_tests/*.test.mjs"` (513/513) all clean.
`extremely hard` count unchanged at 4 of 4 (nd) — all three new entries
are invalid and carry no `nd` score. `git diff --name-only
origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md`
confirmed empty; none of the three appearances is a course appearance,
so none needed it. Comprehensive queue: 88 candidates left of 274 (79
now in the database, 3 quarantined, 82 unreadable, 22 settled — eleven
more rows newly logged above, the rest pre-existing stray backtick
matches `inventory.py`'s settled-scan has always picked up from the
log's own prose). Course and imports queues remain at 0.

## 2026-08-31 (continued) — three more from the Comprehensive Logic
Inventory: Barcan, Rantala's K axiom, Frege's self-distribution

Checked all three queues first (`inventory.py --status`, `--status
--source imports`, `--status --source comprehensive`): course and
imports both report 0 candidates, comprehensive reports 85. Worked
comprehensive, still §1b. (The branch's most recent commit before this
firing, "Import 3 forms from the comprehensive inventory: Rantala,
Frege, Löb," already carries `belief-closure-impossible-world` (CLI-140),
`hesperus-phosphorus-belief` (CLI-141) and `lob-without-the-box`
(CLI-142) — that firing did not add a narrative section here, so this
one is the first to record the sibling relationships those three set up.)

`inventory.py --next 3 --source comprehensive` offered CLI-144
(the Barcan formula), CLI-145 ("K / closure under entailment", cross-
referenced from §4.8's logical-omniscience table), and CLI-149 (three
propositions "each individually neutral on `p`"). CLI-149 names no
philosopher and §1 carries no `sep` line, so it is logged above rather
than imported. Widened to `--next 6` rather than stop at two: CLI-203
(`⊢ p⊃(q⊃p)`, "Frege's first axiom") duplicates the existing
`positive-paradox` one deduction-theorem step away and is also logged
above; CLI-204 (`⊢ (C⊃(B⊃A))⊃((C⊃B)⊃(C⊃A))`, "Frege's self-distribution;
the engine of the Deduction Theorem") does not duplicate anything on
file and became the third import.

`barcan-formula` (CLI-144). The row's own text is enough to identify
the champion without a `sep` line: "The Barcan formula" names Ruth
Barcan Marcus directly. Verified the primary citation before writing it
down rather than trusting memory — Ruth C. Barcan, "A Functional
Calculus of First Order Based on Strict Implication," *Journal of
Symbolic Logic* 11 (1946), pp. 1–16 (confirmed via Cambridge Core,
PhilPapers and Semantic Scholar) — and used her later, standard name
(`Ruth Barcan Marcus`) as `who`, matching the spelling already used
for her in `hesperus-phosphorus-belief`'s `locus`. `type: "used"`
(she is the source of the schema itself, not a diagnosis of someone
else's argument), `fidelity: "our reconstruction"`, `url: null` — no
single stable modern URL for the 1946 paper. Countermodel (`Fb2=T`
alone, 1 of 8) matches the row exactly. No `looks_like`: nothing else
in the database renders a growing-domain frame yet.

`entailment-closure-impossible-world` (CLI-145). The row's own cell
carries no `sep` line (§1b inherits none from §1), but the identical
sequent is cross-referenced by its own CLI number in §4.8's "Logical
omniscience, as a set of matched pairs" table — the "K / closure under
entailment" row — which sits under a real `*SEP:* impossible worlds
(Berto & Jago) · ...` header and states plainly that "the rendering is
licensed by the source, not invented." This is not a guess at which
article covers the row: the document itself names the article for this
exact form, just from a different section than the one the row's table
lives in. Reused `belief-closure-impossible-world`'s own verified
appearance wholesale (Veikko Rantala's semantics, as reported in Berto
and Jago's SEP entry *Impossible Worlds*), since both rows come from
the same §4.8 table and the same technique, with the `locus` narrowed
to name the K-axiom row specifically. Countermodel (`p_1=q_1=k=p_2=T,
q_2=F`, 1 of 32) matches the row exactly. `looks_like:
belief-closure-impossible-world`, and `interest` says how the two
differ — this one is the K axiom (`⊃E`-shaped), the sibling is `&E`.

`self-distribution-axiom` (CLI-204). §2's own `*SEP:*` line lists eight
articles with no way to tell which covers this row, so named the
champion instead: Gottlob Frege. Checked the exact citation (Metamath's
`ax-2` reference page) rather than assert one from memory — Proposition
2 of Frege's *Begriffsschrift* (1879), p. 26 — before writing `who`,
`work` and `locus`. `type: "used"`, `fidelity: "our reconstruction"`,
`url: null`. Valid, so it needed a derivation: three subproofs deep
(assume `p⊃(q⊃r)`, then `p⊃q`, then `p`, three `⊃E` steps to `r`, three
`⊃I` steps back out), 9 lines, one §14.3 trigger (nesting) — `medium`,
matching `difficulty.py`'s own suggestion exactly, no override needed.
Checked against `nd.check()` directly before writing into `proofs.py`.
`looks_like: self-distribution-premised`, which already anticipates
this entry in its own `interest` ("the unrestricted axiom needs three"
levels of nesting) — written before this firing, evidently in
expectation of exactly this row turning up. Also noted in `course.note`
that `K`'s own closed form (`⊢ p⊃(q⊃p)`) needs no separate import: it
is `positive-paradox`'s premised sequent (`p ⊢ q⊃p`) one deduction-
theorem step away, which is the same reasoning that sent CLI-203 to the
skip table above rather than in as a fourth entry.

Checked the database for near-duplicates and existing ids first (none
found for any of the three) before writing. `git diff --name-only
origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md`
confirmed empty; none of the three appearances is a course appearance,
so none needed it.

**The sandbox again had no LaTeX toolchain in this fresh container**;
`apt-get install` of the usual package list 404'd on two unrelated
packages (`mesa`'s `libegl-mesa0`, `ruby3.2`) from the mirror on the
first attempt, same as a prior firing's note, but this time `latex`
and `dvisvgm` did not resolve until a second `apt-get install
--fix-missing` with the identical package list completed cleanly.

`build.py --write` (three entries normalised, atoms already legal —
`a_1`/`a_2`/`b_2`, `p_1`/`q_1`/`k`/`p_2`/`q_2`, `p`/`q`/`r` — so no
renames; four new difficulty scores written, plus the proof's line/
subproof profile recomputed from what `nd.check()` actually measured),
`python3 difficulty.py --diff` (2 differ, both pre-existing overrides
already explained in `course.note` — `double-negation-elimination` and
`de-morgan-disjunction-easy` — nothing from this firing), `svg.py` (10
SVGs: 3 blocks × 2 invalid entries + 4 blocks × 1 valid entry),
`svg.py --check` (every SVG current), `inventory.py --locks` (0
practicable methods locked), `manifest.py --check-merge` (143 entries,
140 expected from the merge parents plus 3 new, nothing lost — the
branch was already up to date with `main`, no merge to resolve this
firing), and `node --test "_tests/*.test.mjs"` (513/513) all clean.
`extremely hard` count unchanged at 4 of 4 (nd) — none of the three new
entries reaches it (two invalid, carrying no `nd` score; the one valid
entry scores `medium`). Comprehensive queue: 80 candidates left of 274
(85 now in the database, 3 quarantined, 82 unreadable, 24 settled — two
more rows newly logged above). Course and imports queues remain at 0.
