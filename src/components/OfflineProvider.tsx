"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { countOutbox } from "@/lib/offline/db";
import { drain, subscribeOutbox } from "@/lib/offline/outbox";

type OfflineCtx = {
  online: boolean;
  pending: number;
  syncing: boolean;
  drainNow: () => Promise<void>;
};

const Ctx = createContext<OfflineCtx>({
  online: true,
  pending: 0,
  syncing: false,
  drainNow: async () => {},
});

export function useOffline(): OfflineCtx {
  return useContext(Ctx);
}

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const refreshCount = useCallback(async () => {
    try {
      setPending(await countOutbox());
    } catch {
      setPending(0);
    }
  }, []);

  const drainNow = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      await drain();
    } finally {
      setSyncing(false);
      await refreshCount();
    }
  }, [syncing, refreshCount]);

  useEffect(() => {
    // Defer initial state touches off the effect's synchronous frame so the
    // react-hooks/set-state-in-effect rule is satisfied.
    const timer = setTimeout(() => {
      void refreshCount();
      if (navigator.onLine) void drainNow();
    }, 0);
    const unsub = subscribeOutbox(() => void refreshCount());
    const onOnline = () => {
      setOnline(true);
      void drainNow();
    };
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      clearTimeout(timer);
      unsub();
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [refreshCount, drainNow]);

  return (
    <Ctx.Provider value={{ online, pending, syncing, drainNow }}>
      {children}
    </Ctx.Provider>
  );
}
