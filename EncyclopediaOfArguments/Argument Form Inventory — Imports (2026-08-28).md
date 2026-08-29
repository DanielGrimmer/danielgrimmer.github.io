# Argument Form Inventory — Imports (2026-08-28)

**Instructor-only.** Companion to `Argument Form Inventory (2026-08-28).md`, which
covers what the *current* course does. This file covers three outside sources of
stock material: **Restall's propositional chapters** (102 records), **last year's
first-half archive** (62 records), and a **hand-brainstormed candidate list** of
philosophically interesting forms the course does not currently touch.

Restall and the old archive were swept by subagents; the brainstorm is mine.
Every verdict in §3, and the four flagged overlaps in §1, were re-verified by
brute-force truth-table check before being written down. Restall's exercise
verdicts are the extracting agent's own computations (his solutions live at
consequently.org/logic) — treat them as reliable but not authoritative.

---

## 1. Restall, *Logic* — propositional chapters

Assigned reading for the first half (per the Reading Guide): front matter, Ch 1–4,
optional Ch 5–6. Notation already matches the house style. **102 records**:
Ch1 15, Ch2 10, Ch3 47, Ch4 6, Ch5 3, Ch6 21.

### What is worth mining

**Chapter 3's exercise banks are the treasure.** Ex 3.4 alone is twenty
tested sequents (items 1–20, p.36–37), Ex 3.2 five tautology-candidates, Ex 3.3
five equivalence sets, and Ex 3.5–3.10 six English-symbolize-then-test arguments.
Students are *not* assigned these as homework, so the whole bank is unused stock
in matching notation. Highlights:

| Restall | Form | Verdict | Why interesting |
|---|---|---|---|
| Ex 3.4.8 | `p⊃(q⊃r) ∴ q⊃(p⊃r)` | valid | **Permutation.** Pure `⊃`, no negation. Good ND. |
| Ex 3.4.14 | `p⊃(p⊃q) ∴ p⊃q` | valid | **Contraction** — see §3.9; the rule behind Curry |
| Ex 3.4.16 | `p∨q, ∼q∨r ∴ p∨r` | valid | **Resolution** — the rule every SAT solver runs on |
| Ex 3.4.11 | `p⊃q ∴ (r⊃p)⊃(r⊃q)` | valid | **Prefixing**; also OLD-PS3 Q12 |
| Ex 3.4.13 | `p ∴ ∼p⊃q` | valid | A paradox of material implication, in drill form |
| Ex 3.4.18 | `p⊃(q⊃r) ∴ (p⊃q)⊃r` | **invalid** | The converse of 3.4.8 fails — sharp pair with it |
| Ex 3.4.17 | `p⊃q ∴ q⊃p` | **invalid** | Conversion; the error contraposition is confused with |
| Ex 3.9 | `(r⊃∼w)⊃r ∴ r` | valid | Peirce-flavoured; feels wrong, isn't |
| Ex 3.10 | `(j⊃c)&(e⊃d) ∴ (j⊃d)∨(e⊃c)` | valid | Verified. The most startling item in the book |
| Ex 3.6 | `∼(b&∼s) ∴ s⊃b` | **invalid** | Near-miss for the material-conditional equivalence |
| Ex 3.5 | `(j&∼b)⊃∼j ∴ j⊃b` | valid | Orange Blossom ad; counterintuitively valid |

Ex 4.1 re-poses the whole Chapter 3 bank as *tree* drills, so every row above is
available in two methods with no new authoring.

**Chapter 6 is the philosophy payload** and maps onto Lecture 11 exactly:
`p ⊨ q⊃p` and `p ⊨ ∼p⊃q` (p.65) are our two paradoxes; `(p&q)⊃r ⊨ (p⊃r)∨(q⊃r)`
(p.65, two-switches lightbulb) and `⊨ (p⊃q)∨(q⊃r)` (p.66) are **the same shape as
our headline `⊢ (q⊃p)∨(p⊃r)`**; and `p&∼p ⊨ q`, `p ⊨ q∨∼q` (p.72) are the
paradoxes of entailment relevant logic rejects. Restall's own relevance-logic
sympathies are on the page — worth knowing, since he is the textbook author *and*
the information-theoretic semantics named in Lecture 11.

**Chapter 5** poses Ł₃ tautology-checking (Ex 5.1, ten formulas) — directly
comparable to PS2 Q9, and a ready-made extension bank.

### Cautions

- **Ch 4's worked trees are misprinted.** Box 4.2 and Box 4.3 each carry tilde
  slips from biconditional splits, and Box 4.3 has a branch containing both `p`
  and `∼p` that is not marked closed. The agent verified semantically that both
  **verdicts** and Box 4.2's counterexample are nonetheless correct. This is
  additional to the two misprinted rule diagrams the syllabus already warns about.
- **Ex 2.6 item 14 duplicates item 4 verbatim**; Ex 2.8 item 3 has unbalanced
  parentheses. Scan/typesetting, not logic.
- Ch 6 uses `→` (strict/counterfactual) and `□`/`◊` alongside `⊃`. Anything
  imported from there needs the modal apparatus stripped or flagged off-exam.

### Overlaps with our brainstorm — Restall got there first

Two candidates I generated independently are **already in Restall**, which
strengthens rather than weakens them (they come pre-vetted with English vehicles):
`(p&q)⊃r ⊢ (p⊃r)∨(q⊃r)` is his p.65 lightbulb paradox, and contraction
(`p⊃(p⊃q) ⊢ p⊃q`) is his Ex 3.4.14. Import with attribution rather than as new.

---

## 2. Last year's first-half archive

**62 records**: OLD-PS1 9, OLD-PS2 18, OLD-PS3 13, OLD-PS4 6, OLD-PS5 7,
OLD-EXAM 9. Serves two purposes — extra stock, and a do-not-collide list, since
students may circulate last year's papers.

### The headline finding

**OLD-EXAM Q5(A) was `p⊃q ⊢ND ∼q⊃∼p` — contraposition by ND.** That is the #1
opening identified in the main inventory's §7. It is therefore *proven
exam-caliber* at exactly our difficulty, and it is absent from the current course
in that method. Strongest possible endorsement of that candidate — with the
caveat that last year's students saw it, so it is best used in study material
rather than on the exam itself.

### Also worth taking

| Old location | Form | Verdict | Note |
|---|---|---|---|
| OLD-PS3 Q9 | `⊢ p⊃((p⊃q)⊃q)` | tautology | **Assertion**; conditionalized MP. Also Restall Ex 3.2 |
| OLD-PS3 Q12 | `p⊃q ⊢ (r⊃p)⊃(r⊃q)` | valid | Prefixing; done there by tree **and** table |
| OLD-PS3 Q10 | `((p&q)⊃r)⊃(p⊃r)` | **not** a tautology | The converse of antecedent strengthening — pairs with it |
| OLD-PS2 Q2(b) | `p⊃q ⊨ (p&r)⊃q` | valid | **Antecedent strengthening** (= my §3.5) |
| OLD-PS5 Q6 | `⊢ ((p∨q)⊃p)≡(q⊃p)` | tautology | Uses `∨E`; was an ungraded bonus |
| OLD-PS3 Q11 | `p≡q, p≡∼q ⊢ ∼p` | valid | Tree version of our PS2.2d table item |
| OLD-PS3 Q8 | Tudor Mansion / Clue puzzle | satisfiable | Puzzle-format satisfiability, like our PS3.3 astrolabe |
| OLD-PS4 Q4 | Peirce's law in **Gödel 3-valued** logic | not a tautology | Complements our Ł₃ material |
| OLD-PS1 Q6(c) | valid instance of an invalid form | — | Teaches form-vs-argument; our PS1 lacks this |
| OLD-PS5 Q7 | **Raven Paradox** (Hempel) | essay | The retired reflection PS5 Q8 replaced |

### Do-not-collide

`p⊃q ⊢ND ∼p∨q` appears **verbatim, same proof, twice** in the archive (OLD-PS5 Q4
and OLD-EXAM Q5(B)) — and is now our PS5 Q3(b). Third appearance; fine as
teaching, but do not put it on the exam. Frege's self-distribution (OLD-PS2 Q1(d)
table, OLD-PS5 Q1 ND, OLD-EXAM Q4(A) tree) had three outings last year, which
retires my §3.13 suggestion as a *novel* import — it is a revival.

### Correction to a claim in the sweep

The extracting agent could not find "the Kant argument" in the old midterm and
wondered where it lives. Resolved: the Midterm Exam Prompt's freshness clause
reads *"none of the arguments … reappear from the L1–10 handouts, Problem Sets
1–5, or last year's midterm (the Kant argument is deliberately avoided)"* — the
parenthetical attaches to the **handouts**, where Kant is the flagship
three-method argument (L4 table, L8 tree, L10 ND), not to the old midterm. No
discrepancy. (The old midterm's supplemental is a scanned image PDF with no text
layer, so it could not be searched either way.)

---

## 3. Brainstormed candidates — philosophically interesting, not in the course

Verdicts brute-force verified. Ranked by how much they earn their place.

### Material-conditional monsters (continuous with L3 and L11)

1. **`(p&q)⊃r ⊢ (p⊃r)∨(q⊃r)`** — valid. "If both keys turn, the vault opens;
   so one key alone would do it, or the other would." *Already Restall p.65
   (two-switches lightbulb)* — import with his vehicle. Mechanical by table,
   quick by tree.
2. **Conditional excluded middle: `⊢ (p⊃q)∨(p⊃∼q)`** — tautology. "Either the
   coin would land heads if flipped, or tails if flipped." The exact axiom
   Stalnaker and Lewis fought over for counterfactuals: a one-line fork gesture
   for free. Table/tree easy; ND is Monster-tier.
3. **Bivalence pigeonhole: `⊢ (p≡q)∨(q≡r)∨(p≡r)`** — tautology. Among any three
   sentences two share a truth value, because there are only two values. Makes
   Lecture 3's assumption (iii) visible as a theorem-generator. Clean 8-row table.
4. **`p⊃∼p ≡ ∼p`** — equivalence. Students expect a self-undermining conditional
   to be paradoxical; classically it just *is* the negation. Two-row table, and it
   explains PS2.8b / PS4.2b in one stroke. Related: **Aristotle's thesis**
   `∼(p⊃∼p)`, a law for connexive logicians, is classically *contingent* (it is
   equivalent to `p`) — another cheap fork gesture.

### Contested classics (classically valid, famously disputed)

5. **Antecedent strengthening: `p⊃r ⊢ (p&q)⊃r`** — three-line ND. "Strike the
   match and it lights; so strike it *and it is wet* and it lights." The standard
   opening of conditional-logic courses; the one paradox family L3 does not use.
   *Was OLD-PS2 Q2(b) by table*, so a revival in a new method.
6. **Or-to-if: `p∨q ⊢ ∼p⊃q`** — PS2.4b has the equivalence by table, but the
   philosophy is unexploited: this is the "direct argument" pressuring indicative
   *if* toward the material conditional. ND needs `∼E`.
7. **McGee's counterexample to modus ponens** — not a new form (`p⊃(q⊃r), p ⊢ q⊃r`
   is just `⊃E`), but the 1980-election example is the one place MP itself has
   been seriously contested. Footnote-sized addition to the MP row.

### Structural-rule stars (feed the Lecture 11 themes)

8. **Curry's sequent: `{p ≡ (p⊃q)} ⊢ q`** — valid, verified. The crown jewel. A
   sentence saying "if I am true then q" makes q provable **with no negation
   anywhere**: `≡E`, `⊃I`, `⊃E` only, about seven lines. The negation-free sibling
   of PS5.5's `p≡∼p` and PS9's Barber, and it shows explosion-like trouble
   arriving through the *conditional* — vindicating Fork 1's "it was never about
   `∼`" moral. The hidden culprit is using `p` twice (contraction), which is the
   live research frontier for Curry.
9. **Contraction: `p⊃(p⊃q) ⊢ p⊃q`** — the innocuous rule #8 secretly runs on.
   *Already Restall Ex 3.4.14.* Trivial table; five-line ND.
10. **Double-negation introduction: `p ⊢ ∼∼p`** — used inside proofs constantly,
    never asked standalone. Three lines, and it marks the intuitionist boundary
    from the *safe* side: DNI is constructive, DNE is not. Cheap, thematically
    perfect.

### Named-form completions

11. **Destructive dilemma: `p⊃q, r⊃s, ∼q∨∼s ⊢ ∼p∨∼r`** — PS1 names constructive
    dilemma; its dual is absent from the entire corpus. All three methods open.
12. **`p∨q ≡ (p⊃q)⊃q`** — disjunction from `⊃` alone. Extends PS2 Q4's
    expressive-completeness game in a direction students find surprising: no `∼`
    needed. (Cf. OLD-PS5 Q6, a near neighbour.)
13. ~~Frege's self-distribution~~ — **retired as an import**: three outings in
    last year's archive. Revival only, and a well-worn one.

### Discussion-question material

14. **Ross's paradox: `p ⊢ p∨q` read as an instruction** — "Post the letter;
    therefore post it or burn it." `∨I`, the most innocent rule on the sheet,
    sounds *wrong* under commands. A reflection-question seed in the PS1 Q7 /
    PS4 Q5 style, not a derivation.

---

## 4. Consolidated shortlist

If the weekend produces only a handful of new items, these are the ones:

| Priority | Item | Source | Why |
|---|---|---|---|
| 1 | Contraposition by ND | brainstorm + **OLD-EXAM Q5(A)** | Main inventory's top gap; proven exam-caliber |
| 2 | Curry's sequent | brainstorm §3.8 | Negation-free paradox; best philosophy per line |
| 3 | Restall Ex 3.4 bank (20 sequents) | Restall p.36–37 | Unused, in-notation, table **and** tree via Ex 4.1 |
| 4 | Conditional excluded middle | brainstorm §3.2 | Free Stalnaker–Lewis fork gesture |
| 5 | Bivalence pigeonhole | brainstorm §3.3 | Makes L3's assumption (iii) visible |
| 6 | Modus tollens by tree | main inventory §7 | Trivial to author; completes a named form |
| 7 | Restall Ex 3.10 (Josh/Emily) | Restall p.37 | Verified valid; the most startling item in the book |
| 8 | Resolution `p∨q, ∼q∨r ∴ p∨r` | Restall Ex 3.4.16 | The rule every SAT solver runs on |

---

## 5. Restall's *unassigned* chapters (added 2026-08-28)

The Reading Guide assigns front matter and Ch 1–4 (5–6 optional), then Ch 8–10 for Lectures 14–18, marks Ch 11/13/15 optional or non-examinable, and **forbids Ch 7 outright**. This pass mined Ch 7 and all of Part 2 (Ch 8–15): **186 rows, 69 worked in the text, 117 posed as exercises, ~25 usable in the first half.**

Extraction note: the text layer drops every `∨`, `⊃`, `≠`, `⊬` and `√` as an inline image, so every symbol-bearing row was read from 200 dpi page renders (some re-checked at 500 dpi). Printed page label = PDF page − 10. Restall prints no answers; every verdict marked below is computed, not his.

### 5.1 Chapter 7 — Natural deduction. **Entirely propositional, and students are told not to read it.**

This is the single richest unassigned vein for the first half. Restall's Ch 7 is a full Fitch-adjacent ND chapter with five worked proofs and two exercise sets, and none of it can collide with anything assigned.

**Worked in the text:**

| Form | Verdict | Note |
|---|---|---|
| `A⊃B ⊢ (A&C) ⊃ (B∨D)` | valid | The showcase tree proof, built in reverse |
| `A⊃B ⊢ (A⊃(B⊃C)) ⊃ (A⊃C)` | valid | Same content as a numbered list — good "two presentations, one proof" |
| `A⊃((B&C)⊃D) ⊢ (A&C) ⊃ (B⊃D)` | valid | 10 lines, with a prose sketch first |
| `A ⊢ ∼∼A` | valid | Intuitionistically provable |
| `A⊃B ⊢ ∼B⊃∼A` | valid | Contraposition, 7 lines, intuitionistically provable |
| `∼∼A ⊢ A` | valid, **unprovable without DNE** | Restall: "It is instructive to try… Why is it impossible?" |
| `∼B⊃∼A ⊢ A⊃B` | valid, unprovable without DNE | Companion |
| `⊢ A ∨ ∼A` | tautology | 9 lines, uses DNE. **Misprint: line 9 prints `⊢ ∼A ∨ ∼A`** |
| `⊢ ∼∼(A ∨ ∼A)` | theorem (intuitionistic) | Line 8 of the same proof — the "prove the double negation first" strategy |

**Ex {7.1} — five sequents to prove without DNE** (all verified valid, all intuitionistically provable): `A⊃∼B ⊢ B⊃∼A`; `∼∼∼A ⊢ ∼A`; `∼A∨∼B ⊢ ∼(A&B)`; `∼(A∨B) ⊢ ∼A&∼B`; `A&∼B ⊢ ∼(A⊃B)`.

**Ex {7.2} — five requiring DNE** (all verified): `⊢ ((A⊃B)⊃A)⊃A` (Peirce); `∼(A&B) ⊢ ∼A∨∼B` (the hard De Morgan); `⊢ A ∨ (A⊃B)`; `∼A⊃∼B ⊢ B⊃A`; and **`(A&B)⊃C ⊢ (A⊃C) ∨ (B⊃C)`**, which is the pick of the set — classically valid on 7 of 8 premise-true rows, intuitionistically not, and a genuinely hard ND problem.

Ex {7.3}–{7.5} then ask students to show all five of {7.2} fail a three-valued table, and to hunt for the converse — a ready-made bridge to the Comprehensive Inventory's §4.2.

**One further first-half item, from Ch 9.** Restall's Box 9.1 (p. 102) works the quantifier-shift fallacy by *eliminating* the quantifiers over a two-element domain, and the intermediate is a purely propositional sequent:

> `(Raa ∨ Rab) & (Rba ∨ Rbb) ⊬ (Raa & Rba) ∨ (Rab & Rbb)` — **INVALID**, verified, 2 countermodels of 16.

Four atoms, a real tree, already worked in the book, and it smuggles a preview of Lecture 21 into the first half. Filed as CLI-105 in the Comprehensive Inventory's §1.

### 5.2 Second-half stock worth knowing about

- **The Drinker's Paradox appears four times in unassigned exercises**, in three distinct shapes: `(∃x)(Fx ⊃ (∀y)Fy)` at {9.3}.8 and {10.1}.8; `(∃x)((∃y)Fy ⊃ Fx)` at {10.1}.9; `(∃x)(∀y)(Fy ⊃ Fx)` at {10.1}.10. All tautologies. Its `∀`-twin `(∀x)(Fx ⊃ (∀y)Fy)` is **not** valid — the perfect foil. This is Lecture 21's headline result sitting untouched in the back of the book.
- **Ex {8.4} / {10.3}** — ten arguments posed for formalisation in Ch 8 and re-posed for trees in Ch 10: the barber *without* the "only if" (valid, unlike Russell's version), De Morgan's "head of a horse is a head of an animal", **Lewis Carroll's Beethoven/guinea-pigs sorites** (explicitly credited to Dodgson), the Oxfam argument, and the ∀∃→∃∀ shift.
- **Relations metatheory:** {10.5} gives the three standard independence results (reflexive+symmetric ⊬ transitive, and the two companions); {10.6} is the famous "symmetry + transitivity + no dead ends ⇒ reflexivity", which repairs the standard bogus proof. {10.2}.4 proves quasi-reflexivity from symmetry and transitivity.
- **Free logic (Ch 13)** has a clean contrast pair: `(∀x)(Hx⊃∼Fx), Ha ⊬ ∼Fa` is **invalid in *positive* free logic** (countermodel: a single object with `E!a` false — Pegasus) while hypothetical syllogism survives intact. ⚠️ **Corrected 2026-08-29:** the inference is **VALID in *negative* free logic**, where an atomic sentence about a non-existent is false, so `Ha` already entails `E!a`. Verified with a dual-domain checker: 162 countermodels of 486 premise-true cases in positive free logic, zero in negative. See the Comprehensive Inventory §2.10. And `(∃x)(x = a)` is a classical tautology — "predicate logic has existential import for names," the Santa Claus problem in one formula.
- **Ch 15** has the sharpest item for a Lecture 25 discussion: `(∃x)(∃y)(x ≠ y)` contains **no non-logical vocabulary** and is still not a tautology — true in every domain of two or more, false in a one-element domain. A direct counterexample to naive "invariance under reinterpretation."
- **Ch 14** poses Quine's "number of planets" argument as an exercise, and the Descartes dualism argument `Fa, ∼Fb ⊢ a ≠ b` — valid in form, with Leibniz's objection (opaque contexts) as the diagnosis.

### 5.3 New errata for the course's Restall list

The Reading Guide already documents the misprinted Ch-4 rule diagrams. These are additional, and the pattern recurs:

| Page | Printed | Should be |
|---|---|---|
| 79 | LEM proof line 9: `⊢ ∼A ∨ ∼A` | `⊢ A ∨ ∼A` |
| 129 | "exactly one Indonesian logic student": `(∀y)((Ix & Lx) ⊃ x=y)` | `(Iy & Ly)` |
| 105–106 | monadic bound printed "2n" | `2ⁿ` (may be superscript loss) |
| Ex {9.1}.1 | `Tx` where T is dyadic | ill-formed as printed |
| Ex {9.1}.4 | `Gxy` where G is monadic | ill-formed as printed |
| Ex {9.4}.10 | conclusion `∼(∀x)(Gx ⊃ ∼Hx)` | almost certainly `∼(∀x)(Gx ⊃ Hx)` |
| Ex {10.1}.5 | `(∀x)Fx(Fx ⊃ Gx) ⊃ …` | stray `Fx`; intended is the distribution axiom |
| Ex {11.10}.5 | `RA < (∀x)(∀y)(x+y=y+x)` | mangled `⊬` |
| Ex {13.1}.2 | premise printed as a bare `(∀x)` with no matrix | read as `(∀x)Fx` |
| Ex {13.1}.3 | `F` occurs nowhere in the premises | internally inconsistent |
| Ch 13 | free-logic **Universal** and **Negated universal** rule diagrams drawn with the wrong root formula | trust the prose above each |
| **156** | **Descartes' argument printed `Fa, ∼Fb ∴ a = b`** | **`a ≠ b`** — the surrounding prose confirms it, and the whole chapter turns on this form |

Two boxes did not render at all in extraction — Box 9.2 (p. 104) and Box 10.1 (p. 114) — so their arguments and read-off models were recovered from the surrounding prose. The forms and verdicts are secure; the trees themselves were not seen.

Three verdicts are flagged as untrustworthy because the printed formula looks corrupt rather than because the logic is hard: Ex {8.4}.5, Ex {9.4}.10, Ex {13.1}.3.
