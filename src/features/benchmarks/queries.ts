import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BenchmarkScoring } from "@/lib/domain/benchmarks";

export type BenchmarkCategory =
  | "sundee_fundee"
  | "classic_wods"
  | "strength"
  | "endurance"
  | "gymnastics"
  | "general_fitness";

export const BENCHMARK_CATEGORY_LABEL: Record<BenchmarkCategory, string> = {
  sundee_fundee: "Sundee Fundee",
  classic_wods: "Classic WODs",
  strength: "Strength",
  endurance: "Endurance",
  gymnastics: "Gymnastics",
  general_fitness: "General Fitness",
};

export type BenchmarkDefinition = {
  id: string;
  name: string;
  category: BenchmarkCategory;
  workout_description: string;
  scoring_type: BenchmarkScoring;
  intensity: number | null;
  sort_order: number;
  movement_tags: string[];
  equipment: string[];
  time_domain: string | null;
  coach_notes: string | null;
};

export type BenchmarkResultRow = {
  id: string;
  benchmark_id: string;
  score: number;
  notes: string | null;
  performed_on: string;
};

export const listBenchmarks = cache(async (): Promise<BenchmarkDefinition[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("benchmark_definitions")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  return (data as BenchmarkDefinition[] | null) ?? [];
});

export const getBenchmark = cache(async (id: string): Promise<BenchmarkDefinition | null> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("benchmark_definitions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as BenchmarkDefinition | null) ?? null;
});

export async function listBenchmarkResults(benchmarkId: string): Promise<BenchmarkResultRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("benchmark_results")
    .select("id, benchmark_id, score, notes, performed_on")
    .eq("benchmark_id", benchmarkId)
    .order("performed_on", { ascending: false });
  type Raw = Omit<BenchmarkResultRow, "score"> & { score: string | number };
  return ((data as Raw[] | null) ?? []).map((r) => ({
    ...r,
    score: typeof r.score === "string" ? parseFloat(r.score) : r.score,
  }));
}
