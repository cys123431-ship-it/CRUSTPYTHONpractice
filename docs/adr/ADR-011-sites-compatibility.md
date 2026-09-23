# ADR-011: ChatGPT Sites compatibility

**Status:** Accepted

**Context:** Canonical source is Astro while Sites accepts a validated static artifact.

**Options:** Replace Astro with a Sites-specific SPA; maintain two UIs; deploy Astro `dist/` directly.

**Decision:** Keep one Astro source and publish its static `dist/` via `.openai/hosting.json`.

**Rationale:** Sites supports the required static entrypoint, so no compatibility presentation layer is necessary.

**Consequences:** Device-local APIs work normally; no server runtime, account sync, or secret storage is introduced.

**References:** Sites managed-Linux static output requirements.
