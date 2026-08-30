"""The import queue: which inventory rows are not yet in the encyclopedia.

The hourly import routine (see `.claude/skills/import-entries/SKILL.md`) needs
to know what to work on next, and the one thing it must not do is keep its own
notion of progress in a file that can drift from the database. So there is no
progress file. Every firing recomputes the queue from two things that cannot
disagree with reality: the inventory documents, and `argument-db.json`.

    python3 inventory.py --status        # how much is left
    python3 inventory.py --next 3        # the next candidates, as JSON
    python3 inventory.py --show <n>      # one candidate in full

A row is *skipped* rather than offered when it is quarantined (§8's exam
material), when it holds more than one sequent, when its formulas will not
parse, or when the database already has that form up to renaming the atoms.
`--status` reports each count, so a queue that stops moving is visible rather
than silent.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from formula import Node, canonical, parse, to_ascii, unparse

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parent / "Argument Form Inventory (2026-08-28).md"
LOG = HERE.parent / "IMPORT_LOG.md"
DB = HERE.parents[1] / "assets/arguments/argument-db.json"

TURNSTILES = ("⊢ND", "⊬ND", "⊨", "⊭", "⊢", "⊬", "∴")

# §8, verbatim: "Quarantined (on the exam; never reuse in study materials)".
# Matched by shape, not by string, so a row that spells one of these with other
# letters is caught too. Rule 1 of the brief: these never reach the site.
QUARANTINED = [
    "p⊃q, q ⊬ p",
    "(p∨q)⊃(p&q)",
    "p∨q, ∼p, q⊃r ⊢ r",
    "(p∨q)⊃(q∨p)",
    "p⊃q, r⊃∼q ⊢ p⊃∼r",
    "∼p⊃p ⊢ p",
]


def shape(premises: list[str], conclusion: str) -> tuple:
    """A form's identity up to renaming its atoms.

    The inventory writes everything in `p`, `q`, `r`; the database uses
    mnemonics. `b⊃l ⊢ ∼l⊃∼b` and `p⊃q ⊢ ∼q⊃∼p` are the same form and only one
    of them belongs in the encyclopedia, so the comparison renames atoms by
    order of first appearance and compares what is left.
    """
    parsed = [parse(canonical(p))[0] for p in premises]
    tail_src = None if conclusion == "!" else parse(canonical(conclusion))[0]

    def under(order: tuple[int, ...]) -> tuple:
        seen: dict[str, str] = {}

        def rename(node: Node) -> Node:
            if node.op is None:
                if node.name not in seen:
                    seen[node.name] = f"a{len(seen)}"
                return Node(None, name=seen[node.name])
            return Node(node.op, kids=[rename(k) for k in node.kids])

        roots = [rename(parsed[i]) for i in order]
        tail = "!" if tail_src is None else unparse(rename(tail_src), outermost=True)
        return tuple(sorted(unparse(r, outermost=True) for r in roots)), tail

    # The naming depends on which premise is read first, and the same form can
    # be written with its premises in any order -- `f∨d, d ⊢ ∼f` is `p∨q, p ⊢ ∼q`
    # with the premises swapped. So every order is tried and the smallest
    # result stands for the form. Premise counts here run to six, so this is
    # 720 comparisons in the worst case and nothing in the common one.
    from itertools import permutations

    return min(under(o) for o in permutations(range(len(parsed)))) if parsed else under(())


def split_sequent(text: str) -> tuple[list[str], str] | None:
    """`p⊃q, q⊃r ⊢ p⊃r` into its premises and its conclusion, in ASCII."""
    body = to_ascii(text.strip().strip("`").strip())
    for mark in TURNSTILES:
        mark = to_ascii(mark)
        if mark in body:
            left, _, right = body.partition(mark)
            premises = [p for p in (x.strip() for x in left.split(",")) if p]
            conclusion = right.strip()
            if not conclusion:
                # A one-sided turnstile: `X ⊢` says the premises are
                # inconsistent, which the database records as a ⊥ conclusion.
                conclusion = "!"
            return premises, conclusion
    # No turnstile: §§4 and 5 list theorems, tautologies and equivalences as
    # bare formulas. A bare formula is a claim with no premises -- `⊨ A` -- and
    # the section it sits in says whether the claim is that it is a tautology,
    # an equivalence, or (in §5) a contradiction, which is the author's call.
    return ([], body) if body else None


# Where a form has been set as graded work. A student who met it on a problem
# set must not draw it again as practice **in that method** -- the tree they
# were asked to build is not a fair random draw -- though the other two methods
# stay open. Exam appearances do not count: the site is unreachable during the
# exam and there is far too much of it to memorise.
PROBLEM_SET = re.compile(r"\bPS\d")
METHOD_WORDS = {"table": "table", "tree": "tree", "nd": "nd"}


def problem_sets(row: dict) -> dict[str, str]:
    """Which methods this form has been set in, as `{method: locus}`.

    The inventory says it two ways. §1's grid is positional -- Form, Verdict,
    Table, Tree, ND -- so the column a locus sits in names the method. §§2-7
    put everything in one "where" column and name the method in parentheses:
    `PS2.8a (table); PS4.2a (tree)`. Both are read here, because getting this
    wrong means offering a student the very tree they were set.
    """
    cells = row["cells"]
    if row["section"].startswith("1.") and len(cells) >= 5:
        out: dict[str, str] = {}
        for method, cell in zip(("table", "tree", "nd"), cells[2:5]):
            hit = re.search(r"\b(PS[\w.]*\d[\w.]*)", cell)
            if hit:
                out[method] = hit.group(1).rstrip(".;)")
        return out
    return _problem_sets_inline(" ".join(cells[2:]))


def _problem_sets_inline(where: str) -> dict[str, str]:
    """`PS2.8a (table); PS4.2a (tree)` into `{"table": ..., "tree": ...}`."""
    out: dict[str, str] = {}
    for chunk in re.split(r"[;,]", where):
        locus = re.match(r"\s*\*?\*?([A-Za-z0-9.§-]+)", chunk)
        if not locus or not PROBLEM_SET.match(locus.group(1)):
            continue
        inside = re.search(r"\(([^)]*)\)", chunk)
        text = (inside.group(1) if inside else chunk).lower()
        if "all three" in text:
            found = ["table", "tree", "nd"]
        else:
            found = [m for w, m in METHOD_WORDS.items() if w in text]
        for m in found:
            out.setdefault(m, locus.group(1))
    return out


def name_of(row: dict) -> str:
    """What the inventory calls the form.

    §1's grid puts the name in front of the formula and a verdict in the next
    column; §§2-7 put the formula alone and the name in the column after. Take
    whichever is prose.
    """
    lead = re.sub(r"`[^`]*`", "", row["cells"][0]).strip(" *—-")
    if lead:
        return lead
    second = row["cells"][1].strip() if len(row["cells"]) > 1 else ""
    return "" if second in ("valid", "invalid") else second


def rows_of(text: str) -> list[dict]:
    """Every table row of the inventory, with the section it sits in."""
    out, section = [], ""
    for line in text.split("\n"):
        if line.startswith("## "):
            section = line[3:].strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 2 or set("".join(cells)) <= set("-: "):
            continue
        if cells[0] in ("Form", "Sequent"):
            continue
        out.append({"section": section, "cells": cells})
    return out


def candidates() -> tuple[list[dict], dict[str, int]]:
    text = SOURCE.read_text()
    db = json.loads(DB.read_text())
    known = {shape(e["premises"], e["conclusion"]) for e in db["entries"]}
    banned = set()
    for q in QUARANTINED:
        got = split_sequent(q)
        if got:
            banned.add(shape(*got))

    # A row already judged and logged is settled. Without this every firing
    # would meet the same rejected row, spend a run re-deciding it, and write
    # the same line into the log again.
    settled = set()
    if LOG.exists():
        for quoted in re.findall(r"`([^`]+)`", LOG.read_text()):
            got = split_sequent(quoted)
            if not got:
                continue
            try:
                settled.add(shape(*got))
            except Exception:
                pass

    tally = {"rows": 0, "multiple": 0, "unparsable": 0, "quarantined": 0,
             "known": 0, "logged": 0}
    out: list[dict] = []

    for row in rows_of(text):
        quoted = re.findall(r"`([^`]+)`", row["cells"][0])
        if not quoted:
            continue
        tally["rows"] += 1

        # A row holding two sequents is two entries and a judgement about which
        # to write; it goes to the log rather than the queue.
        if len(quoted) > 1 or ";" in row["cells"][0]:
            tally["multiple"] += 1
            continue

        got = split_sequent(quoted[0])
        if not got:
            tally["unparsable"] += 1
            continue
        premises, conclusion = got
        try:
            key = shape(premises, conclusion)
            premises = [canonical(p) for p in premises]
            conclusion = conclusion if conclusion == "!" else canonical(conclusion)
        except Exception:
            tally["unparsable"] += 1
            continue

        if key in banned or "EX-" in " ".join(row["cells"]):
            tally["quarantined"] += 1
            continue
        if key in known:
            tally["known"] += 1
            continue
        if key in settled:
            tally["logged"] += 1
            continue

        where = " ".join(row["cells"][2:]) if len(row["cells"]) > 2 else ""
        known.add(key)  # so two inventory rows for one form offer it once
        out.append(
            {
                "sequent": quoted[0],
                "premises": premises,
                "conclusion": conclusion,
                "name": name_of(row),
                "where": where,
                "problem_set": problem_sets(row),
                "section": row["section"],
            }
        )
    return out, tally


def lock_gaps() -> list[dict]:
    """Methods the practice page offers that a problem set already set.

    `candidates()` looks forward -- which rows are not yet entries. This looks
    back: for every row the inventory records as set on a problem set, is the
    entry that carries that form actually withholding that method? A form can
    reach the database from somewhere else entirely (`peirce-law` came in from
    the SEP, `distribution` likewise) and then nothing ever compares it against
    the row that sets it, so the lock is never written and the practice page
    hands a student the exercise they were graded on.

    Matching is by `shape`, so a row and an entry line up through renamed atoms
    and reordered premises. A row whose form is not in the database yet is not
    a gap -- it is a candidate, and `candidates()` has it.
    """
    text = SOURCE.read_text()
    db = json.loads(DB.read_text())
    by_shape: dict[tuple, list[dict]] = {}
    for entry in db["entries"]:
        try:
            by_shape.setdefault(shape(entry["premises"], entry["conclusion"]), []).append(entry)
        except Exception:
            continue

    seen, gaps = set(), []
    for row in rows_of(text):
        sets = problem_sets(row)
        if not sets:
            continue
        for quoted in re.findall(r"`([^`]+)`", row["cells"][0]):
            got = split_sequent(quoted)
            if not got:
                continue
            try:
                key = shape(*got)
            except Exception:
                continue
            for entry in by_shape.get(key, []):
                lock = entry["course"].get("problem_set") or {}
                for method, locus in sets.items():
                    if lock.get(method) or (entry["id"], method) in seen:
                        continue
                    seen.add((entry["id"], method))
                    gaps.append({"id": entry["id"], "method": method,
                                 "locus": locus, "row": quoted,
                                 "name": name_of(row)})
    return gaps


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--status", action="store_true")
    ap.add_argument("--next", type=int, metavar="N")
    ap.add_argument("--show", type=int, metavar="INDEX")
    ap.add_argument("--locks", action="store_true",
                    help="methods on offer that a problem set already set")
    args = ap.parse_args()

    if args.locks:
        gaps = lock_gaps()
        for g in gaps:
            print(f"  {g['id']:34s} {g['method']:5s} on offer, but set at "
                  f"{g['locus']:9s}  ({g['row']})")
        print(f"{len(gaps)} practicable methods the inventory records as "
              f"problem-set questions")
        raise SystemExit(1 if gaps else 0)

    queue, tally = candidates()

    if args.next:
        print(json.dumps(queue[: args.next], indent=1, ensure_ascii=False))
        return
    if args.show is not None:
        print(json.dumps(queue[args.show], indent=1, ensure_ascii=False))
        return

    print(f"source     {SOURCE.name}")
    print(f"rows       {tally['rows']} carrying a sequent")
    print(f"  already  {tally['known']} in the database")
    print(f"  reserved {tally['quarantined']} quarantined (exam material)")
    print(f"  compound {tally['multiple']} rows holding more than one sequent")
    print(f"  unread   {tally['unparsable']} rows whose formulas would not parse")
    print(f"  settled  {tally['logged']} already judged, in IMPORT_LOG.md")
    print(f"queue      {len(queue)} candidates left")
    for i, c in enumerate(queue[:5]):
        print(f"  {i:3d}  {c['sequent']:44s} {c['name'][:40]}")


if __name__ == "__main__":
    main()
