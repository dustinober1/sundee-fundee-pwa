import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getAuthor } from "../../lib/authors";
import {
  HEALTH_ADJACENT_TAGS,
  loadPosts,
  validateBlogPost,
} from "./posts";

describe("blog content validation", () => {
  it("loads all blog posts with valid dates and interactive metadata", () => {
    const loadedPosts = loadPosts({ todayIso: "2026-05-24" });
    const slugs = loadedPosts.map((post) => post.slug);
    const contentDir = path.join(process.cwd(), "src/app/blog/content");
    const expectedCount = fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith(".json")).length;

    expect(loadedPosts).toHaveLength(expectedCount);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(
      loadedPosts.flatMap((post) => validateBlogPost(post, "2026-05-24")),
    ).toEqual([]);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "two-day-strength-training-plan-women",
        "choose-starting-weights-strength-training-women",
        "double-progression-strength-training-women",
        "strength-training-after-bad-sleep",
        "stress-and-strength-training-recovery",
        "shoulder-pain-bench-press-modifications",
        "apple-watch-wrist-temperature-cycle-training",
        "top-set-back-off-set-programming",
      ]),
    );
  });

  it("rejects a future publish date", () => {
    const [post] = loadPosts({ todayIso: "2026-05-24" });
    const invalidPost = {
      ...post,
      publishedAt: "2026-05-25",
      updatedAt: "2026-05-25",
    };

    expect(validateBlogPost(invalidPost, "2026-05-24")).toContain(
      "publishedAt 2026-05-25 cannot be after 2026-05-24",
    );
  });

  it("keeps priority legacy articles substantial enough for search", () => {
    const postsBySlug = new Map(
      loadPosts({ todayIso: "2026-05-24" }).map((post) => [post.slug, post]),
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

  it("adds trust metadata for every post and review metadata for health-adjacent posts", () => {
    const loadedPosts = loadPosts({ todayIso: "2026-05-24" });

    for (const post of loadedPosts) {
      expect(post.authorSlug, `${post.slug} should have an author slug`).toMatch(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      );
      expect(getAuthor(post.authorSlug), `${post.slug} should resolve authorSlug`).toBeTruthy();
      expect(post.sources.length, `${post.slug} should list at least one source`).toBeGreaterThan(
        0,
      );

      const isHealthAdjacent = post.tags.some((tag) =>
        HEALTH_ADJACENT_TAGS.has(tag),
      );

      if (isHealthAdjacent) {
        expect(post.reviewedBy, `${post.slug} should show editorial review`).toBeTruthy();
        expect(post.reviewedAt, `${post.slug} should show a review date`).toMatch(
          /^\d{4}-\d{2}-\d{2}$/,
        );
        expect(
          getAuthor(post.reviewedBy ?? ""),
          `${post.slug} should resolve reviewedBy`,
        ).toBeTruthy();
        expect(post.sources.length, `${post.slug} should include at least two sources`).toBeGreaterThanOrEqual(
          2,
        );
      }
    }
  });

  it("rejects invalid author and review trust metadata", () => {
    const [post] = loadPosts({ todayIso: "2026-05-24" });

    expect(
      validateBlogPost(
        {
          ...post,
          authorSlug: "Bad Author",
        },
        "2026-05-24",
      ),
    ).toContain("authorSlug must use a lowercase hyphenated slug");

    expect(
      validateBlogPost(
        {
          ...post,
          reviewedAt: "2026-05-24",
          reviewedBy: undefined,
        },
        "2026-05-24",
      ),
    ).toContain("reviewedAt requires reviewedBy");

    expect(
      validateBlogPost(
        {
          ...post,
          reviewedBy: "missing-author",
          reviewedAt: "2026-05-24",
        },
        "2026-05-24",
      ),
    ).toContain("reviewedBy missing-author must resolve to a known author");

    expect(
      validateBlogPost(
        {
          ...post,
          sources: [{ title: "", publisher: "", url: "http://example.com" }],
        },
        "2026-05-24",
      ),
    ).toEqual(
      expect.arrayContaining([
        "sources[0].title is required",
        "sources[0].publisher is required",
        "sources[0].url must use a valid https URL",
      ]),
    );
  });
});
