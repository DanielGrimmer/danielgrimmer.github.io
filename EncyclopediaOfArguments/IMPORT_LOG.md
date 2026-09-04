# Import log

Rows from the inventories that the hourly import routine met and did not
import, with the reason. Kept so that a queue which stops moving is visible
rather than silent; see `IMPORTING.md` §7 (the archived procedure).

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
| 2026-08-31 | `⊢ (p∨q) ≡ ((p∨q) & (r∨∼r))` (CLI-210, comprehensive §2.1) | The row's own gloss calls this "SEP's 'contaminated disjunction'," naming SEP but not which of it — §2.1's `sep` line lists eight general articles. Checked five of the eight directly (`logic: classical`, `logic: propositional`, `logical consequence`, `logical form`, `logical truth`) for this specific example (a disjunction padded with a tautologous, atom-disjoint conjunct) and none of the five contains it; the row names no philosopher to fall back on either. Left for a person who can identify which SEP article (if any of the eight, rather than a ninth this firing did not think to check) the phrase is drawn from. |
| 2026-08-31 | `⊢ (p⊃q) ∨ p` (CLI-212, comprehensive §2.1) | Duplicates `disjunction-with-vacuous-conditional` already in the database (`⊢ p ∨ (p⊃q)`) — the identical tautology with its two disjuncts swapped, which `inventory.py`'s shape-match dedup does not catch since it does not normalise disjunct order. Caught by a manual search per §6 before writing. (Its sibling `⊢ a ∨ (a⊃b)`, CLI-214, does not appear in the queue at all — same theorem, same disjunct order up to renaming `a→p, b→q`, which the dedup does catch.) |
| 2026-08-31 | `(∼(∼p ∨ ∼q) ∨ ∼(∼p ∨ q)) ≡ p` (comprehensive, "Identities students will not guess" — Huntington's equation, 1933) | Valid, and the SEP article names it exactly — fetched Burris & Legris's *The Algebra of Logic Tradition* (§8, "Huntington: Axiomatic Investigations of the Algebra of Logic") and confirmed the equation, `who`, and canonical URL directly, rather than trust the row's own gloss. The obstacle is the derivation. Direction `p ⊢ (∼(∼p∨∼q) ∨ ∼(∼p∨q))` needs a case split on `q`, which the goal itself never pins down (the two disjuncts hold under opposite values of `q`), and no route tried avoided it: an explicit `q∨∼q` lemma ran the whole biconditional to 49 lines, and a leaner double-negation extraction of `∼p∨∼q` and `∼p∨q` directly from the negated goal still ran 41 — both comfortably past the 29-line floor with all five §14.3 triggers present, which would make this a fifth `extremely hard` nd entry against the cap of four the test suite enforces (`worn.length <= 4`). The style guide's own instruction for that situation is to raise `ND_EXTREME_LINES` rather than excuse the entry, but this firing's own earlier precedent (`conditional-crossover`, below) is to look for a shorter proof first, since the threshold also governs the four entries already wearing the band. No proof under 29 lines was found. Left for a firing or a person with time for either a cleverer derivation or a considered decision to raise the constant. |
| 2026-08-31 | `∼(∼(p ∨ q) ∨ ∼(p ∨ ∼q)) ≡ p` (comprehensive, "Identities students will not guess" — the Robbins equation) | Same SEP section (Burris & Legris, §8) names this one too, conjectured by Robbins as a simplification of Huntington's third axiom and settled only by McCune's automated prover in 1996. Not attempted in full: it is structurally the same shape as Huntington's equation directly above it in the queue (a case split on `q` is unavoidable in the same direction), so it is presumed to hit the same 29-line wall rather than re-derive it to confirm. Left for the same reason and alongside it. |
| 2026-08-31 | `⊢ ((p∨q) & ∼(p&q)) ≡ ∼(p≡q)` (CLI-313, comprehensive §3.6) | The row is "exclusive-or is definable — the logician's reply to the ambiguity thesis," naming no philosopher. §3's own `sep` line lists seven general articles (`conditionals`, `conditionals: counterfactual`, `connectives: sentence connectives in formal logic`, `contradiction`, `disjunction`, `logical constants`, `negation`) with no way to tell which covers this specific row — exactly §11d's case for naming the champion instead, except the row names none. Checked the likeliest candidate directly: Aloni's *Disjunction* discusses exclusive `⊕` and its problems but not this identity or this reply. Left for a person who can identify the actual source, if one of the seven names it at all. |
| 2026-08-31 | `⊢ ∼(p⊃q) ⊃ (p & ∼q)` (CLI-410, comprehensive §4.1) | No philosopher named in the row ("Classically `∼(p⊃q)` is maximally informative; constructively it is almost empty" states the point itself, attributing it to no one). §4's own `sep` line lists eleven articles; §4.1 is unambiguously about intuitionistic logic specifically, so fetched the SEP *Intuitionistic Logic* entry (Moschovakis) directly and searched it for any discussion of a negated conditional's BHK reading — none found. The article's only worked BHK example in this area is the disjunction clause already spent on `de-morgan-conjunction-hard-theorem` and `conditional-implies-disjunction`, and stretching it a third time to a conjunction-shaped conclusion would not be reporting the article, only echoing a phrase from an unrelated passage. Left for a person who can find an actual discussion of this specific form. |
| 2026-08-31 | `⊢ (∼p⊃(q∨r)) ⊃ ((∼p⊃q) ∨ (∼p⊃r))` (CLI-412, comprehensive §4.1, Harrop's rule) | Not a provenance problem — the SEP *Intuitionistic Logic* entry (Moschovakis, §4.2, "Admissible rules of intuitionistic logic and arithmetic") names this exact schema and Harrop [1960] by name, confirmed on a direct fetch, and would have made a clean `diagnosed` appearance. The obstacle is the derivation. A classical proof needs `p∨∼p` built from scratch (10 lines, no primitive LEM in the twelve rules), then a case split: the `p` branch needs `∼p⊃q` built vacuously through the no-explosion reductio machinery (8 lines, the same shape as the standalone `ex-falso` entry), and the `∼p` branch needs the premise applied and a second `∨E` on `q∨r`, each of *its* two cases building a vacuous conditional the cheap way (reiterating a formula already in hand, 5 lines each) before `∨I` closes it. Assembled and checked against `nd.check()`: 34 lines, all five §14.3 triggers (`∨E` more than once, an undictated reductio building `p∨∼p`, a subproof four deep, eleven subproofs, well past ten derived lines) — a fifth `extremely hard` `nd` entry against the cap of four the test suite enforces (`worn.length <= 4`; the database already carries `de-morgan-conjunction`, `material-conditional`, `biconditional-as-agreement` and `bivalence-pigeonhole`). Tried restructuring before giving up on the firing, per §6.4a's instruction to write the proof again rather than reach for a flag: extracting `∼(∼p⊃q)` and `∼(∼p⊃r)` from a top-level reductio on the negated goal, hoping to skip the `p∨∼p` lemma entirely, but recovering `∼p` from `∼(∼p⊃q)` needs the identical vacuous-conditional-via-reductio machinery the case-split approach already pays for, so nothing was saved. No proof under 29 lines was found. Left for a firing or a person with time for either a cleverer derivation or a considered decision to raise `ND_EXTREME_LINES`, per the same reasoning `conditional-crossover` and the Huntington/Robbins equations record above. |
| 2026-08-31 | `⊢ (p⊃(q∨r)) ⊃ ((p⊃q) ∨ (p⊃r))` (CLI-413, comprehensive §4.1) | No philosopher named in the row ("Memorable one-line refutation: set p := q∨r" states the point itself). Checked the SEP *Intuitionistic Logic* entry directly for this specific schema (unnegated antecedent, unlike CLI-412's Harrop rule immediately above it in the queue, which the article does name) — not found; the article's admissible-rules section covers Harrop's rule and Mints's rule, both negated-antecedent, and neither is this one substituted or generalised. Left for a person who can find an actual discussion of this specific form. |
| 2026-08-31 | `⊢ ((p⊃q)⊃q)⊃((q⊃p)⊃p)` (comprehensive §4.2, "Ł's axiom") | The row's own label names Łukasiewicz, but §4 carries one `sep` line covering §4.1–§4.9 jointly (eleven articles), too broad to point at any one of them for a §4.2 row, and fetching the likeliest candidate directly (SEP's *Many-Valued Logic*) found it discusses Ł3/K3/LP/G3 at length but never states this specific axiom in the text retrieved. A web search for the schema itself turned up Wajsberg's 1931 axiomatisation of Łukasiewicz's three-valued calculus without confirming whether this exact schema (as opposed to a variant) is among Wajsberg's axioms or original to Łukasiewicz. Rather than write `who: Jan Łukasiewicz` against a work this firing could not pin down and verify — exactly the guessed-attribution mistake §11d warns against, on the champion fallback as much as on an SEP slug — left for a person who can confirm the actual source. The two other §4.4 candidates queued alongside it (CLI-433, CLI-434) had clean citations and were imported this firing. |
| 2026-09-01 | `p, q, r, s ⊢ p&q&r&s` (comprehensive §4.6, "Same, by conjunction rather than chaining") | No philosopher named in the row or the surrounding prose; illustrates a general point about probabilistic semantics attributed to no one by name in this row's own cell. §4.6 carries no `sep` line, and the one plausible candidate among §4.5/§4.6's shared boilerplate list — SEP's *Conditionals*, for Adams's probabilistic semantics — was fetched directly and does not contain this row's content. Left for a person who can find the actual source. |
| 2026-09-01 | `p∨q, p⊃q ⊢ q` (comprehensive §4.6, "The rare case where the conclusion's probability is determined") | Same reason as the row above: no named philosopher, no usable `sep` line, and *Conditionals* checked directly does not cover this specific probability-of-a-disjunction identity. |
| 2026-09-01 | `⊢ ((a≡b) & (c≡d)) ⊃ ((a&c) ≡ (b&d))` (comprehensive §4.6, "why there is no truth table for probability") | Same reason again: no named philosopher, no usable `sep` line, and *Conditionals*, checked directly, does not state this compositional-replacement argument. |
| 2026-09-01 | `⊢ (d≡(∼d∨q)) ≡ (d≡(d⊃q))` (CLI-510, comprehensive §5.1, "SEP's DLiar is the Curry sentence under ⊃") | Not a provenance problem — `who`/`work`/`url` would be the same Shapiro & Beall *Curry's Paradox* citation the other nine §5.1 imports already carry. Skipped on the difficulty cap instead: `material-conditional`, already in the database, proves the plain identity `(p⊃q)≡(∼p∨q)` this row's two sides are each built from, at 29 lines — exactly `ND_EXTREME_LINES`, the floor for `extremely hard` — and this row wraps that same identity one level deeper inside an outer `d≡_` on both sides, needing a nested `≡I` in each of the outer biconditional's two directions where `material-conditional` needed one flat pair. Structurally closer to `biconditional-as-agreement` (85 lines, also `extremely hard`) than to `curry-conditional`'s one-line-deeper cousin of `curry-sequent`, which only added a wrapping `⊃I` around an unchanged proof rather than doubling the interior. Four entries already wear `nd: extremely hard` (`de-morgan-conjunction`, `material-conditional`, `biconditional-as-agreement`, `bivalence-pigeonhole`) — one below the test suite's cap of five, and §14.-0.5 asks that a fifth be read as the threshold having drifted rather than scored around. Left for a person to either write and check the proof and decide whether the fifth is warranted, or raise the constant. The other two §5.1 candidates queued alongside it (CLI-507, CLI-509) had ordinary short proofs and were imported this firing as `curry-peirce-half-alone` and `curry-at-bottom`. |
| 2026-09-01 | `{p ≡ ∼q, q ≡ ∼p}` (CLI-513, comprehensive §5.2, "even-length cycle") | No philosopher named in the row, and the section's own `sep` line is the whole of §5's shared list (Curry, Liar, epistemic paradoxes, Fitch, insolubles, future contingents, abduction, analogy, argument, fallacies, informal logic, non-monotonic logic — twelve articles, none pointing at this row specifically). SEP's *Liar Paradox*, fetched directly (§1.3, "Liar cycles"), states only the two-person Max-and-Agnes case CLI-512 already carries and says nothing about cycle length or the parity of negations around a cycle; that generalisation — even negation-count sat, odd unsat — is the comprehensive inventory's own observation extending Max-and-Agnes, not a claim SEP or any named philosopher makes. Citing SEP here would attribute the compiler's corollary to the article; `appearances_pending` is not a substitute (§13.1 marks that flag as an exception specific to the imports inventory's §3, not a general escape from having a source, and the routine's own log has held that line before at CLI-106). Left for a person who can find an actual source discussing generalised liar cycles. CLI-512, the case this row generalises, names SEP's own dialogue directly and was imported this firing as `max-and-agnes-liar-cycle`. |
| 2026-09-01 | `{a ≡ ∼b, b ≡ ∼c, c ≡ ∼a}` (CLI-514, comprehensive §5.2, "odd-length cycle") | Same reason as the row above: no philosopher named, the same twelve-article `sep` line covers it, and SEP's *Liar Paradox* (checked directly) discusses only the two-person case, not a three-cycle or the parity result this row instances. Companion to CLI-513, same disposition. |
| 2026-09-01 | `{p ≡ p}` (CLI-515, comprehensive §5.2, "the truth-teller") | No philosopher named in the row, and the section's own text says outright that "the truth-teller does not appear in SEP *Liar Paradox* as fetched (checked twice)." No other article in §5's shared `sep` line is a better candidate — it is a Liar-family row and that is the Liar-specific entry. Left for a person who can find an actual discussion of the truth-teller by name. |
| 2026-09-01 | `∼(p&q), ∼p ⊢ q` (CLI-524, comprehensive §5.3, "Denying a conjunct") | No philosopher named in the row. §5.3's own prose warns that SEP *Fallacies* "names only Copi's five, not affirming a disjunct, denying a conjunct, or improper transposition" and says to cite those three as standard textbook forms rather than to SEP — but every other appearance in the database is a real, named person or the course itself, and "the informal-logic textbook tradition" is not a checkable source, only a description of one. Fetched *Fallacies* directly this firing and confirmed it does not name this form. Left for a person who can find an actual textbook citation (Copi, Hurley, or another) for it. |
| 2026-09-01 | `h ≡ e, e ⊢ h` (CLI-529, comprehensive §5.3, "Inference to the **only** explanation") | No philosopher named in the row — unlike its neighbours in the same teaching sequence (CLI-528 van Fraassen, CLI-532 Burke 1994), this one names no one. Fetched SEP *Abduction* (Douven) directly, since the surrounding prose leans on it for the rest of the sequence: it discusses affirming-the-consequent and Peirce's own schema, but does not discuss inference to the *only* explanation or a uniqueness-based repair of IBE. Left for a person who can find an actual discussion of this specific move. |
| 2026-09-01 | `V ⊃ ⊥ ⊨ ∼V` (DB2, comprehensive §5.10g, "the Dutch book argument's genuine reductio") | Not a provenance problem — same Susan Vineberg *Dutch Book Arguments* citation `dutch-book-is-ought` and its siblings already carry. Skipped because the row cannot be written as a formula of this language at all: `V ⊃ ⊥` puts `⊥` inside a conditional, and style guide §2.2 is explicit that falsum "must never appear inside a formula" — it is a proof-level marker, legitimate only as a bare ND conclusion (`X ⊢ND ⊥`), never as a subformula, "not even unofficially." Unlike `conjunction-with-its-own-negation`'s reshape (2026-08-30 row above), there is no faithful reshaping here: the row's `⊥` is not standing in for "this premise set is unsatisfiable" (`V` alone is satisfiable) but for "assuming `V` derives a contradiction," which is the *content* of `∼I` itself, not a fact expressible by choosing a different conclusion. DB2c, the neighbouring row with the consequent left as an ordinary atom (`V ⊃ L_s ⊨ ∼V`, ★invalid, the SEP sweep's own "pivot"), has no such problem and was imported this firing as `dutch-book-pivot`. |
| 2026-09-01 | `p⊃q, (p&r)⊃∼q ⊢ ∼(p & r)` (comprehensive §7 TRAPS, valid twin of CLI-114) | No philosopher named — the row's own "why it belongs" cell only compares it to CLI-114 ("Valid — while the *same premises* with conclusion `∼r` are invalid"), and §7 carries no `sep` line at all. Its invalid twin, `sobel-sequence-defeater` (CLI-114), is already in the database and cites Howard Sobel via Lewis's *Counterfactuals* — but Sobel's sequence motivates the naive `∼r`, not this conjunction, so borrowing that citation here would put words about a form he never drew in his mouth. First drafted this firing with `appearances_pending: true`, then reverted on rereading this log: §13.1 scopes that flag to the imports inventory's §3 specifically, and the routine's own log has held that line before, at CLI-106 and again at CLI-513. Left for a person who can find an actual source drawing this particular conjunction from these premises, or import once one turns up; its sibling `⊢ ∼((p⊃q) & ∼q & ∼(∼p⊃∼q))` (comprehensive §7, same TRAPS batch) had a clean, verified SEP citation and was imported this firing as `negation-closure-trap`. |

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

## 2026-08-31 — three more from §2.1, all valid, all champions or SEP

Course and imports queues both empty (`inventory.py --status`: 0
candidates each). Worked the comprehensive queue, `--next 3`: all three
from §2.1 CORE PROPOSITIONAL AND FORMAL LOGIC, whose own `*SEP:*` line
lists eight general articles with no way to tell which covers any one
row — so each got read individually rather than trusting the header.

`nicods-rule` (CLI-205, `a, ∼(a & ∼(b & c)) ⊢ c`). No single article in
the header's eight covers this specifically (Nicod is a historical
figure, not a subject any of the eight are about), so named the
champion: Jean Nicod, *A Reduction in the Number of the Primitive
Propositions of Logic* (1917), `url: null` — confirmed only the
uncontroversial shape of the achievement (one axiom, one rule, all in
the Sheffer stroke, replacing *Principia*'s apparatus) rather than
assert an unverified characterisation of the rule's content. The
content claim in `interest` — that `∼(a & ∼(b & c))` is `a ⊃ (b & c)`
in stroke clothing — is verified directly (`∼(X & ∼Y) ≡ X⊃Y` is a
tautological equivalence, not a citation) rather than attributed to
anyone. Valid, 1 of 8 rows premise-true (matches the row's own
annotation). Needed a derivation: an undictated reductio for the
non-negation goal `c`, with a second reductio nested inside it to build
`∼(b & c)` before the two conjuncts can be joined and set against the
second premise — two §14.3 triggers (undictated reductio, nested
subproof), `medium`, matching `difficulty.py` exactly. Checked against
`nd.check()` directly. No near-duplicate in the database; no
`looks_like`.

`necessarium-ad-quodlibet` (CLI-206, `q ⊢ p ∨ ∼p`) and
`ex-impossibili-contradiction` (CLI-207, `p, ∼p ⊢ q & ∼q`). Both
corollaries of Buridan's, and §2.4 (a different section of the same
file) names the exact article and section for both without my having
to guess: SEP *Medieval Theories of Consequence*, §3.3, "lists *ex
impossibili quodlibet* among Buridan's corollaries." Fetched the entry
directly (twice, independently, to the same wording both times) rather
than trust that pointer alone — confirmed current authorship (Catarina
Dutilh Novaes, original author; Milo Crimi, Fall 2024 revision — the
*byline* on the entry as it stands, not just the historical author),
the section (§3.3, "Buridan and the Parisian tradition"), the URL, and
the exact sentence: "'from the impossible anything follows'... or 'the
necessary follows from anything'." Cited the SEP entry as `who` rather
than Buridan directly, `type: discussed`, `fidelity: verbatim` — the
same choice `peirce-law`'s Bimbó appearance already made for a
structurally identical case (a modern SEP entry reporting a formal
result rather than the SEP authors' own argument), and safer than
guessing a locus in Buridan's own *Treatise on Consequences* that
nobody here has read.

`necessarium-ad-quodlibet`: valid, tautological conclusion, one
premise never used — `looks_like: excluded-middle` (0-premise version
of the same tautology), `interest` says how they differ, and the
derivation *is* `excluded-middle`'s own reductio with `q` bolted on the
front, never cited again. Tagged `defect: idle premise` (`quotes
recovery-cleopatra`'s and `vacuous-conditional-no-reach`'s own
vocabulary for the same phenomenon) and `nonclassical: relevant`.
1 §14.3 trigger (undictated reductio), `medium`.

`ex-impossibili-contradiction`: valid, premises jointly unsatisfiable
(0 of 4 rows premise-true) — `looks_like: ex-falso` (same principle,
premises separate rather than conjoined, conclusion a contradiction
rather than a bare atom), `interest` says how they differ. Derivation
runs `ex-falso`'s own reductio twice from the same two premises, once
for `q` and once for `∼q`, joined by one `&I` — two sibling subproofs,
not nested, so only 1 §14.3 trigger, `medium`. Tagged `defect: vacuous
validity` and `nonclassical: [relevant, paraconsistent]`, matching
`ex-falso`'s own tags exactly, since it is the same phenomenon.

All three: `difficulty.py --diff` printed nothing (0 differ) — every
authored `nd` score matched the computed suggestion, no override
needed. Checked the database for near-duplicates and existing ids
first (none found for any of the three) before writing. `git diff
--name-only origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md`
confirmed empty; none of the three appearances is a course appearance,
so none needed it.

**The sandbox again had no LaTeX toolchain in this fresh container.**
`apt-get install` of the usual package list (`texlive-latex-base
texlive-latex-recommended texlive-latex-extra texlive-pictures
texlive-binaries dvisvgm texlive-humanities texlive-science
texlive-fonts-recommended`) 404'd on the same two unrelated packages
prior firings have already noted (`mesa`'s `libegl-mesa0`, `ruby3.2`)
on the first attempt; a second `apt-get install --fix-missing` with the
identical list resolved `latex`, `pdflatex` and `dvisvgm` cleanly.

`build.py --write` (three entries normalised, atoms already legal —
`a`/`b`/`c`, `p`/`q` — so no renames; difficulty scores written for
table/tree, `nd` left at the authored value since it already matched),
`python3 difficulty.py --diff` (0 differ), `svg.py` (12 SVGs: 4 blocks
× 3 valid entries), `svg.py --check` (every SVG current),
`inventory.py --locks` (0 practicable methods locked),
`manifest.py --check-merge` (146 entries, 143 expected from the merge
parents plus 3 new, nothing lost — the branch was already up to date
with `main`, no merge to resolve this firing), and
`node --test "_tests/*.test.mjs"` (513/513) all clean. `extremely hard`
count unchanged (none of the three new entries is anywhere close: all
three score `medium`). Comprehensive queue: 77 candidates left of 274
(88 now in the database, 3 quarantined, 82 unreadable, 24 settled).
Course and imports queues remain at 0.

## 2026-08-31 — three more from §2.1 and §4.1; two skipped, two more caught by manual dedup

Course and imports queues both confirmed empty (`inventory.py --status`,
`--status --source imports`: 0 candidates each). Continued the
comprehensive queue, `--next 3 --source comprehensive`: `p, q ⊢ p`
(CLI-208), `⊢ (p∨q) ≡ ((p∨q) & (r∨∼r))` (CLI-210), and
`⊢ ((p⊃p)⊃q)⊃q` (CLI-211), all §2.1 CORE PROPOSITIONAL AND FORMAL
LOGIC, whose `sep` line again lists eight general articles with no
per-row pointer.

CLI-210 could not be sourced — logged above — so a fourth candidate,
CLI-212 (`⊢ (p⊃q) ∨ p`), was pulled to look at as a replacement and
turned out to be a disjunct-order duplicate of the existing
`disjunction-with-vacuous-conditional` — also logged above, since
`inventory.py`'s dedup does not normalise disjunct order and would
offer it again untouched. Went further down the queue for a genuine
third candidate and took `⊢ ∼∼p ⊃ p` (CLI-401, §4.1 "Intuitionistic
logic — the classical theorems that fail") instead, whose `sep` line
names `logic: intuitionistic` directly rather than a grab-bag.

`structural-weakening` (CLI-208, `p, q ⊢ p`). The row's own gloss
— "the rule relevance logic rejects one level above the connectives" —
names no philosopher, and none of §2.1's eight listed articles is
obviously about relevance logic by title, so five of the eight were
read directly rather than guessed past: `logic: classical`,
`logic: propositional`, `logical form`, `logical truth`, and
`logical consequence`. The fifth has the passage this row needs
verbatim — Beall, Restall & Sagi's SEP entry *Logical Consequence*,
§4 ("Premises and Conclusions"), states the objection to the
structural rule of weakening in almost exactly the row's own words —
so it is cited directly (`who`, `work`, `url` all confirmed against
the fetched page) rather than treated as unclear. Quote checked
against the fetched text before writing, not composed. Valid,
trivially — the shortest entry in the database by every measure:
3-line proof (`Pr, Pr, Reit`), 0 §14.3 triggers, `easy`. `derive.py`'s
own `premise_analysis` confirms `q` is idle on every row before that
claim went into `interest`.

`entt-axiom` (CLI-211, `⊢ ((p⊃p)⊃q)⊃q`, Anderson & Belnap's EntT,
axiom 2 of the relevance logic E). The row names E and R directly —
Anderson and Belnap's own systems — but neither "relevance logic" nor
"Anderson" nor "Belnap" is among §2.1's eight listed SEP articles, so
rather than reach for SEP's own *Relevance Logic* entry (confirmed by
search to carry the exact axiom, word for word, in its "Logic E"
subpage — a hit, not a guess) and cite an article outside the row's
given list, named the champions directly per §11d's fallback: Anderson
& Belnap's *Entailment: The Logic of Relevance and Necessity* (1975),
`url: null`, no `quote` (no verbatim text on hand to check one
against). The claim that EntT is not among R's own eleven listed
axioms — checked directly against SEP's *Relevance Logic* "Logic R"
subpage, which is how the entry's own `interest` can say it — is
stated in `interest` in the encyclopedia's own voice, not attributed
to SEP as a quotation. Valid; the proof needs `p⊃p` built as its own
subproof nested inside the assumption for the whole theorem, one
§14.3 trigger, `medium`, matching `difficulty.py` exactly.

`double-negation-theorem` (CLI-401, `⊢ ∼∼p ⊃ p`). Companion to the
existing `double-negation-elimination` (`∼∼p ⊢ p`) — same rule, one
`CondI` further out, `looks_like` set and `course.note` names the
pairing. §4.1's `sep` line names `logic: intuitionistic` directly, no
guessing needed: fetched Joan Rand Moschovakis's SEP entry
*Intuitionistic Logic*, §1 ("Rejection of *Tertium Non Datur*"),
confirmed the current byline and quoted its own sentence verbatim —
"the classical law of double negation elimination: ¬¬A → A" — rather
than composing one. Valid, 3-line proof (`As, NegE, CondI`), 0 §14.3
triggers, `easy`.

**Two more from the front of the queue were considered and set aside
rather than imported this firing, not logged as skips since neither is
rejected — both are still exactly where the queue left them.** Positions
2 and 3 at firing's end are Huntington's equation
(`(∼(∼p∨∼q)∨∼(∼p∨q)) ≡ p`, 1933) and the Robbins equation
(`∼(∼(p∨q)∨∼(p∨∼q)) ≡ p`, McCune's 1996 automated proof) — both
directly and richly sourced (SEP's *The Algebra of Logic Tradition*,
Burris & Legris, §8, confirmed to carry both equations and the full
McCune/Tarski/Berkeley narrative verbatim) and both good future
imports. Each is semantically `p & (q∨∼q) ≡ p` under De Morgan, and a
hand-sketched `BicondI` derivation for that shape — proof-by-cases
lemma for `q∨∼q`, nested inside a second case split to extract each
half of the disjunction being defined — ran past 40 lines with what
looked like all five §14.3 triggers before it was even fully checked.
The `extremely hard` (nd) band is at 4 of the 4 the test suite allows;
writing either equation's derivation by hand at that length and risking
a fifth was worse than leaving both for a firing that can either find a
shorter route or accept the count needs to rise, per §14.-0.5's own
instruction to say so rather than score around it. Recorded here so
the next firing does not have to rediscover the risk from nothing.

Checked all three imported entries against the database for
near-duplicates and existing ids first (none beyond the
`double-negation-theorem`/`double-negation-elimination` pairing, which
is deliberate and stated via `looks_like`). `git diff --name-only
origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md`
confirmed empty; none of the three appearances is a course, Restall or
archive appearance, so none needed it.

**The sandbox again had no LaTeX toolchain in this fresh container**;
`apt-get install texlive-latex-base texlive-latex-extra
texlive-fonts-recommended dvisvgm` first, which left `stmaryrd.sty` and
`qtree.sty`/`fitch.sty` missing (same shape of gap prior firings
recorded); `apt-file search` (after `apt-file update`) pointed at
`texlive-science` (`stmaryrd.sty`, `fitch.sty`) and
`texlive-humanities` (`qtree.sty`), matching every prior firing's note
exactly. Both installed cleanly, no `--fix-missing` needed this time.

`build.py --write` (three entries normalised, atoms already legal —
`p`/`q` throughout, no renames; difficulty scores written for
table/tree, `nd` left at the authored values since `difficulty.py
--diff` agreed with all three), `svg.py` (12 SVGs: 4 blocks × 3 valid
entries), `svg.py --check` (every SVG current), `inventory.py --locks`
(0 practicable methods locked — none of the three carries a
`problem_set`, per §11d), `manifest.py --check-merge` (149 entries, 146
expected from the merge parents plus 3 new, nothing lost — the branch
was already up to date with `main`, no merge to resolve this firing),
and `node --test "_tests/*.test.mjs"` (513/513) all clean. `extremely
hard` count unchanged at 4 of 4 (nd) — none of the three new entries is
close (`easy`, `medium`, `easy`). Comprehensive queue: 74 candidates
left of 274 (91 now in the database, 3 quarantined, 82 unreadable, 26
settled — CLI-210 and CLI-212 newly logged above). Course and imports
queues remain at 0.

## 2026-08-31 (continued) — a shorter Huntington/Robbins proof, still over
the line; three imported instead from further down §2.6/§2.17b/§3.1

Course and imports queues confirmed empty again. `python3
manifest.py --check-merge` before touching anything: `origin/main` was
already fully merged into `claude/inventory-import` (149 entries, 149
expected), nothing to resolve.

**Huntington's equation and the Robbins equation, revisited.** The
prior firing set both aside at 4 of 4 `extremely hard` (nd) rather than
risk a fifth, and left a hand-sketched >40-line estimate for whichever
firing came next to either shorten or accept. Took that up directly:
wrote both directions in `nd.py`'s own line format and checked them
with `nd.check()` rather than by hand, since the prior estimate was
explicitly unverified. The `⟸` direction (`p ⊢ D1∨D2`) compresses well
once the two disjuncts are attacked by reductio-against-`E`
(`¬(D1∨D2)`) rather than by first deriving `q∨∼q` and case-splitting on
it — the case-split route re-proves excluded middle from scratch (10
lines) and then repeats a nested `∨E` twice more; the `¬E`-first route
gets `¬D1` and `¬D2` directly (4 lines each, same shape
`de-morgan-disjunction` uses) and only needs one nested case-split to
collide them, 26 lines against `Reit` where required for own-assumption
`⊥I` (§6.4's table, row 4 — every one of the four such spots in this
proof needed it, and `nd.check()` catches the ones a first draft
missed). The `⟹` direction (`D1∨D2 ⊢ p`) similarly compresses from a
naive double-reductio (14 lines) to a single shared reductio wrapping
the case split (13 lines). Verified total: **40 lines** (13 + 26 + 1 for
`≡I`), all five §14.3 triggers present. This confirms rather than
overturns the prior estimate — a genuinely shorter route was not
found, and 40 lines is a floor for this identity in the twelve-rule
system, not an artifact of bad proof search. The `extremely hard` (nd)
band is still at 4 of the 4 the test suite allows, so importing either
now would need `ND_EXTREME_LINES` raised — which also touches
`de-morgan-conjunction` and `material-conditional`, both sitting at
exactly the current 29-line floor, and would need their own
`course.note` added the moment the threshold moves past them. That is
a real decision about shared calibration, not a per-entry judgement,
so it is left for a firing (or Daniel) that can make it deliberately
rather than as a side effect of clearing this pair. The verified
40-line proof is not thrown away: it is sitting in this firing's own
scratch history and can be dropped into `proofs.py` verbatim the day
the threshold moves. Consensus (below) needed the same reductio-against-`E`
trick and came in at 27 lines — proof that the trick works, just not by
enough margin on the harder pair.

**`consensus-theorem`** (comprehensive, §2.6 "Identities students will
not guess", no `ID`). `((p&q)∨(∼p&r)∨(q&r)) ≡ ((p&q)∨(∼p&r))` — the
disjunct `q&r` is redundant given the other two, because `p` and `∼p`
between them already exhaust it. The section's own `sep` line names
three articles (Burris & Legris' *The Algebra of Logic Tradition*, Monk's
*The Mathematics of Boolean Algebra*, Font & Jansana's *Algebraic
Propositional Logic*); fetched all three specifically for this row (not
just the section) and none discusses consensus by name — Burris &
Legris covers Huntington and Robbins (confirmed, see above) but stops
there. Per §11d's fallback, named the champion the row's own table
credits instead: Archie Blake, whose 1937 dissertation *Canonical
Expressions in Boolean Algebra* introduced the shape (confirmed against
Wikipedia's history section, cross-checked for the year and title
rather than taken as given); `fidelity: our reconstruction`, `url:
null`. Valid, `hard` (nd) — 27 lines, matching `difficulty.py`'s own
rubric exactly (no `course.note` needed), comfortably under the
29-line floor that would push it into `extremely hard` even with all
five §14.3 triggers present.

**`combinatory-fixed-point`** (comprehensive, §2.17b "Fixed points",
no `ID`). `p⊃p, (p⊃p)⊃p ⊨ p` — the propositional shadow of the
combinatory fixed-point theorem (`Yx ▷ x(Yx)` needs `Y : (A⊃A)⊃A`, which
is not a theorem as a bare schema but becomes trivial once `A⊃A`'s own
theorem-hood is handed in as a second premise). The section's `sep`
line names Bimbó's *Combinatory Logic* directly; fetched it and
confirmed both the fixed-point theorem statement and its self-application
passage verbatim, §2.3. `derive.py`'s `premise_analysis` confirms `p⊃p`
is idle — checked before it went into `interest`, since that is exactly
the kind of claim §11d/the routine's own standing caution says to
verify rather than assert. Valid, `easy` (nd) — 3 lines, `Pr, Pr,
CondE`.

**`mcgee-counterexample`** (comprehensive, §3.1 "The paradoxes of
material implication", CLI-309). `(r&∼g)⊃a, r ⊢ ∼g⊃a` — the
propositional shadow of Vann McGee's 1985 counterexample to modus
ponens. The section's `sep` line lists seven general articles including
`conditionals`, which resolves (checked, not assumed) to Dorothy
Edgington's *Indicative Conditionals* rather than to Égré & Rott's *The
Logic of Conditionals* (a different, unlisted article that happens to
also be in the database already, cited on `conditional-excluded-middle`
— checked it was not what this row's own `sep` line names before
reaching for it here). Fetched Edgington's entry and confirmed it
discusses McGee's example by name and year in §5, quote verbatim.
Row's own `Prop?` column flags the loss directly ("the failure needs
probability"): the propositional fragment is classically valid with no
countermodel (`derive.py`: 3 of 8 rows keep both premises true, all
three also true in the conclusion) precisely because it cannot
represent the probabilistic semantics McGee's actual argument needs —
said in `interest` rather than left for the `VALID` chip to read as a
rebuttal of McGee, per §11d's standing instruction on rows that flag
their own propositional shadow.

**CLI-307** (`p&q ⊢ p⊃q`, "And-to-If / Conjunctive Sufficiency... In
Stalnaker's C2, absent from Lewis's V") was looked at and set aside,
not rejected. Confirmed the technical claim is accurate — Égré & Rott's
*The Logic of Conditionals* §3.3 states system `V` excludes `CS`
(Conjunctive Sufficiency) while `VC`/`C2` include it, matching the
row's own phrasing closely enough that `CS` is very likely what the row
means — but that article is not one of §3.1's seven listed `sep`
articles, and `conditionals` on that list resolves to Edgington's
different, unlisted-by-name article instead (used for `mcgee-counterexample`
above). Stalnaker and Lewis are both named directly by the row, so the
§11d fallback (cite the champions, `url: null`) would apply here too —
just not chased fully this firing once `mcgee-counterexample` gave a
cleaner three-entry batch. Left exactly where the queue leaves it, for
a firing that wants a fourth from this section.

`build.py --write` (three entries normalised; `p⊃p` and `p` already
legal atoms throughout, no renames; `nd` difficulty authored for all
three and `difficulty.py --diff` agreed on every one, no override
needed), `svg.py` (12 SVGs: 4 blocks × 3 valid entries), `svg.py
--check` (every SVG current), `inventory.py --locks` (0 practicable
methods locked — none of the three carries a `problem_set`, per §11d),
`manifest.py --check-merge` (152 entries, 149 expected plus 3 new,
nothing lost), and `node --test "_tests/*.test.mjs"` (513/513) all
clean. `extremely hard` (nd) count unchanged at 4 of 4 — none of the
three new entries is close (`hard`, `easy`, `easy`). Comprehensive
queue: 69 candidates left of 274 (94 now in the database). Course and
imports queues remain at 0.

## 2026-08-31 (continued) — Huntington/Robbins confirmed over the line
a third time; three imported from further down §3.1/§3.6 instead

Course and imports queues confirmed empty again (`--status` on both:
0 candidates). `manifest.py --check-merge` before touching anything:
`origin/main` was already fully merged into `claude/inventory-import`
(152 entries, 152 expected), nothing to resolve.

**Huntington's equation and the Robbins equation, independently
re-verified, same conclusion a third time.** Before reading this log's
own prior two entries on the pair, wrote both directions from scratch
in `nd.py`'s line format and ran `nd.check()` directly — same
motivation as the second entry: don't trust a hand estimate. First
draft used a proof-by-cases-on-`q` route (re-deriving `q∨∼q` from
nothing, then splitting on it twice more to build each disjunct) and
landed at 49 lines, all five §14.3 triggers, `extremely hard`. Reading
the log afterward found the second entry had already discovered and
recorded the better route — reductio-against-`∨I` to pull `¬D1`/`¬D2`
out of `¬(D1∨D2)` directly, skipping the from-scratch excluded-middle
lemma — bringing its own version to 40 lines, still all five triggers,
still over the line. Did not re-litigate which route is shorter; the
second entry's 40-line figure is lower than this firing's 49 and is
taken as the standing number. Both firings agree on the diagnosis: the
`extremely hard` (nd) band is at 4 of the 4 the test suite allows
(`assert.ok(worn.length >= 1 && worn.length <= 4)`,
`_tests/argument-forms.test.mjs`), a genuinely shorter proof was not
found on three independent attempts, and importing either equation
now would need `ND_EXTREME_LINES` raised — a shared-calibration
decision (it would also reopen `de-morgan-conjunction` and
`material-conditional`, both sitting at exactly the current 29-line
floor) that belongs to a firing or to Daniel making it deliberately,
not to a routine clearing two rows. Left exactly where the last two
firings left it. A fourth independent attempt at a shorter proof is
probably not worth another firing's time; the number is likely a
genuine floor for this identity in the twelve-rule system.

Moved past both without stopping the routine, taking the next three
importable rows instead — two of them further into §3.6 than the queue
order alone would suggest, since positions 4–5 (`⊢(p∨q)⊃(p&q)`-style
free-choice and XOR-definability rows) were skimmed and set aside for
a future firing with more room, in favour of two rows whose provenance
was already worked out by this database's own precedent.

**`conjunctive-sufficiency`** (comprehensive, §3.1 "The paradoxes of
material implication", CLI-307). `p&q ⊢ p⊃q` — the row this log's own
prior entry investigated and deliberately left ("Stalnaker and Lewis
are both named directly by the row, so the §11d fallback... would
apply here too — just not chased fully this firing"). Picked it up
directly: independently re-fetched §3.1's seven listed `sep` articles
before touching the database, and reached the same dead end the prior
entry recorded — `conditionals` resolves to Edgington's *Indicative
Conditionals*, which does not state the C2/V contrast; `counterfactuals`
does not either (fetched and searched its full text for "C2",
"Stalnaker's logic", "Strong Centering" and "conjunctive sufficiency",
none present); the article that does state it, Égré & Rott's *The
Logic of Conditionals*, confirmed again (fetched directly: Table 6
lists CS in systems SS, VC and C2 but not V, matching the row's own
"In Stalnaker's C2, absent from Lewis's V" almost verbatim) is not on
§3.1's list. Per §11d's fallback, named the champions the row itself
names — Robert Stalnaker, whose system C2 is where the schema holds,
with Lewis's contrasting V named in `work` rather than given a second
`who` — `fidelity: our reconstruction`, `url: null`, no `quote` (the
close paraphrase is confirmed accurate but is not any one source's own
sentence). Valid, `easy` (nd) — 4 lines (`Pr, As, ConjE, CondI`), 0
§14.3 triggers, matching `difficulty.py` exactly.

**`addition-converse`** (comprehensive, §3.6 "Disjunction — Ross's
paradox and free choice", CLI-311). `⊢ (p∨q)⊃p`, **INVALID**
(`p=F,q=T`, matching the row's own countermodel exactly) — the
converse of `addition`/`ross-paradox` (`p ⊢ p∨q`), included by the
row's own gloss ("the conclusion really is weaker — what makes Ross's
paradox a paradox"). No new SEP fetch needed: `ross-paradox`, already
in the database, cites McNamara & Van De Putte's *Deontic Logic* (SEP,
§6.3) for the same premise-conclusion pair read the other direction,
so the same appearance is reused here with `fidelity: our
reconstruction` (no `quote` — the citation covers Addition read as an
imperative, not this specific converse) and `looks_like: ross-paradox`
set both ways. Checked the `interest` claim ("witnessed here by
`p=F,q=T`") against `derive.py`'s own computed countermodel before
writing it: matches. Invalid, no derivation — `nd.note` says why
(`∨I` only ever moves from a disjunct to the disjunction, never back).

**`distribution-botched`** (comprehensive, §3.6, CLI-315). `p∨(q&r) ⊢
(p∨q)&r`, **INVALID** (2 of 8: `p=T,q=T,r=F` and `p=T,q=F,r=F`,
matching the row's own count and both computed countermodels). The
deliberately-invalid companion to the existing `distribution`
(`p&(q∨r) ⊃ (p&q)∨(p&r)`), reshuffling `∨`/`&` the other way. Reused
`distribution`'s own SEP appearance (Michael Dummett, *Disjunction*)
rather than re-fetching, since the two rows are about the same
disjunction/conjunction interplay and neither claims a fresh quote —
`fidelity: our reconstruction`, no `quote`, `looks_like: distribution`
set both ways. Checked the "both countermodels share exactly that
shape: `p` true, `r` false, `q` either way" claim against the computed
countermodels before writing it: matches both.

Checked all three against the database for near-duplicate ids and
premise/conclusion pairs before writing (none beyond the two
deliberate `looks_like` pairings). `git diff --name-only
origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md`
confirmed empty; none of the three appearances is course, Restall or
archive, so none needed it.

**Fresh container again had no LaTeX toolchain**; same gap every prior
firing recorded. `apt-get install texlive-latex-base
texlive-latex-extra texlive-fonts-recommended dvisvgm` first (one
`apt-get update` needed first this time, plus `--fix-missing`, for two
unrelated 404s on `libegl-mesa0`/`ruby3.2` that a second attempt after
`update` cleared), then `texlive-science` (`stmaryrd.sty`,
`fitch.sty`) and `texlive-humanities` (`qtree.sty`) for the same two
missing packages every prior firing hit. Both installed cleanly.

`build.py --write` (three entries normalised, atoms already legal
throughout — `p`, `q`, `r` — no renames; `nd` difficulty authored for
`conjunctive-sufficiency`, `null` for the two invalid entries,
`difficulty.py --diff` agreed on all three, no override needed),
`svg.py` (10 SVGs), `svg.py --check` (every SVG current),
`inventory.py --locks` (0 practicable methods locked — none of the
three carries a `problem_set`), `manifest.py --check-merge` (155
entries, 152 expected from the merge parents, nothing lost), and
`node --test "_tests/*.test.mjs"` (513/513) all clean. `extremely
hard` (nd) count unchanged at 4 of 4 — none of the three new entries
is close (`easy`, invalid/no-nd, invalid/no-nd). Comprehensive queue:
66 candidates left of 274 (97 now in the database). Course and
imports queues remain at 0.

**2026-08-31, `comprehensive`-source firing: two entries, three skipped over the
`extremely hard` cap and an unattributable row.** Course and imports queues
both re-confirmed empty. `inventory.py --next 3 --source comprehensive` gave
Huntington's equation and the Robbins equation (both from "Identities students
will not guess," §2.6) and CLI-313 ("exclusive-or is definable"); none of the
three went in cleanly, each logged above with its own reason. Continued into
the queue rather than stop the firing over three bad rows in a row, and landed
on a clean pair: `⊢ Tp∨Fp` and `⊢ ∼(Tp&Fp)`, from §3.8's "forms that separate
[excluded middle from bivalence]" — imported as `bivalence-schema` and
`no-gluts`.

Huntington's and Robbins's equations were the SEP-article part of §11d done
right: their shared `sep` line names three general algebra-of-logic articles,
but the file's own table calls each identity by name, and fetching Burris &
Legris's *The Algebra of Logic Tradition* confirmed both are stated verbatim in
its §8 — Huntington's third 1933 axiom and Robbins's 1963 simplification of it,
with the equations themselves (translated out of `+`/`'`/`=` into `∨`/`∼`/`≡`)
matching the row exactly. Getting the citation right was not the obstacle this
time; the derivation was. Both identities need a case split on `q` in one
direction (the two disjuncts hold under opposite values of `q`, and the goal
`p` never mentions it), and every route tried for Huntington's alone — an
explicit `q∨∼q` lemma, and a leaner extraction of `∼p∨∼q` and `∼p∨q` straight
out of the negated goal — landed at 49 and 41 lines respectively, both with all
five §14.3 triggers and both well past the 29-line floor. That would make
either entry a fifth `extremely hard` nd, one past the cap `worn.length <= 4`
enforces, and `bivalence-pigeonhole`'s own note (above) already flagged this
exact cap as reached with nothing to spare. Robbins's equation was not
attempted in full — same section, same shape, presumed to hit the same wall —
and both are left in the skip table for a cleverer proof or a considered
decision to raise `ND_EXTREME_LINES`, which is a bigger, more consequential
change than a routine firing's two-or-three-row scope, and affects the other
four entries already scored against it.

CLI-313 named no philosopher and its enclosing section's `sep` line lists seven
general articles with no way to tell which one, if any, covers this specific
identity. Checked the likeliest of the seven — Aloni's *Disjunction* — directly
rather than guess: it discusses exclusive `⊕` and where it breaks down, but not
this identity or the "logician's reply" framing the row gives it. Left rather
than attributed on a guess, per §11d's own warning that a wrong SEP slug puts a
real author's name on a page they may never have written.

`bivalence-schema` and `no-gluts` are `p∨∼p` and `∼(p&∼p)` themselves —
`excluded-middle` and `non-contradiction`, both already in the database —
written one level up, over deliberately opaque atoms `Tp`/`Fp` proxying the
metalinguistic claims "p is true"/"p is false" rather than `p`/`∼p`
themselves. `looks_like` set to each accordingly. Both invalid, with
countermodels checked against `derive.py`'s own output before writing (`Tp=F,
Fp=F` — the gap; `Tp=T, Fp=T` — the glut — both matching the file's stated
countermodels exactly) rather than copied from the row. `interest` also claims
that adding Convention T (`Tp≡p, Fp≡∼p`) as a premise makes `Tp∨Fp` valid,
which the file states but this firing checked independently with `derive.py`
before writing it down, per this file's standing caution about claims that
sound right and are not verified. The SEP quote (bivalence "taken as a
metatheoretical principle, viz. that there exist only two distinct logical
values") was fetched from the live page and confirmed verbatim before being
written into `appearances`, not copied from the inventory file's own
paraphrase of it. `Tp`/`Fp` are not legal atom names (uppercase first letter),
so `build.py` renamed them to `t_p`/`f_p` throughout, prose included.

`build.py --write` (two entries normalised, `Tp→t_p`/`Fp→f_p` renamed
everywhere including `interest` and `nd.note`; difficulty `easy`/`easy`/`null`
for both, matching the rubric), `python3 difficulty.py --diff` (clean, 0
differ), `svg.py` (6 SVGs — table and tree only, no `nd` block for either
invalid entry), `svg.py --check` (every SVG current), `inventory.py --locks`
(0 practicable methods locked — neither entry carries a `problem_set`),
`manifest.py --check-merge` (157 entries, 155 expected from the merge
parents, nothing lost), and `node --test "_tests/*.test.mjs"` (513/513) all
clean. `extremely hard` (nd) count unchanged at 4 of 4 — both new entries are
invalid and carry no `nd` score, which is exactly why they were the pair that
went in this firing. Comprehensive queue: 61 candidates left of 274 (99 now
in the database, 3 quarantined, 82 unreadable, 29 settled — the three rows
above newly logged). Course and imports queues remain at 0.

**The sandbox again had no LaTeX toolchain in this fresh container**; `apt-get
install` of the same package list every prior firing has recorded
(`texlive-latex-base texlive-latex-recommended texlive-latex-extra
texlive-pictures texlive-binaries dvisvgm texlive-humanities texlive-science
texlive-fonts-recommended`) needed `--fix-missing` after two unrelated 404s
(`libegl-mesa0`, `ruby3.2` — neither on this project's own package list) on
the first attempt; the retry installed cleanly and both `latex` and `dvisvgm`
resolved. The `session-start-hook` suggestion from every prior firing's note
is still open.

**2026-08-31, `comprehensive`-source firing: the six-row exercise, three more
rows.** Course and imports queues both confirmed empty again
(`inventory.py --status`, `--status --source imports`). `inventory.py --next 3
--source comprehensive` gave the next three rows of §3.8's own "forms that
separate them" table, continuing straight on from the pair (`bivalence-schema`,
`no-gluts`) the previous comprehensive firing took from the same eight-row
table — checked against the inventory file directly (line 1731 onward) rather
than assumed, since the file's own prose says "six rows" while the table prints
eight; the four already accounted for (`excluded-middle`, `non-contradiction`
pre-existing; `bivalence-schema`, `no-gluts` from the last firing) plus the
three taken this firing leave exactly one row of the table still queued (the
"Gaps + Gluts = Bivalence" row), for a future firing.

`bivalence-not-from-lem` (`p∨∼p ⊢ Tp∨Fp`, **invalid**) is `bivalence-schema`
with the theorem `p∨∼p` bolted on as a premise — checked with `derive.py`
before writing that the premise is genuinely idle (`premise_analysis` marks it
so, and the countermodel count stays at what `bivalence-schema` alone carries,
just once per value of `p`), which is exactly the inventory row's own point:
excluded middle does not hand you bivalence. No derivation needed (invalid);
`nd.note` says where the attempt breaks down, the same wall `bivalence-schema`
already hits.

`convention-t-gives-bivalence` (`Tp≡p, Fp≡∼p ⊢ Tp∨Fp`, **valid**) is the
sequent `bivalence-schema`'s own `interest` field already named, from the
previous firing, as the fix for its missing connection — written now and
checked directly rather than left as a forward reference. The derivation
cannot eliminate either premise directly (neither names `p∨∼p`), so excluded
middle has to be proved first as an undictated lemma (`excluded-middle`'s own
ten lines, reused verbatim as the opening of a 19-line proof) before a case
split lets `BicondE` read off `t_p` or `f_p` in each branch.

`bivalence-is-no-gap` (`(Tp∨Fp)≡∼(∼Tp&∼Fp)`, **valid**) is a near-duplicate
caught by the required search before writing: both sides of
`de-morgan-disjunction`'s own theorem (`∼(p∨q)≡(∼p&∼q)`) negated once, atoms
renamed — logically the identical theorem, since `A≡B` and `∼A≡∼B` always
agree — so `looks_like: de-morgan-disjunction` rather than a bare import, and
`interest` says how they relate rather than repeating the table. First
draft of `interest` called this transformation "doubly negated", which is
wrong (a single negation of each side, one of which happens to cancel against
the left side's own pre-existing negation) and contradicts the correct rule
stated one clause later in the same sentence — caught on the §7a re-read
before committing, not by any test, and fixed. The 27-line derivation is the
same shape as `de-morgan-disjunction`'s own proof, one level removed (the
outer premise is the disjunction itself rather than a separate premise about
it).

All three reuse `bivalence-schema`'s already-verified SEP appearance (Shramko
& Wansing, "Truth Values", quote checked against the live page by the prior
firing) rather than re-fetching, since all three continue the same §3.8
discussion the quote is drawn from.

Every `difficulty.nd` scored by hand against §14.3 before checking: both valid
proofs hit all five triggers (`∨E`, an undictated reductio, nesting, four or
more subproofs, more than ten derived lines) but fall short of the 29-line
`extremely hard` floor (19 and 27 lines) — `hard`, confirmed by
`python3 difficulty.py --diff` printing "0 scores differ from the rubric"
after `build.py --write`. `extremely hard` (nd) count unchanged at 4 of 4.

`build.py --write` (three entries normalised — no atom renaming needed, since
this firing wrote `t_p`/`f_p` directly rather than relying on the `Tp`/`Fp`
auto-rename the previous firing used; two proof profiles recomputed from
`proofs.py` and matched what was authored), `difficulty.py --diff` (clean, 0
differ, both before and after the `interest` wording fix), `svg.py` (11 SVGs:
table and tree for all three, plus `nd` for the two valid ones), `svg.py
--check` (every SVG current), `inventory.py --locks` (0 practicable methods
locked — none of the three carries a `problem_set`; comprehensive is not a
practice lock at all per §11d), `manifest.py --check-merge` (160 entries, 157
expected from the merge parents, nothing lost), and `node --test
"_tests/*.test.mjs"` (513/513) all clean. Comprehensive queue: 58 candidates
left of 274 (102 now in the database, 3 quarantined, 82 unreadable, 29
settled). Course and imports queues remain at 0.

**The sandbox again had no LaTeX toolchain in this fresh container**;
`apt-get install --fix-missing` of the same package list every prior firing
has recorded resolved it after the same two unrelated 404s
(`libegl-mesa0`, `ruby3.2`) on the first attempt. The `session-start-hook`
suggestion from every prior firing's note is still open.

**2026-09-01, `comprehensive`-source firing: the last row of the six-row
exercise, plus a pair from §4.1's intuitionistic contrast set.** Course and
imports queues both confirmed empty again (`inventory.py --status`,
`--status --source imports`). `inventory.py --next 3 --source comprehensive`
gave `∼(∼Tp&∼Fp), ∼(Tp&Fp) ⊢ Tp≡∼Fp` — the one row of §3.8's own table the
previous two comprehensive firings left queued — followed by two rows of
§4.1's list of classical theorems that fail under IPC.

`gaps-and-gluts-give-bivalence` (**valid**) is that last row: taking both
`bivalence-schema`'s and `no-gluts`'s failures as denials — no gap, no glut —
is enough to derive the full biconditional `t_p≡∼f_p` rather than the bare
disjunction `bivalence-schema` alone reaches for. Each half of the 14-line
proof is a single reductio against the matching premise (assume `t_p`, refute
`f_p` against no-glut; assume `∼f_p`, refute `∼t_p` against no-gap) — no case
split needed, unlike `bivalence-is-no-gap`'s. `looks_like:
convention-t-gives-bivalence`, the row's nearest kin (same family, different
premise pair reaching the same kind of connection). Reused
`bivalence-schema`'s already-verified SEP appearance (Shramko & Wansing,
"Truth Values") rather than re-fetching, since this row continues the same
§3.8 discussion — but re-verified the author and URL against the live entry
directly this firing rather than trusting the chain, per §11d: confirmed via
the entry's citation page (`Author and Citation Info`) that lists Yaroslav
Shramko and Heinrich Wansing, and the slug is `truth-values`.

`de-morgan-conjunction-hard-theorem` (CLI-405, `⊢ ∼(p&q) ⊃ (∼p∨∼q)`,
**valid**) and `conditional-implies-disjunction` (CLI-406, `⊢ (p⊃q) ⊃
(∼p∨q)`, **valid**) both sit under §4.1, "Intuitionistic logic — the
classical theorems that fail". The row's own `sep` field lists eleven review
articles (the whole of §4's shared header), which is not a name to cite
directly — but §4.1 itself is unambiguously about intuitionistic logic, and
CLI-409's own line a few rows down is flagged "SEP verbatim" quoting the SEP
*Intuitionistic Logic* entry's line on disjunction, which settled the article
for the whole subsection rather than leaving it a guess. Fetched the entry
directly to confirm: author Joan Moschovakis, slug `logic-intuitionistic`,
and the quoted sentence — "asserts that either a proof of A, or a proof of B,
has been constructed" — verified verbatim on the live page. The entry does
not discuss either specific formula by name, so both appearances are
`type: diagnosed` (the BHK semantics it states is what diagnoses the failure)
rather than `used` or a claim of a formula-specific discussion, and `fidelity:
our reconstruction`.

Both derivations are reuses rather than new searches: `de-morgan-conjunction`
already carries `∼(p&q) ⊢ ∼p∨∼q` as one half of its biconditional
(`de-morgan-conjunction-hard`), and `material-conditional` already carries
`p⊃q ⊢ ∼p∨q` as one direction of its own — CLI-405 and CLI-406 are exactly
those two sequents with the premise taken as an assumption and discharged by
a closing `⊃I` instead. Copied the relevant lines from `proofs.py` verbatim
and added the one closing line each (17 and 16 lines respectively);
`nd.check()` passed both without edits. `looks_like` names the entry each was
copied from, and `interest` says why the classical proof (assume the negated
disjunction, extract each disjunct's negation by double-negation elimination)
is exactly the move IPC refuses under the BHK reading, rather than leaving
the SEP's verdict and `derive.py`'s classical one merely juxtaposed.

Every `difficulty.nd` scored by hand against §14.3 before checking: all three
proofs hit four of the five triggers (an undictated reductio, nesting, four
or more subproofs, more than ten derived lines — none uses `∨E`) and fall
well short of the 29-line `extremely hard` floor (14, 17 and 16 lines) —
`hard`, confirmed by `python3 difficulty.py --diff` printing "0 scores differ
from the rubric" after `build.py --write`. `extremely hard` (nd) count
unchanged at 4 of 4.

`build.py --write` (three entries normalised — no atom renaming needed, `t_p`/
`f_p`/`p`/`q` already legal; three proof profiles recomputed from `proofs.py`
and matched what was authored), `difficulty.py --diff` (clean, 0 differ),
`svg.py` (12 SVGs: table, tree and `nd` for all three, all valid), `svg.py
--check` (every SVG current), `inventory.py --locks` (0 practicable methods
locked — comprehensive carries no `problem_set` at all per §11d),
`manifest.py --check-merge` (163 entries, 160 expected from the merge
parents, nothing lost), and `node --test "_tests/*.test.mjs"` (514/514) all
clean. Comprehensive queue: 55 candidates left of 274 (105 now in the
database, 3 quarantined, 82 unreadable, 29 settled). Course and imports
queues remain at 0.

**The sandbox again had no LaTeX toolchain in this fresh container**; the
same `apt-get update` then `apt-get install` of the package list every prior
firing has recorded (`texlive-latex-base texlive-latex-recommended
texlive-latex-extra texlive-pictures texlive-binaries dvisvgm
texlive-humanities texlive-science texlive-fonts-recommended`) resolved it
cleanly this time, no `--fix-missing` retry needed. The `session-start-hook`
suggestion from every prior firing's note is still open.

## 2026-08-31 (continued) — two theorem-closures from §4.1 and §4.4

Course and imports queues both re-confirmed empty. Comprehensive's next
three rows (`inventory.py --next 3`) were CLI-410, CLI-411 and CLI-412, all
§4.1; only CLI-411 went in cleanly. CLI-410 is logged above (no philosopher
named, and the SEP *Intuitionistic Logic* entry does not discuss this
specific negated-conditional form on a direct check). CLI-412 (Harrop's
rule) is also logged above, for a different reason: the SEP entry names it
exactly, but the honest derivation runs 34 lines against all five §14.3
triggers, which would be a fifth `extremely hard` `nd` entry against the
test suite's cap of four — restructured once before giving up on it this
firing, no shorter route found. Took `--next 4` to reach CLI-413 in its
place; also logged, same reason as CLI-410 (no philosopher named, and the
SEP article's admissible-rules section covers only the negated-antecedent
Harrop and Mints rules, not this unnegated one).

`contraposition-recovered-theorem` (CLI-411, `⊢ (∼q⊃∼p) ⊃ (p⊃q)`, valid) is
`contraposition-recovered`'s own premise (`∼q⊃∼p`, already cited to Greg
Restall's *Logic*, Ch 7) discharged by a closing `⊃I` instead of taken as
given — the same move `de-morgan-conjunction-hard-theorem` and
`conditional-implies-disjunction` made two firings ago, but off a
Restall-sourced sibling rather than an SEP-sourced one, so the appearance
carries Restall forward (`type: diagnosed`, since the closed theorem is not
literally the passage he worked) rather than reaching for the SEP
*Intuitionistic Logic* entry, which was checked directly and does not
mention contraposition at all — forcing that citation would have been
exactly the mistake §11d warns against. The row's own note ("equivalent to
DNE over IPC") is stated in `interest` rather than claimed as a citation.
Proof: `contraposition-recovered`'s own eight lines, one level deeper (the
premise becomes an assumption), plus one closing `⊃I` — nine lines, checked
against `nd.check()` before being written into `proofs.py`. Two triggers
(an undictated reductio, one subproof inside another), matching the sibling
entry's own `medium` exactly; `difficulty.py --diff` agreed.

`hypothetical-syllogism-theorem` (CLI-436, `⊢ ((p⊃q)&(q⊃r)) ⊃ (p⊃r)`,
valid, from §4.4 "Relevance and substructural" once §4.1 was exhausted of
importable rows) is `hypothetical-syllogism`'s own two premises conjoined
into one antecedent and discharged the same way. A fresh SEP citation
rather than a reused course one, since this row is genuinely
SEP-sourced: Edwin Mares's *Relevance Logic* entry (§6, "Systems Closely
Related to Mainstream Relevance Logic") names Graham Priest's system N₄ as
a relevant logic that keeps this as an admissible *rule* while refusing it
as a *theorem* — "It does not contain any transitivity axioms for
implication. It has a transitivity rule." — confirmed verbatim on a direct
fetch before writing it down, matching the row's own "fails in Priest's
N₄" note exactly. `interest` states plainly that `derive.py`'s classical
verdict and Mares's report of N₄'s are not in tension, per §11d. Proof: the
two premises' own `⊃E, ⊃E, ⊃I` chain, unchanged, behind `ConjE` twice and
one further `⊃I` — eight lines, no reductio anywhere. One trigger (a
subproof inside another, the same shape `permutation`'s own proof has),
`medium`, matching `permutation`'s precedent and confirmed by
`difficulty.py --diff`.

Checked both against the database for near-duplicates before writing (by
id and by content) — none found beyond the two siblings each is a
closure of, which `looks_like` already names. `git diff --name-only
origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md` confirmed
empty; neither appearance is a course appearance, so neither needed it.

`build.py --write` (two entries normalised, no atom renaming needed;
`difficulty.py --diff` clean, 0 differ — both hand-scored `nd` values
matched the rubric without an override), `svg.py` (8 SVGs, 4 blocks × 2
entries), `svg.py --check` (every SVG current), `inventory.py --locks` (0
practicable methods locked — comprehensive carries no `problem_set`),
`manifest.py --check-merge` (168 entries, 166 expected from the merge
parents, nothing lost), and `node --test "_tests/*.test.mjs"` (514/514) all
clean. `extremely hard` (nd) count unchanged at 4 of 4 — neither new entry
came near it. Comprehensive queue: 47 candidates left of 274 (110 now in
the database, 3 quarantined, 82 unreadable, 32 settled). Course and
imports queues remain at 0.

**The sandbox again had no LaTeX toolchain in this fresh container**; the
same `apt-get update` then `apt-get install` of the package list every
prior firing has recorded (`texlive-latex-base texlive-latex-recommended
texlive-latex-extra texlive-pictures texlive-binaries dvisvgm
texlive-humanities texlive-science texlive-fonts-recommended`) resolved it
cleanly. The `session-start-hook` suggestion from every prior firing's note
is still open.

## 2026-08-31 (continued) — the ∨E axiom, Suffixing, and Nelson's antilogism from §4.4

Course and imports queues re-confirmed empty (`inventory.py --status` for
both). `inventory.py --next 3 --source comprehensive` gave three rows in a
row from §4's shared, eleven-article `sep` line: "Ł's axiom" (§4.2), and
CLI-433 and CLI-434 (§4.4, "Relevance and substructural"). The first did not
go in cleanly and is logged above; the other two did, plus a fourth pulled
past it (`inventory.py --next 6`) once it was clear §4.4's citations, unlike
§4.2's, resolve to a specific page rather than the section-wide list.

**CLI-433 and CLI-434** (`⊢ ((p∨q)⊃r) ≡ ((p⊃r)&(q⊃r))`, `⊢ (p⊃q) ⊃
((q⊃r)⊃(p⊃r))`) name "R and E" and "R, E, NR" respectively, without pointing
at a page. Edwin Mares's *Relevance Logic* SEP entry itself defers R's
axiomatisation to a supplement rather than stating it in the main text
("For an axiomatisation of R, see *Logic R*"), so that supplement —
`logic-relevance/logicr.html` — was fetched directly instead of guessing that
the main entry covers it. It lists eleven numbered axioms; axiom 8 is
`((A ∨ B) → C) ↔ ((A → C) ∧ (B → C))` (∨-elimination, CLI-433's schema exactly)
and axiom 2 is `(A → B) → ((B → C) → (A → C))` (suffixing, CLI-434's schema
exactly), confirmed by three independent fetches before either quote was
written down. Imported as `disjunction-elimination-axiom` and `suffixing`.
Both appearances cite Mares (`type: used`, `fidelity: verbatim`, the quote
in the supplement's own `→`/`↔` notation) rather than Anderson and Belnap
directly, since Mares's page is what was actually read; `interest` names
Anderson and Belnap as R and E's authors and states plainly that the
supplement's `→` is intensional, not the material `⊃` graphed here — on
these two schemas specifically there is nothing to report by way of
divergence, since both are asserted as axioms of R itself, unlike
`hypothetical-syllogism-theorem`'s own transitivity theorem two doors down,
which Priest's N₄ keeps as a rule while refusing as an axiom. The `url` field
had to point at the main entry rather than the supplement —
`_tests/argument-forms.test.mjs`'s canonical-SEP-link check only accepts
`plato.stanford.edu/entries/<slug>/`, caught on the first test run and fixed
before this was written down; the supplement page is named in `locus`
instead, which is where a reader who wants the exact axiom list should look.

`suffixing`'s content is `hypothetical-syllogism-theorem`'s own conclusion
uncurried — the conjoined antecedent `(p⊃q)&(q⊃r)` traded for two nested
conditionals — so `looks_like` names it and `interest` says so; checked
against the database by content, not just by id, before writing either new
entry, per §6.

**CLI-438** (`⊢ ((p&q)⊃r) ⊃ ((p&∼r)⊃∼q)`, "E. Nelson's NL axiom 1.7 (1930)
— antilogism") named a philosopher directly rather than a system to look up,
so no SEP page was in play at all. Confirmed by search rather than SEP: E. J.
Nelson's "Intensional Relations," *Mind* 39(156), Oct. 1930, pp. 440–453,
postulates the Principle of the Antilogism as an axiom of his system NL. No
verbatim quote of Nelson's own 1930 text was available to fetch and check —
the paper is paywalled and only a secondary paraphrase turned up, garbled
enough (`Nelr` for `r`) that it was not trustworthy to quote — so the
appearance carries no `quote` field and `fidelity: our reconstruction` rather
than `verbatim`, per §13.4's own rule against rewording a source to make it
fit. `interest` notes that Nelson's `→` is intensional and NL is a genuinely
early source for connexive logic, and that Mares and Francesco Paoli's
reconstruction of NL still lacks a complete semantics — without claiming any
divergence between Nelson's verdict and the classical one on this specific
schema, since nothing found states one. Imported as `antilogism`.

All three proofs (21, 8, and 11 lines respectively) were checked with
`nd.check()` before being written into `proofs.py`: `disjunction-elimination-
axiom` builds each conditional by a separate `⊃I` and joins them with `∧I`
one way, then a genuine `∨E` inside a fresh assumption the other way, closed
by `≡I`; `suffixing` is three nested `⊃I`s and nothing else, no `∧E` needed
since there is no conjunction to take apart; `antilogism` is a reductio
dictated by the goal (`∼I` on a negation goal), with the `⊥I`'s contradictory
pair (`r`, `∼r`) not involving the subproof's own assumption (`q`), so no
reiteration was required. `difficulty.py --diff` came back clean on all three
hand-scored `nd` values (`hard`, `medium`, `medium`) without an override.
`extremely hard` (nd) count unchanged at 4 of 4.

`build.py --write` (three entries normalised, no atom renaming needed),
`svg.py` (12 SVGs, 4 blocks × 3 entries), `inventory.py --locks` (0
practicable methods locked — comprehensive carries no `problem_set`),
`manifest.py --check-merge` (171 entries, 168 expected from the merge
parents, nothing lost), and `node --test "_tests/*.test.mjs"` (514/514, after
fixing the SEP-URL test failure above) all clean. `git diff --name-only
origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md` confirmed
empty; none of the three appearances is a course appearance. Comprehensive
queue: 44 candidates left of 274 (113 now in the database, 3 quarantined, 82
unreadable, 33 settled). Course and imports queues remain at 0.

**The sandbox again had no LaTeX toolchain in this fresh container**; the
same package list every prior firing has recorded (`texlive-latex-base
texlive-latex-recommended texlive-latex-extra texlive-pictures
texlive-binaries dvisvgm texlive-humanities texlive-science
texlive-fonts-recommended`) via `apt-get` resolved it cleanly. The
`session-start-hook` suggestion from every prior firing's note is still open.

## 2026-08-31 (continued) — Prefixing's S axiom, Routley's rejected Simplification, and the sea-battle dilemma

Course and imports queues re-confirmed empty (`inventory.py --status` for
both). `inventory.py --next 3 --source comprehensive` gave CLI-435 (§4.4,
"Prefixing"), CLI-440 (§4.4, "Conjunctive simplification"), and an
un-numbered row from §4.5's "Historical forms worth having" table (the
fatalist's sea-battle argument). All three went in.

**CLI-435** (`⊢ (q⊃r) ⊃ ((p⊃q)⊃(p⊃r))`, "Prefixing — axiom 1 of
Meyer–Martin **S**") collided on id with an entry already in the database:
`prefixing` is Restall's Ex 3.4.11 (`p⊃q ⊢ (r⊃p)⊃(r⊃q)`), a different
formula that happens to carry the same name. Edwin Mares's *Relevance Logic*
SEP entry was fetched to check the attribution and does discuss Meyer and
Martin's system S directly — "One extremely weak system is the logic **S**
of Robert Meyer and Errol Martin. As Martin has proven, this logic contains
no theorems of the form `A → A`" — but neither the main entry nor its `Logic
R` supplement (`logicr.html`, fetched directly, eleven numbered axioms, none
named Prefixing) names "Prefixing" or numbers S's own axioms. §11d's rule for
an article that does not clearly cover the row is to name the champion the
row itself names rather than guess a slug or misattribute to Mares, so the
appearance cites Meyer and Martin directly (`fidelity: our reconstruction`,
`url: null`, no `quote`) rather than SEP. Imported as `prefixing-axiom` (the
existing `prefixing` id was not available), with `looks_like: suffixing` (its
true curried sibling, differing only in premise order — swap which
conditional discharges first and the proof mirrors `suffixing`'s exactly) and
both `interest` and `course.note` flag the name collision with the existing
`prefixing` entry explicitly, so a reader who searches by title and finds two
is told why.

**CLI-440** (`⊢ (p&q) ⊃ p`, "Conjunctive simplification — rejected by
Routley for connexive logic") was checked against Heinrich Wansing's SEP
entry *Connexive Logic* directly (fetched and grepped as raw text, not
summarised, since a verbatim SEP quote has nothing else to check it against):
"for Routley (Routley et al. 1982, p. 82) connexivism has two leading theses,
namely: 1. Simplification (A ∧ B → A, A ∧ B → B) fails to hold, and its use
... is what is responsible for the paradoxes of implication ..." confirmed
verbatim in §3.1 of the rendered page. Imported as
`conjunctive-simplification-connexive` (`type: diagnosed`, `fidelity:
verbatim`, `who: Heinrich Wansing`, quoting the passage above; `locus` names
the supplement page and Routley's own citation since that is who Wansing is
quoting). Classically the schema is untouched — one line of `∧E` — and
`interest` says so plainly rather than implying any classical divergence.

**The sea-battle row** (`s∨∼s, s⊃n, ∼s⊃m ⊢ n∨m`, **VALID**, "the fatalist's
argument is valid — it is constructive dilemma... the whole content of *De
Int.* 9") carries no CLI number and sits outside §4's shared eleven-article
`sep` line, which does not include *Future Contingents* or anything else
plainly about Aristotle's sea battle. Per §11d, the unclear case names the
philosopher the row itself names: imported as `sea-battle-dilemma` with the
appearance citing Aristotle's *De Interpretatione* ch. 9 directly
(`fidelity: our reconstruction`, `url: null`, `type: diagnosed` — Aristotle
is diagnosing where the fault must lie in an argument he treats as valid, not
endorsing fatalism). `looks_like: constructive-dilemma`, since the row is
exactly that pattern with the disjunction premise instantiated to `s∨∼s`;
`derive.py`'s own `premise_analysis` confirms that premise is idle (it never
rules out a table row, being a tautology already), which `interest` reports
as the structural point rather than a defect.

All three proofs (8, 3, and 10 lines) were checked with `nd.check()` before
being written into `proofs.py`: `prefixing-axiom` mirrors `suffixing`'s three
nested `⊃I`s with the two assumptions swapped; `conjunctive-simplification-
connexive` is a single `∧E` behind one `⊃I`, nothing else available to go
wrong; `sea-battle-dilemma` is `constructive-dilemma`'s own shape with the
disjunction premise renamed, `∨E` firing on the (idle but still cited)
first premise. `difficulty.py --diff` came back clean on all three hand-scored
`nd` values (`medium`, `easy`, `medium`) without an override.

`build.py --write` (three entries normalised, no atom renaming needed),
`svg.py` (12 SVGs), `inventory.py --locks` (0 practicable methods locked),
`manifest.py --check-merge` (174 entries, 171 expected from the merge
parents, nothing lost, checked both before resolving anything — there was
nothing to resolve, `git merge origin/main` reported already up to date —
and again after committing), and `node --test "_tests/*.test.mjs"`
(514/514) all clean. `git diff --name-only origin/main...HEAD --
EncyclopediaOfArguments/SOURCE_QUOTES.md` confirmed empty; none of the three
appearances is a course appearance, so nothing was ever at stake there.
Comprehensive queue: 40 candidates left of 274 (116 now in the database, 3
quarantined, 82 unreadable, 33 settled). Course and imports queues remain at
0.

**The sandbox again had no LaTeX toolchain in this fresh container**; the
same package list every prior firing has recorded (`texlive-latex-base
texlive-latex-recommended texlive-latex-extra texlive-pictures
texlive-humanities texlive-science dvisvgm`, texlive-fonts-recommended
pulled in as a dependency) via `apt-get` resolved it cleanly. The
`session-start-hook` suggestion from every prior firing's note is still open.

## 2026-09-01 — Diodorus's Master Argument, the preface paradox, deontic exhaustion

Course and imports queues re-confirmed empty (`inventory.py --status` for
both). `inventory.py --next 3 --source comprehensive` gave the un-numbered
row from §4.5 ("Diodorus's Master Argument"), an un-numbered row from §4.6
(the preface paradox at four atoms), and a third §4.6 row (`p, q, r, s ⊢
p&q&r&s`, "Same, by conjunction rather than chaining"). All three of §4.6's
rows were previewed with `--next 6` before committing to which to import,
since the section carries no `sep` line and two of its four candidates
turned out to have nothing in the row's own text to attribute to a person —
see below.

**The Diodorus row** (`c⊃t, t⊃n, n⊃(p∨h), c, ∼p, ∼h ⊢ ⊥`, **VALID**
(unsatisfiable), §4.5) sits under the same shared, unhelpful eleven-article
`sep` line that `sea-battle-dilemma` already worked around two firings ago —
confirmed by reading §4.5's header directly, no `*SEP:*` line of its own.
Per §11d, named the philosophers the row itself names: Diodorus Cronus (who
used the argument, per Epictetus and Cicero's secondhand reports) and Arthur
Prior (who made reconstructing it propositionally a running project across
his tense-logic work — *Diodoran Modalities*, 1955, checked as a real,
findable paper rather than asserted from memory of the general connection).
Both appearances cite the philosophers' own work directly rather than an SEP
article, `fidelity: our reconstruction`, `url: null`. Imported as
`diodorus-master-argument`. The row's own caution — `n⊃(p∨h)` is a
reconstruction of a modal rule, not a translation — is carried into both
`interest` and `course.note`, since the tree closing here shows Prior's
propositional rendering is inconsistent, not that Diodorus's original modal
argument is classically valid. No English gloss: the five-letter
reconstruction (`c, t, n, p, h`) is not one this firing could confidently
assign real-world referents to without inventing content the source does not
supply, so `english` is left empty per the rule for a bare schema with
nothing honest to gloss.

**The preface paradox** (`{p,q,r,s,∼(p&q&r&s)}`, **VALID** (unsatisfiable),
§4.6) also sits under a section with no `sep` line at all. The paradox has a
real, checkable origin, so this one got the same treatment via a direct
source lookup rather than the champion-of-last-resort route: D. C. Makinson,
*The Paradox of the Preface* (Analysis 25(6), 1965) — confirmed by fetching
SEP's own *Epistemic Paradoxes* entry (Sorensen), which credits Makinson by
name with extracting the paradox from a real apology in Raymond Wilder's
1952 preface and quotes the 1965 page number directly. That SEP entry is not
itself cited as the appearance, since nothing ties this specific §4.6 row to
it having been the sweep's actual source (the section's `sep` field is
empty, and the caution two rows later in the same file — "the preface
paradox and Makinson: zero hits" — is about the *games/dialogical* SEP
entries specifically, not a statement that this row came from nowhere);
Makinson's own paper is the safer, independently-verified citation. Imported
as `preface-paradox`, with an English gloss this time (`faithful: true`),
since the paradox's content, unlike Diodorus's five opaque letters, is
exactly what the SEP passage independently confirms. `course.note` flags
the companion lottery-paradox row in §5.4 of the same file (same structure,
three atoms instead of four) for a later firing.

**`p, q, r, s ⊢ p&q&r&s`** ("Same, by conjunction rather than chaining") and
the two other §4.6 rows previewed alongside it (`p∨q, p⊃q ⊢ q`; the
probability/truth compositional-replacement tautology) were left out this
firing. None names a philosopher in its own text or in the surrounding
prose — they illustrate a general point about probabilistic semantics
(Adams's framework, named only later in the section's own caution
paragraph, not beside any of these three rows specifically) rather than an
argument anyone is credited with making. Checked whether the section's
boilerplate `sep` field (which lists eleven broad articles identically
across every §4.5/§4.6 row, clearly a default rather than a detected match)
could stand in for one of them: fetched SEP's *Conditionals* — the one
plausible candidate, since Adams's probabilistic semantics for conditionals
is its subject — directly, and it does not contain the P(q) = P(p∨q) +
P(p⊃q) − 1 identity or the compositional-replacement-fails-for-probability
argument these rows state. Rather than guess a different one of the eleven
or invent a champion, all three are logged in the skip table below for a
person who can find the actual source.

Proofs for both valid entries checked with `nd.check()` before being written
into `proofs.py`. `diodorus-master-argument` chains the six premises down to
`p∨h` by `⊃E`, then closes both disjuncts against `∼p` and `∼h` by `∨E`;
each case's contradiction is the case's own assumption, so both required the
reiteration §6.4 forces before citing it in `⊥I` (16 lines, one trigger —
proof by cases — `medium`). `preface-paradox` is nothing but `∧I` four times
into a single `⊥I` (9 lines, no triggers, `easy`). `difficulty.py --diff`
came back clean on both hand-scored values without an override.

Also took `deontic-exhaustion` (`⊢ a∨(∼a&∼b)∨b`, **TAUT**, §4.7's "The rest,
verified" table, "Deontic exhaustion"), since this section, unlike its two
neighbours, does carry a clean `*SEP:*` line naming McNamara and Van De
Putte — fetched their *Deontic Logic* SEP entry directly and confirmed the
principle under §1.2's "Traditional Threefold Classification" (labelled
`OB`-Exhaustion in the rendered text) rather than trust the row's own gloss,
and confirmed the current byline via the entry's own citation info rather
than guess it from the inventory's shorthand. Quoted the article's own
sentence stating the exhaustion/exclusiveness principle in prose, checked
against the fetched page rather than composed. `interest` and `course.note`
both note what makes this entry unusual in its own neighbourhood: the
section's other principles (inheritance, aggregation, K-distribution) need
explicit bridge premises to become propositionally visible at all, but
exhaustion needs none, since "exhaustive and mutually exclusive" is already
truth-functional before any normative operator is attached.

Its proof needed a genuinely nested reductio -- no premises to chain from,
so the whole thing opens by assuming the negation of the target, splits on
`a` (each case's contradiction closing against the outer `∼D`, reiterated
where required exactly as in `diodorus-master-argument`), recombines `∼a`
and `∼b` into the middle disjunct, and takes double-negation elimination to
finish. 17 lines, three triggers (an undictated reductio, a subproof nested
inside another, seventeen derived lines past the ten-line mark) — `hard`,
and `difficulty.py --diff` agreed without an override.

Checked before writing: `interest`'s claim that the preface paradox's tree
"closes on all sixteen rows" was wrong on a first draft — conflating the
16-row table (all sixteen falsify the premise set) with the tree, which
actually closes in four branches via the nested `∼&` decomposition of the
negated four-way conjunction — caught by checking the claim against
`derive()`'s own output per this file's standing caution about superlatives
and countermodel claims, and corrected before the entry was built. A second
phrase in the same field ("differ only in provenance, as the source... puts
it") echoed the source file's own wording too closely without being in the
`quote` field; reworded to a plain statement of the structural relationship
instead.

`build.py --write` (three entries normalised: `p&q&r&s` reparenthesised
left-associatively as `((p&q)&r)&s`, and `a|(∼a&∼b)|b` as
`(a|(∼a&∼b))|b`, both idempotent normalisations rather than anything
authored by hand), `python3 difficulty.py --diff` (clean, 0 differ),
`svg.py` (12 SVGs, 4 blocks × 3 entries — a fresh container needed the
LaTeX toolchain reinstalled first, see below), `inventory.py --locks` (0
practicable methods locked — comprehensive carries no `problem_set`),
`manifest.py --check-merge` (177 entries, 174 expected from the merge
parents, nothing lost, checked before and after — `git merge origin/main`
reported already up to date, nothing to resolve), and `node --test
"_tests/*.test.mjs"` found two hardcoded contradiction-entry counts that
needed bumping from seven to nine (both entries added this firing conclude
`⊥`) — updated, then 514/514 clean. `git diff --name-only
origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md` confirmed
empty; none of the three appearances is a course appearance. `extremely
hard` (nd) count unchanged at 4 of 4. Comprehensive queue: 37 candidates
left of 274 (119 now in the database, 3 quarantined, 82 unreadable, 36
settled — three §4.6 rows newly logged above). Course and imports queues
remain at 0.

**The sandbox again had no LaTeX toolchain in this fresh container**; the
same package list every prior firing has recorded (`texlive-latex-base
texlive-latex-extra texlive-pictures dvisvgm`, then `texlive-humanities
texlive-science` once `qtree.sty`/`fitch.sty` and `stmaryrd.sty` turned out
not to be pulled in by the first set) via `apt-get` resolved it cleanly. The
`session-start-hook` suggestion from every prior firing's note is still
open — this is the ninth or tenth firing in a row to need the same install.

## 2026-09-01 — three from the comprehensive sweep: a deontic refutation and two Curry siblings

Course and imports queues were both at 0 (checked with `--status` on each
before touching the comprehensive one), so all three candidates came from
`--source comprehensive --next 3`.

`deontic-no-gaps` (`∼a & ∼(∼a&∼b) & ∼b ⊢ ⊥`, §4.7 "The rest, verified").
Content-wise this is `deontic-exhaustion`'s exact contrapositive — a formula
is a tautology exactly when its negation is unsatisfiable — so it was
weighed as a possible near-duplicate skip before writing (§6). Went ahead
and imported it anyway, `looks_like: deontic-exhaustion`, because the
refutation form is not decorative: it is the shape von Wright's (1968)
objection to SDL actually takes, and the section's `sep` line (McNamara and
Van De Putte) is unambiguous. Fetched `logic-deontic` directly rather than
trust the row's one-line note, and it locates the discussion precisely —
§5.3 ("Other Modalities"), not §1.2 where `deontic-exhaustion` sits — and
names von Wright by name for the objection: "There is no place for this
fourth category in SDL... (von Wright 1968)." `appearances[0].fidelity`
is "our reconstruction" rather than "verbatim" since no sentence of the
article states this exact refutation; the surrounding exhaustion-thesis
quote is close enough to the LaTeX-laden original that it was left out of
`quote` rather than transcribed loosely. Concludes `⊥`, so per §6.6 the
table carries no falsum column and the tree roots at the premise alone —
`build.py` enforces both. Trivial derivation: unpack the two conjunctions,
rebuild `∼a & ∼b`, and it lands directly on the negated conjunct already in
hand — 7 lines, no case split, `nd: easy`.

`curry-conditional` (`⊢ (p≡(p⊃q)) ⊃ q`, CLI-502) and `curry-is-conjunction`
(`⊢ (p≡(p⊃q)) ≡ (p&q)`, CLI-503), both from §5.1 ("Curry's paradox — the
strongest single candidate in the sweep"), the same section `curry-sequent`
came from. Checked both against the database for near-duplication first:
`curry-conditional` is `curry-sequent`'s premise discharged by the
deduction theorem into a closed conditional — same content, different
turnstile shape — and was imported rather than skipped because it makes a
clean point §14.4 half-states and this pair demonstrates directly: pushing
the biconditional from premise to assumption adds one scope level and
nothing else, and that alone trips the "subproof inside a subproof"
trigger and moves `nd` from easy to medium, though no new reasoning
appears anywhere in the proof (which is literally `curry-sequent`'s seven
lines, unchanged, run one level deeper, plus a wrapping `⊃I`). Checked with
`nd.check()` directly before writing: 8 lines, `nd: medium`, matches
`difficulty.py`'s own suggestion exactly. `curry-is-conjunction` states the
"classical surprise" the section's own prose makes explicit — the Curry
biconditional is truth-functionally `p & q`, true on the identical single
row of four — proved as a theorem rather than read off a table; verified by
hand against the four-row table before writing anything (`p=T,q=T` is the
only row where both `p≡(p⊃q)` and `p&q` come out true, confirmed one
assignment at a time). Its derivation needs both directions of a `≡I`, each
one needing its own nested `⊃I` to produce `p⊃q` as a formula rather than
just `q` — 19 lines, three triggers (nested subproof, six subproofs,
19 derived lines), `nd: hard`, well short of `extremely hard`'s 29-line
floor. `appearances` for both cite Shapiro & Beall's SEP *Curry's Paradox*
(already the verified attribution `curry-sequent` uses — the same mistake
the style guide itself warns against, crediting Haskell Curry, was not
repeated), `fidelity: "our reconstruction"` since neither the conditionalised
form nor the classical-content observation is a sentence SEP states, only
the sequent both are built from.

Caught one authoring slip before committing, on the read-back §7a asks for:
`deontic-no-gaps`'s `interest` and `course.note` both had "SS5.3" where "§
5.3" was meant (a section-symbol substitution that slipped through while
drafting) — fixed and rebuilt; `svg.py` correctly reported nothing to
recompile, since prose does not touch any LaTeX-bearing field.

`build.py --write` (three entries normalised: none needed
reparenthesising — all three were already written in the left-associative,
fully-parenthesised form the earlier `deontic-exhaustion`/`curry-sequent`
firings established), `python3 difficulty.py --diff` (clean, 0 differ —
every authored `nd` score matched the rubric's own suggestion exactly, no
override needed anywhere), `svg.py` (12 SVGs, 4 blocks × 3 entries — a
fresh container again needed the LaTeX toolchain installed, see below),
`inventory.py --locks` (0 practicable methods locked — comprehensive
carries no `problem_set`), `manifest.py --check-merge` (180 entries, 177
expected from the merge parents, nothing lost — `git merge origin/main`
reported already up to date, nothing to resolve, so nothing needed the
"copy this branch's database over and let the build reapply main's
changes" recovery). `node --test "_tests/*.test.mjs"` found two more
hardcoded contradiction-entry counts, this time needing nine bumped to ten
(`deontic-no-gaps` is the tenth entry concluding `⊥`) — updated, then
514/514 clean. `git diff --name-only origin/main...HEAD --
EncyclopediaOfArguments/SOURCE_QUOTES.md` confirmed empty; none of the
three appearances is a course appearance, so none needed it. `extremely
hard` (nd) count unchanged at 4 of 4. Comprehensive queue: 31 candidates
left of 274 (122 now in the database, 3 quarantined, 82 unreadable, 36
settled). Course and imports queues remain at 0.

**The sandbox again had no LaTeX toolchain in this fresh container**; the
same package list recorded by essentially every prior firing
(`texlive-latex-base texlive-latex-extra texlive-pictures dvisvgm
texlive-humanities texlive-science`) resolved it in one `apt-get install`
this time, no second round needed. The `session-start-hook` suggestion is
still open.

## 2026-09-01 (continued) — Max-and-Agnes, and a conditional-perfection pair from §5.3

Three from the comprehensive sweep. Course and imports queues remain at 0
(checked again this firing); comprehensive had 25 candidates, opening with
`--next 3` on §5.2's Liar family.

`max-and-agnes-liar-cycle` (`{t≡l, l≡∼t}`, CLI-512) is SEP's own two-person
Liar cycle, fetched directly (*Liar Paradox*, §1.3 "Liar cycles") rather
than trusted from the row's one-line gloss: "Consider a very concise (viz.,
one-sentence-each) dialog between siblings Max and Agnes. Max: Agnes'
claim is true. Agnes: Max's claim is not true." — checked verbatim against
the live page and used as `appearances[0].quote`, `fidelity: "our
reconstruction"` since the two biconditionals are our formalisation, not a
symbolic form SEP writes out. `who` needed the same care the style guide
warns is easy to get wrong on this file: the archived citation info page
gives the *Liar Paradox* entry's byline as Beall, Glanzberg, Ripley and
Rossi (four authors, Fall 2026), not Curry's or any single name a row's
"SEP's Max-and-Agnes liar cycle" gloss might suggest. Proof is the
one-atom `biconditional-with-its-own-negation` trick spread across two
biconditionals: assume `t`, cross both to reach `∼t`, close, then re-cross
both from `∼t` alone (no fresh assumption) back to `t` for the final
`FalsumI` — 11 lines against the one-atom proof's 8, `nd: easy` either way
since assuming a bare atom toward a `⊥` goal is not the "assuming the
negation of something" §14.3 trigger 2 names (matches
`biconditional-with-its-own-negation`'s own `easy` score, and
`difficulty.py --diff` agreed).

**CLI-513 (`{p≡∼q, q≡∼p}`, "even-length cycle", SAT) and CLI-514
(`{a≡∼b, b≡∼c, c≡∼a}`, "odd-length cycle", UNSAT) were skipped, not
imported.** §5.2's prose calls these three rows "the parity result" as a
set, but only CLI-512 is SEP's own example — CLI-513/514 generalise it to
illustrate the parity (negation-count sat/unsat) pattern, and that
generalisation is the comprehensive inventory's own observation, not a
claim `liar-paradox`, fetched and checked directly for exactly this,
states or that any philosopher named in either row makes. `sep` on all
three rows is the same twelve-article list covering the whole of §5,
too broad to pin a specific one to either. `appearances_pending` is not
the fallback here — §13.1 marks it an exception specific to the imports
inventory's §3, and the routine has held that line before (CLI-106).
Logged in the table above with a worked-through derivation of a general
proof for CLI-514 attempted first (11 lines were not enough; a full
double-reductio through a nested sub-subproof came to 24 and checked
against `nd.check()` before the provenance question closed it off anyway
— kept nowhere, since the entry was never going to be written, but noted
here so a future firing that finds a source does not have to redo the
derivation from scratch: assume `a`, nested-assume `c` to pull `∼a` from
premise 3 and close against the reiterated outer `a`, discharge to `∼c` at
depth 1, cross premise 2 to `b`, close against `∼b` for `∼a` at depth 0;
mirror with `∼a` assumed outermost and `b` nested, discharge to `∼~a`
i.e. `a` via `NegE`, then final `FalsumI` on the two depth-0 results).

**A logging mistake caught by re-checking the queue after writing the
skip rows, worth flagging so it is not repeated.** The comprehensive
file writes every §5 inconsistency-set row in braces —
`` `{p ≡ ∼q, q ≡ ∼p}` ``, not `` `p ≡ ∼q, q ≡ ∼p}` `` — because
`split_sequent` (`inventory.py`) reads the braces as the marker that a
bare comma list is a claim of *inconsistency* (`⊢ ⊥`) rather than of
"the conjunction is a tautology". The first draft of the two skip rows
above quoted the sequents unbraced; `inventory.py --status` afterwards
still showed both in the queue, because the settled-set built from the
log parsed them as a different shape (no premises, one bare formula)
than the actual candidate (two premises, `⊥`). Re-added the braces and
confirmed the queue count moved 25 → 20 (3 imported + 2 now correctly
settled) before moving on.

The remaining two entries are §5.3's conditional-perfection pair, taken
next after skipping the Liar family's unattributable half and passing over
CLI-515 (the truth-teller, `{p≡p}`) — the section's own prose flags it as
not appearing in SEP's *Liar Paradox* "as fetched (checked twice)", so it
has the identical provenance problem as CLI-513/514 and was left for the
same reason without a separate log line, since it will read as one more
instance of "no source" the next time it is reached rather than a new
question.

`conditional-perfection` (`p⊃q ⊭ ∼p⊃∼q`, CLI-525) is not an SEP form at
all: the row names Geis & Zwicky, and the style guide's own attribution
caution for this section says "conditional perfection" occurs zero times
in the SEP entries the sweep fetched, so citing SEP here would have been
exactly the mistake §11d warns against. Searched instead for the primary
source directly: Michael L. Geis and Arnold M. Zwicky, "On Invited
Inferences," *Linguistic Inquiry* 2(4), pp. 561–566 (1971) — confirmed
by two independent searches, `url: null` since no stable copy was found
to link. `fidelity: "our reconstruction"`; no `quote`, since the primary
1971 paper was not itself read, only secondary descriptions of it, and a
sentence built from those is not a passage to put in quotation marks as
theirs. `nd.note` explains the one countermodel (`p=F, q=T`) rather than
just naming it. `conditional-perfection-repaired` (`p≡q, ∼p ⊢ ∼q`,
CLI-531) is the same phenomenon read the way Geis and Zwicky say speakers
actually intend it — the conditional strengthened to the biconditional it
is heard as — which turns the first entry's invalid inference into a
one-line `≡E`; `looks_like` points back at `conditional-perfection`,
matching the style guide's own "X and X-repaired" pairing advice.
Six-line proof, single assumption, `⊃I`'s negation-goal makes the
reductio dictated rather than trigger 2, `nd: easy`, `difficulty.py
--diff` agreed.

`build.py --write` (three entries, no reparenthesising needed),
`python3 difficulty.py --diff` (clean, 0 differ), `svg.py` (11 SVGs, 4
blocks for the two valid entries and 3 for the invalid one — a fresh
container again had no LaTeX toolchain; `texlive-latex-base
texlive-latex-extra texlive-fonts-recommended dvisvgm` plus, this time,
`texlive-science` and `texlive-humanities` for `stmaryrd`/`fitch` and
`qtree` respectively, both missing from the base install this container
started with), `inventory.py --locks` (0 practicable methods locked),
`manifest.py --check-merge` (188 entries, 185 expected from the merge
parents, nothing lost — `git merge origin/main` reported already up to
date). `node --test "_tests/*.test.mjs"` found the two hardcoded
contradiction-entry counts again, eleven bumped to twelve
(`max-and-agnes-liar-cycle` is the twelfth `⊥`-conclusion entry;
`conditional-perfection`/`-repaired` both conclude ordinary formulas and
do not add to that count) — updated, then 514/514 clean. `git diff
--name-only origin/main...HEAD -- EncyclopediaOfArguments/SOURCE_QUOTES.md`
confirmed empty. `extremely hard` (nd) count unchanged at 4 of 4.
Comprehensive queue: 20 candidates left of 274 (130 now in the database,
3 quarantined, 82 unreadable, 39 settled). Course and imports queues
remain at 0.

**2026-09-01, comprehensive-source firing.** Course and imports queues both
confirmed empty (`inventory.py --status` / `--source imports`), so this
firing worked `--source comprehensive` from its top three candidates:
`{p ≡ p}` (CLI-515), `∼(p&q), ∼p ⊢ q` (CLI-524), and `h ≡ e, e ⊢ h`
(CLI-529). All three name no philosopher and, checked directly against the
SEP articles the surrounding prose leans on (*Fallacies* for CLI-524,
*Abduction* for CLI-529; *Liar Paradox* already ruled out for CLI-515 by
the inventory's own text), none of those articles discusses the specific
form. Logged as skipped in the table above rather than forced into a
citation — see those three rows for the detail — and this firing took the
next three importable rows from §5.3 instead: `slippery-slope-mt` (CLI-534,
`a⊃b, b⊃c, c⊃d, d⊃e, ∼e ⊢ ∼a`), `begging-the-question` (CLI-537, `p ⊢ p`),
and `analogy-determination-rule` (CLI-533, `p_s, q_s, p_t, (p_s⊃q_s) ≡
(p_t⊃q_t) ⊢ q_t`). All three valid, verified against `derive.py` before
writing.

`slippery-slope-mt` and `begging-the-question` cite Hans Hansen's SEP entry
*Fallacies* — fetched directly rather than trusted from the inventory's own
paraphrase, twice over: once to confirm the byline (the page's visible text
does not carry it; the citation-info endpoint,
`archinfo.cgi?entry=fallacies`, does), and once more to get each quote's
exact wording, which differs slightly from the inventory's own paraphrase
in both cases ("The weakness in this argument, the reason why it is a
fallacy, lies in the second and third causal claims" — the inventory drops
the opening clause and a comma). The same fetch confirmed what CLI-524's
own row had already warned: *Fallacies* discusses slippery slope and
begging the question by name, in a numbered list under §1 with no decimal
subheadings, but does not name "denying a conjunct," "affirming a
disjunct," or "improper transposition" at all — consistent with skipping
CLI-524 above.

`analogy-determination-rule` cites Paul Bartha's SEP entry *Analogy and
Analogical Reasoning*, §4.1 ("Deductive justification") — fetched and
confirmed it names Davies and Russell by name for exactly this repair,
verbatim: "Davies and Russell introduce a version that relies upon what
they call determination rules." Its premise analysis is the interesting
find: `p_s` (that the source case had the property) is idle — `load_bearing:
false`, `countermodels_without_it: 0` — because the premise `q_s` alone
already makes `p_s ⊃ q_s` true regardless of `p_s`, so the determination
rule's whole inferential weight falls on the target side, `p_t`. Checked
against `derive.py`'s own output before writing it into `interest`, per
this file's standing caution about claims that need checking against the
actual computed data.

`begging-the-question`'s derivation is one line — the premise itself,
since it already is the conclusion — genuinely the shortest `nd` proof in
the database (previous minimum: 2 lines, `ross-paradox` and
`double-negation-elimination`; checked against every existing entry's
`nd.lines` before writing the claim). This broke a test's assumption that
every valid entry's `nd.latex` contains at least one `\by{` citation:
`_tests/argument-forms.test.mjs`'s "citations live in the justification
column, not the formula" check now skips that assertion for a proof with
no non-premise line, since there is no rule application for a `\by` to
name. A narrow fix to a genuinely new shape, not a loosened check — the
padding/width assertions in the same test still run unconditionally.

All three difficulty scores matched `difficulty.py`'s own rubric (0
`nd` triggers each, so `easy` on all three) — `python3 difficulty.py
--diff` reported nothing to override.

`build.py --write`, `svg.py` (12 SVGs, 4 blocks × 3 entries; a fresh
container again had no LaTeX toolchain — reinstalled
`texlive-latex-base texlive-latex-recommended texlive-latex-extra
texlive-pictures texlive-binaries dvisvgm texlive-humanities
texlive-science texlive-fonts-recommended` via `apt-get`, matching every
prior firing's note), `svg.py --check`, `inventory.py --locks` (0
practicable methods locked), `manifest.py --check-merge` (191 entries, 188
expected from the merge parents, nothing lost), and `node --test
"_tests/*.test.mjs"` (514/514, after the citation-test fix above) all
clean. `git diff --name-only origin/main...HEAD --
EncyclopediaOfArguments/SOURCE_QUOTES.md` confirmed empty. `extremely hard`
(nd) count unchanged at 4 of 4. Comprehensive queue: 17 candidates left of
274 (133 now in the database, 3 quarantined, 82 unreadable, 42 settled).
Course and imports queues remain at 0.

## 2026-09-01 (continued) — the Knower detonated, and the Dutch book's is/ought pivot

Course and imports queues both confirmed empty again this firing
(`inventory.py --status` / `--source imports`), so this firing worked
`--source comprehensive` from its top three candidates: the Knower's third
row (`{l≡∼k, k⊃l, l⊃k}`, UNSAT), and DB2/DB2c from §5.10g's Dutch book
table (`V⊃⊥⊨∼V` and `V⊃L_s⊨∼V`).

`montague-knower-detonation` is the Knower's remaining propositional row —
`montague-knower-factivity` and `montague-knower-tautology` (already in the
database) carry the other two lines of Montague's proof, and this one adds
the internalization direction `l⊃k` ("we've proved it, so we know it") to
factivity's `l≡∼k, k⊃l`, collapsing the set outright: no row of four makes
all three premises true. Cites Thomas Bolander's SEP entry *Self-Reference
and Paradox*, §2.3, `fidelity: "our reconstruction"` (the three-premise
propositional rendering is ours; Bolander's article names Kaplan & Montague
1960 and gives the paradox but not this compressed form) — same citation
`montague-knower-factivity` and `montague-knower-tautology` already carry,
confirmed by re-fetching the article rather than trusted from the sibling
entries (it does discuss the Knower paradox by name, §1.3, and the
citation-info endpoint gives the byline as Bolander, not a name any row's
gloss suggested). All three premises verified load-bearing by deletion
(`derive.py`, not asserted): drop `l⊃k` and `k=F, l=T` is a model; drop
`k⊃l` and `k=T, l=F` is. Derivation is one reductio (assume `k`, the
dictated route to the `∼k` lemma) followed by a direct chain to a second
`⊥I` — no second reductio needed, 12 lines, 0 of 5 §14.3 triggers, `nd:
easy`, matching both siblings.

`dutch-book-pivot` is DB2c, the SEP sweep's own "pivot": the same
conditional as DB2 but with an ordinary atom, `l_s`, in the consequent's
place instead of falsum, and correspondingly invalid (one countermodel,
`v=T, l_s=T`, matching the sweep's own verdict). DB2 itself — literally the
same conditional with the consequent strengthened to `⊥` — could not be
entered as a separate database row and is logged as skipped above; see that
row for why. Cites Vineberg's *Dutch Book Arguments* again,
`fidelity: "our reconstruction"` and no `quote` — checked directly
(fetched the live SEP entry, asked pointedly whether it frames the
argument as a reductio-versus-modus-tollens choice) and confirmed the
framing is the comprehensive sweep's own, not a passage on the page, so no
text was invented for `SOURCE_QUOTES.md` or written into `appearances[].quote`
as if it were one.

Both `interest` fields were checked against the computed data before
writing (this file's standing caution): the deletion countermodels above,
and `dutch-book-pivot`'s one open branch, both matched `derive.py`'s
output exactly. An early draft of `montague-knower-detonation`'s `interest`
claimed the real Montague proof runs "sixteen lines" and "a parallel run of
the same seven lines, `K` prefixed throughout" for the internalization
half — sourced from a fetched summary of Bolander's article rather than
something checked line-by-line, so both numbers were cut before commit;
the phrase "`K` prefixed throughout" is kept because it is the comprehensive
inventory's own text (its §5.9 note on what `l⊃k` compresses), not
something fetched.

`python3 difficulty.py --diff` reported nothing to override (0 `nd`
triggers on `montague-knower-detonation`, `easy`; `dutch-book-pivot` is
invalid, `nd: null`). `build.py --write`, `svg.py` (7 SVGs: 4 blocks for
`montague-knower-detonation`, 3 for `dutch-book-pivot`, which carries no
`nd` block), `inventory.py --locks` (0 practicable methods locked),
`manifest.py --check-merge` (199 entries, 197 expected from the merge
parents, nothing lost — checked before touching the database and again
after), and `node --test "_tests/*.test.mjs"` all clean, after updating
two hardcoded falsum-conclusion counts the new `montague-knower-detonation`
entry pushed from thirteen to fourteen (`_tests/argument-forms.test.mjs`,
the same kind of narrow count fix this file has recorded before, not a
loosened check). `git diff --name-only origin/main...HEAD --
EncyclopediaOfArguments/SOURCE_QUOTES.md` confirmed empty. `extremely hard`
(nd) count unchanged at 4 of 4. Comprehensive queue: 5 candidates left of
274 (141 now in the database, 3 quarantined, 82 unreadable, 43 settled),
all five in §7 ("TRAPS — forms that look plausible or connexive and are
classically VALID"). Course and imports queues remain at 0.

**2026-09-01 — all three queues ran out.** The comprehensive sweep's last
five candidates (§7 TRAPS) went in across the two firings after the note
above; `inventory.py --status` now reports 0 candidates left on `course`,
`imports`, and `comprehensive` alike. Every firing from here finds the same
empty queues and, per this file's own instruction just above, does nothing
further: no commit, no push, no repeat of this line.
