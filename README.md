# Sundee Fundee Web

Public marketing, blog, donations, and PWA training app for
`sundeefundee.com`.

The PWA lives at `/app` and is being rebuilt as the long-term primary product.
It is local-first by default: workout, cycle, recovery, and program data can stay
in browser storage with export/delete controls. Supabase is being reintroduced
as an optional cloud sync backend for users who explicitly opt in with magic-link
auth.

## Quick start

```bash
npm install
npm run dev
```

Local dev runs at `http://localhost:3000`.

Stripe checkout requires `STRIPE_SECRET_KEY` in your environment. Optional
Supabase cloud sync requires `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-only `SUPABASE_SERVICE_ROLE_KEY`.
Start from `.env.example` for local setup.

## Commands

```bash
npm run dev        # local development
npm run lint       # eslint (may include pre-existing Next.js <img> warnings)
npm run typecheck  # tsc --noEmit
npm run build      # Next production build
npm run supabase:types # regenerate Supabase database types
npm run preview    # OpenNext Cloudflare preview
npm run deploy     # OpenNext Cloudflare deploy
npm run verify:app-boundary # enforce site/app boundary contract (incl. local-only boundary docs)

# Parity harness (iOS ↔ web replacement parity)
npm run verify:parity-ledger         # validate docs/parity ledger contract + evidence hygiene
npm run test -- src/lib/pwa/parity-ledger.test.ts
npm run test:e2e -- tests/e2e/parity-app.spec.ts
```

Parity artifacts live in `docs/parity/` and are enforced by `scripts/verify-parity-ledger.mjs` and tests.

## Local-only vs cloud sync

- **Local-only**: no account required and **no cloud writes/uploads**. App data is stored on-device in browser IndexedDB.
- **Cloud sync**: requires explicit opt-in (cloud-sync mode), Supabase env config, and account connection; then sync runs can upload/download data.

Engineering contract & versioned import/export policy:

- `docs/architecture/local-only-data-boundary.md`

## Project shape

```text
src/
  app/
    page.tsx               # marketing home
    blog/                  # blog index, posts, JSON content
    app/page.tsx           # local-first PWA shell
    auth/                  # Supabase magic-link callback/sign-out routes
    privacy/page.tsx       # privacy policy
    terms/page.tsx         # terms of use
  components/
    pwa/                   # PWA experience and auth components
    AppStoreButtons.tsx
    SiteHeader.tsx
    SiteFooter.tsx
  lib/
    pwa/                   # IndexedDB repositories, Supabase clients, sync
    site.ts                # public site constants and App Store URLs
supabase/
  migrations/              # Supabase schema and RLS policies
public/
  Logo.jpeg
```

## Content

Blog posts live in `src/app/blog/content/*.json`.

App Store links and shared site metadata live in `src/lib/site.ts`.

## Supabase sync

The linked Supabase project is `Sundee_Fundee` (`pufzehwzthropjmrrqgt`). Link a
local checkout with:

```bash
supabase link --project-ref pufzehwzthropjmrrqgt
supabase db push --dry-run
supabase db push
npm run supabase:types
```

Cloud sync is optional. Local data is not uploaded until the user selects cloud
sync, signs in, and starts sync from the app. The first implementation uses
bidirectional last-write-wins sync by `updated_at`/`updatedAt`.

## Deployment

The repo still deploys through the existing Cloudflare/OpenNext path so hosting
does not need to change.

The native app remains live until the PWA has production-verified auth, cloud
sync, export/delete, offline logging, and core training parity.
