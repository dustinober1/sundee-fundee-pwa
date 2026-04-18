import { z } from "zod";

// Shared Zod schema + payload helper for program templates.
// Consumed by both the admin creator (src/app/admin/programs/new/actions.ts)
// and the user builder (src/app/programs/builder/actions.ts).

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

export type CreateProgramInput = z.infer<typeof CreateProgramSchema>;

export type TemplatePayload = {
  name: string;
  description: string;
  duration_weeks: number;
  sessions_per_week: number;
  phases: Array<{ name: string; start_week: number; end_week: number }>;
  weeks: Array<{
    week_num: number;
    sessions: Array<{
      label: string;
      exercises: Array<{
        exercise_id: string;
        sets: number;
        reps: number;
        pct_1rm: number; // decimal form (0.01..1.0)
      }>;
    }>;
  }>;
};

/**
 * Normalize a parsed CreateProgramInput into the shape we persist: pct_1rm
 * converts from percentage integer (1..100) to decimal (0.01..1.0), and
 * description falls back to an empty string.
 */
export function buildTemplatePayload(input: CreateProgramInput): TemplatePayload {
  return {
    name: input.name,
    description: input.description ?? "",
    duration_weeks: input.duration_weeks,
    sessions_per_week: input.sessions_per_week,
    phases: input.phases.map((p) => ({
      name: p.name,
      start_week: p.start_week,
      end_week: p.end_week,
    })),
    weeks: input.weeks.map((w) => ({
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
    })),
  };
}
