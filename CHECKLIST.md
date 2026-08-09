# Migration checklist

What's outstanding, and what was decided on your behalf, migrating from
`users.ox.ac.uk/~pemb6003/`. Delete this file once it's empty.

Section B is the CV reconciliation (2026-08) — read that first.

---

## A. Still needed

Nothing. Every asset from the old site is in place.

## B. CV reconciliation — decisions for you

The CV resolved every open fact. It also disagreed with the old site in places.
Where the CV was simply newer or fuller, it was adopted. These need your call.

- [x] ~~**B1. Teaching year conflict.**~~ Resolved: the teaching arrangement
      record reads `Hilary|2022/2023`, and Hilary falls in the spring half of
      that academic year, so it is **Hilary Term 2023**. The site now says 2023.
      **Your CV has this as HT 2022 and is a year out — worth fixing there.**
- [x] ~~**B2. Two talk titles changed to match the CV.**~~ Surrey confirmed: the
      talk was about laws of nature, so the CV title is right. Bonn adopted from
      the CV on the same basis.
      - Surrey Summer School, July 2024 — old site *"Deflating Spacetime: A
        Dynamics-First View of Topology"* → CV *"What Are the Laws of Nature? And
        What Do They Do?"*
      - Bonn seminar, Nov 2024 — old site *"…Towards a Dynamics-First View of
        Topology"* → CV *"…The ISE Method of Topological Redescription"*
- [ ] **B3. One talk title left as the old site had it.** Braga, Sept 2023: the
      CV shortens it to *"From Humean Laws to a Kantian Spacetime"*, the old site
      had *"From Humean Laws to a Neo-Kantian Spacetime: A Dynamics-First View of
      Topology"*, which matches the preprint title. Kept the longer one.
- [ ] **B4. Yale course titles differ between the two sources.** The site keeps
      the old site's catalogue titles and course codes, which the CV lacks:
      site *"Ethics and Epistemology of Artificial Intelligence: Knowing Machine
      Morals (PHIL 2340)"* vs CV *"AI Epistemology and Ethics: Knowing Machine
      Morals"*; site *"Philosophy of Physics: Space, Time, Quantum (PHIL 3333)"*
      vs CV *"Philosophy of Physics"*. Say which you'd rather show.
- [x] ~~**B5. Preprint-only work is hidden.**~~ Done: `/publications/` now has a
      third section, **Unpublished preprints**, holding all five from the CV —
      including *Introducing the ISE Methodology* (arXiv:2303.04130), which was
      on neither the old site nor my earlier list. They live in
      `_bibliography/preprints.bib`.
- [ ] **B6. "Das Neue Raumproblem"** is on the CV under *In Preparation*. Not
      added to the site — in-preparation work is a taste call. It's in
      `_bibliography/parked.bib` ready to move into `papers.bib`.
- [ ] **B7. The CV's own header still points at the old Oxford URL.** Worth
      updating to `danielgrimmer.github.io` in the next revision of the PDF.
- [ ] **B8. `Connecting Grit and Peer Disagreement`** appears nowhere on the
      2026 CV, so it looks abandoned rather than merely unpublished. It is parked
      in `_bibliography/parked.bib`, which nothing renders. Delete it if that's
      right.
- [ ] **B9. Selected publications on the homepage** are still the old site's
      four. The newly accepted Erkenntnis paper is arguably a better pick than a
      preprint — change with `selected = {true}` in `papers.bib`.
- [x] ~~**B10. References section.**~~ Confirmed: stays off. It lists five
      people's personal emails, phone numbers and postal addresses.

## C. Applied from the CV

No action needed — recorded so you can spot anything wrong.

- Job title corrected everywhere: **Postdoctoral Researcher → Postdoctoral
  Associate** in Philosophy.
- Publications now **2 under review + 18 peer-reviewed**, matching the CV's own
  counts. Specifically:
  - *Equivalence and Determinism* moved from under-review to **accepted at
    Erkenntnis** (July 2026, in production), with the PhilSci:29119 preprint.
  - The Synthese paper was **retitled** — it is now *Innateness In Silico at
    Scale: How Evolutionary Meta-Learning Repositions Neural Networks within the
    Nativism–Empiricism Debate*, and is marked **revise and resubmit**.
  - *Direct From Darwin* now carries arXiv:2605.05284, and its venue is
    *Evolutionary Computation* (not "…Journal", as previously guessed from "ECJ").
- Volume, issue, page and month added to every journal entry.
- Şebnem Güneş Soyler's name now carries its correct diacritics.
- ORCID `0000-0002-8449-3775` added; the CV PDF is live at
  `/assets/pdf/CV_Grimmer.pdf` and linked from the profile icons.
- `/cv/` is **no longer hidden** — it now carries sourced dates, both Oklahoma
  degrees, funding, service and governance, and journal refereeing.
- Two Oxford tutorials the old site omitted were added: *Philosophy of Time* at
  Pembroke (OxNet Outreach, TT 2023) and at Oriel (Academic Taster, HT 2022).
  Waterloo TA course list added.
- Two 2026 talks added from the CV: BSPS Leeds (July) and Foundations of Physics
  at UC Irvine (June).
- **The "Upcoming" talks section was removed.** The Hausdorff talk it advertised
  was May 2026 and is now in the past; it has moved into the main list. Re-add
  the heading when the next talk is booked.

## D. Standing decisions

- **Accent colour** is your `#002147` navy. Revert by deleting
  `assets/css/main.scss`.
- **Email is never a `mailto:`** — it reads "daniel.grimmer (at) yale.edu", and
  `_data/socials.yml` has no `email:` key, so nothing scrapeable is emitted.
- **All authors always shown** (`max_author_limit` blank).
- **Altmetric and Dimensions badges on**; entries without a DOI render none.
- **Favicon is ⚛️**, which fitted the old spacetime focus more than the current
  AI one. `icon:` in `_config.yml`.
- **Blog hidden** from the nav; no posts.
- **Journal badge colours** in `_data/venues.yml` are invented.

## E. The two games

- [ ] **E1. Check the Firestore Security Rules.** The API key in
      `assets/SoccerHockey/firebaseConfig.js` is *not* a leak — Firebase web keys
      are meant to be public, and access is controlled by Security Rules. But
      that means the rules are the only thing guarding the database, and this is
      now published from a public repo. Confirm rules still disallow *creating*
      documents, and that the project is still active: "test mode" rules expire
      after 30 days and then deny everything, which would explain a stale back end.
      **Escher Chess shares the same Firebase project**, so this covers both games.
- [ ] **E2. Rooms are unauthenticated** — ten fixed names, no login, so anyone
      can join a room and move pieces in someone else's game.
- [ ] **E3. Optionally restrict the API key** to referrer
      `danielgrimmer.github.io/*` in the Google Cloud console.
- [ ] **E4. The demos and games keep their own styling** and don't inherit the
      site theme, as on the old site.
- [ ] **E5. Gameplay is untested.** Both bundles load with no JavaScript errors
      and all their assets resolve, but every dynamic field stays on "Loading…"
      here because this build environment cannot reach Firebase. Play a real
      two-browser game once the site is live before trusting either.

## F. Optional

- [ ] **F1. Ask Oxford IT to leave a redirect** at `users.ox.ac.uk/~pemb6003/` —
      the URL people have cited. It is still live and still serving your talk PDFs.
- [ ] **F2. Enable link previews** — `serve_og_meta`, `serve_schema_org` and
      `og_image` are off.
- [ ] **F3. Add PhilPeople** to `_data/socials.yml`.

## G. Verified

- Builds with zero warnings and zero errors; 11 pages
- Publications: 2 + 18 + 5, matching the CV exactly
- No broken internal links; no plain-text email anywhere in the output
- CV page renders all seven sections with real data
- Light mode, dark mode and mobile all check out
- Both game bundles survive the build with ES module imports intact
- Publications page renders three sections: 2 under review, 18 peer-reviewed,
  5 unpublished preprints
- The two games sit under a `games` dropdown so the navbar stays at seven items

**Not yet live:** this work is on `claude/academic-site-migration-plan-5yq7ob`.
It publishes when merged to `main`.
