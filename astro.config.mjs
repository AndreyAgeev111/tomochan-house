import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://tomochan-house.jp",
  base: "/",
  integrations: [react()],
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
