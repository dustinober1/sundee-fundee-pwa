const apps = [
  {
    name: "Sundee Fundee",
    eyebrow: "Strength + recovery",
    body: "Best if you want recovery-aware strength training, rucking, cycle context, and injury adaptation in one place.",
    bullets: [
      "Strength programming with recovery in mind",
      "Rucking support for mixed-modal training",
      "Helpful when training has to adapt week to week",
    ],
    cta: "Choose this if your gym work is the priority.",
    accent: "bg-navy text-cream",
  },
  {
    name: "Rucking Club",
    eyebrow: "Rucking-first companion",
    body: "Best if you want the rucking-focused experience as a separate app and a simpler decision path.",
    bullets: [
      "Rucking-oriented app experience",
      "Useful when you want a narrower training focus",
      "A clean alternative if you do not need the full strength layer",
    ],
    cta: "Choose this if you mostly care about rucking.",
    accent: "border border-border bg-surface text-navy",
  },
] as const;

export function AppComparison() {
  return (
    <section className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
            Compare the apps
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
            Make the choice obvious.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            The site currently promotes two products, so this section makes the
            split explicit instead of making visitors guess which download they
            should tap.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {apps.map((app) => (
            <article
              key={app.name}
              className={`rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(13,26,64,0.06)] ${
                app.accent
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-[0.28em] opacity-70">
                {app.eyebrow}
              </p>
              <h3 className="font-display mt-4 text-3xl font-bold">
                {app.name}
              </h3>
              <p className={`mt-4 text-sm leading-relaxed ${app.name === "Sundee Fundee" ? "text-cream/80" : "text-muted"}`}>
                {app.body}
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {app.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        app.name === "Sundee Fundee" ? "bg-gold" : "bg-orange"
                      }`}
                    />
                    <span
                      className={
                        app.name === "Sundee Fundee" ? "text-cream/80" : "text-navy/80"
                      }
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
              <p
                className={`mt-6 text-sm font-medium ${
                  app.name === "Sundee Fundee" ? "text-gold" : "text-orange"
                }`}
              >
                {app.cta}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
