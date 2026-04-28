# App shell / site boundary (one repo)

This repository intentionally contains **two surfaces**:

- **Public site** (marketing, blog, legal) under `src/app/*` (except the `/app` subtree)
- **PWA app shell** under `src/app/app/*` (the `/app` route)

The goal is to keep the app portable and later wrappable via Capacitor (or similar)
without a repo split.

This contract exists to prevent slow drift where app code starts importing public-site
chrome or where portable domain code starts depending on browser / Next / React.

## Traceability

This boundary directly supports:

- **R002** — enforce a clear site/app separation inside one repo.
- **R004** — keep the app portable so future Capacitor wrapping remains viable.
- **R005** — local-only privacy guarantee depends on a hard local/cloud data boundary.
- **D001** — single repo, explicit boundary rather than separate repos.
- **D002** — portability strategy: domain logic and adapters stay platform-agnostic.
- **D004** — local-only is enforced at the cloud-sync/data-boundary layer.

Related contract:

- `docs/architecture/local-only-data-boundary.md` — defines the local-only guarantee, import/export version policy, and verification commands.

## Ownership map

### Public site (marketing/blog/legal)

- Routes: `src/app/page.tsx`, `src/app/blog/**`, `src/app/privacy/**`, `src/app/terms/**`, …
- Chrome/components: `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`, and other
  non-PWA components.
- Shared site constants: `src/lib/site.ts`

**May depend on:** Next.js/React components, public-site styling, and public-site libs.

### PWA app shell (/app)

- Routes: `src/app/app/**` (including `layout.tsx`, `page.tsx`)
- App UI components: `src/components/pwa/**`
- Portable contracts, repositories, sync: `src/lib/pwa/**`

**Must not depend on:** public-site chrome (SiteHeader/SiteFooter), marketing routes/modules,
`src/lib/site.ts`, or other public-site-only modules.

### Portable domain / calculations (subset of `src/lib/pwa`)

Some files are treated as *portable domain* (pure logic) and must remain free of
browser globals and UI frameworks:

- `src/lib/pwa/schema.ts`
- `src/lib/pwa/calculations.ts`
- `src/lib/pwa/cycle.ts`
- `src/lib/pwa/recovery.ts`
- `src/lib/pwa/recommendations.ts`

**Must not depend on:** `react`, `next/*`, `window`, `document`, route modules, or UI components.

These files may import other portable logic (e.g. zod schemas, date helpers, pure utils).

## Enforced rules (executable)

The executable verifier lives at:

- `scripts/verify-app-boundary.mjs`
- `npm run verify:app-boundary`

### Rule categories

1. **app-no-site-imports**
   - Any file in `src/app/app/**` or `src/components/pwa/**` must not import:
     - `src/components/SiteHeader` / `SiteFooter`
     - `src/lib/site`
     - marketing routes/modules under `src/app/` (except the `src/app/app/` subtree)

2. **portable-no-react-next**
   - Portable domain files listed above must not import React/Next entrypoints:
     - `react`, `react/*`
     - `next/*`

## Rationale (Capacitor-preserving)

A future Capacitor wrapper requires that core app logic (domain, schema, calculations,
cycle/recovery recommendations) remain runnable outside the web runtime.

Therefore, keep those files **pure** and push web-only concerns behind adapters:

- Browser storage: repositories in `src/lib/pwa/*Repository.ts`
- Cloud sync: `src/lib/pwa/cloud-sync.ts`
- UI: `src/components/pwa/**`
- Routes: `src/app/app/**`
