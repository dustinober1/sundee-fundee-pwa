import Link from "next/link";
import Image from "next/image";

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
            <Link
              href="/login"
              className="text-sm font-medium text-navy hover:opacity-70"
            >
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
        <section className="px-6 pt-24 pb-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Recovery-Aware Strength Training
            </p>
            <h1 className="font-display mt-6 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
              Train around what your body can handle today.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Log workouts, track maxes, and let your readiness drive the
              plan — without the guesswork.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-orange px-8 font-medium text-cream hover:opacity-90"
              >
                Get started
              </Link>
              <Link
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-navy px-8 font-medium text-navy hover:bg-surface"
              >
                See how it works
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="bg-navy px-6 py-24 text-cream">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
                Everything You Need
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
                Built around how your body works
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-cream/80">
                Recovery, injuries, and cycle phase shape every session — not a
                one-size-fits-all template.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Recovery-Driven Plans",
                  body: "Log readiness daily. Workouts adapt to how recovered you actually are, not what the calendar says.",
                },
                {
                  title: "Cycle Phase Tracking",
                  body: "Optional cycle tracking informs load and intensity so you train with your body, not against it.",
                },
                {
                  title: "Injury Adaptation",
                  body: "Log injuries and pain. Sessions adjust around limitations to keep you training safely.",
                },
                {
                  title: "Max & PR Tracking",
                  body: "Record every lift and benchmark. See progress over time and catch plateaus early.",
                },
                {
                  title: "Program Builder",
                  body: "Enroll in structured programs or build your own with periodization and deload weeks.",
                },
                {
                  title: "Challenges & Benchmarks",
                  body: "Track classic benchmarks, custom WODs, and personal challenges. See how far you've come.",
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
                Simple Process
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                Three steps to smarter training
              </h2>
            </div>
            <div className="mt-16 grid gap-10 sm:grid-cols-3">
              {[
                {
                  n: "01",
                  title: "Set your foundation",
                  body: "Enter lifts, 1RMs, and any injuries. Optionally enable cycle tracking.",
                },
                {
                  n: "02",
                  title: "Log & train",
                  body: "Run sessions from a program or roll your own. Pain and effort tracked along the way.",
                },
                {
                  n: "03",
                  title: "Track & grow",
                  body: "Watch maxes climb, hit benchmarks, and let recovery drive the next session.",
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
              Your strongest self starts here.
            </h2>
            <p className="mt-4 text-muted">
              Train smarter — with workouts that respect your body and your
              goals.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex h-12 items-center rounded-lg bg-orange px-8 font-medium text-cream hover:opacity-90"
            >
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
          <p className="font-display text-base font-semibold text-navy">
            Sundee Fundee
          </p>
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
