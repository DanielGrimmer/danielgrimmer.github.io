# Argument Form Inventory — Propositional Half (2026-08-28)

**Instructor-only.** Every argument form touched in the first half of the course
(Lectures 1–13, Problem Sets 1–5, midterm materials), with the method(s) it has
been treated by — table (⊨), tree (⊢), natural deduction (⊢ND) — and where. Built
to mint midterm-prep material: a form worked in one method can be re-asked in
another, and §7 ranks those openings. Compiled from a seven-agent sweep of the
listed sources; 220 raw (form, location) records consolidated below. Verdicts are
transcribed from the course documents, and the two highest-stakes gap claims
(contraposition-by-ND absent; exam AC overlap) were re-verified by hand against
the sources. Spot-check before building anything high-stakes on a single row.

**Sources.** Lecture Handouts 1–13; Problem Set 1–5 masters; Midterm Study Guide;
Midterm Practice Problems ×2 (Solutions); Midterm Exam (Solutions). Instructor-only
`%`-comment content excluded throughout.

**Companion file.** `Argument Form Inventory — Imports (2026-08-28).md` covers
outside stock: Restall's propositional chapters (102 records, including his unused
Ex 3.4 bank of twenty tested sequents), last year's first-half archive (62
records, doubling as a do-not-collide list), and a brainstormed candidate list.
Note there that **last year's exam set contraposition-by-ND** — §7's top opening
below — so that gap is proven exam-caliber.

**Location codes.** `L#` lecture handout (worked unless marked *posed*) ·
`PS#.Q#` problem set (student-worked) · `SG` Study Guide (`CQ#` = Challenge
Question, posed unworked) · `P1`/`P2` Midterm Practice / More Practice (worked in
key) · `EX` **Midterm Exam — quarantined, never reuse** · `Eng` English-only ·
`—` never treated by that method (an opening).

---

## 1. Named-forms coverage matrix

The at-a-glance grid for the classics. ✓ = worked somewhere; *posed* = assigned
but never worked; — = untouched by that method.

| Form | Verdict | Table | Tree | ND |
|---|---|---|---|---|
| Modus ponens `p⊃q, p ∴ q` | valid | ✓ L4 | *posed* SG-Q2 (also PS3.8's weakened-system moral) | *posed* SG-Q2 (trivial ⊃E) |
| Modus tollens `p⊃q, ∼q ∴ ∼p` | valid | ✓ PS2.2a | **—** | ✓ PS5.2 |
| Disjunctive syllogism `p∨q, ∼p ∴ q` | valid | ✓ L13.2a | ✓ L13.2b (EX-Q4A extended — quarantined) | ✓ L13.2c; SG-CQ3; L11 |
| Affirming the consequent `p⊃q, q ∴ p` | invalid | ✓ L4§2; **EX-Q2D/Q3A** | PS3.8 (weakened system) | bridge: L12§2 worked |
| Denying the antecedent `p⊃q, ∼p ∴ ∼q` | invalid | ✓ PS2.2b; L13.3b | ✓ L13.3a | bridge: L13.3c worked |
| Affirming a disjunct `p∨q, p ∴ ∼q` | invalid | Eng only (PS1.3) | **—** | **—** |
| Hypothetical syllogism `p⊃q, q⊃r ∴ p⊃r` | valid | ✓ P1.1b | **—** | ✓ L10; PS5.1 (3-link); P1.1b; P2.4 |
| Constructive dilemma | valid | Eng only (PS1.3) | **—** | ✓ L10 (variant `p∨q, p⊃r, q⊃s ⊢ r∨s`); SG-CQ4 (variant `p⊃q, ∼p⊃q ⊢ q`, posed) |
| Kant `p⊃q, q⊃r, r⊃∼p ∴ ∼p` | valid | ✓ L4§1 | ✓ L8§1 | ✓ L10§3; SG-CQ6 (posed) |
| Contraposition `p⊃q ≡ ∼q⊃∼p` | equivalence | ✓ L4§2; PS2.8a (instance) | ✓ L6§5; PS4.2a (instance) | **—** (only metalanguage uses) |
| De Morgan I `∼(p∨q) ≡ ∼p&∼q` | equivalence | ✓ PS2.3c | ✓ PS3.7 (rule symmetry) | ✓ PS5.4 (→ direction only) |
| De Morgan II `∼(p&q) ≡ ∼p∨∼q` | equivalence | ✓ PS2.3c | ✓ PS3.7 (rule symmetry) | *posed* SG-CQ5 (← direction only) |
| Distribution `p&(q∨r) ≡ (p&q)∨(p&r)` | equivalence | **—** | ✓ PS3.1 (→ as conditional) | ✓ L9 (both directions) |
| Distribution `p∨(q&r) ≡ (p∨q)&(p∨r)` | equivalence | **—** | **—** | ✓ PS4.3e + PS4.4b (both directions) |
| Material conditional `p⊃q ≡ ∼p∨q` | equivalence | ✓ PS2.4a (L4-CQ posed) | **—** | ✓ PS5.3 (both directions + ≡ theorem) |
| LEM `⊢ p∨∼p` | tautology | *posed* L13.1-at-home, SG-Q1 | *posed* L13.1-at-home, SG-Q1 | ✓ L10§3; SG-CQ2; PS5.6 (component) |
| Non-contradiction `⊢ ∼(p&∼p)` | tautology | ✓ L13.1b | ✓ L13.1c | ✓ L13.1d |
| Explosion `p&∼p ∴ q` | valid | ~L4§1 (sketched, `(p&q)&∼p ⊨ r`) | **—** | ✓ P1.2c; SG-CQ1 (posed); L11 |
| Negative explosion `p&∼p ∴ ∼q` | valid | **—** | **—** | ✓ L11 (Interlude) |
| Consequentia mirabilis family | valid | ✓ PS2.8b (`c⊃∼c ⊢ ∼c`) | ✓ PS4.2b (same) | **EX-Q5B** (`∼p⊃p ⊢ p` — quarantined) |
| Peirce `⊢ ((p⊃q)⊃p)⊃p` | theorem | **—** | **—** | ✓ PS5.7 (bonus) |
| Paradox disjunction `⊢ (q⊃p)∨(p⊃r)` | theorem | sketch L11 | **—** | ✓ PS5.6 |
| The Monster `⊢ (p⊃q)∨(q⊃p)` | theorem | **—** | **—** | ✓ L13.5 |
| Positive paradox `p ⊢ q⊃p` | valid | stated L11 | **—** | ✓ L10; L11; PS5.6 |
| Negative paradox `∼p ⊢ p⊃r` | valid | stated L11 | **—** | ✓ L11; PS5.6 |

**Fully covered exemplars** (one form, all three methods, all worked): Kant's
argument (L4/L8/L10 — the only form the *lectures* themselves carry through all
three); non-contradiction (L13.1); disjunctive syllogism (L13.2); DA with the
bridge as the ND leg (L13.3). L13's one-form-three-methods format is the template;
§7 lists the forms readiest for the same treatment.

---

## 2. Valid sequents (full list)

| Form | Name / note | Where (method) |
|---|---|---|
| `p&(q∨r), (s⊃t)&p ⊢ (q∨r)&(s⊃t)` | first derivation of the course | L9§2 (ND) |
| `(p&q)∨(p&r) ⊢ p` | first proof by cases | L9§3 (ND) |
| `p∨q, p⊃r, q⊃s ⊢ r∨s` | constructive dilemma, L10 form | L10§2 (ND) |
| `p⊃q, q⊃r ⊢ p⊃r` | hypothetical syllogism | L10§2 (ND); P1.1b (table+ND); P2.4 (ND, letters r/q swapped) |
| `p⊃q, q⊃r, r⊃s ⊢ p⊃s` | 3-link HS | PS5.1 (ND) |
| `p ⊢ q⊃p` | positive paradox | L10§2, L11, PS5.6 (ND) |
| `∼p ⊢ p⊃r` | negative paradox | L11, PS5.6 (ND) |
| `p⊃q, q⊃r, r⊃∼p ⊢ ∼p` | Kant | L4§1 (table); L8§1 (tree); L10§3 (ND); SG-CQ6 (ND posed) |
| `∼p⊃q, ∼p⊃∼q ⊢ p` | double-consequent reductio | L10§3 (ND) |
| `p∨q, ∼p ⊢ q` | disjunctive syllogism | L13.2 (all three); SG-CQ3 (ND posed); L11 Fork 2 (ND, + ⊥E variant) |
| `p⊃q, ∼q ⊢ ∼p` | modus tollens | PS2.2a (table); PS5.2 (ND) |
| `p, p⊃q ⊢ q` | modus ponens | L4§1 (table); SG-Q2 (tree+ND posed); constraint role L3 |
| `b⊃l ⊢ ∼l⊃∼b` | contraposition instance (bakery) | PS2.8a (table); PS4.2a (tree) |
| `c⊃∼c ⊢ ∼c` | self-undermining conditional | PS2.8b (table); PS4.2b (tree) |
| `p&∼p ⊢ q` / `⊢ ∼q` | explosion / negative explosion | see matrix |
| `p≡q, p≡∼q ⊨ r` | vacuous validity (unsat premises) | PS2.2d (table) |
| `p ⊨ q∨∼q`; `r ⊨ p⊃(p∨q)` | tautological conclusion from anything | PS2.2e, L4§1 (table) |
| `(p&q)⊃r, p, q ⊨ r` | importation instance | PS2.2f (table) |
| `p⊃(q&r) ⊨ (p&q)⊃r` | importation-shaped | P1.1c (table+ND) |
| `p⊃(q⊃r) ⊢ (p&q)⊃r` | importation | P2.5 (ND) — *exportation direction untouched* |
| `p⊃q ⊢ p⊃(p&q)` | absorption | P2.1 (ND); SG pro-tip variant `q ⊢ p⊃(p&q)` worked |
| `p&∼q ⊨ ∼(p⊃q)` | negated-conditional intro | P1.1a (table+ND) |
| `p⊃(q&∼r), p&s ⊢ ∼r` | — | P2.2 (ND) |
| `∼p≡p ⊢ p⊃∼q` | explosion-flavored from inconsistent premise | P2.3 (ND) |
| `p⊃(q⊃r), ∼q⊃∼p, s&p ⊨ r` | needs classical reductio | P1.5b (ND) |
| `p&q ⊢ q&p`; `p&(q&r) ⊢ (p&q)&r` | commutativity/associativity of & | PS4.3a,b (ND, L9-rules-only) |
| `p∨q ⊢ q∨p`; `(p∨q)∨r ⊢ p∨(q∨r)` | commutativity/associativity of ∨ | PS4.3c, PS4.4a (ND); P1.2a (ND) |
| `p≡q ⊢ q≡p`; `p≡q, q≡r ⊢ p≡r` | symmetry/transitivity of ≡ | PS4.3d, PS4.3f (ND) |
| `p⊃q, r⊃∼q ⊢ p⊃∼r` | — | **EX-Q5A (quarantined)** |
| `∼p⊃p ⊢ p` | consequentia mirabilis | **EX-Q5B (quarantined)** |
| `p∨q, ∼p, q⊃r ⊢ r` | DS + MP chain | **EX-Q4A (quarantined)** |

## 3. Invalid forms

| Form | Name | Where (method) | Countermodel |
|---|---|---|---|
| `p⊃q, q ⊬ p` | affirming the consequent | L1 (Eng, rain/grass); PS1.3 (named); L4§2 (table); L12§2 (bridge → ⊬ND); PS3.8 (weakened tree); **EX-Q2D/Q3A (table)** | p=F, q=T |
| `p⊃q, ∼p ⊬ ∼q` | denying the antecedent | PS1.3 (named); PS2.2b (table); L13.3 (tree + row-check + bridge) | p=F, q=T |
| `p∨q, p ⊬ ∼q` | affirming a disjunct | PS1.3 (Eng/named only) | p=T, q=T |
| `p∨q ⊭ p&q` | — | PS2.2c (table) | p=T, q=F |
| `∼(p∨q)∨(r&∼s), s⊃(r∨q) ⊬ p⊃s` | lectures' running invalid | L7§1, L7§3 (completeness walk), L8§3 (soundness walk; table row + tree) | p=T,q=T,r=T,s=F |
| `(p&q)⊃(r∨s), q∨∼r ⊬ p⊃s` | problem sets' running invalid | PS3.5 (tree → countermodel); PS4.1 (table rows + guided walk) | p=T,q=T,r=T,s=F (and p=T,q=F,r=F,s=F) |
| `p⊃(q&r) ⊭ (p∨r)∨(p&∼q)` | — | P1.5a (table) | p=F,q=F,r=F |
| `p ⊭ q` | minimal example | PS3.9 (cited) | p=T, q=F |

Both "running invalids" have had three outings each. Students who did the work
have seen them cold — retire both from new material.

## 4. Theorems, tautologies, and classifications

| Formula | Verdict | Where (method) |
|---|---|---|
| `p∨∼p` | tautology | ND worked L10; table+tree *posed* L13.1-at-home & SG-Q1; fails in Ł3 (PS2.9) |
| `∼(p&∼p)` | tautology | L13.1 — table, tree, ND all worked |
| `p⊃(p∨q)` | tautology | L4§1 (table); L6§5 (tree); **ND untouched** (3 lines) |
| `p⊃p` | tautology | L3 (constraint); P1.3a (tree + bonus ND) |
| `(p≡q)⊃(p⊃q)` | theorem | P1.2b (ND) |
| `(p&(q∨r))⊃((p&q)∨(p&r))` | tautology | PS3.1 (tree) |
| `(q⊃p)∨(p⊃r)` | theorem | L11 (table sketch); PS5.6 (ND, 27 lines) |
| `(p⊃q)∨(q⊃p)` | theorem ("the Monster") | L13.5 (ND, 22 lines) |
| `((p⊃q)⊃p)⊃p` | theorem (Peirce) | PS5.7 (ND bonus) |
| `(p∨q)⊃(q∨p)` | tautology | **EX-Q4B (tree — quarantined)** |
| `p∨(p⊃q)` | tautology | PS2.1a (table) |
| `(p⊃q)&(p&∼q)` | contradiction | PS2.1b (table) |
| `(p&q)&∼p` | contradiction | L4§1 (table); L6§2 (tree); **ND untouched** (`⊢ND ⊥` in 4 lines) |
| `{p≡∼p}` | inconsistent set | PS5.5 (ND, `⊢ND ⊥`); **table/tree untouched** (2-row table) |
| `p&q`, `p∨∼q`, `((p&q)∨r)&((p&q)∨∼r)` | contingent | PS2.1c,e,d (table) |
| `p&(q⊃p)` | contingent | L4§2 (table); L6§5 (two trees) |
| `(p⊃q)&p` | contingent | PS3.2 (two trees) |
| `p⊃∼p`, `p∨(q∨r)`, `(p⊃q)&(q⊃p)` | not tautologies | P1.3b–d (trees) |
| `(p∨q)⊃(p&q)` | contingent | **EX-Q3B (table — quarantined)** |
| `p⊃q` | contingent | L13.5 hint (stated, "check!") |

ND cannot show contingency/satisfiability/falsifiability directly — that is the
L12 bridge, and "countermodel, then conclude ⊬ND" is its own question type
(worked at L12§2 and L13.3c; easy to mint more from any invalid form above).

## 5. Equivalences and satisfiable sets

| Claim | Where (method) |
|---|---|
| `p⊃q ≡ ∼q⊃∼p` (contraposition) | L4§2 (table); L6§5 (tree); recurs L5/L7/L8 as metalanguage rule; **ND untouched** |
| `∼(p∨q) ≡ ∼p&∼q` (De Morgan I) | PS2.3c (table); PS3.7d (tree-rule symmetry); PS5.4 (ND, → only); PS1.5b (asserted) |
| `∼(p&q) ≡ ∼p∨∼q` (De Morgan II) | PS2.3c (table); PS3.7a–c (tree-rule symmetry); SG-CQ5 (ND ← posed) |
| `∼(p∨q) vs ∼p∨∼q`, `∼(p&q) vs ∼p&∼q` | **not** equivalent — PS2.3a,b (table) |
| `p⊃q ≡ ∼p∨q` | L4-CQ (posed); PS2.4a (table); PS5.3 (ND both + `⊢ (p⊃q)≡(∼p∨q)`); **tree untouched** |
| `p∨q ≡ ∼p⊃q` | PS2.4b (table only) |
| `p≡q ≡ ∼(∼p∨∼q)∨∼(p∨q)` | PS2.4c (table) |
| `p&(q∨r) ≡ (p&q)∨(p&r)` | L9§3 (ND both); PS3.1 (tree, → as conditional); **table untouched** |
| `p∨(q&r) ≡ (p∨q)&(p∨r)` | PS4.3e + 4.4b (ND both); **table/tree untouched** |
| `∼(p⊃q) ≡ p&∼q` | PS3.4 (tree); P1.1a (instance) |
| `p≡(q≡r) ≡ (p≡q)≡r` (associativity of ≡) | P1.4 (table) |
| `(p∨q)&∼(p&q) ≡ p⊕q` (XOR) | L3§2 (table) |
| `(∼p⊃(p∨q)) ≡ p∨q` | PS1.8c (table) |
| `p&q ≡ (p&q)&(s∨∼s)`; `p&q ≡ ((p&q)∨r)&((p&q)∨∼r)` | L4 (stated); PS2.1f (table) |
| DNF block: all 16 truth-functions of two atomics rendered in DNF (incl. nand, nor, ⊕, `⊃`, `≡`, `q⊃p`) | PS2.5 (table read-off) |
| Peirce-arrow block: `∼`, `∨`, `&`, `⊃` defined from `↓` | PS2.6 (table, ungraded bonus) |
| `{p&q, ∼p∨∼r, ∼q∨s}` satisfiable | L6§2 (tree, motivating example) |
| `{a∨b, b⊃a, ∼(a&c)}` satisfiable (astrolabe puzzle) | PS3.3 (tree; partial determination moral) |

## 6. Non-classical appearances (off-exam, for reference only)

Ł3: LEM fails (PS2.9 worked; L11 posed); both paradoxes remain Ł-valid and
`(q⊃p)∨(p⊃r)` fails (L11, posed "check yourself"). L11's Final Score table rates
seven classical facts across relevance/minimal/intuitionistic/classical. PS5.8
stems state the minimal-logic facts (`p&∼p ⊢ ∼q` survives, `⊬ q`). L11 Fork 2
derives DS twice — classically via ∼E and intuitionistically via the non-official
⊥E. None of this is midterm material; it is listed so nothing here is mistaken
for an unused classical form.

---

## 7. Openings — ranked candidates for new midterm-prep questions

Forms students already know, missing exactly the method a new question would ask.
Difficulty calibrated to the midterm.

**First rank (form is central, gap is glaring):**
1. **Contraposition by ND**: `p⊃q ⊢ND ∼q⊃∼p`. Table L4, tree L6, ND nowhere —
   verified. ⊃I wrapping a reductio; midterm-core difficulty. The single best
   opening in the corpus.
2. **Modus tollens by tree**: table and ND done; the tree is 4 lines and closes.
   Pairs naturally with a "which method is fastest here?" prompt.
3. **De Morgan I by ND, converse direction**: `∼p&∼q ⊢ND ∼(p∨q)` — PS5.4 did only
   →. No ∼E needed, so it also makes a good "which rules did you NOT need?" probe.
4. **Explosion by tree**: `p&∼p ⊢ q` — roots close in three lines whatever q is.
   Cheap, and lands the "trees don't care about relevance" observation.
5. **`p⊃q ≡ ∼p∨q` by tree**: one tree on the negated biconditional; table (PS2)
   and ND (PS5) both done, so this completes the course's flagship equivalence
   across all three methods.

**Second rank (solid, slightly narrower):**
6. Hypothetical syllogism by tree (table+ND done).
7. `⊢ND p⊃(p∨q)` — three lines; table and tree done in lectures.
8. `{p≡∼p}` by table (2 rows) and by tree — pairs with PS5.5's ND version;
   nice "same inconsistency, three ways" set.
9. Distribution laws by table (both are ND-only or ND+tree so far).
10. Affirming a disjunct symbolically (table or tree) — English-only since PS1;
    the countermodel p=T, q=T teaches inclusive-∨ again.
11. `(p⊃q)∨(q⊃p)` by tree — ND'd at L13.5; the tree closes fast and makes a
    striking contrast with the 22-line derivation.
12. De Morgan II by ND, → direction (`∼(p&q) ⊢ND ∼p∨∼q`) — needs ∼E; challenge-tier,
    good "why do the two De Morgans differ in ND?" discussion.
13. More L12-bridge instances: any §3 invalid form + "conclude ⊬ND" (the exam
    tests the concept; L13.3c is the only worked instance besides L12§2).

**Format note.** L13.1/L13.2 and SG samples Q1/Q2 established the
one-form-three-methods question. Candidates 1, 5, and 8 complete such triples
using work students have already half-done; that is the highest-leverage shape
for new study-guide material.

## 8. Exam quarantine and freshness watch

**Quarantined** (on the exam; never reuse in study materials): `p⊃q, q ⊬ p` as
Q2D/Q3A's rain/wet-ground English + table; `(p∨q)⊃(p&q)` contingent (Q3B);
`p∨q, ∼p, q⊃r ⊢ r` tree (Q4A); `(p∨q)⊃(q∨p)` tree (Q4B); `p⊃q, r⊃∼q ⊢ p⊃∼r`
and `∼p⊃p ⊢ p` ND (Q5A/B).

**Freshness watch** — the exam's own header claims none of its content reappears
from the L1–10 handouts or PS1–5. Three near-misses to adjudicate (not changed;
instructor's call):
- EX-Q2D/Q3A is affirming the consequent with a rain/wet-**ground** story. L1's
  Argument 2 is AC with rain/wet-**grass**, and L4§2 works the bare form
  `p⊃q, q ⊭ p` by table — same form, same method. The exam's English dressing is
  new; the form is not.
- EX-Q5B (`∼p⊃p ⊢ p`) is the positive twin of `c⊃∼c ⊢ ∼c`, which students met
  twice (PS2.8b table, PS4.2b tree). Different form strictly; same trick.
- EX-Q4B (`(p∨q)⊃(q∨p)` by tree) is ∨-commutativity, ND'd at PS4.3c and P1.2a.
  Different method and shape (conditional vs sequent); listed for completeness.

**Internal duplicates to remember when writing new material:** explosion appears
at SG-CQ1 (posed) and P1.2c (worked) — a student who did both has seen it twice;
absorption at SG pro-tip and P2.1; HS at P1.1b and P2.4 (same form, different
letters). Not errors — but new questions should not make any of these a third
appearance under the same method.
