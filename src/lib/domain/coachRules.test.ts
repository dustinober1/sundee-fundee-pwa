import { describe, expect, it } from "vitest";
import {
  detectHighAcwr,
  detectPlateau,
  detectRisingPain,
  detectStaleBenchmarks,
  detectStalledVolume,
  type MaxHistoryPoint,
  type PainPoint,
  type WeeklyVolumePoint,
} from "./coachRules";

const mkMax = (
  id: string,
  weight: number,
  date: string,
  name = "Back Squat",
): MaxHistoryPoint => ({
  exercise_id: id,
  exercise_name: name,
  weight,
  performed_on: date,
});

describe("detectPlateau", () => {
  it("flags when the last 3 records show no net improvement", () => {
    const history = [
      mkMax("sq", 300, "2026-04-01"),
      mkMax("sq", 300, "2026-03-15"),
      mkMax("sq", 305, "2026-03-01"),
    ];
    const r = detectPlateau("sq", "Back Squat", history);
    expect(r).not.toBeNull();
    expect(r?.kind).toBe("plateau");
    expect(r?.exercise_id).toBe("sq");
  });

  it("does not flag when there is recent progress", () => {
    const history = [
      mkMax("sq", 315, "2026-04-01"),
      mkMax("sq", 305, "2026-03-15"),
      mkMax("sq", 300, "2026-03-01"),
    ];
    const r = detectPlateau("sq", "Back Squat", history);
    expect(r).toBeNull();
  });

  it("returns null with fewer than 3 records", () => {
    const history = [mkMax("sq", 300, "2026-04-01")];
    expect(detectPlateau("sq", "Back Squat", history)).toBeNull();
  });

  it("scopes history to the requested exercise", () => {
    const history = [
      mkMax("dl", 500, "2026-04-01"),
      mkMax("sq", 300, "2026-03-15"),
    ];
    expect(detectPlateau("sq", "Back Squat", history)).toBeNull();
  });
});

describe("detectRisingPain", () => {
  function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }

  it("flags warn when intensity jumps by 1.5+", () => {
    const trend: PainPoint[] = [
      { date: daysAgo(1), intensity: 6 },
      { date: daysAgo(3), intensity: 5 },
      { date: daysAgo(5), intensity: 6 },
      { date: daysAgo(10), intensity: 3 },
      { date: daysAgo(12), intensity: 3 },
      { date: daysAgo(15), intensity: 4 },
    ];
    const r = detectRisingPain(trend);
    expect(r).not.toBeNull();
    expect(r?.severity).toBe("warn");
  });

  it("flags urgent at +3", () => {
    const trend: PainPoint[] = [
      { date: daysAgo(1), intensity: 8 },
      { date: daysAgo(3), intensity: 8 },
      { date: daysAgo(5), intensity: 7 },
      { date: daysAgo(10), intensity: 2 },
      { date: daysAgo(12), intensity: 3 },
      { date: daysAgo(15), intensity: 3 },
    ];
    const r = detectRisingPain(trend);
    expect(r?.severity).toBe("urgent");
  });

  it("is null when pain is stable", () => {
    const trend: PainPoint[] = [
      { date: daysAgo(1), intensity: 4 },
      { date: daysAgo(3), intensity: 4 },
      { date: daysAgo(10), intensity: 4 },
      { date: daysAgo(12), intensity: 4 },
      { date: daysAgo(15), intensity: 4 },
    ];
    expect(detectRisingPain(trend)).toBeNull();
  });

  it("is null without enough data", () => {
    expect(detectRisingPain([])).toBeNull();
  });
});

describe("detectHighAcwr", () => {
  it("returns null for null input", () => {
    expect(detectHighAcwr(null)).toBeNull();
  });

  it("returns null below threshold", () => {
    expect(detectHighAcwr(1.3)).toBeNull();
    expect(detectHighAcwr(1.49)).toBeNull();
  });

  it("warns at 1.5", () => {
    expect(detectHighAcwr(1.6)?.severity).toBe("warn");
  });

  it("urgent at 1.8+", () => {
    expect(detectHighAcwr(1.9)?.severity).toBe("urgent");
    expect(detectHighAcwr(2.0)?.severity).toBe("urgent");
  });
});

describe("detectStalledVolume", () => {
  const weeks: WeeklyVolumePoint[] = [
    { weekStart: "2026-03-09", totalVolumeLbs: 10_000 },
    { weekStart: "2026-03-16", totalVolumeLbs: 11_000 },
    { weekStart: "2026-03-23", totalVolumeLbs: 9_500 },
    { weekStart: "2026-03-30", totalVolumeLbs: 6_000 }, // down >30%
  ];

  it("flags >30% drop vs prior 3-week average", () => {
    const r = detectStalledVolume(weeks);
    expect(r).not.toBeNull();
    expect(r?.kind).toBe("reduce_volume");
  });

  it("returns null when volume holds steady", () => {
    const steady = weeks.map((w, i) => ({
      ...w,
      totalVolumeLbs: i === 3 ? 10_500 : w.totalVolumeLbs,
    }));
    expect(detectStalledVolume(steady)).toBeNull();
  });

  it("needs at least 4 weeks of data", () => {
    expect(detectStalledVolume(weeks.slice(0, 3))).toBeNull();
  });
});

describe("detectStaleBenchmarks", () => {
  it("flags benchmarks older than 60 days", () => {
    const out = detectStaleBenchmarks([
      {
        benchmark_id: "fran",
        benchmark_name: "Fran",
        last_performed_on: "2026-01-01",
        days_since: 80,
      },
      {
        benchmark_id: "grace",
        benchmark_name: "Grace",
        last_performed_on: "2026-03-01",
        days_since: 30,
      },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].rationale).toContain("Fran");
  });
});
