"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EQUIPMENT_PROFILE_KEYS } from "@/lib/domain/equipmentProfiles";

const Schema = z.object({
  display_name: z.string().trim().min(1).max(80),
  weight_unit: z.enum(["lb", "kg"]),
  experience_level: z.enum(["beginner", "intermediate", "advanced"]),
  primary_goal: z.enum(["strength", "hypertrophy", "endurance", "general_fitness"]),
  cycle_tracking_enabled: z.coerce.boolean(),
  equipment_profile: z
    .enum([...EQUIPMENT_PROFILE_KEYS, "skip"])
    .transform((v) => (v === "skip" ? null : v)),
});

export type SettingsState = {
  errors?: Record<string, string[]>;
  message?: string;
  ok?: boolean;
};

export async function saveProfile(
  _prev: SettingsState | undefined,
  formData: FormData,
): Promise<SettingsState> {
  const user = await requireUser();
  const parsed = Schema.safeParse({
    display_name: formData.get("display_name"),
    weight_unit: formData.get("weight_unit"),
    experience_level: formData.get("experience_level"),
    primary_goal: formData.get("primary_goal"),
    cycle_tracking_enabled: formData.get("cycle_tracking_enabled") === "on",
    equipment_profile: formData.get("equipment_profile") ?? "skip",
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("user_profiles")
    .update(parsed.data)
    .eq("id", user.id);
  if (error) return { message: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
