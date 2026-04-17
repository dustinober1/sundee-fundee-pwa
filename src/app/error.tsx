"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] route error", error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <p className="font-display text-recovery-risk uppercase tracking-[0.4em] text-xs">
          Something broke
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          We couldn&apos;t load this page.
        </h1>
        <p className="mt-3 text-sm text-muted">
          {error.message || "An unexpected error occurred."}
          {error.digest ? (
            <span className="mt-2 block text-xs font-mono text-muted/70">
              ref: {error.digest}
            </span>
          ) : null}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-12 items-center rounded-full bg-navy px-8 font-medium text-cream hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
