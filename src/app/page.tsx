import Link from "next/link";
import Image from "next/image";

const APP_STORE_LINKS = {
  sundeeFundee: "https://apps.apple.com/us/app/sundeefundee/id6759870888",
  ruckingClub: "https://apps.apple.com/us/app/sundee-fundee-rucking-club/id6760980683",
};

export default function Landing() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-cream/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/Logo.jpeg" alt="Sundee Fundee" width={40} height={40} className="rounded-full" />
            <span className="font-display text-xl font-semibold text-navy">Sundee Fundee</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/blog"
              className="text-sm font-medium text-navy hover:opacity-70"
            >
              Blog
            </Link>
            <a
              href={APP_STORE_LINKS.sundeeFundee}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
            >
              Download
            </a>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-24 pb-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Strength Training & Rucking
            </p>
            <h1 className="font-display mt-6 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
              Train smarter with recovery-aware programs.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Injury-adaptive plans, cycle tracking, and recovery-driven workouts. Available on iOS.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row justify-center">
              <a
                href={APP_STORE_LINKS.sundeeFundee}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-orange px-8 font-medium text-cream hover:opacity-90"
              >
                Download Sundee Fundee
              </a>
              <a
                href={APP_STORE_LINKS.ruckingClub}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-orange bg-transparent px-8 font-medium text-orange hover:bg-orange/5"
              >
                Download Rucking Club
              </a>
            </div>
          </div>
        </section>

        <section id="features" className="bg-navy px-6 py-24 text-cream">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
                What's Included
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
                Training built around your body
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-cream/80">
                Recovery, injuries, and cycle phase shape every session. Not one-size-fits-all.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Recovery-Driven Plans",
                  body: "Log readiness daily. Workouts adapt to how recovered you actually are.",
                },
                {
                  title: "Cycle Phase Tracking",
                  body: "Optional cycle tracking informs load and intensity. Train with your body, not against it.",
                },
                {
                  title: "Injury Adaptation",
                  body: "Log injuries and pain. Sessions adjust to keep you training safely around limitations.",
                },
                {
                  title: "Max & PR Tracking",
                  body: "Record lifts and benchmarks. See progress over time and catch plateaus early.",
                },
                {
                  title: "Strength & Rucking Programs",
                  body: "Pre-built programs or customize your own. Periodization and deload weeks included.",
                },
                {
                  title: "Benchmarks & Challenges",
                  body: "Track classic benchmarks, WODs, and personal goals. Celebrate every milestone.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-cream/10 bg-cream/5 p-6"
                >
                  <h3 className="font-display text-xl font-semibold text-cream">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream/80">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Why Choose Sundee Fundee
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                Built by athletes, for athletes
              </h2>
            </div>
            <div className="mt-16 grid gap-10 sm:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Train Around Injuries",
                  body: "Adapt without detraining. Keep making progress while respecting limitations.",
                },
                {
                  n: "02",
                  title: "Data-Driven Recovery",
                  body: "Recovery scores from HRV, sleep, and pain inform every training decision.",
                },
                {
                  n: "03",
                  title: "Periodized Programs",
                  body: "Structured strength and rucking plans that respect your body's capacity.",
                },
              ].map((s) => (
                <div key={s.n}>
                  <p className="font-display text-5xl font-bold text-orange">
                    {s.n}
                  </p>
                  <h3 className="font-display mt-4 text-xl font-semibold text-navy">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold text-navy sm:text-5xl">
              Download now on the App Store.
            </h2>
            <p className="mt-4 text-muted">
              Get recovery-aware training plans, injury adaptation, and progress tracking.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
              <a
                href={APP_STORE_LINKS.sundeeFundee}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-orange px-8 font-medium text-cream hover:opacity-90"
              >
                Sundee Fundee
              </a>
              <a
                href={APP_STORE_LINKS.ruckingClub}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-orange bg-transparent px-8 font-medium text-orange hover:bg-orange/5"
              >
                Rucking Club
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
          <p className="font-display text-base font-semibold text-navy">
            Sundee Fundee
          </p>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-navy">Blog</Link>
            <Link href="/privacy" className="hover:text-navy">Privacy</Link>
            <Link href="/terms" className="hover:text-navy">Terms</Link>
          </div>
          <p>© 2026 Sundee Fundee. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
