# Import log

Rows from the inventories that the hourly import routine met and did not
import, with the reason. Kept so that a queue which stops moving is visible
rather than silent; see `.claude/skills/import-entries/SKILL.md` §7.

Nothing here is a failure of the routine. A row holding two sequents is two
entries and a judgement about which to write; a row whose verdict disagrees
with the computed table is a question for a person. Both belong here rather
than in the database.

**Two inventories now feed the queue.** The course inventory is worked first
and the imports inventory after it, which adds a third standing reason to skip
a row, and it will be the commonest one: §3 of the imports file is a
brainstormed candidate list, and a brainstormed form **has no appearance**.
Nobody has made the argument, published it, or set it — someone thought the
course should carry it. An entry needs at least one appearance and the test
suite enforces that, which is the right answer and not an obstacle to work
around: an encyclopedia of argument forms records arguments people have made.

Where the inventory names a champion for such a row — Stalnaker and Lewis for
conditional excluded middle, Curry for the Curry sequent, Ross for Ross's
paradox, or a Restall exercise it flags as *"already Restall"* — that champion
is the appearance and the row imports normally. Where it names none, the row
lands here. Reviving one later means finding it a source, not relaxing the
rule.

| Date | Sequent | Why it was skipped |
| --- | --- | --- |
| 2026-08-30 | `p∨q, p ∴ ∼q` (inventory name: "Affirming a disjunct") | Duplicates `affirming-a-disjunct` already in the database (`f∨d, d ∴ ∼f`) — same form, renamed atoms, per §6's own worked example of exactly this pair. |
