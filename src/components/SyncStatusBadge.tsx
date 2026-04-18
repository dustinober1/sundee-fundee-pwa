"use client";

import { useOffline } from "./OfflineProvider";

export function SyncStatusBadge() {
  const { online, pending, syncing, drainNow } = useOffline();

  if (online && pending === 0 && !syncing) return null;

  const label = !online
    ? `Offline · ${pending} pending`
    : syncing
      ? `Syncing ${pending}…`
      : `${pending} pending sync`;

  return (
    <button
      type="button"
      onClick={() => drainNow()}
      className={`fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-sm ${
        !online
          ? "border-recovery-risk bg-recovery-risk/10 text-recovery-risk"
          : "border-gold bg-surface text-navy"
      }`}
      disabled={syncing || !online}
      title={
        !online
          ? "You're offline. Changes will sync when you reconnect."
          : "Click to sync pending changes now."
      }
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          !online ? "bg-recovery-risk" : syncing ? "bg-gold animate-pulse" : "bg-gold"
        }`}
        aria-hidden
      />
      {label}
    </button>
  );
}
