export type Language = "c" | "python" | "rust";

export interface DaySummary {
  id: string;
  dayNumber: number;
  title: string;
  phaseId: string;
  anchorLanguage: Language;
  estimatedMinutes: number;
  prerequisites: string[];
}

export interface ValidationIssue {
  code:
    | "DUPLICATE_ID"
    | "MISSING_REFERENCE"
    | "SELF_REFERENCE"
    | "CYCLE"
    | "FUTURE_PREREQUISITE";
  entityId: string;
  referenceId?: string;
}
