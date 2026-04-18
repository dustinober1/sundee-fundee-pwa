"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

// ── Zod schemas ──────────────────────────────────────────────────────────

const ExerciseSchema = z.object({
  exercise_id: z.string().uuid("exercise_id must be a UUID"),
  sets: z.coerce.number().int().min(1, "Sets must be at least 1"),
  reps: z.coerce.number().int().min(1, "Reps must be at least 1"),
  pct_1rm: z.coerce
    .number()
    .int()
    .min(1, "Enter a percentage between 1 and 100.")
    .max(100, "Enter a percentage between 1 and 100."),
});

const SessionSchema = z.object({
  label: z.string().min(1, "Session label is required."),
  exercises: z
    .array(ExerciseSchema)
    .min(1, "Each session must have at least one exercise."),
});

const PhaseSchema = z
  .object({
    name: z.string().min(1, "Phase name is required."),
    start_week: z.coerce.number().int().min(1),
    end_week: z.coerce.number().int().min(1),
  })
  .refine((d) => d.end_week >= d.start_week, {
    message: "End week must be after start week.",
  });

const WeekSchema = z.object({
  week_num: z.coerce.number().int().min(1),
  sessions: z.array(SessionSchema).min(1),
});

export const CreateProgramSchema = z.object({
  name: z.string().min(1, "Name is required.").max(120),
  description: z.string().max(1000).optional(),
  duration_weeks: z.coerce.number().int().min(1).max(52),
  sessions_per_week: z.coerce.number().int().min(1).max(7),
  phases: z.array(PhaseSchema).min(1, "At least one phase is required."),
  weeks: z.array(WeekSchema).min(1, "At least one week is required."),
});

export type CreateProgramState = {
  errors?: Record<string, string[]>;
  message?: string;
};

// ── createProgramTemplate ─────────────────────────────────────────────────

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

  const { name, description, duration_weeks, sessions_per_week, phases, weeks } =
    parsed.data;

  // Convert pct_1rm from integer (user input) to decimal (DB storage)
  const weeksJsonb = weeks.map((w) => ({
    week_num: w.week_num,
    sessions: w.sessions.map((s) => ({
      label: s.label,
      exercises: s.exercises.map((e) => ({
        exercise_id: e.exercise_id,
        sets: e.sets,
        reps: e.reps,
        pct_1rm: e.pct_1rm / 100,
      })),
    })),
  }));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("program_templates").insert({
    id: randomUUID(), // id column has no DB default — must supply
    name,
    description: description ?? "",
    duration_weeks,
    sessions_per_week,
    phases,
    weeks: weeksJsonb,
    category: "Custom", // NOT NULL, no default — hard-code per Pitfall 2
    difficulty: "Intermediate", // NOT NULL, no default — hard-code per Pitfall 2
    is_predefined: false, // admin-created templates are not predefined
    sort_order: 0,
  });

  if (error)
    return {
      message: error.message ?? "Failed to create program. Please try again.",
    };

  revalidatePath("/programs");
  redirect("/programs"); // throws — no code after this executes
}

// ── searchExercises ───────────────────────────────────────────────────────
// Server Action (NOT a feature query) — callable from Client Components.
// Cannot live in src/features/programs/queries.ts (has `import "server-only"`).

export async function searchExercises(
  query: string,
): Promise<{ id: string; name: string }[]> {
  await requireAdmin();
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
