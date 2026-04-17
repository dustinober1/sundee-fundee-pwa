"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PHASES = ["acute", "rehab", "light_load", "return_to_play", "resolved"] as const;

const CreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  location_ids: z.array(z.string()).min(1, "Pick at least one location"),
  recovery_phase: z.enum(PHASES),
  notes: z.string().trim().max(500).optional(),
});

export type CreateInjuryState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createInjury(
  _prev: CreateInjuryState | undefined,
  formData: FormData,
): Promise<CreateInjuryState> {
  const user = await requireUser();
  const parsed = CreateSchema.safeParse({
    name: formData.get("name"),
    location_ids: formData.getAll("location_ids").map(String),
    recovery_phase: formData.get("recovery_phase"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("injuries").insert({
    user_id: user.id,
    name: parsed.data.name,
    location_ids: parsed.data.location_ids,
    recovery_phase: parsed.data.recovery_phase,
    notes: parsed.data.notes ?? null,
  });
  if (error) return { message: error.message };

  revalidatePath("/injuries");
  return {};
}

const UpdatePhaseSchema = z.object({
  id: z.uuid(),
  recovery_phase: z.enum(PHASES),
});

export async function updateInjuryPhase(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = UpdatePhaseSchema.safeParse({
    id: formData.get("id"),
    recovery_phase: formData.get("recovery_phase"),
  });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("injuries")
    .update({
      recovery_phase: parsed.data.recovery_phase,
      phase_updated: new Date().toISOString(),
    })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  revalidatePath("/injuries");
}

export async function deleteInjury(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("injuries").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/injuries");
}
