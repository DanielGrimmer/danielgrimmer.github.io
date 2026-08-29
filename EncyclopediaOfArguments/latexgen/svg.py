"""Compile each LaTeX block to an SVG the website can show.

The blocks use `qtree` and `fitch`, which no browser maths engine renders --
KaTeX and MathJax both handle formulas, not Fitch environments or tableau
diagrams. So to put the *actual* LaTeX output on the page it has to be typeset
by LaTeX and shipped as a picture.

Run from this directory, with a TeX toolchain on PATH:

    python3 svg.py            # regenerate every SVG
    python3 svg.py --only peirce-law

The output lands in `assets/arguments/svg/<id>-<method>.svg` and is committed,
because GitHub Pages builds the site with Jekyll alone and has no LaTeX. That
means the SVGs are a build artifact that has to be regenerated whenever the
database changes; `check_stale()` compares each SVG against a hash of the block
it came from and reports any that have drifted, and the test suite fails on it.

Two things are done to the SVG after conversion:

  * **Colour.** LaTeX paints black. The page has a dark mode, so every fill is
    rewritten to `currentColor`, which inherits from the surrounding text and so
    follows the theme for free. This is why the SVG is inlined into the page
    rather than used as an `<img>`: an `<img>` has no access to the host page's
    colour.
  * **Size.** The `width`/`height` in absolute points are dropped in favour of
    the `viewBox` alone, so the diagram scales to its container instead of
    forcing a fixed size on a phone.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
DB = ROOT / "assets/arguments/argument-db.json"
OUT = ROOT / "assets/arguments/svg"
NOTATION = HERE.parent / "notation.sty"

METHODS = ("table", "tree", "nd")


def preamble(db: dict) -> str:
    m = db["latex_macros"]
    return "\n".join(
        [
            r"\documentclass[11pt]{standalone}",
            r"\usepackage{amsmath,amssymb,stmaryrd,mathtools,calc}",
            r"\usepackage{qtree}",
            r"\usepackage{fitch}",
            r"\usepackage{pifont}",
            r"\usepackage{graphicx}",
            r"\usepackage{notation}",
            m["uv"],
            m["treebox"],
            m["tabbox"],
        ]
    )


def block_of(entry: dict, method: str) -> str | None:
    holder = {"table": "truth_table", "tree": "tree", "nd": "nd"}[method]
    return entry[holder].get("latex")


def digest(block: str) -> str:
    return hashlib.sha256(block.encode()).hexdigest()[:16]


def to_svg(block: str, db: dict, workdir: Path, tag: str) -> str:
    """Typeset one block and return its SVG."""
    # `standalone` crops to the content, which is what a page wants -- but it
    # has no \textwidth to speak of, so the blocks' own "scale down if wider
    # than \linewidth" guards would misfire, and every wide block would come
    # out shrunk to nothing.
    #
    # The measure is 9in rather than the handout's 6.5in on purpose. Those
    # guards exist to make a block fit a printed page, and on the web the
    # browser does that job already -- the SVG is capped at the width of its
    # column. Leaving the guard at 6.5in makes the two compound: LaTeX shrinks
    # the block to fit paper, then CSS shrinks the result again to fit the
    # column, and a truth tree ends up at half the size of the prose beside it.
    # A wider measure lets most blocks come out at their natural size and
    # leaves the fitting to the one agent that knows how wide the reader's
    # screen actually is.
    body = block.replace(r"\begin{table}[h!]", r"\begin{center}").replace(
        r"\end{table}", r"\end{center}"
    )
    tex = (
        preamble(db)
        + "\n"
        + r"\newlength{\aemeasure}\setlength{\aemeasure}{9in}"
        + "\n"
        + r"\begin{document}"
        + "\n"
        + r"\begin{minipage}{\aemeasure}"
        + "\n"
        + body
        + "\n"
        + r"\end{minipage}"
        + "\n"
        + r"\end{document}"
        + "\n"
    )
    src = workdir / "b.tex"
    src.write_text(tex)
    shutil.copy(NOTATION, workdir / "notation.sty")
    for junk in ("b.dvi", "b.svg", "b.aux"):
        (workdir / junk).unlink(missing_ok=True)

    # DVI, not PDF. dvisvgm's native input is DVI; its PDF path shells out to
    # Ghostscript and refuses anything from 10.01.0 up, which is what this
    # machine has. DVI also keeps the TeX font information that the conversion
    # needs -- an earlier attempt went through PyMuPDF and came out with the
    # truth tables perfect but the trees and derivations scrambled, because
    # qtree and fitch draw with subsetted Type-1 fonts whose glyph mapping does
    # not survive a generic PDF reader.
    run = subprocess.run(
        ["latex", "-interaction=nonstopmode", "-halt-on-error", "b.tex"],
        cwd=workdir,
        capture_output=True,
        text=True,
    )
    dvi = workdir / "b.dvi"
    if not dvi.exists():
        tail = "\n".join(run.stdout.splitlines()[-25:])
        raise RuntimeError(f"latex produced no DVI:\n{tail}")

    # --no-fonts turns every glyph into a path, so the result carries no font
    # dependency and no browser can mis-map it.
    svgfile = workdir / "b.svg"
    conv = subprocess.run(
        ["dvisvgm", "--no-fonts", "--exact-bbox", "-o", str(svgfile), "b.dvi"],
        cwd=workdir,
        capture_output=True,
        text=True,
    )
    if not svgfile.exists():
        raise RuntimeError(f"dvisvgm failed:\n{conv.stderr[-1500:]}")
    return recolour(svgfile.read_text(), tag)


def recolour(svg: str, tag: str) -> str:
    """Make one SVG safe to inline: unique ids, theme colour, fluid width."""
    # Every SVG dvisvgm writes names its glyphs g0-88, g1-24, ... and its page
    # `page1`. Inlining two of them into the same document would put two
    # elements with the same id on the page, and `xlink:href='#g0-88'` would
    # resolve to whichever came first -- so a tree could be drawn with a truth
    # table's glyphs. Prefixing every id per file keeps them apart.
    svg = re.sub(r"id='([^']+)'", lambda m: f"id='{tag}-{m.group(1)}'", svg)
    svg = re.sub(
        r"xlink:href='#([^']+)'", lambda m: f"xlink:href='#{tag}-{m.group(1)}'", svg
    )
    # LaTeX paints black; the page has a dark mode. `currentColor` inherits from
    # the surrounding text, so the diagram follows the theme for free. Glyphs
    # are <use> elements with no fill of their own, so one fill on the root
    # reaches all of them; the rules and branches are stroked, and named.
    svg = svg.replace("stroke='#000'", "stroke='currentColor'")
    svg = svg.replace("stroke='#000000'", "stroke='currentColor'")
    # Size. dvisvgm writes an absolute width and height in points, which would
    # pin the diagram to one size forever. Replace them with a width in `em`:
    # the blocks were typeset at 11pt, so dividing by 11 makes one em of the
    # page equal 11pt of TeX, and the LaTeX renders at the same visual size as
    # the prose around it -- exactly the proportion it has in the course notes,
    # whatever text size the reader has chosen. The height follows from the
    # viewBox. Anything too wide for the column scrolls (see .ae-svg-scroll)
    # rather than shrinking into illegibility.
    m = re.search(r"width='([\d.]+)pt' height='([\d.]+)pt'", svg)
    width_em = round(float(m.group(1)) / 11.0, 3) if m else None
    svg = re.sub(r"\s(?:width|height)='[^']*'", "", svg, count=2)
    style = f"width:{width_em}em;height:auto" if width_em else "max-width:100%"
    svg = svg.replace(
        "<svg version='1.1'",
        f"<svg version='1.1' fill='currentColor' class='ae-svg' style='{style}'",
        1,
    )
    return svg


def build(only: str | None = None) -> list[str]:
    db = json.loads(DB.read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    index: dict[str, str] = {}
    written: list[str] = []

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        for entry in db["entries"]:
            if only and entry["id"] != only:
                continue
            for method in METHODS:
                block = block_of(entry, method)
                if not block:
                    continue
                name = f"{entry['id']}-{method}.svg"
                svg = to_svg(block, db, work, f"{entry['id']}-{method}")
                (OUT / name).write_text(svg)
                index[f"{entry['id']}|{method}"] = digest(block)
                written.append(name)

    if not only:
        (OUT / "index.json").write_text(json.dumps(index, indent=1, sort_keys=True) + "\n")
    return written


def check_stale() -> list[str]:
    """Which SVGs no longer match the block they were made from."""
    db = json.loads(DB.read_text())
    try:
        index = json.loads((OUT / "index.json").read_text())
    except FileNotFoundError:
        return ["index.json missing -- run svg.py"]
    stale = []
    for entry in db["entries"]:
        for method in METHODS:
            block = block_of(entry, method)
            key = f"{entry['id']}|{method}"
            if not block:
                if key in index:
                    stale.append(f"{key}: block gone but SVG remains")
                continue
            if index.get(key) != digest(block):
                stale.append(f"{key}: SVG is out of date")
            elif not (OUT / f"{entry['id']}-{method}.svg").exists():
                stale.append(f"{key}: SVG missing")
    return stale


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    if args.check:
        stale = check_stale()
        print("\n".join(stale) if stale else "every SVG is current")
        sys.exit(1 if stale else 0)

    written = build(args.only)
    total = sum((OUT / n).stat().st_size for n in written)
    print(f"wrote {len(written)} SVGs, {total / 1024:.0f} KB total, into {OUT}")


if __name__ == "__main__":
    main()
