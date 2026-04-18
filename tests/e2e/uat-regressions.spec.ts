import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

type LocalEnv = Record<string, string>;

function readLocalEnv(): LocalEnv {
  const file = resolve(process.cwd(), ".env.local");
  const env: LocalEnv = {};

  try {
    const content = readFileSync(file, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      env[key] = rest.join("=").replace(/^"|"$/g, "");
    }
  } catch {
    // Fall back to the process environment when .env.local is unavailable.
  }

  return env;
}

const localEnv = readLocalEnv();
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? localEnv.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? localEnv.SUPABASE_SERVICE_ROLE_KEY;

const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

async function isSupabaseReachable() {
  if (!SUPABASE_URL) return false;

  try {
    const response = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/`, {
      method: "HEAD",
    });
    return [200, 401, 404, 405].includes(response.status);
  } catch {
    return false;
  }
}

function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase env vars are required for this test suite.");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function uniqueEmail(prefix: string) {
  return `uat-${prefix}-${randomUUID().slice(0, 8)}@example.com`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function provisionOnboardedUser(prefix: string) {
  const admin = createAdminClient();
  const email = uniqueEmail(prefix);
  const password = "testing123";
  const displayName = `UAT ${prefix} ${randomUUID().slice(0, 4)}`;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: displayName },
  });
  if (error || !data.user) {
    throw new Error(error?.message ?? "Failed to create test user");
  }

  const userId = data.user.id;
  const { error: profileError } = await admin.from("user_profiles").upsert({
    id: userId,
    display_name: displayName,
    weight_unit: "lb",
    experience_level: "intermediate",
    primary_goal: "strength",
    cycle_tracking_enabled: true,
    onboarded_at: new Date().toISOString(),
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(userId).catch(() => undefined);
    throw new Error(profileError.message);
  }

  return { admin, email, password, userId, displayName };
}

async function cleanupUser(admin: ReturnType<typeof createAdminClient>, userId: string) {
  await admin.auth.admin.deleteUser(userId).catch(() => undefined);
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.waitForLoadState("networkidle");
}

test.describe("authenticated UAT regressions", () => {
  test.beforeAll(async () => {
    if (!hasSupabase || !(await isSupabaseReachable())) {
      test.skip(true, "requires a reachable local Supabase stack");
    }
  });

  test("custom challenge accepts round lb values", async ({ page }) => {
    const { admin, email, password, userId, displayName } =
      await provisionOnboardedUser("challenge");

    try {
      await signIn(page, email, password);
      await expect(
        page.getByRole("heading", {
          name: new RegExp(`Welcome back, ${escapeRegExp(displayName)}\\.`, "i"),
        }),
      ).toBeVisible();

      const title = `UAT Challenge ${randomUUID().slice(0, 8)}`;
      await page.goto("/challenges");
      await page.locator('select[name="type"]').selectOption("custom");
      await page.locator('input[name="title"]').fill(title);
      await page.locator('input[name="target_volume_lbs"]').fill("1000");
      await page.getByRole("button", { name: /create challenge/i }).click();
      await page.waitForLoadState("networkidle");

      await expect(page.getByRole("link", { name: new RegExp(escapeRegExp(title), "i") })).toBeVisible();

      const { data, error } = await admin
        .from("challenges")
        .select("title, tiers, accumulated_volume_lbs")
        .eq("user_id", userId)
        .eq("title", title)
        .maybeSingle();
      expect(error).toBeNull();
      if (!data) {
        throw new Error("Expected challenge row to be created");
      }
      expect(data.tiers[0].target_volume_lbs).toBe(1000);
      expect(data.accumulated_volume_lbs).toBe(0);
    } finally {
      await cleanupUser(admin, userId);
    }
  });

  test("injuries page does not nest forms and delete works", async ({ page }) => {
    const { admin, email, password, userId } = await provisionOnboardedUser("injury");
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    try {
      await signIn(page, email, password);
      await page.goto("/injuries");
      await expect(page.getByRole("heading", { name: /^Injuries$/i })).toBeVisible();

      const injuryName = `UAT Injury ${randomUUID().slice(0, 8)}`;
      await page.locator('input[name="name"]').fill(injuryName);
      await page.locator('input[name="location_ids"]').first().check();
      await page.locator('textarea[name="notes"]').fill("Browser regression injury");
      await page.getByRole("button", { name: /^Add$/ }).click();
      await page.waitForLoadState("networkidle");

      const card = page.locator("article").filter({ hasText: injuryName }).first();
      await expect(card).toBeVisible();
      await expect(card.locator('header span').first()).toHaveText("Acute");

      await card.locator('select[name="recovery_phase"]').selectOption("rehab");
      await card.getByRole("button", { name: /update phase/i }).click();
      await page.waitForLoadState("networkidle");
      await expect(card.locator('header span').first()).toHaveText("Rehab");

      await page.reload();
      const reloadedCard = page.locator("article").filter({ hasText: injuryName }).first();
      await expect(reloadedCard.locator('select[name="recovery_phase"]')).toHaveValue("rehab");
      await expect(reloadedCard.locator('header span').first()).toHaveText("Rehab");

      await reloadedCard.getByRole("button", { name: "Delete" }).click();
      await page.waitForLoadState("networkidle");
      await expect(page.getByText(injuryName)).toHaveCount(0);

      const { data, error } = await admin
        .from("injuries")
        .select("id")
        .eq("user_id", userId)
        .eq("name", injuryName);
      expect(error).toBeNull();
      expect(data).toHaveLength(0);

      const nestedFormWarning = [...consoleErrors, ...pageErrors].some((text) =>
        /cannot be a descendant of <form>|hydration error/i.test(text),
      );
      expect(nestedFormWarning).toBe(false);
    } finally {
      await cleanupUser(admin, userId);
    }
  });
});
