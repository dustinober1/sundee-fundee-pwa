import type { Metadata } from "next";
import { AppStoreButtons } from "@/components/AppStoreButtons";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About Us – Sundee Fundee",
  description:
    "How Sundee Fundee started in Culpeper, Virginia and why Dustin and Elizabeth built a recovery-aware training app for women.",
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              About Sundee Fundee
            </p>
            <h1 className="font-display mt-4 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              Built from real Sunday workouts, real conversations, and a better
              idea for women&apos;s training.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Sundee Fundee started with five women meeting every Sunday in
              Culpeper, Virginia to work out together. What began as a weekly
              routine became a tradition built on consistency, friendship, and
              plenty of jokes. Somewhere along the way, Sunday workouts became
              &quot;our Sunday Funday&quot; and eventually that turned into
              Sundee Fundee.
            </p>
            <div className="mt-10 grid gap-4 rounded-[2rem] border border-border bg-surface p-6 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange">
                  Where it started
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Sunday workouts in Culpeper, Virginia.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange">
                  Who built it
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Dustin and Elizabeth, inspired by the women in the group.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange">
                  Why it exists
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  To make training adapt better to recovery, life, and real
                  bodies.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-6 py-20">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                The Origin Story
              </p>
              <div className="mt-6 space-y-6 text-base leading-8 text-muted sm:text-lg">
                <p>
                  As the group kept training together, the conversations moved
                  beyond sets, reps, and what lift was programmed for the day.
                  They talked about recovery, injuries, energy levels, and how
                  training often felt different depending on where they were in
                  their cycle.
                </p>
                <p>
                  Those conversations made one thing obvious: most fitness apps
                  and programs expect the same output from everybody, every day.
                  Real life does not work like that. Bodies change. Recovery
                  changes. Stress changes. Training should respond to that.
                </p>
                <p>
                  That idea became the starting point for Sundee Fundee. Dustin,
                  a developer, saw the opportunity to build something more
                  adaptive. Together with his wife Elizabeth, and inspired by
                  the women in that Sunday group, he started building an app and
                  educational resource focused on smarter, more recovery-aware
                  strength training.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-cream p-8">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                What We Believe
              </p>
              <ul className="mt-6 space-y-5 text-sm leading-7 text-muted">
                <li>
                  Training should work with your body, not against it.
                </li>
                <li>
                  Recovery is not a weakness in the plan. It is part of the
                  plan.
                </li>
                <li>
                  Women deserve better training tools and better educational
                  material.
                </li>
                <li>
                  Real progress comes from consistency, awareness, and adapting
                  when life changes.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
                Why We Built It
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold text-navy sm:text-5xl">
                A better training tool for the realities women actually face.
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted">
                Sundee Fundee exists to help women train with more awareness and
                more confidence. That includes education around recovery,
                cycle-informed training, injury adaptation, and the everyday
                factors that can make a static workout plan feel wrong.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Recovery-aware
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Programming should reflect how recovered you actually are, not
                  just what day it is on the calendar.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Cycle-informed
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Women&apos;s training deserves tools that acknowledge energy,
                  symptoms, and performance changes across the cycle.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-display text-2xl font-semibold text-navy">
                  Community-rooted
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  This did not start in a boardroom. It started in a real
                  workout group with real conversations and real needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-navy px-6 py-20 text-cream">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
              From Sunday Funday to Sundee Fundee
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
              What started as a weekly workout became a platform for smarter
              training.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-cream/80">
              Sundee Fundee was built from real community, real curiosity, and
              the belief that strength training should adapt to real life. The
              app is the product of that story.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <AppStoreButtons compact={false} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
