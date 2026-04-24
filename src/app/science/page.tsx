import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "The Science – Sundee Fundee",
  description:
    "How Sundee Fundee computes your readiness score, adapts programming to your cycle phase, and routes around injuries — the data architecture behind the recommendations.",
  alternates: {
    canonical: "/science",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SciencePage() {
  return (
    <>
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              The Science
            </p>
            <h1 className="font-display mt-4 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              How the recommendations are built
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Every suggestion Sundee Fundee makes is driven by a layered model
              that reads your body&apos;s current state, your biology, and your
              injury history before it prescribes a single set or rep. Here is
              how each layer works.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl space-y-0">

            <section className="border-t border-border pt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                The Readiness Score
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Before each session, the app computes a composite readiness score
                from four inputs pulled directly from Apple Health and your
                in-app logs:
              </p>
              <ul className="mt-4 space-y-3 text-muted">
                <li className="flex gap-3">
                  <span className="mt-1 shrink-0 text-orange">—</span>
                  <span>
                    <strong className="text-navy">HRV trend.</strong> A
                    single-night HRV reading is noisy. The model tracks a rolling
                    7-day HRV trend and flags meaningful drops from your personal
                    baseline rather than comparing you to a population average.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 shrink-0 text-orange">—</span>
                  <span>
                    <strong className="text-navy">Resting heart rate delta.</strong>{" "}
                    An elevated resting HR the morning after a hard session is one
                    of the clearest signals of incomplete cardiovascular recovery.
                    The model weights this against your own recent baseline, not a
                    fixed threshold.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 shrink-0 text-orange">—</span>
                  <span>
                    <strong className="text-navy">Sleep quality.</strong> Duration
                    alone is a weak predictor. The app uses Apple Health sleep
                    stages to weight deep and REM sleep more heavily than light
                    sleep, because hormonal and neuromuscular recovery are tied to
                    sleep architecture, not just total hours.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 shrink-0 text-orange">—</span>
                  <span>
                    <strong className="text-navy">Subjective feel.</strong> A
                    brief daily check-in captures soreness, motivation, and energy.
                    Self-report adds signal that wearables cannot measure — mood,
                    stress, and perceived readiness are meaningful predictors of
                    performance even when objective metrics look fine.
                  </span>
                </li>
              </ul>
              <p className="mt-4 leading-relaxed text-muted">
                The four inputs are weighted and combined into a single 1–100
                score. High-readiness days unlock heavier loading and optional
                PR attempts. Low-readiness days trigger automatic deloads or
                active recovery substitutions — not because the calendar says so,
                but because the data does.
              </p>
            </section>

            <section className="border-t border-border pt-10 mt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                Cycle-Phase Adaptation
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Female physiology changes substantially across the menstrual
                cycle. Ignoring those changes means leaving performance on the
                table in some phases and accumulating unnecessary fatigue in
                others. Sundee Fundee maps programming to four distinct phases:
              </p>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy">
                    Follicular phase (days 1–13)
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">
                    Rising estrogen improves neuromuscular recruitment and
                    blunts perceived exertion. This is the phase best suited for
                    intensity work — heavier loads, PR attempts, and higher
                    volume blocks. The app increases working weight targets and
                    flags this as a prime window for strength testing.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy">
                    Ovulatory phase (days 14–16)
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">
                    Peak estrogen and a short LH surge create the highest
                    strength potential of the cycle, but also the highest ligament
                    laxity — particularly in the ACL. The app maintains high
                    intensity while substituting or flagging exercises with known
                    elevated injury risk during this window.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy">
                    Luteal phase (days 17–28)
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">
                    Progesterone rises and core temperature increases slightly.
                    Fatigue accumulates faster and perceived effort goes up for
                    equivalent loads. Volume is reduced by 10–20%, rest periods
                    are extended, and hypertrophy-focused rep ranges take
                    priority over absolute load.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy">
                    Menstrual phase (days 1–5)
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted">
                    For athletes who experience significant symptoms, the app
                    reduces intensity further and prioritizes movement quality
                    over load. For athletes who feel strong early in menstruation,
                    the readiness score will reflect that and normal programming
                    applies — the system adapts to you, not a textbook average.
                  </p>
                </div>
              </div>
              <p className="mt-6 leading-relaxed text-muted">
                Cycle tracking is optional. Athletes who prefer not to use it
                train on the readiness-only model, which still outperforms a
                static calendar split.
              </p>
            </section>

            <section className="border-t border-border pt-10 mt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                Injury-Aware Programming
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                When you flag an injury or limitation in the app, the programming
                layer does not simply remove affected exercises and leave gaps in
                your training week. Instead, it applies a three-step substitution
                model:
              </p>
              <ul className="mt-4 space-y-3 text-muted">
                <li className="flex gap-3">
                  <span className="mt-1 shrink-0 text-orange">1.</span>
                  <span>
                    <strong className="text-navy">Identify the movement pattern.</strong>{" "}
                    The app maps each exercise to a primary movement pattern
                    (horizontal push, hip hinge, vertical pull, etc.) and the
                    primary muscles loaded. Flagging an injury tags both the
                    pattern and the joint or muscle group involved.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 shrink-0 text-orange">2.</span>
                  <span>
                    <strong className="text-navy">
                      Find the highest-fidelity substitute.
                    </strong>{" "}
                    The substitution library prioritizes exercises that preserve
                    the same movement pattern with reduced load on the injured
                    structure — for example, replacing barbell back squat with
                    split squat variations for a hip flexor issue, rather than
                    just removing all quad work entirely.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 shrink-0 text-orange">3.</span>
                  <span>
                    <strong className="text-navy">
                      Maintain systemic training stimulus.
                    </strong>{" "}
                    Volume and intensity for unaffected muscle groups are kept
                    intact or slightly increased to compensate for reduced
                    mechanical loading elsewhere. The goal is continued progress,
                    not a maintenance holding pattern while you heal.
                  </span>
                </li>
              </ul>
            </section>

            <section className="border-t border-border pt-10 mt-10">
              <h2 className="font-display text-2xl font-bold text-navy">
                Why recovery beats the calendar
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Most training programs are built around the week as the
                fundamental unit of programming. Monday is chest day because
                Monday is chest day. The problem is that your body does not
                recover on a seven-day schedule. Two hard sessions back to back
                can shift your recovery curve by 24–48 hours, and stacking
                another heavy day on top is how acute fatigue turns into
                overreaching.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                Readiness-gated programming treats your recovery state as the
                primary input and the calendar as secondary. A session will not be
                loaded at high intensity on a low-readiness day regardless of what
                day of the week it is. Over a training block, this produces more
                high-quality sessions, less junk volume, and fewer injuries — not
                because you trained more, but because you trained when your body
                was prepared to absorb it.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                For a deeper look at the research behind this approach, see the{" "}
                <Link
                  href="/blog/why-recovery-beats-the-calendar"
                  className="font-medium text-orange underline underline-offset-2 hover:opacity-70"
                >
                  full article on recovery-gated programming
                </Link>
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
