// Port of CycleCalculations.swift / CyclePhaseScorer.swift.

export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

export type CycleSettings = {
  averageCycleLengthDays: number; // default 28
  averagePeriodLengthDays: number; // default 5
  lutealPhaseLengthDays: number; // default 14
};

export type PeriodLog = {
  startDate: Date;
  endDate: Date | null;
};

export type PhaseBoundary = { start: number; end: number };

export type CycleStatus = {
  currentPhase: CyclePhase;
  cycleDay: number;
  daysUntilNextPhase: number;
  predictedNextPeriod: Date;
  phaseStartDate: Date;
  phaseEndDate: Date;
};

export const DEFAULT_CYCLE_SETTINGS: CycleSettings = {
  averageCycleLengthDays: 28,
  averagePeriodLengthDays: 5,
  lutealPhaseLengthDays: 14,
};

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function addDays(d: Date, days: number): Date {
  const c = startOfDay(d);
  c.setDate(c.getDate() + days);
  return c;
}

function daysBetween(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.round(ms / 86_400_000);
}

function isWithin(target: Date, start: Date, end: Date): boolean {
  const t = startOfDay(target).getTime();
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
}

export function getPhaseBoundaries(
  settings: CycleSettings,
): Record<CyclePhase, PhaseBoundary> {
  const cycle = settings.averageCycleLengthDays;
  const period = settings.averagePeriodLengthDays;
  const luteal = settings.lutealPhaseLengthDays;

  const ovDay = cycle - luteal;
  const ovStart = Math.max(period + 2, ovDay - 2);
  const ovEnd = Math.min(ovDay + 2, cycle - luteal + 2);

  return {
    menstrual: { start: 1, end: period },
    follicular: { start: period + 1, end: ovStart - 1 },
    ovulation: { start: ovStart, end: ovEnd },
    luteal: { start: ovEnd + 1, end: cycle },
  };
}

export function calculateCycleStatus(
  periodLogs: readonly PeriodLog[],
  settings: CycleSettings = DEFAULT_CYCLE_SETTINGS,
  referenceDate: Date = new Date(),
): CycleStatus | null {
  if (periodLogs.length === 0) return null;

  const ref = startOfDay(referenceDate);
  const sorted = [...periodLogs].sort(
    (a, b) => startOfDay(b.startDate).getTime() - startOfDay(a.startDate).getTime(),
  );

  let cycleStart: Date | null = null;
  for (const period of sorted) {
    const pStart = startOfDay(period.startDate);
    let pEnd: Date;
    if (period.endDate) pEnd = startOfDay(period.endDate);
    else if (ref >= pStart) pEnd = ref;
    else pEnd = addDays(pStart, settings.averagePeriodLengthDays - 1);

    if (isWithin(ref, pStart, pEnd)) {
      cycleStart = pStart;
      break;
    }
    const nextExpected = addDays(pStart, settings.averageCycleLengthDays);
    if (ref > pEnd && ref < nextExpected) {
      cycleStart = pStart;
      break;
    }
  }

  if (!cycleStart) {
    let start = startOfDay(sorted[0].startDate);
    const daysSince = daysBetween(start, ref);
    const safeLen = Math.max(1, settings.averageCycleLengthDays);
    const completed = Math.floor(daysSince / safeLen);
    start = addDays(start, completed * safeLen);
    cycleStart = start;
  }

  const cycleDay = daysBetween(cycleStart, ref) + 1;
  const boundaries = getPhaseBoundaries(settings);

  let currentPhase: CyclePhase = "follicular";
  let phaseStartDay = 1;
  let phaseEndDay = settings.averageCycleLengthDays;
  for (const phase of ["menstrual", "follicular", "ovulation", "luteal"] as const) {
    const b = boundaries[phase];
    if (cycleDay >= b.start && cycleDay <= b.end) {
      currentPhase = phase;
      phaseStartDay = b.start;
      phaseEndDay = b.end;
      break;
    }
  }

  let daysUntilNext = 0;
  switch (currentPhase) {
    case "menstrual":
      daysUntilNext = boundaries.follicular.start - cycleDay;
      break;
    case "follicular":
      daysUntilNext = boundaries.ovulation.start - cycleDay;
      break;
    case "ovulation":
      daysUntilNext = boundaries.luteal.start - cycleDay;
      break;
    case "luteal":
      daysUntilNext = settings.averageCycleLengthDays - cycleDay + 1;
      break;
  }

  return {
    currentPhase,
    cycleDay,
    daysUntilNextPhase: Math.max(0, daysUntilNext),
    predictedNextPeriod: addDays(cycleStart, settings.averageCycleLengthDays),
    phaseStartDate: addDays(cycleStart, phaseStartDay - 1),
    phaseEndDate: addDays(cycleStart, phaseEndDay - 1),
  };
}

export function scoreCyclePhase(phase: CyclePhase | null): {
  score: number;
  explanation: string;
} {
  switch (phase) {
    case "follicular":
      return { score: 80, explanation: "Follicular phase — energy rising, good for intensity" };
    case "ovulation":
      return { score: 85, explanation: "Ovulation phase — peak performance window" };
    case "luteal":
      return {
        score: 60,
        explanation: "Luteal phase — recovery may be slower, focus on maintenance",
      };
    case "menstrual":
      return {
        score: 50,
        explanation: "Menstrual phase — energy typically lower, prioritize recovery",
      };
    default:
      return { score: 70, explanation: "No cycle data — moderate default" };
  }
}

export type PhaseRecommendation = {
  phase: CyclePhase;
  title: string;
  description: string;
  trainingFocus: string;
  intensityRecommendation: "low" | "moderate" | "peak";
  exercisesToEmphasize: string[];
  exercisesToAvoid: string[];
};

export function getPhaseRecommendation(phase: CyclePhase): PhaseRecommendation {
  switch (phase) {
    case "menstrual":
      return {
        phase,
        title: "Shark Week",
        description:
          "Your period phase. Energy may be lower — you might feel more fatigued.",
        trainingFocus: "Recovery and light movement",
        intensityRecommendation: "low",
        exercisesToEmphasize: ["yoga", "walking", "light stretching"],
        exercisesToAvoid: ["heavy compound lifts", "max effort attempts"],
      };
    case "follicular":
      return {
        phase,
        title: "Follicular Phase",
        description:
          "Energy and endurance begin to rise. Estrogen increases, supporting muscle growth.",
        trainingFocus: "Building strength and endurance",
        intensityRecommendation: "moderate",
        exercisesToEmphasize: ["compound movements", "strength training", "cardio"],
        exercisesToAvoid: [],
      };
    case "ovulation":
      return {
        phase,
        title: "Ovulation Phase",
        description: "Peak estrogen and testosterone. Often the strongest phase for performance.",
        trainingFocus: "High-intensity training and PR attempts",
        intensityRecommendation: "peak",
        exercisesToEmphasize: [
          "max effort attempts",
          "heavy compound lifts",
          "power-focused workouts",
        ],
        exercisesToAvoid: [],
      };
    case "luteal":
      return {
        phase,
        title: "Luteal Phase",
        description:
          "Progesterone rises, which may affect recovery and energy. Focus on maintenance.",
        trainingFocus: "Maintenance and technique refinement",
        intensityRecommendation: "moderate",
        exercisesToEmphasize: [
          "technique work",
          "volume training",
          "recovery-focused sessions",
        ],
        exercisesToAvoid: ["max effort attempts", "extremely heavy loads"],
      };
  }
}
