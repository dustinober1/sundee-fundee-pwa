import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { sundeeApps } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms covering the Sundee Fundee website, blog content, outbound links, and Sundee iOS apps.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsPage() {
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
              Terms of Use
            </h1>
            <p className="mt-4 text-muted">Effective date: May 22, 2026</p>
            <p className="mt-6 text-lg text-muted">
              These terms govern your use of the{" "}
              <strong className="text-navy">Sundee Fundee</strong> website, blog,
              Sundee iOS apps, and related content or support services.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl space-y-12">
            <section>
              <h2 className="font-display text-2xl font-bold text-navy">
                1. Acceptance
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                By accessing or using this site or the linked apps, you agree to
                these terms. If you do not agree, do not use the services.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                2. What We Provide
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Sundee Fundee provides public website content, training-related
                articles, outbound App Store links, branded iOS fitness apps,
                and small paid utility apps.
              </p>
              <ul className="mt-5 space-y-3 text-muted">
                {sundeeApps.map((app) => (
                  <li key={app.slug} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    <span>
                      <strong className="text-navy">{app.name}</strong>:{" "}
                      {app.description}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                3. Health Disclaimer
              </h2>
              <div className="mt-4 rounded-2xl border border-border bg-surface p-6">
                <p className="font-semibold text-navy">
                  Sundee Fundee is not medical advice and is not a medical device.
                </p>
                <p className="mt-2 leading-relaxed text-muted">
                  Training guidance, educational material, and app features are
                  provided for informational and fitness purposes only. You are
                  responsible for deciding whether any exercise, route, ruck,
                  program, or recommendation is appropriate for you. Stop if you
                  feel pain, dizziness, or unsafe symptoms, and consult a
                  qualified professional when needed.
                </p>
              </div>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                4. Acceptable Use
              </h2>
              <ul className="mt-4 space-y-2 text-muted">
                {[
                  "Do not misuse, attack, scrape, or interfere with the website or linked apps",
                  "Do not copy or republish protected content without permission",
                  "Do not use the services for unlawful or abusive purposes",
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
                5. Utility App Disclaimers
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-muted">
                <p>
                  Load That Bar provides plate-loading calculations for
                  convenience. You are responsible for checking the bar, collars,
                  plates, units, equipment condition, and gym safety before
                  lifting.
                </p>
                <p>
                  Sundee 3D Print Cost provides cost and quote estimates based on
                  the inputs you enter. It does not guarantee actual material
                  usage, print success, energy costs, labor costs, taxes, fees, or
                  profit.
                </p>
                <p>
                  EyeBreak 20 provides timer-based screen break reminders for
                  the 20-20-20 habit. It is not medical advice and does not
                  diagnose, prevent, treat, or cure eye strain, headaches, dry
                  eyes, or any other condition.
                </p>
                <p>
                  Pressure Wash Quote Maker provides job quote estimates based
                  on user-entered pricing, surface, fee, discount, labor, and
                  business assumptions. It does not guarantee final pricing,
                  cost, profit, tax, legal, chemical, safety, or surface
                  compatibility outcomes.
                </p>
              </div>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                6. Intellectual Property
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                The Sundee Fundee name, branding, site content, design, and
                related materials are owned by Sundee Fundee or its licensors and
                are protected by applicable intellectual property laws.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                7. External Services, Purchases, and Refunds
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                This site may link to the Apple App Store, affiliate retailers, or
                other third-party services. Any purchase, download, or use of those
                services is governed by the third party&apos;s own terms and policies.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Paid downloads and any in-app purchases are processed by Apple.
                Apple handles payment, tax, refund, Family Sharing, and account
                rules for App Store purchases. Refund requests should be made
                through Apple&apos;s purchase support flow.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                8. Privacy and EULA
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Your use of these services is also subject to our{" "}
                <Link href="/privacy" className="text-orange hover:underline">
                  Privacy Policy
                </Link>
                {" "}and{" "}
                <Link href="/eula" className="text-orange hover:underline">
                  EULA
                </Link>
                .
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                9. Limitation of Liability
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                To the fullest extent permitted by law, Sundee Fundee is not
                liable for indirect, incidental, special, consequential, or
                punitive damages arising from your use of the website, content, or
                linked apps.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                10. Disclaimer of Warranties
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                The services are provided &quot;as is&quot; and &quot;as available&quot; without
                warranties of any kind. We do not guarantee uninterrupted
                availability, error-free operation, or that the content will meet
                your specific needs.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                11. Changes
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                We may update these terms from time to time. Continued use after an
                update means you accept the revised terms.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                12. Contact
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Questions about these terms can be sent to{" "}
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
