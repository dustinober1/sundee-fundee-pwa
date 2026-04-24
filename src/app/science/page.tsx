import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { APP_STORE_URL } from "@/lib/site";

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

function CyclePhaseWave() {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Recommended Training Intensity by Cycle Phase
      </p>
      <svg
        viewBox="0 0 600 180"
        className="w-full"
        aria-label="Wave chart showing training intensity across cycle phases: high during follicular, peak at ovulatory, moderate during luteal, low during menstrual"
        role="img"
      >
        {/* Grid lines */}
        <line x1="60" y1="30" x2="580" y2="30" stroke="currentColor" className="text-border" strokeDasharray="4 4" />
        <line x1="60" y1="70" x2="580" y2="70" stroke="currentColor" className="text-border" strokeDasharray="4 4" />
        <line x1="60" y1="110" x2="580" y2="110" stroke="currentColor" className="text-border" strokeDasharray="4 4" />

        {/* Y-axis labels */}
        <text x="55" y="34" textAnchor="end" className="fill-muted text-[10px]">High</text>
        <text x="55" y="74" textAnchor="end" className="fill-muted text-[10px]">Med</text>
        <text x="55" y="114" textAnchor="end" className="fill-muted text-[10px]">Low</text>

        {/* Phase backgrounds */}
        <rect x="60" y="20" width="130" height="110" rx="4" className="fill-orange/5" />
        <rect x="190" y="20" width="80" height="110" rx="4" className="fill-gold/10" />
        <rect x="270" y="20" width="200" height="110" rx="4" className="fill-navy/5" />
        <rect x="470" y="20" width="110" height="110" rx="4" className="fill-orange/10" />

        {/* Intensity wave */}
        <path
          d="M 60,90 C 90,80 110,50 125,40 C 140,30 160,28 190,25 C 210,22 220,20 230,22 C 240,25 250,35 270,50 C 300,75 340,90 380,95 C 420,100 450,105 470,108 C 490,100 510,85 540,75 C 560,68 575,72 580,80"
          fill="none"
          stroke="#F27319"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Phase labels */}
        <text x="125" y="150" textAnchor="middle" className="fill-navy font-medium text-[11px]">Follicular</text>
        <text x="125" y="163" textAnchor="middle" className="fill-muted text-[9px]">Days 1–13</text>
        <text x="230" y="150" textAnchor="middle" className="fill-navy font-medium text-[11px]">Ovulatory</text>
        <text x="230" y="163" textAnchor="middle" className="fill-muted text-[9px]">Days 14–16</text>
        <text x="370" y="150" textAnchor="middle" className="fill-navy font-medium text-[11px]">Luteal</text>
        <text x="370" y="163" textAnchor="middle" className="fill-muted text-[9px]">Days 17–28</text>
        <text x="525" y="150" textAnchor="middle" className="fill-navy font-medium text-[11px]">Menstrual</text>
        <text x="525" y="163" textAnchor="middle" className="fill-muted text-[9px]">Days 1–5</text>

        {/* Phase dividers */}
        <line x1="190" y1="20" x2="190" y2="135" stroke="currentColor" className="text-border" strokeDasharray="3 3" />
        <line x1="270" y1="20" x2="270" y2="135" stroke="currentColor" className="text-border" strokeDasharray="3 3" />
        <line x1="470" y1="20" x2="470" y2="135" stroke="currentColor" className="text-border" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}

function CyclePhaseAccordion({
  title,
  days,
  children,
}: {
  title: string;
  days: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-t border-border py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div>
          <span className="font-display font-semibold text-navy">{title}</span>
          <span className="ml-2 text-sm text-muted">({days})</span>
        </div>
        <span className="shrink-0 text-orange transition-transform group-open:rotate-90">
          ▶
        </span>
      </summary>
      <p className="mt-3 leading-relaxed text-muted">{children}</p>
    </details>
  );
}

function ReadinessIcon({ type }: { type: "hrv" | "heart" | "sleep" | "feel" }) {
  const paths: Record<string, React.ReactNode> = {
    hrv: (
      /* Heart-rate/HRV wave */
      <path
        d="M3 12h4l3-8 4 16 3-8h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    heart: (
      /* Heart icon for resting HR */
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    sleep: (
      /* Moon/bed icon for sleep */
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    feel: (
      /* Brain/sparkle icon for subjective feel */
      <>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-orange" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

function TrainingBlockComparison() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Before — Static Program
        </p>
        <div className="mt-4 space-y-3">
          {[
            { day: "Mon", exercise: "Barbell Back Squat", sets: "5×5 @ 80%", flag: true },
            { day: "Wed", exercise: "Deadlift", sets: "4×3 @ 85%", flag: false },
            { day: "Fri", exercise: "Barbell Back Squat", sets: "5×5 @ 82%", flag: true },
          ].map((row) => (
            <div key={row.day} className="flex items-center gap-3 text-sm">
              <span className="w-10 shrink-0 font-medium text-navy">{row.day}</span>
              <span className={`flex-1 ${row.flag ? "text-red-500 line-through" : "text-muted"}`}>
                {row.exercise}
              </span>
              <span className={`text-xs ${row.flag ? "text-red-500" : "text-muted"}`}>{row.sets}</span>
            </div>
          ))}
          <p className="mt-2 text-xs text-red-500/80">
            Hip flexor flagged — but program runs unchanged
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-orange/30 bg-orange/5 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange">
          After — Sundee Fundee Adapts
        </p>
        <div className="mt-4 space-y-3">
          {[
            { day: "Mon", exercise: "Split Squat (DB)", sets: "4×8 @ RPE 7", adapted: true },
            { day: "Wed", exercise: "Deadlift", sets: "4×3 @ 85%", adapted: false },
            { day: "Fri", exercise: "Leg Press + Step-ups", sets: "3×10 / 3×8", adapted: true },
          ].map((row) => (
            <div key={row.day} className="flex items-center gap-3 text-sm">
              <span className="w-10 shrink-0 font-medium text-navy">{row.day}</span>
              <span className={`flex-1 ${row.adapted ? "font-medium text-navy" : "text-muted"}`}>
                {row.exercise}
              </span>
              <span className="text-xs text-muted">{row.sets}</span>
            </div>
          ))}
          <p className="mt-2 text-xs text-orange">
            Hip flexor flagged — squat pattern preserved, load redistributed
          </p>
        </div>
      </div>
    </div>
  );
}

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

            {/* ── Readiness Score ── */}
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
                  <ReadinessIcon type="hrv" />
                  <span>
                    <strong className="text-navy">HRV trend.</strong> A
                    single-night HRV reading is noisy. The model tracks a rolling
                    7-day HRV trend and flags meaningful drops from your personal
                    baseline rather than comparing you to a population average.
                  </span>
                </li>
                <li className="flex gap-3">
                  <ReadinessIcon type="heart" />
                  <span>
                    <strong className="text-navy">Resting heart rate delta.</strong>{" "}
                    An elevated resting HR the morning after a hard session is one
                    of the clearest signals of incomplete cardiovascular recovery.
                    The model weights this against your own recent baseline, not a
                    fixed threshold.
                  </span>
                </li>
                <li className="flex gap-3">
                  <ReadinessIcon type="sleep" />
                  <span>
                    <strong className="text-navy">Sleep quality.</strong> Duration
                    alone is a weak predictor. The app uses Apple Health sleep
                    stages to weight deep and REM sleep more heavily than light
                    sleep, because hormonal and neuromuscular recovery are tied to
                    sleep architecture, not just total hours.
                  </span>
                </li>
                <li className="flex gap-3">
                  <ReadinessIcon type="feel" />
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

            {/* ── Cycle-Phase Adaptation ── */}
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

              <CyclePhaseWave />

              <div className="mt-6">
                <CyclePhaseAccordion title="Follicular phase" days="days 1–13">
                  Rising estrogen improves neuromuscular recruitment and
                  blunts perceived exertion. This is the phase best suited for
                  intensity work — heavier loads, PR attempts, and higher
                  volume blocks. The app increases working weight targets and
                  flags this as a prime window for strength testing.
                </CyclePhaseAccordion>
                <CyclePhaseAccordion title="Ovulatory phase" days="days 14–16">
                  Peak estrogen and a short LH surge create the highest
                  strength potential of the cycle, but also the highest ligament
                  laxity — particularly in the ACL. The app maintains high
                  intensity while substituting or flagging exercises with known
                  elevated injury risk during this window.
                </CyclePhaseAccordion>
                <CyclePhaseAccordion title="Luteal phase" days="days 17–28">
                  Progesterone rises and core temperature increases slightly.
                  Fatigue accumulates faster and perceived effort goes up for
                  equivalent loads. Volume is reduced by 10–20%, rest periods
                  are extended, and hypertrophy-focused rep ranges take
                  priority over absolute load.
                </CyclePhaseAccordion>
                <CyclePhaseAccordion title="Menstrual phase" days="days 1–5">
                  For athletes who experience significant symptoms, the app
                  reduces intensity further and prioritizes movement quality
                  over load. For athletes who feel strong early in menstruation,
                  the readiness score will reflect that and normal programming
                  applies — the system adapts to you, not a textbook average.
                </CyclePhaseAccordion>
                <div className="border-t border-border" />
              </div>

              <p className="mt-6 leading-relaxed text-muted">
                Cycle tracking is optional. Athletes who prefer not to use it
                train on the readiness-only model, which still outperforms a
                static calendar split.
              </p>
            </section>

            {/* ── Injury-Aware Programming ── */}
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

              <TrainingBlockComparison />
            </section>

            {/* ── Recovery vs Calendar ── */}
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

            {/* ── Bottom CTA ── */}
            <section className="mt-16 rounded-[2rem] bg-navy px-8 py-12 text-center text-cream">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Train smarter. Download Sundee Fundee.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-cream/80">
                Recovery-aware programming, cycle-phase adaptation, and
                injury-smart substitutions — all in one free app.
              </p>
              <div className="mt-8">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-orange px-8 font-medium text-cream transition hover:opacity-90"
                >
                  Download Sundee Fundee
                </a>
              </div>
            </section>

          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
