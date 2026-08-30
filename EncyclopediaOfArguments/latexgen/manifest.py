"""Did the merge keep every entry?

`argument-db.json` is one large file that two branches edit at once: the import
branch appends entries at the end, `main` rewrites derived values throughout.
Git line-merges that, reports success, and can silently drop an entry. It has
already done so once.

`entries.txt` is one id per line, written by `build.py`, and it conflicts where
the JSON quietly does not -- but resolving that conflict by regenerating the
file from the JSON would hide the very damage it exists to reveal. So the check
is against the **merge parents**, not the working tree:

    python3 manifest.py --check-merge     # inside a merge, or just after one

Every id either parent had must still be in the database. What is missing is
what the merge dropped, and the fix is never to edit the manifest -- it is to
take the branch's copy of the database wholesale and let `build.py` reapply
main's changes, since everything main changes about an existing entry is
derived.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
DB = ROOT / "assets/arguments/argument-db.json"
MANIFEST = "assets/arguments/entries.txt"


def at(rev: str) -> list[str]:
    """The manifest as of one revision, or nothing if it had none."""
    got = subprocess.run(
        ["git", "show", f"{rev}:{MANIFEST}"],
        cwd=ROOT, capture_output=True, text=True,
    )
    return got.stdout.split() if got.returncode == 0 else []


def parents() -> list[str]:
    """The revisions being merged.

    `MERGE_HEAD` while a merge is unresolved, `HEAD^2` just after one was
    committed, and nothing else. Deliberately **not** `ORIG_HEAD`, which is
    only wherever the last checkout came from -- on a branch that does not have
    the import entries it would report every one of them as lost.
    """
    out = ["HEAD"]
    for rev in ("MERGE_HEAD", "HEAD^2"):
        got = subprocess.run(["git", "rev-parse", "--verify", "-q", rev],
                             cwd=ROOT, capture_output=True, text=True)
        if got.returncode == 0:
            out.append(got.stdout.strip())
            break
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check-merge", action="store_true")
    ap.parse_args()

    present = [e["id"] for e in json.loads(DB.read_text())["entries"]]
    expected: list[str] = []
    for rev in parents():
        for eid in at(rev):
            if eid not in expected:
                expected.append(eid)

    lost = [eid for eid in expected if eid not in present]
    if lost:
        print(f"{len(lost)} entries were in a merge parent and are gone:")
        for eid in lost:
            print(f"  {eid}")
        print("\nThe database was damaged, not the manifest. Recover with:")
        print("  git show <this branch>:assets/arguments/argument-db.json"
              " > assets/arguments/argument-db.json")
        print("  cd EncyclopediaOfArguments/latexgen && python3 build.py --write")
        sys.exit(1)

    print(f"{len(present)} entries, {len(expected)} expected from the merge parents"
          f" — nothing lost")


if __name__ == "__main__":
    main()
