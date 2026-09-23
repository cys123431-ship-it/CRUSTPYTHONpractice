import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  integrations: [react()],
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
