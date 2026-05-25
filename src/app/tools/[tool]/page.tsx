import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_TITLE, SITE_URL } from "@/lib/site";
import { getTrainingTool, trainingTools } from "@/lib/training-tools";

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
  const tool = trainingTools.find((entry) => entry.slug === toolSlug);
  if (!tool) return {};

  return {
    title: `${tool.title} | ${SITE_TITLE}`,
    description: tool.description,
    alternates: {
      canonical: tool.href,
    },
  };
}

export default async function TrainingToolPage({ params }: { params: Params }) {
  const { tool: toolSlug } = await params;
  const tool = trainingTools.find((entry) => entry.slug === toolSlug);

  if (!tool) {
    notFound();
  }

  const currentTool = getTrainingTool(tool.slug);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Tools", url: `${SITE_URL}/tools` },
            { name: currentTool.title, url: `${SITE_URL}${currentTool.href}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: currentTool.title,
            url: `${SITE_URL}${currentTool.href}`,
            description: currentTool.description,
          },
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />
      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-16 pb-24">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/tools"
              className="text-sm text-muted underline-offset-4 hover:underline"
            >
              ← All tools
            </Link>
            <p className="mt-10 text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Tool page
            </p>
            <h1 className="font-display mt-5 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              {currentTool.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-muted">
              {currentTool.description}
            </p>
            <p className="mt-8 max-w-3xl text-base leading-8 text-muted">
              {currentTool.intro}
            </p>

            <div className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-navy">
                Why this route exists now
              </h2>
              <p className="mt-4 text-base leading-8 text-muted">
                {currentTool.topicSummary}
              </p>
              <p className="mt-4 text-base leading-8 text-muted">
                This is the minimal live route needed so topic hub links resolve in
                production while the richer interactive tools phase is still pending.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
