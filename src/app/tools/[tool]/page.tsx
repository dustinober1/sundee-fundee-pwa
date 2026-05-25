import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CycleSymptomWorkoutModifier } from "@/components/tools/CycleSymptomWorkoutModifier";
import { DeloadPlanner } from "@/components/tools/DeloadPlanner";
import { OneRepMaxReadinessChecklist } from "@/components/tools/OneRepMaxReadinessChecklist";
import { ReadinessScoreCalculator } from "@/components/tools/ReadinessScoreCalculator";
import { RpeRirChart } from "@/components/tools/RpeRirChart";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo";
import { SITE_TITLE } from "@/lib/site";
import { getTrainingTool, trainingTools, type TrainingToolSlug } from "@/lib/training-tools";

type Params = Promise<{ tool: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return trainingTools.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tool: toolSlug } = await params;
  const tool = getTrainingTool(toolSlug);

  if (!tool) {
    return {};
  }

  return {
    title: `${tool.seoTitle} | ${SITE_TITLE}`,
    description: tool.seoDescription,
    alternates: {
      canonical: tool.href,
    },
    openGraph: {
      type: "website",
      url: absoluteUrl(tool.href),
      title: `${tool.seoTitle} | ${SITE_TITLE}`,
      description: tool.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.seoTitle} | ${SITE_TITLE}`,
      description: tool.seoDescription,
    },
  };
}

function ToolExperience({ slug }: { slug: TrainingToolSlug }) {
  switch (slug) {
    case "readiness-score-calculator":
      return <ReadinessScoreCalculator />;
    case "deload-week-planner":
      return <DeloadPlanner />;
    case "one-rep-max-readiness-checklist":
      return <OneRepMaxReadinessChecklist />;
    case "rpe-rir-chart":
      return <RpeRirChart />;
    case "cycle-symptom-workout-modifier":
      return <CycleSymptomWorkoutModifier />;
    default:
      return null;
  }
}

export default async function TrainingToolPage({ params }: { params: Params }) {
  const { tool: toolSlug } = await params;
  const tool = getTrainingTool(toolSlug);

  if (!tool) {
    notFound();
  }

  const canonicalUrl = absoluteUrl(tool.href);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Tools", url: absoluteUrl("/tools") },
            { name: tool.title, url: canonicalUrl },
          ]),
          buildWebPageJsonLd({
            name: tool.seoTitle,
            description: tool.seoDescription,
            url: canonicalUrl,
          }),
          {
            ...buildSoftwareApplicationJsonLd(),
            name: tool.title,
            description: tool.seoDescription,
            url: canonicalUrl,
            applicationSubCategory: "StrengthTrainingTool",
            featureList: tool.audience,
          },
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />
      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-16 pb-14">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/tools"
              className="text-sm text-muted underline-offset-4 hover:underline"
            >
              ← All tools
            </Link>
            <p className="mt-10 text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Training tool
            </p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              {tool.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              {tool.description}
            </p>
          </div>
        </section>

        <section className="bg-surface px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <ToolExperience slug={tool.slug} />
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <article>
              <p className="text-base leading-8 text-muted">{tool.intro}</p>
              <div className="mt-10 space-y-10">
                {tool.sections.map((section) => (
                  <section key={section.title}>
                    <h2 className="font-display text-3xl font-bold text-navy">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-5 text-base leading-8 text-muted">
                      <p>{section.paragraphs[0]}</p>
                      <p>{section.paragraphs[1]}</p>
                    </div>
                  </section>
                ))}
              </div>
            </article>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
                  Best fit
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">
                  {tool.audience.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-orange" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange">
                  Related links
                </p>
                <div className="mt-4 grid gap-4">
                  {tool.relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl border border-border bg-white p-4 transition hover:border-orange/50"
                    >
                      <h2 className="font-display text-xl font-semibold text-navy">
                        {link.label}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {link.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
