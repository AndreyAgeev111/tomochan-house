import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://tomochan-house.jp",
  base: "/",
  output: "static",
  integrations: [
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split React Lightbox styles
            lightbox: ["yet-another-react-lightbox/styles.css"],
          },
        },
      },
    },
  },
});
