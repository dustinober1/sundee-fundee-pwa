import Image from "next/image";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
} from "@/lib/seo";
import { workoutPlans } from "@/lib/workout-plans";

export const metadata: Metadata = {
  title: "Printable Strength Plans – Sundee Fundee",
  description:
    "Download printable strength training plans from Sundee Fundee: beginner, dumbbell, and glutes/core/conditioning plans with gym log sheets.",
  alternates: {
    canonical: "/workout-plans",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/workout-plans",
    title: "Printable Strength Plans – Sundee Fundee",
    description:
      "Gym-ready training plans you can print, mark up, and use on paper.",
    images: [workoutPlans[0].coverPath],
  },
};

const faqItems = [
  {
    question: "Are these plans complete on their own?",
    answer:
      "Yes. Each PDF includes the full training block, weekly workouts, substitutions, tips, and paper log fields.",
  },
      {
    question: "Do I need cycle tracking to use them?",
    answer:
      "No. Each printable plan stands on its own and can be used without cycle tracking.",
  },
  {
    question: "What if I do not have the exact equipment?",
    answer:
      "Every workout includes substitution guidance for equipment limits, injury considerations, and variety.",
  },
  {
    question: "Why use printable plans?",
    answer:
      "Some people train better with paper in hand. These PDFs are built for printing, marking up, and carrying into the gym.",
  },
];

export default function WorkoutPlansPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Workout Plans", url: absoluteUrl("/workout-plans") },
          ]),
          buildItemListJsonLd(
            "Printable Strength Plans",
            workoutPlans.map((plan) => ({
              name: plan.title,
              url: absoluteUrl(plan.pdfPath),
              description: plan.description,
            })),
          ),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-16">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Printable strength plans
              </p>
              <h1 className="font-display mt-5 max-w-4xl text-5xl font-bold leading-[1.02] text-navy sm:text-6xl lg:text-7xl">
                Gym-ready plans you can mark up.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                Download a polished training block, print it, take it to the
                gym, and write down what you actually did. Each PDF includes
                the structure, substitutions, and log fields you need on paper.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#plans"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-orange px-8 font-medium text-cream transition hover:opacity-90"
                >
                  Download PDFs
                </a>
                <a
                  href="#adaptive"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-8 font-medium text-navy transition hover:border-orange/50"
                >
                  Why paper works
                </a>
              </div>
              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
                {[
                  ["4-8", "week blocks"],
                  ["16-32", "workouts"],
                  ["0", "paywalls"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border bg-surface p-5"
                  >
                    <p className="font-mono text-2xl font-semibold text-navy">
                      {value}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[440px]">
              {workoutPlans.map((plan, index) => (
                <div
                  key={plan.slug}
                  className={[
                    "absolute w-[58%] rounded-2xl border border-border bg-surface p-3 shadow-2xl",
                    index === 0
                      ? "right-2 top-0 rotate-2"
                      : index === 1
                        ? "left-0 top-24 -rotate-3"
                        : "right-8 top-44 rotate-3",
                  ].join(" ")}
                >
                  <Image
                    src={plan.coverPath}
                    alt={`${plan.title} cover`}
                    width={612}
                    height={792}
                    className="rounded-xl border border-border"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="plans" className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Download library
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                  Choose your block.
                </h2>
              </div>
              <p className="max-w-xl text-muted">
                Each plan has different workouts every week, printable set logs,
                stimulus notes, coaching tips, and substitutions for equipment
                limits, injury considerations, or variety.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {workoutPlans.map((plan) => (
                <article
                  key={plan.slug}
                  className="flex flex-col overflow-hidden rounded-[2rem] border border-border bg-cream"
                >
                  <div className="bg-navy/5 p-4">
                    <Image
                      src={plan.coverPath}
                      alt={`Preview of ${plan.title}`}
                      width={612}
                      height={792}
                      className="rounded-[1.25rem] border border-border"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
                      {plan.audience}
                    </p>
                    <h3 className="font-display mt-3 text-2xl font-semibold text-navy">
                      {plan.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[`${plan.pages} pages`, plan.weeks, plan.equipment].map(
                        (item) => (
                          <span
                            key={item}
                            className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-navy"
                          >
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-7 text-muted">
                      {plan.description}
                    </p>
                    <a
                      href={plan.pdfPath}
                      download
                      className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-orange px-6 font-medium text-cream transition hover:opacity-90"
                    >
                      Download PDF
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="adaptive" className="bg-navy px-6 py-24 text-cream">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
                  Paper-first plans
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
                  The PDF is the field notebook.
                </h2>
              </div>
              <p className="max-w-xl text-cream/80">
                Each PDF is designed to be useful without another tool open.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Track what happened",
                  "Write down weights, reps, substitutions, soreness, and effort while you train.",
                ],
                [
                  "Adjust the next day",
                  "Use your paper notes to decide whether the next workout should stay normal, get lighter, or use substitutions.",
                ],
                [
                  "Keep the history",
                  "Printed log sheets make it easy to keep a simple record across the full block.",
                ],
                [
                  "No paywall",
                  "Plans are available without subscription gating. Donations help keep it that way.",
                ],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-cream/10 bg-cream/5 p-6"
                >
                  <h3 className="font-display text-xl font-semibold text-cream">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-cream/80">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Questions
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                Before you print.
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <h3 className="font-display text-2xl font-semibold text-navy">
                    {item.question}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
