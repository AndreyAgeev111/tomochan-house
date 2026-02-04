import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://andreyageev111.github.io",
  base: "/tomochan-house",
  integrations: [react()],
});