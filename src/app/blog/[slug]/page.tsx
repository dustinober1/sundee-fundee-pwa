import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { BlogInteractiveModule } from "@/components/blog/BlogInteractiveModule";
import { JsonLd } from "@/components/JsonLd";
import { Markdown } from "@/components/Markdown";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { absoluteUrl, buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_TITLE, SITE_URL } from "@/lib/site";
import {
  formatDate,
  getPost,
  posts,
  postModifiedAt,
  type BlogInteractivePlacement,
  type BlogPost,
} from "../posts";
import { getPrimaryTopic, getRelatedPosts } from "../taxonomy";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = absoluteUrl(`/blog/${post.slug}/opengraph-image`);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_TITLE,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

function getModulesForPlacement(
  post: BlogPost,
  placement: BlogInteractivePlacement,
) {
  return (
    post.interactiveModules?.filter((m) => m.placement === placement) ?? []
  );
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const topic = getPrimaryTopic(post);
  const relatedPosts = getRelatedPosts(post, posts);
  const bodyModules = getModulesForPlacement(post, "before-body");
  const preCtaModules = getModulesForPlacement(post, "before-cta");
  const wordCount = post.body.split(/\s+/).filter(Boolean).length;

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
            image: {
              "@type": "ImageObject",
              url: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
              width: 1200,
              height: 630,
            },
            datePublished: post.publishedAt,
            dateModified: post.updatedAt ?? post.publishedAt,
            author: {
              "@type": "Person",
              name: post.author,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": url,
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
            articleSection: topic.label,
            inLanguage: "en-US",
            keywords: post.tags.join(", "),
            wordCount,
          },
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <article className="px-6 pt-16 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
              <div>
                <header>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-muted">
                    <Link
                      href={topic.href}
                      className="text-orange hover:underline"
                    >
                      {topic.eyebrow}
                    </Link>
                    <span aria-hidden="true">·</span>
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{post.readMinutes} min read</span>
                  </div>
                  <h1 className="font-display mt-6 text-4xl font-bold leading-[1.1] text-navy sm:text-5xl lg:text-6xl">
                    {post.title}
                  </h1>
                  <p className="mt-6 text-xl leading-8 text-muted">
                    {post.description}
                  </p>
                </header>

                {bodyModules.map((module, i) => (
                  <div key={i} className="mt-10">
                    <BlogInteractiveModule module={module} />
                  </div>
                ))}

                <div className="mt-12">
                  <Markdown content={post.body} />
                </div>

                {preCtaModules.map((module, i) => (
                  <div key={i} className="mt-12">
                    <BlogInteractiveModule module={module} />
                  </div>
                ))}

                <div className="mt-16 rounded-[2rem] border border-border bg-surface p-8 text-center sm:p-12">
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                    {topic.ctaEyebrow}
                  </p>
                  <h2 className="font-display mt-4 text-3xl font-bold text-navy sm:text-4xl">
                    {topic.ctaTitle}
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-muted">
                    {topic.ctaBody}
                  </p>
                  <div className="mt-8 flex flex-col justify-center items-center gap-6">
                    <AppStoreButtons
                      utmCampaign="blog_post"
                      utmContent={`${post.slug}_bottom`}
                      compact={false}
                    />
                    <Link
                      href={topic.productHref}
                      className="text-sm font-medium text-orange underline-offset-4 hover:underline"
                    >
                      Learn more about {topic.label.toLowerCase()} →
                    </Link>
                  </div>
                </div>
              </div>

              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-12">
                  <section>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      About the author
                    </h2>
                    <p className="mt-4 text-sm font-medium text-navy">
                      {post.author}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Sundee Fundee contributor specializing in recovery-aware
                      strength training and injury adaptation.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      Related articles
                    </h2>
                    <div className="mt-6 grid gap-8">
                      {relatedPosts.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/blog/${related.slug}`}
                          className="group block"
                        >
                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
                            <time dateTime={related.publishedAt}>
                              {formatDate(related.publishedAt)}
                            </time>
                          </div>
                          <h3 className="font-display mt-2 text-lg font-semibold text-navy transition group-hover:text-orange">
                            {related.title}
                          </h3>
                        </Link>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-border bg-surface p-6">
                    <h2 className="font-display text-xl font-bold text-navy">
                      Train with this context.
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      Sundee Fundee turns recovery, cycle, and pain flags into a
                      smarter workout on iPhone.
                    </p>
                    <div className="mt-6">
                      <AppStoreButtons
                        utmCampaign="blog_post"
                        utmContent={`${post.slug}_sidebar`}
                        compact
                      />
                    </div>
                  </section>
                </div>
              </aside>
            </div>
          </div>
        </article>

        <div className="border-t border-border bg-cream/50 px-6 py-16 lg:hidden">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Related articles
              </h2>
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
                    {related.bestFor ?? related.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <section className="bg-surface px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              Train with the same thinking.
            </h2>
            <p className="mt-4 text-muted">
              Get recovery-aware training plans on iOS.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <AppStoreButtons utmCampaign="blog_post" utmContent={post.slug} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
