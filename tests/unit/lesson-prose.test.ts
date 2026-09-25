// Regression pins for the lesson-prose review (Days 01-92).
// These string checks stop the known bad template sentences from
// reappearing. They do NOT prove every explanation is semantically
// correct; program behavior is executed by
// scripts/verify-course-examples.py (original + modified outputs in CI).
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const dir = resolve(process.cwd(), "src/content/days");
const generated = (f: string) =>
  !/day-01-variables-types|day-29-references-borrowing|day-57-stack/.test(f);
const files = readdirSync(dir).filter((f) => f.endsWith(".md") && generated(f));
const fullOf = (f: string) => readFileSync(join(dir, f), "utf8");
const bodyOf = (f: string) => {
  const s = fullOf(f);
  return s.slice(s.indexOf("---", 3) + 3);
};
const sectionOf = (body: string, head: string) => {
  const start = body.indexOf(`## ${head}`);
  if (start < 0) return "";
  const rest = body.slice(start);
  const next = rest.indexOf("\n## ", 1);
  return next < 0 ? rest : rest.slice(0, next);
};

describe("lesson prose regressions", () => {
  it("uses no mechanical parenthesized josa", () => {
    const bad = files.filter((f) => /\(를\)|\(가\)|\(는\)/.test(bodyOf(f)));
    expect(bad).toEqual([]);
  });
  it("claims no removal-causality for outputs", () => {
    const bad = files.filter((f) =>
      /빠지면[\s\S]{0,40}나오지 않/.test(bodyOf(f)),
    );
    expect(bad).toEqual([]);
  });
  it("reveals no answer before activities", () => {
    const bad = files.filter((f) => /의 답은 `/.test(bodyOf(f)));
    expect(bad).toEqual([]);
  });
  it("delegates no explanation to bare tracing", () => {
    const bad = files.filter((f) => /바뀐 줄부터 다시 추적/.test(bodyOf(f)));
    expect(bad).toEqual([]);
  });
  it("keeps borrow checking and runtime bounds checks distinct", () => {
    const bad = files.filter((f) =>
      /빌림과 범위 검사를 컴파일 때/.test(bodyOf(f)),
    );
    expect(bad).toEqual([]);
  });
  it("asserts no unverified cross-language equivalence", () => {
    const bad = files.filter((f) =>
      /같은 입력과 출력[\s\S]{0,30}유지됩니다/.test(bodyOf(f)),
    );
    expect(bad).toEqual([]);
  });
  it("attaches josa to fixed nouns, not raw titles", () => {
    const spaced = files.filter((f) => /을 보여 주는/.test(fullOf(f)));
    expect(spaced).toEqual([]);
    const bareTitleJosa = files.filter(
      (f) =>
        /을 이해하는 데 맞는 설명은\?/.test(fullOf(f)) &&
        !/개념을 이해하는 데 맞는 설명은\?/.test(fullOf(f)),
    );
    expect(bareTitleJosa).toEqual([]);
  });
  it("gives every guided exercise a concrete changed output", () => {
    const bad = files.filter((f) => !/바꾼 뒤 출력은/.test(fullOf(f)));
    expect(bad).toEqual([]);
  });
  it("gives every what-if a modified program, a prediction prompt, and a solution", () => {
    const bad = files.filter((f) => {
      const sec = sectionOf(bodyOf(f), "결과 예측과 작은 변경");
      return !(
        sec.includes("```") &&
        sec.includes("먼저 예측") &&
        sec.includes("해설") &&
        sec.includes("```text")
      );
    });
    expect(bad).toEqual([]);
  });
  it("day 92 distinguishes assert verification from output display", () => {
    const body = bodyOf("day-92-capstone-release.md");
    expect(body).toContain("assert는 기대값을 검증");
    expect(body).toContain("관여하지 않습니다");
  });
  it("representative what-ifs state their verified modified outputs", () => {
    expect(
      sectionOf(bodyOf("day-59-queue.md"), "결과 예측과 작은 변경"),
    ).toContain("```text\nA!\n```");
    expect(
      sectionOf(bodyOf("day-26-c-array.md"), "결과 예측과 작은 변경"),
    ).toContain("```text\n30\n```");
    expect(
      sectionOf(bodyOf("day-92-capstone-release.md"), "결과 예측과 작은 변경"),
    ).toContain("추가된 assert도 통과하므로");
  });
  it("gives every debug exercise a pointed wrong line and fix", () => {
    // NOTE: yaml.dump folds long scalars at width 110, so phrases can span
    // a soft line break in the raw file; collapse whitespace before matching.
    const bad = files.filter((f) => {
      const flat = fullOf(f).replace(/\s+/g, " ");
      return !flat.includes("틀린 줄은") || !flat.includes("고친 줄");
    });
    expect(bad).toEqual([]);
  });
  it("gives every output quiz a reason beyond the trace", () => {
    // NOTE: same yaml folding as above; match against flattened text.
    const bad = files.filter(
      (f) =>
        !fullOf(f)
          .replace(/\s+/g, " ")
          .includes("다른 선택지는 이 추적과 맞지 않습니다"),
    );
    expect(bad).toEqual([]);
  });
  it("pins day 77 redesigned debug outputs 0 and 3", () => {
    const flat = fullOf("day-77-search-sort-review.md").replace(/\s+/g, " ");
    expect(flat).toContain("위치는 0");
    expect(flat).toContain("`3`이 됩니다");
  });
  it("pins day 85 TypeError debug and 35 fix", () => {
    const flat = fullOf("day-85-python-csv-parse.md").replace(/\s+/g, " ");
    expect(flat).toContain("TypeError");
    expect(flat).toContain("`35`");
  });
  it("states day 26 out-of-bounds as undefined behavior without promising outputs", () => {
    const flat = fullOf("day-26-c-array.md").replace(/\s+/g, " ");
    expect(flat).toContain("정의되지 않은 동작");
    expect(flat).not.toContain("나오지 않습니다");
  });
  it("states day 92 total unchanged by the added assert", () => {
    expect(fullOf("day-92-capstone-release.md")).toContain("total은 계속 60");
  });
  it("contains no bare find-it imperatives in generated lessons", () => {
    const bad = files.filter((f) =>
      fullOf(f).replace(/\s+/g, " ").includes("찾으세요"),
    );
    expect(bad).toEqual([]);
  });
  it("manages debug fixtures as classified data", () => {
    const src = readFileSync(
      resolve(process.cwd(), "scripts/debug_fixtures.py"),
      "utf8",
    );
    expect(src).toContain("    12: (");
    expect(src).toContain("    77: (");
    expect(src).toContain("    85: (");
    const rows = [
      ...src.matchAll(
        /^\s+(\d+): \(".*", ".*", ".*", "([a-z-]+)", (True|False)\),$/gm,
      ),
    ];
    expect(rows.length).toBe(89);
    const classes = new Set([
      "compile-error",
      "runtime-error",
      "infinite-loop",
      "wrong-output",
      "undefined-behavior",
      "same-output-contract",
    ]);
    for (const row of rows) {
      expect(classes.has(row[2]!)).toBe(true);
      if (row[2]! === "undefined-behavior") expect(row[3]!).toBe("True");
    }
  });
  it("classifies C out-of-bounds fixtures statically", () => {
    for (const f of [
      "day-26-c-array.md",
      "day-30-pointer-arithmetic.md",
      "day-34-array-pointer.md",
      "day-46-c-file.md",
      "day-60-circular-queue.md",
      "day-88-c-aggregation.md",
    ]) {
      expect(fullOf(f)).toContain("정의되지 않은 동작");
    }
  });
  it("leaves sample lessons untouched by generation", () => {
    for (const f of [
      "day-01-variables-types.md",
      "day-29-references-borrowing.md",
      "day-57-stack.md",
    ]) {
      const s = fullOf(f);
      expect(s).not.toContain("2026.10-f");
      expect(s).not.toContain("틀린 줄은");
    }
  });
  it("keeps the content validator strict on frontmatter newlines", () => {
    const src = readFileSync(
      resolve(process.cwd(), "scripts/validate-content/index.ts"),
      "utf8",
    );
    expect(src).toContain("^---\\n");
    expect(src).not.toContain("\\r");
  });
});
