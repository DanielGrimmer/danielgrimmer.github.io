# Comprehensive Logic Inventory (2026-08-28)

**Behind the scenes. Not student-facing. Nothing here is committed to any handout.**

Third of three inventories, and the only one built from outside the course:

| Inventory | Source | What it answers |
|---|---|---|
| `Argument Form Inventory (2026-08-28).md` | The course as it now stands | What have we already taught, by which method? |
| `Argument Form Inventory — Imports (2026-08-28).md` | Restall + the `Old FOL_Yale` archive | What is available from the textbook and last year? |
| **this file** | Stanford Encyclopedia of Philosophy | What *should* exist that we have never had? |

## 0. Scope, method, and the standing caution

Organized on the four-group taxonomy supplied for this sweep. Each SEP article was read in full by a dedicated agent, which returned forms in house notation `∼ & ∨ ⊃ ≡ ⊥` with a classical verdict, a name, a champion, a philosophical rationale, an atom count, and an honest flag for whether the form survives translation into our language at all.

**Every classical verdict in this file was then re-checked independently by brute-force truth table** (`scratchpad/verify/tt.py`, plus `mv3.py` for the three-valued matrices). This is not ceremony. These articles reason *inside* non-classical systems, where the article's own verdict is not ours: Boethius' Thesis is a theorem of connexive logic and a non-theorem here, and an agent reporting "valid" is reporting the article's system, not ours. Rechecking caught nothing wrong in the returns — every verdict and every countermodel matched — but the discipline is what makes the file usable, so keep it: **no form enters a problem set until its verdict has been computed here.**

Three columns carry the weight:

- **Verdict** — VALID / INVALID / TAUTOLOGY / CONTINGENT / SAT / UNSAT, with all countermodels.
- **Prop?** — `yes` (genuinely expressible in our five connectives), `skeleton` (a propositional shadow that loses the point), or `needs-X` (not expressible at all). The `skeleton` rows are the dangerous ones: they look like they belong and they teach the wrong thing unless the loss is stated out loud.
- **Size** — atoms and rows. A one-atom form is a blackboard remark, not an exercise. Three atoms with nesting is where a tree starts doing work.

---

## 1. THE VOID — complex invalid arguments that are philosophically interesting

This is the payload. Lectures 7 and 8 currently use ad-hoc invalid arguments: they are invalid, they are the right size, and they mean nothing. Every form below is invalid, is at least three atoms or genuinely nested, and has a named philosopher behind it who thought it was *valid*.

The pedagogical mechanism is the one identified in the connexive brief and it is worth stating once: **the student wants to prove it, Soundness guarantees the attempt fails, and Completeness guarantees the tree hands back the exact countermodel.** A form that is merely invalid teaches the method. A form that is invalid *and plausible* teaches why the method exists.

Ranked. Verified countermodels; row counts are total rows, not premise-true rows.

| Rank | ID | Form | CMs | Why it earns the slot |
|---|---|---|---|---|
| 1 | CLI-101 | `⊢ (((p ⊃ (q & r)) ⊃ (q & r)) ⊃ p)` | **1 of 8**: p=F, q=T, r=T | Abelian logic's characteristic axiom, instantiated. Exactly one open branch out of eight — the single best "the open branch *is* the countermodel" exercise in the whole sweep. Students will hunt and hunt. |
| 2 | CLI-102 | `⊢ ((p & q) ⊃ r) ⊃ ∼((p & q) ⊃ ∼r)` | **6 of 8**: first p=T,q=F,r=T | Boethius' Thesis instantiated. Six of eight rows falsify, so the tree opens fast — but only *after* the student has burned real time trying ND. Best value-for-effort item here. |
| 3 | CLI-103 | `h₁ ∨ h₂ ∨ h₃ ∨ h₄, ∼h₂, ∼h₃ ⊢ h₁` | **1 of 16**: all h false but h₄=T | van Fraassen's **bad lot**. Four atoms, three premise-true rows, and the countermodel *is* the objection: the best explanation among those you thought of need not be true. Pairs with the valid three-disjunct version (CLI-104) for a one-line moral. |
| 4 | CLI-105 | `(Raa ∨ Rab) & (Rba ∨ Rbb) ⊢ (Raa & Rba) ∨ (Rab & Rbb)` | **2 of 16** | The **quantifier-shift fallacy** `(∀x)(∃y)Rxy ⊬ (∃x)(∀y)Ryx` with the quantifiers eliminated over a two-element domain — Restall works this exact propositional tree in Box 9.1 (p. 102). Four atoms, hard, and it previews the second half from inside the first. |
| 5 | CLI-106 | `⊢ (p ⊃ q) ∨ (p ⊃ r)` | **1 of 8**: p=T, q=F, r=F | The near-miss to the course's own L11/PS5.6 theorem `⊢ (q⊃p) ∨ (p⊃r)`, which **is** valid. Move one letter and validity evaporates. Ideal exam distractor; the pair is a complete lesson in why form is not vibes. |
| 6 | CLI-107 | `⊢ ∼((p ⊃ (q & r)) & (∼p ⊃ (q & r)))` | 2 of 8: p=T,q=T,r=T; p=F,q=T,r=T | **Aristotle's Second Thesis** instantiated. Feels valid for a proof-by-cases reason ("you can't get q out of nothing"), and the classical fact is the exact inverse: the conjunction is equivalent to `q & r`, so it holds whenever the consequent happens to be true. |
| 7 | CLI-108 | `⊢ ∼(((p ∨ q) ⊃ r) & ((p ∨ q) ⊃ ∼r))` | 2 of 8: p=F,q=F,r=T/F | **Abelard's First Principle** instantiated. The countermodel needs the *disjunction* falsified, which students routinely fail to try. |
| 8 | CLI-109 | `p ⊃ (q ⊃ r) ⊢ ∼(p ⊃ (q ⊃ ∼r))` | 6 of 8 | Boethius nested one level. Real nesting inside a negated conditional — the hardest tree bookkeeping in the bank. |
| 9 | CLI-110 | `p ⊃ q, r ⊃ s ⊢ p ⊃ s` | 1 of 16: p=T,q=T,r=F,s=F | The **four-terms / equivocation** skeleton. Four atoms, nine premise-true rows, substantial tree. Flag the loss: the logic certifies the gap but can never *find* the equivocation. |
| 10 | CLI-111 | `(b & ∼ab) ⊃ f, b ⊢ f` | 1 of 8: b=T, ab=T, f=F | **Tweety with an abnormality clause** — McCarthy's qualification problem in three atoms. Turns "birds fly" from a joke into the reason non-monotonic logics exist. |
| 11 | CLI-112 | `p ⊃ m, s ⊃ m ⊢ s ⊃ p` | 1 of 8: p=F, m=T, s=T | **Undistributed middle**, propositional shadow. Fine tree; state the loss — atoms cannot carry distribution, so the student sees an invalidity, not a rule violation. |
| 12 | CLI-113 | `(p ∨ q) ⊃ r ⊢ ∼(p ∨ q) ⊃ ∼r` | 1 of 8: p=F,q=F,r=T | **Illicit contraposition** at tree size. The everyday fallacy, made big enough to assign. |
| 13 | CLI-114 | `p ⊃ q, (p & r) ⊃ ∼q ⊢ ∼r` | 2 of 8: p=F,q=T/F,r=T | The **Sobel-sequence** intuition ("the defeater never actually obtains"). Its twin `⊢ ∼(p & r)` from the *same* premises is **VALID** — one premise set, two conclusions, opposite verdicts. Best compare-and-contrast pair in the file. |
| 14 | CLI-115 | `p ⊃ r ⊢ (p ⊃ q) & (q ⊃ r)` | 2 of 8 | "A real implication must factor through a middle term." The relevance intuition, stated as an invalidity. |
| 15 | CLI-116 | `(p & q) ⊃ r, r ⊢ p & q` | 3 of 8 | **Affirming the consequent** at tree size — and the same shape as abduction (§5.3), so it does double duty. |
| 16 | CLI-117 | `s ∨ ∼s ⊢ nₛ ∨ n∼ₛ` | 2 of 8 | The **fatalist's leap** in the sea-battle argument: excluded middle does *not* hand you the settled disjunction. A scope error, not a logical one, and the tree says so. |

**Two notes on using these.**

The **pairing move** is worth more than any single form. A plausible invalid thesis set beside its classical near-twin is a complete argument in two lines:

| Invalid | Valid twin | The moral |
|---|---|---|
| `⊢ ∼((p⊃q) & (p⊃∼q))` (Abelard) | `p⊃q, p⊃∼q ⊢ ∼p` | Incompatible consequents give you `∼p`, not absurdity. |
| `⊢ ∼((p⊃q) & (∼p⊃q))` (Aristotle II) | `p⊃q, ∼p⊃q ⊢ q` | Aristotle says the premises are jointly absurd; we say they prove `q`. |
| `p⊃∼q ⊢ ∼(p⊃q)` | `∼(p⊃q) ⊢ p⊃∼q` | The two halves of one biconditional. Opposite verdicts. |
| `⊢ (p⊃q) ∨ (p⊃r)` | `⊢ (q⊃p) ∨ (p⊃r)` | One letter moved. |
| bad lot (4 disjuncts) | eliminative abduction (3 disjuncts) | The missing premise is always an exhaustiveness claim. |
| `p⊃q, (p&r)⊃∼q ⊢ ∼r` | `p⊃q, (p&r)⊃∼q ⊢ ∼(p&r)` | Same premises. Read the conclusion carefully. |

And **vacuous truth is the culprit in almost every connexive failure.** CLI-102, 108, 109 and the whole of §6 falsify at a point where the antecedent is false, so `p⊃q` and `p⊃∼q` are *both* true. Saying this out loud converts a list of exercises into a thesis: connexive logic is the demand that a conditional record a connection rather than a truth-value pattern, and `⊃` cannot meet it.

### 1b. Second wave — the modal, epistemic, probability, games and deontic batches

These returned after the ranking above was fixed, so they are listed separately rather than renumbered. Three of them belong in the top five on merit; the table says which.

**The methodological find is the two-world expansion, and it changes what is reachable.** Atomising `□A` as a fresh letter destroys everything — axiom 4 becomes `a ⊃ b`, a one-line non-tautology with nothing to teach. But fix a frame with two worlds and *expand* instead:

> write `p1` for "p at world 1" and `p2` for "p at world 2"; then `□X ↦ X1 & X2` and `◊X ↦ X1 ∨ X2`.

This is not a metaphor — it is the Kripke truth condition with the quantifier over a two-element set written out. Every resulting form is **fully propositional**, four atoms, sixteen rows, genuinely nested, and **the open branch is a drawable Kripke countermodel**. Verified against SEP's own stated verdicts as a soundness check: SEP says `□(A&B)` and `□A & □B` are interderivable (confirmed TAUTOLOGY), and that `□A∨□B` entails `□(A∨B)` "but not vice versa" (confirmed TAUTOLOGY one way, INVALID the other).

One limit, stated so it is never overclaimed: two worlds cannot falsify everything a full frame can, so a **TAUTOLOGY** verdict under this expansion means "valid on this frame," not "valid in K." The **INVALID** verdicts — the ones we want — are fully sound, because a countermodel is a countermodel.

| ID | Form | CMs | Why |
|---|---|---|---|
| **CLI-121** ★ | `(p1⊃q1)&(p2⊃q2), p1 ⊢ q1&q2` | **1 of 16**: p1=T,p2=F,q1=T,q2=F | **The scope fallacy** — necessity of the *consequence* read as necessity of the *consequent*, `□(p⊃q)` vs `p⊃□q`. The most consequential confusion in philosophy, as a four-atom tree, with the countermodel drawable in ten seconds. Its correct twin `(p1⊃q1)&(p2⊃q2), p1&p2 ⊢ q1&q2` is **VALID** — one added premise flips it. Belongs at rank 1 or 2. |
| **CLI-122** ★ | `f1∨g1, f2∨g2 ⊢ (f1&f2)∨(g1&g2)` | **2 of 16**, mirror-symmetric | **Peircean future excluded middle.** Excluded middle holds on *each* history (both premises), yet `Fφ ∨ F∼φ` fails. SEP: Peirceanism "preserves bivalence and excluded middle" while invalidating future excluded middle, "usually judged intuitively valid." The two open branches *are* the two branches of time. |
| **CLI-123** ★ | `h ∨ w, w ∨ c ⊢ w` | **1 of 8**: h=T, w=F, c=T | **Distributed knowledge** — and this is SEP's *own* worked example, asserted as a case of joint knowledge. Propositionally it is invalid, and the missing premise is "a person is in one place at a time." Add `∼(h & c)` and it is valid. Three atoms, one open branch, nothing epistemic lost, and the branch names the premise the reader supplied without noticing. **The cleanest "invisible premise made visible" pair in the whole sweep.** |
| CLI-124 | `⊢ ((p1∨q1)&(p2∨q2)) ⊃ ((p1&p2)∨(q1&q2))` | 2 of 16, symmetric | `□(A∨B) ⊃ □A ∨ □B`. Two beautifully symmetric countermodels — p at one world, q at the other. Directly parallel to `∀x(Fx∨Gx) ⊬ ∀xFx ∨ ∀xGx`, so it previews the second half. |
| CLI-125 | `p1∨p2, q1∨q2 ⊢ (p1&q1)∨(p2&q2)` | 2 of 16 | `◊A & ◊B ⊃ ◊(A&B)`. A very natural student error, and the `∃` analogue of CLI-124. |
| CLI-126 | `(a1⊃b1)&(a2⊃b2), a0 ⊢ b1&b2` | **5 of 32** | **Factual detachment** in deontic dress — the same scope fallacy wearing "ought." Students find it very plausible: *you ought to keep a promise if you made one; you made one; so you ought to keep it.* Its correct twin, deontic detachment `O(A⊃B), OA ⊢ OB`, is **VALID**. Five atoms, five open branches. |
| **CLI-127** | `b∨∼b, b⊃a, ∼b⊃c, (u∨w)⊃∼f ⊢ ∼f` | **4 of 64**, all sharing u=F,w=F,f=T | **The largest genuine tree in the file.** *Either there will be a battle or there won't; if there will be, it was always going to be; if there won't, it was always not going to be; and if either outcome is unavoidable, no one is free.* Airtight-looking, and invalid, because "it was always going to be" was never connected to "it is unavoidable." Adding `a⊃u` and `c⊃w` makes it **VALID** — that pair is a whole problem set. |
| CLI-128 | `k, k⊃t, n⊃∼f ⊢ ∼f` | 1 of 16: f=T,k=T,n=F,t=T | **Theological fatalism minus the necessity of the past.** God knew, so it was true — and the open branch says it still isn't necessary. That branch *is* Ockhamism. The full chain with `t⊃n` restored is VALID. |
| CLI-129 | `t ⊃ (d∨f), d ⊃ t, t ⊢ d` | 1 of 8: d=F, f=T, t=T | **Base-rate neglect.** d = disease, t = positive test, f = false positive. The open branch is literally the false-positive population — an *interpretable* countermodel, not a bare row. Adding two more plausible premises does not close it. |
| CLI-130 | `p&(q∨r), q⊃s, r⊃t ⊢ p&(s&t)` | 2 of 32 | **Adams' half-essentialness as an object-language mistake.** Students who see `q ∨ r` in the premises and want `s & t` out are making exactly the error the refined probability bound corrects. Its control `⊢ p&(s∨t)` is **VALID**. Five atoms, big tree. |
| CLI-131 | `c⊃a, c⊃b, a, b ⊢ c` | 1 of 8 | **Agglomeration.** With a = "probably p", b = "probably q", c = "probably p&q": monotonicity gives the two conditionals free, and the converse is the fallacy. **The single open branch is the lottery paradox**, which lets one diagram serve both the probability lecture and the tree lecture. |
| CLI-132 | `Kbr, Ki ⊢ Kb` | 1 of 8 | **The Red Barn.** I know it's a red barn, I know red-barn entails barn, I don't know it's a barn — and *that countermodel is the case*. See §5.7 for why this one is philosophically load-bearing rather than merely a skeleton. |
| CLI-133 | `∼(a&b) ⊢ a ≡ ∼b` | 1 of 4: a=F, b=F | **Total vs determined**, in game semantics. SEP warns: "Don't confuse being total with the much stronger property of being determined." Every logical game is total (`∼(a&b)` is provable); determinacy needs Gale–Stewart and *fails* for imperfect information. The countermodel a=F, b=F is SEP's own undetermined matching game. |
| **CLI-134** ★ | `Og, c1, c2, ∼g, (∼g&c2)⊃Ont, ∼(Ot&Ont)` — is `Ot` derivable? | **1 of 64** | **The detachment trilemma**, and the largest set in the file. The full seven-premise version (with *both* factual and deontic detachment) is **UNSAT with all seven members independent** — delete any one and it reopens. Delete deontic detachment and the open branch has `Ot=F, Ont=T`: that branch **is** the factual-detachment camp. Delete factual detachment and the branch flips to `Ot=T, Ont=F`: the deontic-detachment camp. **Two open branches, two schools of thought.** Best single exercise in the deontic material. |
| **CLI-135** | `Oj, O∼j, Ot, O(t⊃l) ⊢ Ol` | **1 of 32** | Conflicting promises about Jones should not stop you inferring that you must hand Tom the letter — and atomised, it doesn't follow. The open branch *is* the conflict-tolerant model, and one added `OB-K` instance restores validity. Five atoms. |
| **CLI-136** | `((ab&∼ba)&(bc&cb)) ⊃ (ac&∼ca)` from `(ab&bc)⊃ac` alone | **1 of 64** | **PI-transitivity of preference** — "A is strictly better than B, and B is exactly as good as C, so A is strictly better than C." Given *both* relevant transitivity instances it is valid; given only the obvious one it is not. Six atoms, sixty-four rows, and the open branch is an interpretable preference structure. |
| CLI-137 | `⊢ (Gx & ∼Gy) ≡ (By & ∼Bx)` | **6 of 16** | van Benthem's two goodness-based definitions of preference, which look equivalent and are not. Good for a "list *all* the countermodels" drill. |
| CLI-138 | `(p&q) ≡ (p&r) ⊢ q ≡ r` | 2 of 8 | **Boole's division by a symbol.** His whole method was translate → solve the equation → divide → translate back; there is no cancellation law, and this is the deepest structural defect in the system. Its repair — cancel against `p` *and* `∼p` — is **VALID**, and is exactly what the Development Theorem supplies in place of division. Best item in the algebra material. |
| CLI-139 | `((p & ∼q) ∨ q) ≡ p` and `((p ∨ q) & ∼q) ≡ p` | 1 each of 4 | **Boole's `(x−y)+y = x` and `(x+y)−y = x`.** Add-then-subtract does not return you home. Students expect both to hold. |
| **CLI-140** ★ | `(p1&q1) & c ⊢ p1 & p2` | **1 of 16** | **Closure of belief, failing at an impossible world.** The canonical hyperintensional invalidity, and the open branch *is* the impossible world, drawable: `w1` classical with p and q true, `w2` where p is false yet the sentence `p&q` is true anyway. Its twin with both worlds classical is **VALID**. See §4.8 for why the rendering is legitimate. |
| **CLI-141** ★ | `h1 ≡ p1, h1 & h2 ⊢ p1 & p2` | **1 of 16** | **Frege's puzzle, fully propositional.** "Hesperus is Phosphorus; she knows Hesperus is bright; so she knows Phosphorus is bright" — invalid when the identity holds only *actually*, and **VALID** the instant it holds at every epistemic alternative. That pair is Marcus's answer to Frege, and the countermodel is a drawable epistemic model. |
| **CLI-142** | `⊢ (((p3&p4)⊃p2) & (p4⊃p3) & p4) ⊃ p1` | **1 of 16** | **Looks like Löb, isn't.** Drop the box from the conclusion and it fails — one countermodel, and the reason is deep: the box in the conclusion is doing all the work. Pairs with the *valid* Löb (§4.8), which is a first-rate ND exercise. |
| **CLI-143** | `⊢ ((p1∨q1)&(p2∨q2)) ⊃ ((p1&p2)|(q1&q2))` | 2 of 16, symmetric | `□(p∨q) ⊃ (□p ∨ □q)` — needs no impossible worlds at all, and the two countermodels are an elegant pair: the two worlds disagree about which disjunct holds. |
| **CLI-144** | `⊢ (Fa1∨Fa2∨Fb2) ⊃ (Fa1∨Fa2)` | **1 of 8** | **The Barcan formula**, over a domain that grows from `{a}` to `{a,b}`. Its converse is **VALID** on the same frame. The countermodel `Fb2=T` alone is the entire content of "the domain grew." Three atoms. |
| **CLI-145** | `(p1⊃q1) & k, p1 & p2 ⊢ q1 & q2` | 1 of 32 | Closure under known entailment failing at an open world. Five atoms, substantial tree, and the repair — supply `k ≡ (p2⊃q2)` — is valid. |
| **CLI-146** ★ | `(@ₐb & @_b c) ⊃ @ₐc` | **2 of 64** | **Transitivity of world-identity** — and the countermodels *diagnose the failure*: both have `b1 = b2 = T`, meaning the middle term names two worlds. Supply the nominal constraint on **b alone** and it is valid. Frege's "identity needs singular terms" as a sixty-four-row table. Six atoms. |
| **CLI-147** ★ | `(@ₐb & @ₐφ) ⊃ @_bφ` | **2 of 64** | **Leibniz's Law**, and it needs the *subject* to be a genuine name: supply the constraint on **a** and it's valid; supply it on **b** and it stays invalid, same two countermodels. Run all three variants and the asymmetry is unmissable. Connects straight to the course's `=`-elimination. |
| **CLI-148** | `p, s ⊢ q`, where s = "⌜p⌝ and ⌜q⌝ are alike in truth value" | **1 of 8** | **Kilvington's use/mention split** — the whole Burley–Kilvington dispute is whether the disquotation bridge `s ≡ (p≡q)` is a premise. Without it, invalid; with it, valid; and on the *use* reading `p, p≡q ⊢ q` is valid outright. Three atoms, and the fourteenth century's best argument. |
| **CLI-149** | `∼p∨q, ∼q∨r, ∼p∨∼r ⊢ p` | **3 of 8** | Three propositions each individually neutral on `p`, which together look like they must settle it in its favour. They settle it the **other way** — `⊢ ∼p` is valid. |
| **CLI-150** | `⟨α⟩A & ⟨β⟩A ⊃ ⟨α∩β⟩A` | 1 of 64 | **The joint-achievability fallacy.** "I can reach A by doing α; I can reach A by doing β; so I can reach A by doing both." The converse is **VALID** — pair them. Six atoms. |
| **CLI-151** | `d ∨ n, ∼d ⊢ n′` | 1 of 8 | **Schurz's generalized Hume thesis** sorting Prior's is-ought paradox. Prior's two inferences are *both valid*, so they give you nothing invalid on their own; swap the norm inside and one survives, one doesn't. Three atoms, eight rows, and it does the work Prior said he couldn't do. |
| **CLI-152** ★ | `∃x(Ax&Bx&Cx), ∃x(Bx&Cx&Dx), ∃x(Cx&Dx&Ax) ⊢ ∃x(Ax&Bx&Cx&Dx)` | 6 CMs, **minimum domain exactly 3** | **Helly's theorem forces Euler circles to lie.** Convex regions in the plane cannot show three pairwise-overlapping triples without creating a quadruple overlap, so the diagram displays a relationship that does not follow. Second-half material, and the countermodel needs a *three*-object domain — which makes countermodel size itself a visible quantity. |
| CLI-153 | `∀x(Ax⊃∼Bx), ∃x(Cx&Ax) ⊢ ∀x(Cx⊃∼Bx)` and `⊢ ∀x(Bx⊃Cx)` | 32 CMs each, min domain 2 | **The two misreadings Euler's own case-diagram invites** for a *valid* syllogism. The premises are true, the picture "shows" the conclusion, and a two-element countermodel kills it. |

---

## 2. CORE PROPOSITIONAL AND FORMAL LOGIC

*SEP: logic: classical · logic: propositional · logical consequence · logical form · logical truth · logical pluralism · natural deduction systems in logic · consequence, medieval theories of.*

### 2.1 Forms

| ID | Form | Verdict | Name / source | Size | Prop? |
|---|---|---|---|---|---|
| CLI-201 | `⊢ ((p⊃q)⊃p)⊃p` | TAUT | **Peirce's Law** — already at PS5.7 bonus | 2 / 4 | yes |
| CLI-202 | `⊢ (p⊃q) ∨ (q⊃p)` | TAUT | **Dummett's linearity axiom**; adding it to IPC gives LC | 2 / 4 | yes |
| CLI-203 | `⊢ p ⊃ (q⊃p)` | TAUT | Positive paradox / weakening — Frege's first axiom | 2 / 4 | yes |
| CLI-204 | `⊢ (C⊃(B⊃A)) ⊃ ((C⊃B)⊃(C⊃A))` | TAUT | Frege's self-distribution; the engine of the Deduction Theorem | 3 / 8 | yes |
| CLI-205 | `A, ∼(A & ∼(B & C)) ⊢ C` | VALID (1 of 8 premise-true) | **Nicod's rule**, the sole rule of his 1917 one-axiom system in `|` | 3 / 8 | yes |
| CLI-206 | `q ⊢ p ∨ ∼p` | VALID | ***Necessarium ad quodlibet*** — Buridan's second contested corollary | 2 / 4 | yes |
| CLI-207 | `p, ∼p ⊢ q & ∼q` | VALID | Ex impossibili with a contradictory conclusion: from one contradiction, *every* contradiction | 2 / 4 | yes |
| CLI-208 | `p, q ⊢ p` | VALID | **Structural weakening** — the rule relevance logic rejects one level *above* the connectives | 2 / 4 | yes |
| CLI-209 | `p ⊢ q` | INVALID (p=T,q=F) | What **tonk** proves; Belnap's non-conservativeness target | 2 / 4 | yes |
| CLI-210 | `⊢ (p∨q) ≡ ((p∨q) & (r∨∼r))` | TAUT | SEP's "contaminated disjunction": extensionally `∨`, partly built from non-logical material | 3 / 8 | yes |
| CLI-211 | `⊢ ((p⊃p)⊃q)⊃q` | TAUT | **EntT**, axiom 2 of **E** — distinguishes E from R | 2 / 4 | yes |
| CLI-212 | `⊢ (p⊃q) ∨ p` | TAUT | Right-weakening in LK; classically valid, intuitionistically not | 2 / 4 | yes |
| CLI-213 | `(a&b)⊃c ⊢ (a⊃c) ∨ (b⊃c)` | VALID (7 of 8) | Restall Ex {7.2}.5 — classically valid, intuitionistically not. Hard, doable, unassigned | 3 / 8 | yes |
| CLI-214 | `⊢ a ∨ (a⊃b)` | TAUT | Restall Ex {7.2}.3 — a paradox of material implication in one line | 2 / 4 | yes |

### 2.2 Tonk, harmony, and conservativeness — the Lecture 9 upgrade

The handout currently gestures at tonk. Here is the version that can be *verified in class*, which matters because the course has just finished building truth tables.

Prior's rules are `A ⊢ A tonk B` and `A tonk B ⊢ B`. Composing them gives `A ⊢ B` for arbitrary `A, B` (CLI-209, invalid, countermodel p=T q=F).

**There is no truth table for tonk.** By exhaustive search over all sixteen binary truth functions (rows ordered TT, TF, FT, FF): the introduction rule is satisfied by exactly `{TTTT, TTTF, TTFT, TTFF}`; the elimination rule by exactly `{TFTF, TFFF, FFTF, FFFF}`; **the intersection is empty.** Concretely, the `A=T, B=F` row must be T or the introduction rule fails, and F or the elimination rule fails.

The sharpest formulation, and it uses only rules the students already have:

> **Tonk's introduction rule is `∨I`. Tonk's elimination rule is `&E`. Neither half is a fraud. Tonk is disjunction's front door bolted onto conjunction's back door.**

Belnap's 1962 reply, precisely: (i) **conservative extension** — adding a connective must license no new derivation in the *old* vocabulary, and tonk licenses the tonk-free sequent `p ⊢ q`; (ii) **harmony / uniqueness** — the elimination rule may not extract more than the introduction rule put in, which is Gentzen's inversion principle ("the introductions represent, as it were, the definitions of the symbols, and the eliminations are no more than the consequences of these definitions").

And the repair is a genuinely satisfying punchline: keep tonk's introduction rule and take the strongest harmonious elimination rule, and you get the table `TTFF` — left projection, `A tonk B` just *is* `A`. Start from the elimination rule instead and you get `TFTF` — right projection, `A tonk B` just *is* `B`. **Two perfectly coherent connectives flank tonk; tonk is the impossible point between them.**

The counter-move belongs in the grader aid, since PS4's aid already rewards students who reach it: if rules must answer to a conservativeness constraint stated over *pre-existing* consequence, then consequence is prior to the rules, and the inferentialist's order of explanation has been inverted.

### 2.3 Logical consequence — the three glosses, for Lecture 1

SEP separates (i) the **modal** account (in every world where the premises hold, so does the conclusion), (ii) the **formal/schematic** account (no uniform substitution on the non-logical vocabulary gives true premises and a false conclusion), and (iii) the **a priori** account. Our slogan "truth-preservation in virtue of form" is (i) & (ii), and SEP's argument for needing both conjuncts is exactly the Lecture 1 pedagogy:

- Modality alone is **too weak**: `x is water ∴ x is H₂O` preserves truth in every possible world (a posteriori necessity) and is not logically valid. So "couldn't be false" is not sufficient.
- Formality alone is **too weak** the other way: "If a widow runs, then a female runs" (true) and "If a widow runs, then a log runs" (false) share a schema.
- The remainder case: `Peter is Greg's mother's brother's son ∴ Peter is Greg's cousin` is necessary *and* a priori and **not formal** — the classic *material* consequence, and the best English example for insisting on form.

**"In virtue of form" is relative to a choice of constants.** SEP *Logical Form* is blunt: "Questions about 'the' logical form of an ordinary sentence are in part questions about which conventions one should adopt." Every argument instantiates `A ∴ B`; validity-in-virtue-of-form means valid on *some* form, and which forms exist depends on which expressions were designated logical. §3.3's interdefinability rows make this concrete — `{∼, ⊃}` alone would have done the whole job. One sentence for the handout: *the form of an argument is not read off it; it is imposed on it by a decision about which words to hold fixed.*

Grace note for a first lecture: SEP records the Stoics writing modus ponens as "If the first then the second, and the first; so the second." **Schematic letters are an invention, not a discovery.**

### 2.4 Medieval consequence, and the Lewis argument as a spine for Lecture 11

Lecture 11 presently asserts explosion and then reports that relevance logicians reject it. The Lewis / Parisian argument turns that into an argument with premises:

1. `p & ∼p ⊢ p` (simplification)
2. `p ⊢ p ∨ q` (addition)
3. `p & ∼p ⊢ ∼p` (simplification)
4. `p ∨ q, ∼p ⊢ q` (disjunctive syllogism)
5. therefore `p & ∼p ⊢ q`

All five steps verified valid. **Every anti-explosion position is a choice about which step to abandon** — relevance logic drops (4), Jaśkowski's discussive logic drops adjunction before you even reach (1), and LP drops (4) too but for a glut-theoretic reason. That converts L11's "two explosions" box from a curiosity into a fork with named exits, and it makes the DS material already in the lecture load-bearing.

Attribution caution: the step-by-step derivation is **not** in SEP *Medieval Theories of Consequence* — that entry lists *ex impossibili quodlibet* among Buridan's corollaries and points to Martin 1986 and Read 1993/2010 in a footnote. The derivation is in SEP *Relevance Logic*; the twelfth-century attribution (William of Soissons, the Parvipontanians) is in SEP *Paraconsistent Logic*.

Also for L11: SEP frames the relevance objection **at the structural rule of weakening** — "the extra premise A need not be used in the derivation" — not at `⊃I` and `∼I`. That gives the lecture a taxonomy it lacks: *rivals that change the connective rules* versus *rivals that change the structural rules*. The second-half contraction material hangs on the same peg.

### 2.5 Logical pluralism — a reflective question with the students' own author on the line

Beall and Restall's **Generalised Tarski Thesis**: an argument is valid<sub>x</sub> just when in every case<sub>x</sub> where the premises are true, so is the conclusion. Fix "case" as a **possible world** and you get classical consequence; as a **situation** (possibly incomplete or inconsistent) and explosion fails, giving relevant consequence; as a **construction** and excluded middle fails, giving intuitionistic consequence. The claim is not that logicians disagree but that all three readings satisfy the settled core — necessity, normativity, formality — so all three are genuinely *logical* consequence.

The question writes itself: *your textbook's author holds that the classical, relevant and intuitionistic logicians are all right. Lecture 11 presented them as rivals. Which framing do you accept?*

Two objections for the grader aid. **Priest's collapse argument**: a pluralist who admits the strongest available relation gives the true verdicts must always reason by it, so pluralism collapses into monism about the strongest logic. **Quine's meaning-variance**: if `∼` means something different for the two logicians, they never disagreed. SEP distinguishes **A-variance** (they mean different things by "valid") from **B-variance** (different things by the connectives); Beall–Restall need A-variance without B-variance, and whether that is stable is the live question.

⚠️ **Correction to carry forward:** one fetched summary of the pluralism entry asserted that explosion is intuitionistically invalid. It is not. Intuitionistic logic validates *ex falso*; **minimal** and **relevant** logic reject it. Do not let that into a handout.

### 2.6 The algebra-of-logic tradition — Boole's mistakes, and what a logic *is*

*SEP: the algebra of logic tradition (Burris & Legris) · the mathematics of Boolean algebra (Monk) · algebraic propositional logic (Font & Jansana). Note: **Venn is not mentioned once** in any of the three, and Ladd-Franklin, Kempe and Couturat get at most a passing line. There is no diagrammatic-tradition material here.*

#### What Boole got wrong — the best Lecture 1/2 framing found in the sweep

Boole's one genuinely new law was **idempotence**, `XX = X`, and he hung everything on it. What he did *not* have is what makes this teachable, because each failure is a four-row table:

| Boole's identity | Verdict | What broke |
|---|---|---|
| `(p∨q) ⊃ ((p&∼q) ∨ (∼p&q))` | **INVALID**, p=T,q=T | Boole's `+` was defined **only for disjoint classes**. Extended to overlapping ones it is exclusive, not inclusive. **One row is the whole Jevons–Boole quarrel.** |
| `(p ⊻ p) ≡ p` | **INVALID**, p=T | Jevons wrote to Boole in 1863 proposing the Law of Unity `X + X = X`. Boole rejected it and **broke off the correspondence** — it would have destroyed his tie to ordinary algebra. On Boole's own rules `X+X = 2X` is *uninterpretable*. |
| `((p&∼q) ∨ q) ≡ p` — his `(x−y)+y = x` | **INVALID**, p=F,q=T | `−` was class difference, defined only for subtracting a *subclass*. The arithmetic identity fails the moment `q ⊄ p`. |
| `((p∨q) & ∼q) ≡ p` — his `(x+y)−y = x` | **INVALID**, p=T,q=T | Add-then-subtract does not return you home. |
| `(p&q) ≡ (p&r) ⊢ q ≡ r` | **INVALID**, 2 CMs | **Division by a symbol.** Boole's method was translate → solve → divide → translate back. There is no cancellation law. |
| `(p&q)≡(p&r), (∼p&q)≡(∼p&r) ⊢ q ≡ r` | **VALID** | The repair: cancel against `p` **and** `∼p`. That case-split *is* what the Development Theorem gives you in place of division. |

Boole's defence of computing through uninterpretable stages was that ordinary algebra does the same with √−1 — a defence he offered in 1854 while still calling √−1 uninterpretable.

**What Boole got right, and what it became.** His translation of "All X is Y" as `X = XY` is correct: `(p⊃q) ≡ (p ≡ (p&q))` is a tautology. So are `p ≡ ((p&q) ∨ (p&∼q))` — his **Development Theorem**, which SEP calls "an algebraic expression of the disjunctive normal form theorem" — and Peirce's subsumption base `(p⊃q) ≡ ((p∨q) ≡ q)`, the row that makes the conditional *just* the lattice order. **The lesson for a lecture is clean: his translations were sound; his operations were not.**

Two of Boole's theorems, verified against all sixteen binary truth functions with zero mismatches:

- **Development**: `φ(p,q) ≡ (φ(⊤,⊤)&p&q) ∨ (φ(⊤,⊥)&p&∼q) ∨ (φ(⊥,⊤)&∼p&q) ∨ (φ(⊥,⊥)&∼p&∼q)`.
- **Elimination**: `φ(p,q) ⊨ φ(p,⊤) ∨ φ(p,⊥)`, and that disjunction is the *strongest* `q`-free consequence. This is propositional quantifier elimination and the direct ancestor of resolution.

**And the Rule of 0 and 1**, which Boole introduced in 1854 as the sole foundation of his system, **gave no name and no justification**, and referred to thereafter only clumsily: an equation holds in all Boolean algebras exactly when it holds in the two-element one. *That is the licence for the entire truth-table method*, and it is worth saying out loud in Lecture 1 that the method rests on an unexplained posit of Boole's that took eighty years to become a theorem.

⚠️ **De Morgan's contribution is thinner than his name suggests**, and SEP is fairly harsh: his 1847 *Formal Logic* was "a large collection of small facts without a significant synthesis," and crucially **his omission of a symbol for equality made an equational algebra of logic impossible.** His real contributions are replacing the copula with an arbitrary binary relation (1850), and relational composition and converse. The De Morgan laws are not what the entry credits him with. Worth knowing before writing the lecture.

#### The tradition's own disagreements

**Peirce killed existential import — and said nothing about why.** In 1880 he "quietly broke with the traditional extensional semantics," allowed empty extensions, and declared "All A is B" true when both are empty. The casualties, all verified invalid by exhaustive finite-model search: conversion by limitation, subalternation, and **Darapti** — a syllogism valid for two millennia, invalidated by a semantic decision made without argument. Supply `∃x Mx` and Darapti is valid again. The forms that survive are exactly those with no existential commitment: Barbara, Celarent, E-conversion, A-contraposition. Ideal material for "what does validity depend on?"

**Distributivity is not free, and Peirce thought it was.** He claimed `p & (q∨r) ≡ (p&q) ∨ (p&r)` followed from the lattice axioms and said the proof was "too tedious to include." Schröder challenged him; **Peirce admitted he could not prove it**; his later "proof" illegitimately used complementation. The concrete answer: the two five-element non-distributive lattices **M₃** and **N₅** satisfy absorption in full and fail distributivity — and in M₃ an element has **two distinct complements**, so complements are not even unique without distributivity.

#### Identities students will not guess

| Form | Verdict | Why it earns a slot |
|---|---|---|
| `(∼(∼p ∨ ∼q) ∨ ∼(∼p ∨ q)) ≡ p` | TAUT | **Huntington's equation** (1933). With commutativity and associativity of `∨`, this *one* equation axiomatises all of Boolean algebra. Looks like nonsense; is a complete foundation. |
| `∼(∼(p ∨ q) ∨ ∼(p ∨ ∼q)) ≡ p` | TAUT | **The Robbins equation.** Robbins conjectured it could replace Huntington's; neither he nor Huntington could prove it; it defeated Tarski and the whole Berkeley school for sixty years; **McCune's automated prover settled it in 1996.** A first-year verifies the *equation* in four rows and cannot verify the *conjecture* at all — a perfect illustration of the gap between checking an instance and proving a law. |
| `((p&q) ∨ (∼p&r) ∨ (q&r)) ≡ ((p&q) ∨ (∼p&r))` | TAUT | **Consensus.** A disjunct that is provably redundant and looks essential. Best eight-row exercise in the block. |
| `((p⊻q)⊻r) ≡ (p⊻(q⊻r))` | TAUT | **XOR is associative** — genuinely surprising. |
| `(p⊻(q&r)) ≡ ((p⊻q) & (p⊻r))` | **INVALID**, 2 CMs | …and does *not* distribute over `&`. The ring is one-sided. |
| `(p∨q) ≡ ((p⊻q) ⊻ (p&q))` | TAUT | **The Stone rehabilitation of Boole**: his exclusive `+` was not a mistake, it was the *ring* operation, and `∨` is recoverable from it. Redeems Boole in one line. |
| `(p ∨ (q&r)) ≡ ((p∨q) & (p∨r))` | TAUT | Distribution of `∨` over `&` — **the direction with no arithmetic analogue** (`a + bc ≠ (a+b)(a+c)`). The clearest single demonstration that this is not the algebra of numbers. |
| `((p\|q)\|r) ≡ (p\|(q\|r))` for the Sheffer stroke | **INVALID**, 4 of 8 | **The stroke is functionally complete and not associative** — so bracketing matters, contrary to every other connective students meet. |

Anecdote worth using: Whitehead and Russell called the Sheffer stroke "the greatest advance in logic since the publication of *Principia*"; Hilbert and Ackermann called it "just a curiosity." Neither noticed that **Schröder had already found the dual operation decades earlier.** And the term "Boolean algebra" was coined by Sheffer, not by Boole or Huntington.

**Duality, verified**: `∼φ(p₁…pₙ) ≡ φᵈ(∼p₁…∼pₙ)` across the `{∼,&,∨,⊤,⊥}` fragment, zero failures. **Teaching use: every identity above comes free in pairs, so students need only build half the tables.** The fragment restriction matters — once `⊃` appears you must eliminate it first.

#### The algebraic fork: what fails when complementation goes

A Boolean algebra is a bounded distributive lattice **plus exactly two equations**, `x ∨ ∼x = 1` and `x & ∼x = 0`. Complementation is the *entire* difference. And the payoff for Lecture 11:

> **The `{&, ∨, ⊤, ⊥}`-fragment of classical propositional logic is identical to that fragment of intuitionistic logic.** Classical and intuitionistic logic agree completely until negation or the conditional appears.

The verified fork, with Heyting countermodels: `p ∨ ∼p`, `∼∼p ⊃ p`, **Peirce's Law**, consequentia mirabilis, `(p⊃q) ⊃ (∼p∨q)`, `∼(p&q) ⊃ (∼p∨∼q)` and Dummett linearity all **fail**; `(∼p∨∼q) ⊃ ∼(p&q)`, `∼(p∨q) ≡ (∼p&∼q)`, `(∼p∨q) ⊃ (p⊃q)`, `∼∼(p∨∼p)`, `∼∼∼p ≡ ∼p`, absorption and both distributions all **hold**. Note the granularity: **three of the four De Morgan directions survive intuitionistically; only one fails.** That is a better classroom point than the usual blanket "intuitionists reject De Morgan." (These are falsification results in six finite Heyting algebras — a "holds" entry means "held in the algebras tested," not a proof.)

Bonus for Lecture 12: by **Glivenko's theorem**, Heyting algebras are an algebraic semantics for *classical* logic under the designated condition `∼∼p ≈ 1`, and for intuitionistic logic under `p ≈ 1`. **Same algebras, different designated set** — classical logic is the double-negation image of intuitionistic logic.

#### What a logic *is* — the Lecture 12 reframing

**A logic is a consequence relation, not a set of theorems.** Frege and Russell handed down a picture in which a logic is axioms plus rules and the interesting objects are theorems; SEP is blunt that this was a wrong turn — "the concept of logical consequence has proved much more fruitful than those of theorem and of logical validity." A consequence relation satisfies reflexivity, monotonicity and cut, plus finitarity and **substitution-invariance** — the last being the formal content of "logic is about *form*." (Historical note worth having: substitution-invariance was **not** Tarski's; it entered with Łoś and Suszko in 1958.)

**And this reframes soundness and completeness exactly as Lecture 12 needs.** Your `⊨` (tables), `⊢` (trees) and `⊢ND` (Fitch) are three *presentations of one relation*. Soundness is `⊢₁ ⊆ ⊢₂`; completeness is `⊢₂ ⊆ ⊢₁`. **They are not deep facts about proof — they are the claim that two definitions pick out the same relation.** That alone justifies the lecture.

**The Lindenbaum–Tarski construction**, in outline, under the slogan *"propositional formulas are terms"*: read the connectives as operation symbols so the formulas become an algebra; define `φ ~ ψ` iff `(φ ≡ ψ)` is in the theory; show that is a **congruence** (it respects the connectives); quotient. The result is a Boolean algebra in which the theory is exactly the top element, and if `Γ ⊬ φ` **the quotient algebra is the countermodel**. The striking converse: **every Boolean algebra is isomorphic to a Lindenbaum–Tarski algebra.** There is nothing else for Boolean algebras to be.

The congruence step is where the classical/modal contrast bites. It is the **strong replacement principle** — if `Γ,φ ⊢ ψ` and `Γ,ψ ⊢ φ` then substituting one for the other inside any context is safe — shared by classical logic, intuitionistic logic and all its axiomatic extensions, and described as "the formal counterpart of Frege's principle of compositionality for truth." **Almost all modal logics fail it.** That is precisely why substitution of equivalents is safe in this course and unsafe in a modal one, and it connects directly to §3.4's congruential/truth-functional distinction and to §5.7's hyperintensionality.

**The concrete anchor**, and the best one in the block: the Lindenbaum–Tarski algebra of classical logic on n atoms has exactly **2^(2ⁿ)** elements — four for one atom (`⊥, p, ∼p, ⊤`), **sixteen for two**, 256 for three. So: *there are exactly sixteen non-equivalent formulas you can write in `p` and `q`, and you have already met all of them — they are the sixteen columns of §3.7's table.*

Two closing facts for Lecture 12. The two-element Boolean algebra is not special; it **generates** the whole variety — **which is the same theorem as Boole's Rule of 0 and 1**, his unexplained 1854 posit and the modern generation result, eighty years apart. And the pairing of logics with algebras is not always tidy: some logics have **no algebraic semantics at all**.

### 2.7 The diagrammatic tradition — Euler → Venn → Peirce → Shin

*SEP: diagrams and diagrammatic reasoning. **Written by Sun-Joo Shin (Yale)**, with Oliver Lemon and John Mumma; substantively revised September 2025. The Euler/Venn/Peirce material is Shin writing about her own results — a local-author entry, which may itself be worth a remark to students.*

Sought out because the three algebra-of-logic entries do not mention Venn once. This entry is the whole diagrammatic tradition, and its shape is exactly what Lecture 1 or 2 wants: **a notation, a named failure, a patch, and a new failure.**

#### Euler's three failures, each concrete

Euler's system has a real virtue worth naming first, because it says what a good notation *is*: the meaning is carried by the medium rather than by stipulation. SEP — *"no additional conventions are needed to establish the meanings of diagrams involving more than one circle: relationships holding among sets are asserted by means of the same relationships holding among the circles representing them."* (Though a footnote is careful: *"however natural this convention may sound, this is still an arbitrary convention"* — Lambert's linear systems make points individuals and lines sets instead. **Even the most natural notation is a choice.**)

**Failure 1 — one picture, three logically independent propositions.** Euler's diagram for "Some A is B" also supports "Some B is A," "Some A is not B," and "Some B is not A." Verified: only the first pair is equivalent (simple conversion); the I/O pair is **independent in both directions**, each with a one-element countermodel. *One picture, four readings, three of them non-equivalent* — the sharpest single motivation for a language with unambiguous syntax that the sweep turned up.

**Failure 2 — consistent premise pairs that cannot be drawn at all.** {All A are B, No A is B}; {All A are B, All B are A}; {Some A is B, All A are B}. All three verified satisfiable. ⚠️ **And note where SEP's justification for the first one comes from** — verbatim, *"consistent if A is an empty set."* The entire argument that Euler's system is expressively defective **depends on allowing empty extensions.** If universals carried existential import that pair would be genuinely inconsistent, and Euler's inability to draw it would be a feature. See below.

**Failure 3 — a valid syllogism whose diagram invites two invalid conclusions.** Euler's own Example 3, `No A is B; Some C is A ⊢ Some C is not B`, needs three case-diagrams because the B–C relation cannot be fixed in one. SEP: *"a user might read off 'No C is B' from case 1 and 'All B is C' from case 2."* Both misreadings are **invalid**, verified, 32 countermodels each, minimum domain 2 (CLI-153). **The premises are true, the picture shows the conclusion, and a two-element countermodel kills it.** Euler half-noticed and patched with a `*` for non-emptiness.

**Failure 4 — and this one is topological, not notational.** By **Helly's theorem**, four convex plane regions whose every triple intersects must all four intersect. So three pairwise-overlapping triples cannot be drawn in Euler circles **without displaying a quadruple overlap that does not follow** (CLI-152). Non-convex "blob" regions hit non-planarity instead. This is a genuine incompleteness of the medium, and it partly vindicates the traditional suspicion of diagrams.

#### Venn's patch, and its own failure

Venn's diagnosis, quoted: Euler's schemes *"only illustrate in strictness the actual relation of classes to each other, rather than the imperfect knowledge of these relations which we may possess."* The fix is two moves: **primary diagrams** (overlapping circles now assert *nothing* — "the major difference between Euler and Venn diagrams") and **shading** for emptiness.

What it buys: both undrawable universal pairs become drawable, and the combination becomes *readable*. Shade A−B and A∩B and all of A is shaded — verified, `∀x(Ax⊃Bx), ∀x(Ax⊃∼Bx) ⊨ ∼∃x Ax`. Shade A−B and B−A and you have coextension — verified, `⊨ ∀x(Ax ≡ Bx)`.

What it costs, and SEP is careful about this: *"shading is a new syntactic device which Euler did not use."* **Venn buys expressive power by adding an arbitrary convention — the medium no longer carries the meaning by itself.** And Venn's own failure is flat: *"Venn was silent about the representation of existential statements."* He can shade a region empty; he has no way to say a region is occupied. So Venn cannot state Euler's Example 3 either.

#### Peirce's patch, and Peirce's own verdict on it

Peirce adds three devices: `o` for emptiness (replacing shading, because a symbol can be joined by lines), **`x` for "existential import"** (SEP's own phrase), and a connecting line for disjunction. The `o` exists only to serve the line.

His target is a proposition neither predecessor can draw: **"All A are B, or some A is B."** Verified: it is not a tautology; neither disjunct entails the other; and it is equivalent to *"if there are any A's at all, some of them are B."* A genuine, irreducible disjunction — a nice concrete illustration that `∨` is not eliminable.

The cost, in Peirce's own words: *"there is a great complexity in the expression that is essential to the meaning."* SEP: *"when Peirce's revision was completed, most of Euler's original ideas about visualization were lost, except that a geometrical object (the circle) is used to represent (possibly empty) sets."*

**But Peirce's real contribution here is transformation rules** — *"'Rule' is here used in the sense in which we speak of the 'rules' of algebra; that is, as a permission under strictly defined conditions."* SEP: he was *"probably the first person to discuss rules of transformation in a non-sentential representation system."* And then the sentence that is a ready-made framing for Lecture 12:

> *"Peirce did not have any theoretical tool — **a clear distinction between syntax and semantics** — to convince the reader that each rule is correct or to determine whether more rules are needed."*

**He had inference rules and no way to ask whether they were the right ones, because he had no semantics to check them against.** That is what soundness and completeness are for, stated historically.

#### Existential import: the answer, and it ties the sweep together

The three systems divide cleanly, and this is the answer to whether the diagrammatic tradition makes the same commitment as Peirce's 1880 decision (§2.6):

| System | Import status |
|---|---|
| **Euler** | Import-laden in practice — a drawn circle is a drawn region — but never endorsed by SEP, which uses the empty-A case *against* Euler. Euler's own `*` device is evidence he did not think circles carried it. |
| **Venn** | **No import, and import is inexpressible.** Primary diagrams commit to nothing; shading only ever asserts emptiness. There is no device for saying a region is occupied. |
| **Peirce / Venn-I / Venn-II** | **No default import, but import is expressible.** The `x` exists precisely for it. *Import becomes an extra premise you draw, not a background assumption* — which is exactly the 1880 decision. |

On that reading, verified: subalternation, conversion *per accidens*, **Darapti**, Felapton, Barbari and Celaront are all **INVALID**, each with a one-element countermodel where every extension is empty; and {All A are B, No A is B} is **satisfiable**, so traditional contrariety fails. Add one import premise and every one becomes **VALID**. Under fully import-laden universals the traditional package returns intact: contrariety restored, subalternation and Darapti valid.

**So the two readings are coherent packages, and the choice between them is the choice between Euler's picture and Venn's.** The payoff, and it is the single slide connecting §2.6 to this section: **shading is what makes empty extensions drawable, and drawing the empty case is what breaks Darapti. Venn's syntactic innovation and Peirce's semantic decision are the same move seen from two sides.**

#### Shin's systems, and what they mean for Lecture 12

**Venn-I** = Venn's shading + Peirce's `x` + lines between `x`s. It fixes Euler's Example 3 in one diagram, and more legibly than Peirce. Its own limit is named: it cannot express disjunction between *universal* statements. **Venn-II** adds lines between whole diagrams and is **"logically equivalent to monadic predicate logic."** (Verified: the Venn-II two-box rendering of Peirce's ugly four-line diagram is equivalent to it in both directions.)

The metatheory passage maps onto Lecture 12 almost word for word:

> *"The syntax tells us which diagrams are acceptable… and which manipulations are permissible. The semantics defines logical consequences among diagrams. Using these tools, it is proven that the systems are sound and complete, in the same sense that some symbolic logics are."*

And the moral SEP draws:

> *"none of these turned out to be intrinsic to these traditional symbolic logics only. For any representation system, whether it is sentential or diagrammatic, we can discuss two levels, a syntactic and a semantic level… When a system is proven to be sound, we should be able to adopt it in proofs."*

⚠️ **But do not take the triumphalist line, because SEP itself does not.** §4.2: *"many diagrammatic systems are self-consistent, incorrect, and incomplete, and complexity of inference with the diagrams is NP-hard. By way of contrast, most sentential logics… are complete and correct."* "Self-consistent" here means diagrams **cannot represent contradictions** — if it cannot be drawn, the situation is impossible. And the Helly result is called *"a type of incompleteness"* that *"renders many diagrammatic systems incorrect if they are used for logical reasoning."*

**The honest Lecture 12 line is therefore better than the triumphalist one:** diagrammatic systems *can* be sound and complete — Shin proved two of them are — but soundness and completeness are **not free**, and the naive systems fail them for reasons rooted in plane topology rather than in anything about logic. That makes soundness a substantive claim rather than a formality.

#### "A heuristic aid, but not part of the proof"

SEP states the attitude twice: *"Diagrams are usually adopted as a heuristic tool in exploring a proof, but not as part of a proof"*; and for mathematics, *"their use is limited to enhancing comprehension of a proof. They are not part of the proof itself."* The diagnosis given: *"the possibility of being misled by diagrams and their limited expressive power."* **Note that §4.1's Helly result vindicates the first of those reasons — the dismissal was not baseless, it was overgeneralized.**

The historical target is the standard twentieth-century reading of Euclid, on which diagram-dependent steps are *gaps*; the lineage is Pasch → Hilbert 1899 → Tarski 1959, whose axiomatization *"presents the logic of the reasoning as completely diagram-free."*

The replies: **Shin 1994 and Hammer 1995** — soundness and completeness results that *"directly refuted a widely-held assumption that diagrams are inherently misleading, and abolished theoretical objections to diagrams being used in proofs."* **Barwise & Etchemendy**: *"there is no principled distinction between inference formalisms that use text and those that use diagrams."* **Ken Manders** on Euclid — he *"employs diagrams in a controlled, systematic way,"* which *"calls into question negative assessments of the rigor of the Elements."*

And the dissent, worth including for balance: **Mancosu (2005)** is sceptical of the philosophical value of the whole proof-and-justification framing, holding that the interesting questions about diagrams are discovery and explanation, not proof.

**Hyperproof** gets exactly one sentence — Barwise and Etchemendy's *"innovative computer program… which adopts both first-order languages and diagrams (in a multi-modal system) **to teach elementary logic courses**."* No mechanics. But the *argument* for a Hyperproof-shaped course is here: if soundness is representation-neutral, mixing a diagram and a formula in one proof is a legitimate formal system, not a pedagogical compromise.

⚠️ **Two gaps to record.** SEP **does not state Shin's transformation rules** — it says at length that such rules exist and that soundness is about them, and never lists them. For those, Shin 1994, *The Logical Status of Diagrams*. And **existential graphs get three passing mentions and no content**: the words "alpha," "beta" and "gamma" **do not appear in the entry at all**. So the alpha system — Peirce's purely propositional graphs, where juxtaposition is conjunction and a cut is negation — cannot be sourced here. The leads SEP gives are Roberts 1973, Zeman 1964, Shin 2003, and Sowa's online commentary on Peirce's MS 514. 📌 **Resolved at §2.15**: the alpha content *is* in SEP's **Peirce's deductive logic** entry — syntax, semantics, Peirce's Code of Permissions, and (in an endnote, not the body) the five named rules. All verified. It is a genuinely different fourth method, and the reason is the Multiple Readings algorithm: in Alpha, `p ⊃ q`, `∼p ∨ q` and `∼(p & ∼q)` are **the same drawing**.

Two smaller items worth a footnote. **Lewis Carroll's** squares *"supersede Venn's in that the complements of sets are explicitly represented as regions of the diagram,"* at the cost of representing some properties as disconnected regions — and SEP's gloss is nice: *"This shift closely mirrors the shift in logic from subject-predicate argumentation to a function-argument representation."* And **Frege's *Begriffsschrift* notation is itself a diagrammatic system** — it *"used lines rather than plane regions"* — which is a good corrective to the idea that the two traditions were ever really separate.

### 2.8 Ancient and medieval: the Stoics, the square, and the twenty-four moods

*SEP: logic: ancient (Bobzien) · the traditional square of opposition (Parsons) — note the slug is `square`, not `square-of-opposition`, which 404s · syllogism, medieval theories of (Lagerlund).*

#### The Stoic indemonstrables — and the one that is invalid

Chrysippus's five undemonstrated arguments are the ancestor of our ND rules. All verified:

| # | Ordinal form | House notation | Verdict |
|---|---|---|---|
| 1 | If the 1st, the 2nd; but the 1st; so the 2nd | `P⊃Q, P ⊢ Q` | VALID |
| 2 | If the 1st, the 2nd; but not the 2nd; so not the 1st | `P⊃Q, ∼Q ⊢ ∼P` | VALID |
| 3 | Not both the 1st and the 2nd; but the 1st; so not the 2nd | `∼(P&Q), P ⊢ ∼Q` | VALID |
| **4** | **Either the 1st or the 2nd; but the 1st; so not the 2nd** | `P∨Q, P ⊢ ∼Q` | **INVALID**, unique CM P=T, Q=T |
| 4′ | *the same, with Stoic exclusive "or"* | `∼(P≡Q), P ⊢ ∼Q` | **VALID** |
| 5 | Either the 1st or the 2nd; but not the 1st; so the 2nd | `P∨Q, ∼P ⊢ Q` | VALID |

**This is the most teachable single result in the whole sweep.** One of the five *undemonstrated* arguments — the bedrock of the system — is flatly invalid in our logic, and valid only because **Stoic disjunction is exclusive**: SEP, "Stoic disjunction is exclusive and non-truth-functional. It is true when necessarily precisely one of its disjuncts is true." Disjunctive syllogism (the fifth) survives the switch; the fourth does not. Set the two side by side with `∨`, have students find that exactly one fails, then re-run with `∼(P≡Q)`. Two atoms, four rows.

Note also that only the *second* indemonstrable is given in ordinal form in the entry ("If the 1st, the 2nd. / But not: the 2nd. / Therefore not: the 1st"); the other four ordinal renderings above are reconstructions from its meta-linguistic descriptions.

#### The themata — and Cut is one of them

An argument is a *syllogism*, for the Stoics, exactly when it is an indemonstrable **or reduces to one by the themata**. That two-tier architecture — five rules plus four *metarules* plus a reduction procedure — is a natural-deduction system in outline, 2,200 years early.

- **First thema** (antilogism): when a third follows from two, then from either together with the contradictory of the conclusion, the contradictory of the other follows. Verified: **holds for all 8 qualifying truth-functions**, zero failures.
- **Third thema — Cut, and SEP says so in as many words**: "This is an inference rule of the kind today called cut-rule. It is used to reduce chain-syllogisms." Verified over all qualifying pairs of truth-functions: **64 hold, 0 fail.** The entry adds that the second and fourth themata are also cut-rules.

So three of the four themata are Cut variants and one is antilogism. Worth a remark in the Fitch unit: their metarule sits exactly where ours does — needed for chaining, and (for us) eliminable.

#### Stoic validity: what they counted and we do not

Their criterion is **not truth-functional**: an argument is valid when the *Chrysippean* conditional from the conjunction of premises to the conclusion is correct, and a Chrysippean conditional is true "when the contradictory of the consequent is incompatible with its antecedent."

| Case | Our verdict | Theirs |
|---|---|---|
| `P ⊢ P` | VALID (it is our Reiteration) | **Not an argument at all** — their definition demands ≥2 premises and a conclusion different from them |
| `P∨Q, P ⊢ ∼Q` | **INVALID** | Indemonstrable |
| ex falso; verum ex quolibet | VALID | Rejected in effect — SEP: "the Stoic deductive system shows strong similarities with relevance logical systems" |
| `P∨∼P, P ⊢ P` (the "useless" argument) | VALID | VALID — the Peripatetics called it useless; the Stoics said if it reduces, it is valid |

And the deepest difference, verbatim: "although their logic is a propositional logic, they did not intend to provide a system that allows for the deduction of all propositional-logical truths, but rather a system of valid propositional-logical **arguments with at least two premises and a conclusion**." **Chrysippus built a consequence system, not a theorem system** — so our `⊢ND`, which proves tautologies from no premises at all, is on their measure a departure.

They did accept, all verified: `∼∼P ≡ P`, `P ⊃ P`, `P ∨ ∼P`, and contraposition. Accepting `P ⊃ P` separates them cleanly from **connexive** logic even as they resemble relevance logic (§6).

#### Philo, and the origin of the material conditional

The entry gives **three** ancient accounts of the conditional, not four:

| Account | Statement | House |
|---|---|---|
| **Philonian** | "false *when and only when* its antecedent is true and its consequent false, and true in the three remaining truth-value combinations" | `P ⊃ Q` |
| **Diodorean** | "true if it neither was nor is possible that its antecedent is true and its consequent false" | needs `□` |
| **Chrysippean** | "true when the contradictory of the consequent is incompatible with its antecedent" | not truth-functional |

**Philo's is our material conditional, defined row by row, c. 300 BCE** — and Chrysippus's rendering of it as `∼(P & ∼Q)` (verified equivalent) gives the interdefinability exercise for free. That is the best attribution line available for the `⊃` lecture, and it is not 1879.

⚠️ **The fourth account you may expect — Sextus's "emphasis"/inclusion criterion — is NOT in this entry.** Only three are given.

Two more gifts. The **scope rule**, verbatim: "What type of assertible an assertible is, is determined by the connective or logical particle that controls it, i.e. that has the largest scope. 'Both not p and q' is a conjunction, 'Not both p and q' a negation." That is our main-connective drill, with a worked minimal pair, in the third century BCE. And **Stoic negation is external**: their negation of "Dion is walking" is "*Not*: Dion is walking", while "Dion is not walking" gets a Russellian analysis as "Dion exists **and** not: Dion is walking" — an existential-import point about singular terms that connects this section to the next.

#### The square of opposition — both readings, every relation

The entry's central historical thesis is that the traditional square was **never incoherent**. On the traditional reading, affirmatives carry import and Aristotle's **O** form is "*Not every S is P*" — the plain contradictory of A. Verified exhaustively over all 84 monadic models with |D| ≤ 3:

| Relation | **Boolean** | **Traditional** |
|---|---|---|
| contradictory A/O (both directions) | **HOLDS** | **HOLDS** |
| contradictory E/I (both directions) | **HOLDS** | **HOLDS** |
| contrary A/E | **FAILS**, 14 models | HOLDS |
| subcontrary I/O | **FAILS**, 14 | HOLDS |
| subalternation A→I | **FAILS**, 14 | HOLDS |
| subalternation E→O | **FAILS**, 14 | HOLDS |
| conversion *per accidens* A | **FAILS**, 14 | HOLDS |
| simple conversion of E | HOLDS | HOLDS |
| simple conversion of I | HOLDS | HOLDS |

**Exactly the two contradictories survive the Boolean reading. Everything else on the square collapses, and all of it on the same 14 models — precisely those where S is empty.** On the traditional reading **every relation holds, with zero countermodels.**

So the traditional square is not confused or pre-logical. It is a **consistent alternative semantics** differing from ours in one place: whether A carries import, and hence what O says about empty subjects. SEP: "**The ancients thus did not see the incoherence of the square as formulated by Aristotle because there was no incoherence to see.**" The corruption is later and traceable — Boethius translated O faithfully as "Not every man is white" but glossed it as "Some man is not just," "so this must have seemed to him to be a natural equivalent in Latin."

**And the two readings are not nested.** Verified: contraposition of A is **Boolean-VALID and traditionally INVALID** (11 countermodels, smallest D={0}, S={0}, P={0} — Buridan's "Every man is a being" ⟹ "Every non-being is a non-man", which fails for want of import in the empty term). Subalternation goes the other way. **Boolean logic loses subalternation and gains contraposition; traditional logic has subalternation and loses contraposition.** This kills the tempting simplification that the traditional square is just the modern one plus import.

#### The twenty-four moods, and the nine that need import

Verified over all 584 three-predicate models, |D| ≤ 3. **Fifteen valid on the Boolean reading; twenty-four on the traditional. The gap is exactly nine**, and each countermodel count is 39/584:

| Mood | Figure | Import premise it needs |
|---|---|---|
| Barbari | AAI-1 | `∃x Sx` |
| Celaront | EAO-1 | `∃x Sx` |
| Cesaro | EAO-2 | `∃x Sx` |
| Camestros | AEO-2 | `∃x Sx` |
| Darapti | AAI-3 | `∃x Mx` |
| Felapton | EAO-3 | `∃x Mx` |
| **Bramantip** | AAI-4 | **`∃x Px`** — the *major* term |
| Fesapo | EAO-4 | `∃x Mx` |
| Camenos | AEO-4 | `∃x Sx` |

All nine verified **INVALID** bare and **VALID** with the premise named. Three structural facts worth stating:

1. **No mood goes the other way.** Traditional validity strictly extends Boolean validity across the 24 moods — unlike contraposition, which does go the other way.
2. **The nine are exactly the moods with a particular conclusion from two universal premises.** One line, and students have the diagnostic.
3. **The import premise is not always `∃x Sx`.** Bramantip alone needs the major term — and verified: **supplying `∃x Sx` instead leaves it invalid** (36 countermodels). That makes it the best single exercise of the nine.

SEP's own note on why the syllogistic cannot settle the O form: Aristotle "did not discuss weakened forms of syllogisms… **the weakened forms were typically ignored**." So five of the nine are not Aristotle's at all — they are the tradition's, and their status is exactly what his own text leaves open.

#### Smiley against Strawson — the best exercise in the square entry

Strawson's rescue: sentences with empty subjects lack truth value. Smiley's refutation is a five-step chain, each step a named traditional rule, from a truth to a falsehood:

> "No man is a chimera" → *convert* → "No chimera is a man" → *obvert* → "Every chimera is a non-man" → *subalternate* → "Some chimera is a non-man" → *convert* → "Some non-man is a chimera."

Verified: the end-to-end sequent is **INVALID** (any model with the chimera-extension empty), and the offending step is isolated — the **subalternation**. Students find the culprit by testing each link. Two predicates, |D| = 1 suffices. Smiley's own moral: Strawson "preserv[es] certain patterns commonly identified as constituting traditional logic, but at the cost of sacrificing the application of logic to extended reasoning."

#### Ecthesis, and a nice connection to `∃E`

The medieval entry's ecthesis rule `∀x(Cx⊃Ax), ∀x(Cx⊃Bx) ⊢ ∃x(Ax&Bx)` is **Darapti in disguise** — same shape, same failure, same repair. Its medieval replacement, the **expository syllogism** ("Every B is A; every B is C; *b* is A; *b* is C; so some C is A"), is naked existential instantiation: **the singular term is the import premise, smuggled in as a name.** SEP records that medieval logicians "preferred proofs through expository syllogisms." That is a sharp point for the `∃E` rule — the medievals discharged import by naming a witness, exactly as Fitch does.

⚠️ **Existential import is essentially absent from the medieval-syllogism entry.** It names Darapti, Felapton, Fesapo, Bramantip and develops *suppositio*, but never raises empty terms. The `square` entry is the sole source of the three. And ⚠️ that entry gives **proposition-type-relative** import (affirmatives yes, negatives no) — **not** a modern term-relative theory in which some predicate letters are stipulated non-empty. Do not attribute the latter to it.

**Every countermodel in this entire section is available at |D| = 1 or 2.** Nothing needed three objects.

### 2.9 Proof theory, harmony, and what Gödel does *not* say

*SEP: proof theory · proof-theoretic semantics (Schroeder-Heister) · Gödel's incompleteness theorems.*

⚠️ **Sourcing first, because it is unusual.** The current proof-theoretic-semantics entry **does not contain** Belnap's conservativeness constraint, Prior's 1960 paper by name, Dummett's stability formulation, the local/global harmony distinction, or the objection that conservativeness presupposes a prior consequence relation. Tonk gets one sentence; Belnap appears only for Display Logic. The material below is marked where it comes from elsewhere.

#### Two corrections to what §2.2 says about harmony

**There is no "Gentzen's inversion principle."** The term is Lorenzen's, adapted by Prawitz. Gentzen's own remark is programmatic: "The introductions represent, as it were, the 'definitions' of the symbols concerned, and the eliminations are no more, in the final analysis, than the consequences of these definitions." And SEP inserts the disclaimer worth putting on a slide: *"This cannot mean, of course, that the elimination rules are **deducible** from the introduction rules in the literal sense of the word; in fact, they are not. It can only mean that they can be **justified** by them in some way."* Students hear "eliminations follow from introductions" and take it as a derivability claim.

**Prawitz's inversion principle is a claim about the existence of a reduction** — that a derivation of an elimination rule's conclusion can be had without that rule when the major premiss came from an introduction. So inversion *is* the detour-reduction step of normalization. That identity is what makes the next subsection work.

**Prawitz's and Dummett's formulations come apart in three ways** (this taxonomy is from Dummett 1991, not SEP): *locality* — inversion is a condition on one I/E pair, conservativeness is a condition on the system; *direction* — inversion is I-first and silent on E-rules being too *weak* (give `&` its usual I-rule and only the left E-rule: inversion is satisfied, and you can put `B` in and never get it out); *priority* — Dummett's **stability** is the demand that the verificationist and pragmatist routes converge. The compact version: *inversion is a fact about reductions; harmony is a demand about balance; stability is harmony in both directions; total harmony is conservativeness.*

#### General elimination rules — why the tonk debate ends where it does

The GE recipe puts every E-rule in the shape of `∨E`: take the compound as major premiss; for each I-rule, add a minor premiss deriving an arbitrary `C` from that I-rule's premisses; conclude `C`. All four verified valid. On this format **harmony is not a further test — it is guaranteed by construction**, because the E-rule is read off the I-rule mechanically. Given `∨I` as tonk's introduction rule the recipe returns exactly the projection, which is §2.2's result with a citation: SEP's *logical constants* entry states it and attributes it to Prawitz — "we can stipulate the introduction rule for 'tonk', but must then content ourselves with the strongest elimination rule for which such a procedure is available: *A* tonk *B* / *A*."

And an elegant by-product: on the higher-level-rules view, **`⊥` is the connective with no introduction rules at all**, so its GE rule has no minor premisses — which *is* ex falso.

**Belnap's reply has three parts, and students are usually told only the second** (Belnap 1962, not in SEP): (i) the question is only well-posed relative to "an antecedently given context of deducibility," fixed by the structural rules; (ii) **conservativeness** — the extension must prove no *old-vocabulary* sequent that was not already provable, and tonk fails at once since `p ⊢ q` is tonk-free; (iii) **uniqueness** — two connectives satisfying the same rules must be interderivable. The slogan: **conservativeness answers "does it exist?"; uniqueness answers "is it one thing?"**

**The objection, and it has a verifiable counterexample.** Dummett, Read, Milne and Steinberger all press that conservativeness is *extrinsic* — a property relative to a base — so an inferentialist cannot certify rules by appeal to a background logic whose constants are already meaningful. The decisive case: add classically harmonious negation rules to the pure `{⊃}` fragment of intuitionistic logic and you prove **Peirce's law**, which is stated in the *old* vocabulary and is not intuitionistically derivable. **Local harmony does not entail global harmony.**

#### Normalization, the subformula property, and how far the truth-tree analogy goes

The theorems, verbatim: *"A proof of A from a set of assumptions Γ can be transformed into a normal proof of A from the same set of assumptions"* — **for intuitionist logic**, note the scope in the title — with the corollary that every formula in a normal proof is a subformula of Γ or of A. The sequent counterparts are the *Hauptsatz* and its subformula corollary, plus **Corollary: the empty sequent is not provable**, i.e. cut elimination yields a consistency proof outright.

**Why Gentzen could not do it for classical ND, in his own words:** "To be able to formulate it [the *Hauptsatz*] in a direct way, I had to base it on a particularly suitable logical calculus. The calculus of natural deduction turned out not to be appropriate for that purpose." So he invented the sequent calculus, where **classical logic needs no extra rule at all** — only the structural permission of more than one formula on the right — and where, as SEP puts it, "the secret to Gentzen's *Hauptsatz* is the symmetry of left and right rules." Normalization for classical ND came later (Prawitz 1965) and only for the fragment **without `∨` and `∃`**; for full classical logic you must first push them away via De Morgan. SEP states the price plainly: that leads "essentially to a logic without proper disjunction," and no proper existential quantifier either. **An excellent Grand Comparison row.**

**On the analogy I proposed for Lecture 12 — it is partly right, and here is the honest form.** What is exactly right: the unifying notion is *analyticity*, and the subformula property is genuinely the same property in trees, normal ND proofs and cut-free sequent proofs. Three corrections:

- **The tight sibling is cut-free sequent calculus, not normalization.** Read a tree rule bottom-up and it *is* a sequent rule; a branch is a sequent, a closed branch an axiom. That is a correspondence. Normalization is a proof-*transformation* result presupposing you already have a proof, whereas tree-building is proof *search*. Say "normal-proof search" and the claim is defensible.
- **For classical logic the analogy runs the wrong way.** Our trees are classical and have the subformula property; classical *natural deduction* does not, because classical reductio "undermines the subformula principle." **The classical truth tree is analytic exactly where classical ND is not.** That is not a problem — it is the sharpest available statement of why trees and Fitch feel so different in this course despite proving the same theorems.
- **"Which is why trees terminate" holds for propositional logic and fails for predicate logic.** The subformula property bounds the *stock* of formulas; termination also needs that stock finite. For first-order trees the `∀` rule is reusable with new terms and trees need not terminate — which is Church's theorem, not a defect of the notation.

**Safe lecture formulation:** *Truth trees and normal-form proofs are two faces of one idea — analyticity. A tree decomposes; it never invents. That shared property is why the propositional tree method terminates and hence decides. It is also a property classical natural deduction does not have, because double-negation elimination introduces a formula that is nobody's subformula. The calculus that is both classical and analytic is Gentzen's sequent calculus, of which the truth tree is a notational variant.*

#### The classical/intuitionistic fork, proof-theoretically

SEP opens flatly: **"Proof-theoretic semantics is intuitionistically biased"** — because natural deduction itself is, "in the sense that the straightforward formulation of its elimination rules is the intuitionistic one."

**The deepest argument is the indeterminism of `∨`, and it is directly checkable with our apparatus.** SEP: "*A*∨*B* can be inferred from *A* as well as from *B*. Therefore, if the disjunction laws were the only way of inferring *A*∨*B*, the derivability of *A*∨¬*A* … would entail that of either *A* or of ¬*A*, which is absurd." Verified: `⊢ A ∨ ∼A` **VALID**; `⊢ A` **INVALID** (CM A=F); `⊢ ∼A` **INVALID** (CM A=T). That triple is the whole argument on one slide — classical logic asserts the disjunction while asserting neither disjunct, so its `∨I` rules cannot be the only route to `∨`.

**Can classical logic be justified proof-theoretically at all?** SEP's answer is more balanced than the Dummettian line: move to the multiple-succedent sequent calculus and "**classical logic appears to be perfectly justified**" — *but* "only if reasoning is appropriately framed as a multiple-conclusion process, even though this does not correspond to our standard practice," and the intuition for that "is hard to maintain and cannot be formally captured without serious difficulties."

**A warning worth giving:** *"As Karl Popper was the first to observe, the simple combination of rules for classical and intuitionistic connectives collapses into the classical system."* Students who propose "just have both kinds of negation" should meet this.

**And a closing beat for a lecture that also covers Gödel: proof-theoretic semantics is itself incomplete.** Prawitz conjectured that the proof-theoretically valid consequences are exactly the intuitionistic ones; **the conjecture is false.** Harrop's rule — verified classically valid here — is *admissible but not derivable* in intuitionistic logic, and can be validated in the proof-theoretic framework. So intuitionistic logic is incomplete for Prawitz-validity.

#### Gödel — and the one thing students always get wrong

**The real conditions**, because the mis-statements live here:

| Condition | What it actually is | The common error |
|---|---|---|
| **Effective axiomatizability** | the axiom set must be decidable | Silently dropped. Th(ℕ) is complete and consistent — it just isn't axiomatizable. Incompleteness is a theorem about **r.e. theories**. |
| **Consistency** | plain consistency suffices for both halves, **since Rosser 1936** | "ω-consistency is needed." It was, in 1931. Not since. |
| **Enough arithmetic** | **Q** suffices for the first theorem — seven axioms, **no induction at all**; PRA for the standard proofs of the second | "It needs PA." Far more general than that. |
| **Interpretability, not containment** | Q need only be *interpretable* in the system | "It's about arithmetic." It's about anything that can code arithmetic. |

Two further precision points: **classical logic is not required** — the theorems "also apply to systems with, e.g., intuitionistic logic"; and **the second theorem is intensional** — it says the *canonical* Cons(F), built from a provability predicate satisfying Löb's derivability conditions, is unprovable. Do not say "no theory can prove its own consistency" full stop; with Rosser's provability predicate one can.

**On "true but unprovable", SEP is blunt:** *"A common misunderstanding is to interpret Gödel's first theorem as showing that there are truths that cannot be proved. This is, however, incorrect."* The theorem says only: not provable in F and not refutable in F. Truth is an *additional* claim, argued in the metatheory using resources F lacks. SEP also punctures the self-reference gloss — Gödel sentences "do not really say anything substantial about themselves," since "one is usually operating here with mere material equivalences."

**And the table this section exists for.**

| | **Propositional logic** | **First-order logic** | **PA / any r.e. theory interpreting Q** |
|---|---|---|---|
| Complete (⊢ = ⊨)? | **Yes** | **Yes** — Gödel 1929 | the *logic* is; the *theory* isn't negation-complete |
| Decidable? | **Yes** — truth tables | **No** — Church. But r.e., *because* of completeness | **No**, essentially undecidable |
| Negation-complete? | **No — trivially.** `p` is contingent | **No — trivially.** `Fa` is contingent | **No — and essentially.** This is Gödel |
| First theorem applies? | **No.** Cannot interpret Q | **No.** Pure logic proves no arithmetic | **Yes** |
| Second theorem applies? | **No** — and its consistency is provable by truth tables | **No** — cut elimination gives a consistency proof outright | **Yes** |

**Three things to say out loud.** (1) **Gödel's theorems say literally nothing about truth tables.** The hypothesis is that Q is interpretable; a propositional language has no apparatus to interpret Q. There is no version lurking. (2) **Both propositional and first-order logic fail negation-completeness for a boring reason** — `p` is contingent. Separate that from Gödel's on the first slide or students conflate them all term. (3) **The two "complete"s are different words**: the completeness theorem is *semantic completeness* of a **logic** (⊢ captures ⊨); incompleteness is *negation-completeness* of a **theory**.

**The relationship, stated so it cannot be misread.** Two different sets are at issue. The first-order validities are **r.e.** — and r.e. *precisely because* completeness lets you enumerate them by enumerating proofs. Th(ℕ) is **not r.e.**, so no r.e. axiom set has it as its consequences: that is the first incompleteness theorem in one line. No tension, because they are not the same set.

Better still, **completeness tells you what incompleteness means semantically**. Because ⊢ = ⊨ for first-order logic, PA ⊬ G immediately yields PA ⊭ G — so **there is a model of PA in which G is false**, and it is not ℕ. It is a nonstandard model, containing "'infinite' non-natural numbers after the natural numbers." So: **incompleteness is not a defect in the deductive machinery — the machinery is provably perfect. It is a defect in the axioms' ability to pin down ℕ, and the completeness theorem is what lets us see that it is a defect of that kind.** If a student says "Gödel showed logic is incomplete," the reply is: no — logic is complete, arithmetic is under-axiomatised, and the same man proved both, two years apart, without noticing a contradiction, because there isn't one.

**A punchline, if one is wanted.** The first *natural* mathematical statement independent of PA was not Paris–Harrington but **Gentzen's**: transfinite induction up to ε₀ proves PA's consistency, hence by the second theorem is itself unprovable in PA. The man who invented natural deduction and the sequent calculus also produced the first natural Gödel-independent sentence.

### 2.10 The predicate half: free logic, second-order logic, generalized quantifiers

*SEP: logic: free · logic: second-order and higher-order (Väänänen) · generalized quantifiers.*

#### Free logic — and a correction to what this file previously recorded

The Imports companion recorded, from Restall ch. 13, that `∀x(Hx ⊃ ∼Fx), Ha ⊬ ∼Fa` in free logic. **That is right for *positive* free logic and wrong as a general claim.** Verified with a dual-domain checker (outer domain ≤ 3, all inner subsets, all extensions, all denotations):

| Variety | `∀x(Hx ⊃ ∼Fx), Ha ⊢ ∼Fa` |
|---|---|
| **positive** | **INVALID** — 162 countermodels of 486 premise-true cases; smallest has the name denoting an outer-only object that is both H and F |
| **negative** | **VALID** — 162 premise-true cases, none bad |

The reason is not that negative free logic keeps unrestricted specification (it doesn't). It is that in negative free logic **an atomic sentence about a non-existent is false**, so `Ha` already entails `E!a` and the premise set does the guarding for you. Hypothetical syllogism survives in **both** varieties, as recorded — verified, 726 premise-true cases each, zero countermodels.

**The single schema that separates all three varieties** is `Pa ⊃ E!a`: verified **INVALID** in positive free logic, **VALID** in negative, and truth-valueless in neutral. Better than needing three separate forms.

Two more verified results worth having:

- **`∃x(x = a)` fails in both positive and negative free logic — for opposite reasons.** Positive: `a = a` is true of the non-existent, and the existential still fails. Negative: `a = a` is itself false. Same verdict, different diagnosis, and that contrast is a good exam question.
- **Inclusive logic is genuinely orthogonal.** `∀xFx ⊢ ∃xFx` is **VALID** in free logic as long as the inner domain is non-empty (498 premise-true cases, clean) and **INVALID** the moment the empty domain is admitted. Empty *names* and an empty *domain* are two separate departures from classical logic, and the course should not run them together.

Also reported and worth flagging: **neutral free logic has no logical truths at all** — `A ⊃ A`, `A ∨ ∼A`, `∼(A & ∼A)` all fail — while modus ponens, modus tollens, disjunctive syllogism and hypothetical syllogism all survive. **The rules live; the theorems die.** That is an unusually sharp instance of the rule/theorem distinction this file keeps running into (§4.2's K3/LP grid, §4.4's gamma, §2.8's Stoic consequence-not-theorem system).

#### Second-order logic — and a phrase to strike from the lecture

⚠️ **"Second-order logic is incomplete" should not be said.** It collides in students' heads with Gödel incompleteness, which §2.9 has just spent a page separating from the completeness theorem. What is true is more specific: on **standard (full) semantics**, second-order logic has no sound and complete effective proof system, and compactness and Löwenheim–Skolem fail. On **Henkin (general) semantics** — where the second-order quantifiers range over a designated collection of subsets rather than the full power set — completeness, compactness and Löwenheim–Skolem all return, and second-order logic becomes, in effect, a many-sorted first-order logic. The cost is that the categoricity results which made second-order logic attractive are exactly what you give up.

⚠️ **A finite-domain caveat worth stating explicitly**, or a sharp student will build the toy model and conclude Henkin semantics is broken: `∀X(Xa ≡ Xb) ⊃ a = b` is valid on all full models with |D| ≤ 3, and fails on the general model with D = {0,1} and only `{∅, D}` in the second-order range — but **that model is not a Henkin model**, because it falsifies the comprehension instance `∃X∀x(x = a ≡ Xx)`. Henkin models must satisfy comprehension; the toy model doesn't.

#### Generalized quantifiers

"Most" is **not first-order definable**, and the reason is checkable in outline: the Ehrenfeucht–Fraïssé characterisation, confirmed on 630 part-profile pairs, with `most` verified equivalent to its Σ¹₁ injection definition on 1365 finite models. **Monotonicity** is the teachable part: the computed signatures reproduce van Benthem's `−every+`, `+some+`, `−no−`, `·most+` exactly — i.e. "every" is downward-entailing in its first argument and upward in its second, "some" upward in both, "no" downward in both, and "most" is *not* monotone in its first argument at all. That is a genuinely good explanation of why "some" and "all" behave differently under narrowing, and it is a fact about which inferences are licensed rather than a piece of linguistics. Conservativity fails for the reported MO and I quantifiers, as the entry says.

### 2.11 Model theory, Tarski on truth, and what Lecture 12 can honestly claim

*SEP: model theory (Hodges) · Tarski's truth definitions (Hodges) · truth (Glanzberg).*

⚠️ **The most load-bearing result of this batch is a set of absences**, so it goes first. Across ~30,000 words: the **domain problem** is not stated or alluded to; **Etchemendy's dilemma** is not in any body text (Etchemendy 1990 sits uncited in a bibliography); and **Kreisel's squeezing argument** appears nowhere — Kreisel 1969 is a bibliography line, and the word "squeez-" occurs in none of the three. Soundness is never named; compactness and Löwenheim–Skolem are named only in passing; upward Löwenheim–Skolem is never mentioned. **These are philosophy-of-logic entries, not logic entries** — they discuss the consequence relation rather than exhibiting instances of it. Total harvest of stateable forms: one invalid, one valid.

#### Convention T — and the two entries state it differently

Worth a slide, because the discrepancy is useful. **Glanzberg's** version is the familiar one — "⌜φ⌝ is true if and only if φ" — with the gloss that it is "an adequacy condition for theories, **not a theory itself**," guaranteeing the truth predicate is **extensionally correct**. **Hodges'** version is closer to Tarski's own and does *not* use "is true" on the left: `φ(s) iff ψ`, where *s* names a sentence and *ψ* is its copy in the metalanguage. The teachable difference: Glanzberg's φ is a *sentence*, Hodges' is the *candidate defining formula*.

Hodges makes the apparent regress explicit — if we can prove all the biconditionals from the metalanguage axioms, we must already have a materially adequate "true sentence of L" in the metalanguage — and names the escape: the technical problem is "to find a **single** formula φ" from which all of them follow.

And **formal correctness**, which students always miss: the definition must read "For all *x*, True(*x*) iff φ(*x*), **where True never occurs in φ**." That non-occurrence condition is what makes it a definition rather than an axiom. One line, worth a slide.

#### Why satisfaction and not truth — the cleanest statement available

> "Compositionality explains why Tarski switched from truth to satisfaction. You can't define whether 'For all *x*, *G*' is true in terms of whether *G* is true, because in general *G* has a free variable *x* and so **it isn't either true or false**."

With the reduction back: "if the formula *F* has no free variables, then to say that *F* is true is to say that **every** assignment satisfies it." And a caution — saying "satisfaction is defined recursively" "misses the central point," which is compositionality.

State the constraint *before* the clauses, not after: the definition must be given "in terms of syntax, set theory and the notions expressible in *L*, **but not semantic notions like 'denote' or 'mean'**." That prohibition is exactly what forces the detour through satisfaction. And the conclusion: "a truth definition for a language *L* has to be given in a metalanguage which is **essentially stronger** than *L*."

**Verified:** the entry's toy propositional truth definition (two base clauses, `∨` and `∼`) reproduces the classical `&` table via `∼(∼φ ∨ ∼ψ)` on all four rows, zero mismatches. So it is safe to reproduce on a slide as-is — a genuine, tiny worked example of a recursive truth definition for an infinite language from four clauses.

#### The one objection that survives, and the one form worth having

**On my earlier note that only the logical-constants problem is teachable at this level: agreed, and the reason is stronger than I had it.** Only that one is *in these sources at all*. The other two can be retired from the Lecture 12 reading list rather than merely demoted.

It is present and quotable. On Tarski 1936: "**He left it undetermined what symbols count as nonlogical**; in fact he hoped that this freedom would allow one to define different kinds of necessity." Hodges then presses an objection more first-year-friendly than the standard one — Tarski wants his primitives "by stipulation unanalysable," and then:

> "But then by stipulation it will be **purely accidental** if his notion of logical consequence captures everything one would normally count as a logical consequence."

**And the best single thing in these three entries for a Lecture 12 audience:**

> "If you formalise your argument in a way that is **not** a model-theoretic consequence, it doesn't mean the argument is not valid. It may only mean that you **failed to analyse the concepts in the argument deeply enough** before you formalised."

His worked example is from Peter of Spain and Hilbert & Ackermann: "There is a father, therefore there is a child" formalised as `∃xSx ⊃ ∃xFx` "is doomed to failure." **Verified INVALID** — 11 countermodels over all 84 interpretations with domains ≤ 3, every one with the father-extension empty, **the smallest being a one-element domain containing exactly one thing which is a son and not a father.** That is the only genuinely invalid form these entries offer, and it is a good one: invalid, intuitively compelling, and the gap is *conceptual* rather than logical.

⚠️ **On the domain problem, Hodges gives a line that actively cuts against raising it:** "**model-theoretic truth is parasitic on plain ordinary truth, and we can always paraphrase it away**," since "*S* is true in *I*" just paraphrases "*S*, when interpreted as in *I*, is true." A student who accepts that will not feel the pull of "but the actual world isn't a set." Cut it.

#### What a model IS — Hodges §1 is directly usable

An interpretation consists of exactly two things: **(a) what objects some expressions refer to**, and **(b) what classes some quantifiers range over**. "Interpretations that consist of items (a) and (b) are known as **structures**," and the domain is defined off (b). Three details that are cheap to state and prevent later confusion:

1. **Labels are part of the structure**: "the objects and classes in a structure carry labels that steer them to the right expressions… **These labels are an essential part of the structure.**" A structure is not a bag of sets; it is a *labelled* bag.
2. **The quantifiers sit at the middle level**, with the nonlogical constants rather than the logical ones, "since we need to refer to the structure to see what set they range over" — which is why the domain is not part of the language.
3. **Two directions of definition**: fix the sentence and vary the structure, and you define a *class* of structures; fix the structure and vary the assignment, and you define a *relation inside* it. Same machinery, two uses — the cleanest first-year account of the ⊨ / satisfaction split I have seen.

A footnote worth having, given our house conventions: "**The double use of ⊨ is a misfortune**… model theorists often avoid the double use by using ⊢ for model-theoretic consequence." Students will hit exactly this collision, and it is reassuring to hear that professionals find it awkward too.

And an informal characterisation of first-order logic that could stand in for a compactness discussion: it is "the unique logic with two properties: (1) we can use it to express arbitrarily complicated things about finite patterns, and (2) it is **hopeless for discriminating between one infinite cardinal and another**."

#### The squeezing argument — re-source it, and state the restriction

**It is not in these entries.** If Lecture 12 leans on it, cite Kreisel 1969 (or Smith 2011) directly. Do not imply this entry endorses it — on the substantive middle inclusion Hodges is closer to sceptical than supportive, per the "purely accidental" passage above. (It *is* attributed to SEP *Logical Truth* in §2.4 of this file, from a different agent's read; treat that as the source, not model theory.)

**Where the squeeze breaks** — four points, two of which matter here:

1. **It needs completeness, so it is first-order only.** The argument is a sandwich whose slices are soundness and completeness. In second-order logic with standard semantics there is no completeness theorem and the sandwich falls open. **This is the break that matters for how Lecture 12 states the claim: the coincidence of ⊨ and ⊢ND is a fact about *this* logic, not about logic.** True, teachable, and first-year-sized — and it connects directly to §2.10.
2. It presupposes that **set-sized structures suffice** — the domain problem wearing a different hat. So if the domain problem is cut, do not advertise the squeeze as *proving* the coincidence; advertise it as *organising* it.
3. It presupposes a settled logical/nonlogical division — the objection that *is* being kept.
4. **It delivers coextensiveness, not analysis.** One sentence, no machinery: *showing that two things always agree is not the same as showing that one explains the other.*

#### Is the truth-table method committed to a correspondence theory? — No, and here is the better answer

This is the strongest immediately usable result in the batch, and SEP answers it directly. On Tarski's machinery: "**Tarski's apparatus is in fact compatible with theories of truth that are certainly not correspondence theories.**" And the money quote for Lecture 2:

> "**Convention T, in particular, does not discriminate between realist and anti-realist notions of truth.** Likewise, the base clauses of a Tarskian recursive theory are given as **disquotation principles, which are neutral** between realist and anti-realist understandings of notions like reference.

Field's diagnosis: the base clauses "have an air of triviality," and "**By itself, Tarski's theory does not offer an account of reference and satisfaction at all**." To get correspondence out you must *add* a theory of what makes a name refer.

Cashed out for a truth table: it has exactly two moving parts — an assignment of T/F to atoms, and the connective clauses — and **neither says anything about why an atom gets T**. Correspondence with facts, Field-style causal correspondence, verificationism, minimalism, pragmatism and truth pluralism all license the same 2ⁿ rows.

**But the answer has a second half, and it is the interesting one. The method is not neutral about *bivalence*.** SEP: "one important mark of realism is that it goes together with the principle of bivalence," and Dummett "has made this the characteristic mark of realism" — while "the verificationist notion of truth does not appear to support bivalence." So writing a two-valued table for every atom, with no gaps and no third value, **is already a substantive commitment — just not a correspondence one.** That reframing turns a deflating answer into a live one: *no, the table does not smuggle in a metaphysics of facts; here is what it does smuggle in, and here is a philosopher who thinks that assumption is the whole of realism.* It also connects straight to §3.8.

Two more for Lecture 2. Tarski's work "lays the ground-work for the modern subject of model theory — **a branch of mathematical logic, not the metaphysics of truth**." And for a student who has heard Tarski solved truth, Putnam's assessment as SEP reports it — "**As a philosophical account of truth, Tarski's theory fails as badly as it is possible for an account to fail**" — presented, as SEP does, as "one rather drastic negative assessment," a live minority view.

⚠️ **One caution, and it makes a nice exercise.** "The Tarski biconditionals themselves are simply **material biconditionals**" — unlike Ramsey's equivalence thesis, which identifies the two sides. **Verified:** treating "⌜φ⌝ is true" as an atom `t` and φ as `p`, the biconditional `t ≡ p` is **not** a tautology — 2 countermodels of 4. So if a student asks "isn't ''snow is white' is true ≡ snow is white' just a tautology?", the answer is no, and SEP confirms it is a live dispute.

### 2.12 Decidability — the triangle, and what Church's theorem does not rule out

*SEP: Church–Turing thesis (+ its supplement *The Rise and Fall of the Entscheidungsproblem*) · computability and complexity · Turing machines.*

#### The triangle, stated so a first-year cannot misread it

| | Definition | Which half of the course |
|---|---|---|
| **Decidable** | a **total** machine halting on every input with a correct yes-or-no | **propositional logic** |
| **Recursively enumerable** | a machine that **lists** the members — on a non-member it may run forever, never saying "no" | **first-order validity** |
| **Neither** | not even listable | first-order *invalidity*; satisfiability |

The bridge theorem: **"a set is recursive iff it is r.e. and co-r.e."** SEP's argument for it is the one to give students because it is concrete: list the members in one column and the non-members in a second, and to decide whether *n* belongs, "just scan the two columns and wait for *n* to show up." **Decidability = two lists. Recursive enumerability = one list.** First-order logic has one and provably cannot have the second.

And SEP names our own method as the paradigm case of effectiveness: *"A well-known example of an effective method is the truth-table test for tautologousness. In principle, a human being who works by rote could apply this test successfully to any formula of the propositional calculus—given sufficient time, tenacity, paper, and pencils."* Hilbert and Bernays already had a normal-form decision procedure; Peirce had "a much less well-known method"; and — a gift for §2.7 — **Massey (1966) showed Venn's diagram method can be stretched into a decision procedure for the monadic calculus.**

#### Church's theorem in three lines, each an SEP quotation plus a substitution

1. **The validities are r.e.** — because *proofhood* is decidable even though *provability* is not: "since the axioms are easily recognizable, and rules of inference very simple, there is a mechanical procedure that can list out all proofs… **In modern terminology we say that the set of valid formulas of first-order logic is recursively enumerable.**"
2. **The validities are not co-r.e.** — φ is non-valid iff ∼φ is satisfiable, and Church used Gödel's methods to show **the satisfiable formulas are not r.e.**
3. Decidable = r.e. **and** co-r.e. One fails. **Therefore undecidable.** ∎

Church's own statement: *"The general case of the Entscheidungsproblem of the engere Funktionenkalkül is unsolvable."*

**Two things worth saying about step 1.** First, it is a **second job the completeness theorem does** in this syllabus, alongside §2.9's — and a third: Turing and Church stated the problem via *provability*, Hilbert and Ackermann via *validity*, and "**this equivalence is a consequence of Gödel's proof**." Students who met ⊨ and ⊢ND separately will not otherwise see why the two versions of "undecidable" are the same claim. Second, the property doing the work is one students can *see* in their own Fitch proofs: **checking a proof is mechanical drudgery; finding one is not.** That is the entire difference between the two columns.

#### What the theorem does and does not rule out

| Ruled out | **Not** ruled out |
|---|---|
| A uniform mechanical test returning valid-or-invalid for *every* first-order argument | A procedure recognising every *valid* argument — that exists, and it is proof search |
| A "philosophers' stone" deciding provability across mathematics | Decision procedures for **fragments** |
| Hilbert's hope that provability is mechanically settleable in general | Any *particular* formula's validity — every exam question is settleable |

SEP's closing gloss is the best single sentence to hand a first-year: **"In place of the one great unsolvable decision problem, there are many lesser, but often solvable, decision problems."**

Two historical items, both properly sourced and both surprising. **The undecidability of first-order logic was already a corollary of Gödel 1931 and nobody noticed for thirty years** — "More than three decades passed after the publication of Gödel's paper before this corollary of his theorem was noted, by Davis." And **von Neumann conjectured it and could not prove it**: "there is no way to find the general decision criterion," adding that "no clue whatsoever exists how such an undecidability proof would have to be conducted." He was in Cambridge in 1935 and struck up an acquaintance with Turing; SEP raises, without answering, whether he nudged him toward the problem.

#### Monadic first-order logic is decidable — and three cautions before saying so

**"He also knew from the work of Löwenheim that the monadic functional calculus is decidable"** (Löwenheim 1915, improved by Behmann 1922). Since the second half of the course is largely monadic, this is worth telling students. But:

1. ⚠️ **SEP's "monadic" explicitly excludes identity** — the parenthetical lists `=` among the relations that must be absent. Monadic FOL *with* identity does remain decidable, but **that extension is in none of these entries.** Source it before printing.
2. ⚠️ **"At most two individual variables" is a loose attribution.** The Bernays–Schönfinkel class is the ∃\*∀\* prefix class; the decidable two-*variable* fragment is Scott/Mortimer, decades later. Say "certain quantifier-prefix classes."
3. ⚠️ **What this buys the tree method is real but is not an SEP claim**, resting on the finite model property. Phrase it as "the fragment we work in this term."

**Safe wording, and it contains the best pedagogical payoff in this batch:**

> Propositional logic is decidable: truth tables always finish, and so do propositional trees. Full first-order logic is *not* — Church's theorem, 1936 — but it is *semi*-decidable: a tree that closes tells you an argument is valid, and every valid argument's tree eventually closes; **what no method can promise is a finite verdict of "invalid" in every case.** The fragment we actually work in this term is small enough to escape the theorem.

**That asymmetry *is* the r.e./not-co-r.e. asymmetry, made visible in the students' own hands.**

#### The thesis — what kind of claim it is

The four criteria for an **effective method** are worth reproducing verbatim, because they are what makes truth tables the paradigm: finitely many exact instructions; produces the result in finitely many steps; carryable by a human with paper and pencil; and **"demands no insight, intuition, or ingenuity."** SEP concedes this "lack[s] rigor, for the key requirement… is left unexplicated."

Two precision points routinely missed. **The converse is easy and is not the thesis** — "a Turing machine program is itself a specification of an effective method"; the thesis is one-directional. And **Church's and Turing's theses are extensionally equivalent but are two different theses**: "Turing's thesis concerns *computing machines*, whereas Church's does not." Also: "computation" in 1936 meant *human* computation — "these human rote-workers were in fact called 'computers'."

**Not a definition**, on Post's objection: *"to mask this identification under a definition… blinds us to the need of its continual verification."* **Not a theorem**, on Turing's own view — all arguments for it, his own included, are *"fundamentally, appeals to intuition, and for this reason rather unsatisfactory mathematically,"* and its status is *"something between a theorem and a definition. Propaganda is more appropriate to it than proof."* SEP's settlement: **Turing's computation theorem** is demonstrable; deriving the thesis from it would need showing "with mathematical certainty" that his account of human computation is correct, and "so far, no one has done this."

**The misstatements catalogue** is the section this course most needs. The recurring error is conflating the thesis with **Thesis M** — that whatever a *machine* can compute a Turing machine can. Gandy showed Thesis M is **false** for some machines obeying Newtonian mechanics, and it fails for analogue machines. The **Extended** Church–Turing thesis (efficiency) is an **empirical hypothesis** — "neither a logico-mathematical theorem nor a definition. If it is true, then its truth is a consequence of the laws of physics—and it might not be true." And the "**equivalence fallacy**": the analyses that turned out equivalent were analyses of *effective method*, so "the equivalence of the analyses bears only on the question of the extent of what is *humanly* computable."

📌 **And a misattribution worth fixing in any handout: "Turing's halting problem" is not Turing's.** SEP: "although the Halting Problem is very commonly attributed to Turing… **Turing did not in fact formulate it. The Halting Problem originated with Davis in the early 1950s.**" Turing's own problems were CIRC? (is machine *n* circle-free?) and PRINT? (will it ever print 0?).

#### The halting problem is a fourth instance of §5.9's T269

📌 **Correction to §5.9's sourcing:** none of these three entries mentions Grelling. The entry that runs Turing's proof as Grelling's paradox is **self-reference**, and it does so verbatim: *"The proof mimics Grelling's paradox. We call a Turing machine A **heterological** if A doesn't halt on input ⟨A⟩."*

With `Fxy` read as "*x* bears the relevant relation to *y*", all four are `∀x(Fxy ≡ ∼Fxx)` for some `y`:

| Instance | `Fxy` | The witness `y` | What `∼∃y` denies |
|---|---|---|---|
| **Russell** | *x* ∈ *y* | {*x* : *x* ∉ *x*} | that set exists |
| **Grelling** | predicate *x* is true of *y* | "heterological" | that predicate has an extension |
| **Cantor** | *x* ∈ *f*(*y*) | the *c* with *f*(*c*) = *C* | *f* is onto |
| **Halting** | machine *x* halts on ⟨*y*⟩ | the machine built from the decider | the decider exists |

Every one dies at `x := y`, giving `Fyy ≡ ∼Fyy` — **whose two-row table is empty.** So T269 is valid not merely on finite models but because a *propositional* contradiction falls out of one `∀E`. **That is exactly why it is teachable in the second half: the predicate machinery does one step of work and the truth table finishes it.** The discharging schema `p ⊃ (q ≡ ∼q) ⊢ ∼p` is verified valid, as is `d ≡ ∼d ⊢ ⊥`.

⚠️ **One disanalogy to preserve.** In Russell, Grelling and Cantor's *paradox*, the diagonal object is **defined into existence** by a comprehension principle, and the moral is that the principle is unsound. In the halting proof (and Cantor's *theorem*), the diagonal machine is genuinely **constructed** by ordinary programming from the hypothetical decider — so the reductio lands on the **decider**, not on the construction. Same schema, different premise blamed. SEP's structural version: "in the areas of provability and computability, the paradoxes of self-reference turn into **limitation results**."

The route to Church's theorem is therefore: **diagonal → halting/PRINT? → reduce into first-order formulas → undecidability of ⊢.** And SEP is explicit that the reduction leans on the thesis — PRINT? "cannot be decidable (**provided we accept Turing's thesis**)." The undecidability theorem is mathematics about Turing machines; the claim that *no effective method* exists leans on the thesis.

#### Complexity — and what not to say

SAT was the first problem proved NP-complete (Cook 1971). SEP's own calibration is the usable one: "A problem with complexity 17*n* can be handled in under a minute… for every instance of size a billion. On the other hand, a problem with worst-case complexity 2ⁿ cannot be handled in our lifetimes for some instance of size a hundred." And in practice, SAT solvers "can quickly solve many SAT instances… even for instances with millions of variables," while "there are known classes of small instances for which current SAT solvers fail."

**The honest one-sentence version, and the best of three:** *Every extra letter doubles the table, so the method always works and quickly stops being usable — which is exactly why we also teach you trees.* True, motivating, and it makes no complexity-theoretic claim.

⚠️ **Do not say** "truth tables are exponential *because* SAT is NP-complete" — the row count is a fact about the algorithm; a lower bound of that kind is precisely what is **not known** (P ≠ NP is unproved). ⚠️ **Do not say** "trees are more efficient than tables" as a complexity claim: tableau methods have exponential worst cases too. "Usually much shorter" is the honest phrasing.

### 2.13 Why is logic binding? — Harman's challenge and the bridge principles

*SEP: the normative status of logic (Steinberger), plus its supplement *Bridge Principles – Surveying the Options* · logic: inductive (Hawthorne).*

**This is the Lecture 1 question the course currently assumes an answer to.** A logic is "a specification of a relation of logical consequence" — a *descriptive* object, a relation between propositions. Whether it "has normative authority over us" is a further question, and Frege ("prescribe universally how one should think if one is to think at all") and Kant are the tradition to be examined, not the answer.

**Harman's challenge is diagnostic, not sceptical.** Our sense that logic bears specially on reasoning "is rooted in a confusion" between two enterprises:

| | Deductive logic | Theory of reasoning |
|---|---|---|
| Subject matter | "relations among propositions" — static, non-psychological | "psychological events or processes" |
| Aim | which Γ ⊨ C hold | "which mental actions to perform… which beliefs to adopt or to abandon" |

The quotation for a slide: **"logical principles are not directly rules of belief revision. They are not particularly about belief at all."** And a sharp supporting point — logical consequence "does not appear to have a unique normative profile that sets it apart from other consequence relations": strict implication behaves the same way.

**The two naive principles**, and note that **IMP entails CON** given ought-implies-can (verified: for every unsatisfiable triple over a two-atom language, dropping any member entails its negation — 0 failures in 72):

- **IMP**: if S's beliefs logically imply A, S ought to believe A.
- **CON**: S ought to avoid logically inconsistent beliefs.

**The four objections that kill them.** *Belief revision* — seeing that `p, p⊃q ⊨ q` "does not normatively compel any particular attitude towards q"; if q conflicts with my evidence the rational course is to drop a premise. *Bootstrapping* — "any proposition trivially entails itself," so IMP says I ought to believe whatever I do believe. *Clutter avoidance* — every belief entails infinitely much junk ("I am wearing blue socks or pigs can fly"), and it would be "positively irrational to squander my scarce cognitive resources." *Excessive demands / ought-implies-can* — believe the Peano axioms and a consequence follows whose "shortest proof has more steps than there are protons in the visible universe." **Keep the last two apart**: logical omniscience is the target of the third, and the preface is a *separate*, fourth objection.

**MacFarlane's taxonomy: three parameters, 18 principles.** Deontic operator (**o**bligation / **p**ermission / **r**eason), polarity (+ believe C / − do not disbelieve C), and **scope** — narrow `A ⊃ O(B)`, wide `O(A ⊃ B)`, both `O(A) ⊃ O(B)`. Plus an orthogonal fourth dimension, the **attitudinal** variants ("if S *knows/believes* that Γ ⊨ C…"), wanted because "an agent might mistakenly comply with the principle **A ⊃ B, B ⊨ A**" — **verified INVALID, unique countermodel A=F, B=T**, which is exactly the affirming-the-consequent row students already know.

**The wide/narrow difference is one slide and eight rows.** The content of the wide-scope principle is `(bA & bAB) ⊃ bB`: of eight belief states, **seven comply**, and the single forbidden one is `bA=T, bAB=T, bB=F` — verified. Compliance routes: conclude, *or* drop either premise-belief. The narrow-scope version instead **forces** the conclusion. **That is Harman's belief-revision objection rendered as a truth table.**

⚠️ **No principle wins**, and the supplement says so: "our desiderata are at times in tension with one another… there can thus be no one bridge principle that satisfies all of them." MacFarlane settles on a *combination*; Broome, Sainsbury and Streumer each pick differently. **That is the honest Lecture 1 conclusion** — not a defect in the literature but the shape of the problem.

**The preface is the escape hatch's motivation, and it is verified.** `{p₁,p₂,p₃, ∼(p₁&p₂&p₃)}` is **UNSAT** — the belief set really is inconsistent — and `p₁,p₂,p₃ ⊨ p₁&p₂&p₃` is **VALID**, which is exactly what IMP demands. ⚠️ But the entry's claim that the preface belief is "transparently equivalent" to the negated conjunction holds **by stipulation of content, not by logical form**: treated as an atom, the equivalence fails in both directions (1 and 7 countermodels). Say so, or a sharp student will catch it.

Field's response replaces the qualitative ought with a **quantitative** one: `cr(C) ≥ Σᵢ cr(Aᵢ) − (n−1)`, i.e. **"the uncertainty of the conclusion must not exceed the sum of the uncertainties of the premises."** Wide-scope, so satisfiable either by raising confidence in the conclusion or lowering it in a premise. MacFarlane's alternative is worth quoting for its rhetoric: keep the strict ought and accept "an ineliminable normative conflict… Our agent becomes a tragic heroine."

#### Does this bear on Lecture 11's pluralism?

**Yes, substantially — but not via Priest's collapse, which the entry never states.** I checked: "Priest" appears twice in the body, **"collapse" zero times.** What the entry gives instead is an **epistemic-aims argument**: logical norms "are themselves responsible to our broader epistemic aims," so if `A ⊨_{L₁} B` while `A ⊭_{L₂} B` and both are truth-preserving, then **L₁ "outperforms L₂ in terms of the guidance it affords us."**

| | Priest's collapse | The epistemic-aims argument |
|---|---|---|
| Mechanism | the pluralist must reason by *one* relation; the strongest is the only stable choice | truth-preservation plus the aim of true belief make the stronger relation better guidance |
| Scope | general | **explicitly restricted to nested pairs**; non-nested left open |
| Conclusion | pluralism collapses into monism | the candidates "are not equally good after all" — pluralism **not** refuted |

It is arguably the better teaching device, because the pressure comes from something students already accept (you want true beliefs) rather than a contested claim about deliberation. And it disposes of the pluralist's most natural defence: **"logical norms do not merely bind us in the way that the rules of a game bind us. I hold myself answerable to the rules of chess so long as I wish to participate. The normativity of logic does not seem to be optional in the same way."**

📌 **And a gap in Lecture 11 worth closing.** The entry distinguishes **Beall–Restall** pluralism (ambiguity in "case") from **Field's** (non-factualism about epistemic norms), and notes Field's "leaves more room for normative conflict." Collapse-style arguments bite the first much harder than the second. **If Lecture 11 presents Beall–Restall as *the* pluralism and Priest's collapse as *the* objection, the strongest pluralist reply never gets on stage.**

#### The inductive contrast

⚠️ **A citation warning.** The inductive-logic entry was substantively rewritten on **24 February 2025**, and the rewrite **removed** the non-monotonicity discussion entirely — `monoton`, `defeasib`, `truth-preserv`, `ampliativ` all now return zero hits. If any reading list cites the live URL for that material, the citation broke; it now lives only at the `archives/spr2024/` edition.

What survives, and it is the crispest form of the contrast: deductive entailment means "**every** logically possible state of affairs that makes the premises true also makes the conclusion true," while inductive support means "among the logically possible states of affairs that make the premises true, the conclusion is true in **proportion r** of them." **⊨ quantifies universally over the rows; inductive support counts them.** From the archive: entailment is "**absolute, all-or-nothing**" while support "comes in degrees-of-strength"; and inductive support is **nonmonotonic**, where adding a premise "may substantially raise the degree of support… or may substantially lower it."

Verified: classical `⊨` registered **0 monotonicity violations in 5,460 tests**, and can register none — adding a premise only shrinks the set of rows where all premises are true.

📌 **A finding from the archive that bears directly on the tree method**: "there seems to be **no inductive logic extension of the notion of logical inconsistency**." Since this course defines `⊨` via the unsatisfiability of Γ ∪ {∼C} — which is exactly what a truth tree computes — **the definitional route the tree method rests on has no inductive analogue at all.**

**On the Adams claim recorded in §4.6: confirmed, and sharpened.** Classical propositional logic is sound and complete for Adams' probabilistic semantics, and the proof is short enough for a footnote: `Σᵢ u(Aᵢ) − u(C)` is *linear* in the distribution, so its minimum is at a vertex — a point mass on one valuation — where the bound is violated iff that valuation makes every premise true and the conclusion false. **The two notions have literally the same witnesses**, so soundness and completeness are one observation, and it hands back the same countermodel object the truth tables already produce.

The correction is about *where* divergence lives. **Not** in the material conditional — both paradoxes of material implication are classically valid **and** p-valid, so Adams does not vindicate the complaint against `⊃`. **Yes** in the number of premises: at 0.99 per premise the bound on the conclusion is 0.90 at n=10, 0.50 at n=50, and **0.000 at n=100**. That is the preface, and it is why the quantitative principle survives it.

⚠️ **And an honest negative.** Neither edition contains anything on begging the question or abduction, so the "valid but worthless / invalid but valuable" contrast must come from §5.3's entries. But the entry supplies a **better** version of the point: **the preface is a case where a *valid* argument is *worthless*** — the conjunction really does follow at every n, and the author is right to reject it. Not circular, not enthymematic, not informally defective. **Validity and worth come apart inside the formalism**, and it can be shown quantitatively rather than gestured at.

### 2.14 Non-Western logic — the Nyāya inference and the Mohist quantifier contrast

*SEP: logic in classical Indian philosophy (Gillon) · logic and language in early Chinese philosophy (Willman). The only non-Western logic in the SEP table of contents, and absent from every other section of this file.*

⚠️ **First, a correction to expectations: the Chinese entry contains no treatment of Gongsun Long's white-horse argument.** "White horse" occurs only as the Mohists' *parallelizing* example, a one-sentence gloss, and Xunzi's reply. Willman farms the dialogue out to the separate **School of Names** entry.

#### The Indian five-membered inference — and there is no single "the" schema

There are **two** five-membered schemas, and they differ precisely in the third member. The *Caraka-saṃhitā* version's third member is **an instance only** ("Space is unproduced and it is eternal"); Praśastapāda's has acquired **a universal sentence** ("*That which possesses movement is observed to be a substance*, like an arrow"). The whole transition from analogy to deduction is in that one change.

Verified over all monadic models with |D| ≤ 3:

| Form | Verdict |
|---|---|
| Vasubandhu/Dignāga core: `H(p), ∀x(Hx ⊃ Sx) ⊢ S(p)` | **VALID** |
| Caraka analogical: `H(p), H(d), S(d), d≠p ⊢ S(p)` | **INVALID** — 26 countermodels |
| **The example phrase is deductively idle**: `H(p), ∀x(Hx⊃Sx) ⊢ S(p)` with no `d` anywhere | **VALID** |
| **…yet not redundant**: `∀x(Hx⊃Sx) ⊢ ∃x(x≠p & Hx & Sx)` | **INVALID** — 51 countermodels |

**The smallest countermodel to the analogical version is the argument itself failing**: the soul is unproduced; space is unproduced and eternal; but the soul is not eternal — because *something else* is unproduced and non-eternal.

**That last pair is the answer to the question the sweep was set.** The example *statement*'s universal is the major premise and does all the deductive work. The example *phrase* — "like a pot," the demand for a witness `d ≠ p` — is **strictly idle for entailment and not entailed by the entailment-carrying part.** It is an independent, non-truth-preserving side condition.

**And its purpose is anti-circularity.** Dignāga *rejects* the Mīmāṃsaka argument "Sound is eternal, because it is audible; whatever is audible is eternal" — which I verified is **deductively VALID** — because audibility is coextensive with sound, so "there is no independent empirical evidence to support the universal statement." Gillon's own gloss is the one for a syllabus: Dignāga "rules out the syllogism as a **bad** syllogism, rather than, as we would, accept it as a valid syllogism with an unpersuasive premiss."

**So the verdict is neither "deductive" nor "inductive."** The inference *core* is deductive — verified. The *acceptance criterion* is a validity condition **plus** an independent-instance condition that our apparatus has no room for. Do not label the whole thing inductive; do not label it plainly deductive either. (Gillon, Katsura and Tillemans read it deductive; Hayes inductive; Oetke defeasible.)

**A genuine formal defect, verified both ways.** Dharmakīrti's *trairūpya* turns on the ambiguity of *eva* (emphatic vs restrictive) and of *sa-pakṣa* (inclusive vs exclusive of the subject):

| Reading | Result |
|---|---|
| *sapakṣa* **inclusive** | **SATISFIABLE** — but forms 2 and 3 are contrapositives, so form 3 is logically superfluous, "a rhetorical blemish" |
| *sapakṣa* **exclusive** | **UNSATISFIABLE** over |D| ≤ 3 — form 2 entails the contradictory of form 1 |

**The trairūpya is either redundant or inconsistent depending on a disambiguation the Sanskrit does not settle**, and the *eva* particle has no counterpart among our five connectives.

#### The hetucakra as a matrix — does it map onto a truth table?

Dignāga's "drum wheel of reason" is a 3×3 matrix over "the reason occurring in **some, none, or all** of subject-like things" crossed with the same for subject-*unlike* things, with **cells 2 and 8 good and the other seven bad**.

Two preliminary results. **The trichotomy is genuine only if "some" means *some but not all*** — verified, 0 violations in 70 pairs; on the inclusive reading the cells overlap and it is not a matrix. And **domains of size ≤ 3 are provably too small here** — five cells have zero models — so this one sweep was extended to |D| ≤ 5.

The main result, testing for each cell whether `{H(p), cell condition} ⊨ S(p)`:

| Reading of *sapakṣa* / *vipakṣa* | Match with Dignāga's verdicts |
|---|---|
| both **exclude** p | **nothing valid at all** — even cells 2 and 8 fail |
| both **include** p | **EXACT**: cells 2 and 8 valid, all seven others invalid, cell 5 vacuous |
| *sa* excludes p, *vi* = everything lacking S | cells 2 and 8 valid — **but cell 5 also comes out VALID while Dignāga classes it bad** |

**Honest verdict.** It does **not** map onto a truth table: the nine cells are not truth-value assignments, and nothing is truth-functional. They are quantificational relations between two extensions, so the right Western analogue is the enumeration of syllogistic moods, not the table.

**But the methodological point survives and is genuinely striking.** Dignāga is doing exactly what a truth table does *as a method*: fix an exhaustive, mutually exclusive partition of the possibility space, tabulate it, and read validity off mechanically. Under the inclusive reading the fit with `⊨` is **exact** — a decision procedure for a fragment, by exhaustive case analysis, in the fifth or sixth century.

⚠️ **The caveat is not optional, and it is more interesting than the clean version.** The exactness holds only under the disambiguation Gillon himself flags as textually unsettled. Under the third reading, **cell 5 is deductively valid and Dignāga calls it bad** — and cell 5 is the *asādhāraṇa* case, which is exactly the audibility syllogism above. **Present it as "the same method as a truth table, applied to a non-truth-functional subject matter, with one cell where Dignāga's verdict and `⊨` come apart."** Not as "Dignāga's truth table."

Also worth a footnote: the epistemological problem of how the universal is *known*. Īśvarasena said by failure to find a counterinstance; **Dharmakīrti demolished this** — "what guarantee is there that something which has H and does not have S is not among the things which one has yet to encounter?" That is a straight statement of the problem of induction.

#### The Mohist quantifier contrast — the strongest non-Western item found

The *Xiao Qu* passage, and it needs no forcing at all:

> "Loving people requires loving **all** people without exception… Not loving people does not require loving no people at all… Riding horses does **not** require riding all horses without exception; it is riding **some** horses… But not riding horses does require riding no horses at all. **These are cases in which something applies without exception in one case but not in the other.**"

That is a **quantifier-scope contrast between two verbs of identical surface grammar**, with the correct negation clauses for both, and it is fully first-order expressible. Verified:

| Form | Verdict |
|---|---|
| *cheng ma*, existential: `∀x(Wx⊃Hx), ∃y(Wy & Rd(a,y)) ⊢ ∃y(Hy & Rd(a,y))` | **VALID** |
| *ai ren*, universal, **sub-kind → super-kind** | **INVALID** — 73 countermodels |
| *ai ren*, **super-kind → sub-kind** | **VALID** |
| the Mohist negation clause `∼∀y(Pey ⊃ K(a,y)) ≡ ∃y(Pey & ∼K(a,y))` | **VALID** |

**It also nails the monotonicity reversal**: sub-kind to super-kind fails under `∀` and succeeds under `∃`. A first-rate lecture example from a third-century-BCE text.

Also genuinely expressible and verified: the quantifier interdefinitions (A43 "All is none not being so"; NO5 "Some is not all"), and the *fa*-inference Willman reconstructs — `∀x(R(x,m) ⊃ Gx), R(a,m) ⊢ G(a)` — which is **VALID**, and which the Mohists were, in his phrase, "on the verge of discovering."

#### What cuts against us — and it is the best framing

The Mohists collect parallel constructions. **Form A**: "White horses are horses; riding white horses is riding horses." But equally attested, **Form B**: "**Robbers are people, but being without robbers is not being without people**"; "A boat is wood, but entering a boat is not entering wood." And then the methodological warning, which is the most important passage in the entry for our purposes:

> "Things have respects in which they are similar, yet it doesn't follow that they are completely similar. **Parallels between expressions are correct only up to a point.** … Hence, expressions in analogies, parallelizing, 'pulling', and 'pushing' become different as they proceed… **fail when taken too far**… and so one cannot be careless and **cannot invariably use them**."

**This is a systematic catalogue of counterexamples to the claim that surface form determines validity** — an argument *against* the formality thesis this course is built on. That is the honest and pedagogically strongest framing: not "did they have our logic," but **"they identified the phenomenon our logic has to legislate away."**

Willman's own position is a middle one, stated in both directions: it "would be highly misleading to say that the Mohists were simply not doing logic," but equally "they made **no attempt at investigating formal logic independently of their interests in analyzing the semantics of the terms of language**," and "valid inference is partly a semantic affair." His conclusion: **awareness of the limitations of compositionality "probably led them away from the development of a theory of logical forms."** They saw the formality option and declined it.

📌 **And a defect I found in the entry's own reconstruction.** Willman argues the Mohist resemblance account collapses: given reflexivity, symmetry, and "anything resembling the white-horse model resembles the horse model," he concludes that "a model that is brown would warrant the name 'white horse'" — i.e. the *universal converse*. **That does not follow.** Verified over 4,674 interpretations, |D| ≤ 3: **6 countermodels**, the smallest being a three-element domain in which the brown horse resembles the horse-model and *not* the white-horse-model. What *is* entailed is the single instance `R(m₂, m₁)` — verified valid. **Willman slides from an instance to a generalization. Do not reproduce the objection as stated.**

#### What is lost, in both traditions

| Genuinely expressible | Lost |
|---|---|
| the Nyāya deductive core; *vyāpti* / *anvaya* / *vyatireka* as `⊃`, its converse and its contrapositive | the **occurrence ontology** — substratum/superstratum, contact vs inherence; `F(a)` erases it |
| the hetucakra's exhaustive partition (under one reading) | the *example phrase* as a dialectical adequacy condition `⊨` cannot represent; the *eva* particle; *nigraha-sthāna*, an entire theory of **losing a debate** |
| the Mohist ∀/∃ contrast and both negation clauses | ***ke* = admissibility, not truth** — the preserved value is normative and action-guiding. Not a translation gap; a different target property |
| A43/NO5; the *fa*-inference; non-contradiction (A74), excluded middle (B35), the liar (B71) | **intensionality** — "knowing dogs" vs "knowing canines," and "killing robbers is not killing people," which I verified comes out **VALID** extensionally, so the Mohist denial is refuted on that rendering. Needs idiom or an operator; **do not render it in our language** |

⚠️ **Neither entry contains anything resembling a truth tree, a Fitch proof, or any derivability relation.** Both traditions evaluate argument *schemas* semantically or dialectically. **Our `⊢` and `⊢ND` have no counterpart in either.** `⊨` has a real counterpart in India via *vyāpti*, and a contested one in China via *ke*. And neither tradition has an object-language conditional with settled truth conditions — every `⊃` above is **ours**.

### 2.15 Frege, Peirce and Port Royal — and the alpha graphs, found at last

*SEP: Frege's logic (Cook) · Peirce's deductive logic · the Port Royal Logic. Plus two supplement pages that turn out to hold the two most important items: `frege-logic/figdesc.html` and `peirce-logic/notes.html`.*

#### Frege's notation, and a framing correction

⚠️ **The Frege entry never uses the words *two-dimensional*, *diagram*, *diagrammatic*, *iconic* or *spatial*.** It treats the *Begriffsschrift* as a formal system with unusual glyphs, not as a member of the diagrammatic family — so §2.7's framing ("Frege used lines rather than plane regions") is the *diagrams* entry's thesis, not this one's. This entry supplies the mechanism; the other supplies the claim.

It also contains ~200 images of the notation and **zero** rendered text of it. The compensating resource is the **accessibility supplement**, which exists for screen readers and gives purely *geometric* descriptions — and is therefore the single most useful page in the entry for a teacher.

**The four strokes.** The **content stroke** is a horizontal that "binds the symbols that follow it into a whole." The **judgment stroke** is a short vertical at its left end — and it is not a connective. Frege's own gloss is startlingly modern:

> "Imagine a language in which the proposition 'Archimedes was killed at the capture of Syracuse' is expressed in the following way: 'The violent death of Archimedes at the capture of Syracuse is a fact'… Such a language would have only a **single predicate** for all judgements, namely 'is a fact'. Our *Begriffsschrift* is such a language and the symbol ⊢ is its common predicate."

The **conditional stroke** puts the **consequent on top and the antecedent hanging below**, defined by four exhaustive possibilities — a truth table written in prose, and a *negative* definition: the figure "denotes the judgement that the third of these possibilities does not obtain." The **negation stroke** is a short vertical hanging from the underside of the horizontal.

**And here is the nested conditional, from the accessibility supplement — the payoff you cannot get from the body text.** For `C ⊃ (B ⊃ A)`:

```
 ⊢———————————————— A
   │        │
   │        └————— B          ← shallower drop = inner antecedent
   └—————————————— C          ← deeper drop  = outer antecedent
```

One spine, the consequent at top right, antecedents stacked down the left, and **depth of drop encodes nesting order**. A student who has fought with `(P ⊃ Q) ⊃ R` versus `P ⊃ (Q ⊃ R)` can see the difference without counting a bracket.

**The systematic ambiguity is deliberate and is the engine of the whole system.** Frege reads that figure *both* as a binary conditional with `C` antecedent and as a ternary one with `C` and `B` both antecedents — licensed by `(C ⊃ (B ⊃ A)) ≡ ((C & B) ⊃ A)`, **verified**.

**Scope, and why the picture settles it.** Generality is a **concavity** — the spine *dips*, with a German letter in the dip — and Frege states the rule himself: "**Only within its scope does a Gothic letter retain its meaning**… An italic letter always has as its scope the content of the whole judgement, without this needing to be signified by a concavity." So a quantifier's scope is *the segment of spine to the right of its dip*, and because antecedents hang off at measurable depths **you can see which fall inside**. Linear notation reconstructs that with brackets; Frege reads it off.

⚠️ Two warnings. Roman letters are officially *abbreviations* for prenex concavities. And the entry argues at length that the *Begriffsschrift* quantifier **is not a first-order quantifier** — there is a single quantifier ranging over "arguments of any level," and the entry cites arguments that it "doesn't even count as a genuine quantifier in the first place."

**All nine axioms verified**, no countermodels: weakening; self-distribution; antecedent permutation; contraposition; `∼∼a ⊃ a`; `a ⊃ ∼∼a` (Frege notes these two "can be combined into the single one" `∼∼a ≡ a` — verified); indiscernibility of identicals; `c ≡ c`; and universal instantiation.

**The concavity-introduction side condition is exactly our `∀I` flag condition, drawn rather than flagged.** Verified: the licit case `∀x(A ⊃ Φx) ⊨ A ⊃ ∀yΦy` (with `A` closed) is **VALID**, while the case SEP marks "but not" — `∀x(Φx ⊃ Ψx) ⊨ ∀x(Φx ⊃ ∀yΨy)` — is **INVALID**. Read the smallest countermodel: everything that is Φ is Ψ, but it is false that one thing's being Φ makes *everything* Ψ. That is variable capture, and **Frege blocks it by a positional restriction on where the dip may be inserted.**

**And a claim that will surprise a Fitch-teaching audience.** The entry argues the *Grundgesetze* rules are "in many ways **more powerful and more elegant than modern deductive systems**," because generalized modus ponens can discharge *any* subcomponent. Its own example: from `A₁ ⊃ (A₂ ⊃ … (A₈ ⊃ B))` and `A₈`, "consider how many steps would be needed **in a typical natural deduction system**"; Frege does it **in one**. Verified over all 512 valuations: **VALID**. In Fitch it costs seven nested subproofs. That is a genuinely good in-class demonstration. Generalized hypothetical syllogism, contraposition and dilemma all verified too.

📌 **The "⊃ does not capture the causal connection in 'if'" quote is *not* in this entry.** Searched for *caus*, *connection*, *ordinary language*, *vernacular*: zero relevant hits. It is from *Begriffsschrift* §5 itself. **§3.1 of this file attributes it to SEP; that attribution should be to Frege's own text**, via the Bynum or Beaney translation.

#### Peirce's alpha graphs — the answer to §2.7's open question

**Yes. The content §2.7 could not find is here**, and substantially: sheet of assertion, the cut as negation, juxtaposition as conjunction, a five-clause formal syntax, two reading algorithms, a direct semantics, Peirce's own seven-item **Code of Permissions**, and Shin's reformulated rules.

⚠️ **But a body-text search for "deiteration" returns zero.** The familiar five named rules are in **endnote 31**, quoted from Roberts — erasure (any *evenly* enclosed graph), insertion (any graph, on any *oddly* enclosed area), iteration, deiteration, and the double cut. **A search confined to the entry body would wrongly conclude they are absent.** Cite the endnote.

**All five verified truth-preserving** on their simplest instances, plus Shin's RR1–RR3. Note that iteration and deiteration are exact converses — which is why Alpha's single pair does the work our Fitch system splits between reiteration and subproof discharge.

**And here is why Alpha would be a genuinely *different* fourth method, not a notational variant.** The Multiple Readings algorithm gives one drawing several readings, all verified equivalent: the graph `[[R][S]]` reads as `∼(∼R & ∼S)`, `R ∨ S`, `∼R ⊃ S`, and `∼∼R ∨ ∼∼S`. The entry draws the moral:

> "In the case of symbolic systems, we need to **prove** the equivalence among the above sentences by using inference rules. But **derivation processes are dispensable** in the case of the Alpha system when the Multiple readings are adopted."

**In Alpha, `p ⊃ q`, `∼p ∨ q` and `∼(p & ∼q)` are the same drawing** — so De Morgan and conditional-exchange are not theorems to derive but readings to choose. If one slide is wanted to justify adding Alpha alongside tables, trees and Fitch, that is it.

Reading order is fixed by Peirce's **endoporeutic** principle — "a nest sucks the meaning from without inwards unto its centre, as a sponge absorbs water" — motivated by exactly the ambiguity our brackets handle. Verified that the disambiguation is load-bearing: `∼(P & ∼Q) ⊨ ∼P & ∼Q` is **INVALID**, two countermodels.

⚠️ **What the entry does not supply**: any worked deduction (it defers to Roberts and Shin), and any soundness or completeness theorem — "soundness" occurs zero times. Its remark that endoporeutic reading "assures us that the Alpha system is truth-functionally complete" is an **expressive**-completeness claim about the language, **not a deductive completeness result about the rules.** Do not let it stand in for one. Three verified specimens for first exercises: modus ponens, disjunctive syllogism, and **Peirce's Law** — the natural showpiece, since the Fitch proof needs an unmotivated `∼I` and the Alpha derivation is short and visual.

**Beta, in one idea worth stealing.** Predicate arity is the number of lines radiating from a term, and "the line connecting two predicates, representing *one and the same* object, is called a **line of identity**… the sameness is represented **visually**." Quantifiers are not two symbols but one device read off parity: "any line of identity whose outermost part is **evenly enclosed** refers to *something*, and any one whose outermost part is **oddly enclosed** refers to *anything there may be*." And scope: "**the less enclosed the outermost part of a line is, the larger the scope.**" Verified: the entry's Catholic/Woman/Adores pair gives `∃∀ ⊨ ∀∃` **VALID** and the converse **INVALID**, with a non-degenerate countermodel — every Catholic adores a woman (herself), but no one woman is adored by all. **In Beta the difference is which oval nests inside which, with no linear order to memorise.**

📌 And a connection back to §2.6: verified that `∀x(Gx⊃Ux) ⊨ ∃x(Gx&Ux)` is **INVALID** here too — **the empty-extension failure of subalternation, arising from the parity convention rather than from Peirce's 1880 decision.** His graphical system inherits exactly the commitment his algebraic one made.

**On priority**, the entry does not fudge. Dipert: Peirce "was the first person in the history of logic to use quantifier-like variable binding operators (briefly in 1870… predating Frege's *Begriffsschrift*)." The entry's own settlement credits both, noting "**Peirce was not aware of Frege's work**" and that "Frege presented a logical system equipped with axioms and rules, which was not pursued in Peirce's work." But the transmission argument is the strong one: **Schröder took Σ and Π from Peirce, not Frege**; Löwenheim, Skolem, Zermelo and Peano all used Peirce–Schröder notation; Whitehead cites Peirce and **not** Frege. Putnam: "it was Peirce who seems to have been known to the entire world logical community" — hence Peirce's group as the **"effective" discoverers**, Frege as *a* discoverer, and "clearly we needed to wait until Russell drew our attention to Frege."

Peirce's own 1885 transformation list, all verified — including his explicit statement that `∀x∃yχ ≠ ∃y∀xχ` (**confirmed INVALID**) set beside the fact that the prenex swap **is** legitimate when the matrix predicates are monadic in different variables (**VALID**). **He lists both facts side by side in 1885** — a striking degree of clarity about quantifier dependence, six years after *Begriffsschrift*.

📌 One bonus for a truth-table course: §3 documents **Peirce's three-valued logic** from his 1909 Logic Notebook, with full tables over three values, and Fisch and Turquette established it **predates Łukasiewicz and Post by at least a decade.**

#### Port Royal — what the course inherits without knowing

*La Logique ou l'art de penser* (1662) was "**the most widely read text in formal logic from Aristotle to the end of the nineteenth century**," written in the vernacular, in four parts following the four operations of the mind. Parts I–III are traditional; **Part IV, on method, is the innovation**. Its authors thought Part III mere "exercise" — yet Kneale and Kneale credit its lasting importance precisely to the "quasi-mathematical" rigour of its syllogistic rules. **Its reputation rests on the part its authors thought least important.**

**Comprehension and extension** — the ancestor of intension/extension. Comprehension "consists in the set of attributes essential to the idea"; extension, "in the particular objects to which it applies." Three claims: comprehension is essential and extension is not; comprehension *governs* extension; and they **vary inversely** ("in adding attributes to the comprehension of an idea one restricts its extension"). They are not an appendix — they *are* the semantics of the copula, since to judge that *S is P* is to affirm that S's comprehension includes P's and that S is in P's extension. ⚠️ But the entry's caution should be passed on: "**it is psychological ideas and not words that have comprehensions**," so the parallel with sense and reference is limited.

**The six rules verified by their violations** — undistributed middle, illicit major, two negative premises, and two particular premises all confirmed **INVALID** with countermodels; Baroco and the book's own worked Barbara confirmed **VALID**.

📌 **The best single find here is the "complex syllogism" of III.9**: "The sun is an insensible thing. The Persians worshipped the sun. Therefore the Persians worshipped an insensible thing." The *Logic* cannot get this from its six rules and hands it to "the natural light of reason." Verified: **relationally VALID**, and **monadically INVALID** — because syllogistic must treat "worshipped the sun" and "worshipped an insensible thing" as unanalysed predicates. **Arnauld and Nicole put their finger on an inference that is unmistakably valid and outside their system.** Two centuries later Peirce diagnosed exactly this class — "Deductive logic can really not be understood without the study of the logic of relatives" — and built quantifiers and lines of identity to capture it. **A clean two-lecture arc from 1662 to 1885, entirely supported by these entries.**

**And the item most likely to surprise a truth-table course:** the *Logic* states **truth conditions for the connectives in 1662** — "A conditional is false when the antecedent is true and the consequent false and true when both are true; a conjunction is true when both conjuncts are true and false otherwise, and so on in the familiar way." Two centuries before Boole, embedded in a scholastic syllogism book — and sitting unreconciled beside an inferential reading of the same conditional ("to think 'If P then Q' is to think of deducing the consequent from the antecedent").

Also inherited: "extension" as a technical term; the A/E/I/O labels and the square as a teachable package; the convention that **singular propositions function logically like universals**; the **restrictive/non-restrictive** clause distinction students need for every English relative clause; a fallacies unit occupying nearly as many pages as the formal material; and the terms → propositions → inferences → method skeleton still used by most textbooks. ⚠️ One inversion worth showing students: the *Logic* "**emphasizes soundness over validity**," on the ground that arguments with false conclusions are "useless." Modern intro courses reverse that ordering.

📌 **And an unexpected bridge to Frege.** The entry sets Port Royal up as his foil: the *Logic* holds a **one-act** theory on which a proposition just *is* an act of affirming, so there is no room for an unasserted content — and it quotes the standard story that "part of Frege's genius… was to see through this mess and clearly distinguish propositional content from judgment from assertoric force." **Frege's judgment stroke is the fix for the Port Royal defect.** Teach them together. The entry adds that the *Logic* "seems to have trouble with double negation" — set that beside Frege's axioms 5 and 6 and his own remark that they fuse into `∼∼a ≡ a`, verified above. **The Port Royal theory cannot state that equivalence; Frege's can, and had to invent the content/force distinction to do it.**

---

### 2.16 Set theory, type theory, logicism — the two repairs, and which level each works at

*SEP: Set Theory (Bagaria) + its ZF and Basic Set Theory supplements · Type Theory (Coquand) · Church's Type Theory (Andrews) · The Axiom of Choice (Bell) · Logicism and Neologicism (Tennant) · Frege's Theorem.*

⚠️ **URL note.** `/entries/logicism/` resolves — and its title is *"Logicism and Neologicism."* The slug `/entries/logicism-neologicism/` is a **404**; do not cite it.

#### The organising result: the two repairs of Russell's paradox work at different levels

This is the section's headline, and it is a clean two-column fact that belongs in a lecture:

| Repair | Level of the fix | The Russell sentence is… | Comprehension is… |
|---|---|---|---|
| **ZF / Zermelo** | **Axioms** | a perfectly well-formed sentence, and `⊢ ∼∃y∀x(Fxy ≡ ∼Fxx)` is a **theorem of pure logic** | an **asserted schema** (Separation), restricted to subsets of a set you already have |
| **NBG, Ackermann** | **Axioms** | well-formed; the *range of the variables* is restricted | asserted, with a sets/classes distinction |
| **Type theory** (simple or ramified) | **Language** | **not a formula at all** | **not asserted** — a *theorem*, from the formation rules plus β-conversion |
| **NF** | **Language of the schema** | well-formed, but comprehension's *instances* are filtered by a syntactic stratification test | asserted, with a syntactic side-condition on φ |

NF deserves its own row rather than being folded into either column: the restriction is syntactic like type theory's, but applied as a side condition on an asserted schema like ZF's. It restricts what may go *into* comprehension without restricting what may be *written*.

**Four independent pieces of evidence that type theory's fix is grammatical.** (i) Andrews defines wff-hood itself inductively **by type** — there is no clause producing a wff from mismatched types, so a type-violating string is not a sentence with an unwanted truth value, it is not a sentence. (ii) Coquand's rules are *typing judgements* `x₁:A₁,…,xₙ:Aₙ ⊢ M:A`; a term has a type or it does not, with no third status. (iii) **In Church's STT the comprehension principle `∃u∀v(uv ≡ A)` is a theorem, not an axiom** — you exhibit the witness `λv.A`, which is a wff by the formation rules. So ZF's question "which instances of comprehension do we assert?" simply does not arise. (iv) Andrews, verbatim, on `R = λx∼[xx]`: "We can clearly prove `[R R] ≡ ∼[R R]`, which is a contradiction. This is Russell's paradox. … **Of course, when type symbols are present, R is not well-formed**, and the contradiction cannot be derived." Not "we decline that instance" — *not well-formed*.

**Verified.** Exhaustive finite-model search, |D| = 1, 2, 3:

| Form | Result | Search space |
|---|---|---|
| `∃y∀x(Fxy ≡ ∼Fxx)` — untyped, diagonal on the *same* relation | **UNSATISFIABLE**, 0 models | 530 interpretations |
| `∃y∀x(Fxy ≡ ∼Gxx)` — stratified, diagonal on a *different* relation | **SATISFIABLE**, **86,642 models** (2 at n=1, 112 at n=2, 86,528 at n=3) | 262,404 interpretations |

Smallest model of the stratified version: `D = {0}`, `F = ∅`, `G = {⟨0,0⟩}`. And the typed structure is satisfiable **finitely**: a two-sorted `⟨Ind, 𝒫(Ind), ∈⟩` with |Ind| = 1, 2, 3 satisfies *every* instance of typed comprehension, including every diagonal-style instance, in models of 3, 6 and 11 elements. **Typed comprehension has models with eleven elements in them; unrestricted comprehension has no models at all, of any size.** And the difference is not that type theory asserts fewer axioms — it is that in the two-sorted language `x ∈ x` is *not a string of the language*.

📌 **The pedagogical payoff, and it is a good one.** First-order logic already *is* a type theory — a very small one. Coquand says so flatly: FOL "considers only types of the form `i,…,i → i` (function symbols) and `i,…,i → o` (predicate, relation symbols)." Our syllabus's grammar rules **are** typing rules: `∼a` for a term `a` is a *type error*, not a false sentence; `Fx` for a two-place `F` is not a wff; a predicate letter may never occupy an argument place, which is why `FF` and `∀F(…)` are ill-formed *for exactly Russell's reason*. So: **the reason `x ∈ x` is well-formed in our course while `FF` is not** is that `∈` is a two-place predicate of type `(i,i)→o` and both `x`s are individual variables. Set theory chooses to make sets individuals. That is the substantive decision, it is what makes the Russell sentence writable, and it is visible in the *syntax* section of a syllabus rather than in an axiom list.

#### ZFC: which axioms are schemas, and why that is exactly the Gödel condition

Bagaria states ZFC "in first-order logic with equality and with only one binary relation symbol ∈" — so **all of ZFC lives inside the language the course already teaches.** Bagaria's own housekeeping, verbatim: "The axioms of Null Set and Pair follow from the other ZF axioms, so they may be omitted. Also, Replacement implies Separation."

**Separation and Replacement are the only two schemas**; the other eight are single sentences. Zermelo's 1908 Separation quantified over *properties* and "thus is a second-order statement"; Skolem and Fraenkel replaced *property* with *formula of first-order*, which is what turns it into a schema. **The schema is the price of staying first-order.**

Now the connection worth teaching. Gödel's theorems require the theory to be **effectively (recursively) axiomatizable**. That does **not** require finitely many axioms; it requires the infinite axiom set to be *decidable*. Both schemas pass, because "is a formula of the language of set theory" is decidable. So Gödel applies, and ZFC cannot prove its own consistency. And then the closing of the loop, from the entry: "**ZFC is not finitely axiomatizable**, for otherwise ZFC would prove that, for unboundedly many ordinals α, V_α is a model of ZFC, contradicting Gödel's second incompleteness theorem." The mechanism is the Reflection Principle. **Gödel's second theorem forces the schemas to be genuinely infinite.** Contrast: **NBG *is* finitely axiomatizable**, replacing the schemas with a finite list of class-existence axioms — and NBG and MK can talk about proper classes, which ZFC can discuss only in the metatheory.

#### The Axiom of Choice, and what it is *not*

The form to teach is Bell's relational one (AC3): `∀x∈A ∃y∈B R(x,y) ⊃ ∃f[f : A→B & ∀x∈A R(x,f(x))]` — "every relation contains a function having the same domain." It is *visibly* a strengthening of something the students can already read: you may pass from `∀x∃y` to a single function making the choices.

**Verified — AC is NOT the quantifier shift**, which students reliably conflate with it:

| Form | Verdict | Search |
|---|---|---|
| `∀x∃y Fxy ⊃ ∃y∀x Fxy` | **INVALID** — **176 countermodels** (2 at n=2, 174 at n=3) | 530 interpretations, 353 premise-true |
| `∃y∀x Fxy ⊃ ∀x∃y Fxy` | **VALID**, 0 countermodels | 530 interpretations |

Smallest countermodel: `D = {0,1}`, `F = {⟨0,1⟩,⟨1,0⟩}`. Every `x` has *some* `y`; no single `y` serves every `x`. AC does not say "one `y` works for all `x`" — it says *there is a function* picking a possibly different `y` for each. That is a much weaker claim, which is why AC is consistent while the shift is invalid.

**Verified — finite choice is a theorem, not an axiom.** Every serial relation on a finite domain admits a choice function: 1 of 1 at |D|=1, 9 of 9 at |D|=2, 343 of 343 at |D|=3. **Zero failures.** Finitely many choices you can write down one at a time, and finitely many `∃E` steps is a proof. AC earns its keep only when there is no *last* choice.

**Verified — and here is the best way to introduce it.** The propositional shadow of finite choice is a plain tautology:

| Form | Verdict |
|---|---|
| `((p∨q) & (r∨s)) ⊃ ((p&r) ∨ (p&s) ∨ (q&r) ∨ (q&s))` | **TAUT**, 16/16 |
| Three sets of two, the 8-disjunct version | **TAUT**, 64/64 |
| `((p∨q) & (r∨s)) ⊃ ((p&r) ∨ (q&s))` — index-matched | **INVALID**, 2 rows: `p=T,q=F,r=F,s=T` and `p=F,q=T,r=T,s=F` |

This is the finite case of the set-theoretic distributive law that is an AC *equivalent*. The right-hand disjunction has |J|^|I| disjuncts; for finite `I` your students can check it on a table. **AC is precisely the claim that this stays true when the disjunction becomes infinitely long** — at which point it is no longer a tautology and no longer even expressible. *AC is a tautology that ran out of room.* And the failing index-matched version shows why the choice function must be allowed to choose *independently* in each set.

**Course-relevant dependency, flagged as sourced not verified.** Compactness and completeness for first-order logic are **equivalent to BPI** (Henkin 1954), a strictly weaker fragment of AC; **Löwenheim–Skolem–Tarski is equivalent to full AC.** So the metatheory Lecture 12 proves already runs on choice: every Henkin extension to a maximal consistent set is a maximal-ideal principle. With a countable language you can do it by explicit enumeration and need nothing; uncountably many sentences and you need BPI.

📌 **A bonus finding, and a caution about our own methods.** *Foundation alone does not forbid self-membership.* **Verified INVALID, 65 countermodels** over 530 interpretations; smallest is `D = {a,b}`, `E = {⟨a,b⟩,⟨b,b⟩}` — `b ∈ b`, with `a` as `b`'s ∈-minimal member. What kills `x ∈ x` is **Foundation plus Pairing**: Pairing gives `{a}`, whose only member is `a`; Foundation applied to `{a}` demands an ∈-minimal member, which must be `a`; so nothing in `a` is in `{a}` — but `a ∈ a` and `a ∈ {a}`. ⚠️ **And here finite-model search goes silent, not confirming.** It returns "0 countermodels" for Foundation + Pairing — but also **0 models of the premises**, so the result is vacuous. **Pairing has no finite models at all**: on a domain of size *n* it needs n(n+1)/2 distinct pair-sets, so it fails for every n ≥ 2 (verified: 3 needed in a domain of 2; 6 in 3; 10 in 4). The same applies to Power Set, Infinity and Replacement. **Finite-model search refutes; it cannot confirm; and against ZF proper it is silent by construction.**

#### Simple and ramified types, and the axiom that undid the point of the hierarchy

**Simple types block self-application and not impredicativity.** Coquand: "This restriction makes it impossible to form a proposition of the form `P(P)`: the type of `P` should be of the form `(A)`, and `P` can only be applied to arguments of type `A`, and thus cannot be applied to itself since `A` is not the same as `(A)`." But Leibniz equality `Q(x,y) := ∀P[P(x) ⊃ P(y)]` quantifies over all predicates including `Q`-derived ones. Perfectly consistent, thoroughly circular.

**The single best one-line contrast between the two repairs** is Gödel's, quoted in the entry: in type theory the process of forming subsets "is iterated finitely," whereas "in set theory this process of forming subsets is iterated into the transfinite."

**Ramification was motivated by *informal* paradoxes**, not formal ones — the liar, and "the least integer not definable in less than 100 words." Russell's illustration: "Napoleon was Corsican" is *predicative*; "Napoleon had all the qualities of a great general" quantifies over a totality and is *impredicative*; and the cautionary case, "a typical Englishman is one who possesses all the properties possessed by a majority of Englishmen," from which it follows that a typical Englishman is untypical.

The cost is real and it is mathematical, not philosophical. Numbers split into orders 1, 2, 3, …; and for analysis, the least upper bound of a class `C` is defined by `∀q[L_C(q) ≡ ∃P[C(P) & P(q)]]` — impredicative, so "the least upper bound of a collection of reals of order 1 will then be at least of order 2 in general." **Ramified analysis has no least-upper-bound principle, which is to say it has no analysis.** Russell hoped the hierarchy of naturals collapses at order 5; Gödel found the error and **Myhill 1974 showed it collapses at no finite level**. Cantor's theorem is likewise not available (Chwistek 1926, Fitch 1939, Heck 1996).

**The Axiom of Reducibility** says the hierarchy collapses at level 1: for any predicate of any order there is a first-order predicate equivalent to it. Coquand is blunt about why: "The motivation for this axiom was purely pragmatic." And the fatal objection, Chwistek's and Ramsey's: "**In the presence of the axiom of reducibility, there is actually no point in introducing the ramified hierarchy at all!** It is much simpler to accept impredicative definitions from the start." You pay the whole price and then buy the thing back. Weyl 1946: "a bold, an almost fantastic axiom; there is little justification for it in the real world in which we live, and none at all in the evidence on which our mind bases its constructions." Proof theory vindicated the *worry* while refuting the *charge*: cut-elimination for impredicative simple type theory (Takeuti conjectured; Tait, Prawitz proved) "revealed the extreme power of impredicative quantification or, equivalently, the extreme power of the axiom of reducibility" — the strength of second-order arithmetic sits "way above all ramified extensions of Arithmetic considered by Schütte" — yet "no paradoxes have been found yet."

📌 **And the unification worth a slide.** Gödel showed that if you extend ramification *transfinitely*, Reducibility becomes **provable**: the hierarchy of properties over ℕ collapses at ω₁. This directly motivated **L**. So Russell's repair, pushed into the transfinite, *is* Gödel's constructible universe.

#### Logicism: HP and Basic Law V differ in exactly one slot

Tennant's structural insight makes the whole question answerable. A **double-barreled abstraction principle** has the form `@xFx = @xGx ≡ Ψ(F,G)`, "where the right-hand side expresses a second-order equivalence relation Ψ between F and G, and is stated without use of @." Frege's warm-up is directions: `d(l₁) = d(l₂) ≡ l₁ ∥ l₂`.

**BLV and HP are the same kind of thing, differing in which Ψ occupies the right-hand side:**

| | Operator | Ψ(F,G) | Objects |
|---|---|---|---|
| **Basic Law V** | `{x \| Φx}` | **coextensiveness**: `∀x(Φx ≡ Ψx)` | classes / extensions |
| **Hume's Principle** | `#xFx` | **equinumerosity**: `∃R(R maps the Fs 1-1 onto the Gs)` | cardinal numbers |

Both say **exactly one thing: the abstraction operator is injective on the Ψ-equivalence classes.** So satisfiability reduces to a single counting question — *does the number of Ψ-classes inject into the domain?* And then:

| | Ψ-equivalence classes | How many, on a domain of size κ | Fits? |
|---|---|---|---|
| **BLV** | **singletons** — coextensiveness *is* identity of concepts, the finest possible equivalence | 2^κ | **Never.** 2^κ > κ by Cantor, at every cardinality |
| **HP** | **one class per cardinal ≤ κ** — a much coarser equivalence | κ+1 for finite κ; ℵ₀ at κ = ℵ₀ | Fails finitely by exactly 1; **succeeds at ℵ₀** |

**Verified.** Enumerating every candidate operator `@ : 𝒫(D) → D`:

| \|D\| | subsets | equinum. classes | candidates | BLV models | HP models |
|---|---|---|---|---|---|
| 1 | 2 | 2 | 1 | **0** | **0** |
| 2 | 4 | 3 | 16 | **0** | **0** |
| 3 | 8 | 4 | 6,561 | **0** | **0** |

But look at the *shape* of the two failures, which is where the philosophy is. **BLV's shortfall is ×2, ×2, ×2.7, ×4, ×6.4, ×102 … and it survives passage to the infinite. HP's shortfall is always exactly +1 — and at ℵ₀, "exactly one" costs nothing, because ℵ₀ + 1 = ℵ₀.** That is the entire formal content of the difference between a consistent abstraction principle and an inconsistent one.

Two corollaries to bank. **HP is unsatisfiable in every finite domain, so HP ⊨ "the domain is infinite" — HP *proves* infinity.** That is why Frege's Theorem works, and simultaneously the strongest objection to HP's claim to be logic. **BLV is unsatisfiable in every domain whatsoever**, which is why §5.9's `⊢ ∼∃y∀x(Fxy ≡ ∼Fxx)` subsumes it. Boolos's model for HP (anticipated by Geach) is exactly the injection the table demands: ℕ ∪ {ω}, finite concepts to their cardinality, all infinite concepts to ω. ⚠️ Tennant's caveat, worth carrying: the consistency proof "works only when FA is taken on its own" — the Geach–Boolos model does not secure FA plus set theory, and since counting ought to apply to anything countable, that is a real limitation.

**Why BLV is inconsistent, in two steps students can follow.** Tennant's Step 1 is three lines and needs no set theory, and the damage comes from the *right-to-left* direction: (1) `∀x(Φx ≡ Φx)` is a logical truth [verified: `A ≡ A` is a tautology]; (2) by BLV right-to-left, `{x|Φx} = {x|Φx}`; (3) an identity holds only if its terms denote, so `∃y(y = {x|Φx})`. Naïve comprehension, `∃x∀y(y∈x ≡ Φy)`. **Remarkably, going free-logical does not save him** — the existential commitment is generated by self-identity anyway. Step 2: take `Φy := y ∉ y`, instantiate, get `r∈r ≡ r∉r`, and `⊢ ∼(A ≡ ∼A)` [verified, valid on both rows]. The cardinality diagnosis, from *Frege's Theorem*: BLV "requires the impossible situation in which the domain of concepts has to be strictly larger than the domain of extensions while at the same time the domain of extensions has to be as large as the domain of concepts."

**Why Frege let HP go: the Caesar Problem.** HP cannot rule that Julius Caesar is not a number. Tennant's illustration is nicely vicious: assign Caesar as the number of any two-membered concept, consistently with HP, and "the number of prime numbers strictly between 1 and 4 is Julius Caesar, one of those prime numbers being Julius Caesar himself!" HP "is, to be sure, a necessary condition on number… HP is not, however, sufficient." That insufficiency is what drove Frege to the deeper, fatal Basic Law V.

**Bad Company, and the Gödel connection.** Tennant's diagnosis is completely general: "**any** double-barreled abstraction principle for @ whose right-hand side (i) adverts to concepts and (ii) is logically true upon taking Φ for Ψ, will generate existential commitment to a denotation for any well-formed abstract term." The mechanism that destroyed BLV is present in HP too — hence "anti-zero," `#x(x = x)`. Wright's retreat is to restrict HP to concepts "both sortal and not indefinitely extensible," and Tennant's rejoinder is one this file has met before: "**In the absence of any such effective method, the theory will not have been axiomatized**" — i.e. the restriction, if undecidable, forfeits the very effective-axiomatizability condition that §2.16's ZFC discussion identified as load-bearing.

**How logicism failed — four distinct blows**, worth keeping separate:

| Blow | Target | What it did |
|---|---|---|
| **Russell's paradox** | Frege | BLV is outright inconsistent; the shortfall is Cantor's, and unbounded |
| **The cost of types** | Russell | "a different series of the 'same' numbers within each type"; impredicative class abstracts had to be *postulated*, "revealing them instead as no more than mathematical posits" |
| **The extra axioms** | Russell | "the existential postulation present in Russell's Multiplicative Axiom (nowadays known as the Axiom of Choice) and in his Axiom of Infinity were seen as marks of the merely mathematical" — Reducibility belongs on this list |
| **Gödel 1931** | Everyone | "one would be hard pressed to make good on the claim that all mathematical truths are true by virtue only of such logical considerations as can be captured in systems of formal proof" |

📌 Note what the third blow does to §2.16's own two-column table: **type theory handles the paradox in the grammar and its mathematics in the axioms**, whereas ZF handles both in the axioms — and it was precisely the axioms, not the grammar, that damaged Russell's logicism. And note that incompleteness bites only **strong** logicism (all *truths* are logical truths); **weak** logicism (all *theorems* are) survives it, which is the space neo-logicism operates in.

### 2.17 Combinatory logic, ontological commitment, and the logic of action

*SEP: Combinatory Logic (Bimbó) · Logic and Ontology · Logic of Action. Plus Paradoxes and Contemporary Logic (Cantini) for one citation repair.*

#### 2.17a The four-way slogan, verified in both directions

📌 **Provenance repair.** The quote this file's §5.1 attributes to the combinatory logic entry — "in order to derive the Russell paradox one considers a function of two variables, then one diagonalizes… But this step only works if W is accepted" — **is not in that entry.** It is Cantini's, in SEP *Paradoxes and Contemporary Logic*, which also carries the sharper companion line: "the contraction rule A→(A→B)⇒(A→B). **The role of contraction was noticed by Fitch 1936.**" The combinatory entry supports the claim independently but says it differently: "Russell's paradox emerges from the fixed point of the negation connective," and Fitch's basic logic contains exactly **T, B and W** — so Fitch's own system builds contraction in as a primitive constant.

**Every axiom below verified a classical tautology; every reduction confirmed mechanically.**

| Comb. | Reduction | Structural rule | Implicational axiom | Classical |
|---|---|---|---|---|
| **I** | `Ix ▷ x` | identity | `A ⊃ A` | VALID |
| **K** | `Kxy ▷ x` | **weakening** | `A ⊃ (B ⊃ A)` | VALID |
| **W** | `Wxy ▷ xyy` | **contraction** | `(A ⊃ (A ⊃ B)) ⊃ (A ⊃ B)` | VALID |
| **C** | `Cxyz ▷ xzy` | **exchange** | `(A ⊃ (B ⊃ C)) ⊃ (B ⊃ (A ⊃ C))` | VALID |
| **B** | `Bxyz ▷ x(yz)` | **composition** (prefixing) | `(A ⊃ B) ⊃ ((C ⊃ A) ⊃ (C ⊃ B))` | VALID |
| **B′** | `B′xyz ▷ y(xz)` | composition (suffixing) | `(A ⊃ B) ⊃ ((B ⊃ C) ⊃ (A ⊃ C))` | VALID |
| **S** | `Sxyz ▷ xz(yz)` | contraction + exchange + cut, **fused** | `(A ⊃ (B ⊃ C)) ⊃ ((A ⊃ B) ⊃ (A ⊃ C))` | VALID |
| **T** | `Txy ▷ yx` | assertion | `A ⊃ ((A ⊃ B) ⊃ B)` | VALID |
| **M** | `Mx ▷ xx` | self-application | **no simple type** | — |
| **Y** | `Yx ▷ x(Yx)` | fixed point | **no simple type**; would need `(A ⊃ A) ⊃ A` | **INVALID**, CM `A=F` |

Two things this buys beyond the slogan. **S is not a fifth structural rule; it is three of them fused** (`S = B(B(BW)C)(BB)`, verified). So the `{S,K}` base of intuitionistic implicational logic *is* {contraction, exchange, composition, weakening} in disguise — which is why intuitionistic implication has all the structural rules. And **classical logic falls off the end of the correspondence**: Peirce's Law is a classical tautology (verified) but, in the entry's words, "**is not the type of any combinator** in the type assignment system TA_CL." Curry–Howard stops at intuitionistic logic. For Lecture 11 this is the natural top of the ladder: the combinators name the *sub*structural forks *below* intuitionistic logic, and nothing names the classical step above it.

| Base | Logic | Rules present |
|---|---|---|
| `{B,C,I}` | linear implication | exchange, composition |
| `{B,C,K,I}` | affine (BCK) | + weakening |
| `{B,I,W,C}` | `R_→`, relevant implication | + contraction, **no** weakening |
| `{S,K}` | `J_→`, intuitionistic | all four |
| — | classical (+ Peirce) | **no combinatory base** |

⚠️ *A discrepancy in the entry itself*: its correspondence theorem gives ticket entailment `T_→`'s base as `{B,B′,I,S,S′}`, while its decidability theorem two sections later gives `{B,B′,I,W}`. Both recorded; rely on neither difference.

**The machine-checked form of "contraction is the culprit."** Enumerating every combinator term up to size 5 over each base, applied to up to 4 distinct arguments, reduced to normal form:

| Base | max occurrences of any one argument | reductions tested |
|---|---|---|
| `{B,C,I}` | **1** | 15,492 |
| `{B,C,K,I}` | **1** | 63,056 |
| `{B,C,W,I}` | 108 | 61,000 |
| `{S,K,I}` | 8 | 15,492 |

**Without W (or S, or M) nothing in the calculus can duplicate an argument — and weakening does not help.** BCKI is still non-duplicating.

#### 2.17b Fixed points: the diagonal lemma still has no shadow, but the *combinatory* fixed point does

⚠️ **This corrects the prior sweep's conclusion, which was that only the fixed-point *demand* has a propositional trace.** There is a second, genuinely different route, and it leaves a trace.

The diagonal lemma is *metatheoretic*: given arithmetization, for each `φ(x)` there is a `σ` with `⊢ σ ≡ φ(⌜σ⌝)`. The combinatory fixed point theorem is *object-level* and needs no coding at all: **for any `M` there is an `N` with `MN = N`** — take `N = YM`. Self-reference here is achieved by **self-application**, not Gödel numbering: "pure untyped CL does not exclude the self-application of functions," and "a theory in which functions can become their own arguments is completely sensible, in addition to being consistent."

**The trace is Y's missing type, and it is a countermodel a student can draw.** `Yx ▷ x(Yx)` means `Y` maps an `A ⊃ A` to an `A`, so its type would have to be `(A ⊃ A) ⊃ A`:

| Form | Verdict | Countermodel |
|---|---|---|
| `⊢ (p ⊃ p) ⊃ p` | **INVALID** | `p = F` |
| `p ⊃ p, (p ⊃ p) ⊃ p ⊨ p` | **VALID** | — |

That is the whole story in two lines. `(A ⊃ A) ⊃ A` is a non-theorem; but since `A ⊃ A` *is* a theorem, adopting `(A ⊃ A) ⊃ A` **as a schema** yields every `A` whatever. **"Every function has a fixed point" has an exact propositional shadow, and the shadow is triviality.** This is the propositional face of the entry's remark that "if we consider the language of FOL expanded with combinators, then the resulting system is inconsistent, because CL is powerful enough to define the fixed point of any function."

**Three fixed-point demands, separated by exhaustive check:**

| Fixed point of | Premise | Satisfiable? | Entails |
|---|---|---|---|
| negation (Russell/Liar) | `c ≡ ∼c` | **UNSAT**, 0 of 2 | ⊥, hence everything vacuously |
| `(· ⊃ p)` (Curry) | `c ≡ (c ⊃ p)` | **SAT**, exactly one model, `c=T, p=T` | `p` — **but not `q`** |
| identity (truth-teller) | `c ≡ c` | SAT, both models | nothing |
| M's type demand | `A ≡ (A ⊃ B)` | SAT, `A=T, B=T` | `A & B` |

📌 **Two teaching points.** First, **Curry's premise is consistent** — that is precisely what makes Curry worse than the Liar. The Liar's premise refutes itself; Curry's premise is satisfiable and simply *forces* `p`. Second, verified: `c ≡ (c ⊃ p) ⊨ q` is **INVALID** (CM `c=T, p=T, q=F`). Curry does not give you everything — it gives you *that* `p`, the one the sentence names. Students routinely conflate these.

**Russell built from W, mechanically.** Cantini's `W(BN)(W(BN))` is a fixed point of negation; the reduction reproduces itself under one `N` at step 2. **W appears twice, K appears zero times.** The paradox needs the duplicator and never needs the cancellator. Four of the entry's definitions of `Y` were checked (Curry's `BM(BWB)`, Turing's, `BM(CBM)`, `B′(B′M)M`) and every one contains a duplicator. Combined with the linearity table above:

> **No fixed point combinator is definable without contraction.** `Yf ▷ f(Yf)` needs two occurrences of `f` on the right; no BCI or BCKI term ever produces two.

The entry notes that fixed point combinators can be defined *without a cancellator*. It does not state the converse. The converse is what Lecture 11 wants, and it holds.

**And the Curry decomposition, verified**, which is the form to build the lecture on:

| # | Premises ⊨ conclusion | Verdict | Countermodel |
|---|---|---|---|
| **D1** | `c ⊃ (c ⊃ p)`, `(c ⊃ (c ⊃ p)) ⊃ (c ⊃ p)`, `p ⊃ q` ⊨ `q` | **INVALID** | `c=F, p=F, q=F` |
| D1′ | `c ⊃ (c ⊃ p)`, **`(c ⊃ p) ⊃ c`**, `p ⊃ q` ⊨ `q` | **VALID** | — |
| — | `c ⊃ (c ⊃ p)` ⊨ `p` | INVALID | `c=F, p=F` |
| — | `(c ⊃ p) ⊃ c` ⊨ `p` | INVALID | `c=T, p=F` |
| — | `(c ⊃ p) ⊃ c` ⊨ `c` | **VALID** (Peirce) | — |

**Contraction alone does not produce Curry's paradox.** Give the students the premise set including the W axiom itself, and the tree stays open at `c=F` — the Curry sentence is simply false, no paradox. Add the other half of the biconditional and it closes. **The paradox needs both the contraction step and the fixed-point step; each alone is refutable by tree**, and the second half gives you the *sentence* while the first gives you the *conditional*.

Three further near-misses for the traps list, all **INVALID**: `(A ⊃ (B ⊃ C)) ⊃ (A ⊃ C)` (contraction across *distinct* antecedents; CM `A=T,B=F,C=F`); `(B ⊃ A) ⊃ A` (K does not run backwards; CM `A=F,B=F`); `((A ⊃ B) ⊃ B) ⊃ A` (assertion reversed; CM `A=F,B=T`).

#### 2.17c Ontology: Quine's criterion, and the exact bill for the non-empty-domain convention

The criterion rests on **objectual semantics**, verbatim: "`∃x Fx` is true just in case there is an object in the domain of quantification that, when assigned as the value of the variable `x`, satisfies the open formula `Fx`. This makes obvious that the truth of a quantified statement is ontologically relevant… **since we need entities to assign as the values of the variables**." That last clause *is* the criterion — a claim about *semantics*, not syntax, which is why the course's second half can teach `∀`/`∃` with no ontology and lose nothing formally. What it loses is the answer to "what makes `∃x Fx` true."

**Three objections, with verified shadows.** (i) *Substitutional semantics* — "`∃x Fx` is true just in case there is a **term** in the language that when substituted for `x` yields a true sentence" — "has often been used to argue that there are ontologically innocent uses of quantifiers." Shadow: `∃x Fx ⊨ Fa ∨ Fb` is **INVALID** objectually (smallest countermodel `D={0,1}`, `F={0}`, `a↦1`, `b↦1`); the substitutional reading with domain closure validates it. **The open branch is an unnamed witness.** (ii) Formal tools are dispensable if all that matters is whether what we accept implies "there are numbers." (iii) *Logical form is not given* — Russell on descriptions, Davidson on events.

For (iii), the Russell pair: `∼∃x(Kx & ∀y(Ky ⊃ y=x) & Bx) ⊨ ∃x Kx` is **INVALID** (smallest `D={0}`, `K=∅`), while the un-negated `∃x(Kx & ∀y(Ky ⊃ y=x) & Bx) ⊨ ∃x Kx` is **VALID**. *Asserting* "the K is B" commits you to a K; *denying* it does not — the Russellian analysis is exactly the device that makes commitment track assertion rather than subject-term.

📌 **Davidson is the better classroom item, because it is not about descriptions at all.** Verified:

| Form | Verdict | Countermodel |
|---|---|---|
| `∃e(Be & Ke), ∃e(Be & Se) ⊨ ∃e(Be & Ke & Se)` | **INVALID**, 38 cm over 584 interpretations | `D={e₁,e₂}`, `B={e₁,e₂}`, `K={e₁}`, `S={e₂}` |
| `∃e(Be & Ke & Se) ⊨ ∃e(Be & Ke)` | **VALID** | — |

Reading `B` = "is a buttering of the toast by Fred," `K` = "in the kitchen," `S` = "slowly": *"Fred buttered the toast in the kitchen"* and *"Fred buttered the toast slowly"* do **not** entail *"Fred buttered the toast slowly in the kitchen."* The open branch delivers a **two-event** countermodel. Adverb-*dropping* is valid; adverb-*conjoining* is not. That asymmetry is Davidson's argument that action sentences quantify over events, and it is entirely within our first-order fragment.

**Neutrality, and the exact bill.** The neutrality argument, verbatim: logical truths "hold in any domain. In particular, they hold in an empty domain… And if that is true then logical truths can't imply that anything exists." The counterargument is that `⊢ ∃x x=x` — and the entry's own diagnosis is the honest one: "it is only so because, **by definition, a model for (standard) first order logic has to have a non-empty domain**." The turn of the screw, for a believer in logical objects: "If it is granted that logical truths have to hold in any domain, then any domain has to contain the logical objects. Thus… there can be no empty domain."

**Verified, and the bill is exact and short:**

| Form | Domains ≥ 1 (standard) | Domains ≥ 0 |
|---|---|---|
| `∀x Fx ⊃ ∃x Fx` | **VALID** | **INVALID** — 1 countermodel, `D=∅` |
| `∃x(Fx ∨ ∼Fx)` | **VALID** | **INVALID** — 1 countermodel, `D=∅` |
| `∀x(Fx ⊃ Gx), ∃x Fx ⊨ ∃x Gx` | VALID | **VALID** — survives |

**Admitting the empty domain costs you existential import for `∀` and the theoremhood of "something exists," and nothing else in the entailment relation.** A genuine inference with an existential premise is untouched. So the convention buys two *logical truths* and no *inferences* — cheap, but not free, and that is a precise thing to tell students.

#### 2.17d Action: STIT fails weakening, and it is the same open branch as the empty domain

The yield here is higher than expected, for one structural reason: **STIT's deliberative operator is not closed under weakening, which is the semantic twin of K-failure in §2.17a.**

The entry gives the interdefinability verbatim: **`dstit_i φ ↔ (cstit_i φ ∧ ¬□φ)`.** With `D` = the histories through a moment and `C` = the agent's choice cell: `□φ := ∀h φ(h)`; `cstit φ := ∀h(Ch ⊃ φ(h))`; `dstit φ := ∀h(Ch ⊃ φ(h)) & ∃h ∼φ(h)`; background `∃h Ch`. Verified over all models with |D| ≤ 3 and a non-empty choice cell (500 interpretations):

| # | Form | Verdict | Countermodel |
|---|---|---|---|
| **G1** | `dstit φ ⊨ dstit(φ ∨ ψ)` | **INVALID**, 46 cm | `D={h₁,h₂}`, `C={h₁}`, `φ={h₁}`, `ψ={h₂}` |
| G2 | `cstit φ ⊨ cstit(φ ∨ ψ)` | VALID (control: cstit is normal) | — |
| G3 | `dstit φ, dstit(φ ⊃ ψ) ⊨ dstit ψ` | **VALID** | — |
| **G4** | `∼dstit φ ⊨ dstit ∼φ` | **INVALID**, 292 cm | `D={h₁}`, `C={h₁}`, `φ=∅` |
| G5 | `dstit φ, dstit ψ ⊨ dstit(φ & ψ)` | VALID (agglomeration holds) | — |
| G6 | `⊨ ∼dstit(φ ∨ ∼φ)` | VALID | — |
| G7 | `dstit φ ⊨ ∼□φ` | VALID | — |
| G9 | `cstit φ, ∼□φ ⊨ dstit φ` | VALID (interdefinability confirmed) | — |

**G1 is the find.** You can see to it that `φ` without seeing to it that `φ ∨ ψ`. The countermodel: your choice guarantees `φ`; but `ψ` holds on the one history where `φ` fails, so `φ ∨ ψ` is *settled* — true no matter what you do — and nobody sees to a settled truth. **Agentive contexts fail weakening**, with a concrete drawable model. In Lecture 11, K is the combinator you drop for relevance; in STIT, K is the rule that fails because *you cannot do something already inevitable*.

**G3 is a genuine asymmetry worth stating**, because students assume it cannot happen: deliberative stit is closed under modus ponens even though it is not closed under weakening. `dstit(φ ⊃ ψ)` demands `∃h(φ & ∼ψ)`, which already supplies the `∃h ∼ψ` that `dstit ψ` needs. **G4** is refraining vs. not-doing, and it is the form every deontic discussion needs.

**And the cross-link worth flagging hardest.** With `[S]Q := ∀y(Rsy ⊃ Qy)` and `⟨S⟩Q := ∃y(Rsy & Qy)`:

| # | Form | Verdict | Countermodel |
|---|---|---|---|
| **H1** | `[S]Q ⊨ ⟨S⟩Q` | **INVALID** | `D={0}`, `R=∅` |
| H2 | `[S]Q, [S](Q ⊃ P) ⊨ [S]P` | VALID (the K axiom) | — |
| **H3** | `∀x∀y(Rxy ⊃ (Px ⊃ Py)) ⊨ ∀x Px` | **INVALID** | `D={0}`, `R=∅`, `P=∅` |
| H4 | `Ps, ∀x∀y(Rxy ⊃ (Px ⊃ Py)) ⊨ ∀y(Rsy ⊃ Py)` | VALID | — |

**H1 is worth the whole subsection.** Partial correctness does not give total correctness: `[S]Q` can hold vacuously because `S` never terminates — `R = ∅`. And this is *literally the same invalidity* as the empty-domain case in §2.17c. So:

> **The non-empty-domain convention in FOL = existential import of the universal quantifier = the termination assumption in program verification.** One open branch, three philosophical bills.

If Lecture 11 wants a single picture that pays off in both halves of the course, this is it. (H3 is PDL's induction axiom with the base case dropped — invalid, as it must be.)

⚠️ **What is honestly lost**, and I do not think it is recoverable: the tree of moments and histories (everything above is a fixed-moment snapshot, so "could have done otherwise" across moments is out of reach); multi-agent independence of choices (a frame condition, not a formula); iteration `S*` (needs transitive closure, not first-order definable); the frame/ramification/qualification problems (non-monotonic by nature); BDI/KARO's fused temporal-epistemic-dynamic axioms; and Vendler's aspectual classes, which are a linguistic taxonomy with no inferential structure to mine. **Net yield: three first-order-shadowed invalidities of real interest (G1, G4, H1) plus the two cross-links — better than "report honestly if low," but three items, not a section.**

### 2.18 IF logic, infinitary logic, many-sorted logic — three ways to leave first-order, and only one of them does

*SEP: Independence Friendly Logic (Mann, Sandu, Sevenster) · Infinitary Logic (Bell) · Many-Sorted Logic (Manzano, Aranda).*

⚠️ **A method warning that generalises.** WebFetch's summariser reported that the IF entry contains "no discussion of signalling." That is **false** — the material is in §6.1 and is quoted below. The agent recovered it only by pulling raw HTML. Treat summariser *negatives* on SEP entries as unreliable throughout this file.

#### 2.18a What the slash adds, and the sentence to put on a slide

The best hook needs no set theory: **continuity vs. uniform continuity.**

- continuous: `(∀a)(∀ε)(∃δ)(∀x) R`
- uniformly continuous: `(∀a)(∀ε)(∃δ/∀a)(∀x) R`

Weierstrass's whole achievement was defining limit, continuity and derivative *in terms of quantifier dependence*; the slash does at object-language level what "depending on ε but not on a" does at meta-level. The default it cancels: "If in a first-order sentence an existential quantifier `∃y` lies in the syntactic scope of a universal quantifier `∀x`, then **by the semantics** `∃y` automatically depends on `∀x`."

📌 **The single most quotable sentence, and it is a Lecture 3 sentence:**

> "It makes no sense to speak of the independence of a move from other given moves **with reference to a single play**; this can only be done with reference to a **multitude of plays**."

A play of the game for `∀x∃y∀z(∃w/∀x)R` is *indistinguishable* from a play for `∀x∃y∀z∃w R` — same four moves in the same order. Independence lives entirely at the **strategy** level.

**Verified — when a slash *is* eliminable and when it is not.** This is the decisive pair:

| # | Form | Verdict | Countermodels |
|---|---|---|---|
| Q1 | `(∃y)(∀x)Rxy ⊨ (∀x)(∃y)Rxy` | **VALID** | none (530 models) |
| Q2 | `(∀x)(∃y)Rxy ⊨ (∃y)(∀x)Rxy` | **INVALID** | 176; smallest `R={⟨0,1⟩,⟨1,0⟩}` and `R={⟨0,0⟩,⟨1,1⟩}` |
| Q3 | `(∀x)(∃z)(∀y)Rxyz ⊨ (∀x)(∀y)(∃z)Rxyz` | **VALID** | none |
| Q4 | `(∀x)(∀y)(∃z)Rxyz ⊨ (∀x)(∃z)(∀y)Rxyz` | **INVALID** | 176 slice-countermodels |

**One slash escaping one universal buys nothing** — `(∀x)(∀y)(∃z/∀y)R` is truth-equivalent to the plain first-order `(∀x)(∃z)(∀y)R`, i.e. prenex reshuffling. The **Henkin (branching) pattern** does buy something: linear Skolemisation gives `∃f∃h ∀x∀z R(x,f(x),z,h(x,z))`, branching gives `∃f∃g ∀x∀z R(x,f(x),z,g(z))` — `h` may see `x`, `g` may not. Verified: Henkin ⊨ linear is VALID (exhaustive at ‖D‖ ≤ 2, 65,538 models; 400,000 random at ‖D‖=3), linear ⊨ Henkin is **INVALID** (10,472 countermodels at ‖D‖=2 alone).

**Assuming AC, ESO and IF logic have the same expressive power.** Expressible in IF but not FO: Dedekind-infinity of the domain, non-completeness of a linear order, ill-foundedness, disconnectedness of a graph, equicardinality, infinity of a formula's extension. Over finite models Fagin hands IF all of NP. Hintikka's controversial gloss is worth an aside: IF is "substantially speaking, a first-order logic: the entities its quantified variables range over are individuals" — so ESO's power "can actually be achieved on the first-order level."

| Property | FO | IF |
|---|---|---|
| Compactness | yes | **yes** |
| Löwenheim–Skolem | yes | **yes** |
| Separation theorem | yes | **yes** — strengthened: the separating θ is itself *first-order* |
| Complete **dis**proof procedure | yes | **yes** |
| Complete **proof** procedure | yes | **NO** — "Axiomatizability fails for IFL… IFL is semantically incomplete" (via Trakhtenbrot) |

**That asymmetry is itself a course item.** FO has both a proof and a disproof procedure only because `∼` toggles validity and inconsistency. IF has the disproof half and not the proof half, **precisely because its negation does not toggle.**

#### 2.18b Non-determinacy: bivalence fails, and §3.8's item is better than recorded — but in a different direction

A sentence is true in `M` iff player 2 has a winning strategy, false iff player 1 does. Neither: **non-determined.** The passage §3.8 should quote, verbatim:

> "In IFL, falsity does not ensue from non-truth. That is, bivalence fails in IFL. However, it should be noted that it does **not** fail due to the postulation of a third truth-value **or a truth-value gap** (cf. Hintikka 1991)… Rather, the failure is a consequence of the basic assumptions of the entire semantic theory. **Non-determinacy corresponds to a structural property: the fact that certain kinds of functions do not exist on the model considered.**"

⚠️ **Correction to the framing carried in from §3.8.** Tulenheimo denies *both* horns — not a third truth-value **and** not a postulated gap. Write "bivalence fails without any third value or gap being *postulated*"; do **not** write "IF logic has truth-value gaps." The analogy to give students: "√2 ∈ ℚ" is not made third-truth-valued by the non-existence of a rational square root of 2. Bivalence fails here in the same style that a *solution* fails to exist.

📌 **And the upgrade, which is the real §3.8 item.** For the dual negation `∼`, LEM and bivalence fail *in lockstep*: "φ is non-determined in M **iff** M ⊭ (φ ∨ ∼φ)." But IF has a **second** negation, and: "The law of excluded middle **holds** for the contradictory negation: for all sentences φ and all models M, indeed M ⊨ (φ ∨ ¬φ)."

> **One and the same logic gives both answers, and which one you get depends on which negation you read LEM with.** Read `φ ∨ ∼φ` and LEM fails exactly where bivalence does. Read `φ ∨ ¬φ` and **LEM holds while bivalence still fails** — the supervaluationist shape, obtained inside a semantics that is two-valued at bottom.

| | strong / dual / game `∼` | weak / contradictory `¬` |
|---|---|---|
| Semantics | role switch verifier↔falsifier; a **game rule** | `M,g ⊨ ¬φ iff M,g ⊭ φ`; **no game rule** |
| Compositional? | yes, within GTS | **no** — "says, *globally*, something about an entire game" |
| LEM | **fails** | **holds** |
| In FO | the two coincide | the two coincide |

Two results to bank. **Strong negation is not even a semantic operation** (Burgess 2003): "there are IF sentences χ and θ such that while `[χ] = [θ]`, the sets `[∼χ]` and `[∼θ]` are not only distinct but even **disjoint**." For a course that introduces connectives as truth-functions, this is the sharpest available demonstration that IF's negation is not one. **Contradictory negation is inexpressible, and strongly**: "if φ and ψ are IF sentences such that M ⊨ φ iff M ⊭ ψ, then **each of φ and ψ is truth equivalent to a sentence of FO**." So the *determined fragment* has exactly FO's expressive power — **the price of determinacy is exactly first-orderhood** — and IF is closed under negation over finite models **iff NP = coNP**.

**Verified by exhaustive strategy search**, ‖D‖ = 1, 2, 3, on the entry's own example `φ = (∀y)(∃x/∀y) x = y`: φ true at ‖D‖=1; **non-determined** at 2 and 3, with `∼φ` never true and `¬φ` true at 2 and 3. So `φ ∨ ∼φ` fails at ‖D‖ ≥ 2 while `φ ∨ ¬φ` holds everywhere.

📌 **A verified result not stated in the entry, and the best single example for making non-determinacy feel real.** Take Tulenheimo's infinity sentence `φ_inf = (∃t)(∀x)(∃z)(∀y)(∃v/∀x)((x = y ≡ z = v) & z ≠ t)`, true exactly on infinite domains. Exhaustive over all strategies:

| ‖D‖ | P2 wins | P1 wins | status of φ_inf |
|---|---|---|---|
| 1 | no | **yes** | **FALSE** |
| 2 | no | no | **NON-DETERMINED** |
| 3 | no | no | **NON-DETERMINED** |

**On a two- or three-element domain, the IF sentence saying "the domain is infinite" is not false — it is undetermined. Its failure carries no information at all.** That is the concrete face of `¬`'s inexpressibility: IF can say "infinite," but its dual negation cannot say "finite," because "finite" is not ESO.

#### 2.18c Signalling — the prior sweep's verdicts stand, its diagnosis does not

⚠️ **The contrast is not between two slash-sets inside one logic. It is between two logics** — Hodges's *slash logic* and Hintikka's *IF logic*. Verbatim (§6.1):

> "…consider evaluating the slash-logic sentence `(∀x)(∃y)(∃z/x) x = z` containing the vacuous quantifier ∃y. This sentence **is true on a two-element domain**, since player 2 can copy as the value of y the value that player 1 has chosen for x, and then select the value of z using a strategy function whose only argument is the value of y. (For this phenomenon of '**signaling**'…) By contrast, the IF sentence `(∀x)(∃y)(∃z/∀x) x = z` **fails to be true** on such a domain, since there a strategy function for `(∃z/∀x)` must be a constant…"

| | Hintikka's **IF logic**, `(∃z/∀x)` | Hodges's **slash logic**, `(∃z/x)` |
|---|---|---|
| Strategy functions | "in effect **Skolem functions**" — arguments are **only the opponent's moves**, minus the slashed ones | arguments may be **any preceding move**, including the player's **own** earlier moves |
| Effect of a vacuous `∃y` | inert | a **laundering channel**: y is filled with x, then z computed from y |

Because a player's own earlier existential choice is not a legal argument in IF logic, there is nowhere to hide the value of `x`. **Verified**, exhaustive strategy search:

| Sentence | logic | ‖D‖=1 | ‖D‖=2 | ‖D‖=3 |
|---|---|---|---|---|
| `(∀x)(∃y/∀x) x = y` | IF | TRUE | **NON-DET** | **NON-DET** |
| `(∀x)(∃y)(∃z/∀x) x = z` | IF | TRUE | **NON-DET** | **NON-DET** |
| `(∀x)(∃y)(∃z/x) x = z` | **slash** | TRUE | **TRUE** | **TRUE** |

The winning strategy found for the slash version: `f(x) = x`, `g(y) = y` — copy, then copy back. **The prior sweep's two recorded verdicts survive**, but the note "because in the first the second quantifier can signal the value of x" should be corrected to: *because in the first, `y`'s strategy function may take player 2's own earlier move `z` as an argument — legal in slash logic, illegal in IF logic.* Slashing `z` as well doesn't remove one argument; under Hintikka's convention there was never a legal `z`-argument to begin with.

**Signalling by disjunction, with a bandwidth limit we established ourselves.** The entry notes signalling by disjunction does occur in IF logic, giving `(∀x)((∃y/x) x = y ∨ (∃y/x) x = y)`, true on a two-element domain. Extending the check one step further than the entry does:

| ‖D‖ | status | P1 wins? |
|---|---|---|
| 1 | TRUE | no |
| 2 | TRUE (strategy: disjunct-choice (L,R), constants 0 and 1) | no |
| 3 | **NON-DETERMINED** | no (verified exhaustively) |

**A binary disjunction is a one-bit channel: enough to signal which of two elements player 1 chose, not enough for three.** 📌 Flagged as ours, not the entry's.

Sevenster's classification, one line for the record: the **signalling pattern** `(∀u)(∃v)(∃w/u)` and the **Henkin pattern** `(∀x)(∃u)(∀y)(∃v/x,u)` "are the only two patterns allowing slash logic to exceed the expressive power of FO insofar as attention is confined to formulas in prenex form." And on compositionality: Cameron & Hodges (2001) proved there is **no** Tarski-type compositional semantics for IF; team semantics buys it only by type-theoretic ascent to sets of assignments. Hintikka's needling reply is worth quoting: "if one is sufficiently ruthless, one can always save compositionality by building the laws of semantic interaction of different expressions into the respective meanings of those expressions."

#### 2.18d Infinitary logic — only what a first course needs

The organising fact: **infinite conjunction is cheap; infinite quantification is not.** `L(ω₁,ω)` remains recognisably first-order-ish; `L(ω₁,ω₁)` "resembles second-order languages" and shares "their defects (incompleteness) as well as some of their advantages."

**Compactness fails, and the counterexample is exactly stateable.** Let `L` be arithmetic plus ω₁ new constants, and `Γ = {σ} ∪ {c_ξ ≠ c_η : ξ ≠ η}` where σ is the `L(ω₁,ω)`-sentence characterising ℕ. **Γ has no model, but every countable subset does.** The consequence to put on a slide: "If just deductions of countable length are admitted, then **no deductive apparatus for `L(ω₁,ω)` can be set up which is adequate for deductions from arbitrary sets of premises**." Note the shape — it is the mirror image of what students learn about FO compactness, and it works *because* `L(ω₁,ω)` pins down ℕ. **Compactness and categoricity are trading against each other in one visible transaction.**

**What infinitary conjunction buys.** *Finiteness*: `∨_{n∈ω} ∃v₀…∃v_n ∀x(x = v₀ ∨ … ∨ x = v_n)` — verified disjunct-by-disjunct, the n-th disjunct true exactly when ‖D‖ ≤ n+1. *ℕ up to isomorphism*: four `L(ω₁,ω)` sentences, of which only `∀x ∨_{m∈ω} x = sᵐ0` is essential to the categoricity — **that last line is exactly what FO cannot write**, and it is the cleanest answer to "why doesn't FO pin down ℕ?" *A truth predicate*: `Tr(x) := ∨_{n∈ω}(x = **n** ∧ σ_n)`, for which `Tr(**n**) ↔ σ_n` is valid for each n. 📌 Directly usable in a Tarski lecture: **infinitary disjunction makes the T-schema a single formula rather than a schema, at the cost of a formula of infinite length. Tarski's undefinability is not a barrier to defining truth; it is a barrier to defining it *finitely*.**

**Where the finite-quantifier ceiling is.** Well-orderings need `L(ω₁,ω₁)` — the sentence contains an **infinite quantifier**, expressing "the essentially second-order assertion that every countable subset has a least member," and "the class of well-ordered structures **cannot be characterized in any finite-quantifier language**."

| Property | FO = L(ω,ω) | L(ω₁,ω) | L(ω₁,ω₁) |
|---|---|---|---|
| Compactness | **yes** | **no** | no |
| Completeness (countable deductions, countable premise sets) | **yes** | **yes** (Karp) | no |
| Downward LS | **yes** | **yes** | yes |
| Upward LS | **yes** | **no** | no |
| Prenex normal form | **yes** | **no** | no |
| Characterises ℕ up to iso | no | **yes** | yes |
| Characterises well-orderings | no | no | **yes** |

Upward LS fails for a reason a first course sees immediately: the sentence characterising ℕ has a model of cardinality ℵ₀ and no models of any other cardinality.

📌 **One recommendation, and it is a good exercise for the week after FO compactness is proved.** The entry's proof that **prenex normal form fails** for `L(ω₁,ω)` *uses* FO compactness and nothing else. Suppose the finiteness sentence σ were equivalent to a conjunction of prenex `L(ω₁,ω)` sentences σᵢ. Each σᵢ, being a sentence, contains only finitely many variables, so each is equivalent to a first-order sentence. Then σ and the *first-order* set Δ = {σᵢ} have the same models. Δ has models of every finite cardinality; by FO compactness Δ has an infinite model; σ has none. Contradiction. **Two moves, both in the toolkit, and it makes vivid that "put it in prenex form" is a theorem, not a convention.**

#### 2.18e Many-sorted logic — convenience, and the entry says so

**Convenience, twice in terms.** From the introduction: many-sorted logic "**stays inside** first-order logic, so the main metatheorems (completeness, interpolation, and so on) can be proved… [it] **can be reduced to one-sorted first-order logic, both syntactically and semantically**." And with the reason, in §2.3: "Lindström (1969) proves that first-order logic is characterizable as the strongest logic to possess simultaneously **Compactness** and **Löwenheim-Skolem**… Therefore, many-sorted logic **cannot be considered as a proper extension** of first-order logic."

The reduction is *relativisation of quantifiers*: add a unary `Qᵢ` per sort, forget sorts on variables, and set `Trans(∃xⁱφ) := ∃xⁱ(Qⁱxⁱ & Trans(φ))`. **Main theorem:** `Γ ⊨_MSL φ iff Trans(Γ) ∪ Π ⊨_FOL Trans(φ)`, where Π says (1) `∃x Qᵢx` — **the sorts are nonempty**; (2) functions land in the right sort; (3) constants have their sort.

**Verified — the price of Π, made concrete.** The many-sorted validity `(∀x¹)Px ⊨ (∃x¹)Px` holds because sort domains are nonempty. Its naive relativisation is not:

| # | Form | Verdict | Countermodels |
|---|---|---|---|
| R1 | `∀x(Q₁x ⊃ Px) ⊨ ∃x(Q₁x & Px)` — no Π | **INVALID** | 14 of 84; **every model with `Q₁` empty** |
| R2 | `∃x Q₁x, ∀x(Q₁x ⊃ Px) ⊨ ∃x(Q₁x & Px)` — with Π | **VALID** | — |

📌 That is the whole "notational convenience" story in one line: **many-sorted logic is one-sorted logic plus the standing assumption that every sort is inhabited, which one-sorted logic must be *told*.** And note it is the *same* assumption as §2.17c's non-empty-domain convention, one level down — a fourth appearance of that open branch.

⚠️ The entry flags what the reduction does **not** hand you free: "interpolation in MSL requires its own proof," and "interpretability between many-sorted theories is not obtained from their one-sorted counterparts."

#### 2.18f Henkin second-order logic *is* many-sorted first-order logic — with one precisification

**§2.10's note is supported, and §4 of the entry makes it a translation theorem rather than an analogy.** Under standard semantics SOL is categorical for PA² but "we pay a high price… **Compactness fails, Löwenheim-Skolem fails and Completeness fails**." Under general (Henkin) models, with relation universes closed under definability — enforced by the **Comprehension Schema**, which Henkin 1953 introduced "as a way of getting rid of the complex substitution rule of Church" — "the set of validities coincides with the set of sentences derivable in the second-order calculus. So, **we go back to the situation encountered in first-order logic**."

The translation: "second-order structures **are in fact many-sorted** with certain peculiarities." With sorts 1 and ⟨1,…,1,0⟩ and membership symbols εₙ, `Trans(Xⁿx₁…xₙ) := εₙ x₁…xₙ Xⁿ`. Then `⊨_GS φ in SOL ⟺ ⊨_𝔖* Trans(φ) in MSL`, and 𝔖* is axiomatised by **Δ = Extensionality + Comprehension + Disjoint universes**.

⚠️ **The precisification §2.10 needs.** Henkin-semantics SOL is not *identical* to many-sorted FOL; it is many-sorted FOL **relative to the specific theory Δ**. What survives of second-order-ness after translation is **axioms, not logic** — and that is exactly why completeness, compactness and Löwenheim–Skolem come back. Combining with §2.18e the chain runs all the way down: **Henkin SOL → many-sorted FOL → one-sorted FOL**, so under general semantics second-order logic is, up to translation, a one-sorted first-order theory. A clean sentence to say in lecture, and the entry earns it.

Two more worth a line. SOL under general semantics **loses the definability of identity** — "`∀X(Xx ↔ Xy)` is no longer a definition of genuine identity" — so `≈` must be primitive and Extensionality added; a nice small illustration that Henkin semantics is a real weakening, not bookkeeping. And the entry's own moral, quotable: "**a logic is like a balance scale: you have expressive power in one pan and computability power in the other**… you cannot have both at a maximum, they are 'optimal impossible'."

### 2.19 Backward induction and coalitional power — one clean map of a literature, and a matching-pennies punchline

*SEP: Logics for Analyzing Games (rev. Dec 2022) · Reasoning About Power in Games (rev. Dec 2023). ⚠️ The slug `logic-power-games` is correct and does **not** 404, contrary to the note carried in the queue.*

#### 2.19a Backward induction's soundness argument is disappointingly thin — and that is worth saying

Unrolled at fixed depth, backward induction is **a chain of `&E` and modus ponens and nothing else.** Three-node centipede, `p`/`q` = A/E is rational, `tₖ` = the BI move is played at node k:

| # | Premises | ⊨ `t₁` | Countermodels |
|---|---|---|---|
| BI-0 | `p, q` | **INVALID** | 1: `p=T, q=T, t₁=F` |
| BI-2 | `p, q, p⊃t₃, (q&t₃)⊃t₂` | **INVALID** | 1 |
| **BI-3** | `p, q, p⊃t₃, (q&t₃)⊃t₂, (p&t₂)⊃t₁` | **VALID** | — |
| BI-3a | BI-3 minus `q` | **INVALID** | 1: `p=T, q=F, t₂=F, t₃=T` |

Verified at depths 3, 5, 7 and 9 (the depth-9 chain has 11 premises): **all valid, and every premise load-bearing** — deleting any single one produces countermodels. So it is a clean, scalable, fully verifiable Fitch exercise with no propositional insight beyond iterated MP.

📌 **Worth saying to students explicitly**, because "backward induction" *sounds* like it should be a logical induction and is not: the genuine induction is metalinguistic — it gets you the *schema* for arbitrary n, not any inference inside a fixed n. What backward induction is, is an n-fold nesting of conditionals **whose antecedents mention the next player's rationality**, and that nesting is where the content lives.

#### 2.19b The paradox of backward induction is a minimal-inconsistent-set exercise — and the resolutions map one-to-one

**This is the strongest single teaching artefact in the whole sweep.** Atoms: `a` = A takes at n₁; `d` = node 2 is reached, i.e. A deviated; `b` = E takes at n₂; `p`/`q` = A/E is rational; `k` = at node 2, A is still taken to be rational.

| | Premise | Gloss |
|---|---|---|
| [0] | `(q & k) ⊃ b` | BI's computation at n₂ needs A's rationality at n₃ |
| [1] | `(p & b) ⊃ a` | BI's computation at n₁ |
| [2] | `d ≡ ∼a` | tree fact: n₂ is reached iff A did not take at n₁ |
| [3] | `d ⊃ k` | **CKR survives the deviation** (Aumann) |
| [4] | `k ⊃ p` | **factivity** of knowledge |
| [5] | `d ⊃ ∼p` | **a deviation is an irrational move** |
| [6] | `q` | E is rational |

**Verified.** `{[0]–[6]}` is **SATISFIABLE**, 5 of 64 rows. `{[0]–[6]} ⊢ a` **VALID**. `{[0]–[6]} ⊢ ∼d` **VALID**. `{[0]–[6]} ∪ {d}` **UNSATISFIABLE**, 0 of 64.

> **Backward-induction theory is perfectly coherent, and it entails that the off-path node is never reached. The paradox is generated by adding the one hypothesis the theory itself rules out.**

That is exactly the right pedagogical shape: it is a **conditional-with-an-impossible-antecedent** puzzle dressed as a game-theoretic one, and it is visible on a 64-row truth table.

**Two minimal inconsistent subsets, both verified minimal** (deleting any member restores satisfiability, individually checked):

- **MIS-1**, four premises: `{ d, d⊃k, k⊃p, d⊃∼p }`. UNSAT; deletions restore 3, 1, 1, 1 satisfying rows. *The epistemic core: the deviation both licenses the rationality assumption and refutes it.*
- **MIS-2**, seven premises: `{ [0], [1], [2], [3], [4], [6], d }` — the whole theory minus [5], plus `d`. UNSAT; all seven deletions restore satisfiability. *Even if you refuse to read the deviation as evidence of irrationality, the theory still derives `a`, and [2] then gives `∼d`.*

**They are logically independent — neither contains the other — and every published resolution has to say something about both.** MIS-1 is the "what does the deviation tell you" paradox; MIS-2 is the "BI's own prediction refutes the hypothesis" paradox.

📌 **And here is the payoff: each named resolution drops exactly one member of MIS-1, one each, no overlap. Verified.**

| Resolution | Member dropped | Remaining set | SAT? |
|---|---|---|---|
| **Aumann / public announcement** (`!rat` trims the model, deleting the deviating node) | **`d`** — the hypothesis is not assertible at all | `{d⊃k, k⊃p, d⊃∼p}` | SAT (3 rows) |
| **Bicchieri** (the deviation is significant) | **`d⊃k`** — CKR does not survive observed deviation | `{d, k⊃p, d⊃∼p}` | SAT (1) |
| **Stalnaker / Baltag, Smets & Zvesper**, soft radical upgrade `⇑rat*`, tree intact | **`k⊃p`** — belief replaces knowledge, factivity goes | `{d, d⊃k, d⊃∼p}` | SAT (1) |
| **Trembling hand / Selten** | **`d⊃∼p`** — the deviation is noise, not evidence | `{d, d⊃k, k⊃p}` | SAT (1) |

Note that the entry's *own* two treatments — public announcement (hard information, node deletion) versus radical upgrade (soft information, plausibility reordering) — land on rows 1 and 3. **The difference between §4.1.1 and §4.1.2 of the entry *is* the difference between dropping `d` and dropping `k ⊃ p`.**

**A sharpening that closes one escape.** State rationality as a **biconditional** — `p ≡ a`, "A is rational iff A takes at n₁" — and [5] is no longer optional: `{p ≡ a, d ≡ ∼a} ⊨ d ⊃ ∼p` is **VALID**. The paradox set becomes `{p≡a, d≡∼a, d, d⊃k, k⊃p}`, unsatisfiable, with the whole five-element set as its **unique MIS** (verified minimal at all five). The trembling-hand escape is now unavailable: to escape you must reject `p ≡ a` itself. 📌 **A genuine philosophical result recovered by a truth table, and a good illustration of the general moral that stating a bridge principle as `≡` rather than `⊃` costs you an escape route.**

#### 2.19c Common knowledge of rationality, unpacked

Atoms as above, plus `e₁` = E believes A is rational; `a₁` = A believes E is rational; `a₂` = A believes that E believes that A is rational; `f` = A expects E to play the BI move at n₂. Bridges: `p⊃t₃`; `(q&e₁)⊃t₂`; `(a₁&a₂)⊃f`; `(p&f)⊃t₁`.

| # | Premises ⊨ `t₁` | Verdict | Countermodels |
|---|---|---|---|
| CKR-OP | `ckr, ckr⊃t₁` | **VALID but vacuous** | — |
| **CKR-A** | `p, q` + all four bridges | **INVALID** | **9** — all with `p=T, q=T, t₃=T, f=F, t₁=F` |
| CKR-B | + level 1 (`e₁, a₁`) | **INVALID** | 1: `a₁=T, a₂=F` |
| CKR-C | + level 2 (`a₂`) | **VALID** | — |

CKR-OP is the shape every informal presentation of the BI theorem actually has, and it shows the epistemic operator doing 100% of the work. CKR-A is the same claim with the operator unpacked but the epistemic premises not supplied, and **the nine countermodels all share `f=F`** — situations in which A is rational, E is rational, and A still has *no expectation about E*.

**The finding worth keeping — which premises are load-bearing for which conclusion:**

| Conclusion | Load-bearing | Idle |
|---|---|---|
| `t₁` (A takes at n₁) | `p, a₁, a₂,` S, O1′ | `q, e₁,` O1, O2 |
| `t₂` (E takes at n₂) | `q, e₁,` O2 | everything else |
| `f ≡ t₂` (A's expectation is **correct**) | `q, e₁, a₁, a₂,` O2, S | `p,` O1, O1′ |

> **To derive what a rational A does you need only A's beliefs; to derive that A's expectation is *true* you need both players' epistemic premises.**

That is precisely the difference between individual rationality and *common* knowledge, here as a difference between two premise subsets rather than a hand-wave about an infinite hierarchy. Note also that `p⊃t₃` — the last-node decision step — is **idle for every conclusion** in the three-node game: A's node-3 move enters only through E's *belief* about it, never through the fact. A student who does not notice this will over-assume. 📌 **And the depth fact:** the number of iterated-belief premises needed is depth − 1. This is the propositional shadow of "n-fold mutual knowledge suffices in a depth-n tree," and the cleanest available demonstration that **common knowledge does bounded, countable work in any actual finite game. The infinite hierarchy is never used.**

#### 2.19d Power adds nothing beyond quantification — which is exactly what makes it teachable

The α-effectivity function is `E^α_S(C) = { X | ∃σ_C ∀σ′_C̄ : o(σ_C, σ′_C̄) ∈ X }` — a **∃∀ alternation over strategies**, full stop. So `[C]φ` is literally `∃σ_C ∀σ_C̄ φ(o(…))`, and β-effectivity is the same string with the quantifiers swapped. **The coalition modality is a notational device for keeping the strategy quantifiers out of sight so that reasoning about outcomes can stay propositional.**

Grounding on a 2×2 game makes each characteristic axiom an elementary quantifier fact, checkable exhaustively:

| Axiom | Quantifier form | Verdict | Countermodels |
|---|---|---|---|
| Outcome monotonicity | `∃x∀y P ⊃ ∃x∀y R` | VALID (256 rows) | — |
| **Aggregation** `([C]φ & [C]ψ) ⊃ [C](φ&ψ)` | `∃x∀y P & ∃x∀y Q ⊃ ∃x∀y(P&Q)` | **INVALID** | **18**; canonical `P₁₁=P₁₂=T, P₂₁=P₂₂=F, Q` the reverse |
| Superadditivity (disjoint C, D) | `∃x∀y P & ∃y∀x Q ⊃ ∃x∃y(P&Q)` | VALID | — |
| Regularity `[C]φ ⊃ ∼[C̄]∼φ` | `∃x∀y P ⊃ ∼∃y∀x ∼P` | VALID | — |
| **Determinacy** `∼[C̄]∼φ ⊃ [C]φ` | `∀y∃x P ⊃ ∃x∀y P` | **INVALID** | **2**: the two anti-diagonals |
| α ⊃ β | `∃x∀y P ⊃ ∀y∃x P` | VALID | — |
| **β ⊃ α** | `∀y∃x P ⊃ ∃x∀y P` | **INVALID** | **2 — identical to the determinacy countermodels** |

**Three things fall out that are course-grade.**

**(a) Non-normality is explained, not just asserted.** The games entry reports that "forcing powers are not closed under intersection, [so] the aggregation law fails." Grounded, this is exactly the standard first-course invalidity `∃x∀y Pxy & ∃x∀y Qxy ⊬ ∃x∀y(Pxy & Qxy)` — the two `∃`s pick different witnesses. Strategy `x₁` forces φ, strategy `x₂` forces ψ, and A has to pick one. **A student who has done the ∃∀ drill already understands why coalition logic is monotonic and not normal.**

**(b) Determinacy is the ∀∃ → ∃∀ shift, and its countermodels are matching pennies.** The determinacy axiom and the invalid quantifier shift have *literally the same two countermodels* on the 2×2 grid: the two anti-diagonal patterns. Those are matching pennies. 📌 **So the single most drilled invalidity in a first FOL course is, on the nose, the reason indeterminate games exist.** This connects to the prior sweep's "total is not determined" result (`∼(a&b) ⊨ a ≡ ∼b`, INVALID, CM `a=F, b=F`) — that was the *atomised* version of the same phenomenon. Here it is again, and repaired:

| # | Premises ⊨ `ap ≡ ∼en` | Verdict | Countermodels |
|---|---|---|---|
| PW-1 | `ap ⊃ ∼en, ep ⊃ ∼an` (consistency of powers only) | **INVALID** | **3**, all with `ap=F, en=F` |
| PW-2 | + `∼en ⊃ ap, ∼an ⊃ ep` (determinacy) | **VALID** | — |

**(c) Coalition logic's axioms do NOT have informative propositional shadows.** Atomise `{A}p`, `{A}q`, `{A}(p&q)` as three unrelated atoms and aggregation is invalid for a trivial reason that says nothing about power. Atomisation destroys exactly the operator/connective interaction the axioms are about. ⚠️ **So the answer to "do coalition logic's characteristic axioms have propositional shadows" is *no* — they have first-order shadows, and those are worth teaching while the propositional ones are not.** That is a useful counterweight to the atomisation technique used elsewhere in this file.

#### 2.19e Weighted voting — the one piece that is straightforwardly a first-course exercise

The entry's running example is the **Treaty of Rome, Art. 148**: France, Germany, Italy 4 votes each, Belgium and the Netherlands 2, Luxembourg 1; total 17; Commission-proposed measures need 12. Six atoms, a 64-row truth table. All verified exhaustively:

| # | Claim | Result |
|---|---|---|
| **R1** | The ≥12 rule is equivalent to `(f & g & i) ∨ (b & n & ((f&g) ∨ (f&i) ∨ (g&i)))` | **0 mismatches over 64 rows** |
| **R2** | Luxembourg is a dummy under E ("E(C) = E(C ∪ Luxembourg)") | **VERIFIED**; `l` is the only dummy — and **not** a dummy under E* |
| R3 | No veto players under either rule | verified (weight without France = 13 ≥ 12) |
| R4 | Minimal winning coalitions under E: `{F,G,I}, {F,G,B,N}, {F,I,B,N}, {G,I,B,N}` — four | verified; six under E* |
| R5 | Both rules monotone | verified |
| **R6** | The two rules differ on **exactly one of the 64 rows**: `f=g=i=T, b=n=l=F` (12 votes, 3 states) | verified — confirms "the difference is made by coalitions of size 3" |

**R1 and R2 are the good exercises.** R1 is "convert a weighted rule into a Boolean formula and check it"; R2 is "prove by truth table that a sentence letter is *redundant* — that ψ is equivalent to a formula not containing it." R6 is a nice payoff: an entire clause of a treaty article bites on one of sixty-four cases.

There is also a clean **first-order** item in the power entry's definition of a weak veto player, `∀C([C]φ ⊃ i ∈ C)`. With coalitions as the domain, `Wx` = "x is winning," `Mxy` = "y is a member of x": `Veto(y) := ∀x(Wx ⊃ Mxy)`; "some player is in every winning coalition" `∃y∀x(Wx ⊃ Mxy)`; "every winning coalition has some member" `∀x∃y(Wx ⊃ Mxy)`. **That is the ∃∀/∀∃ scope drill with a non-artificial reading**, connected back to the α/β distinction — and the Treaty model makes the first false and the third trivially true, which is a good pairing.

⚠️ **What does not reach a first course**, per instruction and confirmed: playability conditions as such, the truly-playable characterisation theorem, Coalition Logic's inability to separate playable from truly playable, Quantified and Higher-Order Coalition Logic, and the probabilistic/resource-bounded modalities. The entry's own conclusion — "there is no right answer… it all depends on what the fundamental characteristics are that one is trying to model" — is a level-of-analysis point, not an inference.

---

## 3. LOGICAL CONNECTIVES AND STRUCTURAL COMPONENTS

*SEP: conditionals · conditionals: counterfactual · connectives: sentence connectives in formal logic · contradiction · disjunction · logical constants · negation.*

### 3.1 The paradoxes of material implication, and the one Grice cannot rescue

| ID | Form | Verdict | Name | Size | Prop? |
|---|---|---|---|---|---|
| CLI-301 | `q ⊢ p ⊃ q` | VALID | *Verum ex quolibet* | 2 / 4 | yes |
| CLI-302 | `∼p ⊢ p ⊃ q` | VALID | *Falsum ex quolibet* / vacuous truth | 2 / 4 | yes |
| CLI-303 | `p ∨ q ⊢ ∼p ⊃ q` | VALID | **Or-to-If**, "the Direct Argument" (Stalnaker 1975) | 2 / 4 | yes |
| CLI-304 | `⊢ (p⊃q) ∨ (q⊃p)` | TAUT | For any two unrelated sentences, one implies the other | 2 / 4 | yes |
| CLI-305 | `⊢ (p⊃q) ∨ (q⊃r)` | TAUT (all 8) | The third paradox — Mares' opening example. **Best truth-table showpiece in the sweep** | 3 / 8 | yes |
| **CLI-306** | `∼(p⊃q) ⊢ p` and `∼(p⊃q) ⊢ ∼q` | **VALID** (both) | Negated-conditional paradox | 2 / 4 | yes |
| CLI-307 | `p & q ⊢ p ⊃ q` | VALID | **And-to-If / Conjunctive Sufficiency**, *Strong Centering*. In Stalnaker's C2, absent from Lewis's V | 2 / 4 | yes |
| CLI-308 | `⊢ (p⊃(q⊃r)) ≡ ((p&q)⊃r)` | TAUT | **Import-Export**; Gibbard's collapse | 3 / 8, nested, `≡` | yes |
| CLI-309 | `(r & ∼g) ⊃ a, r ⊢ ∼g ⊃ a` | VALID (3 of 8 premise-true) | **McGee's counterexample to modus ponens** (1985) | 3 / 8 | yes (the *failure* needs probability) |

**CLI-306 is the recommendation.** From "It is *not* true that if God exists the prayers are answered" derive "God exists" — and separately "the prayers are not answered." Two atoms, a three-line ND derivation, and it is the most viscerally repugnant valid form in the whole sweep. It is also precisely the case SEP flags as beyond Grice's reach, because it is a fact about **belief**, not assertion: *"Thinking that John is in the pub, I may without irrationality disbelieve 'If he's not in the pub he's in the library'."* Conversational norms govern what we say. They do not govern what we believe. That asymmetry is a first-rate reflective question and the course does not currently use it.

**Grice's defence**, stated so it can be argued with: distinguish truth from assertability and explain the paradoxes as violations of the maxim of Quantity. SEP's own parallel case is disjunction, which suits us since PS2 already has `∨`: *"I am asked where John is. I am sure that he is in the pub, and know that he never goes near libraries. Inclined to be unhelpful… I say 'He is either in the pub or in the library'."* True, and grossly misleading, because a stronger claim was available.

**Frege's own view is the best quote for Lecture 3**, because he invented the notation and did not think it captured English: *"the causal connection implicit in the word 'if' … is not expressed by our symbols."* SEP's gloss — the value of `⊃` derives "not from its approximation of ordinary language expression but from its role internal to logical theory."

**The case against truth-functionality is a proof, not an intuition pump.** Ramsey reads the indicative via conditional probabilities; Edgington argues that certainty in the material conditional does not transmit to certainty in the conditional as ordinarily judged, and "the only way this could happen is for the conditional not to have truth-conditions at all"; **Lewis's triviality results** then show that conditionals so understood are not even propositions. Much stronger material than a list of odd-sounding sentences.

### 3.2 Deriving the `⊃` table — Lecture 3's argument, made airtight

Assume truth-functionality and bivalence, so the conditional is one of the sixteen binary truth functions. Add the agreed validity judgements one at a time (each stage verified by exhaustive search):

| Constraint added | Functions surviving | Count |
|---|---|---|
| — | all sixteen | 16 |
| **modus ponens** must be valid | f₅ (⊃), f₆ (B), f₇ (≡), f₈ (&), f₁₃ (∼A), f₁₄ (∼A&B), f₁₅ (↓), f₁₆ (⊥) | 8 |
| ⟨T,T⟩ = T | f₅, f₆, f₇, f₈ | 4 |
| ⟨F,T⟩ = T (or-to-if / vacuous truth) | f₅, f₆ | 2 |
| ⟨F,F⟩ = T | **f₅ only — the material conditional** | **1** |

A complete, checkable derivation with an exact count at each stage: the assumptions are visibly doing work, and dropping any one leaves the table underdetermined. Lovely footnote: f₁₅ (the Peirce arrow) validates modus ponens *vacuously*, because `A↓B` and `A` are jointly unsatisfiable — worth asking why that does not count.

### 3.3 Interdefinability, and what makes a constant logical

All verified equivalences: `(p&q) ≡ ∼(p⊃∼q)`; `(p∨q) ≡ (∼p⊃q)`; `(p⊃q) ≡ (∼p∨q)`; `(p≡q) ≡ ((p⊃q)&(q⊃p))`; `∼p ≡ (p⊃(q&∼q))`; and the full Sheffer and Peirce-arrow reconstructions including the awkward `(p⊃q) ≡ ∼(∼(∼(p∨p)∨q) ∨ ∼(∼(p∨p)∨q))`, which makes the point that completeness is not convenience.

**Strong vs weak functional completeness** is a refinement PS2 does not currently make and could absorb: `{&, ∼}` and `{⊃, ∼}` are only *weakly* complete, because pure composition from a binary and a unary function can never produce a **constant** (0-ary) truth function — you cannot build `⊥` without an argument to throw away. `{⊃, ⊥}` is **strongly** complete. That is a ready answer to "why do some textbooks take `⊥` as a connective?", and it ties directly to `∼p ≡ (p ⊃ ⊥)`.

**Incompleteness in two lines:** every `{&,∨}`-formula takes value T on the all-T valuation, so no `{&,∨}`-formula is equivalent to `∼A`, to `⊥`, or to the Sheffer stroke. A proof by invariant, and the first of Post's five maximal clones. (Post's theorem itself is in none of the fetched entries.)

**The demarcation question**, for a reflective prompt: **permutation invariance** (Tarski–Sher) says logical notions are those invariant under every permutation of the domain — identity passes, "mother of" fails, "JC believes that" fails — but it is over-inclusive, since any necessarily-empty predicate ("male widow") is vacuously invariant. **Inferential role** over-generates too (CLI-210's contaminated disjunction) and under-generates. The prompt: *our five connectives are interdefinable, so none is privileged by being primitive. What, then, makes `⊃` logical and "because" not?* Pairs with the L21 identity/invariance material.

### 3.4 Truth-functionality — the exact statement, and what English violates

The working statement is the usual one. The exact statement is sharper, and worth having because it relativises:

> An n-ary connective `#` is **truth-functional with respect to a class U of valuations** when there is some truth function f such that for each v ∈ U, `v(#(φ₁,…,φₙ)) = f(v(φ₁),…,v(φₙ))`.

Truth-functionality is not an intrinsic property of a symbol but a property relative to a class of valuations — and Humberstone shows that even `∨` fails to be truth-functional relative to certain classes.

The best probe in the entries is the **congruential / truth-functional** distinction: `□` **is** congruential (substituting logical equivalents inside it is safe) and **is not** truth-functional. So there is a connective that respects substitution of equivalents and still has no truth table. That kills the tempting student thought that "respects substitution ⇒ truth-functional," and it shows truth-functionality is an *extra* assumption in Lecture 3's derivation, not a consequence of compositionality.

⚠️ **Sourcing gap the course should know about:** "because", "although", "before/after", and tense as truth-functionality counterexamples appear in **none** of the fetched entries. SEP's own non-truth-functional examples are modality, the metalinguistic "A implies B", and indicative conditionals. If Lecture 3 wants "because" — and it should, it is the sharpest case — it must be written in-house. The in-house version uses SEP's definition directly: *fix "Grass is green" (T) and "Snow is white" (T). "Grass is green **and** snow is white" is true and stays true under any substitution of equally-valued sentences. But "Grass is green **because** snow is white" is false, while "Grass is green **because** chlorophyll absorbs red light" is true — same input truth values, different output. So "because" has no table.*

### 3.5 Negation as the odd connective out

Five threads, ascending in interest.

1. **It is the only one-place connective, and structurally forced.** There are exactly four unary truth functions: identity, negation, verum, falsum. Two are constant and one is the identity, so `∼` is the unique non-trivial unary truth function. There was never a choice. Compare `⊃`, which is one of sixteen at its arity — a good payoff for "why these five?"
2. **Its rules are the contested ones.** Every rule in the system is intuitionistically acceptable except DNE. The whole classical/constructive fault line runs through one connective, and through one of its two rules.
3. **Negation has no positive introduction rule.** `&I`, `∨I`, `⊃I` each say when you may *assert* a compound. `∼I` says only: if `θ` leads to both `ψ` and `∼ψ`, infer `∼θ`. Negation is introduced solely by refutation, and it is the only connective whose introduction rule mentions the connective itself in the premises — which is why harmony arguments are hard for `∼`.
4. **The sequent trade-off.** Treatments of negation must either "abandon simplicity" (taking double-negation-elimination as primitive) or "abandon purity" (taking excluded-middle as primitive). No formulation gets both.
5. **The square root of negation** — the best small reflective question in the sweep. Could there be a one-place connective `✻` with `✻✻φ` equivalent to `∼φ`? Exhaustive check of all four unary truth functions: identity∘identity = identity; ∼∘∼ = identity; ⊤∘⊤ = ⊤; ⊥∘⊥ = ⊥. **None yields `∼`, so classically negation has no truth-functional square root.** The reason is clean and student-accessible: `∼` is an odd permutation of a two-element set, and no self-composition is odd. A genuinely open-sounding question with a two-line answer the students find themselves, by building four tiny tables.

### 3.6 Disjunction — Ross's paradox and free choice

| ID | Form | Verdict | Name | Size |
|---|---|---|---|---|
| CLI-310 | `⊢ p ⊃ (p∨q)` | TAUT | **Addition** — Ross's paradox target | 2 / 4 |
| CLI-311 | `⊢ (p∨q) ⊃ p` | INVALID (p=F,q=T) | The conclusion really is weaker — what makes Ross's paradox a paradox | 2 / 4 |
| CLI-312 | `⊢ (p∨q) ⊃ (p&q)` | INVALID (2 of 4) | **Free-choice permission**, propositional surrogate | 2 / 4 |
| CLI-313 | `⊢ ((p∨q) & ∼(p&q)) ≡ ∼(p≡q)` | TAUT | Exclusive-or is definable — the logician's reply to the ambiguity thesis | 2 / 4, `≡`-heavy |
| CLI-314 | `⊢ (p & (q∨r)) ⊃ ((p&q) ∨ (p&r))` | TAUT | **Distribution** — classically valid, **no countermodel**. The corresponding *lattice* identity `a ∧ (b∨c) ≤ (a∧b) ∨ (a∧c)` fails in the orthomodular lattice `L(H)`, where join is **span**, not union; the converse direction holds in any lattice. Whether that bears on the validity of the *sentence*-form is the disputed question, not the datum. Also fails in linear logic and the Lambek calculus. See §4.11 | 3 / 8 |
| CLI-315 | `p ∨ (q&r) ⊢ (p∨q) & r` | INVALID (2 of 8) | Distribution botched — forces the 8-row table rather than pattern-matching | 3 / 8 |

**Ross's paradox.** From (17) "Post this letter!" one cannot infer (18) "Post this letter or burn it!" If addition held for imperatives, uttering (17) would license burning. SEP's diagnosis: disjunctive imperatives carry "choice offering potential" — (18) means *you may post it and you may burn it* — which (17) does not confer. Teaching value: CLI-310 is classically *and* intuitionistically valid, so this is a case where **the logic is impeccable and the interpretation of the connective is what gives.**

**Free choice.** von Wright: "You may have coffee or tea" seems to entail "you may have coffee and you may have tea," yet `P(α∨β) → Pα` is invalid in standard deontic logic. **Kamp's collapse** shows why you cannot simply add it: from `Pp`, addition gives `P(p∨q)`, free choice then gives `Pq` — permission explodes.

**Is "or" truth-functional?** Grice: yes, and exclusivity is a cancellable implicature ("Mary invited John or Bill *or both*") that vanishes under embedding. Against: Spector notes that iterated forms in Hungarian, French and Russian (*soit–soit*, *ili–ili*) force exclusivity obligatorily; Zimmermann reads "S₁ or … or Sₙ" as a *conjunction of epistemic possibilities*, not truth-functional at all; Anderson & Belnap reject truth-functional `∨` because it licenses DS and hence explosion; Ciardelli & Roelofsen give inquisitive semantics, where `∨` generates alternatives.

**Disjunction elimination is challenged too**, which is worth saying since `∨E` survives the intuitionistic cut intact. **Supervaluationism**: with a determinacy operator, `p ⊨ Dp` and `∼p ⊨ D∼p` and `⊨ p∨∼p`, yet `⊭ Dp ∨ D∼p` — the rule fails to preserve supervalidity. **Weak Kleene**: an undefined disjunct infects the whole.

### 3.7 The sixteen binary truth functions — PS2's naming gap, filled

SEP prints the table but labels the functions only f₁²…f₁₆², naming four informally. Outputs for ⟨T,T⟩, ⟨T,F⟩, ⟨F,T⟩, ⟨F,F⟩:

| Label | Pattern | Name | In our five |
|---|---|---|---|
| f₁ | TTTT | Verum | `p ∨ ∼p` |
| f₂ | TTTF | **Disjunction** | `p ∨ q` |
| f₃ | TTFT | **Converse implication** | `q ⊃ p` |
| f₄ | TTFF | Left projection | `p` |
| f₅ | TFTT | **Material conditional** | `p ⊃ q` |
| f₆ | TFTF | Right projection | `q` |
| f₇ | TFFT | **Biconditional** / XNOR | `p ≡ q` |
| f₈ | TFFF | **Conjunction** | `p & q` |
| f₉ | FTTT | **Sheffer stroke** / NAND | `∼(p & q)` |
| f₁₀ | FTTF | **Exclusive disjunction** / XOR | `∼(p ≡ q)` |
| f₁₁ | FTFT | Negation of the second | `∼q` |
| f₁₂ | FTFF | **Material nonimplication** | `p & ∼q` |
| f₁₃ | FFTT | Negation of the first | `∼p` |
| f₁₄ | FFTF | **Converse nonimplication** | `∼p & q` |
| f₁₅ | FFFT | **Peirce arrow** / NOR | `∼(p ∨ q)` |
| f₁₆ | FFFF | Falsum | `p & ∼p` |

Three observations for PS2: exactly **two** are sole sufficient connectives (f₉, f₁₅ — and Sheffer's 1913 result "rediscovered an unpublished observation of Charles Sanders Peirce"); **six are not genuinely binary** (f₁, f₄, f₆, f₁₁, f₁₃, f₁₆ ignore an argument), which is exactly the weak-vs-strong completeness issue; and the commutative ones are f₂, f₇, f₈, f₁₀ plus the two degenerate — **which is why `⊃` is the odd one among our five.**

### 3.8 Truth values — excluded middle versus bivalence, and Suszko's thesis

*SEP: truth values (Shramko & Wansing).*

#### The distinction, stated as a level distinction

The entry's official position is that it is a difference of *level*, not of content: bivalence is "the principle of bivalence taken as a **metatheoretical** principle, viz. that there exist only two distinct logical values," and "**on the object-language level this principle finds its expression** in the famous classical laws of excluded middle and non-contradiction."

- **Excluded middle** `p ∨ ∼p` is a **formula**, evaluated by the valuation function. It is a theorem.
- **Bivalence** is a claim **about** the valuation function — `|𝒱| = 2`. It is not a formula of the object language at all, and **cannot appear in a truth table because it is a statement about truth tables.**

#### The forms that separate them — a six-row exercise

Writing `Tp`, `Fp` as deliberately opaque atoms proxying the metalinguistic claims:

| Form | Verdict | Countermodel |
|---|---|---|
| `⊢ p ∨ ∼p` | **VALID** | — |
| `⊢ ∼(p & ∼p)` | **VALID** | — |
| `⊢ Tp ∨ Fp` — bivalence as a schema | **INVALID** | 1: `Tp=F, Fp=F` — **the gap** |
| `⊢ ∼(Tp & Fp)` — no gluts | **INVALID** | 1: `Tp=T, Fp=T` — **the glut** |
| `p ∨ ∼p ⊢ Tp ∨ Fp` | **INVALID** | 2 — LEM alone does not give bivalence |
| `Tp ≡ p, Fp ≡ ∼p ⊢ Tp ∨ Fp` | **VALID** | — Convention T does |
| `(Tp ∨ Fp) ≡ ∼(∼Tp & ∼Fp)` | **VALID** | bivalence = no gap |
| `∼(∼Tp&∼Fp), ∼(Tp&Fp) ⊢ Tp ≡ ∼Fp` | **VALID** | "Gaps + Gluts = Bivalence" |

**The first four are the exercise.** LEM and LNC are theorems; their metalinguistic shadows are not — and the single countermodel to each is *exactly* the gap and *exactly* the glut. Put the four tables side by side and the gap and glut rows are visible as the rows classical semantics rules out **by fiat rather than by proof**. Six rows total.

And the Williamson argument against supervaluationism falls out: verified, **LEM + a gap is satisfiable**, while **the T-schema + a gap is UNSAT** and **the T-schema + a glut is UNSAT**. So it is Convention T, not excluded middle, that kills the gaps. Setting `p∨∼p ⊢ Tp∨Fp` (invalid) beside `Tp≡p, Fp≡∼p ⊢ Tp∨Fp` (valid) isolates the culprit in eight rows.

#### Designated values, and why gap/glut is not a difference in the tables

A valuation system is `⟨𝒱, 𝒟, ℱ⟩` — values, **designated** values, and the interpreting functions — with `A` a tautology iff `v(A) ∈ 𝒟` for every assignment, and entailment defined as preservation of designation. Classical logic is just `⟨{T,F}, {T}, …⟩`.

The payoff, and it is §4.2's point stated by the entry itself: **K3 and LP share exactly the same truth tables and differ only in `𝒟`.** The reading of the middle value *follows* the designation choice — in K3 it is "neither true nor false," in LP "both" — and, verbatim, "**the designatedness of a truth value can be understood in both cases as containment of the classical T as a member.**" So **gap versus glut is not a difference in the truth tables. It is a difference in which cells you underline.**

The entry also flags a live refinement: **antidesignated** values need not be the complement of `𝒟`, which "leaves room for values that are *neither* designated nor antidesignated and even for values that are *both*." That matters below.

#### Suszko's thesis — the item that bears hardest on a truth-table course

Suszko called many-valued logic "a magnificent conceptual deceit" and claimed **"there are but two logical values, true and false."** The distinction it rests on, verbatim: the values in a many-valued matrix are "**admissible referents** (called **algebraic values**) of formulas but **not logical values**… **The logical values are thus represented by a bi-partition of the set of algebraic values into a set of designated values (truth) and its complement (falsity).**"

**The theorem: every structural Tarskian consequence relation — hence every structural many-valued propositional logic — is characterized by a bivalent semantics.** The reduction is explicit: given an *n*-valued model, define `t_v(A) = 1` if `v(A) ∈ 𝒟` and `0` otherwise; the resulting class of two-valued models characterises the same logic.

**And the reduction was executed here.** Over 222 formulas in `∼ & ∨` on two atoms, all nine three-valued assignments, **49,506 sequents per logic**:

| Logic | Disagreements, many-valued vs Suszko-bivalent | Induced two-valuation truth-functional? |
|---|---|---|
| **K3** (gaps) | **0 of 49,506** | **NO** |
| **LP** (gluts) | **0 of 49,506** | **NO** |

**The reduction works exactly as advertised — and the resulting bivalence is not truth-functional**, with explicit witnesses. In K3, `v(p)=½` and `v′(p)=F` give `t_v(p) = t_v′(p) = 0`, yet `t_v(∼p)=0` and `t_v′(∼p)=1`: same input value, different output. In LP, `v(p)=T` and `v′(p)=½` give `t=1` both ways, yet `∼p` comes out 0 and 1.

**So here is the exact statement for a course built on truth tables, and it is not the popular one:**

> Suszko's thesis is **right**, and it does **not** vindicate truth tables. Every structural many-valued logic has a **two-valued semantics**. It does not follow that it has a **two-valued truth table**. The reduction delivers a bivalent *valuation*, but those valuations are in general **not truth-functional** — the value of `∼A` is not a function of the value of `A`. What survives is the bi-partition underwriting consequence; what is lost is exactly the compositional table.

The honest classroom line: the "many" in many-valued *is* misleading about **logical** values — there are two — but the extra **algebraic** values are not eliminable if you want to *compute*. They are precisely the bookkeeping that makes the two-valuation truth-functional again. **Classical logic is the special case where the bi-partition happens to be truth-functional, and that — not bivalence as such — is what licenses the truth-table method.**

The counterexample that keeps it a thesis rather than a theorem is Malinowski's: loosen the bi-partition so that some values are neither designated nor antidesignated, and there is provably no characterizing class of two-valuations. That amounts to admitting "**in addition to the logical values *true* and *false* the third logical value *neither true nor false***" — genuinely three *logical* values. Out of scope for the course, but it is why the thesis is contested.

---

## 4. NON-CLASSICAL, MODAL, AND SPECIALIZED PROPOSITIONAL LOGICS

*SEP: logic: intuitionistic · logic: many-valued · logic: paraconsistent · dialetheism · logic: fuzzy · logic: relevance · logic: substructural · logic: linear · connexive logic (§6) · logic: conditionals · conditionals: counterfactual · logic: non-monotonic.*

### 4.1 Intuitionistic logic — the classical theorems that fail

| ID | Form | Classical | Fails in | Why, on BHK | Size |
|---|---|---|---|---|---|
| CLI-401 | `⊢ ∼∼p ⊃ p` | TAUT | **IPC** | `∼∼p` converts refutations of p into absurdity. That is not a construction of p. | 1 / 2 |
| CLI-402 | `⊢ p ∨ ∼p` | TAUT | IPC | A proof of `A∨B` must be a proof of one disjunct *plus a marker saying which*. LEM would be a uniform decision method for every p. | 1 / 2 |
| **CLI-403** | `⊢ ((p⊃q)⊃p)⊃p` | TAUT | IPC (adding it gives CPC) | **Peirce's Law contains no `∼` and no `∨` at all**, and is still not intuitionistically provable. Kills the assumption that the split is "about negation." | 2 / 4 |
| CLI-404 | `⊢ (p⊃q) ∨ (q⊃p)` | TAUT | IPC (adding it gives LC) | You would have to decide, for arbitrary p and q, which is "further along." | 2 / 4 |
| CLI-405 | `⊢ ∼(p&q) ⊃ (∼p ∨ ∼q)` | TAUT | IPC | Knowing they can't both hold does not say which fails. **The only one of the four De Morgan directions that fails.** | 2 / 4 |
| CLI-406 | `⊢ (p⊃q) ⊃ (∼p ∨ q)` | TAUT | IPC | A proof of `p⊃q` transforms proofs; it gives no way to choose in advance. | 2 / 4 |
| CLI-407 | `⊢ ∼p ∨ ∼∼p` | TAUT | IPC (adding it gives Jankov's KC) | Weak excluded middle: decide whether p is *refutable*. Strictly weaker than deciding p, still undecidable. | 1 / 2 |
| CLI-408 | `⊢ (∼p⊃p) ⊃ p` | TAUT | IPC (adding it gives CPC) | Consequentia mirabilis. Substitute `p ∨ ∼p`: the antecedent is IPC-refutable, so Clavius would hand you LEM. A first-rate ND derivation. | 1 / 2 |
| **CLI-409** | `⊢ ∼(∼p & ∼q) ⊃ (p∨q)` | TAUT | IPC | **The cleanest statement of why `∨` must be primitive constructively.** SEP verbatim: `A∨B` "asserts that either a proof of A, or a proof of B, has been constructed," whereas `¬(¬A∧¬B)` only asserts an algorithm turning a pair of refutations into a contradiction. | 2 / 4 |
| CLI-410 | `⊢ ∼(p⊃q) ⊃ (p & ∼q)` | TAUT | IPC | Classically `∼(p⊃q)` is maximally informative; constructively it is almost empty. | 2 / 4 |
| CLI-411 | `⊢ (∼q⊃∼p) ⊃ (p⊃q)` | TAUT | IPC (equivalent to DNE over IPC) | Contraposition is a one-way street constructively. | 2 / 4 |
| **CLI-412** | `⊢ (∼p⊃(q∨r)) ⊃ ((∼p⊃q) ∨ (∼p⊃r))` | TAUT (8 rows) | IPC as an *implication* — but Harrop showed the corresponding **rule is admissible** | The sharpest lesson available: a rule can be admissible without the conditional being derivable. The deduction theorem breaks the identification students take for granted. | 3 / 8, heavily nested |
| CLI-413 | `⊢ (p⊃(q∨r)) ⊃ ((p⊃q) ∨ (p⊃r))` | TAUT (8 rows) | IPC, and unlike CLI-412 the **rule is not admissible either** | Memorable one-line refutation: set p := `q∨r`. Antecedent becomes provable; consequent becomes `((q∨r)⊃q) ∨ ((q∨r)⊃r)`, plainly not. | 3 / 8 |

**The contrast set** matters as much as the failures, because students over-generalise. All verified classical **and** intuitionistically valid: `p ⊃ ∼∼p`; `∼∼∼p ≡ ∼p` (Brouwer — negations do not stack, the hierarchy collapses at three); `∼∼(p ∨ ∼p)`; the *other three* De Morgan directions; `(p⊃q) ⊃ (∼q⊃∼p)`; `(∼p∨q) ⊃ (p⊃q)`; `(p∨q) ⊃ ∼(∼p & ∼q)`; `(p & ∼q) ⊃ ∼(p⊃q)`; `(p∨∼p) ⊃ (∼∼p⊃p)`; and `∼(∼∼∼p & ∼∼∼∼p)`, which is the Gödel–Gentzen translation of LEM computed out.

**Pair-and-contrast sets** — the highest-yield exercise structure here, each one classically-valid form that survives beside one that doesn't: CLI-401/`p⊃∼∼p`, CLI-405/`(∼p∨∼q)⊃∼(p&q)`, CLI-406/`(∼p∨q)⊃(p⊃q)`, CLI-410/`(p&∼q)⊃∼(p⊃q)`, CLI-411/`(p⊃q)⊃(∼q⊃∼p)`, CLI-409/`(p∨q)⊃∼(∼p&∼q)`.

**Glivenko's theorem**, quotable and entirely at the propositional level the course occupies: *"An arbitrary propositional formula A is classically provable if and only if `¬¬A` is intuitionistically provable."* So intuitionistic logic does not *deny* the classical theorems; it declines to assert them while asserting their irrefutability. Two corollaries worth stating: because `∼∼∼p ≡ ∼p` is intuitionistically valid, **the two logics agree completely on refutations**; and **Glivenko does not extend to predicate logic** without the double negation shift `∀x¬¬B(x) → ¬¬∀x B(x)`. Good place to end a lecture: the propositional story is tidy and the quantificational story is not.

**The disjunction property is the deepest difference**, and it is not one more schema. *If `A ∨ B` is a theorem, then A is a theorem or B is a theorem.* Classical logic conspicuously lacks it (`⊢ p ∨ ∼p` while `⊬ p` and `⊬ ∼p`). Three reasons it matters more than any single failure:

- It is a property of the **turnstile**, not of any formula — you cannot state it in the object language, so no amount of adding or deleting schemas touches it directly.
- It is why **truth tables cannot do this job at all**: any finite-valued matrix determines `p∨q` from the values of p and q, which is exactly what the DP refuses. IPC has no finite truth-table interpretation (Gödel 1932), though it is still decidable. Since the course teaches `⊨` by tables, this is the honest statement of the limit — *the tool the course is built on cannot express the target.*
- It is what "constructive" cashes out to, and every failure above is downstream of it.

**Diagnostic for lecture** (a complete, elementary, non-Kripke proof of an intuitionistic non-theorem): give students `∼p ∨ ∼∼p`. If IPC proved it, by the DP it would prove `∼p` or prove `∼∼p` — for *arbitrary* p, absurd on either branch. The same argument covers CLI-402, CLI-404 and CLI-413.

### 4.2 Many-valued logic — the K3/LP spine

All five systems use values {0, ½, 1}. **Designation is the whole game.** K3 and LP have *literally identical truth tables* and differ only in whether ½ is designated.

| System | ½ reads as | Designated | `∼½` | `½ ⊃ ½` |
|---|---|---|---|---|
| **Ł3** Łukasiewicz | undetermined | {1} | ½ | **1** |
| **K3** strong Kleene | gap ("neither") | {1} | ½ | **½** |
| **LP** Priest | glut ("both") | **{½, 1}** | ½ | ½ |
| **G3** Gödel | intermediate | {1} | **0** | 1 |

`&` and `∨` are min/max in all four; every difference lives in `∼`, in `⊃`, and in designation. The single cell `½ ⊃ ½` is where Ł3 parts from K3.

Two structural facts, both verified exhaustively: **K3 has no tautologies whatsoever** (every connective sends all-½ inputs to ½), and **LP's tautologies are exactly classical logic's** — LP loses *inferences*, not theorems. Opposite profiles from one designation choice.

**The rule-vs-theorem grid is the best single exercise in this section.** Verified:

| | rule `p&∼p ⊢ q` | theorem `⊢ (p&∼p)⊃q` | rule `p∨q, ∼p ⊢ q` | theorem `⊢ ((p∨q)&∼p)⊃q` |
|---|---|---|---|---|
| **K3** | VALID | **fails** at p=½,q=0 | VALID | **fails** at p=0,q=½ |
| **LP** | **fails** at p=½,q=0 | VALID | **fails** at p=½,q=0 | VALID |

LP asserts the conditional and refuses to detach it; K3 refuses the conditional and happily uses the rule. Whatever "`⊃` internalises `⊨`" means, it is not a law of logic. Set it as: *fill in these four cells and explain, in one sentence each, why the rule and the conditional come apart in opposite directions.* A student who can do that has understood `⊨`, `⊃` and designation at once.

**Other verified separations** (all with countermodels computed here, not recalled):

| Form | Ł3 | K3 | LP | G3 |
|---|---|---|---|---|
| `⊢ p ∨ ∼p` | fails ½ | fails ½ | **VALID** | fails ½ |
| `⊢ ∼(p & ∼p)` (LNC) | **fails ½** | fails ½ | **VALID** | VALID |
| `⊢ p ⊃ p` | VALID | **fails ½** | VALID | VALID |
| `⊢ ((p⊃q)⊃p)⊃p` (Peirce) | fails | fails | VALID | **fails** ½,0 |
| `⊢ ((p⊃q)⊃q)⊃((q⊃p)⊃p)` (Ł's axiom) | **VALID** | fails | VALID | **fails** ½,0 |
| `⊢ ∼(p ≡ ∼p)` | **fails, value 0** | fails ½ | VALID | VALID |
| `⊢ (p⊃(p⊃q))⊃(p⊃q)` (contraction) | **fails** | fails | VALID | VALID |
| `p⊃(p⊃q) ⊢ p⊃q` (contraction, rule) | **fails** | **VALID** | VALID | VALID |
| `∼∼p ⊢ p` | VALID | VALID | VALID | **fails ½** |
| `p ⊢ ∼∼p` | VALID | VALID | VALID | VALID |
| `p⊃q, ∼q ⊢ ∼p` (MT) | VALID | VALID | **fails** p=1,q=½ | VALID |
| `p⊃q, q⊃r ⊢ p⊃r` (HS) | VALID | VALID | **fails** 1,½,0 | VALID |
| `p, p⊃q ⊢ q` (MP) | VALID | VALID | **fails** ½,0 | VALID |

**Six headline teaching points, in order of return:**

1. **LNC fails in Ł3 where explosion holds; LNC holds in LP where explosion fails.** Rejecting non-contradiction and being paraconsistent are *orthogonal*. Students almost always conflate them.
2. `⊢ p ⊃ p` fails in K3 and holds in Ł3, and the entire difference is one cell. Best possible first three-valued exercise.
3. Peirce fails in G3 but holds in Ł3; Łukasiewicz's axiom does the reverse. **Ł3 and G3 are incomparable** — neither is a sublogic of the other.
4. `⊢ ∼(p ≡ ∼p)` takes value **0** in Ł3 at v(p)=½: Ł3 does not merely fail to prove "p is not equivalent to not-p," it makes "p iff not-p" *perfectly true* at the middle value.
5. LP's damage is wider than the DS headline: **MP, MT, HS and constructive dilemma all fail.**
6. Ł3 drops Frege's self-distribution axiom, which every intuitionistic system keeps — and lacks the deduction theorem in unmodified form (contraction fails as a theorem but holds as a rule).

⚠️ **Two honesty flags before assigning any of this.** (a) **G3 is not intuitionistic logic** — it validates Dummett linearity and the hard De Morgan law, both intuitionistically invalid, because its three values are *linearly* ordered. Use it to illustrate the intuitionistic failures of DNE and Peirce; never to *test* intuitionistic validity. (b) **Ł3 is not paraconsistent** — explosion holds there even though LNC fails, because min(x, 1−x) is never designated under D={1}. Any exercise running Ł3 and LP side by side must state the designation difference up front, or students will attribute LP's paraconsistency to the third value rather than to designation.

⚠️ **Complexity:** three-valued tables have 3ⁿ rows, not 2ⁿ. Three-atom forms are 27 lines. Restrict problem sets to one- and two-atom rows, or state a shortcut ("find a valuation making the premises designated and the conclusion not; you need not tabulate exhaustively").

### 4.3 The sorites, four ways

| ID | Form | Classical | Non-classical |
|---|---|---|---|
| CLI-421 | `r₁, r₁⊃r₂, …, rₙ₋₁⊃rₙ ⊢ rₙ` | **VALID** (verified n=3..6) | VALID in Ł3, K3, G3 (MP preserves designation); **INVALID in LP** at v(r₁)=½, rest 0 |
| CLI-422 | `rᵢ, rᵢ⊃rᵢ₊₁ ⊢ rᵢ₊₁` | VALID | **INVALID in LP** — the chain never gets started |
| CLI-423 | `r₁, ∼rₙ ⊢ (r₁&∼r₂) ∨ … ∨ (rₙ₋₁&∼rₙ)` | **VALID** (verified n=3,4,5) | fails Ł3/K3/G3; **VALID in LP** |

Present it in three passes. **Classical:** verify the n=4 chain (16 rows) — valid, conclusion plainly false, so soundness demands rejecting a premise and none looks rejectable. **Glutty:** the very first MP link fails, so the chain never starts; the cost is modus ponens. **Fuzzy:** the chain stays **valid** and becomes **unsound** — every tolerance conditional gets degree exactly 1−ε, and the strong-conjunction degree of the premise set hits 0 exactly as v(rₙ) hits 0. *The frequent student error is to think fuzzy logic makes the sorites invalid. It does not, under D={1}.* Then CLI-423 adds the **supervaluationist**: the cutoff disjunction is super-true with no super-true disjunct, so LEM survives and bivalence does not.

Four positions, one argument form, one table. Practical ceiling for hand computation is n=4.

### 4.4 Relevance and substructural

| ID | Form | Verdict | Name / status |
|---|---|---|---|
| CLI-431 | `p ∨ q, ∼p ⊢ q` | VALID | **Disjunctive syllogism** — the step Anderson & Belnap reject; Tennant's Core Logic keeps it |
| CLI-432 | `⊢ (p⊃(p⊃q)) ⊃ (p⊃q)` | TAUT | **Contraction (W)** — abandoned by Grishin, Brady, Restall, Priest because it drives Curry |
| CLI-433 | `⊢ ((p∨q)⊃r) ≡ ((p⊃r) & (q⊃r))` | TAUT | `∨E` axiom of R and E — one of the most substantial pure-classical `≡` trees available |
| CLI-434 | `⊢ (p⊃q) ⊃ ((q⊃r)⊃(p⊃r))` | TAUT | **Suffixing** — axiom 2 of R, E, NR; axiom A1 of McCall's CC1 |
| CLI-435 | `⊢ (q⊃r) ⊃ ((p⊃q)⊃(p⊃r))` | TAUT | **Prefixing** — axiom 1 of Meyer–Martin **S** |
| CLI-436 | `⊢ ((p⊃q)&(q⊃r)) ⊃ (p⊃r)` | TAUT | **Transitivity** — *fails* in Priest's N₄ |
| CLI-437 | `⊢ p ⊃ ((p⊃q)⊃q)` | TAUT | **Assertion** — axiom 3 of R; corresponds to commutativity of premise combination; **absent from E** |
| **CLI-438** | `⊢ ((p&q)⊃r) ⊃ ((p&∼r)⊃∼q)` | TAUT | **E. Nelson's NL axiom 1.7** (1930) — antilogism. Three letters, nested, hard-but-doable ND, and a real 1930 pedigree. A sound and complete semantics for NL is **still an open problem** |
| CLI-439 | `⊢ p ⊃ p` | TAUT | **Identity** — *not* a theorem of Meyer & Martin's **S**. Martin's theorem: S has no theorem of the form `A → A`, so no argument "A, therefore A" is valid. The most extreme rejection in the literature |
| CLI-440 | `⊢ (p&q) ⊃ p` | TAUT | **Conjunctive simplification** — *rejected* by Routley for connexive logic, blamed for the paradoxes of implication. The most innocent-looking valid form there is |
| CLI-441 | `⊢ p ⊃ (p∨q)` | TAUT | `∨I` — **restricted in Parry's Analytic Implication**, valid only when every variable of q occurs in p. The "containment" requirement |

Three items are **lossy** under material rendering and should not be set as exercises: `p ⊢ p & p` / Mingle (linear logic's `⊗` vs `&` collapse), `⊢ p ∨ ∼p` (linear logic splits it — additive `p ⊕ ∼p` is *not* provable, multiplicative `p ⅋ ∼p` is trivially so), and `p & q ⊢ p` in its linear reading. Say the loss out loud if any of them is mentioned: our five connectives cannot express the additive/multiplicative distinction, and that distinction *is* linear logic's point.

The **Linear Logic** entry yielded the fewest usable rows in the entire sweep — it is overwhelmingly proof-theoretic and CS-oriented, and everything of teaching interest there is lossy.

### 4.5 Modal and temporal — what survives, and what is simply gone

**The honest ledger first.** Under naive atomisation the following carry *zero* content and should never be looked at again: axioms **4** `□A⊃□□A`, **5**, **B**, **M**, **D**, **CD**, **C4**, **C** — every one becomes `a ⊃ b`, a two-atom non-tautology. **The entire S4/S5/B/K debate is invisible propositionally.** So is **Löb's axiom** — and the two-world rescue degenerates there too, to `p2 ⊃ p2`. **Correction, from the later provability sweep: that degeneration is not because GL needs irreflexive transitive frames** (a two-point chain *is* a GL frame — transitive, irreflexive, converse well-founded). It degenerates because the second world is the *endpoint*, where `□` is vacuously true, so premise and conclusion collapse into the same formula. **Lengthen the chain to four worlds and Löb becomes a genuine three-atom theorem** — see §4.8, where it turns out to be one of the best ND exercises in the file. The temporal frame conditions (LIN-F, DISCR-F, COMPL, FIN-INT, IND_G, WELLORD) and the LTL fixed-point axioms are formally large enough to look like exercises and are **structurally empty** — the atoms bear no relation to each other, so the tree opens or closes for no reason a student could care about. Do not use them.

**What the two-world expansion buys back** is set out in §1b. The verified table:

| Modal original | Verdict under expansion |
|---|---|
| axiom **K**, `□(p⊃q) ⊃ (□p⊃□q)` | TAUTOLOGY |
| `□(A&B) ≡ (□A & □B)` | TAUTOLOGY |
| `□A ∨ □B ⊃ □(A∨B)` | TAUTOLOGY |
| `□(A∨B) ⊃ □A ∨ □B` | **NOT** — 2 symmetric CMs (CLI-124) |
| `◊(A&B) ⊃ ◊A & ◊B` | TAUTOLOGY |
| `◊A & ◊B ⊃ ◊(A&B)` | **NOT** — 2 symmetric CMs (CLI-125) |
| `□(p⊃q) ⊃ (p ⊃ □q)` | **NOT** — 1 CM (CLI-121, the scope fallacy) |
| `(p⊃□q) ⊃ □(p⊃q)` | **NOT** — 2 CMs; *neither* reading entails the other, so the ambiguity is total |
| `□(p ∨ ∼p)` | TAUTOLOGY |
| `□p ∨ □∼p` | **NOT** — 2 CMs |
| `□(A ⊃ ◊A)` on a reflexive non-symmetric 2-frame | TAUTOLOGY |
| axiom **B**, `A ⊃ □◊A`, same frame | **NOT** — 1 CM |

**The sea battle in four rows.** `⊢ (p1∨∼p1) & (p2∨∼p2)` is a tautology; `⊢ (p1&p2) ∨ (∼p1&∼p2)` is not, with countermodels p1=T,p2=F and its mirror. *It is necessary that either there will be a sea battle or there won't; it is not necessary that there will be, nor necessary that there won't.* That is *De Interpretatione* 9, two atoms, four rows.

**The `□`/`B` confusion, made checkable.** SEP notes "there is a tendency to confuse (B) with `□(A⊃◊A)`… one seems obvious, and one of the things it entails seems not obvious at all." Under the expansion `□(A⊃◊A)` is a tautology and `A ⊃ □◊A` is not, on the *same* frame. That is the confusion, settled by a four-row table.

**And `∀` really is a box.** SEP licenses this explicitly: "`□` and `◊` behave very much like the quantifiers `∀` and `∃`… the definition of `◊` from `□` mirrors the equivalence of `∀xA` with `∼∃x∼A`." So **every modal scope fallacy has an exact predicate-logic twin with nothing lost at all**:

| Predicate form | Verdict | Modal counterpart |
|---|---|---|
| `∀x(Fx⊃Gx) ⊢ ∀xFx ⊃ ∀xGx` | VALID | axiom K |
| **`∀x(Fx⊃Gx), Fa ⊢ ∀xGx`** | **INVALID** | **the scope fallacy** |
| `∀x(Fx⊃Gx), Fa ⊢ Ga` | VALID | its correct twin |
| `∀x(Fx∨Gx) ⊢ ∀xFx ∨ ∀xGx` | INVALID | `□(A∨B) ⊃ □A∨□B` |
| `∃xFx & ∃xGx ⊢ ∃x(Fx&Gx)` | INVALID | `◊A & ◊B ⊃ ◊(A&B)` |
| `∀x∃yRxy ⊢ ∃y∀xRxy` | INVALID | the swap that fails |

That triple — K, the fallacy, the repair — reproduces the necessity-of-the-consequence conflation with **no modal apparatus and no skeleton**, and it is second-half material the course can simply take.

**Historical forms worth having** (all verified):

| Form | Verdict | Story |
|---|---|---|
| `⊢ ∼p ⊃ (p⊃q)` and `⊢ p ⊃ (q⊃p)` | TAUT | Lewis's "startling theorems" (*Mind* 1912) — **the exact formulas that made him invent modal logic.** He conceded they were "neither mysterious nor a gross absurdity," just wrong for *implies*. |
| `⊢ (p⊃q) ≡ (∼p∨q)` | TAUT both ways | **MacColl (1880) denied the right-to-left direction** — the first recorded attack on material implication, twenty years before Lewis. Classically the asymmetry evaporates; it needs an intensional `⊃`. |
| `⊢ (p⊃q) ∨ (p⊃∼q)` | TAUT | For *any* two propositions, the first implies the second or implies its negation. Lewis & Langford 1932: 179. A four-row check that lands hard. |
| `⊢ (p⊃q) ⊃ ((q⊃r)⊃(p⊃r))` | TAUT | **Lewis rejected the strict version outright** — said it "ought not to be regarded as a valid principle of deduction" and abandoned S3 for S2 to avoid it. A schema students accept without blinking, refused by the man who built the field. |
| `⊢ (p⊃q) ≡ (∼q⊃∼p)` | TAUT | The strict version was an axiom of Lewis's 1918 system, and **Post showed it collapses necessity into truth**. Contraposition-as-equivalence: free for `⊃`, fatal for `⇒`. |
| `⊢ (p⊃q) ∨ (q⊃p)` | TAUT | Gödel observed S4 proves `□p ∨ □q` only when it proves a disjunct — like intuitionistic `∨`. Classical logic emphatically does not, and here is the theorem neither of whose disjuncts is one. |
| `s∨∼s, s⊃n, ∼s⊃m ⊢ n∨m` | **VALID** | **The fatalist's argument is valid** — it is constructive dilemma. So the error is in a premise, not the inference, and that reframing is the whole content of *De Int.* 9. A rare case where "VALID" is the interesting verdict. |
| `c⊃t, t⊃n, n⊃(p∨h), c, ∼p, ∼h ⊢ ⊥` | **VALID** (unsatisfiable) | **Diodorus's Master Argument** — Prior's whole research programme. The three Diodorean theses plus the denial of the definition are jointly inconsistent, which is *why* Diodorus defined the possible as "what is or will be." A falsum-derivation with real history. ⚠️ The second premise is a *rule*, not a formula; `n⊃(p∨h)` is a reconstruction, not a translation. |

### 4.6 Probability, games, and dialogue — validity as the problem, and validity as a strategy

**The mirror image of the void: valid forms whose validity is the trouble.** These are worth having precisely because everything else in this file trains the opposite reflex.

| Form | Verdict | The trouble |
|---|---|---|
| `p₁, p₁⊃p₂, p₂⊃p₃, p₃⊃p₄ ⊢ p₄` | VALID | Each premise at 0.9 → the true minimum for `p₄` is **exactly 3/5**. Four premises you would each bet 9-to-1 on, and a conclusion you should give even money against. Two-minute ND proof; the epistemology is the lesson. |
| `p, q, r, s ⊢ p & q & r & s` | VALID | Same, by conjunction rather than chaining. |
| `{p, q, r, s, ∼(p&q&r&s)}` | **UNSAT** (0 of 16) | **The preface, as a tree where all sixteen branches close** — and the closure is the point: classical logic says the modest author is committed to everything. |
| `{∼w₁, ∼w₂, ∼w₃, w₁∨w₂∨w₃}` | **UNSAT** | The lottery. At n=100 each premise is 0.99 and the conclusion has probability **0**. |
| `p ∨ q, p ⊃ q ⊢ q` | VALID | The rare case where the conclusion's probability is *determined*, not merely bounded: P(q) = P(p∨q) + P(p⊃q) − 1. |
| `⊢ ((a≡b) & (c≡d)) ⊃ ((a&c) ≡ (b&d))` | TAUT | **Compositional replacement holds for truth and fails for probability.** Two distributions can both give P(a)=P(b)=½ while one gives P(a&b)=½ and the other P(a&b)=0. The sharpest possible statement of *why there is no truth table for probability*, and exactly the right thing to say the day after teaching truth tables. |

⚠️ **A caution worth internalising before mining further here.** Classical propositional logic is **sound and complete** with respect to Adams' probabilistic semantics — for the *material* `⊃` there is no divergence at all. The famous p-invalidities belong to Adams' *probability conditional*, which is non-truth-functional and outside these entries. Contraposition, strengthening the antecedent, hypothetical syllogism, both paradoxes and conditional excluded middle are all classically valid with zero countermodels; if the divergent forms are wanted, they are in §3.1, not here.

**Games: total is not determined.** SEP warns explicitly against the confusion, and it is checkable. Writing a = "∃ has a winning strategy" and b = "∀ has one": `∼(a&b)` is provable for *every* logical game, but `a∨b` needs Gale–Stewart and **fails for imperfect information**. So `∼(a&b) ⊢ a ≡ ∼b` is INVALID, countermodel a=F, b=F — which is SEP's own undetermined matching game. And Hintikka's negation-as-dual clause plus mere totality does **not** deliver the classical negation clause: `c ≡ b, ∼(a&b) ⊢ c ≡ ∼a` is invalid, while adding determinacy `a∨b` makes it valid. **That pair is the cleanest classical/non-classical separation the games entry offers.**

**Dialogical logic: what makes classical logic classical, in one slide.** SEP works `⊢ p ∨ ∼p` twice, with the *same* particle rules and the *same* moves 0–5. Only move 6 differs. Under **SR1i** (intuitionistic), "Last Duty First" says P may defend only against O's last unanswered challenge, so by move 5 P cannot go back and re-answer move 3 with the atom O has now conceded. Under **SR1c** that constraint is deleted, P's repetition rank of 2 lets him answer move 3 a second time, and he plays `p` — which the Formal Rule permits only because O stated it at move 5. **Excluded middle is winnable because of a bookkeeping rule about which debt you must pay first.** If one slide is wanted on what makes classical logic classical, that is it.

And the play/strategy distinction comes in two formulas with two atoms between them: `⊢ (p&q) ∨ (p⊃p)` is a **tautology P can lose** (choose the left disjunct at move 4 and the Formal Rule kills him), while `p & (p⊃p)` is a **non-tautology P can win**, purely because O chose the right conjunct. Scaled to three atoms for a tree: `⊢ (p&q&r) ∨ ((p⊃q)⊃(p⊃q))` is valid with a losing choice available, and `(p⊃p) & (q⊃(r⊃q)) & (p∨q)` is invalid with two open branches — two free tautologies carrying the student past the one substantive conjunct.

⚠️ **Verified absent** from these three entries, despite being the obvious things to look for: the base-rate fallacy, the conjunction fallacy and Linda, Tversky and Kahneman (zero hits in all three); the preface paradox and Makinson (zero hits); Peirce's Law in the dialogical entry (zero hits — a summarising fetch claimed it was worked there and it is not; the entry's only classical/intuitionistic contrast is `p ∨ ∼p`). The lottery is named once, deferring to *Epistemic Paradoxes*. Attribute accordingly.

### 4.7 Deontic logic and preference — Chisholm, and the detachment fork

*SEP: logic: deontic (McNamara & Van De Putte) plus its supplements A–H · preferences (Hansson & Grüne-Yanoff). Note: the slug `deontic-logic` 404s; the entry is `logic-deontic`.*

Atomising `O` costs the standard thing — the inheritance rule OB-RM, the aggregation rule OB-C and the K-distribution axiom all become invisible. **So supply them as explicit bridge premises.** That converts a modal-logic fact into a propositional one and makes the student see exactly which principle does the damage, which is the whole value of this section.

#### Chisholm's paradox, fully analysed

Atoms: `g` (Jones goes to the neighbours' aid), `t` (tells them he is coming), plus one atom per obligation sentence. The four sentences are (1) `Og`, (2) "if he goes he ought to tell", (3) "if he doesn't go he ought not to tell", (4) `∼g` — with (2) and (3) each readable **wide-scope** (the operator outside the conditional) or **narrow-scope** (the conditional outside the operator).

**The bare skeleton — all four readings are consistent.**

| Reading of (2), (3) | Formalisation | SAT? | Members independent? |
|---|---|---|---|
| wide, narrow — *Chisholm's own* | `Og, Ogt, ∼g⊃Ont, ∼g` | **SAT** (1 of 16) | all four ✓ |
| wide, wide | `Og, Ogt, Ognt, ∼g` | **SAT** (1 of 16) | all four ✓ |
| narrow, wide | `Og, g⊃Ot, Ognt, ∼g` | **SAT** (2 of 16) | **(2) lost** |
| narrow, narrow | `Og, g⊃Ot, ∼g⊃Ont, ∼g` | **SAT** (2 of 16) | **(2) lost** |

**With the minimal bridge instances added:**

| Reading | Bridges | Result |
|---|---|---|
| wide, narrow | `Ogt ⊃ (Og ⊃ Ot)` [OB-K] and `∼(Ot & Ont)` [NC] | **UNSAT (0 of 32) — and all six members still independent** |
| wide, narrow | OB-K only, NC dropped | **SAT** — and `Ot & Ont` is derivable. *The conflict is there; only NC turns it into a contradiction.* |

**Three results, all propositional, all striking:**

1. **The skeleton says every formalisation is consistent, and Chisholm's own reading fully independent.** SEP's remark that the four "certainly appear to describe a possible situation" is *literally true at the propositional level*. **The paradox is invisible until the modal bridges are supplied** — which is a sharp lesson about what atomisation hides.
2. **The narrow-scope readings' independence failure is purely propositional.** `∼g ⊨ g ⊃ Ot` by the paradox of material implication — no deontic logic needed. This is the one Chisholm failure a truth-tree student can find unaided, and it is a beautiful motivation for why `⊃` is a bad model of "if you go, you ought to tell."
3. **The bridged set is *minimally* inconsistent**: unsatisfiable, yet every one of the six members independent of the other five. First-rate tree exercise — the tree closes, and deleting any single premise reopens it.

#### The rest, verified

| Form | Verdict | Note |
|---|---|---|
| `O∼k, k⊃O(kg), k, O(kg)⊃Ok, Ok⊃∼O∼k` | **UNSAT** (0 of 16), all five independent | **Forrester's Gentle Murderer.** Shorter than Chisholm and lands harder. Drop *only* the inheritance instance and it becomes satisfiable — RM is the sole culprit. |
| `O∼k, k⊃O(kg), k, O(kg)⊃Ok ⊢ Ok` | **VALID** | "You ought to kill her," derived from a prohibition on killing plus a contrary-to-duty conditional. |
| `r, O K r ⊢ O r` | **INVALID** | **Åqvist's paradox of epistemic obligation.** And an independence check reveals something SEP does not say: **`r` is redundant** — `{OKr, OKr⊃Or, ∼Or}` is already UNSAT. The paradox never needed the bank actually to be robbed. |
| `Om ⊢ O(m∨b)` | INVALID bare; VALID with inheritance supplied | **Ross's paradox.** Chained with free-choice permission it gives a **minimally inconsistent quintet** (5 atoms, 32 rows, every member independent). |
| `Pm⊃P(m∨b), P(m∨b)⊃(Pm & Pb) ⊢ Pm ⊃ Pb` | **VALID** | **Kamp's free-choice collapse** — and dropping the first premise blocks it, which locates the culprit. |
| `⊢ a ∨ (∼a & ∼b) ∨ b` | **TAUT** | Deontic exhaustion. |
| `⊢ ∼(a & b)` | **NOT a tautology** | No Conflicts is a *substantive* deontic axiom, not a logical truth. |
| `∼a & ∼(∼a&∼b) & ∼b ⊢ ⊥` | **VALID** | **SDL cannot represent normative gaps.** Two atoms, four rows — the cheapest high-value item here, and nothing is lost in translation. |
| `Pab, Pbc, Pca, (Pab&Pbc)⊃Pac, Pac⊃∼Pca` | **UNSAT**, all five independent | **Schumm's ornaments / the money pump.** And the bare cycle `Pab, Pbc, Pca` alone is **SAT** — *cyclicity is propositionally consistent*; it is transitivity plus asymmetry that kills it. |
| `hA, ∼hB, tB, (hA&tB)⊃hB` | **UNSAT** (0 of 8) | **WARP violation** — and the fourth datum `∼tA` is redundant. Excellent minimal-core exercise. |
| `p ⊢ p ∨ Oq`, then `p ∨ Oq, ∼p ⊢ Oq` | **both VALID** | **Prior's autonomy-of-ethics manoeuvre** — a two-step valid derivation of an "ought" from an "is", by `∨I` then disjunctive syllogism. The whole philosophical fight is over whether `p ∨ Oq` counts as descriptive. Two atoms, and a superb discussion prompt. |

⚠️ **Source cautions.** Free-choice permission and Prior's derived obligation appear in `logic-deontic` **only in the bibliography**, not in the body — the forms are faithful to §6.3's inheritance material but the names are not in its prose. **Neither entry contains an argument form for the is/ought gap**: `logic-deontic` §6.1 treats the issue as Jörgensen's Dilemma (a meta-level question about whether normative sentences are truth-apt at all, with no propositional skeleton), and `preferences` §8 discusses Humean motivation, not an inference form. The autonomy-of-ethics pair above is adjacent, not sourced. And the *combinative* preference principles of `preferences` §2.5 — contraposition, conjunctive expansion, disjunctive interpolation — relate preference claims whose relata are themselves compound, so atomisation destroys their entire content; **do not use them.**

📌 **One checked discrepancy in the SEP text.** §5.1.1 infers from the exhaustion theorem that "`(∼OBp & ∼IM∼p) → INp`". As literally printed, with `IM∼p`, that is **invalid** — countermodel `a=F, b=T`, on either atomisation of `IM∼p`. With `IMp` — evidently the intended reading — it is a tautology. Reported as a checked observation, not a claim about the authors' intent; either way the pair makes an excellent "find the scope error" exercise.

### 4.8 Impossible worlds, intensional logic, and provability — the expansion technique's best results

*SEP: impossible worlds (Berto & Jago) · logic: intensional (Fitting) · logic: provability (Verbrugge).*

**The rendering is licensed by the source, not invented.** SEP §5.3 states Rantala's semantics verbatim: *"at non-normal worlds, every sentence is assigned an arbitrary truth value. In effect, complex sentences ¬A, A∨B, and so on, are treated as if they were atomic sentences. The truth value of ¬A is independent of A."* That is a purely propositional operation. So the recipe is not per-world-per-atom but **per-world-per-complex-formula at the impossible world only**:

| | normal world *wᵢ* | open / impossible world *wⱼ* |
|---|---|---|
| atom `p` | `pᵢ` | `pⱼ` |
| `X & Y` | `Xᵢ & Yᵢ` | **a fresh atom** |
| `∼X` | `∼Xᵢ` | **a fresh atom** |
| `□X` / `BX` | conjunction over accessible worlds | **a fresh atom** |

And SEP guarantees this keeps the ambient logic classical, which is exactly what the course needs: *"Logical consequence and validity are defined with respect to possible (normal) worlds only. Impossible worlds come into play only when evaluating knowledge claims."*

#### Logical omniscience, as a set of matched pairs

| Principle | Both worlds normal | One world open |
|---|---|---|
| **Closure** (`Bp&q ⊢ Bp`) | **VALID** | **INVALID** — 1 CM (CLI-140) |
| **∨-introduction** | VALID | **INVALID** at a *nonprime* world — 2 CMs |
| **Adjunction** (`Bp, Bq ⊢ B(p&q)`) | VALID | **INVALID** — 1 CM of 32 |
| **Validity** (`⊨ A` gives `⊨ BA`) | **VALID** | **INVALID** — 2 CMs |
| **K / closure under entailment** | VALID | **INVALID** — 1 CM of 32 (CLI-145) |
| **Consistency** (`⊨ ∼(Bp & B∼p)`) | VALID | **VALID with one inconsistent alternative; INVALID only when every alternative is inconsistent** |

That last row is a finding worth keeping: **consistency of belief survives a single inconsistent doxastic alternative.** It takes *all* of them being inconsistent before `∼(Bp & B∼p)` fails — a good seminar point about how weak the Consistency principle actually is.

And the **Validity** pair is the crispest statement of logical omniscience anywhere: `⊢ (p1∨∼p1) & (p2∨∼p2)` is a tautology, while `⊢ (p1∨∼p1) & e` is not. **You are a non-omniscient agent exactly to the extent that some world you take seriously fails excluded middle.**

⚠️ **A calibration that matters for how these are sold.** Substituting *logical* equivalents inside `B` — `(p1≡q1)&(p2≡q2), Bp ⊢ Bq` — is **VALID**, and that is precisely the problem: a possible-worlds belief operator is automatically closed under it. Substituting merely *actual* equivalents is invalid, but that shows only **intensionality**, not hyperintensionality. The genuinely hyperintensional invalidities are the ones needing the open world. Do not present the actual-equivalents case as hyperintensional; it is the warm-up.

#### Provability: Löb *is* reachable, and it is a first-rate exercise

The atomised version `g ⊃ b` is dead, as expected. But on the four-world GL chain `w1 < w2 < w3 < w4` — where `□X` at `w1` is `X2&X3&X4`, at `w2` is `X3&X4`, at `w3` is `X4`, and at the endpoint `w4` is vacuously true — Löb's axiom becomes:

> `⊢ (((p3 & p4) ⊃ p2) & (p4 ⊃ p3) & p4) ⊃ (p2 & p3 & p4)` — **TAUTOLOGY**, three atoms, eight rows.

**The proof is the converse-well-foundedness argument in miniature.** You get `p4` outright from the endpoint clause, then `p3` by `⊃E`, then `p2` by `&I` and `⊃E`. Three `⊃E` steps in a forced order and one `&I` — and the student is doing the real induction without knowing it. This is the faithful propositional rendering of the fixed-point reasoning, and it belongs on a problem set.

The surrounding invalid forms are exactly the plausible-looking failures worth collecting:

| Form | Verdict | What it shows |
|---|---|---|
| `⊢ (p ⊃ p) ⊃ p` | **INVALID**, p=F | **Löb on a one-world reflexive frame**, where `□X ↦ X`. One atom, two rows: *the whole reason GL must be irreflexive.* |
| Löb with the endpoint clause `p4` dropped | **INVALID**, 4 CMs all with p4=F | |
| Löb with `p4` replaced by the vacuous `p4 ⊃ p4` | **INVALID**, same 4 CMs | **The tempting mistake.** |
| Löb with the box dropped from the conclusion | **INVALID**, 1 CM (CLI-142) | |
| `⊢ (p2&p3&p4) ⊃ p1` — **reflection** `□A ⊃ A` | **INVALID**, 1 CM | The axiom GL rejects. |
| Löb on the chain made reflexive at the root | **INVALID**, 1 CM | |

**A diagnosis the entry does not state in this form:** comparing the valid four-chain against the endpoint-dropped and reflexive-root variants, **the frame condition that makes Löb go is converse well-foundedness — the endpoint where `□` is vacuously true — not irreflexivity as such.** Irreflexivity at the root matters only because it stops the root clause from degenerating into a tautology that constrains nothing. Both claims verified by table rather than asserted.

**Second incompleteness grounds out but is not an exercise.** On the same chain, `∼□⊥ ⊃ ∼□∼□⊥` and the Gödel fixed point `∼□⊥ ≡ ∼□∼□⊥` are both valid, and `□Con` is **false** at the root. Zero atoms, one row — so they *verify* but there is nothing to test. Worth **showing** on a slide: `Con` true at the root and `□Con` false at the root is Gödel II drawn as a picture, in house notation with our own `⊥`.

#### Counterpossibles, and a trap

`∼a1 & ∼a2 ⊢ (a1⊃b1) & (a2⊃b2)` is **VALID** — that is **vacuism** in four atoms: if `A` holds at no world in range, `A ⊃ B` holds at all of them. Add a third, impossible world and it is **INVALID**, and the open branch is Nolan's world verbatim: *Hobbes squares the circle there and the mathematicians are unamazed.*

⚠️ **The trap, and it is a real result.** If you gloss the Strangeness of Impossibility Condition as "when there is no possible A-world, don't reach the impossible one," validity comes **back** — verified. SIC is a *closeness-ordering* constraint, not a "don't quantify over that world" constraint, and the truth table proves the difference. Students reach for the wrong gloss reliably.

#### Frege's puzzle, de re / de dicto, and Barcan

The best pair here is Frege (CLI-141): the same argument is invalid when the identity holds only actually and **valid** the instant it holds at every epistemic alternative — which is Marcus's answer, with the truth table showing exactly what work necessity-of-identity does. The open branch is a drawable epistemic model: one world where Hesperus and Phosphorus coincide, one where they come apart.

De re / de dicto renders at three atoms: `Pa1 ∨ Pb2 ⊬ Pa1 ∨ Pa2` where the term is non-rigid, repaired by supplying local rigidity. And **Barcan** (CLI-144) is the cleanest propositional rendering available — its converse is valid on the same frame, and the countermodel is literally "the domain grew."

#### Relevant logic's star negation, in two lines

`⊢ (p & ∼p) ⊃ q` is a tautology. Replace `∼p` by an independent letter — which *is* the Routley star clause, since `v_w(∼A)` is `v_{w*}(A)` — and it is **INVALID**. Likewise disjunctive syllogism. **The single move from `∼p` to an independent letter is what kills explosion, and nothing else changes.** That is the central claim of relevant logic, in the course's own notation.

Best of this group: the *same schema* `(p&∼p) ⊃ q` is a classical tautology and yet **not a necessity** over a frame containing one Routley world — a sharp, teachable distinction between "valid" and "valid at every world of every frame." Five atoms, thirty-two rows, four countermodels.

#### The honest negative: content operators do not render

The **mechanism** of hyperintensionality renders — non-compositional valuation at one world is a propositional operation, and the closure failures above are the proof. The **content-identity criterion** does not. On the impossible-worlds account a proposition is still a *set of worlds*; impossible worlds only make that algebra finer. A truth table over a fixed frame exhibits one assignment per world, so **no propositional formula's validity can turn on whether `p & q` and `q & p` are the same content.** SEP names the wall: because an impossible world may represent that `∼A` independently of whether it represents that `A`, the content of `∼A` "will not be a function of the proposition that `A`," and the only repair recovers compositionality via the *syntax* of a worldmaking language. **Syntax is the residue, and syntax has no truth table.**

Three things specifically checked and not renderable: **aboutness / subject-matter closure** (the operator's argument place is a topic, not a truth value — nothing for a valuation to assign); **Fine's truthmaker content** (states, not worlds; exact verification, not truth-at-a-point); and the comprehension principles for impossible worlds, which are **existential claims about the frame** — a fixed frame can satisfy them, but no formula over it can state them.

A corollary worth putting in the notes: **`A ⊨ A` is the only inference the expansion preserves at an open world** — and it holds only because the fresh atom is *carried*, not computed. That reproduces SEP's granularity result exactly: *"There is at least one such inference: the trivial inference from A to A."*

⚠️ **The standing caution on this whole technique.** Every INVALID here is invalidity *of the expansion over a stipulated frame*. The countermodels are real propositional facts, but that is not the same as invalidity in the modal logic. **If any of these reach a problem set, the frame stipulation must be visible to the student**, or the exercise silently teaches the wrong thing.

⚠️ **Sourcing:** the impossible-worlds entry **does not use the word "hyperintensional"** in the relevant sections — it makes the point through granularity of propositions and compositionality. Attribute the content, not the term. And the provability entry has no treatment of Rosser sentences or reflection calculi in its main text, so nothing above is sourced to those.

### 4.9 Combining logics, dynamic logic, and hybrid logic

*SEP: logic: combining · logic: dynamic · logic: hybrid. (Note: `logic-dynamic` does **not** 404; it fetched fine.)*

**A methodological upgrade to §1b's two-world expansion, and it matters.** Leaving the accessibility relation implicit — `□X ↦ X1 & X2` over a total frame — makes seriality and reflexivity true by fiat, and silently validates D, T, and ought-implies-can. **Treat `R_ij` as ordinary atoms instead**: `□X` at *w* compiles to `&ᵥ (R_wv ⊃ X_v)` and `◊X` to `∨ᵥ (R_wv & X_v)`. Now you quantify over *all* two-world frames and get honest countermodels — and you can re-run with `∼R11` or `(R11∨R12)` as premises to show exactly which frame condition each principle needs.

That upgrade produces the best items here:

| Form | Bare | With frame premises |
|---|---|---|
| `□_D p ⊃ ◊_A p` — **ought-implies-can** | **INVALID** on all 2-frames, 16 CMs | **VALID** given seriality of the deontic relation and its inclusion in the alethic one |
| `□_D p ⊃ ◊_D p` — deontic **D**, "obligatory implies permitted" | **INVALID**, 4 CMs — **every one a deontic dead end** | **VALID** given seriality |
| `p ⊃ □_D p` — the is-ought bridge | **INVALID**, 2 CMs, and still invalid with irreflexivity added | Hume vindicated at frame level |
| Commutativity `◇₁◇₂p ⊃ ◇₂◇₁p` | **INVALID** on 2-world *fusion* frames | **VALID** on the 2×2 *product* frame |
| Church–Rosser `◇₁□₂p ⊃ □₂◇₁p` | **INVALID** on fusion | **VALID** on the product |

**Ought-implies-can is not a logical truth; it is the assertion that the deontic relation is serial and included in the alethic one.** Run it once bare and once with the two frame premises, and the hidden bridge becomes visible. Every countermodel to `Op ⊃ Pp` is a world with no ideal successor — the moral-dilemma case, in four atoms. And the fusion/product pair confirms SEP's claim in both directions on the *same formula*: fusion is "just put the axioms together"; the product **creates new validities out of nothing**. The Church–Rosser countermodel is a bare frame with no propositional content at all — a nice way to show a countermodel can be purely structural.

**Prior's is-ought paradox, and the fix.** Prior's two inferences — `d ⊢ d ∨ n` and `d ∨ n, ∼d ⊢ n` — are **both valid**, which is the paradox and which is why they give you nothing invalid on their own. **Schurz's generalized Hume thesis** turns them into a pair: swap the norm inside and see whether validity survives. The first passes; the second **fails** (CLI-151). Three atoms, eight rows, and it does exactly the work Prior said he could not define — sorting the ethically trivial inference from the substantive one.

**Prawitz's ecumenical case** works on a two-point persistent chain: `p1⊃p2 ⊢ p1 ∨ ∼p1` is **VALID** while `p1⊃p2 ⊢ p1 ∨ (∼p1 & ∼p2)` — LEM with *intuitionistic* negation — is **INVALID**, on the same four rows. Prawitz: *"the classical logician asserts `A ∨_c ∼A`, to which the intuitionist does not object; he objects to `A ∨_i ∼A`."* The countermodel is the canonical "not yet decided, later verified" point. ⚠️ Present it as *one* countermodel, not as the semantics — a two-point chain validates some intuitionistic non-theorems.

**Dynamic logic's single best gift to this course:** the test axiom `[A?]B ≡ (A ⊃ B)` **is material implication verbatim** — the compiled form at a world is literally `A1 ⊃ B1`. So every paradox of the material conditional the course already teaches becomes a fact about program tests, for free.

Two invalid forms worth keeping. **The joint-achievability fallacy** (CLI-150), whose failure SEP explicitly flags and whose converse is valid. And **partial correctness ⊬ total correctness**: `A ⊃ [α]B ⊬ A ⊃ ⟨α⟩B`, where **every countermodel is a non-terminating program** — SEP's own example is `while 1 do skip`, which satisfies every Hoare triple vacuously. Vacuous truth with real stakes, and the serial-frame rerun shows termination is exactly the missing premise. Also: the Hoare consequence rule run backwards — postcondition *weakening* is valid, *strengthening* is not — catches a mistake students make constantly.

⚠️ **A trap worth recording.** Hoare triples are **model-validities, not local truths.** Assert `A ⊃ [α]B` only at the evaluation world and the composition rule comes out *invalid*. Asserted at every world it is valid. Any exercise built on them must say which.

**Hybrid logic yields more than expected, and the reason is precise.** Rendering a nominal as `a1 & ∼a2` hard-codes which world it names and makes the interesting principles trivially valid. The better move is to compile `@ₐφ` as `(a1 & φ1) ∨ (a2 & φ2)` and carry the nominal constraint `NOM(a) = (a1 ∨ a2) & ∼(a1 & a2)` as **a premise you can add or withhold**. Then:

- `@ₐa` — **invalid** bare, valid with NOM(a). It is not a logical truth about the compiled atoms; it *is* the nominal constraint in disguise.
- `@ₐb ⊃ @_b a` — **valid with no constraint at all**, falling out of the commutativity of `&`.
- Transitivity (CLI-146) — invalid bare, valid with NOM(**b**) alone.
- Leibniz's Law (CLI-147) — valid with NOM(**a**) alone, still invalid with NOM(**b**) alone.
- `{@ₐp, @ₐ∼p}` — **satisfiable** bare (both models have `a1 = a2 = T`), **unsatisfiable** with NOM(a). *Non-contradiction at a point is a consequence of naming, not of logic.*

**So the expansion does not merely reproduce the validities — it isolates which nominal each one depends on**, which the entry does not say and which is the real content of "nominals are terms."

Adding relation atoms extends this to frame correspondence: `c ⊃ □∼c` is invalid on all 2-frames, **valid on irreflexive ones**, and invalid again when `R11` is asserted. Three runs of one formula, and irreflexivity is a property SEP notes is **not expressible in ordinary modal logic** at all.

⚠️ **Two things lost, and both must be stated in any exercise.** (a) **Two worlds is a bound, not a semantics.** Every INVALID verdict here is sound — a two-world countermodel is a genuine countermodel. But VALID means only "no countermodel of this size." (b) **The `↓` binder becomes substitution, not binding**: `↓c □∼c` at `w1` compiles to plain `∼R11`. Fixing the world count collapses it, and the reason `↓` adds expressive power — unbounded frames — is exactly what the expansion throws away. Say so rather than pretending the binder is captured.

### 4.10 Vagueness — the non-conditional sorites, supervaluationism, epistemicism

*SEP: vagueness (Sorensen) · Sorites paradox. Complements §4.3, which covered the conditional chain across Ł3/K3/LP/G3 and the degree-theoretic reading.*

#### The forms §4.3 did not have

The entry gives three schemas beyond the conditional chain, and derives the line-drawing form from the **least number principle**: "there must be a least number, say *i*+1, such that a man with *i*+1 hairs on his head is not bald… Hence the series contains a number of hairs *n* such that a man with *n* hairs is bald whilst a man with *n*+1 hairs is not." Its own gloss: "competent users of 'bald' both must, and must not, draw a line."

All verified for n = 3, 4, 5:

| Form | Verdict |
|---|---|
| **Line-drawing**, SEP's own premise: `r₁, ∼(r₁&…&rₙ) ⊢ (r₁&∼r₂) ∨ … ∨ (rₙ₋₁&∼rₙ)` | **VALID** |
| **Line-drawing**, endpoint form: `r₁, ∼rₙ ⊢` same | **VALID** |
| **Mathematical-induction sorites**: `r₁, (r₁⊃r₂)&…&(rₙ₋₁⊃rₙ) ⊢ r₁&…&rₙ` | **VALID** |
| **No-sharp-boundary set**: `{r₁, ∼rₙ, ∼[(r₁&∼r₂)∨…∨(rₙ₋₁&∼rₙ)]}` | **UNSAT** |
| **Tolerance-denial ⇄ cutoff**, both directions | **VALID both ways** |

**The minimal-inconsistent-subset result is the item worth assigning.** For every n checked, there is **exactly one** minimal inconsistent subset and it is the whole three-element set — every proper subset is satisfiable, verified individually. `NSB` is boundarylessness, and it is **not false on its own**, nor false given *either* endpoint alone: it becomes inconsistent only in the presence of **both**. It is satisfied by the all-true valuation (everything is a heap) and by the all-false one (nothing is) — i.e. by exactly the two ways of refusing to run the series. **The sorites is a three-way inconsistency, not a bad inference**, and one 16-row table shows it.

**The forced march has no distinctively classical form**, and that is itself the finding. The verdict-at-each-station premises `rᵢ ∨ ∼rᵢ` are individually tautologous, hence classically idle — verified: the sequent is valid with them and *equally* valid without, on the same 4 of 16 premise-true rows. Its bite is entirely dialectical, in settings where "the speaker can answer" is not the same commitment as `rᵢ ∨ ∼rᵢ`.

⚠️ Note SEP's line-drawing premise is `∼∀n(Φαₙ)`, i.e. `∼(r₁&…&rₙ)` — strictly **weaker** than the `∼rₙ` students expect. Both are valid. The weaker one is the better exercise because it forces genuine use of De Morgan; set both and ask which premise does the work.

#### Supervaluationism — and why no truth table can ever show its failures

The rule failures were checked against an executable finite supervaluation semantics (a model is a non-empty set of admissible precisifications; `D` is global; supertruth is truth on all of them; all 15 non-empty sets over two atoms enumerated). Confirmed, each in the precise shape Williamson gives it — a valid *sequent* whose corresponding *schema* is invalid:

| | Verdict |
|---|---|
| `⊨sv p ∨ ∼p`, `⊨sv ∼(p & ∼p)` | **VALID** — every classical tautology is supertrue |
| `⊨sv Dp ∨ D∼p` | **INVALID**, 9 of 15 |
| `⊨sv Dp ∨ D∼p ∨ (∼Dp & ∼D∼p)` | **VALID** — only the *dichotomy* fails, not the trichotomy |
| `p ⊨sv Dp` (rule) vs `⊨sv p ⊃ Dp` (schema) | valid / **invalid** → **conditional proof fails** |
| `∼Dp ⊨sv ∼p` | **INVALID** → **contraposition fails** |
| `p, ∼Dp ⊨sv ⊥` | **VALID** → **reductio would license the refuted contraposition** |
| `p ⊨sv Dp∨D∼p` and `∼p ⊨sv Dp∨D∼p`, but `p∨∼p ⊨sv Dp∨D∼p` | valid, valid, **invalid** → **argument by cases fails** |

**Four distinct reasons none of this is truth-table-checkable, and they should not be conflated:**

1. **In principle.** A truth table computes a *schema's* column. "Conditional proof fails" is a claim about a **closure property of the consequence relation** — that `Γ, A ⊨ B` does not give `Γ ⊨ A ⊃ B`. No table has a cell for that. **Nothing you can put on a truth table will ever exhibit a supervaluationist rule failure.**
2. **In the `D`-free language there is nothing to find.** Verified: over **12,769 sequents and 6,165 theoremhood checks** in `∼ & ∨ ⊃ ≡` alone, supervaluational and classical consequence agree **without a single exception**. The two-line proof: every precisification is a classical valuation, so classical validity gives supervaluational validity; and a classical countermodel `w` yields the singleton set `{w}`, on which supertruth collapses to truth at `w`. **Every propositional check in our five connectives returns the classical answer.**
3. **Supertruth is not a truth value.** `p ∨ ∼p` supertrue with neither disjunct supertrue is a direct refutation of truth-functionality, which tables presuppose.
4. **Bivalence and Convention T are metalinguistic** — §3.8.

⚠️ SEP's *Sorites* entry is more careful than its *Vagueness* entry here: the failures hold "**in a language extended to express vagueness by the addition of a determinacy or definiteness operator**." Result 2 vindicates that wording. (One caveat recorded: Graff Fara argues the failures recur *without* a `D` operator under a strengthened *penumbral* consequence, which was not modelled.)

Two exercises that *are* legitimate: `⊬ d₁ ∨ d₂` with `d₁, d₂` opaque atoms (invalid, 1 of 4) beside `⊢ p ∨ ∼p` (valid). Six rows, and it makes the object-language/metalanguage line visible — **but flag that it shows only that `D` is opaque to the connectives, not that supervaluationism breaks anything.**

#### Epistemicism — and the best premise-isolation pair in the file

Epistemicism is *logically* the cheapest theory on offer: the cutoff follows classically, and the entire burden is explaining the ignorance. Williamson's **margin for error** — "if *x* and *y* differ incrementally and *x* is known to be Φ, then *y* is Φ" — does that work, and verified for n = 3..6:

| Form | Verdict |
|---|---|
| **`r₁, ∼rₙ, {Krᵢ ⊃ rᵢ₊₁} ⊢ ⋁ᵢ(rᵢ & ∼rᵢ₊₁ & ∼Krᵢ)`** — *there is a sharp cutoff you cannot know* | **VALID** |
| with factivity added: `⊢ ⋁ᵢ(rᵢ & ∼Krᵢ)` | **VALID** |
| **factivity ONLY, margin for error dropped** | **INVALID** — 2 CMs at n=3, 4 at n=4 |

**The derivation is short enough for Fitch and needs no epistemic machinery at all:** at the cutoff station `i` we have `rᵢ & ∼rᵢ₊₁`; margin for error gives `Krᵢ ⊃ rᵢ₊₁`; contraposing with `∼rᵢ₊₁` gives `∼Krᵢ`. **The very station where the boundary sits is one whose positive side you do not know.** No factivity, no KK, no modality — `K` can be a wholly opaque unary operator.

**Set the valid form and the factivity-only control as a pair.** Same conclusion, one premise set added, validity flips, and the countermodels are models in which the speaker knows exactly where the boundary is. That shows **margin for error is doing real work rather than being an add-on**: Williamson's explanation *derives* the unknowability instead of stipulating it. SEP records the standard rejoinder — "bare linguistic competence gives us knowledge that there are no such thresholds. This accounts for the comical air of the epistemicist."

---

### 4.11 Quantum logic and Skolem's paradox — two claims this file was making too loosely

*SEP: Quantum Logic and Probability Theory (Wilce) · Skolem's Paradox (Bays).*

#### 4.11a "Distribution fails in quantum logic" — the correction

⚠️ **The classical form is VALID, with no countermodel — in either direction.** Verified: `(p & (q∨r)) ⊃ ((p&q) ∨ (p&r))`, its converse, the biconditional, and the dual `(p ∨ (q&r)) ≡ ((p∨q) & (p∨r))` are all tautologies; so are excluded middle, non-contradiction, both double-negation directions, both De Morgan biconditionals, modus ponens, and the orthomodular and modular laws *stated as propositional schemas*. **So "this form fails in quantum logic" cannot be a remark about the ⊨ column of a truth table.** The inventory must say which structure it is about, or a student will reasonably hunt for a row that does not exist. CLI-314 has been rewritten accordingly.

**What the structure is.** `L(H)`: the closed subspaces of a Hilbert space, equivalently the projections, ordered by inclusion. A complete orthocomplemented lattice in which **meet = intersection** but **join = the closed span of the union — emphatically not the union.** The entry's reason for non-distributivity is purely order-theoretic and is one line: "Since a typical closed subspace has infinitely many complementary closed subspaces, this lattice is not distributive" — and in a distributive lattice complements are *unique*.

**Which half fails, and this matters because half the law is free:**

| Half | Status | Failures found |
|---|---|---|
| `(a∧b) ∨ (a∧c) ≤ a ∧ (b∨c)` | **free in any lattice** | MO2: 0, MO3: 0, benzene O6: 0, `L(ℝ³)`: 0 |
| **`a ∧ (b∨c) ≤ (a∧b) ∨ (a∧c)`** | **the one that fails** | MO2: 24, MO3: 120, O6: 8, `L(ℝ³)`: 308 of 3000 random triples |

📌 **The biconditional is the wrong thing to list**, because it obscures that only one arrow is at issue. Our recorded direction was right; the converse should be recorded as *surviving*.

⚠️ **The `qt-quantlog` entry contains no two-slit example, no spin example, and no worked physical example of any kind** — grepped for *slit, interference, photon, electron, particle, momentum, position*: nothing. Its whole argument is the abstract multiple-complements one. **Any attribution of a concrete physical illustration to this entry is wrong.** The example this file has been leaning on comes from the *disjunction* entry §2.1.5 and is the **position/momentum** case, not two-slit. That passage also says quantum logics "reject bivalence," which sits badly with the main entry's sharper fact: by **Gleason**, for dim H > 2, `L(H)` admits **no {0,1}-valued probability measure at all** (the map `u ↦ ⟨Wu,u⟩` is continuous on the connected unit sphere). That is a much better thing to tell a student.

**A clean concrete case, verified numerically in `L(ℝ²)`.** Take `p` = the line spanned by (1,0), `q` = the line spanned by (0,1), `r` = the line spanned by (1,1). Then `q ∨ r` = the whole space, so `p ∧ (q∨r) = p`, rank 1; but `p ∧ q = p ∧ r = 0`, so the right-hand side is the zero subspace, rank 0. `LHS ≤ RHS` is false; `RHS ≤ LHS` holds. **The gloss worth putting in the inventory:**

> In `L(H)`, "or" is **span**, not union. The span of two lines contains every superposition of them — vectors lying in neither disjunct. **So a disjunction can be certain while neither disjunct is even possible.**

In spin words: "spin-x is up, and (spin-z is up or spin-z is down)" is certain; "(spin-x up and spin-z up) or (spin-x up and spin-z down)" is impossible, because each disjunct ascribes sharp values to two incompatible observables at once.

#### 4.11b Connective or lattice operation? — and is it a logic in our sense?

**The failure is at the level of the lattice operations, and the entry is explicit.** Von Neumann's 1932 calculus applied meet, join and complement **only to commuting projections**, identified with "simultaneously decidable propositions." Lemma 1.1 makes the scope exact: `PQ = QP` iff the sublattice generated by `P, Q, P′, Q′` is Boolean. **So classical logic holds locally, on every context of pairwise-compatible propositions; distribution fails only when you straddle incompatible contexts.** That is genuinely useful to say in a course: nothing here impugns the truth table for `&` within any single measurement context.

Reading the operations as *connectives* is an extra, contested step — Birkhoff and von Neumann's 1936 one — and the entry's immediate verdict on it is decisive for us:

> "Immediately this proposal faces the problem that the lattice `L(H)` is not distributive, **making it impossible to give these 'quantum' connectives a truth-functional interpretation**."

Birkhoff and von Neumann's own phrasing was cautious; the aggressive reading is Finkelstein's and Putnam's ("Logic is as empirical as geometry"), which the entry reports as "widely regarded as mistaken."

⚠️ **Is it a logic in this course's sense — a consequence relation on sentences? No, and this is the author's own stipulation, footnote 2, verbatim:**

> "Throughout this paper, I use the term 'logic' **rather narrowly to refer to the algebraic and order-theoretic aspect** of propositional logic. There exists a substantial technical literature devoted to non-classical formal deductive systems that are intended to stand to quantum propositional logics rather as classical deductive systems stand to Boolean algebras."

Corroborating: the entry scare-quotes "logic" nearly every time; the **bearers are projections, subspaces, or equivalence classes of experimental events — not sentences**, with no language, no formation rules, no substitution, no turnstile; and the general case is not even a lattice (orthoalgebras, effect algebras). There *is* a consequence relation lurking — the lattice order `≤` is entailment. What there is not, without extra work, is a **conditional**:

| Claim | MO2 | MO3 | `L(ℝ³)`, ~3–4k random pairs |
|---|---|---|---|
| `a′ ∨ b = 1` implies `a ≤ b` (material conditional tracks entailment) | **FAILS**, 8 | **FAILS**, 24 | **FAILS**, 556 |
| `a ∧ (a′ ∨ b) ≤ b` (MP as entailment, material) | **FAILS**, 8 | **FAILS**, 24 | **FAILS**, 998 |
| **Sasaki hook** `a →ₛ b := a′ ∨ (a∧b)`: `= 1` iff `a ≤ b` | HOLDS | HOLDS | HOLDS, 0 failures |
| `a ∧ (a →ₛ b) ≤ b` | HOLDS | HOLDS | HOLDS, 0 failures |

In `L(ℝ²)`, `p⊥ ∨ q` is the whole plane for any two distinct lines, so "if spin-x is up then spin-z is up" comes out *valid*. **The material conditional is useless here.** (The hook is the agent's construction, not the entry's — the entry introduces only the Sasaki *projection*, as a state-transition map.)

#### 4.11c What orthomodularity buys, exactly

| Law | ortholattice | OML | `L(H)` | Failures found |
|---|---|---|---|---|
| Excluded middle `p ∨ p′ = 1` | **holds** (axiom) | holds | holds | 0 everywhere |
| Non-contradiction `p ∧ p′ = 0` | **holds** (axiom) | holds | holds | 0 everywhere |
| Double negation `p″ = p` | **holds** (axiom) | holds | holds | 0 everywhere |
| De Morgan, both forms | **holds** (derivable) | holds | holds | 0 everywhere, incl. O6 |
| Orthomodularity | **can fail** | holds (def.) | holds | O6: 2; others 0 |
| **Distributivity** | **fails** | **fails** | **fails** | MO2: 24, MO3: 120, O6: 8, `L(ℝ³)`: 308/3000 |
| MP as a **rule** (from `a=1`, `a ⊃ b = 1`, infer `b=1`) | holds | holds | holds | 0 everywhere |
| MP as **entailment**, material `⊃` | **fails** | **fails** | **fails** | MO2: 8, MO3: 24, O6: 2, `L(ℝ³)`: 998/4000 |
| MP as entailment, Sasaki hook | **fails** | **holds** | **holds** | O6: 2; others 0 |

📌 **Excluded middle and non-contradiction hold but bivalence does not.** `p ∨ p′ = 1` is a lattice identity and never in doubt; by Gleason there is no state assigning every projection a value in {0,1}. **So "`p ∨ ∼p`" is a theorem while "either `p` is true or `∼p` is true" is unavailable** — the precise sense in which quantum "or" is not our "or," and exactly the pressure point Dummett identified: per the *disjunction* entry, Dummett 1978 (not a proponent) considered restricting **∨-elimination** so that distribution is no longer derivable. **That is the natural-deduction-shaped version of the failure, and the one that connects to our Fitch system.**

⚠️ **"Modus ponens survives" needs disambiguating or it misleads.** As a rule preserving the top element it holds in *every* ortholattice, including the benzene ring, and trivially — if `a = 1` then `a′ = 0` and the conditional collapses to `b`. It is the *entailment* reading that discriminates, and there the material conditional fails badly.

**Orthomodularity sits strictly between** ortholattices and Boolean algebras — verified in both directions: MO2, MO3 and `L(ℝ³)` are orthomodular with distribution failing; the benzene ring O6 (two chains `0 < a < b < 1` and `0 < b′ < a′ < 1`) is a perfectly good ortholattice in which orthomodularity fails at `a ≤ b`. What you get for it: **(i)** an implication that tracks entailment (the Sasaki hook — orthomodularity is *precisely* what makes a usable conditional available, though not a truth-functional one and with no deduction theorem outside the Boolean case); **(ii)** agreement between the logic and the probability calculus (Lemma 4.3 — orthomodularity is exactly the condition making the partial orthogonal sum coincide with the lattice join; without it the two come apart); **(iii)** Hilbert space itself, by Amemiya–Araki plus Piron and Solèr, though the entry's verdict is that Piron "does not quite bring us all the way back to orthodox quantum mechanics"; **(iv)** not much else — no truth-functionality, no general tensor product, and Harding showed the direct-product decompositions of *any* structure form a regular orthomodular poset, so it is not distinctively quantum.

⚠️ **One caveat flagged by the agent as unverified by it.** Its `L(ℝ³)` audit found modularity holding with zero failures — correct, since finite-dimensional subspace lattices are modular. But `L(H)` for **infinite-dimensional** H is orthomodular and **not** modular. Neither SEP entry says so; do not let the 0/3000 finite-dimensional result stand as evidence that `L(H)` is modular in general.

#### 4.11d Skolem's paradox, and the one qualification Lecture 12 needs

**The apparent conflict.** ZFC is a countable set of first-order sentences, so if it has a model it has a countable model `M`; yet `ZFC ⊢ ∃x "x is uncountable"`, so some `m̂ ∈ M` has `M ⊨ Ω[m̂]` while `{m : M ⊨ m ∈ m̂}` is countable.

📌 **Why it looks paradoxical at all is good pedagogy**, and it is the entry's own answer: first-order models get the *finite* cardinality notions exactly right. Verified exhaustively over |D| = 1–3: `∃≥1, ∃≥2, ∃≥3` and the exact-cardinality sentences come out true in precisely the right models, no exceptions. **Skolem's paradox marks the first place where our model theory loses the ability to capture cardinality notions, and it is the success just below the line that makes the failure at the line surprising.** Note also that the paradox does not depend on the axiomatisation: every first-order axiomatisation is subject to LS, so you cannot escape by adding axioms.

**The resolution is an equivocation between two interpretations of one string.**

| | quantifiers range over | "∈" denotes |
|---|---|---|
| Ordinary-English reading | the whole set-theoretic universe | the real membership relation |
| Model-theoretic reading (`M ⊨ …`) | the domain of `M` only | whatever binary relation `M` assigns |

⚠️ **The "bijection exists but is not in the model" slogan is right — for transitive models, and the qualification is not optional.** With `M` countable and transitive, `∈` is interpreted correctly and `M` even gets bijections right, so the entire burden falls on the quantifier; `m̂` really is countable and 2^ℵ⁰ bijections `f : ω → m̂` genuinely exist, `M` simply contains none. But the entry warns that for **non-transitive** models "nearly all of this falls apart" — Bays has versions turning solely on how a non-transitive model interprets a few specific instances of `∈`, and one can find a countable model of ZFC containing the whole set of reals *as a member*, countable only because `ℜ ≠ {m : M ⊨ m ∈ ℜ}`. **If Lecture 12 uses the bijection slogan, it must say "for transitive models."** In the general case the generic equivocation diagnosis "may be the best we can do."

**Why a countable model can satisfy ZFC at all**, which is the mechanism students actually want: the model misinterprets the *axioms* just as systematically. Relativise Power Set to `M` and it only demands a `y ∈ M` containing the subsets of `x` **that also live in M** — most do not. So `M`'s "power set of ω" is far smaller than the real one, and (Resnik) `M`'s "set of reals" contains only the reals in `M`. Verified in miniature with a genuinely transitive setup — domain elements are real hereditarily finite sets, `∈` is real membership: on a full domain the relativised power-set formula is satisfied by the 4-element element, as it should be; on a *deficient* domain from which `{{∅}}` has been omitted it is satisfied by a **3-element** element. **Nothing false is asserted inside the deficient domain; the missing subset is simply out of range of its quantifiers.**

📌 **The formulation for Lecture 12.** The claim that soundness and completeness show two definitions of consequence coincide is true, and Skolem does not touch it — `Γ ⊨ φ iff Γ ⊢ φ` is a relation between *sentences*, and it is a theorem. What Skolem shows is a different thing:

> **Completeness pins down the consequence *relation*. It does not pin down the *structures*.** Everything `Γ` entails is derivable from `Γ`; and yet `Γ` may be satisfied by models that disagree about whether one of their own members is uncountable.

### 4.12 Belief revision, dependence logic, and the scandal of deduction

*SEP: Logic of Belief Revision (Hansson) · Dependence Logic (Galliani) · Logic and Information (Allo, Sequoiah-Grayson, Martinez).*

⚠️ **URL note.** `/entries/dependence-logic/` is a **404**. The entry lives at **`/entries/logic-dependence/`**.

📌 **One thread runs through all three entries, and it belongs in the syllabus:** *classical logic's connectives and consequence relation are the limit case that results from throwing away bookkeeping.* Team semantics keeps track of the *set* and gets a `∨` that is not idempotent and a `∼` that does not exhaust. Substructural logic keeps track of *which premises, how often, in what order* and gets a `⊗` that is not `&`. AGM keeps track of *which beliefs are entrenched* and gets a `÷` that is not definable from `Cn`. In each case, adding the bookkeeping back breaks a law the course teaches as structural.

#### 4.12a AGM, Recovery, and why it presupposes Harman's gap rather than closing it

The six basic contraction postulates: **Closure** `K÷p = Cn(K÷p)`; **Success** (if `p ∉ Cn(∅)` then `p ∉ Cn(K÷p)`); **Inclusion** `K÷p ⊆ K`; **Vacuity**; **Extensionality**; and **Recovery** `K ⊆ (K÷p)+p`. Representation theorem: `÷` is a *partial meet contraction* iff it satisfies ÷1–÷6, and *transitively relational* iff it also satisfies conjunctive inclusion and overlap. The **Levi identity** is stated verbatim in the entry: `K*p = (K÷∼p)+p`.

⚠️ **The Harper identity is never stated in the entry.** Harper 1977 is cited once, in passing, with no formula. The standard statement, confirmed against the current technical literature (Booth & Chandler; Schulte), is `K÷p = K ∩ (K*∼p)`. **And here is the load-bearing fact:** a contraction function is derivable from a revision function via the Harper identity **iff it satisfies Recovery**. Recovery is not an incidental sixth postulate — it is precisely the price of the Levi/Harper round trip. Kill Recovery and the two identities stop being inverse to each other. That is why the contested postulate is the one that cannot be quietly dropped.

**Why Recovery is contested.** The entry opens §2.3 with "Recovery is the most debated postulate of belief change," and gives **Cleopatra** verbatim: having contracted `p ∨ q` after learning the book is a novel, "I learn from a reliable source that Cleopatra had a child. **It seems perfectly reasonable for me to then add `p ∨ q` to my set of beliefs without also reintroducing either `p` or `q`. This contradicts Recovery.**" And **George**: since I previously believed George a mass murderer, Recovery entails "that I cannot after that believe him to be a shoplifter without believing him to be a mass murderer."

**Verified — and this is the pair to teach:**

| # | Form | Verdict | Countermodels |
|---|---|---|---|
| **A3a** | Recovery + Cleopatra, `(bS⊃aS)&(bD⊃aD)`, `bS&bD`, `aC`, `∼aS&∼aD` | **UNSATISFIABLE**, 0 of 32 | — |
| **A3b** | Cleopatra *without* Recovery: `bS&bD`, `aC`, `(bS∨bD)⊃bC` ⊨ `aS ∨ aD` | **INVALID** | 1 of 64: `aC=T, aS=F, aD=F` |

A3a is the counterexample *as a formal object*: every branch closes, and the classical diagnosis of a Recovery-respecting reasoner on this case is "your beliefs are inconsistent." A3b is its converse and the one to set: the unique open branch is **precisely the epistemic state Hansson describes** — I have "Cleopatra had a child" back without the son or the daughter.

**Why the escape route closes.** The natural weakening — **Core-retainment** — "gives the impression of being weaker and more plausible than Recovery. However, it has been shown that if an operator `÷` for a belief set `K` satisfies Core-retainment, then **it satisfies Recovery**." Verified as a bookkeeping form: `(cl & cr) ⊃ rec`, `∼rec ⊃ (∼cl ∨ base)`, `cl`, `cr`, `∼base` ⊨ `rec` is **VALID**, and the atom `cl` (logical closure of `K`) marks the load-bearing assumption — drop it, go to belief *bases*, and **Relevance** replaces Core-retainment and Recovery goes away. Contrast the coin toss (§5.2): on belief *sets* Recovery forces `h ∈ K÷c+c`, "contrary to reasonable intuitions"; on a belief *base* it does not. **Verified**: the coin-case description is **SATISFIABLE** (3 of 64), the Cleopatra description **UNSATISFIABLE**. Same apparatus, opposite verdicts, and the difference is exactly logical closure. That pair is a whole problem set. The best non-Recovery construction, **severe withdrawal**, buys its way out at the cost of **Expulsiveness** — the scholar cannot give up "my car is parked out front" while retaining "Shakespeare wrote *The Tempest*" — and the entry's verdict stands: "The construction of a plausible operation of contraction for belief sets that does not satisfy Recovery is still an open issue."

📌 **Does AGM close the Harman gap? It presupposes it.** Three textual pieces: (i) **the selection function is extra-logical** — `Cn` fixes the remainder set, but the contraction is `K÷p = ⋂γ(K⊥p)`, and every normative bite lives in `γ` (or the entrenchment ordering), which is exactly the material Harman says logic does not supply; (ii) Levi and Harper are **mutually interdefining, not reductive** — the circle is closed but ungrounded; (iii) **Segerberg's charge, verbatim in §9.2: "AGM is not really logic; it is a theory about theories."** A fourth, in Harman's own idiom: §1.2 concedes that belief sets are logically closed, "which is clearly an unrealistic idealization, since it means that the agent is taken to be 'logically omniscient'."

**Verified, and these three forms belong next to the existing Harman section:**

| # | Form | Verdict | Countermodels |
|---|---|---|---|
| **A1** | `Bp`, `B(p⊃q)`, `p ⊃ q` ⊨ `Bq` | **INVALID** | **3** — including rows where `p` and `q` are both true |
| **A5** | Levi and Harper both hold ⊨ Levi is prior | **INVALID** | 1: `ps=T, pd=F` |
| **A6** | "AGM exists, therefore the gap is closed" | **INVALID** | 1: `a=T, l=F, g=F` |

**A1 is Harman's complaint in one table**, and note *what* it shows: `Bq=F` survives even in rows where `p` and `q` are both true and the material conditional holds. **The belief atoms are truth-functionally sealed off from their contents.** Logic gives you `p, p⊃q ⊨ q`; it gives you nothing about `Bp, B(p⊃q) ⊨ Bq`. AGM's Closure postulate *stipulates* the missing link. **A6 is an enthymeme diagnosis**: the single unsatisfied atom in the countermodel *names* the missing premise — that AGM's norms flow from the consequence relation alone, which is false. ⚠️ Note the asymmetry the encoding exposes: **Harper propositionalises and Levi does not**, because `+` is `Cn(K∪{p})` and membership in a closure is not a truth function of its members.

#### 4.12b Dependence logic — and the best available argument for a course that teaches compactness and LS

`=(x₁…xₙ, y)` says the value of `y` is functionally determined by `x₁…xₙ`. The point of separating this from quantification: in FO, "whether a quantified variable `v₁` will or will not depend on `v₂` is determined by the respective position and form of their quantifiers." **Scope is a linear order, so FO dependency is necessarily transitive and linearly ordered.** Branching quantifiers and IF logic buy non-linear patterns by messing with the *quantifier*; dependence logic buys them with an **atom**, so the dependent thing need not be a quantified variable at all.

**Team semantics**: formulas are satisfied by **sets of assignments**. `∨` *splits* the team (`X = Y ∪ Z`, not necessarily disjoint); `∀` *duplicates* it once per domain element; `∃` *supplements* it by a choice function. Four structural properties: **conservativity** (FO formulas behave exactly as under Tarski), **locality**, **downward closure**, and the **empty set property**. Conservativity and locality are sanity conditions every variant meets; downward closure and the empty-set property are **not** — independence and inclusion logic violate them.

📌 **What team semantics buys, in one line:** properties of a *set of possibilities as a whole* that are invisible from inside any single possibility. The entry's own gloss is the one to teach — a team is a **belief state**, "the set of all states of the world (=assignments) that some agent believes possible," so `=(x,y)` says "in every world I hold open, `y` is settled by `x`." That is a *hyperproperty*, and our `⊨` is a single-row semantics that structurally cannot say it.

**Two failures of classical law, both checkable in our own apparatus:**

| # | Form | Verdict | Countermodels |
|---|---|---|---|
| **B1** | `Tp ≡ (p₁ & p₂)`, `Tn ≡ (∼p₁ & ∼p₂)` ⊨ `Tp ∨ Tn` | **INVALID** | **2** of 4 coherent rows: `p₁=T,p₂=F` and `p₁=F,p₂=T`, both with `Tp=Tn=F` |
| **B2** | idempotence of `∨` | **INVALID** | 1: `d=F, dd=T, sp=T` |
| **B3** | union closure (downward closure holds, union does not) | **INVALID** | 1: both subteams satisfy the atom, the union does not |

**B1 is the best form in this batch.** The two biconditional premises *are* rule TS-lit for a two-assignment team; the entry's own statement is that "if a team `X` contains both assignments `s` with `s(x)=s(y)` and assignments `s′` with `s′(x)≠s′(y)` then `X ⊭ x=y` and `X ⊭ x≠y`." **It derives the failure of `φ ∨ ∼φ` inside the course's own apparatus, with a classical truth table, using only the definition of team satisfaction for literals. No non-classical machinery is smuggled in.** The moral: **LEM is not a fact about `∨` and `∼`; it is a fact about evaluating at a single point.** Move the evaluation point to a *set* and it goes, with no change to any connective. B2's proof is the entry's one-liner — "the union of functions is not in general a function." B3 is the property that separates the three logics: dependence logic is downward closed and not union closed; **inclusion** logic is union closed and *not* downward closed; **independence** logic is neither, which is why it is formula-wise strictly stronger.

📌 **Is dependence expressible in FO? No — and the usual first-orderhood diagnostics do not detect it.** Sentence-wise, dependence logic ≡ **Σ¹₁**, hence by Fagin exactly NPTIME on finite models, hence strictly beyond FO. But because it is Σ¹₁-equivalent sentence-wise, it **inherits both compactness and Löwenheim–Skolem** (both stated as theorems in §3.1). A student armed with "compact + LS ⟹ first-order" (a garbled Lindström) will conclude that dependence logic is FO. **That inference is invalid, and the missing hypothesis is closure under contradictory negation** — exactly what dependence logic lacks. Verified as form **B4**: `e`, `e ⊃ (cp & ls)`, `e ⊃ np` ⊨ `f` is **INVALID**, unique countermodel `cp=T, ls=T, np=T, f=F` — **and that countermodel is not a curiosity, it is the actual case.** This is the best single argument in the sweep for a course that teaches compactness and LS as first-order hallmarks.

Two more for the record. **Negation:** adding `X ⊨ ∼φ iff X ⊭ φ` explodes the logic into **team logic** ≡ full second-order logic; the dual de Morgan negation keeps expressive power but is nearly contentless, and consequently `x ≠ x & y ≠ y` and `¬=(x,y)` are **equivalent formulas with non-equivalent negations** — i.e. **substitution of equivalents fails** (form **B6**, verified INVALID, CM `te=T, fe=F`; Burgess's IF pair with `[χ]=[θ]` but `[∼χ] ∩ [∼θ] = ∅` is the same phenomenon). **Truth definability:** dependence logic defines its own truth predicate over models of PA *without* contradicting Tarski, "because dependence logic is not closed under contradictory negation."

**The IF connection.** Same expressive power on *sentences* — the entry gives the boys-and-girls example in branching, IF, dependence and Σ¹₁ notation and states "any model that satisfies one of these expressions satisfies all four." They diverge on free variables and on how they extend. Architecturally, branching quantifiers and IF logic "do not separate the quantification of variables from the specification of non-standard patterns of dependence"; dependence logic puts the condition on *values*. And **team semantics came from IF logic** — Hodges 1997, giving IF a compositional semantics since Hintikka's GTS is not compositional. In the game semantics, dependence atoms play **no role in winning**; they constrain which strategies count as **uniform**, and `X ⊨ φ` iff player 0 has a *uniform winning strategy* — which is what *explains* the two structural properties (empty team ⟹ vacuously uniform; `X ⊆ Y` ⟹ a uniform winning strategy for `Y` is one for `X`).

#### 4.12c The scandal of deduction — the Lecture 1 provocation, as a valid argument

⚠️ The entry does not use the phrase in body text (it appears twice in the bibliography: D'Agostino; Sequoiah-Grayson 2008). It gives the problem's two halves cleanly. **Containment**, from the inverse range principle: "there is an inverse relationship between the information contained by a proposition and the likelihood of that proposition being true," so **"logical truths have a truth-likelihood of 1, and therefore an information measure of 0."** And its obvious falsity: "Deductions are informative for us precisely because **we are not logically omniscient**."

📌 **The IKEA table is the passage to read aloud (§3.1):**

> "You arrive home from IKEA with an unassembled table that is still flat-packed in its box… You have your table in the sense that you have all of the pieces required to construct it, but this is not to say that you have the table in the sense that you are able to **use** it… you do not possess the information encoded by the conclusion **in any useful form**… **You need also the instructional information that tells you how to combine the information encoded by the premises in the right way.**"

Deduction is "the movement of information from implicit to explicit storage in the mind of the reasoning agent."

**Verified — and this is the right way to teach it:**

| # | Form | Verdict | Rows |
|---|---|---|---|
| **C1** | `c`, `n`, `(c & n) ⊃ ∼s`, `i ⊃ s` ⊨ `∼i` | **VALID** | 4 atoms / 16, exactly **1** satisfying row, and in it `i=F` |
| **C3** | Bar-Hillel–Carnap + Floridi's contingency requirement, given probability 0 | **UNSATISFIABLE**, 0 of 16 | — |
| **C5** | IKEA: `cont`, `poss`, `(poss & instr) ⊃ use`, `use ⊃ know` ⊨ `know` | **INVALID** | 1: `instr=F, use=F, know=F` |
| **C2** | Hintikka's reply | **INVALID** | 1: `q=F, sd=F, i=F` |
| **C7** | logical equivalence ⊨ informational equivalence | **INVALID** | 1: `sametruth=T, sametopic=F` |
| **C6** | Moore sentence + announcement ⊨ `φ` still true | **INVALID**; and the premises **entail `∼apphi`** (verified VALID) | 1: `apphi=F` |

> **The scandal is not a paradox or a confusion — it is a valid argument from plausible premises to a conclusion that is obviously false.** Which means a premise must go, and the whole literature is the fight over which one.

Run the 16-row table on the board in three minutes, get the valid verdict, then ask which premise the class wants to keep: Bar-Hillel & Carnap deny jurisdiction (they called the residue "**psychological information**"); Hintikka denies containment at the *surface* level; Floridi rejects the inverse principle's treatment of the limit cases; the information-as-code tradition denies that information-gain is only elimination of possibilities.

⚠️ **And here is the finding that matters most for PHIL 1115: Hintikka's reply does not cover the material we teach.** The entry states flatly that on his measure "a serious restriction of this approach is that it is only a *fragment* of the deductions carried out within full first-order logic that yield a non-zero information measure. **The rest of the deductions in the full polyadic predicate calculus, as well as all of those in the monadic predicate calculus and propositional calculus, measure 0.**" Every truth-table validity and every Fitch derivation in this course falls in C2's `q=F` region — and you can prove that with a 32-row table. **The response that does cover it is D'Agostino & Floridi 2009**: a hierarchy of propositional logics all decidable in polynomial time, "structured by the increasing computational resources required for the proofs," representing "the increasing levels of informativeness of **propositional** deductive reasoning." Name that in the lecture as the repair.

Also worth having: the **Bar-Hillel–Carnap semantic paradox** is the mirror image. Contradictions have truth-likelihood 0, hence "a maximal information measure of 1." **The course teaches `p & ∼p ⊨ q` on the ground that a contradiction rules out everything; the inverse range principle says that for exactly that reason it is maximally informative; Floridi says it is why it is uninformative. Three verdicts, one fact.**

#### 4.12d Do information-theoretic accounts of `⊨` differ in verdict? The range accounts do not; the code accounts do, at three named places

**Information-as-range agrees with the truth table everywhere.** "φ eliminates every world ψ eliminates" just *is* `[φ] ⊆ [ψ]`, which just *is* `φ ⊨ ψ`. Range accounts re-describe classical consequence; they are "an entirely **static** theory… not with information flow in any way at all." The Bar-Hillel–Carnap paradox is a disagreement about *measure*, not verdict.

**Information-as-code disagrees, and you can show it with a two-atom truth table.** All three are classically **VALID** (verified):

| Form | Structural rule | Informational reading |
|---|---|---|
| `p & ∼p ⊨ q` (0 satisfying rows) | **Weakening** | Fails — you cannot say which information-pieces built `q`. Mares reads `x ⊩ A & ∼A` as *x carries the information that A and not A*: a state can carry inconsistent information without carrying all information |
| `p ⊨ q ⊃ p` | **Weakening** | Fails, same reason: `q` was never used |
| `p ⊃ (p ⊃ q) ⊨ p ⊃ q` | **Contraction** | Fails in linear logic: the two uses of `p` are two expenditures |

📌 **And the framing worth a slide:** "in the presence of all of the structural rules, fusion `⊗` collapses into Boolean conjunction `&`," and "in the presence of Commutation, a double implication pair collapses into single implication." **Your `&` is a fusion that has forgotten which premises it ate, how many times, and in what order.** Gabbay's labelled deductive systems make the point exactly: "if we were to ignore the labels, then we would have classical logic, if we were to accept only the derivations which used *all* of the labelled assumptions, then we would have relevance logic, and if we accepted only the derivations which used the labelled assumptions *exactly once*, then we would have linear logic." **Three consequence relations from one proof system, differing only in a bookkeeping constraint.**

The current research answer is **hyperintensionality** (§5.1): "'3 is prime' and 'the sum of the angles of a triangle is 180 degrees' are logically equivalent… But they should not be always taken to be informationally equivalent. First, they are about different **topics**. Second, an agent might know one and not the other. Third, **the inference might be hard for this agent.**" C7's countermodel names the first. Three formal strategies — impossible worlds plus topics (Yablo, Jago, Berto), truthmaker semantics (Fine, Fine & Jago), and relevant logic (Mares) — and note that the third is the substructural one again.

⚠️ **Three honest limitations of this whole propositionalisation**, applying to the metatheoretic forms (A5, A6, A7, B4, C1, C2) more than the object-level ones (A1, A3, B1, B2, C5, C6, C7): forms whose atoms name *theorems* are diagnostics of argumentative shape, not derivations — they correctly identify enthymemes and equivocations, and verify nothing. **Nothing here encodes `Cn`**: membership in a deductive closure is not a truth function of its members, so no belief-set form can enforce logical closure — the single most consequential AGM assumption. And nothing encodes quantification over teams: TS-∀ duplicates by domain size and TS-∃ supplements by a choice function, both inherently second-order and out of reach.

---

## 5. PARADOXES, REASONING, AND HISTORICAL ARGUMENT FORMS

*SEP: Curry's paradox · liar paradox · epistemic paradoxes · Fitch's paradox · insolubles · future contingents · abduction · analogy · argument and argumentation · fallacies · logic: informal · logic: non-monotonic.*

### 5.1 Curry's paradox — the strongest single candidate in the sweep

| ID | Form | Verdict |
|---|---|---|
| CLI-501 | `p ≡ (p⊃q) ⊢ q` | **VALID** (premise true on 1 of 4 rows) |
| CLI-502 | `⊢ (p ≡ (p⊃q)) ⊃ q` | TAUT |
| CLI-503 | `⊢ (p ≡ (p⊃q)) ≡ (p & q)` | **TAUT** — the Curry biconditional is truth-functionally `p & q` |
| CLI-504 | `p ≡ (p⊃q) ⊢ p` | VALID — the premise proves its own antecedent too |
| CLI-505 | `p ⊃ (p⊃q), (p⊃q) ⊃ p ⊢ q` | VALID — pure `{⊃}` fragment, not one other connective appears |
| CLI-506 | `p ⊃ (p⊃q) ⊢ q` | **INVALID**, p=F,q=F — left half alone is harmless |
| CLI-507 | `(p⊃q) ⊃ p ⊢ q` | **INVALID**, p=T,q=F — right half alone is harmless |
| CLI-508 | `⊢ (p⊃(p⊃q)) ⊃ (p⊃q)` | TAUT — **contraction**, the theorem they used without noticing |
| CLI-509 | `{p ≡ (p ⊃ (r & ∼r))}` | **UNSAT** — Curry at `q := ⊥`, i.e. "if this sentence is true then 1 = 0" |
| CLI-510 | `⊢ (d ≡ (∼d∨q)) ≡ (d ≡ (d⊃q))` | TAUT — SEP's **DLiar** *is* the Curry sentence under `⊃` |

**The derivation, `p ≡ (p⊃q) ⊢ND q`:**

```
 1 │ p ≡ (p ⊃ q)          Premise
 2 │ ┌ p                  Assumption
 3 │ │ p ⊃ q              ≡E, 1, 2
 4 │ │ q                  ⊃E, 3, 2
 5 │ └ p ⊃ q              ⊃I, 2–4
 6 │ p                    ≡E, 1, 5
 7 │ q                    ⊃E, 5, 6
```

Seven lines, one subproof. **Rule inventory: `≡E` ×2, `⊃I` ×1, `⊃E` ×2. That is the entire list — no `∼I`, no `∼E`, no `⊥I`, and not a single negation symbol anywhere.** Which is why Curry "doesn't essentially involve the notion of negation": it survives intuitionistically, minimally, and in every paraconsistent logic keeping modus ponens and conditional proof.

**Where contraction hides — and the classroom exercise that exposes it.** Line 2 is cited **twice**, at line 3 and at line 4. The subproof genuinely establishes `p, p ⊢ q`; `⊃I` at line 5 discharges *both* occurrences with a single antecedent, silently converting `p, p ⊢ q` into `⊢ p ⊃ q`. That collapse is structural contraction. So: **ask students to count how many times line 2 is cited.** Then announce the affine restriction — every assumption may be cited at most once — and ask them to redo the proof. They can't: without contraction, discharging `p` used twice gives only `p ⊃ (p⊃q)`, which by CLI-506 entails nothing. *One counting exercise buys the entire substructural moral.*

**The classical surprise, and the honest accounting.** `p ≡ (p⊃q)` is truth-functionally `p & q` (CLI-503), with exactly one T row. So classically the Curry premise is **satisfiable** — flatly unlike the Liar's `{p ≡ ∼p}`, which is not. Classical propositional logic finds nothing wrong with a Curry sentence; it reads it as "p and q, both." Say this out loud, because it locates the paradox: the sequent is an ordinary valid argument with a contingent premise, and the catastrophe arrives only when a *theory* — naive truth with transparency, or naive comprehension — **proves** that biconditional as a theorem for arbitrary q. The Liar gives you a contradiction; **Curry gives you everything**, which is worse, and it gets there without negation, so paraconsistency is no defence.

**Recommended sequence — it is the rare form that runs cleanly through all three of the course's methods**, which is exactly the "one form, three methods" template the first inventory's §7 asks for:

1. **Table.** Four rows. Compute `p⊃q`, then `p ≡ (p⊃q)`, find the single T row, read off both `q` and `p`. Then recognise the column: it is `p & q`.
2. **Tree.** From `p ≡ (p⊃q)`, `∼q`. Short, closes on both branches; the `≡` rule's branching makes the two halves visible.
3. **ND.** The seven lines above, then the assumption-counting exercise.
4. **Variant drill.** CLI-505 in the pure `{⊃}` fragment; then hand them CLI-506 and CLI-507 separately and ask for countermodels. Each half is innocent; together they trivialise.
5. **Payoff.** CLI-508: "here is the theorem you just used without noticing."

**Fit with existing material.** It slots beside PS5.7's Peirce bonus and PS5's `{p ≡ ∼p}`, and it is the natural *sequel* to PS9's Barber: the Barber teaches "biconditional + self-application ⟹ ⊥ by pure reductio"; Curry teaches "biconditional + self-application ⟹ *anything you like*, without reductio at all." The PS9 solutions already note the Barber proof survives intuitionistically because it uses no LEM and no `∼E`. Curry goes one better: no negation whatsoever.

📌 **And the decomposition, added from the combinatory sweep (§2.17b) — this is the form to build the lecture on.** Contraction alone does *not* produce Curry's paradox. Verified: `c ⊃ (c ⊃ p)`, the W axiom itself as an explicit premise, and `p ⊃ q` ⊨ `q` is **INVALID**, open at `c=F` — the Curry sentence is simply false, no paradox. Replace the W axiom with the *other* half of the biconditional, `(c ⊃ p) ⊃ c`, and it is **VALID**. Separately: `c ⊃ (c ⊃ p) ⊭ p` (CM `c=F, p=F`), `(c ⊃ p) ⊃ c ⊭ p` (CM `c=T, p=F`), but `(c ⊃ p) ⊃ c ⊨ c` by **Peirce**. So **the second half gives you the *sentence*, the first half gives you the *conditional*, and only together do they give you `p`** — each alone is refutable by tree. Note too that the Curry premise `c ≡ (c ⊃ p)` is **SATISFIABLE** (uniquely, `c=T, p=T`), which is exactly what makes Curry worse than the Liar, whose premise `c ≡ ∼c` is UNSAT; and that `c ≡ (c ⊃ p) ⊭ q` (CM `c=T, p=T, q=F`) — **Curry does not give you everything, it gives you *that* `p`**, the one the sentence names.

**Escape routes**, name only: *strongly contraction-free* (reject structural contraction — linear/affine, some relevant logics); *weakly contraction-free* (keep MP, drop conditional proof); *detachment-free* (drop MP, keep contraction). Each blocks a different line of the seven — 5, 4/7, and 5 respectively.

### 5.2 Liar family, and the parity result

| ID | Form | Verdict |
|---|---|---|
| CLI-511 | `{p ≡ ∼p}` | **UNSAT** — already in the course |
| CLI-512 | `{t ≡ l, l ≡ ∼t}` | **UNSAT** (0 of 4) — SEP's Max-and-Agnes liar cycle |
| CLI-513 | `{p ≡ ∼q, q ≡ ∼p}` | **SAT** (2 of 4) — even-length cycle |
| CLI-514 | `{a ≡ ∼b, b ≡ ∼c, c ≡ ∼a}` | **UNSAT** (0 of 8) — odd-length cycle |
| CLI-515 | `{p ≡ p}` | **SAT both ways** — the truth-teller |
| CLI-516 | `{v ≡ ∼v}` | UNSAT — **V-Curry / Albert of Saxony** |

The course already has the whole propositional content of the core Liar, so the mineable material is the **variants**. The best is the **parity result**: two-cycle unsat, even-cycle sat, odd-cycle unsat — three small tables students can discover themselves, delivering the moral that **circularity, not self-reference, is what matters**. No sentence in CLI-512 refers to itself.

The **truth-teller** is the perfect foil: a theorem, satisfiable both ways, and therefore useless — pathology by *under*-determination rather than over-determination. Logic is silent, and the silence is the problem.

**V-Curry** is the sharpest single item: an inference with premise "God exists" and conclusion "This inference is invalid" — call it valid and it is invalid, call it invalid and it is valid. Its skeleton is the Liar's, but it is generated with **no connectives whatsoever**, only rules governing validity. Pair it with Curry as the two ends of one argument: Curry shows you can trivialise without negation; V-Curry shows you can trivialise without any connective at all. **Both point at the structural rules.**

⚠️ Two sourcing notes: the truth-teller does **not** appear in SEP *Liar Paradox* as fetched (checked twice) — cite it as standard. And **Yablo's paradox is essentially infinitary**: every finite truncation is satisfiable, which is itself the point. Out of scope, but a good "here is a paradox propositional logic provably cannot reach."

### 5.3 Abduction, fallacies, and the rehabilitation trio

This is the second-most valuable section for the course, because it converts a list of fallacies into a thesis about what validity is and is not.

| ID | Form | Verdict | Name |
|---|---|---|---|
| CLI-521 | `p⊃q, q ⊢ p` | INVALID, unique CM p=F,q=T | Affirming the consequent |
| CLI-522 | `p⊃q, ∼p ⊢ ∼q` | INVALID, unique CM p=F,q=T | Denying the antecedent |
| CLI-523 | `p ∨ q, p ⊢ ∼q` | INVALID, unique CM p=T,q=T | Affirming a disjunct — best single illustration of inclusive `∨` |
| CLI-524 | `∼(p&q), ∼p ⊢ q` | INVALID, unique CM p=F,q=F | Denying a conjunct |
| CLI-525 | `p⊃q ⊢ ∼p⊃∼q` | INVALID, CM p=F,q=T | **Conditional perfection** (Geis & Zwicky) — the respectable face of CLI-522 |
| CLI-526 | `h⊃e, e ⊢ h` | INVALID | Abduction / IBE skeleton |
| CLI-527 | `h₁⊃e, h₂⊃e, e ⊢ h₁` | INVALID (2 CMs of 8) | IBE with a rival hypothesis in play |
| CLI-528 | `h₁∨h₂∨h₃∨h₄, ∼h₂, ∼h₃ ⊢ h₁` | INVALID, **1 CM of 16** | **van Fraassen's bad lot** |
| CLI-529 | `h ≡ e, e ⊢ h` | **VALID** | Inference to the **only** explanation |
| CLI-530 | `h₁∨h₂∨h₃, ∼h₂, ∼h₃ ⊢ h₁` | **VALID** (1 premise-true row) | Eliminative abduction |
| CLI-531 | `p ≡ q, ∼p ⊢ ∼q` | **VALID** | Conditional perfection: DA repaired |
| CLI-532 | `p⊃q, q⊃p, ∼p ⊢ ∼q` | **VALID** | DA with the invited converse made explicit (Burke 1994) |
| CLI-533 | `Ps, Qs, Pt, (Ps⊃Qs) ≡ (Pt⊃Qt) ⊢ Qt` | **VALID** (1 premise-true row of 16) | Analogy + Davies & Russell's **determination rule** |
| CLI-534 | `a⊃b, b⊃c, c⊃d, d⊃e, ∼e ⊢ ∼a` | **VALID** (1 premise-true row of 32) | Slippery slope, MT form — largest honest tree here |
| CLI-535 | `b⊃f, b, pen ⊢ f` | **VALID** | Monotonicity: Tweety survives learning he is a penguin |
| CLI-536 | `p⊃r ⊢ (p&q)⊃r` | **VALID** (6 of 8) | Strengthening the antecedent — fails for defeasible conditionals (KLM) |
| CLI-537 | `p ⊢ p` | VALID | Begging the question: valid, sound, worthless |

**Affirming the consequent *is* abduction.** SEP *Informal Logic* says it outright: abductive arguments "appear to be instances of the deductive fallacy 'affirming the consequent'" yet "play an important role in medical, scientific and legal inquiry." Peirce's own schema is literally an AC: *"The surprising fact, C, is observed. But if A were true, C would be a matter of course. Hence, there is reason to suspect that A is true."* The teaching sequence writes itself: **CLI-526** (bare AC) → **CLI-527** (a rival makes the countermodel concrete) → **CLI-529** (uniqueness makes it valid) → **CLI-530 / CLI-528** (eliminative abduction is valid; adding one unconsidered `h₄` destroys it — *that is van Fraassen's bad lot, made visible in a single truth-table row*). The moral: **abduction's missing premise is always an exhaustiveness claim**, and the tree that fails shows exactly which one.

**Denying the antecedent is conditional perfection.** Burke's argument is that ordinary DA-shaped arguments are enthymemes whose speakers assert `p ≡ q` and merely *say* `p ⊃ q`. CLI-531/532 verify the repair. The pivot for Lecture 1 is SEP *Argument* §4.3, reporting Bayesian work (Hahn & Oaksford; Eva & Hartmann) that "deductively invalid argument schemes (such as affirming the consequent and denying the antecedent) can also provide considerable support for a conclusion, depending on the contents in question." **Validity is a property of form; support can be a property of content.**

**Defeasible inference: Tweety.** The classical rendering is a *valid* modus ponens, and CLI-535 verifies the embarrassing part — adding "penguin" changes nothing, because `⊨` is monotone. Classical logic cannot express "birds *usually* fly" at all. **CLI-111** (§1, rank 10) shows the standard fix — smuggle the exception into the antecedent as `(b & ∼ab) ⊃ f` — and it *breaks* modus ponens: the countermodel is McCarthy's qualification problem in three atoms. The best two-slide argument for why non-monotonic logics exist.

**Slippery slope: the tree closes; the argument is still bad; therefore validity is not goodness.** CLI-534's skeleton is a valid chain. SEP locates the defect precisely — "the reason why it is a fallacy lies in the second and third causal claims" — and what the rendering loses is that each link is only *probable* (probability does not chain) and that the "beard" and "heap" versions have unimpeachable links and an absurd conclusion.

**What the propositional skeletons lose**, stated so it can be said in class rather than discovered by a confused student:

- **Undistributed middle** — invalid for the right reason, but atoms cannot carry distribution, so the diagnosis "the middle is undistributed" is *unavailable inside the propositional language*.
- **Equivocation** — the whole point is that two occurrences look like one term and are two. The formalisation is only possible once you have already detected the equivocation; the logic certifies the gap but never finds it. **The cleanest illustration in the sweep of the substitution assumption doing invisible work.**
- **False dilemma** — `∼p ⊢ q` is invalid; supply `p ∨ q` and it is disjunctive syllogism, valid. The fallacy lives *entirely* in premise acceptability, never in form. Pair it with CLI-528: same defect — a disjunction asserted as exhaustive when it isn't — one in politics, one in philosophy of science.
- **Ad hominem and composition** — genuinely not-a-validity-question. Their value is negative: they show where the course's tools stop.
- **Analogy** — SEP: "The argument form is ampliative; the conclusion is not guaranteed to follow"; "To search for a simple rule of analogical inference thus appears futile." CLI-533 is the interesting one: valid on exactly one of sixteen rows, and students can *feel* how much knowledge that fourth premise hides.

⚠️ Three attribution cautions from a targeted grep: **"conditional perfection" occurs zero times** across the six fetched entries (the support is Burke's citation plus the Bayesian passage); **"false dilemma"/"false dichotomy" occur zero times**; and *Fallacies* names only Copi's five, not affirming a disjunct, denying a conjunct, or improper transposition. Cite those as standard textbook forms, not to SEP.

### 5.4 Epistemic paradoxes — the most instructive *negative* result in the sweep

| ID | Form | Verdict |
|---|---|---|
| CLI-541 | `{l₁, l₂, l₃, ∼(l₁&l₂&l₃)}` | **UNSAT** — lottery at the object level |
| CLI-542 | `{b₁, b₂, b₃, b_N}` (each belief a fresh atom) | **SAT** (1 of 16) — lottery at the belief level |
| CLI-543 | `{b₁,b₂,b₃, (b₁&b₂&b₃)⊃b_C, b_N, b_C⊃∼b_N}` | **UNSAT** (0 of 32) — with agglomeration written in |
| CLI-544 | `{p & ∼b}` sat; `{p & ∼b, p⊃b}` unsat | Moore's paradox |
| CLI-545 | `{a, a⊃(b&c), c⊃∼b}` | **UNSAT** (0 of 8) — Fitch lines 4–7 |
| CLI-546 | `a⊃(b&c), c⊃∼b ⊢ ∼a` | **VALID** — the same, as a sequent |
| CLI-547 | `{e₁∨e₂, ∼(e₁&e₂), ∼(e₁&k₁), ∼(e₂&k₂)}` | **SAT** (4 of 16) — the surprise-exam announcement *alone* |
| CLI-548 | CLI-547 plus `∼e₁⊃k₂`, `e₁⊃k₁` | **UNSAT** (0 of 16) — the full two-day induction |

**Lottery and preface deserve an explicit slide, and the lesson is that they are not propositional invalidities.** At the object level the lottery set is unsatisfiable and trivially so. Prefix every conjunct with B and it becomes **satisfiable** — to propositional logic those are n+1 unrelated atoms. The appearance of contradiction depends wholly on **agglomeration**, `(Bp & Bq) ⊃ B(p&q)`, which is not a logical truth and which Kyburg and Makinson both propose to abandon. Add it explicitly and inconsistency returns. The pedagogical move — *formalise it and watch the paradox disappear; now find the premise you were smuggling in* — is more valuable than any derivation, and it teaches the difference between logical form and epistemic principle better than a lecture could. Lottery and preface differ only in provenance, which is why refusing the probabilistic acceptance rule saves nothing.

**Fitch is assignable in part.** The full derivation needs `◇`, `□`, `K` and necessitation (a rule about theoremhood, with no propositional shadow at all). But lines 4–7 are fully propositional once you name `a := K(p & ∼Kp)`, `b := Kp`, `c := K∼Kp`: CLI-546 is a perfectly good ND exercise using `⊃E`, `&E`, `⊥I`, `∼I`. **Assign it, then reveal what a, b, c abbreviate.** What survives full operator-stripping is `p & ∼k`, satisfiable and utterly ordinary — the honest statement of where propositional logic stops.

**Surprise examination has better propositional mileage than expected.** The announcement *by itself* is satisfiable on 4 of 16 rows; the announcement plus the student's assumption that she *knows* it and can reason from it is unsatisfiable. That pair is **Quine's thesis rendered checkable**. Assign CLI-547 first (find a model), then CLI-548 (show none exists), then ask which premise to blame.

### 5.5 Future contingents — the scope fallacy

| ID | Form | Verdict |
|---|---|---|
| CLI-551 | `⊢ s ∨ ∼s` | TAUT |
| CLI-552 | `s ∨ ∼s ⊢ nₛ ∨ n∼ₛ` | **INVALID** (2 CMs of 8) — §1 rank 16 |
| CLI-553 | `s⊃nₛ, ∼s⊃n∼ₛ ⊢ nₛ ∨ n∼ₛ` | **VALID** (4 of 8 premise-true) |

The fallacy in one line: "either there will be a battle or there won't" does **not** give "either it's settled that there will be or settled that there won't." Add the necessity-of-the-past bridges and it *is* valid — which localises the whole dispute onto premises the fatalist must independently defend.

**On bivalence versus excluded middle** — worth a careful table, since the syllabus already promises students they will "say why classical logic makes the choices it does: about whether every sentence must be true or false." `p ∨ ∼p` is a formula of the object language and is valid; bivalence is a *metalinguistic* claim about the valuation function. Classically they travel together because every valuation is total. **Supervaluationism prises them apart** — `s ∨ ∼s` is true on every precisification, hence supertrue, while neither disjunct is. **Łukasiewicz breaks the other way** — if `F(x)q` is undetermined then `F(x)q ∨ F(x)∼q` is undetermined too, so excluded middle fails *because* bivalence does. Two rival ways to reject bivalence, with opposite verdicts on LEM, and no new formal apparatus needed.

### 5.6 Insolubles

Thin on new forms, rich on provenance. Buridan's "No proposition is negative" is consequentia mirabilis `p ⊃ ∼p ⊢ ∼p`, already worked at PS2.8b (table) and PS4.2b (tree) with the ND version quarantined on last year's exam — so the value here is **historical framing for a form already taught**, not a new item. The genuinely new offering is V-Curry (CLI-516), covered above.

### 5.7 Epistemic logic — the paradox as an artefact of under-individuating your atoms

Atomising `K` costs a great deal and the cost is the same every time: replacing `Kp`, `K(p⊃q)`, `Kq` with three independent atoms destroys the internal structure that makes the epistemic principle valid on a frame class. **Which is exactly why the two-version format is the valuable one** — the bare skeleton is invalid, showing the operator was doing the work, and the version with the bridge principle as an explicit premise is valid, showing precisely what was assumed. `Kp, K(p⊃q) ⊢ Kq` is INVALID; `Kp, Kpq, Kpq ⊃ (Kp ⊃ Kq) ⊢ Kq` is VALID, and the third premise *is* axiom K, visible as a substantive epistemological commitment rather than a logical truth.

**The Red Barn is the best entry here, because the invalidity of the skeleton is the philosophical point** — and SEP says so: "the modal language here does not seem to help resolving this issue."

- `Kbr, Ki ⊢ Kb` is **INVALID**, one countermodel, and *that countermodel is a description of the case*: I know it's a red barn, I know red-barn entails barn, I don't know it's a barn.
- Add closure and the case becomes **inconsistent** — `{Kbr, Ki, Ki⊃(Kbr⊃Kb), ∼Kb}` is UNSAT, 0 of 8. So in the modal rendering something must go.
- Artemov's justification-logic fix is nothing more than **splitting one atom into two**: modal `□B` is one atom, while `u:B` and `[a·v]:B` are two independent atoms, and only the second is derivable. The analogous justification set is **SAT** (1 of 16) where the modal one was UNSAT (0 of 8).

Run the two side by side. The lesson — **a paradox can be an artefact of under-individuating your atoms** — is a logic lesson, not merely an epistemology lesson, and the truth tables prove it.

**The aporetic triad — the best closed-tree exercise in the file.** `⊢ ∼(Kh & ∼Kb & Ki & (Ki ⊃ (Kh ⊃ Kb)))` is a **tautology**, so the tree of its negation closes on every branch. Each conjunct is a position someone actually holds: deny `Kh` and you are the Cartesian sceptic; deny `∼Kb` and you are Moore; deny closure and you are Dretske or Nozick. **The tree doesn't say who is right. It says the menu is exactly four items long** — which is an unusually instructive thing for a tree to do. Contraposed, `Ki, Ki⊃(Kh⊃Kb), ∼Kb ⊢ ∼Kh` is valid: **scepticism is Moore run backwards**, and a clean ND exercise.

**Russell's Prime Minister — the best minimal pair, and a pure `⊃` lesson.** With `w` the wrong reason (Balfour) and `r` the right one (Campbell-Bannerman):

- `w:B, r:B, r:B ⊃ B ⊢ w:B ⊃ B` is **VALID** — "induced factivity," the wrong reason inheriting factivity.
- Drop the factive reason and `w:B, r:B ⊃ B ⊢ w:B ⊃ B` is **INVALID**, countermodel wB=T, rB=F, B=F — which is SEP's own Fitting countermodel recovered as a truth-table row.

The payload is entirely about `⊃`: the conditional comes out true in the first case *only because B is true*, not because `w` is a good reason. **It is the material conditional's failure to express support, dressed in epistemology.** If one entry is wanted to teach why `⊃` is not entailment, this is it, and Russell's example makes it memorable.

**Knowledge/belief collapse — a published theorem, reproduced in four tables.** With k = Kφ, b = Bφ, bk = BKφ: `k⊃b, b⊃bk, bk⊃k ⊢ b ≡ k` is **VALID** — three innocent-looking conditionals collapse knowledge into belief. Delete any one and it is invalid, with an explicit countermodel each time. Those four checks together **verify van der Hoek's 1993 result** that no proper subset suffices. As an exercise: give students the valid version (a nice `≡I` problem), then ask them to find the countermodel for each deletion.

**Moore sentences and the indexing lesson**, as a four-step sequence: `p & ∼Kp` is **consistent**, so whatever is wrong with Moore sentences is not inconsistency; with a *single* index, adding "announcing it makes it known" gives inconsistency; with *two* indices (`Kp1` before the announcement, `Kp2` after) the set is consistent and the alleged self-refutation is **invalid**, countermodel p=T, Kp1=F, Kp2=T. **The standard informal argument equivocates on `Kp`**, and the fix is temporal indexing — which is exactly what dynamic epistemic logic's announcement operator formalises. Students find this genuinely surprising.

**Gettier, dissected.** `(Jd&(b∨f))⊃Kd, Jd, b, ∼f ⊢ Kd` is VALID, and adding `∼Kd` makes the set **UNSAT** (0 of 16) — Gettier's refutation of JTB as a closed tree. But the interesting pair is what happens under deletion: **the falsity of `f` does no logical work** (drop `∼f` and the argument is still valid), while **the truth of `b` does** (drop `b` and it is invalid). That asymmetry is the anatomy of a Gettier case — *the false belief is inert in the derivation and active only in the intuition.*

**Muddy children cashes out completely.** Once "nobody stepped forward" is written as the three negated singletons, round one is pure propositional logic and **VALID**; the tempting shortcut from the father's announcement alone is **INVALID** with three countermodels — one per single-muddy-child world, i.e. exactly the worlds the silence eliminates. What is lost: the step from the silence to those premises needs K, common knowledge of the announcement, and each child seeing the others. Said out loud that is a feature — it shows students precisely where the epistemic content lives.

**Fitch, and an honest correction.** `(p&∼Kp)⊃m, m⊃(Kp&Knk), Knk⊃∼Kp ⊢ p⊃Kp` is **VALID** in 16 rows: knowability plus distribution plus factivity gives omniscience. But two of those premises are **idle** under atomisation — `(p&∼Kp)⊃m, m⊃Kp ⊢ p⊃Kp` is already valid in 8 rows. That is a *symptom of the atomisation*, not a discovery about Fitch: in the real argument you cannot get from `∼K(p&∼Kp)` to `∼◇K(p&∼Kp)` without necessitation. The five-atom version that puts the modal step back as an explicit premise is valid, and dropping that one premise makes it invalid with countermodels in which the knowability principle is satisfied by an actually-unknown truth being *merely possibly* known — precisely the position the paradox is supposed to close off. **That is the honest answer to "what does the modal operator do here?"**

**Also verified and worth knowing:** the **Knower** — `c ≡ ∼Kc, Kc⊃c ⊢ c & ∼Kc` is valid (the Knower sentence plus factivity *entails a Moore sentence*), and adding "we've proved it, so we know it" detonates it (UNSAT, 0 of 4). **Awareness logic** dissolves logical omniscience in eight rows: implicit knowledge does **not** give explicit knowledge (`Ki, Ke ≡ (Ki & Aw) ⊢ Ke` invalid, countermodel Aw=F), while explicit gives implicit. And **Cresswell's hyperintensional paradox** — `p ≡ q, Bp ⊢ Bq` is invalid — makes a truth table into a demonstration of hyperintensionality. SEP's own example is that a proof of `0=0` is not a proof of Fermat's Last Theorem, though the two are equivalent.

⚠️ **Attribution cautions.** The BIV/hands sceptical argument, the surprise examination and the Knower formulation are **reconstructions**, not statements in these three entries. The Red Barn's six numbered lines, Russell's two sets, the KB1–KB3 collapse principles, the modal axiom table, the Moore sentence, Mix and Induction, the announcement reduction axioms and the justification axioms **are** verbatim (atomised, but otherwise the articles' own). The distributed-knowledge friend, muddy children and the Gettier disjunction case are given in prose; the propositional renderings are ours.

### 5.8 Obligationes — a medieval game of propositional consistency

*SEP: obligationes, medieval theories of. The richest single article in the whole sweep for our purposes, and the one nobody would think to look at.*

An obligational disputation *is* a propositional consistency-maintenance game. The Respondent accepts a *positum* — typically false but possible — and must then grant, deny or doubt each proposition put to him according to whether it **follows from**, is **repugnant to**, or is **independent of** what has already been conceded. Every one of those judgements is a truth-table check. Fix `p` = "you are in Rome", `q` = "you are a bishop", both false in fact.

#### Burley's engine, and it is the paradox of material implication

| Step | Verdict |
|---|---|
| `p, ∼p∨q ⊢ q` | **VALID** — the whole engine in one step |
| `p ⊬ ∼p∨q` and `p ⊬ ∼(∼p∨q)` | **both non-entailments** — together these *are* Burley's definition of *impertinens*. **Impertinence is a pair of countermodels.** |
| `∼p ⊢ p ⊃ q` | **VALID** — "Burley's useful rule" |

That last row is the diagnosis. **Because the positum is false in fact, every conditional with it as antecedent is an impertinent truth** — hence grantable, hence detachable. The engine that lets a medieval Respondent be walked from "you are in Rome" to any falsehood you like is *exactly* the paradox of material implication the course teaches in Lecture 3.

#### Order-dependence, and a true proposition that must be denied

The same three propositions, two orders:

| | Order A | Order B |
|---|---|---|
| positum | `p` — GRANT | `p` — GRANT |
| next | `∼p∨q` — **GRANT** (impertinent, true in fact) | `∼q` — DENY (impertinent, false in fact) |
| next | `q` — GRANT (now follows) | `∼p∨q` — **DENY** (now repugnant) |

`∼p ∨ q` is **true in fact**, and in Order B the Respondent must deny it — verified: `∼p, ∼q ⊢ ∼p∨q` is VALID, and `p, ∼q ⊢ ∼(∼p∨q)` is VALID. Burley's own gloss covers it: *"one must pay special attention to the order"*; *"something that is irrelevant at the first step might not be so anymore later."*

**A machine-enumerated order scan** over the proposatum set `{∼p∨q, ∼q∨r, r}` with positum `p`, across all six orderings, under the three historical rule-sets:

| Rule-set | Distinct response profiles | Answer-set consistent? |
|---|---|---|
| **Burley** (relevance judged against positum *plus all prior answers*) | **3** | always yes |
| **Swyneshed** (relevance judged against the positum *alone*) | **1** | **never** |
| **Kilvington** (read off the single row where the positum is true) | **1** | always yes |

That is a clean numerical statement of the fourteenth-century dispute: **Burley buys consistency at the price of order-dependence; Swyneshed buys order-independence at the price of consistency; Kilvington gets both, at the price of denying actual truths and abandoning consequence-tracking altogether** — which is why, as SEP notes, his approach was not followed.

And a contrast worth having for a course that teaches `⊨` and `⊢` side by side: **Kilvington's respondent is literally reading off one row of a truth table; Burley's is computing consequence from an accumulating set.** Same distinction, medieval dress.

#### The minimally inconsistent quadruple

`{p, ∼p∨q, ∼q∨r, ∼p∨∼r}` — **UNSAT**, and every one of the four three-element subsets is **SAT** (verified individually). Each non-positum member is impertinent to `p` alone, and each is **true in fact**.

This is the cleanest possible statement of why Burley needs his later rules: **impertinence is not closed under conjunction.** As a standalone exercise it is excellent — three atoms, eight rows, nested disjunctions, and the answer surprises.

Swyneshed's own structural anomalies reproduce too, and SEP states both: **"grant a disjunction but deny both of its parts"** (grant `∼p∨q`, deny `∼p` as repugnant, deny `q` as false in fact), and **a conjunction denied despite both conjuncts being granted** (grant `∼p∨q` and `∼p∨∼q`, then deny their conjunction, which is `∼p`). The resulting triad `{p, ∼p∨q, ∼q}` is **UNSAT** while every pair from it is satisfiable.

#### Kilvington's objection, and where the two systems part company

Kilvington's case is a proposition that says two *sentences* are alike in truth value. Both are false, so it is true, so Burley must grant it — and then `q` follows. Three readings, and they diverge exactly where SEP says:

| Reading | Verdict |
|---|---|
| Burley, **use** reading `p ≡ q` | `p, p≡q ⊢ q` **VALID** |
| Burley, **mention** reading (fresh atom `s`) | `p, s ⊢ q` **INVALID**, 1 CM |
| bridge supplied: `p, s, s ≡ (p≡q) ⊢ q` | **VALID** |

**So the disagreement is precisely about one premise.** SEP: Kilvington *"rejects what is nowadays called Tarskian biconditionals… inferring that you are in Rome from the claim that the sentence 'you are in Rome' is true is valid only if 'you are in Rome' means that you are in Rome."*

And a scan comparing every candidate impertinent truth on the actual row (Burley's test) against the positum row (Kilvington's) gives an exact rule worth stating to students: **Burley and Kilvington agree on every impertinent truth that does not contain the positum's atom, and disagree on every one that does.** That is why Burley's engine runs entirely on conditionals with the positum as antecedent, and why Kilvington's fix works.

The same manoeuvre recurs on the Liar. Swyneshed holds that in some cases both contradictories are false — classically unavailable, since `⊢ λ ∨ ∼λ` has zero countermodels. But `{∼λ, ∼f}`, with `f` = "⌜λ⌝ is false" as a *separate* atom, **is satisfiable**. **Drop the disquotation bridge and the "contradictories" stop being contradictories** — the same fix as Kilvington's, and SEP connects them itself.

### 5.9 Self-reference — the fixed-point spectrum, and the three definability families

*SEP: self-reference · Russell's paradox · paradoxes and contemporary logic. Complements §5.1–5.2, which covered Curry and the Liar.*

#### The honest headline on diagonalization

**There is a propositional shadow of diagonalization that is more than the bare `{p ≡ ∼p}` — but it is a shadow of the fixed-point *demand*, not of the *lemma*.** The diagonal lemma is an **existence claim**: for every φ there *is* a ψ with `⊢ ψ ≡ φ⟨ψ⟩`. Propositional logic can neither state nor prove that; it has no coding and no substitution. What it *can* answer, completely and finitely, is the follow-on question: **given that a fixed point exists, which φ make it explode?**

#### The fixed-point spectrum — the main find

Unary, all four truth functions, verified: `p ≡ ⊤` forces `p` true; `p ≡ ⊥` forces it false; `p ≡ p` (the truth-teller) is satisfiable **both ways** — undetermined; and `p ≡ ∼p` is **UNSAT**. **Exactly one of the four has no fixed point, and it is negation.** Grounded and ungrounded come out as the other three cases.

Binary, all **sixteen**, verified — this is the page-sized exercise:

| Class | φ | Result |
|---|---|---|
| **Explosive** (1 of 16) | `∼p` | **UNSAT** — the Liar, and the only unsatisfiable case |
| **Forces `q`** (3) | `p ⊃ q` · `p ≡ q` · `∼(p ∨ q)` | Curry |
| **Forces `∼q`** (3) | `∼(p ≡ q)` · `∼(p & q)` · `∼p & q` | |
| **Inert** (9) | `p`, `q`, `∼q`, `⊤`, `⊥`, `p&q`, `p&∼q`, `p∨q`, `q⊃p` | SAT, `q` free |

**One in sixteen contradictory, six Curry-like, nine harmless — and which is computable.** That kills "self-reference is dangerous" as a general claim and replaces it with an exact map. Two atoms, four rows, sixteen tables, one problem-set page.

Two of the six are better than the `p ≡ (p⊃q)` already in §5.1:

- **`p ≡ (p ≡ q) ⊢ q`** — **VALID**, on **2** premise-satisfying rows rather than 1. **Curry's conclusion with no conditional anywhere in the premise**, and since `≡` is primitive in our notation it is a clean Fitch exercise using only `≡I`/`≡E`.
- **`p ≡ ∼(p ∨ q) ⊢ q`** — **VALID**. A Curry whose fixed point is *false* and which still yields `q`. Good for killing the misreading "Curry works because the Curry sentence is true."

#### T269 — Russell, Cantor and Grelling are one theorem

`⊢ ∼∃y∀x(Fxy ≡ ∼Fxx)`. **Verified VALID** by exhaustive search over **66,066 interpretations** — every binary `F` on domains of size 1–4 — with **zero models of the existential**.

SEP gives the unifying chain: Grelling's `het ∈ ext(het) ⇔ het ∉ ext(het)`; Russell's `R ∈ R ⇔ R ∉ R`; Cantor's `c ∈ f(c) ⇔ c ∉ f(c)`. And its verdict: "Cantor's paradox is nothing more than a slight variant of Russell's paradox; the core argument leading to the contradiction is the same in both." The heterological paradox *is* Russell's with membership replaced by satisfaction.

**And it is a ten-line Fitch derivation** needing only `∃E`, `∀E`, `≡E`, `∼I`, `⊥I` — with an outer `∼I` making it a premise-free theorem in eleven. **That converts "the paradox of naive set theory" into a routine ND problem**, and it is the single most valuable item this batch turned up.

⚠️ **What the propositional residue loses.** `r ≡ ∼r ⊢ ⊥` is the shadow, and what vanishes is the **forcing**: propositionally the biconditional is a premise someone hands you, whereas in T269 it comes from **universally instantiating comprehension at the diagonal object**. The self-application step — the thing that makes it diagonalization rather than stipulation — lives entirely in `∀E`. That is exactly why the propositional Liar looks like a linguistic curiosity and the first-order version looks like a limitation theorem.

#### The Barber versus naive comprehension, made precise

The difference is **not** in the logical status of the paradoxical sentence — both are T269 instances, both logically false. There are two genuine differences and they should be separated:

**Dialectical**, and Quine's version is worth quoting: "there has been in our habits of thought an overwhelming presumption of there being such a class but no presumption of there being such a barber." Formally: *the same derivation, differing only in whether line 1 is an Assumption you may discharge or an Axiom you may not.* With the Barber you keep the `∼I` and read the discharged conclusion as "no such barber exists." With comprehension you cannot discharge, so the theory itself proves `⊥`. SEP states the theorem side directly: "**Any theory containing the unrestricted comprehension principle is inconsistent.**"

**Formal, and this is the better lecture point** — because the Barber is standardly stated *with a guard*. Verified:

| Form | Verdict |
|---|---|
| `∃y∀x(Fxy ≡ ∼Fxx)` — unguarded | **UNSAT**, 66,066 interpretations |
| `∃y∀x(Gx ⊃ (Fxy ≡ ∼Fxx))` — guarded | **SATISFIABLE** — witness D={0,1}, F={⟨1,1⟩}, G={1}, y=0: villager 1 shaves himself, the barber is an outsider and shaves nobody |
| `∃y(Gy & ∀x(Gx ⊃ (Fxy ≡ ∼Fxx)))` — guarded, and the barber *is* a villager | **UNSAT** |

**Guarded-and-escapable versus unguarded** — three lines of verified output, and it is the honest contrast. Naive comprehension has **no guard to escape through**: the Russell class is a set by the very schema that defines it. (Recorded pushback: Salmon and Kripke hold Quine's answer is not illuminating — "the question raised by T269 is not what barbers or Gods there are, but rather what non-paradoxical objects there are.")

**And the propositional miniature is a four-row warm-up**: `b ≡ ∼b` UNSAT; `v ⊃ (b ≡ ∼b)` **SAT**; `v & (v ⊃ (b ≡ ∼b))` UNSAT, where `v` is "the barber is a villager" / "R is a set." *The whole untyped-repair strategy is `∼v`* — though propositionally you must **assume** `∼v`, where ZF and NBG **prove** it.

#### The repairs, as "which premise is dropped"

| Repair | Premise dropped | Kind |
|---|---|---|
| Simple / ramified type theory | **the well-formedness of `x ∈ x`** — a language restriction, not a premise | refuse to form the instance |
| Quine's NF | that *every* formula may appear in comprehension — only **stratified** ones may | refuse to form the instance |
| Bochvar's three-valued theory | that φ may contain *external* connectives | refuse to form the instance |
| **ZF Separation** | the unrestricted `∃y` — sets are only *carved out of* given sets | **restrict the range** |
| **NBG** | that everything can be a member; R is a proper class | **restrict the range** |
| Ackermann | that every class is a set | **restrict the range** |
| Paraconsistent | EFQ, and then also Contraction | change the consequence relation |
| Non-contractive (Fitch 1936) | **Contraction only** — Fitch traced it to the duplicator combinator | change the consequence relation |

**The taxonomy for a slide: the eight repairs fall into exactly two kinds** (plus paraconsistency as an orthogonal third), and the first kind **is the same move as "the barber is not a villager"** — verified above as the difference between the unguarded and guarded forms. That unifies the untyped set-theoretic repairs with the pseudo-paradox already on PS9.

Zermelo separation is verified on both sides: the separation instance `∀z∃y∀x(Fxy ≡ (Fxz & ∼Fxx))` is **SATISFIABLE**, and the relativized theorem `∀z∀y(∀x[Fxy ≡ (Fxz & ∼Fxx)] ⊃ ∼Fyz)` is **VALID** over the same 66,066 interpretations. **Unrestricted comprehension is logically false; separation is logically consistent and provably forces the Russell subset out of the set it was carved from.** Two formulas, the whole ZF story.

**One escape route that does not work, and students propose it constantly.** SEP: "it is possible to formulate the paradox without appealing to Excluded Middle by relying instead upon the Law of Non-contradiction." Every step verified tautologous: `∼(p&∼p)`; `(p≡∼p) ⊃ (p ⊃ (p&∼p))`; `(p⊃(p&∼p)) ⊃ ∼p`; `(p≡∼p) ⊃ (∼p ⊃ p)`. **Rejecting excluded middle does not save naive comprehension** — and it is a nice Fitch exercise in reductio *without* double-negation elimination.

#### The three definability families

| Family | Members | Engine | Verified form | Needs |
|---|---|---|---|---|
| **Least-element** | Berry, König | well-ordering + "the least F is not F" | see below | monadic `D` + a binary order |
| **Diagonal** | Richard, Cantor | construct an object differing from every listed one | UNSAT over 267,460 interpretations | monadic + unary function + identity |
| **Self-application** | Russell, Grelling | T269 | UNSAT over 66,066 | a **dyadic** predicate |

**Berry, verified, and it yields a result worth a lecture slot.** With `LO` a linear order, `NONEMPTY` = `∃x∼Dx`, `LEAST` the least-number principle and `BERRY` the paradoxical premise:

| Premise set | Verdict |
|---|---|
| all four | **UNSAT** |
| drop `BERRY` | **SAT** |
| **drop `LEAST`** | **UNSAT in every finite model** — but **SATISFIABLE**, over `⟨ℤ, ≤⟩` with `D` empty, since `BERRY`'s antecedent then requires an integer below every integer |

So `{LO, NONEMPTY, BERRY}` is a **satisfiable set with no finite model**, arising naturally out of Berry's paradox. Three uses: it shows students that "no countermodel of size ≤ *n*" is **not** the same as "unsatisfiable"; it is a natural example of an infinite open tree branch; and it isolates exactly what the paradox borrows from ℕ — **the well-ordering premise, and nothing else.** Finite-model methods are blind to precisely the premise doing the philosophical work.

⚠️ **And the honest negative: skip the propositional versions of Berry, König and Richard.** Name the least non-definable number and you get `{∼d, d}` — a bare contradiction with zero structure. What is lost is the least-number principle and the counting argument, neither expressible without quantifiers. Use the first-order forms.

#### Ramsey's division — the best lecture item here

Ramsey's split: **logical** contradictions (Russell, Burali-Forti) involve mathematical terms and show our logic is problematic; **semantic/epistemological** ones (Liar, Berry, Richard, Grelling) additionally involve "thought," "language," "symbolism," which are "**empirical (not formal) terms**," so they belong to epistemology. Consequence: *simple* type theory suffices for Group I; ramification is not needed. Ramsey's key line: "**The meanings of meaning form an illegitimate totality**" — which SEP says "foreshadow[s] those of Tarski."

A better opener than Ramsey, twenty years earlier: **Peano 1906** — "**Richard's example pertains to linguistics, not to mathematics**" — with the diagnosis that the weak point is the appeal to ordinary language, since "there is no precise criterion for deciding whether a given expression of the natural language represents a rule uniquely defining a number."

**And here is the sharp version, with a verified fact in the middle of it. Ramsey's division cross-cuts logical form.** Grelling (semantic, Group II) and Russell (logical, Group I) are **the same first-order sentence** — both T269 instances, both verified UNSAT over the same 66,066 interpretations. SEP draws the moral itself: "even if paradoxes seem different by involving different subject matters, they might be almost identical in their underlying structure."

So **Ramsey's division is a division by *subject matter*, not by *form*** — and Priest's Inclosure Schema with its Principle of Uniform Solution ("same kind of paradox, same kind of solution") is precisely the denial that the division should carry any weight. A genuine, live, two-sided debate with a computed fact at its centre. (The Inclosure Schema itself quantifies over subsets and is **not** first-order, let alone propositional; and it is contested — Slater, Abad, Badici and Zhong all deny it is necessary and sufficient for paradoxicality.)

#### Yablo — the reason it matters, and who is on which side

SEP states the reason: Yablo's paradox shows "we can have logical paradoxes without self-reference — **only a certain kind of non-wellfoundedness is needed**." All paradoxes of direct or indirect self-reference have **cyclic** reference graphs; Yablo's is isomorphic to `<` on ℕ, which has no cycles. The consequence: **every solution keyed to circularity is aimed at the wrong target** — Russell's Vicious Circle Principle, Tarski's hierarchy, groundedness all diagnose circularity, and if Yablo is right circularity is sufficient but not necessary.

**Neither entry adjudicates.** Yablo says non-self-referential; **Priest 1997** says self-referential; **Butler 2017** says even if Priest is right it does not generalize; Halbach & Zhang give a proof *without* the diagonal lemma, which bears directly on Priest's case since his charge attaches to the fixed-point construction. SEP: "it is still being discussed."

**And the entry supplies the reason for §5.2's finite-truncation result**, as a theorem rather than an accident: "**Any finitary variant of Yablo's sequence — where every sentence only refers to finitely many later sentences — must necessarily be consistent (non-paradoxical) due to the compactness theorem in propositional logic**." Two things follow: the satisfiability of every finite truncation is *provable*, by compactness plus bottom-up valuation along the well-founded finite subgraph; and **essential infinitude has two sources, not one** — infinitely many sentences *and* each referring to infinitely many others. Bound either and consistency returns.

Structural conjecture worth a sentence: "it seems to be a relatively widespread conjecture that **all paradoxical graphs of reference are either cyclic or contain a Yablo-like structure**" — confirmed for some infinite sub-classes, open in general. **If true, there are exactly two paradox shapes.**

#### The Knower — an unclaimed propositional core

Not previously in this file. With `k` = "λ is knowable" and `l` = λ, all verified on 4 rows:

| Form | Verdict |
|---|---|
| `⊢ (k⊃l) ⊃ ((l⊃∼k) ⊃ ∼k)` — SEP's own line 4, labelled "propositional tautology" | **VALID** |
| `{l ≡ ∼k, k⊃l} ⊢ ∼k & l` | **VALID**, 1 premise-true row |
| `{l ≡ ∼k, k⊃l, l⊃k}` | **UNSAT** |
| drop `l⊃k` | **SAT** (`k=F, l=T`) |
| drop `k⊃l` | **SAT** (`k=T, l=F`) |

Three payoffs at once. The second row is the formal counterpart of the striking informal move — *we can prove the knower sentence is true* — with only **factivity**. The last two show cleanly that the paradox needs *both* factivity and internalization, so "which premise is dropped" is answerable in a four-row table. And the first is also the propositional heart of **Löb's theorem**, linking the Knower to §4.8 and §5.1.

⚠️ What is lost is only the *justification* of `l ⊃ k`, which in Montague's proof is the earlier lines with `K` prefixed throughout. Propositionally that entire internalization collapses into a bare premise — **which is the same loss everywhere in this section: propositional logic can hold a fixed point but can never earn one.**

---

### 5.10 Defeasible reasoning, precedent, Simpson, and the Dutch book — where the material conditional does the damage

*SEP: Defeasible Reasoning (Koons) · Precedent and Analogy in Legal Reasoning · Simpson's Paradox · Dutch Book Arguments. Plus Ibn Taymiyya for the one thing not in the legal entry.*

#### 5.10a Rebutting and undercutting, and an asymmetry the entry does not state

Pollock's distinction, verbatim: rebutting defeaters "give one a prima facie reason for believing the denial of the original conclusion"; undercutting defeaters "give one a reason for doubting that the usual relationship between the premises and the conclusion hold **in the given case**." The only way to state that truth-functionally is to **reify the support relation as an atom**: let `S` = "P supports Q in the present circumstances," make the prima facie link `(S & P) ⊃ Q`, and then a rebutter attacks `Q` while an undercutter attacks `S`.

| # | Form | Verdict | Countermodels |
|---|---|---|---|
| **D1** | `P, P⊃Q, R, R⊃∼Q` ⊨ `Q` — *and* ⊨ `∼Q` | **VALID, both** | none; **0 of 8 rows satisfy the premises** |
| D2a | `P, (S&P)⊃Q, U⊃∼S, ∼U` ⊨ `Q` | **INVALID** | 1: `P=T, Q=F, S=F, U=F` |
| D2b | + `S` | **VALID** | — |
| **D2c** | `P, (S&P)⊃Q, U⊃∼S, U` ⊨ `∼Q` | **INVALID** | 1: `Q=T, S=F, U=T` |
| **D2d** | same ⊨ `Q` | **INVALID** | 1: `Q=F, S=F, U=T` |
| **D3a** | `R⊃∼Q, R, P, (S&P)⊃Q` ⊨ `∼S` | **VALID** | — |
| **D3b** | `U⊃∼S, U, P, (S&P)⊃Q` ⊨ `∼Q` | **INVALID** | 1: `Q=T, S=F, U=T` |

**D1 is the headline negative result.** Materialise the prima facie conditional and a rebutted argument does not become *withdrawn* — the premise set becomes **unsatisfiable**, and the argument becomes valid *by explosion*, for `Q` and `∼Q` alike. In a tree every branch closes. **The classical diagnosis of a rebutted defeasible reasoner is "your beliefs are inconsistent," which is precisely the wrong diagnosis: she has not contradicted herself, she has retracted an inference.** Cleanest possible demonstration of why `⊃` cannot be `⇒`, in three atoms.

**D2c and D2d together are the exercise to set.** When the undercutter fires, *neither* `Q` nor `∼Q` follows — two open branches differing only in `Q`. **That pair of branches *is* Pollock's distinction**: undercutting returns you to agnosticism, rebutting pushes you to the denial. Students read it off the tree.

📌 **D3 is a genuine asymmetry worth flagging as a finding.** On the material rendering, **rebutting entails undercutting** (D3a valid — run modus tollens back through the link) **but undercutting does not entail rebutting** (D3b invalid). So `⊃` does not merely blur Pollock's distinction, **it collapses it in one direction only.** That is a sharper criticism of the material conditional than the usual one. And the entry records the mirror-image defect in semantic inheritance networks: they "cannot represent one fact's constituting an undercutting defeater… although they can represent rebutting defeaters." **Networks keep rebutters and lose undercutters; the material conditional keeps undercutters and lets rebutters degenerate into them.**

Vocabulary worth having, from §4.4's three-way refinement: an argument **rebuts** another "when their conclusions are contradictories," **undermines** it "when the conclusion of the first contradicts one of the premises of the second," and **undercuts** it when it gives reason to doubt the premises are reliable indicators here. Undermining is the one the propositional language handles best — it is just `R ⊃ ∼P`.

#### 5.10b The pink elephant — self-defeat as a theorem ★

The entry's example, verbatim: "(1) Robert says that the elephant beside him looks pink. (2) Robert's color vision becomes unreliable in the presence of pink elephants. Ordinarily, belief 1 would support the conclusion that the elephant is pink, but this conclusion undercuts the argument, thanks to belief 2."

Γ = { `L`, `(S & L) ⊃ P`, `P ⊃ U`, `U ⊃ ∼S` }. Verified, 16 rows, 3 satisfy Γ:

| # | Sequent | Verdict | Countermodels |
|---|---|---|---|
| D4a | Γ ⊨ `P` | **INVALID** | 2, both with `P=F, S=F` |
| D4b | Γ ⊨ `∼P` | **INVALID** | 1: `P=T, S=F, U=T` |
| **D4c** | Γ ⊨ `P ⊃ ∼S` | **VALID** | — |
| **D4d** | Γ ∪ {`S`} | **UNSATISFIABLE**, 0 of 16 | — |

📌 **The best form in this batch, and it goes straight into a problem set.** The classical verdict *exactly reproduces the philosophical verdict*: the argument warrants nothing. `P` does not follow, `∼P` does not follow, and all three surviving rows share `S=F`. **Self-defeat is not a stipulation here — it is a theorem**: D4c says the conclusion entails the falsity of its own support, D4d says asserting the evidence together with the support relation is outright inconsistent. Four atoms, real nesting, and the open branches carry the content. Pairs with D2: same shape, but the undercutter is reached *through the conclusion*, which is what makes it self-defeat rather than ordinary defeat.

#### 5.10c "Defeasible validity" and the deduction theorem — i.e. Fitch's `⊃I`

Morgan's impossibility proofs "all turn on the fact that nonmonotonic logics cannot support a generalized deduction theorem, i.e. `Γ ∪ {p} ⊢ q iff Γ ⊢ (p ⇒ q)`… **Morgan is certainly right about this.**" The entry replies that a defeasible system *should* fail it, and offers counterexamples. **Verified: those counterexamples do not survive materialisation, and that is itself the finding.**

| # | Form | Verdict | Countermodel |
|---|---|---|---|
| D5a | `R, (P&R)⊃∼Q` ⊨ `P ⊃ Q` | **INVALID** | `P=T, Q=F, R=T` |
| D5b | + `P` ⊨ `∼Q` | VALID | — |
| D5c | `R, (R&P)⊃Q` ⊨ `P ⊃ Q` | VALID | — |
| D5d | + `P` ⊨ `Q` | VALID | — |

Materially the trap never springs — antecedent and consequent of the biconditional move in lockstep in every case. **The material conditional satisfies the deduction theorem, which is exactly why it cannot be a defeasible conditional.** That is the WHAT IS LOST, and it is unusually crisp: **the failure Morgan proves is a failure of a metatheorem the students prove in week N.**

The entry's qualified yes: a defeasible consequence relation counts as *logical* if it is cumulative (**Cut** + **Cautious Monotony**), **supraclassical**, and satisfies **Full Absorption** and **Distribution** — but it cannot be **Monotonic**. And each desideratum's object-language shadow is a **tautology** (all verified over 8 rows): Lewis's **CV** axiom `(P⊃Q) ⊃ (((P&R)⊃Q) ∨ (P⊃∼R))`; **Distribution** `((Q⊃P)&(R⊃P)) ⊃ ((Q∨R)⊃P)`; **Cautious Monotony** `((G⊃P)&(G⊃Q)) ⊃ ((G&Q)⊃P)`; **Monotonicity** `(G⊃P) ⊃ ((G&D)⊃P)`.

📌 **The pedagogical point writes itself: Cautious Monotony and full Monotonicity are *both* tautologies, so classically they are indistinguishable. The entire subject of nonmonotonic logic lives in the gap between two formulas that our truth tables cannot tell apart.** A good closing line for a lecture. (Note also §5.8: for `⇒` to be a default conditional one must "drop the condition of Centering… we do not want modus ponens to be valid." Our `⊃` has Centering built in.) And note that the Distribution schema is **constructive dilemma** — the rule Simpson's paradox appears to break, §5.10e.

#### 5.10d Precedent — distinguishing cannot be rule-application, and the proof is a closed tree ★

The entry's worked *ratio*: "whenever trust property is transferred in breach of trust to a volunteer… the volunteer must restore the property to the beneficiary." The distinguishing case adds that the recipient "has relied upon the receipt to disadvantageously alter her position." Atoms: `R` received, `B` in breach, `Pd` paid, `E` entitled to retain, `L` relied to her detriment.

| # | Form | Verdict | Countermodels |
|---|---|---|---|
| L1 | `(R&B&∼Pd)⊃∼E, R, B, ∼Pd` ⊨ `∼E` | **VALID** | 4 atoms / 16, 1 satisfying row |
| **L2** ★ | + the later ruling `(R&B&∼Pd&L)⊃E`, plus `L` | **UNSATISFIABLE**, **0 of 32** | — |
| L3 | narrower rule + the precedent's own facts and result | **SATISFIABLE**, 1 of 32 | — |

**L2 is the form to teach.** §2.1.2: "Distinguishing involves a precedent not being followed **even though the facts of the later case fall within the scope of the ratio of the earlier case**." L2 shows what that costs: if the *ratio* is a rule and the later ruling is a rule, and the later facts satisfy both antecedents, **the set is inconsistent and every branch of the tree closes.** So distinguishing *cannot* be modelled as rule-application — and the entry's own escape is the one L2 forces: "the practice of distinguishing can be reconciled with the view that *rationes* are rules by arguing that later courts have the power to **modify** the rule in the earlier case."

**L3 verifies the entry's constraint (2) as a literal consistency check** — "the ruling in the later case must be such that it would still support the result reached in the precedent case." A rare case where a doctrinal constraint in a non-formal discipline turns out to be exactly satisfiability.

**The first-order version is a complete three-step story and makes a good graded question**, exhaustive over |D| ≤ 2–3: **L6** the collision (`∀x((Rx&Bx&∼Pdx)⊃∼Ex)`, `∀x((Rx&Bx&∼Pdx&Lx)⊃Ex)`, plus the later facts — **VALID to ⊥**); **L7** the repair (insert the exception clause `∼Lx` into the earlier *ratio* — **consistency restored**, 61 countermodels to the inconsistency claim); **L8** the check that the repaired rule still decides the precedent case as actually decided — **VALID**. *That is exactly the doctrine of precedent, done in `∀E`.*

**Ratio and obiter — a good invalid form.** §2.1.1's twist: "even if a court chooses to explicitly formulate the *ratio* of its decision, **this precise formulation is not itself regarded as binding** on later courts." With `Sd` stated, `Cd` expressly formulated as the ratio, `Nd` belongs to the ratio, `Od` obiter, `Bd` binding: `Bd ≡ Nd`, `Sd`, `Cd`, `Cd⊃Sd`, `Nd∨Od`, `Od⊃∼Bd` ⊨ `Bd` is **INVALID**, unique countermodel `Bd=F, Cd=T, Nd=F, Od=T, Sd=T` (adding `Nd` makes it VALID). Five atoms, a biconditional, a disjunction, three conditionals — **and the single open branch has a name in the law: the court said it, the court called it its holding, and it was still obiter, because it was not necessary to the result.** The countermodel is not an artefact; it is the doctrine.

And the small one that earns its place: "a later court must either **follow** or **distinguish** — a **disjunctive obligation**." `F ∨ D, D ⊨ ∼F` is **INVALID** (`D=T, F=T` — affirming a disjunct); adding `D ⊃ ∼F`, drawn straight from the entry's definition of distinguishing as "a precedent **not being followed**," makes it valid.

#### 5.10e *A fortiori* — formalizable, and the smuggled premise is not the comparison ★★

⚠️ **Sourcing correction, and it matters.** ***A fortiori* is not in `legal-reas-prec` at all** — zero occurrences of "fortiori," "a maiore" or "a minore." Nor in `reasoning-defeasible`, `dutch-book`, `paradox-simpson`, `fallacies`, `reasoning-analogy`, `argument`, `logic-informal`, `aristotle-rhetoric`, `arabic-islamic-language`, `legal-obligation`, `legal-reas-interpret` or `logic-ancient`. **The one SEP entry that defines it as an argument form is `ibn-taymiyya`:**

> "An *a fortiori* argument (*qiyās al-awlā*) transfers the judgment of one case to a second case that is **all the more worthy** of that judgment than the first."

with Ibn Taymiyya's own reason for preferring it to analogy and to the syllogism: "It is not permissible that God—Exalted is He—and another be included in a categorical syllogism whose terms are on the same level… However, the *a fortiori* argument is followed with respect to Him." **If a legal citation is wanted rather than a theological one, it will have to come from outside SEP; do not manufacture one.**

📌 **The verdict on the question: it is genuinely formalizable, and it does smuggle in a premise — but the smuggled premise is not the comparison. It is the *monotonicity* claim.** Asserting "b is more worthy than a" is not enough; you must additionally assert that the predicate is **upward-closed** along the worthiness ordering. That second premise is substantive, defeasible, and is exactly where real *a fortiori* arguments go wrong.

With `Geq(x,y)` = *x* is at least as worthy as *y*, `Wx` = *x* merits the judgment, **(UP)** `∀x∀y((Wx & Geq(y,x)) ⊃ Wy)`, **(DOWN)** the mirror, **(TR)** transitivity — all verified by exhaustive finite-model search, |D| ≤ 3:

| # | Form | Verdict | Smallest countermodel |
|---|---|---|---|
| **AF1** | `W(a), Geq(b,a)` ⊨ `W(b)` | **INVALID** | \|D\|=2, `W={0}`, `Geq={⟨1,0⟩}` |
| **AF2** ★ | + **(UP)** | **VALID** (37,124 interps) | — |
| AF3 | `W(a), Geq(a,b)`, (UP) ⊨ `W(b)` | **INVALID** | \|D\|=2, `W={0}`, `Geq={⟨0,1⟩}` |
| **AF4** ★ | **(UP) ⊨ (DOWN)** | **INVALID** | \|D\|=2, `W={0}`, `Geq={⟨0,1⟩}` |
| AF6 | (UP) ⊨ (TR) | **INVALID** | \|D\|=2 |
| AF5 | chain of two links under (UP) | **VALID** — **no transitivity needed** | — |
| AF11 | *threshold* reading, one link | **VALID** | — |
| AF12 | threshold, chained, no TR | **INVALID** | \|D\|=2 |
| AF13 | threshold, chained, **with TR** | **VALID** (111,108 interps) | — |

**Four findings.** (1) **AF1 → AF2 is the whole answer**: bare *a fortiori* is invalid with a two-element countermodel a student draws in ten seconds; add (UP) and it is valid. It *is* a formal pattern — but the pattern is "instance of a monotonicity schema," not a primitive rule. **(2) AF4 is the sharp one: upward closure does not give downward closure.** The two classical directions — *a minore ad maius* ("no cars in the park, so a fortiori no trucks") and *a maiore ad minus* ("if you may take a bushel, you may take a peck") — require **opposite and logically independent** closure premises. **There is no single "the a fortiori rule."** AF3 is what happens when you run one direction on the other's licence, and it is the diagnosis of nearly every bad *a fortiori* in the wild — including the classic `Pb(car), Geq(car, bike), (UP) ⊨ Pb(bike)`, "no vehicles in the park, so a fortiori no bicycles," verified **INVALID**. (3) **The two readings of the ordering come apart on transitivity**: on the *closure* reading chaining needs no transitivity premise; on the *threshold* reading one link is fine but chaining fails without it. So "is *a fortiori* formalizable" has two different answers depending on the reading, with different structural demands on ≽.

**(4) Ibn Taymiyya's own argument is formally vindicated.** Formalise analogy with a *symmetric* similarity relation and a transfer principle:

| # | Form | Verdict |
|---|---|---|
| **AF10** | `W(c), Geq(g,c)`, (UP) ⊨ `W(g)` — *perfection travels up* | **VALID** |
| **AF7** ★ | `Geq(g,c), ∼W(c)`, (UP) ⊨ `∼W(g)` — *does imperfection travel up?* | **INVALID** |
| **AF8** ★ | `Sim(g,c), ∼W(c)`, (SYM), (TRF) ⊨ `∼W(g)` — analogy | **VALID** |
| AF9 | `Sim(g,c), W(c)`, (SYM), (TRF) ⊨ `W(g)` | **VALID** |

**The asymmetry of the relation is doing all the work.** The *a fortiori* ordering is asymmetric, so perfections propagate upward while imperfections do **not**; analogy's `Sim` is symmetric, so it propagates in both directions indiscriminately — exactly the theological disaster he is trying to avoid. A genuinely lovely first-order exercise with real philosophical payload, visible in a two-element model.

⚠️ ***A fortiori* is the one item here that is not propositional.** (UP) is irreducibly quantified — two variables and a binary relation — so it needs the full predicate calculus, and the propositional rendering is valid only because the bridge premise has been pre-instantiated by hand. **A genuine advertisement for quantifiers.** Also lost even in FOL: **degrees**. Real *a fortiori* is comparative, and a two-valued `W` flattens a magnitude into a threshold — which is exactly why AF11–AF13 behave differently from AF5.

#### 5.10f Simpson's paradox — the honest answer is that the logic is the accomplice, not the victim

**There is no invalid propositional or first-order form here, and that is the finding.** §4 is explicit: "Simpson's Paradox is **not** a paradox in the sense of presenting an inconsistent set of plausible propositions… mathematics does not rule out associations being reversed at the level of subpopulations." The reversal is arithmetic, not inference. The sting is in the entry's own italics: "it does not look like the right thing to do when we don't know the patient's gender — **although we know that the patient is either male or female!**"

That is an appeal to **proof by cases**, so the question is whether Simpson refutes `∨E`. **It does not.** Verified: `((M⊃G) & (∼M⊃G)) ⊃ G` is a **tautology** — and it is Savage's **Sure-Thing Principle** rendered truth-functionally, which Blyth (1972) "argued that Simpson's Paradox also constitutes a counterexample to." It cannot be. And adding Pearl's causal repair as an atom leaves the schema valid with the atom **truth-functionally idle** — a clean demonstration that the fix lies outside the logic.

📌 **Where the reading breaks is visible in one truth table, and this is the answer to the Lecture 1 question.**

| # | Form | Verdict |
|---|---|---|
| **S2** ★★ | `⊨ (M ⊃ (T ⊃ S)) ≡ ((M & T) ⊃ S)` | **VALID** — 3 atoms / 8 |

That is **exportation**, and it is Fitelson's diagnosis made mechanical. He distinguishes the **suppositional** reading ("if one is female, then receiving treatment increases one's chance of recovery") from the **conjunctive** ("being a female treatment-receiver increases one's chance of recovery"). On Simpson's own Table 1 the suppositional reading is **true** and the conjunctive reading is **false**. So the reasoner slides between two readings — **and S2 is exactly the licence they are illicitly invoking.** In classical propositional logic the two readings are provably interchangeable, in eight rows; under confirmation-as-probability-raising they come apart.

> **The logic is not merely innocent, it is the accomplice.** Students carry a genuine tautology of their home logic into a setting where the corresponding equivalence fails, and the tautology is what makes the fallacy feel obligatory.

That is a much sharper story than "people are bad at probability." **A deployable invalid form** for those who want an open branch: with `Am`/`Aw`/`Ap` = treatment beats control among men / among women / overall, and `H` = row-homogeneity of the subgroup weights, `Am, Aw, M ∨ ∼M, (Am & Aw & H) ⊃ Ap ⊨ Ap` is **INVALID**, 2 countermodels of 32, **both with `H=F`** — **the open branch names the confounder**. Adding `H` makes it valid; so does the reasoner's actual (valid but arithmetically false) premise `Ap ≡ (Am & Aw)`. 📌 Note that `M ∨ ∼M` is an **idle** premise — worth setting as a sub-question, since **noticing that excluded middle contributes nothing is the moment the "but she's either male or female!" rhetoric loses its grip.** And once you stop pretending a conditional probability is a conditional and give each claim its own atom, `Rtb, Rtnb, B ∨ ∼B ⊨ Rt` is **INVALID** — the cleanest statement of what Simpson does and does not show.

#### 5.10g The Dutch book argument — the is/ought gap located to a single row ★★

The entry numbers the argument explicitly: "(1) for an agent with degree of belief *q* in *M* a bet on or against *M* at corresponding odds will be acceptable… But then (2) by the Dutch Book theorem a cunning bettor could assure himself a profit from someone who violates the probability axioms. Since (3) violating the axioms leaves the bettor open to being Dutch Booked… it is concluded that (4) **one ought to satisfy the probability axioms**."

**Premises (1)–(3) are descriptive; conclusion (4) is normative; and the truth table locates the gap to the row.**

| # | Form | Verdict | Countermodel |
|---|---|---|---|
| **DB1** ★★ | `Bl, V⊃K, (Bl&K)⊃Ls` ⊨ `V ⊃ O` | **INVALID** | **1 of 32**: `Bl=T, K=T, Ls=T, O=F, V=T` |
| DB1b | + `Ls ⊃ O` | **VALID** | — |

**The single countermodel is a world where the agent violates the axioms, her credences *are* linked to her betting quotients, a bookie *can* make book, she *is* open to a sure loss — and she still is not under any obligation to be coherent.** That open branch is not an invention; it is the entry's own objection, §1.4: "If the threat of such a loss is seen as unlikely… then **it is hard to see why the mere potential of a sure loss should demand coherence**." So the DBA as stated is **formally invalid**, and becomes valid on exactly one added premise, `Ls ⊃ O` — normative, nowhere in (1)–(3), and **the whole is/ought gap in a single conditional.** This slots directly into §2.13.

**Is it a reductio? No — as usually presented it is a modus tollens with a suppressed normative minor premise.**

| # | Form | Verdict |
|---|---|---|
| DB2 | `V ⊃ ⊥ ⊨ ∼V` | **VALID** — genuine reductio |
| DB2b | `V ⊃ Ls, ∼Ls ⊨ ∼V` | **VALID** — modus tollens |
| **DB2c** | `V ⊃ Ls ⊨ ∼V` | **INVALID** — `Ls=T, V=T` |

DB2c is the pivot: **the Dutch Book *theorem* gives you `V ⊃ Ls` and nothing more.** To get `∼V` you must supply `∼Ls` (a normative minor premise) or upgrade `Ls` to `⊥` (a genuine reductio) — and those are the entry's own two readings. On the **depragmatized** reading the "ought" is not derived from an "is" at all: Ramsey, verbatim, "Any definite set of degrees of belief which broke them would be **inconsistent** in the sense that it violated the laws of preference between options… **which would be absurd**," and "both Ramsey and de Finetti understood incoherence to be a kind of inconsistency." 📌 **So whether the DBA crosses the is/ought gap depends entirely on whether the sure loss is a bad consequence or a symptom of inconsistency — and the two readings are two different valid forms, distinguished by one truth table showing neither is available for free.**

**Two named countermodels, and the open branch is a move in the literature each time:**

| # | Form | Verdict | Countermodel — and its name |
|---|---|---|---|
| **DB3** ★★ | `V⊃K, (K&A)⊃Ls, Ls⊃O, V` ⊨ `O` | **INVALID** | `A=F` — **"the agent can always prevent a sure loss by simply refusing to bet"** (§1.4). Adding `A` (Jackson & Pargetter's forced betting) makes it VALID |
| **DB5** | depragmatized chain via `Fu`, `Ic` | **INVALID** | `Bl=F` — **"Degrees of belief do not sanction bets in isolation from preference"** |
| **DB4** ★ | Czech book: `V⊃Ls, V⊃Gs, Ls⊃O, Gs⊃On, ∼(O&On), V` | **UNSATISFIABLE**, 0 of 32 | every branch closes |

**DB3 is the best exercise here: a student who finds the open branch has independently rediscovered the standard objection, and DB3b shows the standard repair.** DB4 makes Hájek's symmetry objection literal — "there is a corresponding **Czech Book Argument**, which parallels the DBA, with the conclusion that one ought to *violate* the probability calculus" — run the normative bridge in both directions and the position is inconsistent. Dropping `Gs ⊃ On` reopens it, which is exactly Hájek's own recorded repair (reformulate so the agent should accept bets "either fair or favorable"). 📌 **A good "find the premise whose removal reopens the tree" exercise, and it teaches that a valid argument to ⊥ is a refutation of the premise set, not a proof of anything.**

⚠️ **What is lost.** All the probability: `V` is one atom standing in for the entire Dutch Book theorem, and the theorem's content is compressed into `V ⊃ K`. The deontic operator: `O` is an atom, so the conclusion is represented but its *normativity* is not — **though the syntactic fact that `O` occurs in no premise of DB1 is arguably the cleanest formal statement of Hume's gap this course can offer.** And all diachronic structure: Dutch Strategy arguments for Conditionalization and Reflection need times and updates, and the entry's verdict there is separately negative anyway. The same deontic gap hits the legal material: "a disjunctive obligation" is `Ob(F ∨ D)`, and our language can only write `F ∨ D` — **the distinction between `Ob(F ∨ D)` and `Ob(F) ∨ Ob(D)`, which is the whole content of the doctrine, is invisible.**

---

## 6. CONNEXIVE LOGIC — THE INSTRUCTOR-ONLY BANK

*SEP: connexive logic (Wansing, rev. 2023). Read twice: once in the general sweep, once on a dedicated second pass.*

### 6.0 Why this is a different kind of rival, and why it fills the void

The second pass confirmed the framing point, and Wansing states it in the article's opening two sentences:

> *"Many prominent systems of non-classical logic are subsystems of what is generally called 'classical logic.' Systems of connexive logic are **contra-classical** in the sense that they are **neither subsystems nor extensions** of classical logic."*

Relevance, minimal and intuitionistic logic all sit *inside* the classical box — they are weakenings, and the course presents them that way in Lecture 11. **Connexive logic overlaps it**: it validates theses classical logic rejects. That is exactly why the sweep's other sections yielded so few plausible-but-invalid forms and this one yields two dozen. A sublogic can only ever *lose* theorems, so it can never hand you a formula that feels valid and isn't. A contra-classical rival can, and does.

**The Post-completeness mechanism, which belongs on a slide verbatim:**

> *"Since classical propositional logic is Post-complete, any additional axiom in its language gives rise to the trivial system, so that any non-trivial system of connexive logic will have to leave out some theorems of classical logic."*

Make it concrete in one line with a fact verified here: **`∼(∼p⊃p)` is classically equivalent to `∼p`, and `∼(p⊃∼p)` is classically equivalent to `p`.** So adding Aristotle's two theses as axiom schemas and instantiating both at `p` derives `∼p` and `p`. Explosion. A two-minute lecture proof needing nothing beyond our existing machinery — and it shows that classical logic does not merely *fail to prove* the connexive theses, it **refutes their conjunction**: `{∼(∼p⊃p), ∼(p⊃∼p)}` is **UNSAT** (verified, 0 of 2 rows).

**Where the overlap is, precisely.** MC ("material connexive logic") contains all of classical *positive* logic and is faithfully embeddable back into it; Wansing's **C** is a conservative extension of positive intuitionistic logic. So **on the negation-free fragment, connexive logic and classical logic agree completely.** The entire divergence lives in one place: what `∼` does when it scopes over `⊃`. Classically `∼(A⊃B) ≡ A & ∼B`; connexively `∼(A⊃B) ≡ (A⊃∼B)`. **That single swapped equivalence is the whole fork** — a far cleaner picture for a fork lecture than "they reject these axioms."

### 6.1 The bank

Format follows the supplied model. All verdicts and countermodels computed here.

---

**1. Boethius' Thesis (BT)**
**Form:** `p ⊃ q ⊢ ∼(p ⊃ ∼q)` — conditional form `⊢ (p⊃q) ⊃ ∼(p⊃∼q)`
**Verdict:** Invalid. Classically equivalent to `p`.
**Countermodel:** p=F (q either).
**Philosophy:** Boethius held that "If A then B" and "If A then not-B" are mutually exclusive. It captures how we use conditionals in English exactly. Classically, if p is false both conditionals are vacuously true, and the intuition breaks. Attributed via Kneale & Kneale's reading of *De Syllogismo Hypothetico* 843D; an axiom of Angell's PA1; endorsed by 84% of McCall's untrained subjects.
**Pedagogical use:** The ultimate vacuous-truth trap. Tree drill: students branch on a false antecedent and watch both sides stay stubbornly open.

**2. Abelard's First Principle (subjunctive contrariety)**
**Form:** `⊢ ∼((p⊃q) & (p⊃∼q))`
**Verdict:** Not a tautology. Classically equivalent to `p`.
**Countermodel:** p=F (q either).
**Philosophy:** A conditional and its opposite-consequent cannot both hold. "If I drop the glass it breaks" contradicts "if I drop the glass it does not break." Also called **Strawson's Thesis** (Routley, Mortensen) and Angell's *principle of subjunctive contrariety*. Independently endorsed by **Gibbard (1981, p. 231), Lowe (1995, p. 47) and Bennett (2003, p. 84)** — who did not know they were being connexive, which is a good "this isn't a logician's game" note.
**Pedagogical use:** L12 bridge problem. Construct a countermodel by table, then ask: can this be derived in ND, and why not? (Answer: no, by Soundness.) Its classical counterpart `p⊃q, p⊃∼q ⊢ ∼p` is **VALID** — assign the pair.

**3. Aristotle's First Thesis (AT)**
**Form:** `⊢ ∼(∼p ⊃ p)`
**Verdict:** Not a tautology. Classically equivalent to `∼p`.
**Countermodel:** p=T.
**Philosophy:** *Prior Analytics* 57b14: it is impossible that if not-A, then A. Materially, `∼p⊃p` is just `p`, so AT is just `∼p`. Caveat to relay: **Łukasiewicz and Kneale both hold that Aristotle is making a mistake here.**
**Pedagogical use:** A shockingly short formula that fails to be a theorem. Too small for a tree — blackboard, not problem set.

**4. Boethius' Variant (BT′)**
**Form:** `p ⊃ ∼q ⊢ ∼(p ⊃ q)`
**Verdict:** Invalid. **Countermodel:** p=F.
**Philosophy:** Mirror image of BT.
**Pedagogical use:** Non-colliding variant of BT for a different section or an exam.

---

*Extensions found on the second pass, in rough order of teaching value:*

**5. Aristotle's Second Thesis — the best exercise in the article, and we do not have it**
**Form:** `⊢ ∼((p⊃q) & (∼p⊃q))`
**Verdict:** Not a tautology. Classically equivalent to `∼q`.
**Countermodel:** q=T (both values of p).
**Philosophy:** "p and ∼p can't both imply the same thing." It feels valid for a *proof-by-cases* reason — if q followed both from p and from not-p, q would be true no matter what, and you can't get q out of nothing. The classical fact is exactly the inverse: `(p⊃q) & (∼p⊃q)` **is** equivalent to `q`, so the conjunction is satisfiable precisely when q happens to be true. Its negation-dual `⊢ (p⊃q) ∨ (∼p⊃q)` **is** a tautology — a striking pairing.
**Pedagogical use:** Maximum diagnostic value per row. The student fails the ND derivation, finds q=T on the table, and gets a genuine "oh — constructive dilemma is *valid*, that's the whole point" moment. Its classical counterpart `p⊃q, ∼p⊃q ⊢ q` is VALID; assign both. **Three-atom version for a real tree: `⊢ ∼((p⊃(q&r)) & (∼p⊃(q&r)))`** (CLI-107).

**6. Strengthened Boethius (BTe′) — the single richest item, because exactly one direction is provable**
**Form:** `⊢ (p⊃∼q) ≡ ∼(p⊃q)` — axiom **a5** of Wansing's MC; Cantwell's *conditional negation*
**Verdict:** Not a tautology. **Countermodel:** p=F (both q).
**Philosophy:** Ramsey's remark that "in a sense 'If p, q' and 'If p, ∼q' are contradictories." Cantwell's Oswald/Ruby case: denying "If Oswald didn't kill Kennedy, Ruby did" seems to assert "If Oswald didn't, Ruby didn't either." This biconditional *is* the material conditional with connexive falsity conditions — i.e. the whole fork, in one formula.
**Pedagogical use:** **Left-to-right `∼(p⊃q) ⊃ (p⊃∼q)` is a classical tautology and students CAN derive it. Right-to-left is BT′ and they will fail.** Set it as: "prove the biconditional; if you can't, prove as much as you can and give a countermodel for the rest." Isolates the entire classical/connexive fork to a single arrow direction. **If only one item from this section is used, use this one.**

**7. Aristotle's Thesis, second form (AT′)**
**Form:** `⊢ ∼(p ⊃ ∼p)` — Angell's *Law of Conditional Non-Contradiction*
**Verdict:** Not a tautology. Classically equivalent to `p`. **Countermodel:** p=F.
**Philosophy:** "Nothing implies its own negation." Endorsed by 72–88% of untrained subjects (Pfeifer; McCall's empirical study).
**Pedagogical use:** Not an exercise — a *pairing*. AT and AT′ have **opposite** countermodels (p=T vs p=F), so their conjunction is unsatisfiable. That is the two-line blackboard proof of the Post-completeness point in §6.0. **Best single slide in a fork lecture.**

**8. Francez's B3 (dual Ramsey Test)**
**Form:** `⊢ (p⊃q) ⊃ ∼(∼p⊃q)`
**Verdict:** Not a tautology. Classically equivalent to `∼q`. **Countermodel:** q=T.
**Philosophy:** Boethius obtained by negating the *antecedent* rather than the consequent — motivated by arguing about "if p, q?" by hypothetically adding `∼p`. Omori's related "half-connexive" equivalence `⊢ ∼(p⊃q) ≡ (∼p⊃q)` is a good contrast drill: classically `∼(p⊃q)` is `p & ∼q` while `∼p⊃q` is `p ∨ q` — as far apart as two formulas can be.
**Pedagogical use:** Fresh variation problem after item 5; same classical content in a new dress.

**9. Abelian logic's axiom — the best countermodel hunt in the sweep**
**Form:** `⊢ ((p⊃q)⊃q) ⊃ p`
**Verdict:** Not a tautology. **Countermodel:** p=F, q=T — **unique, 1 of 4 rows.**
**Philosophy:** Meyer–Slaney's Abelian logic; SEP groups Abelian, connexive and bilattice logics as the three families of contra-classical logic. It is the converse of Assertion, which *is* a classical theorem.
**Pedagogical use:** Exactly one open branch out of four — the ideal small "find the countermodel" problem. **Three-atom version (CLI-101, §1 rank 1): `⊢ (((p⊃(q&r))⊃(q&r))⊃p)`, one open branch out of eight.**

**10. CC1's axiom A12**
**Form:** `⊢ (p⊃p) ⊃ ∼(p⊃∼p)` — the *only* contra-classical axiom of McCall's CC1 (1966)
**Verdict:** Not a tautology. Classically equivalent to `p`. **Countermodel:** p=F.
**Philosophy:** Historically the first non-trivial connexive system; its other eleven axioms *are* classically valid.
**Pedagogical use:** Feels maximally valid because the antecedent is a tautology, so students think "it reduces to AT′, and surely…" — and then discover AT′ isn't a theorem either. A "the free antecedent buys you nothing" warm-up. Also a nice "spot the odd one out" if all twelve CC1 axioms are given.

**11. Non-symmetry of implication**
**Form:** `⊢ (p⊃q) ⊃ (q⊃p)` — and the biconditional version `⊢ (p⊃q) ≡ (q⊃p)`
**Verdict:** Neither is a tautology. **Countermodels:** unique p=F,q=T for the conditional; p=T,q=F and p=F,q=T for the biconditional.
**Philosophy:** Non-symmetry is the *definitional* requirement on a connexive logic. Pizzi & Williamson proved that in any normal consequential logic containing BT with modus ponens, `(A→B) ≡ (B→A)` becomes provable — **the conditional collapses into equivalence**, which they take to show consequential implication is not a genuine implication.
**Pedagogical use:** Use as a *result about* connexive logic, not as an exercise — nobody finds it valid. The biconditional version is good for teaching what a `≡` countermodel looks like.

**12. Kapsner's superconnexive axiom**
**Form:** `⊢ (p⊃∼p) ⊃ q`
**Verdict:** Not a tautology. Classically equivalent to `p ∨ q`. **Countermodel:** p=F, q=F.
**Philosophy:** A self-refuting antecedent should explode. Kapsner's stronger *requirements* — that `p⊃∼p` and `(p⊃q)&(p⊃∼q)` be **unsatisfiable**, not merely unprovable — both fail classically, since each is equivalent to `∼p`.
**Pedagogical use:** Marginal. It does not *feel* valid to a beginner (it looks like explosion), so it fails the mechanism's first requirement. Include only to show what "superconnexive" costs.

### 6.2 Three precision corrections

**(a) The article's interderivability claim is loose.** §2 says Aristotle's Second Thesis and Abelard's First Principle are "interderivable with BT and with BT′ respectively." Abelard's Principle is indeed classically equivalent to BT and BT′ (all three ≡ `p`, identical countermodel rows — verified). But **Aristotle's Second Thesis is not equivalent to BT**: AST ≡ `∼q`, BT ≡ `p`, and their countermodel rows differ (AST fails at p=T,q=T; BT is true there). AST's tight partners are Francez's B3 and B4, all three ≡ `∼q`. **Do not tell students AST and BT are the same form.**

**(b) The connexive logician's suspicion falls on the half classical logic already proves.** McCall calls the converse of BT "highly unintuitive"; Wansing says the left-to-right direction of a5 "seems rather strong" — and *those are exactly the classically valid halves*. `∼(p⊃∼q)` is classically just `p & q`; `∼(p⊃q)` is just `p & ∼q`. Worth a slide.

**(c) One form here is classically inconsistent, not merely contingent.** Wansing's C-contradiction `⊢ ∼((p&∼p) ⊃ (∼p∨p))` is **false on every row** — no verifying assignment exists. Every *other* named connexive thesis is contingent. This matters for exercise design exactly as flagged: a contingent form gives the student a countermodel *and* a satisfying row, so the tree has one open branch and one closed; an unsatisfiable form closes on every branch, which proves the *negation* rather than non-provability — a different and easier exercise. Use it only for the dramatic point that **C proves something classical logic refutes**, alongside the fact that C also proves `(p&∼p)⊃(∼p∨p)` — a provable contradiction in a non-trivial logic.

### 6.3 Can this be taught with truth tables? Yes — use Cantwell's CN

Connexive semantics divides in two: modify the *truth* conditions of the conditional (Angell–McCall, Routley, Priest, Pizzi), or keep them and tweak the *falsity* conditions (Wansing's whole family).

**Cantwell's CN is the intro-level option and it is excellent.** Three values {T, F, −}, designated {T, −}; the tables for `∼ & ∨ →` fit on half a slide. Verified on the published tables: **AT, AT′, BT, BT′, BTe, BTe′ all valid; conjunctive simplification VALID; LEM valid; `(p&∼p)→q` FAILS; `(p→q)→(q→p)` FAILS.** So CN is a genuine, fully truth-tabular connexive logic in which conjunction behaves normally, explosion fails, and all four canonical theses come out true. **Hand students the three tables and have them verify Aristotle's Thesis by table — the exact skill they already have, applied to a rival matrix.** A strong twenty-minute demo.

**Wansing's MC** (4 values, designated {T,B}) is also fully tabular; verified AT, AT′, BT, BT′, BTe′ and simplification all valid, ECQ fails at B, LEM fails at N. Its original semantics is even simpler than the matrices — a model just assigns classical values to **literals** (`p` and `∼p` independently), which is a very teachable way to say **bivalence is what dies here, not truth-functionality.**

**Wansing's C** should be described informally, and it pays off beautifully because students will already have intuitionistic Kripke semantics from Lecture 11: **C is literally intuitionistic Kripke semantics with a second valuation and one rewritten clause.** A model is ⟨W, ≤, v⁺, v⁻⟩ with separate support-of-truth and support-of-falsity, and every clause is standard except

> `M,t ⊨⁻ (A→B)` iff for all u ≥ t (`M,u ⊨⁺ A` implies `M,u ⊨⁻ B`)

— falsifying a conditional means: at every later state where A is supported-true, B is supported-**false**. That single clause is the entire connexive move.

**Leave Routley–Meyer as a name-drop.** Its frame conditions quantify over formulas rather than worlds and are not purely structural; both Routley and Mortensen concede they are "not particularly intuitively enlightening."

### 6.4 Two "you can't have it all" results, and the paraconsistency link

- With contraposition, uniform substitution and transitivity, **conjunctive simplification + Aristotle's theses ⟹ negation inconsistency** (Woods 1968, Thompson 1991). Any non-trivial logic keeping both *must* be paraconsistent.
- **Adding AT′ to relevance logic R trivializes it** (Mortensen 1984). Adding ECQ to C trivializes C. ZF set theory over a connexive logic with simplification is inconsistent (Wiredu 1974).

Most modern connexive systems — C, QC, MC, CN, dLP, dBD, BDW, CS4, CCL, Priest's cancellation logics — are **both connexive and paraconsistent**. Negation-as-cancellation *forces* it. The showcase, verified on the dBD matrices: both `⊢_C ((p∧∼p) → (∼p∨p))` and `⊢_C ∼((p∧∼p) → (∼p∨p))` are theorems of **C** — negation-inconsistent yet non-trivial, because ECQ fails so the contradiction does not propagate.

### 6.5 History worth ninety seconds

**Chrysippus**, via Sextus Empiricus, is the founding text: *"those who introduce the notion of connection say that a conditional is sound when the contradictory of its consequent is incompatible with its antecedent."* McCall: connexive logic "may be seen as an attempt to formalize the species of implication recommended by Chrysippus." (The article does **not** discuss Philo or Diodorus — zero hits on a full-text grep.)

**The Boethius attribution is an exegetical scandal**, and a good one. Kneale & Kneale report *De Syllogismo Hypothetico* 843D as holding that the negative of "Si est A, est B" is "Si est A, non est B" — i.e. BTe′. Wansing prints the Latin and argues this misreads Boethius, who is merely classifying hypothetical propositions as affirmative or negative by their consequent: "This statement is quite different from the reading offered by Kneale and Kneale." He also flags a misprint in Migne's 1860 edition. **Bonevac & Dever say they simply fail to find Abelard's Principle in Boethius at all.** Martin and McCall both question whether rendering Boethius' *term* logic propositionally is legitimate.

Also: **Kilwardby** endorsed connexive principles; **thirteenth-century Arabic philosophy** contains a critical discussion of AT for impossible antecedents (El-Rouayheb); **Leibniz's** LEIB1/LEIB2 restrict Aristotle's theses to *possible* antecedents, and Lenzen's deflationary verdict is that they "are theorems of almost all systems of normal modal logic and therefore do not lead to any non-classical system" — the material rendering `p ⊃ ∼(p⊃∼p)` is **classically valid**. **Ramsey (1929)** is the modern ancestor: "in a sense 'If p, q' and 'If p, ∼q' are contradictories." **Storrs McCall coined the name** in 1963–64.

---

## 7. TRAPS — forms that look plausible or connexive and are classically VALID

If any of these leaks into an invalidity exercise, students will produce correct derivations and the problem set is broken. All verified tautologies:

| Form | Why it looks like it belongs |
|---|---|
| `⊢ ∼(p⊃∼q) ⊃ (p⊃q)` | Converse of BT. But `∼(p⊃∼q)` is just `p & q`. |
| `⊢ ∼(p⊃q) ⊃ (p⊃∼q)` | Converse of BT′, half of axiom a5. But `∼(p⊃q)` is just `p & ∼q`. |
| `⊢ ∼((p⊃q) & ∼q & ∼(∼p⊃∼q))` | Jarmużek & Malinowski's *unwanted* validity in their own system. |
| `⊢ ((p&q)⊃r) ⊃ ((p&∼r)⊃∼q)` | Nelson's NL axiom 1.7. Genuinely hard, genuinely valid — use it as an ND problem (CLI-438). |
| `⊢ (p&q) ⊃ p` | Conjunctive simplification. Useful only in reverse: as the thing Routley-style connexivism gives up. |
| `⊢ (q⊃p) ∨ (p⊃r)` | The course's own L11/PS5.6 theorem. Its near-twin `⊢ (p⊃q) ∨ (p⊃r)` is INVALID (CLI-106). |
| `⊢ (p⊃q) ∨ (q⊃r)` | The third paradox of material implication. Every one of eight rows true. |
| `∼(p⊃q) ⊢ p` and `∼(p⊃q) ⊢ ∼q` | Maximally repugnant and entirely valid (CLI-306). |
| `p⊃q, (p&r)⊃∼q ⊢ ∼(p & r)` | Valid — while the *same premises* with conclusion `∼r` are invalid (CLI-114). |
| `p ⊃ ∼(p ⊃ ∼p)` | Leibniz's modally-restricted thesis, degenerately rendered. Classically valid, which is Lenzen's whole point. |

---

## 8. SEP COVERAGE LEDGER

| Article | Status |
|---|---|
| logic: classical · logic: propositional · connectives: sentence connectives | ✅ swept — §2, §3 |
| logical consequence · logical form · logical truth · logical pluralism · logical constants · natural deduction · consequence, medieval | ✅ swept — §2 |
| conditionals · conditionals: counterfactual · logic: conditionals | ✅ swept — §1, §3 |
| contradiction · negation · disjunction | ✅ swept — §3, §4 |
| logic: intuitionistic · disjunction | ✅ swept — §4.1 |
| logic: many-valued · logic: paraconsistent · dialetheism · logic: fuzzy | ✅ swept — §4.2, §4.3 |
| logic: relevance · logic: substructural · logic: linear · connexive logic | ✅ swept — §4.4, §6 |
| Curry's paradox · liar paradox · epistemic paradoxes · Fitch's paradox · insolubles · future contingents | ✅ swept — §5 |
| abduction · analogy · argument and argumentation · fallacies · logic: informal · logic: non-monotonic | ✅ swept — §5.3, §5.4 |
| logic: modal · logic: temporal · logic: modal origins | ✅ swept — §1b, §4.5 |
| logic: epistemic · logic: dynamic epistemic · logic: justification | ✅ swept — §1b, §5.7 |
| logic: deontic · logic: preference | ✅ swept — §1b, §4.7 |
| logic: and probability · logic: and games · logic: dialogical | ✅ swept — §1b, §4.6 |
| algebra of logic tradition · Boolean algebra · logic: algebraic propositional | ✅ swept — §1b, §2.6 |
| logic: propositional dynamic · logic: combining · logic: hybrid | ✅ swept — §1b, §4.9 |
| logic: combinatory | with action + ontology | ✅ swept — §2.17 |

**Second pass against the full SEP table of contents (2026-08-29).** The taxonomy this sweep was built on turned out to be a subset. Roughly twenty further entries are in scope; the ones that clearly belong are listed below, in the order they were judged to matter.

| Article | Why it belongs | Status |
|---|---|---|
| **logic: ancient** (Bobzien) | Stoic indemonstrables; Philo/Diodorus/Chrysippus on the conditional | ✅ swept — §2.8 |
| **square of opposition** (Parsons) — slug is `square` | Existential import, both readings, every relation | ✅ swept — §2.8 |
| **syllogism, medieval theories of** (Lagerlund) | The 24 moods; ecthesis | ✅ swept — §2.8 |
| **vagueness** (Sorensen) · **Sorites paradox** | Non-conditional sorites; supervaluationism; epistemicism | ✅ swept — §4.10 |
| **truth values** (Shramko & Wansing) | LEM vs bivalence; designated values; **Suszko's thesis** | ✅ swept — §3.8 |
| **self-reference** · **Russell's paradox** · **paradoxes and contemporary logic** | Fixed-point spectrum; T269; the definability families; Ramsey | ✅ swept — §5.9 |
| **proof theory** · **proof-theoretic semantics** (Schroeder-Heister) | Harmony; normalization; the intuitionistic bias | ✅ swept — §2.9 |
| **Gödel's incompleteness theorems** | What they do and do **not** say about the completeness theorem | ✅ swept — §2.9 |
| **logic: free** (Gratzl, Pavlović, Nolt) | The three varieties; **corrects a claim in the Imports file** | ✅ swept — §2.10 |
| **logic: second-order and higher-order** (Väänänen) | Standard vs Henkin semantics | ✅ swept — §2.10 |
| **generalized quantifiers** | "Most" not FO-definable; monotonicity signatures | ✅ swept — §2.10 |
| **model theory** · **Tarski: truth definitions** · **truth** | Convention T; what a model is; **the squeeze is NOT here** | ✅ swept — §2.11 |
| **logic: normative status of** (Steinberger) · **logic: inductive** | Why logic *binds*; bridge principles; ⚠️ the inductive entry was rewritten Feb 2025 | ✅ swept — §2.13 |

| **Church–Turing thesis** · **computability** · **Turing machines** | Decidable / r.e. / neither; halting as a T269 instance | ✅ swept — §2.12 |
| **logic: independence friendly** · **infinitary** · **many-sorted** | Slash notation; undetermined sentences without a third value; **the two negations split LEM from bivalence** | ✅ swept — §2.18 |
| **Frege: logic** · **Peirce: logic** · **Port Royal Logic** | Frege's strokes; **the alpha graphs, found**; comprehension/extension | ✅ swept — §2.15 |
| **logic: of belief revision** · **dependence** · **and information** | AGM recovery; team semantics; the scandal of deduction | ✅ swept — §4.12 |
| **logic: action** · **logic: and ontology** | Quine's criterion; the exact bill for the non-empty domain; STIT fails weakening | ✅ swept — §2.17 |
| **quantum logic and probability theory** · **Skolem's paradox** | Distribution failing, properly sourced — **and it is a lattice claim, not a truth-table one** | ✅ swept — §4.11; **CLI-314 rewritten** |
| **set theory** · **type theory** · **logicism** | ZFC; types as a language restriction; Hume's Principle vs Basic Law V | ✅ swept — §2.16 |
| **Indian Philosophy (Classical): logic** · **early Chinese logic and language** | Nyāya inference; the hetucakra; the Mohist ∀/∃ contrast | ✅ swept — §2.14 |
| **reasoning: defeasible** · **legal reasoning** · **Dutch book** · **Simpson's paradox** | Rebutting vs undercutting; *a fortiori* (⚠️ **not in the legal entry**); the is/ought row | ✅ swept — §5.10 |
| impossible worlds · logic: intensional · logic: provability | ✅ swept — §1b, §4.8 |
| obligationes, medieval theories of | ✅ swept — §1b, §5.8 |
| logic: for analyzing games · power in normal form games | Backward induction as a minimal inconsistent set — **four resolutions, one premise each** | ✅ swept — §2.19 |
| diagrams and diagrammatic reasoning | ✅ swept — §1b, §2.7 |

**The queue is now empty.** ✅ **Every article identified in either pass has been swept, and every verdict independently recomputed before entry.** The prediction that the last eight batches would yield "low for *propositional* forms and high for framing material" was **half wrong**: the framing yield was indeed high, but four of the eight produced first-rate propositional exercises — the backward-induction MIS map (§2.19b), the pink elephant (§5.10b), the Dutch book's single is/ought row (§5.10g), and team semantics' derivation of LEM's failure from a classical truth table (§4.12b). What was correctly predicted is that the *quantum* batch would yield nothing propositional at all: its main result is a **correction** to a claim this file was making, not a new form.

---

## 9. STANDING CAUTIONS

1. **Every verdict here was recomputed.** Agents were right in every case checked, but the first-pass *summarisers* were not: one produced a system-by-rule table marking double-negation introduction and elimination as failing in K3 and LP, which is false (`∼` is an involution in both). Treat this file's tables as verified; treat any SEP summariser's own table as unverified.
2. **Three forms are flagged as not SEP-sourced** even though they are standard: **Peirce's Law's intuitionistic status** (the *Intuitionistic Logic* entry does not mention Peirce's Law at all — confirmed on a targeted re-fetch), **Clavius / consequentia mirabilis**, and the **truth-teller**. Attribute them as textbook results.
3. **The full four-direction De Morgan breakdown** comes from the *Disjunction* entry, not the *Intuitionistic Logic* entry, which lists only the failing direction.
4. **Venn is absent from the algebra-of-logic entries** — not mentioned once across all three. The diagrammatic tradition is covered instead by the *diagrams* entry, swept at §2.7. ⚠️ **Peirce's existential graphs cannot be sourced from it either**: three passing mentions, no content, and the words "alpha," "beta" and "gamma" appear nowhere in the entry.
5. **Post's theorem, "because"/"although" as truth-functionality counterexamples, "conditional perfection", "false dilemma", the base-rate and conjunction fallacies, the preface paradox, and the gamma / Meyer–Dunn admissibility result** are in **none** of the fetched entries. The gamma result in particular — that DS is *admissible* though not derivable in R — would strengthen §4.4's DS material and is a real defence of relevant logic against the charge that it cannot reason from inconsistent theories; source it elsewhere before printing.
6. **Finite-model search refutes; it cannot confirm.** Verified the hard way in §2.16: Foundation + Pairing returns "0 countermodels" *and* 0 models of the premises, because **Pairing has no finite models at all** (it needs n(n+1)/2 distinct pair-sets in a domain of n). The same holds for Power Set, Infinity and Replacement. Against ZF proper the method is silent by construction, and a "VALID" from it on any premise set containing those axioms means nothing.

7. **Atomisation is not always the right technique, and §2.19d says why.** Coalition logic's characteristic axioms have **no informative propositional shadows** — atomise `{A}p`, `{A}q`, `{A}(p&q)` as three unrelated atoms and aggregation is invalid for a trivial reason that says nothing about power. Their real shadows are *first-order* (`∃x∀y` vs `∀y∃x`), and those are worth teaching. Wherever an operator's content lives in its interaction with the connectives, atomising destroys exactly what you were trying to see.

8. **Treat WebFetch summariser *negatives* as unreliable.** Two agents in this sweep were told by the summariser that an entry lacked material it plainly contains — most flagrantly the IF entry's §6.1 discussion of signalling. Both recovered it only by pulling raw HTML. An absence claim in this file is trustworthy only where it is recorded as the result of a grep on the article text (as in §4.11a's two-slit check and §5.10e's *a fortiori* check).

9. **Four URL corrections established by this sweep.** `/entries/logicism/` resolves and is titled *"Logicism and Neologicism"*; **`/entries/logicism-neologicism/` is a 404.** `/entries/dependence-logic/` is a 404; the entry is at **`/entries/logic-dependence/`**. `/entries/logic-power-games/` **does** resolve. And `legal-reas-prec` is the correct slug for *Precedent and Analogy in Legal Reasoning*.

10. **Nothing here is scheduled.** This is a menu for midterm prep and for the Lecture 7/8 invalid-argument problem, not a plan. The exam quarantine in the first inventory (§8) still governs which forms may appear where.
