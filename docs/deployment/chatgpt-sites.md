# ChatGPT Sites deployment

- Canonical source: GitHub repository `cys123431-ship-it/CRUSTPYTHONpractice`.
- Sites artifact: Astro static output in `dist/`.
- Parity: content routes, IndexedDB progress, Python Worker runner, prepared WASM demo, responsive UX, accessibility and PWA assets are included in the static artifact.
- Constraint: progress is device-local; Sites does not add account sync. Pyodide needs a first-use network request to the pinned CDN and is not precached.
- Release record: update this file with tested commit SHA, Sites version, production URL, and smoke-test result for each release.

## Release record

| Date       | Source commit | Sites update                                                 | Production URL                                      | Smoke test |
| ---------- | ------------- | ------------------------------------------------------------ | --------------------------------------------------- | ---------- |
| 2026-09-29 | `42c8dee`     | Site files replaced with the `dist/` zip in the Sites editor | https://crustpython-practice.yosubi123.chatgpt.site | Passed     |

Smoke test for `42c8dee`:

- All 129 files in `dist/` are byte-identical on the live site. The host's CDN injects a Cloudflare challenge script (`/cdn-cgi/challenge-platform/...`) into HTML responses at serve time; ignoring that script, the HTML matches too.
- Python runner: output printed before an exception is kept, tracebacks start at the learner's code, `__name__` is `"__main__"`, and names from a previous run are not defined.
- No horizontal overflow at 360px on all 92 lessons and the dashboard, curriculum, glossary, playground, reviews, progress and settings pages.
