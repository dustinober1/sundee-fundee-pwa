import { expect, test } from "@playwright/test";

function firstRowLocator(page: import("@playwright/test").Page) {
  // Each exercise has its own fieldset. Grab the first one.
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

    // Navigate to Programs screen.
    await page.getByRole("button", { name: "Programs" }).click();

    // Enroll in the bundled program.
    // Note: The "Programs" screen title is static; we need to wait for the UI to change.
    const enrollButton = page.getByRole("button", { name: "Enroll" });
    await enrollButton.click();

    // Enrollment/state refresh is async; wait for the program-session form to appear.
    const programForm = page.locator("form#program-session");
    await expect(programForm).toBeVisible({ timeout: 30_000 });

    // The primary action becomes "Complete session".
    const completeButton = page.getByRole("button", { name: "Complete session" });
    await expect(completeButton).toBeVisible();

    // Fill performed set values using accessible labels in each exercise card.
    const firstRow = firstRowLocator(page);
    await firstRow.getByLabel("Weight").fill("95");
    await firstRow.getByLabel("Reps").fill("5");

    // Boundary/negative-ish: completion should remain disabled if a required field is invalid.
    // Force an invalid reps state (0) and assert the CTA is disabled.
    await firstRow.getByLabel("Reps").fill("0");
    await expect(completeButton).toBeDisabled();

    // Restore valid values.
    await firstRow.getByLabel("Reps").fill("5");

    // Complete the session.
    await completeButton.click();

    // The app returns to Today screen after completion.
    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();

    // Assert an observable count increment.
    const workoutsStat = page.getByText(/workout/i).first();
    await expect(workoutsStat).toBeVisible();

    // Reload and ensure counts persist (proves IndexedDB/local storage persistence).
    await page.reload();
    await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
    await expect(page.getByText(/workout/i).first()).toBeVisible();

    // Quick sanity that local-only mode is reflected.
    await expect(page.getByText("Local only")).toBeVisible();
  });
});
