# Blog Page Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/blog` from a chronological article feed into a topic-driven training library with stronger discovery, contextual app CTAs, richer SEO, RSS, and per-article social images.

**Architecture:** Keep blog content in the existing JSON files and add a small taxonomy layer that maps tags/slugs to editorial topics, featured placement, contextual CTAs, and related-post logic. Pages should consume this taxonomy so the blog index, topic pages, article pages, sitemap, RSS, and metadata stay consistent without duplicating topic rules.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS classes in JSX, JSON-LD helpers in `src/lib/seo.ts`, existing `src/app/blog/content/*.json` content files.

---

## File Structure

- Create `src/app/blog/taxonomy.ts`
  - Owns blog topics, featured article slug, topic matching, contextual CTA copy, related-post selection, and topic URLs.
- Modify `src/app/blog/posts.ts`
  - Add optional `updatedAt`, optional `primaryTopic`, and optional `bestFor` fields to `BlogPost`.
  - Add date helpers used by RSS and page metadata.
- Modify `src/app/blog/page.tsx`
  - Add featured article, topic navigation, topic sections, tighter article cards, improved CTA, and `ItemList` JSON-LD.
- Create `src/app/blog/topic/[topic]/page.tsx`
  - Add SEO topic landing pages for each blog topic.
- Modify `src/app/blog/[slug]/page.tsx`
  - Add updated dates, contextual CTA, smarter related posts, better internal links, and topic metadata.
- Create `src/app/blog/[slug]/opengraph-image.tsx`
  - Generate per-post Open Graph images from post title and topic.
- Create `src/app/rss.xml/route.ts`
  - Generate RSS feed from blog posts.
- Modify `src/app/layout.tsx`
  - Add RSS discovery metadata if compatible with current metadata structure.
- Modify `src/app/sitemap.ts`
  - Add topic landing pages and RSS if desired.

---

### Task 1: Add Blog Taxonomy And Post Metadata Helpers

**Files:**
- Create: `src/app/blog/taxonomy.ts`
- Modify: `src/app/blog/posts.ts`

- [ ] **Step 1: Update `BlogPost` type**

In `src/app/blog/posts.ts`, replace the `BlogPost` type with:

```ts
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
```

Add this import at the top:

```ts
import type { BlogTopicSlug } from "./taxonomy";
```

- [ ] **Step 2: Add date helpers**

Still in `src/app/blog/posts.ts`, add these helpers after `formatDate`:

```ts
export function postModifiedAt(post: BlogPost): string {
  return post.updatedAt ?? post.publishedAt;
}

export function toRfc822Date(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toUTCString();
}
```

- [ ] **Step 3: Create taxonomy file**

Create `src/app/blog/taxonomy.ts`:

```ts
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
    matchTags: ["injuries", "injury-prevention", "adaptation", "warm-up"],
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
    matchTags: ["female-athletes", "cycle", "nutrition"],
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
      "Translate Garmin-style recovery data, Apple Health signals, and wearable trends into gym decisions.",
    eyebrow: "Health data",
    href: "/blog/topic/wearables-health-data",
    matchTags: ["garmin", "apple-health", "wearables", "hrv"],
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
    matchTags: ["programming", "strength", "testing", "rpe", "deload", "performance"],
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

export function getRelatedPosts(post: BlogPost, posts: BlogPost[], limit = 3): BlogPost[] {
  const topic = getPrimaryTopic(post);
  const sameTopic = posts.filter(
    (candidate) =>
      candidate.slug !== post.slug && getPrimaryTopic(candidate).slug === topic.slug,
  );
  const fallback = posts.filter(
    (candidate) =>
      candidate.slug !== post.slug &&
      !sameTopic.some((sameTopicPost) => sameTopicPost.slug === candidate.slug),
  );

  return [...sameTopic, ...fallback].slice(0, limit);
}

export function getPostCta(post: BlogPost): BlogTopic {
  return getPrimaryTopic(post);
}
```

- [ ] **Step 4: Typecheck the new data model**

Run:

```bash
npm run typecheck
```

Expected: TypeScript passes. If there is an import cycle error, convert the `BlogPost` imports in `taxonomy.ts` and `BlogTopicSlug` import in `posts.ts` to `import type`, which the snippets already do.

- [ ] **Step 5: Commit**

```bash
git add src/app/blog/posts.ts src/app/blog/taxonomy.ts
git commit -m "feat: add blog taxonomy helpers"
```

---

### Task 2: Upgrade Blog Index Into A Training Library

**Files:**
- Modify: `src/app/blog/page.tsx`

- [ ] **Step 1: Update imports**

In `src/app/blog/page.tsx`, change the SEO import to include `buildItemListJsonLd`:

```ts
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo";
```

Add taxonomy imports:

```ts
import {
  BLOG_TOPICS,
  FEATURED_POST_SLUG,
  getFeaturedPost,
  getPrimaryTopic,
  getTopicPosts,
} from "./taxonomy";
```

- [ ] **Step 2: Add derived blog collections**

Inside `BlogIndex`, after `sorted`, add:

```ts
const featured = getFeaturedPost(sorted);
const remainingPosts = sorted.filter((post) => post.slug !== featured.slug);
const topicSections = BLOG_TOPICS.map((topic) => ({
  topic,
  posts: getTopicPosts(sorted, topic.slug).slice(0, 3),
})).filter((section) => section.posts.length > 0);
```

- [ ] **Step 3: Add `ItemList` JSON-LD**

In the `JsonLd` `data` array, after the existing `CollectionPage` object, add:

```ts
buildItemListJsonLd(
  "Sundee Fundee Blog Articles",
  sorted.map((post) => ({
    name: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${post.slug}`,
  })),
),
```

- [ ] **Step 4: Replace the article list UI**

Replace the current second `<section className="px-6 pb-24">...</section>` with:

```tsx
<section className="px-6 pb-24">
  <div className="mx-auto max-w-6xl">
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <Link
        href={`/blog/${featured.slug}`}
        className="group rounded-2xl border border-border bg-surface p-8 transition hover:border-navy"
      >
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
          Start here
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">
          <time dateTime={featured.publishedAt}>
            {formatDate(featured.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{featured.readMinutes} min read</span>
          <span className="rounded-full bg-navy/5 px-3 py-1 text-[0.65rem] tracking-[0.15em] text-navy">
            {getPrimaryTopic(featured).label}
          </span>
        </div>
        <h2 className="font-display mt-5 text-4xl font-semibold leading-tight text-navy">
          {featured.title}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{featured.description}</p>
        <p className="mt-8 text-sm font-medium text-orange">
          Read the foundation article →
        </p>
      </Link>

      <div className="rounded-2xl border border-border p-6">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
          Browse by topic
        </p>
        <div className="mt-5 grid gap-3">
          {BLOG_TOPICS.map((topic) => (
            <Link
              key={topic.slug}
              href={topic.href}
              className="rounded-xl border border-border bg-surface p-4 transition hover:border-navy"
            >
              <h2 className="font-display text-xl font-semibold text-navy">
                {topic.label}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-14 grid gap-10">
      {topicSections.map(({ topic, posts: topicPosts }) => (
        <section key={topic.slug} aria-labelledby={`${topic.slug}-heading`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                {topic.eyebrow}
              </p>
              <h2
                id={`${topic.slug}-heading`}
                className="font-display mt-3 text-3xl font-bold text-navy"
              >
                {topic.label}
              </h2>
            </div>
            <Link
              href={topic.href}
              className="text-sm font-medium text-orange underline-offset-4 hover:underline"
            >
              View topic →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {topicPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-border bg-surface p-5 transition hover:border-navy"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readMinutes} min</span>
                </div>
                <h3 className="font-display mt-3 text-2xl font-semibold leading-tight text-navy">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {post.bestFor ?? post.description}
                </p>
                <p className="mt-5 text-sm font-medium text-orange">
                  Read article →
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>

    <div className="mt-14 rounded-2xl border border-border bg-surface p-6 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
        Read, then train
      </p>
      <h2 className="font-display mt-4 text-3xl font-bold text-navy">
        Put the training ideas into the app.
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-muted">
        The blog explains the method. The app applies it when recovery,
        pain, cycle context, or schedule changes make the old plan wrong.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <AppStoreButtons compact />
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Remove unused variables/imports**

Run:

```bash
npm run lint
```

Expected: lint passes. If it reports `remainingPosts` or `FEATURED_POST_SLUG` as unused, remove that variable/import. `FEATURED_POST_SLUG` is only needed if used in copy or debug labels; otherwise keep the taxonomy helper as the single owner.

- [ ] **Step 6: Verify build**

Run:

```bash
npm run typecheck
npm run build
```

Expected: both pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat: improve blog index discovery"
```

---

### Task 3: Add Blog Topic Landing Pages

**Files:**
- Create: `src/app/blog/topic/[topic]/page.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Create topic route**

Create `src/app/blog/topic/[topic]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
} from "@/lib/seo";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";
import { formatDate, posts } from "../../posts";
import {
  BLOG_TOPICS,
  getBlogTopic,
  getPrimaryTopic,
  getTopicPosts,
  type BlogTopicSlug,
} from "../../taxonomy";

type Params = Promise<{ topic: string }>;

function isBlogTopicSlug(value: string): value is BlogTopicSlug {
  return BLOG_TOPICS.some((topic) => topic.slug === value);
}

export function generateStaticParams() {
  return BLOG_TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { topic: topicParam } = await params;
  if (!isBlogTopicSlug(topicParam)) return {};

  const topic = getBlogTopic(topicParam);
  return {
    title: `${topic.label} Articles`,
    description: topic.description,
    alternates: {
      canonical: topic.href,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${topic.href}`,
      siteName: SITE_TITLE,
      title: `${topic.label} Articles · Sundee Fundee`,
      description: topic.description,
      images: [SITE_OG_IMAGE_PATH],
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.label} Articles · Sundee Fundee`,
      description: topic.description,
      images: [SITE_OG_IMAGE_PATH],
    },
  };
}

export default async function BlogTopicPage({ params }: { params: Params }) {
  const { topic: topicParam } = await params;
  if (!isBlogTopicSlug(topicParam)) notFound();

  const topic = getBlogTopic(topicParam);
  const topicPosts = getTopicPosts(posts, topic.slug);
  const url = `${SITE_URL}${topic.href}`;

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: topic.label, url },
          ]),
          buildItemListJsonLd(
            `${topic.label} Articles`,
            topicPosts.map((post) => ({
              name: post.title,
              description: post.description,
              url: `${SITE_URL}/blog/${post.slug}`,
            })),
          ),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-16 pb-10">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="text-sm text-muted underline-offset-4 hover:underline"
            >
              ← All articles
            </Link>
            <p className="mt-10 text-sm font-medium uppercase tracking-[0.3em] text-orange">
              {topic.eyebrow}
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              {topic.label}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              {topic.description}
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-4xl gap-4">
            {topicPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-border bg-surface p-6 transition hover:border-navy"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readMinutes} min read</span>
                  <span className="rounded-full bg-navy/5 px-3 py-1 text-[0.65rem] tracking-[0.15em] text-navy">
                    {getPrimaryTopic(post).label}
                  </span>
                </div>
                <h2 className="font-display mt-4 text-3xl font-semibold text-navy">
                  {post.title}
                </h2>
                <p className="mt-3 text-muted">{post.description}</p>
                <p className="mt-6 text-sm font-medium text-orange">
                  Read article →
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Add topics to sitemap**

In `src/app/sitemap.ts`, import `BLOG_TOPICS`:

```ts
import { BLOG_TOPICS } from "./blog/taxonomy";
```

Add:

```ts
const topicEntries: MetadataRoute.Sitemap = BLOG_TOPICS.map((topic) => ({
  url: `${SITE_URL}${topic.href}`,
  lastModified,
  changeFrequency: "weekly",
  priority: 0.65,
}));
```

Include `...topicEntries` in the returned sitemap array near the blog entry.

- [ ] **Step 3: Verify topic routes**

Run:

```bash
npm run typecheck
npm run build
```

Expected: build emits static topic routes for each `BLOG_TOPICS` slug.

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/topic/[topic]/page.tsx src/app/sitemap.ts
git commit -m "feat: add blog topic pages"
```

---

### Task 4: Improve Article Pages With Contextual CTAs And Related Posts

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Update imports**

Add:

```ts
import {
  getPostCta,
  getPrimaryTopic,
  getRelatedPosts,
} from "../taxonomy";
import { postModifiedAt } from "../posts";
```

Then merge the `postModifiedAt` import with the existing `posts, getPost, formatDate` import so there is one import from `../posts`.

- [ ] **Step 2: Use modified dates and topic data**

Replace:

```ts
modifiedTime: post.publishedAt,
```

with:

```ts
modifiedTime: postModifiedAt(post),
```

Inside `BlogPostPage`, replace:

```ts
const relatedPosts = posts.filter((item) => item.slug !== slug).slice(0, 3);
```

with:

```ts
const topic = getPrimaryTopic(post);
const cta = getPostCta(post);
const relatedPosts = getRelatedPosts(post, posts, 3);
```

In JSON-LD, replace:

```ts
dateModified: post.publishedAt,
```

with:

```ts
dateModified: postModifiedAt(post),
articleSection: topic.label,
```

- [ ] **Step 3: Show topic and updated date in the article header**

In the article header metadata row, after the read time span, add:

```tsx
<span aria-hidden="true">·</span>
<Link
  href={topic.href}
  className="rounded-full bg-navy/5 px-3 py-1 text-[0.65rem] tracking-[0.15em] text-navy transition hover:bg-navy/10"
>
  {topic.label}
</Link>
```

After the author line, add:

```tsx
{post.updatedAt ? (
  <p className="mt-2 text-sm text-muted">
    Updated {formatDate(post.updatedAt)}
  </p>
) : null}
```

- [ ] **Step 4: Replace generic CTA copy**

Replace the “Turn this article into a session” CTA block copy with:

```tsx
<div className="mt-12 rounded-2xl border border-border bg-surface p-6">
  <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
    {cta.ctaEyebrow}
  </p>
  <h2 className="font-display mt-4 text-3xl font-bold text-navy">
    {cta.ctaTitle}
  </h2>
  <p className="mt-4 text-muted">{cta.ctaBody}</p>
  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
    <Link
      href={cta.productHref}
      className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 font-medium text-navy transition hover:border-navy"
    >
      Learn more
    </Link>
    <AppStoreButtons compact />
  </div>
</div>
```

- [ ] **Step 5: Add topic link near tags**

Before the tag list, add:

```tsx
<Link
  href={topic.href}
  className="rounded-full bg-orange/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-orange"
>
  {topic.label}
</Link>
```

- [ ] **Step 6: Verify**

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/blog/[slug]/page.tsx
git commit -m "feat: add contextual blog article CTAs"
```

---

### Task 5: Add RSS Feed

**Files:**
- Create: `src/app/rss.xml/route.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create RSS route**

Create `src/app/rss.xml/route.ts`:

```ts
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
```

- [ ] **Step 2: Add RSS discovery link**

In `src/app/layout.tsx`, find exported `metadata`. Add this inside the metadata object:

```ts
alternates: {
  types: {
    "application/rss+xml": `${SITE_URL}/rss.xml`,
  },
},
```

If `layout.tsx` already has `alternates`, merge the `types` field instead of replacing existing metadata.

- [ ] **Step 3: Verify RSS route**

Run:

```bash
npm run typecheck
npm run build
npm run dev
```

Open:

```text
http://localhost:3000/rss.xml
```

Expected: XML renders, includes all blog post titles, and has `Content-Type: application/rss+xml`.

- [ ] **Step 4: Commit**

```bash
git add src/app/rss.xml/route.ts src/app/layout.tsx
git commit -m "feat: add blog rss feed"
```

---

### Task 6: Add Per-Article Open Graph Images

**Files:**
- Create: `src/app/blog/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Create dynamic OG image route**

Create `src/app/blog/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPost } from "../posts";
import { getPrimaryTopic } from "../taxonomy";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type Params = Promise<{ slug: string }>;

export default async function Image({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const topic = getPrimaryTopic(post);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff8ed",
          color: "#12233a",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#f27319",
          }}
        >
          <span>Sundee Fundee</span>
          <span>{topic.label}</span>
        </div>
        <div>
          <div
            style={{
              fontSize: 74,
              lineHeight: 1.02,
              fontWeight: 800,
              maxWidth: 980,
            }}
          >
            {post.title}
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 30,
              lineHeight: 1.35,
              color: "#536174",
              maxWidth: 920,
            }}
          >
            {post.description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            fontSize: 28,
            color: "#12233a",
          }}
        >
          <span>{post.readMinutes} min read</span>
          <span>•</span>
          <span>Recovery-aware strength training</span>
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 2: Remove static image override from article metadata**

In `src/app/blog/[slug]/page.tsx`, remove:

```ts
images: [SITE_OG_IMAGE_PATH],
```

from the `openGraph` and `twitter` metadata blocks for article pages only. Next will use the route-specific generated OG image.

- [ ] **Step 3: Verify generated image**

Run:

```bash
npm run typecheck
npm run build
npm run dev
```

Open:

```text
http://localhost:3000/blog/why-recovery-beats-the-calendar/opengraph-image
```

Expected: a 1200x630 PNG with Sundee Fundee, topic label, title, description, and read time.

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/[slug]/opengraph-image.tsx src/app/blog/[slug]/page.tsx
git commit -m "feat: generate blog article og images"
```

---

### Task 7: Add Best-For Microcopy And Updated Dates To Content

**Files:**
- Modify: `src/app/blog/content/*.json`

- [ ] **Step 1: Add optional fields to each JSON file**

For every file in `src/app/blog/content/*.json`, add:

```json
"updatedAt": "2026-04-25",
"bestFor": "A short sentence describing who should read this article.",
"primaryTopic": "one-of-the-topic-slugs"
```

Use these topic slugs:

```text
recovery-readiness
training-around-pain
women-who-lift
wearables-health-data
programming-basics
```

Suggested mappings:

```text
apple-health-data-for-strength-training.json -> wearables-health-data
garmin-recovery-data-for-lifters.json -> wearables-health-data
when-hrv-is-low-strength-training.json -> recovery-readiness
sleep-quality-strength-training-gains.json -> recovery-readiness
why-recovery-beats-the-calendar.json -> recovery-readiness
training-around-injuries-without-losing-progress.json -> training-around-pain
warm-up-protocol-for-strength-training.json -> training-around-pain
cycle-phase-strength-programming.json -> women-who-lift
menstrual-cycle-injury-risk-lifting.json -> women-who-lift
menstrual-cycle-nutrition-strength-training.json -> women-who-lift
one-rep-max-testing-timing-and-protocol.json -> programming-basics
rpe-training-autoregulation-strength.json -> programming-basics
deload-week-programming-strength-training.json -> programming-basics
breathing-bracing-lifting-technique.json -> programming-basics
```

- [ ] **Step 2: Validate JSON and build**

Run:

```bash
npm run typecheck
npm run build
```

Expected: build succeeds. If a JSON syntax error appears, fix the comma or quote at the reported file and line.

- [ ] **Step 3: Commit**

```bash
git add src/app/blog/content
git commit -m "content: add blog topic metadata"
```

---

### Task 8: Final Verification And Browser Review

**Files:**
- No planned edits unless verification exposes bugs.

- [ ] **Step 1: Run full local checks**

Run:

```bash
npm run lint
npm run typecheck
npm run test:seo
npm run build
```

Expected: all pass.

- [ ] **Step 2: Start local app**

Run:

```bash
npm run dev
```

Expected: local server starts on `http://localhost:3000`.

- [ ] **Step 3: Manually verify pages**

Open and inspect:

```text
http://localhost:3000/blog
http://localhost:3000/blog/topic/recovery-readiness
http://localhost:3000/blog/topic/training-around-pain
http://localhost:3000/blog/topic/women-who-lift
http://localhost:3000/blog/topic/wearables-health-data
http://localhost:3000/blog/topic/programming-basics
http://localhost:3000/blog/why-recovery-beats-the-calendar
http://localhost:3000/rss.xml
http://localhost:3000/blog/why-recovery-beats-the-calendar/opengraph-image
```

Expected:

- `/blog` has a clear featured article, topic navigation, topic sections, and final app CTA.
- Topic pages render only relevant posts.
- Article pages show topic badge, updated date when present, contextual CTA, and related posts from the same topic first.
- RSS XML includes all posts.
- Generated OG image is nonblank and readable.
- Mobile width does not overlap cards, badges, CTA buttons, or headings.

- [ ] **Step 4: Final commit if verification fixes were needed**

```bash
git add .
git commit -m "fix: polish blog upgrade verification issues"
```

Only run this commit if Step 3 required additional code or content fixes.

---

## Self-Review

**Spec coverage:** The plan covers topic discovery, featured article, contextual CTAs, improved cards, `ItemList` schema, topic landing pages, per-article OG images, updated dates, RSS, and stronger internal links.

**Placeholder scan:** No task uses unresolved placeholders. The only editorial placeholder is the `bestFor` content sentence in Task 7, and the task provides exact allowed fields, topic slugs, and mappings because the final sentence should be written per article.

**Type consistency:** `BlogTopicSlug`, `BlogTopic`, `getPrimaryTopic`, `getTopicPosts`, `getRelatedPosts`, `postModifiedAt`, and `toRfc822Date` are defined before use. Topic slugs are consistent across taxonomy, topic routes, and JSON content.
