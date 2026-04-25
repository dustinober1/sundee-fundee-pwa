import Link from "next/link";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";
import { formatDate, getPost, type BlogPost } from "../blog/posts";

export const metadata: Metadata = {
  title: "For Women Who Lift",
  description:
    "A recovery-aware strength training app built for women who want cycle-informed training, injury adaptation, and smarter load decisions.",
  alternates: {
    canonical: "/for-women-who-lift",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/for-women-who-lift`,
    siteName: SITE_TITLE,
    title: "For Women Who Lift",
    description:
      "A recovery-aware strength training app built for women who want cycle-informed training, injury adaptation, and smarter load decisions.",
    images: [SITE_OG_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: "For Women Who Lift",
    description:
      "A recovery-aware strength training app built for women who want cycle-informed training, injury adaptation, and smarter load decisions.",
    images: [SITE_OG_IMAGE_PATH],
  },
};

const relatedPostSlugs = [
  "cycle-phase-strength-programming",
  "menstrual-cycle-nutrition-strength-training",
  "menstrual-cycle-injury-risk-lifting",
] as const;

const relatedPosts = relatedPostSlugs
  .map((slug) => getPost(slug))
  .filter((post): post is BlogPost => Boolean(post));

export default function ForWomenWhoLiftPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "For Women Who Lift", url: `${SITE_URL}/for-women-who-lift` },
          ]),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              For Women Who Lift
            </p>
            <div className="mt-4 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <h1 className="font-display text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
                  Training that respects your cycle, your recovery, and your real
                  week.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                  Sundee Fundee started from women training together every
                  Sunday in Culpeper, Virginia. The product grew out of the
                  conversations that followed: how energy changes, how recovery
                  changes, and how fixed plans often miss what women actually
                  need from strength training.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <AppStoreButtons />
                  <a
                    href="#guides"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 font-medium text-navy transition hover:border-orange hover:text-orange"
                  >
                    Read the guides
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(13,26,64,0.08)]">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange">
                  Built for
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-muted">
                  <li>Women who want strength training to adapt to their cycle.</li>
                  <li>Athletes who need recovery-aware load decisions.</li>
                  <li>Lifters who want context when symptoms, stress, or sleep shift.</li>
                  <li>People who want education, not just a static program.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Why this page exists
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                Women&apos;s training is not a generic template problem.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Some weeks you are ready to push. Some weeks recovery, symptoms,
                or stress should change the plan. Sundee Fundee is built to make
                that adjustment feel normal instead of like a failure to stay
                on schedule.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Cycle-informed
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Optional cycle tracking helps the app account for phases,
                  symptoms, and training load changes.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Recovery-aware
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Readiness is part of the programming decision, not an afterthought.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Injury-adaptive
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  When a movement hurts, the plan can route around it without
                  discarding the training day.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="guides" className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Supporting guides
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                  Read the cycle and recovery guidance behind the product.
                </h2>
              </div>
              <p className="max-w-xl text-muted">
                These articles expand the method and answer the questions people
                usually have before they commit to a training app.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-2xl border border-border bg-surface p-6 transition hover:border-orange/50"
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
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy px-6 py-20 text-cream">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
                FAQ
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
                Questions women usually ask first
              </h2>
            </div>

            <div className="mt-12 grid gap-4">
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Is cycle tracking required?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  No. You can train on the recovery-first model alone. Cycle
                  tracking adds another layer, but it is optional.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  What if my cycle is irregular?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  The app can still use history, readiness, and subjective check-ins
                  to guide the session even when phases do not follow a perfect
                  calendar.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Can men use it?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  Yes. The cycle layer is optional. The recovery and injury logic
                  still applies to anyone who trains.
                </p>
              </details>
            </div>

            <div className="mt-12 text-center">
              <h3 className="font-display text-3xl font-bold">
                Ready to train with more context?
              </h3>
              <p className="mt-4 text-cream/80">
                Start with the app and let the training adjust to the week you
                actually have.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <AppStoreButtons compact={false} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
