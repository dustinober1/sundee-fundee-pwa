import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TrainingRecommendation } from "@/lib/domain/recoveryScore";
import type { CyclePhase } from "@/lib/domain/cyclePhase";

export type RecoveryScoreRow = {
  id: string;
  performed_on: string;
  total: number;
  recommendation: TrainingRecommendation;
  sub_scores: Record<string, number>;
  hrv_ms: number | null;
  sleep_hours: number | null;
  pain_intensity: number | null;
  cycle_phase: CyclePhase | null;
  notes: string | null;
};

export const getTodayRecoveryScore = cache(async (): Promise<RecoveryScoreRow | null> => {
  const today = new Date().toISOString().slice(0, 10);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("recovery_scores")
    .select("*")
    .eq("performed_on", today)
    .maybeSingle();
  return (data as RecoveryScoreRow | null) ?? null;
});

export const listRecoveryScores = cache(async (): Promise<RecoveryScoreRow[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("recovery_scores")
    .select("*")
    .order("performed_on", { ascending: false })
    .limit(60);
  return (data as RecoveryScoreRow[] | null) ?? [];
});
