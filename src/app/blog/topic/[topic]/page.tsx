import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo";
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
                <p className="mt-3 text-muted">{post.bestFor ?? post.description}</p>
                <p className="mt-6 text-sm font-medium text-orange">
                  Read article →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-surface px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              Put the topic into your next session.
            </h2>
            <p className="mt-4 text-muted">
              Read the guide, then use the app when recovery, pain, or schedule
              changes make the original plan wrong.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={topic.productHref}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 font-medium text-navy transition hover:border-navy"
              >
                Learn more
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
