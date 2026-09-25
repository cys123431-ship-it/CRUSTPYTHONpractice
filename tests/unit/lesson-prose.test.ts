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
const bodyOf = (f: string) => {
  const s = readFileSync(join(dir, f), "utf8");
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
});
