import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Thank You – Sundee Fundee",
  description: "Thank you for supporting Sundee Fundee.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DonateSuccessPage() {
  return (
    <>
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-24">
          <div className="mx-auto max-w-lg text-center">
            <p className="text-5xl">🙏</p>
            <h1 className="font-display mt-6 text-4xl font-bold text-navy sm:text-5xl">
              Thank you
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              Your support means a lot. It keeps Sundee Fundee free and
              ad-free for every athlete who uses it. A receipt is on its way
              to your inbox.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex h-11 items-center rounded-lg bg-orange px-6 text-sm font-semibold text-cream hover:opacity-90"
              >
                Back to home
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm font-semibold text-navy hover:border-orange hover:text-orange"
              >
                See what&apos;s coming
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
