import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About Us – Sundee Fundee",
  description: "About the team behind Sundee Fundee.",
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader showHomeLink />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-24">
          <div className="mx-auto flex max-w-3xl flex-col items-start">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              About Us
            </p>
            <h1 className="font-display mt-4 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              Coming Soon
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              We&apos;re putting this page together. Check back soon for more
              information about the people and story behind Sundee Fundee.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
