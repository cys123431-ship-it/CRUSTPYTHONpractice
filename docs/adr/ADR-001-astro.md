# ADR-001: Astro static architecture

**Status:** Accepted

**Context:** Most lesson content is static while practice surfaces need isolated interactivity.

**Options:** Full SPA; server-rendered app; Astro static output with islands.

**Decision:** Use Astro static output and hydrate only interactive islands.

**Rationale:** Keeps lesson HTML fast, indexable, offline-friendly, and compatible with Sites static hosting.

**Consequences:** Cross-island state uses repository APIs; backend-only features are out of V1.

**References:** Astro islands and static output documentation.
