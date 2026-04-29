"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ARTICLE_INTENT_LABELS,
  BLOG_PATHWAYS,
  INTERACTIVE_TYPE_LABELS,
  filterBlogPosts,
  getPathwayPosts,
  type BlogDiscoveryItem,
  type BlogSortOption,
} from "@/app/blog/discovery";
import { formatDate } from "@/app/blog/date";

type BlogLibraryProps = {
  posts: BlogDiscoveryItem[];
  topicOptions: Array<{ label: string; slug: string }>;
};

const sortOptions: Array<{ label: string; value: BlogSortOption }> = [
  { label: "Recommended", value: "recommended" },
  { label: "Newest", value: "newest" },
  { label: "Recently updated", value: "updated" },
  { label: "Shortest read", value: "shortest-read" },
];

const articleIntentOptions = Object.entries(ARTICLE_INTENT_LABELS).map(([value, label]) => ({
  label,
  value,
}));

export function BlogLibrary({ posts, topicOptions }: BlogLibraryProps) {
  const [search, setSearch] = useState("");
  const [topicSlug, setTopicSlug] = useState("all");
  const [articleIntent, setArticleIntent] = useState("all");
  const [sort, setSort] = useState<BlogSortOption>("recommended");

  const results = filterBlogPosts(posts, {
    articleIntent,
    search,
    sort,
    topicSlug,
  });

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Featured pathways
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold text-navy sm:text-4xl">
              Start from the decision you need to make.
            </h2>
            <p className="mt-4 text-muted">
              Pick a pathway to narrow the library instantly, or use the search and filters below
              to browse the full catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setTopicSlug("all");
              setArticleIntent("all");
              setSort("recommended");
            }}
            className="text-sm font-medium text-orange underline-offset-4 hover:underline"
          >
            Reset all filters
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {BLOG_PATHWAYS.map((pathway) => {
            const count = getPathwayPosts(posts, pathway).length;

            return (
              <button
                key={pathway.slug}
                type="button"
                onClick={() => {
                  setSearch("");
                  setTopicSlug(pathway.topicSlug ?? "all");
                  setArticleIntent(pathway.articleIntents?.[0] ?? "all");
                  setSort("recommended");
                }}
                className="rounded-2xl border border-border bg-cream p-5 text-left transition hover:border-navy/35"
              >
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange">
                  {count} articles
                </p>
                <h3 className="font-display mt-3 text-2xl font-semibold text-navy">
                  {pathway.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {pathway.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-surface p-6 sm:p-8">
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Search articles
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search titles, outcomes, or article angles"
              className="mt-3 w-full rounded-2xl border border-border bg-cream px-4 py-3 text-navy outline-none transition placeholder:text-muted focus:border-navy/45"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
              Sort
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as BlogSortOption)}
              className="mt-3 w-full rounded-2xl border border-border bg-cream px-4 py-3 text-navy outline-none transition focus:border-navy/45"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
            Topic
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTopicSlug("all")}
              className={`rounded-full px-4 py-2 text-sm transition ${
                topicSlug === "all"
                  ? "bg-navy text-cream"
                  : "border border-border bg-cream text-navy hover:border-navy/35"
              }`}
            >
              All topics
            </button>
            {topicOptions.map((topic) => (
              <button
                key={topic.slug}
                type="button"
                onClick={() => setTopicSlug(topic.slug)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  topicSlug === topic.slug
                    ? "bg-navy text-cream"
                    : "border border-border bg-cream text-navy hover:border-navy/35"
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted">
            Article shape
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setArticleIntent("all")}
              className={`rounded-full px-4 py-2 text-sm transition ${
                articleIntent === "all"
                  ? "bg-orange text-navy"
                  : "border border-border bg-cream text-navy hover:border-navy/35"
              }`}
            >
              All formats
            </button>
            {articleIntentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setArticleIntent(option.value)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  articleIntent === option.value
                    ? "bg-orange text-navy"
                    : "border border-border bg-cream text-navy hover:border-navy/35"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Library results
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold text-navy">
              {results.length} articles matched
            </h2>
          </div>
          <p className="max-w-xl text-sm text-muted">
            Each card shows the editorial topic, the interactive format, and the most useful
            audience signal before you open the article.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-border bg-surface p-5 transition hover:border-navy"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readMinutes} min</span>
              </div>

              {post.updatedAt && post.updatedAt !== post.publishedAt ? (
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-orange">
                  Updated {formatDate(post.updatedAt)}
                </p>
              ) : null}

              <h3 className="font-display mt-4 text-2xl font-semibold leading-tight text-navy">
                {post.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {post.bestFor ?? post.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-navy/5 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-navy">
                  {post.topicLabel}
                </span>
                <span className="rounded-full bg-orange/15 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-navy">
                  {INTERACTIVE_TYPE_LABELS[post.interactiveType]}
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-orange">Read article →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
