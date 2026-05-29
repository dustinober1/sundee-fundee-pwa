import {
  getPrimaryTopic,
  getRelatedPosts,
  type BlogTopicSlug,
} from "../app/blog/taxonomy";
import type { BlogPost } from "../app/blog/posts";

export type InternalResourceLink = {
  href: string;
  label: string;
  description: string;
};

export type BlogPostInternalLinks = {
  topicHub: InternalResourceLink;
  productPage: InternalResourceLink;
  seoPage: InternalResourceLink;
  siblingArticles: InternalResourceLink[];
};

const TOPIC_SEO_LINKS: Record<BlogTopicSlug, InternalResourceLink> = {
  "recovery-readiness": {
    href: "/strength-training-recovery",
    label: "Strength training recovery guide",
    description:
      "Use the broader recovery page when you want the article translated into a repeatable decision system.",
  },
  "training-around-pain": {
    href: "/strength-training-after-injury",
    label: "Strength training after injury",
    description:
      "See the broader modification framework for keeping the training habit alive around symptoms.",
  },
  "women-who-lift": {
    href: "/strength-training-for-women",
    label: "Strength training for women",
    description:
      "Move from one article into the wider library for cycle context, nutrition, and long-term programming.",
  },
  "wearables-health-data": {
    href: "/wearables-and-strength-training",
    label: "Wearables and strength training",
    description:
      "Turn wearable signals into a larger readiness workflow instead of reading them in isolation.",
  },
  "programming-basics": {
    href: "/strength-training-plan-for-women",
    label: "Strength training planning guide",
    description:
      "Connect the article's tactic back to the bigger structure of a training week or block.",
  },
};

const TOPIC_PRODUCT_LINKS: Record<BlogTopicSlug, InternalResourceLink> = {
  "recovery-readiness": {
    href: "/recovery-aware-strength-training",
    label: "Recovery-aware training in the app",
    description:
      "See how the app turns readiness inputs into a same-day workout recommendation.",
  },
  "training-around-pain": {
    href: "/train-around-injury",
    label: "Train around injury",
    description:
      "Use the product page that explains how pain flags and substitutions shape the next session.",
  },
  "women-who-lift": {
    href: "/for-women-who-lift",
    label: "For women who lift",
    description:
      "See the product page for lifters who want cycle context without rigid training rules.",
  },
  "wearables-health-data": {
    href: "/apple-health-strength-training-app",
    label: "Apple Health strength training app",
    description:
      "See how Apple Health and wearable trends become actionable in the iPhone workflow.",
  },
  "programming-basics": {
    href: "/",
    label: "Sundee Fundee app overview",
    description:
      "See how programming choices fit into the wider recovery-aware workout workflow on iPhone.",
  },
};

const TOPIC_HUB_LINKS: Record<BlogTopicSlug, InternalResourceLink> = {
  "recovery-readiness": {
    href: "/blog/topic/recovery-readiness",
    label: "Recovery & Readiness hub",
    description:
      "Browse the full cluster of articles on recovery, sleep, HRV, and day-of training choices.",
  },
  "training-around-pain": {
    href: "/blog/topic/training-around-pain",
    label: "Training Around Pain hub",
    description:
      "See the broader article cluster on modifications, pain-aware loading, and conservative substitutions.",
  },
  "women-who-lift": {
    href: "/blog/topic/women-who-lift",
    label: "Women Who Lift hub",
    description:
      "Move into the broader collection on cycle context, symptoms, and programming for women who lift.",
  },
  "wearables-health-data": {
    href: "/blog/topic/wearables-health-data",
    label: "Wearables & Health Data hub",
    description:
      "See the wider set of articles on Apple Health, HRV, sleep, temperature, and wearable signals.",
  },
  "programming-basics": {
    href: "/blog/topic/programming-basics",
    label: "Programming Basics hub",
    description:
      "See the larger article set for progression, max testing, deloads, warm-ups, and session structure.",
  },
};

const SEO_PAGE_TO_TOPIC: Record<string, BlogTopicSlug> = {
  "best-strength-training-app-for-women": "women-who-lift",
  "best-apple-health-strength-training-app": "wearables-health-data",
  "strength-training-app-alternatives": "programming-basics",
  "best-recovery-strength-training-app": "recovery-readiness",
  "free-strength-training-app-for-women": "women-who-lift",
  "strength-training-log-for-women": "women-who-lift",
  "hrv-strength-training-app": "recovery-readiness",
  "fitbod-alternative-for-women": "programming-basics",
  "hevy-alternative-for-strength-training": "programming-basics",
  "readiness-score-strength-training": "recovery-readiness",
  "cycle-based-strength-training": "women-who-lift",
  "injury-friendly-workout-planner": "training-around-pain",
  "strength-training-pr-tracker": "programming-basics",
  "deload-week-planner": "recovery-readiness",
  "strength-training-plan-for-women": "programming-basics",
  "beginner-strength-training-plan": "programming-basics",
  "strength-training-after-injury": "training-around-pain",
  "recovery-based-workout-plan": "recovery-readiness",
  "two-day-strength-training-plan-for-women": "programming-basics",
  "perimenopause-strength-training": "women-who-lift",
  "postpartum-strength-training-app": "women-who-lift",
  "strength-training-during-period": "women-who-lift",
  "strength-training-recovery": "recovery-readiness",
  "strength-training-for-women": "women-who-lift",
  "lifting-with-injuries": "training-around-pain",
  "wearables-and-strength-training": "wearables-health-data",
  "cycle-aware-training": "women-who-lift",
};

export function getBlogPostInternalLinks(
  post: BlogPost,
  allPosts: BlogPost[],
): BlogPostInternalLinks {
  const topic = getPrimaryTopic(post);

  return {
    topicHub: TOPIC_HUB_LINKS[topic.slug],
    productPage: TOPIC_PRODUCT_LINKS[topic.slug],
    seoPage: TOPIC_SEO_LINKS[topic.slug],
    siblingArticles: getRelatedPosts(post, allPosts, 3).map((related) => ({
      href: `/blog/${related.slug}`,
      label: related.title,
      description: related.bestFor ?? related.description,
    })),
  };
}

export function getSeoPageInternalLinks(slug: string): {
  topicHub: InternalResourceLink;
  productPage: InternalResourceLink;
  seoPage: InternalResourceLink;
} | null {
  const topicSlug = SEO_PAGE_TO_TOPIC[slug];
  if (!topicSlug) {
    return null;
  }

  return {
    topicHub: TOPIC_HUB_LINKS[topicSlug],
    productPage: TOPIC_PRODUCT_LINKS[topicSlug],
    seoPage: TOPIC_SEO_LINKS[topicSlug],
  };
}

export function getTopicHubDecisionLinks(topicSlug: BlogTopicSlug): {
  productPage: InternalResourceLink;
  seoPage: InternalResourceLink;
} {
  return {
    productPage: TOPIC_PRODUCT_LINKS[topicSlug],
    seoPage: TOPIC_SEO_LINKS[topicSlug],
  };
}
