# Project guardrails

- Do not introduce a backend without explicit approval.
- Do not convert the project into a full SPA.
- Do not hard-code curriculum content inside UI components.
- Do not place all progress in one localStorage blob.
- Do not pretend arbitrary C/Rust source is compiled in-browser.
- Do not eagerly load Pyodide.
- Do not weaken tests to make CI green.
- Do not copy textbook prose, problems, or images.
- Do not make architecture-changing decisions without an ADR.
- Do not expose secrets client-side.
- Do not delete unrelated existing user work.
- GitHub repository `CRUSTPYTHONpractice` is the canonical source of truth.
- ChatGPT Sites is the final user-facing deployment target.
- Do not assume automatic GitHub-to-Sites two-way sync unless officially verified.
- Before completing a task, run relevant validation and tests.
