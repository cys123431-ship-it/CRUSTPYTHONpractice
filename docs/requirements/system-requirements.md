# System requirements

## Product

One learner studies C17, Python, and Rust 2024 from 2026-10-01 through 2026-12-31. Each Day uses one Anchor language and transfers the mental model to the other two. The user can read, type, debug, answer retrieval questions, run supported examples, save progress, and review on phone or desktop.

## Functional baseline

- Content-driven Day routes with stable IDs and prerequisite DAG validation.
- Worked explanation, line-level code, execution trace, progressive exercises, comparison, quiz, summary, and completion.
- IndexedDB progress repository with versioned snapshot export/import.
- Adaptive review starting from +1/+3/+7/+14/+30 days.
- Lazy Pyodide Worker execution with timeout/cancel/reset.
- Explicit prepared WebAssembly demos for C/Rust; no fake arbitrary compilation.
- Progressive PWA caching that never blocks online learning.

## Non-functional baseline

- Astro static output, TypeScript strict, Markdown-first content, Tailwind semantic tokens.
- WCAG 2.2 AA target; keyboard, reflow, contrast, status announcements.
- Initial lesson JS target 120 KB gzip, CSS 40 KB gzip, Pyodide 0 bytes before Run.
- No login, backend, analytics, secrets, third-party tracking, or textbook copying.

## Release rule

GitHub `cys123431-ship-it/CRUSTPYTHONpractice` is canonical. A Sites version references a tested commit SHA and records any platform difference.
