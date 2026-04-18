"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const Schema = z.object({ id: z.uuid() });

export async function dismissRecommendation(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = Schema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("coach_recommendations")
    .update({ dismissed_at: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}

export async function markActed(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = Schema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("coach_recommendations")
    .update({ acted_at: new Date().toISOString() })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}
