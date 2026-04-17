export default function Loading() {
  return (
    <main
      className="flex flex-1 items-center justify-center px-6 py-20"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 text-muted">
        <div className="h-2 w-32 overflow-hidden rounded-full bg-cream">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gold" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em]">Loading</p>
      </div>
    </main>
  );
}
