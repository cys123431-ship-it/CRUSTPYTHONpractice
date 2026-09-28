import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Lesson tables scroll sideways on narrow screens (display: block; overflow-x:
// auto), so keyboard users must be able to focus them to scroll (WCAG 2.1.1).
function rehypeFocusableTables() {
  const visit = (node) => {
    if (node.type === "element" && node.tagName === "table")
      node.properties = { ...node.properties, tabIndex: 0 };
    for (const child of node.children ?? []) visit(child);
  };
  return visit;
}

export default defineConfig({
  output: "static",
  integrations: [react()],
  markdown: {
    rehypePlugins: [rehypeFocusableTables],
  },
  vite: {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
    },
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("idb")) return "progress-storage";
            return undefined;
          },
        },
      },
    },
  },
});
