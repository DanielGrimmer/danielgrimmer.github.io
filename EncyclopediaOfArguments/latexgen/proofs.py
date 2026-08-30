"""Fitch derivations for the eighteen valid entries.

Hand-authored in the course's twelve-rule system and checked line by line by
`nd.check()`, which re-derives the profile rather than trusting it.

Two conventions worth stating, because they shorten several proofs:

  * **Reiteration is usually unnecessary.** A formula on an outer scope line
    stays accessible inside a subproof, so it can be cited directly. The
    handouts sometimes reiterate anyway, for readability. `lecture8-chain`
    keeps its `\\Reit` because that proof is Lecture 10's own, verbatim, and it
    is the one students have seen.
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
# Both directions by reductio, then ≡I crosses them over. Each half needs the
# outer half's assumption imported unreiterated, per the guide's ruling in
# 6.4: the contradiction is not with the reductio's own assumption, so citing
# it directly (rather than bringing it down with \Reit) is the right call.
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
    _l(16, "!", "FalsumI", 3, [15, 12]),
    _l(17, "q", "As", 3),
    _l(18, "!", "FalsumI", 3, [17, 13]),
    _l(19, "!", "DisjE", 2, [14], [[15, 16], [17, 18]]),
    _l(20, "~(p | q)", "NegI", 1, subs=[[14, 19]]),
    _l(21, "(~(p | q)) = (~p & ~q)", "BicondI", 0, subs=[[1, 10], [11, 20]]),
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
    _l(7, "!", "FalsumI", 1, [6, 1]),
    _l(8, "~~(p | ~p)", "NegI", 0, subs=[[1, 7]]),
    _l(9, "p | ~p", "NegE", 0, [8]),
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
    _l(16, "!", "FalsumI", 1, [15, 1]),
    _l(17, "~~((q > p) | (p > r))", "NegI", 0, subs=[[1, 16]]),
    _l(18, "(q > p) | (p > r)", "NegE", 0, [17]),
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
    _l(16, "!", "FalsumI", 1, [15, 1]),
    _l(17, "~~((p > q) | (q > p))", "NegI", 0, subs=[[1, 16]]),
    _l(18, "(p > q) | (q > p)", "NegE", 0, [17]),
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
    _l(4, "!", "FalsumI", 1, [2, 3]),
    _l(5, "~c", "NegI", 0, subs=[[2, 4]]),
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
    _l(6, "!", "FalsumI", 1, [5, 3]),
    _l(7, "~~q", "NegI", 0, subs=[[3, 6]]),
    _l(8, "q", "NegE", 0, [7]),
    _l(9, "p", "BicondE", 0, [1, 8]),
    _l(10, "~q", "BicondE", 0, [2, 9]),
    _l(11, "!", "FalsumI", 0, [8, 10]),
    _l(12, "~r", "As", 1),
    _l(13, "!", "Reit", 1, [11]),
    _l(14, "~~r", "NegI", 0, subs=[[12, 13]]),
    _l(15, "r", "NegE", 0, [14]),
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
    _l(2, "p > p", "CondI", 0, subs=[[1, 1]]),
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
    _l(13, "!", "FalsumI", 1, [12, 1]),
    _l(14, "~~(p | (p > q))", "NegI", 0, subs=[[1, 13]]),
    _l(15, "p | (p > q)", "NegE", 0, [14]),
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
    _l(4, "!", "FalsumI", 1, [2, 3]),
    _l(5, "~p", "NegI", 0, subs=[[2, 4]]),
    _l(6, "p", "BicondE", 0, [1, 5]),
    _l(7, "!", "FalsumI", 0, [6, 5]),
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
    _l(21, "!", "FalsumI", 2, [20, 13]),
    _l(22, "~~(p | q)", "NegI", 1, subs=[[13, 21]]),
    _l(23, "p | q", "NegE", 1, [22]),
    _l(24, "(p | q) = (~p > q)", "BicondI", 0, subs=[[1, 11], [12, 23]]),
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
    _l(16, "!", "FalsumI", 2, [15, 2]),
    _l(17, "~~((p & q) | (~p & ~q))", "NegI", 1, subs=[[2, 16]]),
    _l(18, "(p & q) | (~p & ~q)", "NegE", 1, [17]),
    _l(19, "p & q", "As", 2),
    _l(20, "~p | ~q", "As", 3),
    _l(21, "~p", "As", 4),
    _l(22, "p", "ConjE", 4, [19]),
    _l(23, "!", "FalsumI", 4, [22, 21]),
    _l(24, "~q", "As", 4),
    _l(25, "q", "ConjE", 4, [19]),
    _l(26, "!", "FalsumI", 4, [25, 24]),
    _l(27, "!", "DisjE", 3, [20], subs=[[21, 23], [24, 26]]),
    _l(28, "~(~p | ~q)", "NegI", 2, subs=[[20, 27]]),
    _l(29, "~(~p | ~q) | ~(p | q)", "DisjI", 2, [28]),
    _l(30, "~p & ~q", "As", 2),
    _l(31, "p | q", "As", 3),
    _l(32, "p", "As", 4),
    _l(33, "~p", "ConjE", 4, [30]),
    _l(34, "!", "FalsumI", 4, [32, 33]),
    _l(35, "q", "As", 4),
    _l(36, "~q", "ConjE", 4, [30]),
    _l(37, "!", "FalsumI", 4, [35, 36]),
    _l(38, "!", "DisjE", 3, [31], subs=[[32, 34], [35, 37]]),
    _l(39, "~(p | q)", "NegI", 2, subs=[[31, 38]]),
    _l(40, "~(~p | ~q) | ~(p | q)", "DisjI", 2, [39]),
    _l(41, "~(~p | ~q) | ~(p | q)", "DisjE", 1, [18], subs=[[19, 29], [30, 40]]),
    _l(42, "~(~p | ~q) | ~(p | q)", "As", 1),
    _l(43, "~(~p | ~q)", "As", 2),
    _l(44, "~p", "As", 3),
    _l(45, "~p | ~q", "DisjI", 3, [44]),
    _l(46, "!", "FalsumI", 3, [45, 43]),
    _l(47, "~~p", "NegI", 2, subs=[[44, 46]]),
    _l(48, "p", "NegE", 2, [47]),
    _l(49, "~q", "As", 3),
    _l(50, "~p | ~q", "DisjI", 3, [49]),
    _l(51, "!", "FalsumI", 3, [50, 43]),
    _l(52, "~~q", "NegI", 2, subs=[[49, 51]]),
    _l(53, "q", "NegE", 2, [52]),
    _l(54, "p", "As", 3),
    _l(55, "q", "Reit", 3, [53]),
    _l(56, "q", "As", 3),
    _l(57, "p", "Reit", 3, [48]),
    _l(58, "p = q", "BicondI", 2, subs=[[54, 55], [56, 57]]),
    _l(59, "~(p | q)", "As", 2),
    _l(60, "p", "As", 3),
    _l(61, "p | q", "DisjI", 3, [60]),
    _l(62, "!", "FalsumI", 3, [61, 59]),
    _l(63, "~p", "NegI", 2, subs=[[60, 62]]),
    _l(64, "q", "As", 3),
    _l(65, "p | q", "DisjI", 3, [64]),
    _l(66, "!", "FalsumI", 3, [65, 59]),
    _l(67, "~q", "NegI", 2, subs=[[64, 66]]),
    _l(68, "p", "As", 3),
    _l(69, "~q", "As", 4),
    _l(70, "!", "FalsumI", 4, [68, 63]),
    _l(71, "~~q", "NegI", 3, subs=[[69, 70]]),
    _l(72, "q", "NegE", 3, [71]),
    _l(73, "q", "As", 3),
    _l(74, "~p", "As", 4),
    _l(75, "!", "FalsumI", 4, [73, 67]),
    _l(76, "~~p", "NegI", 3, subs=[[74, 75]]),
    _l(77, "p", "NegE", 3, [76]),
    _l(78, "p = q", "BicondI", 2, subs=[[68, 72], [73, 77]]),
    _l(79, "p = q", "DisjE", 1, [42], subs=[[43, 58], [59, 78]]),
    _l(80, "(p = q) = (~(~p | ~q) | ~(p | q))", "BicondI", 0, subs=[[1, 41], [42, 79]]),
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
    _l(4, "!", "FalsumI", 3, [3, 2]),
    _l(5, "~q", "As", 4),
    _l(6, "!", "Reit", 4, [4]),
    _l(7, "~~q", "NegI", 3, subs=[[5, 6]]),
    _l(8, "q", "NegE", 3, [7]),
    _l(9, "p > q", "CondI", 2, subs=[[3, 8]]),
    _l(10, "!", "FalsumI", 2, [9, 1]),
    _l(11, "~~p", "NegI", 1, subs=[[2, 10]]),
    _l(12, "p", "NegE", 1, [11]),
    _l(13, "q", "As", 2),
    _l(14, "p", "As", 3),
    _l(15, "q", "Reit", 3, [13]),
    _l(16, "p > q", "CondI", 2, subs=[[14, 15]]),
    _l(17, "!", "FalsumI", 2, [16, 1]),
    _l(18, "~q", "NegI", 1, subs=[[13, 17]]),
    _l(19, "p & ~q", "ConjI", 1, [12, 18]),
    _l(20, "p & ~q", "As", 1),
    _l(21, "p > q", "As", 2),
    _l(22, "p", "ConjE", 2, [20]),
    _l(23, "~q", "ConjE", 2, [20]),
    _l(24, "q", "CondE", 2, [21, 22]),
    _l(25, "!", "FalsumI", 2, [24, 23]),
    _l(26, "~(p > q)", "NegI", 1, subs=[[21, 25]]),
    _l(27, "(~(p > q)) = (p & ~q)", "BicondI", 0, subs=[[1, 19], [20, 26]]),
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
    _l(7, "!", "FalsumI", 1, [6, 1]),
    _l(8, "~~(p | ~p)", "NegI", 0, subs=[[1, 7]]),
    _l(9, "p | ~p", "NegE", 0, [8]),
    _l(10, "~p > (p | q)", "As", 1),
    _l(11, "p", "As", 2),
    _l(12, "p | q", "DisjI", 2, [11]),
    _l(13, "~p", "As", 2),
    _l(14, "p | q", "CondE", 2, [10, 13]),
    _l(15, "p | q", "DisjE", 1, [9], subs=[[11, 12], [13, 14]]),
    _l(16, "p | q", "As", 1),
    _l(17, "~p", "As", 2),
    _l(18, "p | q", "Reit", 2, [16]),
    _l(19, "~p > (p | q)", "CondI", 1, subs=[[17, 18]]),
    _l(20, "(~p > (p | q)) = (p | q)", "BicondI", 0, subs=[[10, 15], [16, 19]]),
]
