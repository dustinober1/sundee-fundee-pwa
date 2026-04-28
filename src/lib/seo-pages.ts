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
};

export const SEO_PAGES_LAST_MODIFIED = "2026-04-27";

const recoveryRelated: SeoPageLink[] = [
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
    sections: sections(
      "a women-focused strength app",
      "Many lifting apps assume the plan should run exactly as written. That can work for simple logging, but it is less useful when sleep, soreness, cycle phase, or an irritated joint changes the decision you need to make before training.",
      "Sundee Fundee gives women who lift a recovery-aware way to plan the next session. It keeps the emphasis on strength, but adds context so you can choose a heavy day, a normal day, or a more conservative version of the workout.",
      "Choose an app that separates useful adaptation from vague motivation. The app should show the planned work, explain when a change is reasonable, and keep your progress history easy to understand.",
      "Start here if you are comparing app categories and want a strength tool that respects recovery without turning training into guesswork.",
    ),
    faqs: faq("a strength training app for women"),
    related: womenRelated,
    priority: 0.86,
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
    sections: sections(
      "an Apple Health strength app",
      "HRV, resting heart rate, sleep, and activity trends can help explain why a session feels different than expected. The app still needs to translate those signals into a reasonable strength-training adjustment.",
      "Sundee Fundee reads Apple Health context with your permission and uses it alongside subjective readiness and training history. The result is a session that can adapt without requiring you to interpret every chart manually.",
      "Look for clear permissions, plain explanations, and a training workflow where health data supports the workout instead of distracting from it.",
      "Use this page when you want Apple Health to inform lifting decisions while keeping strength training as the main job.",
    ),
    faqs: faq("an Apple Health strength training app"),
    related: wearableRelated,
    priority: 0.84,
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
    sections: sections(
      "a women’s strength training hub",
      "This hub collects pages for women who want useful strength structure without generic advice or rigid assumptions.",
      "Sundee Fundee supports lifting through readiness, optional cycle tracking, pain flags, and progress logging. It is built to keep the training decision clear.",
      "Start with the strength plan if you need structure, cycle-aware training if you want optional context, or app selection if you are comparing tools.",
      "Use this hub as the main path into women-focused strength content on the site.",
    ),
    faqs: faq("strength training for women"),
    related: [
      { href: "/strength-training-plan-for-women", label: "Strength plan for women", description: "Adaptable structure for lifting." },
      { href: "/best-strength-training-app-for-women", label: "Best strength app for women", description: "What to look for in an app." },
      ...womenRelated,
    ],
    priority: 0.84,
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
      { href: "/strength-training-after-injury", label: "Strength training after injury", description: "Conservative return-to-training planning." },
      ...injuryRelated,
    ],
    priority: 0.8,
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
    priority: 0.8,
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
    priority: 0.8,
  },
];

export function getSeoPage(slug: string): SeoPage | undefined {
  return seoPages.find((page) => page.slug === slug);
}
