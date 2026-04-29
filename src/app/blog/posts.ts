import fs from "fs";
import path from "path";
import { getPostEnhancement } from "./post-enhancements";
export { formatDate, postModifiedAt, toRfc822Date } from "./date";
import type { BlogTopicSlug } from "./taxonomy";

export type BlogArticleIntent =
  | "compare-options"
  | "decision-guide"
  | "metric-explainer"
  | "checklist"
  | "protocol"
  | "symptom-audit"
  | "timeline";

export type BlogInteractivePlacement = "before-body" | "after-intro" | "before-cta";

export type BlogInteractiveChoice = {
  key: string;
  label: string;
  title: string;
  description: string;
  response: string;
};

type BaseInteractiveModule = {
  title: string;
  prompt: string;
  note?: string;
  placement: BlogInteractivePlacement;
  choices: BlogInteractiveChoice[];
};

export type BlogInteractiveModule =
  | ({ type: "decision-guide" } & BaseInteractiveModule)
  | ({ type: "readiness-check" } & BaseInteractiveModule)
  | ({ type: "timeline" } & BaseInteractiveModule)
  | ({ type: "comparison-cards" } & BaseInteractiveModule)
  | ({ type: "modification-checklist" } & BaseInteractiveModule)
  | ({ type: "metric-explainer" } & BaseInteractiveModule);

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
  articleIntent?: BlogArticleIntent;
  interactiveModules?: BlogInteractiveModule[];
  body: string;
};

const contentDir = path.join(process.cwd(), "src/app/blog/content");
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BLOG_VALIDATION_DATE_ENV = "BLOG_VALIDATION_DATE";

type LoadPostsOptions = {
  todayIso?: string;
  validate?: boolean;
};

function mergePostEnhancements(post: BlogPost): BlogPost {
  return {
    ...post,
    ...getPostEnhancement(post),
  };
}

export function getTodayIso(now = new Date()): string {
  const override = process.env[BLOG_VALIDATION_DATE_ENV];
  if (override && ISO_DATE_RE.test(override)) {
    return override;
  }

  return now.toISOString().slice(0, 10);
}

export function validateBlogPost(post: BlogPost, todayIso = getTodayIso()): string[] {
  const errors: string[] = [];

  if (!ISO_DATE_RE.test(post.publishedAt)) {
    errors.push("publishedAt must use YYYY-MM-DD");
  }

  if (post.updatedAt && !ISO_DATE_RE.test(post.updatedAt)) {
    errors.push("updatedAt must use YYYY-MM-DD");
  }

  if (ISO_DATE_RE.test(post.publishedAt) && post.publishedAt > todayIso) {
    errors.push(`publishedAt ${post.publishedAt} cannot be after ${todayIso}`);
  }

  if (post.updatedAt && post.updatedAt < post.publishedAt) {
    errors.push(`updatedAt ${post.updatedAt} cannot be earlier than publishedAt ${post.publishedAt}`);
  }

  if (!post.articleIntent) {
    errors.push("articleIntent is required");
  }

  if (!post.interactiveModules?.length) {
    errors.push("interactiveModules must contain at least one module");
  }

  post.interactiveModules?.forEach((module, index) => {
    if (!module.title.trim()) {
      errors.push(`interactiveModules[${index}] is missing a title`);
    }

    if (!module.prompt.trim()) {
      errors.push(`interactiveModules[${index}] is missing a prompt`);
    }

    if (!module.choices.length) {
      errors.push(`interactiveModules[${index}] must include at least one choice`);
    }

    module.choices.forEach((choice, choiceIndex) => {
      if (!choice.key || !choice.label || !choice.title || !choice.description || !choice.response) {
        errors.push(
          `interactiveModules[${index}].choices[${choiceIndex}] must include key, label, title, description, and response`,
        );
      }
    });
  });

  return errors;
}

export function loadPosts({ todayIso = getTodayIso(), validate = true }: LoadPostsOptions = {}) {
  const loadedPosts = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(contentDir, f), "utf-8")) as BlogPost)
    .map(mergePostEnhancements)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  if (validate) {
    const duplicateSlugs = loadedPosts
      .map((post) => post.slug)
      .filter((slug, index, allSlugs) => allSlugs.indexOf(slug) !== index);
    const validationFailures = loadedPosts.flatMap((post) =>
      validateBlogPost(post, todayIso).map((message) => `${post.slug}: ${message}`),
    );

    duplicateSlugs.forEach((slug) => {
      validationFailures.push(`duplicate slug detected: ${slug}`);
    });

    if (validationFailures.length) {
      throw new Error(`Blog content validation failed:\n${validationFailures.join("\n")}`);
    }
  }

  return loadedPosts;
}

export const posts: BlogPost[] = loadPosts();

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
