import { test, expect } from "@playwright/test";

test("debug program session transition", async ({ page, context }) => {
  await context.clearCookies();
  await context.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  await page.goto("/app");
  await page.getByRole("button", { name: "Keep data on this device." }).click();
  await page.getByRole("button", { name: "Programs" }).click();
  await expect(page.getByRole("heading", { name: "Programs" })).toBeVisible({ timeout: 30000 });

  await page.getByRole("button", { name: "Enroll" }).click();

  for (let i = 0; i < 8; i += 1) {
    const hasForm = (await page.locator("form#program-session").count()) > 0;
    const heading = await page.getByRole("heading").first().textContent().catch(() => null);
    const body = await page.locator("body").innerText();
    console.log(`attempt=${i} hasForm=${hasForm} heading=${heading}`);
    console.log(body.slice(0, 1200));
    if (hasForm) {
      await expect(page.locator("form#program-session")).toBeVisible();
      return;
    }
    await page.reload();
    await page.getByRole("button", { name: "Programs" }).click();
    await expect(page.getByRole("heading", { name: "Programs" })).toBeVisible({ timeout: 30000 });
  }

  throw new Error("program session form never appeared");
});
