# Parallax — the Möbius–Euclid game

A cooperative 3D puzzle platformer in which two players inhabit one world
through two topologically different representations of it. Euclid walks the
plane and sees himself as a point; Möbius walks the (unrolled) Möbius strip
and sees *himself* as a point. Each perceives the other as an extended object
— Euclid sees Möbius as an infinite line sweeping the plane, Möbius sees
Euclid as a cosine-shaped section winding the strip. Neither is wrong, and
the game only yields to players who take each other's descriptions seriously.

Working title **Parallax**; the duality is the Möbius–Euclid duality. The
elevator pitch is in `Parallax Game Pitch (2).pdf`: *Portal 2's co-op mode,
but about perspectives instead of portals.*

## The research this comes from

The duality was conceived around 2024 and first written up in the author's
DPhil thesis as the key worked example of the ISE Method of topological
redescription. Two papers in progress carry it now (drafts available from
the author; neither is published, and neither is in this repository):

- **"Spacetime Representation Theory: Setting the Scope of the ISE Method of
  Topological Redescription"** — the formal side. A theory about a point-like
  particle on a Möbius strip and a theory about a line-shaped particle on
  the Euclidean plane are kinematically isomorphic in a way that preserves
  dynamics: topological redescriptions of one pre-spacetime theory, in close
  analogy with group representation theory. The Möbius–Euclid duality is
  that paper's first worked example, the accessible cousin of AdS/CFT and
  T-duality.

- **"Das Neue Raumproblem: The Phenomenology of Spacetime Dualities and
  Evolutionary Epistemology"** — the philosophical side. It extends the
  classical Raumproblem one level deeper: not just the *geometry* of space
  but its topology, ontology, and **mereology** are underdetermined —
  whether lines are composite and points simple is a feature of a form of
  outer intuition, not of the world. The Parallax game is that paper's
  central thought experiment (§ "The Parallax Game"), the successor to
  Poincaré's disk world and Helmholtz's spherical creatures: it grants the
  duality *phenomenological salience* by exhibiting a creature for whom the
  Möbius description is simply how the world looks.

The game also plugs into the evolutionary-epistemology programme: the claim
is not merely that a Möbius phenomenology is conceivable but that a creature
could *evolve* it — Möbius's way of seeing is exactly as fit, as a guide to
this shared world, as Euclid's. There are planned numerical experiments to
bear this out (with a student): duality-based fitness environments, and
Othello-GPT-style probes of what spatial representation an agent trained on
the world's data actually learns. The engine here is a candidate harness for
those experiments — `index.html` exposes its canonical state and a `step`
function on `window.parallax`, so an agent can drive either character
headlessly.

## Where the code stands

In the order it was made:

| | |
|---|---|
| `MobiusEucilidV1.0–V1.4.html` (Feb 2025) | First vibe-coded 2D prototypes. The point–line incidence check — one number that is a distance for Euclid and a fiber-offset for Möbius — is present from V1.0. |
| `WorkSpace/` (Mar 2025) | An abandoned start on a networked first-person three.js version (same Firebase project as the other games). Euclid's view works; the Möbius renderer and all sync were never begun. |
| `MobiusEuclidGame.nb` (Sep 2025) | The recovered Mathematica notebook behind the pitch imagery — the closest thing the project has to a design document. It defines the world constants, the Radon/InverseRadon floor pipeline, a declarative object format (`D` cylinders, `L` walls, `E`/`M` players) rendered into **both** views by a pair of scene compilers, and the three levels as pure data. Kept here for reference; its functionality now lives in `floors.html`, `catalogue.html`, and `levels.html`. |
| `TitleSlide.png`, `MobiusEuclid3.jpeg`, the GIFs (Sep 2025) | The visual target, rendered **frame by frame in Mathematica** from the notebook — no engine behind them. These illustrate the pitch deck. |
| `index.html` (Aug 2026) | The first real engine: one three.js scene, two fields far apart, one camera each, ordinary platformer physics per field, and the Radon dictionary translating every object both ways. Level 1 is playable at one keyboard (Euclid WASD+Space, Möbius arrows+Enter) and ends on the punchline: *through any two points there passes exactly one line.* |
| `floors.html` (Aug 2026) | The Floor Studio: paint either floor and the other updates live through the GPU Radon transform (sinogram one way, back-projection the other). Replaces the Mathematica floor pipeline; exports game-sized floor textures. |
| `catalogue.html` (Aug 2026) | The object catalogue, rebuilt from memory of the Mathematica-era one (before `MobiusEuclidGame.nb` was found): a bare playing field with one of every shape — cylinder, block, wedge, point marker, strip block, strip wedge, and the two players — walkable at one keyboard, each object selectable and captioned in both frames. The mechanics sandbox for demos and the pitch. |
| `foraging.html` (Aug 2026) | The travelling-salesman demo, and the first thing here built from `THEORY.md` rather than from a picture: two 2D scenes side by side, Euclid walking the disk and Möbius walking the band of lines meeting it, each drawn live in both views. Flags come as points *and* lines, so each player sees flags of his own kind as points and the other's as curves; claiming takes everything you are incident with, which makes a concurrent family free. Euclid profits from proximity, Möbius from collinearity — the same board, scored two ways. Co-op (shared pool) by default, solo one click away. |
| `levels.html` (Aug 2026) | The notebook, ported: same world units (square arena of half-width 3π/(2√2), strip θ ∈ [π/2 ± 3π/2] shown as three tiles), same declarative level format (`makeD`, `makeL`), same three levels verbatim — Level 3 is the pitch-deck scene — with floor text flipped per tile parity, dual line/section bundles painted on both floors, and Möbius's 50 %-opacity ghost copies one period over. Both players walkable at one keyboard with collision against the level solids in each frame. |

three.js r128 is vendored in this folder (`three.r128.min.js`); every page
loads it locally and falls back to cdnjs, so the demos survive classroom
wifi. Known loose end: `floors.html` sets the strip scale `S = 3.4` while
`index.html` and `catalogue.html` use `S = 2.2`; the studio's header comment
("same world parameters as the game", 885-wide Möbius export) was written
for 2.2.

## Theory notes

`THEORY.md` — the Kleinian derivation of the game mechanics for the 2D
travelling-salesman demo (the Neue Raumproblem experiment). Works out both
players' calorie costs as quotient norms on `𝔢(2)`, proves that Möbius's world
admits no invariant metric and picks the gauge that repairs it, shows the disk
arena is self-dual, and derives the core mechanic — Euclid profits from flags
that cluster, Möbius from flags that line up. Written before building. Its
§13 reconciles the whole thing with the foraging notes below.

`foraging-experiment-design-notes.md` — earlier working notes (archived
verbatim) on the AI-side self-quotient foraging experiment: observation space,
architecture, training, the constitution-laden ledger, and the interpretability
plan. Authoritative on the agent side wherever it and `THEORY.md` overlap.

## Milestones

0. **~Three weeks out: the game-club pitch** (that was last year's timing).
   The pitch package is the playable `index.html`, the `catalogue.html`
   object zoo, and the Floor Studio — a live answer to last year's "too hard
   to start" objection.

1. **Mid-October (this term): classroom demo.** A good draft of the game to
   show students in the philosophy of physics course, as the live version of
   the Parallax thought experiment. The single-keyboard build is the right
   shape for a lecture hall; what it needs is a couple more levels, each
   making one dual phenomenon undeniable, and enough framing that the demo
   teaches rather than merely runs.

2. **The Yale undergraduate game development club.** Pitched last year
   (`Parallax Game Pitch (2).pdf`); the club develops two games a year and
   Parallax was voted third, so it missed the cut. Their stated reason: they
   work in Unity and have never built a 3D platformer, and jumping into one
   *with a duality on top* looked too hard. A possible re-pitch this year
   would need the project visibly de-risked — which is much of what
   `index.html` now does: the mathematics is solved, small, and portable.

3. **Far future: a real engine, and Steam.** Development happens in
   JavaScript because a Chromebook cannot run Unity, but the long-term
   intention is a port to Unity (or another engine) and eventually a Steam
   release. Consequence for how the JS is written: keep the dictionary — the
   section map, the band edges, the incidence test, the tiling parities — as
   plain math, cleanly separated from three.js, so the port is a rendering
   job rather than a rewrite.

## Game formats under consideration

- **Portal-2-style co-op puzzles** — the current direction, and the pitch
  deck's. Two players, separate screens, asymmetric information; puzzles
  force communication across the mereological gap (one player's platform is
  the other's family of lines; one player jumps on the other to use them as
  a bridge).

- **Splatoon-style territory painting** — a live alternative opened up by
  the Floor Studio: both players run around painting in their own frames,
  and every stroke lands in the other's world as its Radon dual. A dab from
  Möbius is a stripe across Euclid's arena; Euclid's scribble is a sine
  bundle on the strip. Coverage scoring across two frames that disagree
  about area is an open (and philosophically on-message) design question.

## Relation to the rest of this site

The build order is settled: single-computer versions first (no backend at
all), then a Firebase backend like the other games' so two strangers'
screens can disagree mysteriously — but demos for third parties show both
panels at once, which is this duality's equivalent of the other games'
reveal screen. Mechanics before levels: the catalogue is the bare field to
walk people around in; level design comes when the mechanics have proven
themselves.

Soccer Hockey and Escher Chess are turn-based: the duality is hidden during
play and revealed afterwards. Parallax is the inverse — the duality is on
screen the whole time, continuous and live, and the "firewall" is not a rule
but a fact: you *cannot* see what your partner sees, so you must talk. When
this joins the games dropdown it will want its own framing rather than the
firewall/reveal structure the other two share. Nothing on the site links
here yet.
