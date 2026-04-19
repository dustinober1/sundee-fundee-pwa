import { AppStoreButtons } from "@/components/AppStoreButtons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Landing() {
  return (
    <>
      <SiteHeader showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-24 pb-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Strength Training &amp; Rucking
            </p>
            <h1 className="font-display mt-6 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
              Train smarter with recovery-aware programs.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Injury-adaptive plans, cycle tracking, and recovery-driven
              workouts. Available on iOS.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <AppStoreButtons />
            </div>
          </div>
        </section>

        <section id="features" className="bg-navy px-6 py-24 text-cream">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
                What&apos;s Included
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
                Training built around your body
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-cream/80">
                Recovery, injuries, and cycle phase shape every session. Not
                one-size-fits-all.
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
              Get recovery-aware training plans, injury adaptation, and progress
              tracking.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <AppStoreButtons compact={false} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
