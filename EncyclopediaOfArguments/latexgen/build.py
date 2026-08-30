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
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from formula import (
    GLYPH,
    canonical,
    legal_atom,
    parse,
    subformula_index,
    to_ascii,
)
from difficulty import apply as apply_difficulty
from nd import ProofError, check, render_proof
from proofs import PROOFS
from tables import table_block
from trees import tree_block

DB = Path(__file__).resolve().parents[2] / "assets/arguments/argument-db.json"
MANIFEST = DB.with_name("entries.txt")
CORPUS = Path(__file__).resolve().parents[1] / "SOURCE_QUOTES.md"

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
]

# The one macro these blocks need beyond notation.sty: a value centred in the
# width of the connective it belongs to, so a truth table registers exactly.
UV = r"\newcommand{\uv}[2]{\mathmakebox[\widthof{$#1$}][c]{\text{#2}}}"
# Trees are typeset into this box so their width can be measured before use.
TREEBOX = r"\newsavebox{\aetreebox}"  # \treebox is qtree.sty's own
TABBOX = r"\newsavebox{\aetabbox}"
# fitch's justification column, configured for the course's rule labels.
# `\ndlabel` is `\mathord{#1}\text{#2}` and needs math mode, but fitch's own
# `\ndjustformat` \mbox-es its argument -- so without this a `\by{\CondE}{...}`
# stops the build with "Missing $ inserted". `justsep` is the gap between the
# formula and the justification, down from fitch's 2.5em to buy back width.
#
# These belong in notation.sty, guarded by \@ifpackageloaded{fitch}, and the
# course copy has them. They are repeated here so a block stays self-contained:
# a consumer with an older notation.sty still gets a correct display, and one
# with the current copy just sets the same values twice.
NDJUST = (
    r"\renewcommand{\ndjustformat}[2]{$#1$, #2}"
    "\n"
    r"\setkeys{fitch}{justsep=2em}"
)


ASCII_TO_GLYPH = {"~": "∼", "&": "&", "|": "∨", ">": "⊃", "=": "≡", "!": "⊥"}

# A backticked span in the prose is a formula in this database ("delete
# `gs ⊃ on` and it reopens"), and an atom renamed in the formulas has to be
# renamed there too. Only spans made entirely of formula characters are
# touched, so `argument-db.json` is left alone.
FORMULA_SPAN = re.compile(r"`([^`]+)`")
FORMULA_CHARS = re.compile(r"^[A-Za-z0-9_ ()~&|>=!∼∨⊃≡⊥⊨⊭⊢⊬,.∴]+$")


def legalise_atoms(entry: dict) -> dict[str, str]:
    """Rename the entry's atoms to names the language allows.

    Lecture 2 admits a lower-case letter with an optional subscript, and
    nothing else, so `bl`, `ls`, `aS` and `bpq` are not names of propositions:
    they are runs of letters, and the language has no rule that reads a run as
    one name. The subscript is not restricted to digits, which is what makes
    the repair painless -- **the first letter stays the name and everything
    after it becomes the subscript**. So `bS` becomes `b_S`, `ls` becomes
    `l_s`, `bpq` becomes `b_pq`, and the Cleopatra entry's `bS, aS, bD, aD, aC`
    become `b_S, a_S, b_D, a_D, a_C`, which is what those atoms meant all
    along.

    A numeric tail is disambiguation of last resort, used only if two atoms
    would otherwise end up with the same name.

    Deterministic and idempotent: an entry already legalised renames to itself.
    """
    order: list[str] = []
    sources = list(entry["premises"])
    if entry["conclusion"] != "!":
        sources.append(entry["conclusion"])
    for src in sources:
        for tok in parse(src)[1]:
            if tok.kind == "atom" and tok.text not in order:
                order.append(tok.text)

    def legalise(name: str) -> str:
        if legal_atom(name):
            return name
        head, _, sub = name.partition("_")
        sub = (head[1:] + sub) if len(head) > 1 else sub
        head = head[0].lower()
        return f"{head}_{sub}" if sub else head

    rename: dict[str, str] = {}
    taken: set[str] = set()
    for name in order:
        want = legalise(name)
        if want in taken:
            n = 2
            while f"{want}{n}" in taken:
                n += 1
            want = f"{want}{n}"
        taken.add(want)
        rename[name] = want
    return {k: v for k, v in rename.items() if k != v}


def rename_atoms(text: str, rename: dict[str, str]) -> str:
    """Substitute atom names in a formula string, in either alphabet."""
    if not rename:
        return text
    pattern = re.compile(
        r"(?<![A-Za-z0-9_])("
        + "|".join(sorted(map(re.escape, rename), key=len, reverse=True))
        + r")(?![A-Za-z0-9_])"
    )
    return pattern.sub(lambda m: rename[m.group(1)], text)


def rename_in_prose(text: str, rename: dict[str, str]) -> str:
    def one(m):
        span = m.group(1)
        if not FORMULA_CHARS.match(span):
            return m.group(0)
        return "`" + rename_atoms(span, rename) + "`"

    return FORMULA_SPAN.sub(one, text)


def apply_rename(entry: dict, rename: dict[str, str]) -> None:
    """Carry a rename through every field that names an atom."""
    if not rename:
        return
    f = lambda s: rename_atoms(s, rename)
    key = lambda d: {rename.get(k, k): v for k, v in (d or {}).items()}

    entry["premises"] = [f(p) for p in entry["premises"]]
    entry["conclusion"] = f(entry["conclusion"])

    tt = entry["truth_table"]
    tt["atoms"] = [rename.get(a, a) for a in tt["atoms"]]
    for row in tt["rows"]:
        row["assignment"] = key(row.get("assignment"))

    verdict = entry["verdict"]
    verdict["countermodels"] = [key(m) for m in verdict.get("countermodels") or []]

    tree = entry.get("tree") or {}
    tree["roots"] = [f(r) for r in tree.get("roots") or []]
    tree["branch_models"] = [key(m) for m in tree.get("branch_models") or []]

    def walk(node):
        for added in node.get("added") or []:
            for k in ("formula", "from"):
                if added.get(k):
                    added[k] = f(added[k])
        if node.get("branched_on"):
            node["branched_on"] = f(node["branched_on"])
        if node.get("model"):
            node["model"] = key(node["model"])
        for kid in node.get("children") or []:
            walk(kid)

    if tree.get("tree"):
        walk(tree["tree"])

    for line in entry.get("nd", {}).get("proof") or []:
        line["f"] = f(line["f"])
    for item in entry.get("premise_analysis") or []:
        if item.get("premise"):
            item["premise"] = f(item["premise"])

    # Prose, where a formula is quoted in backticks.
    for field in ("interest", "countermodel_gloss"):
        if entry.get(field):
            entry[field] = rename_in_prose(entry[field], rename)
    if entry.get("nd", {}).get("note"):
        entry["nd"]["note"] = rename_in_prose(entry["nd"]["note"], rename)
    for item in entry.get("english") or []:
        if isinstance(item, dict) and item.get("gloss"):
            item["gloss"] = rename_in_prose(item["gloss"], rename)
    for item in entry.get("appearances") or []:
        for k in ("quote", "note"):
            if isinstance(item, dict) and item.get(k):
                item[k] = rename_in_prose(item[k], rename)
    course = entry.get("course") or {}
    if course.get("note"):
        course["note"] = rename_in_prose(course["note"], rename)


def glyphs(ascii_src: str) -> str:
    return "".join(ASCII_TO_GLYPH.get(c, c) for c in ascii_src)


def normalise(db: dict) -> tuple[list[str], dict[str, dict[str, str]]]:
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
    renames: dict[str, dict[str, str]] = {}

    for entry in db["entries"]:
        eid = entry["id"]

        rename = renames[eid] = legalise_atoms(entry)
        if rename:
            apply_rename(entry, rename)
            shown = ", ".join(f"{k} -> {v}" for k, v in sorted(rename.items()))
            notes.append(f"{eid}: atoms renamed ({shown})")
        for atom in entry["truth_table"]["atoms"]:
            if not legal_atom(atom):
                raise SystemExit(
                    f"{eid}: {atom!r} is not a name of a proposition -- a lower-case "
                    f"letter, optionally subscripted, is the whole of the alphabet"
                )

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

    return notes, renames


def build(db: dict) -> tuple[dict, list[str]]:
    notes, renames = normalise(db)
    for entry in db["entries"]:
        eid = entry["id"]

        entry["truth_table"]["latex"] = table_block(entry)
        # The companion "portion of a truth table", for a handout where
        # sixty-four rows will not fit. See tables.compact_filter for what it
        # keeps. Never a substitute for the full one: a truth table is an
        # exhaustive check, and only the full table is that.
        entry["truth_table"]["latex_compact"] = table_block(entry, compact=True)
        entry["tree"]["latex"] = tree_block(entry)

        if entry["verdict"]["valid"]:
            proof = PROOFS.get(eid)
            if proof is None:
                raise SystemExit(f"{eid}: valid but no proof written")
            # proofs.py is written by hand, so its formulas get the same
            # normalisation as the database's own -- a proof whose last line
            # spells the conclusion differently is not a proof of it.
            # proofs.py is written by hand against the entry as it was
            # authored, so it gets the same two passes the database got: the
            # atom renaming first, then canonical parentheses.
            proof = [
                dict(ln, f=canonical(rename_atoms(ln["f"], renames.get(eid, {}))))
                for ln in proof
            ]
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

    # Table and tree difficulty are measurements, not judgements (§14), so
    # they are written here like any other derived field and can never drift
    # from the blocks they describe. The `nd` score is left alone: finding a
    # proof is not a countable thing, and that one is authored.
    notes += apply_difficulty(db)

    # The manifest. One id per line, written on every build, and the reason it
    # exists is that `argument-db.json` is a single large file that two
    # branches edit at once: the import branch appends entries at the end while
    # main rewrites derived values throughout. Git will line-merge that,
    # report success, and silently drop an entry -- which is exactly what
    # happened on the first import merge, costing two forms that nothing
    # noticed until they were looked for by name.
    #
    # A file of one id per line merges correctly, because appends and edits
    # never touch the same line. So the manifest survives a merge the JSON does
    # not, and `_tests/argument-forms.test.mjs` fails when the two disagree.
    MANIFEST.write_text("\n".join(e["id"] for e in db["entries"]) + "\n")

    db["latex_requires"] = PREAMBLE
    db["latex_macros"] = {"uv": UV, "treebox": TREEBOX, "tabbox": TABBOX,
                          "ndjust": NDJUST}
    return db, notes


# An appearance the import routine could have written, however `who` happens to
# be spelled. Keying on `who == "PHIL 1115"` alone would let a rename walk
# straight past the check, so the `work` field is read too.
#
# Restall and last year's papers are here for the same reason the course is:
# the routine works from the inventories, which summarise those sources rather
# than reproducing them. It has no copy of *Logic* and no copy of last year's
# problem sets, so a quote attributed to either is a sentence it composed. The
# SEP and journal quotes already in the database came from reading and are not
# checked, because nothing in the repository could check them.
_COURSE_WORK = re.compile(
    r"lecture|problem set|\bPS\s*\d|study guide|midterm|handout"
    r"|restall|old-ps|old-exam|last year", re.I
)


def check_quotes(db: dict) -> None:
    """Refuse a course quote that is not in SOURCE_QUOTES.md, verbatim.

    The import routine reads the inventory, which is a table of sequents and
    the problem sets they were set in -- no handout prose. So it has nothing
    to quote, and a course `quote` it composed is a sentence of ours wearing
    the handout's voice: on the page it reads as the source saying where it
    set the form. The style guide forbade this twice over and it happened
    twice anyway, which is why the rule is enforced here rather than written
    down again. `SOURCE_QUOTES.md` says how a passage gets added.

    Non-course appearances are not checked. Nothing in the repository could
    check them, and they are not where this goes wrong: the routine's queue is
    the course inventory, so the course rows are the ones it writes.
    """
    corpus = CORPUS.read_text() if CORPUS.exists() else ""
    # Verbatim up to line wrapping only -- the corpus wraps its passages as
    # Markdown quotes and the database stores them on one line.
    flat = " ".join(corpus.split())
    bad = []
    for entry in db["entries"]:
        for app in entry.get("appearances") or []:
            quote = (app.get("quote") or "").strip()
            if not quote:
                continue
            if not (app.get("who") == "PHIL 1115"
                    or _COURSE_WORK.search(app.get("work") or "")):
                continue
            if " ".join(quote.split()) not in flat:
                bad.append(f"  {entry['id']}: {quote}")
    if bad:
        raise SystemExit(
            "these course quotes are in no handout we hold:\n"
            + "\n".join(bad)
            + "\n\nA quote is the source's words. If you are describing where "
            "the form was set,\nthat is what `work` and `locus` are for, and "
            "the rest belongs in `interest`.\nLeave `quote` out. See "
            "EncyclopediaOfArguments/SOURCE_QUOTES.md."
        )


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    db = json.loads(DB.read_text())
    check_quotes(db)
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
