# LaTeX Style Guide for the Argument-Form Encyclopedia

**Purpose.** Every entry in `argument-db.json` is to carry, in addition to its
structured data, a LaTeX block for each method it has been worked in — the truth
table, the truth tree, and the natural deduction. This document fixes exactly
what those blocks look like, so that a reader who arrives at the encyclopedia
from the course sees the same notation they saw in lecture, down to the spacing.

**Authority.** Everything here is derived from `notation.sty`, `Notation Guide
(Author Reference).tex`, and Lecture Handouts 1–10 — and, where the three left
anything open, from compiling it and looking at the result (§0.1). Where this guide and a handout
disagree, the handout wins and this guide is wrong — tell me and I will fix it.
Where the handouts disagree *with each other*, §10 records the conflict and
picks one.

**Scope.** Propositional logic only (Lectures 1–13). The quantifier and identity
macros are listed in §2 for completeness, because the substitution notation is
easy to get backwards, but no current entry uses them.

---

## 0. Status, and two things to settle

The one blocker is now cleared (§0.1). Two questions remain open; I have made a
provisional call on each so drafting can begin, and each is cheap to reverse now
and expensive later.

### 0.1 Verified against a real compile ✅

`notation.sty` landed while this guide was being written, so everything below
has been **compiled and looked at**, not merely written to spec. Every macro
call, both table layouts, two trees, a Fitch proof and the full turnstile set
were run through `pdflatex` and inspected. Where the render disagreed with my
reading of the handouts, the render won and the guide was corrected — §2.1, §5.1
and §5.7 are all results of that.

**Every LaTeX sample in this document compiles.** All eleven complete blocks
were extracted and built together against the preamble below: zero errors. The
one fragment (the row-elision sample in §4.5) is marked as such.

The block preamble that was used, and that any consumer of these blocks needs:

```latex
\usepackage{amsmath,amssymb,stmaryrd}
\usepackage{qtree}      % trees
\usepackage{fitch}      % Fitch derivations -- provides the `nd` environment
\usepackage{pifont}     % \checkmark via \ding{51}
\usepackage{notation}   % FOL_Yale/notation.sty
```

⚠ **The Fitch package is `fitch`, not `nd`.** The environment is named `nd`,
which makes it easy to assume the package is too. Lectures 9 and 10 load
`\usepackage{fitch}`; there is no `nd.sty` on CTAN that provides these commands.

### 0.2 Two blocks or three? — I think you have it backwards

You wrote "a latex block for each of these three methods (or only two if
valid)". As the data stands it is the other way round, and the database is
unambiguous about it: `nd.exists` is `true` for exactly the 18 valid entries and
`false` for exactly the 17 invalid ones.

- **Valid entry → three blocks.** Table, tree (all branches close), ND proof.
- **Invalid entry → two blocks.** Table (with the countermodel row) and tree
  (with the open branch). There is no ND derivation to write, and Lecture 9 says
  why: ND-invalidity has no direct demonstration, only the indirect one via a
  countermodel. The entry's existing `nd.note` carries that explanation and is
  already rendered on the site.

I have written the guide on that reading. If you did mean something else by
"only two if valid" — dropping the table for valid forms, say, on the grounds
that the tree and the proof suffice — say so and I will rework §6.

### 0.3 The site cannot render these blocks directly

This one has no cheap fix and is worth knowing before we author 35 of them.

The three blocks use `fitch` (Fitch derivations), `qtree` (trees), and LaTeX
`tabular` (tables). **None of the three is renderable by KaTeX or MathJax**,
which are the only maths renderers available in a browser. KaTeX supports
neither `\begin{nd}` nor `\Tree` nor `tabular`; MathJax supports `array` but
neither package.

So the LaTeX blocks cannot be the website's rendering path. Three options:

1. **Keep both, which is what I recommend.** The LaTeX block is the canonical,
   course-exact artifact — for problem sets, handouts, and print. The site keeps
   rendering from the structured `truth_table` / `tree` / `nd` data as it does
   today, styled to match the course as closely as HTML allows. The LaTeX is
   offered on each entry as a copy-paste box ("copy the LaTeX for this table"),
   which is independently useful to you and to a TF building a problem set.
2. **Precompile.** Run each block through `xelatex` → SVG at build time and ship
   the SVGs. Exact fidelity, at the cost of a LaTeX toolchain in CI and ~100
   image files that must be regenerated whenever the database changes.
3. **LaTeX only.** Drop the HTML rendering and show images or nothing. I do not
   recommend this: it loses selectable text, dark mode, and mobile reflow.

Option 1 needs no decision now — it is compatible with adding option 2 later.

---

## 1. The golden rule

> **Call the macro, not the glyph.**

The Notation Guide is explicit: "where a macro exists, *call the macro, not the
raw glyph*, so the whole course can be re-skinned from one file." A block that
writes `\supset` instead of `\Cond` will look right today and silently diverge
the day you re-skin. Every table in this guide gives the macro; use it.

---

## 2. Symbols

### 2.1 Connectives

House style follows Quine: the conditional is `⊃`, never `→`; the biconditional
is `≡`, never `↔`.

| Concept | Renders | Macro | Notes |
| --- | --- | --- | --- |
| Negation | ∼ | `\Neg` | |
| Conjunction | & | `\Conj` | **binary use**: `p \Conj q` |
| Conjunction | & | `\ConjTight` | **standalone use**: naming the symbol |
| Disjunction | ∨ | `\Disj` | |
| Conditional | ⊃ | `\Cond` | right-associative (§3) |
| Biconditional | ≡ | `\Bicond` | |

**The `\Conj` / `\ConjTight` split is real, and it is about spacing.** Reading
`notation.sty` settles what the handouts alone left ambiguous:

```latex
\newcommand{\ConjTight}{\mathbin{\&}}
\newcommand{\Conj}{\ \ConjTight \ }      % padding is BUILT IN
```

The ampersand is a wide, busy glyph that sets too tight against its conjuncts,
so `\Conj` **carries its own padding**. Therefore:

> **Write `\Conj`. Never pad it by hand.**

`p \Conj q` renders `p & q`. Hand-padding it as `p \ \Conj \ q` double-pads and
renders `p  &  q` — visibly wrong beside a correctly set formula. I compiled all
three spellings side by side to confirm. The `.sty` records that the course was
split 207 hand-padded against 384 bare as of 2026-08-25, often within one file,
and that building the spacing in was the fix. **Lectures 1–10 are already
clean** — 285 bare `\Conj`, zero hand-padded — so the stragglers are elsewhere
in the corpus, and nothing we copy from these ten handouts will carry the bug.

`\ConjTight` is the *unpadded* glyph. It exists for the rule labels, where
`\ConjI` must set as a single tight "&I" and any internal spacing would show. Use
it in the two places the handouts do: inside a rule label, and when the symbol is
**mentioned rather than used** — listing the connectives, naming a rule
("**$\ConjTight$-Elimination Rule**"), counting binary connectives. The other four
connectives have no such pair, because none of them has the spacing problem.

**Deprecated, do not use:** `\lnot`, `\neg`, `\to`, `\rightarrow`, `\lor`,
`\leftrightarrow`, and the bare `\supset` / `\equiv` / `\wedge` / `\vee`.

### 2.2 Falsum

`\Falsum` (⊥) is **not a connective and not part of the object language.** No
formation rule admits it, no truth-table column carries it, no tree branch
closes on it. It is a proof-level marker, introduced in Lecture 10, that stands
*alone* on a line of a natural deduction and means "a contradiction has been
reached."

Consequences for us, all load-bearing:

- `⊥` may appear **only inside an ND block**, only on its own line.
- It must **never** appear inside a formula. `p \Disj \Falsum` is not a formula
  of the language, not even unofficially.
- It must **never** appear in a truth-table column or a tree node.

The database has a `!` in its ASCII alphabet mapping to `⊥`, and several entries
(`bi-paradox-mis1`, `czech-book`, `recovery-cleopatra`) carry `⊥` as their
**conclusion**. That is legitimate — those are ND-contradiction claims, `X ⊢ND`
— but §4.4 covers how to write them, because the one-sided turnstile is the
house form and `X ⊢ND ⊥` is not.

### 2.3 Turnstiles

| Concept | Renders | Macro |
| --- | --- | --- |
| Logical consequence (tables) | ⊨ | `\Entails` |
| Not a consequence | ⊭ | `\notEntails` |
| Derivability (trees) | ⊢ | `\Proves` |
| Non-derivability (trees) | ⊬ | `\notProves` |
| Derivability (ND) | ⊢<sub>ND</sub> | `\ProvesND` |
| Non-derivability (ND) | ⊬<sub>ND</sub> | `\not\ProvesND` |

Use `\ProvesND`, never an ad-hoc `\vdash_D` or `\vdash_\text{ND}`.

**One-sided forms.** An empty side is not nothing: it is the empty conjunction
(⊤) on the left and the empty disjunction (⊥) on the right. The eight
table-notions from Lecture 4, with their tree and ND counterparts:

| Notion | Table | Tree | ND |
| --- | --- | --- | --- |
| valid | `X \Entails A` | `X \Proves A` | `X \ProvesND A` |
| invalid | `X \notEntails A` | `X \notProves A` | `X \not\ProvesND A` |
| tautology | `\Entails A` | `\Proves A` | `\ProvesND A` |
| falsifiable | `\notEntails A` | `\notProves A` | `\not\ProvesND A` |
| contradiction | `X \Entails` | `X \Proves` | `X \ProvesND` |
| satisfiable | `X \notEntails` | `X \notProves` | `X \not\ProvesND` |

⚠ **The right-empty forms were flipped course-wide on 2026-08-22.** Before that
date `A \Entails` meant *satisfiable* and `A \notEntails` meant *contradiction*,
which was backwards relative to every other source; all 61 occurrences were
corrected. If you meet an old PDF that disagrees, the handout is right and the
PDF is stale. **When transcribing from any pre-2026-08-22 source, check every
one-sided turnstile by hand.** This is the single likeliest way for a wrong
verdict to enter the database from the inventory sweep.

### 2.4 Metavariables and atoms

| Role | Convention | Example |
| --- | --- | --- |
| Object-language atoms | **lower-case** roman, optional subscripts | `p`, `q`, `r_5`, `p_1` |
| Formula metavariables | upper-case italic roman | `A`, `B`, `C` |
| Metatheoretic variables | lower-case Greek | `\phi`, `\psi`, `\chi` |
| Sets of formulas / premise sets | upright capitals | `X`, `Y`, `Z` |

**Never use an upper-case letter for an object-language atom.** Lecture 2's
footnote makes the point sharply: `A` is not an expression of the language at
all, because the language contains no upper-case letters. A rule *schema* is
written in `A`/`B`; a concrete entry is written in `p`/`q`/`r`.

The database's multi-letter atoms (`bl`, `ls`, `gs`, `on`, `aS`, `bD`, `p1`,
`tp`) are a departure from the course's single-letter habit — mnemonic atoms
that make a Dutch-book argument readable. They are lower-case, so they respect
the rule that matters. Set them as-is; `aS` and `bD` keep their internal capital.

### 2.5 Quantifiers, identity, substitution

Not used by any current entry; recorded so the notation is not reinvented later.

| Concept | Renders | Macro |
| --- | --- | --- |
| Universal | (∀x) | `\all{x}` |
| Existential | (∃x) | `\some{x}` |
| Identity | = | `\Ident` |
| Non-identity | ≠ | `\Nident` |
| Denotation | ⟦t⟧<sup>M</sup> | `\Den[M]{t}` |

`\Univ` and `\Exist` are the bare `\forall` / `\exists`, defined for use inside
rule-label constructions. `\DM` sets "DM", the derived quantifier De Morgan rule
of Lecture 20.

Substitution is `s := t`, read **"replace `s` by `t`"** — left goes out, right
comes in — uniformly. The two shapes that look alike: `A(a := x)` pushes a name
back into a variable (formation, generalization); `A(x := a)` drops a name into
a variable slot (instantiation). `\ev` is deprecated; use `\Den`. `\Atom` is a deprecated legacy helper that
sets bold roman, matching none of the conventions in §2.4 — never use it.

---

## 3. Formulas, parentheses, precedence

### 3.1 Write the parentheses

Officially, every binary formula carries its own parentheses: `(A \Conj B)` is a
formula, `A \Conj B` is not. Unofficially the course drops the **outermost** pair
only, and only when the main connective is not a negation — `\Neg(p \Conj q)`
and `(\Neg p \Conj q)` would both collapse to the same string otherwise.

**Inner parentheses are never dropped.** Lecture 2 spends a paragraph on
`b \Conj m \Disj g` being genuinely ambiguous between `b \Conj (m \Disj g)` and
`(b \Conj m) \Disj g`, and concludes: "we'll only ever drop *outermost*
parentheses, never inner ones."

So the house policy for every block in the database is:

> **Reproduce the parenthesisation of the entry's ASCII source exactly, with the
> outermost pair dropped when the main connective is not `\Neg`.**

Square brackets are permitted as poorly-drawn parentheses for readability in
deeply nested formulas — `s \Bicond [p \Cond (q \Conj r)]` — and are worth using
once nesting reaches three deep.

### 3.2 Why this matters here, concretely

The `display.*` fields already in `argument-db.json` were generated with
*minimal* parentheses, and for a left-nested conditional that is not terse but
**wrong**. The conditional is right-associative, so Peirce's Law — source
`((p > q) > p) > p` — was emitted as `p ⊃ q ⊃ p ⊃ p`, which re-parses as
`p ⊃ (q ⊃ (p ⊃ p))`: a different formula, and a tautology in every logic, when
the whole interest of Peirce's Law is that it is not.

Seven entries are affected: `peirce-law`, `contraction-w`, `curry-complete`,
`curry-contraction-only`, `abelian-axiom`, `fixed-point-type`, `assertion-t`.
The website now works around this by rebuilding from the ASCII.

**Do not build the LaTeX blocks from `display.*`.** Build them from `premises`
and `conclusion` — the ASCII source, which carries the author's own
parentheses — and translate `~ & | > =` to `\Neg \Conj \Disj \Cond \Bicond`.
`_tests/argument-forms.test.mjs` guards this.

### 3.3 Precedence, for reading only

Declared in the database as: biconditional loosest, then conditional
(right-associative), disjunction, conjunction, negation tightest. **Use it to
read, never to save parentheses.** §3.1 governs what gets written.

---

## 4. Block A — the truth table

### 4.1 Which of the two layouts

Lecture 3–4 use two distinct table layouts, and the choice is not cosmetic:

- **Single-formula layout** (Lecture 3 §2, Lecture 4's tautology/contingency
  examples). Atoms on the left, one formula on the right, an `M` row at the foot
  marking the main-connective column. Use this when the entry **has no
  premises** — a theorem like Peirce's Law or `russell-schema`.
- **Argument layout** (Lecture 4 §1). Three groups separated by vertical rules,
  each capped with an `\overbrace`: Atomic Formulas | Premises | Conclusion. Use
  this when the entry **has premises**, which is 24 of the 35.

### 4.2 The rule that catches everyone

> **Write a value only under a connective. Never re-copy an atom's value inside
> the formula.**

Lecture 3: "Note that each stage of the calculation can be written below its
corresponding connective. Only below a connective: we never re-copy the values
of `p` and `q` inside the formula (though Restall does…)." The Reading Guide
flags this as one of the four places the textbook and the course differ, and the
handouts, the cheat sheet, and every answer key show ours.

So for `((p \Disj q) \Conj \Neg (p \Conj q))` on the row `p=T, q=T` the entry is
four values — one each under `\Disj`, `\Conj`, `\Neg`, `\Conj` — laid out as
`T \quad F \quad F \quad T`, and *not* eight.

### 4.3 Row order and the `M` row

- **All-true row first.** `T T`, `T F`, `F T`, `F F` for two atoms; standard
  binary counting downwards with T before F. (Restall starts all-false; we do
  not. Another Reading Guide difference.)
- Atom order is the order they are listed in the header, which should be the
  order of first appearance in the sequent.
- The **`M` row** goes at the foot, below an `\hline`, with `M` under the main
  connective's column and `.` under every other. Lecture 4 uses it on
  single-formula tables; it is optional on argument tables, where the vertical
  rules already do the work.
- Lecture 3 also demonstrates a `c1 c2 c3 …` column-index row. That is a
  teaching device for a table being walked through on the board. **Omit it** in
  the encyclopedia unless the entry's prose refers to a column by number.

### 4.4 Countermodel marking

The course does **not** mark countermodel rows in the table itself — Lecture 4
identifies them in prose ("Row 3 is a *counterexample*…"). Follow the course:
**no marker column.** The website already highlights countermodel rows in HTML,
and the entry's `countermodel_gloss` says it in words.

### 4.5 Templates

**Single-formula (no premises).** Peirce's Law:

```latex
\begin{table}[h!]
    \centering
    \begin{tabular}{c c| c}
        $p$ & $q$ & $((p \Cond q) \Cond p) \Cond p$ \\
        \hline
        T & T & T \qquad T \qquad T \\
        T & F & F \qquad T \qquad T \\
        F & T & T \qquad F \qquad T \\
        F & F & T \qquad F \qquad T \\
        \hline
        $.$ & $.$ & $.$ \qquad $.$ \qquad M \\
    \end{tabular}
\end{table}
```

**Argument (with premises).** Modus ponens, from Lecture 4 verbatim:

```latex
\begin{table}[h!]
    \centering
    \begin{tabular}{c | c | c}
        $\overbrace{\quad p \qquad q\quad}^\text{Atomic Formulas}$
      & $\overbrace{p \ \ \quad p \Cond q}^\text{Premises}$
      & $\overbrace{\quad q\quad}^\text{Conclusion}$\\
        \hline
        T \qquad T & T \qquad T \quad & T\\
        T \qquad F & T \qquad F \quad & F\\
        F \qquad T & F \qquad T \quad & T\\
        F \qquad F & F \qquad T \quad & F\\
    \end{tabular}
\end{table}
```

The `\quad`/`\qquad` padding inside the overbraces is hand-tuned per table to
centre the brace over its group. Copy the shape, then adjust; there is no
formula for it.

**Large tables.** Five atoms is 32 rows and six is 64 — `dutch-book-is-ought`
and `czech-book` are in that range. Lecture 4 has a house device for exactly
this: show the first row, a `\vdots` row annotated with what is uniform, and the
last row.

```latex
        % fragment -- these are rows, to sit inside the tabular above
        T \quad T \quad T & T & T\\
        \vdots \ \ (mixed) \ \ \vdots & \vdots & \qquad \vdots \quad (All True)\\
        F \quad F \quad F & F & T\\
```

Use the elision whenever the table exceeds 16 rows **and** the point does not
depend on a particular row. When the point *is* a particular row — a needle
countermodel like the Dutch book's 1-in-64 — show the first row, the elision,
**the countermodel row**, the elision again, and the last row.

---

## 5. Block B — the truth tree

### 5.1 Package, shape, and the centring trap

Trees are `qtree`: `\Tree[.{<root>} <children> ]`. A node's content is a `{…}`
group; multiple formulas inside one node are separated by `\\`.

⚠ **A bare `\Tree` does not respond to `\centering`.** `notation.sty` warns of
this and I confirmed it: inside a plain `\begin{center}` the whole diagram sits
noticeably right of centre, which is why several trees in the handouts look
off-axis on the page. **Box it first:**

```latex
\begin{center}
\mbox{\Tree[.{…} … ]}
\end{center}
```

That one `\mbox` centres it properly. Use it on every tree block.

### 5.2 The five marks

| Mark | Written | Means |
| --- | --- | --- |
| resolved | `\checkmark` after the formula | this formula has been broken down |
| closed | `x` on its own line at the branch foot | branch holds `A` and `\Neg A` |
| open | `o` on its own line at the branch foot | complete branch, no contradiction |
| linear step | `$\vert$` on its own line | a non-branching extension follows |
| root labels | `$X:\quad`, `$\Neg A:\quad` | which roots are premises, which the negated conclusion |

`x` and `o` are plain roman letters — not `\times`, not `\circ`. The Notation
Guide records that Restall marks open branches with a vertical arrow and we do
not; ours is the `o`.

`$\vert$` deserves a note because it is unusual: it is a **typographic spacer**,
not a logical mark. Inside a node holding several formulas, it separates the
formulas that were *given* from the ones *just derived*, so the eye can see
where a resolution happened. Lecture 6's very first tree uses it under the
roots; Lecture 7's uses it after every resolution that does not branch. Use it
the same way — after a non-branching resolution, inside the node.

### 5.3 The nine rules

Every resolution in a tree block must be one of these. Left column: the rule
splits into two branches. Right column: it extends the branch linearly.

| Formula | Resolves to | Branches? |
| --- | --- | --- |
| `\Neg\Neg A` | `A` | no |
| `A \Conj B` | `A`, `B` (same node) | no |
| `\Neg(A \Conj B)` | `\Neg A` \| `\Neg B` | **yes** |
| `A \Disj B` | `A` \| `B` | **yes** |
| `\Neg(A \Disj B)` | `\Neg A`, `\Neg B` (same node) | no |
| `A \Cond B` | `\Neg A` \| `B` | **yes** |
| `\Neg(A \Cond B)` | `A`, `\Neg B` (same node) | no |
| `A \Bicond B` | `A`,`B` \| `\Neg A`,`\Neg B` | **yes** |
| `\Neg(A \Bicond B)` | `A`,`\Neg B` \| `\Neg A`,`B` | **yes** |

Atoms and negated atoms are **not resolvable** and never take a `\checkmark`.

⚠ Restall's printed diagrams for **negated disjunction** and **negated
conditional** are misprinted, and two of his worked trees carry errors. Where the
book and this table disagree, this table is right.

### 5.4 What goes at the root

An argument tree is rooted at **the premises together with the negated
conclusion** — that is the whole trick, and the root labels should say so:

```latex
\Tree[.{$X:\quad p \Cond q$\quad\checkmark \\
        \qquad$q \Cond r$\quad\checkmark \\
        \qquad$r \Cond \Neg p$\quad\checkmark \\
        $\Neg A:\quad \Neg \Neg p$\qquad\checkmark \\
        $\vert$ \\ $p$}
    [.{$\Neg p$ \\ x} ]
    [.{$q$} [.{$\Neg q$ \\ x} ]
            [.{$r$} [.{$\Neg r$ \\ x} ] [.{$\Neg p$ \\ x} ] ] ] ]
```

That is Lecture 8's Kant tree verbatim. Note the shape: `X:` labels the first
premise and subsequent premises are indented with `\qquad` to align under it;
`\Neg A:` labels the negated conclusion.

For a **theorem** (no premises) the root is `\Neg A` alone and the preamble line
reads `\text{Start from $\Neg A$:}`. For a **satisfiability** claim the root is
`X` alone and the line reads `\text{Start from $A$:}`.

### 5.5 Reading the countermodel off an open branch

For an invalid entry the open branch *is* the countermodel, and Lecture 7 works
through the reading in detail. The database already stores it as
`tree.branch_models[].model`. Do not add a model line to the LaTeX block — the
course does not — but **do** check the two against each other while authoring: a
mismatch means either the tree or the stored countermodel is wrong, and that is
exactly the kind of error worth catching now.

### 5.6 Order of resolution

Any order gives the same verdict — that is the order-invariance fact of Lecture
6, and Lecture 7–8 prove it. But order changes the *size* of the tree, so:
**resolve non-branching rules before branching ones**, and among branching
rules, resolve the one that closes soonest first. A tree that is twice as large
as it needs to be is not wrong, but it is not a good exhibit either.

### 5.7 `\ckpad`, and why checked nodes hang right

`qtree` centres a node's fork under the node's whole box. A root line ending
`\quad\checkmark` therefore pulls the fork right, because the checkmark counts
as part of the box. `notation.sty` supplies the fix:

```latex
\newcommand{\ckpad}{\phantom{\quad\checkmark}}
```

It puts an invisible copy of the trailing material on the *left*, so the box is
symmetric and the fork lands under the formula:

```latex
\Tree[.{\ckpad $\Neg(A \Conj B)$\quad\checkmark} {$\Neg A$} {$\Neg B$} ]
```

The handouts predate this macro and hand-pad instead, with a leading `\qquad`
(`\Tree[.{\qquad$p \Conj q$\quad\checkmark}`). Both work; `\ckpad` is exact and
`\qquad` is a guess that happens to be close. **Use `\ckpad` in new blocks**, on
every root line that carries a trailing checkmark. It stacks with the `\mbox`
from §5.1 — they solve different halves of the same problem, `\ckpad` centring
the fork within the node and `\mbox` centring the diagram on the page.

---

## 6. Block C — the natural deduction

Only for **valid** entries (§0.2).

### 6.1 Package and shape

Fitch derivations use the **`fitch`** package — whose environment is confusingly
named `nd` — wrapped in `\begin{align*}`:

```latex
\begin{align*}
\begin{nd}
\hypo{1}{p \Cond q}
\hypo{2}{q \Cond r}
\open
\hypo{3}{p}
\have{4}{q\qquad\CondE,1,3}
\have{5}{r\qquad\CondE,2,4}
\close
\have{6}{p \Cond r\qquad\CondI,3,5}
\end{nd}
\end{align*}
```

| Command | Use |
| --- | --- |
| `\hypo{n}{A}` | an assumption — a premise, or a sub-derivation's assumption |
| `\have{n}{A \qquad RULE,cites}` | a derived line |
| `\open` … `\close` | a sub-derivation, with its own shorter scope line |

In concrete proofs the handouts pass the printed line number as the mandatory
tag (`\hypo{1}{…}`) and let the package number automatically. In **rule schemas**
they force a symbolic label with the optional argument and leave the tag empty:
`\have[n]{}{A \Conj B}`, `\have[m+1]{}{…}`. Both forms are in use; concrete
entries take the first.

**The rule citation lives inside the formula argument**, separated by hand-tuned
`\qquad`/`\quad`, not in a separate column. This is the one genuinely awkward
part of the house style: the padding has to be adjusted per proof so the
citations line up. Author the proof first, then pad.

### 6.2 The twelve rules

| Macro | Renders | From | Derive |
| --- | --- | --- | --- |
| `\Reit` | R | `A` | `A`, on any accessible line |
| `\DM` | DM | *(Lecture 20)* | derived quantifier De Morgan — not propositional |
| `\ConjI` | &I | `A` and `B` | `A \Conj B` |
| `\ConjE` | &E | `A \Conj B` | `A`, or `B` |
| `\DisjI` | ∨I | `A` (or `B`) | `A \Disj B` |
| `\DisjE` | ∨E | `A \Disj B`, and two proofs of `C` | `C` |
| `\CondI` | ⊃I | a proof of `B` from assumption `A` | `A \Cond B` |
| `\CondE` | ⊃E | `A \Cond B` and `A` | `B` |
| `\BicondI` | ≡I | a proof of `B` from `A`, and of `A` from `B` | `A \Bicond B` |
| `\BicondE` | ≡E | `A \Bicond B` and `A` (or `B`) | `B` (or `A`) |
| `\NegI` | ∼I | a proof of `⊥` from assumption `A` | `\Neg A` |
| `\NegE` | ∼E | `\Neg\Neg A` | `A` — this is **DNE** |
| `\FalsumI` | ⊥I | `B` and `\Neg B` | `\Falsum` |

**Use the rule macros, never the connective macros.** The Notation Guide is
emphatic: do not wrap `\Conj` in a label (its operator spacing is wrong), and do
not hand-type `\Neg\text{I}`. Two-directional rules (`\BicondE`, `\IdentE`) keep
a single label.

**`\RCite` is retired too.** Reiteration used to be citable two ways —
`\Reit,n` and `\RCite{n}` — unified on `\Reit,n` on 2026-08-28. `\RCite` is
deliberately left undefined so a straggler fails to compile instead of quietly
setting a second style.

**`\Exp` is retired.** Explosion is not a citable rule. Every proof that once
wrote `\Exp,n` must now spell the reductio out: assume the negation of the
target, reiterate the contradiction, `\FalsumI`, `\NegI`, `\NegE`. This bites
directly on `ex-falso`, whose `course.note` already records it.

There is **no single-negation elimination.** "If you ever want to remove a single
negation, you must find a way to add a second negation and then remove the pair."

### 6.3 Citation format

- **Single lines:** comma-separated — `\CondE,1,3`. Lecture 9 writes `\ConjE, 1`
  with a source space and Lecture 10 writes `\CondE,2,4` without; **these render
  identically**, because math mode sets its own space after a comma and ignores
  the one in the source. I checked. So this is a source-tidiness question only,
  and §10 picks the tight form for consistency, not for output.
- **Line ranges:** an en dash, written `\text{--}`, never a hyphen —
  `\DisjE, 1, 2\text{--}3, 4\text{--}5`.
- **Symbolic ranges** in schemas brace the operator so it sets tight:
  `(n{+}1)\text{--}m`.
- **Order of cites** follows the rule's statement: `\FalsumI,n,m` cites `B`
  first and `\Neg B` second. Lecture 10's Kant proof writes `\FalsumI,8,7` —
  line 8 is `p`, line 7 is `\Neg p` — so the *formula* order governs, not the
  line order.

### 6.4 The classical reductio pattern

The commonest shape in the database. It is **not** a basic rule and must be
written out in full every time:

```latex
\begin{align*}
\begin{nd}
\open
\hypo[n]{1}{\Neg A}
\have[...]{}{\dots}
\have[m]{2}{\Falsum}
\close
\have{3}{\Neg\Neg A\qquad\NegI,n,m}
\have{}{A\qquad\quad \NegE,m+1}
\end{nd}
\end{align*}
```

### 6.5 Contradiction entries (`⊥` as conclusion)

Three entries conclude `⊥`. Per the Notation Guide, **the one-sided turnstile is
the house form**: write `X \ProvesND`, not `X \ProvesND \Falsum`. Lecture 10
*defines* the former by the latter, and that definition is the only place the
two-sided form belongs, because it is what keeps the ND dictionary aligned with
the table and tree methods, neither of which has a falsum to put on the right.

Inside the derivation, `\Falsum` stands alone on its final line, cited
`\FalsumI,n,m`, and the proof simply ends there — no `\NegI` follows.

### 6.6 Accessibility

A line may be cited only when every sub-derivation it lives inside is still open
— trace a path straight up the page without crossing a scope line that has
already ended. A main-scope-line formula is accessible everywhere below it; a
formula inside a closed sub-derivation is gone. `\Reit` exists to carry a
formula *down into* a sub-derivation.

Every proof we author must be checked against this by hand until a checker
exists; a citation across a closed scope line is the classic invisible error.

---

## 7. The JSON schema

Add a `latex` string to each of the three existing method objects. Nothing
moves; nothing is renamed.

```jsonc
{
  "truth_table": {
    "atoms": ["p", "q"],
    "columns": ["…"],
    "rows": [ /* … unchanged … */ ],
    "latex": "\\begin{table}[h!]\n    \\centering\n    …\n\\end{table}"
  },
  "tree": {
    "roots": ["…"],
    "tree": { /* … unchanged … */ },
    "latex": "\\begin{center}\n\\Tree[.{…} … ]\n\\end{center}"
  },
  "nd": {
    "exists": true,
    "lines": 7,
    "rules_used": ["…"],
    "latex": "\\begin{align*}\n\\begin{nd}\n…\n\\end{nd}\n\\end{align*}"
  }
}
```

Rules:

- **`nd.latex` is present exactly when `nd.exists` is `true`.** Invalid entries
  get no `nd.latex`; they already carry `nd.note`.
- **Newlines are real `\n`; backslashes are escaped** (`\\Cond`, `\\\\` for a
  LaTeX line break). Authoring these by hand in JSON is miserable — the blocks
  should be authored in `.tex` files and folded into the JSON by `build.py`.
- **No `\begin{document}`, no preamble.** Each block is a fragment, to be
  dropped into a document that already loads the preamble in §0.1.
- **Record the dependency.** A top-level `"latex_requires":
  ["FOL_Yale/notation", "qtree", "fitch", "amsmath", "amssymb", "stmaryrd", "pifont"]` so a
  consumer knows what to load. `pifont` supplies `\checkmark` in the handouts'
  preamble via `\ding{51}`.

While `nd.proof` is still unpopulated (the site currently shows only the
verified profile), `nd.latex` doubles as the proof of record. If you later
serialise structured proof lines as well, the two must agree, and that is worth
a test.

---

## 8. Two worked entries

### 8.1 A valid entry — `lecture8-chain` (Kant's argument)

`p ⊃ q, q ⊃ r, r ⊃ ∼p ⊨ ∼p`. All three blocks, all taken from the handouts, so
these are the reference exhibits.

**Table** (Lecture 4 §1, 8 rows, argument layout):

```latex
\begin{table}[h!]
    \centering
    \begin{tabular}{c | c | c }
         $\overbrace{\quad p \qquad q\qquad r\quad}^\text{Atomic Formulas}$
       & $\overbrace{p\Cond q \quad q\Cond r \quad r\Cond \Neg p}^\text{Premises}$
       & $\overbrace{\quad\Neg p\quad}^\text{Conclusion}$ \\
         \hline
         T \qquad T \qquad T & T \qquad T \qquad F & F\\
         T \qquad T \qquad F & T \qquad F \qquad T & F\\
         T \qquad F \qquad T & F \qquad T \qquad F & F\\
         T \qquad F \qquad F & F \qquad T \qquad T & F\\
         F \qquad T \qquad T & T \qquad T \qquad T & T\\
         F \qquad T \qquad F & T \qquad F \qquad T & T\\
         F \qquad F \qquad T & T \qquad T \qquad T & T\\
         F \qquad F \qquad F & T \qquad T \qquad T & T
    \end{tabular}
\end{table}
```

**Tree** (Lecture 8 §1) — see §5.4 above, quoted there in full.

**ND** (Lecture 10 §3):

```latex
\begin{align*}
\begin{nd}
\hypo{1}{p \Cond q}
\hypo{2}{q \Cond r}
\hypo{3}{r \Cond \Neg p}
\open
\hypo{4}{p}
\have{5}{q\qquad\quad\CondE,1,4}
\have{6}{r\qquad\quad\CondE,2,5}
\have{7}{\Neg p\qquad\CondE,3,6}
\have{8}{p\qquad\quad\Reit,4}
\have{9}{\Falsum\qquad\ \FalsumI,8,7}
\close
\have{10}{\Neg p\qquad\ \NegI,4,9}
\end{nd}
\end{align*}
```

Note `\FalsumI,8,7`: `B` before `\Neg B`, formula order not line order (§6.3).

### 8.2 An invalid entry — `lecture7-incumbent`

`∼(p ∨ q) ∨ (r & ∼s), s ⊃ (r ∨ q) ⊭ p ⊃ s`. Two blocks only.

**Tree** (Lecture 7 §1, verbatim). Note the `\text{Start from…}` preamble
carried *inside* the root node, and the three open branches:

```latex
\begin{center}
\Tree[.{
\text{Start from $X$ and $\Neg A$:} \\ .\\
$X:\quad \Neg(p\Disj q)\Disj(r\Conj\Neg s)$\quad\checkmark \\
\qquad$s\Cond(r\Disj q)$\quad\checkmark \\
$\Neg A:\quad \Neg(p\Cond s)$\quad\checkmark \\ $\vert$ \\ $p$ \\ $\Neg s$}
  [.{\qquad$\Neg(p\Disj q)$\quad\checkmark \\ $\vert$ \\ $\Neg p$ \\ $\Neg q$ \\ x} ]
  [.{\qquad$r\Conj\Neg s$\quad\checkmark \\ $\vert$ \\ $r$ \\ $\Neg s$}
     [.{$\Neg s$ \\ o} ]
     [.{\qquad$r\Disj q$\quad\checkmark} [.{$r$ \\ o} ] [.{$q$ \\ o} ] ] ] ]
\end{center}
```

**Table**: 16 rows, so elide per §4.5, showing the countermodel row
`p=T, q=T, r=T, s=F` explicitly.

**ND**: none. `nd.note` carries the explanation.

---

## 9. Authoring checklist

Per block, before it goes in the database:

**All blocks**
- [ ] Every symbol is a macro, not a raw glyph (§1)
- [ ] `\Conj` between operands, `\ConjTight` when naming the symbol (§2.1)
- [ ] Atoms lower-case; `A`/`B` only in schemas (§2.4)
- [ ] Parenthesisation matches the ASCII source, outermost pair dropped only
      when the main connective is not `\Neg` (§3.1) — **not** taken from
      `display.*` (§3.2)
- [ ] No `\Falsum` inside any formula (§2.2)

**Table**
- [ ] Right layout for the entry: argument if it has premises, single-formula if
      not (§4.1)
- [ ] Values under connectives only — count them (§4.2)
- [ ] All-true row first (§4.3)
- [ ] Elided if over 16 rows, with the countermodel row shown (§4.5)
- [ ] Values agree with the entry's stored `truth_table.rows`

**Tree**
- [ ] Rooted at premises **and negated conclusion**, labelled `X:` / `\Neg A:` (§5.4)
- [ ] Every resolved formula checked; no atom or negated atom checked (§5.3)
- [ ] Every complete branch ends in `x` or `o` (§5.2)
- [ ] Branch count and open/closed verdict agree with the stored `tree` (§5.5)
- [ ] Countermodel readable off the open branch matches `branch_models` (§5.5)

**ND**
- [ ] Present iff `nd.exists` (§0.2, §7)
- [ ] Rule macros, not connective macros (§6.2)
- [ ] No `\Exp`; reductio written out (§6.2)
- [ ] Ranges use `\text{--}` (§6.3)
- [ ] Every cite is accessible — no crossing a closed scope line (§6.6)
- [ ] Line count and `rules_used` agree with the stored `nd` metadata
- [ ] `⊥`-conclusion entries use the one-sided turnstile in prose (§6.5)

---

## 10. Conflicts between sources, and how they are resolved

Found while reading Lectures 1–10. Each is small; each would otherwise produce
inconsistent blocks depending on which handout was open at the time.

| # | Conflict | Resolution |
| --- | --- | --- |
| 1 | Lecture 10 line 418 cites reiteration as bare `R, 1`; everywhere else it is `\Reit`. | **Use `\Reit`.** The bare `R` is a slip — it is in a schema, not a worked proof, and the Notation Guide lists `\Reit` in the definitive macro set. Worth fixing in the handout. |
| 2 | Lecture 9 writes line ranges as `2\text{--}3`; Lecture 10 writes `4-6`. | **Use `\text{--}`.** An en dash is right for a range and a hyphen sets too short — this one is visible in the output. Lecture 10's is the outlier (one line, `\DisjE,1,4-6,7-9`). |
| 3 | Lecture 9 spaces cites (`\ConjE, 1`); Lecture 10 does not (`\CondE,2,4`). | **Source-only; no visible difference.** Math mode supplies its own space after a comma. Use the tight form for consistency. |
| 4 | Lecture 3 shows a `c1 c2 c3` column-index row; no other table has one. | **Omit**, unless the entry's prose refers to a column by number (§4.3). |
| 5 | Restall's negated-disjunction and negated-conditional tree diagrams are misprinted; two of his worked trees carry errors. | **This guide's §5.3 table wins**, per Lecture 6's own footnote. |
| 6 | Pre-2026-08-22 material has the right-empty turnstiles reversed. | **Post-flip reading**, per §2.3. Check every one-sided turnstile transcribed from the inventory. |
| 7 | The handouts hand-pad tree roots with a leading `\qquad`; `notation.sty` now supplies `\ckpad` for the job. | **Use `\ckpad`** in new blocks (§5.7). The handouts predate the macro. |
| 8 | Handout trees sit in a bare `\begin{center}` and print off-axis. | **Wrap in `\mbox`** (§5.1). Confirmed by compiling both. |

---

## 11. What I need from you

1. ~~`FOL_Yale/notation.sty`~~ — **received, and everything now compiles** (§0.1).
2. **Confirm two-blocks-vs-three** (§0.2). I have assumed three when valid, two
   when invalid, which is what `nd.exists` says; your message said the reverse.
   This is the one answer I need before authoring starts.
3. **A steer on rendering** (§0.3). My recommendation is option 1: keep the HTML
   rendering, add the LaTeX as canonical source and a copy-paste box. Not urgent
   — it does not change how the blocks are written.
4. Optional: the Fitch checker you used to verify the proofs. If it reads
   `fitch` syntax, the ND blocks can be checked in CI the way the formulas
   already are. Without it, §9's accessibility check is done by eye.

## 12. Suggested order of work

1. **Templates first, on `lecture8-chain`.** Kant's argument is the only entry
   worked in all three methods in the handouts themselves (L4 table, L8 tree,
   L10 proof), so its three blocks can be copied from the source and are exact
   by construction. They are the reference exhibits in §8.1 and the thing every
   later block gets compared against.
2. **Then the other 34 existing entries.** They have verified structured data,
   so every block can be checked against it — row counts, branch counts, line
   counts, `rules_used`. Bugs in the templates surface here cheaply.
3. **Then the inventory.** By that point the templates are proven and the work
   is transcription rather than design. Note that the inventory's `EX` rows are
   **quarantined midterm material** and must not enter the public database —
   `course.quarantined` exists for exactly this and is already enforced at load.

A build step should fold `.tex` files into the JSON rather than anyone hand-
escaping backslashes into it (§7). Worth setting up before entry 3, not after
entry 30.
