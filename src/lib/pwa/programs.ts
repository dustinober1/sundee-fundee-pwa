export type ProgramExercise = {
  exercise: string;
  sets: number;
  reps: number;
  percent1RM?: number;
  restMinutes: number;
  bodyweightOnly?: boolean;
};

export type ProgramSession = {
  sessionId: string;
  sessionName: string;
  sessionType: "strength";
  focus: string;
  exercises: ProgramExercise[];
};

export type ProgramWeek = {
  week: number;
  phaseId: "accumulation" | "intensification" | "deload";
  sessions: ProgramSession[];
};

export type ProgramTemplate = {
  id: string;
  name: string;
  category: string;
  description: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  difficulty: string;
  weeks: ProgramWeek[];
};

function ex(
  exercise: string,
  sets: number,
  reps: number,
  percent1RM: number | undefined,
  restMinutes: number,
  bodyweightOnly = false,
): ProgramExercise {
  return { exercise, sets, reps, percent1RM, restMinutes, bodyweightOnly };
}

function session(
  week: number,
  day: number,
  sessionName: string,
  focus: string,
  exercises: ProgramExercise[],
): ProgramSession {
  return {
    sessionId: `w${week}d${day}`,
    sessionName,
    sessionType: "strength",
    focus,
    exercises,
  };
}

const weekPatterns = [
  { phaseId: "accumulation" as const, squatPct: 0.78, benchPct: 0.77, deadliftPct: 0.75, sets: 3, reps: 5 },
  { phaseId: "accumulation" as const, squatPct: 0.8, benchPct: 0.8, deadliftPct: 0.78, sets: 3, reps: 5 },
  { phaseId: "accumulation" as const, squatPct: 0.8, benchPct: 0.8, deadliftPct: 0.82, sets: 3, reps: 5 },
  { phaseId: "accumulation" as const, squatPct: 0.82, benchPct: 0.82, deadliftPct: 0.8, sets: 3, reps: 5 },
  { phaseId: "intensification" as const, squatPct: 0.85, benchPct: 0.85, deadliftPct: 0.85, sets: 4, reps: 3 },
  { phaseId: "intensification" as const, squatPct: 0.88, benchPct: 0.88, deadliftPct: 0.88, sets: 4, reps: 2 },
  { phaseId: "intensification" as const, squatPct: 0.9, benchPct: 0.9, deadliftPct: 0.9, sets: 4, reps: 2 },
  { phaseId: "deload" as const, squatPct: 0.6, benchPct: 0.6, deadliftPct: undefined, sets: 2, reps: 5 },
];

export const FIRST_MARGARITA_PROGRAM: ProgramTemplate = {
  id: "sundee-first-margarita",
  name: "The First Margarita",
  category: "Strength",
  description:
    "An 8-week strength block for squat, bench, deadlift, and foundational Olympic pulling work.",
  durationWeeks: 8,
  sessionsPerWeek: 3,
  difficulty: "Advanced",
  weeks: weekPatterns.map((pattern, index) => {
    const week = index + 1;
    const isTesting = week === 8;
    return {
      week,
      phaseId: pattern.phaseId,
      sessions: [
        session(week, 1, `Week ${week} Day 1 - Squat Focus`, "squat", [
          ex("Back Squat", pattern.sets, pattern.reps, pattern.squatPct, 3),
          ex("Romanian Deadlift", 2, week >= 5 ? 5 : 8, undefined, 2.5),
          ex("Overhead Press", 2, pattern.reps, Math.max(0.55, pattern.squatPct - 0.03), 2.5),
          ex("Barbell Row", 2, week >= 5 ? 5 : 8, undefined, 1.5),
        ]),
        session(week, 2, `Week ${week} Day 2 - Bench Focus`, "bench", [
          ex("Bench Press", pattern.sets, pattern.reps, pattern.benchPct, 3),
          ex("Snatch Pull", isTesting ? 2 : 3, 3, undefined, 2),
          ex("Close Grip Bench Press", 2, week >= 5 ? 3 : 8, undefined, 2),
          ex("Dumbbell Row", 2, week >= 5 ? 5 : 8, undefined, 1.5),
        ]),
        session(week, 3, isTesting ? "Week 8 Day 3 - Testing Day" : `Week ${week} Day 3 - Deadlift Focus`, isTesting ? "testing" : "deadlift", [
          ex("Deadlift", isTesting ? 5 : Math.max(pattern.sets, 4), isTesting ? 1 : pattern.reps, pattern.deadliftPct, isTesting ? 4 : 3),
          ex("Clean Pull", isTesting ? 2 : 3, isTesting ? 2 : 3, undefined, 2),
          ex("Pause Squat", 2, pattern.reps, undefined, 2.5),
          ex(isTesting ? "Mobility Cooldown" : "Face Pull", 1, isTesting ? 10 : 15, undefined, 1, isTesting),
        ]),
      ],
    };
  }),
};

export function flattenProgramSessions(program = FIRST_MARGARITA_PROGRAM) {
  return program.weeks.flatMap((week) =>
    week.sessions.map((programSession, sessionIndex) => ({
      ...programSession,
      week: week.week,
      phaseId: week.phaseId,
      globalIndex: (week.week - 1) * program.sessionsPerWeek + sessionIndex,
    })),
  );
}

export function getProgramSessionByIndex(index: number, program = FIRST_MARGARITA_PROGRAM) {
  const sessions = flattenProgramSessions(program);
  return sessions[Math.min(Math.max(index, 0), sessions.length - 1)] ?? null;
}
