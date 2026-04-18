import {
  addOutbox,
  deleteOutbox,
  listOutbox,
  updateOutbox,
  type OutboxEntry,
  type OutboxKind,
} from "./db";

const MAX_ATTEMPTS = 5;

export async function enqueue(
  kind: OutboxKind,
  payload: Record<string, unknown>,
  clientId: string,
): Promise<void> {
  await addOutbox({ kind, payload, client_id: clientId });
  dispatchChange();
}

/**
 * Drain the outbox FIFO. On each entry: POST to /api/sync/replay with the
 * full entry. On 2xx → remove from outbox. On 4xx → mark as non-retriable
 * (keep `last_error`, don't drop so the user can see it). On 5xx / network
 * error → bump attempts and stop draining (retry later).
 */
export async function drain(): Promise<{
  success: number;
  failed: number;
  remaining: number;
}> {
  const entries = await listOutbox();
  let success = 0;
  let failed = 0;

  for (const entry of entries) {
    if (entry.id === undefined) continue;
    try {
      const resp = await fetch("/api/sync/replay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: entry.kind,
          payload: entry.payload,
          client_id: entry.client_id,
        }),
      });
      if (resp.ok) {
        await deleteOutbox(entry.id);
        success += 1;
        continue;
      }
      if (resp.status >= 400 && resp.status < 500) {
        const text = await resp.text().catch(() => resp.statusText);
        await updateOutbox(entry.id, {
          attempts: entry.attempts + 1,
          last_error: `client error ${resp.status}: ${text.slice(0, 200)}`,
        });
        failed += 1;
        continue;
      }
      // 5xx — retriable; stop draining to avoid thundering.
      await updateOutbox(entry.id, {
        attempts: entry.attempts + 1,
        last_error: `server error ${resp.status}`,
      });
      break;
    } catch (err) {
      // Network failure — almost certainly offline. Stop draining.
      await updateOutbox(entry.id, {
        attempts: entry.attempts + 1,
        last_error: err instanceof Error ? err.message : String(err),
      });
      break;
    }
    if (entry.attempts + 1 >= MAX_ATTEMPTS) {
      // Exhausted — leave in place for inspection, don't retry.
    }
  }

  const remaining = (await listOutbox()).length;
  dispatchChange();
  return { success, failed, remaining };
}

export type OutboxState = {
  count: number;
  entries: OutboxEntry[];
};

const CHANGE_EVENT = "sundee-outbox-change";

function dispatchChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function subscribeOutbox(fn: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, fn);
  return () => window.removeEventListener(CHANGE_EVENT, fn);
}

export { listOutbox } from "./db";
