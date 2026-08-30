"""Truth-table blocks in the PHIL 1115 house style.

Two layouts, per LATEX_STYLE_GUIDE.md §4.1:

  * argument layout      -- three \\overbrace groups, one value per premise
                            (Lecture 4 §1). Used when the entry has premises.
  * single-formula layout -- one value under each connective, `M` row at the
                            foot (Lecture 3 §2, Lecture 4). Used for theorems.

Alignment. The handouts place values by hand with \\quad and \\qquad, which is
approximate: in Lecture 4's own contradiction table the value for `\\Neg p` sits
under the `p` rather than the `\\Neg`. Since the course's rule is that a value
belongs to *its* connective, and since the reader has to find the main-connective
column to read the answer off, this generator places every value in a box
exactly as wide as the thing it sits under:

    \\newcommand{\\uv}[2]{\\mathmakebox[\\widthof{$#1$}][c]{\\text{#2}}}

Header and value rows are then built from the same pieces with the same
separators, so they line up by construction rather than by eye. The result is
visually the handouts' table, correctly registered.
"""

from __future__ import annotations

from formula import (
    Tok,
    atom_latex,
    atoms_of,
    connective_tokens,
    evaluate,
    latex,
    main_connective_index,
    parse,
    render,
)

def _fit(tabular_lines: list[str]) -> list[str]:
    """Scale a tabular down if it is wider than the text, and not otherwise.

    Two of the tables overflow at natural size -- `recovery-cleopatra` and
    `ratio-obiter`, both five atoms with long mnemonic premises like
    `(bS ⊃ aS) & (bD ⊃ aD)`. Measuring first matters: scaling unconditionally
    would stretch the small tables to the full width and make them look wrong.

    The box is \aetabbox, deliberately not \tablebox or \treebox: qtree.sty
    already owns \treebox, and saving into another package's scratch box makes
    the content silently vanish.
    """
    return (
        ["\\savebox{\\aetabbox}{%"]
        + tabular_lines
        + [
            "}%",
            "\\ifdim\\wd\\aetabbox>\\linewidth",
            "  \\resizebox{\\linewidth}{!}{\\usebox{\\aetabbox}}%",
            "\\else",
            "  \\usebox{\\aetabbox}%",
            "\\fi",
        ]
    )


def _rows(all_models, row, keep, columns: int) -> list[str]:
    """The data rows, entire, or the kept ones with the rest shown elided.

    Lecture 8's "portion of a truth table": the rows that carry the argument,
    with a `\vdots` standing in for every stretch left out. The full table is
    the one that *proves* something -- a truth table is an exhaustive check --
    so this is its companion, for a handout where sixty-four rows will not fit,
    and never the only table an entry has.
    """
    if keep is None:
        return [row(m) for m in all_models]

    gap = "        " + " & ".join("$\\vdots$" for _ in range(columns)) + " \\\\"
    out: list[str] = []
    skipped = False
    for model in all_models:
        if keep(model):
            if skipped:
                out.append(gap)
                skipped = False
            out.append(row(model))
        else:
            skipped = True
    if skipped and out:
        out.append(gap)
    return out


def _uv(under: str, value: str) -> str:
    """A value centred in the width of the thing it belongs to."""
    return f"\\uv{{{under}}}{{{value}}}"


def _tok_latex(t: Tok) -> str:
    from formula import GLYPH

    if t.kind in ("op", "neg", "bot"):
        return GLYPH[t.text].strip()
    return t.text


# --------------------------------------------------------------- single formula


def single_formula_table(src: str, keep=None) -> str:
    """A theorem's table: a value under every connective, and an `M` row."""
    root, toks = parse(src)
    atoms = atoms_of(root)
    cols = connective_tokens(toks)
    main = main_connective_index(toks, root)

    # One tabular column per atom, matching the value rows below.
    header_atoms = " & ".join(f"${atom_latex(a)}$" for a in atoms)
    header_formula = f"${render(toks)}$"

    def value_row(model) -> str:
        out = []
        for i, t in enumerate(toks):
            if i in cols:
                v = "T" if evaluate(t.node, model) else "F"
                out.append(_uv(_tok_latex(t), v))
            else:
                out.append(f"\\phantom{{{_tok_latex(t)}}}")
        return "$" + "".join(out) + "$"

    def marker_row() -> str:
        out = []
        for i, t in enumerate(toks):
            if i in cols:
                out.append(_uv(_tok_latex(t), "M" if cols.index(i) == main else "."))
            else:
                out.append(f"\\phantom{{{_tok_latex(t)}}}")
        return "$" + "".join(out) + "$"

    lines = [
        "\\begin{table}[h!]",
        "    \\centering",
        "    \\begin{tabular}{" + " ".join("c" for _ in atoms) + "| c}",
        f"        {header_atoms} & {header_formula} \\\\",
        "        \\hline",
    ]
    def row(model) -> str:
        vals = " & ".join("T" if model[a] else "F" for a in atoms)
        return f"        {vals} & {value_row(model)} \\\\"

    lines += _rows(models(atoms), row, keep, len(atoms) + 1)
    lines += [
        "        \\hline",
        "        " + " & ".join("$.$" for _ in atoms) + f" & {marker_row()} \\\\",
        "    \\end{tabular}",
    ]
    return "\n".join(
        ["\\begin{table}[h!]", "    \\centering"] + _fit(lines[2:]) + ["\\end{table}"]
    )


# ------------------------------------------------------------------- argument


def argument_table(premises: list[str], conclusion: str, keep=None) -> str:
    """An argument's table: atoms | premises | conclusion, one value each.

    Lecture 4 gives one value per premise -- under its main connective -- not a
    value under every connective. That is what the three \\overbrace groups are
    for: the reader scans the premise block for a row of all-Ts, then looks
    across at the conclusion.
    """
    parsed = [parse(p) for p in premises]
    croot, ctoks = parse(conclusion)
    atoms: list[str] = []
    for root, _ in parsed:
        for a in atoms_of(root):
            if a not in atoms:
                atoms.append(a)
    for a in atoms_of(croot):
        if a not in atoms:
            atoms.append(a)

    prem_tex = [render(t) for _, t in parsed]
    concl_tex = render(ctoks)

    def group(items: list[str]) -> str:
        return "\\quad " + " \\qquad ".join(items) + " \\quad"

    head = (
        f"$\\overbrace{{{group([atom_latex(a) for a in atoms])}}}^\\text{{Atomic Formulas}}$"
        f"\n      & $\\overbrace{{{group(prem_tex)}}}^\\text{{Premises}}$"
        f"\n      & $\\overbrace{{{group([concl_tex])}}}^\\text{{Conclusion}}$"
    )

    def row(model) -> str:
        a = group([_uv(atom_latex(x), "T" if model[x] else "F") for x in atoms])
        p = group(
            [
                _uv(prem_tex[i], "T" if evaluate(root, model) else "F")
                for i, (root, _) in enumerate(parsed)
            ]
        )
        c = group([_uv(concl_tex, "T" if evaluate(croot, model) else "F")])
        return f"        ${a}$ & ${p}$ & ${c}$ \\\\"

    all_models = models(atoms)
    lines = [
        "\\begin{table}[h!]",
        "    \\centering",
        "    \\begin{tabular}{c | c | c}",
        f"        {head} \\\\",
        "        \\hline",
    ]

    # Every row, however many there are. Long tables used to be elided down to
    # the first row, the countermodels and the last -- but a truth table is a
    # exhaustive check, and a reader who cannot see the rows cannot see that it
    # is one. The sixty-four-row Dutch book form is exactly the case that
    # matters: what makes it worth showing is that sixty-three rows behave and
    # one does not.
    lines += _rows(all_models, row, keep, 3)

    lines += ["    \\end{tabular}"]
    return "\n".join(
        ["\\begin{table}[h!]", "    \\centering"] + _fit(lines[2:]) + ["\\end{table}"]
    )


def models(atoms: list[str]) -> list[dict[str, bool]]:
    """Every model, all-true row first -- the course's order, not Restall's."""
    out = []
    for n in range(2 ** len(atoms)):
        out.append(
            {a: not bool((n >> (len(atoms) - 1 - i)) & 1) for i, a in enumerate(atoms)}
        )
    return out


def contradiction_table(premises: list[str], keep=None) -> str:
    """A joint-unsatisfiability table: atoms and premises, no conclusion.

    Three entries conclude falsum. That is a contradiction claim, `X ⊨`, in the
    one-sided form Lecture 4 defines -- not an argument with ⊥ as its
    conclusion, because ⊥ is not a formula of the language and, in the Notation
    Guide's own words, "no truth table has a column for it". So the table has
    two groups rather than three, and what the reader looks for is a row with
    every premise true. There is none; that is the whole claim.
    """
    body = argument_table(premises, premises[-1], keep)
    # Rebuild without the conclusion group: drop the third column everywhere.
    out = []
    for line in body.splitlines():
        if "\\begin{tabular}{c | c | c}" in line:
            out.append(line.replace("{c | c | c}", "{c | c}"))
        elif "^\\text{Conclusion}$" in line:
            continue
        elif line.rstrip().endswith("\\\\") and line.count("$ & $") == 2:
            cells = line.rstrip()[:-2].split(" & ")
            out.append(" & ".join(cells[:2]) + " \\\\")
        else:
            out.append(line)
    text = "\n".join(out)
    # The premises header line ended with a continuation; close it off.
    return text.replace(
        "^\\text{Premises}$\n", "^\\text{Premises}$ \\\\\n"
    ).replace(" \\\\ \\\\", " \\\\")


def compact_filter(entry: dict):
    """Which rows a compact table keeps, as a predicate on a model.

    A compact table cannot establish anything -- only the full one does that,
    because a truth table is an exhaustive check -- so what it keeps is the
    rows a reader has to look at anyway.

    For an ordinary argument those are the rows where something could go
    wrong, and there are two ways it could: a row where the **conclusion is
    false**, in which case one of the premises had better be false too, and a
    row where **every premise is true**, in which case the conclusion had
    better be true. Their intersection is a countermodel. So the compact table
    keeps the union, and a reader who checks those rows has checked the
    argument.

    Where that question does not arise the table keeps its **top and bottom
    rows** -- all atoms true, all atoms false -- with the rest elided between
    them. That is the case for a claimed tautology, which has no premises to
    make true and so no row that singles itself out, and for premises nothing
    can satisfy, where there is no live row to show. In both the compact table
    is an illustration of the shape of the thing, not an argument.

    The one remaining case is a premise-less claim that is *not* a tautology:
    there the rows where the conclusion is false are exactly the countermodels,
    and they are the point.

    Written as predicates on the model rather than on the row index, so nothing
    depends on the order the atoms happen to come out in: the top row is the
    one where every atom is true, the bottom row the one where none is.
    """
    prem = [parse(p)[0] for p in entry["premises"]]
    concl = (
        None if entry["conclusion"].strip() == "!" else parse(entry["conclusion"])[0]
    )

    atoms: list[str] = []
    for root in prem + ([concl] if concl is not None else []):
        for a in atoms_of(root):
            if a not in atoms:
                atoms.append(a)

    def live(m):
        return all(evaluate(r, m) for r in prem)

    def concl_false(m):
        return concl is not None and not evaluate(concl, m)

    def ends(m):
        return all(m.values()) or not any(m.values())

    every = models(atoms)

    if not prem:
        # A claimed theorem. Valid means the conclusion is true on every row,
        # so no row stands out and the ends stand in for all of them.
        return ends if all(not concl_false(m) for m in every) else concl_false

    if not any(live(m) for m in every):
        # Nothing satisfies the premises -- every contradiction claim, and the
        # vacuously valid `ex-falso`. There is no live row to point at.
        return ends

    return lambda m: live(m) or concl_false(m)


def table_block(entry: dict, compact: bool = False) -> str:
    keep = compact_filter(entry) if compact else None
    if entry["conclusion"].strip() == "!":
        return contradiction_table(entry["premises"], keep)
    if entry["premises"]:
        return argument_table(entry["premises"], entry["conclusion"], keep)
    return single_formula_table(entry["conclusion"], keep)
