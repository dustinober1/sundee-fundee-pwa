import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      "tests/**",
      ".tmp/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
});
