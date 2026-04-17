import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { setVolumeLbs } from "@/lib/domain/challenges";

type WorkoutSetRow = {
  completed_weight: string | number | null;
  completed_reps: number | null;
  prescribed_weight: string | number | null;
  prescribed_reps: number | null;
  workout_exercises: {
    workouts: { performed_on: string; user_id: string } | { performed_on: string; user_id: string }[] | null;
    exercises: {
      name: string;
      weightlifting_category: string | null;
    } | { name: string; weightlifting_category: string | null }[] | null;
  } | null;
};

export type WeeklyAggregate = {
  weekStart: string; // ISO date of Monday
  workoutCount: number;
  totalVolumeLbs: number;
};

export type CategoryVolume = {
  category: string;
  volumeLbs: number;
};

export type PainTrendPoint = {
  date: string;
  intensity: number;
};

function num(v: string | number | null): number | null {
  if (v === null) return null;
  return typeof v === "string" ? parseFloat(v) : v;
}

function isoMonday(d: Date): string {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  const day = c.getDay() || 7;
  if (day !== 1) c.setDate(c.getDate() - (day - 1));
  return c.toISOString().slice(0, 10);
}

function unwrap<T>(rel: T | T[] | null): T | null {
  if (!rel) return null;
  return Array.isArray(rel) ? (rel[0] ?? null) : rel;
}

async function fetchSetsLast90Days() {
  const supabase = await createSupabaseServerClient();
  const since = new Date();
  since.setDate(since.getDate() - 90);
  const sinceISO = since.toISOString().slice(0, 10);

  const { data } = await supabase
    .from("workout_sets")
    .select(
      `completed_weight, completed_reps, prescribed_weight, prescribed_reps,
       workout_exercises!inner (
         workouts!inner ( performed_on, user_id ),
         exercises!inner ( name, weightlifting_category )
       )`,
    )
    .gte("workout_exercises.workouts.performed_on", sinceISO);

  return (data as WorkoutSetRow[] | null) ?? [];
}

export const weeklyVolume = cache(async (): Promise<WeeklyAggregate[]> => {
  const sets = await fetchSetsLast90Days();
  const buckets = new Map<string, { count: Set<string>; volume: number }>();

  for (const s of sets) {
    const we = s.workout_exercises;
    if (!we) continue;
    const w = unwrap(we.workouts);
    if (!w) continue;
    const week = isoMonday(new Date(w.performed_on + "T00:00:00"));
    const slot = buckets.get(week) ?? { count: new Set<string>(), volume: 0 };
    slot.count.add(w.performed_on);
    slot.volume += setVolumeLbs({
      completed_weight: num(s.completed_weight),
      completed_reps: s.completed_reps,
      prescribed_weight: num(s.prescribed_weight),
      prescribed_reps: s.prescribed_reps,
    });
    buckets.set(week, slot);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, v]) => ({
      weekStart,
      workoutCount: v.count.size,
      totalVolumeLbs: Math.round(v.volume),
    }));
});

export const categoryBalance = cache(async (): Promise<CategoryVolume[]> => {
  const sets = await fetchSetsLast90Days();
  const buckets = new Map<string, number>();

  for (const s of sets) {
    const we = s.workout_exercises;
    if (!we) continue;
    const ex = unwrap(we.exercises);
    if (!ex?.weightlifting_category) continue;
    const cat = ex.weightlifting_category;
    const vol = setVolumeLbs({
      completed_weight: num(s.completed_weight),
      completed_reps: s.completed_reps,
      prescribed_weight: num(s.prescribed_weight),
      prescribed_reps: s.prescribed_reps,
    });
    buckets.set(cat, (buckets.get(cat) ?? 0) + vol);
  }

  return [...buckets.entries()]
    .map(([category, volumeLbs]) => ({ category, volumeLbs: Math.round(volumeLbs) }))
    .sort((a, b) => b.volumeLbs - a.volumeLbs);
});

export const painTrend = cache(async (): Promise<PainTrendPoint[]> => {
  const supabase = await createSupabaseServerClient();
  const since = new Date();
  since.setDate(since.getDate() - 60);
  const { data } = await supabase
    .from("daily_pain_logs")
    .select("performed_on, intensity")
    .gte("performed_on", since.toISOString().slice(0, 10))
    .order("performed_on", { ascending: true });

  type Raw = { performed_on: string; intensity: number };
  return ((data as Raw[] | null) ?? []).map((r) => ({
    date: r.performed_on,
    intensity: r.intensity,
  }));
});

/**
 * Acute:Chronic Workload Ratio: this week's workout count vs the prior 3-week average.
 */
export async function computeAcwr(): Promise<number | null> {
  const weeks = await weeklyVolume();
  if (weeks.length < 2) return null;
  const current = weeks[weeks.length - 1];
  const prior = weeks.slice(0, -1).slice(-3);
  if (prior.length === 0) return null;
  const priorAvg =
    prior.reduce((acc, w) => acc + w.workoutCount, 0) / prior.length;
  if (priorAvg === 0) return null;
  return current.workoutCount / priorAvg;
}
