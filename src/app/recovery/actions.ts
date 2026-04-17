"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser, getUserProfile } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { calculateRecoveryScore } from "@/lib/domain/recoveryScore";
import { calculateCycleStatus, type CyclePhase } from "@/lib/domain/cyclePhase";

const Schema = z.object({
  performed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hrv_ms: z.coerce.number().min(0).max(300).optional(),
  sleep_hours: z.coerce.number().min(0).max(16).optional(),
  pain_intensity: z.coerce.number().int().min(1).max(10).optional(),
  notes: z.string().trim().max(500).optional(),
});

export type RecoveryEntryState = {
  errors?: Record<string, string[]>;
  message?: string;
};

async function inferCyclePhase(userId: string): Promise<CyclePhase | null> {
  const supabase = await createSupabaseServerClient();
  const profile = await getUserProfile();
  if (!profile?.cycle_tracking_enabled) return null;

  const [{ data: settings }, { data: periods }] = await Promise.all([
    supabase.from("cycle_settings").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("period_logs")
      .select("start_date, end_date")
      .eq("user_id", userId)
      .order("start_date", { ascending: false })
      .limit(6),
  ]);

  if (!periods || periods.length === 0) return null;

  type S = {
    average_cycle_length_days: number;
    average_period_length_days: number;
    luteal_phase_length_days: number;
  };
  const s = (settings as S | null) ?? {
    average_cycle_length_days: 28,
    average_period_length_days: 5,
    luteal_phase_length_days: 14,
  };

  type P = { start_date: string; end_date: string | null };
  const status = calculateCycleStatus(
    (periods as P[]).map((p) => ({
      startDate: new Date(p.start_date + "T00:00:00"),
      endDate: p.end_date ? new Date(p.end_date + "T00:00:00") : null,
    })),
    {
      averageCycleLengthDays: s.average_cycle_length_days,
      averagePeriodLengthDays: s.average_period_length_days,
      lutealPhaseLengthDays: s.luteal_phase_length_days,
    },
  );
  return status?.currentPhase ?? null;
}

export async function logRecoveryEntry(
  _prev: RecoveryEntryState | undefined,
  formData: FormData,
): Promise<RecoveryEntryState> {
  const user = await requireUser();
  const parsed = Schema.safeParse({
    performed_on: formData.get("performed_on"),
    hrv_ms: formData.get("hrv_ms") || undefined,
    sleep_hours: formData.get("sleep_hours") || undefined,
    pain_intensity: formData.get("pain_intensity") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const phase = await inferCyclePhase(user.id);

  const score = calculateRecoveryScore({
    hrvMilliseconds: parsed.data.hrv_ms ?? null,
    sleepDurationHours: parsed.data.sleep_hours ?? null,
    painIntensity: parsed.data.pain_intensity ?? null,
    cyclePhase: phase,
  });

  if (!score) return { message: "Provide at least one input (HRV, sleep, or pain)." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("recovery_scores")
    .upsert(
      {
        user_id: user.id,
        performed_on: parsed.data.performed_on,
        total: score.total,
        recommendation: score.recommendation,
        sub_scores: score.subScores,
        hrv_ms: parsed.data.hrv_ms ?? null,
        sleep_hours: parsed.data.sleep_hours ?? null,
        pain_intensity: parsed.data.pain_intensity ?? null,
        cycle_phase: phase,
        notes: parsed.data.notes ?? null,
      },
      { onConflict: "user_id,performed_on" },
    );
  if (error) return { message: error.message };

  revalidatePath("/recovery");
  revalidatePath("/dashboard");
  return {};
}
