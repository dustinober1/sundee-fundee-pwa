const trustSignals = [
  {
    title: "Publicly documented",
    body: "The site ships with visible privacy and terms pages, so the policy surface is easy to inspect.",
  },
  {
    title: "Direct distribution",
    body: "The primary path is a direct App Store download, not a maze of lead forms or dark-pattern funnels.",
  },
  {
    title: "Method-first content",
    body: "The blog and product copy stay focused on recovery, injuries, and programming instead of hype.",
  },
];

export function TrustSignals() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
            Why trust it
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
            Trust comes from transparency, not fake proof.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            You do not have user testimonials yet, so this section leans on what
            people can verify right now: the policy surface, the distribution
            path, and the actual training philosophy.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {trustSignals.map((signal) => (
            <div
              key={signal.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h3 className="font-display text-xl font-semibold text-navy">
                {signal.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {signal.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
