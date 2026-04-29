# Sundee Fundee Web

Public marketing, blog, donations, and printable workout-plan downloads for
`sundeefundee.com`.

The native iOS app is the live app product. The website exists for marketing,
SEO content, donation checkout, roadmap/legal pages, and PDF workout plans.

## Quick start

```bash
npm install
npm run dev
```

Local dev runs at `http://localhost:3000`.

Stripe checkout requires `STRIPE_SECRET_KEY` in your environment. Stripe webhook
persistence can optionally use Supabase with `NEXT_PUBLIC_SUPABASE_URL` and
server-only `SUPABASE_SERVICE_ROLE_KEY`. Start from `.env.example` for local
setup.

## Commands

```bash
npm run dev        # local development
npm run lint       # eslint (may include pre-existing Next.js <img> warnings)
npm run typecheck  # tsc --noEmit
npm run build      # Next production build
npm run preview    # OpenNext Cloudflare preview
npm run deploy     # OpenNext Cloudflare deploy
```

## Project shape

```text
src/
  app/
    page.tsx               # marketing home
    blog/                  # blog index, posts, JSON content
    workout-plans/page.tsx # printable PDF plan downloads
    privacy/page.tsx       # privacy policy
    terms/page.tsx         # terms of use
  components/
    AppStoreButtons.tsx
    SiteHeader.tsx
    SiteFooter.tsx
  lib/
    donations/             # Stripe checkout/webhook helpers
    workout-plans.ts       # printable PDF plan catalog
    site.ts                # public site constants and App Store URLs
supabase/
  migrations/              # optional donation webhook persistence tables
public/
  Logo.jpeg
  workout-plans/           # PDF plans and cover images
```

## Content

Blog posts live in `src/app/blog/content/*.json`.

App Store links and shared site metadata live in `src/lib/site.ts`.

## Deployment

The repo still deploys through the existing Cloudflare/OpenNext path so hosting
does not need to change.
