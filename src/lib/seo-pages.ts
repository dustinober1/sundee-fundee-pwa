export type SeoPageKind = "comparison" | "feature" | "program" | "hub";

export type SeoPageLink = {
  href: string;
  label: string;
  description: string;
};

export type SeoPageSection = {
  title: string;
  body: string[];
};

export type SeoPageFaq = {
  question: string;
  answer: string;
};

export type SeoPage = {
  slug: string;
  kind: SeoPageKind;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  sections: SeoPageSection[];
  faqs: SeoPageFaq[];
  related: SeoPageLink[];
  priority: number;
  ogImage?: string;
};

export const SEO_PAGES_LAST_MODIFIED = "2026-05-13";

const recoveryRelated: SeoPageLink[] = [
  {
    href: "/science#readiness-score",
    label: "Science behind readiness",
    description: "See how readiness inputs become training changes.",
  },
  {
    href: "/recovery-aware-strength-training",
    label: "Recovery-aware strength training",
    description: "See how readiness changes the training day.",
  },
  {
    href: "/blog/why-recovery-beats-the-calendar",
    label: "Why recovery beats the calendar",
    description: "A practical guide to adjusting fixed plans.",
  },
  {
    href: "/blog/when-hrv-is-low-strength-training",
    label: "When HRV is low",
    description: "How to think about low-readiness training days.",
  },
];

const womenRelated: SeoPageLink[] = [
  {
    href: "/science#cycle-aware-training",
    label: "Science behind cycle-aware training",
    description: "See how optional cycle context fits the broader model.",
  },
  {
    href: "/for-women-who-lift",
    label: "For women who lift",
    description: "The core Sundee Fundee training approach.",
  },
  {
    href: "/cycle-aware-training",
    label: "Cycle-aware training",
    description: "Use cycle context without letting it overrule readiness.",
  },
  {
    href: "/blog/menstrual-cycle-nutrition-strength-training",
    label: "Cycle nutrition and strength training",
    description: "Supporting habits around different cycle phases.",
  },
];

const injuryRelated: SeoPageLink[] = [
  {
    href: "/science#injury-aware-programming",
    label: "Science behind injury routing",
    description: "See how pain flags affect exercise selection and load.",
  },
  {
    href: "/train-around-injury",
    label: "Train around injury",
    description: "Keep training decisions conservative when pain changes the plan.",
  },
  {
    href: "/blog/training-around-injuries-without-losing-progress",
    label: "Training around injuries",
    description: "Ways to preserve the habit without forcing every lift.",
  },
  {
    href: "/injury-friendly-workout-planner",
    label: "Injury-friendly workout planner",
    description: "How an app can organize substitutions and flags.",
  },
];

const wearableRelated: SeoPageLink[] = [
  {
    href: "/science#readiness-score",
    label: "Science behind Apple Health signals",
    description: "See how wearable context feeds readiness decisions.",
  },
  {
    href: "/apple-health-strength-training-app",
    label: "Apple Health strength training app",
    description: "Use health signals already available on iPhone.",
  },
  {
    href: "/blog/apple-health-data-for-strength-training",
    label: "Apple Health data for strength",
    description: "Which signals are useful for lifters.",
  },
  {
    href: "/wearables-and-strength-training",
    label: "Wearables and strength training",
    description: "A hub for using health data without chasing every metric.",
  },
];

function faq(topic: string): SeoPageFaq[] {
  return [
    {
      question: `Is ${topic} medical advice?`,
      answer:
        "No. Sundee Fundee is a training and education product. It can help organize workout choices, but it does not diagnose, treat, or replace guidance from a qualified clinician.",
    },
    {
      question: "Do I need perfect wearable data to use it?",
      answer:
        "No. Wearable data can add context, but the app also uses subjective check-ins and training history so the plan still works when data is incomplete.",
    },
    {
      question: "Can beginners use this approach?",
      answer:
        "Yes. The pages describe principles that are useful for beginners and experienced lifters, with the app keeping decisions focused on the next appropriate session.",
    },
    {
      question: "Does the app make every workout easier?",
      answer:
        "No. The goal is appropriate training. Some days call for normal progression, some call for technique work, and some call for reducing volume or intensity.",
    },
  ];
}

function sections(
  focus: string,
  first: string,
  second: string,
  third: string,
  fourth: string,
): SeoPageSection[] {
  return [
    {
      title: `What ${focus} should solve`,
      body: [
        first,
        "A useful strength app should reduce decision fatigue without pretending your body is the same every day. The best pages in this cluster focus on the moment before training: what should change, what should stay, and how to keep progress moving without making every workout a maximal test.",
      ],
    },
    {
      title: "How Sundee Fundee fits",
      body: [
        second,
        "Sundee Fundee is built around readiness, pain flags, cycle context when you choose to use it, and simple progress tracking. Those inputs do not replace judgment, but they give each session a clearer starting point than a calendar-only plan.",
      ],
    },
    {
      title: "What to look for",
      body: [
        third,
        "Look for clear logging, practical substitutions, transparent training notes, and a plan that can adjust without becoming vague. A good strength app should help you decide what to do today and still preserve the larger training direction.",
      ],
    },
    {
      title: "How to use this page",
      body: [
        fourth,
        "Use the related guides below to go deeper into recovery, injury-aware training, wearable data, or cycle-aware programming. Each page is written to support a real training decision rather than chase a single metric.",
      ],
    },
  ];
}

export const seoPages: SeoPage[] = [
  {
    slug: "best-strength-training-app-for-women",
    kind: "comparison",
    eyebrow: "Best Strength Training App for Women",
    title: "Best strength training app for women who want smarter workouts",
    description:
      "A practical guide to choosing a strength training app for women, with recovery, cycle context, injury-aware choices, and progress tracking.",
    intro:
      "The best strength training app for women should do more than list exercises. It should help you train consistently while accounting for recovery, life stress, cycle context, pain flags, and the progress you are trying to build over months.",
    sections: [
      {
        title: "Why women need an adaptive strength app",
        body: [
          "Most lifting apps follow a rigid calendar, assuming you are the same person every Tuesday. But women who lift know that recovery, stress, cycle symptoms, and even sleep quality change what is actually appropriate for today's session.",
          "A smarter strength app should help you make the right choice before the first set, whether that means sticking to the plan, modifying a movement for an irritated joint, or choosing a lighter volume when readiness is low.",
        ],
      },
      {
        title: "How Sundee Fundee adapts to you",
        body: [
          "Sundee Fundee was built to bring recovery context directly into the training day. By logging readiness signals and optional cycle context, the app gives you a clear suggestion: push, hold, modify, or recover.",
          "It's not about doing less; it's about doing the work that builds strength today without creating the fatigue that breaks the plan tomorrow.",
        ],
      },
      {
        title: "Features for serious training",
        body: [
          "Look for more than just a logbook. You need injury-aware substitutions, clear progress tracking for PRs, and a workflow that respects your privacy—especially when it comes to health and cycle data.",
          "The best tools stay out of the way when you're moving well and provide conservative, practical guidance when pain or fatigue change the requirements.",
        ],
      },
      {
        title: "Starting your strength journey",
        body: [
          "Whether you are comparing top-rated apps or looking for a free alternative that respects the science of recovery, start with the guides below. Each resource is written to help women lift with more awareness and better long-term results.",
        ],
      },
    ],
    faqs: faq("a strength training app for women"),
    related: womenRelated,
    priority: 0.95,
  },
  {
    slug: "best-apple-health-strength-training-app",
    kind: "comparison",
    eyebrow: "Apple Health Strength Training",
    title: "Best Apple Health strength training app for recovery-aware lifting",
    description:
      "Learn what to look for in a strength training app that uses Apple Health signals like sleep, HRV, and activity trends.",
    intro:
      "Apple Health can collect useful signals for lifters, but the value comes from turning those signals into better training decisions. A good strength app should make Apple Health data practical, not overwhelming.",
    sections: [
      {
        title: "Using Apple Health for strength training",
        body: [
          "Apple Health captures a wealth of data—HRV, resting heart rate, sleep trends, and active energy—that most lifters ignore. But when these signals are combined, they provide a powerful look at your body's ability to handle the next hard workout.",
          "An Apple Health-integrated app should do more than just read your steps. It should translate those deep health metrics into actionable training advice that helps you decide when to push for a PR and when to take a deload.",
        ],
      },
      {
        title: "The role of HRV and sleep in lifting",
        body: [
          "Heart Rate Variability (HRV) is one of the most reliable indicators of nervous system stress. When HRV is high, your body is likely ready for the high-intensity work required for strength gains. When it drops significantly, it's often a sign that you need more recovery time.",
          "By pulling this data automatically through Apple Health, Sundee Fundee removes the guesswork. You don't have to be a data scientist to lift smarter; you just need your app to respect the signals your watch is already capturing.",
        ],
      },
      {
        title: "Privacy and your health data",
        body: [
          "Health data is personal. Any app reading from Apple Health should prioritize on-device processing and clear permissions. You should always be in control of which metrics are used to calculate your readiness score.",
          "We believe in using data to support your goals without compromising your privacy. That's why cycle data stays on your device and only the minimum necessary readiness context is used to guide your program.",
        ],
      },
      {
        title: "How to choose an integrated app",
        body: [
          "Look for an app that uses Apple Health as context, not as a rigid rule. The best strength apps combine your subjective feel with objective wearable data to give you the most accurate starting point for every session.",
        ],
      },
    ],
    faqs: faq("an Apple Health strength training app"),
    related: wearableRelated,
    priority: 0.92,
  },
  {
    slug: "strength-training-app-alternatives",
    kind: "comparison",
    eyebrow: "Strength App Alternatives",
    title: "Strength training app alternatives for adaptive workout planning",
    description:
      "Compare strength app categories and learn when a recovery-aware training planner is a better fit than a simple workout logger.",
    intro:
      "Most strength training app alternatives fall into a few groups: workout logs, program libraries, habit trackers, and adaptive planners. Sundee Fundee sits in the adaptive planning category for lifters who want the session to respond to recovery and constraints.",
    sections: sections(
      "a strength training app alternative",
      "A basic logger is useful when you already know exactly what to do. It is less helpful when you need help deciding whether to push, repeat, substitute, or pull back.",
      "Sundee Fundee combines planning, readiness, pain flags, and progress tracking so the app is not just a notebook. It gives structure to the decision you make before and during the workout.",
      "If you are choosing between app types, decide whether you mainly need record keeping or training guidance. The more often your plan needs adjustment, the more valuable adaptive planning becomes.",
      "Use this guide to understand where recovery-aware planning fits among generic strength training app options.",
    ),
    faqs: faq("a strength training app alternative"),
    related: [
      { href: "/best-strength-training-app-for-women", label: "Best strength app for women", description: "A category guide for women who lift." },
      { href: "/best-recovery-strength-training-app", label: "Best recovery strength app", description: "Compare recovery-aware training features." },
      { href: "/strength-training-pr-tracker", label: "Strength PR tracker", description: "Track progress without losing training context." },
    ],
    priority: 0.8,
  },
  {
    slug: "best-recovery-strength-training-app",
    kind: "comparison",
    eyebrow: "Recovery Strength Training App",
    title: "Best recovery strength training app for readiness-based workouts",
    description:
      "What to look for in a strength app that uses readiness, sleep, soreness, and training history to guide workout choices.",
    intro:
      "Recovery-aware strength training is not about avoiding hard work. It is about matching the day’s training stress to the athlete in front of the bar.",
    sections: sections(
      "a recovery strength app",
      "Recovery scores can be useful, but only if they connect to a practical session change. A number without a training decision often creates more uncertainty, not less.",
      "Sundee Fundee uses readiness as a planning input, then keeps the focus on the workout. The app can preserve the session’s intent while changing load, volume, or exercise selection when that is the more reasonable choice.",
      "Look for apps that combine objective data with subjective check-ins. Sleep and HRV matter, but so do soreness, stress, pain, and how the warm-up feels.",
      "Use this page to evaluate whether recovery-aware training is the right app category for your lifting style.",
    ),
    faqs: faq("a recovery strength training app"),
    related: recoveryRelated,
    priority: 0.84,
  },
  {
    slug: "free-strength-training-app-for-women",
    kind: "comparison",
    eyebrow: "Free Strength Training App",
    title: "Free strength training app for women who want adaptable workouts",
    description:
      "Compare what a free strength training app for women should include: workout logging, recovery context, injury-aware changes, and no subscription pressure.",
    intro:
      "A free strength training app for women should still respect the way real training weeks change. Price matters, but the bigger question is whether the app helps you choose the next useful session when recovery, soreness, schedule, or pain changes the plan.",
    sections: sections(
      "a free strength training app",
      "Many free lifting apps are useful as logs but stop short of planning. That is fine if all you need is a notebook. It is weaker when you want a session that can adapt without hiding the practical features behind a subscription.",
      "Sundee Fundee is built as a free iPhone app with donations as support, not as a paywall around core training decisions. The workflow keeps readiness, pain flags, cycle context, and progress history close to the workout.",
      "Look for transparent pricing, useful logging, visible workout history, and guidance that stays available after the first week. A free app should not punish consistency by locking the next important training decision.",
      "Use this page if you are comparing free strength apps and want the no-subscription option to still be serious enough for long-term lifting.",
    ),
    faqs: faq("a free strength training app for women"),
    related: [
      { href: "/donate", label: "Support the free app", description: "Help keep the app free without subscriptions or ads." },
      { href: "/best-strength-training-app-for-women", label: "Best strength app for women", description: "Compare the wider app category." },
      { href: "/strength-training-log-for-women", label: "Strength training log", description: "Track sessions with recovery context." },
      ...womenRelated,
    ],
    priority: 0.86,
  },
  {
    slug: "strength-training-log-for-women",
    kind: "feature",
    eyebrow: "Strength Training Log",
    title: "Strength training log for women with recovery context",
    description:
      "Use a strength training log that tracks sets, reps, readiness, pain flags, cycle context, and progress without losing the training decision.",
    intro:
      "A strength training log for women should do more than store numbers. The useful log connects what you lifted with how ready you were, what hurt, what changed, and what the next session should learn from it.",
    sections: sections(
      "a strength training log",
      "Sets, reps, and load are the base layer. They tell you what happened, but they do not explain why a session felt strong, flat, or constrained. Recovery and context make the log easier to use later.",
      "Sundee Fundee keeps the workout record connected to readiness, pain notes, optional cycle context, and program structure. That gives the next session more information than a blank list of exercises.",
      "Look for quick entry, clear history, lift-specific progress, notes that stay attached to the workout, and an app that does not make logging harder than training.",
      "Use this guide if you want a training log that supports decisions instead of becoming a separate admin task after the workout.",
    ),
    faqs: faq("a strength training log for women"),
    related: [
      { href: "/strength-training-pr-tracker", label: "Strength PR tracker", description: "Connect records to training history." },
      { href: "/free-strength-training-app-for-women", label: "Free strength app", description: "Compare the no-subscription option." },
      { href: "/blog/top-set-back-off-set-programming", label: "Top set and back-off sets", description: "Learn a simple logging structure." },
      ...womenRelated,
    ],
    priority: 0.82,
  },
  {
    slug: "hrv-strength-training-app",
    kind: "feature",
    eyebrow: "HRV Strength Training App",
    title: "HRV strength training app for readiness-based lifting",
    description:
      "Learn how an HRV strength training app should turn heart rate variability into practical lifting choices without overreacting to one metric.",
    intro:
      "An HRV strength training app is useful only when HRV changes the training decision in a reasonable way. The goal is not to obey one number; it is to use HRV as recovery context beside sleep, soreness, stress, and the warm-up.",
    sections: sections(
      "an HRV strength training app",
      "HRV can flag strain, but it is noisy enough that a single reading should not decide the whole week. Lifters need an app that notices trends and translates them into a session adjustment.",
      "Sundee Fundee uses HRV as one readiness input rather than the whole system. When HRV is low, the app can help choose between normal training, reduced volume, technique work, or a more conservative session.",
      "Look for trend awareness, plain explanations, subjective check-ins, and training options that preserve the purpose of the day without pretending HRV is a diagnosis.",
      "Use this page if wearable recovery data is part of your lifting routine and you want it to become actionable without becoming the coach.",
    ),
    faqs: faq("an HRV strength training app"),
    related: [
      { href: "/blog/when-hrv-is-low-strength-training", label: "When HRV is low", description: "What to change before lifting." },
      { href: "/readiness-score-strength-training", label: "Readiness score", description: "Use recovery context in the daily decision." },
      { href: "/best-recovery-strength-training-app", label: "Recovery strength app", description: "Compare recovery-aware app features." },
      ...recoveryRelated,
    ],
    priority: 0.84,
  },
  {
    slug: "fitbod-alternative-for-women",
    kind: "comparison",
    eyebrow: "Fitbod Alternative",
    title: "Fitbod alternative for women who want recovery-aware strength training",
    description:
      "Compare Fitbod-style workout generation with a recovery-aware strength training app built around readiness, pain flags, optional cycle context, and progress.",
    intro:
      "A Fitbod alternative for women should not just generate another workout. It should help you decide what kind of workout makes sense today, especially when recovery, cycle symptoms, soreness, or pain changes the original plan.",
    sections: sections(
      "a Fitbod alternative",
      "Workout generators can be convenient, but lifters often need more than exercise variety. The session should account for readiness and constraints without losing the larger strength direction.",
      "Sundee Fundee focuses on recovery-aware planning for iPhone. The app keeps the strength decision centered while adding optional cycle context, pain flags, and workout history to the session.",
      "Look for clear programming intent, conservative substitutions, transparent recovery logic, and a log that makes progress easier to review over time.",
      "Use this comparison when Fitbod-style generation feels too generic and you want a women-focused strength workflow with stronger context.",
    ),
    faqs: faq("a Fitbod alternative for women"),
    related: [
      { href: "/strength-training-app-alternatives", label: "Strength app alternatives", description: "Compare logging, planning, and adaptive app types." },
      { href: "/best-strength-training-app-for-women", label: "Best strength app for women", description: "See the broader selection criteria." },
      { href: "/recovery-aware-strength-training", label: "Recovery-aware training", description: "How the Sundee Fundee approach works." },
    ],
    priority: 0.82,
  },
  {
    slug: "hevy-alternative-for-strength-training",
    kind: "comparison",
    eyebrow: "Hevy Alternative",
    title: "Hevy alternative for strength training with adaptive planning",
    description:
      "Compare a Hevy-style workout logger with a strength training app that adds readiness, recovery context, pain-aware changes, and planning support.",
    intro:
      "A Hevy alternative for strength training should be clear about whether it is mainly a log or a training decision tool. Logging matters, but many lifters also need help choosing the right version of today's workout.",
    sections: sections(
      "a Hevy alternative",
      "A clean workout log is valuable when the plan is already settled. It becomes less complete when the hardest part is deciding whether to push, hold steady, substitute, or reduce volume.",
      "Sundee Fundee keeps logging connected to adaptive planning. Readiness, training history, pain flags, and optional cycle context can all shape the next session while still preserving a clear record.",
      "Look for fast workout entry, useful history, app-supported progression, and a decision workflow that stays practical when the plan changes.",
      "Use this page if you like the idea of simple logging but want a strength app that also helps interpret the day in front of you.",
    ),
    faqs: faq("a Hevy alternative for strength training"),
    related: [
      { href: "/strength-training-log-for-women", label: "Strength training log", description: "Track sessions with context." },
      { href: "/strength-training-pr-tracker", label: "PR tracker", description: "Keep records connected to training decisions." },
      { href: "/strength-training-app-alternatives", label: "Strength app alternatives", description: "Compare app categories." },
    ],
    priority: 0.8,
  },
  {
    slug: "readiness-score-strength-training",
    kind: "feature",
    eyebrow: "Readiness Score",
    title: "Readiness score for strength training decisions",
    description:
      "Use readiness context to decide when to push, repeat, modify, or pull back in strength training.",
    intro:
      "A readiness score is most useful when it changes what you do in the gym. For strength training, that means connecting recovery context to load, volume, exercise choice, and expectations for the day.",
    sections: sections(
      "a readiness score",
      "Lifters often know when something feels off, but it can be hard to decide what should change. A readiness score gives that decision a starting point without making the number the only thing that matters.",
      "Sundee Fundee combines recovery signals and subjective check-ins, then uses the result to shape the next session. The goal is a better training choice, not a perfect prediction.",
      "A useful readiness feature should explain the recommendation and leave room for your judgment during the warm-up.",
      "Use this guide to understand how readiness can support strength training without turning every day into a pass-fail test.",
    ),
    faqs: faq("a readiness score for strength training"),
    related: recoveryRelated,
    priority: 0.78,
  },
  {
    slug: "cycle-based-strength-training",
    kind: "feature",
    eyebrow: "Cycle-Based Strength Training",
    title: "Cycle-based strength training without rigid rules",
    description:
      "Learn how cycle context can support strength programming while keeping readiness and lived experience in the decision.",
    intro:
      "Cycle-based strength training works best as context, not a command. The goal is to notice patterns and make better choices while still respecting how you feel on the day.",
    sections: sections(
      "cycle-based strength training",
      "Some athletes notice changes in energy, symptoms, or perceived effort across the menstrual cycle. Others see less predictable patterns. A useful app should support both experiences.",
      "Sundee Fundee keeps cycle tracking optional and combines it with readiness. That means cycle context can inform programming without overriding sleep, soreness, pain, or your own check-in.",
      "Look for flexible phase notes, conservative recommendations, and clear privacy expectations. Avoid any tool that treats cycle phase as a fixed performance guarantee.",
      "Use this page if you want cycle-aware training that stays practical and individualized.",
    ),
    faqs: faq("cycle-based strength training"),
    related: womenRelated,
    priority: 0.78,
  },
  {
    slug: "injury-friendly-workout-planner",
    kind: "feature",
    eyebrow: "Injury-Friendly Workout Planner",
    title: "Injury-friendly workout planner for conservative training choices",
    description:
      "Plan workouts around pain flags and limitations while keeping training decisions conservative and organized.",
    intro:
      "An injury-friendly workout planner should not promise to fix pain. Its job is to help you organize training choices when a movement, joint, or pattern needs extra caution.",
    sections: sections(
      "an injury-friendly planner",
      "When something hurts, the hardest part is often deciding what still belongs in the session. A planner can help by flagging movements, offering alternatives, and keeping notes visible.",
      "Sundee Fundee lets pain and injury context influence the workout so the plan can adapt around current limitations. It keeps the decision conservative and encourages professional guidance when needed.",
      "Look for substitution logic, clear notes, and a way to preserve training rhythm without treating discomfort as something to ignore.",
      "Use this page to understand how app-based planning can support safer organization around limitations.",
    ),
    faqs: faq("an injury-friendly workout planner"),
    related: injuryRelated,
    priority: 0.78,
  },
  {
    slug: "strength-training-pr-tracker",
    kind: "feature",
    eyebrow: "PR Tracker",
    title: "Strength training PR tracker with recovery context",
    description:
      "Track personal records, maxes, and progress signals without separating numbers from readiness and training history.",
    intro:
      "A PR tracker should celebrate progress, but it should also help you understand the context around that progress. Strength numbers mean more when they sit beside training consistency and recovery.",
    sections: sections(
      "a strength PR tracker",
      "Maxes, rep PRs, and benchmark workouts can motivate training, but chasing them every week can blur the difference between testing and building.",
      "Sundee Fundee keeps progress tracking connected to the program. PRs are part of the story, alongside readiness, session quality, and whether the plan is still moving in the right direction.",
      "Look for clear history, lift-specific records, and enough context to understand why a number changed.",
      "Use this page if you want tracking that supports training decisions instead of turning every session into a scoreboard.",
    ),
    faqs: faq("a strength training PR tracker"),
    related: [
      { href: "/strength-training-app-alternatives", label: "Strength app alternatives", description: "Compare planning and logging app categories." },
      { href: "/beginner-strength-training-plan", label: "Beginner strength plan", description: "Build progress with simple structure." },
      { href: "/recovery-based-workout-plan", label: "Recovery-based workout plan", description: "Use recovery context while progressing." },
    ],
    priority: 0.74,
  },
  {
    slug: "deload-week-planner",
    kind: "feature",
    eyebrow: "Deload Week Planner",
    title: "Deload week planner for strength training",
    description:
      "Use readiness, performance trends, and training stress to plan deload weeks without guessing.",
    intro:
      "A deload week is a training tool, not a punishment. The right planner helps you reduce stress at the right time while keeping the habit and technique work intact.",
    sections: sections(
      "a deload planner",
      "Many lifters wait until performance drops or motivation disappears before reducing workload. A planner can make deloads more intentional by watching readiness and training accumulation.",
      "Sundee Fundee supports deload thinking by treating recovery and training history as part of the same workflow. The app can help you choose a lighter week without losing the thread of the program.",
      "Look for volume and intensity adjustments, clear session intent, and guidance that keeps the week useful instead of empty.",
      "Use this page to think through deloads as part of long-term strength progress.",
    ),
    faqs: faq("a deload week planner"),
    related: [
      { href: "/blog/deload-week-programming-strength-training", label: "Deload week programming", description: "A deeper guide to deload timing." },
      { href: "/readiness-score-strength-training", label: "Readiness score", description: "Use readiness to time training changes." },
      { href: "/strength-training-recovery", label: "Strength recovery hub", description: "Browse recovery-aware training resources." },
    ],
    priority: 0.74,
  },
  {
    slug: "strength-training-plan-for-women",
    kind: "program",
    eyebrow: "Strength Plan for Women",
    title: "Strength training plan for women who want adaptable structure",
    description:
      "Build a strength training plan around consistency, recovery, progress tracking, and optional cycle-aware context.",
    intro:
      "A strength training plan for women should be structured enough to drive progress and flexible enough to handle real training weeks. The best plan is one you can repeat, adjust, and understand.",
    sections: sections(
      "a strength plan for women",
      "A good plan defines the main lifts, accessory work, progression, and recovery rhythm. It should also leave room for the fact that sleep, stress, cycle symptoms, and soreness vary.",
      "Sundee Fundee gives the plan a decision layer. Instead of abandoning structure when life changes, the app helps adapt the day while preserving the larger goal.",
      "Look for simple progression, clear exercise intent, and a way to log how the session actually went.",
      "Use this page if you want structure without pretending every week is identical.",
    ),
    faqs: faq("a strength training plan for women"),
    related: womenRelated,
    priority: 0.82,
  },
  {
    slug: "beginner-strength-training-plan",
    kind: "program",
    eyebrow: "Beginner Strength Plan",
    title: "Beginner strength training plan with recovery-aware progression",
    description:
      "A practical beginner strength training approach focused on consistency, technique, and appropriate progression.",
    intro:
      "A beginner strength training plan should make the next workout clear. It should build confidence with repeatable lifts, realistic progression, and enough recovery context to avoid turning every day into a test.",
    sections: sections(
      "a beginner strength plan",
      "Beginners do not need complexity first. They need a plan that repeats key patterns, tracks effort, and explains when to add weight or keep the same load.",
      "Sundee Fundee helps beginners by organizing the session and using readiness to keep decisions grounded. The app can support consistency without requiring advanced programming knowledge.",
      "Look for simple full-body structure, technique-friendly progressions, and a log that makes small wins visible.",
      "Use this page as a starting point for strength training that can grow with experience.",
    ),
    faqs: faq("a beginner strength training plan"),
    related: [
      { href: "/strength-training-pr-tracker", label: "PR tracker", description: "Track progress as strength builds." },
      { href: "/best-strength-training-app-for-women", label: "Best strength app for women", description: "Choose an app with adaptive structure." },
      { href: "/blog/warm-up-protocol-for-strength-training", label: "Warm-up protocol", description: "Prepare for better strength sessions." },
    ],
    priority: 0.8,
  },
  {
    slug: "strength-training-after-injury",
    kind: "program",
    eyebrow: "Training After Injury",
    title: "Strength training after injury with conservative planning",
    description:
      "How to think about returning to strength training after an injury, with conservative app-supported planning and clear limits.",
    intro:
      "Strength training after injury should be handled carefully and, when appropriate, with professional guidance. A training app can help organize choices, but it should not replace clinical advice.",
    sections: sections(
      "training after injury",
      "The first question is not how fast you can get back to old numbers. It is which movements are currently appropriate, what needs to be avoided, and how to rebuild consistency without ignoring warning signs.",
      "Sundee Fundee can keep pain flags and limitations visible while planning sessions. That makes it easier to choose substitutions or lower-stress work when the original plan no longer fits.",
      "Look for conservative progression, clear notes, and a workflow that makes it easy to respect restrictions from a clinician or coach.",
      "Use this page as an educational planning guide, not a diagnosis or return-to-play protocol.",
    ),
    faqs: faq("strength training after injury"),
    related: injuryRelated,
    priority: 0.78,
  },
  {
    slug: "recovery-based-workout-plan",
    kind: "program",
    eyebrow: "Recovery-Based Workout Plan",
    title: "Recovery-based workout plan for strength training",
    description:
      "Plan strength workouts around readiness, fatigue, sleep, and training history while keeping long-term progress in view.",
    intro:
      "A recovery-based workout plan starts with the same goal as any good plan: get stronger over time. The difference is that the day’s workload can change when recovery context says it should.",
    sections: sections(
      "a recovery-based workout plan",
      "Fixed plans are simple, but they can become brittle when recovery changes. A recovery-based plan keeps the main direction stable while allowing the session to flex.",
      "Sundee Fundee uses readiness signals to guide whether the day should be heavy, normal, technical, or lighter. That makes adaptation part of the plan instead of a failure of discipline.",
      "Look for session options that preserve intent: lower volume, different exercise selection, or adjusted loads rather than a vague suggestion to do less.",
      "Use this page if you want recovery to inform training without replacing progression.",
    ),
    faqs: faq("a recovery-based workout plan"),
    related: recoveryRelated,
    priority: 0.82,
  },
  {
    slug: "two-day-strength-training-plan-for-women",
    kind: "program",
    eyebrow: "Two-Day Strength Plan",
    title: "Two-day strength training plan for women who need flexible structure",
    description:
      "A practical two-day strength training plan for women, built around full-body sessions, recovery-aware progression, and realistic weekly schedules.",
    intro:
      "A two-day strength training plan for women works best when each session has a clear job. With fewer weekly workouts, the plan needs enough full-body structure to build strength and enough flexibility to survive busy weeks.",
    sections: sections(
      "a two-day strength plan",
      "Two lifting days can be enough for progress when the program covers squat, hinge, push, pull, core, and carries across the week. The mistake is treating two days as random workouts instead of a compact training block.",
      "Sundee Fundee can keep a two-day plan organized while using readiness and pain flags to adjust the session. If recovery is low, the app can preserve the pattern while reducing the stress of the day.",
      "Look for full-body sessions, simple progression, repeatable exercises, and a log that makes it obvious whether the plan is moving forward.",
      "Use this page if your schedule can support two serious lifting days and you want those days to be planned instead of improvised.",
    ),
    faqs: faq("a two-day strength training plan for women"),
    related: [
      { href: "/blog/two-day-strength-training-plan-women", label: "Two-day plan guide", description: "Read the detailed article version." },
      { href: "/workout-plans", label: "Printable strength plans", description: "Download paper training blocks." },
      { href: "/strength-training-plan-for-women", label: "Strength plan for women", description: "Plan flexible weekly structure." },
      ...womenRelated,
    ],
    priority: 0.84,
  },
  {
    slug: "perimenopause-strength-training",
    kind: "program",
    eyebrow: "Perimenopause Strength Training",
    title: "Perimenopause strength training with recovery-aware programming",
    description:
      "Plan strength training in perimenopause with flexible expectations around sleep, symptoms, recovery, consistency, and progressive overload.",
    intro:
      "Perimenopause strength training should keep the goal serious while making room for more variable recovery. Sleep changes, stress, symptoms, and energy swings can affect the training day without making strength work any less valuable.",
    sections: sections(
      "perimenopause strength training",
      "The useful target is consistent progressive strength work with room to adjust. Some weeks can support normal progression; others need changes to volume, intensity, or exercise selection.",
      "Sundee Fundee gives the workout a readiness layer so the plan can respond to sleep, soreness, stress, pain, and training history. Optional cycle context can be used when it is helpful without forcing fixed phase rules.",
      "Look for conservative progression, clear strength patterns, recovery notes, and an app that treats symptoms as context instead of a reason to abandon training.",
      "Use this page if you want a strength plan that stays ambitious while acknowledging that recovery can be less predictable in perimenopause.",
    ),
    faqs: faq("perimenopause strength training"),
    related: [
      { href: "/blog/perimenopause-strength-training-programming", label: "Perimenopause programming", description: "Read a deeper programming guide." },
      { href: "/blog/strength-training-women-over-40", label: "Women over 40", description: "Strength resources for midlife lifters." },
      { href: "/strength-training-recovery", label: "Recovery hub", description: "Browse recovery-aware guides." },
      ...womenRelated,
    ],
    priority: 0.82,
  },
  {
    slug: "postpartum-strength-training-app",
    kind: "program",
    eyebrow: "Postpartum Strength App",
    title: "Postpartum strength training app for conservative return-to-lifting",
    description:
      "Use a conservative postpartum strength training app workflow that supports readiness, gradual progression, movement notes, and professional guidance.",
    intro:
      "A postpartum strength training app should be conservative, clear, and honest about its limits. It can help organize workouts and progression, but it should not replace medical clearance, pelvic floor care, or individualized coaching when those are needed.",
    sections: sections(
      "a postpartum strength app",
      "The early return to lifting is not just a smaller version of the old program. It often needs more attention to symptoms, fatigue, sleep, pressure management, and exercise selection.",
      "Sundee Fundee can support conservative planning by keeping readiness, pain notes, and training history attached to the workout. The app can help reduce stress or change exercise selection when the original plan is not appropriate.",
      "Look for gradual progression, easy notes, cautious language, and room to follow clinician or coach guidance. Avoid any app that promises a fixed postpartum timeline for every lifter.",
      "Use this page if you want app-supported organization for a careful return to strength training after pregnancy.",
    ),
    faqs: faq("a postpartum strength training app"),
    related: [
      { href: "/blog/postpartum-return-to-lifting-timeline", label: "Postpartum return timeline", description: "Read the detailed return-to-lifting guide." },
      { href: "/strength-training-after-injury", label: "Conservative return planning", description: "Use careful progression after constraints." },
      { href: "/train-around-injury", label: "Train around injury", description: "Keep constraints visible in the session." },
      ...injuryRelated,
    ],
    priority: 0.8,
  },
  {
    slug: "strength-training-during-period",
    kind: "program",
    eyebrow: "Training During Your Period",
    title: "Strength training during your period with flexible expectations",
    description:
      "A practical guide to training during your period, using symptoms, readiness, and preference to shape the workout.",
    intro:
      "Strength training during your period does not need a universal rule. Some athletes train normally, some adjust volume or intensity, and some benefit from a more conservative session.",
    sections: sections(
      "training during your period",
      "Symptoms and energy can vary widely. The useful question is what today’s body is telling you and whether the plan needs to change to keep training productive.",
      "Sundee Fundee treats cycle context as optional information alongside readiness and your check-in. That makes the workout flexible without assuming the same answer for every person.",
      "Look for apps that support notes, flexible adjustments, and privacy-conscious tracking. Avoid tools that promise a fixed performance outcome based on phase alone.",
      "Use this page to make practical workout decisions during your period while keeping the larger plan intact.",
    ),
    faqs: faq("strength training during your period"),
    related: womenRelated,
    priority: 0.78,
  },
  {
    slug: "strength-training-recovery",
    kind: "hub",
    eyebrow: "Recovery Hub",
    title: "Strength training recovery guides and app resources",
    description:
      "A hub for recovery-aware strength training, readiness scores, deload weeks, HRV, sleep, and workout planning.",
    intro:
      "Recovery is one of the most useful lenses for strength training because it connects the plan on paper to the athlete doing the work today.",
    sections: sections(
      "a recovery topic hub",
      "This hub collects guides for lifters who want recovery to shape training decisions without making every workout dependent on a single metric.",
      "Sundee Fundee brings readiness, sleep, soreness, and training history into the same planning workflow. The aim is practical adjustment, not data overload.",
      "Start with readiness if you need a daily decision, deload planning if fatigue is accumulating, or wearable data if you want to understand Apple Health and HRV inputs.",
      "Use the resources below to move from recovery theory to specific training choices.",
    ),
    faqs: faq("strength training recovery"),
    related: [
      { href: "/readiness-score-strength-training", label: "Readiness score", description: "Daily readiness for lifting decisions." },
      { href: "/deload-week-planner", label: "Deload week planner", description: "Plan lower-stress training weeks." },
      { href: "/best-recovery-strength-training-app", label: "Best recovery strength app", description: "Choose a recovery-aware app category." },
      ...recoveryRelated,
    ],
    priority: 0.82,
  },
  {
    slug: "strength-training-for-women",
    kind: "hub",
    eyebrow: "Women Who Lift",
    title: "Strength training for women: plans, recovery, and cycle-aware guides",
    description:
      "A resource hub for women who lift, covering strength plans, recovery, optional cycle context, and app-supported progression.",
    intro:
      "Strength training for women deserves the same serious programming conversation as any other lifting goal, with added room for recovery, cycle context, and individual constraints when they matter.",
    sections: [
      {
        title: "Moving beyond generic advice",
        body: [
          "Most women's fitness material focuses on vague motivation or 'toning' routines. But real strength gains come from consistent, progressive overload and a deep understanding of how your body responds to stress.",
          "We believe in programming that respects the physiological realities women face, providing enough structure to drive progress and enough flexibility to survive the weeks where recovery is a struggle.",
        ],
      },
      {
        title: "The Sundee Fundee approach",
        body: [
          "Sundee Fundee was designed by lifters for lifters. It treats cycle phase as useful context rather than a rigid rule, allowing you to push when energy is high and pull back when your body needs a more conservative session.",
          "By combining subjective check-ins with objective readiness data, the app helps you navigate the training day with confidence, ensuring each session moves you toward your long-term goals.",
        ],
      },
    ],
    faqs: faq("strength training for women"),
    related: [
      { href: "/strength-training-plan-for-women", label: "Strength plan for women", description: "Adaptable structure for lifting." },
      { href: "/best-strength-training-app-for-women", label: "Best strength app for women", description: "What to look for in an app." },
      ...womenRelated,
    ],
    priority: 0.9,
  },
  {
    slug: "lifting-with-injuries",
    kind: "hub",
    eyebrow: "Lifting With Injuries",
    title: "Lifting with injuries: conservative strength training resources",
    description:
      "A hub for injury-aware strength training, substitutions, conservative planning, and app-supported workout adjustments.",
    intro:
      "Lifting with injuries requires caution, context, and often professional guidance. These resources focus on organizing training decisions when the original plan needs to change.",
    sections: sections(
      "an injury-aware lifting hub",
      "This hub avoids promises and quick fixes. It focuses on planning: what to flag, what to modify, and how to keep a useful training record.",
      "Sundee Fundee can keep pain notes and movement limitations attached to the workout workflow so constraints are visible before the session starts.",
      "Start with training around injury for the broad approach, then use the planner page for app-specific organization and the after-injury page for conservative return-to-training framing.",
      "Use these resources to support better questions and better training organization, not to replace clinical care.",
    ),
    faqs: faq("lifting with injuries"),
    related: [
      { href: "/strength-training-after-injury", label: "Strength training after injury", description: "Conservative return-to-lifting planning." },
      ...injuryRelated,
    ],
    priority: 0.88,
  },
  {
    slug: "wearables-and-strength-training",
    kind: "hub",
    eyebrow: "Wearables and Strength Training",
    title: "Wearables and strength training: Apple Health, HRV, and readiness",
    description:
      "A hub for using wearable recovery data in strength training without letting metrics replace judgment.",
    intro:
      "Wearables can be useful for strength training when they provide context for recovery and consistency. They are less useful when every metric becomes a rule.",
    sections: sections(
      "a wearables strength hub",
      "This hub connects Apple Health, HRV, sleep, and readiness topics for lifters who want data to support the training day.",
      "Sundee Fundee uses wearable context as one input in a broader decision. Subjective readiness, training history, and the warm-up still matter.",
      "Start with Apple Health if you train on iPhone, or readiness if you want the clearest daily decision point.",
      "Use these resources to make wearable data practical for lifting rather than distracting.",
    ),
    faqs: faq("wearables and strength training"),
    related: [
      { href: "/best-apple-health-strength-training-app", label: "Best Apple Health strength app", description: "Choose an Apple Health-aware app." },
      ...wearableRelated,
    ],
    priority: 0.88,
  },
  {
    slug: "cycle-aware-training",
    kind: "hub",
    eyebrow: "Cycle-Aware Training",
    title: "Cycle-aware strength training guides and app resources",
    description:
      "A hub for optional cycle-aware strength training, period workouts, programming context, and privacy-conscious tracking.",
    intro:
      "Cycle-aware training is most useful when it helps you notice patterns and make practical decisions. It should not reduce training to a rigid phase chart.",
    sections: sections(
      "a cycle-aware training hub",
      "This hub collects resources for athletes who want menstrual cycle context to support strength training while keeping readiness and individual experience central.",
      "Sundee Fundee keeps cycle tracking optional and combines it with other readiness inputs. That makes cycle context a layer, not the whole plan.",
      "Start with cycle-based strength training for the general approach, training during your period for day-of decisions, or women’s strength resources for the broader plan.",
      "Use this hub if you want practical cycle-aware training with conservative claims and flexible expectations.",
    ),
    faqs: faq("cycle-aware training"),
    related: [
      { href: "/cycle-based-strength-training", label: "Cycle-based strength training", description: "Use cycle context without rigid rules." },
      { href: "/strength-training-during-period", label: "Training during your period", description: "Flexible workout expectations." },
      ...womenRelated,
    ],
    priority: 0.88,
  },
];

export function getSeoPage(slug: string): SeoPage | undefined {
  return seoPages.find((page) => page.slug === slug);
}
