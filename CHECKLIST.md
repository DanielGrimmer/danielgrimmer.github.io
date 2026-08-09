# Migration checklist

Everything outstanding, uncertain, or decided-on-your-behalf during the migration
from `users.ox.ac.uk/~pemb6003/`. Tick items off and delete this file when it's
empty.

---

## A. Blocked on files I don't have

- [ ] **A1. The two photos.** You sent them and I can see them, but they never
      reached the container's filesystem — only the HTML files did. Both photo
      slots are still grey placeholders. Please re-send, or commit them yourself
      as `assets/img/prof_pic.jpg` (headshot → homepage) and
      `assets/img/DGrimmer2.jpg` (Oxford sub fusc → `/about/` page).
- [ ] **A2. `CVGrimmer.pdf`** → `assets/pdf/`, then uncomment `cv_pdf` in
      `_data/socials.yml` to restore the old site's "Long CV" link.
- [ ] **A3. Four talk slide decks** → `assets/pdf/talks/`. These links are live on
      the talks page and **404 today**:
      `PragmaticQFTMeasurementProblemPopGrunch.pdf`,
      `TheUnruhEffectInSlowMotion.pdf`,
      `DiscreteGeneralCovariancePopGrunch.pdf`,
      `DiscreteGeneralCovarianceBarrioRQI.pdf`.
- [ ] **A4. Escher Chess and Soccer Hockey Duality demos** — not yet ported; both
      were in the old nav.

## B. Facts to confirm

Anything here I either took verbatim from the old site (so it's only as current
as that site was) or inferred.

- [ ] **B1. Job title.** "Postdoctoral Researcher in Philosophy, Yale University",
      taken verbatim from the old site. Still correct?
- [ ] **B2. Contact block.** The old site gave *no* postal address. I wrote
      "Department of Philosophy / Yale University" under your photo. Replace with
      the real address or cut it.
- [ ] **B3. Email.** See §D2 — there's a decision attached.
- [ ] **B4. Every date in `_data/cv.yml` is inferred, not sourced.** The old site
      listed no dates for any position. I reconstructed:
      Yale 2025–present (first Yale teaching was Fall 2025); Bonn 2024–2025 (you
      gave a Bonn seminar Nov 2024); DPhil ending 2024 (defended Aug 2024);
      Waterloo PhD ending 2020 (thesis year). MSt and Barrio RQI are blank.
      **This is why `/cv/` is hidden from the nav** — flip `nav: true` in
      `_pages/cv.md` once checked.
- [ ] **B5. Undergraduate degree is missing entirely.** It wasn't on the old site
      either, so I didn't invent one. Add it to `_data/cv.yml` if you want it.
- [ ] **B6. Awards.** I listed the Clarendon Scholarship and the Hertz
      Postdoctoral Fellowship, both without dates. Anything else belong there?
- [ ] **B7. Google Scholar ID** `-R31VGwAAAAJ` — taken from a public profile, not
      from your files. Confirm it's yours.
- [ ] **B8. "ECJ"** on the old site — I expanded it to *Evolutionary Computation
      Journal*. Correct?
- [ ] **B9. DPhil thesis title.** Recorded as "Searching for New Spacetimes:
      Towards a Dynamics-First View of Topology" per the old papers page. Some
      talk titles use "In Search of New Spacetimes" — confirm which is the thesis.

## C. Problems in the old site's source

Found while migrating. Each needs a decision from you.

- [ ] **C1. A block of papers is commented out of `papers.html`** and therefore
      appears nowhere on the site: "A Discrete Analog of General Covariance"
      (arXiv 2204.02276 / 2205.07701), "From Humean Laws to a Neo-Kantian
      Spacetime" (2308.14146), "Spacetime Representation Theory" (2306.08110),
      and "Connecting Grit and Peer Disagreement". **Two of these are still linked
      from your homepage research interests.** I mirrored the rendered output and
      left them out, but this looks like it may have been accidental when the
      under-review section was rewritten. Want them added?
- [ ] **C2. Contradictory video link.** For the Pragmatic QFT paper, `index.html`
      and `papers.html` point at different YouTube videos — and the one in
      `papers.html` is the Unruh paper's video. I kept the `index.html` link
      (`T2Xv6EYnrGE`).
- [ ] **C3. Two arXiv links were unfilled placeholders** on the old site: a bare
      `#` for "Direct From Darwin" and the literal string
      `YOUR_UNIT1_ARXIV_LINK` for "Equivalence and determinism". Both are omitted
      from the .bib with a TODO.
- [ ] **C4. A GitHub link was wrapped in a Google search URL.** On `papers.html`
      the adam-dls repo link was
      `google.com/search?q=https://github.com/DanielGrimmer/adam-dls`. I used the
      direct repo URL from `index.html` instead.
- [ ] **C5. "Surrey Summer School, South Hampton, UK"** — Surrey and Southampton
      are different places, and it's normally spelled "Southampton". Left exactly
      as written; correct it if you know which is right.
- [ ] **C6. Duplicate entry.** "National University of Singapore, March 2019"
      appears under both *Past Talks* and *Past Research Visits*. Both kept.

**Typos I corrected without asking** (say if you'd rather I hadn't):
"Digital Ethics Cneter" → Center · "Santa Barabara" → Santa Barbara ·
"Universal Grammer" → Grammar · "cognitive factulties" → faculties ·
"In aide of" → in aid of · "Quebec City QB" → QC (twice; QB isn't a province
code) · "beginning with a Physics (Ph.D.)" → "beginning with Physics (Ph.D.)".

## D. Decisions I made for you

All easily reversed. Flagging them so none is a surprise.

- [ ] **D1. Accent colour.** Changed from al-folio's magenta/teal to your old
      site's `#002147` navy (with a lighter tint in dark mode, where navy on
      near-black is unreadable). **Revert: delete `assets/css/main.scss`.**
- [ ] **D2. Your email is published in plain text.** The old site wrote
      "daniel.grimmer(at)yale.edu" to dodge scrapers. I enabled al-folio's
      `protect_email`, but it does **not** cover the social-icon row or the block
      under your photo, so the address is exposed there regardless. Either accept
      it (normal for academic sites, and the mailto link is genuinely useful) or
      say so and I'll write it in the `(at)` form and drop the envelope icon.
- [ ] **D3. Long author lists collapse.** `max_author_limit: 3` in `_config.yml`
      shows "and 2 more authors" with a click to expand. Your old site listed
      every author in full. Set it blank to always show all.
- [ ] **D4. Pages hidden from the nav:** `/cv/` (see B4) and the blog. Both build
      and are reachable by URL.
- [ ] **D5. Homepage news feed disabled** — the old site had no news section.
      Enable in `_pages/about.md` if you want one; items live in `_news/`.
- [ ] **D6. Altmetric and Dimensions badges off.** They key on DOIs, so they show
      nothing for preprints while calling third-party servers on every page view.
      Worth turning back on now that most of your work has DOIs.
- [ ] **D7. Journal badge colours and labels are invented** (`_data/venues.yml`),
      including the "Preprint" and "Thesis" labels, which have no counterpart on
      the old site.
- [ ] **D8. Favicon is ⚛️.** Fitted the old spacetime focus; may not fit the
      current AI/evolutionary-epistemology one. `icon:` in `_config.yml`.
- [ ] **D9. Blog is named "notes"** with a physics-only description. If you ever
      enable it, update `blog_name` / `blog_description`.
- [ ] **D10. Site description and keywords rewritten** around evolutionary
      epistemology, since that now leads your homepage.
- [ ] **D11. Selected papers on the homepage** are the same four as the old site.
      Controlled by `selected = {true}` in the .bib.

## E. Optional improvements

- [ ] **E1. Ask Oxford IT to leave a redirect** at `users.ox.ac.uk/~pemb6003/`.
      That's the URL people have cited and bookmarked, and it's the one thing here
      neither of us can fix from this repo.
- [ ] **E2. Enable link previews.** `serve_og_meta` and `serve_schema_org` are
      off; turning them on (plus `og_image`, once there's a real photo) gives
      proper cards when the site is shared on Bluesky/Slack/etc.
- [ ] **E3. Add ORCID and PhilPeople** to `_data/socials.yml` — neither was on the
      old site.
- [ ] **E4. Redirect stubs** for old paths (`/papers.html` → `/publications/`) if
      you ever host on a domain where those URLs existed.

## F. Verified working

- Pages source set to GitHub Actions ✅ (you did this)
- Site builds clean; 9 pages generated
- All 20 publications migrated — matches the old site's own counts of 3 under
  review and 17 published/theses
- No broken internal links except the four slide PDFs in A3
- Light mode, dark mode and mobile all check out
- Accented names render correctly (Martín-Martínez, Polo-Gómez, São Carlos)

**Not yet live:** this work is on `claude/academic-site-migration-plan-5yq7ob`.
It publishes when merged to `main`.
