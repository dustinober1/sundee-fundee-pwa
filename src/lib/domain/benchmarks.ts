// Port of BenchmarkScoring logic from BenchmarkModels.swift / BenchmarkCatalog.swift.

export type BenchmarkScoring =
  | "time"
  | "rounds_and_reps"
  | "load"
  | "reps"
  | "calories"
  | "distance";

/**
 * For "time" the lower score wins (fastest). For everything else the higher
 * score wins. Mirrors the iOS app's ranking semantics.
 */
export function isBetterScore(
  candidate: number,
  current: number | null | undefined,
  scoring: BenchmarkScoring,
): boolean {
  if (current == null || !Number.isFinite(current)) return true;
  if (!Number.isFinite(candidate)) return false;
  return scoring === "time" ? candidate < current : candidate > current;
}

export function bestScore<T extends { score: number }>(
  results: readonly T[],
  scoring: BenchmarkScoring,
): T | null {
  if (results.length === 0) return null;
  return results.reduce<T | null>((best, r) => {
    if (best === null) return r;
    return isBetterScore(r.score, best.score, scoring) ? r : best;
  }, null);
}

/** Format a numeric score for display based on its scoring type. */
export function formatScore(value: number, scoring: BenchmarkScoring): string {
  switch (scoring) {
    case "time": {
      const total = Math.round(value);
      const m = Math.floor(total / 60);
      const s = total % 60;
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
    case "rounds_and_reps": {
      const rounds = Math.floor(value);
      const reps = Math.round((value - rounds) * 100);
      return reps > 0 ? `${rounds} + ${reps}` : `${rounds}`;
    }
    case "load":
      return `${value.toFixed(1)} lb`;
    case "reps":
      return `${Math.round(value)} reps`;
    case "calories":
      return `${Math.round(value)} cal`;
    case "distance":
      return `${value.toFixed(1)} m`;
  }
}
