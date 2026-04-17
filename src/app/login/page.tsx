import Link from "next/link";
import { LoginForm } from "./LoginForm";

type SearchParams = Promise<{ next?: string; error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next, error } = await searchParams;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="font-display text-gold uppercase tracking-[0.4em] text-xs"
        >
          Sundee Fundee
        </Link>
        <h1 className="font-display mt-4 text-4xl font-semibold">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to log workouts, track maxes, and see today&apos;s readiness.
        </p>

        {error ? (
          <p className="mt-6 rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
            {decodeURIComponent(error)}
          </p>
        ) : null}

        <LoginForm next={next} />

        <p className="mt-8 text-xs text-muted">
          By continuing you agree to the terms of use.
        </p>
      </div>
    </main>
  );
}
