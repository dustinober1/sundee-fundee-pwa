import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { INTERACTIVE_TYPE_LABELS } from "@/app/blog/discovery";
import { getTopicHubDecisionLinks } from "@/lib/internal-linking";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";
import { getTopicHub } from "@/lib/topic-hubs";
import { formatDate, posts } from "../../posts";
import {
  BLOG_TOPICS,
  getBlogTopic,
  getPrimaryTopic,
  getTopicPosts,
  type BlogTopicSlug,
} from "../../taxonomy";

type Params = Promise<{ topic: string }>;

export const dynamicParams = false;

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
  const hub = getTopicHub(topic.slug);
  return {
    title: hub.metaTitle,
    description: hub.metaDescription,
    alternates: {
      canonical: topic.href,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${topic.href}`,
      siteName: SITE_TITLE,
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: [SITE_OG_IMAGE_PATH],
    },
    twitter: {
      card: "summary_large_image",
      title: hub.metaTitle,
      description: hub.metaDescription,
      images: [SITE_OG_IMAGE_PATH],
    },
  };
}

export default async function BlogTopicPage({ params }: { params: Params }) {
  const { topic: topicParam } = await params;
  if (!isBlogTopicSlug(topicParam)) notFound();

  const topic = getBlogTopic(topicParam);
  const hub = getTopicHub(topic.slug);
  const topicPosts = getTopicPosts(posts, topic.slug);
  const url = `${SITE_URL}${topic.href}`;
  const decisionLinks = getTopicHubDecisionLinks(topic.slug);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: topic.label, url },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: hub.title,
            url,
            description: hub.metaDescription,
          },
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
            <p className="mt-8 max-w-3xl text-base leading-8 text-muted">
              {hub.intro}
            </p>
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Start here
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {hub.startHereLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-border bg-white p-5 transition hover:border-navy"
                  >
                    <h2 className="font-display text-xl font-semibold text-navy">
                      {link.label}
                    </h2>
                    <p className="mt-3 text-sm text-muted">{link.description}</p>
                    <p className="mt-4 text-sm font-medium text-orange">
                      Read article →
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="mx-auto grid max-w-4xl gap-6">
            {hub.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
              >
                <h2 className="font-display text-3xl font-semibold text-navy">
                  {section.title}
                </h2>
                <div className="mt-4 grid gap-4 text-base leading-8 text-muted">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-navy">
                Related SEO pages
              </h2>
              <div className="mt-5 grid gap-4">
                {hub.relatedSeoPages.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-border bg-white p-5 transition hover:border-navy"
                  >
                    <h3 className="text-lg font-semibold text-navy">{link.label}</h3>
                    <p className="mt-2 text-sm text-muted">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-navy">
                Related tools
              </h2>
              <div className="mt-5 grid gap-4">
                {hub.relatedTools.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-border bg-white p-5 transition hover:border-navy"
                  >
                    <h3 className="text-lg font-semibold text-navy">{link.label}</h3>
                    <p className="mt-2 text-sm text-muted">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {[decisionLinks.productPage, decisionLinks.seoPage].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-border bg-surface p-6 transition hover:border-navy"
              >
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
                  Decision support
                </p>
                <h2 className="font-display mt-4 text-2xl font-semibold text-navy">
                  {link.label}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {link.description}
                </p>
              </Link>
            ))}
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
                {post.updatedAt && post.updatedAt !== post.publishedAt ? (
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-orange">
                    Updated {formatDate(post.updatedAt)}
                  </p>
                ) : null}
                <h2 className="font-display mt-4 text-3xl font-semibold text-navy">
                  {post.title}
                </h2>
                <p className="mt-3 text-muted">{post.bestFor ?? post.description}</p>
                {post.interactiveModules?.[0] ? (
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-muted">
                    {INTERACTIVE_TYPE_LABELS[post.interactiveModules[0].type]}
                  </p>
                ) : null}
                <p className="mt-6 text-sm font-medium text-orange">
                  Read article →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-surface px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              {hub.productCta.eyebrow}
            </p>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              {hub.productCta.title}
            </h2>
            <p className="mt-4 text-muted">
              {hub.productCta.body}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={hub.productCta.href}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 font-medium text-navy transition hover:border-navy"
              >
                Explore {topic.label.toLowerCase()}
              </Link>
              <AppStoreButtons utmCampaign="blog_topic" utmContent={topic.slug} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
