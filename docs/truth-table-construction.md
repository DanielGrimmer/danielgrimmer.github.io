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
2. Twelve selected two-connective problems, mixing inside negations, outside
   negations, and binary connectives without negation. Negations in both the
   antecedent and the consequent are included.
3. Sixteen selected problems with repeated atoms and longer formulas, including
   `p ≡ p`, `p ⊃ ∼p`, and Lecture 3's exclusive-or construction.

Both later selections were shuffled once and are stored in that fixed order.
Every table has at most two atoms and four rows. Students see their current
problem number without a total count.

Students construct the tables on paper and reveal the worked answer. There is
no validity or classification question. Answers use the single-formula layout:
atoms at left, values only under connectives inside the formula, all-true row
first, and M at the foot of the main column. The same table has accessible
column labels; there is no alternate subformula view. The sequence works
without fetching the encyclopedia database.

These are calculation exercises, not new encyclopedia entries. The existing
random argument/proof activity and its four method-specific difficulty bands
remain available separately, with Lecture 4 identified as the prerequisite
for truth-table assessment. No database entries or generated fields change.

The construction tests check every intermediate column against the existing
Python formula parser/evaluator, as well as the course row order, repeated
atoms, selection variety, repeatable order, and main-column positions. They run with the
rest of `_tests/*.test.mjs` in the deployment workflow.
