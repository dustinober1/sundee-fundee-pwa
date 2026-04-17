import { expect, test } from "@playwright/test";

// These tests run without a configured Supabase project — the proxy short-circuits
// when env vars are missing, so we can validate page rendering and form structure.
// Full auth integration tests require a Supabase test project (see CONTRIBUTING).

test("login page renders OAuth providers and magic link form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();

  for (const label of [
    /continue with apple/i,
    /continue with google/i,
    /continue with facebook/i,
  ]) {
    await expect(page.getByRole("button", { name: label })).toBeVisible();
  }

  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /magic link/i })).toBeVisible();
});

test("login page surfaces ?error param", async ({ page }) => {
  await page.goto("/login?error=" + encodeURIComponent("Bad token"));
  await expect(page.getByText("Bad token")).toBeVisible();
});

test("onboarding form renders all required fields", async ({ page }) => {
  // The page would normally redirect unauth'd users via DAL. With no Supabase
  // configured, requireUser → redirect("/login"). Skip when unconfigured.
  test.skip(
    !process.env.NEXT_PUBLIC_SUPABASE_URL,
    "requires Supabase test project",
  );

  await page.goto("/onboarding");
  await expect(page.getByRole("heading", { name: /tell us about you/i })).toBeVisible();
  await expect(page.getByLabel(/display name/i)).toBeVisible();
  await expect(page.getByText(/experience level/i)).toBeVisible();
  await expect(page.getByText(/primary goal/i)).toBeVisible();
  await expect(page.getByText(/weight unit/i)).toBeVisible();
});
