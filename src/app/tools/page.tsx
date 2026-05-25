import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo";
import { SITE_TITLE, SITE_URL } from "@/lib/site";
import { trainingTools } from "@/lib/training-tools";

export const metadata: Metadata = {
  title: `Strength Training Tools | ${SITE_TITLE}`,
  description:
    "Browse lightweight strength training tool pages for readiness, deloads, cycle symptoms, max testing, and effort targets.",
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
            { name: "Home", url: SITE_URL },
            { name: "Tools", url: `${SITE_URL}/tools` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Strength Training Tools",
            url: `${SITE_URL}/tools`,
            description:
              "A lightweight index of training tools linked from the Sundee Fundee topic hubs.",
          },
          buildItemListJsonLd(
            "Strength Training Tools",
            trainingTools.map((tool) => ({
              name: tool.title,
              description: tool.description,
              url: `${SITE_URL}${tool.href}`,
            })),
          ),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />
      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-16 pb-12">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Tools
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              Simple tools for the next training decision.
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-muted">
              These routes are the live tool destinations currently linked from the
              topic hubs. They are intentionally lightweight for now, but each one
              already describes the decision it is meant to support.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-4xl gap-4">
            {trainingTools.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.href}
                className="rounded-2xl border border-border bg-surface p-6 transition hover:border-navy"
              >
                <h2 className="font-display text-2xl font-semibold text-navy">
                  {tool.title}
                </h2>
                <p className="mt-3 text-muted">{tool.description}</p>
                <p className="mt-4 text-sm text-muted">{tool.topicSummary}</p>
                <p className="mt-6 text-sm font-medium text-orange">
                  Open tool page →
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
