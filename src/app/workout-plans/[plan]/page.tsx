import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildItemListJsonLd,
  buildWorkoutPlanJsonLd,
} from "@/lib/seo";
import { SITE_TITLE } from "@/lib/site";
import { getWorkoutPlan, workoutPlans } from "@/lib/workout-plans";

type Params = Promise<{ plan: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return workoutPlans.map((plan) => ({ plan: plan.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { plan: planSlug } = await params;
  const plan = getWorkoutPlan(planSlug);

  if (!plan) {
    return {};
  }

  const canonicalPath = `/workout-plans/${plan.slug}`;
  const canonicalUrl = absoluteUrl(canonicalPath);

  return {
    title: `${plan.landingTitle} | ${SITE_TITLE}`,
    description: plan.landingDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${plan.landingTitle} | ${SITE_TITLE}`,
      description: plan.landingDescription,
      images: [plan.coverPath],
    },
    twitter: {
      card: "summary_large_image",
      title: `${plan.landingTitle} | ${SITE_TITLE}`,
      description: plan.landingDescription,
      images: [plan.coverPath],
    },
  };
}

export default async function WorkoutPlanDetailPage({
  params,
}: {
  params: Params;
}) {
  const { plan: planSlug } = await params;
  const plan = getWorkoutPlan(planSlug);

  if (!plan) {
    notFound();
  }

  const canonicalPath = `/workout-plans/${plan.slug}`;
  const canonicalUrl = absoluteUrl(canonicalPath);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Workout Plans", url: absoluteUrl("/workout-plans") },
            { name: plan.shortTitle, url: canonicalUrl },
          ]),
          buildWorkoutPlanJsonLd({
            name: plan.landingTitle,
            description: plan.landingDescription,
            url: canonicalUrl,
            image: absoluteUrl(plan.coverPath),
          }),
          buildFaqPageJsonLd(plan.faqs),
          buildItemListJsonLd(
            `${plan.shortTitle} sample week`,
            plan.sampleWeek.map((day) => ({
              name: `${day.day}: ${day.focus}`,
              url: canonicalUrl,
              description: day.workout,
            })),
          ),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="rounded-[2rem] border border-border bg-surface p-4">
              <Image
                src={plan.coverPath}
                alt={`${plan.title} cover`}
                width={612}
                height={792}
                className="rounded-[1.5rem] border border-border"
                priority
              />
            </div>

            <div>
              <Link
                href="/workout-plans"
                className="text-sm text-muted underline-offset-4 hover:underline"
              >
                ← All printable plans
              </Link>
              <p className="mt-10 text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Printable workout plan
              </p>
              <h1 className="font-display mt-5 max-w-4xl text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
                {plan.landingTitle}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                {plan.landingDescription}
              </p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted">
                {plan.searchIntent}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {[plan.weeks, plan.workouts, `${plan.pages} pages`, plan.equipment].map(
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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={plan.pdfPath}
                  download
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange px-8 py-3 font-medium text-cream transition hover:opacity-90"
                >
                  Download {plan.shortTitle} PDF
                </a>
                <AppStoreButtons
                  utmCampaign="workout_plan_landing"
                  utmContent={plan.slug}
                  compact={false}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Sample week
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                What the week feels like.
              </h2>
            </div>

            <div className="mt-10 overflow-hidden rounded-[2rem] border border-border bg-white">
              <table className="w-full border-collapse">
                <thead className="bg-navy text-left text-cream">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold">Day</th>
                    <th className="px-6 py-4 text-sm font-semibold">Focus</th>
                    <th className="px-6 py-4 text-sm font-semibold">Workout</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.sampleWeek.map((day) => (
                    <tr key={day.day} className="border-t border-border align-top">
                      <td className="px-6 py-5 text-sm font-semibold text-navy">
                        {day.day}
                      </td>
                      <td className="px-6 py-5 text-sm text-navy">{day.focus}</td>
                      <td className="px-6 py-5 text-sm leading-7 text-muted">
                        {day.workout}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-border bg-cream p-8">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Best fit
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold text-navy">
                Who this plan fits
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-muted">
                {plan.whoItFits.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[2rem] border border-border bg-surface p-8">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Use caution
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold text-navy">
                Who should skip it
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-muted">
                {plan.whoShouldSkip.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-navy" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="bg-surface px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              FAQ
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
              Common questions before you print.
            </h2>
            <div className="mt-10 grid gap-4">
              {plan.faqs.map((item) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-border bg-white p-6"
                >
                  <summary className="cursor-pointer font-display text-xl font-semibold text-navy">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Related links
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                Keep planning from here.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {plan.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-[1.5rem] border border-border bg-surface p-6 transition hover:border-orange/50"
                >
                  <h3 className="font-display text-2xl font-semibold text-navy">
                    {link.label}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-navy px-6 py-20 text-cream">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Next step
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
              Print the base block, then add app guidance when you want more context.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-cream/80">
              The PDF gives you a fixed printable plan. Sundee Fundee is where
              recovery, cycle context, pain flags, and substitutions can shape
              the next workout after you log it.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/workout-plans"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-cream/20 px-8 py-3 font-medium text-cream transition hover:border-gold/70"
              >
                Browse all printable plans
              </Link>
              <AppStoreButtons
                utmCampaign="workout_plan_landing"
                utmContent={`${plan.slug}_footer`}
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
