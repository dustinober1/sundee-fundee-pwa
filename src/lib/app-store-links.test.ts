import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

async function loadModule() {
  vi.resetModules();
  return import("./app-store-links");
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("buildAppStoreUrl", () => {
  it("keeps current UTM params when no Apple provider token is configured", async () => {
    delete process.env.NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN;
    delete process.env.NEXT_PUBLIC_APP_STORE_MEDIA_TYPE_TOKEN;
    const { buildAppStoreUrl } = await loadModule();

    const url = new URL(
      buildAppStoreUrl({ campaign: "home", content: "hero_primary" }),
    );

    expect(url.origin + url.pathname).toBe(
      "https://apps.apple.com/us/app/sundeefundee/id6759870888",
    );
    expect(url.searchParams.get("utm_source")).toBe("sundeefundee.com");
    expect(url.searchParams.get("utm_medium")).toBe("web");
    expect(url.searchParams.get("utm_campaign")).toBe("home");
    expect(url.searchParams.get("utm_content")).toBe("hero_primary");
    expect(url.searchParams.has("pt")).toBe(false);
    expect(url.searchParams.has("ct")).toBe(false);
    expect(url.searchParams.has("mt")).toBe(false);
  });

  it("adds Apple campaign params when provider token is configured", async () => {
    process.env.NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN = "123456";
    delete process.env.NEXT_PUBLIC_APP_STORE_MEDIA_TYPE_TOKEN;
    const { buildAppStoreUrl } = await loadModule();

    const url = new URL(buildAppStoreUrl({ campaign: "blog_post", content: "low-readiness-score-strength-training" }));

    expect(url.searchParams.get("pt")).toBe("123456");
    expect(url.searchParams.get("ct")).toBe("blog_post_low_readiness_score_");
    expect(url.searchParams.get("ct")).toHaveLength(30);
    expect(url.searchParams.get("mt")).toBe("8");
  });

  it("normalizes campaign tokens to stable 30 character values", async () => {
    process.env.NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN = "123456";
    process.env.NEXT_PUBLIC_APP_STORE_MEDIA_TYPE_TOKEN = "11";
    const { buildAppStoreUrl } = await loadModule();

    const url = new URL(
      buildAppStoreUrl({
        campaign: "SEO Landing!!!",
        content: "This Content Name Is Much Too Long For Apple Campaign Attribution",
      }),
    );

    expect(url.searchParams.get("ct")).toBe("seo_landing_this_content_name_");
    expect(url.searchParams.get("ct")).toHaveLength(30);
    expect(url.searchParams.get("mt")).toBe("11");
  });

  it("builds attributed App Store URLs for side apps", async () => {
    delete process.env.NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN;
    delete process.env.NEXT_PUBLIC_APP_STORE_MEDIA_TYPE_TOKEN;
    const { buildAppStoreUrl } = await loadModule();

    const url = new URL(
      buildAppStoreUrl({
        appSlug: "load-that-bar",
        campaign: "apps",
        content: "side_card",
      }),
    );

    expect(url.origin + url.pathname).toBe(
      "https://apps.apple.com/us/app/load-that-bar/id6769888435",
    );
    expect(url.searchParams.get("utm_source")).toBe("sundeefundee.com");
    expect(url.searchParams.get("utm_campaign")).toBe("apps");
    expect(url.searchParams.get("utm_content")).toBe("side_card");
  });
});
