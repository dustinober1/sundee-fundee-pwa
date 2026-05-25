import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { formatDate, postModifiedAt, posts } from "@/app/blog/posts";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildProfilePageJsonLd,
} from "@/lib/seo";
import { authors, getAuthor, getAuthorUrl } from "@/lib/authors";
import { SITE_TITLE } from "@/lib/site";

type Params = Promise<{ author: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return authors.map((author) => ({ author: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { author: authorSlug } = await params;
  const author = getAuthor(authorSlug);

  if (!author) {
    return {};
  }

  return {
    title: `${author.name} | ${SITE_TITLE}`,
    description: author.description,
    alternates: {
      canonical: getAuthorUrl(author.slug),
    },
  };
}

export default async function AuthorPage({ params }: { params: Params }) {
  const { author: authorSlug } = await params;
  const author = getAuthor(authorSlug);

  if (!author) {
    notFound();
  }

  const writtenPosts = posts
    .filter((post) => post.authorSlug === author.slug)
    .sort((a, b) => postModifiedAt(b).localeCompare(postModifiedAt(a)));
  const reviewedPosts = posts
    .filter((post) => post.reviewedBy === author.slug)
    .sort((a, b) => postModifiedAt(b).localeCompare(postModifiedAt(a)));
  const relatedPosts = [...writtenPosts, ...reviewedPosts].filter(
    (post, index, allPosts) =>
      allPosts.findIndex((candidate) => candidate.slug === post.slug) === index,
  );
  const canonicalUrl = absoluteUrl(getAuthorUrl(author.slug));

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Methodology", url: absoluteUrl("/methodology") },
            { name: author.name, url: canonicalUrl },
          ]),
          buildProfilePageJsonLd({
            author,
            url: canonicalUrl,
            relatedArticles: relatedPosts.slice(0, 12).map((post) => ({
              name: post.title,
              url: absoluteUrl(`/blog/${post.slug}`),
            })),
          }),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-16 pb-12">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/methodology"
              className="text-sm text-muted underline-offset-4 hover:underline"
            >
              ← Back to methodology
            </Link>
            <p className="mt-10 text-sm font-medium uppercase tracking-[0.3em] text-orange">
              {author.role}
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              {author.name}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              {author.shortBio}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted">
              <span className="rounded-full bg-surface px-4 py-2">
                {writtenPosts.length} written articles
              </span>
              <span className="rounded-full bg-surface px-4 py-2">
                {reviewedPosts.length} reviewed articles
              </span>
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-12">
          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-2xl border border-border bg-white p-8">
              <h2 className="font-display text-3xl font-semibold text-navy">
                Bio
              </h2>
              <div className="mt-5 space-y-5 text-base leading-8 text-muted">
                {author.fullBio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-border bg-white p-6">
                <h2 className="font-display text-2xl font-semibold text-navy">
                  Expertise
                </h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
                  {author.expertise.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-border bg-white p-6">
                <h2 className="font-display text-2xl font-semibold text-navy">
                  How articles are reviewed
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Read the editorial methodology for how articles are selected,
                  reviewed, sourced, and updated.
                </p>
                <Link
                  href={author.methodologyHref}
                  className="mt-5 inline-flex text-sm font-medium text-orange underline-offset-4 hover:underline"
                >
                  View methodology →
                </Link>
              </section>
            </aside>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl space-y-12">
            {writtenPosts.length ? (
              <div>
                <h2 className="font-display text-3xl font-semibold text-navy">
                  Written by {author.name}
                </h2>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {writtenPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="rounded-2xl border border-border bg-surface p-6 transition hover:border-navy"
                    >
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                        <time dateTime={post.publishedAt}>
                          {formatDate(post.publishedAt)}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readMinutes} min read</span>
                      </div>
                      <h3 className="font-display mt-4 text-2xl font-semibold text-navy">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted">
                        {post.bestFor ?? post.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {reviewedPosts.length ? (
              <div>
                <h2 className="font-display text-3xl font-semibold text-navy">
                  Reviewed by {author.name}
                </h2>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {reviewedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="rounded-2xl border border-border bg-surface p-6 transition hover:border-navy"
                    >
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                        <time dateTime={post.reviewedAt ?? post.updatedAt ?? post.publishedAt}>
                          {formatDate(post.reviewedAt ?? post.updatedAt ?? post.publishedAt)}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>reviewed</span>
                      </div>
                      <h3 className="font-display mt-4 text-2xl font-semibold text-navy">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted">
                        {post.bestFor ?? post.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {!relatedPosts.length ? (
              <p className="text-sm text-muted">
                No published articles are connected to this profile yet.
              </p>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
