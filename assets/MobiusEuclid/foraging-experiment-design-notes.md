# Self-Quotient Foraging Experiment — Design Notes (Part 1)

**Provenance.** Working notes toward the experiment sketched in §5 of *Das Neue Raumproblem: The Phenomenology of Spacetime Dualities and Evolutionary Epistemology* (Grimmer), specifically the forthcoming-work paragraph and its two-hedge footnote. This document records design decisions, their reasoning, rejected alternatives, and open questions, so the discussion can be resumed cold.

**Status markers used throughout:**
- **[SETTLED]** — decided, with reasoning recorded
- **[PROPOSED]** — suggested, not yet ratified
- **[OPEN]** — genuinely undecided; several block implementation
- **[REJECTED]** — considered and set aside, recorded so it isn't re-litigated

---

## 1. The experiment as the paper states it

The paper's §5 advances the **self-quotient hypothesis**: *a creature quotients the geometry of its world by its own stabilizer.* A creature whose bodily symmetries are conjugate to $\mathrm{O}(2)$ (point-like) finds itself in $\mathbb{R}^2$; a creature stabilized by $\mathrm{E}(1) \times \mathbb{Z}_2$ (line-like, a filament or front) finds itself in $\mathbb{M}$ (the Möbius strip).

The proposed test: a foraging game posed entirely in $G$-invariant terms, $G = \mathrm{E}(2)$. Objects of both types are scattered; the player is itself a coset of one type or the other; each turn it selects a Lie algebra element and pays a calorie cost proportional to its size; it scores by visiting objects, traveling-salesman style. Crucially the player receives **no coordinates on any manifold** — only double cosets, the $G$-invariant relations in which it stands to each object.

**The conjecture:** an $H_P$-coset player develops an internal map organized as the Euclidean plane; an $H_L$-coset player, one organized as the Möbius strip. Each precipitates the topology of its own self-quotient from form-neutral data.

**The paper's own hedges (footnote):**
1. The cost function (a norm on the Lie algebra) and the visiting-relation are parts of the creature's *constitution*, not read off the bare geometry. The experiment tests the self-quotient hypothesis, not a constitution-free genesis of form.
2. The conjecture concerns the learned representation's *organization*, probed as in Li et al. 2023 (Othello-GPT), not the creature's phenomenology.

---

## 2. Group-theoretic setup and conventions

### 2.1 Basic objects

- $G = \mathrm{E}(2)$, $\dim G = 3$.
- $H_P \cong \mathrm{O}(2)$ — point stabilizer. $\mathfrak{h}_P = \mathfrak{so}(2)$, dimension 1 (rotation about the point).
- $H_L \cong \mathrm{E}(1) \times \mathbb{Z}_2$ — line stabilizer. $\mathfrak{h}_L$ is dimension 1 (translation *along* the line); the $\mathbb{Z}_2$ flip is discrete and contributes nothing to the Lie algebra, but it is exactly what makes $G/H_L$ **non-orientable** — the Möbius twist.
- Both quotients are 2-dimensional: $3 - 1 = 2$. Euclid gets $\mathbb{R}^2$, Möbius gets $\mathbb{M}$.

### 2.2 Double coset convention **[SETTLED]**

Use $H_{\text{obj}} \backslash \cdot / H_{\text{self}}$ ordering, i.e. the standing of the player toward an object is

$$ H_{\text{obj}} \, \big( g_{\text{obj}}^{-1} g_{\text{self}} \big) \, H_{\text{self}} $$

with player $g_{\text{self}} H_{\text{self}}$ and object $g_{\text{obj}} H_{\text{obj}}$.

*Rationale:* keeps $H_{\text{self}}$ on the right, so the player is naturally read as a left coset $gH_{\text{self}}$ — a point of $G/H_{\text{self}}$ — which is the object the hypothesis is about.

*Well-definedness (verified):* replacing $g_{\text{obj}} \to g_{\text{obj}} h_{\text{obj}}$ pushes $h_{\text{obj}}^{-1}$ into the left $H_{\text{obj}}$; replacing $g_{\text{self}} \to g_{\text{self}} h_{\text{self}}$ absorbs into the right $H_{\text{self}}$. ✓

### 2.3 Basis for the Lie algebra **[SETTLED]**

A **fixed, shared, external** basis of $\mathfrak{e}(2)$ at the tangent space of the identity:

- **For Euclid:** $v_x$ = world $x$-translation, $v_y$ = world $y$-translation, $\omega$ = rotation about the shared external origin.
- **For Möbius:** $v_x$ = cosine-shaped displacement, $v_y$ = sine-shaped displacement, $\omega$ = rotation of the base space (with respect to a specific connection encoding Euclid's origin).

Two structural notes recorded during discussion:

- There is **no canonical orthogonality** between the rotation direction and the translation directions — only a direct sum structure. Consequently rotation about any *other* point is trivially expressible as "pure rotation plus translation components." Neither creature needs a special mechanism for off-origin rotation.
- The shared origin implicit in this basis is **external gauge, not a navel.** A navel would be carried with the body; this origin sits still while creatures move past it. This distinction matters — see §3.

---

## 3. The frame question: world vs. body, left vs. right **[SETTLED — world frame, left multiplication]**

This was the main point of confusion and is worth recording in full, because the resolution is forced rather than stipulated.

### 3.1 The mathematical fact

The creature lives in the space of **left** cosets $gH$. Therefore:

- **Left multiplication descends to the quotient.** If $g' = gh$, then $\exp(\xi) g' H = \exp(\xi) g h H = \exp(\xi) g H$. The action is well-defined on $G/H$ regardless of which representative you picked. ✓
- **Right multiplication does not.** $g' h \exp(\xi) H \neq g \exp(\xi) H$ in general. To apply a body-frame motion you must *choose a representative* — i.e. carry the full pose including the orientation that $H$ is supposed to erase.

**"Depends on the representative" is precisely what a navel is.**

### 3.2 The resolution

The user's *picture* (fixed external basis, shared origin, no navel) and the user's initial *words* ("happy with right multiplication") were in tension. The picture is correct; it entails **left multiplication, world frame**:

$$ g_{\text{self}} \;\mapsto\; \exp(\xi)\, g_{\text{self}} $$

and the standing updates to

$$ H_{\text{obj}} \; g_{\text{obj}}^{-1} \, \exp(\xi) \, g_{\text{self}} \; H_{\text{self}} $$

with $\exp(\xi)$ wedged in the **middle** rather than adjacent to $H_{\text{self}}$.

**This "ugly middle" is purely cosmetic.** The update was checked and is well-defined on both the player's coset and the object's coset. Nothing computational goes wrong; it simply doesn't *look* adjacent under the chosen convention.

### 3.3 Confirmed consequence: no navel

Möbius does **not** have a navel under this design. The "which point do I rotate about" worry raised earlier in discussion was an artifact of the body-frame reading and is dead under Design A.

---

## 4. The free tangent space **[SETTLED — with a cost]**

### 4.1 The generic lemma

Motions in $\mathfrak{h}_{\text{self}}$ cost calories and change nothing about the creature's standing. Training therefore prunes them. Möbius learns that translation along himself is wasted; Euclid learns that rotating in place is pointless. **This is generic:** the uselessness of $\mathfrak{h}_{\text{self}}$ partitions the Lie algebra into useful and useless, handing each creature the tangent space of its own $G/H$ for free.

This is a clean standalone result and probably deserves its own sentence in the paper.

### 4.2 The world-frame cost

Under left multiplication the useless subspace is **not fixed**. Computing: $\xi$ leaves $g_{\text{self}} H_{\text{self}}$ fixed iff $g_{\text{self}}^{-1} \exp(\xi) g_{\text{self}} \in H_{\text{self}}$, i.e. iff

$$ \xi \in \mathrm{Ad}_{g_{\text{self}}} \mathfrak{h}_{\text{self}} $$

which **rotates as the creature moves.** The creature is handed the tangent *bundle* $T(G/H_{\text{self}})$, with the useful/useless split varying point-to-point in the fixed basis.

*Worked example (Euclid):* at the origin his free direction is pure $\omega$. At position $p$, rotation about $p$ has generator $\dot{x} = \omega J(x - p) = \omega J x - \omega J p$ — i.e. $\omega$ plus a translation perpendicular to $p$ with magnitude scaling as $\omega|p|$.

### 4.3 Why this is actually a gift to Part 2

The position-dependence converts a static fact into a probe target: *"does the creature know which of its current motions are wasted?"* The answer being a smooth field over $G/H_{\text{self}}$ is itself a signature of having internalized the right manifold. This is arguably a **better** interpretability handle than the fixed-subspace version would have been.

---

## 5. Observation space

### 5.1 Self–object invariants only **[SETTLED]**

Inputs are **self–object** relations only. Object–object relations are excluded.

*(An earlier proposal to include the full pairwise invariant matrix was rejected in favor of memory — see §6.)*

### 5.2 The invariants, by pairing

| Pairing | Invariant content |
|---|---|
| point–point | one distance |
| point–line | one perpendicular distance |
| line–line | parallel-bit; **if parallel**: perpendicular gap $r$; **if crossing**: angle |

### 5.3 Perceptual asymmetries worth tracking

- **Möbius perceives a point** only by perpendicular distance. Where along himself the point sits is destroyed by the along-self translations in $H_L$.
- **Möbius perceives a crossing line** by angle *alone* — the crossing point along him is slid away by $H_L$. His information about non-parallel lines is genuinely **lower-rank** than Euclid's about points.
- **Side/sign is unobservable to Möbius** because of the $\mathbb{Z}_2$ flip in $H_L$ — hence unsigned distances and a genuine perceptual **fold** when a point crosses him.
- **Triangulation is still available.** Möbius sees lines as well as points, and parallel-bit + angle + distance is, over a trajectory, sufficient to localize everything. But the thin-perception risk below must be controlled for.

**[OPEN — control needed]** Thin perception could masquerade as failed map-formation. If Möbius produces a worse map, we must be able to distinguish "his form doesn't support a map" from "his sensor carries less information per timestep." Needs an explicit control (e.g. information-matched conditions, or longer trajectories for Möbius).

---

## 6. Why memory is forced **[SETTLED]**

Self–object invariants alone **underdetermine the scene.** Euclid sees a list of ranges with no bearings; distances to $N$ objects do not fix the configuration. A *memoryless* feedforward policy therefore cannot forage above trivial distance-descent — there is nothing to descend on.

Adding memory fixes this, and does so in a way that **sharpens rather than complicates** the experiment:

> Because object–object relations are excluded from the input, the spatial representation **cannot be recomputed per forward pass.** It must be integrated into the recurrent state across the trajectory.

Three consequences:

1. **The map has nowhere to hide.** It must live in the recurrent state, which is exactly where Part 2 will probe.
2. **The conjecture sharpens to:** *the recurrent state organizes as $G/H_{\text{self}}$.*
3. **It is deeply Helmholtzian.** Euclid acquires bearings only by moving and watching ranges change — space is constituted through motor activity. This is the sign-theory point of the paper's §2.1, instantiated. **Worth a sentence in the paper.**

Memory also dissolves the "equivariance deadlock" raised earlier (a deterministic map from invariant inputs to a body-frame action is incoherent for a creature with a nontrivial stabilizer): the creature bootstraps the missing frame from its own action–observation history. No output-space engineering required.

---

## 7. Architecture

### 7.1 Hard constraint **[SETTLED]**

**Identical output space, identical architecture, identical training across creature types. The *only* difference is $H_{\text{self}}$.** This is the cleanest experimental design and is non-negotiable — it is what licenses attributing any representational difference to the stabilizer.

The output side is automatically free of cardinality issues: one Lie algebra vector, $\dim 3$, regardless of scene size.

### 7.2 Variable cardinality and mixed types **[PROPOSED]**

Requirement: the same "brain" must handle seven objects or twenty, of mixed types. The binding constraint is **permutation invariance** — any imposed ordering smuggles in structure.

Proposed shape:

1. **Type-specific encoders.** $\phi_{\text{point}}$ on the single distance; $\phi_{\text{line}}$ on the parallel-bit/angle/distance bundle. Both emit into one shared embedding space. Append visited-bit and type tag.
2. **Permutation-invariant pool** via attention with the **recurrent state as query** (rather than sum/mean). This weights objects by what the creature currently knows and wants, handles any cardinality, and yields attention weights as a Part 2 instrument.
3. **Recurrent core** taking pooled vector + previous hidden state → (new hidden state, action).
4. **Action head** → 3-vector in $\mathfrak{e}(2)$.

### 7.3 The methodological bet: thin encoder, rich recurrence **[SETTLED in principle]**

**Keep the encoder relationally blind — no inter-object attention in the encoder.** Each object is encoded from its own self-relative invariants alone.

*Rationale:* the only place object information can fuse into a global spatial picture must be the recurrent state. If a set-transformer does inter-object attention in the encoder, spatial structure can crystallize *there* instead, muddying Part 2. This mirrors Othello-GPT, where the board was forced into the residual stream.

*Note:* self-relative-only inputs (§5.1) make this honest for free — there are no object–object invariants in the input for an encoder to attend over. The encoder physically *cannot* do the spatial integration.

### 7.4 What the recurrent state must hold

At least three things, which Part 2 will have to disentangle:

1. **Map info** — where the objects are
2. **Self-localization** — enough to compute $\mathrm{Ad}_{g}\mathfrak{h}_{\text{self}}$, i.e. which current motions are wasted
3. **Plan / value info** — the foraging order

**[PROPOSED]** Recurrent width should be generous enough that these are not forced to share neurons; over-tight width produces entanglement that is miserable to read in Part 2.

---

## 8. Training

### 8.1 Chosen approach **[SETTLED]**

**Differentiable rollout (option b):** backpropagate total calories-minus-score through the whole trajectory (BPTT through a differentiable environment).

Alternatives considered:
- **(a) Imitation / behavior cloning** from a classical planner solving instances in coordinates (experimenter may use a chart; creature never sees it). **[REJECTED for now]**, held in reserve.
- **(c) Evolution strategies.** **[HELD IN RESERVE]** — gradient-free, tolerant of every discontinuity exactly, and conveniently matched to the paper's evolutionary framing. See §8.3.

### 8.2 Discontinuities and gradient handling

Differentiable rollout requires usable gradients, but **the forward dynamics need not be smoothed** — only the backward pass needs surrogates.

| Channel | Issue | Handling |
|---|---|---|
| distances | kink at zero | $\sqrt{d^2 + \epsilon}$ |
| unsigned-distance folds (point crossing a line — a genuine perceptual fold for Möbius, since $H_L$'s flip makes side unobservable) | non-differentiable at the fold | same $\epsilon$-smoothing |
| parallel-bit | discrete | sigmoid surrogate on backward pass |
| visiting event | discrete | soft-min over closest approach |
| visited flag | discrete gate | saturating proximity accumulator |

**Recommended mechanism:** straight-through / surrogate-gradient estimation. Forward pass uses the true (possibly discontinuous) quantity, so the environment the creature actually experiences stays faithful; backward pass substitutes the smooth surrogate. Standard practice for training through discrete ops, and it avoids fictionalizing the dynamics.

**Fixed-width line encoding** so $\phi_{\text{line}}$ always sees the same shape:
`[parallel-bit, angle (0 if parallel), r (0 if crossing)]`

### 8.3 The line–line problem is *fundamental*, not a technicality

Worth stating precisely, because no amount of engineering removes it:

- For **crossing** lines the sole invariant is the angle.
- For **parallel** lines the sole invariant is the perpendicular gap $r$.
- As the object line rotates toward parallel, the angle slides smoothly to zero — but $r$ **does not exist** for any nonzero angle and springs into being only at the limit.

**Information is created at the parallel locus.** A single smooth function is therefore necessarily either unfaithful or discontinuous. You cannot have both.

**[OPEN — contingency]** If line–line surrogate gradients misbehave (the created-information limit can make them genuinely unhelpful, not merely biased), fall back to an **evolution-strategies outer loop** for that channel or globally. Plan: start with BPTT + surrogates; hold ES in reserve.

**[PROPOSED]** Implement the environment in JAX so the whole rollout is a clean differentiable function.

---

## 9. Rejected alternatives (recorded so they aren't re-litigated)

### 9.1 Object-referenced action outputs **[REJECTED]**

Proposal was: network outputs invariant per-object weights $w_i$; environment realizes the motion as cost-norm-steepest-descent of $\sum_i w_i d_i$, projected to $\mathfrak{g}/\mathfrak{h}_{\text{self}}$.

*Rejected because* the output space must be **identical across creature types** (§7.1). Also unnecessary: it was solving the equivariance deadlock, which memory already solves (§6).

### 9.2 Full pairwise invariant matrix as input **[REJECTED]**

Proposal was to add object–object double cosets to fix scene underdetermination.

*Rejected in favor of memory* (§6). The rejection turns out to be a net gain: excluding object–object relations is what forces the map into the recurrent state where it can be probed.

### 9.3 Design B: egocentric with a hidden navel **[HELD IN RESERVE]**

An alternative, coherent design:
- Creature secretly carries a full pose $g \in G$
- Moves egocentrically by **right** multiplication (clean adjacency in the double coset; fixed useless-subspace $\mathfrak{h}_{\text{self}}$, no $\mathrm{Ad}$ twisting)
- Still receives only frameless invariants as input
- The navel is **unobservable gauge** — it never touches the reward

Under Design B the conjecture becomes: *the learned representation discards the unobservable navel and reorganizes as $G/H_{\text{self}}$.* This is arguably **closer to the Othello-GPT setup**, where the board genuinely exists and the network must recover it.

**Current commitment is Design A** (frameless, world frame, left multiplication), matching the stated picture. Revisit Design B only if the fixed useless-subspace turns out to matter for Part 2 tractability.

---

## 10. Open items blocking implementation

### 10.1 Visiting predicates **[OPEN — blocks running]**

What does it *mean* for Möbius to visit a line-object? Two points visiting is "get close." A line visiting a line is ambiguous: **crossing lines always touch; parallel lines never do.**

A $G$-invariant visiting predicate is needed for each (self-type, object-type) pairing. This is **constitution-laden** like the cost norm, and it materially fixes what the optimal map even is. Decide deliberately rather than letting a default decide it.

### 10.2 Cost norm **[OPEN]**

A norm on $\mathfrak{e}(2)$. The relative weighting of rotation vs. translation is a free parameter that shapes which motions are cheap and hence what geometry gets "felt." Should be swept. Constitution-laden (paper's footnote hedge 1).

### 10.3 Reward shape **[OPEN]**

TSP-like scoring; exact shaping undecided. Interacts with §10.1 and with the soft-visiting surrogate.

### 10.4 Recurrent core specifics **[OPEN]**

Widths, cell type, how the action head reads off the Lie algebra vector, depth of encoders.

### 10.5 Episode generation **[PROPOSED, unratified]**

Random constellations, randomized starts, mixed types and cardinalities, enough diversity that memorization is impossible and a genuine map is the cheapest solution.

### 10.6 Null and contrast hypotheses **[OPEN — important]**

What would failure look like? Candidates:
- Both creatures learn the *same* representation
- Both learn the cylinder of oriented lines (note: the paper's §4 rules this out as a legitimate *form* via the surplus-structure condition, but nothing stops a network from learning it)
- A task-specific value landscape with no clean geometry at all

**Designing so failure is detectable is what makes this a test rather than a demo.**

### 10.7 The constitution ablation **[OPEN — possibly the most valuable result]**

The paper's footnote already concedes that the cost norm and visiting relation are constitution-laden. **Turn the hedge into an experiment:** vary the norm and the visiting predicate, and check whether the learned topology tracks

- the **stabilizer** (the self-quotient hypothesis), or
- the **cost/visiting structure** (the deflationary alternative).

If topology tracks the stabilizer across a range of norms, the hedge is substantially defanged. This may be the most philosophically valuable output of the whole experiment.

### 10.8 Formal write-up of the observation space **[OPEN — do before code]**

Work out the full invariant list for all four (self-type, object-type) pairings explicitly, and **verify nothing in the encoding smuggles in a coordinate chart or orientation convention.** This is the experiment's load-bearing wall.

---

## 11. Part 2 preview (interpretability) — sketched, not yet designed

Recorded here for continuity; to be worked out separately.

**Target:** the recurrent state. Must first disentangle map info / self-localization / plan info (§7.4).

**Tier 1 — geometry-free structure recovery.** Take hidden states across many situations, compute similarity/metric structure, ask what manifold it is:
- **Persistent homology.** The Möbius strip's non-orientability and $\mathbb{Z}_2$ loop structure give a sharp, falsifiable topological signature; Euclid's should look planar/contractible. This is a real advantage over vaguer "it learned a map" claims.
- Intrinsic dimensionality estimates
- Isometry tests

**Tier 2 — probing.** Linear probes from hidden states to ground-truth quantities *in each candidate chart* (plane coordinates vs. strip coordinates $(\theta, r)$ with the twist identification). The conjecture predicts an **asymmetry**: each creature's states more linearly decodable in its own self-quotient chart.
- *Caution:* the two charts are related by a smooth-ish correspondence, so controls are essential — nonlinear probe baselines, probe-capacity matching — or the asymmetry claim is weak.

**Tier 3 — causal intervention.** The Othello-GPT gold standard: edit the represented map (move an object in the decoded representation), check subsequent behavior follows the edit. This upgrades "correlated with a map" to "uses a map."

**Additional instruments available:**
- The $\mathrm{Ad}_{g}\mathfrak{h}_{\text{self}}$ field probe (§4.3): does the creature know which of its *current* motions are wasted? A smooth correct field over $G/H_{\text{self}}$ is strong evidence of internalized manifold structure.
- Attention weights from the pooling layer (§7.2): is it attending to the nearest unvisited object? Do attention patterns carry spatial structure?

---

## 12. Constitution-laden choices — running ledger

The paper's footnote concedes two. The design has surfaced more. Full list to date:

1. **The cost norm** on $\mathfrak{e}(2)$ — including rotation/translation weighting *(paper's hedge)*
2. **The visiting relation**, per type-pairing *(paper's hedge)*
3. **The shared external origin** implicit in the fixed Lie algebra basis — gauge, not navel, but still a choice
4. **Discrete time step size** — matters because finite motions compose differently from infinitesimal ones
5. **Sensor completeness** — what invariants are actually delivered, vs. which are available in principle
6. **Episode length / horizon** — bounds how much triangulation is possible, and bites Möbius harder (§5.3)

Recommendation: report this ledger explicitly in the write-up. The honesty is cheap and the §10.7 ablation converts several of these from liabilities into results.

---

## 13. The sharpened conjecture

> Trained under identical architecture and identical objective, differing only in $H_{\text{self}}$, and fed only form-neutral $G$-invariant self–object standings: the **recurrent state** of an $H_P$-creature will organize as $\mathbb{R}^2$, and the recurrent state of an $H_L$-creature will organize as $\mathbb{M}$ — each precipitating the topology of its own self-quotient, with the non-orientability of $\mathbb{M}$ furnishing a sharp topological discriminator.

---

## 14. Immediate next steps

1. **Fix the visiting predicates** (§10.1) — blocking
2. **Formalize the observation space** for all four pairings and audit for smuggled structure (§10.8)
3. **Spec the recurrent core**: widths, cell, action head (§10.4)
4. **Fix the cost norm** family and the sweep range (§10.2)
5. Then: reward shaping, episode generator, JAX environment with surrogate gradients
