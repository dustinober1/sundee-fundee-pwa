"use client";

import { useActionState } from "react";
import { saveProfile, type SettingsState } from "./actions";

type Defaults = {
  display_name: string;
  weight_unit: "lb" | "kg";
  experience_level: "beginner" | "intermediate" | "advanced";
  primary_goal: "strength" | "hypertrophy" | "endurance" | "general_fitness";
  cycle_tracking_enabled: boolean;
};

const GOALS = [
  { value: "strength", label: "Strength" },
  { value: "hypertrophy", label: "Hypertrophy" },
  { value: "endurance", label: "Endurance" },
  { value: "general_fitness", label: "General fitness" },
] as const;

const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export function SettingsForm({ defaults }: { defaults: Defaults }) {
  const [state, action, pending] = useActionState<SettingsState | undefined, FormData>(
    saveProfile,
    undefined,
  );

  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block text-sm">
        <span className="block font-medium text-navy">Display name</span>
        <input
          name="display_name"
          required
          maxLength={80}
          defaultValue={defaults.display_name}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
        />
      </label>

      <label className="block text-sm">
        <span className="block font-medium text-navy">Weight unit</span>
        <select
          name="weight_unit"
          defaultValue={defaults.weight_unit}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
        >
          <option value="lb">Pounds</option>
          <option value="kg">Kilograms</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="block font-medium text-navy">Experience level</span>
        <select
          name="experience_level"
          defaultValue={defaults.experience_level}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="block font-medium text-navy">Primary goal</span>
        <select
          name="primary_goal"
          defaultValue={defaults.primary_goal}
          className="mt-1 block w-full h-12 rounded-xl border border-border bg-surface px-3 focus:border-navy focus:outline-none"
        >
          {GOALS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </label>

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
      {state?.ok ? (
        <p className="rounded-lg border border-recovery-good/40 bg-recovery-good/10 p-3 text-sm text-recovery-good">
          Saved.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full h-12 items-center justify-center rounded-full bg-navy font-medium text-cream hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
