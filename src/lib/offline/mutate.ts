import { enqueue } from "./outbox";
import type { OutboxKind } from "./db";

export function newClientId(): string {
  return crypto.randomUUID();
}

/**
 * Attempt a server action; if it throws (offline, transient, etc.), queue the
 * same payload for later replay through /api/sync/replay. The caller supplies
 * the UI-friendly result shape via `onSuccess` and `onQueued`.
 *
 * Important: the server action must accept `client_id` — every payload passes
 * the same UUID to the live call and to the queued replay so dedupe works.
 */
export async function runMutation<State>(opts: {
  kind: OutboxKind;
  clientId: string;
  formData: FormData;
  action: (prev: State | undefined, fd: FormData) => Promise<State>;
  toPayload: (fd: FormData) => Record<string, unknown>;
}): Promise<
  | { status: "ok"; state: State }
  | { status: "queued"; error?: string }
> {
  try {
    const state = await opts.action(undefined, opts.formData);
    return { status: "ok", state };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await enqueue(opts.kind, opts.toPayload(opts.formData), opts.clientId);
    return { status: "queued", error: message };
  }
}

/**
 * Serialize FormData into a flat plain-object payload suitable for the
 * replay endpoint. Multi-value fields (e.g. checkboxes) are collapsed into
 * arrays. `File` entries are dropped — the offline path is text-only today.
 */
export function formDataToPayload(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    const existing = out[key];
    if (existing === undefined) {
      out[key] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      out[key] = [existing, value];
    }
  }
  return out;
}
