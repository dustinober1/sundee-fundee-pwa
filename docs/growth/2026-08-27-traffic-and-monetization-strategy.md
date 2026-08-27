# Traffic and Monetization Strategy

Date: 2026-08-27
Scope: `sundeefundee.com` marketing site (the iOS app is out of scope).

## Summary

The content engine is strong and the SEO plumbing is complete. The gap is
everything downstream of the pageview: there is no email capture, the money
paths are not instrumented, and there is nothing to sell. Display ads are the
weakest of the available revenue options at current scale; contextual affiliate
placements and a premium printable tier fit better and cost the brand less.

## Baseline (read from the repo, not estimated)

- 119 blog posts under `src/app/blog/content/`, median 1,935 words, published
  2026-04-02 through 2026-08-26. 11 posts are under 1,200 words.
- 28 SEO landing pages in `src/lib/seo-pages.ts`, 5 topic hubs, 5 training
  tools, 6 printable PDF plans, plus author pages.
- Complete SEO surface: `sitemap.ts`, `rss.xml`, `robots.ts`, eight JSON-LD
  builders in `src/lib/seo.ts`, and two validation scripts under `scripts/`.
- Search Console opportunity scoring already exists in
  `src/lib/search-console-opportunities.ts`.
- Stripe Checkout, a signature-verified webhook, and Supabase persistence are
  live for donations.

## Gaps

1. **No email capture.** No newsletter, subscribe, or list-building code exists
   anywhere in `src/`. All six PDFs download anonymously.
2. **No in-body images.** 0 of 119 posts contain an in-body image, which closes
   off Google Images and Discover.
3. **No `max-image-preview:large`.** Absent from both `src/app/robots.ts` and
   the root layout metadata. Required for Google Discover eligibility.
4. **E-E-A-T is inconsistent.** 61 of 119 posts carry `sources`; 59 carry a
   named reviewer. Health content is held to a higher bar.
5. **Money paths are not instrumented.** `track()` fires on App Store clicks
   (`AppStoreButtons.tsx`, `SiteHeader.tsx`) and the science simulator, but not
   on PDF downloads, tool completions, or donate starts.

## Traffic plays, by return on effort

| Play | Effort | Notes |
| --- | --- | --- |
| Email capture under the PDFs, tools, and blog CTA | ~1 day | Never gate the direct download; gating costs the SEO value of those pages. Reuse the existing Supabase client. |
| `max-image-preview:large` + hero `ImageObject` per post | ~1 hour | Cheapest win on the list. |
| Funnel instrumentation | ~4 hours | Prerequisite for every other decision. |
| Figures/diagrams in posts | ongoing | Retrofit the top 20 posts by impressions first, not all 119. |
| Embeddable tools at `/embed/[tool]` | ~2 days | Calculators are the strongest backlink magnet available; the tools already exist. |
| E-E-A-T backfill + a `metadata-quality` rule | ~3 days | Add the validation rule so new posts cannot regress. |
| Programmatic `/exercises/[slug]` pages | ~1 week | Reuses the registry pattern from `seo-pages.ts` / `training-tools.ts`. Do this after the email list exists. |

## Ads

The "no ads" promise in `src/app/donate/page.tsx` and the Stripe line item in
`src/lib/donations/checkout.ts` is scoped to the app, not the website. Running
site ads is therefore not a literal broken promise, but that copy should change
in the same commit if display ads ship.

Ranked by fit:

1. **Contextual affiliate** — strong fit. Existing posts cover creatine,
   caffeine, Apple Watch, Garmin, kettlebells, and dumbbells.
2. **House ads for own products** — same slot, no third party, no privacy cost.
3. **Single direct sponsor** — viable once analytics numbers can be quoted.
4. **Newsletter sponsorship** — least intrusive ad format; needs ~2,000+ subs.
5. **Programmatic display** — hold. Thin RPM at current scale, network session
   floors sit well above current traffic (verify current thresholds directly;
   they change), third-party scripts threaten Core Web Vitals on a static-first
   Cloudflare deployment, and every ad click competes with the App Store link,
   a PDF download, or an email signup.

If display ships anyway, the non-intrusive shape is: one in-content unit after
the third heading, one desktop sidebar unit below the existing app card, nothing
above the fold, nothing sticky, no interstitials, lazy-loaded with reserved
height so CLS stays flat.

## Premium content

Keep all six current PDFs free — they are SEO assets and list-builders. Premium
sits above them.

| Tier | Product | Price | Build |
| --- | --- | --- | --- |
| Free | The six printable plans, all articles, all calculators | $0 | Done |
| Flagship | 12-week cycle-aware periodized block: PDF, phase deload logic, printable log book, spreadsheet tracker | $19–29 | ~2 weeks |
| Bundle | All six free plans as one print-ready book with log and progression charts | $9–14 | ~3 days |
| Coach pack | Editable client templates, intake forms, cycle-aware programming worksheets | $39–59 | ~1 week |

Codebase fit:

- `handleDonationCheckout` in `src/lib/donations/checkout.ts` generalizes to a
  product checkout; the Stripe session shape is nearly identical.
- `src/app/api/stripe/webhook/route.ts` already verifies signatures and writes
  to Supabase. Fulfilment becomes: insert a purchase row, issue a signed
  download URL.
- `src/lib/workout-plans.ts` is a typed registry with landing pages, FAQs, and
  schema. A `premium` flag plus a price field reuses all of it, so the paid
  products get the same SEO treatment as the free ones.

Avoid: a subscription tier alongside a free app, paywalling existing ranked
articles, and launching a product before the email list exists.

## Sequence

1. **Week 1 — foundation.** Funnel instrumentation, `max-image-preview:large`,
   email capture under PDFs, tools, and the blog CTA.
2. **Weeks 2–3 — leverage.** Generalize Stripe checkout, ship the $9–14 bundle
   as a pricing test, add affiliate blocks to supplement and wearable articles.
3. **Weeks 4–6 — reach.** Embeddable tools, figures in the top 20 posts, E-E-A-T
   backfill with a validation rule.
4. **Weeks 7–12 — scale.** Flagship program launched to the list, programmatic
   exercise pages, revisit display ads only if traffic clears a network floor.

## Open decisions

1. **Display ads on the site at all?** Recommendation: hold. Affiliate and house
   ads use the same placements and earn more per visitor at this scale.
2. **A paid product alongside a free app?** Recommendation: yes, but list first.
   The bundle is the cheapest way to test demand before investing two weeks in
   the flagship.

## Caveats

Traffic-dependent figures (RPM ranges, ad network session floors, conversion
rates) are industry ballparks, not measurements from this site. No Search
Console or Vercel Analytics data was available when this was written, which is
why funnel instrumentation is sequenced first.
