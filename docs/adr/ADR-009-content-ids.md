# ADR-009: Immutable content IDs and schema versions

**Status:** Accepted

**Context:** Titles and filenames can change while stored progress must remain valid.

**Options:** Use titles; use route filenames; use immutable IDs with version metadata.

**Decision:** Every Day, exercise, and quiz has a stable ID; snapshots carry schema and content versions.

**Rationale:** Allows content edits and storage migrations without silently losing progress.

**Consequences:** Duplicate, missing, cyclic, future, or unknown references fail validation.

**References:** `src/content.config.ts` and content validator.
