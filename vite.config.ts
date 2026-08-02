// @lovable.dev/vite-tanstack-config already includes TanStack Start, React,
// Tailwind, path aliases, and Nitro. Do not add duplicate framework plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Lovable defaults production builds to Cloudflare. Netlify needs Nitro's
  // Netlify Functions output instead.
  cloudflare: false,
  nitro: {
    preset: "netlify",
    compatibilityDate: "2026-07-30",
  },
  tanstackStart: {
    // Keep the custom SSR server entry used by the application.
    server: { entry: "server" },
  },
});
