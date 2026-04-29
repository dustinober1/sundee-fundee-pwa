export type WorkoutPlan = {
  slug: string;
  appProgramId: string;
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
};

export const workoutPlans: WorkoutPlan[] = [
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
  },
];
