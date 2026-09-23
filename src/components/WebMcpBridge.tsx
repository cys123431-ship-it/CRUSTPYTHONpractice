import { useEffect } from "react";
import { scheduleInitialReviews } from "../domain/review/scheduler";
import {
  blankLesson,
  progressRepository,
} from "../infrastructure/indexeddb/progressRepository";

export default function WebMcpBridge({ knownIds }: { knownIds: string[] }) {
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const ids = new Set(knownIds);
    void Promise.resolve(
      context.registerTool(
        {
          name: "get_learning_status",
          title: "학습 현황 확인",
          description:
            "이 기기에 저장된 완료 Day와 예정된 복습 수를 확인합니다.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true, untrustedContentHint: false },
          async execute() {
            const [lessons, reviews] = await Promise.all([
              progressRepository.getAllLessonProgress(),
              progressRepository.getDueReviews(),
            ]);
            return {
              completedDayIds: lessons
                .filter((item) => item.completed)
                .map((item) => item.id),
              dueReviewCount: reviews.length,
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    void Promise.resolve(
      context.registerTool(
        {
          name: "complete_learning_day",
          title: "학습 Day 완료",
          description:
            "지정한 커리큘럼 Day를 완료 처리하고 복습 일정을 등록합니다.",
          inputSchema: {
            type: "object",
            properties: { dayId: { type: "string", enum: knownIds } },
            required: ["dayId"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          async execute(input) {
            const dayId = (input as { dayId?: unknown }).dayId;
            if (typeof dayId !== "string" || !ids.has(dayId))
              throw new Error("알 수 없는 Day ID입니다.");
            const now = new Date();
            const current =
              (await progressRepository.getLessonProgress(dayId)) ??
              blankLesson(dayId);
            await progressRepository.saveLessonProgress({
              ...current,
              completed: true,
              completedAt: now.toISOString(),
            });
            await progressRepository.saveReviews(
              scheduleInitialReviews(dayId, now),
            );
            return { dayId, completed: true, reviewCount: 5 };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);
    return () => lifecycle.abort();
  }, [knownIds]);
  return null;
}
