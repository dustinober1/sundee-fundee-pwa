"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const CreateSchema = z.object({
  performed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(2000).optional(),
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
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      performed_on: parsed.data.performed_on,
      name: parsed.data.name ?? null,
      notes: parsed.data.notes ?? null,
    })
    .select("id")
    .single();

  if (error || !data) return { message: error?.message ?? "Failed to create workout" };

  revalidatePath("/workouts");
  redirect(`/workouts/${(data as { id: string }).id}`);
}

const AddExerciseSchema = z.object({
  workout_id: z.uuid(),
  exercise_id: z.uuid(),
});

export async function addExerciseToWorkout(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = AddExerciseSchema.safeParse({
    workout_id: formData.get("workout_id"),
    exercise_id: formData.get("exercise_id"),
  });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();

  const { data: workout } = await supabase
    .from("workouts")
    .select("id, user_id")
    .eq("id", parsed.data.workout_id)
    .maybeSingle();
  if (!workout || (workout as { user_id: string }).user_id !== user.id) return;

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
  });

  revalidatePath(`/workouts/${parsed.data.workout_id}`);
}

const AddSetSchema = z.object({
  workout_exercise_id: z.uuid(),
  weight: z.coerce.number().nonnegative().optional(),
  reps: z.coerce.number().int().min(0).max(999).optional(),
  seconds: z.coerce.number().int().min(0).max(36000).optional(),
});

export async function addSetToExercise(formData: FormData): Promise<void> {
  await requireUser();
  const parsed = AddSetSchema.safeParse({
    workout_exercise_id: formData.get("workout_exercise_id"),
    weight: formData.get("weight") || undefined,
    reps: formData.get("reps") || undefined,
    seconds: formData.get("seconds") || undefined,
  });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
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
  });

  // Revalidate via referer is awkward; revalidate the workouts namespace.
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
  await supabase
    .from("workouts")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath(`/workouts/${id}`);
  revalidatePath("/workouts");
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
