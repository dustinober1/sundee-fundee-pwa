import type { BlogArticleIntent, BlogPost } from "./posts";

export type BlogSortOption = "recommended" | "newest" | "updated" | "shortest-read";

export type BlogDiscoveryItem = Pick<
  BlogPost,
  | "articleIntent"
  | "bestFor"
  | "description"
  | "publishedAt"
  | "readMinutes"
  | "slug"
  | "title"
  | "updatedAt"
> & {
  interactiveType: NonNullable<BlogPost["interactiveModules"]>[number]["type"];
  topicLabel: string;
  topicSlug: string;
};

export type BlogPathway = {
  slug: string;
  label: string;
  description: string;
  topicSlug?: string;
  articleIntents?: BlogArticleIntent[];
  keywords?: string[];
};

export type BlogDiscoveryFilters = {
  search: string;
  topicSlug: string;
  articleIntent: string;
  sort: BlogSortOption;
};

export const ARTICLE_INTENT_LABELS: Record<BlogArticleIntent, string> = {
  "compare-options": "Compare options",
  "decision-guide": "Decision guide",
  "metric-explainer": "Metric explainer",
  checklist: "Modification checklist",
  protocol: "Protocol",
  "symptom-audit": "Symptom audit",
  timeline: "Timeline",
};

export const INTERACTIVE_TYPE_LABELS: Record<BlogDiscoveryItem["interactiveType"], string> = {
  "comparison-cards": "Interactive comparison",
  "decision-guide": "Decision guide",
  "metric-explainer": "Signal translator",
  "modification-checklist": "Modification checklist",
  "readiness-check": "Readiness check",
  timeline: "Timeline",
};

export const BLOG_PATHWAYS: BlogPathway[] = [
  {
    slug: "adjust-todays-workout",
    label: "Adjust today's workout",
    description: "Find posts that help you decide whether to push, hold, or modify the session.",
    articleIntents: ["decision-guide", "symptom-audit", "protocol"],
  },
  {
    slug: "train-around-pain",
    label: "Train around pain",
    description: "Surface injury and modification articles first.",
    topicSlug: "training-around-pain",
  },
  {
    slug: "use-cycle-context",
    label: "Use cycle context",
    description: "Group articles about cycle-aware training, recovery, and women-specific programming.",
    topicSlug: "women-who-lift",
  },
  {
    slug: "interpret-wearable-data",
    label: "Interpret wearable data",
    description: "See posts that translate Apple Health, Garmin, and recovery metrics into action.",
    topicSlug: "wearables-health-data",
    articleIntents: ["metric-explainer", "compare-options"],
  },
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function matchesSearch(post: BlogDiscoveryItem, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    post.title,
    post.description,
    post.bestFor ?? "",
    post.topicLabel,
    post.articleIntent ? ARTICLE_INTENT_LABELS[post.articleIntent] : "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function sortBlogPosts(posts: BlogDiscoveryItem[], sort: BlogSortOption) {
  const sorted = [...posts];

  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    case "updated":
      return sorted.sort((a, b) => (b.updatedAt ?? b.publishedAt).localeCompare(a.updatedAt ?? a.publishedAt));
    case "shortest-read":
      return sorted.sort((a, b) => a.readMinutes - b.readMinutes || b.publishedAt.localeCompare(a.publishedAt));
    case "recommended":
    default:
      return sorted.sort((a, b) => {
        const aScore =
          (a.slug === "why-recovery-beats-the-calendar" ? 10 : 0) +
          (a.articleIntent === "decision-guide" ? 2 : 0) +
          (a.updatedAt === a.publishedAt ? 0 : 1);
        const bScore =
          (b.slug === "why-recovery-beats-the-calendar" ? 10 : 0) +
          (b.articleIntent === "decision-guide" ? 2 : 0) +
          (b.updatedAt === b.publishedAt ? 0 : 1);

        return bScore - aScore || b.publishedAt.localeCompare(a.publishedAt);
      });
  }
}

export function filterBlogPosts(posts: BlogDiscoveryItem[], filters: BlogDiscoveryFilters) {
  const query = normalize(filters.search);

  const filtered = posts.filter((post) => {
    if (filters.topicSlug !== "all" && post.topicSlug !== filters.topicSlug) {
      return false;
    }

    if (filters.articleIntent !== "all" && post.articleIntent !== filters.articleIntent) {
      return false;
    }

    return matchesSearch(post, query);
  });

  return sortBlogPosts(filtered, filters.sort);
}

export function getPathwayPosts(posts: BlogDiscoveryItem[], pathway: BlogPathway) {
  return posts.filter((post) => {
    if (pathway.topicSlug && post.topicSlug !== pathway.topicSlug) {
      return false;
    }

    if (pathway.articleIntents?.length && (!post.articleIntent || !pathway.articleIntents.includes(post.articleIntent))) {
      return false;
    }

    if (pathway.keywords?.length) {
      const text = `${post.title} ${post.description} ${post.bestFor ?? ""}`.toLowerCase();
      return pathway.keywords.some((keyword) => text.includes(keyword.toLowerCase()));
    }

    return true;
  });
}
