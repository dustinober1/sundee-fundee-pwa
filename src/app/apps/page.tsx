import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { buildAppStoreUrl } from "@/lib/app-store-links";
import { primaryApp, sideApps, sundeeApps } from "@/lib/apps";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apps",
  description:
    "Sundee Fundee is the primary recovery-aware strength app, with a small set of side apps for rucking, barbell plate math, and 3D print pricing.",
  alternates: {
    canonical: "/apps",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function appStoreHref(appSlug: (typeof sundeeApps)[number]["slug"], content: string) {
  return buildAppStoreUrl({
    appSlug,
    campaign: "apps",
    content,
  });
}

export default function AppsPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageJsonLd({
            name: "Sundee Apps",
            description: metadata.description as string,
            url: `${SITE_URL}/apps`,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Apps", url: `${SITE_URL}/apps` },
          ]),
          buildItemListJsonLd(
            "Sundee Apps",
            sundeeApps.map((app) => ({
              name: app.name,
              url: app.appStoreUrl,
              description: app.description,
            })),
          ),
        ]}
      />
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-14">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Sundee Apps
            </p>
            <h1 className="font-display mt-4 max-w-3xl text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              Sundee Fundee first, with a few focused side apps.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              The main product is Sundee Fundee, a recovery-aware strength
              training app. The other apps are smaller tools built for specific
              jobs: ruck tracking, barbell plate math, and 3D print pricing.
            </p>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
                    Primary App
                  </p>
                  <h2 className="font-display mt-3 text-3xl font-bold text-navy sm:text-4xl">
                    {primaryApp.name}
                  </h2>
                  <p className="mt-2 text-base font-medium text-navy/75">
                    {primaryApp.tagline}
                  </p>
                  <p className="mt-4 leading-7 text-muted">
                    {primaryApp.description}
                  </p>
                </div>
                <a
                  href={appStoreHref(primaryApp.slug, "primary_card")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-orange px-5 py-2 text-sm font-medium text-cream transition hover:opacity-90"
                >
                  Get on App Store
                </a>
              </div>

              <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                {[
                  ["Category", primaryApp.category],
                  ["Price", primaryApp.priceLabel],
                  ["Privacy", primaryApp.privacySummary],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy/60">
                      {label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                  Side Apps
                </p>
                <h2 className="font-display mt-4 text-3xl font-bold text-navy sm:text-4xl">
                  Smaller tools for specific jobs.
                </h2>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {sideApps.map((app) => (
                  <article
                    key={app.slug}
                    className="flex flex-col rounded-2xl border border-border bg-surface p-5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
                      {app.priceLabel}
                    </p>
                    <h3 className="font-display mt-3 text-2xl font-semibold text-navy">
                      {app.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-navy/70">
                      {app.tagline}
                    </p>
                    <p className="mt-4 flex-1 text-sm leading-7 text-muted">
                      {app.description}
                    </p>
                    <div className="mt-5 space-y-2 border-t border-border pt-4 text-xs leading-5 text-muted">
                      <p>
                        <span className="font-semibold text-navy">Category:</span>{" "}
                        {app.category}
                      </p>
                      <p>
                        <span className="font-semibold text-navy">Privacy:</span>{" "}
                        {app.privacySummary}
                      </p>
                    </div>
                    <a
                      href={appStoreHref(app.slug, `${app.slug}_card`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy transition hover:border-orange hover:text-orange"
                    >
                      Open in App Store
                    </a>
                  </article>
                ))}
              </div>
            </div>

            <p className="mt-10 text-sm leading-6 text-muted">
              For privacy, terms, and license details covering these apps, see{" "}
              <Link href="/privacy" className="text-orange hover:underline">
                Privacy
              </Link>
              ,{" "}
              <Link href="/terms" className="text-orange hover:underline">
                Terms
              </Link>
              , and{" "}
              <Link href="/eula" className="text-orange hover:underline">
                EULA
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
