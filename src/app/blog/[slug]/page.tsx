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
import { getPostCta, getPrimaryTopic, getRelatedPosts } from "../taxonomy";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

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
  const imageUrl = `${url}/opengraph-image`;
  const socialImage = {
    url: imageUrl,
    width: 1200,
    height: 630,
    alt: post.title,
  };
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
      images: [socialImage],
      publishedTime: post.publishedAt,
      modifiedTime: postModifiedAt(post),
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [socialImage],
    },
  };
}

function getModulesForPlacement(
  post: BlogPost,
  placement: BlogInteractivePlacement,
) {
  return post.interactiveModules?.filter((module) => module.placement === placement) ?? [];
}

function productCtaLabel(href: string) {
  switch (href) {
    case "/recovery-aware-strength-training":
      return "Explore recovery-aware strength training";
    case "/train-around-injury":
      return "Explore injury-aware training";
    case "/for-women-who-lift":
      return "Explore training for women who lift";
    case "/apple-health-strength-training-app":
      return "Explore Apple Health strength training";
    default:
      return "Explore Sundee Fundee";
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${slug}`;
  const imageUrl = `${url}/opengraph-image`;
  const topic = getPrimaryTopic(post);
  const cta = getPostCta(post);
  const relatedPosts = getRelatedPosts(post, posts, 3);
  const introModules = getModulesForPlacement(post, "after-intro");
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
            author: {
              "@type": "Person",
              name: post.author,
            },
            articleSection: topic.label,
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
            dateModified: postModifiedAt(post),
            image: {
              "@type": "ImageObject",
              url: imageUrl,
              width: 1200,
              height: 630,
            },
            inLanguage: "en-US",
            keywords: post.tags.join(", "),
            wordCount,
          },
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

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
                <span aria-hidden="true">·</span>
                <Link
                  href={topic.href}
                  className="rounded-full bg-navy/5 px-3 py-1 text-[0.65rem] tracking-[0.15em] text-navy transition hover:bg-navy/10"
                >
                  {topic.label}
                </Link>
              </div>
              <h1 className="font-display mt-5 text-4xl font-bold leading-[1.1] text-navy sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 text-lg text-muted">{post.description}</p>
              <p className="mt-6 text-sm text-muted">By {post.author}</p>
              {post.updatedAt ? (
                <p className="mt-2 text-sm text-muted">
                  Updated {formatDate(post.updatedAt)}
                </p>
              ) : null}
            </div>

            {introModules.length ? (
              <div className="mt-10">
                {introModules.map((module) => (
                  <BlogInteractiveModule
                    key={`${post.slug}-${module.type}-${module.placement}`}
                    module={module}
                  />
                ))}
              </div>
            ) : null}

            <div className="mt-10 border-t border-border pt-4">
              {bodyModules.length ? (
                <div className="mb-10">
                  {bodyModules.map((module) => (
                    <BlogInteractiveModule
                      key={`${post.slug}-${module.type}-${module.placement}`}
                      module={module}
                    />
                  ))}
                </div>
              ) : null}
              <Markdown content={post.body} />
            </div>

            {preCtaModules.length ? (
              <div className="mt-12">
                {preCtaModules.map((module) => (
                  <BlogInteractiveModule
                    key={`${post.slug}-${module.type}-${module.placement}`}
                    module={module}
                  />
                ))}
              </div>
            ) : null}

            <div className="mt-12 rounded-[2rem] border border-border bg-surface p-6">
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
                  {productCtaLabel(cta.productHref)}
                </Link>
                <AppStoreButtons
                  utmCampaign="blog_post"
                  utmContent={post.slug}
                  compact
                />
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
                      {related.bestFor ?? related.description}
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
