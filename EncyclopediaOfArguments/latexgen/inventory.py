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
IMPORTS = HERE.parent / "Argument Form Inventory — Imports (2026-08-28).md"
SOURCES = {"course": SOURCE, "imports": IMPORTS}
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

    # Braces mean two different things, and which one depends on whether a
    # turnstile follows. `{p ≡ (p⊃q)} ⊢ q` -- the imports file's Curry sequent
    # -- is a premise set, and the braces say nothing the comma does not. A
    # braced formula standing alone is the claim that the set is *inconsistent*
    # (`{p≡∼p}`, in the course inventory's §5), which is `X ⊢ ⊥`, not `⊨ X`.
    # Stripping both alike turns the second into a claim that the formula is a
    # tautology, which is the opposite of what the row says.
    braced = body.startswith("{") and body.endswith("}")
    if braced and not any(to_ascii(m) in body for m in TURNSTILES):
        inner = body[1:-1].strip()
        premises = [p for p in (x.strip() for x in inner.split(",")) if p]
        return (premises, "!") if premises else None
    body = body.replace("{", "").replace("}", "")

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


def candidates(which: str = "course") -> tuple[list[dict], dict[str, int]]:
    text = SOURCES[which].read_text()
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
    #
    # Only the skip table counts, not every backtick in the file. The log has
    # prose around the table -- a preamble, and a Resolved section recording
    # rows whose blocker has since been fixed -- and a sequent quoted there
    # must not go on suppressing the row. That is how a resolved row gets back
    # into the queue: it moves out of the table.
    settled = set()
    if LOG.exists():
        rows = [l for l in LOG.read_text().split("\n") if l.startswith("|")]
        for quoted in re.findall(r"`([^`]+)`", "\n".join(rows)):
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

    if which == "imports":
        # Already one sequent per item, and the section stands in for the
        # "where" column the course inventory has and this file does not.
        feed = [{"sequent": q, "section": sec, "cells": []}
                for q, sec in _import_sequents(text)]
    else:
        feed = []
        for row in rows_of(text):
            quoted = re.findall(r"`([^`]+)`", row["cells"][0])
            if not quoted:
                continue
            # A row holding two sequents is two entries and a judgement about
            # which to write; it goes to the log rather than the queue. Marked
            # here so the tally still counts it.
            feed.append({"sequent": quoted[0] if len(quoted) == 1 else None,
                         "section": row["section"], "cells": row["cells"],
                         "compound": len(quoted) > 1 or ";" in row["cells"][0]})

    for row in feed:
        tally["rows"] += 1

        if row.get("compound"):
            tally["multiple"] += 1
            continue

        got = split_sequent(row["sequent"])
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
                "sequent": row["sequent"],
                "premises": premises,
                "conclusion": conclusion,
                "name": name_of(row) if row["cells"] else "",
                "where": where,
                # Nothing in the imports file is this year's graded work:
                # Restall is a textbook, and last year's papers were set for
                # last year's students. §11c of the style guide says so.
                "problem_set": problem_sets(row) if row["cells"] else {},
                "section": row["section"],
                "source": which,
            }
        )
    return out, tally


# ---------------------------------------------------------------- the imports

# The imports file is a different document and does not parse like the course
# inventory. Three things differ, and each of them silently yields nothing (or
# worse, junk) if you read it the other file's way:
#
#   * The sequent is not in the first cell. §1's Restall table runs
#     `| Restall | Form | Verdict | Why interesting |` and §2's archive table
#     runs `| Old location | Form | Verdict | Note |`, so the column has to be
#     found by its header rather than assumed. §5.1's tables do lead with it.
#   * §3 is not a table at all. It is a numbered prose list, one bolded sequent
#     per item, and it holds the brainstormed candidates -- the part with no
#     source behind it.
#   * Much of the file is not importable stock. §4 is a shortlist that points
#     at the other sections and would double-count every one of them; §5.2 and
#     §5.3 are predicate logic and errata.
#
# Everything here is about locating candidate sequents. What may be *said*
# about one -- Restall gets a real citation, the archive is last year's paper,
# and a brainstormed row has no appearance at all -- is §11c of the style
# guide, because it is a judgement rather than a parse.

# §4 is the shortlist, and every item in it is already in §1, §2 or §3.
# §5.2 is quantifiers and §5.3 is errata. §2's own prose sections are notes
# about collisions, not stock.
IMPORT_SKIP = ("4.", "5.2", "5.3")

# Quantifiers, modal operators and identity: predicate logic, which this
# database does not hold. `≠` catches Ch 15's inequality, `□`/`◊` Ch 6's modal
# apparatus, which the file's own Cautions say to strip or flag off-exam.
NOT_PROPOSITIONAL = re.compile(r"[∀∃□◊≠→]")


def _import_sequents(text: str) -> list[tuple[str, str]]:
    """Every candidate sequent in the imports file, with the section it is in.

    Conservative on purpose: a row that does not clearly carry one sequent is
    passed over rather than guessed at, because the cost of a wrong guess is an
    invented entry and the cost of a miss is a row that stays in the queue.
    """
    out: list[tuple[str, str]] = []
    section, form_col = "", None

    for line in text.split("\n"):
        if line.startswith("## ") or line.startswith("### "):
            section = line.lstrip("#").strip()
            form_col = None  # a heading ends whatever table was running
            continue
        if any(section.startswith(s) for s in IMPORT_SKIP):
            continue

        if line.startswith("|"):
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if set("".join(cells)) <= set("-: "):
                continue
            # A header row names the column the sequents are in, and holds none
            # itself. Until one is seen, this table is not being read.
            lowered = [c.lower() for c in cells]
            if "form" in lowered:
                form_col = lowered.index("form")
                continue
            if form_col is None or form_col >= len(cells):
                continue
            quoted = re.findall(r"`([^`]+)`", cells[form_col])
            if len(quoted) == 1:
                out.append((quoted[0], section))
            continue

        # §3's prose list: `1. **`sequent`** -- valid.` or a named item,
        # `**Contraction: `p⊃(p⊃q) ⊢ p⊃q`**`. One bolded span, one sequent.
        item = re.match(r"\s*\d+\.\s+\*\*(.+?)\*\*", line)
        if item:
            quoted = re.findall(r"`([^`]+)`", item.group(1))
            if len(quoted) == 1:
                out.append((quoted[0], section))
            continue

        # §5.1's two exercise banks are a run of sequents in one sentence --
        # `**Ex {7.1} — five sequents to prove without DNE** (…): `A⊃∼B ⊢ B⊃∼A`;
        # `∼∼∼A ⊢ ∼A`; …` -- and they hold Peirce, the hard De Morgan and the
        # item the file itself calls the pick of the set. Every span on such a
        # line is a sequent; `split_sequent` drops any that is not.
        if line.lstrip().startswith("**Ex {"):
            out.extend((q, section) for q in re.findall(r"`([^`]+)`", line))
    return out



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
    ap.add_argument("--source", choices=sorted(SOURCES), default="course",
                    help="which inventory to work: the course, or the imports")
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

    queue, tally = candidates(args.source)

    if args.next:
        print(json.dumps(queue[: args.next], indent=1, ensure_ascii=False))
        return
    if args.show is not None:
        print(json.dumps(queue[args.show], indent=1, ensure_ascii=False))
        return

    print(f"source     {SOURCES[args.source].name}")
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
