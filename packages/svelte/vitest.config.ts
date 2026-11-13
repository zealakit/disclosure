import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    svelte({
      hot: false,
      compilerOptions: {
        runes: true,
      },
    }),
    svelteTesting(),
  ],
  test: {
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.ts"],
  },
});
