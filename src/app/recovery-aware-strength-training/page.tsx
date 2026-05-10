import Link from "next/link";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  buildBreadcrumbJsonLd,
  buildSoftwareApplicationJsonLd,
} from "@/lib/seo";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";
import { getPost, type BlogPost } from "../blog/posts";

export const metadata: Metadata = {
  title: "Recovery-Aware Strength Training",
  description:
    "Train by readiness, not by the calendar. Use recovery context to make better strength decisions when the week changes.",
  alternates: {
    canonical: "/recovery-aware-strength-training",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/recovery-aware-strength-training`,
    siteName: SITE_TITLE,
    title: "Recovery-Aware Strength Training",
    description:
      "Train by readiness, not by the calendar. Use recovery context to make better strength decisions when the week changes.",
    images: [SITE_OG_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recovery-Aware Strength Training",
    description:
      "Train by readiness, not by the calendar. Use recovery context to make better strength decisions when the week changes.",
    images: [SITE_OG_IMAGE_PATH],
  },
};

const relatedPostSlugs = [
  "why-recovery-beats-the-calendar",
  "low-readiness-score-strength-training",
  "deload-week-sleep-soreness-training-history",
  "when-hrv-is-low-strength-training",
] as const;

const relatedPosts = relatedPostSlugs
  .map((slug) => getPost(slug))
  .filter((post): post is BlogPost => Boolean(post));

export default function RecoveryAwareStrengthTrainingPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            {
              name: "Recovery-Aware Strength Training",
              url: `${SITE_URL}/recovery-aware-strength-training`,
            },
          ]),
          buildSoftwareApplicationJsonLd(),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Recovery-Aware Strength Training
            </p>
            <div className="mt-4 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <h1 className="font-display text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
                  Train by readiness, not by the calendar.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                  The best strength plan is the one that responds when recovery
                  changes. Sundee Fundee gives you a way to keep training without
                  forcing every week to look the same.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <AppStoreButtons
                    utmCampaign="product_landing"
                    utmContent="recovery"
                  />
                  <a
                    href="#guides"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 font-medium text-navy transition hover:border-orange hover:text-orange"
                  >
                    See the recovery guides
                  </a>
                  <Link
                    href="/science#recovery-vs-calendar"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-8 font-medium text-navy transition hover:border-orange hover:text-orange"
                  >
                    Science behind this
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(13,26,64,0.08)]">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange">
                  Recovery inputs
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-muted">
                  <li>Sleep quality and consistency</li>
                  <li>HRV and resting heart rate</li>
                  <li>Soreness and subjective readiness</li>
                  <li>Recent training load and deload timing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                What recovery-aware means
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                The plan changes when recovery does.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Recovery-aware training does not mean training less. It means
                adjusting the stress so the session still counts when sleep is
                off, soreness is high, or your body is telling you the usual
                loading strategy is not the right one today.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Pull back intelligently
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Reduce load, volume, or intensity without losing the training
                  pattern entirely.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Deload on time
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Catch the point where fatigue is building before the week starts
                  breaking down.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Stay consistent
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  A smaller session that you complete is better than a perfect
                  session you never recover from.
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
                  Articles that explain the method behind the app.
                </h2>
              </div>
              <p className="max-w-xl text-muted">
                These pieces show how recovery, sleep, deloads, and readiness
                shape the way the app thinks.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-2xl border border-border bg-surface p-6 transition hover:border-orange/50"
                >
                  <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
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
                Common recovery questions
              </h2>
            </div>

            <div className="mt-12 grid gap-4">
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Do I need HRV to use this?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  No. HRV is one input. The app can still work with sleep,
                  subjective readiness, and the training history you already have.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Does recovery-aware training mean skipping workouts?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  Usually not. It means changing the session so you keep moving
                  forward without forcing a day that your body cannot support well.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Is this just another deload calculator?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  No. It combines readiness, training history, cycle context,
                  and injuries so the adjustment is broader than a single rule.
                </p>
              </details>
            </div>

            <div className="mt-12 text-center">
              <h3 className="font-display text-3xl font-bold">
                Stop making every week carry the same load.
              </h3>
              <p className="mt-4 text-cream/80">
                Use the app when your body needs the plan to move with it.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <AppStoreButtons
                  utmCampaign="product_landing"
                  utmContent="recovery"
                  compact={false}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
