"""Fold the LaTeX blocks into argument-db.json.

Run from this directory:

    python3 build.py --check     # generate, verify, report; write nothing
    python3 build.py --write     # generate, verify, and update the database

Every block is generated from the entry's own structured data, then checked
against it: a table's values are recomputed from the formulas, a tree's shape is
walked from the stored nodes, and a proof is verified line by line by
`nd.check()`. Nothing is asserted -- if a block cannot be justified from the
data, the build stops.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from formula import GLYPH, canonical, subformula_index, to_ascii
from nd import ProofError, check, render_proof
from proofs import PROOFS
from tables import table_block
from trees import tree_block

DB = Path(__file__).resolve().parents[2] / "assets/arguments/argument-db.json"

PREAMBLE = [
    "FOL_Yale/notation",
    "qtree",
    "fitch",
    "amsmath",
    "amssymb",
    "stmaryrd",
    "mathtools",
    "calc",
    "graphicx",
    "pifont",
]

# The one macro these blocks need beyond notation.sty: a value centred in the
# width of the connective it belongs to, so a truth table registers exactly.
UV = r"\newcommand{\uv}[2]{\mathmakebox[\widthof{$#1$}][c]{\text{#2}}}"
# Trees are typeset into this box so their width can be measured before use.
TREEBOX = r"\newsavebox{\aetreebox}"  # \treebox is qtree.sty's own
TABBOX = r"\newsavebox{\aetabbox}"


ASCII_TO_GLYPH = {"~": "∼", "&": "&", "|": "∨", ">": "⊃", "=": "≡", "!": "⊥"}


def glyphs(ascii_src: str) -> str:
    return "".join(ASCII_TO_GLYPH.get(c, c) for c in ascii_src)


def normalise(db: dict) -> list[str]:
    """Put every stored formula into the language the course actually uses.

    Lecture 2 is explicit: formulas are officially fully parenthesised, and the
    only licence is to drop the *outermost* pair -- "we'll only ever drop
    outermost parentheses, never inner ones". There is no precedence convention
    to fall back on, so `p & r ∨ p & s` is not a formula, and `p ⊃ q ⊃ p` names
    nothing in particular.

    The database arrived with two kinds of elision. Its ASCII sources dropped a
    few inner parentheses that precedence would restore -- those are simply
    reparsed and reprinted. Its *display* strings, and the formulas stored on
    tree nodes, dropped every parenthesis precedence could justify, including
    between operators of equal precedence, which the conditional does not
    survive. Those are not parsed at all: each is matched against the entry's
    own subformulas, printed the same lossy way, so the parenthesisation is
    recovered rather than guessed. `subformula_index` raises if a string could
    mean two different things.

    Idempotent, and run on every build -- a canonical formula canonicalises to
    itself, and a fully parenthesised display string still matches its own
    subformula.
    """
    notes: list[str] = []

    for entry in db["entries"]:
        eid = entry["id"]

        before = list(entry["premises"]) + [entry["conclusion"]]
        entry["premises"] = [canonical(p) for p in entry["premises"]]
        if entry["conclusion"] != "!":
            entry["conclusion"] = canonical(entry["conclusion"])
        after = list(entry["premises"]) + [entry["conclusion"]]
        for was, now in zip(before, after):
            if was != now:
                notes.append(f"{eid}: {was}  ->  {now}")

        # The display strings are rebuilt from the ASCII rather than repaired,
        # so the two can never drift apart again.
        display = entry.setdefault("display", {})
        display["premises"] = [glyphs(p) for p in entry["premises"]]
        display["conclusion"] = glyphs(entry["conclusion"])
        turnstile = "⊨" if entry["verdict"]["valid"] else "⊭"
        left = ", ".join(display["premises"])
        display["sequent"] = (
            f"{left}  {turnstile} {display['conclusion']}"
            if left
            else f"{turnstile} {display['conclusion']}"
        )

        columns = list(entry["premises"])
        if entry["conclusion"] != "!":
            columns.append(entry["conclusion"])
        else:
            columns.append("!")
        entry["truth_table"]["columns"] = [glyphs(c) for c in columns]

        for line in entry.get("nd", {}).get("proof") or []:
            line["f"] = canonical(line["f"])
        for item in entry.get("premise_analysis") or []:
            if item.get("premise"):
                item["premise"] = canonical(item["premise"])

        # Tree nodes: recovered by lookup, not by parsing. See the docstring.
        sources = list(entry["premises"])
        if entry["conclusion"] != "!":
            sources.append(entry["conclusion"])
        index = subformula_index(sources)

        def fix(shown: str) -> str:
            key = to_ascii(shown)
            if key not in index:
                raise SystemExit(f"{eid}: tree node {shown!r} is not a subformula")
            return glyphs(index[key])

        tree = entry.get("tree") or {}
        tree["roots"] = [fix(r) for r in tree.get("roots") or []]

        def walk(node: dict) -> None:
            for added in node.get("added") or []:
                if added.get("formula"):
                    added["formula"] = fix(added["formula"])
                if added.get("from"):
                    added["from"] = fix(added["from"])
            if node.get("branched_on"):
                node["branched_on"] = fix(node["branched_on"])
            for kid in node.get("children") or []:
                walk(kid)

        if tree.get("tree"):
            walk(tree["tree"])

    return notes


def build(db: dict) -> tuple[dict, list[str]]:
    notes: list[str] = normalise(db)
    for entry in db["entries"]:
        eid = entry["id"]

        entry["truth_table"]["latex"] = table_block(entry)
        entry["tree"]["latex"] = tree_block(entry)

        if entry["verdict"]["valid"]:
            proof = PROOFS.get(eid)
            if proof is None:
                raise SystemExit(f"{eid}: valid but no proof written")
            # proofs.py is written by hand, so its formulas get the same
            # normalisation as the database's own -- a proof whose last line
            # spells the conclusion differently is not a proof of it.
            proof = [dict(ln, f=canonical(ln["f"])) for ln in proof]
            profile = check(proof, entry["premises"], entry["conclusion"])
            before = {
                k: entry["nd"].get(k)
                for k in ("lines", "max_subproof_depth", "subproof_count")
            }
            entry["nd"]["proof"] = proof
            entry["nd"]["latex"] = render_proof(proof)
            entry["nd"]["lines"] = profile["lines"]
            entry["nd"]["max_subproof_depth"] = profile["max_subproof_depth"]
            entry["nd"]["subproof_count"] = profile["subproof_count"]
            entry["nd"]["assumption_count"] = profile["assumption_count"]
            entry["nd"]["uses_indirect_proof"] = profile["uses_indirect_proof"]
            entry["nd"]["rules_used"] = [
                r for r in profile["rules_used"] if r != "Pr"
            ]
            entry["nd"]["checked_by"] = "latexgen/nd.py"
            after = {
                k: entry["nd"][k]
                for k in ("lines", "max_subproof_depth", "subproof_count")
            }
            if before != after:
                notes.append(
                    f"{eid}: profile recomputed {before} -> {after} "
                    f"(the proof shown is the one measured)"
                )
        else:
            # An invalid entry has no derivation, and that is not an error:
            # nd.note says where the attempt breaks down.
            entry["nd"].pop("proof", None)
            entry["nd"].pop("latex", None)

    db["latex_requires"] = PREAMBLE
    db["latex_macros"] = {"uv": UV, "treebox": TREEBOX, "tabbox": TABBOX}
    return db, notes


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    db = json.loads(DB.read_text())
    db, notes = build(db)

    n_tab = sum(1 for e in db["entries"] if e["truth_table"].get("latex"))
    n_tree = sum(1 for e in db["entries"] if e["tree"].get("latex"))
    n_nd = sum(1 for e in db["entries"] if e["nd"].get("latex"))
    print(f"tables {n_tab}  trees {n_tree}  proofs {n_nd}  total {n_tab + n_tree + n_nd}")
    for n in notes:
        print("  note:", n)

    if args.write:
        DB.write_text(json.dumps(db, indent=1, ensure_ascii=False) + "\n")
        print(f"written to {DB}")
    else:
        print("(dry run; pass --write to update the database)")


if __name__ == "__main__":
    main()
