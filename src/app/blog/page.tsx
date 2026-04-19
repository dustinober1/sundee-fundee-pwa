import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { posts, formatDate } from "./posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on recovery-aware training, injury adaptation, and getting stronger without breaking down.",
};

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <>
      <SiteHeader showHomeLink />

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
          <div className="mx-auto max-w-4xl">
            <ul className="flex flex-col gap-4">
              {sorted.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-2xl border border-border bg-surface p-8 transition hover:border-navy"
                  >
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readMinutes} min read</span>
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-navy/5 px-3 py-1 text-[0.65rem] tracking-[0.15em] text-navy"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-display mt-4 text-3xl font-semibold text-navy">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-muted">{post.description}</p>
                    <p className="mt-6 text-sm font-medium text-orange">
                      Read article →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
