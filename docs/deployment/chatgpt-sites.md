# ChatGPT Sites deployment

- Canonical source: GitHub repository `cys123431-ship-it/CRUSTPYTHONpractice`.
- Sites artifact: Astro static output in `dist/`.
- Parity: content routes, IndexedDB progress, Python Worker runner, prepared WASM demo, responsive UX, accessibility and PWA assets are included in the static artifact.
- Constraint: progress is device-local; Sites does not add account sync. Pyodide needs a first-use network request to the pinned CDN and is not precached.
- Release record: update this file with tested commit SHA, Sites version, production URL, and smoke-test result for each release.
