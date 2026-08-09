# danielgrimmer.github.io

Academic site for Daniel Grimmer, built with [Jekyll](https://jekyllrb.com/) and the
[al-folio](https://github.com/alshedivat/al-folio) theme. Published at
<https://danielgrimmer.github.io/>.

> **Status: scaffold.** The structure, build and deploy pipeline are done and
> verified. The *content* is placeholder — see [What still needs doing](#what-still-needs-doing).

## Where things live

| I want to change… | Edit this |
| --- | --- |
| Homepage bio, photo, affiliation, address | `_pages/about.md` |
| Research overview | `_pages/research.md` |
| Publications | `_bibliography/papers.bib` — the page generates itself |
| Teaching | `_pages/teaching.md` |
| CV | `_data/cv.yml` (and drop a PDF in `assets/pdf/`, then point `cv_pdf` at it in `_pages/cv.md`) |
| News items on the homepage | files in `_news/` |
| Site title, name, description, favicon | `_config.yml`, top section |
| Social / academic profile links | `_data/socials.yml` |
| Profile photo | replace `assets/img/prof_pic.jpg` |
| Nav order, or hiding a page | `nav` and `nav_order` in that page's front matter |

Adding a publication means adding a BibTeX entry to `_bibliography/papers.bib`.
`selected={true}` also puts it on the homepage; `abstract={...}` adds an **Abs**
toggle; `arxiv={2303.04130}` adds an **arXiv** link; `pdf={file.pdf}` links
`assets/pdf/file.pdf`. The full field list is documented in a comment at the top
of that file.

## Running it locally

Requires Ruby 3.3+ and ImageMagick (`convert` must be on `PATH`).

```bash
bundle install
bundle exec jekyll serve   # http://127.0.0.1:4000
```

**If the build dies with `invalid byte sequence in US-ASCII`,** your shell is not
in a UTF-8 locale and the BibTeX parser is choking on an accented character.
Fix it with:

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

## Upgrading the theme

al-folio v1.x ships its runtime as versioned gems rather than as files copied
into this repo, so upgrading is a version bump rather than a merge conflict:
edit the pinned versions in the `:al_folio_plugins` group in `Gemfile`, run
`bundle update`, check the site still builds, and commit the new `Gemfile.lock`.

## What still needs doing

- [ ] Replace the placeholder bio in `_pages/about.md`
- [ ] Set the real affiliation, postal address and **email** (currently a dummy
      address in both `_pages/about.md` and `_data/socials.yml`)
- [ ] Replace `assets/img/prof_pic.jpg` with a real photo
- [ ] Replace `_bibliography/papers.bib` — the three entries there were
      reconstructed from public arXiv listings and are unverified and incomplete
- [ ] Fill in `_data/cv.yml` and attach the CV PDF
- [ ] Write `_pages/research.md` and `_pages/teaching.md`
- [ ] Delete the placeholder item in `_news/`
- [ ] Set Pages source to "GitHub Actions" (see above)

### Two things worth a decision

**Google Fonts.** The theme loads webfonts from `fonts.googleapis.com`, which
sends every visitor's IP to Google. German courts have treated that as a GDPR
problem for sites hosted in Germany, so it may be worth self-hosting the fonts.

**purgecss.** The deploy strips unused CSS to cut page weight. If the live site
ever renders with missing styles, that step in `deploy.yml` is the first suspect —
add the missing class to the safelist in `purgecss.config.js`.

## Licence

The al-folio theme is MIT licensed; see `LICENSE`. Site content is Daniel Grimmer's.
