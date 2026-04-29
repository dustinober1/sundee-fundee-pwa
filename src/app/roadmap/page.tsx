import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Roadmap – Sundee Fundee",
  description:
    "What's live in Sundee Fundee, what's actively being built, and what's planned next. Updated regularly.",
  alternates: {
    canonical: "/roadmap",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Status = "live" | "in-progress" | "planned";

type RoadmapItem = {
  title: string;
  description: string;
  status: Status;
};

const liveItems: RoadmapItem[] = [
  {
    title: "Readiness Score",
    description:
      "Daily composite score from HRV trend, resting HR, sleep quality, and subjective feel — gates intensity automatically.",
    status: "live",
  },
  {
    title: "Cycle-Phase Adaptation",
    description:
      "Programming adjusts load, volume, and exercise selection across all four cycle phases.",
    status: "live",
  },
  {
    title: "Apple Health Sync",
    description:
      "Reads HRV, resting heart rate, sleep stages, and active energy directly from HealthKit.",
    status: "live",
  },
  {
    title: "Injury Flags & Substitutions",
    description:
      "Flag an injury and the app automatically routes around the affected structure with the highest-fidelity substitute available.",
    status: "live",
  },
];

const inProgressItems: RoadmapItem[] = [
  {
    title: "Garmin Connect Integration",
    description:
      "Pull HRV and recovery data directly from Garmin wearables alongside Apple Health.",
    status: "in-progress",
  },
];

const plannedItems: RoadmapItem[] = [
  {
    title: "Data Export (CSV)",
    description:
      "Download your full training log — sessions, loads, readiness scores, and notes — as a CSV file.",
    status: "planned",
  },
  {
    title: "Apple Watch Complications",
    description:
      "See your readiness score and next session summary directly on your watch face.",
    status: "planned",
  },
  {
    title: "Coach / Team Mode",
    description:
      "Allow a coach to view athlete readiness and programming in real time and override recommendations when needed.",
    status: "planned",
  },
  {
    title: "Android App",
    description:
      "A native Android version of Sundee Fundee with full feature parity.",
    status: "planned",
  },
];

function StatusBadge({ status }: { status: Status }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#d4edda] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#155724]">
        Live
      </span>
    );
  }
  if (status === "in-progress") {
    return (
      <span className="inline-flex items-center rounded-full bg-orange/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-orange">
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-muted/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
      Planned
    </span>
  );
}

function RoadmapRow({ item }: { item: RoadmapItem }) {
  return (
    <div className="flex flex-col gap-2 border-t border-border py-5 sm:flex-row sm:items-start sm:gap-6">
      <div className="shrink-0 pt-0.5 sm:w-28">
        <StatusBadge status={item.status} />
      </div>
      <div>
        <p className="font-display font-semibold text-navy">{item.title}</p>
        <p className="mt-1 leading-relaxed text-muted">{item.description}</p>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <>
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              Roadmap
            </p>
            <h1 className="font-display mt-4 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              What&apos;s live, what&apos;s next
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Sundee Fundee is under active development. Here is a transparent
              look at what is already in your hands, what we are building right
              now, and what is on the horizon.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">

            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold text-navy">
                Live Now
              </h2>
              <p className="mt-2 text-muted">
                Features that are live in the current App Store release.
              </p>
              <div className="mt-4">
                {liveItems.map((item) => (
                  <RoadmapRow key={item.title} item={item} />
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold text-navy">
                In Progress
              </h2>
              <p className="mt-2 text-muted">
                Features currently in active development.
              </p>
              <div className="mt-4">
                {inProgressItems.map((item) => (
                  <RoadmapRow key={item.title} item={item} />
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold text-navy">
                On the Horizon
              </h2>
              <p className="mt-2 text-muted">
                Planned features. Order does not guarantee priority.
              </p>
              <div className="mt-4">
                {plannedItems.map((item) => (
                  <RoadmapRow key={item.title} item={item} />
                ))}
              </div>
            </div>

            <p className="border-t border-border pt-8 text-sm text-muted">
              Last updated April 2026. Have a feature request?{" "}
              <a
                href="mailto:support@sundeefundee.com"
                className="font-medium text-orange underline underline-offset-2 hover:opacity-70"
              >
                Email us
              </a>
              .
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
