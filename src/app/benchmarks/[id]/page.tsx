import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import {
  BENCHMARK_CATEGORY_LABEL,
  getBenchmark,
  listBenchmarkResults,
} from "@/features/benchmarks/queries";
import { bestScore, formatScore } from "@/lib/domain/benchmarks";
import { LogResultForm } from "./LogResultForm";
import { deleteBenchmarkResult } from "../actions";

type Params = Promise<{ id: string }>;

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BenchmarkDetailPage({ params }: { params: Params }) {
  await requireOnboardedProfile();
  const { id } = await params;
  const [benchmark, results] = await Promise.all([
    getBenchmark(id),
    listBenchmarkResults(id),
  ]);
  if (!benchmark) notFound();

  const pr = bestScore(results, benchmark.scoring_type);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/benchmarks"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Benchmarks
        </Link>

        <header className="mt-3">
          <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
            {BENCHMARK_CATEGORY_LABEL[benchmark.category]}
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold">{benchmark.name}</h1>
          <p className="mt-3 text-sm text-navy/80 whitespace-pre-wrap">
            {benchmark.workout_description}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            {benchmark.time_domain ? (
              <div>
                <dt className="text-muted">Time domain</dt>
                <dd className="text-navy">{benchmark.time_domain}</dd>
              </div>
            ) : null}
            {benchmark.intensity != null ? (
              <div>
                <dt className="text-muted">Intensity</dt>
                <dd className="text-navy">{benchmark.intensity}/5</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted">Scoring</dt>
              <dd className="text-navy">{benchmark.scoring_type.replaceAll("_", " ")}</dd>
            </div>
            {pr ? (
              <div>
                <dt className="text-muted">Your PR</dt>
                <dd className="text-gold font-medium">
                  {formatScore(pr.score, benchmark.scoring_type)}
                </dd>
              </div>
            ) : null}
          </dl>

          {benchmark.coach_notes ? (
            <p className="mt-4 rounded-2xl border border-border bg-surface p-4 text-sm text-navy/80">
              <span className="font-display text-gold uppercase tracking-[0.2em] text-[10px]">
                Coach notes
              </span>
              <br />
              {benchmark.coach_notes}
            </p>
          ) : null}
        </header>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Log a result</h2>
          <LogResultForm benchmarkId={benchmark.id} scoring={benchmark.scoring_type} />
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">History</h2>
          {results.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No attempts logged yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-surface">
              {results.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between p-4 text-sm"
                >
                  <span className="font-mono">
                    {formatScore(r.score, benchmark.scoring_type)}
                  </span>
                  <span className="text-muted">{formatDate(r.performed_on)}</span>
                  <form action={deleteBenchmarkResult}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="benchmark_id" value={benchmark.id} />
                    <button
                      type="submit"
                      className="text-xs text-muted hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
