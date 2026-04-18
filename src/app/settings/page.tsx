import Link from "next/link";
import { requireOnboardedProfile } from "@/lib/supabase/dal";
import { signOut } from "@/app/auth/actions";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const { profile } = await requireOnboardedProfile();

  return (
    <main className="flex flex-1 flex-col px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/dashboard"
          className="text-xs text-muted underline-offset-4 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="font-display mt-3 text-4xl font-semibold">Settings</h1>

        <SettingsForm
          defaults={{
            display_name: profile.display_name ?? "",
            weight_unit: profile.weight_unit,
            experience_level: profile.experience_level ?? "intermediate",
            primary_goal: profile.primary_goal ?? "general_fitness",
            cycle_tracking_enabled: profile.cycle_tracking_enabled,
            equipment_profile: profile.equipment_profile,
          }}
        />

        <section className="mt-10 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Data</h2>
          <Link
            href="/insights/export"
            className="mt-2 inline-block text-sm text-navy underline-offset-4 hover:underline"
          >
            Export your data (CSV)
          </Link>
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Account</h2>
          <form action={signOut} className="mt-2">
            <button
              type="submit"
              className="text-sm text-recovery-risk underline-offset-4 hover:underline"
            >
              Sign out
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
