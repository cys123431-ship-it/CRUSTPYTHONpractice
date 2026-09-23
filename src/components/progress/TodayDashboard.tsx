import { useEffect, useState } from "react";
import type { Language } from "../../domain/curriculum/types";
import type { LessonProgress, ReviewRecord } from "../../domain/progress/types";
import { progressRepository } from "../../infrastructure/indexeddb/progressRepository";

interface Day {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  summary: string;
  anchorLanguage: Language;
  estimatedMinutes: number;
  phaseId: string;
}

function localDate(now: Date): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function TodayDashboard({ days }: { days: Day[] }) {
  const [today, setToday] = useState("2026-10-01");
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [due, setDue] = useState<ReviewRecord[]>([]);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    setToday(localDate(new Date()));
    Promise.all([
      progressRepository.getAllLessonProgress(),
      progressRepository.getDueReviews(),
    ])
      .then(([lessons, reviews]) => {
        setProgress(lessons);
        setDue(reviews);
      })
      .catch(() => setStorageError(true));
  }, []);

  if (!days.length) return <p>학습 일정이 아직 등록되지 않았습니다.</p>;
  const scheduled =
    days.find((day) => day.date === today) ??
    (today < days[0]!.date ? days[0]! : days.at(-1)!);
  const byId = new Map(progress.map((item) => [item.id, item]));
  const completed = progress.filter((item) => item.completed).length;
  const latest = [...progress]
    .filter((item) => !item.completed && days.some((day) => day.id === item.id))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const current =
    days.find((day) => day.id === latest?.id) ??
    (byId.get(scheduled.id)?.completed
      ? (days.find(
          (day) =>
            day.dayNumber > scheduled.dayNumber && !byId.get(day.id)?.completed,
        ) ?? scheduled)
      : scheduled);
  const queue = days
    .filter(
      (day) =>
        day.dayNumber >= current.dayNumber && !byId.get(day.id)?.completed,
    )
    .slice(0, 3);
  const phaseDays = days.filter((day) => day.phaseId === current.phaseId);
  const phaseCompleted = phaseDays.filter(
    (day) => byId.get(day.id)?.completed,
  ).length;

  return (
    <>
      <p className="eyebrow">2026.10.01 — 2026.12.31 · {days.length}일</p>
      <h1>오늘의 학습과 이어서 할 일</h1>
      <p className="muted home-intro">
        하나의 개념을 깊이 이해한 뒤 C·Python·Rust의 표현을 비교합니다.
      </p>
      {storageError && (
        <p role="status" className="notice">
          진도를 불러오지 못했습니다. 학습 페이지는 열 수 있습니다.
        </p>
      )}
      <section className="today-grid" aria-labelledby="continue-title">
        <article className="card continue-card">
          <div>
            <span className="tag">
              {current.anchorLanguage.toUpperCase()} Anchor
            </span>
            <span className="tag">약 {current.estimatedMinutes}분</span>
          </div>
          <h2 id="continue-title">
            Day {String(current.dayNumber).padStart(2, "0")} · {current.title}
          </h2>
          <p>{current.summary}</p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="전체 진도"
            aria-valuenow={Math.round((completed / days.length) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-fill"
              style={{ width: `${(completed / days.length) * 100}%` }}
            />
          </div>
          <a className="button" href={`/learn/${current.id}`}>
            {latest ? "이어서 학습" : "학습 시작"}
          </a>
        </article>
        <aside className="card queue-card" aria-label="다음 학습">
          <div className="queue-head">
            <span>다음 학습</span>
            <strong>{queue.length}개</strong>
          </div>
          <ol>
            {queue.map((day) => (
              <li key={day.id}>
                <span>{String(day.dayNumber).padStart(2, "0")}</span>
                <div>
                  <a href={`/learn/${day.id}`}>{day.title}</a>
                  <small>
                    {day.anchorLanguage.toUpperCase()} · {day.date}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </section>
      <section className="dashboard-row" aria-label="학습 현황">
        <div>
          <span className="metric">{completed}</span>
          <span>완료한 Day</span>
        </div>
        <div>
          <span className="metric">{due.length}</span>
          <span>복습 대기</span>
        </div>
        <div>
          <span className="metric">{scheduled.dayNumber}</span>
          <span>오늘 일정 Day</span>
        </div>
        <div>
          <span className="metric">
            {phaseCompleted}/{phaseDays.length}
          </span>
          <span>현재 Phase 완료</span>
        </div>
      </section>
      {due.length > 0 && (
        <p className="home-review">
          <a href="/reviews">복습 {due.length}건 확인하기</a>
        </p>
      )}
    </>
  );
}
