import { useEffect, useState } from "react";
import type { Language } from "../../domain/curriculum/types";
import type { LessonProgress } from "../../domain/progress/types";
import { progressRepository } from "../../infrastructure/indexeddb/progressRepository";

interface Day {
  id: string;
  dayNumber: number;
  title: string;
  anchorLanguage: Language;
  estimatedMinutes: number;
}

export default function ProgressDashboard({ days }: { days: Day[] }) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    progressRepository
      .getAllLessonProgress()
      .then(setProgress)
      .finally(() => setLoading(false));
  }, []);
  const byId = new Map(progress.map((item) => [item.id, item]));
  const completed = progress.filter((item) => item.completed).length;
  const percentage = Math.round((completed / 92) * 100);
  return (
    <div className="progress-dashboard">
      <section className="card progress-summary" aria-busy={loading}>
        <div>
          <span className="eyebrow">전체 진행률</span>
          <strong>{percentage}%</strong>
          <p className="muted">92일 중 {completed}일 완료</p>
        </div>
        <div
          className="progress-ring"
          style={
            { "--progress": `${percentage * 3.6}deg` } as React.CSSProperties
          }
        >
          <span>
            {completed}
            <small>Days</small>
          </span>
        </div>
      </section>
      <section className="day-progress-list" aria-label="전체 Day 진도">
        {days.map((day) => {
          const state = byId.get(day.id);
          return (
            <article className="card" key={day.id}>
              <span className="day-number">
                DAY {String(day.dayNumber).padStart(2, "0")}
              </span>
              <div>
                <h2>{day.title}</h2>
                <p className="muted">
                  {day.anchorLanguage.toUpperCase()} Anchor ·{" "}
                  {day.estimatedMinutes}분
                </p>
              </div>
              <span
                className={`state ${state?.completed ? "done" : state ? "started" : "new"}`}
              >
                {state?.completed ? "완료" : state ? "진행 중" : "시작 전"}
              </span>
              <a className="button secondary" href={`/learn/${day.id}`}>
                {state ? "계속" : "열기"}
              </a>
            </article>
          );
        })}
      </section>
    </div>
  );
}
