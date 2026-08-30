# Style Guide for the Argument-Form Encyclopedia

**Purpose.** An entry in `argument-db.json` is two things: a LaTeX block for
each method it has been worked in — the truth table, the truth tree, the
natural deduction — and the prose that says why anyone should care. This
document fixes both, so that a reader arriving from the course sees the same
notation they saw in lecture, down to the spacing, and reads something worth the
trip.

**How it is arranged.** §§1–6 are the blocks: symbols, formulas, and one section
per method. §7 is the JSON schema, §8 two worked entries, §9 the checklist.
**§13 is the prose** — the names, the gloss, the appearances, the commentary —
and it is the half that a new entry lives or dies by, since the blocks are
generated and the prose is not.

**Authority.** Everything about notation is derived from `notation.sty`,
`Notation Guide (Author Reference).tex`, and Lecture Handouts 1–10 — and, where
the three left anything open, from compiling it and looking at the result
(§0.1). Where this guide and a handout disagree, the handout wins and this guide
is wrong — tell me and I will fix it. Where the handouts disagree *with each
other*, §10 records the conflict and picks one.

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
every fragment is marked as such.

The block preamble that was used, and that any consumer of these blocks needs:

```latex
\usepackage{amsmath,amssymb,stmaryrd}
\usepackage{mathtools,calc}   % \mathmakebox and \widthof, for the table's \uv
\usepackage{graphicx}         % \resizebox, for the fit guards
\usepackage{qtree}            % trees
\usepackage{fitch}            % Fitch derivations -- provides the `nd` environment
\usepackage{notation}         % FOL_Yale/notation.sty -- ALWAYS LAST
\newsavebox{\aetreebox}\newsavebox{\aetabbox}
\renewcommand{\ndjustformat}[2]{$#1$, #2}
\setkeys{fitch}{justsep=2em}
```

⚠ **`notation` loads last, and it must.** It configures fitch, guarded by
`\@ifpackageloaded{fitch}`, so loading it first makes the configuration
silently do nothing and the rule names come out wrong.

The last two lines are that configuration, repeated so a block stays
self-contained. `\ndlabel` is `\mathord{#1}\text{#2}` and needs math mode,
while fitch's own `\ndjustformat` `\mbox`es its argument — without the
`\renewcommand`, a `\by{\CondE}{1,3}` stops the build with *Missing $
inserted*. They are in `latex_macros.ndjust`; a consumer whose `notation.sty`
already has them just sets the same values twice.

**Not `pifont`.** The handouts load it for `\checkmark` via `\ding{51}`, but
nothing here calls `\ding` — `\checkmark` comes from `amssymb`, which is
already loaded — so declaring it would send a consumer after a package the
blocks never use.

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

**An atom is a lower-case letter with an optional subscript, and nothing
else.** Lecture 2 gives the alphabet: "lower case letters (e.g. `p`, `q`, `r`,
etc.) potentially with subscripts (e.g. `p_2`, `q_3`, `r_5`)". `bl`, `ls`, `aS`
and `bpq` are not names of propositions, however mnemonic — `bl` is two
letters, and the language has no rule that reads a run of letters as one name.

**The subscript is not restricted to digits.** The lecture's examples are
numeric but the rule is not, and `a_D`, `g_S`, `b_pq` are names as good as
`p_2`. This is what lets a mnemonic atom stay mnemonic while still being one
letter with a subscript. It is stored with the underscore inline — `a_D` in the
JSON, `a_{D}` in the LaTeX, `a<sub>D</sub>` on the page.

`build.py` legalises on every build, by the obvious rule: **the first letter
stays the name, and everything after it becomes the subscript.** So `bS`
becomes `b_S`, `ls` becomes `l_s`, `bpq` becomes `b_pq`, and the Cleopatra
entry's `bS, aS, bD, aD, aC` become `b_S, a_S, b_D, a_D, a_C` — which is what
those atoms meant all along. A numeric tail is disambiguation of last resort,
used only if two atoms would otherwise collide.

Two consequences for authoring:

- **Write the entry with whatever atoms are natural; the build settles the
  spelling.** It renames the formulas, the table, the tree, the derivation, the
  countermodels and the atoms quoted in backticks in the prose, all together.
- **A hand-written proof in `proofs.py` must use the entry's *final* atom
  names.** The build renames the entry and the proof together the first time,
  but `proofs.py` is a source file and is not rewritten, so on the next build
  the entry is already legal and the proof no longer matches. `check()` catches
  it — the error names the mismatched premises — and the fix is to update
  `proofs.py`.

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

> **Every binary application carries its own parentheses, with the outermost
> pair dropped when the main connective is not `\Neg`.**

This is now enforced rather than asked for. `latexgen/build.py` runs a
normalisation pass over the whole database on every build: each formula is
parsed and reprinted in that spelling, so a source that dropped an inner pair
gets it back and one that already has it is left alone. The pass is idempotent
and `_tests/argument-forms.test.mjs` fails if any stored formula drifts out of
it. Two entries needed it: `finite-choice-2x2`, whose conclusion ran four
disjuncts together, and `simpson-amalgamation`, whose third premise ran three
conjuncts together.

Square brackets are permitted as poorly-drawn parentheses for readability in
deeply nested formulas — `s \Bicond [p \Cond (q \Conj r)]` — and are worth using
once nesting reaches three deep.

### 3.2 Why this matters here, concretely

The `display.*` fields `argument-db.json` arrived with were generated with
*minimal* parentheses, and for a left-nested conditional that is not terse but
**wrong**. Peirce's Law — source `((p > q) > p) > p` — was emitted as
`p ⊃ q ⊃ p ⊃ p`, which reads as `p ⊃ (q ⊃ (p ⊃ p))`: a different formula, and a
tautology in every logic, when the whole interest of Peirce's Law is that it is
not. Seven entries were affected that way.

The same elision reached the formulas stored on tree nodes, and there it was
worse than wrong — it was unreadable as an exercise. A tree decomposes a formula
by its **main connective**, so a node that says
`∼(p & r ∨ p & s ∨ q & r ∨ q & s)` and is then resolved into
`∼(p & r ∨ p & s ∨ q & r)` and `∼(q & s)` is asking the student to guess that
the disjunction groups to the left. Written out —
`∼((((p & r) ∨ (p & s)) ∨ (q & r)) ∨ (q & s))` — the main connective is the
last `∨` and the step reads itself.

Both are fixed at the source. `build.py`'s normalisation pass rewrites the
display strings from the ASCII, and recovers the tree nodes by matching each
against the entry's **own subformulas** printed the same lossy way, rather than
by re-parsing a string that no longer determines a formula. If a stored string
could name two different subformulas the build stops.

**Blocks are still built from `premises` and `conclusion`, never from
`display.*`** — the ASCII is the source and the display strings are derived from
it, so they can no longer drift apart.

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

### 4.5 Every row, always — and a compact companion

Tables are listed in full, however many rows they have. A truth table is an
*exhaustive* check, and a reader who cannot see the rows cannot see that it is
one. The sixty-four-row Dutch book form is exactly the case that matters: what
makes it worth showing is that sixty-three rows behave and one does not.

But sixty-four rows is more than a page of a four-page handout, so each entry
also carries a **compact table** at `truth_table.latex_compact` — Lecture 8's
"portion of a truth table", with a `\vdots` standing in for every stretch left
out. It is a companion, never a substitute: an entry has both, the website
offers a **Full table / Key rows** switch between them, and a handout takes
whichever fits.

What it keeps:

| The entry | Rows kept | Why |
| --- | --- | --- |
| an argument whose premises something satisfies | every row where **the conclusion is false**, and every row where **all the premises are true** | Those are the two ways it could go wrong: a false conclusion, in which case a premise had better be false too; and all-true premises, in which case the conclusion had better be true. Their intersection is a countermodel, and a reader who checks the union has checked the argument |
| a premise-less claim that is valid | the **top and bottom rows** — all atoms true, all atoms false | A claimed tautology is true on every row, so no row singles itself out; the ends stand in for all of them |
| a premise-less claim that is not | the rows where the conclusion is false | Which are exactly its countermodels |
| premises nothing can satisfy | the **top and bottom rows** | Every contradiction claim, and the vacuously valid `ex-falso`. There is no live row to point at |

The rules are predicates on the *model*, not the row number, so they do not
depend on the order the atoms come out in: the top row is the one where every
atom is true, the bottom row the one where none is.

**The compact table is sometimes the full table**, and that is not a fault. On
`russell-schema`, `distributed-knowledge` and `total-not-determined` every row
is a row the reader has to check, so nothing is elided and the two blocks come
out byte-identical — which is how the website knows to drop the switch rather
than offer a button that changes nothing.

### 4.5a Every row, always (the full table)

Tables are listed in full, however many rows they have. Long ones were briefly
elided to the first row, the countermodels and the last with a `\vdots`
between; that saves paper and loses the point. A truth table is an *exhaustive*
check, and a reader who cannot see the rows cannot see that it is one. The
sixty-four-row Dutch book form is exactly the case that matters: what makes it
worth showing is that sixty-three rows behave and one does not. At eleven point
a sixty-four-row table is about eighty lines tall on the page, which is a
perfectly ordinary thing for a figure to be.

### 4.6 Templates

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

### 5.6a The bar marks a resolution, one per resolution

`$\vert$` between two formulas in the same node says *these came out of that*.
The handouts write

```latex
$l\Conj d$\quad\checkmark \\ $\vert$ \\ $l$ \\ $d$
```

so there is **one bar per resolution, not one per node**. A node holding two
resolutions gets two bars; a child node whose first formulas came from the
branch above it gets none before them, because there is nothing above them in
that node to separate from.

The generator drives this off `from`: each entry in a node's `added` records the
formula it came out of, and a change of `from` is where a bar goes.

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

### 6.3 Citation format — the justification column

**Citations go in `\by`, never inline in the formula.**

```latex
\have{5}{r}\by{\CondE}{2,4}
\have{10}{r \Disj s}\by{\DisjE}{1,4-6,7-9}
```

`nd` is a three-column array — line number, formula, justification — and `\by`
fills the third, which is why every citation in a proof lines up with no
hand-tuned `\quad`: the column sizes itself to its widest entry.

The blocks used to pad the citation into the formula argument with
`\mathmakebox[\widthof{…}]`. It worked, but it measured the citation as part of
the *formula* column, so every display came out far wider than it needed to be.
**Do not mix the two spellings in one display** — a single inline citation
among `\by` ones roughly triples the width, which in a two-column handout is
the difference between fitting and not.

- **`\hypo` lines carry no `\by`.** Premises and assumptions are not cited; the
  bar and the `\open` are what mark them. No `Pr`, no `As`.
- **Ranges take a plain hyphen** inside `\by`: `{1,4-6,7-9}` sets *1, 4–6,
  7–9*. `\by` passes its second argument through `\ndref`, which walks it
  character by character, turns `-` into a proper en dash, and puts the space
  after each comma itself. `\text{--}` is right only in the older inline
  spelling, which had no `\ndref` to do the work.
- **Never use fitch's own shorthands** — `\ai`, `\ae`, `\oi`, `\oe`, `\ni` and
  the rest are hardcoded to `\wedge` and `\neg`, and will silently set ∧ and ¬
  where the course uses & and ∼. The course macros pass straight through `\by`.
- **An unresolvable reference is a warning, not an error.** fitch sets a bold
  `??` and logs `Undefined line reference`; the document compiles and the page
  looks plausible. `svg.py` greps the log and refuses to write an SVG when it
  finds one.
- **A cited line needs a key**, which is not the printed label: `\have` is
  `\have[<printed>]{<key>}{<formula>}` and they coincide only when the optional
  argument is omitted. `\have[13]{}{…}` prints 13 and is not citable. This is
  also what lets a *schematic* proof use `\by`: write the letter as both, as in
  `\have[n]{n}{A \Cond B}` … `\by{\CondE}{n,m}`.
- **One discharged subproof: two line numbers, comma-separated.**
  `\by{\CondI}{2,6}`, `\by{\NegI}{3,6}`. The handouts do this twenty times over
  and use no dash for it, and they are right to: the rule name already says a
  subproof is being discharged, so a range has nothing to disambiguate.
- **Two discharged subproofs: ranges.** `\by{\DisjE}{1,2-3,4-5}`,
  `\by{\BicondI}{1-7,8-14}`. Here the dash does work — `∨E, 1, 2, 3, 4, 5`
  would not say which pairs go together. `\DisjE` and `\BicondI` are the only
  two rules that take one.
- **Symbolic ranges** in a schema are written the same way, with a hyphen:
  `\by{\CondI}{n-m}`, `\by{\CondI}{m+1-k}`. `\ndref` treats `-`, `,`, `;`, `.`,
  `(` and `)` as separators and everything else as part of a key, so `m+1` is a
  legal key and needs no bracing.
- **Order of cites** follows the rule's statement: `\FalsumI,n,m` cites `B`
  first and `\Neg B` second. Lecture 10's Kant proof writes `\FalsumI,8,7` —
  line 8 is `p`, line 7 is `\Neg p` — so the *formula* order governs, not the
  line order.

### 6.4 When to reiterate

`\Reit` is never *required* — a formula on an outer scope line stays accessible
inside a subproof and can be cited directly, which is what Lecture 9's
accessibility rule says. So reiteration is a choice about clarity, and the house
rule is: **reiterate wherever it makes a line's logical role visible, and not
merely to bring an outer formula within reach.**

Two situations meet that test, and both occur in the database.

**1. A subproof whose conclusion is its own assumption.** In a proof by cases,
if you assume `q` and `q` is what that case has to deliver, write it twice:

```latex
\open
\hypo{5}{w}
\have{6}{w\quad \Reit,5}
\close
```

Line 5 is the assumption `\DisjE` licenses; line 6 is what the case concludes.
They are the same formula doing two different jobs, and a one-line subproof
would have a single line playing both. `distributed-knowledge-repaired` has two
of these.

**2. A reductio that contradicts its own assumption.** When the ⊥ comes from the
subproof's assumption together with something just derived, bring the assumption
back down immediately before `\FalsumI`, so both halves of the contradiction
stand together at the point of use. This is what Lecture 10's Kant proof does at
line 8 — assume `p`, derive `∼p`, reiterate `p`, `⊥`. `peirce-law` and
`russell-schema` take the same shape.

**What does not meet the test.** Reiterating an outer premise simply because it
is several scopes up. That is locality, not role, and Lecture 9 teaches the
accessibility rule precisely so a student can read such a citation. Two proofs
have a ⊥ whose pair is imported entirely from shallower scopes — `peirce-law`
line 5 and `distributed-knowledge-repaired` line 10 — and those are left citing
directly. It is a judgement call and could go the other way; if you want the
contradiction visible inside every subderivation, say so and both change.

### 6.5 The classical reductio pattern

The commonest shape in the database. It is **not** a basic rule and must be
written out in full every time:

```latex
\begin{align*}
\begin{nd}
\open
\hypo[n]{n}{\Neg A}
\have[\vdots]{}{\dots}
\have[m]{m}{\Falsum}
\close
\have[m+1]{m+1}{\Neg\Neg A}\by{\NegI}{n,m}
\have{}{A}\by{\NegE}{m+1}
\end{nd}
\end{align*}
```

**There is no explosion rule, so ⊥ never yields a formula directly.** Wanting
`A` from a contradiction means opening a fresh subproof on `\Neg A` and
reaching ⊥ *inside it*. Do not derive ⊥ on the way in and then derive it again
under the assumption: the outer one is a line nothing cites, and on the page it
reads as a step the proof needed. See `ex-falso`, which is exactly this shape
and nothing more.

**Every derived line must be used.** A line that is neither a premise nor an
assumption has to be cited by number somewhere later, or be the last line of a
subproof that some rule discharges, or be the conclusion. `nd.check()` refuses
a proof with any other kind of line. Premises are exempt — an idle premise is a
fact about the argument rather than a slip, and `recovery-cleopatra` turns on
having one.

### 6.6 Contradiction entries (`⊥` as conclusion)

Three entries conclude `⊥`: they argue that their premises cannot all be true.
`⊥` after `∴` is licensed, on a par with `⊨ ⊥` and `⊢ ⊥` — the lecture notes
are being adjusted to introduce falsum early enough for that. So the stacked
display reads `∴ ⊥` like any other conclusion, and the entry is an argument
like any other, valid or invalid.

**What has not changed is that falsum is never part of a formula.** The
Notation Guide is unconditional: "no formation rule admits it, no truth table
has a column for it, no tree branch closes on it… If you find `\Falsum` nested
inside a formula anywhere else, it is an error." Two consequences for the
blocks, and they hold whatever the turnstile does:

| Block | Why it runs one-sided |
| --- | --- |
| Truth table | No falsum column. There is nothing to evaluate — it would read F on every row — so the table is atoms and premises, and the argument is valid exactly when no row makes them all true |
| Truth tree | The premises alone at the root, no `\Neg A` label. Negating the conclusion would put `\Falsum` inside a `\Neg`, which is not a formula; the argument is valid exactly when every branch closes |
| Derivation | `\Falsum` alone on the final line, cited `\FalsumI,n,m`, and the proof ends there — no `\NegI` follows |

In the ND heading the **one-sided turnstile remains the house form**: write
`X \ProvesND`, not `X \ProvesND \Falsum`. Lecture 10 *defines* the former by
the latter, and that definition is the only place the two-sided form belongs.

### 6.7 Accessibility

A line may be cited only when every sub-derivation it lives inside is still open
— trace a path straight up the page without crossing a scope line that has
already ended. A main-scope-line formula is accessible everywhere below it; a
formula inside a closed sub-derivation is gone. `\Reit` exists to carry a
formula *down into* a sub-derivation.

Every proof we author must be checked against this by hand until a checker
exists; a citation across a closed scope line is the classic invisible error.

**Depth is not scope.** Two subproofs can be *siblings* — the two halves of a
biconditional proof, the two cases of a proof by cases — and they sit at the
same depth with no line between them at a shallower one. So "the depth never
dips below m's" is not the accessibility rule, and drawing the scope lines from
depth alone runs the two siblings together into one, which is both wrong and
unreadable: the second assumption appears to be inside the first case.

An **assumption is what opens a subproof**, so an `As` line at depth d ends
every subproof at depth d or deeper and starts a fresh one. `nd.py` gives each
line a **scope path** on that rule, cites are checked against it (`scope[m]` a
prefix of `scope[k]`), and `render_proof` emits `\close` / `\open` from the
path rather than from the depth. Five of the eighteen proofs have siblings —
`exportation`, `finite-choice-2x2`, `distribution`,
`distributed-knowledge-repaired` — and every one of them was being drawn as a
single run before the paths existed.

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
  ["FOL_Yale/notation", "qtree", "fitch", "amsmath", "amssymb", "stmaryrd",
  "mathtools", "calc", "graphicx"]`, so a consumer knows what to load, and
  `"latex_macros"` for the two `\newsavebox` declarations the fit guards need.
  Nothing declares `pifont`: `\checkmark` is `amssymb`'s and no block calls
  `\ding`.

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

**Table**: 16 rows, all listed (§4.5)
`p=T, q=T, r=T, s=F` explicitly.

**ND**: none. `nd.note` carries the explanation.

---

## 9. Authoring checklist

Per block, before it goes in the database:

**All blocks**
- [ ] Every symbol is a macro, not a raw glyph (§1)
- [ ] `\Conj` between operands, `\ConjTight` when naming the symbol (§2.1)
- [ ] Every atom is a lower-case letter with an optional subscript — `a_D`,
      not `aD`; `l_s`, not `ls` (§2.4)
- [ ] Every binary application carries its own parentheses, outermost pair
      dropped only when the main connective is not `\Neg` (§3.1) — **not**
      taken from `display.*` (§3.2)
- [ ] No `\Falsum` inside any formula (§2.2)
- [ ] If the conclusion is `⊥`, the table has no falsum column and the tree no
      negated conclusion at its root — falsum is never inside a formula (§6.6)

**Table**
- [ ] Right layout for the entry: argument if it has premises, single-formula if
      not (§4.1)
- [ ] Values under connectives only — count them (§4.2)
- [ ] All-true row first (§4.3)
- [ ] Every row listed in `latex`, none elided; `latex_compact` carries the
      portion (§4.5)
- [ ] Values agree with the entry's stored `truth_table.rows`

**Tree**
- [ ] Rooted at premises **and negated conclusion**, labelled `X:` / `\Neg A:` (§5.4)
- [ ] Every resolved formula checked; no atom or negated atom checked (§5.3)
- [ ] Every complete branch ends in `x` or `o` (§5.2)
- [ ] One `$\vert$` per resolution inside a node (§5.6a)
- [ ] Branch count and open/closed verdict agree with the stored `tree` (§5.5)
- [ ] Countermodel readable off the open branch matches `branch_models` (§5.5)

**ND**
- [ ] Present iff `nd.exists` (§0.2, §7)
- [ ] Rule macros, not connective macros (§6.2)
- [ ] No `\Exp`; reductio written out (§6.2)
- [ ] Citations in `\by`, never inline; `\hypo` lines uncited; one discharged
      subproof cited `n,m`, two cited as `a-b` ranges with plain hyphens (§6.3)
- [ ] Every cite is accessible — no crossing a closed scope line, and a
      *sibling* subproof at the same depth is closed (§6.7)
- [ ] Written with the entry's final atom names (§2.4)
- [ ] Line count and `rules_used` agree with the stored `nd` metadata
- [ ] `⊥`-conclusion entries use the one-sided turnstile in prose (§6.7)

---

## 10. Conflicts between sources, and how they are resolved

Found while reading Lectures 1–10. Each is small; each would otherwise produce
inconsistent blocks depending on which handout was open at the time.

| # | Conflict | Resolution |
| --- | --- | --- |
| 1 | Lecture 10 line 418 cites reiteration as bare `R, 1`; everywhere else it is `\Reit`. | **Use `\Reit`.** The bare `R` is a slip — it is in a schema, not a worked proof, and the Notation Guide lists `\Reit` in the definitive macro set. Worth fixing in the handout. |
| 2 | Lecture 9 writes line ranges as `2\text{--}3`; Lecture 10 writes `4-6`. | **Lecture 10 was right, and this guide had it backwards until 2026-08-30.** An en dash *is* right for a range — but inside `\by` you get one by writing a plain hyphen, because `\ndref` converts it. `\text{--}` is correct only in the older inline spelling, which is no longer used anywhere (§6.3). |
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

## 11a. The blocks on the website

Every block in this guide ends up in two places: a handout, typeset by
`pdflatex` against a 6.5in measure, and the encyclopedia at
[/arguments/](https://danielgrimmer.github.io/arguments/), where the *same*
LaTeX is compiled to an SVG by `latexgen/svg.py` and inlined into the page.
Nothing in this guide changes for the web — that is the point of writing the
blocks once — but three consequences are worth knowing while authoring.

**The measure is 9in on the web, not 6.5in.** The `\ifdim\wd\aetreebox>\linewidth
… \resizebox` guards in §5 and §4 exist so a wide block fits a printed page.
The browser already fits the block to the reader's column, so at 6.5in the two
shrinks would compound and a truth tree would come out at half the size of the
prose beside it. `svg.py` therefore compiles against a 9in measure and lets CSS
do the fitting. Blocks must still carry their guards: the handout needs them,
and a block wide enough to trip even 9in is a block worth reconsidering.

**11pt is the reference size.** The generator converts the block's typeset width
into `em` by dividing by 11, so one em of the page is 11pt of TeX and the LaTeX
renders at the same size as the prose around it. A block that sets its own font
size — `\small`, `\footnotesize` — will look small on the web too, and for the
same reason it looks small on paper. Prefer letting the fit guard scale a wide
block down over choosing a smaller font by hand.

**The output must survive being drawn as paths.** `dvisvgm --no-fonts` turns
every glyph into an outline, so anything that renders as a character renders on
the web. What does *not* survive is anything the DVI route cannot express:
`\special`s aimed at a PDF backend, `\href`, PDF-only packages. None of the
constructions in this guide use them, and new ones should not either.

Regenerate after any change to a block:

```
cd EncyclopediaOfArguments/latexgen
python3 build.py            # blocks into argument-db.json
python3 svg.py              # blocks into assets/arguments/svg/
python3 svg.py --check      # is anything stale?
```

The test suite fails if the SVGs and the database have drifted apart, so a
forgotten `svg.py` is caught rather than shipped.

## 11b. Importing from the inventory

The plan is a routine that takes a few rows from the inventory each firing and
writes their entries. What follows is the contract it has to meet, split into
what the build **enforces** — so a bad entry stops the build rather than
reaching the site — and what it **repairs**, which the author can leave alone.

**Repaired automatically (write what is natural):**

| | |
| --- | --- |
| Atom names | Legalised per §2.4: the first letter is the name, the rest becomes the subscript |
| Parentheses | Every binary application parenthesised, outermost pair dropped per §3.1 |
| `display.*` | Rebuilt from the ASCII, so the two cannot drift |
| `truth_table.columns` | Rebuilt from the premises and conclusion |
| Tree node formulas | Matched against the entry's own subformulas and reprinted |
| The `nd` profile | Recomputed from the proof actually shown |
| All three LaTeX blocks | Generated from the structured data, never hand-written into the JSON |

**Enforced (the build stops):**

| Check | The error says |
| --- | --- |
| Atom names legal after renaming | *… is not a name of a proposition* |
| A tree node is a subformula of the entry's own formulas | *tree node … is not a subformula* |
| No stored display string is ambiguous between two subformulas | *… is ambiguous between …* |
| A valid entry has a proof | *valid but no proof written* |
| The proof's premises are the entry's | *premise lines … do not match* |
| Every citation is accessible, sibling subproofs included (§6.7) | *line k cites line m, which is not accessible* |
| Every discharge lands in the scope that held the subproof | *subproof a-b is out of scope* |
| The table's values recompute from the formulas | the mismatched cell |

**Still on the author.** The build can check that an entry is *coherent*; it
cannot check that it is *right*, or that it belongs here at all:

- **An appearance with a source.** The inclusion criterion is that somebody
  actually used the argument — a form with no `appearances` entry does not
  belong in the encyclopedia (see `assets/arguments/README.md`).
- **The English gloss**, and whether it is `faithful`.
- **`interest`** — why this form is worth a student's time.
- **The three difficulty scores**, one per method; a hard table can be an easy
  derivation.
- **The derivation itself**, in `proofs.py`, written with the entry's final
  atom names.
- **`course.quarantined` for anything marked `EX` in the inventory.** Those are
  midterm material and must never reach the public database.

After writing entries, always:

```
cd EncyclopediaOfArguments/latexgen
python3 build.py --write     # normalise, generate, verify
python3 svg.py               # typeset
node --test "_tests/*.test.mjs"
```

The SVGs are committed build artifacts, so a forgotten `svg.py` leaves the site
showing last week's proof; `svg.py --check` and the test suite both catch it.

---

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

---

## 14. Difficulty

Three scores per entry, one per method, each `easy`, `medium` or `hard`. They
are what the practice page's chips filter on, so they are the only thing
between a student who asked for a hard tree and a trivial one.

**Two of the three are measured, and one is judged.** Tables and trees have no
insight step: you know what to do from the first row, or from the first
unresolved formula, and the only question is how much of it there is. So those
are computed and written by `build.py`, like any other derived field, and
**must not be hand-edited**. Finding a derivation is not like that, so the `nd`
score is authored.

`latexgen/difficulty.py --diff` reports any score that departs from the rubric.
For a table or a tree that can only mean a bug. For a derivation it means an
author overrode the suggestion, which is allowed — with the reason in
`course.note`, and the test suite checks that it is there.

### 14.-1 The boundaries are provisional

The four thresholds below (48 and 160 calls; 3 and 7 applications) were set
against thirty-five entries, which is not enough to place a boundary. They are
four constants at the top of `difficulty.py` and moving one is a one-line
change followed by `build.py --write`; nothing else in the codebase knows them.

**The rule for moving them, once the database is populated, is numerical
balance.** A scale whose middle band holds four fifths of the entries is not
telling a student anything, and neither is a `hard` chip that draws from three
problems. `difficulty.py --balance` prints the current distribution beside the
thresholds that would divide the entries into three roughly equal parts, for
each method. It is a report, not an instruction: a boundary that lands where
the work genuinely jumps is worth keeping even if the thirds come out uneven.

### 14.0 The reference student

**Someone who has just been taught the method.** Tables are Lecture 4, trees
Lecture 6, derivations Lecture 10 — lecture numbers, not weeks. Each method is
judged on its own timeline, which is the point of scoring them separately: a
form can be a hard table at Lecture 4 and an easy derivation at Lecture 10.

### 14.1 Truth tables — truth-functional calls

The work is every connective occurrence, evaluated once per row:

> **calls = (connectives in the premises + connectives in the conclusion) × 2ⁿ**

Not what is *written* — the argument layout prints one value per premise, but
you still have to evaluate the connectives inside it — and so the layout makes
no difference to the score, which is right, because it makes no difference to
the work.

| | calls | |
| --- | --- | --- |
| **easy** | up to **48** | three atoms or fewer, or a small formula. A minute or two |
| **medium** | **49–160** | four or five atoms, or three with a long conclusion |
| **hard** | over **160** | 32 rows against five connectives, or 16 against eleven. Ten minutes, and one slip anywhere loses it |

### 14.2 Truth trees — rule applications

The work is how many rules you fire. That depends on the order, but the course
gives a standing order — **non-branching rules first** — and fixing the order
fixes the count. A rule applied on the trunk counts once, however many branches
inherit its results, which is exactly why the advice is what it is.

| | applications | |
| --- | --- | --- |
| **easy** | up to **3** | the stack, a rule or two, done |
| **medium** | **4–7** | a page: several forks, or a deep trunk before the first |
| **hard** | **8 or more** | keeping the page straight is itself the exercise |

`latexgen/derive.py` builds trees in that order, so the count is whatever the
stored tree contains.

### 14.3 Natural deduction — finding the route

The only method where difficulty is about *finding* something. Length is a
consequence, not a cause, and the student cannot consult it: they do not know
the proof is fourteen lines until they have found it. A twelve-line straight
run of `⊃E` is easy; Peirce's Law would be hard at six.

What makes a derivation hard is how much of it is **dictated by the goal**. A
goal of `A ⊃ B` names its own rule — assume `A`, aim at `B`. A goal of `∼A`
names `∼I`. What is not named has to be chosen, and choosing is where students
stop. Count the triggers:

1. **Proof by cases** (`∨E`). The wall. Nothing in the goal says to do it.
2. **An undictated reductio** — assuming the negation of something that is not
   itself a negation. `∼I` on a negation goal is dictated; assuming `∼p` in
   order to reach `p` is the classical step Lecture 10 makes a point of.
3. **A subproof inside a subproof.** Nesting is where students close the wrong
   one.
4. **Four or more subproofs.**
5. **More than ten derived lines** — lines that are not premises, since the
   premises are given.

| | |
| --- | --- |
| **easy** | **no trigger.** Every rule is named by the goal, or by a premise waiting to be eliminated |
| **medium** | **one or two** |
| **hard** | **three or more** |

An invalid form has no `nd` score; write `null`. `build.py` enforces that.

### 14.4 What difficulty is not

- **Not length.** See above.
- **Not the verdict.** Invalid forms are not harder than valid ones.
- **Not how interesting the form is.** That is what `interest` is for.
- **Not `search_sharpness`**, which is `countermodels / rows` on an invalid
  form, computed alongside. It is shown on the page — *lower is harder* — and
  it deliberately does not feed the score: how rare a countermodel is changes
  how carefully you must read a table, not how long the table takes.

---

## 13. The prose

The blocks are generated; the prose is not, and it is what makes an entry worth
reading. A form with a correct table and nothing else is a row in a lookup
table. The encyclopedia's whole claim is that these forms were *used* — by
somebody, somewhere, about something — and that claim lives entirely in the
words.

### 13.1 The inclusion criterion, which is a prose criterion

**A form with no `appearances` entry does not belong here.** Not "is
instructive in the abstract", not "is a nice tree" — somebody actually used it,
argued about it, or got caught out by it.

**The course counts.** A form worked in a lecture, set on a problem set, or
taken from Restall has an appearance, and it is the honest one: `who: PHIL
1115`, the handout as the `work`, the section as the `locus`, and `fidelity:
our reconstruction` unless you have the text to quote. Much of the course
inventory is like this, and the right `interest` is a modest true one —
*"one of the course's own worked examples: the first derivation students meet,
and the shape every later proof by cases is built on"* — not an invented
philosophical significance. Those entries can be deepened later when a champion
turns up.

What is still forbidden is manufacturing provenance: an appearance that names a
philosopher who did not make the argument, or a `quote` that paraphrases a
source into quotation marks.

**The `quote` field is now closed for course appearances.** Saying the rule was
not enough -- it was already written here, and two import runs put a sentence
of our own in the field anyway, describing where the form was set as though the
handout had said it. The trouble is structural rather than careless: the import
routine reads the inventory, which is a table of sequents and problem-set
columns, so it has no handout prose and no way to get any, and the field
invites a sentence it cannot honestly supply.

So a course quote must appear verbatim in `EncyclopediaOfArguments/SOURCE_QUOTES.md`,
which holds the handout passages a person has read and copied in. `build.py`
refuses to write the database otherwise and `_tests/argument-forms.test.mjs`
says the same of the file on disk; both read `who` and `work`, so renaming the
source does not evade them. Nothing checks a quote from Restall, the SEP or a
paper -- nothing in the repository could -- but those come from reading, and
they are not where this went wrong.

The field being absent costs nothing. Where the form was set is what `work` and
`locus` say, and everything beyond that belongs in `interest`, in our voice,
where it is true.

### 13.2 The fields, and what each is for

| Field | Length | What it does |
| --- | --- | --- |
| `names[]` | 2–8 words | The first is the display title and the page heading. Later ones are aliases the search should find — "consequentia mirabilis", "the Lecture 8 chain". Name the *form*, not the paper it came from |
| `english[].gloss` | 1–3 sentences | The argument in ordinary English, in the order the premises are given, ending in the conclusion. No symbols. It should read like something a person would say |
| `english[].faithful` | boolean | `true` if the gloss is what the source argued; `false` if we have straightened it for exposition. Never omit it — an unfaithful gloss presented as faithful is the one lie the format allows |
| `interest` | 3–6 sentences | Why this form is worth a student's time. The most-read field on the page, and the hardest to write |
| `appearances[]` | one per episode | Who, where, and in what words. See §13.4 |
| `countermodel_gloss` | 1–2 sentences | What the countermodel *means* — not that `p = T, q = F`, which the table already says, but what it is a picture of |
| `nd.note` | 1–3 sentences | Only on invalid entries: where the attempt at a derivation breaks down. "No derivation" alone is a wasted field; say which rule you reach for and why it will not come |
| `course.note` | any | **Instructor-facing.** Never rendered as body copy. Scheduling, pairings, things to say in lecture |
| `course.problem_set` | a map | Which methods this form has been *set* in. See §13.8 — it decides what the practice page may draw |
| `tags.topic` / `.figure` | 1–3 each | Facets, and shown before the answer — so they must not name the verdict |
| `tags.defect` / `.nonclassical` | 0–3 each | Facets, and **withheld** before the answer, because "affirming a disjunct" is the answer |

### 13.3 `interest`: what a good one does

Look at what the strong entries have in common. Each says something the table
cannot:

- **What turns on it.** *"This is the form on which the whole relevance-logic
  dispute turns, and the informational reading disagrees with the truth table
  here for a stateable reason."*
- **What is surprising about the numbers.** *"One countermodel in sixty-four
  rows, and that row is the entire point of the entry."*
- **What the form is a near-miss of.** *"Move one letter and validity
  evaporates."* Pair entries — `X` and `X-repaired`, `X` and `X-without-Y` —
  earn their keep here, and the relation fields (`repairs_to`, `looks_like`)
  should agree with what the prose says.
- **What the student is meant to do with it.** *"A good 'find the premise whose
  removal reopens the tree' exercise."*

What it should not do: restate the verdict, narrate the table row by row, or
praise the argument. Assume the reader has the table in front of them.

### 13.4 `appearances`: the provenance format

One entry per episode, not per author.

| Key | |
| --- | --- |
| `who` | The person or body. `"Immanuel Kant"`, `"PHIL 1115"`, `"SEP"` |
| `work`, `locus` | Enough to find it: the work, then the section, page, or paragraph |
| `url` | Where a reader can check it, or `null`. Prefer a stable one — SEP, PhilPapers, a DOI |
| `type` | `used` \| `discussed` \| `diagnosed`. **`diagnosed` means "diagnosed the form", not "diagnosed a fallacy"** — it sits on valid entries too |
| `fidelity` | `verbatim` \| `paraphrase` \| `our reconstruction`. Getting this wrong is the worst error in the file: it puts words in someone's mouth |
| `quote` | The passage. Verbatim means verbatim, typos and all |

**Never reword a source to make it fit.** If the passage does not show the form,
either the reconstruction is `our reconstruction` and says so, or the appearance
does not belong.

### 13.5 The spoiler discipline, and how narrow it is

**The practice page is the only place the verdict has to be hidden**, and it
shows the sequent and nothing else — no title, no gloss, no tags, no
commentary. So the prose has no spoiler rules to obey. Write `interest`,
`english`, `countermodel_gloss` and the tags as plainly as the subject deserves:
`affirming-a-disjunct` may be tagged `informal fallacies`, an `interest` may
open by saying the argument fails, a gloss may say whatever is true.

This is worth stating flatly because the opposite assumption cost real work.
The entry renderer still carries a **spoiler mode** — it withholds the verdict
banner, the `defect` and `nonclassical` facets and the method turnstiles, and
puts each appearance's quote behind a one-click reveal — from when the practice
page was going to show a whole entry with the answer hidden. Nothing calls it
now. Leave it or delete it, but do not write prose around it.

The one rule that survives is about the *problem statement* itself, and it lives
in the code rather than the prose: `problemStatement()` stacks the premises and
the conclusion with `∴` and no turnstile, because `⊨` against `⊭` is the answer.

### 13.8 What must not be practised

`course.problem_set` maps a method to where the form was set as graded work:

```json
"problem_set": { "table": "PS2.8a", "tree": "PS4.2a" }
```

The practice page drops those pairs. A student who was asked to build that very
tree is not getting a fair random draw when it comes up again, so the tree is
withheld — but **the other methods stay open**, because having been asked for
the table is no help at all with the derivation. The encyclopedia itself still
shows everything; the answer was never hidden there.

**Exam appearances are deliberately not recorded here.** The site is
unreachable during the exam and there is far too much of it to memorise, so
exam material is free to practise. The six forms the course inventory's §8
quarantines are a separate matter and never enter the database at all —
`latexgen/inventory.py` refuses to offer them, and anything that reaches the
database another way takes `course.quarantined: true`.

`inventory.py` derives the map from the inventory's own "where" column, so an
importing author copies it rather than working it out.

### 13.6 House voice

- **Say the thing.** Short sentences, concrete nouns, no throat-clearing. The
  entries that read well open on the claim, not on the topic.
- **British spelling**, en dashes for ranges, ` -- ` for an em dash (the
  renderer converts it).
- **Markdown is a small subset:** `**bold**`, `*italic*`, and `` `code` ``.
  No headings, no lists, no links — a link belongs in `appearances[].url`.
- **Formulas and atom names go in backticks**, in the house glyphs: `` `p ⊃ q` ``,
  not `p -> q`. The build renames atoms inside backticked spans when it
  legalises them (§2.4), so a formula in prose stays in step with the entry.
- **Name people in full on first mention**, then by surname.
- **Do not address the student.** No "you will notice"; the encyclopedia is a
  reference, and the practice page is where the second person belongs.

### 13.7 What is checked, and what is not

The build validates the logic and the shape; nobody but the author validates the
prose. `_tests/argument-forms.test.mjs` catches:

- an entry with no `appearances`, or an appearance with no `who` or `work`, or
  a `url` that is not an `https://` link;
- a `fidelity` or `type` outside the allowed set;
- an entry with no display name;
- a `gloss` carrying a turnstile or the word *valid* / *invalid* / *fallacy*,
  or one that does not say whether it is `faithful`;
- a missing `nd.note` on an invalid entry;
- a dangling `repairs_to` or `looks_like`.

What it cannot catch is everything that matters most: a gloss that misdescribes
its argument, an `interest` that says nothing, a quote that does not show the
form it is cited for, or a `fidelity` that is a shade too generous. Those are
the author's, every time.
