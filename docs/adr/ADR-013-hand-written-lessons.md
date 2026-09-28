# ADR-013: Hand-written lessons verified by execution

**Status:** Accepted (supersedes the generated-lesson pipeline in `scripts/generate-curriculum.py`)

**Context:** Days 02–92 (except the three original sample lessons) were produced by a Python template generator from short blueprints. The output repeated paragraphs, attached Korean particles to interpolated titles, and gave C and Rust only a table row, so lessons stayed far below the depth of a beginner textbook section. Regression tests pinned template sentences instead of teaching quality.

**Options:** Keep generating and patch the templates; generate a draft once and hand-edit it; write every lesson by hand and verify it by running its code.

**Decision:** Every Day is a hand-written Markdown file in `src/content/days/`. Each lesson has the fifteen shared sections, a complete runnable program in C, Python, and Rust, six exercises and at least four quiz items. The generator scripts, their data modules, and `scripts/verify-course-examples.py` are removed. `scripts/verify-lessons` compiles and runs every program block (`// 파일:` / `# 파일:`) and every runnable exercise, comparing stdout with the quoted `실행 결과:` text and checking declared compile or runtime errors. CI runs it as `pnpm lessons:verify` with GCC, Python 3 and a stable Rust toolchain.

**Rationale:** Executed examples keep hand-written prose honest without templates. Removing the generator prevents a regeneration from overwriting reviewed lessons.

**Consequences:** Editing a lesson means editing Markdown directly and running `pnpm lessons:verify <day>`. The content validator requires the three language sections and program blocks; `tests/unit/lesson-prose.test.ts` checks structure and bans the retired template sentences. Browser behavior is unchanged: only Python runs in the page (ADR-004), C and Rust remain local or prepared demos (ADR-005).

**References:** `docs/curriculum/authoring-guide.md`, `scripts/verify-lessons/index.ts`.
