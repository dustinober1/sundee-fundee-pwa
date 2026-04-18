// Pure rule engine for coach recommendations. Each rule takes a narrow
// slice of user data and returns a single Recommendation or null.

export type CoachKind =
  | "deload"
  | "retest_1rm"
  | "reduce_volume"
  | "plateau"
  | "pain_focus";

export type CoachSeverity = "info" | "warn" | "urgent";

export type CoachRecommendation = {
  kind: CoachKind;
  severity: CoachSeverity;
  rationale: string;
  exercise_id: string | null;
  dedup_key: string; // stable identifier — e.g. "plateau:exerciseId:yyyymm"
};

export type MaxHistoryPoint = {
  exercise_id: string;
  exercise_name: string;
  weight: number;
  performed_on: string; // YYYY-MM-DD
};

export type PainPoint = {
  date: string;
  intensity: number;
};

export type WeeklyVolumePoint = {
  weekStart: string;
  totalVolumeLbs: number;
};

function ym(date: string): string {
  return date.slice(0, 7); // YYYY-MM
}

/**
 * Plateau detection: given the last N 1RM records for a single exercise
 * (desc by date), flag if the last 3 records show no net improvement.
 */
export function detectPlateau(
  exerciseId: string,
  exerciseName: string,
  recentMaxes: readonly MaxHistoryPoint[], // desc, same exercise
): CoachRecommendation | null {
  const history = recentMaxes.filter((m) => m.exercise_id === exerciseId);
  if (history.length < 3) return null;

  const [latest, prior, earlier] = history;
  const noProgress =
    latest.weight <= earlier.weight && prior.weight <= earlier.weight;
  if (!noProgress) return null;

  return {
    kind: "plateau",
    severity: "info",
    rationale: `${exerciseName} 1RM has stalled across your last 3 records (${earlier.weight} → ${prior.weight} → ${latest.weight} lb). Consider a deload or benchmark retest.`,
    exercise_id: exerciseId,
    dedup_key: `plateau:${exerciseId}:${ym(latest.performed_on)}`,
  };
}

/**
 * Rising pain: average intensity in the last 7 days vs the prior 14 days.
 * Flag warn at +1.5 points, urgent at +3.
 */
export function detectRisingPain(
  painTrend: readonly PainPoint[],
): CoachRecommendation | null {
  if (painTrend.length < 5) return null;

  const now = Date.now();
  const dayMs = 86_400_000;
  const cutoffRecent = now - 7 * dayMs;
  const cutoffPrior = now - 21 * dayMs;

  const recent: number[] = [];
  const prior: number[] = [];
  for (const p of painTrend) {
    const t = new Date(p.date + "T00:00:00").getTime();
    if (t >= cutoffRecent) recent.push(p.intensity);
    else if (t >= cutoffPrior) prior.push(p.intensity);
  }
  if (recent.length === 0 || prior.length === 0) return null;

  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const recentAvg = avg(recent);
  const priorAvg = avg(prior);
  const delta = recentAvg - priorAvg;
  if (delta < 1.5) return null;

  const severity: CoachSeverity = delta >= 3 ? "urgent" : "warn";
  const weekStamp = new Date(now).toISOString().slice(0, 10);

  return {
    kind: "pain_focus",
    severity,
    rationale: `Pain intensity has climbed from ${priorAvg.toFixed(1)} to ${recentAvg.toFixed(1)} over the last 7 days. Consider a rest day or targeted mobility work.`,
    exercise_id: null,
    dedup_key: `pain_focus:${weekStamp}`,
  };
}

/**
 * ACWR too high: >1.5 warn, >1.8 urgent.
 */
export function detectHighAcwr(acwr: number | null): CoachRecommendation | null {
  if (acwr === null) return null;
  if (acwr < 1.5) return null;

  const severity: CoachSeverity = acwr >= 1.8 ? "urgent" : "warn";
  const weekStamp = new Date().toISOString().slice(0, 10);
  return {
    kind: "deload",
    severity,
    rationale: `Acute:chronic workload ratio is ${acwr.toFixed(2)} — your recent load has outpaced your sustained baseline. A deload week is advised.`,
    exercise_id: null,
    dedup_key: `deload_acwr:${weekStamp}`,
  };
}

/**
 * Volume drop: compare the last completed week to the prior 3-week average.
 * Flag if down by more than 30%.
 */
export function detectStalledVolume(
  weekly: readonly WeeklyVolumePoint[],
): CoachRecommendation | null {
  if (weekly.length < 4) return null;
  const sorted = [...weekly].sort((a, b) =>
    a.weekStart.localeCompare(b.weekStart),
  );
  const current = sorted[sorted.length - 1];
  const prior = sorted.slice(-4, -1);
  const priorAvg =
    prior.reduce((acc, w) => acc + w.totalVolumeLbs, 0) / prior.length;
  if (priorAvg <= 0) return null;
  const pct = (current.totalVolumeLbs - priorAvg) / priorAvg;
  if (pct > -0.3) return null;

  return {
    kind: "reduce_volume",
    severity: "info",
    rationale: `Weekly volume is down ${Math.round(-pct * 100)}% vs the prior 3-week average. If this is unplanned, consider a short retest block.`,
    exercise_id: null,
    dedup_key: `reduce_volume:${current.weekStart}`,
  };
}

/**
 * Benchmark retest due: any benchmark last retested more than 60 days ago.
 */
export type StaleBenchmark = {
  benchmark_id: string;
  benchmark_name: string;
  last_performed_on: string;
  days_since: number;
};

export function detectStaleBenchmarks(
  benchmarks: readonly StaleBenchmark[],
): CoachRecommendation[] {
  return benchmarks
    .filter((b) => b.days_since >= 60)
    .map((b) => ({
      kind: "retest_1rm" as const,
      severity: "info" as const,
      rationale: `It's been ${b.days_since} days since you last retested "${b.benchmark_name}". A benchmark retest keeps your training calibrated.`,
      exercise_id: null,
      dedup_key: `retest:${b.benchmark_id}:${b.last_performed_on}`,
    }));
}
