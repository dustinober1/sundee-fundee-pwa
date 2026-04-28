import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Donation Canceled",
  description: "Your Sundee Fundee donation was canceled.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DonateCancelPage() {
  return (
    <>
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-24">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange">
              Donation canceled
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
              No charge was made.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              Sundee Fundee stays free either way. Donations are separate from
              workout, cycle, and recovery data.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/donate"
                className="inline-flex h-11 items-center rounded-lg bg-orange px-6 text-sm font-semibold text-cream hover:opacity-90"
              >
                Return to donate
              </Link>
              <Link
                href="/app"
                className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm font-semibold text-navy hover:border-orange hover:text-orange"
              >
                Open app
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
