import { describe, expect, it } from "vitest";
import { posts } from "./posts";
import { BLOG_TOPICS } from "./taxonomy";
import {
  getBlogPostInternalLinks,
  getSeoPageInternalLinks,
  getTopicHubDecisionLinks,
} from "../../lib/internal-linking";
import { seoPages } from "../../lib/seo-pages";

describe("blog internal linking", () => {
  it("gives every post deterministic next-step links", () => {
    for (const post of posts) {
      const links = getBlogPostInternalLinks(post, posts);

      expect(links.topicHub.href).toMatch(/^\/blog\/topic\//);
      expect(links.productPage.href.startsWith("/")).toBe(true);
      expect(links.seoPage.href.startsWith("/")).toBe(true);
      expect(links.siblingArticles.length).toBeGreaterThanOrEqual(2);
      expect(links.siblingArticles.every((link) => link.href.startsWith("/blog/"))).toBe(true);
      expect(links.siblingArticles.every((link) => link.href !== `/blog/${post.slug}`)).toBe(true);
      expect(new Set(links.siblingArticles.map((link) => link.href)).size).toBe(
        links.siblingArticles.length,
      );
    }
  });

  it("maps every SEO page into a topic hub or adjacent resource", () => {
    for (const page of seoPages) {
      const links = getSeoPageInternalLinks(page.slug);

      expect(links, `${page.slug} should resolve internal links`).toBeTruthy();
      expect(links?.topicHub.href).toMatch(/^\/blog\/topic\//);
      expect(links?.productPage.href.startsWith("/")).toBe(true);
      expect(links?.seoPage.href.startsWith("/")).toBe(true);
    }
  });

  it("gives every topic hub a product and SEO bridge link", () => {
    for (const topic of BLOG_TOPICS) {
      const links = getTopicHubDecisionLinks(topic.slug);

      expect(links.productPage.href.startsWith("/")).toBe(true);
      expect(links.seoPage.href.startsWith("/")).toBe(true);
      expect(links.productPage.href).not.toEqual(links.seoPage.href);
    }
  });
});
