"""Difficulty: two methods measured, one judged.

**Tables and trees are computed**, because for those two the work is countable
and the count is the difficulty. A table has no insight step -- you know what to
do from the first row -- so its difficulty is how many truth-functional
evaluations it takes: every connective occurrence, once per row. A tree has no
insight step either, given the course's standing advice to fire the
non-branching rules first: fix the order and the number of rule applications is
determined, so that is the measure.

**Natural deduction is authored**, because there the work is *finding* the
proof, and nothing countable predicts that. A twelve-line straight run of ⊃E is
easy; Peirce's Law is hard and would be hard at six lines. §14.3 of the style
guide sets out the five things that make a route hard to find, and `--diff`
reports any score that departs from what they imply -- a departure being
allowed, but only with a reason in `course.note`.

    python3 difficulty.py --audit    # every entry
    python3 difficulty.py --diff     # only the disagreements
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from formula import parse

DB = Path(__file__).resolve().parents[2] / "assets/arguments/argument-db.json"

# The four boundaries. Provisional, and meant to be moved -- they were set
# against thirty-five entries, which is not enough to place one. Nothing else
# knows them, so changing one here and rerunning `build.py --write` is the
# whole edit. `--balance` reports what would divide the database into thirds;
# see §14.-1 of the style guide for when to take its advice and when not to.

# Truth-functional evaluations. A couple of seconds each, so roughly a minute
# and a half, then five; past that a table is an endurance test.
TABLE_EASY, TABLE_MEDIUM, TABLE_EXTREME = 48, 160, 256

# Rule applications, non-branching first. A handful, a page, more than a page.
TREE_EASY, TREE_MEDIUM, TREE_EXTREME = 3, 7, 16

# `extremely hard` is not a fourth slice of the same cake -- it is a warning
# label. The three bands below it sort the work a student is expected to do;
# this one says the item is an outlier that will eat an evening, and it is
# calibrated so that only two or three entries per method wear it. The point is
# that seeing it should mean something, which stops being true the moment a
# dozen entries qualify: if a firing finds this band filling up, the threshold
# has drifted and wants raising, not the entries excusing.
#
# A derivation has no countable measure (§14.3), so its top band is the two
# signals together: every one of the five triggers fires, *and* the proof is
# long enough that finding it is not the only difficulty.
ND_EXTREME_LINES = 29


def band(value: int, easy: int, medium: int, extreme: int | None = None) -> str:
    if extreme is not None and value >= extreme:
        return "extremely hard"
    return "easy" if value <= easy else ("medium" if value <= medium else "hard")


def connectives(src: str) -> int:
    return 0 if src.strip() == "!" else sum(
        1 for t in parse(src)[1] if t.kind in ("op", "neg")
    )


def table_calls(entry: dict) -> int:
    """Every connective occurrence, evaluated once per row."""
    per_row = sum(connectives(p) for p in entry["premises"]) + connectives(entry["conclusion"])
    return per_row * entry["verdict"]["rows"]


def tree_applications(entry: dict) -> int:
    """Rule applications, in the order the course tells students to use.

    Non-branching rules first, which is what makes the count determinate: the
    order is otherwise the author's, and so would the number be. A rule applied
    on the trunk counts once however many branches inherit its results, which
    is exactly why firing the non-branching ones first is the advice.
    """

    def walk(node: dict, inherited) -> int:
        sources: list = []
        for added in node.get("added") or []:
            if added.get("from") not in sources:
                sources.append(added.get("from"))
        # A child's first group is its parent's fork, already counted there.
        n = sum(1 for f in sources if f != inherited)
        if node.get("branched_on"):
            n += 1
        for kid in node.get("children") or []:
            n += walk(kid, node.get("branched_on"))
        return n

    return walk(entry["tree"]["tree"], None)


def nd_triggers(entry: dict) -> list:
    """The five things that make a derivation hard to *find* (§14.3)."""
    nd = entry["nd"]
    if not nd.get("exists"):
        return []
    derived = sum(1 for l in nd.get("proof") or [] if l["rule"] != "Pr")
    goal = None if entry["conclusion"] == "!" else parse(entry["conclusion"])[0]

    out = []
    if "DisjE" in nd.get("rules_used", []):
        out.append("proof by cases")
    # A reductio is *dictated* when the goal is a negation -- ∼I is the rule the
    # goal names. Assuming the negation of anything else is a choice, and
    # choosing it is the step students do not find.
    if nd.get("uses_indirect_proof") and (goal is None or goal.op != "~"):
        out.append("an undictated reductio")
    if nd.get("max_subproof_depth", 0) >= 2:
        out.append("a subproof inside a subproof")
    if nd.get("subproof_count", 0) >= 4:
        out.append(f"{nd['subproof_count']} subproofs")
    if derived > 10:
        out.append(f"{derived} derived lines")
    return out


def nd_band(entry: dict, hits: list) -> str:
    """Where a derivation sits. See ND_EXTREME_LINES for the top band."""
    if len(hits) >= 5 and entry["nd"].get("lines", 0) >= ND_EXTREME_LINES:
        return "extremely hard"
    return "easy" if not hits else ("medium" if len(hits) <= 2 else "hard")


def scores(entry: dict) -> dict:
    """What the rubric gives. `nd` is a suggestion; the other two are the score."""
    calls = table_calls(entry)
    apps = tree_applications(entry)
    hits = nd_triggers(entry)
    cm = entry["verdict"]["countermodel_count"]
    return {
        "table": band(calls, TABLE_EASY, TABLE_MEDIUM, TABLE_EXTREME),
        "tree": band(apps, TREE_EASY, TREE_MEDIUM, TREE_EXTREME),
        "nd": None if not entry["nd"].get("exists") else nd_band(entry, hits),
        "search_sharpness": None if entry["verdict"]["valid"]
        else round(cm / entry["verdict"]["rows"], 4),
        "_why": {
            "table": f"{calls} truth-functional calls",
            "tree": f"{apps} rule applications",
            "nd": "; ".join(hits) or "nothing to find: every rule is named by the goal",
        },
    }


def apply(db: dict) -> list:
    """Write the computed scores. ND is left alone -- it is authored."""
    notes = []
    for entry in db["entries"]:
        got = scores(entry)
        d = entry.setdefault("difficulty", {})
        for key in ("table", "tree", "search_sharpness"):
            if d.get(key) != got[key]:
                why = got["_why"].get(key, "")
                notes.append(f"{entry['id']}: {key} {d.get(key)} -> {got[key]}"
                             + (f" ({why})" if why else ""))
                d[key] = got[key]
        if not entry["nd"].get("exists"):
            d["nd"] = None
        else:
            d.setdefault("nd", got["nd"])
    return notes


def balance() -> None:
    """The distribution, against the thresholds that would even it out.

    Only the two measured methods have thresholds to move. The derivation
    score counts triggers, so its shape is a fact about the proofs rather than
    a dial -- if it comes out lopsided the answer is a better trigger, not a
    different cut.
    """
    db = json.loads(DB.read_text())
    entries = db["entries"]
    n = len(entries)

    BANDS = ("easy", "medium", "hard", "extremely hard")

    for method, measure, cuts in (
        ("table", table_calls, (TABLE_EASY, TABLE_MEDIUM, TABLE_EXTREME)),
        ("tree", tree_applications, (TREE_EASY, TREE_MEDIUM, TREE_EXTREME)),
    ):
        values = sorted(measure(e) for e in entries)
        counts = dict.fromkeys(BANDS, 0)
        for e in entries:
            counts[band(measure(e), *cuts)] += 1
        thirds = (values[n // 3], values[2 * n // 3])
        print(f"{method:6s} at {cuts[0]}/{cuts[1]}/{cuts[2]}: "
              + ", ".join(f"{counts[b]} {b}" for b in BANDS)
              + f"   |  thirds would fall at {thirds[0]}/{thirds[1]}")
        print(f"       spread: {values[0]} to {values[-1]}, median {values[n // 2]}")

    # The top band is a warning label, not a third of anything: it is meant to
    # stay at two or three entries per method, so `thirds` above has nothing to
    # say about it. If it is filling up, raise the threshold.
    counts = dict.fromkeys(BANDS, 0)
    for e in entries:
        if e["difficulty"].get("nd"):
            counts[e["difficulty"]["nd"]] += 1
    print("nd     counted, not cut: "
          + ", ".join(f"{counts[b]} {b}" for b in BANDS)
          + " — a lopsided shape here wants a better trigger, not a different boundary")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--diff", action="store_true")
    ap.add_argument("--audit", action="store_true")
    ap.add_argument("--balance", action="store_true")
    args = ap.parse_args()

    if args.balance:
        balance()
        return

    db = json.loads(DB.read_text())
    off = 0
    for e in db["entries"]:
        got = scores(e)
        for method in ("table", "tree", "nd"):
            stored, implied = e["difficulty"].get(method), got[method]
            same = stored == implied
            if not same:
                off += 1
            if args.diff and same:
                continue
            print(f"{' ' if same else '*'} {e['id']:34s} {method:5s} {str(stored):6s} -> "
                  f"{str(implied):6s}  {got['_why'][method]}")
    tail = " — table and tree are written by build.py, so any of those is a bug" if off else ""
    print(f"\n{off} scores differ from the rubric{tail}")


if __name__ == "__main__":
    main()
