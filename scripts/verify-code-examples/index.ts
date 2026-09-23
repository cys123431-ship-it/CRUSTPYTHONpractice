import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const temp = await mkdtemp(join(tmpdir(), "crp-code-"));
const expected = "study total: 42\n";
const commands = [
  {
    name: "Python",
    command: "python3",
    args: [resolve("tests/fixtures/code/study_total.py")],
  },
  {
    name: "C compile",
    command: "gcc",
    args: [
      "-std=c17",
      "-Wall",
      "-Wextra",
      "-pedantic",
      resolve("tests/fixtures/code/study_total.c"),
      "-o",
      join(temp, "study_total_c"),
    ],
  },
  { name: "C run", command: join(temp, "study_total_c"), args: [] },
  {
    name: "Rust compile",
    command: "rustc",
    args: [
      "--edition=2024",
      resolve("tests/fixtures/code/study_total.rs"),
      "-o",
      join(temp, "study_total_rs"),
    ],
  },
  { name: "Rust run", command: join(temp, "study_total_rs"), args: [] },
];

try {
  for (const item of commands) {
    const result = spawnSync(item.command, item.args, { encoding: "utf8" });
    if (result.error || result.status !== 0)
      throw new Error(
        `${item.name} failed: ${result.error?.message ?? result.stderr}`,
      );
    if (item.name.endsWith("run") || item.name === "Python")
      if (result.stdout !== expected)
        throw new Error(
          `${item.name} output mismatch: ${JSON.stringify(result.stdout)}`,
        );
  }
  const intentional = await readFile(
    resolve("tests/fixtures/code/expected_failure.c"),
    "utf8",
  );
  await writeFile(join(temp, "expected_failure.c"), intentional);
  const failed = spawnSync(
    "gcc",
    [
      "-std=c17",
      "-Werror",
      join(temp, "expected_failure.c"),
      "-o",
      join(temp, "bad"),
    ],
    { encoding: "utf8" },
  );
  if (failed.status === 0)
    throw new Error("expected-failure example compiled successfully");
  console.log(
    "C17, Python, Rust 2024 examples and expected-failure fixture verified.",
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
