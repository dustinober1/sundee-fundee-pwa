import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { signOut } from "@/app/auth/actions";

export default async function DashboardPage() {
  const { profile } = await requireOnboardedProfile();

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <p className="font-display text-gold uppercase tracking-[0.4em] text-xs">
          Today
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold">
          Welcome back, {profile.display_name ?? "lifter"}.
        </h1>
        <p className="mt-2 text-sm text-muted">
          Recovery score and today&apos;s recommendation will live here once the
          recovery surface ships in Phase 4.
        </p>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card title="Workouts" body="Log a session or review history." href="/workouts" />
          <Card title="Maxes" body="Track 1RMs and PR history." href="/maxes" />
          <Card title="Programs" body="Browse and enroll in a program." href="/programs" />
          <Card title="Settings" body="Profile, units, cycle tracking." href="/settings" />
        </section>

        <form action={signOut} className="mt-12">
          <button
            type="submit"
            className="text-sm text-muted underline-offset-4 hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}

function Card({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:bg-cream"
    >
      <p className="font-display text-xl font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </a>
  );
}
