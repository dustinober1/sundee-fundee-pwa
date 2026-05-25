export type TrainingToolSlug =
  | "readiness-score-calculator"
  | "deload-week-planner"
  | "one-rep-max-readiness-checklist"
  | "rpe-rir-chart"
  | "cycle-symptom-workout-modifier";

export type TrainingToolMode = "push" | "steady" | "modify";
export type DeloadClassification = "continue" | "monitor" | "deload";

export type TrainingToolSection = {
  title: string;
  paragraphs: [string, string];
};

export type TrainingToolLink = {
  href: string;
  label: string;
  description: string;
};

export type TrainingTool = {
  slug: TrainingToolSlug;
  href: `/tools/${TrainingToolSlug}`;
  title: string;
  description: string;
  intro: string;
  topicSummary: string;
  seoTitle: string;
  seoDescription: string;
  audience: [string, string, string];
  relatedLinks: [TrainingToolLink, TrainingToolLink, TrainingToolLink];
  sections: [TrainingToolSection, TrainingToolSection, TrainingToolSection];
};

type ReadinessInputs = {
  sleep: number;
  soreness: number;
  stress: number;
  pain: number;
};

type OneRepMaxInputs = {
  weight: number;
  reps: number;
};

type DeloadInputs = {
  poorSleepDays: number;
  highSorenessDays: number;
  performanceDropSessions: number;
};

export function calculateReadinessRecommendation({
  sleep,
  soreness,
  stress,
  pain,
}: ReadinessInputs) {
  const normalizedScore =
    sleep * 8 + (10 - soreness) * 6 + (10 - stress) * 5 + (10 - pain) * 7;
  const score = Math.round((normalizedScore / 260) * 100);

  if (score >= 75) {
    return {
      score,
      mode: "push" as const,
      headline: "Push if warm-ups confirm it.",
      guidance:
        "Keep the planned main work, add load only if the bar still looks crisp, and avoid turning a good day into an ego test.",
    };
  }

  if (score >= 55) {
    return {
      score,
      mode: "steady" as const,
      headline: "Train, but keep the ceiling on.",
      guidance:
        "Run the session with clean reps, repeat last week's load if needed, and let smooth execution beat aggressive progression.",
    };
  }

  return {
    score,
    mode: "modify" as const,
    headline: "Lower the cost of today's session.",
    guidance:
      "Trim volume first, cap intensity, or swap to a lower-cost variation so you keep momentum without compounding fatigue or pain.",
  };
}

export function calculateEstimatedOneRepMax({
  weight,
  reps,
}: OneRepMaxInputs) {
  return Math.round(weight * (1 + reps / 30));
}

export function classifyDeloadNeed({
  poorSleepDays,
  highSorenessDays,
  performanceDropSessions,
}: DeloadInputs): DeloadClassification {
  const fatigueScore =
    poorSleepDays + highSorenessDays + performanceDropSessions * 2;

  if (fatigueScore >= 8 || (performanceDropSessions >= 2 && poorSleepDays >= 4)) {
    return "deload";
  }

  if (fatigueScore >= 4) {
    return "monitor";
  }

  return "continue";
}

export const trainingTools: TrainingTool[] = [
  {
    slug: "readiness-score-calculator",
    href: "/tools/readiness-score-calculator",
    title: "Readiness Score Calculator",
    description:
      "Check whether today is a push, steady, or modify day by weighing sleep, soreness, stress, and pain before you force the original plan.",
    intro:
      "A readiness score is not a verdict on toughness. It is a fast way to make the day's training stress match the recovery you actually have. This calculator is for lifters who still want structure, but who also know that bad sleep, sticky soreness, high stress, or pain can change what productive work should cost. Use it before the first work set, then confirm the recommendation with your warm-up speed and technique.",
    topicSummary:
      "Connects recovery, pain-aware lifting, and wearable-driven context with a practical next-session decision.",
    seoTitle: "Readiness Score Calculator for Strength Training",
    seoDescription:
      "Use a simple readiness score calculator to decide whether strength training today should stay on plan, hold steady, or be modified around recovery signals.",
    audience: [
      "Lifters trying to stop confusing discipline with forcing bad sessions.",
      "Athletes using sleep, soreness, stress, or wearable trends as context.",
      "Women who want a recovery-aware way to keep training momentum.",
    ],
    relatedLinks: [
      {
        href: "/strength-training-recovery",
        label: "Strength training recovery guide",
        description: "Learn how readiness fits into a larger recovery-aware system.",
      },
      {
        href: "/readiness-score-strength-training",
        label: "Readiness score SEO page",
        description: "See the broader decision framework behind the calculator.",
      },
      {
        href: "/blog/low-readiness-score-strength-training",
        label: "Low readiness before lifting",
        description: "Translate a low score into specific training modifications.",
      },
    ],
    sections: [
      {
        title: "Why readiness scores matter",
        paragraphs: [
          "Most training mistakes happen before the hard sets start. A rigid plan assumes that every Tuesday squat session deserves the same cost, even when the last few nights of sleep were short, soreness is hanging around longer than usual, work stress is elevated, or a pain flare is changing how you move. A readiness score is useful because it compresses those scattered signals into one decision point. You are not trying to predict a personal record. You are deciding whether the planned amount of stress still makes sense today.",
          "That distinction matters for women who lift because recovery is rarely static across the month. Life stress, soreness, menstrual symptoms, and poor sleep often stack together. The answer is not to become passive or to let an app decide everything for you. The better approach is to use the score as context, then let the warm-up confirm whether you should push, stay steady, or modify the session. That keeps training proactive instead of emotional.",
        ],
      },
      {
        title: "How to use the recommendation",
        paragraphs: [
          "A push recommendation means the basic signals support the planned session. It does not mean you need to prove something. Keep the main work, respect the rep targets, and add load only if the warm-ups still look sharp. A steady recommendation means you should train but cap the upside. Run the session, keep technique clean, and stop short of the kind of top set that would turn an ordinary day into a recovery problem.",
          "A modify recommendation is where most lifters need more clarity. Modifying is not bailing out. It is programming around the day you actually have. Cut one or two working sets before you cut the whole session. Lower the load range. Swap to a friendlier variation. If pain is part of the reason the score fell, choose the version of the movement that preserves the pattern without forcing the irritated position. The goal is still progress, just at a cost you can recover from.",
        ],
      },
      {
        title: "Where the calculator fits in the week",
        paragraphs: [
          "This tool works best when you use it consistently enough to see patterns. One low score can just be a rough night. Several low scores across a week, especially when performance is slipping, might mean you need a deload or a quieter block. Several strong scores in a row can justify pushing progression instead of staying overly conservative. The score becomes more useful when you stop asking what it says about your character and start asking what it says about the current training dose.",
          "If you track HRV, resting heart rate, or Apple Health trends, treat those as supporting context rather than absolute truth. The simplest version still works: sleep, soreness, stress, and pain. When those are trending the wrong way, forcing the original session often produces ugly reps and extra fatigue, not meaningful adaptation. This calculator exists to make that call earlier and more calmly.",
        ],
      },
    ],
  },
  {
    slug: "deload-week-planner",
    href: "/tools/deload-week-planner",
    title: "Deload Week Planner",
    description:
      "Classify whether current recovery trends suggest you should continue, monitor the next few sessions, or schedule a real deload week.",
    intro:
      "A deload should not feel like a random retreat. It should feel like a deliberate response to accumulating fatigue. This planner is built for lifters who want a fast way to sort between normal training stress, a week that needs closer monitoring, and a phase that is clearly asking for a lower-cost reset. Track recent poor sleep, sticky soreness, and performance drop-offs, then use the result to decide whether the current block still has productive upside.",
    topicSummary:
      "Supports recovery-aware programming by turning fatigue trends into a clearer deload decision.",
    seoTitle: "Deload Week Planner for Strength Training",
    seoDescription:
      "Use a deload week planner to sort normal fatigue from the kind of sleep, soreness, and performance trends that justify a real strength training deload.",
    audience: [
      "Lifters who feel beaten up but are not sure whether they need a full reset.",
      "Coaches or self-coached athletes watching fatigue trends across a block.",
      "Anyone whose recovery is sliding before performance has fully collapsed.",
    ],
    relatedLinks: [
      {
        href: "/deload-week-planner",
        label: "Deload week planning guide",
        description: "Read the long-form explanation of deload timing and structure.",
      },
      {
        href: "/recovery-based-workout-plan",
        label: "Recovery-based workout planning",
        description: "See how weekly structure changes when recovery drives the decision.",
      },
      {
        href: "/blog/deload-week-programming-strength-training",
        label: "Deload week programming article",
        description: "Learn how to cut cost without making the week feel random.",
      },
    ],
    sections: [
      {
        title: "What actually triggers a deload",
        paragraphs: [
          "The strongest deload signal is rarely one dramatic bad workout. It is a trend: sleep has been poor for several days, soreness is not clearing between sessions, and warm-ups are getting heavier instead of lighter. When that trend is paired with repeated performance drops, you are usually looking at accumulated fatigue rather than a simple off day. This planner turns those signals into a quick classification so the decision is less emotional and less dependent on how motivated you feel in the moment.",
          "That matters because many lifters wait until technique is noisy and everything feels miserable before they back off. By then the block has already extracted most of its upside. A planner helps you intervene earlier. Continue means fatigue is still within the normal cost of training. Monitor means you should keep watching the next few sessions closely and cap unnecessary stress. Deload means the trend is strong enough that reducing training cost is likely to improve the next phase rather than interrupt it.",
        ],
      },
      {
        title: "How to deload without losing momentum",
        paragraphs: [
          "A good deload keeps the habit and reduces the cost. Most lifters do better trimming volume before they abandon training altogether. You can keep the main lift pattern, cut working sets, and avoid grinders while still getting useful movement practice. Accessories should become simpler and less fatiguing, and conditioning should stay easy enough that it helps recovery instead of competing with it. When planned well, a deload week feels purposeful, not like punishment for getting tired.",
          "This is especially important for women who lift because life stress can stack with training stress in ways a fixed spreadsheet never sees. Work, family demands, cycle symptoms, and sleep disruption can all change what the current block can tolerate. A deload is not weakness. It is a dose adjustment. The entire point is to reduce accumulated fatigue so the next push phase lands on a better recovery base.",
        ],
      },
      {
        title: "How to use the result with your program",
        paragraphs: [
          "If the planner says continue, keep training but do not use that as permission to pile on novelty. You are looking for steady progression, not proof that you can survive anything. If it says monitor, keep the core sessions but decide in advance what you will pull back first if warm-ups still feel flat: extra sets, top-end loading, or the highest-cost accessories. That preserves the week while still respecting the warning signs.",
          "If the planner lands on deload, schedule it cleanly and make the week obviously lower cost. Reduce volume, keep reps crisp, and finish sessions feeling better than you started. Then rebuild gradually. The mistake after a deload is immediately adding back every hard set you removed. Let the next week earn its way back up. The planner is useful because it gives you a simple trigger for that choice before the block fully stalls out.",
        ],
      },
    ],
  },
  {
    slug: "one-rep-max-readiness-checklist",
    href: "/tools/one-rep-max-readiness-checklist",
    title: "One-Rep Max Readiness Checklist",
    description:
      "Work through the basic readiness checks before a max test so the attempt comes from a stable training week instead of impulse.",
    intro:
      "A max attempt should be the end of a well-supported training block, not a reaction to excitement, frustration, or a social-media mood swing. This checklist gives lifters a practical way to decide whether today is actually built for testing. It focuses on preparation quality, recovery, pain status, and basic logistics so you can separate a true opportunity from the kind of day that turns heavy singles into unnecessary risk.",
    topicSummary:
      "Supports programming basics with a simple readiness screen for max testing and heavy singles.",
    seoTitle: "One-Rep Max Readiness Checklist",
    seoDescription:
      "Use a one-rep max readiness checklist to decide whether your training block, recovery, and setup support a safe, useful max test today.",
    audience: [
      "Lifters preparing for heavy singles or end-of-block max testing.",
      "Women who want a calmer process for deciding whether a test day is worth it.",
      "Anyone who tends to confuse feeling motivated with being ready.",
    ],
    relatedLinks: [
      {
        href: "/strength-training-plan-for-women",
        label: "Strength plan structure",
        description: "See how max testing fits into a longer training block.",
      },
      {
        href: "/beginner-strength-training-plan",
        label: "Beginner plan guidance",
        description: "Understand when technique practice matters more than true maxes.",
      },
      {
        href: "/blog/rpe-training-autoregulation-strength",
        label: "RPE and autoregulation article",
        description: "Use RPE to judge heavy singles without forcing a miss.",
      },
    ],
    sections: [
      {
        title: "What makes a max test worth doing",
        paragraphs: [
          "The best max tests answer a useful training question. They confirm that the block worked, calibrate future percentages, or give you a clean snapshot of current strength. The worst max tests happen because the gym felt exciting, the playlist was good, or the empty bar moved fast once. This checklist exists to slow the decision down and force a few basic questions: did the recent block support a test, is recovery good enough to express strength, and is there any pain or movement issue that changes the risk-reward ratio?",
          "For many women who lift, the right answer is often to test readiness for heavy singles rather than insist on a true all-out max. A stable heavy single with good technique can tell you plenty about the current phase. The checklist helps separate that kind of productive exposure from a day where the body is asking for a quieter signal instead.",
        ],
      },
      {
        title: "The non-negotiables before heavy attempts",
        paragraphs: [
          "A good max day starts before the warm-up. You want decent sleep, no active pain flare that changes the setup, and enough recent heavy practice that the attempt is not a surprise. If the last few exposures above ninety percent were messy, or if bracing and bar path have been drifting, the problem is probably not courage. It is preparation quality. The checklist keeps those basics visible so you do not treat a technical issue like a confidence issue.",
          "Logistics matter too. Heavy attempts are easier to judge when the rack height is right, safeties are set, and your setup is not rushed. If you are benching, do you have a reliable spotter or a safe bench setup? If you are deadlifting, are you clear about the jump sequence instead of making impulsive calls? A useful max test is organized. A chaotic one tends to produce ugly decisions.",
        ],
      },
      {
        title: "What to do when the checklist says not today",
        paragraphs: [
          "A low readiness score for max testing does not mean the whole day is wasted. Often the right call is to convert the session into heavy-skill practice. Work up to a crisp single that leaves room in reserve, then take the planned back-off work. That still builds confidence and gives you information without turning the session into a forced milestone. If pain, fatigue, or instability is clearly part of the problem, shift to a lower-cost session and protect the next week instead of digging the hole deeper.",
          "This is where disciplined lifters separate themselves from reckless ones. The willingness to skip a bad max day is not softness. It is what keeps the testing process honest. Use the checklist regularly enough and you start to see a better pattern: testing stops being dramatic, and becomes one more well-supported piece of the program.",
        ],
      },
    ],
  },
  {
    slug: "rpe-rir-chart",
    href: "/tools/rpe-rir-chart",
    title: "RPE / RIR Chart",
    description:
      "Use a clean RPE and reps-in-reserve chart to translate effort targets into practical loading decisions during strength work.",
    intro:
      "RPE and reps in reserve only help if they stay concrete enough to use under the bar. This chart is for lifters who want a stable reference for how hard a set should feel, how many reps they likely had left, and when a set has crossed from useful work into sloppy proving. It is especially helpful when you want training to stay autoregulated without feeling vague.",
    topicSummary:
      "Gives programming-focused readers a clear effort chart for load selection and autoregulation.",
    seoTitle: "RPE and RIR Chart for Strength Training",
    seoDescription:
      "Use an RPE and reps-in-reserve chart to match strength training effort targets with practical loading decisions and cleaner autoregulation.",
    audience: [
      "Lifters learning to judge set difficulty without guessing.",
      "Athletes using percentage ranges but needing day-to-day autoregulation.",
      "Women who want a less rigid way to progress when recovery varies.",
    ],
    relatedLinks: [
      {
        href: "/beginner-strength-training-plan",
        label: "Beginner strength plan",
        description: "See how effort targets fit inside a simple program.",
      },
      {
        href: "/strength-training-plan-for-women",
        label: "Women's strength plan guide",
        description: "Use effort targets inside a recovery-aware weekly structure.",
      },
      {
        href: "/blog/rpe-training-autoregulation-strength",
        label: "RPE autoregulation article",
        description: "Read the long-form breakdown of effort-based programming.",
      },
    ],
    sections: [
      {
        title: "Why RPE and RIR are worth learning",
        paragraphs: [
          "A percentage-based plan gives useful structure, but percentages alone cannot know whether today's eighty percent feels like a normal working set or like a grinder. RPE and reps in reserve solve that by adding a decision layer. You are not abandoning structure. You are pairing it with the reality of the day. When sleep, soreness, pain, or stress changes what a given load costs, effort-based targets can preserve the intent of the session without pretending every week should feel identical.",
          "This is especially helpful for women whose training quality shifts across life stress and cycle context. Effort targets give you a way to respect those changes without losing progression. A top set at RPE 8 can still be productive even if the absolute load is slightly different from last week, because the target is the quality and cost of the work, not blind loyalty to a number.",
        ],
      },
      {
        title: "How to read the chart in practice",
        paragraphs: [
          "The chart works by connecting RPE with an estimated number of reps left in reserve. An RPE 6 set should feel comfortably fast with about four reps left. RPE 7 is still controlled, with roughly three reps left. RPE 8 usually means two reps left and is often the sweet spot for strong work without excessive fatigue. RPE 9 leaves about one rep in reserve and is better used selectively. RPE 10 means no more reps were there with clean form, and that should be rare in ordinary training.",
          "The most important part is honesty. If bar speed falls apart and technique is drifting, the set was harder than you wanted even if the rep count was technically completed. Likewise, a set that moves fast and feels clean may deserve a small load jump next week even if the spreadsheet expected you to stay put. The chart gives you a shared language for those adjustments so the week stays coherent.",
        ],
      },
      {
        title: "How the chart helps avoid common programming mistakes",
        paragraphs: [
          "Many lifters make two opposite mistakes: they underload because they are afraid of hard work, or they overshoot because they mistake survival for productive effort. A reference chart reduces both errors. It tells you what a controlled top set should feel like, and it reminds you when the session has wandered into unnecessary fatigue. That becomes more valuable when recovery is uneven, because the chart helps you keep the day honest without falling into random load selection.",
          "Used well, RPE and RIR turn autoregulation into a disciplined process rather than an excuse. You still have planned lifts, planned rep ranges, and planned progressions. The chart simply helps you choose the exact load that matches the intended effort on that day. That is what makes it useful for lifters who want adaptability without chaos.",
        ],
      },
    ],
  },
  {
    slug: "cycle-symptom-workout-modifier",
    href: "/tools/cycle-symptom-workout-modifier",
    title: "Cycle Symptom Workout Modifier",
    description:
      "Translate common menstrual-cycle symptoms into practical workout modifications without turning cycle context into rigid rules.",
    intro:
      "Cycle-aware training should be specific enough to help and flexible enough to stay human. This tool is built for women who lift and need a practical answer when cramps, bloating, fatigue, headaches, spotting, or low-back discomfort change what today's session should cost. It does not assume every phase feels the same. It helps you identify the current symptom pattern and choose the simplest adjustment that keeps training moving.",
    topicSummary:
      "Supports women-who-lift content with symptom-based training modifications instead of phase-based rules.",
    seoTitle: "Cycle Symptom Workout Modifier",
    seoDescription:
      "Use a cycle symptom workout modifier to translate cramps, fatigue, bloating, or headaches into practical strength training adjustments.",
    audience: [
      "Women who want symptom-based changes instead of one-size-fits-all cycle rules.",
      "Lifters who still want to train when symptoms flare but need a lower-cost version.",
      "Anyone tracking cycle context without wanting it to dominate the whole plan.",
    ],
    relatedLinks: [
      {
        href: "/cycle-aware-training",
        label: "Cycle-aware training guide",
        description: "See the bigger framework behind symptom-based modifications.",
      },
      {
        href: "/strength-training-during-period",
        label: "Strength training during your period",
        description: "Read practical examples for hard sessions during symptomatic days.",
      },
      {
        href: "/blog/strength-training-during-period-modifications",
        label: "Period modification article",
        description: "Get a more detailed breakdown of symptom-based swaps.",
      },
    ],
    sections: [
      {
        title: "Why symptoms beat generic phase rules",
        paragraphs: [
          "Cycle-aware training gets less useful the moment it becomes a rigid script. Not every luteal phase feels bad. Not every period starts with cramps. Not every follicular week feels invincible. Symptoms are the better guide because they tell you what today's training cost is likely to be. This tool starts there. Instead of asking what phase you are in and assuming the answer, it asks what you actually feel and what movement qualities are changing right now.",
          "That approach matters because it protects both progress and sanity. Women who lift do not need to be told to avoid hard training for a whole week by default. They need practical options for the days when cramps, headaches, bloating, fatigue, or low-back tightness make the original session feel needlessly expensive. A symptom-based tool keeps the answer precise without turning cycle context into a cage.",
        ],
      },
      {
        title: "How to modify without losing the training week",
        paragraphs: [
          "The best modifications usually lower cost before they erase intent. If cramps or pelvic heaviness are the issue, a shorter session, more gradual warm-up, and fewer grindy reps may be enough. If fatigue is the main problem, the session might still keep the main lift but reduce total working sets or move the top set down a notch. If bloating makes bracing uncomfortable, controlled accessories or machine work can preserve the pattern without forcing the most demanding setup of the week.",
          "This is where symptom-based training gets practical. You are not trying to build a mythic perfect cycle template. You are making a decision that keeps the session useful today and keeps the larger week intact. Often that means finding the lowest-cost version of the planned movement rather than scrapping the day outright.",
        ],
      },
      {
        title: "When symptoms should change more than one session",
        paragraphs: [
          "Sometimes the right answer is larger than a single modification. If symptoms are recurring for several sessions, sleep is drifting down, and readiness is falling with it, the issue may not be the workout alone. That is where cycle-aware context overlaps with recovery-aware programming. The symptoms are one signal inside a larger decision about how much stress the current block can tolerate. A short run of modified sessions might be enough. In other cases, the whole week needs less volume.",
          "This tool exists because the middle ground is where most lifters need help. Not every symptom flare calls for stopping. Not every symptom-free day calls for forcing a personal best. A clear modifier helps you stay engaged, keep perspective, and make better calls before frustration or guilt starts steering the session.",
        ],
      },
    ],
  },
];

const trainingToolBySlug = new Map(
  trainingTools.map((tool) => [tool.slug, tool] as const),
);

export function getTrainingTool(slug: string): TrainingTool {
  const tool = trainingToolBySlug.get(slug as TrainingToolSlug);

  if (!tool) {
    throw new Error(`Unknown training tool: ${slug}`);
  }

  return tool;
}
