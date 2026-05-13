import Link from "next/link";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { BlogLibrary } from "@/components/blog/BlogLibrary";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";
import { posts, formatDate } from "./posts";
import {
  BLOG_TOPICS,
  getFeaturedPost,
  getPrimaryTopic,
} from "./taxonomy";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on recovery-aware training, injury adaptation, and getting stronger without breaking down.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    siteName: SITE_TITLE,
    title: "Blog",
    description:
      "Notes on recovery-aware training, injury adaptation, and getting stronger without breaking down.",
    images: [SITE_OG_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description:
      "Notes on recovery-aware training, injury adaptation, and getting stronger without breaking down.",
    images: [SITE_OG_IMAGE_PATH],
  },
};

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const featured = getFeaturedPost(sorted);
  const discoveryPosts = sorted.map((post) => {
    const topic = getPrimaryTopic(post);

    return {
      slug: post.slug,
      title: post.title,
      description: post.description,
      bestFor: post.bestFor,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      readMinutes: post.readMinutes,
      topicLabel: topic.label,
      topicSlug: topic.slug,
      articleIntent: post.articleIntent,
      interactiveType: post.interactiveModules?.[0]?.type ?? "decision-guide",
    };
  });

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Blog",
            url: `${SITE_URL}/blog`,
            description:
              "Notes on recovery-aware training, injury adaptation, and getting stronger without breaking down.",
          },
          buildItemListJsonLd(
            "Sundee Fundee Blog Articles",
            sorted.map((post) => ({
              name: post.title,
              description: post.description,
              url: `${SITE_URL}/blog/${post.slug}`,
            })),
          ),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-12">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Blog
            </p>
            <h1 className="font-display mt-6 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              Field notes on training smart.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Recovery, injuries, cycle phase, programming — how we think about
              each, and how to use them to train harder without breaking down.
            </p>
          </div>
        </section>

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

            <div className="mt-14">
              <BlogLibrary
                posts={discoveryPosts}
                topicOptions={BLOG_TOPICS.map((topic) => ({
                  label: topic.label,
                  slug: topic.slug,
                }))}
              />
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
                <AppStoreButtons utmCampaign="blog_index" compact />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
