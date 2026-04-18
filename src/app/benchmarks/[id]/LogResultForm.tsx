"use client";

import { useActionState } from "react";
import type { BenchmarkScoring } from "@/lib/domain/benchmarks";
import { logBenchmarkResult } from "../actions";

const SCORE_HINT: Record<BenchmarkScoring, string> = {
  time: "Total time in seconds (e.g., 245 for 4:05)",
  rounds_and_reps: "Rounds.reps as decimal (e.g., 15.07 for 15 + 7)",
  load: "Weight (lb)",
  reps: "Total reps",
  calories: "Total calories",
  distance: "Distance (m)",
};

export function LogResultForm({
  benchmarkId,
  scoring,
}: {
  benchmarkId: string;
  scoring: BenchmarkScoring;
}) {
  const [state, action, pending] = useActionState(
    logBenchmarkResult,
    undefined,
  );

  return (
    <form action={action} className="mt-3 grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="benchmark_id" value={benchmarkId} />

      <label className="text-sm sm:col-span-2">
        <span className="block font-medium text-navy">Score</span>
        <input
          name="score"
          type="number"
          step="0.01"
          min="0"
          required
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
        <span className="mt-1 block text-xs text-muted">{SCORE_HINT[scoring]}</span>
        {state?.errors?.score ? (
          <span className="mt-1 block text-xs text-recovery-risk">
            {state.errors.score[0]}
          </span>
        ) : null}
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">Date</span>
        <input
          name="performed_on"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      <label className="text-sm">
        <span className="block font-medium text-navy">Notes</span>
        <input
          name="notes"
          maxLength={500}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-cream px-3 focus:border-navy focus:outline-none"
        />
      </label>

      {state?.message ? (
        <p className="sm:col-span-2 rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="sm:col-span-2 flex h-12 items-center justify-center rounded-lg bg-orange font-medium text-cream hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Log result"}
      </button>
    </form>
  );
}
