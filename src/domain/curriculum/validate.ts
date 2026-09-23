import type { DaySummary, ValidationIssue } from "./types";

export function validateCurriculum(days: DaySummary[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const byId = new Map<string, DaySummary>();

  for (const day of days) {
    if (byId.has(day.id))
      issues.push({ code: "DUPLICATE_ID", entityId: day.id });
    byId.set(day.id, day);
  }

  for (const day of days) {
    for (const prerequisite of day.prerequisites) {
      if (prerequisite === day.id) {
        issues.push({
          code: "SELF_REFERENCE",
          entityId: day.id,
          referenceId: prerequisite,
        });
        continue;
      }
      const target = byId.get(prerequisite);
      if (!target) {
        issues.push({
          code: "MISSING_REFERENCE",
          entityId: day.id,
          referenceId: prerequisite,
        });
      } else if (target.dayNumber >= day.dayNumber) {
        issues.push({
          code: "FUTURE_PREREQUISITE",
          entityId: day.id,
          referenceId: prerequisite,
        });
      }
    }
  }

  const state = new Map<string, "visiting" | "done">();
  const walk = (id: string): void => {
    if (state.get(id) === "visiting") {
      issues.push({ code: "CYCLE", entityId: id });
      return;
    }
    if (state.get(id) === "done") return;
    state.set(id, "visiting");
    for (const next of byId.get(id)?.prerequisites ?? [])
      if (byId.has(next)) walk(next);
    state.set(id, "done");
  };
  for (const id of byId.keys()) walk(id);
  return issues;
}
