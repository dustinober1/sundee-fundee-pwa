import { redirect } from "next/navigation";
import { requireUser, getUserProfile } from "@/lib/supabase/dal";
import { OnboardingForm } from "./OnboardingForm";

export default async function OnboardingPage() {
  await requireUser();
  const profile = await getUserProfile();
  if (profile?.onboarded_at) redirect("/dashboard");

  return (
    <main className="flex flex-1 justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <p className="font-display text-gold uppercase tracking-[0.4em] text-xs">
          Welcome
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold">
          Tell us about you
        </h1>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll tune recommendations to your level and goals. You can change
          everything later in settings.
        </p>

        <OnboardingForm
          defaults={{
            display_name: profile?.display_name ?? "",
            weight_unit: profile?.weight_unit ?? "lb",
            cycle_tracking_enabled: profile?.cycle_tracking_enabled ?? false,
          }}
        />
      </div>
    </main>
  );
}
