"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWorkoutSummaryData } from "@/features/workouts/summaryQueries";

const CreateSchema = z.object({
  performed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(2000).optional(),
  client_id: z.uuid().optional(),
});

export type CreateWorkoutState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createWorkout(
  _prev: CreateWorkoutState | undefined,
  formData: FormData,
): Promise<CreateWorkoutState> {
  const user = await requireUser();
  const parsed = CreateSchema.safeParse({
    performed_on: formData.get("performed_on"),
    name: formData.get("name") || undefined,
    notes: formData.get("notes") || undefined,
    client_id: formData.get("client_id") || undefined,
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const row = {
    user_id: user.id,
    performed_on: parsed.data.performed_on,
    name: parsed.data.name ?? null,
    notes: parsed.data.notes ?? null,
    client_id: parsed.data.client_id ?? null,
  };
  const query = parsed.data.client_id
    ? supabase
        .from("workouts")
        .upsert(row, { onConflict: "user_id,client_id" })
        .select("id")
        .single()
    : supabase.from("workouts").insert(row).select("id").single();
  const { data, error } = await query;

  if (error || !data) return { message: error?.message ?? "Failed to create workout" };

  revalidatePath("/workouts");
  redirect(`/workouts/${(data as { id: string }).id}`);
}

const AddExerciseSchema = z.object({
  workout_id: z.uuid(),
  exercise_id: z.uuid(),
  client_id: z.uuid().optional(),
});

export async function addExerciseToWorkout(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = AddExerciseSchema.safeParse({
    workout_id: formData.get("workout_id"),
    exercise_id: formData.get("exercise_id"),
    client_id: formData.get("client_id") || undefined,
  });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();

  const { data: workout } = await supabase
    .from("workouts")
    .select("id, user_id")
    .eq("id", parsed.data.workout_id)
    .maybeSingle();
  if (!workout || (workout as { user_id: string }).user_id !== user.id) return;

  // Idempotent replay: if a row with this client_id already exists, skip.
  if (parsed.data.client_id) {
    const { data: dup } = await supabase
      .from("workout_exercises")
      .select("id")
      .eq("workout_id", parsed.data.workout_id)
      .eq("client_id", parsed.data.client_id)
      .maybeSingle();
    if (dup) {
      revalidatePath(`/workouts/${parsed.data.workout_id}`);
      return;
    }
  }

  const { data: existing } = await supabase
    .from("workout_exercises")
    .select("position")
    .eq("workout_id", parsed.data.workout_id)
    .order("position", { ascending: false })
    .limit(1);
  const nextPos =
    ((existing as { position: number }[] | null)?.[0]?.position ?? -1) + 1;

  await supabase.from("workout_exercises").insert({
    workout_id: parsed.data.workout_id,
    exercise_id: parsed.data.exercise_id,
    position: nextPos,
    client_id: parsed.data.client_id ?? null,
  });

  revalidatePath(`/workouts/${parsed.data.workout_id}`);
}

const AddSetSchema = z.object({
  workout_exercise_id: z.uuid(),
  weight: z.coerce.number().nonnegative().optional(),
  reps: z.coerce.number().int().min(0).max(999).optional(),
  seconds: z.coerce.number().int().min(0).max(36000).optional(),
  client_id: z.uuid().optional(),
});

export async function addSetToExercise(formData: FormData): Promise<void> {
  await requireUser();
  const parsed = AddSetSchema.safeParse({
    workout_exercise_id: formData.get("workout_exercise_id"),
    weight: formData.get("weight") || undefined,
    reps: formData.get("reps") || undefined,
    seconds: formData.get("seconds") || undefined,
    client_id: formData.get("client_id") || undefined,
  });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();

  if (parsed.data.client_id) {
    const { data: dup } = await supabase
      .from("workout_sets")
      .select("id")
      .eq("workout_exercise_id", parsed.data.workout_exercise_id)
      .eq("client_id", parsed.data.client_id)
      .maybeSingle();
    if (dup) {
      revalidatePath("/workouts", "layout");
      return;
    }
  }

  const { data: existing } = await supabase
    .from("workout_sets")
    .select("position")
    .eq("workout_exercise_id", parsed.data.workout_exercise_id)
    .order("position", { ascending: false })
    .limit(1);
  const nextPos =
    ((existing as { position: number }[] | null)?.[0]?.position ?? -1) + 1;

  await supabase.from("workout_sets").insert({
    workout_exercise_id: parsed.data.workout_exercise_id,
    position: nextPos,
    completed_weight: parsed.data.weight ?? null,
    completed_reps: parsed.data.reps ?? null,
    completed_seconds: parsed.data.seconds ?? null,
    is_complete: true,
    client_id: parsed.data.client_id ?? null,
  });

  revalidatePath("/workouts", "layout");
}

export async function deleteWorkoutExercise(formData: FormData): Promise<void> {
  await requireUser();
  const id = formData.get("id");
  const workoutId = formData.get("workout_id");
  if (typeof id !== "string" || typeof workoutId !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("workout_exercises").delete().eq("id", id);
  revalidatePath(`/workouts/${workoutId}`);
}

export async function deleteSet(formData: FormData): Promise<void> {
  await requireUser();
  const id = formData.get("id");
  const workoutId = formData.get("workout_id");
  if (typeof id !== "string" || typeof workoutId !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("workout_sets").delete().eq("id", id);
  revalidatePath(`/workouts/${workoutId}`);
}

export async function completeWorkout(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  const completedAt = new Date().toISOString();
  await supabase
    .from("workouts")
    .update({ completed_at: completedAt })
    .eq("id", id)
    .eq("user_id", user.id);

  // If this workout is linked to a program session, mark it complete too.
  await supabase
    .from("enrolled_program_sessions")
    .update({ completed_at: completedAt })
    .eq("session_workout_id", id);

  // Auto-persist estimated 1RMs for any exercise that hit a new PR today,
  // unless a record for (user, exercise, date) already exists.
  const summary = await getWorkoutSummaryData(id);
  if (summary && summary.prs.oneRmPrs.length > 0) {
    const performedOn = summary.workout.performed_on;
    const exerciseIds = summary.prs.oneRmPrs.map((pr) => pr.exercise_id);

    const { data: existing } = await supabase
      .from("one_rep_max_records")
      .select("exercise_id")
      .eq("user_id", user.id)
      .eq("performed_on", performedOn)
      .in("exercise_id", exerciseIds);
    const existingIds = new Set(
      ((existing as { exercise_id: string }[] | null) ?? []).map((r) => r.exercise_id),
    );

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("weight_unit")
      .eq("id", user.id)
      .maybeSingle();
    const unit = (profile as { weight_unit?: "lb" | "kg" } | null)?.weight_unit ?? "lb";

    const toInsert = summary.prs.oneRmPrs
      .filter((pr) => !existingIds.has(pr.exercise_id))
      .map((pr) => ({
        user_id: user.id,
        exercise_id: pr.exercise_id,
        weight: pr.estimated_1rm,
        unit,
        is_estimated: pr.source_set.reps > 1,
        source_reps: pr.source_set.reps,
        performed_on: performedOn,
        source: "estimated",
        notes: null,
      }));

    if (toInsert.length > 0) {
      await supabase.from("one_rep_max_records").insert(toInsert);
    }
  }

  revalidatePath(`/workouts/${id}`);
  revalidatePath("/workouts");
  revalidatePath("/programs/enrolled");
  revalidatePath("/maxes");
  redirect(`/workouts/${id}/summary`);
}

export async function deleteWorkout(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("workouts").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/workouts");
  redirect("/workouts");
}
