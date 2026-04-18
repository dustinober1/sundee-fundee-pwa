"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EnrollSchema = z.object({ template_id: z.string().min(1) });

export async function enrollInProgram(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = EnrollSchema.safeParse({ template_id: formData.get("template_id") });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  // Deactivate any existing active enrollment, then create the new one.
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

/**
 * Start a program session: create a workout pre-populated from the prescribed
 * exercises + sets, link it via enrolled_program_sessions, and redirect to the
 * existing /workouts/[id] logging UI. Idempotent: if a session row already has
 * a workout, reuse it.
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
  const { enrollment_id, week_num, session_index, session_label } = parsed.data;

  const supabase = await createSupabaseServerClient();

  // Load enrollment + template (scoped to this user; is_active guard)
  const { data: enrollment } = await supabase
    .from("enrolled_programs")
    .select(
      "id, template_id, user_id, is_active, program_templates ( name, weeks )",
    )
    .eq("id", enrollment_id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!enrollment) redirect("/programs");

  type Tpl = { name: string; weeks: unknown };
  const e = enrollment as {
    id: string;
    template_id: string;
    is_active: boolean;
    program_templates: Tpl | Tpl[] | null;
  };
  const tpl = Array.isArray(e.program_templates)
    ? e.program_templates[0]
    : e.program_templates;
  if (!tpl) redirect("/programs");

  const weeksJson = tpl!.weeks;
  const weeks = (
    Array.isArray(weeksJson)
      ? weeksJson
      : typeof weeksJson === "string"
        ? JSON.parse(weeksJson)
        : []
  ) as Array<{
    week_num: number;
    sessions: Array<{
      label: string;
      exercises: Array<{
        exercise_id: string;
        sets: number;
        reps: number;
        pct_1rm: number;
      }>;
    }>;
  }>;

  const week = weeks.find((w) => w.week_num === week_num);
  const session = week?.sessions[session_index];
  if (!session) return;

  // Reuse existing linked workout if present.
  const { data: existingSession } = await supabase
    .from("enrolled_program_sessions")
    .select("id, session_workout_id")
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

  // Fetch latest maxes to populate prescribed_weight.
  const exerciseIds = Array.from(
    new Set(session.exercises.map((x) => x.exercise_id)),
  );
  const { data: maxRows } = await supabase
    .from("one_rep_max_records")
    .select("exercise_id, weight, performed_on")
    .in("exercise_id", exerciseIds)
    .order("performed_on", { ascending: false });
  const latestMax = new Map<string, number>();
  for (const r of (maxRows ?? []) as Array<{
    exercise_id: string;
    weight: string | number;
  }>) {
    if (!latestMax.has(r.exercise_id)) {
      const w = typeof r.weight === "string" ? parseFloat(r.weight) : r.weight;
      latestMax.set(r.exercise_id, w);
    }
  }
  const roundToPlate = (w: number) => Math.round(w * 2) / 2;

  // Create workout.
  const today = new Date().toISOString().slice(0, 10);
  const workoutName = `${tpl!.name} — W${week_num} ${session_label}`;
  const { data: workout, error: werr } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      performed_on: today,
      name: workoutName,
    })
    .select("id")
    .single();
  if (werr || !workout) return;
  const workoutId = (workout as { id: string }).id;

  // Insert workout_exercises + workout_sets.
  for (let ei = 0; ei < session.exercises.length; ei++) {
    const ex = session.exercises[ei];
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

    const max = latestMax.get(ex.exercise_id);
    const prescribedWeight =
      max !== undefined ? roundToPlate(max * ex.pct_1rm) : null;

    const setRows = Array.from({ length: ex.sets }, (_, i) => ({
      workout_exercise_id: weId,
      position: i,
      prescribed_weight: prescribedWeight,
      prescribed_reps: ex.reps,
      is_complete: false,
    }));
    if (setRows.length > 0) {
      await supabase.from("workout_sets").insert(setRows);
    }
  }

  // Upsert enrolled_program_sessions row.
  await supabase
    .from("enrolled_program_sessions")
    .upsert(
      {
        enrollment_id,
        week_num,
        session_index,
        session_workout_id: workoutId,
      },
      { onConflict: "enrollment_id,week_num,session_index" },
    );

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
  await supabase
    .from("enrolled_programs")
    .update({ current_week: next })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/programs/enrolled");
}
