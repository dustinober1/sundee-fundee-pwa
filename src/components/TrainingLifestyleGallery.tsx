import Image from "next/image";

const galleryImages = [
  {
    src: "/lifestyle-gifs/hiker.gif",
    alt: "Hiker during golden hour",
    gradient: "from-navy/10 to-orange/10",
  },
  {
    src: "/lifestyle-gifs/kettlebell.gif",
    alt: "Kettlebell training macro shot",
    gradient: "from-orange/10 to-navy/10",
  },
  {
    src: "/lifestyle-gifs/woman-gym.gif",
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
              <Image
                src={image.src}
                alt={image.alt}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
