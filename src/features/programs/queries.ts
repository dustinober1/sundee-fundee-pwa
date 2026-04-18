import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  currentPhaseForWeek,
  type ProgramPhase,
  type ProgramWeek,
} from "@/lib/domain/programs";

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

export type ProgramTemplateDetail = ProgramTemplate & {
  phases: ProgramPhase[];
  weeks: ProgramWeek[];
};

export type EnrolledProgram = {
  id: string;
  template_id: string;
  template_name: string;
  is_active: boolean;
  started_on: string;
  completed_on: string | null;
  current_week: number;
  current_phase_name: string | null;
  template_duration_weeks: number;
};

export const listProgramTemplates = cache(async (): Promise<ProgramTemplate[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("program_templates")
    .select("id, name, category, description, difficulty, duration_weeks, sessions_per_week, sort_order")
    .order("sort_order", { ascending: true });
  return (data as ProgramTemplate[] | null) ?? [];
});

export const getProgramTemplate = cache(
  async (id: string): Promise<ProgramTemplateDetail | null> => {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("program_templates")
      .select(
        "id, name, category, description, difficulty, duration_weeks, sessions_per_week, sort_order, phases, weeks",
      )
      .eq("id", id)
      .maybeSingle();

    if (!data) return null;

    type Raw = ProgramTemplate & {
      phases: ProgramPhase[] | string | null;
      weeks: ProgramWeek[] | string | null;
    };
    const r = data as Raw;
    const phases: ProgramPhase[] = Array.isArray(r.phases)
      ? r.phases
      : typeof r.phases === "string"
        ? (JSON.parse(r.phases) as ProgramPhase[])
        : [];
    const weeks: ProgramWeek[] = Array.isArray(r.weeks)
      ? r.weeks
      : typeof r.weeks === "string"
        ? (JSON.parse(r.weeks) as ProgramWeek[])
        : [];
    return {
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description,
      difficulty: r.difficulty,
      duration_weeks: r.duration_weeks,
      sessions_per_week: r.sessions_per_week,
      sort_order: r.sort_order,
      phases,
      weeks,
    };
  },
);

export const getActiveEnrollment = cache(async (): Promise<EnrolledProgram | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("enrolled_programs")
    .select(
      "id, template_id, is_active, started_on, completed_on, current_week, program_templates ( name, phases, duration_weeks )",
    )
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return null;
  type RawTemplate = { name: string; phases: ProgramPhase[] | string | null; duration_weeks: number };
  type Raw = Omit<EnrolledProgram, "template_name" | "current_phase_name" | "template_duration_weeks"> & {
    program_templates: RawTemplate | RawTemplate[] | null;
  };
  const r = data as Raw;
  const tpl = Array.isArray(r.program_templates)
    ? (r.program_templates[0] ?? null)
    : r.program_templates;
  const name = tpl?.name ?? "";
  const durationWeeks = tpl?.duration_weeks ?? 0;
  const rawPhases = tpl?.phases;
  const phases: ProgramPhase[] = Array.isArray(rawPhases)
    ? rawPhases
    : typeof rawPhases === "string"
      ? (JSON.parse(rawPhases) as ProgramPhase[])
      : [];
  const phase = currentPhaseForWeek(phases, r.current_week);
  return {
    id: r.id,
    template_id: r.template_id,
    template_name: name,
    is_active: r.is_active,
    started_on: r.started_on,
    completed_on: r.completed_on,
    current_week: r.current_week,
    current_phase_name: phase?.name ?? null,
    template_duration_weeks: durationWeeks,
  };
});
