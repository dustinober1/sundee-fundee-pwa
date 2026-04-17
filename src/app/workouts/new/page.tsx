import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { NewWorkoutForm } from "./NewWorkoutForm";

export default async function NewWorkoutPage() {
  await requireOnboardedProfile();

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/workouts"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Workouts
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">New workout</h1>
        <p className="mt-2 text-sm text-muted">
          Start with a date and an optional name. You&apos;ll add exercises and
          sets next.
        </p>
        <NewWorkoutForm />
      </div>
    </main>
  );
}
