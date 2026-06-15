import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { sundeeApps } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy information for the Sundee Fundee website, donations, and Sundee iOS apps.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: false,
    follow: true,
  },
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
            <p className="mt-4 text-muted">Effective date: May 22, 2026</p>
            <p className="mt-6 text-lg text-muted">
              This policy explains how we handle information on the{" "}
              <strong className="text-navy">Sundee Fundee</strong> website,
              blog, support inbox, donation flow, outbound links, and the
              Sundee iOS apps linked from this site.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl space-y-12">
            <section>
              <h2 className="font-display text-2xl font-bold text-navy">
                1. Covered Apps
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                This policy covers this website and the following Sundee apps:
              </p>
              <ul className="mt-5 space-y-3 text-muted">
                {sundeeApps.map((app) => (
                  <li key={app.slug} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    <span>
                      <strong className="text-navy">{app.name}</strong>:{" "}
                      {app.privacySummary}
                    </span>
                  </li>
                ))}
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  <span>
                    <strong className="text-navy">EyeBreak 20</strong>: The app
                    does not collect personal data. Timer preferences stay on
                    your device, local notifications are scheduled on your
                    device, and optional tips are processed by Apple through
                    StoreKit.
                  </span>
                </li>
              </ul>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                2. Information We Receive
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
                Donations
              </h3>
              <p className="mt-2 leading-relaxed text-muted">
                If you make a donation, Stripe processes the payment. We may
                receive donation metadata such as amount, currency, payment
                status, checkout identifiers, and email address when available.
              </p>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">
                Sundee Fundee App Data
              </h3>
              <p className="mt-2 leading-relaxed text-muted">
                Sundee Fundee may use health and fitness data, training logs,
                recovery context, contact information, and account identifiers
                needed to provide app features such as training plans, progress
                tracking, account access, and sync.
              </p>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">
                Sundee Ruck Tracker App Data
              </h3>
              <p className="mt-2 leading-relaxed text-muted">
                Sundee Ruck Tracker may use health and fitness data, precise
                location, contact information, and account identifiers to track
                rucks, save workouts, support clubs and events, and provide app
                functionality.
              </p>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">
                Load That Bar, Sundee 3D Print Cost, and EyeBreak 20
              </h3>
              <p className="mt-2 leading-relaxed text-muted">
                Load That Bar, Sundee 3D Print Cost, and EyeBreak 20 do not
                collect personal data in the app. EyeBreak 20 stores timer
                preferences locally on the device and uses local notifications
                for break reminders. Apple may process App Store purchase,
                download, device, account, and refund information under
                Apple&apos;s own terms and privacy policies.
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
                3. How We Use Information
              </h2>
              <ul className="mt-4 space-y-2 text-muted">
                {[
                  "Operate the public website, blog, and linked product pages",
                  "Process donations and related payment records",
                  "Respond to support, legal, or account-deletion requests",
                  "Provide and maintain the Sundee Fundee and Sundee Ruck Tracker app features",
                  "Support paid App Store utility apps when users ask for help",
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
                4. What We Do Not Do
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
                5. Third-Party Services
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                This site uses third-party services including Stripe for
                donations, the Apple App Store, and, at times, affiliate
                retailers. Those services operate under their own terms and
                privacy policies.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                If you click an affiliate link, the destination site may use its
                own cookies or tracking. We encourage you to review the privacy
                practices of any external site you visit.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                6. Retention and Deletion
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                We retain information for as long as it is reasonably needed to
                operate the site, support the linked apps, process purchases or
                donations through third-party providers, resolve disputes, or meet
                legal obligations.
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
                7. Children&apos;s Privacy
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Our services are not directed to children under 13, and we do not
                knowingly collect personal information from children.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                8. App Terms and EULA
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Your use of the Sundee apps is also subject to our{" "}
                <Link href="/terms" className="text-orange hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/eula" className="text-orange hover:underline">
                  EULA
                </Link>
                .
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                9. Changes to This Policy
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                We may update this policy from time to time. When we do, we will
                update the effective date on this page.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                10. Contact
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
