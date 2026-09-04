# Open items

What is still outstanding, in one place. The migration checklist this grew out
of is archived at [`archive/CHECKLIST-2026-08.md`](archive/CHECKLIST-2026-08.md)
with its resolved items and the decisions recorded there; nothing below is
repeated from it except the parts still open. Delete a line when it is done.

Everything in this folder is excluded from the Jekyll build (`docs/` in
`_config.yml`), so nothing here is served.

## Bibliography — your call

- [ ] **"Das Neue Raumproblem"** is on the CV under *In Preparation* and not on
      the site. It is in `_bibliography/parked.bib` ready to move to
      `papers.bib` if in-preparation work should show.
- [ ] **"Connecting Grit and Peer Disagreement"** appears nowhere on the 2026
      CV. It is parked in `parked.bib`, which nothing renders; delete it if it
      is abandoned.
- [ ] **One record still hand-typed:** `grimmer2026innateness` in `papers.bib`
      (under review). Its official record is at
      philsci-archive.pitt.edu/28373/, which the sandbox this site is edited
      from cannot reach (the site rejects the request outright; arXiv is
      reachable, and the five arXiv preprints were brought in from their
      records in 2026-09). Paste the PhilSci-Archive export in and it will be
      applied the same way.

## The CV PDF

- [ ] **Its header still points at `users.ox.ac.uk/~pemb6003`**, which is no
      longer maintained. The site serves the PDF as supplied
      (`assets/pdf/CV_Grimmer.pdf`), so this is fixed at the source and the
      file replaced — there is no generated CV page to edit.
- [ ] Cosmetic: under *Talks* the CV says "a Kantian Spacetime" where its own
      preprints list, the preprint and this site say "Neo-Kantian".
- [ ] The CV titles the BJPS paper *"Dualities, Quantum Mechanics, and the
      Uncommon Common Core"*. Crossref and PhilPapers both give the published
      title as *"Duality, Underdetermination, and the Uncommon Common Core"*
      (DOI 10.1086/730421, checked 2026-09), which is what the site carries;
      the CV is the one to correct.

## Firebase console — not in the repository

Full instructions are in [`_firebase/README.md`](../_firebase/README.md); these
are its open steps.

- [ ] **Republish `firestore.rules`** after the 2026-09 change (`seatUntouched`,
      the seat requirement on a reset). The file in the repository is the whole
      published file; paste it over the console copy. The rules cannot be
      tested from here — the README says how to spot-check in the Rules
      Playground.
- [ ] **Restrict the API key** by referrer to `https://danielgrimmer.github.io/*`
      and to the five APIs the client uses (README step 5).
- [ ] **App Check**: registered on the client side; the console registration
      and the decision whether to enforce are still open (step 6). Unenforced
      is the recommended resting place.
- [ ] **Gemini API**: check whether `generativelanguage.googleapis.com` is
      enabled on `soccerhockeyduality` and disable it if unused (step 7). The
      only thing in the project that can cost money.

## Done in 2026-09, recorded so the change is visible

- Homepage selected publications now include the Erkenntnis paper (five
  selected: two under review, BJPS, Synthese, Erkenntnis). Drop one with
  `selected = {true}` in `papers.bib` if five is too many.
- Link previews on: `serve_og_meta`, `serve_schema_org` and `og_image`
  (`prof_pic.jpg`) in `_config.yml`.
- PhilPeople added to `_data/socials.yml` as a custom entry.
- The test suite gates the deploy (`test` job in `deploy.yml`); `tests.yml`
  is gone. A manual run can pass `skip_tests` in an emergency.
- Soccer Hockey's *New game* button was already hidden from anyone without a
  seat; its handler now refuses as well, matching the rules.
