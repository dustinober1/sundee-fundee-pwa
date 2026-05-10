import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { AppComparison } from "@/components/AppComparison";
import { TrainingLifestyleGallery } from "@/components/TrainingLifestyleGallery";
import { JsonLd } from "@/components/JsonLd";
import { HomeProductPreview } from "@/components/HomeProductPreview";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ReadinessAdvisor } from "@/components/ReadinessAdvisor";
import { TrustSignals } from "@/components/TrustSignals";
import {
  buildOrganizationJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo";
import {
  SITE_DESCRIPTION,
  SITE_OG_IMAGE_PATH,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
import { workoutPlans } from "@/lib/workout-plans";
import { formatDate, posts } from "./blog/posts";

const latestPosts = posts.slice(0, 3);

const paths = [
  {
    href: "/for-women-who-lift",
    title: "For Women Who Lift",
    body: "Cycle-informed, recovery-aware training built around how women actually train.",
  },
  {
    href: "/recovery-aware-strength-training",
    title: "Recovery-Aware Strength Training",
    body: "Use readiness, sleep, and fatigue to change the session before the week breaks down.",
  },
  {
    href: "/science",
    title: "The Science",
    body: "See how readiness, cycle context, Apple Health signals, and injury flags shape a workout.",
  },
  {
    href: "/train-around-injury",
    title: "Train Around Injury",
    body: "Keep the habit alive when pain or irritation changes what your body can handle.",
  },
  {
    href: "/apple-health-strength-training-app",
    title: "Apple Health Strength Training App",
    body: "Turn Apple Health signals into a smarter lifting decision.",
  },
  {
    href: "/best-strength-training-app-for-women",
    title: "Best Strength Training App for Women",
    body: "Compare what matters when choosing an adaptive strength app.",
  },
  {
    href: "/readiness-score-strength-training",
    title: "Readiness Score Strength Training",
    body: "Use recovery context to decide how today’s workout should change.",
  },
  {
    href: "/strength-training-recovery",
    title: "Strength Training Recovery",
    body: "Browse recovery-aware guides for lifters.",
  },
  {
    href: "/cycle-aware-training",
    title: "Cycle-Aware Training",
    body: "Use optional cycle context without rigid rules.",
  },
] as const;

export const metadata: Metadata = {
  title: "Recovery-Aware Strength Training App for iOS",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_TITLE,
    title: "Recovery-Aware Strength Training App for iOS",
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recovery-Aware Strength Training App for iOS",
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
  },
};

export default function Landing() {
  return (
    <>
      <JsonLd
        data={[
          buildOrganizationJsonLd(),
          buildWebsiteJsonLd(),
          buildSoftwareApplicationJsonLd(),
        ]}
      />
      <SiteHeader showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative max-w-2xl">
              <div className="absolute -inset-12 rounded-full bg-[radial-gradient(circle_at_center,rgba(242,115,25,0.12),transparent_60%)] blur-3xl pointer-events-none" />
              <div className="relative">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Strength Training
                </p>
                <h1 className="font-display mt-6 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
                  Train smarter with recovery-aware programs.
                </h1>
                <p className="mt-6 max-w-xl text-lg text-muted">
                  Injury-adaptive plans, cycle tracking, and recovery-driven
                  workouts. Available on iOS.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <AppStoreButtons
                    utmCampaign="home"
                    utmContent="hero_primary"
                    compact={false}
                  />
                  <a
                    href="#compare"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-8 font-medium text-navy transition hover:border-orange/50 hover:text-orange"
                  >
                    See What&apos;s Inside
                  </a>
                </div>
                <p className="mt-4 text-sm text-muted">
                  Built around the idea that your training should adapt to your
                  body, not the calendar.
                </p>
              </div>
            </div>

            <HomeProductPreview />
          </div>
        </section>

        <section id="features" className="bg-navy px-6 py-24 text-cream">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
                What&apos;s Included
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
                Training built around your body
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-cream/80">
                Recovery, injuries, and cycle phase shape every session. Not
                one-size-fits-all.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Recovery-Driven Plans",
                  body: "Log readiness daily. Workouts adapt to how recovered you actually are.",
                },
                {
                  title: "Cycle Phase Tracking",
                  body: "Optional cycle tracking informs load and intensity. Train with your body, not against it.",
                },
                {
                  title: "Injury Adaptation",
                  body: "Log injuries and pain. Sessions adjust to keep you training safely around limitations.",
                },
                {
                  title: "Max & PR Tracking",
                  body: "Record lifts and benchmarks. See progress over time and catch plateaus early.",
                },
                {
                  title: "Strength Programs",
                  body: "Pre-built programs or customize your own. Periodization and deload weeks included.",
                },
                {
                  title: "Benchmarks & Challenges",
                  body: "Track classic benchmarks, WODs, and personal goals. Celebrate every milestone.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-cream/10 border-l-orange/40 bg-cream/5 p-6"
                >
                  <h3 className="font-display text-xl font-semibold text-cream">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/80">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TrainingLifestyleGallery />

        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Printable strength plans
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                  Start with a plan you can carry.
                </h2>
              </div>
              <p className="max-w-xl text-muted">
                Print a complete training block, take it to the gym, write down
                what you actually did, and use those notes to guide the next
                session.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {workoutPlans.map((plan) => (
                <Link
                  key={plan.slug}
                  href="/workout-plans"
                  className="group overflow-hidden rounded-[2rem] border border-border bg-surface transition hover:border-orange/50"
                >
                  <div className="bg-navy/5 p-4">
                    <Image
                      src={plan.coverPath}
                      alt={`${plan.title} cover`}
                      width={612}
                      height={792}
                      className="rounded-[1.25rem] border border-border transition group-hover:scale-[1.01]"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
                      {plan.pages} pages · {plan.weeks}
                    </p>
                    <h3 className="font-display mt-3 text-2xl font-semibold text-navy">
                      {plan.shortTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      {plan.description}
                    </p>
                    <p className="mt-6 text-sm font-medium text-orange">
                      View plans →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AppComparison />

        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Start here
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                Find the path that matches how you train.
              </h2>
              <p className="mt-4 text-muted">
                These pages turn the core product idea into clearer entry points
                for people arriving from search.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {paths.map((path) => (
                <Link
                  key={path.href}
                  href={path.href}
                  className="rounded-2xl border border-border bg-surface p-6 transition hover:border-orange/50"
                >
                  <h3 className="font-display text-2xl font-semibold text-navy">
                    {path.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {path.body}
                  </p>
                  <p className="mt-6 text-sm font-medium text-orange">
                    Learn more →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <TrustSignals />

        <ReadinessAdvisor />

        <section className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold text-navy sm:text-5xl">
              Download now on the App Store.
            </h2>
            <p className="mt-4 text-muted">
              Get recovery-aware training plans, injury adaptation, and progress
              tracking.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <AppStoreButtons utmCampaign="home" compact={false} />
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Latest from the blog
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                  Recent training notes
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-medium text-orange underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {latestPosts.map((post) => (
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

            <div className="mt-10 rounded-[2rem] border border-border bg-surface p-6 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Turn reading into training, then ship it
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-muted">
                Use the app to turn recovery ideas into an actual session when
                your readiness changes during the week.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <AppStoreButtons utmCampaign="home" utmContent="blog_cta" compact />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
