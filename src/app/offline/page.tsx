import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <main className="min-h-dvh bg-cream px-6 py-12 text-navy">
      <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange">
          Offline
        </p>
        <h1 className="font-display mt-4 text-5xl font-bold leading-tight">
          Your local training log is still here.
        </h1>
        <p className="mt-5 text-base leading-7 text-muted">
          Open the app shell and continue with local-only data while your
          connection catches up.
        </p>
        <Link
          href="/app"
          className="mt-8 inline-flex h-11 w-fit items-center rounded-lg bg-navy px-5 text-sm font-semibold text-cream"
        >
          Open app
        </Link>
      </div>
    </main>
  );
}
