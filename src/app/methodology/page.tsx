import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { authors } from "@/lib/authors";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo";
import { SITE_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Methodology | ${SITE_TITLE}`,
  description:
    "How Sundee Fundee selects, reviews, sources, and updates training articles while keeping medical boundaries explicit.",
  alternates: {
    canonical: "/methodology",
  },
};

const sections = [
  {
    title: "Article selection",
    body: "The library prioritizes questions that show up before a workout starts: whether to push or cap the session, how to modify around pain, how to use cycle context without rigid rules, and how wearable signals change training only when they improve the decision.",
  },
  {
    title: "Review workflow",
    body: "Health-adjacent posts receive an editorial review pass before publication or update. That pass checks scope, source coverage, conservative wording, and whether the article stays inside exercise selection, loading, volume, scheduling, and logging rather than diagnosis or treatment.",
  },
  {
    title: "Medical boundaries",
    body: "The site is an education and training product. It does not diagnose or treat conditions, and it does not replace care from a qualified clinician. When a symptom pattern points beyond ordinary training adjustments, the article should say so directly.",
  },
  {
    title: "Source use",
    body: "Articles use official or primary references where possible, including guidance from organizations such as CDC, ACOG, NIH, Apple documentation for device-specific metrics, and primary sports-medicine literature for resistance training principles.",
  },
  {
    title: "Updates",
    body: "Updates happen when the app workflow changes, a post needs stronger cross-linking inside the training library, or health-adjacent guidance needs fresher review language, clearer sources, or clearer escalation boundaries.",
  },
];

const trustSignals = [
  {
    title: "Byline and reviewer",
    body: "Articles link the byline to the contributor page and, when a health-adjacent topic needs it, show the editorial review role and review date.",
  },
  {
    title: "Source list",
    body: "Each article carries a source list so readers can inspect the guidance behind the training recommendation instead of treating the page as unexplained authority.",
  },
  {
    title: "Medical boundary",
    body: "Health-adjacent articles state where training guidance stops and when symptom patterns belong in a clinician conversation instead of a self-coaching loop.",
  },
  {
    title: "Internal next steps",
    body: "Posts route readers into topic hubs, product pages, and related resources so one article becomes a better decision system instead of a dead end.",
  },
];

export default function MethodologyPage() {
  const canonicalUrl = absoluteUrl("/methodology");

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Methodology", url: canonicalUrl },
          ]),
          buildWebPageJsonLd({
            name: "Sundee Fundee Methodology",
            description:
              "How articles are selected, reviewed, sourced, and updated across the Sundee Fundee training library.",
            url: canonicalUrl,
          }),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-16 pb-12">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Methodology
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              How the training library is built
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              This page explains how Sundee Fundee chooses article topics,
              reviews health-adjacent guidance, uses sources, and marks the
              boundary between training education and medical care.
            </p>
          </div>
        </section>

        <section className="bg-surface px-6 py-12">
          <div className="mx-auto grid max-w-5xl gap-6">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-border bg-white p-8"
              >
                <h2 className="font-display text-3xl font-semibold text-navy">
                  {section.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-muted">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-3xl font-semibold text-navy">
              What shows on article pages
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {trustSignals.map((signal) => (
                <article
                  key={signal.title}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <h3 className="font-display text-2xl font-semibold text-navy">
                    {signal.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {signal.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-display text-3xl font-semibold text-navy">
              Contributors
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {authors.map((author) => (
                <Link
                  key={author.slug}
                  href={`/authors/${author.slug}`}
                  className="rounded-2xl border border-border bg-surface p-6 transition hover:border-navy"
                >
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
                    {author.role}
                  </p>
                  <h3 className="font-display mt-4 text-2xl font-semibold text-navy">
                    {author.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {author.description}
                  </p>
                  <p className="mt-5 text-sm font-medium text-orange">
                    View profile →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
