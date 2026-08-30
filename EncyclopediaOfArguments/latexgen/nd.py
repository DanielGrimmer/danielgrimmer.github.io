"""Fitch derivations: a checker for the course's twelve rules, and a renderer.

A proof is a flat list of lines, each a dict:

    {"n": 5, "f": "q", "rule": "CondE", "cites": [1, 4], "depth": 1}

`depth` is the scope depth: 0 on the main scope line, 1 inside a subproof, and
so on. A line whose rule is `As` opens a subproof and must be the first line at
its depth. Rules that discharge an assumption cite a subproof as a range:

    {"n": 6, "f": "p > r", "rule": "CondI", "subs": [[3, 5]], "depth": 0}

The checker exists because the classic invisible error in a Fitch proof is a
citation reaching across a subproof that has already closed. Lecture 9 states
the accessibility rule: you may cite an earlier line only when every subproof
it lives inside is still open.

Depth alone does not express that. Two subproofs can be *siblings* -- the two
halves of a biconditional proof, the two cases of a proof by cases -- and they
sit at the same depth with nothing between them, so `min(depth[m..k])` never
dips and a line in the second case appears to be able to cite a line in the
first. It cannot: the first case is closed. So each line carries a **scope
path**, a tuple naming the subproofs it is inside, and

    line m is accessible from line k  iff  scope[m] is a prefix of scope[k]

An `As` line at depth d closes every subproof at depth d or deeper and opens a
fresh one, which is what makes the two siblings distinct.

Nothing here trusts the database's `nd` metadata; `check()` re-derives the line
count, the rules used and the maximum depth, and `verify_against_metadata()`
compares them. A proof that checks but disagrees with the stored profile is
reported, not silently accepted.
"""

from __future__ import annotations

from formula import parse

# The twelve, plus the two bookkeeping pseudo-rules the database counts.
RULES = {
    "Pr", "As", "Reit", "ConjI", "ConjE", "DisjI", "DisjE",
    "CondI", "CondE", "NegI", "NegE", "BicondI", "BicondE", "FalsumI",
}

FALSUM = "!"


class ProofError(Exception):
    pass


def ast(src: str):
    """Structural form of a formula, for equality that ignores whitespace."""
    if src.strip() == FALSUM:
        return ("falsum",)
    node, _ = parse(src)
    return _freeze(node)


def _freeze(n):
    if n.op is None:
        return ("atom", n.name)
    if n.op == "!":
        return ("falsum",)
    return (n.op,) + tuple(_freeze(k) for k in n.kids)


def _is(node, op):
    return isinstance(node, tuple) and node and node[0] == op


# ------------------------------------------------------------------ checking


def scopes(proof: list[dict]) -> dict[int, tuple]:
    """The subproof path each line sits inside, outermost first.

    Depth says how deep a line is; this says *which* subproofs it is in. They
    come apart wherever two subproofs are siblings -- the two halves of a
    biconditional proof, the two cases of a proof by cases -- because those sit
    at the same depth with no line between them at a shallower one.

    An assumption is what starts a subproof, so an `As` line at depth d ends
    every subproof at depth d or deeper and opens a fresh one.
    """
    out: dict[int, tuple] = {}
    path: list[int] = []
    made = 0
    for ln in proof:
        d = ln.get("depth", 0)
        if ln["rule"] == "As":
            del path[max(d - 1, 0):]
            made += 1
            path.append(made)
        else:
            del path[d:]
        out[ln["n"]] = tuple(path)
    return out


def check(proof: list[dict], premises: list[str], conclusion: str) -> dict:
    """Verify a derivation. Raises ProofError on the first fault found."""
    if not proof:
        raise ProofError("empty proof")

    by_n = {}
    depth = {}
    for i, ln in enumerate(proof):
        n = ln["n"]
        if n in by_n:
            raise ProofError(f"line {n} appears twice")
        by_n[n] = ln
        depth[n] = ln.get("depth", 0)
        if ln["rule"] not in RULES:
            raise ProofError(f"line {n}: unknown rule {ln['rule']}")

    order = [ln["n"] for ln in proof]
    pos = {n: i for i, n in enumerate(order)}
    scope = scopes(proof)

    # Depth may only rise by one, and only on an `As` line.
    prev = 0
    for ln in proof:
        d = depth[ln["n"]]
        if d > prev:
            if d != prev + 1:
                raise ProofError(f"line {ln['n']}: depth jumps {prev} -> {d}")
            if ln["rule"] != "As":
                raise ProofError(
                    f"line {ln['n']}: opens a subproof but its rule is {ln['rule']}, not As"
                )
        prev = d

    # Premises: the depth-0 `Pr` lines, in order, must be exactly the entry's.
    prs = [ln for ln in proof if ln["rule"] == "Pr"]
    if [ast(l["f"]) for l in prs] != [ast(p) for p in premises]:
        raise ProofError(
            f"premise lines {[l['f'] for l in prs]} do not match the entry's {premises}"
        )
    for ln in prs:
        if depth[ln["n"]] != 0:
            raise ProofError(f"line {ln['n']}: a premise must sit at depth 0")

    def accessible(m: int, k: int) -> bool:
        if m not in pos or pos[m] >= pos[k]:
            return False
        sm = scope[m]
        return scope[k][: len(sm)] == sm

    def cite(k: int, m: int) -> tuple:
        if not accessible(m, k):
            raise ProofError(
                f"line {k} cites line {m}, which is not accessible "
                f"(a subproof containing it has closed)"
            )
        return ast(by_n[m]["f"])

    def subproof(k: int, rng) -> tuple:
        a, b = rng
        if a not in by_n or b not in by_n:
            raise ProofError(f"line {k}: subproof {a}-{b} refers to a missing line")
        if by_n[a]["rule"] != "As":
            raise ProofError(f"line {k}: subproof {a}-{b} does not open with As")
        d = depth[a]
        if depth[b] != d:
            raise ProofError(
                f"line {k}: subproof {a}-{b} ends at depth {depth[b]}, opened at {d}"
            )
        for j in order[pos[a]: pos[b] + 1]:
            if scope[j][: len(scope[a])] != scope[a]:
                raise ProofError(f"line {k}: subproof {a}-{b} is not contiguous")
        # It must be closed by the time it is cited, and its parent scope live.
        if pos[b] >= pos[k]:
            raise ProofError(f"line {k}: cites subproof {a}-{b} before it ends")
        if depth[k] > d - 1:
            raise ProofError(
                f"line {k} is at depth {depth[k]}; discharging {a}-{b} must land at depth {d - 1}"
            )
        # The discharge belongs in the scope that *contained* the subproof --
        # not merely at the right depth, which a later sibling also has.
        if scope[k] != scope[a][:-1]:
            raise ProofError(f"line {k}: subproof {a}-{b} is out of scope")
        return ast(by_n[a]["f"]), ast(by_n[b]["f"])

    for ln in proof:
        n, rule, f = ln["n"], ln["rule"], ast(ln["f"])
        cites = ln.get("cites", [])
        subs = ln.get("subs", [])

        if rule in ("Pr", "As"):
            continue

        if rule == "Reit":
            (a,) = cites
            if cite(n, a) != f:
                raise ProofError(f"line {n}: Reit,{a} does not repeat that line")

        elif rule == "ConjI":
            a, b = cites
            if f != ("&", cite(n, a), cite(n, b)):
                raise ProofError(f"line {n}: &I,{a},{b} does not build this conjunction")

        elif rule == "ConjE":
            (a,) = cites
            src = cite(n, a)
            if not _is(src, "&") or f not in (src[1], src[2]):
                raise ProofError(f"line {n}: &E,{a} is not a conjunct of line {a}")

        elif rule == "DisjI":
            (a,) = cites
            src = cite(n, a)
            if not _is(f, "|") or src not in (f[1], f[2]):
                raise ProofError(f"line {n}: ∨I,{a} — line {a} is not a disjunct here")

        elif rule == "DisjE":
            (a,) = cites
            src = cite(n, a)
            if not _is(src, "|"):
                raise ProofError(f"line {n}: ∨E,{a} — line {a} is not a disjunction")
            (h1, c1), (h2, c2) = subproof(n, subs[0]), subproof(n, subs[1])
            if {h1, h2} != {src[1], src[2]}:
                raise ProofError(f"line {n}: ∨E assumptions are not the two disjuncts")
            if c1 != f or c2 != f:
                raise ProofError(f"line {n}: ∨E — the two cases do not both end here")

        elif rule == "CondI":
            h, c = subproof(n, subs[0])
            if f != (">", h, c):
                raise ProofError(f"line {n}: ⊃I does not discharge into this conditional")

        elif rule == "CondE":
            a, b = cites
            src, ante = cite(n, a), cite(n, b)
            if not _is(src, ">") or src[1] != ante or src[2] != f:
                raise ProofError(f"line {n}: ⊃E,{a},{b} is not modus ponens here")

        elif rule == "NegI":
            h, c = subproof(n, subs[0])
            if c != ("falsum",):
                raise ProofError(f"line {n}: ∼I — the subproof does not end in ⊥")
            if f != ("~", h):
                raise ProofError(f"line {n}: ∼I does not negate the assumption")

        elif rule == "NegE":
            (a,) = cites
            src = cite(n, a)
            if not (_is(src, "~") and _is(src[1], "~") and src[1][1] == f):
                raise ProofError(f"line {n}: ∼E,{a} is not double-negation elimination")

        elif rule == "BicondI":
            (h1, c1), (h2, c2) = subproof(n, subs[0]), subproof(n, subs[1])
            if not _is(f, "="):
                raise ProofError(f"line {n}: ≡I does not build a biconditional")
            if not ((h1, c1, h2, c2) == (f[1], f[2], f[2], f[1])):
                raise ProofError(f"line {n}: ≡I — the two subproofs do not cross over")

        elif rule == "BicondE":
            a, b = cites
            src, side = cite(n, a), cite(n, b)
            if not _is(src, "="):
                raise ProofError(f"line {n}: ≡E,{a} — line {a} is not a biconditional")
            if not ((side == src[1] and f == src[2]) or (side == src[2] and f == src[1])):
                raise ProofError(f"line {n}: ≡E,{a},{b} does not cross the biconditional")

        elif rule == "FalsumI":
            a, b = cites
            x, y = cite(n, a), cite(n, b)
            if f != ("falsum",):
                raise ProofError(f"line {n}: ⊥I must conclude ⊥")
            if y != ("~", x):
                raise ProofError(
                    f"line {n}: ⊥I,{a},{b} — line {b} is not the negation of line {a}"
                )

    last = proof[-1]
    if depth[last["n"]] != 0:
        raise ProofError("the proof ends inside a subproof")
    if ast(last["f"]) != ast(conclusion):
        raise ProofError(
            f"the proof ends with {last['f']}, not the conclusion {conclusion}"
        )

    return {
        "lines": len(proof),
        "rules_used": sorted({l["rule"] for l in proof}),
        "max_subproof_depth": max(depth.values()),
        "subproof_count": sum(1 for l in proof if l["rule"] == "As"),
        "assumption_count": sum(1 for l in proof if l["rule"] == "As"),
        "uses_indirect_proof": any(l["rule"] in ("NegI", "NegE") for l in proof),
    }


# ----------------------------------------------------------------- rendering

_RULE_MACRO = {
    "Reit": r"\Reit", "ConjI": r"\ConjI", "ConjE": r"\ConjE",
    "DisjI": r"\DisjI", "DisjE": r"\DisjE", "CondI": r"\CondI",
    "CondE": r"\CondE", "NegI": r"\NegI", "NegE": r"\NegE",
    "BicondI": r"\BicondI", "BicondE": r"\BicondE", "FalsumI": r"\FalsumI",
}


def _by(ln: dict):
    r"""The rule macro and its references, for `\by{<rule>}{<refs>}`.

    **Premises and assumptions are not cited.** A `\hypo` line carries no
    justification -- the bar and the `\open` are what mark it -- so this
    returns nothing for them.

    References use a **plain hyphen** for a range. `\by` passes them through
    `\ndref`, which walks the string, turns `-` into a proper en dash and puts
    the space after each comma itself; `\text{--}` is right only in the older
    inline spelling, which had no `\ndref` to do the work.

    A rule discharging **one** subproof cites its first and last line with a
    comma -- `⊃I, 2, 6` -- since the rule name already says a subproof is being
    discharged. One discharging **two** needs the ranges: `∨E, 1, 2-3, 4-5`
    would otherwise be five numbers with no way to tell which pairs go
    together.
    """
    if ln["rule"] in ("Pr", "As"):
        return None
    bits = [str(c) for c in ln.get("cites", [])]
    subs = ln.get("subs", [])
    if len(subs) == 1:
        bits += [str(n) for n in subs[0]]
    else:
        bits += [f"{a}-{b}" for a, b in subs]
    return _RULE_MACRO[ln["rule"]], ",".join(bits)


def render_proof(proof: list[dict]) -> str:
    r"""A `fitch` derivation, with its justifications in the third column.

    `nd` is a three-column array -- line number, formula, justification -- and
    `\by` fills the third. That is why every citation lines up without a single
    hand-tuned `\quad`: the column sizes itself to its widest entry.

    This used to set the citation *inside* the formula argument, padded with
    `\mathmakebox` to the width of the widest formula in the proof. It worked,
    but it measured the citation as part of the *formula* column, which made
    every display far wider than it needed to be. Do not mix the two spellings
    in one display: a single inline citation among `\by` ones roughly triples
    the width.

    The scope lines are drawn from the scope *path*, not the depth: two sibling
    subproofs sit at the same depth with nothing between them, and opening and
    closing on depth alone runs them into one.
    """
    from formula import latex

    scope = scopes(proof)
    out = ["\\begin{align*}", "\\begin{nd}"]
    prev: tuple = ()
    for ln in proof:
        here = scope[ln["n"]]
        shared = 0
        while (
            shared < len(prev)
            and shared < len(here)
            and prev[shared] == here[shared]
        ):
            shared += 1
        out += ["\\close"] * (len(prev) - shared)
        out += ["\\open"] * (len(here) - shared)
        prev = here

        tex = latex(ln["f"])
        by = _by(ln)
        if by is None:
            out.append(f"\\hypo{{{ln['n']}}}{{{tex}}}")
        else:
            out.append(f"\\have{{{ln['n']}}}{{{tex}}}\\by{{{by[0]}}}{{{by[1]}}}")
    out += ["\\close"] * len(prev)
    out += ["\\end{nd}", "\\end{align*}"]
    return "\n".join(out)
