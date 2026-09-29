# ADR-006: Progressive PWA

**Status:** Accepted

**Context:** Learners need resilient access, but service-worker failure must not break online learning.

**Options:** No offline support; aggressive precache; progressive shell and visited-route caching.

**Decision:** Precache the shell and offline route, runtime-cache visited content, and never precache Pyodide.

**Rationale:** Gives useful offline behavior without a large first visit or hard dependency on the service worker.

**Consequences:** Unvisited lessons and first Python execution still require network. Content-hashed build assets (`/_astro/`) are served cache-first; navigations and files whose names stay the same between releases (such as `/pyodide-worker.js`) are network-first with a cache fallback, so an update reaches learners without bumping cache names. Content-hashed build assets (`/_astro/`) are served cache-first; navigations and files whose names stay the same between releases (such as `/pyodide-worker.js`) are network-first with a cache fallback, so an update reaches learners without bumping cache names.

**References:** MDN Service Worker API.
