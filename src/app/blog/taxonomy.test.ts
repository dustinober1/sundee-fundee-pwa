import { describe, expect, it } from "vitest";
import type { BlogPost } from "./posts";
import { getRelatedPosts } from "./taxonomy";

function post(overrides: Partial<BlogPost> & Pick<BlogPost, "slug" | "tags">): BlogPost {
  const { slug, tags, ...rest } = overrides;

  return {
    slug,
    title: slug,
    description: slug,
    author: "Sundee Fundee Team",
    authorSlug: "sundee-fundee-team",
    sources: [
      {
        title: "Progression Models in Resistance Training for Healthy Adults",
        url: "https://pubmed.ncbi.nlm.nih.gov/19204579/",
        publisher: "PubMed / ACSM",
      },
    ],
    publishedAt: "2026-05-09",
    readMinutes: 8,
    tags,
    primaryTopic: rest.primaryTopic ?? "recovery-readiness",
    articleIntent: rest.articleIntent ?? "decision-guide",
    interactiveModules: [
      {
        type: "decision-guide",
        placement: "after-intro",
        title: "Decision guide",
        prompt: "What should change today?",
        choices: [
          {
            key: "hold",
            label: "Hold",
            title: "Hold the line",
            description: "Train with a cap.",
            response: "Keep the session useful without forcing a test.",
          },
        ],
      },
    ],
    body: rest.body ?? "Body",
    ...rest,
  };
}

describe("getRelatedPosts", () => {
  it("prioritizes same topic, shared tags, and shared article intent over recency alone", () => {
    const source = post({
      slug: "low-readiness-source",
      tags: ["recovery", "readiness", "sleep"],
      primaryTopic: "recovery-readiness",
      articleIntent: "symptom-audit",
    });
    const recentDifferentTopic = post({
      slug: "recent-different-topic",
      publishedAt: "2026-05-09",
      tags: ["female-athletes", "nutrition"],
      primaryTopic: "women-who-lift",
      articleIntent: "compare-options",
    });
    const sameTopicNoIntent = post({
      slug: "same-topic-no-intent",
      publishedAt: "2026-05-01",
      tags: ["recovery"],
      primaryTopic: "recovery-readiness",
      articleIntent: "compare-options",
    });
    const sameTopicSharedIntent = post({
      slug: "same-topic-shared-intent",
      publishedAt: "2026-04-20",
      tags: ["readiness", "sleep"],
      primaryTopic: "recovery-readiness",
      articleIntent: "symptom-audit",
    });

    const related = getRelatedPosts(
      source,
      [source, recentDifferentTopic, sameTopicNoIntent, sameTopicSharedIntent],
      3,
    );

    expect(related.map((candidate) => candidate.slug)).toEqual([
      "same-topic-shared-intent",
      "same-topic-no-intent",
      "recent-different-topic",
    ]);
  });
});
