# Open items

What is still outstanding, in one place. The migration checklist this grew out
of is archived at [`archive/CHECKLIST-2026-08.md`](archive/CHECKLIST-2026-08.md)
with its resolved items and the decisions recorded there; nothing below is
repeated from it except the parts still open. Delete a line when it is done.

Everything in this folder is excluded from the Jekyll build (`docs/` in
`_config.yml`), so nothing here is served.

## Site content — your call

- [ ] **Selected publications on the homepage** are still the old site's four.
      The Erkenntnis paper (*Equivalence and Determinism*, accepted 2026) is
      arguably a better pick than a preprint — toggle `selected = {true}` in
      `_bibliography/papers.bib`.
- [ ] **Link previews** are off: `serve_og_meta`, `serve_schema_org` and
      `og_image` in `_config.yml`. Turning them on changes what Slack, Twitter
      and search engines show for the site, not the pages themselves.
- [ ] **PhilPeople** is not in `_data/socials.yml`.

## Bibliography

- [ ] **"Das Neue Raumproblem"** is on the CV under *In Preparation* and not on
      the site. It is in `_bibliography/parked.bib` ready to move to
      `papers.bib` if in-preparation work should show.
- [ ] **"Connecting Grit and Peer Disagreement"** appears nowhere on the 2026
      CV. It is parked in `parked.bib`, which nothing renders; delete it if it
      is abandoned.
- [ ] **Six records still hand-typed.** The sandbox this site is edited from
      cannot reach `arxiv.org` or `philsci-archive.pitt.edu`; paste each
      official record in and it will be reformatted and applied.

      | Entry | Where it lives | Source |
      | --- | --- | --- |
      | `grimmer2026innateness` | `papers.bib` (under review) | philsci-archive.pitt.edu/28373/ |
      | `grimmer2023spacetimerep` | `preprints.bib` | arxiv.org/abs/2306.08110 |
      | `grimmer2023humean` | `preprints.bib` | arxiv.org/abs/2308.14146 |
      | `grimmer2023ise` | `preprints.bib` | arxiv.org/abs/2303.04130 |
      | `grimmer2022discrete2` | `preprints.bib` | arxiv.org/abs/2205.07701 |
      | `grimmer2022discrete1` | `preprints.bib` | arxiv.org/abs/2204.02276 |

- [ ] **BJPS title.** The export you supplied says *"Duality, Underdetermination,
      and the Uncommon Common Core"* with `number = {ja}`; the 2026 CV says
      *"Dualities, Quantum Mechanics, and the Uncommon Common Core"*. The site
      carries the export's title. One look at the published article settles it;
      if the CV is right it is a one-line change in `papers.bib`.

## The CV PDF

- [ ] **Its header still points at `users.ox.ac.uk/~pemb6003`**, which is no
      longer maintained. The site serves the PDF as supplied
      (`assets/pdf/CV_Grimmer.pdf`), so this is fixed at the source and the
      file replaced — there is no generated CV page to edit.
- [ ] Cosmetic: under *Talks* the CV says "a Kantian Spacetime" where its own
      preprints list, the preprint and this site say "Neo-Kantian".

## Firebase console — not in the repository

Full instructions are in [`_firebase/README.md`](../_firebase/README.md); these
are its open steps.

- [ ] **Restrict the API key** by referrer to `https://danielgrimmer.github.io/*`
      and to the five APIs the client uses (README step 5).
- [ ] **App Check**: registered on the client side; the console registration
      and the decision whether to enforce are still open (step 6). Unenforced
      is the recommended resting place.
- [ ] **Gemini API**: check whether `generativelanguage.googleapis.com` is
      enabled on `soccerhockeyduality` and disable it if unused (step 7). The
      only thing in the project that can cost money.
- [ ] **Republish `firestore.rules`** after the 2026-09 change (`seatUntouched`,
      the seat requirement on a reset). The file in the repository is the whole
      published file; paste it over the console copy. The rules cannot be
      tested from here — the README says how to spot-check in the Rules
      Playground.

## Games — surface

- [ ] **Soccer Hockey's *New game* button** is shown to anyone in the room,
      seated or not, and calls `resetRoom`. The rules now refuse a reset from a
      caller holding no seat, so an unseated press fails silently. Escher Chess
      hides its button unless the visitor holds a seat; Soccer Hockey could do
      the same. Two lines in `assets/SoccerHockey/SoccerHockeyGameV4.0.html`.

## CI policy

- [ ] **Tests do not gate deploys.** `tests.yml` runs on the games and
      encyclopedia paths but is non-blocking, and `deploy.yml` does not wait for
      it. Making the deploy depend on a green test run for those paths would
      stop a broken bundle reaching the site, at the cost of a failing test
      also holding up an unrelated content change in the same push.
