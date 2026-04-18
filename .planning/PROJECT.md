# Sundee Fundee PWA

## What This Is

A cycle-aware fitness tracking PWA for women athletes. Users log workouts, track recovery with cycle-phase scoring, follow structured training programs, and monitor performance metrics like 1RM benchmarks and challenges. Built as a Next.js progressive web app backed by Supabase.

## Core Value

A user can log, track, and follow structured training — all in one place that understands her cycle.

## Current Milestone: v1.0 Programs

**Goal:** Complete the Programs feature so users can enroll in structured training programs, follow prescribed sessions with %1RM-based loading, log performance linked to the workout log, and progress through weeks.

**Target features:**
- Program template data model (Phase → Week → Session → Exercises/Sets with %1RM)
- SQL seed migrations with initial program templates
- Admin builder UI (admin-role-gated) to create/edit templates
- Enroll & browse UI
- Session view with calculated %1RM loads from stored maxes
- Session logging that creates a linked workout entry in the workout log
- Week progression and program position tracking

## Requirements

### Validated

- ✓ User can sign up and log in (email/password, OAuth, magic link) — Phase 0
- ✓ User completes onboarding before accessing the app — Phase 0
- ✓ User can log workouts with exercises, sets, and reps — Phase 0
- ✓ User can track 1RM maxes per exercise — Phase 0
- ✓ User can view recovery score (cycle-phase aware, multi-signal) — Phase 0
- ✓ User can log pain, injuries, and body region issues — Phase 0
- ✓ User can track active challenges and volume goals — Phase 0
- ✓ User can log and score benchmarks — Phase 0
- ✓ User can view analytics (90-day workout volume charts) — Phase 0
- ✓ User can enroll in a training program (basic enrollment tracking) — Phase 0
- ✓ App is installable as a PWA (manifest, service worker, icons) — Phase 0

### Active

- [ ] Program templates have structured phase/week/session/exercise data model
- [ ] Admin can create and edit program templates via builder UI
- [ ] User can browse and enroll in a program
- [ ] User can follow a program session with %1RM-calculated loads
- [ ] User can log actual performance, creating a linked workout entry
- [ ] User can advance weeks and track position in the program

### Out of Scope

- Multiple simultaneous program enrollments — one active program per user is the current constraint
- RPE or fixed-weight load types — %1RM is the only load model for v1.0
- Program progress charts and analytics — deferred to a future milestone
- Social/sharing features — out of scope entirely

## Context

- **Stack:** Next.js 16.2.4 (App Router, non-standard version — read docs in `node_modules/next/dist/docs/`), React 19, Tailwind CSS 4, Supabase (auth + database), TypeScript strict
- **Architecture:** Server Components for all pages, Server Actions for mutations, feature query files per domain, pure domain logic in `src/lib/domain/`
- **Existing programs schema:** `program_templates` table has `phases` and `weeks` JSONB columns (currently empty `[]`); `enrolled_programs` table tracks `user_id`, `template_id`, `current_week`, `is_active` with unique index enforcing one active program per user
- **1RM maxes:** Stored in `maxes` table per exercise. Domain logic in `src/lib/domain/oneRepMax.ts`
- **Known issues:** Open redirect in auth callback, missing middleware mount, no server action tests, no DB-level query aggregation for analytics (see `.planning/codebase/CONCERNS.md`)

## Constraints

- **Stack:** Must use Next.js App Router patterns (Server Components, Server Actions) — no REST API layer
- **Database:** Supabase only — no ORM, queries use `@supabase/supabase-js` client directly
- **Next.js version:** 16.2.4 — breaking changes from training data; read `node_modules/next/dist/docs/` before writing any Next.js code
- **Auth:** Admin role must go through Supabase RLS — no custom auth middleware

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Server Components for all pages | Avoids client-side data fetching complexity; aligns with Next.js App Router best practices | — Pending |
| JSONB for program template structure | Mirrors iOS source data shape; flexible for nested phase/week/session hierarchy | — Pending |
| One active enrollment per user | Simplicity for v1.0; a unique partial index enforces this at DB level | — Pending |
| Program session logs create real workout entries | Unified workout history; users see program workouts alongside regular workouts | — Pending |
| Admin role via `is_admin` flag on profiles | Simplest approach for small team; no complex RBAC needed | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-17 — Milestone v1.0 started*
