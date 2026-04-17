import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-display text-gold uppercase tracking-[0.4em] text-sm">
        Sundee Fundee
      </p>
      <h1 className="font-display mt-6 max-w-2xl text-5xl sm:text-6xl font-semibold leading-[1.05]">
        Train around what your body can handle today.
      </h1>
      <p className="mt-6 max-w-xl text-base sm:text-lg text-muted">
        Recovery-aware strength training. Log workouts, track maxes, and let
        your readiness drive the plan — without the guesswork.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-full bg-navy px-8 font-medium text-cream transition-opacity hover:opacity-90"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 font-medium text-navy transition-colors hover:bg-surface"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
