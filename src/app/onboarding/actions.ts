"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/dal";
import { EQUIPMENT_PROFILE_KEYS } from "@/lib/domain/equipmentProfiles";

const Schema = z.object({
  display_name: z.string().trim().min(1, "Name is required").max(80),
  experience_level: z.enum(["beginner", "intermediate", "advanced"]),
  primary_goal: z.enum(["strength", "hypertrophy", "endurance", "general_fitness"]),
  weight_unit: z.enum(["lb", "kg"]),
  cycle_tracking_enabled: z.coerce.boolean(),
  equipment_profile: z
    .enum([...EQUIPMENT_PROFILE_KEYS, "skip"])
    .transform((v) => (v === "skip" ? null : v)),
});

export type OnboardingState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function completeOnboarding(
  _prev: OnboardingState | undefined,
  formData: FormData,
): Promise<OnboardingState> {
  const user = await requireUser();

  const parsed = Schema.safeParse({
    display_name: formData.get("display_name"),
    experience_level: formData.get("experience_level"),
    primary_goal: formData.get("primary_goal"),
    weight_unit: formData.get("weight_unit"),
    cycle_tracking_enabled: formData.get("cycle_tracking_enabled") === "on",
    equipment_profile: formData.get("equipment_profile") ?? "skip",
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({
      display_name: parsed.data.display_name,
      experience_level: parsed.data.experience_level,
      primary_goal: parsed.data.primary_goal,
      weight_unit: parsed.data.weight_unit,
      cycle_tracking_enabled: parsed.data.cycle_tracking_enabled,
      equipment_profile: parsed.data.equipment_profile,
      onboarded_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { message: error.message };

  redirect("/dashboard");
}
