import Link from "next/link";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";
import { getPost, type BlogPost } from "../blog/posts";

export const metadata: Metadata = {
  title: "Garmin Strength Training App",
  description:
    "Garmin users can route recovery data into a smarter lifting workflow today, with direct Garmin support on the roadmap.",
  alternates: {
    canonical: "/garmin-strength-training-app",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/garmin-strength-training-app`,
    siteName: SITE_TITLE,
    title: "Garmin Strength Training App",
    description:
      "Garmin users can route recovery data into a smarter lifting workflow today, with direct Garmin support on the roadmap.",
    images: [SITE_OG_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: "Garmin Strength Training App",
    description:
      "Garmin users can route recovery data into a smarter lifting workflow today, with direct Garmin support on the roadmap.",
    images: [SITE_OG_IMAGE_PATH],
  },
};

const relatedPostSlugs = [
  "garmin-recovery-data-for-lifters",
  "why-recovery-beats-the-calendar",
  "sleep-quality-strength-training-gains",
] as const;

const relatedPosts = relatedPostSlugs
  .map((slug) => getPost(slug))
  .filter((post): post is BlogPost => Boolean(post));

export default function GarminStrengthTrainingAppPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            {
              name: "Garmin Strength Training App",
              url: `${SITE_URL}/garmin-strength-training-app`,
            },
          ]),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Garmin Strength Training App
            </p>
            <div className="mt-4 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <h1 className="font-display text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
                  Use Garmin recovery data in a strength plan that can adapt.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                  If you already track recovery with Garmin, the important part is
                  not the chart itself. It is turning that information into a
                  workout decision that makes sense when you open the gym door.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <AppStoreButtons />
                  <a
                    href="#guides"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 font-medium text-navy transition hover:border-orange hover:text-orange"
                  >
                    Read the Garmin guides
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(13,26,64,0.08)]">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange">
                  Current path
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-muted">
                  <li>Use recovery data through Apple Health today.</li>
                  <li>Direct Garmin support is on the roadmap.</li>
                  <li>Keep the same readiness-first training model either way.</li>
                  <li>Prefer honest labels over inflated promises.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                What to expect
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                The integration story matters as much as the training story.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Garmin is useful when it helps you decide whether the session
                should push, hold steady, or back off. Sundee Fundee is built
                around that decision, and the page is clear about what is live
                now versus what is still being built.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Clear current workflow
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Garmin users can work through Apple Health while the direct path
                  is still being completed.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Honest roadmap
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  The page signals what is ready now and what is being developed
                  next.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Same training logic
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Recovery still drives the session choice, even when the data
                  source changes.
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
                  Read the Garmin recovery articles behind the page.
                </h2>
              </div>
              <p className="max-w-xl text-muted">
                These posts explain how Garmin-style recovery data maps to a
                strength plan.
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
                Questions Garmin users ask
              </h2>
            </div>

            <div className="mt-12 grid gap-4">
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Is direct Garmin sync live?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  Not yet. The current path is through Apple Health while the
                  direct Garmin integration is being built.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Why keep a page for it now?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  Because Garmin users are already searching for a strength app
                  that understands recovery. The page answers that search honestly.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Will the training logic change?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  No. The recovery model stays the same even when the integration
                  path changes.
                </p>
              </details>
            </div>

            <div className="mt-12 text-center">
              <h3 className="font-display text-3xl font-bold">
                Use the app now and keep the Garmin story honest.
              </h3>
              <p className="mt-4 text-cream/80">
                Start with the current workflow and build from there.
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
