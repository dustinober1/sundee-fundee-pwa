"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EnrollSchema = z.object({ template_id: z.string().min(1) });

export async function enrollInProgram(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = EnrollSchema.safeParse({ template_id: formData.get("template_id") });
  if (!parsed.success) return;

  const supabase = await createSupabaseServerClient();
  // Deactivate any existing active enrollment, then create the new one.
  await supabase
    .from("enrolled_programs")
    .update({ is_active: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  await supabase.from("enrolled_programs").insert({
    user_id: user.id,
    template_id: parsed.data.template_id,
    is_active: true,
  });

  revalidatePath("/programs");
  redirect("/programs/enrolled");
}

export async function endEnrollment(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("enrolled_programs")
    .update({
      is_active: false,
      completed_on: new Date().toISOString().slice(0, 10),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/programs");
  redirect("/programs");
}

export async function advanceWeek(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  const next = Number(formData.get("next_week"));
  if (typeof id !== "string" || !Number.isInteger(next) || next < 1) return;

  const supabase = await createSupabaseServerClient();
  await supabase
    .from("enrolled_programs")
    .update({ current_week: next })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/programs/enrolled");
}
