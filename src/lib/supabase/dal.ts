import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";
import type { UserProfileRow } from "./types";

export const getSessionUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export const getUserProfile = cache(async (): Promise<UserProfileRow | null> => {
  const user = await getSessionUser();
  if (!user) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return (data as UserProfileRow | null) ?? null;
});

export async function requireOnboardedProfile() {
  const user = await requireUser();
  const profile = await getUserProfile();
  if (!profile || !profile.onboarded_at) redirect("/onboarding");
  return { user, profile };
}
