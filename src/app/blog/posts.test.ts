import { describe, expect, it } from "vitest";
import { loadPosts, validateBlogPost } from "./posts";

describe("blog content validation", () => {
  it("loads all blog posts with valid dates and interactive metadata", () => {
    const loadedPosts = loadPosts({ todayIso: "2026-05-03" });
    const slugs = loadedPosts.map((post) => post.slug);

    expect(loadedPosts).toHaveLength(31);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(
      loadedPosts.flatMap((post) => validateBlogPost(post, "2026-05-03")),
    ).toEqual([]);
  });

  it("rejects a future publish date", () => {
    const [post] = loadPosts({ todayIso: "2026-05-03" });
    const invalidPost = {
      ...post,
      publishedAt: "2026-05-04",
      updatedAt: "2026-05-04",
    };

    expect(validateBlogPost(invalidPost, "2026-05-03")).toContain(
      "publishedAt 2026-05-04 cannot be after 2026-05-03",
    );
  });
});
