"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import * as ChallengeDomain from "@/lib/domain/challenges";

const CreateSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("lifetime_volume"),
    title: z.string().trim().min(1).max(120),
  }),
  z.object({
    type: z.literal("exercise_volume"),
    title: z.string().trim().min(1).max(120),
    exercise_id: z.uuid(),
    exercise_name: z.string().trim().min(1).max(120),
  }),
  z.object({
    type: z.literal("custom"),
    title: z.string().trim().min(1).max(120),
    target_volume_lbs: z.coerce.number().positive(),
    challenge_end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  }),
]);

export type CreateChallengeState = {
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createChallenge(
  _prev: CreateChallengeState | undefined,
  formData: FormData,
): Promise<CreateChallengeState> {
  const user = await requireUser();
  const type = formData.get("type");

  const raw: Record<string, FormDataEntryValue | string | null> = {
    type,
    title: formData.get("title"),
  };
  if (type === "exercise_volume") {
    raw.exercise_id = formData.get("exercise_id");
    raw.exercise_name = formData.get("exercise_name");
  } else if (type === "custom") {
    raw.target_volume_lbs = formData.get("target_volume_lbs");
    const end = formData.get("challenge_end_date");
    if (end) raw.challenge_end_date = end;
  }

  const parsed = CreateSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  let tiers: ChallengeDomain.ChallengeTier[];
  let exerciseId: string | null = null;
  let exerciseName: string | null = null;
  let endDate: string | null = null;

  switch (parsed.data.type) {
    case "lifetime_volume":
      tiers = ChallengeDomain.DEFAULT_LIFETIME_TIERS;
      break;
    case "exercise_volume":
      tiers = ChallengeDomain.DEFAULT_PER_EXERCISE_TIERS;
      exerciseId = parsed.data.exercise_id;
      exerciseName = parsed.data.exercise_name;
      break;
    case "custom":
      tiers = [
        { name: "Goal", target_volume_lbs: parsed.data.target_volume_lbs, ordinal: 0 },
      ];
      endDate = parsed.data.challenge_end_date ?? null;
      break;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("challenges").insert({
    user_id: user.id,
    type: parsed.data.type,
    title: parsed.data.title,
    exercise_id: exerciseId,
    exercise_name: exerciseName,
    tiers,
    challenge_end_date: endDate,
  });
  if (error) return { message: error.message };

  revalidatePath("/challenges");
  redirect("/challenges");
}

const AddVolumeSchema = z.object({
  id: z.uuid(),
  volume_lbs: z.coerce.number().positive(),
});

export async function addVolumeToChallenge(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = AddVolumeSchema.safeParse({
    id: formData.get("id"),
    volume_lbs: formData.get("volume_lbs"),
  });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("challenges")
    .select("tiers, current_tier_index, accumulated_volume_lbs")
    .eq("id", parsed.data.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return;

  type Raw = {
    tiers: unknown;
    current_tier_index: number;
    accumulated_volume_lbs: string | number;
  };
  const row = data as Raw;
  const tiers = (Array.isArray(row.tiers) ? row.tiers : []) as ChallengeDomain.ChallengeTier[];
  const currentVolume =
    typeof row.accumulated_volume_lbs === "string"
      ? parseFloat(row.accumulated_volume_lbs)
      : row.accumulated_volume_lbs;
  const newVolume = currentVolume + parsed.data.volume_lbs;

  const advance = ChallengeDomain.advanceTier(tiers, row.current_tier_index, newVolume);

  await supabase
    .from("challenges")
    .update({
      accumulated_volume_lbs: newVolume,
      current_tier_index: advance.currentTierIndex,
      status: advance.status,
    })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  revalidatePath("/challenges");
  revalidatePath(`/challenges/${parsed.data.id}`);
}

export async function deleteChallenge(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("challenges").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/challenges");
  redirect("/challenges");
}
