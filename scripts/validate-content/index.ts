import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { validateCurriculum } from "../../src/domain/curriculum/validate";
import type { DaySummary, Language } from "../../src/domain/curriculum/types";

const CONTENT_DIR = resolve("src/content/days");
const files = (await readdir(CONTENT_DIR)).filter((file) =>
  /\.mdx?$/.test(file),
);
const days: DaySummary[] = [];
const allEntityIds = new Set<string>();
const failures: string[] = [];

const scalar = (frontmatter: string, key: string): string => {
  const match = frontmatter.match(
    new RegExp(`^${key}:\\s*["']?([^\\n"']+)["']?\\s*$`, "m"),
  );
  if (!match?.[1]) throw new Error(`missing ${key}`);
  return match[1].trim();
};

const list = (frontmatter: string, key: string): string[] => {
  const inline = frontmatter.match(
    new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, "m"),
  );
  const block = frontmatter.match(
    new RegExp(`^${key}:\\s*\\n((?:- [^\\n]+\\n?)*)`, "m"),
  );
  const values =
    inline?.[1] ??
    block?.[1]?.replace(/^- /gm, "").trim().replace(/\n/g, ",") ??
    "";
  return values
    .split(",")
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
};

for (const file of files) {
  const source = await readFile(resolve(CONTENT_DIR, file), "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1];
  if (!frontmatter) {
    failures.push(`${file}: frontmatter missing`);
    continue;
  }
  try {
    const id = scalar(frontmatter, "id");
    const dayNumber = Number(scalar(frontmatter, "dayNumber"));
    if (source.includes("\0"))
      failures.push(`${file}: unexpected NUL byte in lesson`);
    if (scalar(frontmatter, "sample") === "false") {
      for (const [heading, minimum] of [
        ["천천히 풀어보기", 200],
        ["다른 예제로 다시 이해하기", 140],
      ] as const) {
        const section = source.split(`## ${heading}\n\n`)[1]?.split("\n## ")[0];
        if (!section || section.trim().length < minimum)
          failures.push(
            `${file}: '${heading}' needs a worked beginner explanation`,
          );
      }
    }
    const expectedDate = new Date(Date.UTC(2026, 9, dayNumber))
      .toISOString()
      .slice(0, 10);
    if (scalar(frontmatter, "date") !== expectedDate)
      failures.push(`${file}: expected course date ${expectedDate}`);
    const exerciseIds = [
      ...frontmatter.matchAll(/^\s*- id:\s*(ex-[a-z0-9-]+)/gm),
    ].map((match) => match[1]!);
    const quizIds = [
      ...frontmatter.matchAll(/^\s*- id:\s*(quiz-[a-z0-9-]+)/gm),
    ].map((match) => match[1]!);
    if (exerciseIds.length < 2)
      failures.push(`${file}: at least two exercises required`);
    if (quizIds.length < 2)
      failures.push(`${file}: at least two quiz items required`);
    for (const entityId of [id, ...exerciseIds, ...quizIds]) {
      if (allEntityIds.has(entityId))
        failures.push(`${file}: duplicate entity id ${entityId}`);
      allEntityIds.add(entityId);
    }
    const runnerMode = scalar(frontmatter, "runnerMode");
    const anchorLanguage = scalar(frontmatter, "anchorLanguage") as Language;
    if (!new Set(["none", "python", "prepared-wasm"]).has(runnerMode))
      failures.push(`${file}: invalid runner mode ${runnerMode}`);
    if (runnerMode === "python" && anchorLanguage !== "python")
      failures.push(`${file}: python runner requires Python anchor in V1`);
    if (runnerMode === "prepared-wasm" && anchorLanguage === "python")
      failures.push(`${file}: prepared-wasm must represent C or Rust anchor`);
    days.push({
      id,
      dayNumber,
      title: scalar(frontmatter, "title"),
      phaseId: scalar(frontmatter, "phaseId"),
      anchorLanguage,
      estimatedMinutes: Number(scalar(frontmatter, "estimatedMinutes")),
      prerequisites: list(frontmatter, "prerequisites"),
    });
  } catch (error) {
    failures.push(
      `${file}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

for (const issue of validateCurriculum(days))
  failures.push(
    `${issue.code}: ${issue.entityId}${issue.referenceId ? ` -> ${issue.referenceId}` : ""}`,
  );
const ordered = [...days].sort((a, b) => a.dayNumber - b.dayNumber);
for (let index = 1; index < ordered.length; index += 1)
  if (ordered[index]!.dayNumber === ordered[index - 1]!.dayNumber)
    failures.push(`duplicate dayNumber ${ordered[index]!.dayNumber}`);

if (ordered.length !== 92)
  failures.push(`expected 92 days, found ${ordered.length}`);
for (let index = 0; index < ordered.length; index += 1) {
  const day = ordered[index]!;
  if (day.dayNumber !== index + 1)
    failures.push(`missing or out-of-order Day ${index + 1}`);
  const expectedPhase =
    [12, 25, 28, 48, 56, 70, 82, 92].findIndex(
      (last) => day.dayNumber <= last,
    ) + 1;
  if (day.phaseId !== `phase-${String(expectedPhase).padStart(2, "0")}`)
    failures.push(`${day.id}: wrong phase ${day.phaseId}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `Validated ${days.length} days and ${allEntityIds.size} stable IDs; prerequisite DAG is valid.`,
);
