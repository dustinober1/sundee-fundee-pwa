import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildItemListJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo";
import { SITE_OG_IMAGE_PATH, SITE_TITLE, SITE_URL } from "@/lib/site";
import { getSeoPage, seoPages } from "@/lib/seo-pages";

type Params = Promise<{ seoSlug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return seoPages.map((page) => ({ seoSlug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = getSeoPage(seoSlug);
  if (!page) return {};
  const url = `${SITE_URL}/${page.slug}`;
  const ogImage = page.ogImage ?? SITE_OG_IMAGE_PATH;

  return {
    title: page.eyebrow,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_TITLE,
      title: page.eyebrow,
      description: page.description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.eyebrow,
      description: page.description,
      images: [ogImage],
    },
  };
}

export default async function SeoLandingPage({ params }: { params: Params }) {
  const { seoSlug } = await params;
  const page = getSeoPage(seoSlug);
  if (!page) notFound();
  const url = `${SITE_URL}/${page.slug}`;
  const itemList =
    page.kind === "hub"
      ? buildItemListJsonLd(
          page.eyebrow,
          page.related.map((item) => ({
            name: item.label,
            description: item.description,
            url: `${SITE_URL}${item.href}`,
          })),
        )
      : null;

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: page.eyebrow, url },
          ]),
          buildWebPageJsonLd({
            name: page.title,
            description: page.description,
            url,
          }),
          buildFaqPageJsonLd(page.faqs),
          buildSoftwareApplicationJsonLd(),
          ...(itemList ? [itemList] : []),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              {page.eyebrow}
            </p>
            <h1 className="font-display mt-5 max-w-4xl text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              {page.intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AppStoreButtons utmCampaign="seo_landing" utmContent={page.slug} />
              <a
                href="#guide"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-8 font-medium text-navy transition hover:border-orange hover:text-orange"
              >
                Read the guide
              </a>
            </div>
          </div>
        </section>

        <section id="guide" className="bg-surface px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            {page.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-border bg-white p-6"
              >
                <h2 className="font-display text-3xl font-bold text-navy">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {page.comparisonRows?.length ? (
          <section className="px-6 py-20">
            <div className="mx-auto max-w-6xl">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Comparison
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                  What changes the better choice
                </h2>
              </div>
              <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-surface text-left text-sm font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Feature</th>
                        <th className="px-5 py-4">Sundee Fundee</th>
                        <th className="px-5 py-4">Typical alternative</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm leading-7 text-muted">
                      {page.comparisonRows.map((row) => (
                        <tr key={row.feature} className="align-top">
                          <th className="px-5 py-4 text-left font-semibold text-navy">
                            {row.feature}
                          </th>
                          <td className="px-5 py-4">{row.sundeeFundee}</td>
                          <td className="px-5 py-4">{row.typicalAlternative}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {page.workflowSteps?.length ? (
          <section className="bg-surface px-6 py-20">
            <div className="mx-auto max-w-5xl">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Workflow
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                  How to use this kind of page before training
                </h2>
              </div>
              <ol className="mt-10 grid gap-5 md:grid-cols-3">
                {page.workflowSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="rounded-2xl border border-border bg-white p-6"
                  >
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                      Step {index + 1}
                    </p>
                    <h3 className="font-display mt-4 text-2xl font-semibold text-navy">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-muted">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        {page.proofBlocks?.length ? (
          <section className="px-6 py-20">
            <div className="mx-auto max-w-5xl">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Why this page is credible
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                  Signals that the guidance stays practical
                </h2>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {page.proofBlocks.map((block) => (
                  <article
                    key={block.title}
                    className="rounded-2xl border border-border bg-surface p-6"
                  >
                    <h3 className="font-display text-2xl font-semibold text-navy">
                      {block.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-muted">{block.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                FAQ
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                Common questions
              </h2>
            </div>
            <div className="mt-10 grid gap-4">
              {page.faqs.map((item) => (
                <details
                  key={item.question}
                  className="rounded-2xl border border-border bg-surface p-6"
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

        <section className="bg-navy px-6 py-20 text-cream">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
                Related resources
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
                Keep building the training decision.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {page.related.slice(0, 6).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-cream/10 bg-white/5 p-6 transition hover:border-gold/60"
                >
                  <h3 className="font-display text-2xl font-semibold">
                    {item.label}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-cream/80">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
            {page.relatedTools?.length ? (
              <div className="mt-10">
                <h3 className="font-display text-2xl font-semibold">
                  Related tools
                </h3>
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {page.relatedTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="rounded-2xl border border-cream/10 bg-white/5 p-6 transition hover:border-gold/60"
                    >
                      <h4 className="font-display text-2xl font-semibold">
                        {tool.label}
                      </h4>
                      <p className="mt-3 text-sm leading-7 text-cream/80">
                        {tool.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-12 max-w-3xl">
              <h2 className="font-display text-3xl font-bold">
                Try recovery-aware strength training on iPhone.
              </h2>
              <p className="mt-4 text-cream/80">
                Use readiness, training history, and practical constraints to
                shape the next workout.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <AppStoreButtons
                  utmCampaign="seo_landing"
                  utmContent={page.slug}
                  compact={false}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
