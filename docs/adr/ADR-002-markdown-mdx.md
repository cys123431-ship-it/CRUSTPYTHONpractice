# ADR-002: Markdown default, MDX exception

**Status:** Accepted

**Context:** Curriculum authors need content independent from UI source.

**Options:** Hard-coded components; MDX everywhere; Markdown with narrow MDX exceptions.

**Decision:** Store ordinary lessons as Markdown in Content Collections; use MDX only when a lesson requires embedded custom interaction.

**Rationale:** Markdown is easier to review and reduces executable content surface.

**Consequences:** Interactive exercises live in structured frontmatter and shared islands.

**References:** Astro Content Collections and MDX integration.
