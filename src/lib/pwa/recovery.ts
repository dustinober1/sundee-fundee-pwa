import type { CyclePhase } from "./cycle";

export type RecoveryInputs = {
  sleepHours?: number | null;
  soreness?: number | null;
  stress?: number | null;
  cyclePhase?: CyclePhase | null;
};

export type RecoveryRecommendation = "pushDay" | "moderate" | "restDay";

export type RecoveryResult = {
  total: number;
  recommendation: RecoveryRecommendation;
  presentInputCount: number;
  explanations: string[];
};

function scoreSleep(hours: number) {
  if (hours >= 8) return 100;
  if (hours >= 7) return 85;
  if (hours >= 6) return 60;
  if (hours >= 5) return 35;
  return 10;
}

function scoreInverseTenPoint(value: number) {
  return Math.max(0, Math.min(100, Math.round(100 - value * 10)));
}

function scoreCyclePhase(phase: CyclePhase) {
  switch (phase) {
    case "ovulation":
      return 95;
    case "follicular":
      return 85;
    case "luteal":
      return 65;
    case "menstrual":
      return 45;
  }
}

export function calculateRecoveryScore(inputs: RecoveryInputs): RecoveryResult | null {
  const scored: Array<{ score: number; weight: number; explanation: string }> = [];

  if (typeof inputs.sleepHours === "number") {
    const score = scoreSleep(inputs.sleepHours);
    scored.push({
      score,
      weight: 0.35,
      explanation: `${inputs.sleepHours.toFixed(1)}h sleep -> ${score}/100`,
    });
  }

  if (typeof inputs.soreness === "number") {
    const score = scoreInverseTenPoint(inputs.soreness);
    scored.push({
      score,
      weight: 0.25,
      explanation: `Soreness ${inputs.soreness}/10 -> ${score}/100`,
    });
  }

  if (typeof inputs.stress === "number") {
    const score = scoreInverseTenPoint(inputs.stress);
    scored.push({
      score,
      weight: 0.25,
      explanation: `Stress ${inputs.stress}/10 -> ${score}/100`,
    });
  }

  if (inputs.cyclePhase) {
    const score = scoreCyclePhase(inputs.cyclePhase);
    scored.push({
      score,
      weight: 0.15,
      explanation: `${inputs.cyclePhase} phase -> ${score}/100`,
    });
  }

  if (scored.length === 0) return null;

  const totalWeight = scored.reduce((sum, item) => sum + item.weight, 0);
  const total = Math.round(
    scored.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight,
  );
  const clamped = Math.max(0, Math.min(100, total));

  return {
    total: clamped,
    recommendation:
      clamped >= 70 ? "pushDay" : clamped >= 40 ? "moderate" : "restDay",
    presentInputCount: scored.length,
    explanations: scored.map((item) => item.explanation),
  };
}
