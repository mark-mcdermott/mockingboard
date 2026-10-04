// @ts-check
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

// Pure static output — the board runs entirely in the browser and nothing
// here needs SSR, so no adapter.
export default defineConfig({
  site: "https://mockingboard.design",
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
})
