# Sundee Fundee Web

Public marketing, blog, and legal site for `sundeefundee.com`.

The old authenticated workout app, Supabase backend, offline sync layer, and
native Capacitor projects have been removed from this repo. What remains is the
public web surface only.

## Quick start

```bash
npm install
npm run dev
```

Local dev runs at `http://localhost:3000`.

## Commands

```bash
npm run dev        # local development
npm run lint       # eslint
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
    privacy/page.tsx       # privacy policy
    terms/page.tsx         # terms of use
  components/
    AppStoreButtons.tsx
    SiteHeader.tsx
    SiteFooter.tsx
  lib/
    site.ts                # public site constants and App Store URLs
public/
  Logo.jpeg
```

## Content

Blog posts live in `src/app/blog/content/*.json`.

App Store links and shared site metadata live in `src/lib/site.ts`.

## Deployment

The repo still deploys through the existing Cloudflare/OpenNext path so hosting
does not need to change while the site remains simple and public-only.
