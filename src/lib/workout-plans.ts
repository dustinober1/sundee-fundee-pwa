export type WorkoutPlanSampleDay = {
  day: string;
  focus: string;
  workout: string;
};

export type WorkoutPlanFaq = {
  question: string;
  answer: string;
};

export type WorkoutPlanLink = {
  href: string;
  label: string;
  description: string;
};

export type WorkoutPlan = {
  slug: string;
  appProgramId: string | null;
  title: string;
  shortTitle: string;
  description: string;
  audience: string;
  pages: number;
  weeks: string;
  workouts: string;
  equipment: string;
  pdfPath: string;
  coverPath: string;
  landingTitle: string;
  landingDescription: string;
  searchIntent: string;
  sampleWeek: WorkoutPlanSampleDay[];
  whoItFits: string[];
  whoShouldSkip: string[];
  faqs: WorkoutPlanFaq[];
  relatedLinks: WorkoutPlanLink[];
};

export const workoutPlans: WorkoutPlan[] = [
  {
    slug: "100-push-ups",
    appProgramId: "100-push-ups",
    title: "8-Week 100 Push-Ups Program",
    shortTitle: "100 Push-Ups",
    description:
      "A bodyweight-only printable plan that builds push-up volume, shoulder balance, and trunk control toward one final max-rep test.",
    audience: "Bodyweight endurance",
    pages: 10,
    weeks: "8 weeks",
    workouts: "24 workouts",
    equipment: "Bodyweight only",
    pdfPath: "/workout-plans/8-week-100-push-ups-program.pdf",
    coverPath: "/workout-plans/8-week-100-push-ups-program-cover.png",
    landingTitle:
      "8 Week 100 Push Ups Program PDF for Progressive Bodyweight Strength",
    landingDescription:
      "Download an 8 week 100 push ups program PDF built for lifters who want a printable progression, clear weekly volume targets, and a simple paper log before a final rep test.",
    searchIntent:
      "Find a printable 8 week 100 push ups program with a clear progression and repeatable weekly structure.",
    sampleWeek: [
      {
        day: "Day 1",
        focus: "Volume ladder",
        workout: "Climb through submaximal push-up sets, then finish with plank holds and shoulder-control work.",
      },
      {
        day: "Day 2",
        focus: "Density practice",
        workout: "Accumulate total reps inside a short time cap while keeping every set a few reps shy of failure.",
      },
      {
        day: "Day 3",
        focus: "Test prep",
        workout: "Use wave sets, scap push-ups, and a short max-set rehearsal to prepare for the end-of-block test.",
      },
    ],
    whoItFits: [
      "Lifters who want a bodyweight-only plan they can print and follow anywhere.",
      "Athletes rebuilding upper-body endurance without adding extra equipment.",
      "Busy trainees who prefer a short three-day weekly structure with a clear rep target.",
    ],
    whoShouldSkip: [
      "Anyone with active wrist, shoulder, or elbow pain that flares during pressing volume.",
      "Lifters who need a hypertrophy-focused upper-body plan with heavier external loading.",
    ],
    faqs: [
      {
        question: "How many days per week is the 100 push-ups plan?",
        answer:
          "The printable block uses three sessions per week so pressing volume can build while your shoulders and elbows recover between workouts.",
      },
      {
        question: "Do I need to start with a high push-up max?",
        answer:
          "No. The plan works best when you already have a few strict reps, but the early weeks stay submaximal so you can build tolerance before the final test.",
      },
      {
        question: "Can I pair this with other lifting?",
        answer:
          "Yes, but keep extra pressing modest. The plan already carries enough weekly push-up volume that heavy benching and large accessory pressing blocks can interfere.",
      },
      {
        question: "Is this plan free to download?",
        answer:
          "Yes. The PDF is free to print, use in the gym, and mark up by hand.",
      },
    ],
    relatedLinks: [
      {
        href: "/strength-training-plan-for-women",
        label: "Strength training plan for women",
        description: "Compare this bodyweight block with a fuller weekly strength structure.",
      },
      {
        href: "/blog/top-set-back-off-set-programming",
        label: "Top set and back-off set guide",
        description: "Use this when you want to progress from rep targets to loaded main lifts later.",
      },
      {
        href: "/workout-plans",
        label: "All printable workout plans",
        description: "Browse the full library of printable strength blocks and PDF downloads.",
      },
    ],
  },
  {
    slug: "russian-squat-program",
    appProgramId: null,
    title: "6-Week Russian Squat Program",
    shortTitle: "Russian Squat",
    description:
      "A printable six-week squat peaking block with the full classic session table, load-planning notes, and room to log your actual bar weight by hand.",
    audience: "Experienced barbell lifters",
    pages: 4,
    weeks: "6 weeks",
    workouts: "18 sessions",
    equipment: "Squat rack + barbell",
    pdfPath: "/workout-plans/6-week-russian-squat-program.pdf",
    coverPath: "/workout-plans/6-week-russian-squat-program-cover.png",
    landingTitle:
      "6 Week Russian Squat Program PDF for a Focused Squat Peak",
    landingDescription:
      "Get a printable 6 week Russian squat program PDF with the classic session table, bar-weight planning notes, and enough structure to run a short squat specialization block on paper.",
    searchIntent:
      "Download a 6 week Russian squat program PDF and see whether the classic peaking block fits your current training cycle.",
    sampleWeek: [
      {
        day: "Day 1",
        focus: "Volume base",
        workout: "Complete the prescribed six-by-two percentage work and record the exact bar load you used.",
      },
      {
        day: "Day 2",
        focus: "Middle-session build",
        workout: "Move through the classic six-by-three progression while keeping rest periods steady and technique consistent.",
      },
      {
        day: "Day 3",
        focus: "Heavy exposure",
        workout: "Finish the week with the top prescription, then note bar speed and recovery for the next wave.",
      },
    ],
    whoItFits: [
      "Experienced barbell lifters who want a short squat-focused peaking block.",
      "Powerlifters who already know their training max and can manage percentage work honestly.",
      "Athletes who want a compact printable table for a six-week specialization cycle.",
    ],
    whoShouldSkip: [
      "Beginners who still need broad technique practice and general strength work.",
      "Anyone managing active knee, hip, or low-back symptoms that make frequent squatting unpredictable.",
    ],
    faqs: [
      {
        question: "Is the Russian squat program beginner friendly?",
        answer:
          "Not really. It is a specialization block for lifters who already squat consistently and can tolerate three squat exposures each week.",
      },
      {
        question: "Do I need to know my current max first?",
        answer:
          "Yes. The percentages are only useful when they come from a recent, realistic training max rather than an aspirational number.",
      },
      {
        question: "Can I run heavy deadlifts alongside it?",
        answer:
          "Usually only in a reduced role. Most lifters need to trim posterior-chain fatigue while the squat frequency and intensity climb.",
      },
      {
        question: "Why is this PDF shorter than the other plans?",
        answer:
          "The Russian squat program is intentionally a concise table-driven peaking block, so the printable version focuses on the working prescriptions and notes you need in the rack.",
      },
    ],
    relatedLinks: [
      {
        href: "/strength-training-pr-tracker",
        label: "Strength PR tracker",
        description: "Use this to connect a squat peak to bigger long-term progress tracking.",
      },
      {
        href: "/blog/warm-up-protocol-for-strength-training",
        label: "Warm-up protocol for strength training",
        description: "Set up consistent squat sessions before the volume wave ramps up.",
      },
      {
        href: "/workout-plans",
        label: "All printable workout plans",
        description: "See other printable options if you want a broader base block instead of a peak.",
      },
    ],
  },
  {
    slug: "first-margarita",
    appProgramId: "first-margarita",
    title: "The First Margarita Strength Program",
    shortTitle: "The First Margarita",
    description:
      "An advanced 8-week printable base block with weekly overviews and gym log pages for every session. Use the app when you want adaptive logging and coaching.",
    audience: "Advanced strength",
    pages: 34,
    weeks: "8 weeks",
    workouts: "24 workouts",
    equipment: "Full gym",
    pdfPath: "/workout-plans/the-first-margarita-strength-program.pdf",
    coverPath: "/workout-plans/the-first-margarita-strength-program-cover.png",
    landingTitle:
      "Advanced 8 Week Strength Program PDF with Full Gym Training Weeks",
    landingDescription:
      "Download an advanced 8 week strength program PDF designed for experienced lifters who want a printable base block, session-by-session gym log pages, and enough structure to train hard without guesswork.",
    searchIntent:
      "Compare an advanced 8 week strength program PDF with other printable blocks before committing to a full gym cycle.",
    sampleWeek: [
      {
        day: "Day 1",
        focus: "Heavy lower",
        workout: "Main squat work, secondary hinge volume, and accessories tracked on a dedicated log page.",
      },
      {
        day: "Day 2",
        focus: "Upper strength",
        workout: "Pressing and rowing volume with clear room to log top sets, back-off sets, and accessories.",
      },
      {
        day: "Day 4",
        focus: "Full-body bridge",
        workout: "A mixed session that ties lower-body intensity to upper-body volume and finishes with trunk work.",
      },
    ],
    whoItFits: [
      "Advanced lifters who want a printable full-gym base block instead of a single-lift specialization cycle.",
      "Athletes who prefer logging top sets, back-off sets, and accessories directly on paper.",
      "Lifters who already recover well from four demanding weekly sessions.",
    ],
    whoShouldSkip: [
      "Newer lifters who still need simple movement practice and lower fatigue costs.",
      "Anyone training with minimal equipment or inconsistent weekly gym access.",
    ],
    faqs: [
      {
        question: "What makes this an advanced strength program?",
        answer:
          "The weekly workload, exercise density, and required equipment all assume a lifter who already knows the main lifts and can recover from a fuller training week.",
      },
      {
        question: "Can I run this as my only program for eight weeks?",
        answer:
          "Yes. The printable plan is a complete base block and includes the workout structure and logging pages needed to carry the whole cycle on paper.",
      },
      {
        question: "Does the app version change the plan?",
        answer:
          "The PDF stays fixed. In the app, the matching program can adapt around recovery, cycle context, pain, and exercise substitutions when you log sessions there.",
      },
      {
        question: "Is this better than a peaking block?",
        answer:
          "It serves a different job. This plan is a broader advanced training block, while a peaking block narrows the focus to short-term performance on a lift.",
      },
    ],
    relatedLinks: [
      {
        href: "/best-strength-training-app-for-women",
        label: "Best strength training app for women",
        description: "See how the app version adds adaptive guidance to a fixed base block.",
      },
      {
        href: "/blog/top-set-back-off-set-programming",
        label: "Top set and back-off set guide",
        description: "A useful refresher for the kind of logbook work this program expects.",
      },
      {
        href: "/workout-plans",
        label: "All printable workout plans",
        description: "Browse shorter or simpler printable blocks before choosing the advanced option.",
      },
    ],
  },
  {
    slug: "beginner-strength",
    appProgramId: "beginner-strength",
    title: "4-Week Beginner Strength Plan",
    shortTitle: "Beginner Strength",
    description:
      "A confidence-building printable base block for newer lifters, with different workouts every week and simple set logs you can fill in by hand.",
    audience: "Newer lifters",
    pages: 22,
    weeks: "4 weeks",
    workouts: "16 workouts",
    equipment: "Gym basics",
    pdfPath: "/workout-plans/4-week-beginner-strength-plan.pdf",
    coverPath: "/workout-plans/4-week-beginner-strength-plan-cover.png",
    landingTitle:
      "4 Week Beginner Strength Plan PDF for a Simple First Gym Block",
    landingDescription:
      "Download a 4 week beginner strength plan PDF that gives newer lifters a printable gym routine, approachable weekly progressions, and simple log pages for learning the basics with less friction.",
    searchIntent:
      "Find a printable 4 week beginner strength plan that is simple enough for a first structured month in the gym.",
    sampleWeek: [
      {
        day: "Day 1",
        focus: "Lower-body basics",
        workout: "Practice squat patterns, hip hinges, and a small amount of trunk work with simple sets and reps.",
      },
      {
        day: "Day 2",
        focus: "Upper-body basics",
        workout: "Build confidence with pressing, pulling, and shoulder-friendly accessory work in a short session.",
      },
      {
        day: "Day 4",
        focus: "Full-body review",
        workout: "Repeat the core movement patterns with modest progression and room to record what felt easiest and hardest.",
      },
    ],
    whoItFits: [
      "Newer lifters who want a first printable gym routine without a steep learning curve.",
      "Anyone returning to the gym and wanting four weeks of straightforward structure before adding complexity.",
      "People who like tracking workouts on paper while they learn exercises and setups.",
    ],
    whoShouldSkip: [
      "Experienced lifters who need heavier loading and more aggressive weekly progression.",
      "Athletes who only train at home and do not have access to basic gym equipment.",
    ],
    faqs: [
      {
        question: "How many days per week is the beginner strength plan?",
        answer:
          "The printable plan is built around four sessions per week, but the exercise selection and log pages stay simple enough for a first structured month.",
      },
      {
        question: "Do I need to know my maxes?",
        answer:
          "No. This plan works from approachable sets and reps, so the goal is learning effort, setup, and consistency rather than percentage math.",
      },
      {
        question: "Can I repeat the plan after four weeks?",
        answer:
          "Yes. Many newer lifters run it twice while gradually increasing loads and becoming more comfortable with the movement patterns.",
      },
      {
        question: "Does the PDF explain exercise swaps?",
        answer:
          "Yes. It includes practical notes and enough space to mark substitutions by hand when your gym setup or confidence level changes.",
      },
    ],
    relatedLinks: [
      {
        href: "/beginner-strength-training-plan",
        label: "Beginner strength training plan guide",
        description: "Read the broader guide on weekly structure, progression, and expectations.",
      },
      {
        href: "/strength-training-for-women",
        label: "Strength training for women",
        description: "See how a beginner block fits the wider Sundee Fundee training approach.",
      },
      {
        href: "/workout-plans",
        label: "All printable workout plans",
        description: "Move up to other printable plans when you want more volume or a different focus.",
      },
    ],
  },
  {
    slug: "dumbbell-strength",
    appProgramId: "dumbbell-strength",
    title: "6-Week Dumbbell Strength Plan",
    shortTitle: "Dumbbell Strength",
    description:
      "A printable dumbbell base block for home or gym, organized around lower, upper, unilateral, and full-body density days.",
    audience: "Home or gym",
    pages: 32,
    weeks: "6 weeks",
    workouts: "24 workouts",
    equipment: "Dumbbells",
    pdfPath: "/workout-plans/6-week-dumbbell-strength-plan.pdf",
    coverPath: "/workout-plans/6-week-dumbbell-strength-plan-cover.png",
    landingTitle:
      "6 Week Dumbbell Strength Plan PDF for Home or Small Gym Training",
    landingDescription:
      "Get a 6 week dumbbell strength plan PDF for lifters who want a printable home or gym block built around lower, upper, unilateral, and density-focused sessions.",
    searchIntent:
      "Download a 6 week dumbbell strength plan PDF that works with a limited equipment setup at home or in a small gym.",
    sampleWeek: [
      {
        day: "Day 1",
        focus: "Lower-body strength",
        workout: "Use squat, hinge, and loaded carry patterns with dumbbells and straightforward set logging.",
      },
      {
        day: "Day 2",
        focus: "Upper-body push-pull",
        workout: "Pair pressing and rowing work with shoulder balance accessories that suit a dumbbell setup.",
      },
      {
        day: "Day 4",
        focus: "Density and unilateral work",
        workout: "Finish the week with single-leg patterns, core work, and a timed full-body conditioning circuit.",
      },
    ],
    whoItFits: [
      "Home-gym lifters who mainly train with adjustable or fixed dumbbells.",
      "Gym members who want a printable plan without committing to barbell-only programming.",
      "Athletes who like unilateral work and short full-body density sessions.",
    ],
    whoShouldSkip: [
      "Lifters specifically chasing maximal barbell strength or a peaking cycle.",
      "Anyone who only has bodyweight training available and no usable dumbbell setup.",
    ],
    faqs: [
      {
        question: "Can I run this dumbbell plan at home?",
        answer:
          "Yes. It was built to work well in a home gym or a simple commercial gym as long as you have enough dumbbell load to progress.",
      },
      {
        question: "Is the plan only for beginners?",
        answer:
          "No. It can work for a wide range of lifters, especially when dumbbells are the main equipment available, but the progression stays practical rather than highly specialized.",
      },
      {
        question: "Will it help if I only have limited space?",
        answer:
          "Usually yes. The sessions revolve around dumbbell strength work, unilateral patterns, and manageable density pieces that do not require much floor space.",
      },
      {
        question: "Does the plan include conditioning?",
        answer:
          "Yes. The block includes full-body density work and short finishers so the week does more than only straight strength sets.",
      },
    ],
    relatedLinks: [
      {
        href: "/two-day-strength-training-plan-for-women",
        label: "Two-day strength training plan for women",
        description: "Use this when you need a simpler weekly schedule than the full dumbbell block.",
      },
      {
        href: "/strength-training-plan-for-women",
        label: "Strength training plan for women",
        description: "Compare the dumbbell-only version with a broader weekly structure.",
      },
      {
        href: "/workout-plans",
        label: "All printable workout plans",
        description: "Browse the rest of the printable plan library for other equipment setups.",
      },
    ],
  },
  {
    slug: "glutes-core-conditioning",
    appProgramId: "glutes-core-conditioning",
    title: "8-Week Glutes, Core & Conditioning Plan",
    shortTitle: "Glutes, Core & Conditioning",
    description:
      "A printable lower-body base block with glute-focused strength, core work, short finishers, and a deload week.",
    audience: "Lower-body focus",
    pages: 42,
    weeks: "8 weeks",
    workouts: "32 workouts",
    equipment: "Gym or DB swaps",
    pdfPath: "/workout-plans/8-week-glutes-core-conditioning-plan.pdf",
    coverPath: "/workout-plans/8-week-glutes-core-conditioning-plan-cover.png",
    landingTitle:
      "8 Week Glutes Core Conditioning Plan PDF for Lower-Body Training",
    landingDescription:
      "Download an 8 week glutes core conditioning plan PDF built around lower-body strength, trunk work, short finishers, and a printable deload-ready structure you can carry into the gym.",
    searchIntent:
      "Find an 8 week glutes core conditioning plan PDF with a lower-body focus, conditioning work, and a clear deload week.",
    sampleWeek: [
      {
        day: "Day 1",
        focus: "Glute strength",
        workout: "Start the week with hip-dominant lower-body work, glute accessories, and simple note fields for load tracking.",
      },
      {
        day: "Day 2",
        focus: "Core and carries",
        workout: "Use trunk stability work, unilateral accessories, and loaded carries to support the lower-body emphasis.",
      },
      {
        day: "Day 4",
        focus: "Conditioning finisher",
        workout: "Wrap the week with lower-body volume, short conditioning intervals, and readiness notes before the next wave.",
      },
    ],
    whoItFits: [
      "Lifters who want lower-body training with glute emphasis but still want core and conditioning in the same block.",
      "Athletes who like a printable plan with a built-in deload week and enough training variety to stay engaged.",
      "People training in a gym who can also swap to dumbbells when equipment is limited.",
    ],
    whoShouldSkip: [
      "Anyone looking for a pure barbell strength peak with very little conditioning work.",
      "Lifters whose current symptoms make lower-body volume or conditioning finishers hard to recover from.",
    ],
    faqs: [
      {
        question: "Is this plan mostly glute work or full-body training?",
        answer:
          "It is still a full training block, but the lower-body emphasis, glute accessories, and conditioning choices clearly bias the plan toward glutes and trunk work.",
      },
      {
        question: "Does the plan include a deload?",
        answer:
          "Yes. The printable block includes a deliberate deload week so the lower-body volume and finishers do not just accumulate endlessly.",
      },
      {
        question: "Can I use dumbbell swaps if my gym is busy?",
        answer:
          "Yes. The plan was built with gym or dumbbell swaps in mind, so you can keep the lower-body intent even when equipment access changes.",
      },
      {
        question: "Who usually gets the most from this plan?",
        answer:
          "Lifters who want stronger lower-body sessions, visible glute emphasis, and some conditioning without giving up a structured strength block.",
      },
    ],
    relatedLinks: [
      {
        href: "/deload-week-planner",
        label: "Deload week planner",
        description: "See how to think about the lighter week built into this printable block.",
      },
      {
        href: "/cycle-aware-training",
        label: "Cycle-aware training",
        description: "Layer in recovery and cycle context when you later move from paper to the app.",
      },
      {
        href: "/workout-plans",
        label: "All printable workout plans",
        description: "Compare this lower-body block with the rest of the printable training library.",
      },
    ],
  },
];

export function getWorkoutPlan(slug: string): WorkoutPlan | undefined {
  return workoutPlans.find((plan) => plan.slug === slug);
}
