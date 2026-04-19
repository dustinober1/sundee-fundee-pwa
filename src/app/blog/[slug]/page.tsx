import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { JsonLd } from "@/components/JsonLd";
import { Markdown } from "@/components/Markdown";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
} from "@/lib/seo";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";
import { posts, getPost, formatDate } from "../posts";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_TITLE,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [SITE_OG_IMAGE_PATH],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [SITE_OG_IMAGE_PATH],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${slug}`;
  const relatedPosts = posts.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: post.title, url },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            author: {
              "@type": "Person",
              name: post.author,
            },
            publisher: {
              "@type": "Organization",
              name: SITE_TITLE,
              url: SITE_URL,
              logo: {
                "@type": "ImageObject",
                url: absoluteUrl("/Logo.jpeg"),
              },
            },
            mainEntityOfPage: url,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            image: absoluteUrl(SITE_OG_IMAGE_PATH),
            keywords: post.tags.join(", "),
          },
        ]}
      />
      <SiteHeader showHomeLink />

      <main className="flex flex-1 flex-col">
        <article className="px-6 pt-16 pb-20">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/blog"
              className="text-sm text-muted underline-offset-4 hover:underline"
            >
              ← All articles
            </Link>

            <div className="mt-10">
              <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{post.readMinutes} min read</span>
              </div>
              <h1 className="font-display mt-5 text-4xl font-bold leading-[1.1] text-navy sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 text-lg text-muted">{post.description}</p>
              <p className="mt-6 text-sm text-muted">By {post.author}</p>
            </div>

            <div className="mt-10 border-t border-border pt-4">
              <Markdown content={post.body} />
            </div>

            <div className="mt-12 rounded-[2rem] border border-border bg-surface p-6">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Turn this article into a session
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold text-navy">
                Use the app when the plan needs to adapt.
              </h2>
              <p className="mt-4 text-muted">
                If this topic maps to your own training week, open the app and
                let recovery, pain, and readiness shape the session instead of
                forcing a fixed calendar.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <AppStoreButtons compact />
              </div>
            </div>

            <div className="mt-16 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-navy/5 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-navy"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-16 border-t border-border pt-12">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                    More articles
                  </p>
                  <h2 className="font-display mt-4 text-3xl font-bold text-navy">
                    Keep reading
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-sm font-medium text-orange underline-offset-4 hover:underline"
                >
                  Back to blog
                </Link>
              </div>

              <div className="mt-8 grid gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="rounded-2xl border border-border bg-surface p-5 transition hover:border-navy"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                      <time dateTime={related.publishedAt}>
                        {formatDate(related.publishedAt)}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{related.readMinutes} min read</span>
                    </div>
                    <h3 className="font-display mt-3 text-2xl font-semibold text-navy">
                      {related.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      {related.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>

        <section className="bg-surface px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              Train with the same thinking.
            </h2>
            <p className="mt-4 text-muted">
              Get recovery-aware training plans and rucking programs on iOS.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <AppStoreButtons />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
