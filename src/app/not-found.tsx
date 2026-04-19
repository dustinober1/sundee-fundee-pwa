import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <p className="font-display text-gold uppercase tracking-[0.4em] text-xs">
          404
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          We couldn&apos;t find that.
        </h1>
        <p className="mt-3 text-sm text-muted">
          The page may have moved or never existed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-12 items-center rounded-lg bg-orange px-8 font-medium text-cream hover:opacity-90"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
