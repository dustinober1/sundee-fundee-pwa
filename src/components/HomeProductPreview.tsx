import Image from "next/image";

const screens = [
  {
    key: "dashboard",
    label: "Dashboard",
    src: "/app-screenshots/dashboard.png",
    alt: "Sundee Fundee dashboard screenshot",
    blurb:
      "Recovery score, cycle phase, volume, and the suggested workout are all visible at a glance.",
  },
  {
    key: "workouts",
    label: "Workouts",
    src: "/app-screenshots/workouts.png",
    alt: "Sundee Fundee workouts screenshot",
    blurb:
      "A clear workout list with dates, durations, and movement tags for each training session.",
  },
  {
    key: "programs",
    label: "Programs",
    src: "/app-screenshots/programs.png",
    alt: "Sundee Fundee programs screenshot",
    blurb:
      "Structured programs with duration, frequency, and enrollment actions in a simple list.",
  },
  {
    key: "maxes",
    label: "Maxes",
    src: "/app-screenshots/maxes.png",
    alt: "Sundee Fundee one-rep maxes screenshot",
    blurb:
      "One-rep max tracking uses the same clean list layout, with lift numbers front and center.",
  },
] as const;

export function HomeProductPreview() {
  const current = screens[0];

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <div className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_top,rgba(242,115,25,0.22),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(13,26,64,0.16),transparent_50%)] blur-3xl" />
      <div className="relative rounded-[2.4rem] border border-navy/10 bg-[#f7f4ec] p-4 shadow-[0_30px_90px_rgba(13,26,64,0.16)]">
        <div className="flex items-center justify-between gap-4 px-1 pb-4">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-orange">
              Actual app screen
            </p>
            <p className="font-display mt-2 text-2xl font-semibold text-navy">
              {current.label}
            </p>
          </div>
          <span className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-muted">
            iPhone 16 Pro
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0f0f0f] shadow-[0_15px_30px_rgba(13,26,64,0.06)]">
          <svg
            viewBox="0 0 440 900"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <rect x="0" y="0" width="440" height="900" rx="44" fill="#0f0f0f" />
            <rect x="14" y="14" width="412" height="872" rx="36" fill="white" />
            <rect x="180" y="24" width="80" height="20" rx="10" fill="#0a0a0a" />
          </svg>
          <div className="relative p-[3.2%]">
            <div className="overflow-hidden rounded-[2rem]">
              <Image
                src={current.src}
                alt={current.alt}
                width={1320}
                height={2868}
                priority
                sizes="(min-width: 1024px) 420px, 92vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {screens.map((screen) => {
            const isActive = screen.key === current.key;

            return (
              <span
                key={screen.key}
                className={`rounded-[1.15rem] border px-3 py-3 text-left ${
                  isActive
                    ? "border-orange/30 bg-orange/10 shadow-[0_10px_25px_rgba(242,115,25,0.12)]"
                    : "border-navy/10 bg-white"
                }`}
              >
                <span
                  className={`block text-[0.65rem] font-medium uppercase tracking-[0.2em] ${
                    isActive ? "text-orange" : "text-muted"
                  }`}
                >
                  {screen.label}
                </span>
              </span>
            );
          })}
        </div>

        <p className="mt-4 px-1 text-sm leading-relaxed text-muted">
          {current.blurb}
        </p>
      </div>
    </div>
  );
}
