import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadPosts, validateBlogPost } from "./posts";

describe("blog content validation", () => {
  it("loads all blog posts with valid dates and interactive metadata", () => {
    const loadedPosts = loadPosts({ todayIso: "2026-05-04" });
    const slugs = loadedPosts.map((post) => post.slug);
    const contentDir = path.join(process.cwd(), "src/app/blog/content");
    const expectedCount = fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith(".json")).length;

    expect(loadedPosts).toHaveLength(expectedCount);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(
      loadedPosts.flatMap((post) => validateBlogPost(post, "2026-05-04")),
    ).toEqual([]);
  });

  it("rejects a future publish date", () => {
    const [post] = loadPosts({ todayIso: "2026-05-04" });
    const invalidPost = {
      ...post,
      publishedAt: "2026-05-05",
      updatedAt: "2026-05-05",
    };

    expect(validateBlogPost(invalidPost, "2026-05-04")).toContain(
      "publishedAt 2026-05-05 cannot be after 2026-05-04",
    );
  });
});
