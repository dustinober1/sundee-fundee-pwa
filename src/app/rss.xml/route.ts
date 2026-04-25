import { SITE_TITLE, SITE_URL } from "@/lib/site";
import { posts, postModifiedAt, toRfc822Date } from "../blog/posts";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <description>${escapeXml(post.description)}</description>
          <pubDate>${toRfc822Date(post.publishedAt)}</pubDate>
          <lastBuildDate>${toRfc822Date(postModifiedAt(post))}</lastBuildDate>
        </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(`${SITE_TITLE} Blog`)}</title>
        <link>${SITE_URL}/blog</link>
        <description>${escapeXml(
          "Recovery-aware strength training articles from Sundee Fundee.",
        )}</description>
        <language>en-us</language>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
