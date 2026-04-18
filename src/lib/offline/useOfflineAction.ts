"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { enqueue } from "./outbox";
import { newClientId, formDataToPayload } from "./mutate";
import type { OutboxKind } from "./db";

export type OfflineActionStatus =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "ok"; state: unknown }
  | { kind: "queued"; error?: string };

/**
 * Drop-in replacement for useActionState that queues to the outbox when the
 * network call fails. Inserts a `client_id` field into the FormData so the
 * live action and any later replay dedupe on the same UUID.
 */
export function useOfflineAction<State>(opts: {
  kind: OutboxKind;
  action: (prev: State | undefined, fd: FormData) => Promise<State>;
}): [
  status: OfflineActionStatus,
  wrappedAction: (fd: FormData) => Promise<void>,
  pending: boolean,
] {
  const [status, setStatus] = useState<OfflineActionStatus>({ kind: "idle" });
  const [pending, startTransition] = useTransition();
  const clientIdRef = useRef<string>("");

  const wrappedAction = useCallback(
    async (fd: FormData) => {
      if (!clientIdRef.current) clientIdRef.current = newClientId();
      fd.set("client_id", clientIdRef.current);

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        await enqueue(opts.kind, formDataToPayload(fd), clientIdRef.current);
        setStatus({ kind: "queued" });
        clientIdRef.current = "";
        return;
      }

      await new Promise<void>((resolve) => {
        startTransition(async () => {
          try {
            const state = await opts.action(undefined, fd);
            setStatus({ kind: "ok", state });
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            await enqueue(
              opts.kind,
              formDataToPayload(fd),
              clientIdRef.current,
            );
            setStatus({ kind: "queued", error: msg });
          } finally {
            clientIdRef.current = "";
            resolve();
          }
        });
      });
    },
    [opts],
  );

  return [status, wrappedAction, pending];
}
