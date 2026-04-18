import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import {
  getActiveEnrollment,
  getProgramTemplate,
} from "@/features/programs/queries";
import { listExercisesByIds } from "@/features/exercises/queries";
import { enrollInProgram } from "../actions";

type Params = Promise<{ id: string }>;

export default async function ProgramDetailPage({
  params,
}: {
  params: Params;
}) {
  await requireOnboardedProfile();
  const { id } = await params;

  const [template, active] = await Promise.all([
    getProgramTemplate(id),
    getActiveEnrollment(),
  ]);
  if (!template) notFound();

  const firstWeek = template.weeks[0] ?? null;
  const exerciseIds = Array.from(
    new Set(
      (firstWeek?.sessions ?? []).flatMap((s) =>
        s.exercises.map((e) => e.exercise_id),
      ),
    ),
  );
  const exerciseRows = await listExercisesByIds(exerciseIds);
  const nameById = new Map(exerciseRows.map((e) => [e.id, e.name]));

  const isEnrolledHere = active?.template_id === template.id;
  const hasOtherEnrollment = active && !isEnrolledHere;

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/programs"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Programs
        </Link>

        <header className="mt-3">
          <h1 className="font-display text-4xl font-semibold">{template.name}</h1>
          <p className="mt-1 text-xs text-muted uppercase tracking-widest">
            {template.difficulty} · {template.category}
          </p>
          <p className="mt-3 text-sm text-navy/80">{template.description}</p>
          <p className="mt-2 text-xs text-muted">
            {template.duration_weeks} weeks · {template.sessions_per_week}× per
            week
          </p>
        </header>

        {template.phases.length > 0 ? (
          <section className="mt-8">
            <h2 className="font-display text-gold uppercase tracking-[0.3em] text-xs">
              Phases
            </h2>
            <ul className="mt-3 space-y-2">
              {template.phases.map((p) => (
                <li
                  key={p.name}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <p className="font-display text-base font-semibold">
                    {p.name}
                  </p>
                  <p className="text-xs text-muted">
                    Weeks {p.start_week}
                    {p.start_week !== p.end_week ? `–${p.end_week}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {firstWeek ? (
          <section className="mt-8">
            <h2 className="font-display text-gold uppercase tracking-[0.3em] text-xs">
              Week 1 preview
            </h2>
            <div className="mt-3 space-y-3">
              {firstWeek.sessions.map((s, sIdx) => (
                <article
                  key={`${s.label}-${sIdx}`}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <h3 className="font-display text-lg font-semibold">
                    {s.label}
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm font-mono">
                    {s.exercises.map((e, eIdx) => (
                      <li
                        key={`${e.exercise_id}-${eIdx}`}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {nameById.get(e.exercise_id) ?? "Exercise"}
                        </span>
                        <span className="text-muted">
                          {e.sets}×{e.reps} @ {Math.round(e.pct_1rm * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          {isEnrolledHere ? (
            <div className="rounded-2xl border border-gold bg-surface p-5">
              <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
                Currently enrolled
              </p>
              <Link
                href="/programs/enrolled"
                className="mt-3 inline-flex h-10 items-center rounded-lg bg-orange px-4 text-sm font-medium text-cream hover:opacity-90"
              >
                Open enrolled view
              </Link>
            </div>
          ) : (
            <form action={enrollInProgram}>
              <input type="hidden" name="template_id" value={template.id} />
              {hasOtherEnrollment ? (
                <p className="mb-3 text-xs text-recovery-risk">
                  You are enrolled in <strong>{active?.template_name}</strong>.
                  Starting this program will end that enrollment.
                </p>
              ) : null}
              <button
                type="submit"
                className="h-11 rounded-lg bg-orange px-5 text-sm font-medium text-cream hover:opacity-90"
              >
                {hasOtherEnrollment ? "Switch to this program" : "Enroll"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
