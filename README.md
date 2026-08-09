# danielgrimmer.github.io

Academic site for Daniel Grimmer, built with [Jekyll](https://jekyllrb.com/) and the
[al-folio](https://github.com/alshedivat/al-folio) theme. Published at
<https://danielgrimmer.github.io/>.

Migrated from the old Oxford page (`users.ox.ac.uk/~pemb6003/`). All the prose,
publications, talks and teaching history from that site are in place; what is
still outstanding is listed under [Still to do](#still-to-do).

## Where things live

| I want to change… | Edit this |
| --- | --- |
| Homepage bio + research interests | `_pages/about.md` |
| The longer career narrative | `_pages/bio.md` (published at `/about/`) |
| Publications | `_bibliography/papers.bib` — the page generates itself |
| Talks, posters, research visits | `_pages/talks.md` |
| Teaching | `_pages/teaching.md` |
| CV | `_data/cv.yml` (page is `_pages/cv.md`, currently hidden from the nav) |
| Site title, description, favicon | `_config.yml`, top section |
| Email and profile links | `_data/socials.yml` |
| Journal badge colours | `_data/venues.yml`, keyed by the `abbr` field in the .bib |
| Profile photos | `assets/img/prof_pic.jpg`, `assets/img/DGrimmer2.jpg` |
| Nav order / hiding a page | `nav` and `nav_order` in that page's front matter |

### Adding a publication

Add a BibTeX entry to `_bibliography/papers.bib`. Useful fields:

- `status = {submitted}` — files it under "Currently under peer review" instead
  of the main list.
- `selected = {true}` — also shows it on the homepage.
- `abbr = {PRA}` — the coloured badge; give it a colour in `_data/venues.yml`.
- `arxiv`, `doi`, `html`, `code`, `video`, `abstract` — each adds a button.

Two gotchas, both learned the hard way during the migration:

- **Do not put `%` comments inside an entry.** BibTeX-Ruby only accepts them
  between entries; inside braces they abort the whole build.
- **Avoid `additional_info`.** The theme concatenates it straight onto the
  journal name and markdownifies it, which yields `Journal NameYour note , 2024`.
  Put publication details in `journal`/`school` and `month`, and anything longer
  in `abstract`.

## Running it locally

Requires Ruby 3.3+ and ImageMagick (`convert` must be on `PATH`).

```bash
bundle install
bundle exec jekyll serve   # http://127.0.0.1:4000
```

**If the build dies with `invalid byte sequence in US-ASCII`,** your shell is not
in a UTF-8 locale and the BibTeX parser is choking on an accented name
(Martín-Martínez, Polo-Gómez). Fix it with:

```bash
export LANG=C.UTF-8 LC_ALL=C.UTF-8
```

## How it deploys

`.github/workflows/deploy.yml` builds on every push to `main` and publishes via
GitHub's official Pages action. Pull requests build but do not deploy, so a
broken build is caught before it reaches the live site.

**One-time setup required in the repo settings:** go to
*Settings → Pages → Build and deployment* and set **Source** to
**GitHub Actions**. Until that is set, the workflow will run but nothing will
be published.

## Theme customisation

`assets/css/main.scss` shadows the theme's own stylesheet entry purely to change
the accent colour from al-folio's magenta/teal to the deep navy the old site used
(`#002147`, near-identical to Yale blue), with a lighter tint for dark mode.
**To revert to stock al-folio, delete that file** — nothing else depends on it.
If you bump the `al_folio_core` gem, re-check that file against the gem's own
`assets/css/main.scss` in case the import list changed.

## Upgrading the theme

al-folio v1.x ships its runtime as versioned gems rather than as files copied
into this repo, so upgrading is a version bump rather than a merge conflict:
edit the pinned versions in the `:al_folio_plugins` group in `Gemfile`, run
`bundle update`, check the site still builds, and commit the new `Gemfile.lock`.

## Still to do

- [ ] **Set Pages source to "GitHub Actions"** (see above) — nothing publishes until this is done
- [ ] Replace the two placeholder photos with the real `DGrimmer3.jpg` / `DGrimmer2.jpg`
- [ ] Copy the four talk slide decks into `assets/pdf/talks/` — these links 404 today:
      `PragmaticQFTMeasurementProblemPopGrunch.pdf`, `TheUnruhEffectInSlowMotion.pdf`,
      `DiscreteGeneralCovariancePopGrunch.pdf`, `DiscreteGeneralCovarianceBarrioRQI.pdf`
- [ ] Upload `CVGrimmer.pdf` to `assets/pdf/`, then uncomment `cv_pdf` in
      `_data/socials.yml` to restore the old "Long CV" link
- [ ] Fill in the two missing arXiv links in `papers.bib` (the old site had
      unfilled placeholders `#` and `YOUR_UNIT1_ARXIV_LINK`)
- [ ] Verify the inferred dates in `_data/cv.yml`, then set `nav: true` in `_pages/cv.md`
- [ ] Port the Soccer Hockey Duality and Escher Chess demos
- [ ] Decide about the dropped papers — see below

### Things worth a decision

**Papers that vanished from the old site.** The old `papers.html` had a large
commented-out block containing "A Discrete Analog of General Covariance"
(arXiv [2204.02276](https://arxiv.org/abs/2204.02276) /
[2205.07701](https://arxiv.org/abs/2205.07701)), "From Humean Laws to a
Neo-Kantian Spacetime" ([2308.14146](https://arxiv.org/abs/2308.14146)),
"Spacetime Representation Theory" ([2306.08110](https://arxiv.org/abs/2306.08110)),
and "Connecting Grit and Peer Disagreement". Two of those are linked from the
homepage research interests but appear nowhere on the publications page. They
have not been carried into `papers.bib` — that mirrors the old site's *rendered*
output, but it may have been an accident when the "under review" section was
rewritten.

**A video link that disagrees with itself.** For the Pragmatic QFT paper, the old
`index.html` and `papers.html` pointed the video abstract at two different
YouTube videos, and the one in `papers.html` is the Unruh paper's video. The
`index.html` link was kept. Noted in a comment in `papers.bib`.

**Google Fonts.** The theme loads webfonts from `fonts.googleapis.com`, which
sends every visitor's IP to Google. Worth self-hosting if that matters to you.

**purgecss.** The deploy strips unused CSS to cut page weight. If the live site
ever renders with missing styles, that step in `deploy.yml` is the first suspect —
add the missing class to the safelist in `purgecss.config.js`.

## Licence

The al-folio theme is MIT licensed; see `LICENSE`. Site content is Daniel Grimmer's.
