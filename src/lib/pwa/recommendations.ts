import type { CyclePhase } from "./cycle";
import type { ProgramSession } from "./programs";

export type TrainingAdjustment = "push" | "maintain" | "reduce" | "rest";

export type LocalRecommendationInput = {
  recoveryScore?: number | null;
  cyclePhase?: CyclePhase | null;
  soreness?: number | null;
  stress?: number | null;
  recentWorkoutCount?: number;
  programSession?: ProgramSession | null;
};

export type LocalTrainingRecommendation = {
  adjustment: TrainingAdjustment;
  title: string;
  summary: string;
  intensityMultiplier: number;
  setAdjustment: number;
  reasons: string[];
};

function baseFromRecovery(score?: number | null): TrainingAdjustment {
  if (typeof score !== "number") return "maintain";
  if (score >= 80) return "push";
  if (score >= 60) return "maintain";
  if (score >= 40) return "reduce";
  return "rest";
}

function downgrade(adjustment: TrainingAdjustment): TrainingAdjustment {
  if (adjustment === "push") return "maintain";
  if (adjustment === "maintain") return "reduce";
  return "rest";
}

function upgrade(adjustment: TrainingAdjustment): TrainingAdjustment {
  if (adjustment === "rest") return "reduce";
  if (adjustment === "reduce") return "maintain";
  if (adjustment === "maintain") return "push";
  return "push";
}

export function buildLocalTrainingRecommendation(
  input: LocalRecommendationInput,
): LocalTrainingRecommendation {
  const reasons: string[] = [];
  let adjustment = baseFromRecovery(input.recoveryScore);

  if (typeof input.recoveryScore === "number") {
    reasons.push(`Recovery score is ${input.recoveryScore}/100.`);
  } else {
    reasons.push("No recovery score yet, so the plan stays conservative.");
  }

  if (input.cyclePhase === "menstrual") {
    adjustment = downgrade(adjustment);
    reasons.push("Menstrual phase favors lower intensity and more recovery.");
  }

  if (input.cyclePhase === "ovulation" && adjustment === "maintain") {
    adjustment = upgrade(adjustment);
    reasons.push("Ovulation phase can support higher intensity if recovery is good.");
  }

  if ((input.soreness ?? 0) >= 7) {
    adjustment = downgrade(adjustment);
    reasons.push("High soreness suggests reducing volume today.");
  }

  if ((input.stress ?? 0) >= 8) {
    adjustment = downgrade(adjustment);
    reasons.push("High stress suggests keeping the session easier.");
  }

  if ((input.recentWorkoutCount ?? 0) === 0 && adjustment === "rest") {
    adjustment = "reduce";
    reasons.push("No recent local workouts are logged, so use a lighter session instead of skipping by default.");
  }

  const sessionName = input.programSession?.sessionName ?? "today's session";

  switch (adjustment) {
    case "push":
      return {
        adjustment,
        title: "Push the session",
        summary: `Run ${sessionName} as written. Add load only if warmups move well.`,
        intensityMultiplier: 1,
        setAdjustment: 0,
        reasons,
      };
    case "maintain":
      return {
        adjustment,
        title: "Train as planned",
        summary: `Keep ${sessionName} at planned sets and intensity.`,
        intensityMultiplier: 1,
        setAdjustment: 0,
        reasons,
      };
    case "reduce":
      return {
        adjustment,
        title: "Reduce the dose",
        summary: `Keep ${sessionName}, but trim one set from main lifts or use about 90% of planned load.`,
        intensityMultiplier: 0.9,
        setAdjustment: -1,
        reasons,
      };
    case "rest":
      return {
        adjustment,
        title: "Make it recovery work",
        summary: `Skip heavy work from ${sessionName}. Use walking, mobility, or easy technique instead.`,
        intensityMultiplier: 0.65,
        setAdjustment: -2,
        reasons,
      };
  }
}
