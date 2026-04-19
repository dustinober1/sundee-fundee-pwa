import type { MetadataRoute } from "next";
import { posts } from "./blog/posts";
import { SITE_URL } from "@/lib/site";

function toDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = posts[0] ? toDate(posts[0].publishedAt) : new Date();
  const postEntries: MetadataRoute.Sitemap = posts.map(
    (post): MetadataRoute.Sitemap[number] => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: toDate(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...postEntries,
  ];

  return entries;
}
