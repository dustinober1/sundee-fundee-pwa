"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PAIN_TYPES = [
  "acute",
  "chronic",
  "soreness",
  "stiffness",
  "sharp",
  "dull",
  "aching",
  "other",
] as const;

const Schema = z.object({
  performed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location_ids: z.array(z.string()).min(1),
  intensity: z.coerce.number().int().min(1).max(10),
  pain_type: z.enum(PAIN_TYPES),
  notes: z.string().trim().max(500).optional(),
});

export type LogPainState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function logPain(
  _prev: LogPainState | undefined,
  formData: FormData,
): Promise<LogPainState> {
  const user = await requireUser();
  const parsed = Schema.safeParse({
    performed_on: formData.get("performed_on"),
    location_ids: formData.getAll("location_ids").map(String),
    intensity: formData.get("intensity"),
    pain_type: formData.get("pain_type"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("daily_pain_logs").insert({
    user_id: user.id,
    performed_on: parsed.data.performed_on,
    location_ids: parsed.data.location_ids,
    intensity: parsed.data.intensity,
    pain_type: parsed.data.pain_type,
    notes: parsed.data.notes ?? null,
  });
  if (error) return { message: error.message };

  revalidatePath("/pain");
  return {};
}

export async function deletePain(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("daily_pain_logs").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/pain");
}
