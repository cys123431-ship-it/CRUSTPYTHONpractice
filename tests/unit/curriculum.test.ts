import { describe, expect, it } from "vitest";
import { validateCurriculum } from "../../src/domain/curriculum/validate";
import type { DaySummary } from "../../src/domain/curriculum/types";

const day = (
  id: string,
  dayNumber: number,
  prerequisites: string[] = [],
): DaySummary => ({
  id,
  dayNumber,
  prerequisites,
  title: id,
  phaseId: "phase-01",
  anchorLanguage: "python",
  estimatedMinutes: 60,
});

describe("curriculum prerequisite validation", () => {
  it("accepts an ordered DAG", () =>
    expect(validateCurriculum([day("a", 1), day("b", 2, ["a"])])).toEqual([]));
  it("rejects a missing reference", () =>
    expect(validateCurriculum([day("a", 1, ["missing"])])).toContainEqual(
      expect.objectContaining({ code: "MISSING_REFERENCE" }),
    ));
  it("rejects a cycle", () =>
    expect(
      validateCurriculum([day("a", 1, ["b"]), day("b", 2, ["a"])]),
    ).toContainEqual(expect.objectContaining({ code: "CYCLE" })));
  it("rejects future prerequisites", () =>
    expect(
      validateCurriculum([day("a", 1, ["b"]), day("b", 2)]),
    ).toContainEqual(expect.objectContaining({ code: "FUTURE_PREREQUISITE" })));
});
