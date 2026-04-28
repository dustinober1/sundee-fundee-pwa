import { expect, test } from "@playwright/test";

function firstExerciseFieldset(page: import("@playwright/test").Page) {
  return page.locator("form#program-session fieldset").first();
}

test.describe("/app local-only replacement path", () => {
  test.beforeEach(async ({ context }) => {
    // IndexedDB/localStorage state can leak between runs; force a clean browser context.
    await context.clearCookies();
    await context.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test("can complete a bundled program session locally and see persisted counts after reload", async ({ page }) => {
    await page.goto("/app");

    // Onboarding: choose local-only (no account).
    await page.getByRole("button", { name: "Keep data on this device." }).click();

    await page.getByRole("button", { name: "Programs" }).click();
    await expect(page.getByRole("heading", { name: "Programs" })).toBeVisible({ timeout: 30_000 });

    // Enroll in the bundled program and wait for local state to reflect an active session.
    await page.getByRole("button", { name: "Enroll" }).click();

    // Enrollment is async; poll for session UI to appear by refreshing local state.
    // (Avoid sleeps; use deterministic reloads/visible assertions.)
    for (let attempt = 0; attempt < 6; attempt += 1) {
      if (await page.locator("form#program-session").count()) break;
      await page.reload();
      // Reload lands on Today; navigate back to Programs for the session form.
      await expect(page.getByRole("heading", { name: "Today" })).toBeVisible({ timeout: 30_000 });
      await page.getByRole("button", { name: "Programs" }).click();
      await expect(page.getByRole("heading", { name: "Programs" })).toBeVisible({ timeout: 30_000 });
    }

    await expect(page.locator("form#program-session")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: "Complete session" })).toBeVisible({ timeout: 30_000 });

    const completeButton = page.getByRole("button", { name: "Complete session" });
    await expect(completeButton).toBeVisible({ timeout: 30_000 });

    const firstRow = firstExerciseFieldset(page);

    // Happy-path inputs.
    await firstRow.locator('input[name$="-weight"]').fill("95");
    await firstRow.locator('input[name$="-reps"]').fill("5");

    // Negative test: reps=0 should block completion and expose invalid helper state.
    await firstRow.locator('input[name$="-reps"]').fill("0");
    await expect(completeButton).toBeDisabled();
    await expect(page.getByText("Reps must be at least 1.")).toBeVisible();

    // Restore valid reps and complete.
    await firstRow.locator('input[name$="-reps"]').fill("5");
    await expect(completeButton).toBeEnabled();
    await completeButton.click();

    // After completion we should land on Today with refreshed counts.
    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("heading", { name: "Local only" })).toBeVisible();

    const workoutsStat = page
      .getByRole("paragraph")
      .filter({ hasText: "Workouts" })
      .first()
      .locator("..")
      .getByRole("paragraph")
      .first();
    const liftsStat = page
      .getByRole("paragraph")
      .filter({ hasText: "Lifts" })
      .first()
      .locator("..")
      .getByRole("paragraph")
      .first();
    const programsStat = page
      .getByRole("paragraph")
      .filter({ hasText: "Programs" })
      .first()
      .locator("..")
      .getByRole("paragraph")
      .first();

    await expect(workoutsStat).toHaveText("1", { timeout: 30_000 });
    await expect(liftsStat).toHaveText("1", { timeout: 30_000 });
    await expect(programsStat).toHaveText("1", { timeout: 30_000 });

    // Persistence proof: reload and ensure local-only mode + counts remain.
    await page.reload();
    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("heading", { name: "Local only" })).toBeVisible();
    await expect(workoutsStat).toHaveText("1", { timeout: 30_000 });
    await expect(liftsStat).toHaveText("1", { timeout: 30_000 });
    await expect(programsStat).toHaveText("1", { timeout: 30_000 });
  });
});
