"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  adaptSession,
  type AdaptSessionResult,
  type PrescribedExercise,
} from "@/lib/domain/adaptSession";
import type { Injury, RecoveryPhase } from "@/lib/domain/adaptation";
import type { CyclePhase } from "@/lib/domain/cyclePhase";
import type { TrainingRecommendation } from "@/lib/domain/recoveryScore";

const EnrollSchema = z.object({ template_id: z.string().min(1) });

export async function enrollInProgram(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = EnrollSchema.safeParse({ template_id: formData.get("template_id") });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("enrolled_programs")
    .update({ is_active: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  await supabase.from("enrolled_programs").insert({
    user_id: user.id,
    template_id: parsed.data.template_id,
    is_active: true,
  });

  revalidatePath("/programs");
  redirect("/programs/enrolled");
}

export async function endEnrollment(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("enrolled_programs")
    .update({
      is_active: false,
      completed_on: new Date().toISOString().slice(0, 10),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/programs");
  redirect("/programs");
}

const StartSessionSchema = z.object({
  enrollment_id: z.string().uuid(),
  week_num: z.coerce.number().int().min(1),
  session_index: z.coerce.number().int().min(0),
  session_label: z.string().min(1).max(120),
});

type SessionExercise = {
  exercise_id: string;
  sets: number;
  reps: number;
  pct_1rm: number;
};

type LoadedSession = {
  templateName: string;
  sessionLabel: string;
  exercises: SessionExercise[];
};

async function loadSession(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  enrollmentId: string,
  userId: string,
  weekNum: number,
  sessionIndex: number,
): Promise<LoadedSession | null> {
  const { data: enrollment } = await supabase
    .from("enrolled_programs")
    .select(
      "id, template_id, user_id, is_active, program_templates ( name, weeks )",
    )
    .eq("id", enrollmentId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!enrollment) return null;

  type Tpl = { name: string; weeks: unknown };
  const e = enrollment as {
    program_templates: Tpl | Tpl[] | null;
  };
  const tpl = Array.isArray(e.program_templates)
    ? e.program_templates[0]
    : e.program_templates;
  if (!tpl) return null;

  const weeksRaw = tpl.weeks;
  const weeks = (
    Array.isArray(weeksRaw)
      ? weeksRaw
      : typeof weeksRaw === "string"
        ? JSON.parse(weeksRaw)
        : []
  ) as Array<{
    week_num: number;
    sessions: Array<{
      label: string;
      exercises: SessionExercise[];
    }>;
  }>;

  const week = weeks.find((w) => w.week_num === weekNum);
  const session = week?.sessions[sessionIndex];
  if (!session) return null;

  return {
    templateName: tpl.name,
    sessionLabel: session.label,
    exercises: session.exercises,
  };
}

async function loadSignals(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
): Promise<{
  recovery: TrainingRecommendation | null;
  cyclePhase: CyclePhase | null;
  injuries: Injury[];
}> {
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: recoveryRow }, { data: injuryRows }] = await Promise.all([
    supabase
      .from("recovery_scores")
      .select("recommendation, cycle_phase")
      .eq("user_id", userId)
      .eq("performed_on", today)
      .maybeSingle(),
    supabase
      .from("injuries")
      .select("id, name, location_ids, recovery_phase")
      .eq("user_id", userId)
      .neq("recovery_phase", "resolved"),
  ]);

  const r = recoveryRow as
    | { recommendation: TrainingRecommendation; cycle_phase: CyclePhase | null }
    | null;
  const injuries = ((injuryRows as Array<{
    id: string;
    name: string;
    location_ids: string[];
    recovery_phase: RecoveryPhase;
  }> | null) ?? []).map((i) => ({
    id: i.id,
    name: i.name,
    location_ids: i.location_ids,
    recovery_phase: i.recovery_phase,
  }));

  return {
    recovery: r?.recommendation ?? null,
    cyclePhase: r?.cycle_phase ?? null,
    injuries,
  };
}

async function buildPrescribed(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  exercises: SessionExercise[],
): Promise<PrescribedExercise[]> {
  const ids = Array.from(new Set(exercises.map((e) => e.exercise_id)));
  if (ids.length === 0) return [];

  const [{ data: exRows }, { data: maxRows }] = await Promise.all([
    supabase
      .from("exercises")
      .select("id, name, weightlifting_category")
      .in("id", ids),
    supabase
      .from("one_rep_max_records")
      .select("exercise_id, weight, performed_on")
      .eq("user_id", userId)
      .in("exercise_id", ids)
      .order("performed_on", { ascending: false }),
  ]);

  const meta = new Map<string, { name: string; category: string | null }>();
  for (const r of (exRows as Array<{
    id: string;
    name: string;
    weightlifting_category: string | null;
  }> | null) ?? []) {
    meta.set(r.id, { name: r.name, category: r.weightlifting_category });
  }

  const latest = new Map<string, number>();
  for (const r of (maxRows as Array<{
    exercise_id: string;
    weight: string | number;
  }> | null) ?? []) {
    if (!latest.has(r.exercise_id)) {
      latest.set(
        r.exercise_id,
        typeof r.weight === "string" ? parseFloat(r.weight) : r.weight,
      );
    }
  }

  return exercises.map((e) => {
    const m = meta.get(e.exercise_id);
    return {
      exercise_id: e.exercise_id,
      exercise_name: m?.name ?? "",
      exercise_category: m?.category ?? null,
      sets: e.sets,
      reps: e.reps,
      pct_1rm: e.pct_1rm,
      latest_max: latest.get(e.exercise_id) ?? null,
    };
  });
}

function hasAnySignal(signals: {
  recovery: TrainingRecommendation | null;
  cyclePhase: CyclePhase | null;
  injuries: Injury[];
}): boolean {
  return (
    signals.recovery !== null ||
    signals.cyclePhase !== null ||
    signals.injuries.length > 0
  );
}

function roundToPlate(w: number): number {
  return Math.round(w * 2) / 2;
}

/**
 * Insert workout + workout_exercises + workout_sets for a program session.
 * Returns the workout id, or null on insert failure.
 *
 * `prescribedWeights`, if provided, is keyed by exercise_id and overrides
 * the default `latestMax × pct_1rm` computation (used by the adaptive path).
 */
async function materializeSession(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  params: {
    userId: string;
    enrollmentId: string;
    weekNum: number;
    sessionIndex: number;
    templateName: string;
    sessionLabel: string;
    exercises: SessionExercise[];
    latestMax: Map<string, number>;
    prescribedWeightsByIndex?: Array<number | null>;
  },
): Promise<string | null> {
  const today = new Date().toISOString().slice(0, 10);
  const workoutName = `${params.templateName} — W${params.weekNum} ${params.sessionLabel}`;

  const { data: workout, error: werr } = await supabase
    .from("workouts")
    .insert({
      user_id: params.userId,
      performed_on: today,
      name: workoutName,
    })
    .select("id")
    .single();
  if (werr || !workout) return null;
  const workoutId = (workout as { id: string }).id;

  for (let ei = 0; ei < params.exercises.length; ei++) {
    const ex = params.exercises[ei];
    const { data: we, error: weErr } = await supabase
      .from("workout_exercises")
      .insert({
        workout_id: workoutId,
        exercise_id: ex.exercise_id,
        position: ei,
      })
      .select("id")
      .single();
    if (weErr || !we) continue;
    const weId = (we as { id: string }).id;

    let prescribed: number | null;
    if (params.prescribedWeightsByIndex) {
      prescribed = params.prescribedWeightsByIndex[ei] ?? null;
    } else {
      const max = params.latestMax.get(ex.exercise_id);
      prescribed = max !== undefined ? roundToPlate(max * ex.pct_1rm) : null;
    }

    const rows = Array.from({ length: ex.sets }, (_, i) => ({
      workout_exercise_id: weId,
      position: i,
      prescribed_weight: prescribed,
      prescribed_reps: ex.reps,
      is_complete: false,
    }));
    if (rows.length > 0) {
      await supabase.from("workout_sets").insert(rows);
    }
  }

  await supabase
    .from("enrolled_program_sessions")
    .upsert(
      {
        enrollment_id: params.enrollmentId,
        week_num: params.weekNum,
        session_index: params.sessionIndex,
        session_workout_id: workoutId,
      },
      { onConflict: "enrollment_id,week_num,session_index" },
    );

  return workoutId;
}

/**
 * Start a program session. When today's recovery/cycle/injury signals are
 * present, compute an adaptation and redirect to the review page. Otherwise,
 * materialize the session directly (legacy behavior). Idempotent: if a
 * session already has a linked workout, reuse it.
 */
export async function startProgramSession(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = StartSessionSchema.safeParse({
    enrollment_id: formData.get("enrollment_id"),
    week_num: formData.get("week_num"),
    session_index: formData.get("session_index"),
    session_label: formData.get("session_label"),
  });
  if (!parsed.success) return;
  const { enrollment_id, week_num, session_index } = parsed.data;

  const supabase = await createSupabaseServerClient();

  const session = await loadSession(
    supabase,
    enrollment_id,
    user.id,
    week_num,
    session_index,
  );
  if (!session) redirect("/programs");

  // Reuse existing linked workout if present.
  const { data: existingSession } = await supabase
    .from("enrolled_program_sessions")
    .select("session_workout_id")
    .eq("enrollment_id", enrollment_id)
    .eq("week_num", week_num)
    .eq("session_index", session_index)
    .maybeSingle();
  const existingWorkoutId = (
    existingSession as { session_workout_id: string | null } | null
  )?.session_workout_id;
  if (existingWorkoutId) {
    const { data: w } = await supabase
      .from("workouts")
      .select("id")
      .eq("id", existingWorkoutId)
      .maybeSingle();
    if (w) {
      revalidatePath("/workouts");
      redirect(`/workouts/${existingWorkoutId}`);
    }
  }

  const signals = await loadSignals(supabase, user.id);

  if (!hasAnySignal(signals)) {
    // No adaptation possible — materialize directly with latest-max defaults.
    const exerciseIds = Array.from(
      new Set(session!.exercises.map((x) => x.exercise_id)),
    );
    const { data: maxRows } = await supabase
      .from("one_rep_max_records")
      .select("exercise_id, weight, performed_on")
      .eq("user_id", user.id)
      .in("exercise_id", exerciseIds)
      .order("performed_on", { ascending: false });

    const latest = new Map<string, number>();
    for (const r of (maxRows as Array<{
      exercise_id: string;
      weight: string | number;
    }> | null) ?? []) {
      if (!latest.has(r.exercise_id)) {
        latest.set(
          r.exercise_id,
          typeof r.weight === "string" ? parseFloat(r.weight) : r.weight,
        );
      }
    }

    const workoutId = await materializeSession(supabase, {
      userId: user.id,
      enrollmentId: enrollment_id,
      weekNum: week_num,
      sessionIndex: session_index,
      templateName: session!.templateName,
      sessionLabel: session!.sessionLabel,
      exercises: session!.exercises,
      latestMax: latest,
    });
    if (!workoutId) return;

    revalidatePath("/workouts");
    revalidatePath("/programs/enrolled");
    redirect(`/workouts/${workoutId}`);
  }

  // Compute adaptation and redirect to review.
  const prescribed = await buildPrescribed(
    supabase,
    user.id,
    session!.exercises,
  );
  const result = adaptSession({
    exercises: prescribed,
    recovery: signals.recovery,
    cyclePhase: signals.cyclePhase,
    injuries: signals.injuries,
  });

  // Persist the pending adaptation (upsert — reuse on re-visit).
  const payload = {
    template_name: session!.templateName,
    session_label: session!.sessionLabel,
    raw_exercises: session!.exercises,
    prescribed,
    result,
  };

  const { data: scoreRow } = await supabase
    .from("recovery_scores")
    .select("total")
    .eq("user_id", user.id)
    .eq("performed_on", new Date().toISOString().slice(0, 10))
    .maybeSingle();

  await supabase
    .from("session_adaptations")
    .upsert(
      {
        user_id: user.id,
        enrollment_id,
        week_num,
        session_index,
        recovery_score:
          (scoreRow as { total?: number } | null)?.total ?? null,
        cycle_phase: signals.cyclePhase,
        load_multiplier: result.globalMultiplier,
        payload,
        accepted_at: null,
        dismissed_at: null,
      },
      { onConflict: "enrollment_id,week_num,session_index" },
    );

  revalidatePath("/programs/enrolled");
  redirect(
    `/programs/session/${enrollment_id}/${week_num}/${session_index}/review`,
  );
}

const ConfirmSchema = z.object({
  enrollment_id: z.string().uuid(),
  week_num: z.coerce.number().int().min(1),
  session_index: z.coerce.number().int().min(0),
  mode: z.enum(["accept", "dismiss"]),
});

/**
 * Accept or dismiss an adaptation and materialize the session workout.
 *   accept  → use adapted_prescribed_weight for each exercise.
 *   dismiss → fall back to the raw prescribed weights (latestMax × pct_1rm).
 */
export async function confirmAdaptedSession(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = ConfirmSchema.safeParse({
    enrollment_id: formData.get("enrollment_id"),
    week_num: formData.get("week_num"),
    session_index: formData.get("session_index"),
    mode: formData.get("mode"),
  });
  if (!parsed.success) return;
  const { enrollment_id, week_num, session_index, mode } = parsed.data;

  const supabase = await createSupabaseServerClient();

  // Short-circuit if a workout already exists for this session.
  const { data: existingSession } = await supabase
    .from("enrolled_program_sessions")
    .select("session_workout_id")
    .eq("enrollment_id", enrollment_id)
    .eq("week_num", week_num)
    .eq("session_index", session_index)
    .maybeSingle();
  const existingWorkoutId = (
    existingSession as { session_workout_id: string | null } | null
  )?.session_workout_id;
  if (existingWorkoutId) {
    redirect(`/workouts/${existingWorkoutId}`);
  }

  const { data: adaptationRow } = await supabase
    .from("session_adaptations")
    .select("payload")
    .eq("user_id", user.id)
    .eq("enrollment_id", enrollment_id)
    .eq("week_num", week_num)
    .eq("session_index", session_index)
    .maybeSingle();
  if (!adaptationRow) redirect("/programs/enrolled");

  const payload = (adaptationRow as { payload: unknown }).payload as {
    template_name: string;
    session_label: string;
    raw_exercises: SessionExercise[];
    prescribed: PrescribedExercise[];
    result: AdaptSessionResult;
  };

  const prescribedWeightsByIndex: Array<number | null> =
    mode === "accept"
      ? payload.result.exercises.map((e) => e.adapted_prescribed_weight)
      : payload.result.exercises.map((e) => e.original_prescribed_weight);

  const latest = new Map<string, number>();
  for (const p of payload.prescribed) {
    if (p.latest_max != null) latest.set(p.exercise_id, p.latest_max);
  }

  const workoutId = await materializeSession(supabase, {
    userId: user.id,
    enrollmentId: enrollment_id,
    weekNum: week_num,
    sessionIndex: session_index,
    templateName: payload.template_name,
    sessionLabel: payload.session_label,
    exercises: payload.raw_exercises,
    latestMax: latest,
    prescribedWeightsByIndex,
  });
  if (!workoutId) return;

  const now = new Date().toISOString();
  await supabase
    .from("session_adaptations")
    .update(
      mode === "accept"
        ? { accepted_at: now, dismissed_at: null }
        : { dismissed_at: now, accepted_at: null },
    )
    .eq("user_id", user.id)
    .eq("enrollment_id", enrollment_id)
    .eq("week_num", week_num)
    .eq("session_index", session_index);

  revalidatePath("/workouts");
  revalidatePath("/programs/enrolled");
  redirect(`/workouts/${workoutId}`);
}

export async function advanceWeek(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  const next = Number(formData.get("next_week"));
  if (typeof id !== "string" || !Number.isInteger(next) || next < 1) return;

  const supabase = await createSupabaseServerClient();

  const { data: enrollment } = await supabase
    .from("enrolled_programs")
    .select("user_id, program_templates ( duration_weeks )")
    .eq("id", id)
    .maybeSingle();
  if (!enrollment) return;
  type E = {
    user_id: string;
    program_templates:
      | { duration_weeks: number }
      | { duration_weeks: number }[]
      | null;
  };
  const e = enrollment as E;
  if (e.user_id !== user.id) return;
  const tpl = Array.isArray(e.program_templates)
    ? e.program_templates[0]
    : e.program_templates;
  const duration = tpl?.duration_weeks ?? Number.POSITIVE_INFINITY;
  if (next > duration) return;

  await supabase
    .from("enrolled_programs")
    .update({ current_week: next })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/programs/enrolled");
}
