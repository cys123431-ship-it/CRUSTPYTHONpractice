import type { Language } from "../curriculum/types";

export type RunStatus =
  | "ready"
  | "loading"
  | "running"
  | "success"
  | "error"
  | "timeout"
  | "cancelled";

export interface RunRequest {
  language: Language;
  source: string;
  stdin: string;
  timeoutMs: number;
}

export interface RunResult {
  status: RunStatus;
  stdout: string;
  stderr: string;
  durationMs: number;
  diagnostics: string[];
}

export interface Runner {
  prepare(): Promise<void>;
  run(request: RunRequest): Promise<RunResult>;
  cancel(runId?: string): void;
  dispose(): void;
}
