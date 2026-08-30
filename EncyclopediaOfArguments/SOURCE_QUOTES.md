# Passages from the course handouts

Every `appearances[].quote` on a course-sourced appearance must appear in this
file, verbatim. `build.py` refuses to write the database otherwise.

**Why this file exists.** The import routine works from
`Argument Form Inventory (2026-08-28).md`, which is a table: rows of sequents
and the problem-set columns they were set in. It holds no handout prose, so
the routine has nothing to quote and is not in a position to acquire anything.
Twice now it has filled the field with a sentence of its own describing where
the form was set -- *"Set twice: by truth table on Problem Set 2, and again as
a derivation on Problem Set 5"* -- which reads, on the page, as the handout
saying that about itself. The style guide has forbidden this from the
beginning (§13.1: "a `quote` that paraphrases a source into quotation marks"
is manufacturing provenance). Saying so again would not have helped; the rule
was already there both times.

So the field is now closed by construction. A quote gets into an entry only by
being in this file first, and something gets into this file only from a
handout someone has actually read.

**Adding a passage.** Copy it from the handout, verbatim -- typos, spacing and
all. Give the source in the heading so a reader can check it. The routine
cannot do this step: it has no handouts, and a passage it composed is exactly
what the check exists to catch. If a firing believes it has a quotable
passage, the honest move is to leave `quote` out and say what it knows in
`interest`, where our own voice belongs.

What a course appearance can always say without a quote is where the form was
set. That is what `work` and `locus` are for.

---

## Lecture 4 Handout, §1 (Challenge Question)

The chain argument the lecture attributes to Kant.

> If a moral theory is studied empirically then examples of conduct will be considered. And if examples of conduct are considered, principles for selecting examples will be used. But if principles for selecting examples are used, then moral theory is not being studied empirically. Therefore, moral theory is not studied empirically.

## Lecture 7 Handout (V2.0), §1

> Exercise: Consider the argument with premises X: b and v ⊃ k and (b & k) ⊃ (l & d), and with conclusion A: v ⊃ o. Use a tree to show that this argument is tree-invalid.

> Add that as a fourth premise, l ⊃ o, and the tree closes. (Try it.)

## Lecture 7 Handout, §1

> Exercise: Consider the argument with premises X: ∼(p∨q)∨(r&∼s) and s⊃(r∨q) and with conclusion A: p⊃s. Use a tree to show that this argument is tree-invalid.

## Lecture 8 Handout, §1 (Validity via trees)

> Exercise: Confirm the validity of this argument using the tree method.
