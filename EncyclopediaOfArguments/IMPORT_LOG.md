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
