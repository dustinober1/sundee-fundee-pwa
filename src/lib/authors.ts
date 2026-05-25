export type AuthorProfile = {
  slug: string;
  name: string;
  role: string;
  description: string;
  shortBio: string;
  fullBio: [string, string];
  expertise: string[];
  methodologyHref: "/methodology";
  schemaType: "Organization";
};

export const authors: AuthorProfile[] = [
  {
    slug: "sundee-fundee-team",
    name: "Sundee Fundee Team",
    role: "Editorial Team",
    description:
      "Training writers focused on recovery-aware strength programming, pain-aware lifting choices, cycle-context education, and practical app workflows.",
    shortBio:
      "The Sundee Fundee Team writes the core training explainers, product education, and implementation guides across the site.",
    fullBio: [
      "The Sundee Fundee Team writes and updates the core education library for women who lift, lifters adjusting around pain, and athletes who want recovery signals to shape the next session. The team centers each article on a real gym decision instead of abstract physiology alone.",
      "Most bylined articles start from the same question: what should a lifter do today when recovery, pain, cycle symptoms, or schedule pressure changes the cost of the planned workout? That lens keeps the writing grounded in training decisions the iPhone app is built to support.",
    ],
    expertise: [
      "Recovery-aware strength programming",
      "Pain-aware lift modification",
      "Cycle-context education for women who lift",
      "Practical logging and workout decision workflows",
    ],
    methodologyHref: "/methodology",
    schemaType: "Organization",
  },
  {
    slug: "sundee-fundee-editorial-review",
    name: "Sundee Fundee Editorial Review",
    role: "Editorial Review",
    description:
      "Internal review function for health-adjacent articles that touch recovery, cycle symptoms, injuries, postpartum return, or wearable health data.",
    shortBio:
      "Sundee Fundee Editorial Review checks that health-adjacent articles stay inside the site's training scope, cite their sources, and state medical boundaries clearly.",
    fullBio: [
      "Sundee Fundee Editorial Review audits articles that could be mistaken for medical guidance. The review pass checks whether the article is explicit about training scope, conservative about symptom escalation, and clear about when a clinician belongs in the decision loop.",
      "The review role also verifies that each health-adjacent article cites the sources that informed the piece and keeps recommendations tied to exercise selection, load, volume, and workout timing rather than diagnosis or treatment.",
    ],
    expertise: [
      "Health-adjacent content boundaries",
      "Source-based editorial review",
      "Wearable-data interpretation limits",
      "Training guidance escalation thresholds",
    ],
    methodologyHref: "/methodology",
    schemaType: "Organization",
  },
];

const authorsBySlug = new Map(authors.map((author) => [author.slug, author]));

export function getAuthor(slug: string): AuthorProfile | undefined {
  return authorsBySlug.get(slug);
}

export function getAuthorUrl(slug: string): `/authors/${string}` {
  return `/authors/${slug}`;
}
