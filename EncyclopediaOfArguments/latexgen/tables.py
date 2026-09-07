"""Token-aligned truth tables, with every row and optional intermediate values.

The same layout supplies the LaTeX blocks and the website's HTML fallback.
Only connective columns carry calculations inside compound formulas. Each
formula has a main result column; M marks a compound formula's main connective.
The compact companion remains available for printed handouts only.
"""
from __future__ import annotations

from formula import (
    Tok,
    atom_latex,
    atoms_of,
    evaluate,
    parse,
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


def _tok_latex(t: Tok) -> str:
    from formula import GLYPH
    if t.kind in ("op", "neg", "bot"):
        return GLYPH[t.text].strip()
    return atom_latex(t.text)


def _layout(entry: dict) -> dict:
    sources = list(entry["premises"])
    one_sided = entry["conclusion"].strip() == "!"
    if not one_sided:
        sources.append(entry["conclusion"])
    parsed = [parse(src) for src in sources]
    atoms = list(dict.fromkeys(a for root, _ in parsed for a in atoms_of(root)))
    every = models(atoms)
    glyphs = {"~": "∼", "&": "&", "|": "∨", ">": "⊃", "=": "≡"}
    formulas = []
    for n, (root, toks) in enumerate(parsed):
        columns = []
        for t in toks:
            # An atomic premise/conclusion is itself a result column. Atoms
            # occurring inside a compound formula never repeat their values.
            node = t.node if t.kind in ("op", "neg") else None
            if root.op is None and t.kind == "atom":
                node = root
            col = {"text": glyphs.get(t.text, t.text), "latex": _tok_latex(t)}
            if node is not None:
                col["values"] = ["T" if evaluate(node, m) else "F" for m in every]
                col["main"] = node is root
                col["marker"] = node is root and root.op is not None
            columns.append(col)
        label = (f"Premise {n + 1}" if n < len(entry["premises"]) else
                 "Conclusion" if entry["premises"] else "Formula")
        formulas.append({"label": label, "tokens": columns})
    prem = [r for r, _ in parsed[:len(entry["premises"])]]
    conclusion = None if one_sided else parsed[-1][0]
    return {"atoms": atoms, "formulas": formulas, "models": every,
            "countermodels": [all(evaluate(r, m) for r in prem) and
                              (conclusion is None or not evaluate(conclusion, m))
                              for m in every]}


def worked_data(entry: dict) -> list[dict]:
    """Serializable columns for the accessible HTML version of both views."""
    return [{"label": f["label"],
             "tokens": [{k: v for k, v in t.items() if k != "latex"}
                        for t in f["tokens"]]}
            for f in _layout(entry)["formulas"]]


def table_block(entry: dict, compact: bool = False, intermediate: bool = True) -> str:
    layout = _layout(entry)
    atoms, formulas = layout["atoms"], layout["formulas"]
    keep = compact_filter(entry) if compact else None
    columns = [{"latex": atom_latex(a), "atom": a} for a in atoms]
    columns += [t for f in formulas for t in f["tokens"]]
    # Real tabular columns give each connective enough room for its T/F value,
    # unlike boxes only as wide as a narrow negation symbol.
    specs = ["c" for _ in atoms]
    for f in formulas:
        specs.append("|")
        specs.extend("c" for _ in f["tokens"])

    def shade(col, countermodel=False):
        return r"\cellcolor[HTML]{E8EEF6}" if col.get("main") and not countermodel else ""

    def heading(col):
        tex = col["latex"]
        if col.get("main"):
            tex = r"\boldsymbol{" + tex + "}"
        if "values" in col or "atom" in col:
            tex = r"\mathmakebox[1.25em][c]{" + tex + "}"
        return shade(col) + "$" + tex + "$"

    def line(cells):
        return "        " + " & ".join(cells) + r" \\"

    labels = [r"\multicolumn{" + str(len(atoms)) + r"}{c|}{\scriptsize Atomic Formulas}"]
    for n, f in enumerate(formulas):
        rule = "|" if n < len(formulas) - 1 else ""
        labels.append(r"\multicolumn{" + str(len(f["tokens"])) + "}{c" + rule +
                      r"}{\scriptsize " + f["label"] + "}")
    table = [r"\setlength{\tabcolsep}{.12em}", r"\renewcommand{\arraystretch}{1.25}",
             r"\begin{tabular}{" + "".join(specs) + "}",
             line(labels), line([heading(c) for c in columns]), r"        \hline"]

    def row(model):
        i = layout["models"].index(model)
        cm = layout["countermodels"][i]
        cells = []
        for c in columns:
            if "atom" in c:
                value = "T" if model[c["atom"]] else "F"
            elif "values" in c and (intermediate or c["main"]):
                value = c["values"][i]
            else:
                value = ""
            if c.get("main"):
                value = r"\mathbf{" + value + "}"
            elif value:
                value = r"\mathrm{" + value + "}"
            cells.append(shade(c, cm) + "$" + value + "$")
        return (r"        \rowcolor[HTML]{FBEAE7}" + "\n" if cm else "") + line(cells)

    table += _rows(layout["models"], row, keep, len(columns))
    table += [r"        \hline",
              line([shade(c) + ("$M$" if c.get("marker") else "") for c in columns]),
              r"\end{tabular}"]
    return "\n".join([r"\begin{table}[h!]", r"    \centering"] + _fit(table) + [r"\end{table}"])


def models(atoms: list[str]) -> list[dict[str, bool]]:
    """Every model, all-true row first -- the course's order, not Restall's."""
    out = []
    for n in range(2 ** len(atoms)):
        out.append(
            {a: not bool((n >> (len(atoms) - 1 - i)) & 1) for i, a in enumerate(atoms)}
        )
    return out


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
