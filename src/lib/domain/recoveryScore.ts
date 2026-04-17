// Port of RecoveryScoreCalculator.swift, PainScorer.swift, HRVBaselineNormalizer.swift,
// TrainingLoadScorer.swift.

import { scoreCyclePhase, type CyclePhase } from "./cyclePhase";

export type RecoveryInput = "hrv" | "sleep" | "trainingLoad" | "cyclePhase" | "pain";

export type TrainingRecommendation = "push_day" | "moderate" | "rest_day";

export const RECOVERY_INPUT_WEIGHTS: Record<RecoveryInput, number> = {
  hrv: 0.3,
  sleep: 0.25,
  trainingLoad: 0.25,
  cyclePhase: 0.15,
  pain: 0.05,
};

export type RecoveryScoreInputs = {
  hrvMilliseconds?: number | null;
  sleepDurationHours?: number | null;
  acwr?: number | null; // pre-computed acute:chronic workload ratio
  cyclePhase?: CyclePhase | null;
  painIntensity?: number | null;
};

export type RecoveryScore = {
  total: number;
  recommendation: TrainingRecommendation;
  subScores: Partial<Record<RecoveryInput, number>>;
  explanations: Partial<Record<RecoveryInput, string>>;
  presentInputCount: number;
};

// HRV phase normalization ───────────────────────────────────────────────────
const HRV_PHASE_MULTIPLIER: Record<CyclePhase | "none", number> = {
  follicular: 1.0,
  ovulation: 1.05,
  luteal: 0.85,
  menstrual: 0.9,
  none: 1.0,
};

export function normalizeHrv(hrvMs: number, phase: CyclePhase | null | undefined): number {
  return hrvMs / HRV_PHASE_MULTIPLIER[phase ?? "none"];
}

export function scoreHrv(normalizedHrvMs: number): number {
  if (normalizedHrvMs >= 80) return 100;
  if (normalizedHrvMs >= 60) return Math.round(60 + ((normalizedHrvMs - 60) / 20) * 40);
  if (normalizedHrvMs >= 40) return Math.round(30 + ((normalizedHrvMs - 40) / 20) * 30);
  if (normalizedHrvMs >= 20) return Math.round(10 + ((normalizedHrvMs - 20) / 20) * 20);
  return 0;
}

// Sleep ─────────────────────────────────────────────────────────────────────
export function scoreSleep(hours: number): number {
  if (hours >= 8) return 100;
  if (hours >= 7) return 85;
  if (hours >= 6) return 60;
  if (hours >= 5) return 35;
  return 10;
}

// Pain ──────────────────────────────────────────────────────────────────────
export function scorePain(intensity: number): { score: number; explanation: string } {
  const clamped = Math.max(1, Math.min(10, Math.round(intensity)));
  const score = Math.max(0, 100 - (clamped - 1) * 11);
  const explanation =
    clamped <= 2
      ? "Minimal pain"
      : clamped <= 5
        ? "Moderate soreness"
        : "High pain — prioritize recovery";
  return { score, explanation };
}

// Training load (ACWR) ──────────────────────────────────────────────────────
export function scoreAcwr(acwr: number): { score: number; explanation: string } {
  if (acwr < 0.8)
    return { score: 90, explanation: "Load is well within recovery range — well rested" };
  if (acwr < 1.0) return { score: 80, explanation: "Load is within recovery range" };
  if (acwr < 1.3)
    return { score: 60, explanation: "Load is within recovery range — building phase" };
  if (acwr < 1.5)
    return { score: 40, explanation: "High weekly load — body needs recovery time" };
  return { score: 20, explanation: "High weekly load — body needs recovery time" };
}

// Top-level calculator ─────────────────────────────────────────────────────
export function calculateRecoveryScore(inputs: RecoveryScoreInputs): RecoveryScore | null {
  let weightedSum = 0;
  let totalWeight = 0;
  const subScores: Partial<Record<RecoveryInput, number>> = {};
  const explanations: Partial<Record<RecoveryInput, string>> = {};

  if (inputs.hrvMilliseconds != null) {
    const norm = normalizeHrv(inputs.hrvMilliseconds, inputs.cyclePhase);
    const score = scoreHrv(norm);
    subScores.hrv = score;
    weightedSum += score * RECOVERY_INPUT_WEIGHTS.hrv;
    totalWeight += RECOVERY_INPUT_WEIGHTS.hrv;
    const phaseNote = inputs.cyclePhase ? " (phase-normalized)" : "";
    explanations.hrv = `HRV ${Math.round(inputs.hrvMilliseconds)}ms → ${score}/100${phaseNote}`;
  }

  if (inputs.sleepDurationHours != null) {
    const score = scoreSleep(inputs.sleepDurationHours);
    subScores.sleep = score;
    weightedSum += score * RECOVERY_INPUT_WEIGHTS.sleep;
    totalWeight += RECOVERY_INPUT_WEIGHTS.sleep;
    explanations.sleep =
      inputs.sleepDurationHours >= 7
        ? `${inputs.sleepDurationHours.toFixed(1)}h — within 7h target`
        : `${inputs.sleepDurationHours.toFixed(1)}h — below 7h target`;
  }

  if (inputs.acwr != null) {
    const { score, explanation } = scoreAcwr(inputs.acwr);
    subScores.trainingLoad = score;
    weightedSum += score * RECOVERY_INPUT_WEIGHTS.trainingLoad;
    totalWeight += RECOVERY_INPUT_WEIGHTS.trainingLoad;
    explanations.trainingLoad = explanation;
  }

  if (inputs.cyclePhase) {
    const { score, explanation } = scoreCyclePhase(inputs.cyclePhase);
    subScores.cyclePhase = score;
    weightedSum += score * RECOVERY_INPUT_WEIGHTS.cyclePhase;
    totalWeight += RECOVERY_INPUT_WEIGHTS.cyclePhase;
    explanations.cyclePhase = explanation;
  }

  if (inputs.painIntensity != null) {
    const { score, explanation } = scorePain(inputs.painIntensity);
    subScores.pain = score;
    weightedSum += score * RECOVERY_INPUT_WEIGHTS.pain;
    totalWeight += RECOVERY_INPUT_WEIGHTS.pain;
    explanations.pain = explanation;
  }

  if (totalWeight === 0) return null;

  const total = Math.max(0, Math.min(100, Math.round(weightedSum / totalWeight)));
  const recommendation: TrainingRecommendation =
    total >= 70 ? "push_day" : total >= 40 ? "moderate" : "rest_day";

  return {
    total,
    recommendation,
    subScores,
    explanations,
    presentInputCount: Object.keys(subScores).length,
  };
}

export function recommendationLabel(r: TrainingRecommendation): string {
  switch (r) {
    case "push_day":
      return "Good to push";
    case "moderate":
      return "Moderate readiness";
    case "rest_day":
      return "Prioritize rest";
  }
}
