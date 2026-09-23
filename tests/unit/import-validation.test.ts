import { describe, expect, it } from "vitest";
import { validateSnapshot } from "../../src/infrastructure/export-import/validateSnapshot";

const valid = {
  schemaVersion: 1,
  courseContentVersion: "x",
  createdAt: "2026-10-01T00:00:00Z",
  updatedAt: "2026-10-01T00:00:00Z",
  lessons: [
    {
      id: "day-01",
      completed: false,
      exerciseDrafts: {},
      exerciseAttempts: {},
      updatedAt: "2026-10-01T00:00:00Z",
    },
  ],
  reviews: [],
};
describe("progress import validation", () => {
  it("accepts a known lesson", () =>
    expect(validateSnapshot(valid, new Set(["day-01"]))).toMatchObject({
      schemaVersion: 1,
    }));
  it("rejects malformed JSON data", () =>
    expect(() => validateSnapshot({ schemaVersion: 1 }, new Set())).toThrow(
      /진도 또는 복습/,
    ));
  it("rejects unknown content IDs", () =>
    expect(() => validateSnapshot(valid, new Set(["other"]))).toThrow(
      /알 수 없는/,
    ));
  it("rejects future schema versions", () =>
    expect(() =>
      validateSnapshot({ ...valid, schemaVersion: 2 }, new Set(["day-01"])),
    ).toThrow(/지원하지 않는/));
});
