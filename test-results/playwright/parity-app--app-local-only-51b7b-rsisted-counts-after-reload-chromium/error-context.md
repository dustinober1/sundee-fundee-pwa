# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: parity-app.spec.ts >> /app local-only replacement path >> can complete a bundled program session locally and see persisted counts after reload
- Location: tests/e2e/parity-app.spec.ts:18:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('form#program-session')
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('form#program-session')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - main [ref=e3]:
      - generic [ref=e4]:
        - complementary [ref=e5]:
          - link "Sundee" [ref=e6] [cursor=pointer]:
            - /url: /
            - generic [ref=e7]: Sundee
          - navigation [ref=e8]:
            - button "Today" [ref=e9]
            - button "Log" [ref=e10]
            - button "Cycle" [ref=e11]
            - button "Recovery" [ref=e12]
            - button "Programs" [ref=e13]
            - button "Data" [ref=e14]
          - link "Donate" [ref=e15] [cursor=pointer]:
            - /url: /donate
        - generic [ref=e16]:
          - generic [ref=e19]:
            - paragraph [ref=e20]: Local only
            - heading "Programs" [level=1] [ref=e21]
          - generic [ref=e24]:
            - generic [ref=e25]:
              - paragraph [ref=e26]: Program
              - heading "The First Margarita" [level=2] [ref=e27]
              - paragraph [ref=e28]: Enroll in the bundled 8-week strength block and surface today's programmed session.
            - generic [ref=e29]:
              - button "Enroll" [active] [ref=e30]
              - paragraph [ref=e31]: Enrollment stays on this device unless you enable cloud sync.
  - button "Open Next.js Dev Tools" [ref=e37] [cursor=pointer]:
    - img [ref=e38]
  - alert [ref=e41]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | function firstRowLocator(page: import("@playwright/test").Page) {
  4  |   // Each exercise has its own fieldset. Grab the first one.
  5  |   return page.locator("form#program-session fieldset").first();
  6  | }
  7  | 
  8  | test.describe("/app local-only replacement path", () => {
  9  |   test.beforeEach(async ({ context }) => {
  10 |     // IndexedDB/localStorage state can leak between runs; force a clean browser context.
  11 |     await context.clearCookies();
  12 |     await context.addInitScript(() => {
  13 |       window.localStorage.clear();
  14 |       window.sessionStorage.clear();
  15 |     });
  16 |   });
  17 | 
  18 |   test("can complete a bundled program session locally and see persisted counts after reload", async ({ page }) => {
  19 |     await page.goto("/app");
  20 | 
  21 |     // Onboarding: choose local-only (no account).
  22 |     await page.getByRole("button", { name: "Keep data on this device." }).click();
  23 | 
  24 |     // Navigate to Programs screen.
  25 |     await page.getByRole("button", { name: "Programs" }).click();
  26 | 
  27 |     // Enroll in the bundled program.
  28 |     // Note: The "Programs" screen title is static; we need to wait for the UI to change.
  29 |     const enrollButton = page.getByRole("button", { name: "Enroll" });
  30 |     await enrollButton.click();
  31 | 
  32 |     // Enrollment/state refresh is async; wait for the program-session form to appear.
  33 |     const programForm = page.locator("form#program-session");
> 34 |     await expect(programForm).toBeVisible({ timeout: 30_000 });
     |                               ^ Error: expect(locator).toBeVisible() failed
  35 | 
  36 |     // The primary action becomes "Complete session".
  37 |     const completeButton = page.getByRole("button", { name: "Complete session" });
  38 |     await expect(completeButton).toBeVisible();
  39 | 
  40 |     // Fill performed set values using accessible labels in each exercise card.
  41 |     const firstRow = firstRowLocator(page);
  42 |     await firstRow.getByLabel("Weight").fill("95");
  43 |     await firstRow.getByLabel("Reps").fill("5");
  44 | 
  45 |     // Boundary/negative-ish: completion should remain disabled if a required field is invalid.
  46 |     // Force an invalid reps state (0) and assert the CTA is disabled.
  47 |     await firstRow.getByLabel("Reps").fill("0");
  48 |     await expect(completeButton).toBeDisabled();
  49 | 
  50 |     // Restore valid values.
  51 |     await firstRow.getByLabel("Reps").fill("5");
  52 | 
  53 |     // Complete the session.
  54 |     await completeButton.click();
  55 | 
  56 |     // The app returns to Today screen after completion.
  57 |     await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  58 | 
  59 |     // Assert an observable count increment.
  60 |     const workoutsStat = page.getByText(/workout/i).first();
  61 |     await expect(workoutsStat).toBeVisible();
  62 | 
  63 |     // Reload and ensure counts persist (proves IndexedDB/local storage persistence).
  64 |     await page.reload();
  65 |     await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  66 |     await expect(page.getByText(/workout/i).first()).toBeVisible();
  67 | 
  68 |     // Quick sanity that local-only mode is reflected.
  69 |     await expect(page.getByText("Local only")).toBeVisible();
  70 |   });
  71 | });
  72 | 
```