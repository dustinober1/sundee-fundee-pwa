import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "EyeBreak 20 Support",
  description:
    "Support information for EyeBreak 20, a simple 20-20-20 screen break timer for iPhone.",
  alternates: {
    canonical: "/support/eyebreak20",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function EyeBreak20SupportPage() {
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
              EyeBreak 20 Support
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              EyeBreak 20 helps you run simple 20-20-20 screen break sessions
              with local reminders, Live Activities, and Dynamic Island support
              on compatible iPhones.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl space-y-12">
            <section>
              <h2 className="font-display text-2xl font-bold text-navy">
                Contact
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                For support, email{" "}
                <a
                  href="mailto:support@sundeefundee.com"
                  className="text-orange hover:underline"
                >
                  support@sundeefundee.com
                </a>
                .
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                Privacy
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                EyeBreak 20 does not collect personal data. Timer preferences
                stay on your device, local notifications are scheduled on your
                device, and optional tips are processed by Apple through
                StoreKit.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Read the full{" "}
                <Link href="/privacy" className="text-orange hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                Health Disclaimer
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                EyeBreak 20 is a habit timer, not medical advice. If eye
                discomfort, headaches, vision changes, dry eyes, or pain persist,
                contact an eye-care professional.
              </p>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
