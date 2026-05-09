import type { BlogPost } from "./posts";

export const FEATURED_POST_SLUG = "why-recovery-beats-the-calendar";

export type BlogTopicSlug =
  | "recovery-readiness"
  | "training-around-pain"
  | "women-who-lift"
  | "wearables-health-data"
  | "programming-basics";

export type BlogTopic = {
  slug: BlogTopicSlug;
  label: string;
  description: string;
  eyebrow: string;
  href: string;
  matchTags: string[];
  productHref: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
};

export const BLOG_TOPICS: BlogTopic[] = [
  {
    slug: "recovery-readiness",
    label: "Recovery & Readiness",
    description:
      "Use recovery, sleep, HRV, and readiness signals to adjust training before fatigue makes the decision for you.",
    eyebrow: "Recovery",
    href: "/blog/topic/recovery-readiness",
    matchTags: ["recovery", "readiness", "hrv", "sleep"],
    productHref: "/recovery-aware-strength-training",
    ctaEyebrow: "Train from readiness",
    ctaTitle: "Build sessions around recovery, not the calendar.",
    ctaBody:
      "Use Sundee Fundee when sleep, soreness, and readiness should change the work you do today.",
  },
  {
    slug: "training-around-pain",
    label: "Training Around Pain",
    description:
      "Keep the training habit alive when irritation, substitutions, and movement limits change the plan.",
    eyebrow: "Injury adaptation",
    href: "/blog/topic/training-around-pain",
    matchTags: ["injuries", "injury-prevention", "adaptation", "warm-up", "pain"],
    productHref: "/train-around-injury",
    ctaEyebrow: "Adapt the session",
    ctaTitle: "Keep training when pain changes the plan.",
    ctaBody:
      "Log pain and constraints, then use the app to shape a session you can actually perform.",
  },
  {
    slug: "women-who-lift",
    label: "Women Who Lift",
    description:
      "Cycle-aware strength training, nutrition, and injury-risk context for women who want flexible programming.",
    eyebrow: "Cycle-aware training",
    href: "/blog/topic/women-who-lift",
    matchTags: ["female-athletes", "cycle", "nutrition", "menstrual-cycle"],
    productHref: "/for-women-who-lift",
    ctaEyebrow: "Use cycle context",
    ctaTitle: "Train with optional cycle-aware adjustments.",
    ctaBody:
      "Use cycle phase as context without turning your program into a rigid set of rules.",
  },
  {
    slug: "wearables-health-data",
    label: "Wearables & Health Data",
    description:
      "Translate Apple Health signals and wearable trends into gym decisions.",
    eyebrow: "Health data",
    href: "/blog/topic/wearables-health-data",
    matchTags: ["apple-health", "wearables", "hrv", "wearable-data"],
    productHref: "/apple-health-strength-training-app",
    ctaEyebrow: "Use health signals",
    ctaTitle: "Turn wearable data into training choices.",
    ctaBody:
      "Bring recovery context from Apple Health into strength training decisions that are easy to act on.",
  },
  {
    slug: "programming-basics",
    label: "Programming Basics",
    description:
      "Practical strength-programming guides for max testing, RPE, deloads, bracing, warm-ups, and progression.",
    eyebrow: "Programming",
    href: "/blog/topic/programming-basics",
    matchTags: ["programming", "strength", "testing", "rpe", "deload", "performance", "bracing"],
    productHref: "/",
    ctaEyebrow: "Apply the method",
    ctaTitle: "Put the programming ideas into your next session.",
    ctaBody:
      "Use the app to make programming choices respond to readiness, pain, and schedule changes.",
  },
];

const topicBySlug = new Map(BLOG_TOPICS.map((topic) => [topic.slug, topic]));

export function getBlogTopic(slug: BlogTopicSlug): BlogTopic {
  const topic = topicBySlug.get(slug);
  if (!topic) {
    throw new Error(`Unknown blog topic: ${slug}`);
  }

  return topic;
}

export function getPrimaryTopic(post: BlogPost): BlogTopic {
  if (post.primaryTopic) {
    return getBlogTopic(post.primaryTopic);
  }

  return (
    BLOG_TOPICS.find((topic) =>
      post.tags.some((tag) => topic.matchTags.includes(tag)),
    ) ?? BLOG_TOPICS[BLOG_TOPICS.length - 1]
  );
}

export function getTopicPosts(posts: BlogPost[], topicSlug: BlogTopicSlug): BlogPost[] {
  return posts.filter((post) => getPrimaryTopic(post).slug === topicSlug);
}

export function getFeaturedPost(posts: BlogPost[]): BlogPost {
  return posts.find((post) => post.slug === FEATURED_POST_SLUG) ?? posts[0];
}

export function getRelatedPosts(
  post: BlogPost,
  allPosts: BlogPost[],
  limit = 3,
): BlogPost[] {
  const topic = getPrimaryTopic(post);
  const sourceTags = new Set(post.tags);

  return allPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const candidateTopic = getPrimaryTopic(candidate);
      const sharedTags = candidate.tags.filter((tag) => sourceTags.has(tag)).length;
      const score =
        (candidateTopic.slug === topic.slug ? 100 : 0) +
        sharedTags * 10 +
        (candidate.articleIntent && candidate.articleIntent === post.articleIntent ? 20 : 0);

      return { candidate, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.candidate.publishedAt.localeCompare(a.candidate.publishedAt);
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getPostCta(post: BlogPost): BlogTopic {
  return getPrimaryTopic(post);
}
