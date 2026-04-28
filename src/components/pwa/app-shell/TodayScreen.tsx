import Link from "next/link";
import type { TodayScreenModel } from "./types";

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-cream p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="font-display mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}

export function TodayScreen(props: {
  model: TodayScreenModel;
  onChooseModeLocalOnly: () => void;
  onChooseModeCloudSync: () => void;
  onSyncCloud: () => void;
}) {
  const { model, onChooseModeLocalOnly, onChooseModeCloudSync, onSyncCloud } = props;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <section className="rounded-lg border border-border bg-surface p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
          Training signal
        </p>
        <h2 className="font-display mt-3 text-4xl font-semibold">
          {model.recommendationTitle}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          {model.recommendationSummary}
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <StatTile label="Signal" value={model.signalLabel} />
          <StatTile label="Load" value={`${model.intensityPercent}%`} />
          <StatTile label="Sets" value={model.setAdjustmentLabel} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-[#e7eee8] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
          Data mode
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold">
          {model.mode === "local-only" ? "Local only" : "Cloud sync"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">{model.cloudStatusTitle}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {model.mode === "local-only" ? (
            <button
              type="button"
              onClick={onChooseModeCloudSync}
              className="inline-flex h-10 items-center rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy"
            >
              Switch to cloud sync
            </button>
          ) : (
            <button
              type="button"
              onClick={onChooseModeLocalOnly}
              className="inline-flex h-10 items-center rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy"
            >
              Switch to local only
            </button>
          )}

          {model.mode === "cloud-sync" ? (
            model.cloudConfigured ? (
              model.canConnectCloud ? (
                <Link
                  href="/auth/sign-in"
                  className="inline-flex h-10 items-center rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy"
                >
                  Connect account
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={model.cloudSyncBusy}
                  onClick={onSyncCloud}
                  className="inline-flex h-10 items-center rounded-lg border border-navy/15 px-4 text-sm font-semibold text-navy disabled:opacity-60"
                >
                  {model.cloudSyncButtonLabel}
                </button>
              )
            ) : (
              <span className="inline-flex h-10 items-center rounded-lg border border-navy/15 px-4 text-sm font-semibold text-muted">
                Add Supabase env
              </span>
            )
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5 lg:col-span-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Why</p>
        <div className="mt-4 grid gap-2 text-sm text-muted lg:grid-cols-3">
          {model.recommendationReasons.slice(0, 3).map((reason) => (
            <p key={reason} className="rounded-lg bg-cream px-3 py-2">
              {reason}
            </p>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3 lg:col-span-2">
        <StatTile label="Workouts" value={model.counts.workouts} />
        <StatTile label="Lifts" value={model.counts.lifts} />
        <StatTile label="Programs" value={model.counts.programEnrollments} />
      </section>
    </div>
  );
}
