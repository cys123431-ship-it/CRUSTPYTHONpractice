# ADR-004: Pyodide in a lazy Worker

**Status:** Accepted

**Context:** Python must run in a static site without blocking lesson rendering.

**Options:** Remote compiler; main-thread Pyodide; lazy Web Worker.

**Decision:** Create a Worker only after Run, load pinned Pyodide there, and terminate on cancel or timeout.

**Rationale:** Preserves main-thread responsiveness and avoids Python payload on ordinary lessons.

**Consequences:** First execution needs network and startup time; Worker isolation is not treated as a complete security boundary.

**References:** Pyodide Web Worker guide.
