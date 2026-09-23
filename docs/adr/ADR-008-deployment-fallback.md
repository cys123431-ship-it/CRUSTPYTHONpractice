# ADR-008: Deployment fallback policy

**Status:** Accepted

**Context:** ChatGPT Sites is the required user-facing target; static-host fallback may be needed only if platform capability blocks it.

**Options:** Cloudflare Pages primary; Sites primary; dual uncontrolled deployments.

**Decision:** Publish tested Astro static output to Sites. Use another static host only as an explicitly recorded fallback or preview.

**Rationale:** Matches the requested product target while preserving portable output.

**Consequences:** Each release records Sites parity and any constraint.

**References:** ChatGPT Sites project instructions.
