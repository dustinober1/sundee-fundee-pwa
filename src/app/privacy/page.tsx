import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "Privacy Policy – Sundee Fundee" };

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted">Effective date: April 18, 2026</p>
            <p className="mt-6 text-lg text-muted">
              This privacy policy covers <strong className="text-navy">Sundee Fundee</strong>, a
              cycle-aware strength training application. Your privacy matters to us. This policy
              explains what data our app collects, how we use it, and your rights.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl space-y-12">

            <div>
              <h2 className="font-display text-2xl font-bold text-navy">1. Data We Collect</h2>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">Account Information</h3>
              <p className="mt-2 text-muted leading-relaxed">
                When you sign in with Google or Apple, we receive your provider-supplied user
                identifier and display name. We do not receive or store your email address unless
                you choose to share it.
              </p>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">Health &amp; Fitness Data</h3>
              <p className="mt-2 text-muted leading-relaxed">
                Sundee Fundee stores workout logs, one-rep maxes, cycle tracking data, and injury
                profiles in your account. This data is not shared with any external service.
              </p>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">Cloud Data</h3>
              <p className="mt-2 text-muted leading-relaxed">
                If you are signed in, your data syncs to the cloud:
              </p>
              <ul className="mt-3 space-y-2 text-muted">
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  Workout logs, one-rep maxes, benchmark scores, injury records, and program
                  enrollment — private and accessible only to you.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  Program content and workout templates — public, containing no personal
                  information.
                </li>
              </ul>

              <h3 className="mt-6 font-display text-lg font-semibold text-navy">AI-Generated Content</h3>
              <p className="mt-2 text-muted leading-relaxed">
                When you use AI workout generation, your fitness data (1RM values, injury profiles,
                energy level, cycle phase) is sent to our AI service to generate personalized
                workouts. This data is used only for workout generation and is not stored beyond
                the request.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">2. How We Use Your Data</h2>
              <ul className="mt-4 space-y-2 text-muted">
                {[
                  "Track your workouts, progress, and personal records",
                  "Provide cycle-phase-aware training recommendations",
                  "Modify exercises based on injury status",
                  "Generate personalized AI workouts",
                  "Sync your data across your devices",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">3. Data We Do NOT Collect</h2>
              <ul className="mt-4 space-y-2 text-muted">
                {[
                  "We do not collect analytics or usage tracking data",
                  "We do not run advertising SDKs or display third-party ads",
                  "We do not sell, rent, or share your personal data with third parties",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">4. Affiliate Links &amp; Third-Party Services</h2>
              <p className="mt-4 text-muted leading-relaxed">
                Some pages on Sundee Fundee — particularly blog posts and gear recommendations —
                may contain affiliate links to products on Amazon and other retailers. Sundee
                Fundee is a participant in the Amazon Services LLC Associates Program and similar
                affiliate programs. When you click an affiliate link and make a purchase, we may
                earn a commission at no additional cost to you.
              </p>
              <p className="mt-4 text-muted leading-relaxed">
                How this affects your privacy:
              </p>
              <ul className="mt-3 space-y-2 text-muted">
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  We do not receive any personally identifiable information about you from these
                  programs — only aggregated, anonymous commission reports.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  <span>
                    When you click an affiliate link, the destination site (e.g., Amazon) may set
                    its own cookies and collect data according to <em>their</em> privacy policy,
                    not ours. We encourage you to review the privacy practices of any site you
                    visit.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  Product recommendations are editorial — we only link to gear, books, and tools
                  we believe fit our recovery-aware training philosophy. Commission does not
                  influence whether a product is recommended.
                </li>
              </ul>
              <p className="mt-4 text-muted leading-relaxed">
                Affiliate links are disclosed where they appear, in line with the U.S. Federal
                Trade Commission&apos;s endorsement guidelines.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">5. Data Storage &amp; Security</h2>
              <p className="mt-4 text-muted leading-relaxed">
                All personal data is stored in our secure cloud database. Data is encrypted in
                transit via HTTPS. We do not share personal data with third parties.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">6. Data Retention &amp; Deletion</h2>
              <p className="mt-4 text-muted leading-relaxed">
                Your data remains in your account for as long as you use the app. To delete your
                data:
              </p>
              <ul className="mt-3 space-y-2 text-muted">
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  Open the app → Settings → <strong className="text-navy">Delete Account</strong>.
                  This permanently removes your profile, workout history, injury records, maxes,
                  benchmark scores, and all other personal data.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                  Contact us at{" "}
                  <a href="mailto:support@sundeefundee.com" className="text-orange hover:underline">
                    support@sundeefundee.com
                  </a>{" "}
                  for assistance with data deletion.
                </li>
              </ul>
              <p className="mt-4 text-muted leading-relaxed">
                Account deletion is processed immediately. Once deleted, your data cannot be
                recovered.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">7. Children&apos;s Privacy</h2>
              <p className="mt-4 text-muted leading-relaxed">
                Our app is not directed at children under 17. We do not knowingly collect personal
                information from children.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">8. Changes to This Policy</h2>
              <p className="mt-4 text-muted leading-relaxed">
                We may update this policy from time to time. We will notify you of significant
                changes through the app or by updating the effective date below.
              </p>
            </div>

            <div className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">9. Contact Us</h2>
              <p className="mt-4 text-muted leading-relaxed">
                If you have questions about this privacy policy or your data, contact us at{" "}
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
