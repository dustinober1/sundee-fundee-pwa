import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "FAQ – Sundee Fundee",
  description:
    "Answers to common questions about Sundee Fundee — Apple Health sync, Garmin, data export, cycle tracking, subscriptions, and more.",
  alternates: {
    canonical: "/faq",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

type FaqSection = {
  title: string;
  items: FaqItem[];
};

const faqSections: FaqSection[] = [
  {
    title: "The App",
    items: [
      {
        question: "How do I get started?",
        answer:
          "Download the app from the App Store, create a free account, and complete the onboarding questionnaire. The questionnaire takes about two minutes and covers your training history, current schedule, and any active injuries. Your first session is ready immediately after.",
      },
      {
        question: "Is there a free trial?",
        answer:
          "Yes. Sundee Fundee includes a free trial so you can experience the full app before committing to a subscription. No credit card is required to start.",
      },
      {
        question: "What devices are supported?",
        answer:
          "Sundee Fundee is currently available for iPhone running iOS 16 or later. An Apple Watch companion app and Android version are on the roadmap.",
      },
      {
        question: "Can I use the app without a wearable?",
        answer:
          "Yes. If you do not have a wearable, the readiness score uses your subjective check-in responses along with any Apple Health data your phone passively captures (steps, sleep from bedtime detection). The score is less precise without HRV data, but it still adapts your programming meaningfully.",
      },
    ],
  },
  {
    title: "Health & Data",
    items: [
      {
        question: "Does it sync with Apple Health?",
        answer:
          "Yes. Sundee Fundee reads HRV, resting heart rate, sleep stages, and active energy directly from Apple Health. You control which data categories are shared via the standard Health permissions prompt — the app only reads what you grant access to.",
      },
      {
        question: "Does it work with Garmin?",
        answer:
          "Garmin Connect integration is currently in active development. Once live, the app will be able to pull HRV and recovery metrics directly from Garmin wearables. For now, Garmin users can sync data to Apple Health via the Garmin Connect app and the app will read it from there.",
      },
      {
        question: "Can I export my lifting data?",
        answer:
          "Full CSV data export is on the roadmap. It is not available in the current version. If data portability is important to you, send us a note — user interest is a direct input into what we prioritize.",
      },
      {
        question: "Is my data stored on-device or in the cloud?",
        answer:
          "Training logs and readiness data are synced to a secure cloud backend to support cross-device access and backup. Health data (HRV, sleep, heart rate) is read from Apple Health on your device and processed locally — it is not sent to our servers. See the Privacy Policy for full details.",
      },
    ],
  },
  {
    title: "Cycle Tracking",
    items: [
      {
        question: "Is cycle tracking required to use the app?",
        answer:
          "No. Cycle tracking is entirely optional. Athletes who prefer not to use it train on the readiness-only model, which adapts intensity and volume to your recovery state without any cycle data. Cycle-phase adaptation is an additive layer for those who want it.",
      },
      {
        question: "How is my cycle data stored?",
        answer:
          "Cycle data is stored encrypted on your device and in your iCloud account. It is not shared with Sundee Fundee servers. The app reads cycle phase information locally and uses it to adjust programming calculations on-device.",
      },
      {
        question: "What if my cycle is irregular?",
        answer:
          "The app accommodates irregular cycles. You can log cycle start dates manually, and the model applies phase adaptations based on your tracked history rather than assuming a fixed 28-day cycle. If cycle length varies significantly, the readiness score carries more weight than phase-based adjustments.",
      },
      {
        question: "Can men use Sundee Fundee?",
        answer:
          "Absolutely. The cycle-phase layer simply remains inactive. All other features — readiness scoring, injury routing, progressive overload logic, and rucking programming — apply equally regardless of whether cycle tracking is used.",
      },
    ],
  },
];

function FaqAccordion({ item }: { item: FaqItem }) {
  return (
    <details className="group border-t border-border py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="font-display font-semibold text-navy">
          {item.question}
        </span>
        <span className="shrink-0 text-orange transition-transform group-open:rotate-90">
          ▶
        </span>
      </summary>
      <p className="mt-3 leading-relaxed text-muted">{item.answer}</p>
    </details>
  );
}

export default function FaqPage() {
  return (
    <>
      <SiteHeader showHomeLink showDownloadButtons />

      <main className="flex flex-1 flex-col">
        <section className="px-6 pt-20 pb-12">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-orange">
              FAQ
            </p>
            <h1 className="font-display mt-4 text-5xl font-bold leading-[1.05] text-navy sm:text-6xl">
              Common questions
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Everything you need to know about getting started, connecting your
              devices, and how your data is handled.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl space-y-12">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-2xl font-bold text-navy">
                  {section.title}
                </h2>
                <div className="mt-2">
                  {section.items.map((item) => (
                    <FaqAccordion key={item.question} item={item} />
                  ))}
                  <div className="border-t border-border" />
                </div>
              </div>
            ))}

            <p className="text-sm text-muted">
              Still have a question?{" "}
              <a
                href="mailto:support@sundeefundee.com"
                className="font-medium text-orange underline underline-offset-2 hover:opacity-70"
              >
                Email support
              </a>{" "}
              and we will get back to you.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
