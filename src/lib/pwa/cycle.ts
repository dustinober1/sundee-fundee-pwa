export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";

export type CycleSettings = {
  averageCycleLengthDays: number;
  averagePeriodLengthDays: number;
  lutealPhaseLengthDays?: number;
};

export type PeriodLog = {
  startedOn: string;
  endedOn?: string | null;
};

export type PhaseBoundary = {
  start: number;
  end: number;
};

export type CycleStatus = {
  currentPhase: CyclePhase;
  cycleDay: number;
  daysUntilNextPhase: number;
  predictedNextPeriod: string;
  phaseStartDate: string;
  phaseEndDate: string;
};

export type PhaseRecommendation = {
  phase: CyclePhase;
  title: string;
  description: string;
  trainingFocus: string;
  intensityRecommendation: "low" | "moderate" | "peak";
  exercisesToEmphasize: string[];
  exercisesToAvoid: string[];
};

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function parseDate(value: string) {
  return startOfDay(new Date(`${value}T00:00:00`));
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = startOfDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysBetween(from: Date, to: Date) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / msPerDay);
}

function isWithin(target: Date, start: Date, end: Date) {
  const time = startOfDay(target).getTime();
  return time >= startOfDay(start).getTime() && time <= startOfDay(end).getTime();
}

export function getPhaseBoundaries(settings: CycleSettings) {
  const cycleLen = settings.averageCycleLengthDays;
  const periodLen = settings.averagePeriodLengthDays;
  const lutealLen = settings.lutealPhaseLengthDays ?? 14;
  const ovDay = cycleLen - lutealLen;
  const ovStart = Math.max(periodLen + 2, ovDay - 2);
  const ovEnd = Math.min(ovDay + 2, cycleLen - lutealLen + 2);

  return {
    menstrual: { start: 1, end: periodLen },
    follicular: { start: periodLen + 1, end: ovStart - 1 },
    ovulation: { start: ovStart, end: ovEnd },
    luteal: { start: ovEnd + 1, end: cycleLen },
  } satisfies Record<CyclePhase, PhaseBoundary>;
}

export function calculateCycleStatus(
  periodLogs: PeriodLog[],
  settings: CycleSettings,
  referenceDate = new Date(),
): CycleStatus | null {
  if (periodLogs.length === 0) return null;

  const ref = startOfDay(referenceDate);
  const sorted = [...periodLogs].sort(
    (a, b) => parseDate(b.startedOn).getTime() - parseDate(a.startedOn).getTime(),
  );

  let cycleStartDate: Date | null = null;

  for (const period of sorted) {
    const periodStart = parseDate(period.startedOn);
    let periodEnd: Date;

    if (period.endedOn) {
      periodEnd = parseDate(period.endedOn);
    } else if (ref >= periodStart) {
      periodEnd = ref;
    } else {
      periodEnd = addDays(periodStart, settings.averagePeriodLengthDays - 1);
    }

    if (isWithin(ref, periodStart, periodEnd)) {
      cycleStartDate = periodStart;
      break;
    }

    const nextExpected = addDays(periodStart, settings.averageCycleLengthDays);
    if (ref > periodEnd && ref < nextExpected) {
      cycleStartDate = periodStart;
      break;
    }
  }

  if (!cycleStartDate) {
    const mostRecent = sorted[0];
    const start = parseDate(mostRecent.startedOn);
    const daysSince = daysBetween(start, ref);
    const safeCycleLength = Math.max(1, settings.averageCycleLengthDays);
    cycleStartDate = addDays(start, Math.floor(daysSince / safeCycleLength) * safeCycleLength);
  }

  const cycleDay = daysBetween(cycleStartDate, ref) + 1;
  const boundaries = getPhaseBoundaries(settings);
  const phases: CyclePhase[] = ["menstrual", "follicular", "ovulation", "luteal"];
  let currentPhase: CyclePhase = "follicular";
  let phaseStartDay = 1;
  let phaseEndDay = settings.averageCycleLengthDays;

  for (const phase of phases) {
    const boundary = boundaries[phase];
    if (cycleDay >= boundary.start && cycleDay <= boundary.end) {
      currentPhase = phase;
      phaseStartDay = boundary.start;
      phaseEndDay = boundary.end;
      break;
    }
  }

  const daysUntilNextPhase =
    currentPhase === "menstrual"
      ? boundaries.follicular.start - cycleDay
      : currentPhase === "follicular"
        ? boundaries.ovulation.start - cycleDay
        : currentPhase === "ovulation"
          ? boundaries.luteal.start - cycleDay
          : settings.averageCycleLengthDays - cycleDay + 1;

  return {
    currentPhase,
    cycleDay,
    daysUntilNextPhase: Math.max(0, daysUntilNextPhase),
    predictedNextPeriod: toDateString(addDays(cycleStartDate, settings.averageCycleLengthDays)),
    phaseStartDate: toDateString(addDays(cycleStartDate, phaseStartDay - 1)),
    phaseEndDate: toDateString(addDays(cycleStartDate, phaseEndDay - 1)),
  };
}

export function getPhaseRecommendation(phase: CyclePhase): PhaseRecommendation {
  switch (phase) {
    case "menstrual":
      return {
        phase,
        title: "Shark Week",
        description: "Energy may be lower and fatigue may be higher.",
        trainingFocus: "Recovery and light movement",
        intensityRecommendation: "low",
        exercisesToEmphasize: ["walking", "light stretching", "easy technique work"],
        exercisesToAvoid: ["heavy compound lifts", "max effort attempts"],
      };
    case "follicular":
      return {
        phase,
        title: "Follicular Phase",
        description: "Energy and endurance often begin to rise.",
        trainingFocus: "Build strength and endurance",
        intensityRecommendation: "moderate",
        exercisesToEmphasize: ["compound movements", "strength training", "cardio"],
        exercisesToAvoid: [],
      };
    case "ovulation":
      return {
        phase,
        title: "Ovulation Phase",
        description: "Often a strong performance window.",
        trainingFocus: "High-intensity training and PR attempts",
        intensityRecommendation: "peak",
        exercisesToEmphasize: ["heavy compound lifts", "power work", "max effort attempts"],
        exercisesToAvoid: [],
      };
    case "luteal":
      return {
        phase,
        title: "Luteal Phase",
        description: "Recovery and energy may become more variable.",
        trainingFocus: "Maintenance and technique refinement",
        intensityRecommendation: "moderate",
        exercisesToEmphasize: ["technique work", "volume training", "recovery-focused sessions"],
        exercisesToAvoid: ["max effort attempts", "extremely heavy loads"],
      };
  }
}
