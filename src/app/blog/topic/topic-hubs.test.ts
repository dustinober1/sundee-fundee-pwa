import { describe, expect, it } from "vitest";
import { BLOG_TOPICS } from "../taxonomy";
import { getTopicHub, topicHubs } from "../../../lib/topic-hubs";
import { getTrainingTool, trainingTools } from "../../../lib/training-tools";

function wordCount(value: string) {
  return value.split(/\s+/).filter(Boolean).length;
}

describe("topic hubs", () => {
  it("defines substantial hub content for every blog topic", () => {
    expect(topicHubs).toHaveLength(BLOG_TOPICS.length);

    for (const topic of BLOG_TOPICS) {
      const hub = getTopicHub(topic.slug);
      const totalWords = wordCount(
        [hub.intro, ...hub.sections.flatMap((section) => section.body)].join(" "),
      );

      expect(hub.title).toContain(topic.label);
      expect(hub.metaTitle.length).toBeGreaterThan(20);
      expect(hub.metaDescription.length).toBeGreaterThan(50);
      expect(totalWords, topic.slug).toBeGreaterThanOrEqual(800);
      expect(wordCount(hub.intro)).toBeGreaterThanOrEqual(140);
      expect(hub.startHereLinks).toHaveLength(3);
      expect(hub.sections.length).toBeGreaterThanOrEqual(4);
      expect(hub.relatedSeoPages.length).toBeGreaterThanOrEqual(2);
      expect(hub.relatedTools.length).toBeGreaterThanOrEqual(1);
      expect(hub.productCta.href).toBe(topic.productHref);
      expect(hub.productCta.title.length).toBeGreaterThan(10);
      expect(hub.productCta.body.length).toBeGreaterThan(20);

      for (const section of hub.sections) {
        expect(section.body).toHaveLength(2);
      }

      for (const link of [
        ...hub.startHereLinks,
        ...hub.relatedSeoPages,
        ...hub.relatedTools,
      ]) {
        expect(link.href.startsWith("/")).toBe(true);
        expect(link.label.length).toBeGreaterThan(3);
        expect(link.description.length).toBeGreaterThan(10);
      }

      for (const toolLink of hub.relatedTools) {
        const toolSlug = toolLink.href.replace("/tools/", "");
        const tool = getTrainingTool(toolSlug);

        expect(tool.href).toBe(toolLink.href);
      }
    }
  });

  it("only links to registered training tools from topic hubs", () => {
    const registeredToolHrefs = new Set<string>(
      trainingTools.map((tool) => tool.href),
    );

    for (const hub of topicHubs) {
      for (const toolLink of hub.relatedTools) {
        expect(registeredToolHrefs.has(toolLink.href), toolLink.href).toBe(true);
      }
    }
  });
});
