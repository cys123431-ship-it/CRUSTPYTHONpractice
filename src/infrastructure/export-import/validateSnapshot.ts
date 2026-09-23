import {
  PROGRESS_SCHEMA_VERSION,
  type ProgressSnapshot,
} from "../../domain/progress/types";

export function validateSnapshot(
  input: unknown,
  knownIds: ReadonlySet<string>,
): ProgressSnapshot {
  if (!input || typeof input !== "object")
    throw new Error("JSON 최상위 값은 객체여야 합니다.");
  const value = input as Partial<ProgressSnapshot>;
  if (value.schemaVersion !== PROGRESS_SCHEMA_VERSION)
    throw new Error("지원하지 않는 진도 파일 버전입니다.");
  if (!Array.isArray(value.lessons) || !Array.isArray(value.reviews))
    throw new Error("진도 또는 복습 배열이 없습니다.");
  for (const lesson of value.lessons) {
    if (!lesson || typeof lesson.id !== "string" || !knownIds.has(lesson.id))
      throw new Error("알 수 없는 Lesson ID가 있습니다.");
    if (
      typeof lesson.completed !== "boolean" ||
      typeof lesson.updatedAt !== "string"
    )
      throw new Error("Lesson 진도 형식이 올바르지 않습니다.");
    if (!lesson.exerciseDrafts || typeof lesson.exerciseDrafts !== "object")
      throw new Error("실습 초안 형식이 올바르지 않습니다.");
  }
  for (const review of value.reviews) {
    if (
      !review ||
      typeof review.lessonId !== "string" ||
      !knownIds.has(review.lessonId)
    )
      throw new Error("알 수 없는 복습 Lesson ID가 있습니다.");
    if (
      typeof review.dueAt !== "string" ||
      Number.isNaN(Date.parse(review.dueAt))
    )
      throw new Error("복습 날짜 형식이 올바르지 않습니다.");
  }
  if (
    typeof value.createdAt !== "string" ||
    typeof value.updatedAt !== "string" ||
    typeof value.courseContentVersion !== "string"
  ) {
    throw new Error("진도 메타데이터가 올바르지 않습니다.");
  }
  return value as ProgressSnapshot;
}
