"""Execute every authored anchor example and compare its literal output.

Run locally with Python 3, GCC and rustc. Rust is optional for a partial local
check; CI runs the full check and fails if its toolchain is unavailable.
"""

from __future__ import annotations

import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

from curriculum_blueprints import DAYS
from modified_outputs import MODIFIED_OUTPUT


def verify() -> None:
    languages = {d.anchor for d in DAYS.values()}
    if languages != {"c", "python", "rust"}:
        raise AssertionError(f"Unexpected languages: {languages}")
    if set(MODIFIED_OUTPUT) != set(DAYS):
        raise AssertionError("modified-output data is missing days")
    if os.getenv("CI") and not shutil.which("rustc"):
        raise RuntimeError("CI must provide rustc to verify all Rust lessons")
    missing = set()
    checked = 0
    with tempfile.TemporaryDirectory(prefix="crp-lessons-") as temp:
        directory = Path(temp)
        for day in sorted(DAYS.values(), key=lambda item: item.number):
            if day.anchor == "rust" and not shutil.which("rustc"):
                missing.add(day.number)
                continue
            for label, source in (("original", day.code), ("modified", day.modified[0])):
                path = directory / f"day-{day.number:02d}.{ {'c': 'c', 'python': 'py', 'rust': 'rs'}[day.anchor]}"
                path.write_text(source, encoding="utf-8")
                executable = directory / f"day-{day.number:02d}"
                if day.anchor == "python":
                    command = [sys.executable, str(path)]
                else:
                    compiler = (["gcc", "-std=c17", "-Wall", "-Wextra", "-pedantic", str(path), "-o", str(executable)]
                                if day.anchor == "c" else
                                ["rustc", "--edition=2024", str(path), "-o", str(executable)])
                    built = subprocess.run(compiler, text=True, capture_output=True, timeout=30)
                    if built.returncode:
                        raise AssertionError(f"Day {day.number} {label} compile: {built.stderr}")
                    command = [str(executable)]
                result = subprocess.run(command, text=True, capture_output=True, timeout=5)
                want = day.output.strip() if label == "original" else MODIFIED_OUTPUT[day.number].strip()
                if result.returncode or result.stdout.strip() != want:
                    raise AssertionError(
                        f"Day {day.number} {day.anchor} {label}: expected {want!r}, "
                        f"got {result.stdout!r}; stderr={result.stderr!r}; exit={result.returncode}"
                    )
                checked += 1
    print(f"Verified {checked} lesson programs; Rust toolchain unavailable for {len(missing)} local examples." if missing
          else f"Verified all {checked} authored lesson programs.")


if __name__ == "__main__":
    verify()
