# ADR-012: GitHub canonical source and Site sync

**Status:** Accepted

**Context:** Sites publication and GitHub history must not diverge silently.

**Options:** Edit only in Sites; assume automatic two-way sync; push exact source then save a matching Site version.

**Decision:** GitHub is canonical. Build and push the exact commit before saving and publishing the corresponding Sites version.

**Rationale:** A commit SHA provides an auditable source-to-deployment link.

**Consequences:** Any later Site-side change must be reverse-applied to GitHub or documented as divergence.

**References:** Sites hosting workflow and deployment record.
