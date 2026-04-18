"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "crypto";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  CreateProgramSchema,
  buildTemplatePayload,
} from "@/features/programs/templateSchema";

export type ProgramBuilderState = {
  errors?: Record<string, string[]>;
  message?: string;
};

function parsePayload(formData: FormData): unknown {
  const raw = formData.get("payload");
  if (typeof raw !== "string") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function createUserProgram(
  _prev: ProgramBuilderState | undefined,
  formData: FormData,
): Promise<ProgramBuilderState> {
  const { user } = await requireOnboardedProfile();

  const payload = parsePayload(formData);
  if (payload === null) return { message: "Invalid form data. Please try again." };

  const parsed = CreateProgramSchema.safeParse(payload);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const tpl = buildTemplatePayload(parsed.data);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("program_templates").insert({
    id: randomUUID(),
    name: tpl.name,
    description: tpl.description,
    duration_weeks: tpl.duration_weeks,
    sessions_per_week: tpl.sessions_per_week,
    phases: tpl.phases,
    weeks: tpl.weeks,
    category: "Custom",
    difficulty: "Custom",
    is_predefined: false,
    sort_order: 0,
    owner_user_id: user.id,
  });

  if (error) {
    return { message: error.message ?? "Failed to save program." };
  }

  revalidatePath("/programs");
  redirect("/programs");
}

export async function updateUserProgram(
  _prev: ProgramBuilderState | undefined,
  formData: FormData,
): Promise<ProgramBuilderState> {
  const { user } = await requireOnboardedProfile();
  const templateId = formData.get("template_id");
  if (typeof templateId !== "string" || templateId.length === 0) {
    return { message: "Missing template id." };
  }

  const payload = parsePayload(formData);
  if (payload === null) return { message: "Invalid form data. Please try again." };

  const parsed = CreateProgramSchema.safeParse(payload);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const tpl = buildTemplatePayload(parsed.data);
  const supabase = await createSupabaseServerClient();

  // RLS enforces ownership, but scope the UPDATE explicitly for belt-and-suspenders.
  const { error, data } = await supabase
    .from("program_templates")
    .update({
      name: tpl.name,
      description: tpl.description,
      duration_weeks: tpl.duration_weeks,
      sessions_per_week: tpl.sessions_per_week,
      phases: tpl.phases,
      weeks: tpl.weeks,
    })
    .eq("id", templateId)
    .eq("owner_user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) return { message: error.message };
  if (!data) return { message: "Program not found or not editable." };

  revalidatePath("/programs");
  revalidatePath(`/programs/${templateId}`);
  redirect("/programs");
}

const CloneSchema = z.object({
  template_id: z.string().min(1),
});

export async function cloneTemplate(formData: FormData): Promise<void> {
  const { user } = await requireOnboardedProfile();
  const parsed = CloneSchema.safeParse({
    template_id: formData.get("template_id"),
  });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  const { data: source } = await supabase
    .from("program_templates")
    .select(
      "name, description, duration_weeks, sessions_per_week, phases, weeks, category, difficulty",
    )
    .eq("id", parsed.data.template_id)
    .maybeSingle();

  if (!source) return;

  const s = source as {
    name: string;
    description: string;
    duration_weeks: number;
    sessions_per_week: number;
    phases: unknown;
    weeks: unknown;
    category: string;
    difficulty: string;
  };

  const { data: inserted } = await supabase
    .from("program_templates")
    .insert({
      id: randomUUID(),
      name: `${s.name} (copy)`,
      description: s.description,
      duration_weeks: s.duration_weeks,
      sessions_per_week: s.sessions_per_week,
      phases: s.phases,
      weeks: s.weeks,
      category: s.category,
      difficulty: s.difficulty,
      is_predefined: false,
      sort_order: 0,
      owner_user_id: user.id,
    })
    .select("id")
    .maybeSingle();

  revalidatePath("/programs");
  if (inserted) {
    redirect(`/programs/builder/${(inserted as { id: string }).id}/edit`);
  }
  redirect("/programs");
}

export async function deleteUserProgram(formData: FormData): Promise<void> {
  const { user } = await requireOnboardedProfile();
  const id = formData.get("template_id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("program_templates")
    .delete()
    .eq("id", id)
    .eq("owner_user_id", user.id);

  revalidatePath("/programs");
}
