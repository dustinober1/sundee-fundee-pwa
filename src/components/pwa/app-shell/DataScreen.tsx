import Link from "next/link";
import type { DataScreenModel } from "./types";

export function DataScreen(props: {
  model: DataScreenModel;
  onExport: () => void;
  onDeleteLocal: () => void;
  onCloudAction: () => void;
}) {
  const { model, onExport, onDeleteLocal, onCloudAction } = props;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
          Data controls
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold">{model.title}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          {model.queuedMutationsLabel}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onExport}
            className="h-12 rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={onDeleteLocal}
            className="h-12 rounded-lg border border-red-900/20 px-4 text-sm font-semibold text-red-800"
          >
            Delete local data
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-[#e7eee8] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
          Cloud sync
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold">
          {model.cloudStatusTitle}
        </h2>
        <div className="mt-4 space-y-2 text-sm leading-6 text-muted">
          <p>
            Account: <span className="font-semibold text-navy">{model.accountEmailLabel}</span>
          </p>
          <p>
            Last sync: <span className="font-semibold text-navy">{model.lastSyncLabel}</span>
          </p>
          <p>
            Queued: <span className="font-semibold text-navy">{model.queuedLabel}</span>
          </p>
          {model.lastError ? <p className="text-red-800">{model.lastError}</p> : null}
          {model.lastRunLabel ? <p>{model.lastRunLabel}</p> : null}
        </div>
        <div className="mt-6 grid gap-2">
          {!model.cloudConfigured ? (
            <p className="rounded-lg border border-navy/10 bg-cream p-3 text-sm text-muted">
              Add Supabase environment variables to enable cloud sync.
            </p>
          ) : !model.cloudConnected ? (
            <Link
              href="/auth/sign-in"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-navy px-4 text-sm font-semibold text-cream"
            >
              Connect account
            </Link>
          ) : (
            <button
              type="button"
              disabled={model.cloudActionDisabled}
              onClick={onCloudAction}
              className="h-12 rounded-lg bg-navy px-4 text-sm font-semibold text-cream disabled:opacity-60"
            >
              {model.cloudActionLabel}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
