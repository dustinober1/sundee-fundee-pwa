import { APP_STORE_URL } from "@/lib/site";

const highlights = [
  {
    title: "Recovery-Driven Plans",
    description:
      "Workouts adapt to your readiness score — not a fixed calendar. High-readiness days push harder; low-readiness days pull back automatically.",
  },
  {
    title: "Cycle-Phase Adaptation",
    description:
      "Optional cycle tracking adjusts load, volume, and exercise selection across all four phases so you train with your physiology.",
  },
  {
    title: "Injury-Smart Substitutions",
    description:
      "Flag an injury and the app routes around it — preserving the movement pattern with a lower-risk substitute instead of removing the work.",
  },
  {
    title: "Progressive Overload Built In",
    description:
      "Track maxes, benchmark lifts, and let the app handle periodization, deload timing, and PR windows based on your data.",
  },
] as const;

export function AppComparison() {
  return (
    <section id="compare" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
            Why Sundee Fundee
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
            Training that adapts to you.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Every session is shaped by your recovery, your biology, and your
            injury history — not a one-size-fits-all template.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-border bg-white p-6 shadow-[0_15px_40px_rgba(13,26,64,0.06)]"
            >
              <h3 className="font-display text-xl font-semibold text-navy">
                {h.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {h.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-orange px-8 font-medium text-cream transition hover:opacity-90"
          >
            Download Sundee Fundee
          </a>
        </div>
      </div>
    </section>
  );
}
