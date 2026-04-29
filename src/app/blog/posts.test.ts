import { describe, expect, it } from "vitest";
import { loadPosts, validateBlogPost } from "./posts";

describe("blog content validation", () => {
  it("loads all blog posts with valid dates and interactive metadata", () => {
    const loadedPosts = loadPosts({ todayIso: "2026-04-29" });
    const slugs = loadedPosts.map((post) => post.slug);

    expect(loadedPosts).toHaveLength(28);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(
      loadedPosts.flatMap((post) => validateBlogPost(post, "2026-04-29")),
    ).toEqual([]);
  });

  it("rejects a future publish date", () => {
    const [post] = loadPosts({ todayIso: "2026-04-29" });
    const invalidPost = {
      ...post,
      publishedAt: "2026-04-30",
      updatedAt: "2026-04-30",
    };

    expect(validateBlogPost(invalidPost, "2026-04-29")).toContain(
      "publishedAt 2026-04-30 cannot be after 2026-04-29",
    );
  });
});
