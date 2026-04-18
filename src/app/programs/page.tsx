import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import {
  getActiveEnrollment,
  listProgramTemplates,
} from "@/features/programs/queries";
import { enrollInProgram } from "./actions";

export default async function ProgramsPage() {
  const { profile } = await requireOnboardedProfile();
  const [templates, active] = await Promise.all([
    listProgramTemplates(),
    getActiveEnrollment(),
  ]);

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        {profile.is_admin ? (
          <Link
            href="/admin/programs/new"
            className="mt-1 block text-xs text-muted underline-offset-4 hover:underline"
          >
            New Template →
          </Link>
        ) : null}
        <h1 className="font-display mt-3 text-4xl font-semibold">Programs</h1>
        <p className="mt-2 text-sm text-muted">
          Multi-week training plans. Enroll in one to track progress week by week.
        </p>

        {active ? (
          <div className="mt-6 rounded-2xl border border-gold bg-surface p-5">
            <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
              Active
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              {active.template_name}
            </p>
            <p className="mt-1 text-sm text-muted">
              Week {active.current_week}
            </p>
            <Link
              href="/programs/enrolled"
              className="mt-3 inline-flex h-10 items-center rounded-lg bg-orange px-4 text-sm font-medium text-cream hover:opacity-90"
            >
              Open
            </Link>
          </div>
        ) : null}

        <ul className="mt-8 space-y-3">
          {templates.map((t) => (
            <li
              key={t.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <header className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-lg font-semibold">{t.name}</h2>
                <span className="text-xs text-muted uppercase tracking-widest">
                  {t.difficulty}
                </span>
              </header>
              <p className="mt-1 text-sm text-muted">{t.description}</p>
              <p className="mt-2 text-xs text-muted">
                {t.duration_weeks} weeks · {t.sessions_per_week}× per week ·{" "}
                {t.category}
              </p>
              {!active || active.template_id !== t.id ? (
                <form action={enrollInProgram} className="mt-3">
                  <input type="hidden" name="template_id" value={t.id} />
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center rounded-lg bg-orange px-4 text-sm font-medium text-cream hover:opacity-90"
                  >
                    Enroll
                  </button>
                </form>
              ) : (
                <p className="mt-3 text-xs text-recovery-good">Currently enrolled</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
