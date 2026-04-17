"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const SettingsSchema = z.object({
  average_cycle_length_days: z.coerce.number().int().min(14).max(60),
  average_period_length_days: z.coerce.number().int().min(1).max(14),
  luteal_phase_length_days: z.coerce.number().int().min(7).max(20),
});

export async function saveCycleSettings(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = SettingsSchema.safeParse({
    average_cycle_length_days: formData.get("average_cycle_length_days"),
    average_period_length_days: formData.get("average_period_length_days"),
    luteal_phase_length_days: formData.get("luteal_phase_length_days"),
  });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("cycle_settings")
    .upsert({ user_id: user.id, ...parsed.data }, { onConflict: "user_id" });

  revalidatePath("/cycle");
}

const PeriodSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  notes: z.string().trim().max(280).optional(),
});

export async function logPeriod(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = PeriodSchema.safeParse({
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("period_logs").insert({
    user_id: user.id,
    start_date: parsed.data.start_date,
    end_date: parsed.data.end_date ?? null,
    notes: parsed.data.notes ?? null,
  });

  revalidatePath("/cycle");
}

export async function deletePeriod(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("period_logs").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/cycle");
}
