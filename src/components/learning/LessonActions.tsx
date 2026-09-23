import { useEffect, useMemo, useState } from "react";
import type { Language } from "../../domain/curriculum/types";
import { scheduleInitialReviews } from "../../domain/review/scheduler";
import {
  blankLesson,
  progressRepository,
} from "../../infrastructure/indexeddb/progressRepository";
import CodeEditor from "../code/CodeEditor";

interface Exercise {
  id: string;
  title: string;
  kind: "predict" | "fill" | "modify" | "debug" | "independent";
  objective: string;
  prompt: string;
  starter: string;
  answer: string;
  hint: string;
  explanation: string;
  commonMistakes: string[];
  language: Language;
  verification: string;
}

interface QuizItem {
  id: string;
  question: string;
  choices: string[];
  answerIndex: number;
  explanation: string;
}

interface Props {
  dayId: string;
  exercises: Exercise[];
  quiz: QuizItem[];
}

const normalize = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s*([=+*{}();,])\s*/g, "$1");

export default function LessonActions({ dayId, exercises, quiz }: Props) {
  const [active, setActive] = useState<"practice" | "quiz">("practice");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizDone, setQuizDone] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState("진도를 불러오는 중…");
  const exercise = exercises[exerciseIndex];

  useEffect(() => {
    progressRepository
      .getLessonProgress(dayId)
      .then((value) => {
        const defaults = Object.fromEntries(
          exercises.map((item) => [
            item.id,
            item.kind === "predict" ? "" : item.starter,
          ]),
        );
        setDrafts({ ...defaults, ...(value?.exerciseDrafts ?? {}) });
        setCompleted(value?.completed ?? false);
        setStatus(
          value?.completed
            ? "완료한 Day입니다."
            : "초안은 이 기기에 자동 저장됩니다.",
        );
      })
      .catch(() =>
        setStatus("저장소를 열지 못했지만 학습은 계속할 수 있습니다."),
      );
  }, [dayId, exercises]);

  const exerciseCorrect = useMemo(
    () =>
      exercise
        ? normalize(drafts[exercise.id] ?? "") === normalize(exercise.answer)
        : false,
    [exercise, drafts],
  );
  const score = quiz.reduce(
    (total, item) => total + (answers[item.id] === item.answerIndex ? 1 : 0),
    0,
  );

  const updateDraft = (id: string, value: string) => {
    setDrafts((current) => ({ ...current, [id]: value }));
    setChecked((current) => ({ ...current, [id]: false }));
    void progressRepository.saveDraft(dayId, id, value);
  };

  const checkExercise = async () => {
    if (!exercise) return;
    setChecked((current) => ({ ...current, [exercise.id]: true }));
    // Different source code can have the same behavior. Only an exact sample
    // match can be recorded as correct without a language-specific verifier.
    if (exercise.kind === "predict" || exerciseCorrect) {
      await progressRepository.saveExerciseAttempt(
        dayId,
        exercise.id,
        exerciseCorrect,
      );
    }
  };

  const submitQuiz = async () => {
    setQuizDone(true);
    const current =
      (await progressRepository.getLessonProgress(dayId)) ?? blankLesson(dayId);
    await progressRepository.saveLessonProgress({
      ...current,
      quizScore: Math.round((score / quiz.length) * 100),
    });
  };

  const completeDay = async () => {
    const now = new Date();
    const current =
      (await progressRepository.getLessonProgress(dayId)) ?? blankLesson(dayId);
    const next = {
      ...current,
      completed: true,
      completedAt: now.toISOString(),
    };
    if (quizDone) next.quizScore = Math.round((score / quiz.length) * 100);
    await progressRepository.saveLessonProgress(next);
    await progressRepository.saveReviews(scheduleInitialReviews(dayId, now));
    setCompleted(true);
    setStatus(
      "Day를 완료했습니다. +1, +3, +7, +14, +30일 복습이 등록됐습니다.",
    );
  };

  if (!exercise) return null;

  return (
    <section className="lesson-actions" aria-labelledby="lesson-actions-title">
      <h2 id="lesson-actions-title" className="sr-only">
        실습과 회상 퀴즈
      </h2>
      <div className="action-tabs" role="tablist" aria-label="연습과 퀴즈">
        <button
          id="practice-tab"
          role="tab"
          aria-selected={active === "practice"}
          aria-controls="practice-panel"
          onClick={() => setActive("practice")}
        >
          실습 {exerciseIndex + 1}/{exercises.length}
        </button>
        <button
          id="quiz-tab"
          role="tab"
          aria-selected={active === "quiz"}
          aria-controls="quiz-panel"
          onClick={() => setActive("quiz")}
        >
          회상 퀴즈
        </button>
      </div>
      {active === "practice" ? (
        <div
          id="practice-panel"
          role="tabpanel"
          aria-labelledby="practice-tab"
          className="practice-panel card"
        >
          <div className="panel-kicker">
            {exercise.kind.toUpperCase()} · {exercise.language.toUpperCase()} ·
            예시 답안 비교
          </div>
          <h2 id="practice-title">{exercise.title}</h2>
          <p className="muted">{exercise.objective}</p>
          <p className="prompt">{exercise.prompt}</p>
          {exercise.kind !== "predict" && (
            <p className="verification-note muted">
              이 칸은 코드를 실행하거나 컴파일하지 않습니다. Python은 위 실행
              영역에서, C·Rust는 내 컴퓨터의 컴파일러에서 결과를 확인하세요.
            </p>
          )}
          {exercise.kind === "predict" ? (
            <>
              <pre className="exercise-starter">{exercise.starter}</pre>
              <label className="prediction-input">
                내 예측
                <input
                  type="text"
                  value={drafts[exercise.id] ?? ""}
                  onChange={(event) =>
                    updateDraft(exercise.id, event.target.value)
                  }
                />
              </label>
            </>
          ) : (
            <CodeEditor
              key={exercise.id}
              id={`exercise-${exercise.id}`}
              label="내 답안"
              language={exercise.language}
              value={drafts[exercise.id] ?? exercise.starter}
              onChange={(value) => updateDraft(exercise.id, value)}
            />
          )}
          <div className="exercise-actions">
            <button
              className="button secondary"
              type="button"
              onClick={() =>
                setHints((current) => ({
                  ...current,
                  [exercise.id]: !current[exercise.id],
                }))
              }
            >
              힌트 {hints[exercise.id] ? "닫기" : "보기"}
            </button>
            <button className="button" type="button" onClick={checkExercise}>
              답 확인
            </button>
          </div>
          {hints[exercise.id] && (
            <p className="hint notice">
              <strong>힌트</strong>
              <br />
              {exercise.hint}
            </p>
          )}
          {checked[exercise.id] && (
            <div
              className={`feedback ${
                exerciseCorrect
                  ? "correct"
                  : exercise.kind === "predict"
                    ? "incorrect"
                    : "neutral"
              }`}
              role="status"
            >
              <strong>
                {exerciseCorrect
                  ? "예시 답안과 일치합니다."
                  : exercise.kind === "predict"
                    ? "아직 다릅니다."
                    : "예시와 다른 풀이입니다."}
              </strong>
              <p>
                {exerciseCorrect
                  ? exercise.explanation
                  : exercise.kind === "predict"
                    ? "공백은 무시해 비교했습니다. 힌트와 실행 추적을 다시 보고 고쳐 보세요."
                    : "같은 결과를 만드는 코드는 여러 가지일 수 있으므로 오답으로 판정하지 않습니다. 실행 결과를 확인한 뒤 아래 예시 답안과 비교하세요."}
              </p>
              {!exerciseCorrect && (
                <details>
                  <summary>해설과 예시 답안</summary>
                  <pre>{exercise.answer}</pre>
                  <p>{exercise.explanation}</p>
                </details>
              )}
              <div className="common-mistakes">
                <strong>자주 하는 실수</strong>
                <ul>
                  {exercise.commonMistakes.map((mistake) => (
                    <li key={mistake}>{mistake}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="pager">
            <button
              className="button secondary"
              type="button"
              disabled={exerciseIndex === 0}
              onClick={() => setExerciseIndex((value) => value - 1)}
            >
              이전 실습
            </button>
            <button
              className="button secondary"
              type="button"
              disabled={exerciseIndex === exercises.length - 1}
              onClick={() => setExerciseIndex((value) => value + 1)}
            >
              다음 실습
            </button>
          </div>
        </div>
      ) : (
        <div
          id="quiz-panel"
          role="tabpanel"
          aria-labelledby="quiz-tab"
          className="quiz-panel card"
        >
          <h2>설명 없이 떠올려 보기</h2>
          {quiz.map((item, index) => (
            <fieldset key={item.id} disabled={quizDone}>
              <legend>
                {index + 1}. {item.question}
              </legend>
              {item.choices.map((choice, choiceIndex) => (
                <label key={choice}>
                  <input
                    type="radio"
                    name={item.id}
                    value={choiceIndex}
                    checked={answers[item.id] === choiceIndex}
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [item.id]: choiceIndex,
                      }))
                    }
                  />{" "}
                  <span>{choice}</span>
                </label>
              ))}
              {quizDone && (
                <p
                  className={
                    answers[item.id] === item.answerIndex
                      ? "quiz-correct"
                      : "quiz-wrong"
                  }
                >
                  {item.explanation}
                </p>
              )}
            </fieldset>
          ))}
          {!quizDone ? (
            <button
              className="button"
              type="button"
              onClick={submitQuiz}
              disabled={Object.keys(answers).length !== quiz.length}
            >
              퀴즈 채점
            </button>
          ) : (
            <p className="quiz-score" role="status">
              {quiz.length}문제 중 {score}문제 정답
            </p>
          )}
        </div>
      )}
      <div className="complete-row">
        <p role="status">{status}</p>
        <button
          className="button"
          type="button"
          onClick={completeDay}
          disabled={completed}
        >
          {completed ? "Day 완료됨" : "Day 완료"}
        </button>
      </div>
    </section>
  );
}
