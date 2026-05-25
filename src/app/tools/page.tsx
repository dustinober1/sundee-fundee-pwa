import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo";
import { SITE_TITLE } from "@/lib/site";
import { trainingTools } from "@/lib/training-tools";

export const metadata: Metadata = {
  title: `Strength Training Tools | ${SITE_TITLE}`,
  description:
    "Browse indexable strength training tools for readiness, deload planning, max testing, RPE and RIR guidance, and cycle-symptom workout adjustments.",
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Tools", url: absoluteUrl("/tools") },
          ]),
          buildWebPageJsonLd({
            name: "Strength Training Tools",
            description:
              "A browsable index of training tools for readiness, deloads, testing, effort targets, and cycle-aware workout adjustments.",
            url: absoluteUrl("/tools"),
          }),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Strength Training Tools",
            url: absoluteUrl("/tools"),
            description:
              "A collection of indexable strength training tools from Sundee Fundee.",
          },
          buildItemListJsonLd(
            "Strength Training Tools",
            trainingTools.map((tool) => ({
              name: tool.title,
              description: tool.description,
              url: absoluteUrl(tool.href),
            })),
          ),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />
      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-16 pb-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Training tools
            </p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              Indexable tools for the next lifting decision.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              These tool pages turn the site&apos;s recovery, programming, and
              women-who-lift guidance into concrete decision surfaces. Each route
              pairs evergreen coaching copy with a lightweight interactive tool, so
              readers can move from article research into a practical next step.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-5xl gap-5">
            {trainingTools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.href}
                className="rounded-2xl border border-border bg-surface p-6 transition hover:border-orange/50"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <h2 className="font-display text-2xl font-semibold text-navy">
                      {tool.title}
                    </h2>
                    <p className="mt-3 text-base leading-8 text-muted">
                      {tool.description}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-muted">
                      {tool.topicSummary}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-navy">
                      Open tool
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
