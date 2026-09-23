# ADR-003: IndexedDB persistence

**Status:** Accepted

**Context:** Progress, drafts, attempts, and review schedules exceed preference-sized storage.

**Options:** localStorage blob; IndexedDB records; cloud database.

**Decision:** Use versioned IndexedDB stores behind `ProgressRepository`; keep only theme in localStorage.

**Rationale:** Structured local persistence works offline without an account or backend.

**Consequences:** Users need JSON export/import for device changes and backup.

**References:** MDN IndexedDB and StorageManager persistence.
