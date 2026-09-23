# ADR-007: CodeMirror 6 with textarea fallback

**Status:** Accepted

**Context:** Exercises need an accessible editor without inflating every lesson's initial JavaScript.

**Options:** Plain textarea only; eager editor; user-triggered CodeMirror enhancement.

**Decision:** Render a labeled textarea first and lazy-load CodeMirror 6 only when the learner enables it.

**Rationale:** Protects performance and retains a robust accessibility fallback.

**Consequences:** Advanced editing is an explicit extra action.

**References:** CodeMirror 6 system guide.
