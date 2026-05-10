import type { Metadata } from "next";
import Link from "next/link";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { JsonLd } from "@/components/JsonLd";
import { ScienceRecommendationSimulator } from "@/components/science/ScienceRecommendationSimulator";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  buildBreadcrumbJsonLd,
  buildSoftwareApplicationJsonLd,
} from "@/lib/seo";
import { scienceEvidenceSources, scienceLayers } from "@/lib/science";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";

const scienceDescription =
  "How Sundee Fundee uses Apple Health signals, readiness, cycle context, and injury-aware workout adjustments to guide recovery-aware strength training.";

const anchorLinks = [
  { href: "#readiness-score", label: "Readiness" },
  { href: "#cycle-aware-training", label: "Cycle context" },
  { href: "#injury-aware-programming", label: "Injury routing" },
  { href: "#recovery-vs-calendar", label: "Recovery vs. calendar" },
  { href: "#evidence", label: "Evidence" },
] as const;

const relatedResources = [
  {
    href: "/readiness-score-strength-training",
    title: "Readiness score strength training",
    body: "Use recovery context to decide when to push, repeat, modify, or pull back.",
  },
  {
    href: "/cycle-aware-training",
    title: "Cycle-aware training",
    body: "Use optional cycle context without letting phase labels overrule readiness.",
  },
  {
    href: "/train-around-injury",
    title: "Train around injury",
    body: "Keep training decisions conservative when pain changes the plan.",
  },
  {
    href: "/blog/why-recovery-beats-the-calendar",
    title: "Why recovery beats the calendar",
    body: "A deeper article on readiness-gated programming and smarter deload choices.",
  },
] as const;

export const metadata: Metadata = {
  title: {
    absolute:
      "Readiness Score, Cycle-Aware Training & Injury-Aware Programming | Sundee Fundee",
  },
  description: scienceDescription,
  alternates: {
    canonical: "/science",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/science`,
    siteName: SITE_TITLE,
    title: "Readiness Score, Cycle-Aware Training & Injury-Aware Programming",
    description: scienceDescription,
    images: [SITE_OG_IMAGE_PATH],
  },
  twitter: {
    card: "summary_large_image",
    title: "Readiness Score, Cycle-Aware Training & Injury-Aware Programming",
    description: scienceDescription,
    images: [SITE_OG_IMAGE_PATH],
  },
};

function ScienceLayerSection({ layer }: { layer: (typeof scienceLayers)[number] }) {
  return (
    <section id={layer.id} className="scroll-mt-28 border-t border-border py-14">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
            {layer.eyebrow}
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold leading-tight text-navy sm:text-5xl">
            {layer.title}
          </h2>
          <Link
            href={layer.href}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-navy transition hover:border-orange hover:text-orange"
          >
            Science behind this
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
              Input
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">{layer.input}</p>
          </article>
          <article className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
              Interpretation
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {layer.interpretation}
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
              Training change
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              {layer.trainingChange}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default function SciencePage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Science", url: `${SITE_URL}/science` },
          ]),
          buildSoftwareApplicationJsonLd(),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-12">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  The Science
                </p>
                <h1 className="font-display mt-5 max-w-4xl text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
                  The science behind recovery-aware strength training.
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                  Sundee Fundee turns Apple Health signals, subjective readiness,
                  optional cycle context, and injury flags into a practical
                  training choice: push, hold, modify, or recover.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#simulator"
                    className="inline-flex h-12 items-center justify-center rounded-lg bg-orange px-8 font-medium text-cream transition hover:opacity-90"
                  >
                    Try the simulator
                  </a>
                  <a
                    href="#evidence"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-8 font-medium text-navy transition hover:border-orange hover:text-orange"
                  >
                    See the evidence
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_20px_60px_rgba(13,26,64,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange">
                  Model layers
                </p>
                <dl className="mt-5 grid gap-4">
                  {[
                    ["Readiness", "Can your body use hard training today?"],
                    ["Cycle context", "Is optional phase or symptom context useful?"],
                    ["Pain flags", "Does the movement need a safer route?"],
                    ["Training goal", "What stress was today supposed to create?"],
                  ].map(([term, detail]) => (
                    <div key={term} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                      <dt className="font-display text-xl font-semibold text-navy">
                        {term}
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-muted">
                        {detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <nav className="sticky top-[73px] z-40 border-y border-border bg-cream/90 px-6 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
            {anchorLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-navy transition hover:border-orange hover:text-orange"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <ScienceRecommendationSimulator />

        <section className="px-6 py-10">
          <div className="mx-auto max-w-6xl">
            {scienceLayers.map((layer) => (
              <ScienceLayerSection key={layer.id} layer={layer} />
            ))}

            <div className="rounded-2xl border border-orange/30 bg-orange/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
                Training guidance, not medical advice
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Cycle symptoms, pain, and injuries deserve conservative
                framing. Sundee Fundee can organize training decisions, but it
                does not diagnose, treat, or replace care from a qualified
                clinician.
              </p>
            </div>
          </div>
        </section>

        <section id="evidence" className="scroll-mt-28 bg-navy px-6 py-20 text-cream">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
                Evidence
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
                The claims stay useful because the limits are visible.
              </h2>
              <p className="mt-5 text-lg leading-8 text-cream/80">
                The page links to research that supports the direction of the
                model while spelling out what the app should not claim.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {scienceEvidenceSources.map((source) => (
                <article
                  key={source.href}
                  className="rounded-2xl border border-cream/10 bg-white/5 p-6"
                >
                  <p className="text-sm font-semibold text-gold">{source.claim}</p>
                  <h3 className="font-display mt-3 text-2xl font-semibold">
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline-offset-4 hover:underline"
                    >
                      {source.title}
                    </a>
                  </h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/55">
                        What this supports
                      </p>
                      <p className="mt-2 text-sm leading-7 text-cream/80">
                        {source.supports}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/55">
                        What not to overclaim
                      </p>
                      <p className="mt-2 text-sm leading-7 text-cream/80">
                        {source.dontOverclaim}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Related resources
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                  Keep building the training decision.
                </h2>
              </div>
              <p className="max-w-xl text-muted">
                These pages turn the science into a narrower decision for
                readiness, cycle context, pain, and recovery-aware programming.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {relatedResources.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  className="rounded-2xl border border-border bg-surface p-6 transition hover:border-orange/50"
                >
                  <h3 className="font-display text-2xl font-semibold text-navy">
                    {resource.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {resource.body}
                  </p>
                  <p className="mt-6 text-sm font-medium text-orange">
                    Read more
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Try the app
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
              Turn readiness into today&apos;s workout.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              Download Sundee Fundee and use recovery-aware programming, optional
              cycle context, and injury-smart substitutions on iPhone.
            </p>
            <div className="mt-8 flex justify-center">
              <AppStoreButtons
                utmCampaign="science"
                utmContent="bottom_cta"
                compact={false}
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
