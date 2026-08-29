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

# What may name a proposition. Lecture 2: "lower case letters (e.g., p, q, r,
# etc.) potentially with subscripts (e.g., p_2, q_3, r_5)". Nothing else -- no
# `bl`, no `aS`. The digits are stored inline (`p1`) and typeset as a subscript.
ATOM = re.compile(r"^[a-z][0-9]*$")


def legal_atom(name: str) -> bool:
    return bool(ATOM.match(name))


def atom_latex(name: str) -> str:
    """`o2` as `o_{2}`."""
    head = name.rstrip("0123456789")
    tail = name[len(head):]
    return f"{head}_{{{tail}}}" if tail else head


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


# The reverse of GLYPH, for reading the display strings the database stores for
# tree nodes. Two-character atoms (`bl`, `aS`) survive untouched.
FROM_GLYPH = {"∼": "~", "∨": "|", "⊃": ">", "≡": "=", "⊥": "!"}


def to_ascii(src: str) -> str:
    """Glyph spelling into the ASCII the parser reads. ASCII passes through."""
    return "".join(FROM_GLYPH.get(c, c) for c in src)


def unparse(node: Node, outermost: bool = False) -> str:
    """Print a formula with a parenthesis around every binary application.

    This course's language is officially fully parenthesised, and the only
    licence it grants is Lecture 2's: *outermost* parentheses may be dropped,
    never inner ones, and not even the outermost when the main connective is a
    negation. So there is no precedence convention to lean on -- `p & q | r`
    is not a formula at all, and neither is `p | q | r`.

    That matters beyond tidiness. A tree decomposes a formula by its main
    connective, so what the reader is shown has to say which connective that
    is. Printing `∼(p & r ∨ p & s ∨ q & r ∨ q & s)` and then peeling
    `q & s` off the end asks them to guess that the disjunction groups to the
    left; printing the parentheses tells them.
    """
    if node.op is None:
        return node.name
    if node.op == "!":
        return "!"
    if node.op == "~":
        return "~" + unparse(node.kids[0])
    inner = f"{unparse(node.kids[0])} {node.op} {unparse(node.kids[1])}"
    return inner if outermost else f"({inner})"


def canonical(src: str) -> str:
    """One formula, in ASCII, with every binary application parenthesised.

    Takes either spelling. The reading is the parser's -- conjunction and
    disjunction group to the left, the conditional and biconditional to the
    right -- so a source that dropped inner parentheses is restored to the
    formula it was already being evaluated as, never to a different one.
    """
    root, _ = parse(to_ascii(src))
    return unparse(root, outermost=root.op not in ("~",))


# Precedence, loosest first. Only ever used to *read* the display strings the
# database inherited from its upstream generator -- never to print.
PREC = {"=": 1, ">": 2, "|": 3, "&": 4}


def flat(node: Node) -> str:
    """Reproduce the elided spelling the stored display strings use.

    The upstream generator printed a formula with every parenthesis dropped
    that precedence alone could justify, on both sides and in both directions:
    `((p > q) > p) > p` came out as `p > q > p > p`. That is lossy -- the
    conditional is not associative, so the string does not determine the
    formula -- which is why nothing here ever *parses* one. It is computed only
    as a lookup key: print each of an entry's own subformulas this way, and a
    stored string identifies which subformula it was. See `subformula_index`.
    """
    if node.op is None:
        return node.name
    if node.op == "!":
        return "!"
    if node.op == "~":
        inner = flat(node.kids[0])
        return "~" + (f"({inner})" if node.kids[0].op in PREC else inner)
    a, b = node.kids
    sa, sb = flat(a), flat(b)
    if a.op in PREC and PREC[a.op] < PREC[node.op]:
        sa = f"({sa})"
    if b.op in PREC and PREC[b.op] < PREC[node.op]:
        sb = f"({sb})"
    return f"{sa} {node.op} {sb}"


def subformulas(node: Node, out: list | None = None) -> list:
    out = [] if out is None else out
    out.append(node)
    for k in node.kids:
        subformulas(k, out)
    return out


def subformula_index(sources: list[str]) -> dict[str, str]:
    """Elided spelling -> canonical spelling, over one entry's own formulas.

    A tree node never holds a formula from nowhere: it holds a subformula of a
    premise or of the negated conclusion, or the negation of one. So the
    entry's own formulas are the whole universe of what a stored display string
    could mean, and matching against them recovers the parenthesisation the
    string threw away -- without guessing an associativity the language does
    not have.

    Raises if a key is ambiguous, which would mean two genuinely different
    subformulas print identically and the stored string cannot be resolved.
    """
    index: dict[str, set] = {}
    pool: list[Node] = []
    for src in sources:
        pool.extend(subformulas(parse(canonical(src))[0]))
    pool.extend(Node("~", kids=[n]) for n in list(pool))
    pool.extend([Node("!"), Node("~", kids=[Node("!")])])
    for n in pool:
        printed = unparse(n, outermost=n.op != "~")
        # Keyed by both spellings, so the pass is idempotent: a database that
        # has already been normalised presents the canonical string, and one
        # that has not presents the elided one.
        index.setdefault(flat(n), set()).add(printed)
        index.setdefault(printed, set()).add(printed)
    out = {}
    for key, values in index.items():
        if len(values) > 1:
            raise ValueError(f"{key!r} is ambiguous between {sorted(values)}")
        out[key] = values.pop()
    return out


def render(toks: list[Tok]) -> str:
    """House-glyph LaTeX for a token list, preserving the source parentheses."""
    out = []
    for t in toks:
        if t.kind == "atom":
            out.append(atom_latex(t.text))
        elif t.kind in ("op", "neg", "bot"):
            out.append(GLYPH[t.text])
        else:
            out.append(t.text)
    return "".join(out).replace("  ", " ").strip()


def latex(src: str) -> str:
    """House-glyph LaTeX for one formula, fully parenthesised.

    The source is canonicalised first, so a formula written with inner
    parentheses dropped is printed with them back. See `unparse`.
    """
    return render(parse(canonical(src))[1])


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
