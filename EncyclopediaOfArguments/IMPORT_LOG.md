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

| Date | Sequent | Why it was skipped |
| --- | --- | --- |
| 2026-08-30 | `p∨q, p ∴ ∼q` (inventory name: "Affirming a disjunct") | Duplicates `affirming-a-disjunct` already in the database (`f∨d, d ∴ ∼f`) — same form, renamed atoms, per §6's own worked example of exactly this pair. |
| 2026-08-30 | `(p&q)&∼p` (inventory name: "contradiction") | Not skipped — imported as `conjunction-with-its-own-negation`, but reshaped as `(p&q)&∼p ⊢ ⊥` rather than the bare `⊨ (p&q)&∼p` reading `split_sequent` gives a turnstile-free row by default. The row's own annotation names the derivation target directly — **ND untouched (`⊢ND ⊥` in 4 lines)** — which only makes sense if the goal is `⊥`, not the formula; §11c calls this the author's judgement to make. Logged so the row is not re-offered under a shape the database does not carry. |
| 2026-08-30 | `p≡q ≡ ∼(∼p∨∼q)∨∼(p∨q)` (locus PS2.4c) | Duplicates `biconditional-as-agreement` already in the database, which carries this exact claim from this exact locus (`(p = q) = (~(~p \| ~q) \| ~(p \| q))`). The row is genuinely ambiguous unbracketed — `≡` is right-associative in `split_sequent`, so the raw row parses as `p ≡ (q ≡ X)` rather than the intended `(p ≡ q) ≡ X` — and the queue's shape-based dedup does not see through that, offering the row again under the wrong bracketing. It is the same form under the reading the course actually poses. |
| 2026-08-30 | `p≡(q≡r) ≡ (p≡q)≡r` (inventory name: "associativity of ≡"; P1.4, table) | A genuine, valid theorem (verified: 8-row tautology) with a hand-checked 152-line `nd.check()`-clean derivation in hand — but `build.py` refuses it before the derivation is ever reached. Its own two immediate subformulas, `p ≡ (q ≡ r)` and `(p ≡ q) ≡ r`, both flatten to the identical string `p = q = r` under `formula.flat()`'s equal-precedence elision (§3.2's lossy spelling, used only to recover a tree node's parenthesisation by lookup): `subformula_index` raises `'p = q = r' is ambiguous between ['(p = q) = r', 'p = (q = r)']` during `normalise()`, before the tree or the proof are ever checked. This is not fixable by rephrasing the entry — it is what "associativity" *means*: two different bracketings of the same operator chain, indistinguishable once precedence elision drops the parentheses that would tell them apart. Any associativity claim over `≡` (or `&`, or `∨`) as a bare biconditional or a like-shaped one-directional sequent will hit the same wall; `subformula_index` would need to special-case operators it already knows are associative, which is a tooling change, not an authoring one. Logged rather than forced through. |
