export function HomeProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_top,rgba(242,115,25,0.24),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(13,26,64,0.16),transparent_52%)] blur-2xl" />
      <div className="relative rounded-[2.6rem] border border-navy/15 bg-[#111a36] p-3 shadow-[0_30px_80px_rgba(13,26,64,0.24)]">
        <div className="overflow-hidden rounded-[2rem] bg-[#f6f3ea]">
          <div className="flex items-center justify-between px-5 pb-3 pt-3 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-navy/45">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-navy/35" />
              <span className="h-1.5 w-3 rounded-full bg-navy/35" />
              <span className="h-1.5 w-4 rounded-full bg-navy/35" />
            </div>
          </div>

          <div className="border-b border-navy/[0.08] px-5 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-orange">
                  Training
                </p>
                <h3 className="font-display mt-1 text-2xl font-semibold text-navy">
                  Today
                </h3>
              </div>
              <button
                type="button"
                aria-label="Open profile"
                className="grid h-10 w-10 place-items-center rounded-full border border-navy/10 bg-white text-sm font-semibold text-navy shadow-sm"
              >
                SF
              </button>
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-navy/10 bg-navy px-4 py-4 text-cream shadow-[0_18px_40px_rgba(13,26,64,0.18)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-cream/55">
                    Recovery score
                  </p>
                  <p className="font-display mt-1 text-3xl font-semibold">
                    82
                  </p>
                </div>
                <div className="rounded-full border border-cream/15 bg-cream/10 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.22em] text-cream/80">
                  Green light
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-cream/10">
                <div className="h-full w-[82%] rounded-full bg-gold" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">
                Good sleep, low pain, and enough capacity for the main lift.
              </p>
            </div>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="rounded-[1.35rem] border border-navy/10 bg-white p-4 shadow-[0_10px_25px_rgba(13,26,64,0.05)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
                    Next session
                  </p>
                  <h4 className="font-display mt-2 text-xl font-semibold text-navy">
                    Upper strength, lower volume
                  </h4>
                </div>
                <span className="rounded-full bg-recovery-good/10 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-recovery-good">
                  45 min
                </span>
              </div>

              <ul className="mt-4 space-y-3 text-sm text-navy/78">
                <li className="flex items-center justify-between gap-4">
                  <span>Bench press</span>
                  <span className="font-medium text-orange">5 x 3</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>Single-leg work</span>
                  <span className="font-medium text-navy">Reduced volume</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span>RPE cap</span>
                  <span className="font-medium text-navy">7.5</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[1.1rem] border border-navy/10 bg-white p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                  Weekly load
                </p>
                <div className="mt-4 flex items-end gap-2">
                  {[34, 56, 48, 72, 60, 84].map((height, index) => (
                    <div
                      key={height}
                      className="flex-1 rounded-t-full bg-orange/90"
                      style={{
                        height: `${height}px`,
                        opacity: 0.55 + index * 0.07,
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[1.1rem] border border-navy/10 bg-white p-4">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                  Readiness inputs
                </p>
                <ul className="mt-3 space-y-2.5 text-sm text-navy/78">
                  <li className="flex items-center justify-between gap-3">
                    <span>Sleep</span>
                    <span className="font-medium text-recovery-good">Good</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Pain</span>
                    <span className="font-medium text-gold">Low</span>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span>Cycle phase</span>
                    <span className="font-medium text-navy">Tracked</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-navy/10 bg-white p-4 shadow-[0_10px_25px_rgba(13,26,64,0.05)]">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">
                  This week
                </p>
                <span className="text-xs font-medium text-orange">4 sessions</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[0.65rem] uppercase tracking-[0.16em] text-navy/55">
                {["Mon", "Tue", "Wed", "Thu"].map((day, index) => (
                  <div
                    key={day}
                    className={`rounded-[0.9rem] border px-2 py-3 ${
                      index === 0
                      ? "border-orange/20 bg-orange/[0.08] text-navy"
                      : "border-navy/[0.08] bg-navy/[0.03]"
                    }`}
                  >
                    <span className="block font-medium text-navy">{day}</span>
                    <span className="mt-1 block">
                      {index === 0 ? "Done" : index === 1 ? "Lift" : "Ruck"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-navy/[0.08] bg-[#f1ede1] px-5 py-3">
            <div className="grid grid-cols-4 gap-2 text-center text-[0.62rem] font-medium uppercase tracking-[0.18em] text-navy/55">
              <div className="rounded-[0.85rem] bg-white px-2 py-2 text-orange shadow-sm">
                Home
              </div>
              <div className="rounded-[0.85rem] px-2 py-2">Plans</div>
              <div className="rounded-[0.85rem] px-2 py-2">Log</div>
              <div className="rounded-[0.85rem] px-2 py-2">More</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
