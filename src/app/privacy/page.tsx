import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy – Sundee Fundee",
  description:
    "Privacy information for the Sundee Fundee website, blog, affiliate links, and linked iOS apps.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Legal
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted">Effective date: April 19, 2026</p>
            <p className="mt-6 text-lg text-muted">
              This policy explains how we handle information on the{" "}
              <strong className="text-navy">Sundee Fundee</strong> website, blog,
              support inbox, affiliate links, and the iOS apps linked from this
              site.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl space-y-12">
            <section>
              <h2 className="font-display text-2xl font-bold text-navy">
                1. Information We Receive
              </h2>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">
                Support Requests
              </h3>
              <p className="mt-2 leading-relaxed text-muted">
                If you email us, we receive the information you include in that
                message, such as your email address and any details you send for
                support or account help.
              </p>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">
                Mobile App Data
              </h3>
              <p className="mt-2 leading-relaxed text-muted">
                If you use the Sundee Fundee iOS apps, we may process account,
                training, recovery, or similar in-app data needed to provide those
                app features.
              </p>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">
                External Link Activity
              </h3>
              <p className="mt-2 leading-relaxed text-muted">
                When you follow App Store links or affiliate links from this site,
                the destination platform may collect its own data. We may receive
                aggregated referral or commission reporting, but not a detailed
                profile of your browsing on those third-party sites.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                2. How We Use Information
              </h2>
              <ul className="mt-4 space-y-2 text-muted">
                {[
                  "Operate the public website, blog, and linked product pages",
                  "Respond to support, legal, or account-deletion requests",
                  "Provide and maintain the linked iOS app features",
                  "Review aggregate referral or affiliate performance",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                3. What We Do Not Do
              </h2>
              <ul className="mt-4 space-y-2 text-muted">
                {[
                  "We do not sell personal information",
                  "We do not run third-party display ads on this site",
                  "We do not share personal data with third parties except where needed to run the site, linked apps, or comply with law",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                4. Third-Party Services
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                This site links to third-party services including the Apple App
                Store and, at times, affiliate retailers. Those services operate
                under their own terms and privacy policies.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                If you click an affiliate link, the destination site may use its
                own cookies or tracking. We encourage you to review the privacy
                practices of any external site you visit.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                5. Retention and Deletion
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                We retain information for as long as it is reasonably needed to
                operate the site, support the linked apps, resolve disputes, or
                meet legal obligations.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                For deletion or privacy requests, contact{" "}
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
                6. Children&apos;s Privacy
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Our services are not directed to children under 17, and we do not
                knowingly collect personal information from children.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                7. Changes to This Policy
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                We may update this policy from time to time. When we do, we will
                update the effective date on this page.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                8. Contact
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Questions about this policy can be sent to{" "}
                <a
                  href="mailto:support@sundeefundee.com"
                  className="text-orange hover:underline"
                >
                  support@sundeefundee.com
                </a>
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
