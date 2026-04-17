"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const Schema = z.object({
  benchmark_id: z.string().min(1),
  score: z.coerce.number().positive(),
  performed_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().trim().max(500).optional(),
});

export type AddResultState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function logBenchmarkResult(
  _prev: AddResultState | undefined,
  formData: FormData,
): Promise<AddResultState> {
  const user = await requireUser();
  const parsed = Schema.safeParse({
    benchmark_id: formData.get("benchmark_id"),
    score: formData.get("score"),
    performed_on: formData.get("performed_on"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("benchmark_results").insert({
    user_id: user.id,
    benchmark_id: parsed.data.benchmark_id,
    score: parsed.data.score,
    performed_on: parsed.data.performed_on,
    notes: parsed.data.notes ?? null,
  });
  if (error) return { message: error.message };

  revalidatePath(`/benchmarks/${parsed.data.benchmark_id}`);
  revalidatePath("/benchmarks");
  return {};
}

export async function deleteBenchmarkResult(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  const benchmarkId = formData.get("benchmark_id");
  if (typeof id !== "string" || typeof benchmarkId !== "string") return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("benchmark_results").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath(`/benchmarks/${benchmarkId}`);
}
