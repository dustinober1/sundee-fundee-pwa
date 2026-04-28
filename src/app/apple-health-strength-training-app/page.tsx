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
  title: "Apple Health Strength Training App",
  description:
    "Use the Apple Health data you already have to make smarter strength decisions with a recovery-aware training app.",
  alternates: {
    canonical: "/apple-health-strength-training-app",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/apple-health-strength-training-app`,
    siteName: SITE_TITLE,
    title: "Apple Health Strength Training App",
    description:
      "Use the Apple Health data you already have to make smarter strength decisions with a recovery-aware training app.",
    images: [SITE_OG_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apple Health Strength Training App",
    description:
      "Use the Apple Health data you already have to make smarter strength decisions with a recovery-aware training app.",
    images: [SITE_OG_IMAGE_PATH],
  },
};

const relatedPostSlugs = [
  "apple-health-data-for-strength-training",
  "apple-health-strength-training-recovery",
  "apple-watch-hrv-strength-training",
] as const;

const relatedPosts = relatedPostSlugs
  .map((slug) => getPost(slug))
  .filter((post): post is BlogPost => Boolean(post));

export default function AppleHealthStrengthTrainingAppPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            {
              name: "Apple Health Strength Training App",
              url: `${SITE_URL}/apple-health-strength-training-app`,
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
              Apple Health Strength Training App
            </p>
            <div className="mt-4 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <h1 className="font-display text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
                  Use Apple Health data to make better training choices.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                  Apple Health already has useful recovery signals. Sundee Fundee
                  turns those signals into workouts that match the way you
                  actually feel, not just the plan you made last week.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <AppStoreButtons
                    utmCampaign="product_landing"
                    utmContent="apple_health"
                  />
                  <a
                    href="#guides"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 font-medium text-navy transition hover:border-orange hover:text-orange"
                  >
                    Read the Apple Health guides
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(13,26,64,0.08)]">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange">
                  Helpful inputs
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-muted">
                  <li>HRV and resting heart rate</li>
                  <li>Sleep stages and sleep consistency</li>
                  <li>Activity trends and training load</li>
                  <li>Privacy-first on-device health permissions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Why this integration matters
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                The data is already there. The missing piece is the decision.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Apple Health can surface the signals that matter most for
                readiness, but the app still needs to decide whether today should
                be a heavy day, a technique day, or a pull-back day. That is the
                job Sundee Fundee is built to do.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Read the signals
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Bring HRV, sleep, and recovery context into the same view as
                  your training week.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Change the session
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Turn a poor-recovery day into a smarter version of the workout
                  you planned.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Keep the data private
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Health data is handled through the permissions model you already
                  know from Apple Health.
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
                  Read how Apple Health fits into the training method.
                </h2>
              </div>
              <p className="max-w-xl text-muted">
                These pieces explain what to watch, what to ignore, and how to
                turn health data into a useful workout decision.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
                Questions people ask about Apple Health
              </h2>
            </div>

            <div className="mt-12 grid gap-4">
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  What data does the app read?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  The useful recovery inputs are HRV, resting heart rate, sleep,
                  and activity trends, depending on what you grant access to.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Do I need a wearable?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  No. Wearable data helps, but the app still works with subjective
                  readiness and the signals your phone already captures.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Is my data sent to your servers?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  Health data is read through Apple Health permissions. The page
                  is designed to make the data flow clear and transparent.
                </p>
              </details>
            </div>

            <div className="mt-12 text-center">
              <h3 className="font-display text-3xl font-bold">
                Let the data change the workout, not the other way around.
              </h3>
              <p className="mt-4 text-cream/80">
                Download the app and use the health data you already have.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <AppStoreButtons
                  utmCampaign="product_landing"
                  utmContent="apple_health"
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
