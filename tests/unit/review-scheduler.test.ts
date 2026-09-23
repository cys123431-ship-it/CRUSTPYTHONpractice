import { describe, expect, it } from "vitest";
import {
  rescheduleReview,
  scheduleInitialReviews,
} from "../../src/domain/review/scheduler";

describe("spaced review scheduler", () => {
  const now = new Date("2026-10-01T00:00:00.000Z");
  it("creates +1/+3/+7/+14/+30 day reviews", () =>
    expect(
      scheduleInitialReviews("day-01", now).map((item) =>
        item.dueAt.slice(0, 10),
      ),
    ).toEqual([
      "2026-10-02",
      "2026-10-04",
      "2026-10-08",
      "2026-10-15",
      "2026-10-31",
    ]));
  it("resets an incorrect answer to a one-day retry", () =>
    expect(
      rescheduleReview(
        { lessonId: "day-01", dueAt: now.toISOString(), intervalIndex: 3 },
        "incorrect",
        now,
      ),
    ).toMatchObject({ intervalIndex: 0, dueAt: "2026-10-02T00:00:00.000Z" }));
  it("advances a confident correct answer", () =>
    expect(
      rescheduleReview(
        { lessonId: "day-01", dueAt: now.toISOString(), intervalIndex: 1 },
        "correct-confident",
        now,
      ),
    ).toMatchObject({ intervalIndex: 2, dueAt: "2026-10-08T00:00:00.000Z" }));
});
