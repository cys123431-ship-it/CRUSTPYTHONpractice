import type { ReviewRecord } from "../progress/types";

export const BASE_REVIEW_OFFSETS = [1, 3, 7, 14, 30] as const;
export type ReviewResult =
  "correct-confident" | "correct-uncertain" | "incorrect";

const addDays = (date: Date, days: number): string => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString();
};

export function scheduleInitialReviews(
  lessonId: string,
  completedAt: Date,
): ReviewRecord[] {
  return BASE_REVIEW_OFFSETS.map((days, intervalIndex) => ({
    lessonId,
    dueAt: addDays(completedAt, days),
    intervalIndex,
  }));
}

export function rescheduleReview(
  record: ReviewRecord,
  result: ReviewResult,
  answeredAt: Date,
): ReviewRecord {
  const current =
    BASE_REVIEW_OFFSETS[
      Math.min(record.intervalIndex, BASE_REVIEW_OFFSETS.length - 1)
    ] ?? 1;
  let nextDays: number;
  let nextIndex = record.intervalIndex;
  if (result === "incorrect") {
    nextDays = 1;
    nextIndex = 0;
  } else if (result === "correct-uncertain") {
    nextDays = Math.max(2, Math.round(current * 1.35));
    nextIndex = Math.min(
      record.intervalIndex + 1,
      BASE_REVIEW_OFFSETS.length - 1,
    );
  } else {
    nextIndex = Math.min(
      record.intervalIndex + 1,
      BASE_REVIEW_OFFSETS.length - 1,
    );
    nextDays = BASE_REVIEW_OFFSETS[nextIndex] ?? Math.round(current * 1.8);
  }
  return {
    ...record,
    dueAt: addDays(answeredAt, nextDays),
    intervalIndex: nextIndex,
    lastResult: result,
  };
}
