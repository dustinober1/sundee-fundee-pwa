import type { MetadataRoute } from "next";
import { postModifiedAt, posts } from "./blog/posts";
import { SITE_URL } from "@/lib/site";
import { SEO_PAGES_LAST_MODIFIED, seoPages } from "@/lib/seo-pages";
import { BLOG_TOPICS } from "./blog/taxonomy";

function toDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteLastModified = posts[0]
    ? toDate(postModifiedAt(posts[0]))
    : new Date();
  const seoLastModified = toDate(SEO_PAGES_LAST_MODIFIED);
  const postEntries: MetadataRoute.Sitemap = posts.map(
    (post): MetadataRoute.Sitemap[number] => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: toDate(postModifiedAt(post)),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );
  const seoPageEntries: MetadataRoute.Sitemap = seoPages.map(
    (page): MetadataRoute.Sitemap[number] => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: seoLastModified,
      changeFrequency: "monthly",
      priority: page.priority,
    }),
  );
  const topicEntries: MetadataRoute.Sitemap = BLOG_TOPICS.map(
    (topic): MetadataRoute.Sitemap[number] => ({
      url: `${SITE_URL}${topic.href}`,
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 0.65,
    }),
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: siteLastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: siteLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/for-women-who-lift`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/recovery-aware-strength-training`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/apple-health-strength-training-app`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/train-around-injury`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: siteLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    ...seoPageEntries,
    ...topicEntries,
    ...postEntries,
  ];

  return entries;
}
