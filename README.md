# danielgrimmer.github.io

Academic site for Daniel Grimmer, built with [Jekyll](https://jekyllrb.com/) and the
[al-folio](https://github.com/alshedivat/al-folio) theme. Published at
<https://danielgrimmer.github.io/>.

Migrated from the old Oxford page (`users.ox.ac.uk/~pemb6003/`). All the prose,
publications, talks and teaching history from that site are in place; what is
still outstanding is listed in [CHECKLIST.md](CHECKLIST.md).

## Where things live

| I want to change… | Edit this |
| --- | --- |
| Homepage bio + research interests | `_pages/about.md` |
| The longer career narrative | `_pages/bio.md` (published at `/about/`) |
| Publications | `_bibliography/papers.bib` (under review + peer-reviewed) and `_bibliography/preprints.bib` (unpublished preprints) — the page generates itself |
| Talks, posters, research visits | `_pages/talks.md` |
| Teaching | `_pages/teaching.md` |
| CV | `_data/cv.yml`; the PDF is `assets/pdf/CV_Grimmer.pdf` |
| Site title, description, favicon | `_config.yml`, top section |
| Email and profile links | `_data/socials.yml` |
| Journal badge colours | `_data/venues.yml`, keyed by the `abbr` field in the .bib |
| Profile photos | `assets/img/prof_pic.jpg`, `assets/img/DGrimmer2.jpg` |
| The games | `assets/SoccerHockey/` and `assets/EscherChess/`; landing pages `_pages/soccerhockey.md`, `_pages/escherchess.md`, grouped by `_pages/games.md` |
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
  between entries; inside braces they abort the whole build. You also cannot
  comment an entry out by prefixing its lines with `%` — the parser starts an
  entry at the at-sign regardless. Park unwanted entries in
  `_bibliography/never_published.bib`, which nothing renders. Even a stray
  at-sign inside a comment produces a lexer warning.
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

Outstanding items, open questions and decisions-made-on-your-behalf all live in
**[CHECKLIST.md](CHECKLIST.md)**. Delete that file once it's empty.

## Licence

The al-folio theme is MIT licensed; see `LICENSE`. Site content is Daniel Grimmer's.
