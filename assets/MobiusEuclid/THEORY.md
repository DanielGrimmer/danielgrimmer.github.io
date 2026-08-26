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

I think this is the most philosophically loaded result in this document, and
it is worth a paragraph in the Raumproblem paper: a creature who is a line,
and who insists on the full symmetry of its world, has no notion of distance —
only of turning. Euclid gets a metric for free purely because his stabiliser
is compact. **Effort is not given by the geometry; it is given by the body.**

### 4.1 The same fact, said properly: a bundle with no connection

The shear computation is the shadow of a cleaner structural statement, which
is the right one to carry around.

`𝕄` is a **fibre bundle over `ℝP¹`**, the circle of directions. Each fibre is
a family of co-parallel lines. Both ends of the bundle carry canonical
invariant structure:

- **Along a fibre:** the perpendicular gap between two parallel lines is an
  `E(2)`-invariant, so each fibre is a metric line — canonically affine, with
  a canonical scale, but **no canonical zero** (a zero would be a marked line
  in each direction).
- **On the base:** the acute angle between two directions is invariant, so
  `ℝP¹` is a circle of total length `π`.

What is missing is the glue. **There is no `E(2)`-invariant connection**, so
there is no canonical way to compare positions in different fibres. The only
invariant notion of distance between two non-parallel lines is the distance
between their *fibres* — the acute angle at which they cross. That is exactly
the `|ω|` seminorm above, and it is why the seminorm is degenerate: it is the
pullback of the base metric.

**Algebraically** this is the failure of a short exact sequence to split
canonically. `𝔢(2) = 𝔱 ⋊ 𝔰𝔬(2)` has `𝔱` as a canonical ideal but no canonical
complement, and quotienting by `𝔥_L` (which meets `𝔱` in the along-self
translations) leaves

```
0 → ℝ_transverse → 𝔤/𝔥_L → 𝔰𝔬(2) → 0
        (fibre)                  (base)
```

— a direct sum with no canonical orthogonality. **The splittings are a torsor
under `ℝ² = 𝔱`.** A splitting is precisely a choice of complement to the
translation ideal, which is precisely a choice of *which point rotations are
canonically about*. Contrast Euclid, for whom `𝔱 ∩ 𝔥_P = 0`, so
`𝔤/𝔥_P ≅ 𝔱` canonically and an `SO(2)`-invariant norm on it is unique up to
scale. **Euclid needs one number; Möbius needs a point.**

### 4.2 The space of connections is a copy of Euclid's plane

Pick a point `o` in Euclid's plane and declare rotation about `o` to be
horizontal. That is a connection: it supplies a zero for every fibre at once
(the line through `o` in each direction), so it trivialises the bundle as
`(θ, r)` with `r` measured from `o`. Pick `o' = o + a` instead and

```
r' = r − a · n(θ)
```

— the fibres slide against each other by a **sinusoid**. So the admissible
connections form a 2-parameter family, a torsor under translations, related by
sinusoidal shifts: **the space of Möbius's connections *is* Euclid's plane.**
Möbius cannot measure distance without borrowing a point — not a point he
stands at, but a point he measures from. That is not a defect; it is the
duality showing up as gauge freedom, and it is a better sentence for the paper
than anything in §4.

One refinement worth recording. *Any* anti-periodic section `s(θ)` gives a
flat connection (`r̃ = r − s(θ)`), so the full family is infinite-dimensional;
the point-sections `s = o·n(θ)` are just its first harmonic — and they are cut
out exactly by the stipulation that cost be a norm on `𝔤`, since only those
arise from a complement to `𝔱`. The higher harmonics are the same "thin range"
condition that governs the Radon transform. Worth knowing for the constitution
ledger: the choice is 2-dimensional *because* of the Lie-algebra stipulation,
not for free.

## 5. Three repairs, and the one to use

Möbius needs a connection to play, so a point must be chosen. Three
candidates, each defensible:

**(a) Arena-centre connection — recommended.** Take `o` to be the centre of
the arena. Equivalently: Möbius's body is centred at his *closest approach to
that centre*. The foot point of `(θ, r)` is `r·n(θ)`; its normal velocity is
`ṙ`; his turning rate is `θ̇`. So

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
separate target sets.** Scatter a single set of **flags**, of *both* kinds —
points and lines of the arena — and let each player score a flag by *being
incident with it*.

The rule is one sentence: **each creature is a point in its own world; visiting
is incidence there.** A flag has an image in each world, and the images are
dual:

| flag | in Euclid's world | in Möbius's world |
|---|---|---|
| **point** `p` | a point | the section `r = p·n(θ)` |
| **line** `ℓ` | a line | a point |

So each creature sees flags **of its own kind as points**, and flags of the
other kind as curves — a perfect exchange, and all four incidences are
canonical (two coincidences, two lyings-on). Note this dissolves the old
"how does a line visit a line?" worry: Möbius visits a line-flag by
*coinciding* with it in `𝕄`, not by crossing it in the plane.

The consequences are immediate, dual, and all teachable:

**Clusters.** Flags of your own kind that sit close together are cheap: you
walk a short way and collect them one by one. For Euclid that is a tight knot
of point-flags; for Möbius it is a family of line-flags of similar direction
and offset.

**Concurrences.** Flags of the *other* kind that share a common incidence are
**free — you take the whole family at one stop**:

- `k` line-flags through a common point cost **Euclid** a single stop: he
  stands at the point.
- `k` collinear point-flags cost **Möbius** a single stop: he becomes the
  line. (Their sections are concurrent in `𝕄` iff the points are collinear.)

And the two-at-a-time fact survives: any two point-flags' sections cross
exactly once, at the line joining them — `index.html`'s punchline, *through
any two points there passes exactly one line*, promoted from closing joke to
core mechanic. Dually, any two line-flags meet at exactly one point, so Euclid
also takes line-flags two at a time.

That is the game in one sentence: **each player profits from proximity among
their own kind and from concurrence among the other's.** Both are looking at
the same scattering. Neither is wrong. Neither can evaluate the other's route
without taking the other's form of intuition seriously — which is the thesis,
made into a scoring rule.

Mixing the two flag types is what makes it symmetric; an all-points board is
the Euclid-friendly extreme and an all-lines board the Möbius-friendly one,
which makes the flag mix a clean difficulty and teaching dial.

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
   to choose the pairing. Partly answered by 2 below; with both flag types the
   two-for-one is symmetric (Euclid also takes line-flags two at a time), so
   the estimate now cuts both ways. Still worth measuring.
2. ~~**Should the flag stay collected — does Möbius sweep them up?**~~
   **Answered by measurement** (`foraging.html`, four constellations, `λ = R/2`).
   The worry was that Möbius could hold one key, sweep his line across the
   whole disk, and harvest every point-flag. He can — but it costs him
   **exactly `2R` = 2.00 calories every time**, because a pure `r`-sweep pays
   `∫|dr|` with no `λ` discount, and it clears at most 8 of 13 flags. Greedy
   co-op play clears the *whole* board for **1.32–2.45**. So the sweep is a
   legitimate but non-dominant option, priced at roughly par for a partial
   clear. The area-matched `λ = R/2` turns out to price it correctly on its
   own, with no special rule needed. (Measured with perfect claim timing at
   2000 sample positions, so that is an upper bound on what a human could
   extract.) Claiming is still a deliberate keypress, which kills the
   hold-one-key degeneracy; the deeper fix was not required.
3. **Is the swept-area gauge the better game after all?** Less pressing now
   that 2 is answered. Note a correction to §5(b): normalised to a length it
   makes a full sweep *cheaper* (`πR/2 ≈ 1.57R`) than the flat metric does
   (`2R`), because chords near the rim are short. It does not discipline
   sweeping; the flat metric does that better.
4. **Wrap-around.** Möbius's shortest route may cross the seam `(θ+π, −r)`.
   Legible in play, or confusing? The existing games suggest the seam is the
   single hardest thing to teach. `foraging.html` shows dimmed wrapped copies
   in the margins rather than asserting the identification — untested on
   readers.

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

## 13.3 The cigar — an artefact of a mispriced cost, not a feature of Euclid

**Corrected.** Euclid's effort-geometry *is* the plane. The cigar below is
real, but it is a consequence of one particular cost function — the notes'
world-frame norm — and that cost function is simply the wrong constitution.
Recording the computation because the failure mode is instructive and because
it decides which cost to ship.

The notes' §4.2 correctly derives that the useless subspace is `Ad_g 𝔥_self`
and rotates with position. Push that one step further, into the induced cost.

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

**Why this happens, and why it is wrong.** The world-frame norm charges
`λ²ω²` for "rotate about the origin `o`" *at a flat rate, however far away `o`
is*. But a tiny rotation about a distant `o` swings Euclid a long way, so it
sells him tangential motion at `λ/|p|` per unit speed. He is not being clever;
he is being **bribed by a mispriced control**. The objection "he will just not
rotate" is right — under any sensible cost he wouldn't, and the reason he does
here is that this cost does not charge him for *his own* spin, but for the
world's spin about a point he may be nowhere near.

Switch to the body frame and it evaporates. With `ξ_body = Ad_{g⁻¹}ξ`, a
direct computation gives `‖ξ_body‖² = |u|² + λ²ω²` where `u` is Euclid's actual
velocity and `ω` his own spin rate — so declining to spin is optimal, the
minimum is `|u|`, and

```
ds²_E = dx² + dy²      exactly, everywhere, with no choice of o
```

This is §3, and it is why Euclid needs no connection: `𝔤/𝔥_P ≅ 𝔱` canonically
and `H_P` is compact, so the norm descends without a gauge (§4.1). **Euclid's
metric is the plane; Möbius's requires a point. That asymmetry is the whole
content of §13.1.**

Two things still worth carrying away. First, if the notes' world-frame cost is
kept, the confound is severe: the Part 2 discriminator (§11 of the notes) is
*Möbius has a `ℤ₂` loop, Euclid is contractible*, and a finite sample from a
cigar's cylinder end is exactly what persistent homology reports as spurious
`H₁` — manufacturing, in Euclid, the signature used to identify Möbius.
Second, it would create a three-way parameter conflict: flatness wants
`λ ≫ R`, fairness (§6) wants `λ ∈ [R/2, R]`, and Möbius's mobility wants `λ`
small. All of that is avoided by pricing effort in the body frame.

**The rule to ship**, stated once and identically for both creatures:

> Cost of a motion = `inf { ‖Ad_{g⁻¹} ξ‖ : ξ realises the motion }`.

For Euclid this is well-defined and yields exactly `ℝ²`. For Möbius it is
*ill-defined* — his stabiliser shears the norm — so he must fix a connection,
and with the arena centre that is by §13.2 the flat strip `dr² + λ²dθ²`. The
rule is identical; `H_self` alone decides whether it needs a gauge. That is not
a violation of the notes' §7.1 but an instance of it, and a pointed one:
**the difference in the two creatures' cost structures is itself a consequence
of the stabiliser**, which is the hypothesis under test.

## 13.4 §10.1 (visiting predicates — "blocks running") is answerable

The blocker is the `(L, L)` case: "crossing lines always touch, parallel lines
never do." The blocker is an artefact of asking the question in the *plane*.
Ask it in `𝕄`, where the visitor is a point, and it disappears: **Möbius
visits a line-object by coinciding with it**, not by crossing it.

> **Visiting = incidence in the visitor's own world.** Every creature is a
> point there; every object is a point or a curve there.

| self / object | in the visitor's world | predicate |
|---|---|---|
| point / point | point vs point | coincidence |
| point / line | point vs line | lies on |
| line / point | point vs section `r = p·n(θ)` | lies on |
| line / line | point vs point in `𝕄` | coincidence |

Four cases, all canonical, no per-pairing stipulation, and the two diagonal
entries are the same relation seen from the two sides. `(L, L)` is not
pathological; it was mis-posed.

*(An earlier draft of this section proposed dropping line-objects entirely to
dodge `(L, L)`. That solved a non-problem and cost the design its symmetry;
both object types are in — see §7.)*

Two consequences for the experiment survive from that draft and still hold:

1. **§8.3's line–line problem is a perception issue, not a visiting issue.**
   The created-information discontinuity at the parallel locus is about what
   Möbius can *see* of another line, and remains real. But it no longer
   contaminates the visiting predicate, which is now a clean coincidence in
   `𝕄` — so the surrogate-gradient worry is confined to the encoder.
2. **Information matching (§5.3) needs measuring, not assuming.** With both
   object types present the two creatures' per-timestep sensor ranks are not
   obviously equal, so the notes' [OPEN] control is still open. The honest
   move is to compute the rank of each pairing explicitly during §10.8's
   formal write-up of the observation space, and match episode lengths if
   they differ.

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
§7 — shared flags of both kinds, shared calorie budget, each player profiting
from proximity among their own kind and concurrence among the other's. It is
not needed for the experiment. But it is worth noting that it is the same fact
the experiment is probing, in a form a first-year can feel in thirty seconds,
which makes it the demo that motivates the paper's figure.

---

# 14. Left, right, and what rotates — the frame question settled

Three different things in this design each have a left/right character, and
conflating them is what made the notes' §3 feel unresolved. Separated:

| Question | Answer | Why |
|---|---|---|
| What **is** a creature? | a left coset `gH` | `H` erases what it cannot tell about itself |
| What is its **invariant standing** toward an object? | the double coset `H_obj (g_obj⁻¹ g_self) H_self` | both ambiguities quotiented; well-defined as the notes verify |
| What **moves** it? | left multiplication `g ↦ exp(ξ)g` | only left multiplication descends to `G/H` — the notes' §3 is right |
| In what frame is `ξ` **priced**? | body frame, `‖Ad_{g⁻¹}ξ‖` | see below |

The last row is the one the notes did not separate out, and it is where the
answer to "does the Lie algebra frame rotate with the body?" lives:

**The frame rotates with the body; the state does not know the frame.** A
creature's body frame is only defined up to `H_self`, so a body-frame *action*
would need a representative — that is the navel, and it is correctly rejected.
But a body-frame *cost* needs only that the norm be `H_self`-invariant, which
is strictly weaker.

- **Euclid**: his body frame is ambiguous by a rotation — he does not know
  which way he is facing — but `|v|² + λ²ω²` is rotation-invariant, so his
  *cost* is well-defined even though his *frame* is not. He prices effort in a
  frame he cannot identify, and gets `ℝ²` exactly.
- **Möbius**: his body frame is ambiguous by a slide along himself, and the
  norm is *not* slide-invariant (the shear). His cost is genuinely undefined
  until he fixes a connection — a point to measure from (§4.2).

So: fixed world frame pinned at the identity (the notes' §2.3) and body frame
that rotates with the creature are **both available**, they differ by `Ad_g`,
and the choice matters only for the cost. Use the world frame for the action,
the body frame for the price.

# 15. What this settles for the build

Decisions, for the human demo, now fixed:

1. **Flags of both kinds**, points and lines (§7). All four incidences
   canonical. Flag mix is the difficulty dial.
2. **Disk arena**, radius `R` (§6). Self-dual: `|r| ≤ R` is a compact band.
3. **Connection at the arena centre.** For a human player this is not an
   imposition — showing Möbius his strip as a `(θ, r)` rectangle *is* choosing
   a connection, and the arena centre is the only choice a player will read as
   neutral. Worth a line in the paper: for a creature that is shown its world,
   **the chart is the constitution**.
4. **Controls map straight to the chart.** Euclid's WASD is `(dx, dy)`;
   Möbius's is `(dθ, dr)`. Costs `√(dx² + dy²)` and `√(dr² + λ²dθ²)`
   respectively — no `Ad`-twisting appears anywhere in the game loop, because
   the connection has already absorbed it. The Kleinian derivation is what
   justifies these two lines of code; it does not need to run inside them.
5. **Humans see the whole scene.** The invariant-standings-only regime is for
   the agents (§13.6); a player looks at the board.

Which means the implementation is now small and fully specified: two charts,
two control maps, two cost integrals, one incidence test, one flag list.

# 16. Incidence, derived rather than stipulated

§7 and §13.4 treat the four visiting predicates as *obvious*. They are better
than obvious: they are **forced**, by a criterion that never mentions a chart,
a metric or a connection.

Look at the `G`-orbits on pairs (object, object) — the double cosets. They are
indexed by the invariants (a distance, an angle), and along that index the
**symmetry profile is not constant**. One orbit has a strictly larger
stabiliser than its neighbours:

| pairing | generic orbit | the exceptional orbit |
|---|---|---|
| point–point | `ℤ₂` (reflection in the joining line) | `O(2)` — **dimension jumps** at distance 0 |
| point–line | `ℤ₂` (reflection in the perpendicular through the point) | `ℤ₂ × ℤ₂` — the reflection in `ℓ` joins, order doubles |
| line–line | `ℤ₂` crossing; dim 1 parallel | `H_L` — dim 1 with four components, at coincidence |

> **Incidence = the orbit with maximal stabiliser.**

That returns coincidence, lying-on, lying-on, coincidence — exactly the four
predicates the design needs, with no per-pairing stipulation and nothing owed
to either creature's point of view. Two consequences.

**The visiting relation is not constitution-laden.** The notes' §12 ledger
lists it as item 2, and the paper's footnote hedges on it alongside the cost
norm. It can be **struck**: it is determined by `G` alone. What remains
constitution-laden is the cost norm — and §13.1 shows *that* is mandatory for
Möbius and optional for Euclid. So the hedge shrinks to one item, and the one
item is itself a self-quotient result. Only the tolerance `ε` is a free
parameter, and that is an artefact of continuous motion rather than of form.

**The extra symmetry at point–line incidence is the reflection in `ℓ`** — the
very `ℤ₂` that makes Möbius's distance-sense unsigned (notes §5.3). So the
incidence locus is exactly his perceptual fold: **he feels incidence as the
moment his sensor folds.** Euclid, whose stabiliser already contains
reflections, feels nothing special. Worth a line in the paper — it is a case
where the two creatures' phenomenologies of the *same invariant event* differ
in a way you can derive.

# 17. Built

`foraging.html` in this folder implements all of the above: disk arena,
arena-centre connection, flags of both kinds, the four incidence predicates,
`√(dr² + λ²dθ²)` against `√(dx² + dy²)`, both players drawn live in both
views, claiming that takes everything you are incident with, four teaching
constellations, a greedy-co-op par, and a co-op/solo switch.

**Co-op is the default**, and that is the answer to "same time, or separately?"
Both players in one world at once, one shared flag pool, one score. The reason
is that the allocation decision — *who takes which family* — is the only place
the two cost geometries have to be compared out loud, and it exists only if
the pool is shared. Solo mode (each player gets their own copy of the same
constellation) is one click away, and is the right setting for a side-by-side
efficiency comparison and for single-agent fitness episodes.

Verified headless: the pencil yields six lines to one claim, the collinear
family yields five points to one claim, the seam identification holds to
machine precision, both players burn calories at a matched rate, and the page
makes exactly one network request.
