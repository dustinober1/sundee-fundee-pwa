import fs from "fs";
import path from "path";
import { getAuthor } from "../../lib/authors";
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

export type BlogSource = {
  title: string;
  url: string;
  publisher: string;
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
  authorSlug: string;
  reviewedBy?: string;
  reviewedAt?: string;
  sources: BlogSource[];
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
const AUTHOR_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const BLOG_VALIDATION_DATE_ENV = "BLOG_VALIDATION_DATE";
const DEFAULT_AUTHOR_SLUG = "sundee-fundee-team";
const EDITORIAL_REVIEW_SLUG = "sundee-fundee-editorial-review";

type LoadPostsOptions = {
  todayIso?: string;
  validate?: boolean;
};

const SOURCE_LIBRARY: Record<string, BlogSource> = {
  "acsm-progression": {
    title: "Progression Models in Resistance Training for Healthy Adults",
    url: "https://pubmed.ncbi.nlm.nih.gov/19204579/",
    publisher: "PubMed / ACSM",
  },
  "resistance-training-monitoring": {
    title: "Methods for Regulating and Monitoring Resistance Training",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7706636/",
    publisher: "PubMed Central",
  },
  "cdc-sleep": {
    title: "About Sleep",
    url: "https://www.cdc.gov/sleep/about/index.html",
    publisher: "CDC",
  },
  "nih-supplements": {
    title: "Dietary Supplements for Exercise and Athletic Performance",
    url: "https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/",
    publisher: "NIH Office of Dietary Supplements",
  },
  "womens-health-cycle": {
    title: "Your menstrual cycle",
    url: "https://womenshealth.gov/menstrual-cycle/your-menstrual-cycle",
    publisher: "Office on Women's Health",
  },
  "womens-health-period-problems": {
    title: "Period problems",
    url: "https://womenshealth.gov/menstrual-cycle/period-problems",
    publisher: "Office on Women's Health",
  },
  "womens-health-menopause": {
    title: "Menopause basics",
    url: "https://womenshealth.gov/menopause/menopause-basics",
    publisher: "Office on Women's Health",
  },
  "womens-health-birth-control": {
    title: "Birth control methods",
    url: "https://womenshealth.gov/publications/our-publications/fact-sheet/birth-control-methods.html",
    publisher: "Office on Women's Health",
  },
  "acog-postpartum-exercise": {
    title: "Physical Activity and Exercise During Pregnancy and the Postpartum Period",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/04/physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period",
    publisher: "ACOG",
  },
  "womens-health-recovering-birth": {
    title: "Recovering from birth",
    url: "https://womenshealth.gov/pregnancy/childbirth-and-beyond/recovering-birth",
    publisher: "Office on Women's Health",
  },
  "apple-wrist-temperature": {
    title: "Track your nightly wrist temperature changes with Apple Watch",
    url: "https://support.apple.com/en-us/102674",
    publisher: "Apple Support",
  },
  "apple-heart-rate": {
    title: "Monitor your heart rate with Apple Watch",
    url: "https://support.apple.com/en-us/120277",
    publisher: "Apple Support",
  },
  "medline-sports-injuries": {
    title: "Sports Injuries",
    url: "https://medlineplus.gov/sportsinjuries.html",
    publisher: "MedlinePlus",
  },
  "medline-low-back-pain": {
    title: "Low back pain - acute",
    url: "https://medlineplus.gov/ency/article/007425.htm",
    publisher: "MedlinePlus",
  },
  "cdc-common-cold": {
    title: "Manage Common Cold",
    url: "https://www.cdc.gov/common-cold/treatment/index.html",
    publisher: "CDC",
  },
  "cdc-when-sick": {
    title: "Preventing Spread of Respiratory Viruses When You're Sick",
    url: "https://www.cdc.gov/respiratory-viruses/prevention/precautions-when-sick.html",
    publisher: "CDC",
  },
};

const TAG_SOURCE_KEYS: Partial<Record<string, string[]>> = {
  recovery: ["acsm-progression", "resistance-training-monitoring"],
  readiness: ["acsm-progression", "resistance-training-monitoring"],
  sleep: ["cdc-sleep", "acsm-progression"],
  hrv: ["apple-heart-rate", "resistance-training-monitoring"],
  "apple-health": ["apple-heart-rate", "apple-wrist-temperature"],
  wearables: ["apple-heart-rate", "apple-wrist-temperature"],
  "wearable-data": ["apple-heart-rate", "apple-wrist-temperature"],
  cycle: ["womens-health-cycle", "womens-health-period-problems"],
  "menstrual-cycle": ["womens-health-cycle", "womens-health-period-problems"],
  "female-athletes": ["womens-health-cycle", "acsm-progression"],
  nutrition: ["nih-supplements", "acsm-progression"],
  supplements: ["nih-supplements", "acsm-progression"],
  hydration: ["nih-supplements", "cdc-sleep"],
  "glp-1": ["nih-supplements", "acsm-progression"],
  health: ["nih-supplements", "cdc-sleep"],
  injuries: ["medline-sports-injuries", "acsm-progression"],
  "injury-prevention": ["medline-sports-injuries", "acsm-progression"],
  adaptation: ["medline-sports-injuries", "resistance-training-monitoring"],
  pain: ["medline-sports-injuries", "resistance-training-monitoring"],
  postpartum: ["acog-postpartum-exercise", "womens-health-recovering-birth"],
  perimenopause: ["womens-health-menopause", "womens-health-cycle"],
};

const SLUG_SOURCE_KEYS: Partial<Record<string, string[]>> = {
  "apple-watch-wrist-temperature-cycle-training": [
    "apple-wrist-temperature",
    "womens-health-cycle",
  ],
  "apple-watch-hrv-strength-training": ["apple-heart-rate", "cdc-sleep"],
  "garmin-recovery-data-for-lifters": ["apple-heart-rate", "cdc-sleep"],
  "hormonal-birth-control-strength-training": [
    "womens-health-birth-control",
    "womens-health-cycle",
  ],
  "postpartum-return-to-lifting-timeline": [
    "acog-postpartum-exercise",
    "womens-health-recovering-birth",
  ],
  "perimenopause-strength-training-programming": [
    "womens-health-menopause",
    "womens-health-cycle",
  ],
  "strength-training-when-you-have-a-cold": [
    "cdc-common-cold",
    "cdc-when-sick",
  ],
  "lower-back-pain-deadlift-modifications": [
    "medline-low-back-pain",
    "medline-sports-injuries",
  ],
};

export const HEALTH_ADJACENT_TAGS = new Set([
  "recovery",
  "readiness",
  "sleep",
  "hrv",
  "apple-health",
  "wearables",
  "wearable-data",
  "cycle",
  "menstrual-cycle",
  "female-athletes",
  "nutrition",
  "supplements",
  "hydration",
  "glp-1",
  "health",
  "injuries",
  "injury-prevention",
  "adaptation",
  "pain",
  "postpartum",
  "perimenopause",
]);

function buildSourcesForPost(post: BlogPost): BlogSource[] {
  const sourceKeys = new Set<string>([
    "acsm-progression",
    "resistance-training-monitoring",
  ]);

  for (const tag of post.tags) {
    for (const key of TAG_SOURCE_KEYS[tag] ?? []) {
      sourceKeys.add(key);
    }
  }

  for (const key of SLUG_SOURCE_KEYS[post.slug] ?? []) {
    sourceKeys.add(key);
  }

  return [...sourceKeys]
    .map((key) => SOURCE_LIBRARY[key])
    .filter(Boolean)
    .slice(0, 4);
}

export function isHealthAdjacentPost(post: Pick<BlogPost, "slug" | "tags">): boolean {
  return (
    SLUG_SOURCE_KEYS[post.slug]?.some((key) => key !== "acsm-progression") === true ||
    post.tags.some((tag) => HEALTH_ADJACENT_TAGS.has(tag))
  );
}

function buildTrustMetadata(post: BlogPost): Pick<
  BlogPost,
  "authorSlug" | "reviewedBy" | "reviewedAt" | "sources"
> {
  const healthAdjacent = isHealthAdjacentPost(post);

  return {
    authorSlug: DEFAULT_AUTHOR_SLUG,
    reviewedBy: healthAdjacent ? EDITORIAL_REVIEW_SLUG : undefined,
    reviewedAt: healthAdjacent ? post.updatedAt ?? post.publishedAt : undefined,
    sources: post.sources?.length ? post.sources : buildSourcesForPost(post),
  };
}

function isValidSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function mergePostEnhancements(post: BlogPost): BlogPost {
  return {
    ...post,
    ...getPostEnhancement(post),
    ...buildTrustMetadata(post),
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

  if (!AUTHOR_SLUG_RE.test(post.authorSlug)) {
    errors.push("authorSlug must use a lowercase hyphenated slug");
  }

  const authorProfile = getAuthor(post.authorSlug);
  if (!authorProfile) {
    errors.push(`authorSlug ${post.authorSlug} must resolve to a known author`);
  } else if (post.author !== authorProfile.name) {
    errors.push(`author must match authorSlug ${post.authorSlug}`);
  }

  if (!post.sources.length) {
    errors.push("sources must contain at least one source");
  }

  post.sources.forEach((source, index) => {
    if (!source.title.trim()) {
      errors.push(`sources[${index}].title is required`);
    }
    if (!source.publisher.trim()) {
      errors.push(`sources[${index}].publisher is required`);
    }
    if (!isValidSourceUrl(source.url)) {
      errors.push(`sources[${index}].url must use a valid https URL`);
    }
  });

  if (post.reviewedAt && !ISO_DATE_RE.test(post.reviewedAt)) {
    errors.push("reviewedAt must use YYYY-MM-DD");
  }

  if (post.reviewedBy && !post.reviewedAt) {
    errors.push("reviewedBy requires reviewedAt");
  }

  if (post.reviewedAt && !post.reviewedBy) {
    errors.push("reviewedAt requires reviewedBy");
  }

  if (post.reviewedBy && !AUTHOR_SLUG_RE.test(post.reviewedBy)) {
    errors.push("reviewedBy must use a lowercase hyphenated slug");
  }

  if (post.reviewedAt && post.reviewedAt > todayIso) {
    errors.push(`reviewedAt ${post.reviewedAt} cannot be after ${todayIso}`);
  }

  if (post.reviewedAt && post.reviewedAt < post.publishedAt) {
    errors.push(`reviewedAt ${post.reviewedAt} cannot be earlier than publishedAt ${post.publishedAt}`);
  }

  if (post.reviewedBy && !getAuthor(post.reviewedBy)) {
    errors.push(`reviewedBy ${post.reviewedBy} must resolve to a known author`);
  }

  if (isHealthAdjacentPost(post) && post.sources.length < 2) {
    errors.push("health-adjacent posts must include at least two sources");
  }

  if (isHealthAdjacentPost(post) && !post.reviewedBy) {
    errors.push("health-adjacent posts must include reviewedBy");
  }

  if (isHealthAdjacentPost(post) && !post.reviewedAt) {
    errors.push("health-adjacent posts must include reviewedAt");
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
