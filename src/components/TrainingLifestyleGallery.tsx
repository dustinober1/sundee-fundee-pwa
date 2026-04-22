export function TrainingLifestyleGallery() {
  return (
    <section className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
            In the field
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
            Built for real training.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Recovery-aware programming designed for strength work, rucking, and
            the days when your body needs you to adapt.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Slot 1 — replace src/alt with a real lifestyle image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-navy/10 to-orange/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-muted">
                {/* TODO: Replace with training photo */}
                Lifestyle image 1
              </p>
            </div>
          </div>

          {/* Slot 2 */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-orange/10 to-navy/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-muted">
                {/* TODO: Replace with training photo */}
                Lifestyle image 2
              </p>
            </div>
          </div>

          {/* Slot 3 */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-navy/10 to-gold/10 sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-muted">
                {/* TODO: Replace with training photo */}
                Lifestyle image 3
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
