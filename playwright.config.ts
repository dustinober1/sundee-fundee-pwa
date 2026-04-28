import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: process.env.CI ? [["list"]] : [["list"], ["html", { open: "never" }]],
  timeout: 90_000,
  expect: { timeout: 10_000 },
  outputDir: "./test-results/playwright",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100",
    // Ensure a clean slate for IndexedDB/localStorage-backed flows.
    storageState: undefined,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://127.0.0.1:3100/app",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
