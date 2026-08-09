# Migration checklist

Everything outstanding, uncertain, or decided-on-your-behalf during the migration
from `users.ox.ac.uk/~pemb6003/`. Tick items off and delete this file when it's
empty.

---

## A. Still needed

- [ ] **A1. `CVGrimmer.pdf`** → `assets/pdf/`, then uncomment `cv_pdf` in
      `_data/socials.yml` to restore the old site's "Long CV" link.
- [ ] **A2. Escher Chess** — not yet ported; it was in the old nav.

## B. Facts awaiting the CV

You've said these resolve once the updated CV lands. Recorded here so they don't
get lost in chat scrollback.

- [ ] **B1. Job title** — "Postdoctoral Researcher in Philosophy, Yale
      University", taken verbatim from the old site.
- [ ] **B2. Contact block.** The old site gave *no* postal address. The homepage
      currently says "Department of Philosophy / Yale University" — my invention.
      Replace with the real address or cut it.
- [ ] **B3. Every date in `_data/cv.yml` is inferred, not sourced.** The old site
      listed no dates for any position. Reconstructed as: Yale 2025–present
      (first Yale teaching was Fall 2025); Bonn 2024–2025 (Bonn seminar talk
      Nov 2024); DPhil ending 2024 (defended Aug 2024); Waterloo PhD ending 2020
      (thesis year). MSt and Barrio RQI are blank.
      **This is why `/cv/` is hidden from the nav** — set `nav: true` in
      `_pages/cv.md` once checked.
- [ ] **B4. No undergraduate degree** anywhere. It wasn't on the old site either,
      so none was invented.
- [ ] **B5. Awards** — only the Clarendon Scholarship and Hertz Postdoctoral
      Fellowship are listed, both undated.
- [ ] **B6. Google Scholar ID** `-R31VGwAAAAJ` — taken from a public profile, not
      from your files.
- [ ] **B7. "ECJ"** expanded to *Evolutionary Computation Journal*.
- [ ] **B8. DPhil thesis title** recorded as "Searching for New Spacetimes:
      Towards a Dynamics-First View of Topology". Some talk titles say "In Search
      of New Spacetimes".

## C. Open content items

- [ ] **C1. Two arXiv links are still missing** — both were already unfilled
      placeholders on the old site, so there was nothing to migrate:

      | Paper | Old site markup | Where |
      |---|---|---|
      | Direct From Darwin | `<a href="#">(arXiv)</a>` | `papers.html` line 157, and `index.html` line 124 (with `onclick="return false;"`) |
      | Equivalence and determinism | `<a href="YOUR_UNIT1_ARXIV_LINK">(arXiv)</a>` | `papers.html` line 172 |

      Add `arxiv = {XXXX.XXXXX}` to the matching entries in
      `_bibliography/papers.bib` when the preprints are posted. Both entries carry
      a TODO comment.

## D. Decisions on record

- **D1. Accent colour** is your old `#002147` navy (lighter tint in dark mode),
  not al-folio's magenta. Revert by deleting `assets/css/main.scss`. ✔ confirmed
- **D2. Email is not a `mailto:` link anywhere.** It reads
  "daniel.grimmer (at) yale.edu" on the homepage and CV, and the `email:` key is
  removed from `_data/socials.yml` so no envelope icon and no scrapeable address
  is emitted. This matches the old site. ✔ done as asked
- **D3. All authors always shown** (`max_author_limit` blank), as the old site
  did. ✔ done as asked
- **D4. Altmetric and Dimensions badges are on.** Every peer-reviewed entry now
  carries a DOI; preprints and theses have none and render no badge. ✔ done
- **D5. Never-published papers are parked** in
  `_bibliography/never_published.bib` — a valid .bib that nothing renders. They
  could not be left as commented-out entries inside `papers.bib`: BibTeX-Ruby
  starts an entry at the at-sign regardless of a leading `%`, which kills the
  build. ✔ done as asked
- **D6. Pages hidden from the nav:** `/cv/` (see B3) and the blog. Both build and
  are reachable by URL.
- **D7. Homepage news feed disabled** — the old site had none.
- **D8. Journal badge colours and the "Preprint"/"Thesis" labels are invented**
  (`_data/venues.yml`); they have no counterpart on the old site.
- **D9. Favicon is ⚛️**, which fitted the old spacetime focus more than the
  current AI one. `icon:` in `_config.yml`.
- **D10. Typos silently corrected:** "Digital Ethics Cneter" → Center ·
  "Santa Barabara" → Santa Barbara · "Universal Grammer" → Grammar ·
  "cognitive factulties" → faculties · "In aide of" → in aid of ·
  "Quebec City QB" → QC (twice) · "South Hampton" → Southampton (confirmed: the
  Surrey group held their summer school there) · a GitHub link that was wrapped
  in a Google search URL (`papers.html` line 161) replaced with the direct repo
  URL from `index.html`.
- **D11. "National University of Singapore, March 2019" appears twice** — under
  both Past Talks and Research Visits. ✔ confirmed correct; you did both.
- **D12. Pragmatic QFT video abstract** uses the `index.html` link
  (`T2Xv6EYnrGE`), not the `papers.html` one. ✔ confirmed

## E. Soccer Hockey

- [ ] **E1. Check the Firestore Security Rules before relying on this.**
      The API key in `assets/SoccerHockey/firebaseConfig.js` is *not* a leak —
      Firebase web API keys are meant to be public, and access is controlled by
      Security Rules rather than key secrecy. But that means **the rules are the
      only thing guarding the database**, and this is now published from a public
      repo. Two things worth confirming in the Firebase console:
      - Rules still disallow *creating* new documents (your note in
        `SoccerHockeyGameRooms.js` says you toggle this deliberately).
      - The project is still active. Firestore projects that sit idle can be
        disabled, and "test mode" rules expire after 30 days and then deny
        everything — a likely cause if the back end turns out to be stale.
- [ ] **E2. Rooms are unauthenticated.** There are ten fixed room names and no
      login, so anyone who loads the page can join a room and move pieces in
      someone else's game. Fine for a toy; worth knowing before you link it
      anywhere busy.
- [ ] **E3. Optionally restrict the API key** in the Google Cloud console to the
      HTTP referrer `danielgrimmer.github.io/*`, so the key can't be reused to
      run up quota against your project from elsewhere.
- [ ] **E4. The demo and game pages carry their own styling** and do not inherit
      the site theme. That's faithful to the old site; say if you'd rather they
      matched.

## F. Optional improvements

- [ ] **F1. Ask Oxford IT to leave a redirect** at `users.ox.ac.uk/~pemb6003/` —
      that's the URL people have cited, and it's the one thing neither of us can
      fix from this repo. (It is still live: it currently serves your talk PDFs.)
- [ ] **F2. Enable link previews.** `serve_og_meta` and `serve_schema_org` are
      off; turning them on, plus `og_image`, gives proper cards when the site is
      shared.
- [ ] **F3. Add ORCID and PhilPeople** to `_data/socials.yml` — neither was on
      the old site.

## G. Verified working

- Pages source set to GitHub Actions ✅
- Builds with zero warnings and zero errors; 10 pages
- All 20 publications present — matches the old site's own counts of 3 under
  review and 17 published/theses
- Every peer-reviewed entry has a DOI (the *Symmetry* one was derived from the
  MDPI URL and confirmed against doi.org)
- No broken internal links
- Real photos in place; the homepage headshot is a 4:5 crop of `DGrimmer3.jpg`
  (the 7 MB original was removed from the deployed site — it remains in git
  history at commit `69b7aab` if another crop is ever wanted)
- Four talk slide PDFs live at `/assets/pdf/talks/`
- Soccer Hockey bundle survives the build with its ES module imports intact
- Light mode, dark mode and mobile all check out
- Accented names render correctly (Martín-Martínez, Polo-Gómez, São Carlos)

**Not yet live:** this work is on `claude/academic-site-migration-plan-5yq7ob`.
It publishes when merged to `main`.
