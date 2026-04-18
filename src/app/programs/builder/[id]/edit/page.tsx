import { notFound, redirect } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  AdminProgramForm,
  type ProgramFormInitial,
} from "@/app/admin/programs/new/AdminProgramForm";
import {
  getProgramTemplate,
  canEditTemplate,
} from "@/features/programs/queries";
import { updateUserProgram } from "../../actions";

type Params = Promise<{ id: string }>;

type RawSessionExercise = {
  exercise_id: string;
  sets: number;
  reps: number;
  pct_1rm: number;
};

export default async function EditUserProgramPage({ params }: { params: Params }) {
  const { user } = await requireOnboardedProfile();
  const { id } = await params;

  const template = await getProgramTemplate(id);
  if (!template) notFound();
  if (!canEditTemplate(user.id, template)) redirect("/programs");

  // Resolve exercise names for the initial state — the form needs display
  // names alongside exercise_ids.
  const exerciseIds = Array.from(
    new Set(
      template.weeks.flatMap((w) =>
        w.sessions.flatMap((s) =>
          (s.exercises as RawSessionExercise[]).map((e) => e.exercise_id),
        ),
      ),
    ),
  );

  const nameById = new Map<string, string>();
  if (exerciseIds.length > 0) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("exercises")
      .select("id, name")
      .in("id", exerciseIds);
    for (const r of (data as { id: string; name: string }[] | null) ?? []) {
      nameById.set(r.id, r.name);
    }
  }

  const initial: ProgramFormInitial = {
    name: template.name,
    description: template.description,
    duration_weeks: template.duration_weeks,
    sessions_per_week: template.sessions_per_week,
    phases: template.phases,
    weeks: template.weeks.map((w) => ({
      sessions: w.sessions.map((s) => ({
        label: s.label,
        exercises: (s.exercises as RawSessionExercise[]).map((e) => ({
          exercise_id: e.exercise_id,
          exercise_name: nameById.get(e.exercise_id) ?? "",
          sets: e.sets,
          reps: e.reps,
          pct_1rm: e.pct_1rm,
        })),
      })),
    })),
  };

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <AdminProgramForm
          action={updateUserProgram}
          initial={initial}
          title="Edit Program"
          description="Update phases, weeks, or exercises. Changes apply to any future enrollments of this plan."
          submitLabel="Save changes"
          pendingLabel="Saving…"
          backHref="/programs"
          backLabel="← Programs"
          extraFields={[{ name: "template_id", value: template.id }]}
        />
      </div>
    </main>
  );
}
