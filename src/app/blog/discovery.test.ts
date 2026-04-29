import { describe, expect, it } from "vitest";
import {
  filterBlogPosts,
  getPathwayPosts,
  BLOG_PATHWAYS,
  type BlogDiscoveryItem,
} from "./discovery";

const discoveryItems: BlogDiscoveryItem[] = [
  {
    slug: "why-recovery-beats-the-calendar",
    title: "Why recovery beats the calendar",
    description: "A recovery-aware way to adjust the week.",
    bestFor: "Lifters deciding whether to push or back off.",
    publishedAt: "2026-04-02",
    updatedAt: "2026-04-25",
    readMinutes: 7,
    topicLabel: "Recovery & Readiness",
    topicSlug: "recovery-readiness",
    articleIntent: "decision-guide",
    interactiveType: "decision-guide",
  },
  {
    slug: "strength-training-around-minor-injuries",
    title: "Strength Training Around Minor Injuries",
    description: "How to keep momentum without making it worse.",
    bestFor: "Lifters managing pain and substitutions.",
    publishedAt: "2026-04-27",
    updatedAt: "2026-04-28",
    readMinutes: 8,
    topicLabel: "Training Around Pain",
    topicSlug: "training-around-pain",
    articleIntent: "checklist",
    interactiveType: "modification-checklist",
  },
  {
    slug: "apple-watch-hrv-strength-training",
    title: "Apple Watch HRV for Strength Training",
    description: "How lifters should use wearable data.",
    bestFor: "Apple Watch users interpreting HRV.",
    publishedAt: "2026-04-27",
    updatedAt: "2026-04-28",
    readMinutes: 12,
    topicLabel: "Wearables & Health Data",
    topicSlug: "wearables-health-data",
    articleIntent: "symptom-audit",
    interactiveType: "readiness-check",
  },
];

describe("blog discovery", () => {
  it("filters by search and topic", () => {
    const results = filterBlogPosts(discoveryItems, {
      articleIntent: "all",
      search: "apple",
      sort: "recommended",
      topicSlug: "wearables-health-data",
    });

    expect(results.map((post) => post.slug)).toEqual([
      "apple-watch-hrv-strength-training",
    ]);
  });

  it("sorts by shortest read", () => {
    const results = filterBlogPosts(discoveryItems, {
      articleIntent: "all",
      search: "",
      sort: "shortest-read",
      topicSlug: "all",
    });

    expect(results.map((post) => post.slug)).toEqual([
      "why-recovery-beats-the-calendar",
      "strength-training-around-minor-injuries",
      "apple-watch-hrv-strength-training",
    ]);
  });

  it("groups pathway posts for injury adaptation", () => {
    const pathway = BLOG_PATHWAYS.find((entry) => entry.slug === "train-around-pain");

    expect(pathway).toBeDefined();
    expect(getPathwayPosts(discoveryItems, pathway!).map((post) => post.slug)).toEqual([
      "strength-training-around-minor-injuries",
    ]);
  });
});
