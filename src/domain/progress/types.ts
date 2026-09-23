export const PROGRESS_SCHEMA_VERSION = 1 as const;
export const COURSE_CONTENT_VERSION = "2026.10-c";

export interface ReviewRecord {
  lessonId: string;
  dueAt: string;
  intervalIndex: number;
  lastResult?: "correct-confident" | "correct-uncertain" | "incorrect";
}

export interface LessonProgress {
  id: string;
  completed: boolean;
  completedAt?: string;
  quizScore?: number;
  exerciseDrafts: Record<string, string>;
  exerciseAttempts: Record<string, boolean>;
  updatedAt: string;
}

export interface ProgressSnapshot {
  schemaVersion: typeof PROGRESS_SCHEMA_VERSION;
  courseContentVersion: string;
  createdAt: string;
  updatedAt: string;
  lessons: LessonProgress[];
  reviews: ReviewRecord[];
}

export interface ProgressRepository {
  getLessonProgress(id: string): Promise<LessonProgress | undefined>;
  getAllLessonProgress(): Promise<LessonProgress[]>;
  saveLessonProgress(progress: LessonProgress): Promise<void>;
  saveExerciseAttempt(
    lessonId: string,
    exerciseId: string,
    correct: boolean,
  ): Promise<void>;
  saveDraft(lessonId: string, exerciseId: string, draft: string): Promise<void>;
  getDueReviews(now?: Date): Promise<ReviewRecord[]>;
  saveReviews(records: ReviewRecord[]): Promise<void>;
  exportSnapshot(): Promise<ProgressSnapshot>;
  importSnapshot(snapshot: ProgressSnapshot): Promise<void>;
  reset(): Promise<void>;
}
