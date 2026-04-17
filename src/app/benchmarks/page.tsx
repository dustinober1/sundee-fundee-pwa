import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import {
  BENCHMARK_CATEGORY_LABEL,
  listBenchmarks,
  type BenchmarkCategory,
  type BenchmarkDefinition,
} from "@/features/benchmarks/queries";

export default async function BenchmarksPage() {
  await requireOnboardedProfile();
  const benchmarks = await listBenchmarks();

  const grouped = benchmarks.reduce<Record<BenchmarkCategory, BenchmarkDefinition[]>>(
    (acc, b) => {
      (acc[b.category] ??= []).push(b);
      return acc;
    },
    {} as Record<BenchmarkCategory, BenchmarkDefinition[]>,
  );

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">Benchmarks</h1>
        <p className="mt-2 text-sm text-muted">
          Re-test these to track real fitness gains over time.
        </p>

        <div className="mt-8 space-y-8">
          {(Object.keys(BENCHMARK_CATEGORY_LABEL) as BenchmarkCategory[]).map((cat) => {
            const items = grouped[cat] ?? [];
            if (items.length === 0) return null;
            return (
              <section key={cat}>
                <h2 className="font-display text-gold uppercase tracking-[0.3em] text-xs">
                  {BENCHMARK_CATEGORY_LABEL[cat]}
                </h2>
                <ul className="mt-3 space-y-2">
                  {items.map((b) => (
                    <li key={b.id}>
                      <Link
                        href={`/benchmarks/${b.id}`}
                        className="block rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-cream"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="font-display text-lg font-semibold">{b.name}</p>
                          {b.intensity != null ? (
                            <span className="text-xs text-muted">
                              Intensity {b.intensity}/5
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-muted line-clamp-2">
                          {b.workout_description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
