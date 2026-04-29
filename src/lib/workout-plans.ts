export type WorkoutPlan = {
  slug: string;
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
    title: "The First Margarita Strength Program",
    shortTitle: "The First Margarita",
    description:
      "An advanced 8-week strength block from the Sundee Fundee app, with weekly overviews and printable gym log pages for every session.",
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
    title: "4-Week Beginner Strength Plan",
    shortTitle: "Beginner Strength",
    description:
      "A confidence-building full-body block for newer lifters, with different workouts every week and printable set logs.",
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
    title: "6-Week Dumbbell Strength Plan",
    shortTitle: "Dumbbell Strength",
    description:
      "A home-or-gym dumbbell block with lower, upper, unilateral, and full-body density days that change week by week.",
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
    title: "8-Week Glutes, Core & Conditioning Plan",
    shortTitle: "Glutes, Core & Conditioning",
    description:
      "A lower-body-emphasis block with glute-focused strength, core work, short finishers, substitutions, and a deload week.",
    audience: "Lower-body focus",
    pages: 42,
    weeks: "8 weeks",
    workouts: "32 workouts",
    equipment: "Gym or DB swaps",
    pdfPath: "/workout-plans/8-week-glutes-core-conditioning-plan.pdf",
    coverPath: "/workout-plans/8-week-glutes-core-conditioning-plan-cover.png",
  },
];
