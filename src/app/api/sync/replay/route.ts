import { NextResponse } from "next/server";
import { requireUser } from "@/lib/supabase/dal";
import { createWorkout, addExerciseToWorkout, addSetToExercise } from "@/app/workouts/actions";
import { logRecoveryEntry } from "@/app/recovery/actions";
import { logPain } from "@/app/pain/actions";
import { addOneRepMax } from "@/app/maxes/actions";

type ReplayBody = {
  kind: string;
  payload: Record<string, unknown>;
  client_id: string;
};

function buildFormData(payload: Record<string, unknown>, clientId: string): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      for (const v of value) fd.append(key, String(v));
    } else {
      fd.append(key, String(value));
    }
  }
  fd.set("client_id", clientId);
  return fd;
}

/**
 * Replay a single queued mutation. The body mirrors what the client originally
 * captured. Each branch delegates to the same server action used by the live
 * path; idempotency is guaranteed by the action's `client_id`-based upsert.
 *
 * Note: server actions that would otherwise redirect() will throw during
 * replay because there's no Next.js RSC render context — we swallow that.
 * The DB side effect has already landed before the redirect throws.
 */
export async function POST(req: Request) {
  // Ensure we're authenticated. An offline user must sign back in before
  // replay runs; the outbox stays pending meanwhile.
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: ReplayBody;
  try {
    body = (await req.json()) as ReplayBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !body.kind || !body.client_id) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const fd = buildFormData(body.payload ?? {}, body.client_id);

  try {
    switch (body.kind) {
      case "createWorkout":
        await createWorkout(undefined, fd);
        break;
      case "addExerciseToWorkout":
        await addExerciseToWorkout(fd);
        break;
      case "addSetToExercise":
        await addSetToExercise(fd);
        break;
      case "logRecoveryEntry":
        await logRecoveryEntry(undefined, fd);
        break;
      case "logPain":
        await logPain(undefined, fd);
        break;
      case "addOneRepMax":
        await addOneRepMax(undefined, fd);
        break;
      default:
        return NextResponse.json({ error: "unknown kind" }, { status: 400 });
    }
  } catch (err) {
    // redirect() inside server actions throws a NEXT_REDIRECT — treat it as
    // success. Any real error propagates as 500 so the outbox retries.
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("NEXT_REDIRECT") || (err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
