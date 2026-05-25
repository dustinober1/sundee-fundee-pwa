# Search Console Workflow

Run this workflow once per month using the latest Google Search Console export
for pages and queries.

## 1. Export performance data

1. Open Google Search Console Performance results.
2. Filter to the last 28 days.
3. Export rows with page, query, clicks, impressions, CTR, and position.
4. Keep CTR in the export's percentage form for repo scoring, such as `0.39`
   for `0.39%`. Only mark rows as fraction-form if you explicitly normalize CTR
   to values such as `0.0039`.

## 2. Identify high-priority opportunities

Treat a row as high priority when all of the following are true:

- impressions are at least 1000
- CTR is below 1% (`ctr < 1` in export percentage form)
- average position is 12 or better

These rows already have visibility. The job is to improve clickthrough before
trying to create more impressions.

## 3. Turn each high-priority row into repo work

For each high-priority row:

1. Rewrite the page title, meta description, and intro so the query intent is
   explicit earlier in the page.
2. Refresh the intro copy to better match the search query and the likely user
   decision they are making.
3. Add internal links from related pages and blog posts that can pass stronger
   context to the target URL.
4. Add a missing section when the query suggests unanswered intent on the page.
5. Deploy the change, then submit the updated URL through Google Search Console
   URL Inspection to request re-indexing.

Medium-priority rows are usually internal-link and content-refresh work. Low
priority rows stay on the monthly watch list unless they change tier. Medium
priority means impressions are at least 500, CTR is below 2% (`ctr < 2` in
export percentage form), and average position is 20 or better.

## 4. Required verification before deploy

Run all of the following commands before shipping SEO updates:

```bash
npm run test:metadata
npm run test:seo
npm run build
```
