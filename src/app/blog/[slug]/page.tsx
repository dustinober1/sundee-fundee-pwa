import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
  return {
    title: post.title,
    description: post.description,
  };
}

function renderBody(body: string) {
  const blocks = body.split(/\n\s*\n/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-display mt-12 text-2xl font-semibold text-navy"
        >
          {trimmed.slice(3)}
        </h2>
      );
    }
    return (
      <p key={i} className="mt-6 leading-relaxed text-navy/85">
        {trimmed.replace(/\n/g, " ")}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl font-semibold text-navy">
            Sundee Fundee
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-sm font-medium text-navy hover:opacity-70"
            >
              Blog
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-navy hover:opacity-70"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

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
              {renderBody(post.body)}
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
          </div>
        </article>

        <section className="bg-surface px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">
              Train with the same thinking.
            </h2>
            <p className="mt-4 text-muted">
              Sundee Fundee puts recovery, injury, and cycle awareness into every
              session — without the guesswork.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex h-12 items-center rounded-lg bg-orange px-8 font-medium text-cream hover:opacity-90"
            >
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
          <p className="font-display text-base font-semibold text-navy">
            Sundee Fundee
          </p>
          <p>© 2026 Sundee Fundee. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
