import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Terms of Use – Sundee Fundee" };

export default function TermsPage() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/Logo.jpeg" alt="Sundee Fundee" width={40} height={40} className="rounded-full" />
            <span className="font-display text-xl font-semibold text-navy">Sundee Fundee</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/blog" className="text-sm font-medium text-navy hover:opacity-70">
              Blog
            </Link>
            <Link href="/login" className="text-sm font-medium text-navy hover:opacity-70">
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Legal
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
              Terms of Use
            </h1>
            <p className="mt-4 text-muted">Effective date: March 23, 2026</p>
            <p className="mt-6 text-lg text-muted">
              These Terms of Use ("Terms") govern your use of{" "}
              <strong className="text-navy">Sundee Fundee</strong>, a cycle-aware strength
              training application (the "App"). By using the App, you agree to these Terms.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl space-y-12">

            <div>
              <h2 className="font-display text-2xl font-bold text-navy">1. Acceptance of Terms</h2>
              <p className="mt-4 text-muted leading-relaxed">
                By accessing or using the App, you confirm that you are at least 17 years old and
                agree to be bound by these Terms. If you do not agree, do not use the App.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">2. Description of Services</h2>
              <p className="mt-4 text-muted leading-relaxed">
                Sundee Fundee is a strength training app that provides cycle-aware workout
                recommendations, AI-generated workouts, structured programs, injury management,
                and progress tracking.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">3. Account &amp; Sign In</h2>
              <p className="mt-4 text-muted leading-relaxed">
                The App uses Google and Apple sign-in for authentication. You are responsible for
                maintaining the security of your account. You may use some features without signing
                in, but certain features (cloud sync, AI workouts, subscriptions) require
                authentication.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">4. Health &amp; Fitness Disclaimer</h2>
              <div className="mt-4 rounded-2xl border border-border bg-surface p-6">
                <p className="font-semibold text-navy">
                  The App is not a medical device and does not provide medical advice.
                </p>
                <p className="mt-2 text-muted leading-relaxed">
                  The workout recommendations, training suggestions, and fitness data provided by
                  the App are for informational and fitness tracking purposes only. Always consult
                  a qualified healthcare professional before starting any exercise program. You use
                  the App and follow any training recommendations at your own risk.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">5. User Conduct</h2>
              <p className="mt-4 text-muted">You agree to:</p>
              <ul className="mt-3 space-y-2 text-muted">
                {[
                  "Provide accurate information in your profile",
                  "Not submit fraudulent workout data",
                  "Not attempt to reverse-engineer or exploit the App",
                  "Not use the App for any unlawful purpose",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-muted leading-relaxed">
                We reserve the right to restrict access for users who violate these guidelines.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">6. Subscriptions &amp; Purchases</h2>
              <p className="mt-4 text-muted leading-relaxed">
                The App offers optional subscriptions that unlock premium features. All purchases
                are processed through Stripe and are subject to Stripe&apos;s terms and conditions.
              </p>
              <ul className="mt-3 space-y-2 text-muted">
                {[
                  "Subscriptions automatically renew unless cancelled before the end of the current period",
                  "You can manage or cancel subscriptions from the Settings page in the App",
                  "Refunds are handled according to our refund policy",
                  "Free features remain available without a subscription",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">7. Intellectual Property</h2>
              <p className="mt-4 text-muted leading-relaxed">
                All content, designs, code, and branding in the App are owned by Sundee Fundee
                and are protected by copyright and intellectual property laws. You may not copy,
                modify, distribute, or reverse-engineer any part of the App.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">8. Data &amp; Privacy</h2>
              <p className="mt-4 text-muted leading-relaxed">
                Your use of the App is also governed by our{" "}
                <Link href="/privacy" className="text-orange hover:underline">
                  Privacy Policy
                </Link>
                , which describes how we collect, use, and protect your data.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">9. Third-Party Services</h2>
              <p className="mt-4 text-muted leading-relaxed">
                The App integrates with third-party services including Google and Apple for
                authentication, Stripe for payments, and Cloudflare for hosting and AI services.
                Your use of these services is subject to their respective terms and conditions.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">10. Limitation of Liability</h2>
              <p className="mt-4 text-muted leading-relaxed">
                To the maximum extent permitted by law, Sundee Fundee shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages arising from your
                use of the App. This includes, but is not limited to:
              </p>
              <ul className="mt-3 space-y-2 text-muted">
                {[
                  "Injuries sustained during workouts",
                  "Loss of data due to service issues",
                  "Inaccurate workout calculations",
                  "Service interruptions or unavailability",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">11. Disclaimer of Warranties</h2>
              <p className="mt-4 text-muted leading-relaxed">
                The App is provided "as is" and "as available" without warranties of any kind,
                either express or implied. We do not guarantee that the App will be error-free,
                uninterrupted, or that workout calculations will be completely accurate.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">12. Termination</h2>
              <p className="mt-4 text-muted leading-relaxed">
                We may suspend or terminate your access to the App at any time for violation of
                these Terms. You may stop using the App at any time by deleting your account.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">13. Changes to These Terms</h2>
              <p className="mt-4 text-muted leading-relaxed">
                We may update these Terms from time to time. Continued use of the App after changes
                are posted constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">14. Governing Law</h2>
              <p className="mt-4 text-muted leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of the United
                States. Any disputes arising from these Terms shall be resolved in the applicable
                courts.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">15. Contact Us</h2>
              <p className="mt-4 text-muted leading-relaxed">
                If you have questions about these Terms, contact us at{" "}
                <a href="mailto:support@sundeefundee.com" className="text-orange hover:underline">
                  support@sundeefundee.com
                </a>
                .
              </p>
            </div>

          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
          <p className="font-display text-base font-semibold text-navy">Sundee Fundee</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-navy">Privacy</Link>
            <Link href="/terms" className="hover:text-navy">Terms</Link>
          </div>
          <p>© 2026 Sundee Fundee. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
