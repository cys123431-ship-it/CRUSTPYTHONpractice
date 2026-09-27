// Compile and run every complete program written in the lesson Markdown.
//
// A program block is a ```c / ```python / ```rust fence whose first line is a
// file comment:  `// 파일: name.c`  or  `# 파일: name.py`.
// It may be followed by an `입력:` text block (stdin) and must be followed by an
// `실행 결과:` text block whose content has to equal the program's stdout.
// A file comment containing `(컴파일 오류: TEXT)` marks a block that must fail to
// compile with TEXT in the compiler output (e.g. `E0502`); `(실행 오류: TEXT)`
// marks a program that must exit with failure and TEXT in stderr (e.g.
// `IndexError`, `panicked`). This is how lessons show real errors without
// faking them, and it proves the error happens for the stated reason.
//
// Exercises in the frontmatter are also executed:
//   - predict exercises whose starter is a full program: stdout must equal answer
//   - verification "run": the answer program must exit with status 0; when the
//     exercise has an `output` field (the output its explanation quotes), the
//     answer's stdout must equal it
//   - verification "compile": the answer must compile
// Usage: node --import tsx scripts/verify-lessons/index.ts [dayNumber ...]
import { writeFileSync } from "node:fs";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import yaml from "js-yaml";

type Lang = "c" | "python" | "rust";
type Job = {
  where: string;
  lang: Lang;
  source: string;
  stdin: string;
  expected?: string;
  mode: "output" | "exit0" | "compile" | "compile-error" | "runtime-error";
};

const CONTENT_DIR = resolve(process.env.LESSON_DIR ?? "src/content/days");
const PYTHON =
  process.env.PYTHON ?? (process.platform === "win32" ? "python" : "python3");
const EXE = process.platform === "win32" ? ".exe" : "";
const only = new Set(process.argv.slice(2).map(Number));
const env = { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" };

const clean = (text: string) =>
  text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");

const isFullProgram = (lang: Lang, source: string) =>
  lang === "python" ||
  (lang === "c" && /\bint\s+main\s*\(/.test(source)) ||
  (lang === "rust" && /\bfn\s+main\s*\(/.test(source));

function collectBody(file: string, body: string): Job[] {
  const jobs: Job[] = [];
  const fence = /```([a-z]*)[^\n]*\n([\s\S]*?)```/g;
  const blocks: { lang: string; code: string; start: number; end: number }[] =
    [];
  for (let m = fence.exec(body); m; m = fence.exec(body))
    blocks.push({
      lang: m[1]!,
      code: m[2]!,
      start: m.index,
      end: fence.lastIndex,
    });
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i]!;
    if (!["c", "python", "rust"].includes(block.lang)) continue;
    const first = block.code.split("\n", 1)[0]!;
    const named = first.match(/^(?:\/\/|#) 파일: (\S+)/);
    if (!named) continue;
    const lang = block.lang as Lang;
    const where = `${file} ${named[1]}`;
    const failing = first.match(/\((컴파일|실행) 오류: ([^)]+)\)/);
    if (failing) {
      jobs.push({
        where,
        lang,
        source: block.code,
        stdin: "",
        mode: failing[1] === "컴파일" ? "compile-error" : "runtime-error",
        expected: failing[2]!.trim(),
      });
      continue;
    }
    if (first.includes("오류")) {
      jobs.push({
        where,
        lang,
        source: block.code,
        stdin: "",
        mode: "output",
        expected:
          "\u0000error marker needs the expected message, e.g. (컴파일 오류: E0502)",
      });
      continue;
    }
    let stdin = "";
    let next = i + 1;
    const between = (a: number) =>
      body.slice(blocks[a - 1]!.end, blocks[a]!.start);
    if (
      blocks[next] &&
      /입력:\s*$/.test(between(next)) &&
      blocks[next]!.lang === "text"
    ) {
      stdin = blocks[next]!.code;
      next += 1;
    }
    const out = blocks[next];
    if (!out || out.lang !== "text" || !/실행 결과:\s*$/.test(between(next))) {
      jobs.push({
        where,
        lang,
        source: block.code,
        stdin,
        mode: "output",
        expected: "\u0000missing 실행 결과 block",
      });
      continue;
    }
    jobs.push({
      where,
      lang,
      source: block.code,
      stdin,
      mode: "output",
      expected: out.code,
    });
    i = next;
  }
  return jobs;
}

type Exercise = {
  id: string;
  kind: string;
  starter: string;
  answer: string;
  language: Lang;
  verification: string;
  output?: string;
};

function collectExercises(file: string, exercises: Exercise[]): Job[] {
  const jobs: Job[] = [];
  for (const ex of exercises) {
    const where = `${file} ${ex.id}`;
    if (
      ex.kind === "predict" &&
      isFullProgram(ex.language, ex.starter) &&
      ex.verification !== "none"
    )
      jobs.push({
        where,
        lang: ex.language,
        source: ex.starter,
        stdin: "",
        mode: "output",
        expected: ex.answer,
      });
    else if (ex.verification === "run")
      jobs.push({
        where,
        lang: ex.language,
        source: ex.answer,
        stdin: "",
        ...(ex.output === undefined
          ? { mode: "exit0" as const }
          : { mode: "output" as const, expected: ex.output }),
      });
    else if (ex.verification === "compile")
      jobs.push({
        where,
        lang: ex.language,
        source: ex.answer,
        stdin: "",
        mode: "compile",
      });
  }
  return jobs;
}

function run(job: Job, dir: string): string | undefined {
  const base = join(dir, "main");
  const src = base + { c: ".c", python: ".py", rust: ".rs" }[job.lang];
  writeFileSync(src, job.source, "utf8");
  let command: string[];
  if (job.lang === "python") {
    if (job.mode === "compile" || job.mode === "compile-error") {
      const r = spawnSync(PYTHON, ["-m", "py_compile", src], {
        encoding: "utf8",
        env,
      });
      const ok = r.status === 0;
      if (job.mode === "compile")
        return ok ? undefined : `syntax error: ${r.stderr}`;
      if (ok) return "expected a syntax error but it compiled";
      return r.stderr.includes(job.expected!)
        ? undefined
        : `syntax error lacks ${JSON.stringify(job.expected)}:
${r.stderr}`;
    }
    command = [PYTHON, src];
  } else {
    const exe = base + EXE;
    // Warnings are errors for programs that must work, but not for blocks that
    // demonstrate a specific compile error: there the named error must appear.
    const strict = job.mode !== "compile-error";
    const args =
      job.lang === "c"
        ? [
            "gcc",
            "-std=c17",
            "-Wall",
            "-Wextra",
            "-pedantic",
            ...(strict ? ["-Werror"] : []),
            src,
            "-o",
            exe,
            "-lm",
          ]
        : [
            "rustc",
            "--edition=2024",
            ...(strict ? ["-D", "warnings"] : []),
            "-C",
            "debuginfo=0",
            src,
            "-o",
            exe,
          ];
    if (
      job.mode === "compile" &&
      job.lang === "rust" &&
      !/\bfn\s+main\s*\(/.test(job.source)
    )
      args.splice(1, 0, "--crate-type", "lib");
    if (
      job.mode === "compile" &&
      job.lang === "c" &&
      !/\bint\s+main\s*\(/.test(job.source)
    )
      args.splice(args.indexOf("-o"), 2, "-c", "-o", base + ".o");
    const built = spawnSync(args[0]!, args.slice(1), {
      encoding: "utf8",
      cwd: dir,
      env,
    });
    if (job.mode === "compile-error") {
      if (built.status === 0) return "expected a compile error but it compiled";
      return built.stderr.includes(job.expected!)
        ? undefined
        : `compile error lacks ${JSON.stringify(job.expected)}:
${built.stderr}`;
    }
    if (built.status !== 0 || built.error)
      return `compile failed:\n${built.stderr || built.error?.message}`;
    if (job.mode === "compile") return undefined;
    command = [exe];
  }
  const result = spawnSync(command[0]!, command.slice(1), {
    encoding: "utf8",
    cwd: dir,
    env,
    input: job.stdin,
    timeout: 10_000,
  });
  if (result.error) return `run failed: ${result.error.message}`;
  if (job.mode === "runtime-error") {
    if (result.status === 0)
      return "expected a runtime error but the program succeeded";
    return result.stderr.includes(job.expected!)
      ? undefined
      : `runtime error lacks ${JSON.stringify(job.expected)}:
${result.stderr}`;
  }
  if (job.mode === "exit0")
    return result.status === 0
      ? undefined
      : `exit ${result.status}\n${result.stderr}`;
  if (result.status !== 0)
    return `exit ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`;
  const want = clean(job.expected ?? "");
  const got = clean(result.stdout);
  return want === got
    ? undefined
    : `output mismatch\n--- expected\n${want}\n--- actual\n${got}`;
}

const files = (await readdir(CONTENT_DIR))
  .filter((f) => f.endsWith(".md"))
  .sort();
const failures: string[] = [];
let checked = 0;
const temp = await mkdtemp(join(tmpdir(), "crp-lessons-"));
try {
  for (const file of files) {
    const source = (await readFile(join(CONTENT_DIR, file), "utf8")).replace(
      /\r\n/g,
      "\n",
    );
    const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      failures.push(`${file}: frontmatter missing`);
      continue;
    }
    const meta = yaml.load(match[1]!) as {
      dayNumber: number;
      exercises?: Exercise[];
      playgroundSource?: string;
    };
    if (only.size && !only.has(meta.dayNumber)) continue;
    const jobs = [
      ...collectBody(file, match[2]!),
      ...collectExercises(file, meta.exercises ?? []),
    ];
    if (meta.playgroundSource)
      jobs.push({
        where: `${file} playgroundSource`,
        lang: "python",
        source: meta.playgroundSource,
        stdin: "",
        mode: "exit0",
      });
    for (const job of jobs) {
      if (job.expected?.startsWith("\u0000")) {
        failures.push(`${job.where}: ${job.expected.slice(1)}`);
        continue;
      }
      const dir = await mkdtemp(join(temp, "p-"));
      const problem = run(job, dir);
      await rm(dir, { recursive: true, force: true });
      checked += 1;
      if (problem) failures.push(`${job.where} [${job.lang}]: ${problem}`);
    }
  }
} finally {
  await rm(temp, { recursive: true, force: true });
}
await writeFile(join(tmpdir(), "crp-verify-last.txt"), failures.join("\n\n"));
if (failures.length) {
  console.error(failures.join("\n\n"));
  console.error(`\n${failures.length} of ${checked} lesson programs failed.`);
  process.exit(1);
}
console.log(`Verified ${checked} lesson programs (C, Python, Rust).`);
