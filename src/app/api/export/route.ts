import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Dataset = "workouts" | "maxes" | "benchmarks" | "recovery" | "pain";
const ALLOWED: Dataset[] = ["workouts", "maxes", "benchmarks", "recovery", "pain"];

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const head = headers.join(",");
  const body = rows.map((r) => headers.map((h) => csvCell(r[h])).join(",")).join("\n");
  return `${head}\n${body}\n`;
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const dataset = (new URL(request.url).searchParams.get("dataset") ?? "") as Dataset;
  if (!ALLOWED.includes(dataset)) {
    return new NextResponse("Unknown dataset", { status: 400 });
  }

  let csv = "";
  switch (dataset) {
    case "workouts": {
      const { data } = await supabase
        .from("workouts")
        .select("performed_on, name, duration_min, completed_at, notes")
        .order("performed_on", { ascending: false });
      csv = toCsv((data as Record<string, unknown>[] | null) ?? []);
      break;
    }
    case "maxes": {
      const { data } = await supabase
        .from("one_rep_max_records")
        .select(
          "performed_on, weight, unit, is_estimated, source_reps, notes, exercises ( name )",
        )
        .order("performed_on", { ascending: false });
      type Raw = {
        performed_on: string;
        weight: string | number;
        unit: string;
        is_estimated: boolean;
        source_reps: number | null;
        notes: string | null;
        exercises: { name: string } | { name: string }[] | null;
      };
      const rows = ((data as Raw[] | null) ?? []).map((r) => ({
        performed_on: r.performed_on,
        exercise: Array.isArray(r.exercises)
          ? (r.exercises[0]?.name ?? "")
          : (r.exercises?.name ?? ""),
        weight: r.weight,
        unit: r.unit,
        is_estimated: r.is_estimated,
        source_reps: r.source_reps,
        notes: r.notes,
      }));
      csv = toCsv(rows);
      break;
    }
    case "benchmarks": {
      const { data } = await supabase
        .from("benchmark_results")
        .select("performed_on, score, notes, benchmark_id")
        .order("performed_on", { ascending: false });
      csv = toCsv((data as Record<string, unknown>[] | null) ?? []);
      break;
    }
    case "recovery": {
      const { data } = await supabase
        .from("recovery_scores")
        .select(
          "performed_on, total, recommendation, hrv_ms, sleep_hours, pain_intensity, cycle_phase, notes",
        )
        .order("performed_on", { ascending: false });
      csv = toCsv((data as Record<string, unknown>[] | null) ?? []);
      break;
    }
    case "pain": {
      const { data } = await supabase
        .from("daily_pain_logs")
        .select("performed_on, intensity, pain_type, location_ids, notes")
        .order("performed_on", { ascending: false });
      type Raw = {
        performed_on: string;
        intensity: number;
        pain_type: string;
        location_ids: string[];
        notes: string | null;
      };
      const rows = ((data as Raw[] | null) ?? []).map((r) => ({
        ...r,
        location_ids: r.location_ids.join("|"),
      }));
      csv = toCsv(rows);
      break;
    }
  }

  return new NextResponse(csv || "no rows\n", {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sundee-fundee-${dataset}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
