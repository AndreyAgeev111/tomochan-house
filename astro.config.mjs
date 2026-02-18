import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://tomochan-house.jp",
  base: "/",
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("#"),
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
