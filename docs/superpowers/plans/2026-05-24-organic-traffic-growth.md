# Organic Traffic Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the 10 organic traffic improvements identified for `sundeefundee.com`: richer topic hubs, printable-plan landing pages, deeper SEO pages, content-gap publishing, indexable tools, trust signals, better metadata, stronger internal links, schema cleanup, and a Search Console feedback loop.

**Architecture:** Keep the site static-first and repo-native. Add structured content registries under `src/lib/`, render them through App Router pages, validate them with Vitest and `scripts/seo-pages-validation.mjs`, and ship in small commits that each produce crawlable pages or measurable SEO quality improvements.

**Tech Stack:** Next.js App Router 16, React 19, TypeScript, Tailwind CSS utilities in JSX, JSON blog content under `src/app/blog/content/*.json`, Vitest, Node validation scripts, Vercel Analytics, OpenNext/Cloudflare deployment.

---

## Current Baseline

- The live sitemap currently exposes 102 URLs: 57 blog posts, 27 SEO landing pages, 5 blog topic pages, and 13 core pages.
- `src/app/robots.ts` allows crawling and points to `https://sundeefundee.com/sitemap.xml`.
- `npm run test:seo` currently passes with `Validated 27 SEO pages and schema integrations.`
- Blog content is loaded from `src/app/blog/content/*.json`; every new post must also be supported by `src/app/blog/post-enhancements.ts`.
- The current branch is `main` and is even with `origin/main` at plan creation.

## File Structure

### New Files

- `src/lib/topic-hubs.ts`
  - Owns long-form hub content for the 5 blog topics.
  - Exports `topicHubs`, `getTopicHub(topicSlug)`, and type definitions.

- `src/app/blog/topic/topic-hubs.test.ts`
  - Verifies every `BLOG_TOPICS` entry has a hub, enough copy, internal links, and CTA content.

- `src/app/workout-plans/[plan]/page.tsx`
  - Static detail pages for each printable PDF plan.
  - Uses `workoutPlans` data and 404s unknown plan slugs.

- `src/lib/workout-plan-pages.test.ts`
  - Verifies every workout plan has SEO landing fields, FAQ content, sample week data, and sitemap coverage expectations.

- `src/lib/training-tools.ts`
  - Registry and pure calculation helpers for indexable tools.
  - Exports `trainingTools`, `getTrainingTool(slug)`, `calculateReadinessRecommendation`, `calculateEstimatedOneRepMax`, and `classifyDeloadNeed`.

- `src/lib/training-tools.test.ts`
  - Unit tests for tool calculations and registry completeness.

- `src/app/tools/page.tsx`
  - Tools index page.

- `src/app/tools/[tool]/page.tsx`
  - Static tool detail route.

- `src/components/tools/ReadinessScoreCalculator.tsx`
  - Client component for readiness score calculator.

- `src/components/tools/DeloadPlanner.tsx`
  - Client component for deload planner.

- `src/components/tools/OneRepMaxReadinessChecklist.tsx`
  - Client component for max-test readiness.

- `src/components/tools/RpeRirChart.tsx`
  - Static/client-enhanced chart for RPE/RIR guidance.

- `src/components/tools/CycleSymptomWorkoutModifier.tsx`
  - Client component for symptom-based session modification.

- `src/lib/authors.ts`
  - Author/reviewer metadata and trust-signal copy.

- `src/app/authors/[author]/page.tsx`
  - Static author profile pages.

- `src/app/methodology/page.tsx`
  - How content is produced, reviewed, and kept training-focused.

- `src/lib/internal-linking.ts`
  - Computes topic hub, product page, SEO page, tool, and sibling-article links for each post.

- `src/app/blog/internal-linking.test.ts`
  - Verifies every post receives a topic hub link, product link, SEO link, and at least 2 sibling article links.

- `src/lib/metadata-quality.ts`
  - Pure helpers for metadata title/description quality checks.

- `src/lib/metadata-quality.test.ts`
  - Unit tests for title and description quality constraints.

- `scripts/seo-metadata-audit.mjs`
  - Repo-level audit for generic titles, duplicate metadata, weak descriptions, and missing static routes.

- `src/lib/search-console-opportunities.ts`
  - Parser and scorer for Google Search Console CSV exports.

- `src/lib/search-console-opportunities.test.ts`
  - Unit tests for opportunity scoring.

- `docs/seo/search-console-workflow.md`
  - Monthly operating procedure for turning Search Console data into repo work.

### Modified Files

- `src/app/blog/topic/[topic]/page.tsx`
  - Render full hub copy and richer JSON-LD.

- `src/app/blog/page.tsx`
  - Improve metadata, add stronger topic-hub copy, and link tools.

- `src/app/blog/[slug]/page.tsx`
  - Add author URLs, reviewed content block, source links, and deterministic internal-link blocks.

- `src/app/blog/posts.ts`
  - Extend `BlogPost` with optional `authorSlug`, `reviewedBy`, `reviewedAt`, and `sources`.

- `src/app/blog/post-enhancements.ts`
  - Add enhancement entries for all new blog posts.

- `src/app/blog/posts.test.ts`
  - Enforce source/trust requirements for health-adjacent content and word-count requirements for new priority content.

- `src/app/blog/taxonomy.ts`
  - Add helper metadata needed by hubs if it does not belong in `topic-hubs.ts`.

- `src/lib/workout-plans.ts`
  - Add landing page copy, sample week data, FAQ, related links, and metadata fields for each plan.

- `src/app/workout-plans/page.tsx`
  - Link each plan card to its landing page while keeping direct PDF download available.

- `src/lib/seo-pages.ts`
  - Add deeper landing-page fields: comparison rows, workflow steps, screenshots, proof blocks, and related tool links.

- `src/app/[seoSlug]/page.tsx`
  - Render the expanded SEO page fields.

- `src/lib/seo.ts`
  - Add reusable JSON-LD helpers for `Article`, author profiles, tools, and enhanced software app data.

- `src/app/sitemap.ts`
  - Include workout-plan detail pages, tools, author pages, and methodology page.

- `src/components/SiteHeader.tsx`
  - Add a `Tools` link if there is enough room on desktop; keep mobile menu complete.

- `src/components/SiteFooter.tsx`
  - Add tools, methodology, author, and high-value hub links.

- `scripts/seo-pages-validation.mjs`
  - Validate new route families and structured-data helpers.

- `package.json`
  - Add `test:metadata`: `node scripts/seo-metadata-audit.mjs`.

---

## Phase 1: Topic Hubs

### Task 1: Add Topic Hub Content Registry

**Files:**
- Create: `src/lib/topic-hubs.ts`
- Create: `src/app/blog/topic/topic-hubs.test.ts`
- Modify: `src/app/blog/topic/[topic]/page.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Write the failing topic hub registry test**

Create `src/app/blog/topic/topic-hubs.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { BLOG_TOPICS } from "../taxonomy";
import { getTopicHub, topicHubs } from "@/lib/topic-hubs";

function wordCount(value: string) {
  return value.split(/\s+/).filter(Boolean).length;
}

describe("topic hubs", () => {
  it("defines substantial hub content for every blog topic", () => {
    expect(topicHubs).toHaveLength(BLOG_TOPICS.length);

    for (const topic of BLOG_TOPICS) {
      const hub = getTopicHub(topic.slug);

      expect(hub.title).toContain(topic.label);
      expect(wordCount([hub.intro, ...hub.sections.flatMap((section) => section.body)].join(" "))).toBeGreaterThanOrEqual(800);
      expect(hub.startHereLinks).toHaveLength(3);
      expect(hub.sections.length).toBeGreaterThanOrEqual(4);
      expect(hub.relatedSeoPages.length).toBeGreaterThanOrEqual(2);
      expect(hub.relatedTools.length).toBeGreaterThanOrEqual(1);
    }
  });
});
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
npm test -- src/app/blog/topic/topic-hubs.test.ts
```

Expected: fail because `@/lib/topic-hubs` does not exist.

- [ ] **Step 3: Create `src/lib/topic-hubs.ts`**

Use these topic hub slugs and content requirements:

| Topic | Required `relatedSeoPages` | Required `relatedTools` |
| --- | --- | --- |
| `recovery-readiness` | `/strength-training-recovery`, `/readiness-score-strength-training`, `/best-recovery-strength-training-app` | `/tools/readiness-score-calculator`, `/tools/deload-week-planner` |
| `training-around-pain` | `/lifting-with-injuries`, `/strength-training-after-injury`, `/injury-friendly-workout-planner` | `/tools/readiness-score-calculator` |
| `women-who-lift` | `/strength-training-for-women`, `/cycle-aware-training`, `/strength-training-during-period` | `/tools/cycle-symptom-workout-modifier` |
| `wearables-health-data` | `/wearables-and-strength-training`, `/apple-health-strength-training-app`, `/hrv-strength-training-app` | `/tools/readiness-score-calculator` |
| `programming-basics` | `/strength-training-plan-for-women`, `/beginner-strength-training-plan`, `/deload-week-planner` | `/tools/one-rep-max-readiness-checklist`, `/tools/rpe-rir-chart` |

Each hub must include:

- 1 intro of at least 140 words.
- 4 sections, each with 2 paragraphs.
- 3 start-here links to existing articles.
- 2 or more SEO landing links.
- 1 or more tool links.
- 1 product CTA aligned to `BLOG_TOPICS.productHref`.

- [ ] **Step 4: Render hubs in the topic route**

Modify `src/app/blog/topic/[topic]/page.tsx` so it:

- Imports `getTopicHub`.
- Uses `hub.metaTitle` and `hub.metaDescription` in `generateMetadata`.
- Renders hub intro before the article list.
- Renders `startHereLinks` above the full list.
- Renders `sections`, `relatedSeoPages`, and `relatedTools`.
- Keeps existing article cards.
- Emits `CollectionPage`, `BreadcrumbList`, and `ItemList` JSON-LD.

- [ ] **Step 5: Add sitemap validation expectations**

Modify `scripts/seo-pages-validation.mjs` to assert:

```js
assert.match(blogTopicRoute, /getTopicHub/, "Blog topic route should render topic hub content");
assert.match(blogTopicRoute, /relatedTools/, "Blog topic route should link related tools");
```

- [ ] **Step 6: Verify**

Run:

```bash
npm test -- src/app/blog/topic/topic-hubs.test.ts
npm run test:seo
npm run typecheck
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/topic-hubs.ts src/app/blog/topic/topic-hubs.test.ts src/app/blog/topic/[topic]/page.tsx scripts/seo-pages-validation.mjs
git commit -m "feat: expand blog topic hubs"
```

---

## Phase 2: Printable Plan Landing Pages

### Task 2: Add One SEO Page Per Workout Plan

**Files:**
- Modify: `src/lib/workout-plans.ts`
- Create: `src/app/workout-plans/[plan]/page.tsx`
- Modify: `src/app/workout-plans/page.tsx`
- Modify: `src/app/sitemap.ts`
- Create: `src/lib/workout-plan-pages.test.ts`

- [ ] **Step 1: Extend workout plan data**

Add these fields to `WorkoutPlan` in `src/lib/workout-plans.ts`:

```ts
landingTitle: string;
landingDescription: string;
searchIntent: string;
sampleWeek: Array<{ day: string; focus: string; workout: string }>;
whoItFits: string[];
whoShouldSkip: string[];
faqs: Array<{ question: string; answer: string }>;
relatedLinks: Array<{ href: string; label: string; description: string }>;
```

Populate every existing plan with unique values. Use these primary keywords:

| Plan slug | Primary keyword |
| --- | --- |
| `100-push-ups` | 8 week 100 push ups program |
| `russian-squat-program` | 6 week Russian squat program |
| `first-margarita` | advanced 8 week strength program |
| `beginner-strength` | 4 week beginner strength plan |
| `dumbbell-strength` | 6 week dumbbell strength plan |
| `glutes-core-conditioning` | 8 week glutes core conditioning plan |

- [ ] **Step 2: Write the workout plan page test**

Create `src/lib/workout-plan-pages.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { workoutPlans } from "./workout-plans";

describe("workout plan SEO pages", () => {
  it("has complete landing-page data for every printable plan", () => {
    for (const plan of workoutPlans) {
      expect(plan.landingTitle.length).toBeGreaterThanOrEqual(35);
      expect(plan.landingDescription.length).toBeGreaterThanOrEqual(120);
      expect(plan.searchIntent.length).toBeGreaterThanOrEqual(25);
      expect(plan.sampleWeek).toHaveLength(3);
      expect(plan.whoItFits.length).toBeGreaterThanOrEqual(3);
      expect(plan.whoShouldSkip.length).toBeGreaterThanOrEqual(2);
      expect(plan.faqs.length).toBeGreaterThanOrEqual(4);
      expect(plan.relatedLinks.length).toBeGreaterThanOrEqual(3);
    }
  });
});
```

- [ ] **Step 3: Create the dynamic static route**

Create `src/app/workout-plans/[plan]/page.tsx` with:

- `dynamicParams = false`.
- `generateStaticParams()` from `workoutPlans`.
- `generateMetadata()` from the selected plan.
- JSON-LD: `BreadcrumbList`, `CreativeWork`, `FAQPage`, and `ItemList`.
- Hero section with cover image and direct PDF CTA.
- Sample week table.
- Who it fits / who should skip lists.
- FAQ section.
- Related links section.
- Bottom CTA to `/workout-plans` and App Store buttons.

- [ ] **Step 4: Link from the listing page**

Modify `src/app/workout-plans/page.tsx`:

- Plan cards should link to `/workout-plans/${plan.slug}`.
- Keep a direct PDF download button inside each card.
- Use descriptive anchor text: `View ${plan.shortTitle} plan details`.

- [ ] **Step 5: Add route family to sitemap**

Modify `src/app/sitemap.ts` to include:

```ts
const workoutPlanEntries: MetadataRoute.Sitemap = workoutPlans.map((plan) => ({
  url: `${SITE_URL}/workout-plans/${plan.slug}`,
  lastModified: siteLastModified,
  changeFrequency: "monthly",
  priority: 0.78,
}));
```

Spread `...workoutPlanEntries` before blog posts.

- [ ] **Step 6: Verify**

Run:

```bash
npm test -- src/lib/workout-plan-pages.test.ts
npm run test:seo
npm run typecheck
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/workout-plans.ts src/lib/workout-plan-pages.test.ts src/app/workout-plans src/app/sitemap.ts scripts/seo-pages-validation.mjs
git commit -m "feat: add printable plan landing pages"
```

---

## Phase 3: Deeper Programmatic SEO Pages

### Task 3: Expand `seoPages` Beyond Templated Copy

**Files:**
- Modify: `src/lib/seo-pages.ts`
- Modify: `src/app/[seoSlug]/page.tsx`
- Modify: `scripts/seo-pages-validation.mjs`
- Create: `src/lib/seo-pages-quality.test.ts`

- [ ] **Step 1: Add richer page fields**

Extend `SeoPage` in `src/lib/seo-pages.ts`:

```ts
export type SeoPageComparisonRow = {
  feature: string;
  sundeeFundee: string;
  typicalAlternative: string;
};

export type SeoPageWorkflowStep = {
  title: string;
  body: string;
};

export type SeoPageProofBlock = {
  title: string;
  body: string;
};

export type SeoPage = {
  // existing fields
  comparisonRows?: SeoPageComparisonRow[];
  workflowSteps?: SeoPageWorkflowStep[];
  proofBlocks?: SeoPageProofBlock[];
  relatedTools?: SeoPageLink[];
};
```

- [ ] **Step 2: Write the quality test**

Create `src/lib/seo-pages-quality.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { seoPages } from "./seo-pages";

describe("SEO landing page quality", () => {
  it("adds rich sections to high-intent commercial pages", () => {
    const highIntentKinds = new Set(["comparison", "feature"]);
    const highIntentPages = seoPages.filter((page) => highIntentKinds.has(page.kind));

    for (const page of highIntentPages) {
      expect(page.sections.length, page.slug).toBeGreaterThanOrEqual(4);
      expect(page.comparisonRows?.length ?? 0, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.workflowSteps?.length ?? 0, page.slug).toBeGreaterThanOrEqual(3);
      expect(page.proofBlocks?.length ?? 0, page.slug).toBeGreaterThanOrEqual(2);
    }
  });
});
```

- [ ] **Step 3: Populate priority pages first**

Add rich fields to these 12 pages first:

- `best-strength-training-app-for-women`
- `best-apple-health-strength-training-app`
- `best-recovery-strength-training-app`
- `free-strength-training-app-for-women`
- `strength-training-log-for-women`
- `hrv-strength-training-app`
- `fitbod-alternative-for-women`
- `hevy-alternative-for-strength-training`
- `readiness-score-strength-training`
- `injury-friendly-workout-planner`
- `strength-training-plan-for-women`
- `cycle-aware-training`

For each page:

- Add 3 comparison rows.
- Add 3 workflow steps.
- Add 2 proof blocks.
- Add at least 1 related tool when a matching tool exists.

- [ ] **Step 4: Render expanded fields**

Modify `src/app/[seoSlug]/page.tsx`:

- Render comparison rows as a table.
- Render workflow steps as an ordered list.
- Render proof blocks as short cards.
- Render related tool links in the related-resources section.
- Keep existing FAQ and related links.

- [ ] **Step 5: Verify**

Run:

```bash
npm test -- src/lib/seo-pages-quality.test.ts
npm run test:seo
npm run typecheck
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo-pages.ts src/lib/seo-pages-quality.test.ts src/app/[seoSlug]/page.tsx scripts/seo-pages-validation.mjs
git commit -m "feat: deepen high-intent SEO pages"
```

---

## Phase 4: Content Gap Publishing

### Task 4: Publish 12 Gap-Filling Blog Articles

**Files:**
- Create: `src/app/blog/content/*.json`
- Modify: `src/app/blog/post-enhancements.ts`
- Modify: `src/app/blog/posts.test.ts`

- [ ] **Step 1: Add the 12 article files**

Create one JSON file per article under `src/app/blog/content/`.

| Publish order | Slug | Primary topic | Intent | Minimum words |
| --- | --- | --- | --- | --- |
| 1 | `garmin-body-battery-strength-training` | `wearables-health-data` | `metric-explainer` | 1400 |
| 2 | `whoop-recovery-strength-training` | `wearables-health-data` | `compare-options` | 1400 |
| 3 | `oura-ring-strength-training-readiness` | `wearables-health-data` | `metric-explainer` | 1400 |
| 4 | `apple-watch-training-load-strength-training` | `wearables-health-data` | `metric-explainer` | 1400 |
| 5 | `knee-pain-squat-modifications` | `training-around-pain` | `checklist` | 1400 |
| 6 | `hip-pain-squat-deadlift-modifications` | `training-around-pain` | `checklist` | 1400 |
| 7 | `elbow-pain-pressing-strength-training` | `training-around-pain` | `checklist` | 1400 |
| 8 | `neck-trap-pain-overhead-press-modifications` | `training-around-pain` | `checklist` | 1400 |
| 9 | `four-day-upper-lower-strength-plan-women` | `programming-basics` | `protocol` | 1400 |
| 10 | `home-dumbbell-progressive-overload-women` | `programming-basics` | `protocol` | 1400 |
| 11 | `barbell-strength-plan-for-women` | `programming-basics` | `compare-options` | 1400 |
| 12 | `when-to-increase-weight-strength-training` | `programming-basics` | `decision-guide` | 1400 |

Every article must include:

- `author`: `Sundee Fundee Team`
- `authorSlug`: `sundee-fundee-team`
- `reviewedBy`: `Sundee Fundee Editorial Review`
- `reviewedAt`: same date as `publishedAt`
- `sources`: at least 2 source objects with `title`, `url`, and `publisher`
- At least 5 internal links:
  - 1 topic hub
  - 1 product page
  - 1 SEO landing page
  - 2 sibling blog posts

- [ ] **Step 2: Add enhancement entries**

Modify `src/app/blog/post-enhancements.ts` to add each slug with the exact `articleIntent` listed above.

- [ ] **Step 3: Strengthen blog validation**

Modify `src/app/blog/posts.test.ts`:

```ts
it("keeps new gap-filling articles substantial and source-backed", () => {
  const postsBySlug = new Map(
    loadPosts({ todayIso: "2026-06-15" }).map((post) => [post.slug, post]),
  );
  const newSlugs = [
    "garmin-body-battery-strength-training",
    "whoop-recovery-strength-training",
    "oura-ring-strength-training-readiness",
    "apple-watch-training-load-strength-training",
    "knee-pain-squat-modifications",
    "hip-pain-squat-deadlift-modifications",
    "elbow-pain-pressing-strength-training",
    "neck-trap-pain-overhead-press-modifications",
    "four-day-upper-lower-strength-plan-women",
    "home-dumbbell-progressive-overload-women",
    "barbell-strength-plan-for-women",
    "when-to-increase-weight-strength-training",
  ];

  for (const slug of newSlugs) {
    const post = postsBySlug.get(slug);
    expect(post, `${slug} should exist`).toBeDefined();
    expect(post?.body.split(/\s+/).filter(Boolean).length ?? 0).toBeGreaterThanOrEqual(1400);
    expect(post?.sources?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(post?.authorSlug).toBe("sundee-fundee-team");
    expect(post?.reviewedBy).toBe("Sundee Fundee Editorial Review");
  }
});
```

- [ ] **Step 4: Verify**

Run:

```bash
BLOG_VALIDATION_DATE=2026-06-15 npm test -- src/app/blog/posts.test.ts
npm run typecheck
npm run build
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/blog/content src/app/blog/post-enhancements.ts src/app/blog/posts.test.ts
git commit -m "feat: publish organic traffic gap articles"
```

---

## Phase 5: Indexable Training Tools

### Task 5: Add Tool Registry and Static Tool Pages

**Files:**
- Create: `src/lib/training-tools.ts`
- Create: `src/lib/training-tools.test.ts`
- Create: `src/app/tools/page.tsx`
- Create: `src/app/tools/[tool]/page.tsx`
- Create: `src/components/tools/*.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`

- [ ] **Step 1: Write calculation tests**

Create `src/lib/training-tools.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  calculateEstimatedOneRepMax,
  calculateReadinessRecommendation,
  classifyDeloadNeed,
  trainingTools,
} from "./training-tools";

describe("training tools", () => {
  it("registers five indexable tools", () => {
    expect(trainingTools.map((tool) => tool.slug)).toEqual([
      "readiness-score-calculator",
      "deload-week-planner",
      "one-rep-max-readiness-checklist",
      "rpe-rir-chart",
      "cycle-symptom-workout-modifier",
    ]);
  });

  it("calculates readiness recommendations", () => {
    expect(calculateReadinessRecommendation({ sleep: 9, soreness: 2, stress: 2, pain: 0 }).mode).toBe("push");
    expect(calculateReadinessRecommendation({ sleep: 4, soreness: 8, stress: 7, pain: 6 }).mode).toBe("modify");
  });

  it("calculates estimated one rep max", () => {
    expect(calculateEstimatedOneRepMax({ weight: 100, reps: 5 })).toBe(117);
  });

  it("classifies deload need", () => {
    expect(classifyDeloadNeed({ poorSleepDays: 5, highSorenessDays: 4, performanceDropSessions: 2 })).toBe("deload");
  });
});
```

- [ ] **Step 2: Implement pure tool helpers**

Create `src/lib/training-tools.ts` with:

- `trainingTools` registry for the 5 routes.
- `calculateReadinessRecommendation`.
- `calculateEstimatedOneRepMax` using Epley: `Math.round(weight * (1 + reps / 30))`.
- `classifyDeloadNeed`.
- `getTrainingTool(slug)`.

- [ ] **Step 3: Create tool pages**

Create:

- `src/app/tools/page.tsx`
- `src/app/tools/[tool]/page.tsx`

The detail route must:

- Use `dynamicParams = false`.
- Generate static params from `trainingTools`.
- Emit `WebPage`, `BreadcrumbList`, and `SoftwareApplication` JSON-LD.
- Render at least 600 words of evergreen explanatory copy per tool.
- Render the matching interactive component.

- [ ] **Step 4: Add navigation and sitemap**

Modify:

- `src/components/SiteHeader.tsx`: add `Tools`.
- `src/components/SiteFooter.tsx`: add top tool links.
- `src/app/sitemap.ts`: include `/tools` and each `/tools/${tool.slug}`.

- [ ] **Step 5: Verify**

Run:

```bash
npm test -- src/lib/training-tools.test.ts
npm run test:seo
npm run typecheck
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/training-tools.ts src/lib/training-tools.test.ts src/app/tools src/components/tools src/components/SiteHeader.tsx src/components/SiteFooter.tsx src/app/sitemap.ts
git commit -m "feat: add indexable strength training tools"
```

---

## Phase 6: Trust, Authors, Sources, and Review Signals

### Task 6: Add Authorship and Review Surfaces

**Files:**
- Create: `src/lib/authors.ts`
- Create: `src/app/authors/[author]/page.tsx`
- Create: `src/app/methodology/page.tsx`
- Modify: `src/app/blog/posts.ts`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/lib/seo.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/blog/posts.test.ts`

- [ ] **Step 1: Extend blog post type**

Modify `BlogPost` in `src/app/blog/posts.ts`:

```ts
authorSlug?: string;
reviewedBy?: string;
reviewedAt?: string;
sources?: Array<{
  title: string;
  url: string;
  publisher: string;
}>;
```

Update `validateBlogPost`:

- If a post has tags containing `cycle`, `menstrual-cycle`, `injuries`, `pain`, `hrv`, `wearables`, `apple-health`, `sleep`, or `nutrition`, require at least 2 sources.
- If `reviewedAt` exists, require `reviewedBy`.
- If `authorSlug` exists, require it to match `/^[a-z0-9-]+$/`.

- [ ] **Step 2: Create author registry**

Create `src/lib/authors.ts`:

- `sundee-fundee-team`
- `sundee-fundee-editorial-review`

Each author must include:

- `slug`
- `name`
- `role`
- `bio`
- `expertise`
- `profileSummary`

- [ ] **Step 3: Create author pages**

Create `src/app/authors/[author]/page.tsx`:

- `dynamicParams = false`.
- `generateStaticParams()` from authors.
- Metadata title: `${author.name} | Sundee Fundee`.
- Render bio, expertise, methodology link, and related posts.

- [ ] **Step 4: Create methodology page**

Create `src/app/methodology/page.tsx` with:

- How articles are selected.
- How training claims are reviewed.
- How medical boundaries are handled.
- How sources are used.
- How updates happen.

- [ ] **Step 5: Add article trust UI and JSON-LD**

Modify `src/app/blog/[slug]/page.tsx`:

- Link byline to `/authors/${post.authorSlug ?? "sundee-fundee-team"}`.
- Render `Reviewed by ...` when `reviewedBy` exists.
- Render source list below article body.
- Add a medical-boundary callout for health-adjacent topics.
- Add `author.url` and `reviewedBy` to `BlogPosting` JSON-LD when present.

- [ ] **Step 6: Verify**

Run:

```bash
npm test -- src/app/blog/posts.test.ts
npm run test:seo
npm run typecheck
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/authors.ts src/app/authors src/app/methodology src/app/blog/posts.ts src/app/blog/[slug]/page.tsx src/lib/seo.ts src/app/sitemap.ts src/app/blog/posts.test.ts
git commit -m "feat: add author and review trust signals"
```

---

## Phase 7: Metadata and CTR Improvements

### Task 7: Add Metadata Quality Guardrails

**Files:**
- Create: `src/lib/metadata-quality.ts`
- Create: `src/lib/metadata-quality.test.ts`
- Create: `scripts/seo-metadata-audit.mjs`
- Modify: `package.json`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/topic/[topic]/page.tsx`
- Modify: `src/lib/seo-pages.ts`

- [ ] **Step 1: Write metadata helper tests**

Create `src/lib/metadata-quality.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { scoreMetaDescription, scoreTitle } from "./metadata-quality";

describe("metadata quality", () => {
  it("rejects generic titles", () => {
    expect(scoreTitle("Blog").ok).toBe(false);
    expect(scoreTitle("Strength Training Articles for Recovery, Cycle, Pain & Wearables").ok).toBe(true);
  });

  it("checks useful description length", () => {
    expect(scoreMetaDescription("Short.").ok).toBe(false);
    expect(
      scoreMetaDescription(
        "Browse recovery-aware strength training articles about readiness, cycle context, pain modifications, wearable data, and flexible programming.",
      ).ok,
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Implement metadata helpers**

Create `src/lib/metadata-quality.ts`:

- `scoreTitle(title)`: fail if under 30 chars, over 70 chars, or exactly one of `Blog`, `FAQ`, `Apps`, `Roadmap`.
- `scoreMetaDescription(description)`: fail if under 110 chars or over 170 chars.

- [ ] **Step 3: Create repo-level metadata audit**

Create `scripts/seo-metadata-audit.mjs`:

- Read `src/app/blog/page.tsx`.
- Read `src/app/blog/topic/[topic]/page.tsx`.
- Read `src/lib/seo-pages.ts`.
- Fail if generic title strings remain:
  - `title: "Blog"`
  - `title: "FAQ"`
  - `title: "Apps"`
- Fail if topic metadata still uses only `${topic.label} Articles`.

- [ ] **Step 4: Improve metadata**

Modify:

- `src/app/blog/page.tsx`
  - Title: `Strength Training Articles for Recovery, Cycle, Pain & Wearables`
  - Description: `Browse recovery-aware strength training articles about readiness, cycle context, pain modifications, wearable data, and flexible programming.`

- `src/app/blog/topic/[topic]/page.tsx`
  - Use `hub.metaTitle`.
  - Use `hub.metaDescription`.

- `src/lib/seo-pages.ts`
  - Ensure each `eyebrow` used as title is descriptive enough or add a separate `metaTitle` field.

- [ ] **Step 5: Add package script**

Modify `package.json`:

```json
"test:metadata": "node scripts/seo-metadata-audit.mjs"
```

- [ ] **Step 6: Verify**

Run:

```bash
npm test -- src/lib/metadata-quality.test.ts
npm run test:metadata
npm run test:seo
npm run typecheck
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/metadata-quality.ts src/lib/metadata-quality.test.ts scripts/seo-metadata-audit.mjs package.json src/app/blog/page.tsx src/app/blog/topic/[topic]/page.tsx src/lib/seo-pages.ts
git commit -m "feat: improve SEO metadata guardrails"
```

---

## Phase 8: Internal Link Architecture

### Task 8: Add Deterministic Internal Link Blocks

**Files:**
- Create: `src/lib/internal-linking.ts`
- Create: `src/app/blog/internal-linking.test.ts`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/blog/topic/[topic]/page.tsx`
- Modify: `src/app/[seoSlug]/page.tsx`

- [ ] **Step 1: Write internal-link tests**

Create `src/app/blog/internal-linking.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { posts } from "./posts";
import { getInternalLinksForPost } from "@/lib/internal-linking";

describe("blog internal linking", () => {
  it("adds a complete internal link set to every post", () => {
    for (const post of posts) {
      const links = getInternalLinksForPost(post, posts);
      expect(links.topicHub.href).toMatch(/^\/blog\/topic\//);
      expect(links.productPage.href).toMatch(/^\//);
      expect(links.seoPage.href).toMatch(/^\//);
      expect(links.siblingArticles.length).toBeGreaterThanOrEqual(2);
      expect(links.siblingArticles.every((link) => link.href.startsWith("/blog/"))).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Implement link computation**

Create `src/lib/internal-linking.ts`:

- Use `getPrimaryTopic(post)`.
- Topic hub link: `topic.href`.
- Product link: `topic.productHref`.
- SEO page mapping:
  - `recovery-readiness` -> `/strength-training-recovery`
  - `training-around-pain` -> `/lifting-with-injuries`
  - `women-who-lift` -> `/strength-training-for-women`
  - `wearables-health-data` -> `/wearables-and-strength-training`
  - `programming-basics` -> `/strength-training-plan-for-women`
- Sibling articles: top 3 from `getRelatedPosts(post, allPosts)`.

- [ ] **Step 3: Render article link block**

Modify `src/app/blog/[slug]/page.tsx`:

- Import `getInternalLinksForPost`.
- Render a section after the Markdown body titled `Build the next training decision`.
- Include the topic hub, product page, SEO page, and sibling article links.
- Use descriptive anchor text, not `Learn more`.

- [ ] **Step 4: Cross-link hubs and SEO pages**

Modify:

- `src/app/blog/topic/[topic]/page.tsx`: link from hub to related SEO pages and tools.
- `src/app/[seoSlug]/page.tsx`: link back to relevant topic hubs when `page.related` or `page.relatedTools` points into a cluster.

- [ ] **Step 5: Verify**

Run:

```bash
npm test -- src/app/blog/internal-linking.test.ts
npm run test:seo
npm run typecheck
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/internal-linking.ts src/app/blog/internal-linking.test.ts src/app/blog/[slug]/page.tsx src/app/blog/topic/[topic]/page.tsx src/app/[seoSlug]/page.tsx
git commit -m "feat: strengthen internal link architecture"
```

---

## Phase 9: Structured Data Cleanup

### Task 9: Move JSON-LD Into Reusable Helpers

**Files:**
- Modify: `src/lib/seo.ts`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/[seoSlug]/page.tsx`
- Modify: `src/app/tools/[tool]/page.tsx`
- Modify: `src/app/workout-plans/[plan]/page.tsx`
- Modify: `scripts/seo-pages-validation.mjs`

- [ ] **Step 1: Add reusable schema helpers**

Modify `src/lib/seo.ts` with:

- `buildBlogPostingJsonLd(post, url, topic, imageUrl, authorUrl)`
- `buildProfilePageJsonLd(author, url)`
- `buildTrainingToolJsonLd(tool, url)`
- `buildEnhancedSoftwareApplicationJsonLd()`

Keep `buildFaqPageJsonLd`, but do not make FAQ schema the only rich-data signal on any page family.

- [ ] **Step 2: Replace inline blog schema**

Modify `src/app/blog/[slug]/page.tsx`:

- Replace inline `BlogPosting` object with `buildBlogPostingJsonLd`.
- Keep `BreadcrumbList`.

- [ ] **Step 3: Use tool and plan schema helpers**

Modify:

- `src/app/tools/[tool]/page.tsx`: use `buildTrainingToolJsonLd`.
- `src/app/workout-plans/[plan]/page.tsx`: keep `CreativeWork` and add `ItemList` for sample-week steps.

- [ ] **Step 4: Update validation script**

Add assertions in `scripts/seo-pages-validation.mjs`:

```js
assert.match(seo, /buildBlogPostingJsonLd/, "BlogPosting schema helper missing");
assert.match(seo, /buildTrainingToolJsonLd/, "Training tool schema helper missing");
assert.match(blogPostRoute, /buildBlogPostingJsonLd/, "Blog route should use schema helper");
```

- [ ] **Step 5: Verify**

Run:

```bash
npm run test:seo
npm run typecheck
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo.ts src/app/blog/[slug]/page.tsx src/app/[seoSlug]/page.tsx src/app/tools/[tool]/page.tsx src/app/workout-plans/[plan]/page.tsx scripts/seo-pages-validation.mjs
git commit -m "feat: consolidate SEO structured data"
```

---

## Phase 10: Search Console Feedback Loop

### Task 10: Add Search Console Opportunity Workflow

**Files:**
- Create: `src/lib/search-console-opportunities.ts`
- Create: `src/lib/search-console-opportunities.test.ts`
- Create: `docs/seo/search-console-workflow.md`
- Modify: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Write opportunity scoring tests**

Create `src/lib/search-console-opportunities.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { scoreSearchConsoleRow } from "./search-console-opportunities";

describe("Search Console opportunities", () => {
  it("prioritizes high-impression low-CTR pages", () => {
    const result = scoreSearchConsoleRow({
      page: "https://sundeefundee.com/blog/when-hrv-is-low-strength-training",
      query: "low hrv strength training",
      clicks: 4,
      impressions: 2000,
      ctr: 0.002,
      position: 8.4,
    });

    expect(result.priority).toBe("high");
    expect(result.recommendedAction).toBe("rewrite-title-description-and-intro");
  });
});
```

- [ ] **Step 2: Implement opportunity parser**

Create `src/lib/search-console-opportunities.ts`:

- Accept rows with `page`, `query`, `clicks`, `impressions`, `ctr`, and `position`.
- Return:
  - `high` when impressions >= 1000, CTR < 0.01, and position <= 12.
  - `medium` when impressions >= 500, CTR < 0.02, and position <= 20.
  - `low` otherwise.
- Recommended actions:
  - high: `rewrite-title-description-and-intro`
  - medium: `add-internal-links-and-refresh-section`
  - low: `monitor`

- [ ] **Step 3: Create workflow doc**

Create `docs/seo/search-console-workflow.md` with:

- How to export GSC query/page CSV monthly.
- How to identify high-impression low-CTR pages.
- How to turn each high-priority row into one repo issue:
  - metadata rewrite
  - intro refresh
  - internal links
  - add missing section
  - submit URL inspection after deploy
- Required verification:
  - `npm run test:metadata`
  - `npm run test:seo`
  - `npm run build`

- [ ] **Step 4: Add README command notes**

Modify `README.md`:

- Add a short `SEO operations` section.
- Mention `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- Mention the monthly workflow doc.
- Mention `npm run test:metadata` and `npm run test:seo`.

- [ ] **Step 5: Verify**

Run:

```bash
npm test -- src/lib/search-console-opportunities.test.ts
npm run test:metadata
npm run test:seo
npm run typecheck
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/search-console-opportunities.ts src/lib/search-console-opportunities.test.ts docs/seo/search-console-workflow.md README.md package.json
git commit -m "docs: add search console SEO workflow"
```

---

## Final Verification

After all phases:

- [ ] Run unit and content tests.

```bash
npm test
```

- [ ] Run SEO validation.

```bash
npm run test:seo
```

- [ ] Run metadata audit.

```bash
npm run test:metadata
```

- [ ] Run typecheck.

```bash
npm run typecheck
```

- [ ] Run production build.

```bash
npm run build
```

- [ ] Confirm sitemap route count increased.

```bash
node - <<'NODE'
import sitemap from "./src/app/sitemap.ts";
const entries = sitemap();
console.log(entries.length);
NODE
```

Expected after all phases: route count should be at least 128:

- 102 current URLs
- 6 workout-plan detail pages
- 6 tools pages including `/tools`
- 2 author/methodology pages
- 12 new blog posts

- [ ] Manual browser checks:

```bash
npm run dev
```

Open:

- `http://localhost:3000/blog/topic/recovery-readiness`
- `http://localhost:3000/workout-plans/100-push-ups`
- `http://localhost:3000/tools/readiness-score-calculator`
- `http://localhost:3000/authors/sundee-fundee-team`
- `http://localhost:3000/methodology`

Check:

- No overlapping text on mobile.
- Tool controls work.
- App Store buttons still render.
- Article pages show sources and internal links.
- Header and footer remain usable on mobile.

---

## Rollout Order

1. Topic hubs.
2. Workout plan landing pages.
3. SEO page depth.
4. Metadata guardrails.
5. Internal link architecture.
6. Structured data cleanup.
7. Trust/authorship pages.
8. Training tools.
9. Gap articles.
10. Search Console workflow.

This order front-loads durable page architecture before the large article batch. It also makes the later content immediately benefit from better hubs, metadata, and internal links.

## Self-Review

- Spec coverage: All 10 requested improvements are mapped to a phase and verification path.
- Placeholder scan: No red-flag placeholder language remains.
- Type consistency: New fields are named consistently across registries, routes, and tests.
- Risk: The largest execution risk is article volume in Phase 4. Keep it as a single content phase only if the worker can validate all 12 posts in one run; otherwise split Phase 4 into three commits by cluster.
