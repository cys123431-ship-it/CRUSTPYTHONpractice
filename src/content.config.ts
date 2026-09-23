import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const language = z.enum(["c", "python", "rust"]);
const exercise = z.object({
  id: z.string().regex(/^ex-[a-z0-9-]+$/),
  title: z.string(),
  kind: z.enum(["predict", "fill", "modify", "debug", "independent"]),
  objective: z.string(),
  prompt: z.string(),
  starter: z.string(),
  answer: z.string(),
  hint: z.string(),
  explanation: z.string(),
  commonMistakes: z.array(z.string()),
  language,
  verification: z.enum([
    "none",
    "syntax",
    "compile",
    "run",
    "expected-failure",
  ]),
});

const quizItem = z.object({
  id: z.string().regex(/^quiz-[a-z0-9-]+$/),
  question: z.string(),
  choices: z.array(z.string()).min(2),
  answerIndex: z.number().int().nonnegative(),
  explanation: z.string(),
});

const days = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/days" }),
  schema: z.object({
    schemaVersion: z.literal(1),
    contentVersion: z.string(),
    id: z.string().regex(/^day-[0-9]{2}-[a-z0-9-]+$/),
    courseId: z.literal("crp-92"),
    phaseId: z.string().regex(/^phase-[0-9]{2}$/),
    dayNumber: z.number().int().min(1).max(92),
    date: z.string().date(),
    title: z.string(),
    summary: z.string(),
    anchorLanguage: language,
    transferLanguages: z.array(language).length(2),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    estimatedMinutes: z.number().int().min(30).max(120),
    prerequisites: z.array(z.string()),
    learningObjectives: z.array(z.string()).min(2),
    concepts: z.array(z.string()).min(2),
    runnerMode: z.enum(["none", "python", "prepared-wasm"]),
    playgroundSource: z.string().optional(),
    reviewOffsets: z.array(z.number().int().positive()),
    exercises: z.array(exercise).min(2),
    quiz: z.array(quizItem).min(2),
    sample: z.boolean().default(false),
  }),
});

export const collections = { days };
