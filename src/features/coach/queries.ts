import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  computeAcwr,
  painTrend,
  weeklyVolume,
} from "@/features/analytics/queries";
import {
  detectHighAcwr,
  detectPlateau,
  detectRisingPain,
  detectStaleBenchmarks,
  detectStalledVolume,
  type CoachRecommendation,
  type MaxHistoryPoint,
} from "@/lib/domain/coachRules";

export type CoachRow = {
  id: string;
  kind: CoachRecommendation["kind"];
  severity: CoachRecommendation["severity"];
  rationale: string;
  exercise_id: string | null;
  created_at: string;
  dedup_key: string;
};

export const getActiveRecommendations = cache(
  async (userId: string): Promise<CoachRow[]> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("coach_recommendations")
      .select("id, kind, severity, rationale, exercise_id, created_at, dedup_key")
      .eq("user_id", userId)
      .is("dismissed_at", null)
      .is("acted_at", null)
      .order("severity", { ascending: false })
      .order("created_at", { ascending: false });
    return (data as CoachRow[] | null) ?? [];
  },
);

async function fetchMaxHistory(userId: string): Promise<MaxHistoryPoint[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("one_rep_max_records")
    .select("exercise_id, weight, performed_on, exercises ( name )")
    .eq("user_id", userId)
    .order("performed_on", { ascending: false })
    .limit(100);

  type Raw = {
    exercise_id: string;
    weight: string | number;
    performed_on: string;
    exercises: { name: string } | { name: string }[] | null;
  };

  return ((data as Raw[] | null) ?? []).map((r) => ({
    exercise_id: r.exercise_id,
    exercise_name: Array.isArray(r.exercises)
      ? (r.exercises[0]?.name ?? "")
      : (r.exercises?.name ?? ""),
    weight: typeof r.weight === "string" ? parseFloat(r.weight) : r.weight,
    performed_on: r.performed_on,
  }));
}

async function fetchStaleBenchmarks(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("benchmark_results")
    .select("benchmark_id, performed_on, benchmark_definitions ( name )")
    .eq("user_id", userId)
    .order("performed_on", { ascending: false });

  type Raw = {
    benchmark_id: string;
    performed_on: string;
    benchmark_definitions: { name: string } | { name: string }[] | null;
  };

  const latest = new Map<
    string,
    { name: string; last_performed_on: string }
  >();
  for (const r of (data as Raw[] | null) ?? []) {
    if (!latest.has(r.benchmark_id)) {
      const name = Array.isArray(r.benchmark_definitions)
        ? (r.benchmark_definitions[0]?.name ?? "")
        : (r.benchmark_definitions?.name ?? "");
      latest.set(r.benchmark_id, {
        name,
        last_performed_on: r.performed_on,
      });
    }
  }

  const today = new Date();
  return [...latest.entries()].map(([id, v]) => {
    const d = new Date(v.last_performed_on + "T00:00:00");
    const daysSince = Math.floor(
      (today.getTime() - d.getTime()) / 86_400_000,
    );
    return {
      benchmark_id: id,
      benchmark_name: v.name,
      last_performed_on: v.last_performed_on,
      days_since: daysSince,
    };
  });
}

/**
 * Evaluate all coach rules and upsert any newly-triggered recommendations.
 * Existing active rows with the same dedup_key are preserved.
 */
export async function evaluateAndUpsert(userId: string): Promise<void> {
  const [maxHistory, acwr, volume, pain, staleBenchmarks] = await Promise.all([
    fetchMaxHistory(userId),
    computeAcwr(),
    weeklyVolume(),
    painTrend(),
    fetchStaleBenchmarks(userId),
  ]);

  const recs: CoachRecommendation[] = [];

  const uniqueExercises = Array.from(
    new Map(maxHistory.map((m) => [m.exercise_id, m.exercise_name])).entries(),
  );
  for (const [exerciseId, name] of uniqueExercises) {
    const r = detectPlateau(exerciseId, name, maxHistory);
    if (r) recs.push(r);
  }

  const acwrRec = detectHighAcwr(acwr);
  if (acwrRec) recs.push(acwrRec);

  const volumeRec = detectStalledVolume(volume);
  if (volumeRec) recs.push(volumeRec);

  const painRec = detectRisingPain(pain);
  if (painRec) recs.push(painRec);

  recs.push(...detectStaleBenchmarks(staleBenchmarks));

  if (recs.length === 0) return;

  const supabase = await createSupabaseServerClient();
  // Skip rows whose dedup_key is already active (not dismissed/acted).
  const { data: existing } = await supabase
    .from("coach_recommendations")
    .select("dedup_key")
    .eq("user_id", userId)
    .is("dismissed_at", null)
    .is("acted_at", null);
  const activeKeys = new Set(
    ((existing as { dedup_key: string }[] | null) ?? []).map((r) => r.dedup_key),
  );

  const toInsert = recs
    .filter((r) => !activeKeys.has(r.dedup_key))
    .map((r) => ({
      user_id: userId,
      kind: r.kind,
      severity: r.severity,
      rationale: r.rationale,
      exercise_id: r.exercise_id,
      dedup_key: r.dedup_key,
    }));

  if (toInsert.length > 0) {
    await supabase.from("coach_recommendations").insert(toInsert);
  }
}
