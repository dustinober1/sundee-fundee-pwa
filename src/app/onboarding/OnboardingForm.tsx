"use client";

import { useActionState } from "react";
import { completeOnboarding, type OnboardingState } from "./actions";
import { EQUIPMENT_PROFILES } from "@/lib/domain/equipmentProfiles";

const EXPERIENCE = [
  { value: "beginner", label: "Beginner", hint: "< 1 year" },
  { value: "intermediate", label: "Intermediate", hint: "1–3 years" },
  { value: "advanced", label: "Advanced", hint: "3+ years" },
] as const;

const GOALS = [
  { value: "strength", label: "Strength" },
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "endurance", label: "Endurance" },
  { value: "general_fitness", label: "General fitness" },
] as const;

const EQUIPMENT = [
  { value: "commercial_gym", label: EQUIPMENT_PROFILES.commercial_gym.label, hint: "Machines, dumbbells, cables" },
  { value: "full_gym", label: EQUIPMENT_PROFILES.full_gym.label, hint: "Everything, including barbell & rack" },
  { value: "home_barbell", label: EQUIPMENT_PROFILES.home_barbell.label, hint: "Rack, bench, plates" },
  { value: "home_dumbbell", label: EQUIPMENT_PROFILES.home_dumbbell.label, hint: "Dumbbells + bench" },
  { value: "bodyweight", label: EQUIPMENT_PROFILES.bodyweight.label, hint: "Minimal kit" },
  { value: "skip", label: "Skip / varies", hint: "Show all exercises" },
] as const;

type Defaults = {
  display_name: string;
  weight_unit: "lb" | "kg";
  cycle_tracking_enabled: boolean;
};

export function OnboardingForm({ defaults }: { defaults: Defaults }) {
  const [state, action, pending] = useActionState<OnboardingState | undefined, FormData>(
    completeOnboarding,
    undefined,
  );

  return (
    <form action={action} className="mt-8 space-y-6">
      <Field label="Display name" error={state?.errors?.display_name?.[0]}>
        <input
          name="display_name"
          required
          defaultValue={defaults.display_name}
          className="block w-full h-12 rounded-lg border border-border bg-surface px-5 focus:border-navy focus:outline-none"
        />
      </Field>

      <Field label="Experience level" error={state?.errors?.experience_level?.[0]}>
        <RadioGroup name="experience_level" options={EXPERIENCE} />
      </Field>

      <Field label="Primary goal" error={state?.errors?.primary_goal?.[0]}>
        <RadioGroup name="primary_goal" options={GOALS} />
      </Field>

      <Field
        label="Where do you usually train?"
        error={state?.errors?.equipment_profile?.[0]}
      >
        <RadioGroup name="equipment_profile" options={EQUIPMENT} defaultValue="skip" />
      </Field>

      <Field label="Weight unit" error={state?.errors?.weight_unit?.[0]}>
        <RadioGroup
          name="weight_unit"
          defaultValue={defaults.weight_unit}
          options={[
            { value: "lb", label: "Pounds" },
            { value: "kg", label: "Kilograms" },
          ]}
        />
      </Field>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          name="cycle_tracking_enabled"
          defaultChecked={defaults.cycle_tracking_enabled}
          className="h-5 w-5 accent-navy"
        />
        Enable cycle phase awareness
      </label>

      {state?.message ? (
        <p className="rounded-lg border border-recovery-risk/40 bg-recovery-risk/10 p-3 text-sm text-recovery-risk">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full h-12 items-center justify-center rounded-lg bg-orange font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-navy">{label}</p>
      {children}
      {error ? <p className="text-sm text-recovery-risk">{error}</p> : null}
    </div>
  );
}

function RadioGroup<T extends string>({
  name,
  options,
  defaultValue,
}: {
  name: string;
  defaultValue?: T;
  options: readonly { value: T; label: string; hint?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm has-[:checked]:border-navy has-[:checked]:bg-cream"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            required
            defaultChecked={defaultValue === opt.value}
            className="h-4 w-4 accent-navy"
          />
          <span className="flex-1">{opt.label}</span>
          {opt.hint ? <span className="text-xs text-muted">{opt.hint}</span> : null}
        </label>
      ))}
    </div>
  );
}
