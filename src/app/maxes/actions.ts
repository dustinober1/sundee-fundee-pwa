"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { estimatedOneRepMax } from "@/lib/domain/oneRepMax";

const Schema = z.object({
  exercise_id: z.uuid(),
  weight: z.coerce.number().positive("Weight must be positive"),
  reps: z.coerce.number().int().min(1).max(20),
  unit: z.enum(["lb", "kg"]),
  performed_on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
    .optional(),
  notes: z.string().trim().max(280).optional(),
  client_id: z.uuid().optional(),
});

export type AddMaxState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function addOneRepMax(
  _prev: AddMaxState | undefined,
  formData: FormData,
): Promise<AddMaxState> {
  const user = await requireUser();

  const parsed = Schema.safeParse({
    exercise_id: formData.get("exercise_id"),
    weight: formData.get("weight"),
    reps: formData.get("reps"),
    unit: formData.get("unit"),
    performed_on: formData.get("performed_on") || undefined,
    notes: formData.get("notes") || undefined,
    client_id: formData.get("client_id") || undefined,
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const { exercise_id, weight, reps, unit, performed_on, notes, client_id } =
    parsed.data;

  const isEstimated = reps > 1;
  const stored = isEstimated ? (estimatedOneRepMax(weight, reps) ?? weight) : weight;

  const supabase = await createSupabaseServerClient();
  const row = {
    user_id: user.id,
    exercise_id,
    weight: stored,
    unit,
    is_estimated: isEstimated,
    source_reps: reps,
    performed_on: performed_on ?? new Date().toISOString().slice(0, 10),
    notes: notes ?? null,
    client_id: client_id ?? null,
  };
  const { error } = client_id
    ? await supabase
        .from("one_rep_max_records")
        .upsert(row, { onConflict: "user_id,client_id", ignoreDuplicates: true })
    : await supabase.from("one_rep_max_records").insert(row);

  if (error) return { message: error.message };

  revalidatePath("/maxes");
  return {};
}

export async function deleteOneRepMax(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("one_rep_max_records").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/maxes");
}
