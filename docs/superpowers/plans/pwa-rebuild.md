# Sundee Fundee PWA Rebuild Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Keep checkboxes accurate as phases land.

## Goal

Build the PWA as the long-term primary product inside `sundee-fundee-web`, using the iOS app as the behavior reference. Keep the marketing site intact, add the app at `/app`, support privacy-first local-only use, and keep monetization donations-only.

## Defaults

- No subscriptions, premium gates, or paid tiers.
- Donations use Stripe checkout and do not unlock features.
- Local-only mode is complete and does not require an account.
- Supabase sync is optional and only used after explicit opt-in.
- IndexedDB is the source of truth for local-only users.
- Supabase is the optional cloud backup/sync target.
- AI is optional and requires explicit consent before sending selected data to a server.
- Capacitor/App Store packaging is post-MVP.

## Phase 0: Product And Architecture Groundwork

- [x] Create this working implementation plan.
- [x] Define route map: public marketing stays public, app lives under `/app`, auth under `/auth`, donations under `/donate`, API under `/api`.
- [x] Define two data modes: `local-only` and `cloud-sync`.
- [x] Define MVP acceptance: local-only user can install the app, log workouts offline, use cycle-aware recommendations, view recovery/program data, export data, and delete local data.
- [x] Document deferred scope: Capacitor, wearable APIs, HealthKit, widgets, AI coach, native app stores, and imported JSON migration.

## Phase 1: PWA App Shell

- [x] Add `/app` route with app layout, mobile navigation, desktop navigation, onboarding, and privacy-mode-aware status.
- [x] Add PWA manifest, service worker registration, offline page, static asset cache, and app shell cache.
- [x] Preserve existing public marketing pages and SEO routes.

## Phase 2: Local-First Data Layer

- [x] Add `dexie`, `zod`, and `vitest`.
- [x] Add IndexedDB stores for workouts, sets, exercises, cycle entries, recovery records, programs, injuries, preferences, donation metadata, and sync mutations.
- [x] Add shared TypeScript entity types and Zod validators.
- [x] Add local repository helpers for create/read/export/import/delete.
- [x] Add first local persistence tests.

## Phase 3: Optional Supabase Cloud Sync

- [x] Add Supabase client dependencies and environment placeholders.
- [x] Add auth route scaffolding for magic-link sign in/out.
- [x] Add initial Supabase migration with RLS-protected user tables.
- [x] Implement first bidirectional sync worker with last-write-wins conflict handling.
- [ ] Add policy tests against a local Supabase test database.

## Phase 4: Core Training MVP

- [x] Port first calculation utilities from iOS behavior: Epley 1RM, unit conversion, and plate math.
- [x] Build local lift tracking with best estimated 1RM.
- [x] Build first local workout logger path for one exercise/set.
- [x] Build first cycle profile path from period start date.
- [x] Build first cycle-aware recommendation card from phase status.
- [x] Build recovery score inputs and daily recovery score.
- [x] Build basic program enrollment and today view.

## Phase 5: Donations-Only Support Model

- [x] Keep all core features free.
- [x] Keep Stripe donation checkout.
- [x] Add donation API route under `/api/donations/checkout`.
- [x] Add donation cancel page and supporter thank-you path.
- [x] Persist donation records after Supabase service-role storage is configured.
- [x] Add webhook idempotency storage.

## Phase 6: Optional AI And Intelligence

- [x] Add deterministic non-AI recommendations first.
- [ ] Add AI workout generation only as an explicit opt-in cloud action.
- [ ] Show exactly what context will be sent before AI generation.
- [ ] Keep local-only users' full data store local.

## Phase 7: Production Hardening

- [x] Update privacy policy for local-only storage, optional Supabase sync, Stripe donations, export, and deletion.
- [ ] Add observability for auth errors, sync failures, donation webhook failures, AI failures, and PWA install funnel.
- [ ] Add E2E smoke tests for local-only onboarding, offline workout, export/delete, cloud sync opt-in, and donation flow.
- [ ] Run accessibility, mobile viewport, and installability checks.

## Phase 8: Post-MVP Distribution

- [ ] Add opt-in Web Push reminders.
- [ ] Add JSON import for real exported user data when available.
- [ ] Add Strava/Oura first if third-party integrations are needed.
- [ ] Add Capacitor wrapper after the PWA is stable.
- [ ] Prepare app store screenshots, privacy labels, review notes, and native shell QA.
