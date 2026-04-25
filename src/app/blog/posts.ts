import fs from "fs";
import path from "path";
import type { BlogTopicSlug } from "./taxonomy";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readMinutes: number;
  tags: string[];
  primaryTopic?: BlogTopicSlug;
  bestFor?: string;
  body: string;
};

const contentDir = path.join(process.cwd(), "src/app/blog/content");

export const posts: BlogPost[] = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(contentDir, f), "utf-8")) as BlogPost)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function postModifiedAt(post: BlogPost): string {
  return post.updatedAt ?? post.publishedAt;
}

export function toRfc822Date(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toUTCString();
}
