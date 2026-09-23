# ADR-005: Prepared C/Rust WebAssembly in V1

**Status:** Accepted

**Context:** Arbitrary C/Rust compilation would turn the learning app into compiler infrastructure.

**Options:** Fake output; remote compiler; browser toolchains; prepared WASM demos.

**Decision:** Execute only prepared WASM artifacts and mark source read-only; verify editable examples natively in CI.

**Rationale:** Demonstrates runtime behavior honestly without misrepresenting compilation.

**Consequences:** Learners cannot execute arbitrary C/Rust source in V1.

**References:** Product implementation specification sections 20–21.
