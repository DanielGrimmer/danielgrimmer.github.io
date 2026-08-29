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


def build(db: dict) -> tuple[dict, list[str]]:
    notes: list[str] = []
    for entry in db["entries"]:
        eid = entry["id"]

        entry["truth_table"]["latex"] = table_block(entry)
        entry["tree"]["latex"] = tree_block(entry)

        if entry["verdict"]["valid"]:
            proof = PROOFS.get(eid)
            if proof is None:
                raise SystemExit(f"{eid}: valid but no proof written")
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
