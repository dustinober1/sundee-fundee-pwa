import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { BlogInteractiveModule } from "@/components/blog/BlogInteractiveModule";
import { JsonLd } from "@/components/JsonLd";
import { Markdown } from "@/components/Markdown";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getAuthor, getAuthorUrl } from "@/lib/authors";
import { getBlogPostInternalLinks } from "@/lib/internal-linking";
import {
  absoluteUrl,
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo";
import { SITE_TITLE, SITE_URL } from "@/lib/site";
import {
  formatDate,
  getPost,
  isHealthAdjacentPost,
  posts,
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
  const author = getAuthor(post.authorSlug);
  const reviewer = post.reviewedBy ? getAuthor(post.reviewedBy) : undefined;
  const internalLinks = getBlogPostInternalLinks(post, posts);
  const healthAdjacent = isHealthAdjacentPost(post);
  const bodyModules = getModulesForPlacement(post, "before-body");
  const preCtaModules = getModulesForPlacement(post, "before-cta");
  const wordCount = post.body.split(/\s+/).filter(Boolean).length;
  const primaryLinks = [
    internalLinks.topicHub,
    internalLinks.productPage,
    internalLinks.seoPage,
  ].filter(
    (link, index, allLinks) =>
      link.href !== `/blog/${post.slug}` &&
      allLinks.findIndex((candidate) => candidate.href === link.href) === index,
  );

  if (!author) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: post.title, url },
          ]),
          buildBlogPostingJsonLd({
            post: {
              slug: post.slug,
              title: post.title,
              description: post.description,
              publishedAt: post.publishedAt,
              updatedAt: post.updatedAt,
              tags: post.tags,
              sources: post.sources,
              wordCount,
              articleSection: topic.label,
            },
            url,
            author,
          }),
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
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
                    <Link
                      href={getAuthorUrl(author.slug)}
                      className="font-medium text-navy underline-offset-4 hover:underline"
                    >
                      By {author.name}
                    </Link>
                    {reviewer && post.reviewedAt ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>
                          Reviewed by{" "}
                          <Link
                            href={getAuthorUrl(reviewer.slug)}
                            className="font-medium text-navy underline-offset-4 hover:underline"
                          >
                            {reviewer.name}
                          </Link>
                        </span>
                      </>
                    ) : null}
                    <span aria-hidden="true">·</span>
                    <Link
                      href="/methodology"
                      className="font-medium text-orange underline-offset-4 hover:underline"
                    >
                      Editorial methodology
                    </Link>
                  </div>
                </header>

                {bodyModules.map((module, i) => (
                  <div key={i} className="mt-10">
                    <BlogInteractiveModule module={module} />
                  </div>
                ))}

                <div className="mt-12">
                  <Markdown content={post.body} />
                </div>

                <section className="mt-14 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-6">
                    <article className="rounded-2xl border border-border bg-surface p-6">
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
                        Article trust
                      </p>
                      <div className="mt-5 space-y-4 text-sm leading-7 text-muted">
                        <p>
                          Written by{" "}
                          <Link
                            href={getAuthorUrl(author.slug)}
                            className="font-medium text-navy underline-offset-4 hover:underline"
                          >
                            {author.name}
                          </Link>
                          . {author.shortBio}
                        </p>
                        {reviewer && post.reviewedAt ? (
                          <p>
                            Reviewed by{" "}
                            <Link
                              href={getAuthorUrl(reviewer.slug)}
                              className="font-medium text-navy underline-offset-4 hover:underline"
                            >
                              {reviewer.name}
                            </Link>{" "}
                            on {formatDate(post.reviewedAt)}. See the{" "}
                            <Link
                              href="/methodology"
                              className="font-medium text-orange underline-offset-4 hover:underline"
                            >
                              methodology
                            </Link>{" "}
                            for the scope and review standard.
                          </p>
                        ) : null}
                      </div>
                    </article>

                    {healthAdjacent ? (
                      <article className="rounded-2xl border border-orange/30 bg-orange/5 p-6">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
                          Medical boundary
                        </p>
                        <p className="mt-4 text-sm leading-7 text-muted">
                          This article is for training education. It does not
                          diagnose, treat, or replace care from a qualified
                          clinician. If symptoms are new, severe, escalating, or
                          affecting daily life, use the training guidance here
                          to ask better questions and bring a clinician into the
                          decision loop.
                        </p>
                      </article>
                    ) : null}
                  </div>

                  <article className="rounded-2xl border border-border bg-surface p-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
                      Sources
                    </p>
                    <ol className="mt-5 space-y-4">
                      {post.sources.map((source) => (
                        <li key={source.url} className="text-sm leading-7 text-muted">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium text-navy underline-offset-4 hover:underline"
                          >
                            {source.title}
                          </a>
                          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                            {source.publisher}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </article>
                </section>

                <section className="mt-14">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
                        Next useful links
                      </p>
                      <h2 className="font-display mt-3 text-3xl font-semibold text-navy">
                        Keep the same training question moving.
                      </h2>
                    </div>
                    <Link
                      href={internalLinks.topicHub.href}
                      className="text-sm font-medium text-orange underline-offset-4 hover:underline"
                    >
                      Browse {internalLinks.topicHub.label} →
                    </Link>
                  </div>
                  <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {primaryLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-2xl border border-border bg-surface p-6 transition hover:border-navy"
                      >
                        <h3 className="font-display text-2xl font-semibold text-navy">
                          {link.label}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted">
                          {link.description}
                        </p>
                      </Link>
                    ))}
                    {internalLinks.siblingArticles.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-2xl border border-border bg-white p-6 transition hover:border-navy"
                      >
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
                          Related article
                        </p>
                        <h3 className="font-display mt-3 text-2xl font-semibold text-navy">
                          {link.label}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted">
                          {link.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>

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
                    <Link
                      href={getAuthorUrl(author.slug)}
                      className="mt-4 inline-flex text-sm font-medium text-navy underline-offset-4 hover:underline"
                    >
                      {author.name}
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {author.shortBio}
                    </p>
                    {reviewer && post.reviewedAt ? (
                      <p className="mt-3 text-sm leading-6 text-muted">
                        Reviewed by{" "}
                        <Link
                          href={getAuthorUrl(reviewer.slug)}
                          className="font-medium text-navy underline-offset-4 hover:underline"
                        >
                          {reviewer.name}
                        </Link>{" "}
                        on {formatDate(post.reviewedAt)}.
                      </p>
                    ) : null}
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
