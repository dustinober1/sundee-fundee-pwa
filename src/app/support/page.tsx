import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const supportEmail = "support@sundeefundee.com";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Support information for Pressure Wash Quote Maker and other Sundee Fundee apps.",
  alternates: {
    canonical: "/support",
  },
  robots: {
    index: false,
    follow: true,
  },
};

const quoteTasks = [
  "Create a quote from square footage, surface type, difficulty, chemicals, travel, fees, discounts, and labor assumptions.",
  "Save quote drafts locally and update quote status as jobs move from draft to sent, accepted, or declined.",
  "Edit default pricing, minimum job fee, rounding, terms, business details, and surface-rate presets in Settings.",
  "Copy, share, or export customer-ready quote files as text, HTML, or PDF.",
];

const troubleshootingItems = [
  {
    title: "A quote total looks wrong",
    body: "Review the square footage, rate per square foot, difficulty setting, chemical cost, travel fee, added fees, discount, minimum job fee, and rounding increment.",
  },
  {
    title: "A saved quote is missing",
    body: "Saved quotes are stored locally on the device. If the app was deleted, the local app data may also have been deleted.",
  },
  {
    title: "Exported files need edits",
    body: "The app creates customer-ready export files from your saved business details and quote inputs. Update business info, terms, and quote inputs before exporting again.",
  },
];

export default function SupportPage() {
  return (
    <>
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Support
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
              Pressure Wash Quote Maker Support
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              Pressure Wash Quote Maker helps pressure washing contractors create
              fast, consistent job quotes from editable pricing assumptions and
              export customer-ready estimates.
            </p>
            <p className="mt-6 rounded-2xl border border-border bg-surface p-5 leading-relaxed text-muted">
              Need help? Email{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="font-semibold text-orange hover:underline"
              >
                {supportEmail}
              </a>{" "}
              with the app name, what you were trying to do, and any error or
              unexpected result you saw.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl space-y-12">
            <section>
              <h2 className="font-display text-2xl font-bold text-navy">
                Common Tasks
              </h2>
              <ul className="mt-5 space-y-3 text-muted">
                {quoteTasks.map((task) => (
                  <li key={task} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    <span className="leading-relaxed">{task}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                Data Storage
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Quotes, customer details you enter, pricing settings, presets,
                business details, and terms are stored locally by the app. The
                app does not require an account.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                You can remove saved quotes inside the app where supported.
                Deleting the app may also remove local app data from the device.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                Troubleshooting
              </h2>
              <div className="mt-5 space-y-6">
                {troubleshootingItems.map((item) => (
                  <article key={item.title}>
                    <h3 className="font-display text-lg font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted">
                      {item.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                Privacy
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Read the{" "}
                <Link href="/privacy" className="text-orange hover:underline">
                  Privacy Policy
                </Link>{" "}
                for details about local data storage, support email handling,
                purchases, and third-party services.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                Other Sundee Fundee Apps
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                For questions about any Sundee Fundee app, email{" "}
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-orange hover:underline"
                >
                  {supportEmail}
                </a>
                . EyeBreak 20 also has a dedicated{" "}
                <Link
                  href="/support/eyebreak20"
                  className="text-orange hover:underline"
                >
                  support page
                </Link>
                .
              </p>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
