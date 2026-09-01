"""Fitch derivations for the eighteen valid entries.

Hand-authored in the course's twelve-rule system and checked line by line by
`nd.check()`, which re-derives the profile rather than trusting it.

Two conventions worth stating, because they decide several proofs' length:

  * **Reiteration is a rule, not decoration**, and §6.4 of the style guide has
    the policy the instructor settled on 2026-08-30. In short: citing an outer
    line as a premise of another rule writes no new formula and is always
    allowed, so reiteration is never needed for *access*. It is *required*
    where a formula has to appear again in a new **role** -- as the consequent
    inside a `⊃I`, as a case's conclusion when that case assumed it, and where
    a `⊥I`'s contradictory pair includes the subproof's own assumption.
    `nd.check()` enforces all three, and refuses the converse mistake of
    reiterating merely so an elimination can cite it locally.
  * **There is no explosion rule.** `\\Exp` is retired, so getting an arbitrary
    formula out of a contradiction always costs the full reductio: assume its
    negation, reach ⊥ again, `NegI`, `NegE`. That is what makes `ex-falso`
    seven lines rather than three, and it is the point of the entry.
"""

P = lambda n, f: {"n": n, "f": f, "rule": "Pr", "depth": 0}


def _l(n, f, rule, depth=0, cites=None, subs=None):
    ln = {"n": n, "f": f, "rule": rule, "depth": depth}
    if cites:
        ln["cites"] = cites
    if subs:
        ln["subs"] = subs
    return ln


PROOFS: dict[str, list[dict]] = {}

# ------------------------------------------------------------------ ex falso
# The retired \Exp rule used to short-circuit this. Spelled out, the reductio
# is the whole exhibit: a contradiction yields q only via ~q's own refutation.
PROOFS["ex-falso"] = [
    P(1, "p & ~p"),
    _l(2, "~q", "As", 1),
    _l(3, "p", "ConjE", 1, [1]),
    _l(4, "~p", "ConjE", 1, [1]),
    _l(5, "!", "FalsumI", 1, [3, 4]),
    _l(6, "~~q", "NegI", 0, subs=[[2, 5]]),
    _l(7, "q", "NegE", 0, [6]),
]

# --------------------------------------------------------------- Peirce's Law
# Four deep, and every level earns its keep: ⊃I for the whole, reductio for p,
# ⊃I for the antecedent p ⊃ q, and a second reductio to get q out of p and ~p.
PROOFS["peirce-law"] = [
    _l(1, "(p > q) > p", "As", 1),
    _l(2, "~p", "As", 2),
    _l(3, "p", "As", 3),
    _l(4, "~q", "As", 4),
    _l(5, "!", "FalsumI", 4, [3, 2]),
    _l(6, "~~q", "NegI", 3, subs=[[4, 5]]),
    _l(7, "q", "NegE", 3, [6]),
    _l(8, "p > q", "CondI", 2, subs=[[3, 7]]),
    _l(9, "p", "CondE", 2, [1, 8]),
    # The contradiction is with line 2, this subproof's own assumption, so it
    # is brought back down: we assumed ∼p, we have now derived p, and here is
    # the ∼p we assumed.
    _l(10, "~p", "Reit", 2, [2]),
    _l(11, "!", "FalsumI", 2, [9, 10]),
    _l(12, "~~p", "NegI", 1, subs=[[2, 11]]),
    _l(13, "p", "NegE", 1, [12]),
    _l(14, "((p > q) > p) > p", "CondI", 0, subs=[[1, 13]]),
]

# ------------------------------------------------------------------ contraction
PROOFS["contraction-w"] = [
    _l(1, "p > (p > q)", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p > q", "CondE", 2, [1, 2]),
    _l(4, "q", "CondE", 2, [3, 2]),
    _l(5, "p > q", "CondI", 1, subs=[[2, 4]]),
    _l(6, "(p > (p > q)) > (p > q)", "CondI", 0, subs=[[1, 5]]),
]

# ----------------------------------------------------------------- exportation
PROOFS["exportation"] = [
    _l(1, "p > (q > r)", "As", 1),
    _l(2, "p & q", "As", 2),
    _l(3, "p", "ConjE", 2, [2]),
    _l(4, "q", "ConjE", 2, [2]),
    _l(5, "q > r", "CondE", 2, [1, 3]),
    _l(6, "r", "CondE", 2, [5, 4]),
    _l(7, "(p & q) > r", "CondI", 1, subs=[[2, 6]]),
    _l(8, "(p & q) > r", "As", 1),
    _l(9, "p", "As", 2),
    _l(10, "q", "As", 3),
    _l(11, "p & q", "ConjI", 3, [9, 10]),
    _l(12, "r", "CondE", 3, [8, 11]),
    _l(13, "q > r", "CondI", 2, subs=[[10, 12]]),
    _l(14, "p > (q > r)", "CondI", 1, subs=[[9, 13]]),
    _l(15, "(p > (q > r)) = ((p & q) > r)", "BicondI", 0, subs=[[1, 7], [8, 14]]),
]

# ------------------------------------------------------- scandal of deduction
PROOFS["scandal-of-deduction"] = [
    P(1, "c"),
    P(2, "n"),
    P(3, "(c & n) > ~s"),
    P(4, "i > s"),
    _l(5, "i", "As", 1),
    _l(6, "s", "CondE", 1, [4, 5]),
    _l(7, "c & n", "ConjI", 1, [1, 2]),
    _l(8, "~s", "CondE", 1, [3, 7]),
    _l(9, "!", "FalsumI", 1, [6, 8]),
    _l(10, "~i", "NegI", 0, subs=[[5, 9]]),
]

# ----------------------------------------------------------------- Curry, full
# Contraction is what does the damage: line 7 discharges c into c ⊃ p, and the
# second premise then hands c straight back.
PROOFS["curry-complete"] = [
    P(1, "c > (c > p)"),
    P(2, "(c > p) > c"),
    P(3, "p > q"),
    _l(4, "c", "As", 1),
    _l(5, "c > p", "CondE", 1, [1, 4]),
    _l(6, "p", "CondE", 1, [5, 4]),
    _l(7, "c > p", "CondI", 0, subs=[[4, 6]]),
    _l(8, "c", "CondE", 0, [2, 7]),
    _l(9, "p", "CondE", 0, [7, 8]),
    _l(10, "q", "CondE", 0, [3, 9]),
]

# -------------------------------------------------------------- Russell schema
PROOFS["russell-schema"] = [
    _l(1, "p = ~p", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "~p", "BicondE", 2, [1, 2]),
    # Line 2 is the assumption; line 4 is that same p standing as one half of
    # the contradiction we have just walked into.
    _l(4, "p", "Reit", 2, [2]),
    _l(5, "!", "FalsumI", 2, [4, 3]),
    _l(6, "~p", "NegI", 1, subs=[[2, 5]]),
    _l(7, "p", "BicondE", 1, [1, 6]),
    _l(8, "!", "FalsumI", 1, [7, 6]),
    _l(9, "~(p = ~p)", "NegI", 0, subs=[[1, 8]]),
]

# ------------------------------------------------- rebutting entails undercutting
PROOFS["rebut-entails-undercut"] = [
    P(1, "r > ~q"),
    P(2, "r"),
    P(3, "p"),
    P(4, "(s & p) > q"),
    _l(5, "s", "As", 1),
    _l(6, "s & p", "ConjI", 1, [5, 3]),
    _l(7, "q", "CondE", 1, [4, 6]),
    _l(8, "~q", "CondE", 1, [1, 2]),
    _l(9, "!", "FalsumI", 1, [7, 8]),
    _l(10, "~s", "NegI", 0, subs=[[5, 9]]),
]

# ------------------------------------------------------------ bi-paradox MIS-1
PROOFS["bi-paradox-mis1"] = [
    P(1, "d"),
    P(2, "d > k"),
    P(3, "k > p"),
    P(4, "d > ~p"),
    _l(5, "k", "CondE", 0, [2, 1]),
    _l(6, "p", "CondE", 0, [3, 5]),
    _l(7, "~p", "CondE", 0, [4, 1]),
    _l(8, "!", "FalsumI", 0, [6, 7]),
]

# ------------------------------------------------------------------ Czech book
PROOFS["czech-book"] = [
    P(1, "v > l_s"),
    P(2, "v > g_s"),
    P(3, "l_s > o"),
    P(4, "g_s > o_n"),
    P(5, "~(o & o_n)"),
    P(6, "v"),
    _l(7, "l_s", "CondE", 0, [1, 6]),
    _l(8, "g_s", "CondE", 0, [2, 6]),
    _l(9, "o", "CondE", 0, [3, 7]),
    _l(10, "o_n", "CondE", 0, [4, 8]),
    _l(11, "o & o_n", "ConjI", 0, [9, 10]),
    _l(12, "!", "FalsumI", 0, [11, 5]),
]

# ------------------------------------------------------------- finite choice 2x2
# The finite shadow of the Axiom of Choice: four cases, each picking a pair.
PROOFS["finite-choice-2x2"] = [
    _l(1, "(p | q) & (r | s)", "As", 1),
    _l(2, "p | q", "ConjE", 1, [1]),
    _l(3, "r | s", "ConjE", 1, [1]),
    _l(4, "p", "As", 2),
    _l(5, "r", "As", 3),
    _l(6, "p & r", "ConjI", 3, [4, 5]),
    _l(7, "(p & r) | (p & s)", "DisjI", 3, [6]),
    _l(8, "(p & r) | (p & s) | (q & r)", "DisjI", 3, [7]),
    _l(9, "(p & r) | (p & s) | (q & r) | (q & s)", "DisjI", 3, [8]),
    _l(10, "s", "As", 3),
    _l(11, "p & s", "ConjI", 3, [4, 10]),
    _l(12, "(p & r) | (p & s)", "DisjI", 3, [11]),
    _l(13, "(p & r) | (p & s) | (q & r)", "DisjI", 3, [12]),
    _l(14, "(p & r) | (p & s) | (q & r) | (q & s)", "DisjI", 3, [13]),
    _l(15, "(p & r) | (p & s) | (q & r) | (q & s)", "DisjE", 2, [3], [[5, 9], [10, 14]]),
    _l(16, "q", "As", 2),
    _l(17, "r", "As", 3),
    _l(18, "q & r", "ConjI", 3, [16, 17]),
    _l(19, "(p & r) | (p & s) | (q & r)", "DisjI", 3, [18]),
    _l(20, "(p & r) | (p & s) | (q & r) | (q & s)", "DisjI", 3, [19]),
    _l(21, "s", "As", 3),
    _l(22, "q & s", "ConjI", 3, [16, 21]),
    _l(23, "(p & r) | (p & s) | (q & r) | (q & s)", "DisjI", 3, [22]),
    _l(24, "(p & r) | (p & s) | (q & r) | (q & s)", "DisjE", 2, [3], [[17, 20], [21, 23]]),
    _l(25, "(p & r) | (p & s) | (q & r) | (q & s)", "DisjE", 1, [2], [[4, 15], [16, 24]]),
    _l(
        26,
        "((p | q) & (r | s)) > ((p & r) | (p & s) | (q & r) | (q & s))",
        "CondI",
        0,
        subs=[[1, 25]],
    ),
]

# ---------------------------------------------------------------- distribution
PROOFS["distribution"] = [
    _l(1, "p & (q | r)", "As", 1),
    _l(2, "p", "ConjE", 1, [1]),
    _l(3, "q | r", "ConjE", 1, [1]),
    _l(4, "q", "As", 2),
    _l(5, "p & q", "ConjI", 2, [2, 4]),
    _l(6, "(p & q) | (p & r)", "DisjI", 2, [5]),
    _l(7, "r", "As", 2),
    _l(8, "p & r", "ConjI", 2, [2, 7]),
    _l(9, "(p & q) | (p & r)", "DisjI", 2, [8]),
    _l(10, "(p & q) | (p & r)", "DisjE", 1, [3], [[4, 6], [7, 9]]),
    _l(11, "(p & (q | r)) > ((p & q) | (p & r))", "CondI", 0, subs=[[1, 10]]),
]

# ----------------------------------------------------------- Cleopatra recovery
PROOFS["recovery-cleopatra"] = [
    P(1, "(b_S > a_S) & (b_D > a_D)"),
    P(2, "b_S & b_D"),
    P(3, "a_C"),
    P(4, "~a_S & ~a_D"),
    _l(5, "b_S > a_S", "ConjE", 0, [1]),
    _l(6, "b_S", "ConjE", 0, [2]),
    _l(7, "a_S", "CondE", 0, [5, 6]),
    _l(8, "~a_S", "ConjE", 0, [4]),
    _l(9, "!", "FalsumI", 0, [7, 8]),
]

# ------------------------------------------------------------- the Kant chain
# Lecture 10 §3, verbatim -- including the reiteration on line 8, which is not
# strictly needed (line 4 is still accessible) but is what the handout shows.
PROOFS["lecture8-chain"] = [
    P(1, "p > q"),
    P(2, "q > r"),
    P(3, "r > ~p"),
    _l(4, "p", "As", 1),
    _l(5, "q", "CondE", 1, [1, 4]),
    _l(6, "r", "CondE", 1, [2, 5]),
    _l(7, "~p", "CondE", 1, [3, 6]),
    _l(8, "p", "Reit", 1, [4]),
    _l(9, "!", "FalsumI", 1, [8, 7]),
    _l(10, "~p", "NegI", 0, subs=[[4, 9]]),
]

# ----------------------------------------------------------- Dutch book, repaired
# The added premise is ls ⊃ o -- the normative bridge. Line 9 is where it fires.
PROOFS["dutch-book-repaired"] = [
    P(1, "b_l"),
    P(2, "v > k"),
    P(3, "(b_l & k) > l_s"),
    P(4, "l_s > o"),
    _l(5, "v", "As", 1),
    _l(6, "k", "CondE", 1, [2, 5]),
    _l(7, "b_l & k", "ConjI", 1, [1, 6]),
    _l(8, "l_s", "CondE", 1, [3, 7]),
    _l(9, "o", "CondE", 1, [4, 8]),
    _l(10, "v > o", "CondI", 0, subs=[[5, 9]]),
]

PROOFS["dutch-book-lecture-form-repaired"] = [
    P(1, "b"),
    P(2, "v > k"),
    P(3, "(b & k) > (l & d)"),
    P(4, "l > o"),
    _l(5, "v", "As", 1),
    _l(6, "k", "CondE", 1, [2, 5]),
    _l(7, "b & k", "ConjI", 1, [1, 6]),
    _l(8, "l & d", "CondE", 1, [3, 7]),
    _l(9, "l", "ConjE", 1, [8]),
    _l(10, "o", "CondE", 1, [4, 9]),
    _l(11, "v > o", "CondI", 0, subs=[[5, 10]]),
]

# ------------------------------------------------- distributed knowledge, repaired
# The added premise ~(h & c) is what rules out the rogue case. Inside it, w has
# to be won back by reductio, since there is no explosion rule to hand.
PROOFS["distributed-knowledge-repaired"] = [
    P(1, "h | w"),
    P(2, "w | c"),
    P(3, "~(h & c)"),
    _l(4, "h", "As", 1),
    _l(5, "w", "As", 2),
    # Lines 5 and 6 are the same formula doing two different jobs: 5 is the
    # assumption ∨E licenses, 6 is what this case concludes. Without the
    # reiteration one line would have to play both roles.
    _l(6, "w", "Reit", 2, [5]),
    _l(7, "c", "As", 2),
    _l(8, "h & c", "ConjI", 2, [4, 7]),
    _l(9, "~w", "As", 3),
    _l(10, "!", "FalsumI", 3, [8, 3]),
    _l(11, "~~w", "NegI", 2, subs=[[9, 10]]),
    _l(12, "w", "NegE", 2, [11]),
    _l(13, "w", "DisjE", 1, [2], [[5, 6], [7, 12]]),
    _l(14, "w", "As", 1),
    _l(15, "w", "Reit", 1, [14]),
    _l(16, "w", "DisjE", 0, [1], [[4, 13], [14, 15]]),
]

# ------------------------------------------------------------------- assertion
PROOFS["assertion-t"] = [
    _l(1, "p", "As", 1),
    _l(2, "p > q", "As", 2),
    _l(3, "q", "CondE", 2, [2, 1]),
    _l(4, "(p > q) > q", "CondI", 1, subs=[[2, 3]]),
    _l(5, "p > ((p > q) > q)", "CondI", 0, subs=[[1, 4]]),
]

# --------------------------------------------------------------- modus ponens
# The rule the whole system is built around: one application of ⊃E.
PROOFS["modus-ponens"] = [
    P(1, "p > q"),
    P(2, "p"),
    _l(3, "q", "CondE", 0, [1, 2]),
]

# -------------------------------------------------------------- modus tollens
# An easy table and a harder proof: there is no one-step rule, so the argument
# has to be made by reductio -- assume p, reach q, collide it with ~q.
PROOFS["modus-tollens"] = [
    P(1, "p > q"),
    P(2, "~q"),
    _l(3, "p", "As", 1),
    _l(4, "q", "CondE", 1, [1, 3]),
    _l(5, "~q", "Reit", 1, [2]),
    _l(6, "!", "FalsumI", 1, [4, 5]),
    _l(7, "~p", "NegI", 0, [], [[3, 6]]),
]

# --------------------------------------------------------- hypothetical syllogism
# Two applications of ⊃E inside one assumption of p, then discharge. The
# two-step half of Lecture 10's own chain (lecture8-chain compounds a third
# link and turns the last one into a negation by reductio).
PROOFS["hypothetical-syllogism"] = [
    P(1, "p > q"),
    P(2, "q > r"),
    _l(3, "p", "As", 1),
    _l(4, "q", "CondE", 1, [1, 3]),
    _l(5, "r", "CondE", 1, [2, 4]),
    _l(6, "p > r", "CondI", 0, subs=[[3, 5]]),
]

# ---------------------------------------------------------------- contraposition
# Both directions by reductio, then ≡I crosses them over. Each half cites the
# outer half's assumption outward rather than reiterating it: §6.4's pair is
# not the subproof's own assumption here, which is the case the policy leaves
# optional.
PROOFS["contraposition"] = [
    _l(1, "p > q", "As", 1),
    _l(2, "~q", "As", 2),
    _l(3, "p", "As", 3),
    _l(4, "q", "CondE", 3, [1, 3]),
    _l(5, "!", "FalsumI", 3, [4, 2]),
    _l(6, "~p", "NegI", 2, subs=[[3, 5]]),
    _l(7, "~q > ~p", "CondI", 1, subs=[[2, 6]]),
    _l(8, "~q > ~p", "As", 1),
    _l(9, "p", "As", 2),
    _l(10, "~q", "As", 3),
    _l(11, "~p", "CondE", 3, [8, 10]),
    _l(12, "!", "FalsumI", 3, [9, 11]),
    _l(13, "~~q", "NegI", 2, subs=[[10, 12]]),
    _l(14, "q", "NegE", 2, [13]),
    _l(15, "p > q", "CondI", 1, subs=[[9, 14]]),
    _l(16, "(p > q) = (~q > ~p)", "BicondI", 0, subs=[[1, 7], [8, 15]]),
]

# ---------------------------------------------------------------- De Morgan I
# -> direction: two dictated reductios (assume the disjunct, collide with the
# outer negated disjunction, cited directly since it is still accessible).
# <- direction: the disjunction is assumed outright (also dictated -- that is
# what \NegI asks for on a negation goal) and eliminated by cases, each case
# colliding with one conjunct of the outer premise.
PROOFS["de-morgan-disjunction"] = [
    _l(1, "~(p | q)", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p | q", "DisjI", 2, [2]),
    _l(4, "!", "FalsumI", 2, [3, 1]),
    _l(5, "~p", "NegI", 1, subs=[[2, 4]]),
    _l(6, "q", "As", 2),
    _l(7, "p | q", "DisjI", 2, [6]),
    _l(8, "!", "FalsumI", 2, [7, 1]),
    _l(9, "~q", "NegI", 1, subs=[[6, 8]]),
    _l(10, "~p & ~q", "ConjI", 1, [5, 9]),
    _l(11, "~p & ~q", "As", 1),
    _l(12, "~p", "ConjE", 1, [11]),
    _l(13, "~q", "ConjE", 1, [11]),
    _l(14, "p | q", "As", 2),
    _l(15, "p", "As", 3),
    _l(16, "p", "Reit", 3, [15]),
    _l(17, "!", "FalsumI", 3, [16, 12]),
    _l(18, "q", "As", 3),
    _l(19, "q", "Reit", 3, [18]),
    _l(20, "!", "FalsumI", 3, [19, 13]),
    _l(21, "!", "DisjE", 2, [14], subs=[[15, 17], [18, 20]]),
    _l(22, "~(p | q)", "NegI", 1, subs=[[14, 21]]),
    _l(23, "(~(p | q)) = (~p & ~q)", "BicondI", 0, subs=[[1, 10], [11, 22]]),
]

# --------------------------------------------------------------- De Morgan II
# -> direction is the one that needs the indirect route: assume the negation
# of the goal disjunction, prise `p` and `q` back out of the double negations
# that forces, then collide the two with the premise. <- direction is the
# routine half: eliminate the disjunction by cases, one reductio per case.
PROOFS["de-morgan-conjunction"] = [
    _l(1, "~(p & q)", "As", 1),
    _l(2, "~(~p | ~q)", "As", 2),
    _l(3, "~p", "As", 3),
    _l(4, "~p | ~q", "DisjI", 3, [3]),
    _l(5, "!", "FalsumI", 3, [4, 2]),
    _l(6, "~~p", "NegI", 2, subs=[[3, 5]]),
    _l(7, "p", "NegE", 2, [6]),
    _l(8, "~q", "As", 3),
    _l(9, "~p | ~q", "DisjI", 3, [8]),
    _l(10, "!", "FalsumI", 3, [9, 2]),
    _l(11, "~~q", "NegI", 2, subs=[[8, 10]]),
    _l(12, "q", "NegE", 2, [11]),
    _l(13, "p & q", "ConjI", 2, [7, 12]),
    _l(14, "!", "FalsumI", 2, [13, 1]),
    _l(15, "~~(~p | ~q)", "NegI", 1, subs=[[2, 14]]),
    _l(16, "~p | ~q", "NegE", 1, [15]),
    _l(17, "~p | ~q", "As", 1),
    _l(18, "~p", "As", 2),
    _l(19, "p & q", "As", 3),
    _l(20, "p", "ConjE", 3, [19]),
    _l(21, "!", "FalsumI", 3, [20, 18]),
    _l(22, "~(p & q)", "NegI", 2, subs=[[19, 21]]),
    _l(23, "~q", "As", 2),
    _l(24, "p & q", "As", 3),
    _l(25, "q", "ConjE", 3, [24]),
    _l(26, "!", "FalsumI", 3, [25, 23]),
    _l(27, "~(p & q)", "NegI", 2, subs=[[24, 26]]),
    _l(28, "~(p & q)", "DisjE", 1, [17], [[18, 22], [23, 27]]),
    _l(29, "(~(p & q)) = (~p | ~q)", "BicondI", 0, subs=[[1, 16], [17, 28]]),
]

# --------------------------------------------------------- material conditional
# -> direction is indirect for the same reason as De Morgan II's hard half:
# `~p | q` names no rule to aim at, so its negation is assumed instead.
# <- direction eliminates the disjunction by cases; the second case needs a
# \Reit because \CondI's consequent must be derived inside the p-subproof, not
# merely accessible from it.
PROOFS["material-conditional"] = [
    _l(1, "p > q", "As", 1),
    _l(2, "~(~p | q)", "As", 2),
    _l(3, "~p", "As", 3),
    _l(4, "~p | q", "DisjI", 3, [3]),
    _l(5, "!", "FalsumI", 3, [4, 2]),
    _l(6, "~~p", "NegI", 2, subs=[[3, 5]]),
    _l(7, "p", "NegE", 2, [6]),
    _l(8, "q", "As", 3),
    _l(9, "~p | q", "DisjI", 3, [8]),
    _l(10, "!", "FalsumI", 3, [9, 2]),
    _l(11, "~q", "NegI", 2, subs=[[8, 10]]),
    _l(12, "q", "CondE", 2, [1, 7]),
    _l(13, "!", "FalsumI", 2, [12, 11]),
    _l(14, "~~(~p | q)", "NegI", 1, subs=[[2, 13]]),
    _l(15, "~p | q", "NegE", 1, [14]),
    _l(16, "~p | q", "As", 1),
    _l(17, "~p", "As", 2),
    _l(18, "p", "As", 3),
    _l(19, "~q", "As", 4),
    _l(20, "!", "FalsumI", 4, [18, 17]),
    _l(21, "~~q", "NegI", 3, subs=[[19, 20]]),
    _l(22, "q", "NegE", 3, [21]),
    _l(23, "p > q", "CondI", 2, subs=[[18, 22]]),
    _l(24, "q", "As", 2),
    _l(25, "p", "As", 3),
    _l(26, "q", "Reit", 3, [24]),
    _l(27, "p > q", "CondI", 2, subs=[[25, 26]]),
    _l(28, "p > q", "DisjE", 1, [16], [[17, 23], [24, 27]]),
    _l(29, "(p > q) = (~p | q)", "BicondI", 0, subs=[[1, 15], [16, 28]]),
]

# ------------------------------------------------------ distribution, in full
# The one-directional `distribution` proof is lines 1-10 of the -> half here,
# verbatim; the <- half is its mirror, and BicondI joins them without needing
# an intermediate CondI on either side (matching the two De Morgan proofs
# above).
PROOFS["distribution-conjunction"] = [
    _l(1, "p & (q | r)", "As", 1),
    _l(2, "p", "ConjE", 1, [1]),
    _l(3, "q | r", "ConjE", 1, [1]),
    _l(4, "q", "As", 2),
    _l(5, "p & q", "ConjI", 2, [2, 4]),
    _l(6, "(p & q) | (p & r)", "DisjI", 2, [5]),
    _l(7, "r", "As", 2),
    _l(8, "p & r", "ConjI", 2, [2, 7]),
    _l(9, "(p & q) | (p & r)", "DisjI", 2, [8]),
    _l(10, "(p & q) | (p & r)", "DisjE", 1, [3], [[4, 6], [7, 9]]),
    _l(11, "(p & q) | (p & r)", "As", 1),
    _l(12, "p & q", "As", 2),
    _l(13, "p", "ConjE", 2, [12]),
    _l(14, "q", "ConjE", 2, [12]),
    _l(15, "q | r", "DisjI", 2, [14]),
    _l(16, "p & (q | r)", "ConjI", 2, [13, 15]),
    _l(17, "p & r", "As", 2),
    _l(18, "p", "ConjE", 2, [17]),
    _l(19, "r", "ConjE", 2, [17]),
    _l(20, "q | r", "DisjI", 2, [19]),
    _l(21, "p & (q | r)", "ConjI", 2, [18, 20]),
    _l(22, "p & (q | r)", "DisjE", 1, [11], [[12, 16], [17, 21]]),
    _l(23, "(p & (q | r)) = ((p & q) | (p & r))", "BicondI", 0,
       subs=[[1, 10], [11, 22]]),
]

# -------------------------------------------------------- distribution, dual
# -> direction is the routine half: one case split on the premise. <- is the
# one that costs something -- `p | q` alone does not name a disjunct, and the
# `q` case needs a second, nested case split on `p | r` before `q & r` can be
# assembled, three subproofs deep before the derivation closes.
PROOFS["distribution-disjunction"] = [
    _l(1, "p | (q & r)", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p | q", "DisjI", 2, [2]),
    _l(4, "p | r", "DisjI", 2, [2]),
    _l(5, "(p | q) & (p | r)", "ConjI", 2, [3, 4]),
    _l(6, "q & r", "As", 2),
    _l(7, "q", "ConjE", 2, [6]),
    _l(8, "r", "ConjE", 2, [6]),
    _l(9, "p | q", "DisjI", 2, [7]),
    _l(10, "p | r", "DisjI", 2, [8]),
    _l(11, "(p | q) & (p | r)", "ConjI", 2, [9, 10]),
    _l(12, "(p | q) & (p | r)", "DisjE", 1, [1], [[2, 5], [6, 11]]),
    _l(13, "(p | q) & (p | r)", "As", 1),
    _l(14, "p | q", "ConjE", 1, [13]),
    _l(15, "p | r", "ConjE", 1, [13]),
    _l(16, "p", "As", 2),
    _l(17, "p | (q & r)", "DisjI", 2, [16]),
    _l(18, "q", "As", 2),
    _l(19, "p", "As", 3),
    _l(20, "p | (q & r)", "DisjI", 3, [19]),
    _l(21, "r", "As", 3),
    _l(22, "q & r", "ConjI", 3, [18, 21]),
    _l(23, "p | (q & r)", "DisjI", 3, [22]),
    _l(24, "p | (q & r)", "DisjE", 2, [15], [[19, 20], [21, 23]]),
    _l(25, "p | (q & r)", "DisjE", 1, [14], [[16, 17], [18, 24]]),
    _l(26, "(p | (q & r)) = ((p | q) & (p | r))", "BicondI", 0,
       subs=[[1, 12], [13, 25]]),
]

# ---------------------------------------------------------- excluded middle
# The goal names no rule -- `p | ~p` is neither a conditional nor a negation
# -- so the reductio's own assumption, `~(p | ~p)`, is chosen rather than
# read off the connective. Two nested reductios, the inner one dictated
# (the goal `~p` names `NegI`), the outer one not.
PROOFS["excluded-middle"] = [
    _l(1, "~(p | ~p)", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p | ~p", "DisjI", 2, [2]),
    _l(4, "!", "FalsumI", 2, [3, 1]),
    _l(5, "~p", "NegI", 1, subs=[[2, 4]]),
    _l(6, "p | ~p", "DisjI", 1, [5]),
    _l(7, "~(p | ~p)", "Reit", 1, [1]),
    _l(8, "!", "FalsumI", 1, [6, 7]),
    _l(9, "~~(p | ~p)", "NegI", 0, subs=[[1, 8]]),
    _l(10, "p | ~p", "NegE", 0, [9]),
]

# ------------------------------------------------------------ non-contradiction
# The dual of excluded-middle, but not its equal in difficulty: the goal is
# already a negation, so ∼I is dictated the moment the assumption opens, and
# one subproof is the whole proof.
PROOFS["non-contradiction"] = [
    _l(1, "p & ~p", "As", 1),
    _l(2, "p", "ConjE", 1, [1]),
    _l(3, "~p", "ConjE", 1, [1]),
    _l(4, "!", "FalsumI", 1, [2, 3]),
    _l(5, "~(p & ~p)", "NegI", 0, subs=[[1, 4]]),
]

# ------------------------------------------------------------- negative explosion
# Same premise as ex-falso, opposite polarity of goal -- and that is exactly
# why it needs none of ex-falso's machinery. ~q names NegI directly, so there
# is no double negation to peel off afterwards: assume q, reach the same
# contradiction the premise already carries, done.
PROOFS["negative-explosion"] = [
    P(1, "p & ~p"),
    _l(2, "q", "As", 1),
    _l(3, "p", "ConjE", 1, [1]),
    _l(4, "~p", "ConjE", 1, [1]),
    _l(5, "!", "FalsumI", 1, [3, 4]),
    _l(6, "~q", "NegI", 0, subs=[[2, 5]]),
]

# -------------------------------------------------------------- paradox disjunction
# An undictated reductio on the whole disjunction, and each disjunct then has
# to be built from scratch inside it. The second half is the harder one: ~p
# gives a contradiction with any assumed p, but ~Exp means r cannot just be
# read off it -- a second, nested reductio (assume ~r) is needed to turn that
# contradiction into r itself.
PROOFS["paradox-disjunction"] = [
    _l(1, "~((q > p) | (p > r))", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "q", "As", 3),
    _l(4, "p", "Reit", 3, [2]),
    _l(5, "q > p", "CondI", 2, subs=[[3, 4]]),
    _l(6, "(q > p) | (p > r)", "DisjI", 2, [5]),
    _l(7, "!", "FalsumI", 2, [6, 1]),
    _l(8, "~p", "NegI", 1, subs=[[2, 7]]),
    _l(9, "p", "As", 2),
    _l(10, "~r", "As", 3),
    _l(11, "!", "FalsumI", 3, [9, 8]),
    _l(12, "~~r", "NegI", 2, subs=[[10, 11]]),
    _l(13, "r", "NegE", 2, [12]),
    _l(14, "p > r", "CondI", 1, subs=[[9, 13]]),
    _l(15, "(q > p) | (p > r)", "DisjI", 1, [14]),
    _l(16, "~((q > p) | (p > r))", "Reit", 1, [1]),
    _l(17, "!", "FalsumI", 1, [15, 16]),
    _l(18, "~~((q > p) | (p > r))", "NegI", 0, subs=[[1, 17]]),
    _l(19, "(q > p) | (p > r)", "NegE", 0, [18]),
]

# ----------------------------------------------------------------- the monster
# Same trick as paradox-disjunction, on the two-atom case: prove ~p first
# (the reductio's "if p held, q>p would follow" half), then use that ~p to
# get p>q the ex-falso way, since there is still no explosion rule.
PROOFS["the-monster"] = [
    _l(1, "~((p > q) | (q > p))", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "q", "As", 3),
    _l(4, "p", "Reit", 3, [2]),
    _l(5, "q > p", "CondI", 2, subs=[[3, 4]]),
    _l(6, "(p > q) | (q > p)", "DisjI", 2, [5]),
    _l(7, "!", "FalsumI", 2, [6, 1]),
    _l(8, "~p", "NegI", 1, subs=[[2, 7]]),
    _l(9, "p", "As", 2),
    _l(10, "~q", "As", 3),
    _l(11, "!", "FalsumI", 3, [9, 8]),
    _l(12, "~~q", "NegI", 2, subs=[[10, 11]]),
    _l(13, "q", "NegE", 2, [12]),
    _l(14, "p > q", "CondI", 1, subs=[[9, 13]]),
    _l(15, "(p > q) | (q > p)", "DisjI", 1, [14]),
    _l(16, "~((p > q) | (q > p))", "Reit", 1, [1]),
    _l(17, "!", "FalsumI", 1, [15, 16]),
    _l(18, "~~((p > q) | (q > p))", "NegI", 0, subs=[[1, 17]]),
    _l(19, "(p > q) | (q > p)", "NegE", 0, [18]),
]

# -------------------------------------------------------------- positive paradox
# The dictated half of the pair below: the goal names ⊃I outright, and the
# premise is already the consequent, so nothing but Reit stands between them.
PROOFS["positive-paradox"] = [
    P(1, "p"),
    _l(2, "q", "As", 1),
    _l(3, "p", "Reit", 1, [1]),
    _l(4, "q > p", "CondI", 0, subs=[[2, 3]]),
]

# -------------------------------------------------------------- negative paradox
# ⊃I names the outer move, but the consequent r is not just sitting there --
# assuming p collides with the premise ~p, and getting r out of that
# contradiction costs the same double-negation detour ex-falso needs, since
# there is no explosion rule to shortcut it.
PROOFS["negative-paradox"] = [
    P(1, "~p"),
    _l(2, "p", "As", 1),
    _l(3, "~r", "As", 2),
    _l(4, "!", "FalsumI", 2, [2, 1]),
    _l(5, "~~r", "NegI", 1, subs=[[3, 4]]),
    _l(6, "r", "NegE", 1, [5]),
    _l(7, "p > r", "CondI", 0, subs=[[2, 6]]),
]

# ------------------------------------------------------- first derivation of the course
# Two conjunctions in, one conjunction out, and nothing else: no assumption
# opens, because there is nothing here for &E and &I to need one for. The
# repeated p is a red herring -- each premise is read only for the conjunct
# the conclusion wants, and the other conjunct of each is never touched.
PROOFS["lecture9-first-derivation"] = [
    P(1, "p & (q | r)"),
    P(2, "(s > t) & p"),
    _l(3, "q | r", "ConjE", 0, [1]),
    _l(4, "s > t", "ConjE", 0, [2]),
    _l(5, "(q | r) & (s > t)", "ConjI", 0, [3, 4]),
]

# ---------------------------------------------------------------- first proof by cases
# The database's first ∨E. Both cases are the same one-line move -- &E on the
# assumed conjunction -- so the only new idea is the shape of the rule itself:
# split on the disjunction, reach the same formula down each branch, close.
PROOFS["lecture9-proof-by-cases"] = [
    P(1, "(p & q) | (p & r)"),
    _l(2, "p & q", "As", 1),
    _l(3, "p", "ConjE", 1, [2]),
    _l(4, "p & r", "As", 1),
    _l(5, "p", "ConjE", 1, [4]),
    _l(6, "p", "DisjE", 0, [1], subs=[[2, 3], [4, 5]]),
]

# ----------------------------------------------------------------- constructive dilemma
# The same ∨E shape as lecture9-proof-by-cases, but the split is on a bare
# premise rather than a conjunction sitting ready-boxed, so each case has to
# fire its own conditional before ∨I closes it out on the matching side.
PROOFS["constructive-dilemma"] = [
    P(1, "p | q"),
    P(2, "p > r"),
    P(3, "q > s"),
    _l(4, "p", "As", 1),
    _l(5, "r", "CondE", 1, [2, 4]),
    _l(6, "r | s", "DisjI", 1, [5]),
    _l(7, "q", "As", 1),
    _l(8, "s", "CondE", 1, [3, 7]),
    _l(9, "r | s", "DisjI", 1, [8]),
    _l(10, "r | s", "DisjE", 0, [1], subs=[[4, 6], [7, 9]]),
]

# --------------------------------------------------- three-link hypothetical syllogism
# hypothetical-syllogism's own move, run once more: assume p, fire ⊃E three
# times down the chain, discharge. Nothing new happens, which is the point --
# PS5.1 sets this one and not the two-premise form for exactly that reason.
PROOFS["hypothetical-syllogism-3link"] = [
    P(1, "p > q"),
    P(2, "q > r"),
    P(3, "r > s"),
    _l(4, "p", "As", 1),
    _l(5, "q", "CondE", 1, [1, 4]),
    _l(6, "r", "CondE", 1, [2, 5]),
    _l(7, "s", "CondE", 1, [3, 6]),
    _l(8, "p > s", "CondI", 0, subs=[[4, 7]]),
]

# ------------------------------------------------------ double-consequent reductio
# Assume ~p and both premises hand back a formula and its own negation, so ⊥
# is one CondE apiece away. The conclusion is positive, though, so ~I's
# double negative needs ~E to strip it -- the one thing lecture8-chain, whose
# goal is already a negation, never has to do.
PROOFS["double-consequent-reductio"] = [
    P(1, "~p > q"),
    P(2, "~p > ~q"),
    _l(3, "~p", "As", 1),
    _l(4, "q", "CondE", 1, [1, 3]),
    _l(5, "~q", "CondE", 1, [2, 3]),
    _l(6, "!", "FalsumI", 1, [4, 5]),
    _l(7, "~~p", "NegI", 0, subs=[[3, 6]]),
    _l(8, "p", "NegE", 0, [7]),
]

# ------------------------------------------------------------- disjunctive syllogism
# No dedicated elimination rule for ∨ plus a denied disjunct, so the case
# split earns q the hard way: assume p, collide it with ~p for ⊥, then a
# reductio nested inside that case strips the ⊥ down to q. The other case is
# trivial -- assuming q already gives the goal, so Reit is the whole of it.
PROOFS["disjunctive-syllogism"] = [
    P(1, "p | q"),
    P(2, "~p"),
    _l(3, "p", "As", 1),
    _l(4, "~q", "As", 2),
    _l(5, "!", "FalsumI", 2, [3, 2]),
    _l(6, "~~q", "NegI", 1, subs=[[4, 5]]),
    _l(7, "q", "NegE", 1, [6]),
    _l(8, "q", "As", 1),
    _l(9, "q", "Reit", 1, [8]),
    _l(10, "q", "DisjE", 0, [1], subs=[[3, 7], [8, 9]]),
]

# ---------------------------------------------------- contraposition instance
# One conditional-introduction wrapped around one reductio: the assumption
# ~l opens the outer subproof, and reaching its goal ~b costs a second,
# nested subproof (assume b, collide it with the premise's l, discharge).
PROOFS["contraposition-bakery"] = [
    P(1, "b > l"),
    _l(2, "~l", "As", 1),
    _l(3, "b", "As", 2),
    _l(4, "l", "CondE", 2, [1, 3]),
    _l(5, "!", "FalsumI", 2, [4, 2]),
    _l(6, "~b", "NegI", 1, subs=[[3, 5]]),
    _l(7, "~l > ~b", "CondI", 0, subs=[[2, 6]]),
]

# ------------------------------------------------- self-undermining conditional
# The premise alone supplies both halves of its own contradiction: assume c,
# the premise hands back ~c immediately, and the assumption is right there to
# collide with it. No second premise is needed the way double-consequent-
# reductio needs one.
PROOFS["self-undermining-conditional"] = [
    P(1, "c > ~c"),
    _l(2, "c", "As", 1),
    _l(3, "~c", "CondE", 1, [1, 2]),
    _l(4, "c", "Reit", 1, [2]),
    _l(5, "!", "FalsumI", 1, [4, 3]),
    _l(6, "~c", "NegI", 0, subs=[[2, 5]]),
]

# --------------------------------------------------------- vacuous validity
# The premises are jointly unsatisfiable but neither is alone, so the
# contradiction has to be manufactured rather than read off directly: a
# reductio on ~q collects p and q together (each biconditional handing the
# other its matching side), which then hands back p and ~q the same way a
# second time for the unconditional collision. From there it is the same
# explosion every vacuously-valid entry needs, since \Exp is retired: assume
# the negation of the target, reiterate the contradiction, close it out.
PROOFS["vacuous-validity-unsat-premises"] = [
    P(1, "p = q"),
    P(2, "p = ~q"),
    _l(3, "~q", "As", 1),
    _l(4, "p", "BicondE", 1, [2, 3]),
    _l(5, "q", "BicondE", 1, [1, 4]),
    _l(6, "~q", "Reit", 1, [3]),
    _l(7, "!", "FalsumI", 1, [5, 6]),
    _l(8, "~~q", "NegI", 0, subs=[[3, 7]]),
    _l(9, "q", "NegE", 0, [8]),
    _l(10, "p", "BicondE", 0, [1, 9]),
    _l(11, "~q", "BicondE", 0, [2, 10]),
    _l(12, "!", "FalsumI", 0, [9, 11]),
    _l(13, "~r", "As", 1),
    _l(14, "!", "Reit", 1, [12]),
    _l(15, "~~r", "NegI", 0, subs=[[13, 14]]),
    _l(16, "r", "NegE", 0, [15]),
]

# ------------------------------------------------------------ importation-instance
# A plain application: no subproof, no choice of rule at any step.
PROOFS["importation-instance"] = [
    P(1, "(p & q) > r"),
    P(2, "p"),
    P(3, "q"),
    _l(4, "p & q", "ConjI", 0, [2, 3]),
    _l(5, "r", "CondE", 0, [1, 4]),
]

# -------------------------------------------------------------- importation-shaped
PROOFS["importation-shaped"] = [
    P(1, "p > (q & r)"),
    _l(2, "p & q", "As", 1),
    _l(3, "p", "ConjE", 1, [2]),
    _l(4, "q & r", "CondE", 1, [1, 3]),
    _l(5, "r", "ConjE", 1, [4]),
    _l(6, "(p & q) > r", "CondI", 0, subs=[[2, 5]]),
]

# ------------------------------------------------------------------- importation
# The first seven lines of `exportation`'s own proof: here `p > (q > r)` is a
# premise in its own right rather than an assumption discharged by \BicondI.
PROOFS["importation"] = [
    P(1, "p > (q > r)"),
    _l(2, "p & q", "As", 1),
    _l(3, "p", "ConjE", 1, [2]),
    _l(4, "q", "ConjE", 1, [2]),
    _l(5, "q > r", "CondE", 1, [1, 3]),
    _l(6, "r", "CondE", 1, [5, 4]),
    _l(7, "(p & q) > r", "CondI", 0, subs=[[2, 6]]),
]

# -------------------------------------------------------------------- absorption
PROOFS["absorption"] = [
    P(1, "p > q"),
    _l(2, "p", "As", 1),
    _l(3, "q", "CondE", 1, [1, 2]),
    _l(4, "p & q", "ConjI", 1, [2, 3]),
    _l(5, "p > (p & q)", "CondI", 0, subs=[[2, 4]]),
]

# ------------------------------------------------------ negated-conditional-intro
# The goal is a negation, so ∼I is dictated -- the premise hands over both
# halves of the contradiction (q via ⊃E, ∼q via &E) with nothing to search for.
PROOFS["negated-conditional-intro"] = [
    P(1, "p & ~q"),
    _l(2, "p > q", "As", 1),
    _l(3, "p", "ConjE", 1, [1]),
    _l(4, "~q", "ConjE", 1, [1]),
    _l(5, "q", "CondE", 1, [2, 3]),
    _l(6, "!", "FalsumI", 1, [5, 4]),
    _l(7, "~(p > q)", "NegI", 0, subs=[[2, 6]]),
]

# ------------------------------------------------------------------ buried-conjunct
# `s` in the second premise is never used again -- the whole chain runs on `p`.
PROOFS["buried-conjunct"] = [
    P(1, "p > (q & ~r)"),
    P(2, "p & s"),
    _l(3, "p", "ConjE", 0, [2]),
    _l(4, "q & ~r", "CondE", 0, [1, 3]),
    _l(5, "~r", "ConjE", 0, [4]),
]

# ----------------------------------------- inconsistent-biconditional-explosion
# The premise alone is a contradiction, so the goal never actually drives the
# proof: assume p (outer, for CondI), the biconditional immediately hands back
# ~p, and that pair is available to close off any inner assumption -- here q,
# discharged straight to ~q by NegI. Nothing about the conclusion's shape
# matters; it could have been any formula.
PROOFS["inconsistent-biconditional-explosion"] = [
    P(1, "~p = p"),
    _l(2, "p", "As", 1),
    _l(3, "~p", "BicondE", 1, [1, 2]),
    _l(4, "q", "As", 2),
    _l(5, "p", "Reit", 2, [2]),
    _l(6, "!", "FalsumI", 2, [5, 3]),
    _l(7, "~q", "NegI", 1, subs=[[4, 6]]),
    _l(8, "p > ~q", "CondI", 0, subs=[[2, 7]]),
]

# ------------------------------------------------------- classical-reductio-chain
# The only step not dictated by a rule's own shape: `q` is not itself a
# negation, so assuming ~q to get it is the classical move Lecture 10 flags.
# Everything either side of that reductio is a straight run of CondE/ConjE.
PROOFS["classical-reductio-chain"] = [
    P(1, "p > (q > r)"),
    P(2, "~q > ~p"),
    P(3, "s & p"),
    _l(4, "p", "ConjE", 0, [3]),
    _l(5, "~q", "As", 1),
    _l(6, "~p", "CondE", 1, [2, 5]),
    _l(7, "p", "Reit", 1, [4]),
    _l(8, "!", "FalsumI", 1, [7, 6]),
    _l(9, "~~q", "NegI", 0, subs=[[5, 8]]),
    _l(10, "q", "NegE", 0, [9]),
    _l(11, "q > r", "CondE", 0, [1, 4]),
    _l(12, "r", "CondE", 0, [11, 10]),
]

# -------------------------------------------------------------------- addition
# The shortest ⊃I over a ∨I in the database: assume p, disjoin in q for free,
# discharge. No reductio, no second premise -- one line each way.
PROOFS["addition"] = [
    _l(1, "p", "As", 1),
    _l(2, "p | q", "DisjI", 1, [1]),
    _l(3, "p > (p | q)", "CondI", 0, subs=[[1, 2]]),
]

# ------------------------------------------------------------- conditional-identity
# The assumption already is the conclusion, so ⊃I fires with nothing between
# open and close -- the smallest a valid entry's proof can be.
PROOFS["conditional-identity"] = [
    _l(1, "p", "As", 1),
    _l(2, "p", "Reit", 1, [1]),
    _l(3, "p > p", "CondI", 0, subs=[[1, 2]]),
]

# --------------------------------------------------------- bicond-elim-to-cond
# Assume the biconditional (for the outer ⊃I), then p (for the inner ⊃I), and
# ≡E crosses straight from p to q -- one subproof nested inside the other, the
# only choice this proof has to make.
PROOFS["bicond-elim-to-cond"] = [
    _l(1, "p = q", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "q", "BicondE", 2, [1, 2]),
    _l(4, "p > q", "CondI", 1, subs=[[2, 3]]),
    _l(5, "(p = q) > (p > q)", "CondI", 0, subs=[[1, 4]]),
]

# -------------------------------------------- disjunction-with-vacuous-conditional
# No premises to draw on, so both disjuncts have to come from the same outer
# reductio: assuming p gives the disjunction directly and, once discharged,
# ~p; assuming p again under that ~p forces a second, nested reductio to get
# q out of the contradiction (no explosion rule), which is what makes this
# tautology's proof harder than its two-line table lets on.
PROOFS["disjunction-with-vacuous-conditional"] = [
    _l(1, "~(p | (p > q))", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p | (p > q)", "DisjI", 2, [2]),
    _l(4, "!", "FalsumI", 2, [3, 1]),
    _l(5, "~p", "NegI", 1, subs=[[2, 4]]),
    _l(6, "p", "As", 2),
    _l(7, "~q", "As", 3),
    _l(8, "!", "FalsumI", 3, [6, 5]),
    _l(9, "~~q", "NegI", 2, subs=[[7, 8]]),
    _l(10, "q", "NegE", 2, [9]),
    _l(11, "p > q", "CondI", 1, subs=[[6, 10]]),
    _l(12, "p | (p > q)", "DisjI", 1, [11]),
    _l(13, "~(p | (p > q))", "Reit", 1, [1]),
    _l(14, "!", "FalsumI", 1, [12, 13]),
    _l(15, "~~(p | (p > q))", "NegI", 0, subs=[[1, 14]]),
    _l(16, "p | (p > q)", "NegE", 0, [15]),
]

# ------------------------------------------------- conjunction-with-its-own-negation
# The premise buries its own negation two conjunctions deep; &E twice unpacks
# it and FalsumI ends the proof on the spot -- no assumption, no reductio.
PROOFS["conjunction-with-its-own-negation"] = [
    P(1, "(p & q) & ~p"),
    _l(2, "~p", "ConjE", 0, [1]),
    _l(3, "p & q", "ConjE", 0, [1]),
    _l(4, "p", "ConjE", 0, [3]),
    _l(5, "!", "FalsumI", 0, [4, 2]),
]

# ------------------------------------------------- biconditional-with-its-own-negation
# The premise alone is unsatisfiable, but ≡ hides it a level deeper than &
# does: an assumption of p is needed to pull ~p out with ≡E, then the same
# biconditional read the other way pulls p back out of that ~p.
PROOFS["biconditional-with-its-own-negation"] = [
    P(1, "p = ~p"),
    _l(2, "p", "As", 1),
    _l(3, "~p", "BicondE", 1, [1, 2]),
    _l(4, "p", "Reit", 1, [2]),
    _l(5, "!", "FalsumI", 1, [4, 3]),
    _l(6, "~p", "NegI", 0, subs=[[2, 5]]),
    _l(7, "p", "BicondE", 0, [1, 6]),
    _l(8, "!", "FalsumI", 0, [7, 6]),
]

# ------------------------------------------------------- disjunction-as-conditional
# The mirror of material-conditional's own proof, substituting ~p for p: each
# direction is a full classical reductio, since neither goal -- a disjunction,
# a conditional -- names a rule that builds it directly from what is given.
PROOFS["disjunction-as-conditional"] = [
    _l(1, "p | q", "As", 1),
    _l(2, "~p", "As", 2),
    _l(3, "p", "As", 3),
    _l(4, "~q", "As", 4),
    _l(5, "!", "FalsumI", 4, [3, 2]),
    _l(6, "~~q", "NegI", 3, subs=[[4, 5]]),
    _l(7, "q", "NegE", 3, [6]),
    _l(8, "q", "As", 3),
    _l(9, "q", "Reit", 3, [8]),
    _l(10, "q", "DisjE", 2, [1], subs=[[3, 7], [8, 9]]),
    _l(11, "~p > q", "CondI", 1, subs=[[2, 10]]),
    _l(12, "~p > q", "As", 1),
    _l(13, "~(p | q)", "As", 2),
    _l(14, "~p", "As", 3),
    _l(15, "q", "CondE", 3, [12, 14]),
    _l(16, "p | q", "DisjI", 3, [15]),
    _l(17, "!", "FalsumI", 3, [16, 13]),
    _l(18, "~~p", "NegI", 2, subs=[[14, 17]]),
    _l(19, "p", "NegE", 2, [18]),
    _l(20, "p | q", "DisjI", 2, [19]),
    _l(21, "~(p | q)", "Reit", 2, [13]),
    _l(22, "!", "FalsumI", 2, [20, 21]),
    _l(23, "~~(p | q)", "NegI", 1, subs=[[13, 22]]),
    _l(24, "p | q", "NegE", 1, [23]),
    _l(25, "(p | q) = (~p > q)", "BicondI", 0, subs=[[1, 11], [12, 24]]),
]

# ----------------------------------------------------- biconditional-as-agreement
# Two De Morgan pairs run back to back and stitched together with ≡I. The
# forward half first classically splits on p to get (p&q)∨(~p&~q) out of
# p≡q, then converts each disjunct to the matching negated-disjunction half
# of the goal by the same reductio the two De Morgan entries already use; the
# backward half runs the same case split on the goal's own disjunction.
PROOFS["biconditional-as-agreement"] = [
    _l(1, "p = q", "As", 1),
    _l(2, "~((p & q) | (~p & ~q))", "As", 2),
    _l(3, "~p", "As", 3),
    _l(4, "q", "As", 4),
    _l(5, "p", "BicondE", 4, [1, 4]),
    _l(6, "!", "FalsumI", 4, [5, 3]),
    _l(7, "~q", "NegI", 3, subs=[[4, 6]]),
    _l(8, "~p & ~q", "ConjI", 3, [3, 7]),
    _l(9, "(p & q) | (~p & ~q)", "DisjI", 3, [8]),
    _l(10, "!", "FalsumI", 3, [9, 2]),
    _l(11, "~~p", "NegI", 2, subs=[[3, 10]]),
    _l(12, "p", "NegE", 2, [11]),
    _l(13, "q", "BicondE", 2, [1, 12]),
    _l(14, "p & q", "ConjI", 2, [12, 13]),
    _l(15, "(p & q) | (~p & ~q)", "DisjI", 2, [14]),
    _l(16, "~((p & q) | (~p & ~q))", "Reit", 2, [2]),
    _l(17, "!", "FalsumI", 2, [15, 16]),
    _l(18, "~~((p & q) | (~p & ~q))", "NegI", 1, subs=[[2, 17]]),
    _l(19, "(p & q) | (~p & ~q)", "NegE", 1, [18]),
    _l(20, "p & q", "As", 2),
    _l(21, "~p | ~q", "As", 3),
    _l(22, "~p", "As", 4),
    _l(23, "p", "ConjE", 4, [20]),
    _l(24, "~p", "Reit", 4, [22]),
    _l(25, "!", "FalsumI", 4, [23, 24]),
    _l(26, "~q", "As", 4),
    _l(27, "q", "ConjE", 4, [20]),
    _l(28, "~q", "Reit", 4, [26]),
    _l(29, "!", "FalsumI", 4, [27, 28]),
    _l(30, "!", "DisjE", 3, [21], subs=[[22, 25], [26, 29]]),
    _l(31, "~(~p | ~q)", "NegI", 2, subs=[[21, 30]]),
    _l(32, "~(~p | ~q) | ~(p | q)", "DisjI", 2, [31]),
    _l(33, "~p & ~q", "As", 2),
    _l(34, "p | q", "As", 3),
    _l(35, "p", "As", 4),
    _l(36, "~p", "ConjE", 4, [33]),
    _l(37, "p", "Reit", 4, [35]),
    _l(38, "!", "FalsumI", 4, [37, 36]),
    _l(39, "q", "As", 4),
    _l(40, "~q", "ConjE", 4, [33]),
    _l(41, "q", "Reit", 4, [39]),
    _l(42, "!", "FalsumI", 4, [41, 40]),
    _l(43, "!", "DisjE", 3, [34], subs=[[35, 38], [39, 42]]),
    _l(44, "~(p | q)", "NegI", 2, subs=[[34, 43]]),
    _l(45, "~(~p | ~q) | ~(p | q)", "DisjI", 2, [44]),
    _l(46, "~(~p | ~q) | ~(p | q)", "DisjE", 1, [19], subs=[[20, 32], [33, 45]]),
    _l(47, "~(~p | ~q) | ~(p | q)", "As", 1),
    _l(48, "~(~p | ~q)", "As", 2),
    _l(49, "~p", "As", 3),
    _l(50, "~p | ~q", "DisjI", 3, [49]),
    _l(51, "!", "FalsumI", 3, [50, 48]),
    _l(52, "~~p", "NegI", 2, subs=[[49, 51]]),
    _l(53, "p", "NegE", 2, [52]),
    _l(54, "~q", "As", 3),
    _l(55, "~p | ~q", "DisjI", 3, [54]),
    _l(56, "!", "FalsumI", 3, [55, 48]),
    _l(57, "~~q", "NegI", 2, subs=[[54, 56]]),
    _l(58, "q", "NegE", 2, [57]),
    _l(59, "p", "As", 3),
    _l(60, "q", "Reit", 3, [58]),
    _l(61, "q", "As", 3),
    _l(62, "p", "Reit", 3, [53]),
    _l(63, "p = q", "BicondI", 2, subs=[[59, 60], [61, 62]]),
    _l(64, "~(p | q)", "As", 2),
    _l(65, "p", "As", 3),
    _l(66, "p | q", "DisjI", 3, [65]),
    _l(67, "!", "FalsumI", 3, [66, 64]),
    _l(68, "~p", "NegI", 2, subs=[[65, 67]]),
    _l(69, "q", "As", 3),
    _l(70, "p | q", "DisjI", 3, [69]),
    _l(71, "!", "FalsumI", 3, [70, 64]),
    _l(72, "~q", "NegI", 2, subs=[[69, 71]]),
    _l(73, "p", "As", 3),
    _l(74, "~q", "As", 4),
    _l(75, "!", "FalsumI", 4, [73, 68]),
    _l(76, "~~q", "NegI", 3, subs=[[74, 75]]),
    _l(77, "q", "NegE", 3, [76]),
    _l(78, "q", "As", 3),
    _l(79, "~p", "As", 4),
    _l(80, "!", "FalsumI", 4, [78, 72]),
    _l(81, "~~p", "NegI", 3, subs=[[79, 80]]),
    _l(82, "p", "NegE", 3, [81]),
    _l(83, "p = q", "BicondI", 2, subs=[[73, 77], [78, 82]]),
    _l(84, "p = q", "DisjE", 1, [47], subs=[[48, 63], [64, 83]]),
    _l(85, "(p = q) = (~(~p | ~q) | ~(p | q))", "BicondI", 0, subs=[[1, 46], [47, 84]]),
]

# --------------------------------------------------------------- conditional failure
# ~(p⊃q) is exactly the condition under which a conditional fails. The -> half
# derives p and ~q one at a time, each by the vacuous-truth pattern (assume
# the negation of the target; note p and ~p already collide; dig the target
# back out of that with a nested reductio). The <- half is the three-line
# reductio already on file as negated-conditional-intro, folded into the
# other side of ≡I.
PROOFS["conditional-failure"] = [
    _l(1, "~(p > q)", "As", 1),
    _l(2, "~p", "As", 2),
    _l(3, "p", "As", 3),
    _l(4, "p", "Reit", 3, [3]),
    _l(5, "!", "FalsumI", 3, [4, 2]),
    _l(6, "~q", "As", 4),
    _l(7, "!", "Reit", 4, [5]),
    _l(8, "~~q", "NegI", 3, subs=[[6, 7]]),
    _l(9, "q", "NegE", 3, [8]),
    _l(10, "p > q", "CondI", 2, subs=[[3, 9]]),
    _l(11, "!", "FalsumI", 2, [10, 1]),
    _l(12, "~~p", "NegI", 1, subs=[[2, 11]]),
    _l(13, "p", "NegE", 1, [12]),
    _l(14, "q", "As", 2),
    _l(15, "p", "As", 3),
    _l(16, "q", "Reit", 3, [14]),
    _l(17, "p > q", "CondI", 2, subs=[[15, 16]]),
    _l(18, "!", "FalsumI", 2, [17, 1]),
    _l(19, "~q", "NegI", 1, subs=[[14, 18]]),
    _l(20, "p & ~q", "ConjI", 1, [13, 19]),
    _l(21, "p & ~q", "As", 1),
    _l(22, "p > q", "As", 2),
    _l(23, "p", "ConjE", 2, [21]),
    _l(24, "~q", "ConjE", 2, [21]),
    _l(25, "q", "CondE", 2, [22, 23]),
    _l(26, "!", "FalsumI", 2, [25, 24]),
    _l(27, "~(p > q)", "NegI", 1, subs=[[22, 26]]),
    _l(28, "(~(p > q)) = (p & ~q)", "BicondI", 0, subs=[[1, 20], [21, 27]]),
]

# ------------------------------------------------------ vacuous antecedent disjunction
# The <- half is trivial -- assume ~p, reiterate the already-given p∨q,
# ⊃I closes it. The -> half is the one that earns the entry's keep: nothing
# about the goal p∨q names a rule, so it is proved by cases on p itself
# (built here as its own excluded-middle instance): case p, ∨I finishes in
# one step; case ~p, the premise's own ⊃E hands back p∨q directly.
PROOFS["vacuous-antecedent-disjunction"] = [
    _l(1, "~(p | ~p)", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p | ~p", "DisjI", 2, [2]),
    _l(4, "!", "FalsumI", 2, [3, 1]),
    _l(5, "~p", "NegI", 1, subs=[[2, 4]]),
    _l(6, "p | ~p", "DisjI", 1, [5]),
    _l(7, "~(p | ~p)", "Reit", 1, [1]),
    _l(8, "!", "FalsumI", 1, [6, 7]),
    _l(9, "~~(p | ~p)", "NegI", 0, subs=[[1, 8]]),
    _l(10, "p | ~p", "NegE", 0, [9]),
    _l(11, "~p > (p | q)", "As", 1),
    _l(12, "p", "As", 2),
    _l(13, "p | q", "DisjI", 2, [12]),
    _l(14, "~p", "As", 2),
    _l(15, "p | q", "CondE", 2, [11, 14]),
    _l(16, "p | q", "DisjE", 1, [10], subs=[[12, 13], [14, 15]]),
    _l(17, "p | q", "As", 1),
    _l(18, "~p", "As", 2),
    _l(19, "p | q", "Reit", 2, [17]),
    _l(20, "~p > (p | q)", "CondI", 1, subs=[[18, 19]]),
    _l(21, "(~p > (p | q)) = (p | q)", "BicondI", 0, subs=[[11, 16], [17, 20]]),
]


# -------------------------------------------------------------- permutation
# Pure ⊃, no falsum: two nested ⊃I's around two ⊃E's. p is accessible
# throughout the inner subproof without needing to be reiterated -- it is
# cited, not copied into a new role.
PROOFS["permutation"] = [
    P(1, "p > (q > r)"),
    _l(2, "q", "As", 1),
    _l(3, "p", "As", 2),
    _l(4, "q > r", "CondE", 2, [1, 3]),
    _l(5, "r", "CondE", 2, [4, 2]),
    _l(6, "p > r", "CondI", 1, subs=[[3, 5]]),
    _l(7, "q > (p > r)", "CondI", 0, subs=[[2, 6]]),
]

# ------------------------------------------------------- contraction-detached
# Same move as contraction-w's proof, one ⊃I shorter: the outer conditional
# arrives as a premise rather than as something to be introduced.
PROOFS["contraction-detached"] = [
    P(1, "p > (p > q)"),
    _l(2, "p", "As", 1),
    _l(3, "p > q", "CondE", 1, [1, 2]),
    _l(4, "q", "CondE", 1, [3, 2]),
    _l(5, "p > q", "CondI", 0, subs=[[2, 4]]),
]

# ------------------------------------------------------------------ resolution
# Case split on the first premise. The p-case is immediate (∨I). The q-case
# needs a second case split on the second premise: the r-case is immediate
# (∨I), but the ~q-case contradicts the outer q directly -- and since there
# is no explosion rule, cashing that contradiction out as p∨r costs a
# reductio nested one level deeper still (assume ~(p∨r), reach ⊥ again,
# ~I, ~E). Five subproofs, three of them nested.
PROOFS["resolution"] = [
    P(1, "p | q"),
    P(2, "~q | r"),
    _l(3, "p", "As", 1),
    _l(4, "p | r", "DisjI", 1, [3]),
    _l(5, "q", "As", 1),
    _l(6, "~q", "As", 2),
    _l(7, "~(p | r)", "As", 3),
    _l(8, "!", "FalsumI", 3, [5, 6]),
    _l(9, "~~(p | r)", "NegI", 2, subs=[[7, 8]]),
    _l(10, "p | r", "NegE", 2, [9]),
    _l(11, "r", "As", 2),
    _l(12, "p | r", "DisjI", 2, [11]),
    _l(13, "p | r", "DisjE", 1, [2], subs=[[6, 10], [11, 12]]),
    _l(14, "p | r", "DisjE", 0, [1], subs=[[3, 4], [5, 13]]),
]

# -------------------------------------------------------------- prefixing
# Same combinator shape as permutation, one level of nesting attaching a
# fresh antecedent r instead of swapping the two already there.
PROOFS["prefixing"] = [
    P(1, "p > q"),
    _l(2, "r > p", "As", 1),
    _l(3, "r", "As", 2),
    _l(4, "p", "CondE", 2, [2, 3]),
    _l(5, "q", "CondE", 2, [1, 4]),
    _l(6, "r > q", "CondI", 1, subs=[[3, 5]]),
    _l(7, "(r > p) > (r > q)", "CondI", 0, subs=[[2, 6]]),
]

# ---------------------------------------------------- material-implication-drill
# Identical shape to negative-paradox's own proof, with ~p doing the work
# negative-paradox's premise does directly: assume the antecedent, assume
# the reductio's target negated, collide it with the premise pair, and take
# the double-negation-elimination route back out.
PROOFS["material-implication-drill"] = [
    P(1, "p"),
    _l(2, "~p", "As", 1),
    _l(3, "~q", "As", 2),
    _l(4, "!", "FalsumI", 2, [1, 2]),
    _l(5, "~~q", "NegI", 1, subs=[[3, 4]]),
    _l(6, "q", "NegE", 1, [5]),
    _l(7, "~p > q", "CondI", 0, subs=[[2, 6]]),
]

# --------------------------------------------- associativity of the biconditional
# Both directions by ≡I, and the work is all in the two halves that have to
# manufacture a biconditional rather than take one apart. The system has no
# excluded middle and no explosion, so every "and now suppose the other case"
# is a reductio written out in full: lines 14-23 build `q ≡ r` from ∼q and ∼r,
# and 63-71 build `p ≡ q` from a contradiction on one side and ≡E on the other.
# 77 lines. A brute-force split on all three atoms runs past 260.
PROOFS["associativity-of-biconditional"] = [
    _l(1, "p = (q = r)", "As", 1),
    _l(2, "p = q", "As", 2),
    _l(3, "~r", "As", 3),
    _l(4, "p", "As", 4),
    _l(5, "q", "BicondE", 4, [2, 4]),
    _l(6, "q = r", "BicondE", 4, [1, 4]),
    _l(7, "r", "BicondE", 4, [6, 5]),
    _l(8, "!", "FalsumI", 4, [7, 3]),
    _l(9, "~p", "NegI", 3, subs=[[4, 8]]),
    _l(10, "q", "As", 4),
    _l(11, "p", "BicondE", 4, [2, 10]),
    _l(12, "!", "FalsumI", 4, [11, 9]),
    _l(13, "~q", "NegI", 3, subs=[[10, 12]]),
    _l(14, "q", "As", 4),
    _l(15, "~r", "As", 5),
    _l(16, "!", "FalsumI", 5, [14, 13]),
    _l(17, "~~r", "NegI", 4, subs=[[15, 16]]),
    _l(18, "r", "NegE", 4, [17]),
    _l(19, "r", "As", 4),
    _l(20, "~q", "As", 5),
    _l(21, "!", "FalsumI", 5, [19, 3]),
    _l(22, "~~q", "NegI", 4, subs=[[20, 21]]),
    _l(23, "q", "NegE", 4, [22]),
    _l(24, "q = r", "BicondI", 3, subs=[[14, 18], [19, 23]]),
    _l(25, "p", "BicondE", 3, [1, 24]),
    _l(26, "!", "FalsumI", 3, [25, 9]),
    _l(27, "~~r", "NegI", 2, subs=[[3, 26]]),
    _l(28, "r", "NegE", 2, [27]),
    _l(29, "r", "As", 2),
    _l(30, "p", "As", 3),
    _l(31, "q = r", "BicondE", 3, [1, 30]),
    _l(32, "q", "BicondE", 3, [31, 29]),
    _l(33, "q", "As", 3),
    _l(34, "q", "As", 4),
    _l(35, "r", "Reit", 4, [29]),
    _l(36, "r", "As", 4),
    _l(37, "q", "Reit", 4, [33]),
    _l(38, "q = r", "BicondI", 3, subs=[[34, 35], [36, 37]]),
    _l(39, "p", "BicondE", 3, [1, 38]),
    _l(40, "p = q", "BicondI", 2, subs=[[30, 32], [33, 39]]),
    _l(41, "(p = q) = r", "BicondI", 1, subs=[[2, 28], [29, 40]]),
    _l(42, "(p = q) = r", "As", 1),
    _l(43, "p", "As", 2),
    _l(44, "q", "As", 3),
    _l(45, "p", "As", 4),
    _l(46, "q", "Reit", 4, [44]),
    _l(47, "q", "As", 4),
    _l(48, "p", "Reit", 4, [43]),
    _l(49, "p = q", "BicondI", 3, subs=[[45, 46], [47, 48]]),
    _l(50, "r", "BicondE", 3, [42, 49]),
    _l(51, "r", "As", 3),
    _l(52, "p = q", "BicondE", 3, [42, 51]),
    _l(53, "q", "BicondE", 3, [52, 43]),
    _l(54, "q = r", "BicondI", 2, subs=[[44, 50], [51, 53]]),
    _l(55, "q = r", "As", 2),
    _l(56, "~p", "As", 3),
    _l(57, "p = q", "As", 4),
    _l(58, "r", "BicondE", 4, [42, 57]),
    _l(59, "q", "BicondE", 4, [55, 58]),
    _l(60, "p", "BicondE", 4, [57, 59]),
    _l(61, "!", "FalsumI", 4, [60, 56]),
    _l(62, "~(p = q)", "NegI", 3, subs=[[57, 61]]),
    _l(63, "p", "As", 4),
    _l(64, "~q", "As", 5),
    _l(65, "!", "FalsumI", 5, [63, 56]),
    _l(66, "~~q", "NegI", 4, subs=[[64, 65]]),
    _l(67, "q", "NegE", 4, [66]),
    _l(68, "q", "As", 4),
    _l(69, "r", "BicondE", 4, [55, 68]),
    _l(70, "p = q", "BicondE", 4, [42, 69]),
    _l(71, "p", "BicondE", 4, [70, 68]),
    _l(72, "p = q", "BicondI", 3, subs=[[63, 67], [68, 71]]),
    _l(73, "!", "FalsumI", 3, [72, 62]),
    _l(74, "~~p", "NegI", 2, subs=[[56, 73]]),
    _l(75, "p", "NegE", 2, [74]),
    _l(76, "p = (q = r)", "BicondI", 1, subs=[[43, 54], [55, 75]]),
    _l(77, "(p = (q = r)) = ((p = q) = r)", "BicondI", 0, subs=[[1, 41], [42, 76]]),
]

# --------------------------------------------------------- peirce-detached
# peirce-law's own proof with the outermost assumption-and-CondI stripped off:
# what that proof assumes at line 1 arrives here as the premise instead, so
# everything shifts up one level. The FalsumI at 5 needs no reiteration (line
# 2 is the *enclosing* subproof's assumption, not this one's); the FalsumI at
# 11 does, because by then the contradiction is with this subproof's own ~r.
PROOFS["peirce-detached"] = [
    P(1, "(r > ~w) > r"),
    _l(2, "~r", "As", 1),
    _l(3, "r", "As", 2),
    _l(4, "~~w", "As", 3),
    _l(5, "!", "FalsumI", 3, [3, 2]),
    _l(6, "~~~w", "NegI", 2, subs=[[4, 5]]),
    _l(7, "~w", "NegE", 2, [6]),
    _l(8, "r > ~w", "CondI", 1, subs=[[3, 7]]),
    _l(9, "r", "CondE", 1, [1, 8]),
    _l(10, "~r", "Reit", 1, [2]),
    _l(11, "!", "FalsumI", 1, [9, 10]),
    _l(12, "~~r", "NegI", 0, subs=[[2, 11]]),
    _l(13, "r", "NegE", 0, [12]),
]

# ----------------------------------------------------- conditional-crossover
# One case split (j | ~j, proved the same way every excluded-middle instance
# in this file is proved) glues together one instance of positive-paradox's
# move (c alone forces e > c) and one instance of negative-paradox's move
# (~j alone forces j > d). Only the first conjunct of the premise is ever
# touched -- e > d never appears, because the argument does not need it.
PROOFS["conditional-crossover"] = [
    P(1, "(j > c) & (e > d)"),
    _l(2, "j > c", "ConjE", 0, [1]),
    _l(3, "~(j | ~j)", "As", 1),
    _l(4, "j", "As", 2),
    _l(5, "j | ~j", "DisjI", 2, [4]),
    _l(6, "!", "FalsumI", 2, [5, 3]),
    _l(7, "~j", "NegI", 1, subs=[[4, 6]]),
    _l(8, "j | ~j", "DisjI", 1, [7]),
    _l(9, "~(j | ~j)", "Reit", 1, [3]),
    _l(10, "!", "FalsumI", 1, [8, 9]),
    _l(11, "~~(j | ~j)", "NegI", 0, subs=[[3, 10]]),
    _l(12, "j | ~j", "NegE", 0, [11]),
    _l(13, "j", "As", 1),
    _l(14, "c", "CondE", 1, [2, 13]),
    _l(15, "e", "As", 2),
    _l(16, "c", "Reit", 2, [14]),
    _l(17, "e > c", "CondI", 1, subs=[[15, 16]]),
    _l(18, "(j > d) | (e > c)", "DisjI", 1, [17]),
    _l(19, "~j", "As", 1),
    _l(20, "j", "As", 2),
    _l(21, "~d", "As", 3),
    _l(22, "!", "FalsumI", 3, [20, 19]),
    _l(23, "~~d", "NegI", 2, subs=[[21, 22]]),
    _l(24, "d", "NegE", 2, [23]),
    _l(25, "j > d", "CondI", 1, subs=[[20, 24]]),
    _l(26, "(j > d) | (e > c)", "DisjI", 1, [25]),
    _l(27, "(j > d) | (e > c)", "DisjE", 0, [12], subs=[[13, 18], [19, 26]]),
]

# --------------------------------------------------------- orange-blossom
# Assume j, then reductio on ~b: j & ~b (citing the outer j directly, no
# reiteration needed -- it is access, not role) trips the premise to ~j,
# which contradicts the very j just cited. Neither half of that contradiction
# is this subproof's own assumption (~b is), so nd.check() asks for no
# reiteration before the FalsumI.
PROOFS["orange-blossom"] = [
    P(1, "(j & ~b) > ~j"),
    _l(2, "j", "As", 1),
    _l(3, "~b", "As", 2),
    _l(4, "j & ~b", "ConjI", 2, [2, 3]),
    _l(5, "~j", "CondE", 2, [1, 4]),
    _l(6, "!", "FalsumI", 2, [2, 5]),
    _l(7, "~~b", "NegI", 1, subs=[[3, 6]]),
    _l(8, "b", "NegE", 1, [7]),
    _l(9, "j > b", "CondI", 0, subs=[[2, 8]]),
]

# ---------------------------------------------------- antecedent-strengthening
# Assume the stronger antecedent, split it, and eliminate. Every rule is
# dictated by the goal, so nothing about this proof is interesting -- which is
# the point next to its converse, whose countermodel is the real exhibit.
PROOFS["antecedent-strengthening"] = [
    P(1, "p > q"),
    _l(2, "p & r", "As", 1),
    _l(3, "p", "ConjE", 1, [2]),
    _l(4, "q", "CondE", 1, [1, 3]),
    _l(5, "(p & r) > q", "CondI", 0, subs=[[2, 4]]),
]

# --------------------------------------------------------- redundant-disjunct
# The ⊃I-toward-BicondI half is dictated: assume (p|q)>p, assume q, build the
# disjunction, eliminate. The other half needs ∨E because p, unlike q, is not
# an assumption to eliminate against -- the case that assumes p has to
# reiterate it to close, per §6.4's rule for a case whose assumption is its
# own conclusion.
PROOFS["redundant-disjunct"] = [
    _l(1, "(p | q) > p", "As", 1),
    _l(2, "q", "As", 2),
    _l(3, "p | q", "DisjI", 2, [2]),
    _l(4, "p", "CondE", 2, [1, 3]),
    _l(5, "q > p", "CondI", 1, subs=[[2, 4]]),
    _l(6, "q > p", "As", 1),
    _l(7, "p | q", "As", 2),
    _l(8, "p", "As", 3),
    _l(9, "p", "Reit", 3, [8]),
    _l(10, "q", "As", 3),
    _l(11, "p", "CondE", 3, [6, 10]),
    _l(12, "p", "DisjE", 2, [7], subs=[[8, 9], [10, 11]]),
    _l(13, "(p | q) > p", "CondI", 1, subs=[[7, 12]]),
    _l(14, "((p | q) > p) = (q > p)", "BicondI", 0, subs=[[1, 5], [6, 13]]),
]

# ----------------------------------------------------- two-switches-lightbulb
# The same shape as `the-monster`, minus its symmetry: the reductio derives
# ~p alone (assuming p and q together trips the premise to r, which already
# secures the disjunction) and never needs a matching argument for ~q. From
# ~p, p>r is vacuous -- assume p, contradict ~p, and take r out of that
# contradiction the only way the system allows, via a nested reductio on ~r,
# since there is no explosion rule to shortcut it.
PROOFS["two-switches-lightbulb"] = [
    P(1, "(p & q) > r"),
    _l(2, "~((p > r) | (q > r))", "As", 1),
    _l(3, "p", "As", 2),
    _l(4, "q", "As", 3),
    _l(5, "p & q", "ConjI", 3, [3, 4]),
    _l(6, "r", "CondE", 3, [1, 5]),
    _l(7, "q > r", "CondI", 2, subs=[[4, 6]]),
    _l(8, "(p > r) | (q > r)", "DisjI", 2, [7]),
    _l(9, "!", "FalsumI", 2, [8, 2]),
    _l(10, "~p", "NegI", 1, subs=[[3, 9]]),
    _l(11, "p", "As", 2),
    _l(12, "~r", "As", 3),
    _l(13, "!", "FalsumI", 3, [11, 10]),
    _l(14, "~~r", "NegI", 2, subs=[[12, 13]]),
    _l(15, "r", "NegE", 2, [14]),
    _l(16, "p > r", "CondI", 1, subs=[[11, 15]]),
    _l(17, "(p > r) | (q > r)", "DisjI", 1, [16]),
    _l(18, "~((p > r) | (q > r))", "Reit", 1, [2]),
    _l(19, "!", "FalsumI", 1, [17, 18]),
    _l(20, "~~((p > r) | (q > r))", "NegI", 0, subs=[[2, 19]]),
    _l(21, "(p > r) | (q > r)", "NegE", 0, [20]),
]

# --------------------------------------------------- conditional excluded middle
# The goal is the material-conditional shadow of an axiom that has nothing to
# do with cases on its own -- neither disjunct is dictated, so the only way in
# is a lemma: prove q | ~q first (the same shape as excluded-middle, lines
# 1-11), then split on it. Each case then names its own conditional by ⊃I
# outright, since the antecedent p is never touched.
PROOFS["conditional-excluded-middle"] = [
    _l(1, "~(q | ~q)", "As", 1),
    _l(2, "q", "As", 2),
    _l(3, "q | ~q", "DisjI", 2, [2]),
    _l(4, "~(q | ~q)", "Reit", 2, [1]),
    _l(5, "!", "FalsumI", 2, [3, 4]),
    _l(6, "~q", "NegI", 1, subs=[[2, 5]]),
    _l(7, "q | ~q", "DisjI", 1, [6]),
    _l(8, "~(q | ~q)", "Reit", 1, [1]),
    _l(9, "!", "FalsumI", 1, [7, 8]),
    _l(10, "~~(q | ~q)", "NegI", 0, subs=[[1, 9]]),
    _l(11, "q | ~q", "NegE", 0, [10]),
    _l(12, "q", "As", 1),
    _l(13, "p", "As", 2),
    _l(14, "q", "Reit", 2, [12]),
    _l(15, "p > q", "CondI", 1, subs=[[13, 14]]),
    _l(16, "(p > q) | (p > ~q)", "DisjI", 1, [15]),
    _l(17, "~q", "As", 1),
    _l(18, "p", "As", 2),
    _l(19, "~q", "Reit", 2, [17]),
    _l(20, "p > ~q", "CondI", 1, subs=[[18, 19]]),
    _l(21, "(p > q) | (p > ~q)", "DisjI", 1, [20]),
    _l(22, "(p > q) | (p > ~q)", "DisjE", 0, [11], subs=[[12, 16], [17, 21]]),
]

# ---------------------------------------------------------- bivalence pigeonhole
# Three atoms, two truth values: some pair has to agree. The proof earns that
# the hard way -- p | ~p and q | ~q proved as lemmas (the excluded-middle
# shape again, on p and then on q), then a case split on each. When p and q
# already agree the goal is settled on the spot by the first disjunct; only
# the two cases where they disagree need to go on and split r | ~r as well
# (proved the same way, inline) to find out which of q or p it agrees with.
# The longest derivation in the database, and the only one whose case tree
# has genuinely different shapes down its two branches.
PROOFS["bivalence-pigeonhole"] = [
    _l(1, "~(p | ~p)", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p | ~p", "DisjI", 2, [2]),
    _l(4, "~(p | ~p)", "Reit", 2, [1]),
    _l(5, "!", "FalsumI", 2, [3, 4]),
    _l(6, "~p", "NegI", 1, subs=[[2, 5]]),
    _l(7, "p | ~p", "DisjI", 1, [6]),
    _l(8, "~(p | ~p)", "Reit", 1, [1]),
    _l(9, "!", "FalsumI", 1, [7, 8]),
    _l(10, "~~(p | ~p)", "NegI", 0, subs=[[1, 9]]),
    _l(11, "p | ~p", "NegE", 0, [10]),
    _l(12, "~(q | ~q)", "As", 1),
    _l(13, "q", "As", 2),
    _l(14, "q | ~q", "DisjI", 2, [13]),
    _l(15, "~(q | ~q)", "Reit", 2, [12]),
    _l(16, "!", "FalsumI", 2, [14, 15]),
    _l(17, "~q", "NegI", 1, subs=[[13, 16]]),
    _l(18, "q | ~q", "DisjI", 1, [17]),
    _l(19, "~(q | ~q)", "Reit", 1, [12]),
    _l(20, "!", "FalsumI", 1, [18, 19]),
    _l(21, "~~(q | ~q)", "NegI", 0, subs=[[12, 20]]),
    _l(22, "q | ~q", "NegE", 0, [21]),
    _l(23, "~(r | ~r)", "As", 1),
    _l(24, "r", "As", 2),
    _l(25, "r | ~r", "DisjI", 2, [24]),
    _l(26, "~(r | ~r)", "Reit", 2, [23]),
    _l(27, "!", "FalsumI", 2, [25, 26]),
    _l(28, "~r", "NegI", 1, subs=[[24, 27]]),
    _l(29, "r | ~r", "DisjI", 1, [28]),
    _l(30, "~(r | ~r)", "Reit", 1, [23]),
    _l(31, "!", "FalsumI", 1, [29, 30]),
    _l(32, "~~(r | ~r)", "NegI", 0, subs=[[23, 31]]),
    _l(33, "r | ~r", "NegE", 0, [32]),
    _l(34, "p", "As", 1),
    _l(35, "q", "As", 2),
    _l(36, "p", "As", 3),
    _l(37, "q", "Reit", 3, [35]),
    _l(38, "q", "As", 3),
    _l(39, "p", "Reit", 3, [34]),
    _l(40, "p = q", "BicondI", 2, subs=[[36, 37], [38, 39]]),
    _l(41, "(p = q) | (q = r)", "DisjI", 2, [40]),
    _l(42, "((p = q) | (q = r)) | (p = r)", "DisjI", 2, [41]),
    _l(43, "~q", "As", 2),
    _l(44, "r", "As", 3),
    _l(45, "p", "As", 4),
    _l(46, "r", "Reit", 4, [44]),
    _l(47, "r", "As", 4),
    _l(48, "p", "Reit", 4, [34]),
    _l(49, "p = r", "BicondI", 3, subs=[[45, 46], [47, 48]]),
    _l(50, "((p = q) | (q = r)) | (p = r)", "DisjI", 3, [49]),
    _l(51, "~r", "As", 3),
    _l(52, "q", "As", 4),
    _l(53, "~r", "As", 5),
    _l(54, "!", "FalsumI", 5, [52, 43]),
    _l(55, "~~r", "NegI", 4, subs=[[53, 54]]),
    _l(56, "r", "NegE", 4, [55]),
    _l(57, "r", "As", 4),
    _l(58, "~q", "As", 5),
    _l(59, "!", "FalsumI", 5, [57, 51]),
    _l(60, "~~q", "NegI", 4, subs=[[58, 59]]),
    _l(61, "q", "NegE", 4, [60]),
    _l(62, "q = r", "BicondI", 3, subs=[[52, 56], [57, 61]]),
    _l(63, "(p = q) | (q = r)", "DisjI", 3, [62]),
    _l(64, "((p = q) | (q = r)) | (p = r)", "DisjI", 3, [63]),
    _l(65, "((p = q) | (q = r)) | (p = r)", "DisjE", 2, [33], subs=[[44, 50], [51, 64]]),
    _l(66, "((p = q) | (q = r)) | (p = r)", "DisjE", 1, [22], subs=[[35, 42], [43, 65]]),
    _l(67, "~p", "As", 1),
    _l(68, "q", "As", 2),
    _l(69, "r", "As", 3),
    _l(70, "q", "As", 4),
    _l(71, "r", "Reit", 4, [69]),
    _l(72, "r", "As", 4),
    _l(73, "q", "Reit", 4, [68]),
    _l(74, "q = r", "BicondI", 3, subs=[[70, 71], [72, 73]]),
    _l(75, "(p = q) | (q = r)", "DisjI", 3, [74]),
    _l(76, "((p = q) | (q = r)) | (p = r)", "DisjI", 3, [75]),
    _l(77, "~r", "As", 3),
    _l(78, "p", "As", 4),
    _l(79, "~r", "As", 5),
    _l(80, "!", "FalsumI", 5, [78, 67]),
    _l(81, "~~r", "NegI", 4, subs=[[79, 80]]),
    _l(82, "r", "NegE", 4, [81]),
    _l(83, "r", "As", 4),
    _l(84, "~p", "As", 5),
    _l(85, "!", "FalsumI", 5, [83, 77]),
    _l(86, "~~p", "NegI", 4, subs=[[84, 85]]),
    _l(87, "p", "NegE", 4, [86]),
    _l(88, "p = r", "BicondI", 3, subs=[[78, 82], [83, 87]]),
    _l(89, "((p = q) | (q = r)) | (p = r)", "DisjI", 3, [88]),
    _l(90, "((p = q) | (q = r)) | (p = r)", "DisjE", 2, [33], subs=[[69, 76], [77, 89]]),
    _l(91, "~q", "As", 2),
    _l(92, "p", "As", 3),
    _l(93, "~q", "As", 4),
    _l(94, "!", "FalsumI", 4, [92, 67]),
    _l(95, "~~q", "NegI", 3, subs=[[93, 94]]),
    _l(96, "q", "NegE", 3, [95]),
    _l(97, "q", "As", 3),
    _l(98, "~p", "As", 4),
    _l(99, "!", "FalsumI", 4, [97, 91]),
    _l(100, "~~p", "NegI", 3, subs=[[98, 99]]),
    _l(101, "p", "NegE", 3, [100]),
    _l(102, "p = q", "BicondI", 2, subs=[[92, 96], [97, 101]]),
    _l(103, "(p = q) | (q = r)", "DisjI", 2, [102]),
    _l(104, "((p = q) | (q = r)) | (p = r)", "DisjI", 2, [103]),
    _l(105, "((p = q) | (q = r)) | (p = r)", "DisjE", 1, [22], subs=[[68, 90], [91, 104]]),
    _l(106, "((p = q) | (q = r)) | (p = r)", "DisjE", 0, [11], subs=[[34, 66], [67, 105]]),
]

# --------------------------------------------------- self-undermining, as an equivalence
# `self-undermining-conditional` already has the -> half (p>~p, so ~p); this
# is the same collision on both sides of a BicondI. The -> direction repeats
# that proof's shape (assume p, CondE against the premise, collide it with p
# itself); the <- direction is the trivial half, since ~p already gives the
# conditional vacuously.
PROOFS["self-undermining-biconditional"] = [
    _l(1, "p > ~p", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "~p", "CondE", 2, [1, 2]),
    _l(4, "p", "Reit", 2, [2]),
    _l(5, "!", "FalsumI", 2, [4, 3]),
    _l(6, "~p", "NegI", 1, subs=[[2, 5]]),
    _l(7, "~p", "As", 1),
    _l(8, "p", "As", 2),
    _l(9, "~p", "Reit", 2, [7]),
    _l(10, "p > ~p", "CondI", 1, subs=[[8, 9]]),
    _l(11, "(p > ~p) = ~p", "BicondI", 0, subs=[[1, 6], [7, 10]]),
]

# ---------------------------------------------------------------------- or-to-if
# `disjunctive-syllogism` wrapped in a CondI: assuming ~p for the goal's
# antecedent turns the disjunction premise into exactly that entry's two
# premises, so the case split and its nested reductio are copied wholesale
# and only the outer CondI is new.
PROOFS["or-to-if"] = [
    P(1, "p | q"),
    _l(2, "~p", "As", 1),
    _l(3, "p", "As", 2),
    _l(4, "~q", "As", 3),
    _l(5, "!", "FalsumI", 3, [3, 2]),
    _l(6, "~~q", "NegI", 2, subs=[[4, 5]]),
    _l(7, "q", "NegE", 2, [6]),
    _l(8, "q", "As", 2),
    _l(9, "q", "Reit", 2, [8]),
    _l(10, "q", "DisjE", 1, [1], subs=[[3, 7], [8, 9]]),
    _l(11, "~p > q", "CondI", 0, subs=[[2, 10]]),
]

# -------------------------------------------------------------- Curry's sequent
# No reductio anywhere: ≡E hands back the conditional once p is assumed, ⊃E
# closes that inner subproof to q, ⊃I packages the pair as p⊃q, and then ≡E
# and ⊃E run once more outside to detach p and then q from it directly.
PROOFS["curry-sequent"] = [
    P(1, "p = (p > q)"),
    _l(2, "p", "As", 1),
    _l(3, "p > q", "BicondE", 1, [1, 2]),
    _l(4, "q", "CondE", 1, [3, 2]),
    _l(5, "p > q", "CondI", 0, subs=[[2, 4]]),
    _l(6, "p", "BicondE", 0, [1, 5]),
    _l(7, "q", "CondE", 0, [5, 6]),
]

# ------------------------------------------------------- deontic-no-gaps
# No case split, no reductio: the premise is unsatisfiable outright, so the
# proof is just taking it apart. Peel the two conjuncts, peel the left one
# again to get ~a and the negated middle disjunct, rebuild ~a & ~b by ConjI,
# and it lands exactly on the formula the premise already denied.
PROOFS["deontic-no-gaps"] = [
    P(1, "(~a & ~(~a & ~b)) & ~b"),
    _l(2, "~a & ~(~a & ~b)", "ConjE", 0, [1]),
    _l(3, "~b", "ConjE", 0, [1]),
    _l(4, "~a", "ConjE", 0, [2]),
    _l(5, "~(~a & ~b)", "ConjE", 0, [2]),
    _l(6, "~a & ~b", "ConjI", 0, [4, 3]),
    _l(7, "!", "FalsumI", 0, [6, 5]),
]

# ----------------------------------------------------- curry-conditional
# curry-sequent's own seven lines, run one scope deeper: the biconditional
# that curry-sequent takes as a premise is assumed here instead, so the whole
# thing discharges into a single closed conditional at the end.
PROOFS["curry-conditional"] = [
    _l(1, "p = (p > q)", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p > q", "BicondE", 2, [1, 2]),
    _l(4, "q", "CondE", 2, [3, 2]),
    _l(5, "p > q", "CondI", 1, subs=[[2, 4]]),
    _l(6, "p", "BicondE", 1, [1, 5]),
    _l(7, "q", "CondE", 1, [5, 6]),
    _l(8, "(p = (p > q)) > q", "CondI", 0, subs=[[1, 7]]),
]

# --------------------------------------------------- curry-is-conjunction
# Two ≡I halves. Forward: assume the Curry biconditional, run
# curry-conditional's own seven lines to get p and q separately, ConjI them.
# Backward: assume p & q, pull out p and q, then build the biconditional the
# only way the twelve rules allow -- a ⊃I for each direction, each one
# needing its own nested ⊃I to produce p > q as a formula rather than just q.
PROOFS["curry-is-conjunction"] = [
    _l(1, "p = (p > q)", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p > q", "BicondE", 2, [1, 2]),
    _l(4, "q", "CondE", 2, [3, 2]),
    _l(5, "p > q", "CondI", 1, subs=[[2, 4]]),
    _l(6, "p", "BicondE", 1, [1, 5]),
    _l(7, "q", "CondE", 1, [5, 6]),
    _l(8, "p & q", "ConjI", 1, [6, 7]),
    _l(9, "p & q", "As", 1),
    _l(10, "p", "ConjE", 1, [9]),
    _l(11, "q", "ConjE", 1, [9]),
    _l(12, "p", "As", 2),
    _l(13, "p", "As", 3),
    _l(14, "q", "Reit", 3, [11]),
    _l(15, "p > q", "CondI", 2, subs=[[13, 14]]),
    _l(16, "p > q", "As", 2),
    _l(17, "p", "Reit", 2, [10]),
    _l(18, "p = (p > q)", "BicondI", 1, subs=[[12, 15], [16, 17]]),
    _l(19, "(p = (p > q)) = (p & q)", "BicondI", 0, subs=[[1, 8], [9, 18]]),
]

# ----------------------------------------------------- curry-antecedent
# curry-sequent's own first six lines, stopped before its last CondE: the
# biconditional forces p on its own, before q is ever detached from it.
PROOFS["curry-antecedent"] = [
    P(1, "p = (p > q)"),
    _l(2, "p", "As", 1),
    _l(3, "p > q", "BicondE", 1, [1, 2]),
    _l(4, "q", "CondE", 1, [3, 2]),
    _l(5, "p > q", "CondI", 0, subs=[[2, 4]]),
    _l(6, "p", "BicondE", 0, [1, 5]),
]

# --------------------------------------------------- curry-implicational
# curry-complete's own shape with the third premise dropped: no BicondE
# anywhere, just the two ⊃ premises doing what the biconditional's two
# halves did in curry-sequent.
PROOFS["curry-implicational"] = [
    P(1, "p > (p > q)"),
    P(2, "(p > q) > p"),
    _l(3, "p", "As", 1),
    _l(4, "p > q", "CondE", 1, [1, 3]),
    _l(5, "q", "CondE", 1, [4, 3]),
    _l(6, "p > q", "CondI", 0, subs=[[3, 5]]),
    _l(7, "p", "CondE", 0, [2, 6]),
    _l(8, "q", "CondE", 0, [6, 7]),
]

# ------------------------------------------------------- curry-at-bottom
# curry-sequent's own seven lines, unchanged, with q replaced throughout by
# the explicit contradiction r & ~r: the proof runs to that conjunction
# instead of stopping at an arbitrary atom, then two ConjE peel it apart and
# FalsumI reads the contradiction straight off. No NegI, no NegE anywhere.
PROOFS["curry-at-bottom"] = [
    P(1, "p = (p > (r & ~r))"),
    _l(2, "p", "As", 1),
    _l(3, "p > (r & ~r)", "BicondE", 1, [1, 2]),
    _l(4, "r & ~r", "CondE", 1, [3, 2]),
    _l(5, "p > (r & ~r)", "CondI", 0, subs=[[2, 4]]),
    _l(6, "p", "BicondE", 0, [1, 5]),
    _l(7, "r & ~r", "CondE", 0, [5, 6]),
    _l(8, "r", "ConjE", 0, [7]),
    _l(9, "~r", "ConjE", 0, [7]),
    _l(10, "!", "FalsumI", 0, [8, 9]),
]

# ------------------------------------------------------- double-negation intro
# The mirror image of NegE, and the shortest reductio in the system: the
# premise is already one half of the contradiction, so the only thing the
# subproof does is reiterate it into the role ⊥I needs.
PROOFS["double-negation-introduction"] = [
    P(1, "p"),
    _l(2, "~p", "As", 1),
    _l(3, "~p", "Reit", 1, [2]),
    _l(4, "!", "FalsumI", 1, [1, 3]),
    _l(5, "~~p", "NegI", 0, subs=[[2, 4]]),
]

# ------------------------------------------------- max-and-agnes-liar-cycle
# biconditional-with-its-own-negation's one-atom trick, spread across two
# atoms and two premises: assume t, cross both biconditionals to reach ~t,
# then re-cross them from ~t alone (no fresh assumption) to reach t back.
# Longer than the one-atom proof for exactly that reason -- each leg of the
# reductio has to visit the *other* biconditional before it can close.
PROOFS["max-and-agnes-liar-cycle"] = [
    P(1, "t = l"),
    P(2, "l = ~t"),
    _l(3, "t", "As", 1),
    _l(4, "l", "BicondE", 1, [1, 3]),
    _l(5, "~t", "BicondE", 1, [2, 4]),
    _l(6, "t", "Reit", 1, [3]),
    _l(7, "!", "FalsumI", 1, [6, 5]),
    _l(8, "~t", "NegI", 0, subs=[[3, 7]]),
    _l(9, "l", "BicondE", 0, [2, 8]),
    _l(10, "t", "BicondE", 0, [1, 9]),
    _l(11, "!", "FalsumI", 0, [10, 8]),
]

# ------------------------------------------------- conditional-perfection-repaired
# Denying the antecedent, licensed once the conditional is read as the
# biconditional Geis and Zwicky say speakers actually intend: a single
# reductio pulls the "perfected" reading's other direction out of premise 1.
PROOFS["conditional-perfection-repaired"] = [
    P(1, "p = q"),
    P(2, "~p"),
    _l(3, "q", "As", 1),
    _l(4, "p", "BicondE", 1, [1, 3]),
    _l(5, "!", "FalsumI", 1, [4, 2]),
    _l(6, "~q", "NegI", 0, subs=[[3, 5]]),
]

# ----------------------------------------------------------- destructive dilemma
# constructive-dilemma's dual, and not as easy: neither case gets its disjunct
# by a bare ⊃E, since what each needs is a *negative* conclusion the goal
# does not name a rule for. So each case opens its own reductio -- assume the
# antecedent, fire ⊃E, collide with the disjunct that names its negation
# (cited directly outward, not reiterated, per the De Morgan I precedent) --
# and only then is there a formula for ∨I to extend.
PROOFS["destructive-dilemma"] = [
    P(1, "p > q"),
    P(2, "r > s"),
    P(3, "~q | ~s"),
    _l(4, "~q", "As", 1),
    _l(5, "p", "As", 2),
    _l(6, "q", "CondE", 2, [1, 5]),
    _l(7, "!", "FalsumI", 2, [6, 4]),
    _l(8, "~p", "NegI", 1, subs=[[5, 7]]),
    _l(9, "~p | ~r", "DisjI", 1, [8]),
    _l(10, "~s", "As", 1),
    _l(11, "r", "As", 2),
    _l(12, "s", "CondE", 2, [2, 11]),
    _l(13, "!", "FalsumI", 2, [12, 10]),
    _l(14, "~r", "NegI", 1, subs=[[11, 13]]),
    _l(15, "~p | ~r", "DisjI", 1, [14]),
    _l(16, "~p | ~r", "DisjE", 0, [3], subs=[[4, 9], [10, 15]]),
]

# ------------------------------------------------- disjunction from ⊃ alone
# ->: a plain proof by cases -- p⊃q hands back q directly in the p case, and
# the q case is q already, reiterated into the role ∨E's own conclusion needs.
# <-: p∨q is not conditional-shaped, so getting it out of (p⊃q)⊃q costs an
# undictated reductio. Assuming ~(p∨q) refutes each disjunct in turn (∨I
# against the reiterated assumption, same shape as the -> direction's own
# reductio-free case, run twice); the second refutation doubles as the
# antecedent of a vacuous p⊃q, which (p⊃q)⊃q then fires to recover q -- and one
# more ∨I turns that q back into the very disjunction denied, closing the loop.
PROOFS["disjunction-from-conditional"] = [
    _l(1, "p | q", "As", 1),
    _l(2, "p > q", "As", 2),
    _l(3, "p", "As", 3),
    _l(4, "q", "CondE", 3, [2, 3]),
    _l(5, "q", "As", 3),
    _l(6, "q", "Reit", 3, [5]),
    _l(7, "q", "DisjE", 2, [1], subs=[[3, 4], [5, 6]]),
    _l(8, "(p > q) > q", "CondI", 1, subs=[[2, 7]]),
    _l(9, "(p > q) > q", "As", 1),
    _l(10, "~(p | q)", "As", 2),
    _l(11, "p", "As", 3),
    _l(12, "p | q", "DisjI", 3, [11]),
    _l(13, "~q", "As", 4),
    _l(14, "!", "FalsumI", 4, [12, 10]),
    _l(15, "~~q", "NegI", 3, subs=[[13, 14]]),
    _l(16, "q", "NegE", 3, [15]),
    _l(17, "p > q", "CondI", 2, subs=[[11, 16]]),
    _l(18, "q", "CondE", 2, [9, 17]),
    _l(19, "p | q", "DisjI", 2, [18]),
    _l(20, "~(p | q)", "Reit", 2, [10]),
    _l(21, "!", "FalsumI", 2, [19, 20]),
    _l(22, "~~(p | q)", "NegI", 1, subs=[[10, 21]]),
    _l(23, "p | q", "NegE", 1, [22]),
    _l(24, "(p | q) = ((p > q) > q)", "BicondI", 0, subs=[[1, 8], [9, 23]]),
]

# ------------------------------------------------------------- Ross's paradox
# ∨I and nothing else -- the one-line proof `addition` also uses.
PROOFS["ross-paradox"] = [
    P(1, "p"),
    _l(2, "p | q", "DisjI", 0, [1]),
]

# ------------------------------------------------------- strengthen-and-weaken
# antecedent-strengthening's &E, plus one line of ∨I to loosen the conclusion
# too. The two moves are independent, so nothing is shared between them.
PROOFS["strengthen-and-weaken"] = [
    P(1, "p > q"),
    _l(2, "p & r", "As", 1),
    _l(3, "p", "ConjE", 1, [2]),
    _l(4, "q", "CondE", 1, [1, 3]),
    _l(5, "q | s", "DisjI", 1, [4]),
    _l(6, "(p & r) > (q | s)", "CondI", 0, subs=[[2, 5]]),
]

# --------------------------------------------------- self-distribution-premised
# Two-deep nesting, same shape as `permutation`: assume the inner conditional,
# then assume p, and ⊃E twice to reach r before discharging outward.
PROOFS["self-distribution-premised"] = [
    P(1, "p > q"),
    _l(2, "p > (q > r)", "As", 1),
    _l(3, "p", "As", 2),
    _l(4, "q", "CondE", 2, [1, 3]),
    _l(5, "q > r", "CondE", 2, [2, 3]),
    _l(6, "r", "CondE", 2, [5, 4]),
    _l(7, "p > r", "CondI", 1, subs=[[3, 6]]),
    _l(8, "(p > (q > r)) > (p > r)", "CondI", 0, subs=[[2, 7]]),
]

# ----------------------------------------------------------- exportation-reordered
# Extract p and r from the antecedent, detach the exported consequent, then
# reassemble q with the extracted r to feed it -- ten lines, matching the
# book's own count for this one.
PROOFS["exportation-reordered"] = [
    P(1, "p > ((q & r) > s)"),
    _l(2, "p & r", "As", 1),
    _l(3, "p", "ConjE", 1, [2]),
    _l(4, "r", "ConjE", 1, [2]),
    _l(5, "(q & r) > s", "CondE", 1, [1, 3]),
    _l(6, "q", "As", 2),
    _l(7, "q & r", "ConjI", 2, [6, 4]),
    _l(8, "s", "CondE", 2, [5, 7]),
    _l(9, "q > s", "CondI", 1, subs=[[6, 8]]),
    _l(10, "(p & r) > (q > s)", "CondI", 0, subs=[[2, 9]]),
]

# ----------------------------------------------------- double-negation-elimination
# The whole proof is the rule itself -- one citation of NegE, which is exactly
# Restall's point: nothing built from the other eleven rules gets here.
PROOFS["double-negation-elimination"] = [
    P(1, "~~p"),
    _l(2, "p", "NegE", 0, [1]),
]

# --------------------------------------------------------- contraposition-recovered
# Same shape as contraposition-bakery's own reductio, run to get q from ~q --
# but landing on ~~q, not q, so the derivation needs one more line, NegE, to
# close the gap contraposition-bakery's direction never opens.
PROOFS["contraposition-recovered"] = [
    P(1, "~q > ~p"),
    _l(2, "p", "As", 1),
    _l(3, "~q", "As", 2),
    _l(4, "~p", "CondE", 2, [1, 3]),
    _l(5, "!", "FalsumI", 2, [2, 4]),
    _l(6, "~~q", "NegI", 1, subs=[[3, 5]]),
    _l(7, "q", "NegE", 1, [6]),
    _l(8, "p > q", "CondI", 0, subs=[[2, 7]]),
]

# ----------------------------------------------------- double-negated-excluded-middle
# excluded-middle's own proof, verbatim, minus its last line: this is exactly
# the ~~(p | ~p) that proof reaches before spending NegE to strip the outer
# pair. Restall's "prove the double negation first" strategy, read off directly.
PROOFS["double-negated-excluded-middle"] = [
    _l(1, "~(p | ~p)", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p | ~p", "DisjI", 2, [2]),
    _l(4, "!", "FalsumI", 2, [3, 1]),
    _l(5, "~p", "NegI", 1, subs=[[2, 4]]),
    _l(6, "p | ~p", "DisjI", 1, [5]),
    _l(7, "~(p | ~p)", "Reit", 1, [1]),
    _l(8, "!", "FalsumI", 1, [6, 7]),
    _l(9, "~~(p | ~p)", "NegI", 0, subs=[[1, 8]]),
]

# ------------------------------------------------------------- incompatibility-swap
# CondE on the assumed antecedent, straight into the outer assumption -- both
# reductios sit on negation goals, so neither is undictated even though the
# blunt uses_indirect_proof heuristic flags one as such.
PROOFS["incompatibility-swap"] = [
    P(1, "p > ~q"),
    _l(2, "q", "As", 1),
    _l(3, "p", "As", 2),
    _l(4, "~q", "CondE", 2, [1, 3]),
    _l(5, "!", "FalsumI", 2, [2, 4]),
    _l(6, "~p", "NegI", 1, subs=[[3, 5]]),
    _l(7, "q > ~p", "CondI", 0, subs=[[2, 6]]),
]

# ---------------------------------------------------- triple-negation-elimination
# Two nested NegI's and nothing else -- the last negation is never stripped,
# only the outer pair, which is exactly what stays available intuitionistically.
PROOFS["triple-negation-elimination"] = [
    P(1, "~~~p"),
    _l(2, "p", "As", 1),
    _l(3, "~p", "As", 2),
    _l(4, "~p", "Reit", 2, [3]),
    _l(5, "!", "FalsumI", 2, [2, 4]),
    _l(6, "~~p", "NegI", 1, subs=[[3, 5]]),
    _l(7, "!", "FalsumI", 1, [6, 1]),
    _l(8, "~p", "NegI", 0, subs=[[2, 7]]),
]

# --------------------------------------------------------- de-morgan-conjunction-easy
# The easy half of the De Morgan pair: ∨E on the premise, one short reductio
# per disjunct, no NegE. Its converse -- still in the imports queue -- is the
# one Restall calls "the hard De Morgan" for needing exactly the rule this
# proof avoids.
PROOFS["de-morgan-conjunction-easy"] = [
    P(1, "~p | ~q"),
    _l(2, "p & q", "As", 1),
    _l(3, "~p", "As", 2),
    _l(4, "~p", "Reit", 2, [3]),
    _l(5, "p", "ConjE", 2, [2]),
    _l(6, "!", "FalsumI", 2, [5, 4]),
    _l(7, "~q", "As", 2),
    _l(8, "~q", "Reit", 2, [7]),
    _l(9, "q", "ConjE", 2, [2]),
    _l(10, "!", "FalsumI", 2, [9, 8]),
    _l(11, "!", "DisjE", 1, [1], subs=[[3, 6], [7, 10]]),
    _l(12, "~(p & q)", "NegI", 0, subs=[[2, 11]]),
]

# --------------------------------------------------- de-morgan-disjunction-easy
# The non-DNE half of De Morgan I, isolated: two dictated reductios (each
# subgoal ~p, ~q is itself a negation) followed by ConjI. No case split, no
# nesting -- the "undictated reductio" difficulty.py flags is a false positive
# of its blunt uses_indirect_proof check; see the entry's course.note.
PROOFS["de-morgan-disjunction-easy"] = [
    P(1, "~(p | q)"),
    _l(2, "p", "As", 1),
    _l(3, "p | q", "DisjI", 1, [2]),
    _l(4, "!", "FalsumI", 1, [3, 1]),
    _l(5, "~p", "NegI", 0, subs=[[2, 4]]),
    _l(6, "q", "As", 1),
    _l(7, "p | q", "DisjI", 1, [6]),
    _l(8, "!", "FalsumI", 1, [7, 1]),
    _l(9, "~q", "NegI", 0, subs=[[6, 8]]),
    _l(10, "~p & ~q", "ConjI", 0, [5, 9]),
]

# ----------------------------------------------------- de-morgan-conjunction-hard
# "The hard De Morgan" (Restall's own name): the goal is a disjunction, so
# nothing names a rule directly -- assume its negation, crack open two double
# negations with NegE, collide the reconstructed conjunction with the premise.
PROOFS["de-morgan-conjunction-hard"] = [
    P(1, "~(p & q)"),
    _l(2, "~(~p | ~q)", "As", 1),
    _l(3, "~p", "As", 2),
    _l(4, "~p | ~q", "DisjI", 2, [3]),
    _l(5, "!", "FalsumI", 2, [4, 2]),
    _l(6, "~~p", "NegI", 1, subs=[[3, 5]]),
    _l(7, "p", "NegE", 1, [6]),
    _l(8, "~q", "As", 2),
    _l(9, "~p | ~q", "DisjI", 2, [8]),
    _l(10, "!", "FalsumI", 2, [9, 2]),
    _l(11, "~~q", "NegI", 1, subs=[[8, 10]]),
    _l(12, "q", "NegE", 1, [11]),
    _l(13, "p & q", "ConjI", 1, [7, 12]),
    _l(14, "!", "FalsumI", 1, [13, 1]),
    _l(15, "~~(~p | ~q)", "NegI", 0, subs=[[2, 14]]),
    _l(16, "~p | ~q", "NegE", 0, [15]),
]

# ------------------------------------------------------- self-distribution-axiom
# The unrestricted axiom: nothing is handed over as a premise, so all three
# conditionals nest, three subproofs deep -- self-distribution-premised's
# proof with the outer p>q assumed and discharged instead of taken as given.
PROOFS["self-distribution-axiom"] = [
    _l(1, "p > (q > r)", "As", 1),
    _l(2, "p > q", "As", 2),
    _l(3, "p", "As", 3),
    _l(4, "q > r", "CondE", 3, [1, 3]),
    _l(5, "q", "CondE", 3, [2, 3]),
    _l(6, "r", "CondE", 3, [4, 5]),
    _l(7, "p > r", "CondI", 2, subs=[[3, 6]]),
    _l(8, "(p > q) > (p > r)", "CondI", 1, subs=[[2, 7]]),
    _l(9, "(p > (q > r)) > ((p > q) > (p > r))", "CondI", 0, subs=[[1, 8]]),
]

# ------------------------------------------------------------------ Nicod's rule
# Unfolded into `&`/`∼`, the second premise is `a ⊃ (b & c)` in disguise, so
# the semantic content is modus ponens plus conjunction elimination -- but our
# twelve rules have no way to read a conditional off a negated conjunction
# directly, so the reductio has to build `a & ∼(b & c)` as one formula and set
# it against the premise, rather than detaching and then peeling off `c`.
PROOFS["nicods-rule"] = [
    P(1, "a"),
    P(2, "~(a & ~(b & c))"),
    _l(3, "~c", "As", 1),
    _l(4, "b & c", "As", 2),
    _l(5, "c", "ConjE", 2, [4]),
    _l(6, "!", "FalsumI", 2, [5, 3]),
    _l(7, "~(b & c)", "NegI", 1, subs=[[4, 6]]),
    _l(8, "a & ~(b & c)", "ConjI", 1, [1, 7]),
    _l(9, "!", "FalsumI", 1, [8, 2]),
    _l(10, "~~c", "NegI", 0, subs=[[3, 9]]),
    _l(11, "c", "NegE", 0, [10]),
]

# -------------------------------------------------------- necessarium-ad-quodlibet
# `excluded-middle`'s own reductio, verbatim, with one premise `q` bolted on
# the front and never cited again -- which is the entire point: a necessary
# truth follows from anything, including a premise the proof never touches.
PROOFS["necessarium-ad-quodlibet"] = [
    P(1, "q"),
    _l(2, "~(p | ~p)", "As", 1),
    _l(3, "p", "As", 2),
    _l(4, "p | ~p", "DisjI", 2, [3]),
    _l(5, "!", "FalsumI", 2, [4, 2]),
    _l(6, "~p", "NegI", 1, subs=[[3, 5]]),
    _l(7, "p | ~p", "DisjI", 1, [6]),
    _l(8, "~(p | ~p)", "Reit", 1, [2]),
    _l(9, "!", "FalsumI", 1, [7, 8]),
    _l(10, "~~(p | ~p)", "NegI", 0, subs=[[2, 9]]),
    _l(11, "p | ~p", "NegE", 0, [10]),
]

# ------------------------------------------------------ ex-impossibili-contradiction
# `ex-falso`'s reductio run twice from the same two premises -- once for `q`,
# once for `∼q` -- and joined with a final `&I`. Two sibling subproofs, not
# nested: doubling the explosion costs a second reductio, not a deeper one.
PROOFS["ex-impossibili-contradiction"] = [
    P(1, "p"),
    P(2, "~p"),
    _l(3, "~q", "As", 1),
    _l(4, "!", "FalsumI", 1, [1, 2]),
    _l(5, "~~q", "NegI", 0, subs=[[3, 4]]),
    _l(6, "q", "NegE", 0, [5]),
    _l(7, "q", "As", 1),
    _l(8, "!", "FalsumI", 1, [1, 2]),
    _l(9, "~q", "NegI", 0, subs=[[7, 8]]),
    _l(10, "q & ~q", "ConjI", 0, [6, 9]),
]

# ------------------------------------------------------------ structural-weakening
# The whole rule in one reiteration: `q` is a premise the conclusion never
# touches, so nothing beyond citing `p` again is needed to reach it.
PROOFS["structural-weakening"] = [
    P(1, "p"),
    P(2, "q"),
    _l(3, "p", "Reit", 0, [1]),
]

# ------------------------------------------------------------------- entt-axiom
# `(p>p)>q` is the outer assumption; to use it, `p>p` has to be built as its
# own line, which is a subproof inside the outer one -- assume `p`,
# reiterate it (CondI's discharge cannot cite the assumption line itself,
# per the one-line-subproof rule), and discharge.
PROOFS["entt-axiom"] = [
    _l(1, "(p > p) > q", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p", "Reit", 2, [2]),
    _l(4, "p > p", "CondI", 1, subs=[[2, 3]]),
    _l(5, "q", "CondE", 1, [1, 4]),
    _l(6, "((p > p) > q) > q", "CondI", 0, subs=[[1, 5]]),
]

# ------------------------------------------------------ double-negation-theorem
# The deduction-theorem shadow of `double-negation-elimination`: assume the
# antecedent, cite `NegE`, discharge. One line longer than the rule itself.
PROOFS["double-negation-theorem"] = [
    _l(1, "~~p", "As", 1),
    _l(2, "p", "NegE", 1, [1]),
    _l(3, "~~p > p", "CondI", 0, subs=[[1, 2]]),
]

# ------------------------------------------------------------- combinatory-fixed-point
# `(p>p)>p` is truth-functionally just `p` in disguise -- ⊃E against `p>p`
# reads it off directly. The first premise never gets cited, which is the
# point: `derive.py`'s premise_analysis calls it idle, and the dead-line
# check does not fire because premises are exempt from it (§6.5's own note).
PROOFS["combinatory-fixed-point"] = [
    P(1, "p > p"),
    P(2, "(p > p) > p"),
    _l(3, "p", "CondE", 0, [2, 1]),
]

# --------------------------------------------------------------- mcgee-counterexample
# A curried conditional taken apart and put back together: `~g` opens the
# subproof `>I` needs, `r&~g` is built directly (both conjuncts already
# accessible, no reiteration required since neither elimination cites it
# locally), and `>E` against the premise lands `a` inside the same subproof.
PROOFS["mcgee-counterexample"] = [
    P(1, "(r & ~g) > a"),
    P(2, "r"),
    _l(3, "~g", "As", 1),
    _l(4, "r & ~g", "ConjI", 1, [2, 3]),
    _l(5, "a", "CondE", 1, [1, 4]),
    _l(6, "~g > a", "CondI", 0, subs=[[3, 5]]),
]

# ----------------------------------------------------------------- consensus-theorem
# The trivial half is one line: `A|B` already entails `(A|B)|C`, no
# reasoning needed. The hard half assumes the whole disjunction false,
# peels `~A` and `~B` off it by the same reductio-against-DisjI pattern
# `de-morgan-disjunction` uses, then opens a *third* reductio (`p`) to turn
# `~A` plus `q` into `~p` -- at which point `~p` and `r` build `B` directly
# by `ConjI`, no further reductio needed, and `B` collides with `~B`.
# ------------------------------------------------------------- conjunctive-sufficiency
# `&E` reaches `q` directly from the premise; `>I` supplies the rest. The
# premise's `p` conjunct is never cited -- it only fixes which conditional
# gets built, not how `q` is reached.
PROOFS["conjunctive-sufficiency"] = [
    P(1, "p & q"),
    _l(2, "p", "As", 1),
    _l(3, "q", "ConjE", 1, [1]),
    _l(4, "p > q", "CondI", 0, subs=[[2, 3]]),
]

PROOFS["consensus-theorem"] = [
    _l(1, "(p & q) | (~p & r) | (q & r)", "As", 1),
    _l(2, "(p & q) | (~p & r)", "As", 2),
    _l(3, "(p & q) | (~p & r)", "Reit", 2, [2]),
    _l(4, "q & r", "As", 2),
    _l(5, "q", "ConjE", 2, [4]),
    _l(6, "r", "ConjE", 2, [4]),
    _l(7, "~((p & q) | (~p & r))", "As", 3),
    _l(8, "p & q", "As", 4),
    _l(9, "(p & q) | (~p & r)", "DisjI", 4, [8]),
    _l(10, "!", "FalsumI", 4, [9, 7]),
    _l(11, "~(p & q)", "NegI", 3, subs=[[8, 10]]),
    _l(12, "~p & r", "As", 4),
    _l(13, "(p & q) | (~p & r)", "DisjI", 4, [12]),
    _l(14, "!", "FalsumI", 4, [13, 7]),
    _l(15, "~(~p & r)", "NegI", 3, subs=[[12, 14]]),
    _l(16, "p", "As", 4),
    _l(17, "p & q", "ConjI", 4, [16, 5]),
    _l(18, "!", "FalsumI", 4, [17, 11]),
    _l(19, "~p", "NegI", 3, subs=[[16, 18]]),
    _l(20, "~p & r", "ConjI", 3, [19, 6]),
    _l(21, "!", "FalsumI", 3, [20, 15]),
    _l(22, "~~((p & q) | (~p & r))", "NegI", 2, subs=[[7, 21]]),
    _l(23, "(p & q) | (~p & r)", "NegE", 2, [22]),
    _l(24, "(p & q) | (~p & r)", "DisjE", 1, [1], [[2, 3], [4, 23]]),
    _l(25, "(p & q) | (~p & r)", "As", 1),
    _l(26, "((p & q) | (~p & r)) | (q & r)", "DisjI", 1, [25]),
    _l(27, "(((p & q) | (~p & r)) | (q & r)) = ((p & q) | (~p & r))",
       "BicondI", 0, subs=[[1, 24], [25, 26]]),
]

# ------------------------------------------------------- convention-t-gives-bivalence
# `t_p, f_p` are opaque; nothing connects them to `p` except the two premises.
# Excluded middle is not among them, so it is proved first as an undictated
# lemma (`excluded-middle`'s own ten lines, shifted two for the premises), then
# split by cases: each case names `p` or `~p` directly, and `BicondE` against
# the matching premise reads off `t_p` or `f_p` outright.
PROOFS["convention-t-gives-bivalence"] = [
    P(1, "t_p = p"),
    P(2, "f_p = ~p"),
    _l(3, "~(p | ~p)", "As", 1),
    _l(4, "p", "As", 2),
    _l(5, "p | ~p", "DisjI", 2, [4]),
    _l(6, "!", "FalsumI", 2, [5, 3]),
    _l(7, "~p", "NegI", 1, subs=[[4, 6]]),
    _l(8, "p | ~p", "DisjI", 1, [7]),
    _l(9, "~(p | ~p)", "Reit", 1, [3]),
    _l(10, "!", "FalsumI", 1, [8, 9]),
    _l(11, "~~(p | ~p)", "NegI", 0, subs=[[3, 10]]),
    _l(12, "p | ~p", "NegE", 0, [11]),
    _l(13, "p", "As", 1),
    _l(14, "t_p", "BicondE", 1, [1, 13]),
    _l(15, "t_p | f_p", "DisjI", 1, [14]),
    _l(16, "~p", "As", 1),
    _l(17, "f_p", "BicondE", 1, [2, 16]),
    _l(18, "t_p | f_p", "DisjI", 1, [17]),
    _l(19, "t_p | f_p", "DisjE", 0, [12], subs=[[13, 15], [16, 18]]),
]

# ------------------------------------------------------------- bivalence-is-no-gap
# `de-morgan-disjunction` itself, one level up: both sides of `~(p|q)=(~p&~q)`
# doubly negated (which preserves the biconditional, since `A=B` and `~A=~B`
# always agree) and the atoms renamed to the opaque `t_p`/`f_p` pair. The proof
# is the identical shape, not merely the identical theorem: -> assumes the
# disjunction and refutes the negated conjunction by cases on it; <- assumes
# the negated goal, extracts `~t_p` and `~f_p` each by a dictated reductio, and
# collides their conjunction with the premise.
PROOFS["bivalence-is-no-gap"] = [
    _l(1, "t_p | f_p", "As", 1),
    _l(2, "~t_p & ~f_p", "As", 2),
    _l(3, "~t_p", "ConjE", 2, [2]),
    _l(4, "~f_p", "ConjE", 2, [2]),
    _l(5, "t_p", "As", 3),
    _l(6, "t_p", "Reit", 3, [5]),
    _l(7, "!", "FalsumI", 3, [6, 3]),
    _l(8, "f_p", "As", 3),
    _l(9, "f_p", "Reit", 3, [8]),
    _l(10, "!", "FalsumI", 3, [9, 4]),
    _l(11, "!", "DisjE", 2, [1], subs=[[5, 7], [8, 10]]),
    _l(12, "~(~t_p & ~f_p)", "NegI", 1, subs=[[2, 11]]),
    _l(13, "~(~t_p & ~f_p)", "As", 1),
    _l(14, "~(t_p | f_p)", "As", 2),
    _l(15, "t_p", "As", 3),
    _l(16, "t_p | f_p", "DisjI", 3, [15]),
    _l(17, "!", "FalsumI", 3, [16, 14]),
    _l(18, "~t_p", "NegI", 2, subs=[[15, 17]]),
    _l(19, "f_p", "As", 3),
    _l(20, "t_p | f_p", "DisjI", 3, [19]),
    _l(21, "!", "FalsumI", 3, [20, 14]),
    _l(22, "~f_p", "NegI", 2, subs=[[19, 21]]),
    _l(23, "~t_p & ~f_p", "ConjI", 2, [18, 22]),
    _l(24, "!", "FalsumI", 2, [23, 13]),
    _l(25, "~~(t_p | f_p)", "NegI", 1, subs=[[14, 24]]),
    _l(26, "t_p | f_p", "NegE", 1, [25]),
    _l(27, "(t_p | f_p) = ~(~t_p & ~f_p)", "BicondI", 0, subs=[[1, 12], [13, 26]]),
]

# ----------------------------------------------- gaps-and-gluts-give-bivalence
# The no-gap and no-glut premises, each spent on its own half of the
# biconditional: assume `t_p` and refute `f_p` against the no-glut premise;
# assume `~f_p` and refute `~t_p` against the no-gap premise. Neither half
# needs a case split -- each is a single reductio against the matching premise.
PROOFS["gaps-and-gluts-give-bivalence"] = [
    P(1, "~(~t_p & ~f_p)"),
    P(2, "~(t_p & f_p)"),
    _l(3, "t_p", "As", 1),
    _l(4, "f_p", "As", 2),
    _l(5, "t_p & f_p", "ConjI", 2, [3, 4]),
    _l(6, "!", "FalsumI", 2, [5, 2]),
    _l(7, "~f_p", "NegI", 1, subs=[[4, 6]]),
    _l(8, "~f_p", "As", 1),
    _l(9, "~t_p", "As", 2),
    _l(10, "~t_p & ~f_p", "ConjI", 2, [9, 8]),
    _l(11, "!", "FalsumI", 2, [10, 1]),
    _l(12, "~~t_p", "NegI", 1, subs=[[9, 11]]),
    _l(13, "t_p", "NegE", 1, [12]),
    _l(14, "t_p = ~f_p", "BicondI", 0, subs=[[3, 7], [8, 13]]),
]

# --------------------------------------------- de-morgan-conjunction-hard-theorem
# `de-morgan-conjunction-hard`'s own derivation, verbatim, with its premise
# taken as an assumption instead and discharged by a closing `⊃I`.
PROOFS["de-morgan-conjunction-hard-theorem"] = [
    _l(1, "~(p & q)", "As", 1),
    _l(2, "~(~p | ~q)", "As", 2),
    _l(3, "~p", "As", 3),
    _l(4, "~p | ~q", "DisjI", 3, [3]),
    _l(5, "!", "FalsumI", 3, [4, 2]),
    _l(6, "~~p", "NegI", 2, subs=[[3, 5]]),
    _l(7, "p", "NegE", 2, [6]),
    _l(8, "~q", "As", 3),
    _l(9, "~p | ~q", "DisjI", 3, [8]),
    _l(10, "!", "FalsumI", 3, [9, 2]),
    _l(11, "~~q", "NegI", 2, subs=[[8, 10]]),
    _l(12, "q", "NegE", 2, [11]),
    _l(13, "p & q", "ConjI", 2, [7, 12]),
    _l(14, "!", "FalsumI", 2, [13, 1]),
    _l(15, "~~(~p | ~q)", "NegI", 1, subs=[[2, 14]]),
    _l(16, "~p | ~q", "NegE", 1, [15]),
    _l(17, "~(p & q) > (~p | ~q)", "CondI", 0, subs=[[1, 16]]),
]

# ------------------------------------------------- conditional-implies-disjunction
# `material-conditional`'s own `->` half, verbatim, closed with `⊃I` instead of
# carried on into the `<-` half's `∨E`.
PROOFS["conditional-implies-disjunction"] = [
    _l(1, "p > q", "As", 1),
    _l(2, "~(~p | q)", "As", 2),
    _l(3, "~p", "As", 3),
    _l(4, "~p | q", "DisjI", 3, [3]),
    _l(5, "!", "FalsumI", 3, [4, 2]),
    _l(6, "~~p", "NegI", 2, subs=[[3, 5]]),
    _l(7, "p", "NegE", 2, [6]),
    _l(8, "q", "As", 3),
    _l(9, "~p | q", "DisjI", 3, [8]),
    _l(10, "!", "FalsumI", 3, [9, 2]),
    _l(11, "~q", "NegI", 2, subs=[[8, 10]]),
    _l(12, "q", "CondE", 2, [1, 7]),
    _l(13, "!", "FalsumI", 2, [12, 11]),
    _l(14, "~~(~p | q)", "NegI", 1, subs=[[2, 13]]),
    _l(15, "~p | q", "NegE", 1, [14]),
    _l(16, "(p > q) > (~p | q)", "CondI", 0, subs=[[1, 15]]),
]

# ------------------------------------------------------ weak-excluded-middle
# `excluded-middle` verbatim with `~p` written for `p` throughout -- the same
# proof, substituted rather than reinvented.
PROOFS["weak-excluded-middle"] = [
    _l(1, "~(~p | ~~p)", "As", 1),
    _l(2, "~p", "As", 2),
    _l(3, "~p | ~~p", "DisjI", 2, [2]),
    _l(4, "!", "FalsumI", 2, [3, 1]),
    _l(5, "~~p", "NegI", 1, subs=[[2, 4]]),
    _l(6, "~p | ~~p", "DisjI", 1, [5]),
    _l(7, "~(~p | ~~p)", "Reit", 1, [1]),
    _l(8, "!", "FalsumI", 1, [6, 7]),
    _l(9, "~~(~p | ~~p)", "NegI", 0, subs=[[1, 8]]),
    _l(10, "~p | ~~p", "NegE", 0, [9]),
]

# ------------------------------------------------------- consequentia-mirabilis
# The purest reductio the twelve rules can write: the premise alone refutes
# ~p, so p follows without a second conditional to unpack first.
PROOFS["consequentia-mirabilis"] = [
    _l(1, "~p > p", "As", 1),
    _l(2, "~p", "As", 2),
    _l(3, "p", "CondE", 2, [1, 2]),
    _l(4, "~p", "Reit", 2, [2]),
    _l(5, "!", "FalsumI", 2, [3, 4]),
    _l(6, "~~p", "NegI", 1, subs=[[2, 5]]),
    _l(7, "p", "NegE", 1, [6]),
    _l(8, "(~p > p) > p", "CondI", 0, subs=[[1, 7]]),
]

# ------------------------------------------- disjunction-from-negated-conjunction
# Assume the antecedent, then reductio on the negated goal: extract ~p and ~q
# separately, each by its own inner reductio, then contradict the antecedent.
PROOFS["disjunction-from-negated-conjunction"] = [
    _l(1, "~(~p & ~q)", "As", 1),
    _l(2, "~(p | q)", "As", 2),
    _l(3, "p", "As", 3),
    _l(4, "p | q", "DisjI", 3, [3]),
    _l(5, "!", "FalsumI", 3, [4, 2]),
    _l(6, "~p", "NegI", 2, subs=[[3, 5]]),
    _l(7, "q", "As", 3),
    _l(8, "p | q", "DisjI", 3, [7]),
    _l(9, "!", "FalsumI", 3, [8, 2]),
    _l(10, "~q", "NegI", 2, subs=[[7, 9]]),
    _l(11, "~p & ~q", "ConjI", 2, [6, 10]),
    _l(12, "!", "FalsumI", 2, [11, 1]),
    _l(13, "~~(p | q)", "NegI", 1, subs=[[2, 12]]),
    _l(14, "p | q", "NegE", 1, [13]),
    _l(15, "~(~p & ~q) > (p | q)", "CondI", 0, subs=[[1, 14]]),
]

# ------------------------------------------- contraposition-recovered-theorem
# contraposition-recovered's own eight lines, one level deeper: the premise
# becomes an assumption, discharged by one more CondI at the end.
PROOFS["contraposition-recovered-theorem"] = [
    _l(1, "~q > ~p", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "~q", "As", 3),
    _l(4, "~p", "CondE", 3, [1, 3]),
    _l(5, "!", "FalsumI", 3, [2, 4]),
    _l(6, "~~q", "NegI", 2, subs=[[3, 5]]),
    _l(7, "q", "NegE", 2, [6]),
    _l(8, "p > q", "CondI", 1, subs=[[2, 7]]),
    _l(9, "(~q > ~p) > (p > q)", "CondI", 0, subs=[[1, 8]]),
]

# ------------------------------------------- hypothetical-syllogism-theorem
# hypothetical-syllogism's own two-premise proof, with the premises conjoined
# into a single assumption (split by ConjE) and the whole thing discharged by
# one further CondI. No reductio anywhere -- pure chaining.
PROOFS["hypothetical-syllogism-theorem"] = [
    _l(1, "(p > q) & (q > r)", "As", 1),
    _l(2, "p > q", "ConjE", 1, [1]),
    _l(3, "q > r", "ConjE", 1, [1]),
    _l(4, "p", "As", 2),
    _l(5, "q", "CondE", 2, [2, 4]),
    _l(6, "r", "CondE", 2, [3, 5]),
    _l(7, "p > r", "CondI", 1, subs=[[4, 6]]),
    _l(8, "((p > q) & (q > r)) > (p > r)", "CondI", 0, subs=[[1, 7]]),
]

# ------------------------------------------------- disjunction-elimination-axiom
# Both directions in one biconditional, each a case-split under an assumed
# conditional. -> assumes (p|q)>r and builds p>r and q>r separately, each by
# assuming the disjunct, introducing p|q, and detaching r. <- assumes the pair
# and rebuilds (p|q)>r by a genuine DisjE inside the fresh assumption p|q.
PROOFS["disjunction-elimination-axiom"] = [
    _l(1, "(p | q) > r", "As", 1),
    _l(2, "p", "As", 2),
    _l(3, "p | q", "DisjI", 2, [2]),
    _l(4, "r", "CondE", 2, [1, 3]),
    _l(5, "p > r", "CondI", 1, subs=[[2, 4]]),
    _l(6, "q", "As", 2),
    _l(7, "p | q", "DisjI", 2, [6]),
    _l(8, "r", "CondE", 2, [1, 7]),
    _l(9, "q > r", "CondI", 1, subs=[[6, 8]]),
    _l(10, "(p > r) & (q > r)", "ConjI", 1, [5, 9]),
    _l(11, "(p > r) & (q > r)", "As", 1),
    _l(12, "p > r", "ConjE", 1, [11]),
    _l(13, "q > r", "ConjE", 1, [11]),
    _l(14, "p | q", "As", 2),
    _l(15, "p", "As", 3),
    _l(16, "r", "CondE", 3, [12, 15]),
    _l(17, "q", "As", 3),
    _l(18, "r", "CondE", 3, [13, 17]),
    _l(19, "r", "DisjE", 2, [14], [[15, 16], [17, 18]]),
    _l(20, "(p | q) > r", "CondI", 1, subs=[[14, 19]]),
    _l(21, "((p | q) > r) = ((p > r) & (q > r))", "BicondI", 0,
       subs=[[1, 10], [11, 20]]),
]

# ------------------------------------------------------------------- suffixing
# hypothetical-syllogism-theorem's own content, curried instead of conjoined:
# three nested CondIs and nothing else, no ConjE needed because there is no
# conjunction to take apart.
PROOFS["suffixing"] = [
    _l(1, "p > q", "As", 1),
    _l(2, "q > r", "As", 2),
    _l(3, "p", "As", 3),
    _l(4, "q", "CondE", 3, [1, 3]),
    _l(5, "r", "CondE", 3, [2, 4]),
    _l(6, "p > r", "CondI", 2, subs=[[3, 5]]),
    _l(7, "(q > r) > (p > r)", "CondI", 1, subs=[[2, 6]]),
    _l(8, "(p > q) > ((q > r) > (p > r))", "CondI", 0, subs=[[1, 7]]),
]

# ------------------------------------------------------------------- antilogism
# Nelson's own axiom, by reductio. Assume the consequent's antecedent false
# (q); rebuild p&q from the pieces p&~r already supplies, detach r through
# the outer premise, and collide it with ~r -- the pair the assumption never
# had to be reiterated into, since neither side of the FalsumI is q itself.
PROOFS["antilogism"] = [
    _l(1, "(p & q) > r", "As", 1),
    _l(2, "p & ~r", "As", 2),
    _l(3, "p", "ConjE", 2, [2]),
    _l(4, "~r", "ConjE", 2, [2]),
    _l(5, "q", "As", 3),
    _l(6, "p & q", "ConjI", 3, [3, 5]),
    _l(7, "r", "CondE", 3, [1, 6]),
    _l(8, "!", "FalsumI", 3, [7, 4]),
    _l(9, "~q", "NegI", 2, subs=[[5, 8]]),
    _l(10, "(p & ~r) > ~q", "CondI", 1, subs=[[2, 9]]),
    _l(11, "((p & q) > r) > ((p & ~r) > ~q)", "CondI", 0, subs=[[1, 10]]),
]

# --------------------------------------------------------------- prefixing-axiom
# suffixing's own eight lines with the two assumptions swapped: (q>r) opens
# first, (p>q) second, and CondE fires in the order that swap dictates. Same
# shape, same length, no ConjE either -- the mirror image is the whole point.
PROOFS["prefixing-axiom"] = [
    _l(1, "q > r", "As", 1),
    _l(2, "p > q", "As", 2),
    _l(3, "p", "As", 3),
    _l(4, "q", "CondE", 3, [2, 3]),
    _l(5, "r", "CondE", 3, [1, 4]),
    _l(6, "p > r", "CondI", 2, subs=[[3, 5]]),
    _l(7, "(p > q) > (p > r)", "CondI", 1, subs=[[2, 6]]),
    _l(8, "(q > r) > ((p > q) > (p > r))", "CondI", 0, subs=[[1, 7]]),
]

# ------------------------------------- conjunctive-simplification-connexive
# The one-line reason Routley has to reject it: assume p&q, take p by ConjE,
# discharge. Nothing else is available to go wrong, which is the entry's
# whole point about how innocent-looking the target is.
PROOFS["conjunctive-simplification-connexive"] = [
    _l(1, "p & q", "As", 1),
    _l(2, "p", "ConjE", 1, [1]),
    _l(3, "(p & q) > p", "CondI", 0, subs=[[1, 2]]),
]

# --------------------------------------------------------------- sea-battle-dilemma
# constructive-dilemma's own shape, with the disjunction premise renamed to
# s|~s instead of an unrelated p|q: case s gives n by CondE and DisjI, case
# ~s gives m the same way, and DisjE off the (tautologous) first premise
# joins them. The idle premise is still cited -- DisjE needs it to open the
# case split even though no row of the table needed it to close one.
PROOFS["sea-battle-dilemma"] = [
    P(1, "s | ~s"),
    P(2, "s > n"),
    P(3, "~s > m"),
    _l(4, "s", "As", 1),
    _l(5, "n", "CondE", 1, [2, 4]),
    _l(6, "n | m", "DisjI", 1, [5]),
    _l(7, "~s", "As", 1),
    _l(8, "m", "CondE", 1, [3, 7]),
    _l(9, "n | m", "DisjI", 1, [8]),
    _l(10, "n | m", "DisjE", 0, [1], subs=[[4, 6], [7, 9]]),
]

# ---------------------------------------------------- diodorus-master-argument
# Chain the six premises down to `p | h`, then close both disjuncts against
# `~p` and `~h`. Each case's contradiction is the case assumption itself, so
# both need the required reiteration before FalsumI (§6.4): citing the `As`
# line directly would be citing the subproof's own assumption as half of its
# contradiction.
PROOFS["diodorus-master-argument"] = [
    P(1, "c > t"),
    P(2, "t > n"),
    P(3, "n > (p | h)"),
    P(4, "c"),
    P(5, "~p"),
    P(6, "~h"),
    _l(7, "t", "CondE", 0, [1, 4]),
    _l(8, "n", "CondE", 0, [2, 7]),
    _l(9, "p | h", "CondE", 0, [3, 8]),
    _l(10, "p", "As", 1),
    _l(11, "p", "Reit", 1, [10]),
    _l(12, "!", "FalsumI", 1, [11, 5]),
    _l(13, "h", "As", 1),
    _l(14, "h", "Reit", 1, [13]),
    _l(15, "!", "FalsumI", 1, [14, 6]),
    _l(16, "!", "DisjE", 0, [9], subs=[[10, 12], [13, 15]]),
]

# ---------------------------------------------------------------- preface-paradox
# Nothing but conjunction-building and one ⊥I -- the whole difficulty of the
# paradox is philosophical, not proof-theoretic.
PROOFS["preface-paradox"] = [
    P(1, "p"),
    P(2, "q"),
    P(3, "r"),
    P(4, "s"),
    P(5, "~(p & q & r & s)"),
    _l(6, "p & q", "ConjI", 0, [1, 2]),
    _l(7, "(p & q) & r", "ConjI", 0, [6, 3]),
    _l(8, "((p & q) & r) & s", "ConjI", 0, [7, 4]),
    _l(9, "!", "FalsumI", 0, [8, 5]),
]

# ------------------------------------------------------------- deontic-exhaustion
# No premises, so the whole thing is one big reductio: assume the negation of
# the target, case-split on `a` (each case closing against the same outer
# `~D`, reiterated when it is the enclosing subproof's own assumption),
# recombine `~a` and `~b` into the middle disjunct, and take DNE to discharge.
# An undictated reductio around two case splits nested inside it -- the
# proof's difficulty is exactly that nothing in the goal names any of this.
PROOFS["deontic-exhaustion"] = [
    _l(1, "~((a | (~a & ~b)) | b)", "As", 1),
    _l(2, "a", "As", 2),
    _l(3, "a | (~a & ~b)", "DisjI", 2, [2]),
    _l(4, "(a | (~a & ~b)) | b", "DisjI", 2, [3]),
    _l(5, "!", "FalsumI", 2, [4, 1]),
    _l(6, "~a", "NegI", 1, subs=[[2, 5]]),
    _l(7, "b", "As", 2),
    _l(8, "(a | (~a & ~b)) | b", "DisjI", 2, [7]),
    _l(9, "!", "FalsumI", 2, [8, 1]),
    _l(10, "~b", "NegI", 1, subs=[[7, 9]]),
    _l(11, "~a & ~b", "ConjI", 1, [6, 10]),
    _l(12, "a | (~a & ~b)", "DisjI", 1, [11]),
    _l(13, "(a | (~a & ~b)) | b", "DisjI", 1, [12]),
    _l(14, "~((a | (~a & ~b)) | b)", "Reit", 1, [1]),
    _l(15, "!", "FalsumI", 1, [13, 14]),
    _l(16, "~~((a | (~a & ~b)) | b)", "NegI", 0, subs=[[1, 15]]),
    _l(17, "(a | (~a & ~b)) | b", "NegE", 0, [16]),
]

# ------------------------------------------------------- slippery slope, MT form
# Four links and a final collision -- the same technique as lecture8-chain, one
# link longer, and simpler in one way: the contradiction falls out of the last
# premise (~e) against the chain's own end (e), never against the subproof's
# own assumption (a), so no reiteration is needed before the FalsumI.
PROOFS["slippery-slope-mt"] = [
    P(1, "a > b"),
    P(2, "b > c"),
    P(3, "c > d"),
    P(4, "d > e"),
    P(5, "~e"),
    _l(6, "a", "As", 1),
    _l(7, "b", "CondE", 1, [1, 6]),
    _l(8, "c", "CondE", 1, [2, 7]),
    _l(9, "d", "CondE", 1, [3, 8]),
    _l(10, "e", "CondE", 1, [4, 9]),
    _l(11, "!", "FalsumI", 1, [10, 5]),
    _l(12, "~a", "NegI", 0, subs=[[6, 11]]),
]

# ---------------------------------------------------------- begging the question
# The premise already is the conclusion, so the derivation is the premise line
# itself -- nothing to apply a rule to.
PROOFS["begging-the-question"] = [
    P(1, "p"),
]

# --------------------------------------------------- analogy determination rule
# The vacuous-conditional move (`redundant-disjunct`, `two-switches-lightbulb`):
# q_s is already in hand, so p_s > q_s is built by assuming p_s and reiterating
# q_s down into the subproof, never touching p_s itself. That is exactly why
# p_s is idle in the entry's own premise analysis.
PROOFS["analogy-determination-rule"] = [
    P(1, "p_s"),
    P(2, "q_s"),
    P(3, "p_t"),
    P(4, "(p_s > q_s) = (p_t > q_t)"),
    _l(5, "p_s", "As", 1),
    _l(6, "q_s", "Reit", 1, [2]),
    _l(7, "p_s > q_s", "CondI", 0, subs=[[5, 6]]),
    _l(8, "p_t > q_t", "BicondE", 0, [4, 7]),
    _l(9, "q_t", "CondE", 0, [8, 3]),
]
