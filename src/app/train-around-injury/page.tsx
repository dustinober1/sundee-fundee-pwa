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
  title: "Train Around Injury",
  description:
    "Keep training when pain or injury changes the plan with movement substitutions, recovery context, and smarter load decisions.",
  alternates: {
    canonical: "/train-around-injury",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/train-around-injury`,
    siteName: SITE_TITLE,
    title: "Train Around Injury",
    description:
      "Keep training when pain or injury changes the plan with movement substitutions, recovery context, and smarter load decisions.",
    images: [SITE_OG_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: "Train Around Injury",
    description:
      "Keep training when pain or injury changes the plan with movement substitutions, recovery context, and smarter load decisions.",
    images: [SITE_OG_IMAGE_PATH],
  },
};

const relatedPostSlugs = [
  "training-around-injuries-without-losing-progress",
  "breathing-bracing-lifting-technique",
  "warm-up-protocol-for-strength-training",
] as const;

const relatedPosts = relatedPostSlugs
  .map((slug) => getPost(slug))
  .filter((post): post is BlogPost => Boolean(post));

export default function TrainAroundInjuryPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Train Around Injury", url: `${SITE_URL}/train-around-injury` },
          ]),
          buildSoftwareApplicationJsonLd(),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-16">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Train Around Injury
            </p>
            <div className="mt-4 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <h1 className="font-display text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
                  Keep training when pain changes the plan.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                  Sudden pain, lingering irritation, and old injuries do not need
                  to end the training week. Sundee Fundee helps route around the
                  problem so you keep momentum without pretending nothing changed.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <AppStoreButtons />
                  <a
                    href="#guides"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 font-medium text-navy transition hover:border-orange hover:text-orange"
                  >
                    Read the injury guides
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(13,26,64,0.08)]">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-orange">
                  How it adapts
                </p>
                <ul className="mt-5 space-y-4 text-sm leading-7 text-muted">
                  <li>Swap the movement pattern instead of dropping the session.</li>
                  <li>Reduce load when a joint or tissue is irritated.</li>
                  <li>Keep the training goal intact while respecting limitations.</li>
                  <li>Use the plan as a guide, not a punishment.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Why this matters
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                Injury does not have to erase the whole program.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                The goal is not to train through everything. The goal is to make
                the session safer and more useful when an injury or flare-up
                changes what your body can tolerate right now.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Protect the tissue
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Remove or reduce the movement that is aggravating the problem.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Preserve the pattern
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Use a safer substitute so the training pattern and stimulus still
                  exist.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Keep the habit alive
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  A modified session protects consistency while you work through
                  the injury.
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
                  Practical articles for adapting training around pain.
                </h2>
              </div>
              <p className="max-w-xl text-muted">
                These guides show how to keep training while lowering risk and
                staying honest about what hurts.
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
                Common injury questions
              </h2>
            </div>

            <div className="mt-12 grid gap-4">
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Is this medical advice?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  No. It is a training tool. If pain is severe or persistent, you
                  should get evaluated by a clinician.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  What if I can only train part of the body?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  The app can still help preserve the training habit by shifting
                  volume and emphasizing what is still usable.
                </p>
              </details>
              <details className="rounded-2xl border border-cream/10 bg-white/5 p-6">
                <summary className="cursor-pointer font-display text-xl font-semibold">
                  Can I use it with a physical therapist?
                </summary>
                <p className="mt-3 text-sm leading-7 text-cream/80">
                  Yes. It is most useful when it supports the plan you and your
                  provider already agreed on.
                </p>
              </details>
            </div>

            <div className="mt-12 text-center">
              <h3 className="font-display text-3xl font-bold">
                Train around the injury without losing the habit.
              </h3>
              <p className="mt-4 text-cream/80">
                Keep momentum while you protect the thing that needs attention.
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
