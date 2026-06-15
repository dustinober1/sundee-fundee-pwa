import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { sundeeApps } from "@/lib/apps";

const appleStandardEulaUrl =
  "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

export const metadata: Metadata = {
  title: "End User License Agreement",
  description:
    "End User License Agreement information for Sundee Fundee and related Sundee iOS apps.",
  alternates: {
    canonical: "/eula",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function EulaPage() {
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
              End User License Agreement
            </h1>
            <p className="mt-4 text-muted">Effective date: May 22, 2026</p>
            <p className="mt-6 text-lg text-muted">
              This EULA explains the license terms for Sundee apps and any paid
              downloads or in-app purchases offered through the Apple App Store.
              It is written for public reference and does not configure a custom
              App Store Connect license agreement.
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
                This EULA covers the following apps and any related paid features
                or in-app purchases made available by Sundee Fundee:
              </p>
              <ul className="mt-5 space-y-3 text-muted">
                {sundeeApps.map((app) => (
                  <li key={app.slug} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    <span>
                      <strong className="text-navy">{app.name}</strong>:{" "}
                      {app.tagline}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                2. Apple Standard EULA
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Apps made available through the Apple App Store are licensed,
                not sold. Unless a custom EULA is separately provided through
                App Store Connect, your license is governed by Apple&apos;s{" "}
                <a
                  href={appleStandardEulaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange hover:underline"
                >
                  Standard Licensed Application End User License Agreement
                </a>
                .
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                3. License Scope
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Subject to your compliance with these terms and Apple&apos;s App
                Store rules, you receive a limited, non-transferable license to
                install and use the covered apps on Apple-branded devices you own
                or control. You may not resell, sublicense, redistribute, copy,
                reverse engineer, disassemble, modify, or create derivative works
                from the apps except where applicable law expressly permits it.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                4. Paid Downloads and In-App Purchases
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Paid downloads and in-app purchases are processed by Apple. Apple
                controls payment collection, taxes, Family Sharing eligibility,
                receipts, subscriptions if any are later offered, and refund
                handling. A purchase gives you a license to use the app or paid
                feature; it does not transfer ownership of the software or
                related intellectual property.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Refund requests, purchase issues, and Apple ID billing questions
                should be handled through Apple&apos;s support and purchase history
                tools.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                5. No Professional Advice
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Sundee Fundee and Sundee Ruck Tracker provide fitness and
                training information only. They are not medical devices and do
                not provide medical advice. EyeBreak 20 is a timer-based screen
                break reminder and is not medical advice. Load That Bar and
                Sundee 3D Print Cost are utility calculators; their outputs
                depend on the inputs you enter and are not guarantees of safe
                lifting setup, print success, cost, profit, or tax treatment.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                6. Privacy
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                App and website privacy practices are described in our{" "}
                <Link href="/privacy" className="text-orange hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                7. Disclaimers and Liability
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                The apps are provided as is and as available, without warranties
                of any kind to the fullest extent allowed by law. To the fullest
                extent permitted by law, Sundee Fundee is not liable for
                indirect, incidental, special, consequential, or punitive damages
                arising from use of the covered apps.
              </p>
            </section>

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                8. Support and Legal Review
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Support questions can be sent to{" "}
                <a
                  href="mailto:support@sundeefundee.com"
                  className="text-orange hover:underline"
                >
                  support@sundeefundee.com
                </a>
                . This page is operational draft text for public reference and
                should be reviewed by qualified legal counsel before relying on it
                as legal advice.
              </p>
            </section>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
