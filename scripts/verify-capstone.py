"""Compare the three independent CLI implementations against shared fixtures."""

from pathlib import Path
import os
import shutil
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parents[1]
CAPSTONE = ROOT / "examples/study-log-analyzer"
FIXTURE = CAPSTONE / "study_sessions.csv"


def run(command, *arguments):
    return subprocess.run([*command, *map(str, arguments)], capture_output=True,
                          text=True, timeout=10)


def main():
    if os.getenv("CI") and not shutil.which("rustc"):
        raise RuntimeError("CI must provide rustc for capstone parity")
    with tempfile.TemporaryDirectory(prefix="crp-capstone-") as directory:
        root = Path(directory)
        executables = {"Python": [sys.executable, str(CAPSTONE / "study_log.py")]}
        build = run(["gcc", "-std=c17", "-Wall", "-Wextra", "-Werror", "-pedantic",
                     str(CAPSTONE / "study_log.c"), "-o", str(root / "study-c")])
        if build.returncode:
            raise AssertionError(build.stderr)
        executables["C"] = [str(root / "study-c")]
        if shutil.which("rustc"):
            build = run(["rustc", "--edition=2024", str(CAPSTONE / "study_log.rs"),
                         "-o", str(root / "study-rs")])
            if build.returncode:
                raise AssertionError(build.stderr)
            executables["Rust"] = [str(root / "study-rs")]

        scenarios = [[], ["--language", "Python"], ["--topic", "변수"],
                     ["--date", "2026-10-02"], ["--search", "포인터"],
                     ["--sort", "date", "--top", "2"], ["--language", "Rust", "--date", "2026-10-01"]]
        for options in scenarios:
            results = {language: run(executable, FIXTURE, *options) for language, executable in executables.items()}
            for language, result in results.items():
                if result.returncode:
                    raise AssertionError(f"{language} {options}: {result.stderr}")
                if result.stdout != results["Python"].stdout:
                    raise AssertionError(f"{language} {options} output mismatch:\n{result.stdout}\nexpected:\n{results['Python'].stdout}")

        invalid_cases = [
            "2026-02-30,Python,변수,30,pass",
            "2026-10-01,JavaScript,변수,30,pass",
            "2026-10-01,C,변수,0,pass",
            "2026-10-01,C,변수,30,unknown",
            "2026-10-01,C,변수,30",
        ]
        for index, bad in enumerate(invalid_cases):
            path = root / f"invalid-{index}.csv"
            path.write_text("date,language,topic,minutes,result\n" + bad + "\n", encoding="utf-8")
            for language, executable in executables.items():
                result = run(executable, path)
                if result.returncode == 0 or not result.stderr.strip():
                    raise AssertionError(f"{language} accepted invalid row {bad}")
        quoted = root / "quoted.csv"
        quoted.write_text('date,language,topic,minutes,result\n2026-10-01,C,"배열, ""참조""",30,pass\n', encoding="utf-8")
        for language, executable in executables.items():
            result = run(executable, quoted)
            if result.returncode or "배열, \"참조\",30" not in result.stdout:
                raise AssertionError(f"{language} quoted CSV: {result.stdout} {result.stderr}")
        print(f"Capstone parity: {len(scenarios)} outputs and {len(invalid_cases)} invalid cases across {', '.join(executables)}")


if __name__ == "__main__":
    main()
