import type { BlogPost } from "./posts";

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
