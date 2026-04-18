# Technology Stack

**Analysis Date:** 2026-04-17

## Languages

**Primary:**
- TypeScript 5.x - All source code in `src/`, config files, server actions, API routes

**Secondary:**
- CSS - `src/app/globals.css` (Tailwind v4 theme and base styles)
- SQL - `supabase/migrations/*.sql` (database schema)

## Runtime

**Environment:**
- Node.js 22 (pinned via `.nvmrc`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.2.4 - Full-stack React framework; App Router used throughout `src/app/`
  - Note: This is a non-standard / ahead-of-mainstream version — read `node_modules/next/dist/docs/` before writing any Next.js code
- React 19.2.4 - UI rendering; Server Components and Client Components both used (`"use client"` directive on interactive components)

**Styling:**
- Tailwind CSS 4.x - Utility-first CSS, configured via PostCSS in `postcss.config.mjs`
- `@tailwindcss/postcss` ^4 - PostCSS integration for Tailwind v4 pipeline

**Data Visualization:**
- Recharts 3.8.1 - Chart library; used in `src/app/analytics/AnalyticsCharts.tsx`

**Validation:**
- Zod 4.3.6 - Schema validation; used in form actions and domain logic

## Testing

**Unit / Component:**
- Vitest 4.1.4 - Test runner configured in `vitest.config.ts`
- `@testing-library/react` 16.3.2 - React component testing
- `@testing-library/jest-dom` 6.9.1 - Custom DOM matchers
- `@testing-library/user-event` 14.6.1 - User interaction simulation
- jsdom 29.0.2 - DOM environment for Vitest

**E2E:**
- Playwright 1.59.1 - E2E tests in `tests/e2e/`; config in `playwright.config.ts`
  - Runs against `http://localhost:3000`
  - Chromium only in CI

## Build / Dev Tooling

- ESLint 9 - Linting via `eslint.config.mjs` using `eslint-config-next` (core-web-vitals + typescript presets)
- `@vitejs/plugin-react` 6.0.1 - Vite React plugin (used by Vitest)
- `vite-tsconfig-paths` 6.1.1 - TypeScript path alias resolution in Vitest

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.103.3 - Supabase JS client for auth and data access
- `@supabase/ssr` 0.10.2 - Supabase SSR helpers; used in `src/lib/supabase/server.ts` and `src/lib/supabase/browser.ts`
- `next` 16.2.4 - Core framework
- `react` / `react-dom` 19.2.4 - Core UI library

**UI / UX:**
- `recharts` 3.8.1 - Analytics charts
- Google Fonts via `next/font/google`: Playfair Display (display) + Inter (body), loaded in `src/app/layout.tsx`

## Configuration

**TypeScript:**
- `tsconfig.json` — strict mode, `moduleResolution: "bundler"`, path alias `@/*` → `./src/*`
- Target: ES2017

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous public key
- App gracefully degrades when these are absent (CI / fresh clone support — see `src/proxy.ts` and `src/lib/supabase/dal.ts`)

**Build:**
- `next.config.ts` — minimal config; `allowedDevOrigins: ["127.0.0.1"]`
- `postcss.config.mjs` — Tailwind v4 PostCSS plugin only

## PWA

- `src/app/manifest.ts` — Web app manifest (name, icons, display: standalone, orientation: portrait)
- `public/sw.js` — Service worker registered in production by `src/components/ServiceWorkerRegister.tsx`
- Icons at `public/icons/` (192px, 512px, maskable 512px)

## Platform Requirements

**Development:**
- Node.js 22
- `npm ci` for reproducible installs
- Supabase env vars optional for local boot (app handles missing config gracefully)

**Production:**
- Node.js 22 server runtime (Next.js SSR)
- No detected static export — full server deployment expected
- Supabase env vars required for any authenticated functionality

---

*Stack analysis: 2026-04-17*
