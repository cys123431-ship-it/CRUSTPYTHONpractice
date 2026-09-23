import { useEffect, useState } from "react";
import type { ReviewRecord } from "../../domain/progress/types";
import {
  rescheduleReview,
  type ReviewResult,
} from "../../domain/review/scheduler";
import { progressRepository } from "../../infrastructure/indexeddb/progressRepository";

export default function ReviewCenter({
  titles,
}: {
  titles: Record<string, string>;
}) {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    progressRepository
      .getDueReviews()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);
  const answer = async (review: ReviewRecord, result: ReviewResult) => {
    await progressRepository.saveReviews([
      rescheduleReview(review, result, new Date()),
    ]);
    setReviews((current) =>
      current.filter(
        (item) =>
          !(
            item.lessonId === review.lessonId &&
            item.intervalIndex === review.intervalIndex
          ),
      ),
    );
  };
  if (loading)
    return (
      <div className="card empty-state" role="status">
        복습 일정을 확인하는 중…
      </div>
    );
  if (!reviews.length)
    return (
      <div className="card empty-state">
        <span aria-hidden="true">✓</span>
        <h2>오늘 예정된 복습이 없습니다</h2>
        <p>
          Day를 완료하면 +1, +3, +7, +14, +30일 간격을 시작점으로 복습이
          등록됩니다.
        </p>
      </div>
    );
  return (
    <div className="review-list">
      {reviews.map((review) => (
        <article
          className="card review-card"
          key={`${review.lessonId}-${review.intervalIndex}`}
        >
          <div>
            <span className="tag">복습 {review.intervalIndex + 1}</span>
            <h2>{titles[review.lessonId] ?? review.lessonId}</h2>
            <a href={`/learn/${review.lessonId}`}>Lesson 다시 보기</a>
          </div>
          <div className="confidence" aria-label="복습 결과">
            <button onClick={() => answer(review, "incorrect")}>틀림</button>
            <button onClick={() => answer(review, "correct-uncertain")}>
              정답 · 불확실
            </button>
            <button onClick={() => answer(review, "correct-confident")}>
              정답 · 확실
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
