import type {
  BlogArticleIntent,
  BlogInteractiveModule,
  BlogInteractivePlacement,
  BlogPost,
} from "./posts";

type BlogPostEnhancement = {
  articleIntent: BlogArticleIntent;
  placement?: BlogInteractivePlacement;
};

type ContentPost = Pick<BlogPost, "bestFor" | "description" | "slug" | "tags" | "title">;

const defaultChoices = {
  "compare-options": [
    {
      key: "single_signal",
      label: "One signal",
      title: "One signal is interesting, not decisive",
      description: "You have one standout metric but the rest of training feels normal.",
      response:
        "Use the article to sanity-check the signal, then make the smallest useful change instead of rewriting the whole week.",
    },
    {
      key: "mixed_context",
      label: "Mixed context",
      title: "Look for the pattern across the week",
      description: "A few variables are moving at once, but none of them are catastrophic.",
      response:
        "Compare the tradeoffs the article lays out and choose the path that protects momentum without forcing unnecessary caution.",
    },
    {
      key: "clear_pattern",
      label: "Clear pattern",
      title: "The pattern is obvious enough to act on",
      description: "You can already tell which lever matters most right now.",
      response:
        "Use the article as a decision filter and move on. The goal is a cleaner next step, not more overthinking.",
    },
  ],
  "decision-guide": [
    {
      key: "push",
      label: "Push",
      title: "The day supports normal ambition",
      description: "Recovery is decent and the main variable looks stable enough to keep training.",
      response:
        "Follow the article's stronger option. Keep the main lift or training intent intact and only trim what is clearly unnecessary.",
    },
    {
      key: "hold",
      label: "Hold",
      title: "Stay with the plan but cap the cost",
      description: "You do not need a full pivot, but you also do not have much margin today.",
      response:
        "Use the middle path from the article: preserve the structure, reduce fatigue, and protect repeatability.",
    },
    {
      key: "modify",
      label: "Modify",
      title: "Make the smallest productive adjustment",
      description: "Pain, poor recovery, or schedule pressure is enough to change the session.",
      response:
        "Take the article's conservative option. Keep the habit alive while lowering the stress that is least worth paying for today.",
    },
  ],
  "metric-explainer": [
    {
      key: "what_it_shows",
      label: "What it shows",
      title: "Treat the metric as context",
      description: "You want to know what this signal is actually capturing.",
      response:
        "Use the article to separate the metric itself from the training decision it should influence. The signal matters only if it changes behavior.",
    },
    {
      key: "when_to_trust",
      label: "When to trust",
      title: "Trust trends more than a single reading",
      description: "One reading looks strange, but the broader training picture is still unclear.",
      response:
        "Anchor on trend quality, not novelty. The article should help you decide when the metric is useful and when it is just noise.",
    },
    {
      key: "what_to_do",
      label: "What to do",
      title: "Translate the number into a gym choice",
      description: "You already have the data and need an action, not another dashboard.",
      response:
        "Use the article's examples to turn the signal into a practical push, hold, or modify decision before training starts.",
    },
  ],
  checklist: [
    {
      key: "keep_pattern",
      label: "Keep pattern",
      title: "The movement pattern still works",
      description: "You can train the same intent if you remove the part creating the most cost.",
      response:
        "Use the article to preserve the training pattern while changing range, load, tempo, or variation.",
    },
    {
      key: "reduce_cost",
      label: "Reduce cost",
      title: "Lower the stress before you lower the habit",
      description: "The session needs to stay productive without becoming a test of toughness.",
      response:
        "Choose the article's lower-cost option and cap fatigue first. The best modification is the one you can repeat.",
    },
    {
      key: "stop_signal",
      label: "Stop signal",
      title: "Know the red-flag threshold",
      description: "You need a clean point where the article shifts from adaptation to backing off.",
      response:
        "Use the article's stop conditions to decide when a substitution is enough and when that pattern should end for the day.",
    },
  ],
  protocol: [
    {
      key: "setup",
      label: "Setup",
      title: "Start with the version you can execute well",
      description: "You want the cleanest setup before intensity starts to blur the decision.",
      response:
        "Use the article to tighten the baseline. Good protocol work removes noise before it tries to add more effort.",
    },
    {
      key: "mid_session",
      label: "Mid-session",
      title: "Adjust while the session is still recoverable",
      description: "Something is drifting, but you have time to make the day better.",
      response:
        "Use the article to choose the smallest correction that restores quality instead of waiting until the session is already gone.",
    },
    {
      key: "exit",
      label: "Exit plan",
      title: "Know when the point of the session has been met",
      description: "You need a clear line for ending, deloading, or moving on.",
      response:
        "Use the article's protocol to close the loop early enough that the session still supports the next one.",
    },
  ],
  "symptom-audit": [
    {
      key: "isolated",
      label: "Isolated",
      title: "One symptom is not the whole story",
      description: "A single warning sign looks off, but everything else is not obviously broken.",
      response:
        "Use the article to audit what confirms the signal and what contradicts it before changing the week too aggressively.",
    },
    {
      key: "stacking",
      label: "Stacking",
      title: "Multiple signals deserve action",
      description: "Sleep, soreness, motivation, or performance are all leaning the wrong way together.",
      response:
        "Treat the article as a triage tool. Once the signals stack, the best move is often to reduce cost before performance forces the issue.",
    },
    {
      key: "lingering",
      label: "Lingering",
      title: "Patterns matter more than bad days",
      description: "The concern is not today's wobble but the fact it keeps repeating.",
      response:
        "Use the article to distinguish a rough day from a recovery pattern that should change programming, volume, or expectations.",
    },
  ],
  timeline: [
    {
      key: "phase_1",
      label: "Early",
      title: "Protect the foundation first",
      description: "You are in the earliest stage where control and tolerance matter more than output.",
      response:
        "Use the article to choose the lowest-friction win. Early phases should make the next phase more available, not prove readiness too soon.",
    },
    {
      key: "phase_2",
      label: "Middle",
      title: "Rebuild consistency before intensity",
      description: "You can add work, but only if recovery and technique stay predictable.",
      response:
        "Use the article's middle phase to bring structure back without pretending you are already at full capacity.",
    },
    {
      key: "phase_3",
      label: "Later",
      title: "Scale up with clearer signals",
      description: "You are ready to push harder, but only if the earlier markers stayed stable.",
      response:
        "Use the article to expand load or complexity once the basics no longer cost more than they are worth.",
    },
  ],
} satisfies Record<BlogArticleIntent, BlogInteractiveModule["choices"]>;

const postEnhancementsBySlug: Record<string, BlogPostEnhancement> = {
  "apple-health-data-for-strength-training": {
    articleIntent: "compare-options",
  },
  "apple-health-strength-training-recovery": {
    articleIntent: "decision-guide",
  },
  "apple-watch-hrv-strength-training": {
    articleIntent: "symptom-audit",
  },
  "apple-watch-training-load-strength-training": {
    articleIntent: "metric-explainer",
  },
  "apple-watch-wrist-temperature-cycle-training": {
    articleIntent: "metric-explainer",
  },
  "barbell-strength-plan-for-women": {
    articleIntent: "compare-options",
  },
  "breathing-bracing-lifting-technique": {
    articleIntent: "protocol",
  },
  "cardio-and-strength-training-for-women": {
    articleIntent: "compare-options",
  },
  "choose-starting-weights-strength-training-women": {
    articleIntent: "protocol",
  },
  "creatine-for-women-who-lift": {
    articleIntent: "compare-options",
  },
  "electrolytes-strength-training-women": {
    articleIntent: "compare-options",
  },
  "elbow-pain-pressing-strength-training": {
    articleIntent: "checklist",
  },
  "fasted-morning-strength-training-women": {
    articleIntent: "compare-options",
  },
  "four-day-upper-lower-strength-plan-women": {
    articleIntent: "protocol",
  },
  "garmin-body-battery-strength-training": {
    articleIntent: "metric-explainer",
  },
  "hip-pain-squat-deadlift-modifications": {
    articleIntent: "checklist",
  },
  "home-dumbbell-progressive-overload-women": {
    articleIntent: "protocol",
  },
  "how-close-to-failure-strength-training-women": {
    articleIntent: "compare-options",
  },
  "knee-pain-squat-modifications": {
    articleIntent: "checklist",
  },
  "rest-between-sets-for-women-strength-training": {
    articleIntent: "protocol",
  },
  "cycle-phase-peak-strength-testing": {
    articleIntent: "timeline",
  },
  "cycle-phase-strength-programming": {
    articleIntent: "protocol",
  },
  "deload-week-programming-strength-training": {
    articleIntent: "decision-guide",
  },
  "deload-week-sleep-soreness-training-history": {
    articleIntent: "decision-guide",
  },
  "double-progression-strength-training-women": {
    articleIntent: "protocol",
  },
  "garmin-recovery-data-for-lifters": {
    articleIntent: "metric-explainer",
  },
  "glp-1-strength-training-keep-muscle": {
    articleIntent: "compare-options",
  },
  "heavy-periods-strength-training": {
    articleIntent: "symptom-audit",
  },
  "hormonal-birth-control-strength-training": {
    articleIntent: "compare-options",
  },
  "low-readiness-score-strength-training": {
    articleIntent: "symptom-audit",
  },
  "low-energy-availability-menstrual-cycle-strength-training": {
    articleIntent: "symptom-audit",
  },
  "lift-weights-with-period-cramps": {
    articleIntent: "decision-guide",
  },
  "lower-back-pain-deadlift-modifications": {
    articleIntent: "checklist",
  },
  "low-ferritin-strength-training-women": {
    articleIntent: "symptom-audit",
  },
  "luteal-phase-sleep-strength-training": {
    articleIntent: "decision-guide",
  },
  "menstrual-cycle-injury-risk-lifting": {
    articleIntent: "compare-options",
  },
  "menstrual-cycle-nutrition-strength-training": {
    articleIntent: "protocol",
  },
  "menstrual-cycle-recovery-metrics-wearables": {
    articleIntent: "metric-explainer",
  },
  "missed-workouts-strength-training": {
    articleIntent: "decision-guide",
  },
  "neck-trap-pain-overhead-press-modifications": {
    articleIntent: "checklist",
  },
  "night-shift-strength-training-women": {
    articleIntent: "decision-guide",
  },
  "one-rep-max-testing-timing-and-protocol": {
    articleIntent: "timeline",
  },
  "oura-ring-strength-training-readiness": {
    articleIntent: "metric-explainer",
  },
  "ovulation-pain-strength-training": {
    articleIntent: "decision-guide",
  },
  "period-fatigue-strength-training": {
    articleIntent: "symptom-audit",
  },
  "pms-bloating-strength-training": {
    articleIntent: "checklist",
  },
  "strength-training-when-you-have-a-cold": {
    articleIntent: "decision-guide",
  },
  "perimenopause-strength-training-programming": {
    articleIntent: "timeline",
  },
  "postpartum-return-to-lifting-timeline": {
    articleIntent: "timeline",
  },
  "protein-timing-for-women-who-lift": {
    articleIntent: "protocol",
  },
  "protein-low-appetite-women-who-lift": {
    articleIntent: "protocol",
  },
  "pms-strength-training-week-before-period": {
    articleIntent: "decision-guide",
  },
  "rpe-training-autoregulation-strength": {
    articleIntent: "decision-guide",
  },
  "shoulder-pain-bench-press-modifications": {
    articleIntent: "checklist",
  },
  "sleep-quality-strength-training-gains": {
    articleIntent: "compare-options",
  },
  "spotting-after-lifting-strength-training": {
    articleIntent: "symptom-audit",
  },
  "strength-training-after-bad-sleep": {
    articleIntent: "decision-guide",
  },
  "strength-training-after-donating-blood": {
    articleIntent: "decision-guide",
  },
  "strength-training-in-the-heat-women": {
    articleIntent: "decision-guide",
  },
  "strength-training-calorie-deficit-women": {
    articleIntent: "protocol",
  },
  "stress-and-strength-training-recovery": {
    articleIntent: "symptom-audit",
  },
  "strength-training-app-for-women-recovery": {
    articleIntent: "decision-guide",
    placement: "before-cta",
  },
  "strength-training-around-minor-injuries": {
    articleIntent: "checklist",
  },
  "strength-plateau-women-who-lift": {
    articleIntent: "decision-guide",
  },
  "strength-training-while-traveling-women": {
    articleIntent: "protocol",
  },
  "strength-training-women-over-40": {
    articleIntent: "timeline",
  },
  "strength-training-during-period-modifications": {
    articleIntent: "decision-guide",
  },
  "top-set-back-off-set-programming": {
    articleIntent: "protocol",
  },
  "two-day-strength-training-plan-women": {
    articleIntent: "protocol",
  },
  "training-around-injuries-without-losing-progress": {
    articleIntent: "checklist",
  },
  "warm-up-protocol-for-strength-training": {
    articleIntent: "protocol",
  },
  "weekly-sets-per-muscle-group-women": {
    articleIntent: "decision-guide",
  },
  "when-hrv-is-low-strength-training": {
    articleIntent: "symptom-audit",
  },
  "when-to-increase-weight-strength-training": {
    articleIntent: "decision-guide",
  },
  "whoop-recovery-strength-training": {
    articleIntent: "compare-options",
  },
  "why-recovery-beats-the-calendar": {
    articleIntent: "decision-guide",
    placement: "before-body",
  },
};

const promptByIntent: Record<BlogArticleIntent, string> = {
  "compare-options": "Which lens best matches the decision you are trying to make?",
  "decision-guide": "What kind of training call are you making today?",
  "metric-explainer": "Which part of the metric do you need help translating?",
  checklist: "Which adaptation problem are you trying to solve first?",
  protocol: "Where in the process do you need the most clarity?",
  "symptom-audit": "How strong is the recovery warning signal right now?",
  timeline: "Which stage best describes where you are right now?",
};

const moduleTypeByIntent: Record<BlogArticleIntent, BlogInteractiveModule["type"]> = {
  "compare-options": "comparison-cards",
  "decision-guide": "decision-guide",
  "metric-explainer": "metric-explainer",
  checklist: "modification-checklist",
  protocol: "decision-guide",
  "symptom-audit": "readiness-check",
  timeline: "timeline",
};

const placementByIntent: Record<BlogArticleIntent, BlogInteractivePlacement> = {
  "compare-options": "after-intro",
  "decision-guide": "after-intro",
  "metric-explainer": "after-intro",
  checklist: "after-intro",
  protocol: "after-intro",
  "symptom-audit": "after-intro",
  timeline: "after-intro",
};

function titleForIntent(post: ContentPost, articleIntent: BlogArticleIntent) {
  const titles: Record<BlogArticleIntent, string> = {
    "compare-options": "Compare the likely paths",
    "decision-guide": "Choose the training response",
    "metric-explainer": "Translate the signal",
    checklist: "Modify without losing the session",
    protocol: "Run the protocol in the right order",
    "symptom-audit": "Audit the warning signs",
    timeline: "Pick the phase you are in",
  };

  return `${titles[articleIntent]}`;
}

function noteForPost(post: ContentPost) {
  return post.bestFor ?? post.description;
}

export function getPostEnhancement(
  post: ContentPost,
): Pick<BlogPost, "articleIntent" | "interactiveModules"> {
  const enhancement = postEnhancementsBySlug[post.slug];

  if (!enhancement) {
    throw new Error(`Missing blog enhancement metadata for ${post.slug}`);
  }

  const articleIntent = enhancement.articleIntent;
  const interactiveModule: BlogInteractiveModule = {
    type: moduleTypeByIntent[articleIntent],
    placement: enhancement.placement ?? placementByIntent[articleIntent],
    title: titleForIntent(post, articleIntent),
    prompt: promptByIntent[articleIntent],
    note: noteForPost(post),
    choices: defaultChoices[articleIntent],
  };

  return {
    articleIntent,
    interactiveModules: [interactiveModule],
  };
}
