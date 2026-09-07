# Constructing truth tables

The practice page has a Lecture 3 activity at
`/arguments/practice/#constructing-tables`. This link always starts at the first
problem. Each problem also has a stable fragment containing its own ID, so
refreshing, sharing a link, and browser Back/Forward restore that problem.
Answers are hidden again when a problem is opened.
The home screen starts with neither activity selected. Only an explicit
activity link opens construction practice or the encyclopedia drill.

The sequence in `assets/arguments/construction.js` contains:

1. Five single-connective problems, in the order ∼, &, ∨, ⊃, ≡.
2. Four negation-and-scope problems: conditional, conjunction, disjunction,
   biconditional. Each asks for three formulas side by side in one table,
   comparing negating the left letter, the whole formula, and the right letter.
   A single worked answer shares the assignment columns and separates the three
   formulas with vertical lines, retaining all intermediate values and one M
   per formula. The instructor’s calculation note appears directly below the
   worked table, with no separate disclosure.
3. Sixteen selected problems with repeated atoms and longer formulas, including
   `p ≡ p`, `p ⊃ ∼p`, and Lecture 3's exclusive-or construction. Their previously
   shuffled, fixed order is retained.
4. Two three-letter problems: `(p & q) ⊃ r` and `(p ∨ q) & ∼r`, introducing
   the eight-row assignment pattern.

There are 27 numbered problems covering 35 formulas. Each page displays
“Problem N of 27.” Previous/Next move one problem at a time. All three old
formula links in each trio now open the same combined comparison problem.
The five former paired exercises replaced by the trios remain available at
all their published URLs as unnumbered additional practice. No old link is
silently redirected to a different formula.

Students construct the tables on paper and reveal the worked answer. There is
no validity or classification question. Answers use the course’s calculation
layout: atoms at left, values only under connectives inside each formula,
all-true row first, and M at the foot of each main column. The same table has accessible
column labels; there is no alternate subformula view. The sequence works
without fetching the encyclopedia database.

These are calculation exercises, not new encyclopedia entries. The existing
random argument/proof activity and its four method-specific difficulty bands
remain available separately, with Lecture 4 identified as the prerequisite
for truth-table assessment. Construction formulas are independent of the argument database.

The construction tests check every intermediate column against the existing
Python formula parser/evaluator, as well as the course row order, repeated
atoms, selection variety, repeatable order, and main-column positions. They run with the
rest of `_tests/*.test.mjs` in the deployment workflow.

Argument practice also has stable URLs:
`/arguments/practice/#arguments/<entry-id>/<method>`, where method is `table`,
`tree`, or `nd`. Each draw updates the URL; opening a link, refreshing, and
browser history restore the form and method with the answer hidden. The
selected method and level match the linked problem. Filter changes clear the
problem and its URL. Links obey the same quarantine and problem-set locks as
random draws. Invalid or unavailable links show an unavailable message.

Extremely hard is displayed as optional without changing the stored difficulty
values or the scoring rules. A brief explanation distinguishes computational
work for tables and trees from judgment about finding an ND proof. These are
practice measures, not claims about exam expectations; TF meetings and office
hours provide the course's support for students who get stuck.
