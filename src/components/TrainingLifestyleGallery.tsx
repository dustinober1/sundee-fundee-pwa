const galleryImages = [
  {
    src: "/lifestyle-videos/hiker.mp4",
    poster: "/lifestyle-videos/hiker-poster.jpg",
    alt: "Hiker during golden hour",
    gradient: "from-navy/10 to-orange/10",
  },
  {
    src: "/lifestyle-videos/kettlebell.mp4",
    poster: "/lifestyle-videos/kettlebell-poster.jpg",
    alt: "Kettlebell training macro shot",
    gradient: "from-orange/10 to-navy/10",
  },
  {
    src: "/lifestyle-videos/woman-gym.mp4",
    poster: "/lifestyle-videos/woman-gym-poster.jpg",
    alt: "Woman training in gym",
    gradient: "from-navy/10 to-gold/10 sm:col-span-2 lg:col-span-1",
  },
] as const;

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
            Recovery-aware programming designed for strength work and
            the days when your body needs you to adapt.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((image) => (
            <div
              key={image.src}
              className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${image.gradient}`}
            >
              <video
                src={image.src}
                poster={image.poster}
                aria-label={image.alt}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
