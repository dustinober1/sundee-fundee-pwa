# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: parity-app.spec.ts >> /app local-only replacement path >> can complete a bundled program session locally and see persisted counts after reload
- Location: tests/e2e/parity-app.spec.ts:17:7

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
            - button "Programs" [active] [ref=e13]
            - button "Data" [ref=e14]
          - link "Donate" [ref=e15] [cursor=pointer]:
            - /url: /donate
        - generic [ref=e16]:
          - generic [ref=e19]:
            - paragraph [ref=e20]: Local only
            - heading "Programs" [level=1] [ref=e21]
          - generic [ref=e23]:
            - generic [ref=e24]:
              - generic [ref=e25]:
                - paragraph [ref=e26]: Program
                - heading "The First Margarita" [level=2] [ref=e27]
                - paragraph [ref=e28]: Enroll in the bundled 8-week strength block and surface today's programmed session.
              - generic [ref=e29]:
                - button "Enroll" [ref=e30]
                - paragraph [ref=e31]: Enrollment stays on this device unless you enable cloud sync.
            - paragraph [ref=e32]: Loading session…
  - button "Open Next.js Dev Tools" [ref=e38] [cursor=pointer]:
    - img [ref=e39]
  - alert [ref=e42]
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | function firstExerciseFieldset(page: import("@playwright/test").Page) {
  4   |   return page.locator("form#program-session fieldset").first();
  5   | }
  6   | 
  7   | test.describe("/app local-only replacement path", () => {
  8   |   test.beforeEach(async ({ context }) => {
  9   |     // IndexedDB/localStorage state can leak between runs; force a clean browser context.
  10  |     await context.clearCookies();
  11  |     await context.addInitScript(() => {
  12  |       window.localStorage.clear();
  13  |       window.sessionStorage.clear();
  14  |     });
  15  |   });
  16  | 
  17  |   test("can complete a bundled program session locally and see persisted counts after reload", async ({ page }) => {
  18  |     await page.goto("/app");
  19  | 
  20  |     // Onboarding: choose local-only (no account).
  21  |     await page.getByRole("button", { name: "Keep data on this device." }).click();
  22  | 
  23  |     await page.getByRole("button", { name: "Programs" }).click();
  24  |     await expect(page.getByRole("heading", { name: "Programs" })).toBeVisible({ timeout: 30_000 });
  25  | 
  26  |     // Enroll in the bundled program and wait for local state to reflect an active session.
  27  |     await page.getByRole("button", { name: "Enroll" }).click();
  28  | 
  29  |     // Enrollment is async; poll for session UI to appear by refreshing local state.
  30  |     // (Avoid sleeps; use deterministic reloads/visible assertions.)
  31  |     for (let attempt = 0; attempt < 6; attempt += 1) {
  32  |       if (await page.locator("form#program-session").count()) break;
  33  |       await page.reload();
  34  |       // Reload lands on Today; navigate back to Programs for the session form.
  35  |       await expect(page.getByRole("heading", { name: "Today" })).toBeVisible({ timeout: 30_000 });
  36  |       await page.getByRole("button", { name: "Programs" }).click();
  37  |       await expect(page.getByRole("heading", { name: "Programs" })).toBeVisible({ timeout: 30_000 });
  38  |     }
  39  | 
> 40  |     await expect(page.locator("form#program-session")).toBeVisible({ timeout: 30_000 });
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  41  |     await expect(page.getByRole("button", { name: "Complete session" })).toBeVisible({ timeout: 30_000 });
  42  | 
  43  |     const completeButton = page.getByRole("button", { name: "Complete session" });
  44  |     await expect(completeButton).toBeVisible({ timeout: 30_000 });
  45  | 
  46  |     const firstRow = firstExerciseFieldset(page);
  47  | 
  48  |     // Happy-path inputs.
  49  |     await firstRow.locator('input[name$="-weight"]').fill("95");
  50  |     await firstRow.locator('input[name$="-reps"]').fill("5");
  51  | 
  52  |     // Negative test: reps=0 should block completion and expose invalid helper state.
  53  |     await firstRow.locator('input[name$="-reps"]').fill("0");
  54  |     await expect(completeButton).toBeDisabled();
  55  |     await expect(page.getByText("Reps must be at least 1.")).toBeVisible();
  56  | 
  57  |     // Restore valid reps and complete.
  58  |     await firstRow.locator('input[name$="-reps"]').fill("5");
  59  |     await expect(completeButton).toBeEnabled();
  60  |     await completeButton.click();
  61  | 
  62  |     // After completion we should land on Today with refreshed counts.
  63  |     await expect(page.getByRole("heading", { name: "Today" })).toBeVisible({ timeout: 30_000 });
  64  |     await expect(page.getByRole("heading", { name: "Local only" })).toBeVisible();
  65  | 
  66  |     const workoutsStat = page
  67  |       .getByRole("paragraph")
  68  |       .filter({ hasText: "Workouts" })
  69  |       .first()
  70  |       .locator("..")
  71  |       .getByRole("paragraph")
  72  |       .first();
  73  |     const liftsStat = page
  74  |       .getByRole("paragraph")
  75  |       .filter({ hasText: "Lifts" })
  76  |       .first()
  77  |       .locator("..")
  78  |       .getByRole("paragraph")
  79  |       .first();
  80  |     const programsStat = page
  81  |       .getByRole("paragraph")
  82  |       .filter({ hasText: "Programs" })
  83  |       .first()
  84  |       .locator("..")
  85  |       .getByRole("paragraph")
  86  |       .first();
  87  | 
  88  |     await expect(workoutsStat).toHaveText("1", { timeout: 30_000 });
  89  |     await expect(liftsStat).toHaveText("1", { timeout: 30_000 });
  90  |     await expect(programsStat).toHaveText("1", { timeout: 30_000 });
  91  | 
  92  |     // Persistence proof: reload and ensure local-only mode + counts remain.
  93  |     await page.reload();
  94  |     await expect(page.getByRole("heading", { name: "Today" })).toBeVisible({ timeout: 30_000 });
  95  |     await expect(page.getByRole("heading", { name: "Local only" })).toBeVisible();
  96  |     await expect(workoutsStat).toHaveText("1", { timeout: 30_000 });
  97  |     await expect(liftsStat).toHaveText("1", { timeout: 30_000 });
  98  |     await expect(programsStat).toHaveText("1", { timeout: 30_000 });
  99  |   });
  100 | });
  101 | 
```