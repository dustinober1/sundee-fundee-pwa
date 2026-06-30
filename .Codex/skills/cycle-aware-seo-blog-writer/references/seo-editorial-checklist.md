# SEO Editorial Checklist

Use this checklist while choosing the topic and before returning the final article.

## Topic Selection

- Pick one primary long-tail keyword with clear intent.
- Avoid broad head terms unless the user explicitly requests them.
- Reject ideas that are too similar to the latest 20 posts in title pattern, thesis, body framing, examples, or search intent.
- Prefer topics that connect a practical outcome to a concrete audience problem.
- For cycle-focused posts, keep the angle specific: training, recovery, nutrition, symptom management, scheduling, or performance expectations.
- Favor ideas that can naturally cross-reference 3–5 existing Sundee Fundee articles or product pages without turning the article into a link roundup.

## Research Standard

- Verify time-sensitive or factual claims with current sources.
- Prefer primary or expert-led sources for health, training, and physiology claims.
- Use at least 3 external sources for articles involving health, menstrual cycle physiology, injury, nutrition, supplements, pregnancy, postpartum, perimenopause, medication, illness, or environmental safety.
- Use at least 1 external source for lower-risk programming articles when a factual claim needs support.
- Prefer peer-reviewed papers, consensus statements, government health pages, medical institutions, professional organizations, or established sports-nutrition bodies.
- Do not use competitor SEO posts as evidence for claims.
- Do not invent studies, percentages, or expert quotes.
- If a useful claim cannot be verified, either omit it or mark it for follow-up.

## Internal Links and External References

- Include 3–5 internal links when the topic supports them.
- Internal links should appear naturally in context, with descriptive anchor text.
- Verify each internal `/blog/<slug>` link maps to an existing file in `src/app/blog/content/`.
- Match the current JSON schema for `sources` when nearby articles include one.
- Each external source should have a clear reason to exist: evidence, safety guidance, consensus, or clinical context.
- Mention external source names in the body only when attribution improves reader trust or claim clarity.

## Keyword Use

- Put the primary keyword in the title, description, and naturally in the body.
- Use related phrases semantically rather than repeating the exact keyword.
- Keep keyword usage natural. If the phrase feels forced, rewrite the sentence.
- Align section headings with the reader's likely follow-up questions.

## JSON Output

- Match the repo schema exactly.
- Keep `body` as a single JSON string with embedded Markdown headings and paragraph breaks.
- Include a `sources` array when the current article schema supports it and the article relies on external references.
- Keep the filename as `<slug>.json`.
- Match neighboring `tags`, `primaryTopic`, and author conventions.

## Differentiation Check

- State in one sentence how the new article is different from each overlapping recent post.
- Change framing, audience, examples, or level of specificity when overlap is unavoidable.
- Do not reuse the same title formula repeatedly.
- Add at least one new insight, synthesis, or evidence-backed takeaway that recent posts did not cover.
- Reject topics that only rename an existing train/modify/stop decision guide without introducing a meaningfully different user problem.
