// Authoring helper: print the real stdout of every runnable exercise answer
// that has no `output` field yet, so the author can compare it with the
// explanation and add it. With --write, it inserts `output:` after the
// exercise's `verification: run` line. Usage:
//   node --import tsx scripts/verify-lessons/exercise-outputs.ts [--write] <day...>
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import yaml from "js-yaml";

type Exercise = {
  id: string;
  kind: string;
  answer: string;
  language: "c" | "python" | "rust";
  verification: string;
  output?: string;
};

const args = process.argv.slice(2);
const write = args.includes("--write");
const days = new Set(args.filter((a) => a !== "--write").map(Number));
const dir = resolve("src/content/days");
const PYTHON = process.env.PYTHON ?? "python3";
const EXE = process.platform === "win32" ? ".exe" : "";
const env = { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" };

function stdoutOf(ex: Exercise): string {
  const work = mkdtempSync(join(tmpdir(), "crp-ex-"));
  const src = join(
    work,
    { c: "main.c", python: "main.py", rust: "main.rs" }[ex.language],
  );
  writeFileSync(src, ex.answer, "utf8");
  let cmd = [PYTHON, src];
  if (ex.language !== "python") {
    const exe = join(work, "main" + EXE);
    const build =
      ex.language === "c"
        ? [
            "gcc",
            "-std=c17",
            "-Wall",
            "-Wextra",
            "-pedantic",
            "-Werror",
            src,
            "-o",
            exe,
            "-lm",
          ]
        : ["rustc", "--edition=2024", "-D", "warnings", src, "-o", exe];
    const b = spawnSync(build[0]!, build.slice(1), {
      encoding: "utf8",
      cwd: work,
    });
    if (b.status !== 0)
      throw new Error(`${ex.id} does not compile:\n${b.stderr}`);
    cmd = [exe];
  }
  const r = spawnSync(cmd[0]!, cmd.slice(1), {
    encoding: "utf8",
    cwd: work,
    env,
  });
  if (r.status !== 0)
    throw new Error(`${ex.id} exited ${r.status}:\n${r.stderr}`);
  return r.stdout.replace(/\r\n/g, "\n").replace(/\s+$/, "");
}

for (const file of readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .sort()) {
  const path = join(dir, file);
  let text = readFileSync(path, "utf8");
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/)![1]!;
  const meta = yaml.load(fm) as { dayNumber: number; exercises: Exercise[] };
  if (days.size && !days.has(meta.dayNumber)) continue;
  for (const ex of meta.exercises) {
    if (
      ex.kind === "predict" ||
      ex.verification !== "run" ||
      ex.output !== undefined
    )
      continue;
    const out = stdoutOf(ex);
    console.log(`${file} ${ex.id}:\n${out}\n`);
    if (!write) continue;
    const at = text.indexOf(`id: ${ex.id}\n`);
    const verif = text.indexOf("verification: run", at);
    const lineEnd = text.indexOf("\n", verif);
    const indent = text.slice(text.lastIndexOf("\n", verif) + 1, verif);
    const block = out.includes("\n")
      ? `${indent}output: |-\n${out
          .split("\n")
          .map((l) => `${indent}  ${l}`)
          .join("\n")}`
      : `${indent}output: ${JSON.stringify(out)}`;
    text = text.slice(0, lineEnd + 1) + block + "\n" + text.slice(lineEnd + 1);
  }
  if (write) writeFileSync(path, text, "utf8");
}
