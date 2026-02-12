import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://tomochan-house.jp",
  base: "/",
  integrations: [react()],
});
