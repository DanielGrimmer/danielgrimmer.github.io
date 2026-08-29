"""Parsing, evaluation and house-glyph rendering for propositional formulas.

The ASCII in `premises` / `conclusion` is the source of truth: it carries the
author's own parentheses and is unambiguous. `display.*` is not used, for the
reason recorded in LATEX_STYLE_GUIDE.md §3.2 (the generator that produced it
drops parentheses that right-associativity needs, and seven entries come out as
different formulas).

Tokenising rather than re-printing from the AST is deliberate. It keeps the
author's parenthesisation exactly, and it gives every operator a position in the
printed string, which is what the truth-table layout needs: the course writes a
value under each connective and nowhere else.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

# notation.sty. `\Conj` carries its own padding, so it is never hand-padded.
GLYPH = {
    "~": r"\Neg ",
    "&": r"\Conj ",
    "|": r"\Disj ",
    ">": r"\Cond ",
    "=": r"\Bicond ",
    "!": r"\Falsum ",
}

NEG, AND, OR, IMP, IFF, BOT = "~", "&", "|", ">", "=", "!"
BINARY = (AND, OR, IMP, IFF)


@dataclass
class Tok:
    kind: str  # 'atom' | 'op' | 'neg' | 'lparen' | 'rparen' | 'bot'
    text: str
    node: "Node | None" = None  # set for op/neg: the node this operator heads


@dataclass
class Node:
    op: str | None  # None for an atom, else ~ & | > = or !
    name: str | None = None  # atom name
    kids: list = field(default_factory=list)
    tok: int | None = None  # index of this node's operator token


def tokenize(src: str) -> list[Tok]:
    out, i = [], 0
    while i < len(src):
        c = src[i]
        if c.isspace():
            i += 1
            continue
        if c == "(":
            out.append(Tok("lparen", "("))
        elif c == ")":
            out.append(Tok("rparen", ")"))
        elif c == NEG:
            out.append(Tok("neg", c))
        elif c == BOT:
            out.append(Tok("bot", c))
        elif c in BINARY:
            out.append(Tok("op", c))
        else:
            m = re.match(r"[A-Za-z][A-Za-z0-9]*", src[i:])
            if not m:
                raise ValueError(f"unexpected {c!r} in {src!r}")
            out.append(Tok("atom", m.group(0)))
            i += len(m.group(0))
            continue
        i += 1
    return out


def parse(src: str) -> tuple[Node, list[Tok]]:
    """Return the AST and the token list, with operator tokens linked to nodes.

    Precedence is the database's own: biconditional loosest, then the
    conditional (right-associative), disjunction, conjunction, negation
    tightest. It is only ever used to *read* the source; what gets printed is
    the source's own parentheses.
    """
    toks = tokenize(src)
    pos = 0

    def peek():
        return toks[pos] if pos < len(toks) else None

    def unit() -> Node:
        nonlocal pos
        t = peek()
        if t is None:
            raise ValueError(f"unexpected end of {src!r}")
        if t.kind == "lparen":
            pos += 1
            v = iff()
            if peek() is None or peek().kind != "rparen":
                raise ValueError(f"unbalanced parentheses in {src!r}")
            pos += 1
            return v
        if t.kind == "neg":
            here = pos
            pos += 1
            n = Node("~", kids=[unit()], tok=here)
            toks[here].node = n
            return n
        if t.kind == "bot":
            pos += 1
            return Node("!")
        if t.kind == "atom":
            pos += 1
            return Node(None, name=t.text)
        raise ValueError(f"unexpected {t.text!r} in {src!r}")

    def binop(sub, symbol, right_assoc):
        nonlocal pos

        def go():
            nonlocal pos
            left = sub()
            while peek() is not None and peek().kind == "op" and peek().text == symbol:
                here = pos
                pos += 1
                right = go() if right_assoc else sub()
                left = Node(symbol, kids=[left, right], tok=here)
                toks[here].node = left
                if right_assoc:
                    break
            return left

        return go

    conj = binop(unit, AND, False)
    disj = binop(conj, OR, False)
    imp = binop(disj, IMP, True)
    iff = binop(imp, IFF, True)

    tree = iff()
    if pos != len(toks):
        raise ValueError(f"trailing input in {src!r}")
    return tree, toks


def render(toks: list[Tok]) -> str:
    """House-glyph LaTeX for a token list, preserving the source parentheses."""
    out = []
    for t in toks:
        if t.kind == "atom":
            out.append(t.text)
        elif t.kind in ("op", "neg", "bot"):
            out.append(GLYPH[t.text])
        else:
            out.append(t.text)
    return "".join(out).replace("  ", " ").strip()


def latex(src: str) -> str:
    """House-glyph LaTeX for one ASCII formula."""
    return render(parse(src)[1])


def evaluate(node: Node, model: dict[str, bool]) -> bool:
    if node.op is None:
        return model[node.name]
    if node.op == "!":
        return False
    if node.op == "~":
        return not evaluate(node.kids[0], model)
    a, b = node.kids
    if node.op == AND:
        return evaluate(a, model) and evaluate(b, model)
    if node.op == OR:
        return evaluate(a, model) or evaluate(b, model)
    if node.op == IMP:
        return (not evaluate(a, model)) or evaluate(b, model)
    if node.op == IFF:
        return evaluate(a, model) is evaluate(b, model)
    raise ValueError(node.op)


def connective_tokens(toks: list[Tok]) -> list[int]:
    """Indices of the operator tokens, left to right as printed.

    These are exactly the columns that carry a value in a course truth table:
    "we write values only under the connectives", never under an atom.
    """
    return [i for i, t in enumerate(toks) if t.kind in ("op", "neg")]


def atoms_of(node: Node, seen=None) -> list[str]:
    """Atom names in order of first appearance."""
    seen = [] if seen is None else seen
    if node.op is None:
        if node.name not in seen:
            seen.append(node.name)
    else:
        for k in node.kids:
            atoms_of(k, seen)
    return seen


def main_connective_index(toks: list[Tok], root: Node) -> int | None:
    """Position of the root's operator among the connective columns."""
    cols = connective_tokens(toks)
    if root.tok is None:
        return None
    return cols.index(root.tok)
