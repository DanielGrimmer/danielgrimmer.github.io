# Calories and checkpoints

*Working out the mechanics of the travelling-salesman demo from the Kleinian
side, before building it. Behind the scenes — nothing on the site links here.*

The proposal being formalised: Möbius and Euclid each run around their own
world visiting the checkpoints available to them, spending as few calories as
possible. Every instant of motion is a choice of Lie group element; the
calorie cost is the size of that element. Euclid's state is a coset `gH` with
`H` the point stabiliser, Möbius's is `gK` with `K` the line stabiliser.

**See also** `foraging-experiment-design-notes.md` in this folder — earlier
working notes on the AI-side experiment, archived verbatim. §13 below
reconciles the two documents; the reconciliation turned up three findings that
matter for that experiment, and §10 here is superseded by the notes wherever
they conflict.

The short version of what follows: that framing does not merely permit a game,
it **dictates** one, and it dictates a surprising one. Euclid's cost falls out
canonically. Möbius's provably *cannot* — the symmetry group forbids him a
metric — and the repair is the interesting part, because it says his sense of
effort comes from his body and his arena rather than from the geometry. And
once checkpoints are added, a single mechanic drops out for free:
**Euclid profits from flags that cluster, Möbius from flags that line up.**

---

## 1. The setup

`G = E(2)`, the isometry group of the plane, `dim G = 3`. Write an element as
`(a, R)` acting by `x ↦ Rx + a`, and a Lie algebra element as `ξ = (v, ω)`,
`v ∈ ℝ²` an infinitesimal translation, `ω ∈ ℝ` an infinitesimal rotation.

- **`H`** = stabiliser of a point = `SO(2)`, `dim H = 1`, `𝔥 = {(0, ω)}`.
  `G/H = ℝ²`, the plane. **Euclid's world.**
- **`K`** = stabiliser of a line = translations along it, plus the π-rotations
  about its points and the two reflections. `dim K = 1`,
  `𝔨 = {(s·e∥, 0)}` where `e∥` is the line's direction.
  `G/K` = the space of unoriented lines = the open Möbius band. **Möbius's world.**

Both are 2-dimensional homogeneous spaces of *the same* 3-dimensional group.
That is the whole duality in one line, and it is why neither player is a
derived or secondary object: they are two quotients of one symmetry group,
sitting at the same level.

Coordinates on `G/K`: a line is `(θ, r)` with `{x : x·n(θ) = r}`,
`n(θ) = (cos θ, sin θ)`, subject to `(θ, r) ~ (θ + π, −r)`.

The adjoint action, which everything below depends on:

```
Ad_{(a,R)}(v, ω) = (Rv − ω·J a,  ω),        J = rotation by 90°
```

Note `ω` is Ad-invariant and `v` is not. This asymmetry is the source of
everything that follows.

## 2. Motion is a path in G; cost is a norm on 𝔤

A player's history is a curve `g(t) ∈ G`. The instantaneous group element is
`ξ = g⁻¹ġ ∈ 𝔤` (body frame). Calories are

```
Cost = ∫ ‖ξ(t)‖ dt
```

for some norm `‖·‖` on `𝔤`. Using the body frame makes the cost
**left-invariant**: walking costs the same wherever you are and whichever way
you face. That is what "calories" should mean for a creature.

A first warning, and it is not a technicality: **`E(2)` admits no bi-invariant
metric.** Its Killing form is degenerate; the only Ad-invariant quadratic form
on `𝔤` is `ω²`, which is degenerate. So the norm must be *chosen*, not
derived. Take the obvious one-parameter family:

```
‖(v, ω)‖² = |v|² + λ²ω²
```

`λ` is a length: how much it costs to spin, relative to translating. Read it
as the creature's size — for a rigid body of unit mass, `λ²` is exactly the
second moment of its mass about its own centre.

## 3. Euclid's cost is canonical

Euclid only cares about the motion of his point, i.e. the class of `ξ` in
`𝔤/𝔥`. Any two `ξ` differing by an element of `𝔥` produce the same motion of
his point, so the cost of a motion is the cheapest way to realise it — the
**quotient norm**:

```
‖(v, ω) mod 𝔥‖ = inf_{ω'} √(|v|² + λ²ω'²) = |v|
```

He simply declines to spin. The induced metric on `G/H = ℝ²` is `dx² + dy²`:
**the Euclidean metric, exactly**. His calories are his path length.

Why this works so cleanly: `H = SO(2)` is *compact*, so the isotropy
representation (rotation of `v`) preserves an inner product. Euclid's body is
round, so his effort does not depend on his gauge.

## 4. Möbius has no canonical cost — and that is a theorem

Same construction. `𝔨 = {(s e∥, 0)}`; take the line to be the x-axis so
`e∥ = e₁`:

```
‖(v, ω) mod 𝔨‖ = inf_s √((v₁ + s)² + v₂² + λ²ω²) = √(v₂² + λ²ω²)
```

Sliding along himself is free — it is in `K`, it does not move him. So his two
real controls are **transverse offset** and **turning**. Same dimension count
as Euclid: two controls apiece.

Now check invariance. Restricting `Ad` to `K⁰` (translations along the line by
`s`) and projecting to the quotient coordinates `(v₂, ω)`:

```
(v₂, ω) ↦ (v₂ − s·ω, ω)
```

A **shear**, and an unbounded one. A shear group preserves no bounded convex
body, hence no norm. Therefore:

> **No `E(2)`-invariant Riemannian metric exists on the space of lines.**
> The only invariant seminorm is, up to scale, `|ω|` — the turning rate alone,
> with sideways motion free.

This is a genuine and well-known fact of integral geometry, not an artefact of
my choice of `λ`: the space of lines carries an invariant *measure*
`dr ∧ dθ` (the kinematic measure — the one Crofton's formula and the Radon
transform are built on) but no invariant *metric*.

It also has an entirely concrete reading. **Möbius is infinitely long.** Ask
"how far did that line move?" and the answer depends on where along it you
look: pivot a line about one of its points and the far end sweeps arbitrarily
far while the pivot does not move at all. That *is* the shear. There is no
frame-free answer, so effort cannot be read off the geometry.

I think this is the most philosophically loaded result in this document, and
it is worth a paragraph in the Raumproblem paper: a creature who is a line,
and who insists on the full symmetry of its world, has no notion of distance —
only of turning. Its world is not a metric space but a fibration over the
circle of directions. Euclid gets a metric for free purely because his
stabiliser is compact. **Effort is not given by the geometry; it is given by
the body.**

## 5. Three repairs, and the one to use

Möbius needs a cost function to play, so a gauge must be chosen. Three
candidates, each defensible:

**(a) Foot-point gauge — recommended.** Declare that Möbius's body is centred
at his *closest approach to the centre of the arena*, and measure his velocity
there. The foot point of `(θ, r)` is `r·n(θ)`; its normal velocity is `ṙ`;
his turning rate is `θ̇`. So

```
ds²_M = dr² + λ² dθ²
```

**The strip is flat.** That is a satisfying result: Möbius's world is exactly
as homogeneous and unremarkable, from the inside, as Euclid's. Three
properties recommend it:

- flat, so geodesics are straight lines in `(r, λθ)` — trivial to compute and
  to explain, with the anti-periodic wrap `(θ+π, −r)` as the only wrinkle;
- invariant under rotations about the arena's centre, which is exactly the
  symmetry the arena leaves intact anyway (see §6);
- its area form is `λ·dr∧dθ`, i.e. **proportional to the invariant kinematic
  measure**. The metric is gauge-dependent but the area it induces is not.
  Euclid's metric has the same property (its area form is Lebesgue measure).
  So the two worlds can still be compared by measure even though only one of
  them has a canonical metric — this is the frame-neutral construct.

**(b) Swept-area gauge.** Cost the motion by the area of arena Möbius sweeps.
Over a chord of half-length `L = √(R² − r²)`, the point at arclength `s` from
the foot moves by `dr + s·dθ`, so swept area is `∫₋ₗᴸ |dr + s dθ| ds`, giving
a Finsler metric

```
2L|dr|                          if |dr| ≥ L|dθ|
L²|dθ| + dr²/|dθ|               otherwise
```

More principled — it is the honest physical cost of shoving a line through a
bounded region — but position-dependent, non-Riemannian, and it vanishes at
the rim (a line tangent to the arena is free to move, which is correct but
reads as a bug). Keep in the back pocket; it is the right cost if the game
ever gives Möbius mass.

**(c) Marked-point gauge.** Give Möbius a distinguished point on himself. This
works, but it lifts his state space to 3 dimensions (point + direction) and
breaks the duality. Rejected.

Use **(a)**. Note that (a) and (b) agree on what is free and what is not, and
that all three break translation invariance and keep rotation invariance —
consistent with §4, since no gauge can save what the theorem forbids.

## 6. The arena is self-dual, and λ is the balance knob

Take the arena to be the **disk of radius R**. Then

```
lines meeting the disk  =  { (θ, r) : |r| ≤ R }
```

which is a *compact Möbius band* — precisely the bounded region Möbius needs.
**Bounding Euclid's world to a disk is exactly bounding Möbius's world to a
band.** No other arena shape does this; a square arena (as in `levels.html`,
inherited from the notebook) gives Möbius a ragged boundary. For this demo,
use a disk.

Calibrating `λ`, two ways, both worth knowing:

- **Equal areas.** Euclid's arena has area `πR²`; the strip's Riemannian area
  is `2πRλ`. Equal at **`λ = R/2`**. By the Beardwood–Halton–Hammersley
  theorem an optimal tour of `n` uniform targets in area `A` scales as
  `√(nA)`, so equal areas means equal typical tour costs — the natural
  fairness condition for a race.
- **Equal tours, allowing for Möbius's two-for-one (§7).** If Möbius needs
  only `~n/2` stops, matching tour lengths instead gives **`λ = R`**.

So `λ ∈ [R/2, R]`, and it is the difficulty dial. Calibrate empirically —
these are scaling heuristics, and Möbius additionally gets to *choose* his
pairing, which the estimate does not credit him for.

## 7. Checkpoints: one rule, and the mechanic falls out

Here is the design decision that makes this work. **Do not give the players
separate target sets.** Scatter a single set of `m` **flags** — points in the
arena — and let each player score a flag by *being incident with it*:

- **Euclid** scores a flag by standing on it.
- **Möbius** scores a flag by having his line pass through it.

One relation, incidence, scored two ways. The consequences are immediate and
all of them are teachable:

**In Euclid's world** the task is the classical Euclidean TSP: visit `m`
points, minimise path length. Flags that **cluster** are cheap.

**In Möbius's world** a flag `p` is the sinusoid `r = p·n(θ)` — the lines
through `p` — and his task is to tour `m` sinusoids on a flat band. Now:

- Any two distinct flags' sinusoids **cross exactly once**, at the point
  representing the line joining them. (Solve `(p − q)·n(θ) = 0`: unique `θ`
  mod π.) This is `index.html`'s existing punchline — *through any two points
  there passes exactly one line* — promoted from a closing joke to the core
  mechanic. **Möbius takes flags two at a time, always.**
- Three sinusoids are concurrent **iff the three flags are collinear**. So `k`
  **collinear** flags cost Möbius a single stop. Collinearity is his
  clustering.

That is the game in one sentence: **Euclid profits from proximity, Möbius from
collinearity.** Both are looking at the same flags. Neither is wrong. Neither
can evaluate the other's route without taking the other's form of intuition
seriously — which is the thesis, made into a scoring rule.

Generic position gives Möbius a floor of `⌈m/2⌉` stops (a piercing-set bound);
collinear structure drops it.

## 8. The optimisation layer

- **Euclid, fixed order:** trivial. **Free order:** Euclidean TSP, exactly
  solvable by brute force for `m ≤ 10` and by held-Karp to `m ≈ 16` — plenty
  for scoring a human against optimal.
- **Möbius, fixed order:** touring a sequence of sinusoids on a flat band —
  a smooth constrained shortest-path problem, solvable by local optimisation
  from a few starts. **Free order:** a matching-then-tour problem (choose the
  pairing of flags, then tour the crossing points). Small `m` brute-forces.
- **Co-op allocation:** partition the flags into Euclid's set and Möbius's
  set, minimise `cost_E + cost_M`. This is the strategic decision, it depends
  on both metrics, and it is exactly what the two players must talk about.

Scoring a human run against the computed optimum gives a percentage, which is
what makes it a game rather than a demo.

## 9. The human game

Two players, one keyboard or two, split screen as the other games do.

- Shared flag set, visible to both, each in their own frame. Euclid sees
  points; Möbius sees a web of sinusoids.
- **Shared calorie budget.** This is the mechanic that forces communication:
  they must allocate flags, and they disagree about the cost of everything.
- Win condition: all flags collected under budget. Score: calories spent
  versus optimal.
- The teaching moment to engineer deliberately: a run of three or four
  collinear flags spread far apart. Euclid sees a long expensive trek; Möbius
  sees one stop. When he says "leave those three to me, they're free", and
  Euclid can *see* on his own screen that they are far apart, the duality has
  been felt rather than explained.

Single computer first, no backend, per the build order in the README.

## 10. The AI fitness environment

Same core, different shell — and this is the Neue Raumproblem experiment.

Two species of agent in the same world on the same flags:

- **E-agents** observe positions in `(x, y)` and act by `(dx, dy)`.
- **M-agents** observe `(θ, r)` and the flag sinusoids, and act by `(dθ, dr)`.

Fitness = flags collected minus calories, with calories measured in each
agent's own metric and the two calibrated by `λ` (§6). For a fully
frame-neutral fitness, use the measure-theoretic cost instead: Euclid's
"lines crossed" is `2 ×` path length by Crofton, Möbius's "points swept" is
his swept area — each computed with the other world's invariant measure. Both
sides then pay in the same currency, and the pairing is the adjoint relation
`⟨Rf, g⟩ = ⟨f, R*g⟩` that keeps turning up in this project.

**The experiment worth running.** Do not ask which representation is better —
ask the environment to decide, by making the *flag distribution* the
independent variable:

| Flags drawn as | Prediction |
|---|---|
| Tight clusters | E-agents dominate |
| Collinear families | M-agents dominate |
| Uniform in the disk | Approximate parity |

A ranking that *flips* with the world's statistics is the whole
evolutionary-epistemology claim, made empirical: a Möbius phenomenology is not
merely conceivable, it is what you evolve if the regularities of your world
are collinearity-shaped rather than proximity-shaped. It is cheap to run in
2D, and it is a real result rather than an illustration.

The follow-on is the Othello-GPT-style probe: train an agent with *no*
built-in representation on trajectories from the world, then probe its
activations for `(x, y)` versus `(θ, r)`. Prediction: which one it encodes is
set by the flag statistics it was trained on.

## 11. What to build

One headless core, two shells — matching the `window.parallax` pattern
already in `index.html`:

```
world:      R, λ, flags[]
state:      euclid {x, y}          mobius {θ, r}
step:       (state, controlE, controlM, dt) → state, calories
incidence:  |p·n(θ) − r| < ε       — one test, both players
cost:       |dx| for Euclid;  √(dr² + λ²dθ²) for Möbius
optimum:    solver for scoring
```

Plain math, no three.js — per the README's portability rule, so the Unity port
stays a rendering job. The human game and the fitness environment then differ
only in what drives `controlE` / `controlM` and in what is drawn.

Note this demo is **2D and top-down**, not the 3D platformer. That is a
feature: it is the cheapest possible vehicle for the duality, it is what the
Neue Raumproblem paper describes, and it doubles as the fitness harness.

## 12. Open questions

1. **Does Möbius's two-for-one make him strictly stronger?** §6's estimate
   says he beats Euclid by `√2` at equal areas, before crediting his freedom
   to choose the pairing. If he is dominant at every `λ`, the balance knob has
   to move elsewhere — the flag distribution, or an asymmetric budget.
2. **Should the flag *stay* collected?** If Möbius's line passing over a flag
   collects it, he sweeps up flags incidentally while travelling, which may
   trivialise the tour. Options: flags must be collected while stationary; or
   incidental collection is allowed and is precisely the skill.
3. **Is the swept-area gauge the better game after all?** It kills the "line
   near the rim is free" exploit differently and gives Möbius genuine
   inertia.
4. **Wrap-around.** Möbius's shortest route may cross the seam `(θ+π, −r)`.
   Legible in play, or confusing? The existing games suggest the seam is the
   single hardest thing to teach.

---

# 13. Reconciliation with the foraging-experiment notes

The archived notes and §§1–8 above were written independently and reach the
same setup: `G = E(2)`, the two stabilisers, both quotients 2-dimensional, and
— most tellingly — the same central lemma. The notes' §4.1 ("motions in
`𝔥_self` cost calories and change nothing; training prunes them, handing each
creature the tangent space of its own `G/H` for free") is the *learned* version
of the quotient norm in §§3–4 here. Two routes, one result. I agree it deserves
its own sentence in the paper.

Three findings from putting them side by side, then the answer to the blocking
open item.

## 13.1 The navel theorem

The notes' §3 settles on world frame + left multiplication, on the sound
argument that right multiplication does not descend to `G/H` and that
"depends on the representative is precisely what a navel is". The argument is
correct **about the action**. But the *cost* need not share the action's frame,
and separating them sharpens the result.

Take the action to be left multiplication as the notes require, and cost the
motion in the body frame: `cost(gH, ξ) = ‖Ad_{g⁻¹} ξ‖`. Under `g → gh` this
becomes `‖Ad_{h⁻¹} Ad_{g⁻¹} ξ‖`, so it is well-defined on the coset — no navel
— **iff the norm is `Ad(H)`-invariant**. Hence:

> **A cost that is both navel-free and homogeneous exists iff the isotropy
> representation of `H` on `𝔤/𝔥` has compact closure.**
> `H_P ≅ O(2)`: yes, and the cost is then the Euclidean metric, uniquely up to
> scale. `H_L`: no — the isotropy action is the unbounded shear
> `(v₂, ω) ↦ (v₂ − sω, ω)`, which preserves no norm (§4).

So Möbius must give up one or the other. Design A gives up homogeneity: the
shared external origin of §2.3. Design B gives up navel-freedom. **The notes'
§3.3 "no navel" is correct but the arbitrariness was relocated, not removed** —
§12's item 3 half-sees this ("gauge, not navel, but still a choice"). It is
stronger than a choice: for a line-stabilised creature it is *forced*.

A consequence for Design B (§9.3), which describes its navel as "unobservable
gauge — it never touches the reward". For Euclid that is true. **For Möbius it
is false**: the cost `‖ξ‖` of a body-frame move depends on which representative
he carries, so two Möbiuses in the same physical state with different navels get
different calorie bills for physically identical moves. The navel is
reward-bearing, hence not gauge. Design B needs repair before it can be the
fallback.

## 13.2 Design A hands Möbius exactly the right metric

Compute what the notes' world-frame rule actually gives Möbius. For
`ξ = (v, ω)` acting on the line `x·n(θ) = r`, carrying the foot point
`r n(θ)` along and re-reading off the rotated normal, the cross terms drop
(`Jn · n = 0`) and

```
δr = v · n(θ),      δθ = ω
```

Minimising `|v|² + λ²ω²` subject to `v·n = δr` gives `v ∥ n`, so

```
ds²_M = dr² + λ² dθ²
```

which is precisely the **foot-point gauge of §5(a)** — flat, rotation-invariant,
area form equal to the invariant kinematic measure. The notes' shared external
origin and my "closest approach to the centre" are the same gauge. Independent
convergence on the one genuinely arbitrary choice in the design, which is about
as much reassurance as this kind of thing ever offers.

## 13.3 Design A hands *Euclid* a cigar, not a plane — and this one bites

The notes' §4.2 correctly derives that the useless subspace is `Ad_g 𝔥_self`
and rotates with position. What follows if you push that one step further, into
the induced cost, is not benign.

Euclid at `p` wanting point-velocity `u` must pick `(v, ω)` with
`v + ωJp = u`. Minimising `|v|² + λ²ω²`:

```
cost² = |u|² − (u · Jp)² / (|p|² + λ²)
```

Radial motion costs full price; **tangential motion costs
`|u|·λ/√(|p|²+λ²)`**, which decays like `1/|p|`. In polar coordinates the
induced metric is

```
ds²_E = dρ² + λ²ρ²/(ρ² + λ²) dφ²
```

The circle of radius `ρ` has circumference `2πλρ/√(ρ²+λ²) → 2πλ`. Euclid's
effort-geometry under Design A is not the plane: it is a **surface of
revolution asymptotic to a cylinder of radius λ** — a cigar. Orbiting the gauge
origin at large radius is nearly free.

Why this is more than an aesthetic complaint: the whole Part 2 discriminator
(§11 of the notes) is *Möbius has a `ℤ₂` loop, Euclid is contractible*. A cigar
has a cylinder end, and a finite sample from a cylinder end is exactly what
persistent homology reports as spurious `H₁`. **The Design A cost can
manufacture, in Euclid's representation, the topological signature the
experiment uses to identify Möbius.** That is the wrong confound to be carrying
into the one measurement that matters.

It also creates a parameter conflict. Euclid's geometry is flat only for
`λ ≫ R` (arena radius), while the fairness calibration of §6 wants
`λ ∈ [R/2, R]`, and Möbius's turning becomes prohibitive as `λ` grows. Three
constraints, one knob.

**Recommended repair, which preserves the §7.1 hard constraint.** State the
cost rule once, identically for both creatures:

> Cost of a motion = `inf { ‖Ad_{g⁻¹} ξ‖ : ξ realises the motion }`.

For Euclid this is well-defined and yields exactly `ℝ²`. For Möbius it is
*ill-defined* — and he falls back to the world-frame form, which by §13.2 is
the flat strip. The rule is identical; `H_self` alone decides whether it
succeeds. That is not a violation of §7.1 but an instance of it, and a rather
pointed one: **the difference in the two creatures' cost structures is itself a
consequence of the stabiliser**, which is the hypothesis under test.

If that is too clever, the cheap mitigations are: keep episodes inside
`ρ ≲ λ`, and centre constellations on the gauge origin.

## 13.4 §10.1 (visiting predicates — "blocks running") is answerable

The blocker is the `(L, L)` case: crossing lines always touch, parallel lines
never do. §7 above dissolves it — **make every object a point.** Then:

| self / object | predicate |
|---|---|
| point / point | distance `< ε` |
| point / line | perpendicular distance `< ε` — incidence |
| line / point | perpendicular distance `< ε` — incidence |
| line / line | *does not arise* |

One relation, incidence, scored two ways, no per-pairing stipulation. Three
further consequences, all in the experiment's favour:

1. **§8.3's line–line problem disappears entirely.** No parallel locus, so no
   information created in the limit, so no surrogate-gradient pathology and no
   need for the ES fallback on that channel.
2. **It is the information-matched control §5.3 asks for.** A point-object
   gives Euclid one unsigned scalar per timestep; it gives Möbius one unsigned
   scalar per timestep. Same rank, same sign-blindness, same fold structure.
   The "thin perception masquerading as failed map-formation" confound is
   closed by construction rather than by a post-hoc control.
3. Scene underdetermination survives (§6): ranges without bearings, so memory
   is still forced and the map still has nowhere to hide but the recurrent
   state.

The cost is that Möbius no longer perceives lines, so his triangulation must
run entirely on unsigned point-distances over a trajectory. I believe that is
sufficient, but it is worth checking numerically before committing —
identifiability of a constellation from unsigned Radon-type readings along a
path is a concrete, small question, and it should be settled before the
architecture work.

I would also **bound the arena as a disk** (§6): lines meeting a disk of radius
`R` are exactly `|r| ≤ R`, a compact Möbius band, so one bound bounds both
worlds. Episode generation (§10.5) needs a bound anyway.

## 13.5 The paper's hedge is asymmetric, and that is a result

§10.7 proposes varying the norm and the visiting predicate to see whether the
learned topology tracks the stabiliser or the cost structure, and calls it
possibly the most valuable output. Agreed — with one reframing that I think
strengthens the paper's footnote rather than merely defending it.

The hedge concedes that the cost norm is constitution-laden, "not read off the
bare geometry". §13.1 says this is **true of Möbius by necessity and of Euclid
only by choice**: a point-stabilised creature *can* read its metric off the
geometry (uniquely, up to scale), and a line-stabilised creature *provably
cannot*. So the degree to which constitution must supply the metric is itself
determined by the stabiliser.

That converts the hedge from a limitation into a prediction of the
self-quotient hypothesis. It also sets the ablation's expected shape: Euclid's
learned topology should be **robust** across the norm sweep, Möbius's should be
**more sensitive** to it. A flat, symmetric robustness result would actually be
the surprising one.

## 13.6 What each document does not cover

The notes are about agents that receive no coordinates — only invariant
self–object standings — which is the right regime for the representation-probing
claim. §§7–9 here are about *humans*, who see their own world fully and whose
interest is that they disagree with each other about cost. Different regimes,
both legitimate; they share the world, the incidence rule, and the cost model,
which is what §11's shared headless core is for.

The one mechanic here with no counterpart in the notes is the co-op scoring of
§7 — shared flags, shared calorie budget, Euclid profiting from clusters and
Möbius from collinearity. It is not needed for the experiment. But it is worth
noting that it is the same fact the experiment is probing, in a form a
first-year can feel in thirty seconds, which makes it the demo that motivates
the paper's figure.
