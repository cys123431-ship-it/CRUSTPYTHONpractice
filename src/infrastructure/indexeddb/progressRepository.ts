import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import {
  COURSE_CONTENT_VERSION,
  PROGRESS_SCHEMA_VERSION,
  type LessonProgress,
  type ProgressRepository,
  type ProgressSnapshot,
  type ReviewRecord,
} from "../../domain/progress/types";

interface CRPDatabase extends DBSchema {
  lessons: { key: string; value: LessonProgress };
  reviews: {
    key: string;
    value: ReviewRecord & { key: string };
    indexes: { dueAt: string };
  };
  meta: { key: string; value: { key: string; value: string } };
}

const DB_NAME = "crp-study-progress";
let connection: Promise<IDBPDatabase<CRPDatabase>> | undefined;

function database(): Promise<IDBPDatabase<CRPDatabase>> {
  if (!connection) {
    connection = openDB<CRPDatabase>(DB_NAME, PROGRESS_SCHEMA_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("lessons"))
          db.createObjectStore("lessons", { keyPath: "id" });
        if (!db.objectStoreNames.contains("reviews")) {
          const store = db.createObjectStore("reviews", { keyPath: "key" });
          store.createIndex("dueAt", "dueAt");
        }
        if (!db.objectStoreNames.contains("meta"))
          db.createObjectStore("meta", { keyPath: "key" });
      },
    });
  }
  return connection;
}

const blankLesson = (id: string): LessonProgress => ({
  id,
  completed: false,
  exerciseDrafts: {},
  exerciseAttempts: {},
  updatedAt: new Date().toISOString(),
});

function reviewKey(record: ReviewRecord): string {
  return `${record.lessonId}:${record.intervalIndex}`;
}

export class IndexedDbProgressRepository implements ProgressRepository {
  async getLessonProgress(id: string) {
    return (await database()).get("lessons", id);
  }

  async getAllLessonProgress() {
    return (await database()).getAll("lessons");
  }

  async saveLessonProgress(progress: LessonProgress) {
    await (
      await database()
    ).put("lessons", { ...progress, updatedAt: new Date().toISOString() });
  }

  async saveExerciseAttempt(
    lessonId: string,
    exerciseId: string,
    correct: boolean,
  ) {
    const current =
      (await this.getLessonProgress(lessonId)) ?? blankLesson(lessonId);
    await this.saveLessonProgress({
      ...current,
      exerciseAttempts: { ...current.exerciseAttempts, [exerciseId]: correct },
    });
  }

  async saveDraft(lessonId: string, exerciseId: string, draft: string) {
    const current =
      (await this.getLessonProgress(lessonId)) ?? blankLesson(lessonId);
    await this.saveLessonProgress({
      ...current,
      exerciseDrafts: { ...current.exerciseDrafts, [exerciseId]: draft },
    });
  }

  async getDueReviews(now = new Date()) {
    const rows = await (
      await database()
    ).getAllFromIndex(
      "reviews",
      "dueAt",
      IDBKeyRange.upperBound(now.toISOString()),
    );
    return rows.map(({ key: _key, ...record }) => record);
  }

  async saveReviews(records: ReviewRecord[]) {
    const db = await database();
    const tx = db.transaction("reviews", "readwrite");
    await Promise.all(
      records.map((record) =>
        tx.store.put({ ...record, key: reviewKey(record) }),
      ),
    );
    await tx.done;
  }

  async exportSnapshot(): Promise<ProgressSnapshot> {
    const db = await database();
    const [lessons, storedReviews, created] = await Promise.all([
      db.getAll("lessons"),
      db.getAll("reviews"),
      db.get("meta", "createdAt"),
    ]);
    const now = new Date().toISOString();
    if (!created) await db.put("meta", { key: "createdAt", value: now });
    return {
      schemaVersion: PROGRESS_SCHEMA_VERSION,
      courseContentVersion: COURSE_CONTENT_VERSION,
      createdAt: created?.value ?? now,
      updatedAt: now,
      lessons,
      reviews: storedReviews.map(({ key: _key, ...review }) => review),
    };
  }

  async importSnapshot(snapshot: ProgressSnapshot) {
    if (snapshot.schemaVersion !== PROGRESS_SCHEMA_VERSION)
      throw new Error("지원하지 않는 진도 파일 버전입니다.");
    const db = await database();
    const tx = db.transaction(["lessons", "reviews", "meta"], "readwrite");
    await Promise.all([
      tx.objectStore("lessons").clear(),
      tx.objectStore("reviews").clear(),
    ]);
    for (const lesson of snapshot.lessons)
      await tx.objectStore("lessons").put(lesson);
    for (const review of snapshot.reviews)
      await tx
        .objectStore("reviews")
        .put({ ...review, key: reviewKey(review) });
    await tx
      .objectStore("meta")
      .put({ key: "createdAt", value: snapshot.createdAt });
    await tx.done;
  }

  async reset() {
    const db = await database();
    const tx = db.transaction(["lessons", "reviews", "meta"], "readwrite");
    await Promise.all([
      tx.objectStore("lessons").clear(),
      tx.objectStore("reviews").clear(),
      tx.objectStore("meta").clear(),
    ]);
    await tx.done;
  }
}

export const progressRepository = new IndexedDbProgressRepository();
export { blankLesson };
