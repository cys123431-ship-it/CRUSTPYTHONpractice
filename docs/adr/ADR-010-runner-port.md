# ADR-010: Runner abstraction

**Status:** Accepted

**Context:** UI behavior should remain stable across Python, prepared WASM, and a possible future remote compiler.

**Options:** Call runtimes from components; shared `Runner` port and adapters.

**Decision:** UI calls `prepare`, `run`, `cancel`, and `dispose` on a language-independent Runner contract.

**Rationale:** Keeps platform APIs out of domain and presentation logic.

**Consequences:** Each adapter returns the same status, streams, duration, and diagnostics shape.

**References:** `src/domain/runner/types.ts`.
