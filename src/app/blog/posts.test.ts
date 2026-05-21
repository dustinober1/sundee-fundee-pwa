import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadPosts, validateBlogPost } from "./posts";

describe("blog content validation", () => {
  it("loads all blog posts with valid dates and interactive metadata", () => {
    const loadedPosts = loadPosts({ todayIso: "2026-05-20" });
    const slugs = loadedPosts.map((post) => post.slug);
    const contentDir = path.join(process.cwd(), "src/app/blog/content");
    const expectedCount = fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith(".json")).length;

    expect(loadedPosts).toHaveLength(expectedCount);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(
      loadedPosts.flatMap((post) => validateBlogPost(post, "2026-05-20")),
    ).toEqual([]);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "two-day-strength-training-plan-women",
        "choose-starting-weights-strength-training-women",
        "double-progression-strength-training-women",
        "stress-and-strength-training-recovery",
        "shoulder-pain-bench-press-modifications",
        "apple-watch-wrist-temperature-cycle-training",
        "top-set-back-off-set-programming",
      ]),
    );
  });

  it("rejects a future publish date", () => {
    const [post] = loadPosts({ todayIso: "2026-05-20" });
    const invalidPost = {
      ...post,
      publishedAt: "2026-05-21",
      updatedAt: "2026-05-21",
    };

    expect(validateBlogPost(invalidPost, "2026-05-20")).toContain(
      "publishedAt 2026-05-21 cannot be after 2026-05-20",
    );
  });

  it("keeps priority legacy articles substantial enough for search", () => {
    const postsBySlug = new Map(
      loadPosts({ todayIso: "2026-05-20" }).map((post) => [post.slug, post]),
    );
    const prioritySlugs = [
      "when-hrv-is-low-strength-training",
      "garmin-recovery-data-for-lifters",
      "apple-health-data-for-strength-training",
      "training-around-injuries-without-losing-progress",
      "strength-training-around-minor-injuries",
    ];

    for (const slug of prioritySlugs) {
      const post = postsBySlug.get(slug);
      expect(post, `${slug} should exist`).toBeDefined();
      const wordCount = post?.body.split(/\s+/).filter(Boolean).length ?? 0;
      expect(wordCount, `${slug} should be at least 1,000 words`).toBeGreaterThanOrEqual(
        1000,
      );
    }
  });
});
