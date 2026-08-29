"""Truth-tree blocks in the PHIL 1115 house style.

`qtree`, per LATEX_STYLE_GUIDE.md §5. The structured `tree` object in the
database is already a drawing plan -- nodes carry `added` formulas with the rule
and the formula they came from, `children`, and a `status` of open/closed -- so
this is a walk rather than a search.

Three things that are easy to get wrong and are handled here:

  * The root is the premises **and the negated conclusion**, labelled `X:` and
    `\\Neg A:` so the reader can see that is what a validity tree does.
  * A resolved formula takes a `\\checkmark`; an atom or negated atom never
    does, because neither is resolvable.
  * `\\ckpad` balances a trailing checkmark so `qtree` centres the fork under
    the formula, and the whole diagram goes in an `\\mbox` because a bare
    `\\Tree` ignores `\\centering`. Both are from notation.sty's own comments,
    and both were confirmed by compiling.

The formulas stored in the tree are the generator's display strings, which drop
parentheses that right-associativity needs (style guide §3.2). They are repaired
here through the same map the website uses, built from the ASCII source.
"""

from __future__ import annotations

from formula import latex, parse, render


def build_repair(entry: dict) -> dict[str, str]:
    """Map the stored display strings onto correctly parenthesised ones."""
    repair: dict[str, str] = {}
    pairs = list(zip(entry["display"]["premises"], entry["premises"]))
    pairs.append((entry["display"]["conclusion"], entry["conclusion"]))
    for shown, ascii_src in pairs:
        fixed = latex(ascii_src)
        repair[shown] = fixed
        # The tree stacks the negated conclusion, so the negated forms too.
        repair[f"∼{shown}"] = f"\\Neg {fixed}"
        repair[f"∼({shown})"] = f"\\Neg ({fixed})"
    return repair


# The display alphabet the database stores tree formulas in.
_GLYPH_TO_MACRO = {
    "∼": r"\Neg ",
    "&": r"\Conj ",
    "∨": r"\Disj ",
    "⊃": r"\Cond ",
    "≡": r"\Bicond ",
    "⊥": r"\Falsum ",
}


def to_macros(shown: str, repair: dict[str, str]) -> str:
    """House-glyph LaTeX for a formula quoted from the stored tree."""
    if shown in repair:
        return repair[shown]
    out = []
    for ch in shown:
        out.append(_GLYPH_TO_MACRO.get(ch, ch))
    return "".join(out).replace("  ", " ").strip()


def _node(node: dict, repair: dict, resolved: set, root_lines=None) -> str:
    """One qtree node, with its children.

    `$\\vert$` is a typographic spacer, not a logical mark: inside a node
    holding several formulas it separates what was given from what was just
    derived, so the eye can see where a resolution happened. The handouts use it
    after every non-branching resolution, and so does this.
    """
    lines: list[str] = list(root_lines or [])

    added = node.get("added") or []
    if added and lines:
        lines.append("$\\vert$")

    for add in added:
        f = to_macros(add["formula"], repair)
        if add["formula"] in resolved:
            lines.append(f"\\ckpad ${f}$\\quad\\checkmark")
        else:
            lines.append(f"${f}$")

    if node.get("status") == "closed":
        lines.append("x")
    elif node.get("status") == "open":
        lines.append("o")

    body = " \\\\ ".join(lines) if lines else "{}"
    kids = node.get("children") or []
    if not kids:
        return "[.{" + body + "} ]"

    parts = ["[.{" + body + "}"]
    for k in kids:
        parts.append(_node(k, repair, resolved))
    parts.append("]")
    return " ".join(parts)


def _resolved_here(node: dict) -> set[str]:
    """Formulas this node's expansion consumed."""
    out = set()
    for k in node.get("children") or []:
        for add in k.get("added") or []:
            if add.get("from"):
                out.add(add["from"])
    for add in node.get("added") or []:
        if add.get("from"):
            out.add(add["from"])
    if node.get("branched_on"):
        out.add(node["branched_on"])
    return out


def tree_block(entry: dict) -> str:
    """The whole tree, rooted at the premises and the negated conclusion."""
    t = entry["tree"]
    repair = build_repair(entry)
    n_prem = len(entry["premises"])
    # An entry concluding falsum is a contradiction claim, X ⊢, so its tree is
    # rooted at the premises alone. The stored roots carry a `∼⊥`, which is not
    # a formula of the language -- ⊥ never appears inside one -- and which never
    # resolves or closes anything, so dropping it leaves the tree unchanged.
    contradiction = entry["conclusion"].strip() == "!"
    roots = [r for r in t["roots"] if r not in ("∼⊥", "⊥")] if contradiction else t["roots"]

    # Which roots were resolved, so they take a checkmark.
    resolved = _all_resolved(t["tree"])

    root_lines = []
    for i, r in enumerate(roots):
        f = to_macros(r, repair)
        tick = "\\quad\\checkmark" if r in resolved else ""
        pad = "\\ckpad " if tick else ""
        if n_prem and i == 0:
            label = "X:\\quad "
        elif n_prem and i == n_prem and not contradiction:
            label = "\\Neg A:\\quad "
        elif not n_prem and i == 0:
            label = "\\Neg A:\\quad "
        else:
            label = "\\qquad "
        root_lines.append(f"{pad}${label}{f}${tick}")

    body = _node(t["tree"], repair, resolved, root_lines=root_lines)
    if contradiction:
        start = "\\text{Start from $X$:}"
    elif n_prem:
        start = "\\text{Start from $X$ and $\\Neg A$:}"
    else:
        start = "\\text{Start from $\\Neg A$:}"
    # Two sizing problems, both confirmed by compiling.
    #
    # The box is called \aetreebox and not the obvious \treebox because
    # qtree.sty defines \treebox for its own use (qtree.sty line 108). Saving
    # into it clobbers qtree's scratch box while it is drawing, and the tree
    # silently vanishes -- which is exactly what happened here first.
    #
    # A bare \Tree ignores \centering, so it is boxed -- notation.sty says as
    # much in its \ckpad comment. And a wide tree runs clean off the page: the
    # 2x2 finite-choice tree is six branch-points deep with eighteen closed
    # branches, and at natural size it is several times the text width.
    #
    # So the tree is typeset once into a box, and scaled down only if that box
    # is too wide. Measuring first matters: scaling unconditionally would blow
    # small trees up to the full width, and `adjustbox`'s `max width` drops a
    # qtree of this size silently rather than scaling it.
    return (
        "\\begin{center}\n"
        f"${start}$ \\\\[0.5em]\n"
        "\\savebox{\\aetreebox}{\\mbox{\\Tree" + body + "}}%\n"
        "\\ifdim\\wd\\aetreebox>\\linewidth\n"
        "  \\resizebox{\\linewidth}{!}{\\usebox{\\aetreebox}}%\n"
        "\\else\n"
        "  \\usebox{\\aetreebox}%\n"
        "\\fi\n"
        "\\end{center}"
    )


def _all_resolved(node: dict, out=None) -> set[str]:
    out = set() if out is None else out
    out |= _resolved_here(node)
    for k in node.get("children") or []:
        _all_resolved(k, out)
    return out
