import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import {
  getActiveEnrollment,
  listProgramTemplates,
  listUserOwnedPrograms,
} from "@/features/programs/queries";
import { enrollInProgram } from "./actions";
import { cloneTemplate, deleteUserProgram } from "./builder/actions";

export default async function ProgramsPage() {
  const { user, profile } = await requireOnboardedProfile();
  const [templates, mine, active] = await Promise.all([
    listProgramTemplates(),
    listUserOwnedPrograms(user.id),
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
            New Admin Template →
          </Link>
        ) : null}
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <h1 className="font-display text-4xl font-semibold">Programs</h1>
          <Link
            href="/programs/builder/new"
            className="inline-flex h-10 items-center rounded-lg border border-navy px-4 text-sm font-medium text-navy hover:bg-navy hover:text-cream"
          >
            + Create program
          </Link>
        </div>
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

        {mine.length > 0 ? (
          <section className="mt-8">
            <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
              My programs
            </p>
            <ul className="mt-3 space-y-3">
              {mine.map((t) => (
                <li
                  key={t.id}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <header className="flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-lg font-semibold">
                      <Link
                        href={`/programs/${t.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {t.name}
                      </Link>
                    </h2>
                    <span className="text-xs text-muted uppercase tracking-widest">
                      Custom
                    </span>
                  </header>
                  {t.description ? (
                    <p className="mt-1 text-sm text-muted">{t.description}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted">
                    {t.duration_weeks} weeks · {t.sessions_per_week}× per week
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/programs/builder/${t.id}/edit`}
                      className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-cream"
                    >
                      Edit
                    </Link>
                    {!active || active.template_id !== t.id ? (
                      <form action={enrollInProgram}>
                        <input type="hidden" name="template_id" value={t.id} />
                        <button
                          type="submit"
                          className="inline-flex h-10 items-center rounded-lg bg-orange px-4 text-sm font-medium text-cream hover:opacity-90"
                        >
                          Enroll
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-recovery-good">Currently enrolled</p>
                    )}
                    <form action={deleteUserProgram}>
                      <input type="hidden" name="template_id" value={t.id} />
                      <button
                        type="submit"
                        className="text-xs text-muted underline-offset-4 hover:text-recovery-risk hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-8">
          <p className="font-display text-gold uppercase tracking-[0.3em] text-xs">
            Templates
          </p>
          <ul className="mt-3 space-y-3">
            {templates.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <header className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold">
                    <Link
                      href={`/programs/${t.id}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {t.name}
                    </Link>
                  </h2>
                  <span className="text-xs text-muted uppercase tracking-widest">
                    {t.difficulty}
                  </span>
                </header>
                <p className="mt-1 text-sm text-muted">{t.description}</p>
                <p className="mt-2 text-xs text-muted">
                  {t.duration_weeks} weeks · {t.sessions_per_week}× per week ·{" "}
                  {t.category}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/programs/${t.id}`}
                    className="text-xs text-navy underline-offset-4 hover:underline"
                  >
                    View details →
                  </Link>
                  {!active || active.template_id !== t.id ? (
                    <form action={enrollInProgram}>
                      <input type="hidden" name="template_id" value={t.id} />
                      <button
                        type="submit"
                        className="inline-flex h-10 items-center rounded-lg bg-orange px-4 text-sm font-medium text-cream hover:opacity-90"
                      >
                        Enroll
                      </button>
                    </form>
                  ) : (
                    <p className="text-xs text-recovery-good">Currently enrolled</p>
                  )}
                  <form action={cloneTemplate}>
                    <input type="hidden" name="template_id" value={t.id} />
                    <button
                      type="submit"
                      className="text-xs text-navy underline-offset-4 hover:underline"
                    >
                      Clone & edit
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
