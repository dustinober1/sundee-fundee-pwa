export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  tags: string[];
  body: string;
};

export const posts: BlogPost[] = [
  {
    slug: "why-recovery-beats-the-calendar",
    title: "Why recovery beats the calendar",
    description:
      "Fixed splits ignore the one variable that matters most — how recovered you actually are when you walk into the gym.",
    author: "Sundee Fundee Team",
    publishedAt: "2026-04-02",
    readMinutes: 6,
    tags: ["recovery", "programming"],
    body: `Most training plans are built around the week. Push day on Monday,
pull on Tuesday, legs on Wednesday — a tidy grid that assumes every
Monday feels the same. It doesn't. Last week you slept eight hours a
night and hit a PR. This week your kid has the flu, you've slept five,
and the barbell feels heavier than it should.

## The cost of ignoring readiness

When you train hard on a depleted system, three things happen. Your
session quality drops — bar speed slows, technique drifts, and the
intended stimulus lands wrong. Your recovery debt compounds, because
you're adding stress to a body that hasn't cleared last week's. And
your injury risk climbs: the literature on acute-to-chronic workload
ratios is remarkably consistent here. Spikes predict strains.

The calendar doesn't know any of this. A readiness check does.

## What "recovery-aware" actually means

It doesn't mean skipping the gym every time you're tired. It means
reading three or four inputs — sleep, pain, HRV if you've got it, a
subjective readiness score — and *adjusting* the session you were
going to do. Heavy day on a rough morning becomes a technique day.
A deload lands a week earlier than planned. Volume shifts from
compound lifts to accessories that don't tax your CNS.

The program still moves forward. You just stop punishing yourself
for a Tuesday that doesn't want to cooperate.

## The trade you're making

A recovery-driven approach costs you predictability. You can't say
"Thursday is squat day" with the same confidence you used to. In
exchange, you get consistency — fewer missed weeks, fewer tweaks,
fewer stretches where the numbers on the bar stop moving.

Most lifters we talk to find the trade worth it within a month.
Especially the ones over thirty-five.`,
  },
  {
    slug: "training-around-injuries-without-losing-progress",
    title: "Training around injuries without losing progress",
    description:
      "An injury isn't a pause button. With the right substitutions, you can keep building while the irritated tissue settles.",
    author: "Sundee Fundee Team",
    publishedAt: "2026-04-15",
    readMinutes: 7,
    tags: ["injuries", "adaptation"],
    body: `The instinct when something hurts is to stop everything. Rest the
whole body, wait for the pain to fade, and then rebuild from scratch
when it does. It's a bad trade. You lose strength in places that
were never the problem, and the irritated tissue doesn't actually
heal any faster when the rest of you gets detrained around it.

## Separate the injured region from the training plan

Most injuries are local. A cranky shoulder doesn't mean you can't
squat. A strained hamstring doesn't mean you can't press. The first
move is to draw a clean line: which movement patterns provoke
symptoms, and which ones don't? Usually fewer than you'd guess.

From there, the plan writes itself. Keep training everything that
doesn't flare the injured tissue. Substitute for the movements that
do. A barbell bench press with a forward shoulder might become a
neutral-grip dumbbell press or a floor press — same pattern, less
end-range stress. A back squat that aggravates a disc might become
a belt squat or a leg press for a few weeks.

## Pain is a signal, not a verdict

Not every twinge means stop. The useful question is whether the
discomfort is warning you that something is getting worse, or just
reporting that something still isn't right. A 2-out-of-10 ache that
stays at 2 through the set and fades within an hour is information.
A 4 that climbs to a 6 mid-session, and lingers the next day, is a
veto.

Log it either way. Patterns show up fast once you have a few weeks
of data. You'll see which movements you can keep, which ones need a
substitute, and — usually within six to ten weeks — which ones are
ready to come back.

## What progress looks like during a flare-up

It won't be linear, and it won't always be PRs. It'll be: the
exercises you *can* do keep advancing. Your conditioning stays
where it was. You don't lose the habit of training four or five
times a week. And when the injury settles, you're not starting
over — you're picking up where you left off, on a body that never
stopped being strong everywhere else.

That's the whole game. Keep the stimulus going where it's safe,
get out of the way where it isn't.`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
