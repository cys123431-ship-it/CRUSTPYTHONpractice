// Quality checks for the hand-written lessons (Days 01-92, ADR-013).
// These string checks keep every lesson on the shared structure and stop the
// retired generator's template sentences from coming back. They do NOT prove
// that explanations are semantically correct; every program block and
// exercise is compiled and executed by scripts/verify-lessons (CI).
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const dir = resolve(process.cwd(), "src/content/days");
const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
const fullOf = (f: string) => readFileSync(join(dir, f), "utf8");
const bodyOf = (f: string) => {
  const s = fullOf(f);
  return s.slice(s.indexOf("---", 3) + 3);
};
const withoutCode = (body: string) => body.replace(/```[\s\S]*?```/g, "");
const proseParagraphs = (body: string) =>
  withoutCode(body)
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/\s+/g, " "))
    .filter((p) => p.length >= 60 && !/^[|#>-]/.test(p) && !/^\d+\./.test(p));

const REQUIRED_SECTIONS = [
  "오늘 배울 내용",
  "천천히 풀어보기",
  "C로 구현하기",
  "Python으로 구현하기",
  "Rust로 구현하기",
  "실행 추적",
  "다른 예제로 다시 이해하기",
  "자주 하는 실수",
  "Q&A",
  "핵심 요약",
  "도전 문제",
];

describe("hand-written lesson structure", () => {
  it("has all 92 days", () => {
    expect(files.length).toBe(92);
  });
  it("numbers the fifteen main sections in order", () => {
    const bad = files.filter((f) => {
      const numbers = [...bodyOf(f).matchAll(/^## (\d+)\. /gm)].map((m) =>
        Number(m[1]),
      );
      return (
        numbers.join(",") !==
        Array.from({ length: 15 }, (_, i) => i + 1).join(",")
      );
    });
    expect(bad).toEqual([]);
  });
  it("includes the required sections, one per language", () => {
    const bad = files.flatMap((f) => {
      const body = bodyOf(f);
      return REQUIRED_SECTIONS.filter(
        (s) =>
          !new RegExp(`^## \\d+\\. ${s.replace(/[&]/g, "\\$&")}$`, "m").test(
            body,
          ),
      ).map((s) => `${f}: ${s}`);
    });
    expect(bad).toEqual([]);
  });
  it("shows a runnable program in each of the three languages", () => {
    const bad = files.filter((f) => {
      const body = bodyOf(f);
      return !(
        /```c\n\/\/ 파일: \S+\.c/.test(body) &&
        /```python\n# 파일: \S+\.py/.test(body) &&
        /```rust\n\/\/ 파일: \S+\.rs/.test(body)
      );
    });
    expect(bad).toEqual([]);
  });
  it("follows every program block with its real output", () => {
    const bad = files.filter((f) => {
      const blocks = bodyOf(f)
        .split(/```(?:c|python|rust)\n(?:\/\/|#) 파일: /)
        .slice(1);
      return blocks.some((b) => {
        if (/^[^\n]*\((컴파일|실행) 오류: /.test(b)) return false;
        const after = b.slice(b.indexOf("```") + 3, b.indexOf("```") + 400);
        return !after.includes("실행 결과:");
      });
    });
    expect(bad).toEqual([]);
  });
  it("uses the hand-written content version", () => {
    const bad = files.filter(
      (f) => !/^contentVersion: "2026\.10-t1"$/m.test(fullOf(f)),
    );
    expect(bad).toEqual([]);
  });
  it("offers six exercise kinds and five quiz items", () => {
    const bad = files.filter((f) => {
      const s = fullOf(f);
      const kinds = [...s.matchAll(/^ {4}kind: (\w+)$/gm)].map((m) => m[1]);
      const quiz = s.match(/^ {2}- id: quiz-/gm) ?? [];
      return (
        kinds.length !== 6 ||
        !["predict", "fill", "modify", "debug", "independent"].every((k) =>
          kinds.includes(k),
        ) ||
        quiz.length < 4
      );
    });
    expect(bad).toEqual([]);
  });
});

describe("lesson prose regressions", () => {
  it("repeats no prose paragraph within a lesson", () => {
    const bad = files.flatMap((f) => {
      const seen = new Set<string>();
      return proseParagraphs(bodyOf(f))
        .filter((p) => {
          const dup = seen.has(p);
          seen.add(p);
          return dup;
        })
        .map((p) => `${f}: ${p.slice(0, 40)}`);
    });
    expect(bad).toEqual([]);
  });
  it("uses no mechanical parenthesized josa", () => {
    const bad = files.filter((f) =>
      /\(를\)|\(가\)|\(는\)|\(이\)|\(을\)/.test(bodyOf(f)),
    );
    expect(bad).toEqual([]);
  });
  it("contains none of the retired generator's template sentences", () => {
    const templates = [
      /의 답은 `/,
      /바뀐 줄부터 다시 추적/,
      /빌림과 범위 검사를 컴파일 때/,
      /같은 입력과 출력[\s\S]{0,30}유지됩니다/,
      /개념이 필요한 상황을 예로 든다/,
      /다른 선택지는 이 추적과 맞지 않습니다/,
      /틀린 줄은 `/,
      /Python 예시를 추적하고 다른 두 언어로 옮겨/,
    ];
    const bad = files.flatMap((f) =>
      templates.filter((t) => t.test(fullOf(f))).map((t) => `${f}: ${t}`),
    );
    expect(bad).toEqual([]);
  });
  it("states C out-of-bounds access as undefined behavior", () => {
    for (const f of [
      "day-26-c-array.md",
      "day-30-pointer-arithmetic.md",
      "day-34-array-pointer.md",
      "day-60-circular-queue.md",
      "day-88-c-aggregation.md",
    ]) {
      expect(fullOf(f)).toContain("정의되지 않은 동작");
    }
  });
  it("does not claim C or Rust compile in the browser", () => {
    const bad = files.filter((f) =>
      /브라우저에서 (C|Rust)[^.\n]{0,20}(컴파일|실행)(됩니다|할 수 있습니다)/.test(
        bodyOf(f),
      ),
    );
    expect(bad).toEqual([]);
  });
  it("links every capstone day to the finished project source", () => {
    for (const f of files.filter((f) => /^day-(8[3-9]|9[0-2])-/.test(f))) {
      expect(bodyOf(f)).toContain("## Study Log Analyzer 실제 프로젝트");
      expect(bodyOf(f)).toContain("세 언어의 완성 프로젝트 소스");
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
