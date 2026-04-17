import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ChallengeStatus,
  ChallengeTier,
} from "@/lib/domain/challenges";

export type ChallengeRow = {
  id: string;
  type: "lifetime_volume" | "exercise_volume" | "custom";
  title: string;
  exercise_id: string | null;
  exercise_name: string | null;
  tiers: ChallengeTier[];
  current_tier_index: number;
  accumulated_volume_lbs: number;
  status: ChallengeStatus;
  challenge_start_date: string;
  challenge_end_date: string | null;
};

function normalizeTiers(raw: unknown): ChallengeTier[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((t, i) => {
    const tier = t as Partial<ChallengeTier>;
    return {
      name: typeof tier.name === "string" ? tier.name : `Tier ${i + 1}`,
      target_volume_lbs: Number(tier.target_volume_lbs ?? 0),
      ordinal: Number(tier.ordinal ?? i),
    };
  });
}

export const listChallenges = cache(async (): Promise<ChallengeRow[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("challenges")
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });
  type Raw = Omit<ChallengeRow, "tiers" | "accumulated_volume_lbs"> & {
    tiers: unknown;
    accumulated_volume_lbs: string | number;
  };
  return ((data as Raw[] | null) ?? []).map((r) => ({
    ...r,
    tiers: normalizeTiers(r.tiers),
    accumulated_volume_lbs:
      typeof r.accumulated_volume_lbs === "string"
        ? parseFloat(r.accumulated_volume_lbs)
        : r.accumulated_volume_lbs,
  }));
});

export const getChallenge = cache(async (id: string): Promise<ChallengeRow | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  type Raw = Omit<ChallengeRow, "tiers" | "accumulated_volume_lbs"> & {
    tiers: unknown;
    accumulated_volume_lbs: string | number;
  };
  const r = data as Raw;
  return {
    ...r,
    tiers: normalizeTiers(r.tiers),
    accumulated_volume_lbs:
      typeof r.accumulated_volume_lbs === "string"
        ? parseFloat(r.accumulated_volume_lbs)
        : r.accumulated_volume_lbs,
  };
});
