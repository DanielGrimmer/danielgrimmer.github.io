"""Everything an entry's structured data can be computed from its sequent.

`build.py` regenerates the *blocks* from an entry's structured data, and checks
them against it. But the structured data itself -- the truth table, the verdict,
the tableau, the metrics -- came from a generator upstream of this repository,
which meant a new entry had to arrive with all of it hand-written. That is a lot
of JSON to get right by hand, and a tableau especially: a wrong `from` link is
invisible until the tree is drawn.

So this computes it. Given premises and a conclusion it returns the fields an
entry needs, and `build.py` will then recompute the blocks from them and refuse
anything that does not agree -- so the two derivations have to match, and a bug
here shows up as a build failure rather than as a wrong tree on the site.

    python3 derive.py "p > q" "~q" --conclusion "~p"
    python3 derive.py --check          # against all 35 existing entries
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from formula import GLYPH, Node, atoms_of, canonical, evaluate, parse

ASCII_TO_GLYPH = {"~": "∼", "&": "&", "|": "∨", ">": "⊃", "=": "≡", "!": "⊥"}
CONNECTIVE_NAME = {
    "~": "negation", "&": "conjunction", "|": "disjunction",
    ">": "conditional", "=": "biconditional",
}


def glyphs(src: str) -> str:
    return "".join(ASCII_TO_GLYPH.get(c, c) for c in src)


def show(node: Node, outermost: bool = True) -> str:
    """Glyph spelling, fully parenthesised bar the outermost pair."""
    if node.op is None:
        return node.name
    if node.op == "!":
        return "⊥"
    if node.op == "~":
        return "∼" + show(node.kids[0], False)
    inner = f"{show(node.kids[0], False)} {ASCII_TO_GLYPH[node.op]} {show(node.kids[1], False)}"
    return inner if outermost else f"({inner})"


def negate(node: Node) -> Node:
    return Node("~", kids=[node])


def size(node: Node) -> int:
    return 1 if node.op is None else 1 + sum(size(k) for k in node.kids)


def depth(node: Node) -> int:
    return 0 if node.op is None else 1 + max((depth(k) for k in node.kids), default=0)


def models(atoms: list[str]) -> list[dict[str, bool]]:
    """Every assignment, all-true first -- the course's row order."""
    out = []
    for n in range(2 ** len(atoms)):
        out.append({a: not (n >> (len(atoms) - 1 - i)) & 1 for i, a in enumerate(atoms)})
    return out


# ------------------------------------------------------------------ the table


def truth_table(prem: list[Node], concl: Node | None, atoms: list[str]) -> dict:
    rows = []
    for m in models(atoms):
        vals = [evaluate(r, m) for r in prem]
        c = None if concl is None else evaluate(concl, m)
        live = all(vals)
        rows.append(
            {
                "assignment": {a: "T" if m[a] else "F" for a in atoms},
                "premises": ["T" if v else "F" for v in vals],
                "conclusion": "F" if c is None else ("T" if c else "F"),
                "premises_all_true": live,
                "countermodel": live and c is False,
            }
        )
    return {"atoms": list(atoms), "columns": [], "rows": rows}


# ------------------------------------------------------------------- the tree

# The nine rules of Lecture 6-8, as (branching?, results). A result is a list of
# formulas to add; a branching rule has two such lists.
def decompose(node: Node) -> tuple[str, bool, list[list[Node]]] | None:
    """The rule that applies to a formula, and what it yields."""
    if node.op == "~" and node.kids[0].op == "~":
        return "∼∼", False, [[node.kids[0].kids[0]]]
    if node.op == "&":
        return "&", False, [[node.kids[0], node.kids[1]]]
    if node.op == "|":
        return "∨", True, [[node.kids[0]], [node.kids[1]]]
    if node.op == ">":
        return "⊃", True, [[negate(node.kids[0])], [node.kids[1]]]
    if node.op == "=":
        return "≡", True, [
            [node.kids[0], node.kids[1]],
            [negate(node.kids[0]), negate(node.kids[1])],
        ]
    if node.op == "~":
        inner = node.kids[0]
        if inner.op == "&":
            return "∼&", True, [[negate(inner.kids[0])], [negate(inner.kids[1])]]
        if inner.op == "|":
            return "∼∨", False, [[negate(inner.kids[0]), negate(inner.kids[1])]]
        if inner.op == ">":
            return "∼⊃", False, [[inner.kids[0], negate(inner.kids[1])]]
        if inner.op == "=":
            return "∼≡", True, [
                [inner.kids[0], negate(inner.kids[1])],
                [negate(inner.kids[0]), inner.kids[1]],
            ]
    return None


def closes(branch: list[str]) -> bool:
    have = set(branch)
    return any(("∼" + f if not f.startswith("∼") else f[1:]) in have for f in have)


def build_tree(roots: list[Node], atoms: list[str]) -> dict:
    """The tableau, as the nested nodes the renderer and the site expect.

    Non-branching rules first, which is the course's order and the reason the
    trees stay narrow: everything forced is written down before a fork is
    opened. A branch closes the moment it holds a sentence and its negation;
    one that runs out of rules is open, and the atoms on it are a countermodel.
    """
    stats = {"open": 0, "closed": 0, "models": [], "depth": 0}

    def grow(branch: list[str], pending: list[Node], done: set[str], level: int) -> dict:
        node: dict = {"added": [], "children": [], "status": None}
        stats["depth"] = max(stats["depth"], level)

        # Everything forced, before anything chosen.
        while True:
            if closes(branch):
                node["status"] = "closed"
                return node
            nxt = None
            for f in pending:
                key = show(f)
                got = decompose(f)
                if key in done or not got:
                    continue
                if not got[1]:
                    nxt = (f, key, got)
                    break
            if nxt is None:
                break
            f, key, (rule, _, results) = nxt
            done.add(key)
            for r in results[0]:
                node["added"].append({"formula": show(r), "from": key, "rule": rule})
                branch.append(show(r))
                pending.append(r)

        if closes(branch):
            node["status"] = "closed"
            return node

        fork = None
        for f in pending:
            key = show(f)
            got = decompose(f)
            if key not in done and got and got[1]:
                fork = (f, key, got)
                break

        if fork is None:
            node["status"] = "open"
            model, free = read_off(branch, atoms)
            node["model"] = model
            node["unconstrained"] = free
            stats["open"] += 1
            stats["models"].append(model)
            return node

        f, key, (rule, _, results) = fork
        node["branched_on"] = key
        node["branch_rule"] = rule
        for side in results:
            kid_branch = list(branch)
            kid_pending = list(pending)
            first = []
            for r in side:
                first.append({"formula": show(r), "from": key, "rule": rule})
                kid_branch.append(show(r))
                kid_pending.append(r)
            kid = grow(kid_branch, kid_pending, set(done) | {key}, level + 1)
            kid["added"] = first + kid["added"]
            node["children"].append(kid)
            if kid["status"] == "closed":
                stats["closed"] += 1
        return node

    branch = [show(r) for r in roots]
    tree = grow(branch, list(roots), set(), 0)
    # A closed root with no children is one closed branch.
    if tree["status"] == "closed" and not tree["children"]:
        stats["closed"] = 1
    return {
        "roots": [show(r) for r in roots],
        "tree": tree,
        "open_branches": stats["open"],
        "closed_branches": stats["closed"],
        "branch_depth": stats["depth"],
        "branch_models": stats["models"],
    }


def read_off(branch: list[str], atoms: list[str]) -> tuple[dict, list[str]]:
    """The countermodel an open branch names, and the atoms it left free."""
    model, free = {}, []
    for a in atoms:
        if a in branch:
            model[a] = "T"
        elif "∼" + a in branch:
            model[a] = "F"
        else:
            model[a] = "T"
            free.append(a)
    return model, free


# ------------------------------------------------------------------- the rest


def derive(premises: list[str], conclusion: str) -> dict:
    premises = [canonical(p) for p in premises]
    conclusion = conclusion if conclusion.strip() == "!" else canonical(conclusion)

    prem = [parse(p)[0] for p in premises]
    concl = None if conclusion == "!" else parse(conclusion)[0]

    atoms: list[str] = []
    for root in prem + ([concl] if concl is not None else []):
        for a in atoms_of(root):
            if a not in atoms:
                atoms.append(a)

    tt = truth_table(prem, concl, atoms)
    tt["columns"] = [glyphs(p) for p in premises] + [glyphs(conclusion)]
    rows = tt["rows"]

    countermodels = [r["assignment"] for r in rows if r["countermodel"]]
    live = sum(1 for r in rows if r["premises_all_true"])
    verdict = {
        "valid": not countermodels,
        "rows": len(rows),
        "premise_true_rows": live,
        "countermodel_count": len(countermodels),
        "countermodels": countermodels,
        "premises_satisfiable": live > 0,
    }

    roots = list(prem) + ([negate(concl)] if concl is not None else [])
    tree = build_tree(roots, atoms)

    analysis = []
    for i, p in enumerate(premises):
        rest = [r for j, r in enumerate(prem) if j != i]
        without = [
            m for m in models(atoms)
            if all(evaluate(r, m) for r in rest)
            and (concl is not None and not evaluate(concl, m))
        ]
        analysis.append(
            {
                "premise": p,
                "index": i,
                "load_bearing": bool(without) and not countermodels,
                "idle": len(without) == len(countermodels),
                "countermodels_without_it": len(without),
            }
        )

    def ops(node: Node, out: set) -> set:
        if node.op in CONNECTIVE_NAME:
            out.add(CONNECTIVE_NAME[node.op])
        for k in node.kids:
            ops(k, out)
        return out

    used = sorted(ops(Node("&", kids=list(prem) + ([concl] if concl else [])), set())
                  - {"conjunction"} | (
        {"conjunction"} if any("&" in p for p in premises + [conclusion]) else set()))

    return {
        "premises": premises,
        "conclusion": conclusion,
        "truth_table": tt,
        "verdict": verdict,
        "tree": tree,
        "premise_analysis": analysis,
        "metrics": {
            "atom_count": len(atoms),
            "premise_count": len(premises),
            "connectives": used,
            "max_formula_depth": max(
                (depth(r) for r in prem + ([concl] if concl else [])), default=0
            ),
            "total_formula_size": sum(size(r) for r in prem + ([concl] if concl else [])),
            "table_rows": len(rows),
            "tree_open_branches": tree["open_branches"],
            "tree_closed_branches": tree["closed_branches"],
            "tree_branch_depth": tree["branch_depth"],
            "countermodel_count": len(countermodels),
            "premise_true_rows": live,
            "idle_premises": [a["premise"] for a in analysis if a["idle"]],
        },
    }


def check() -> int:
    """Against the entries already in the database, which came from elsewhere.

    Two of the seven fields are checked for *agreement*, not identity. Row
    order follows the atom order, and the stored entries list their atoms
    alphabetically while this lists them in order of first appearance, so the
    tables are compared as sets of rows. And a tableau is not unique -- the
    order the rules are applied in is the author's -- so the tree is checked
    against what any correct tree must satisfy rather than against the shape of
    the one on file: it closes everywhere exactly when the argument is valid,
    and every branch it leaves open names a real countermodel.
    """
    db = json.loads((Path(__file__).parents[2] / "assets/arguments/argument-db.json").read_text())
    bad = 0

    def report(eid, field, mine, theirs):
        nonlocal bad
        bad += 1
        print(f"  {eid}: {field}: computed {mine!r}, stored {theirs!r}"[:180])

    for e in db["entries"]:
        got = derive(e["premises"], e["conclusion"])
        prem = [parse(p)[0] for p in e["premises"]]
        concl = None if e["conclusion"] == "!" else parse(e["conclusion"])[0]

        for key in ("valid", "rows", "premise_true_rows", "countermodel_count",
                    "premises_satisfiable"):
            if got["verdict"][key] != e["verdict"][key]:
                report(e["id"], f"verdict.{key}", got["verdict"][key], e["verdict"][key])

        def rowset(rows):
            return sorted(
                (tuple(sorted(r["assignment"].items())), tuple(r["premises"]), r["conclusion"])
                for r in rows
            )

        if rowset(got["truth_table"]["rows"]) != rowset(e["truth_table"]["rows"]):
            report(e["id"], "table", "a different set of rows", "the stored rows")

        tree = got["tree"]
        if bool(tree["open_branches"]) == e["verdict"]["valid"]:
            report(e["id"], "tree", f"{tree['open_branches']} open", f"valid={e['verdict']['valid']}")
        for m in tree["branch_models"]:
            model = {a: v == "T" for a, v in m.items()}
            if not (all(evaluate(r, model) for r in prem)
                    and (concl is None or not evaluate(concl, model))):
                report(e["id"], "open branch", m, "not a countermodel")

    print("every entry reproduced" if not bad else f"{bad} disagreements")
    return bad


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("premises", nargs="*")
    ap.add_argument("--conclusion")
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    if args.check:
        sys.exit(1 if check() else 0)
    print(json.dumps(derive(args.premises, args.conclusion), indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
