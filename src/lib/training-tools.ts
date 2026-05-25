export type TrainingToolSlug =
  | "readiness-score-calculator"
  | "deload-week-planner"
  | "cycle-symptom-workout-modifier"
  | "one-rep-max-readiness-checklist"
  | "rpe-rir-chart";

export type TrainingTool = {
  slug: TrainingToolSlug;
  href: `/tools/${TrainingToolSlug}`;
  title: string;
  description: string;
  intro: string;
  topicSummary: string;
};

export const trainingTools: TrainingTool[] = [
  {
    slug: "readiness-score-calculator",
    href: "/tools/readiness-score-calculator",
    title: "Readiness Score Calculator",
    description:
      "A lightweight page for lifters who want a simple readiness lens before deciding how hard to train today.",
    intro:
      "The readiness score calculator page is a placeholder route for the richer tool phase, but it already serves a real purpose: it gives topic hubs a valid destination for lifters who want a fast explanation of what the tool will help them decide. Use it when sleep, soreness, stress, or illness make the original plan less trustworthy and you need a conservative next step.",
    topicSummary:
      "Pairs recovery and pain-aware topic hubs with a simple decision surface around daily training tolerance.",
  },
  {
    slug: "deload-week-planner",
    href: "/tools/deload-week-planner",
    title: "Deload Week Planner",
    description:
      "A lightweight route for understanding when fatigue, soreness, and stalled performance point toward a deload week.",
    intro:
      "The deload week planner page gives the topic hubs a live route for athletes who need a fast explanation of what a future deload tool will organize. It frames the tool around practical triggers like accumulated fatigue, low motivation, repeated performance dips, and recovery debt, keeping the route useful even before the interactive planner ships.",
    topicSummary:
      "Supports recovery and programming hubs with a concrete destination for deload-related next steps.",
  },
  {
    slug: "cycle-symptom-workout-modifier",
    href: "/tools/cycle-symptom-workout-modifier",
    title: "Cycle Symptom Workout Modifier",
    description:
      "A lightweight route for lifters who want symptom-specific workout modifications without turning cycle context into rigid rules.",
    intro:
      "The cycle symptom workout modifier page gives the women-who-lift hub a real destination for readers who want help translating cramps, fatigue, bloating, spotting, or other symptoms into practical session changes. It is intentionally small for now, but it still explains the job the later interactive tool will do and keeps the linked hub route honest in production.",
    topicSummary:
      "Supports cycle-aware topic content with a clear route for symptom-based session adjustments.",
  },
  {
    slug: "one-rep-max-readiness-checklist",
    href: "/tools/one-rep-max-readiness-checklist",
    title: "One-Rep Max Readiness Checklist",
    description:
      "A lightweight route for deciding whether a training block and current recovery state support max testing.",
    intro:
      "The one-rep max readiness checklist page gives the programming hub a real destination for readers trying to decide whether testing belongs in the current week. It stays lightweight, but it already explains the purpose of the later checklist: reducing impulsive max attempts by tying testing to block quality, recovery, and recent execution rather than emotion.",
    topicSummary:
      "Supports programming-basics topic content with a route focused on timing and readiness for max testing.",
  },
  {
    slug: "rpe-rir-chart",
    href: "/tools/rpe-rir-chart",
    title: "RPE / RIR Chart",
    description:
      "A lightweight route for lifters who need a stable reference for effort targets during strength sessions.",
    intro:
      "The RPE / RIR chart page gives the programming hub a real route for readers who want a simple explanation of how perceived exertion and reps in reserve guide loading decisions. It is not the full interactive chart yet, but it already captures the promise of the route and prevents the topic hubs from sending users into a dead end.",
    topicSummary:
      "Supports programming-basics topic content with an effort-target reference route.",
  },
];

const trainingToolBySlug = new Map(trainingTools.map((tool) => [tool.slug, tool]));

export function getTrainingTool(slug: string): TrainingTool {
  const tool = trainingToolBySlug.get(slug as TrainingToolSlug);

  if (!tool) {
    throw new Error(`Unknown training tool: ${slug}`);
  }

  return tool;
}
