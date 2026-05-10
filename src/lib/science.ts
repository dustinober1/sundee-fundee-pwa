export type ScienceLayer = {
  id: string;
  eyebrow: string;
  title: string;
  input: string;
  interpretation: string;
  trainingChange: string;
  href: string;
};

export type ScienceEvidenceSource = {
  claim: string;
  title: string;
  href: string;
  supports: string;
  dontOverclaim: string;
};

export type ScienceReadinessLevel = "high" | "steady" | "low" | "very-low";
export type ScienceCycleContext =
  | "not-used"
  | "follicular"
  | "ovulatory"
  | "luteal"
  | "symptom-heavy";
export type SciencePainFlag = "none" | "minor" | "joint" | "acute";
export type ScienceSessionGoal =
  | "strength"
  | "hypertrophy"
  | "conditioning"
  | "technique";
export type ScienceRecommendationAction = "Push" | "Hold" | "Modify" | "Recover";

export type ScienceSimulatorState = {
  readiness: ScienceReadinessLevel;
  cycleContext: ScienceCycleContext;
  painFlag: SciencePainFlag;
  sessionGoal: ScienceSessionGoal;
};

export type ScienceRecommendation = {
  action: ScienceRecommendationAction;
  title: string;
  summary: string;
  load: string;
  volume: string;
  exerciseSelection: string;
  rest: string;
  rationale: string[];
};

export const defaultScienceSimulatorState: ScienceSimulatorState = {
  readiness: "steady",
  cycleContext: "not-used",
  painFlag: "none",
  sessionGoal: "strength",
};

export const scienceLayers: ScienceLayer[] = [
  {
    id: "readiness-score",
    eyebrow: "Readiness score",
    title: "Apple Health signals become a training decision.",
    input:
      "HRV trend, resting heart rate, sleep quality, subjective feel, and recent training load.",
    interpretation:
      "The app treats those signals as context around your own baseline rather than a pass-fail comparison to someone else.",
    trainingChange:
      "High-readiness days can support heavier loading. Lower-readiness days bias cleaner reps, lower total stress, or recovery work.",
    href: "/readiness-score-strength-training",
  },
  {
    id: "cycle-aware-training",
    eyebrow: "Cycle-aware training",
    title: "Cycle context is optional, not a rigid rulebook.",
    input:
      "Cycle phase, symptoms, sleep, and how the warm-up feels once the session starts.",
    interpretation:
      "Phase patterns can be useful, but the individual athlete still matters more than an average-cycle chart.",
    trainingChange:
      "The app can shift intensity, rest, and exercise emphasis while still letting readiness override the calendar.",
    href: "/cycle-aware-training",
  },
  {
    id: "injury-aware-programming",
    eyebrow: "Injury-aware programming",
    title: "Pain flags route the plan around the limitation.",
    input:
      "The movement pattern, tissue or joint involved, symptom severity, and the goal of the session.",
    interpretation:
      "The system separates the training intent from the exact exercise that may be causing the problem.",
    trainingChange:
      "A squat pattern might become a split squat, leg press, or technique-only day instead of vanishing from the week.",
    href: "/train-around-injury",
  },
  {
    id: "recovery-vs-calendar",
    eyebrow: "Recovery vs. calendar",
    title: "The week is a constraint, not the main signal.",
    input:
      "Training history, readiness, symptoms, and whether recent sessions created more fatigue than expected.",
    interpretation:
      "The planned day matters, but it should not overrule evidence that the athlete is not ready for that stress.",
    trainingChange:
      "The app preserves the purpose of the session while changing load, volume, rest, or exercise selection.",
    href: "/recovery-aware-strength-training",
  },
];

export const scienceEvidenceSources: ScienceEvidenceSource[] = [
  {
    claim: "Menstrual-cycle effects on maximal strength are worth tracking, but they are not universal.",
    title:
      "The Influence of Menstrual Cycle Phases on Maximal Strength Performance in Healthy Female Adults",
    href: "https://pubmed.ncbi.nlm.nih.gov/38251305/",
    supports:
      "Cycle phase can be relevant to strength performance research, which supports offering cycle context as an optional training input.",
    dontOverclaim:
      "It does not justify telling every athlete that a specific phase will always be strongest or weakest.",
  },
  {
    claim: "Exercise performance research supports individualized cycle-aware guidance.",
    title:
      "The Effects of Menstrual Cycle Phase on Exercise Performance in Eumenorrheic Women",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7497427/",
    supports:
      "Cycle phase can influence exercise performance, but the practical signal should be combined with symptoms and readiness.",
    dontOverclaim:
      "It does not support replacing lived feedback with a fixed 28-day programming rule.",
  },
  {
    claim: "Sleep matters for performance, recovery, and mood in athletes.",
    title: "The Impact of Sleep Interventions on Athletic Performance",
    href: "https://pubmed.ncbi.nlm.nih.gov/37462808/",
    supports:
      "Sleep quality belongs in a readiness model because it can affect how much training stress an athlete can use well.",
    dontOverclaim:
      "It does not mean one bad night should automatically cancel a strength session.",
  },
  {
    claim: "ACL and ligament-laxity research argues for conservative injury-risk framing.",
    title:
      "The Effect of Menstrual Cycle and Contraceptives on ACL Injuries and Laxity",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5524267/",
    supports:
      "Some research connects cycle biology with laxity and ACL risk, so high-risk movements deserve careful context.",
    dontOverclaim:
      "It does not mean the app can diagnose injury risk or make medical decisions.",
  },
];

function readinessRisk(readiness: ScienceReadinessLevel) {
  switch (readiness) {
    case "high":
      return 0;
    case "steady":
      return 1;
    case "low":
      return 2;
    case "very-low":
      return 3;
  }
}

function cycleRisk(cycleContext: ScienceCycleContext) {
  switch (cycleContext) {
    case "not-used":
    case "follicular":
      return 0;
    case "ovulatory":
    case "luteal":
      return 1;
    case "symptom-heavy":
      return 2;
  }
}

function painRisk(painFlag: SciencePainFlag) {
  switch (painFlag) {
    case "none":
      return 0;
    case "minor":
      return 1;
    case "joint":
      return 2;
    case "acute":
      return 4;
  }
}

function goalStress(goal: ScienceSessionGoal) {
  switch (goal) {
    case "technique":
      return 0;
    case "hypertrophy":
    case "conditioning":
      return 1;
    case "strength":
      return 2;
  }
}

export function getScienceRecommendation(
  state: ScienceSimulatorState,
): ScienceRecommendation {
  const risk =
    readinessRisk(state.readiness) +
    cycleRisk(state.cycleContext) +
    painRisk(state.painFlag) +
    goalStress(state.sessionGoal);

  if (state.painFlag === "acute" || state.readiness === "very-low" || risk >= 7) {
    return {
      action: "Recover",
      title: "Make recovery the session.",
      summary:
        "The illustrative model would avoid adding hard stress today and protect the next useful training day.",
      load: "Skip heavy loading; use unloaded movement, mobility, or a walk.",
      volume: "Keep it short enough that you leave feeling better than when you started.",
      exerciseSelection:
        "Avoid the painful pattern and choose recovery work that does not aggravate symptoms.",
      rest: "Use full rest and stop early if symptoms or fatigue rise.",
      rationale: [
        "Very low readiness or acute pain is a stronger signal than the planned workout.",
        "The goal is preserving training continuity, not winning one session.",
      ],
    };
  }

  if (state.painFlag === "joint" || state.readiness === "low" || risk >= 5) {
    return {
      action: "Modify",
      title: "Keep the intent, lower the cost.",
      summary:
        "The illustrative model would preserve the training pattern while changing the most expensive parts of the session.",
      load: "Reduce load by about 10-20% or cap effort around RPE 6-7.",
      volume: "Cut one to two working sets from the main stressor.",
      exerciseSelection:
        "Swap the flagged movement for a more tolerable variation that trains the same pattern.",
      rest: "Add 30-60 seconds of rest so fatigue does not force sloppy reps.",
      rationale: [
        "Lower readiness, symptoms, or joint irritation should change the dose.",
        "A modified session still keeps the habit and the training direction alive.",
      ],
    };
  }

  if (state.readiness === "high" && state.painFlag === "none" && risk <= 3) {
    return {
      action: "Push",
      title: "Use the good day.",
      summary:
        "The illustrative model would keep the planned session ambitious while still leaving room for warm-up feedback.",
      load: "Keep planned loading or take a small top-set opportunity.",
      volume: "Run the planned work and add optional back-off volume only if reps stay crisp.",
      exerciseSelection:
        "Keep primary lifts in place unless the warm-up exposes a limitation.",
      rest: "Use normal strength rest so quality stays high.",
      rationale: [
        "High readiness with no pain gives the plan permission to stay demanding.",
        "The model still treats the warm-up as the final check.",
      ],
    };
  }

  return {
    action: "Hold",
    title: "Run the plan, keep it honest.",
    summary:
      "The illustrative model would keep today close to the original workout without turning it into a test day.",
    load: "Keep normal working weights and avoid surprise max attempts.",
    volume: "Complete the planned sets unless bar speed or symptoms clearly fade.",
    exerciseSelection:
      "Use the planned exercises and keep substitutions available if the warm-up changes the picture.",
    rest: "Use normal rest periods and extend slightly if effort climbs too fast.",
    rationale: [
      "A steady day does not need over-management.",
      "The point is matching stress to the athlete, not making every session easier.",
    ],
  };
}
