import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProgramTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: string;
  duration_weeks: number;
  sessions_per_week: number;
  sort_order: number;
};

export type EnrolledProgram = {
  id: string;
  template_id: string;
  template_name: string;
  is_active: boolean;
  started_on: string;
  completed_on: string | null;
  current_week: number;
};

export const listProgramTemplates = cache(async (): Promise<ProgramTemplate[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("program_templates")
    .select("id, name, category, description, difficulty, duration_weeks, sessions_per_week, sort_order")
    .order("sort_order", { ascending: true });
  return (data as ProgramTemplate[] | null) ?? [];
});

export const getActiveEnrollment = cache(async (): Promise<EnrolledProgram | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("enrolled_programs")
    .select(
      "id, template_id, is_active, started_on, completed_on, current_week, program_templates ( name )",
    )
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return null;
  type Raw = Omit<EnrolledProgram, "template_name"> & {
    program_templates: { name: string } | { name: string }[] | null;
  };
  const r = data as Raw;
  const name = Array.isArray(r.program_templates)
    ? (r.program_templates[0]?.name ?? "")
    : (r.program_templates?.name ?? "");
  return {
    id: r.id,
    template_id: r.template_id,
    template_name: name,
    is_active: r.is_active,
    started_on: r.started_on,
    completed_on: r.completed_on,
    current_week: r.current_week,
  };
});
