"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import {
  CreateProgramSchema,
  buildTemplatePayload,
} from "@/features/programs/templateSchema";

export type CreateProgramState = {
  errors?: Record<string, string[]>;
  message?: string;
};

// Re-export for any external callers still referencing this module.
export { CreateProgramSchema };

export async function createProgramTemplate(
  _prev: CreateProgramState | undefined,
  formData: FormData,
): Promise<CreateProgramState> {
  await requireAdmin();

  let payload: unknown;
  try {
    const raw = formData.get("payload");
    if (typeof raw !== "string") throw new Error("missing payload");
    payload = JSON.parse(raw);
  } catch {
    return { message: "Invalid form data. Please try again." };
  }

  const parsed = CreateProgramSchema.safeParse(payload);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const tpl = buildTemplatePayload(parsed.data);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("program_templates").insert({
    id: randomUUID(), // id column has no DB default — must supply
    name: tpl.name,
    description: tpl.description,
    duration_weeks: tpl.duration_weeks,
    sessions_per_week: tpl.sessions_per_week,
    phases: tpl.phases,
    weeks: tpl.weeks,
    category: "Custom",
    difficulty: "Intermediate",
    is_predefined: false,
    sort_order: 0,
    owner_user_id: null,
  });

  if (error)
    return {
      message: error.message ?? "Failed to create program. Please try again.",
    };

  revalidatePath("/programs");
  redirect("/programs");
}

// Server Action callable from Client Components — cannot live in queries.ts
// because that file uses "server-only".
export async function searchExercises(
  query: string,
): Promise<{ id: string; name: string }[]> {
  if (!query || query.length < 2) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("exercises")
    .select("id, name")
    .ilike("name", `%${query}%`)
    .order("name", { ascending: true })
    .limit(10);
  return (data as { id: string; name: string }[] | null) ?? [];
}
