# Architecture overview

```text
Markdown content -> Astro collection/schema -> static routes
                                      |
Pure domain (curriculum, review, runner contracts)
                                      |
Application islands (exercise, quiz, progress, playground)
                                      |
Ports -> IndexedDB / Pyodide Worker / prepared WASM adapters
```

Static HTML remains the default. React islands hydrate only interactive learning surfaces. Domain modules do not import DOM, Astro, IndexedDB, or Pyodide. UI calls repository and runner contracts rather than platform APIs directly.

The production build is Astro `dist/`, which ChatGPT Sites publishes as static assets. This retains the canonical Astro architecture without a separate SPA presentation layer.
