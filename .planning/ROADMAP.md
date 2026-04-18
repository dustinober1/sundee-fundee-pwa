# Roadmap: Sundee Fundee PWA — v1.0 Programs

**Milestone:** v1.0 Programs
**Created:** 2026-04-17
**Status:** In progress

## Phases

- [ ] **Phase 1: Data Model & Schema** - Define the JSONB structure, add `is_admin` flag, and add the workout-session linkage column
- [ ] **Phase 2: SQL Seed Data** - Populate initial program templates via migration so the app has real content to work with
- [ ] **Phase 3: Admin Builder UI** - Gate-controlled UI for admins to create and edit program templates
- [ ] **Phase 4: Enrollment Browse UI** - Users can browse available programs, inspect structure, and enroll
- [ ] **Phase 5: Session View** - Users can view a session's prescribed exercises with %1RM-calculated target weights
- [ ] **Phase 6: Session Logging** - Users can start, log, and complete a session — creating a linked workout entry
- [ ] **Phase 7: Week Progression** - Users can advance weeks, track their position, and leave a program

## Phase Details

### Phase 1: Data Model & Schema
**Goal**: The database correctly stores a fully structured program template (phases, weeks, sessions, exercises with %1RM) and supports the `is_admin` role and workout-session linkage
**Depends on**: Nothing (first phase)
**Requirements**: TMPL-01, TMPL-02, ADMN-01
**Success Criteria** (what must be TRUE):
  1. A program template's `phases` JSONB column stores named phases with start/end week bounds and nested weekly sessions containing prescribed exercises (exercise_id, sets, reps, %1RM percentage)
  2. A user profile row can have `is_admin = true` and Supabase RLS policies enforce that only admin users can write to `program_templates`
  3. A `session_workout_id` column (or equivalent) exists on `enrolled_program_sessions` (or the linkage table) so a completed session can reference the workout entry it created
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Write migration 0005_programs_schema.sql (is_admin, JSONB constraints, enrolled_program_sessions)
- [ ] 01-02-PLAN.md — Push migration to Supabase and verify schema changes are live

### Phase 2: SQL Seed Data
**Goal**: At least one real program template exists in the database, seeded via migration, so subsequent phases have content to display and interact with
**Depends on**: Phase 1
**Requirements**: TMPL-06
**Success Criteria** (what must be TRUE):
  1. Running `supabase db reset` (or applying the seed migration) results in at least one fully populated program template row with phases, weeks, and prescribed exercises
  2. The seeded program's JSONB structure is valid against the schema defined in Phase 1 — no empty arrays in phases or sessions
**Plans**: TBD

### Phase 3: Admin Builder UI
**Goal**: An admin user can create and fully define a program template — including phases, week session prescriptions, and individual prescribed exercises — through the application UI
**Depends on**: Phase 1, Phase 2
**Requirements**: ADMN-02, ADMN-03, ADMN-04, ADMN-05
**Success Criteria** (what must be TRUE):
  1. A user with `is_admin = true` can access the admin builder; a non-admin user is redirected or shown an access-denied state
  2. Admin can create a new program template with a name, description, duration in weeks, and sessions per week
  3. Admin can add phases to the template by specifying a phase name, start week, and end week
  4. Admin can define session prescriptions for any week — adding exercises with sets, reps, and a %1RM percentage for each
**Plans**: TBD
**UI hint**: yes

### Phase 4: Enrollment Browse UI
**Goal**: Any authenticated user can discover available programs, preview the structure of a program before committing, enroll, and see their current program and position on return visits
**Depends on**: Phase 2
**Requirements**: ENRL-01, ENRL-02, ENRL-03, ENRL-04
**Success Criteria** (what must be TRUE):
  1. The programs browse page lists all available templates showing name, total duration in weeks, and sessions per week
  2. Tapping a program shows its phase overview (phase names, week ranges) and at least one week's session structure before the user commits to enrolling
  3. A user can enroll in a program and is prevented from enrolling in a second program while one is active
  4. After enrolling, the user's program page displays their current phase name and week number
**Plans**: TBD
**UI hint**: yes

### Phase 5: Session View
**Goal**: An enrolled user can view any of their current week's scheduled sessions with prescribed exercises rendered as concrete target weights derived from their stored 1RM maxes
**Depends on**: Phase 4
**Requirements**: SESS-01, SESS-02, SESS-03
**Success Criteria** (what must be TRUE):
  1. The enrolled program view shows the sessions scheduled for the user's current week, labeled by day or session name
  2. Opening a session shows each prescribed exercise with calculated target weight (stored 1RM max × %1RM percentage), set count, and rep target
  3. When no 1RM max is stored for a prescribed exercise, the session view shows a visible prompt directing the user to log a max before training that lift
**Plans**: TBD
**UI hint**: yes

### Phase 6: Session Logging
**Goal**: A user can start a program session, record actual reps and weight for each set, and complete the session — at which point a real workout entry appears in their workout log linked to the program session
**Depends on**: Phase 5
**Requirements**: LOG-01, LOG-02, LOG-03
**Success Criteria** (what must be TRUE):
  1. Starting a program session creates a new workout entry in the existing workouts table and navigates the user to a logging interface
  2. The user can log actual weight and reps for each prescribed set and see their input recorded in the session
  3. Completing the session marks it done, finalizes the linked workout, and the workout appears in the workout log with a program-session label or reference
**Plans**: TBD
**UI hint**: yes

### Phase 7: Week Progression
**Goal**: A user can intentionally advance to the next week in their program, always see their accurate position, and cleanly end their enrollment when they choose
**Depends on**: Phase 6
**Requirements**: PROG-01, PROG-02, PROG-03
**Success Criteria** (what must be TRUE):
  1. The user can tap an "Advance to next week" action and their `current_week` increments, displaying updated session schedule for the new week
  2. The enrolled program view always shows the current phase name, current week number, and how many weeks remain in the program
  3. The user can leave their enrolled program at any time; doing so deactivates the enrollment and returns them to the program browse page
**Plans**: TBD
**UI hint**: yes

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Data Model & Schema | 0/2 | Not started | - |
| 2. SQL Seed Data | 0/? | Not started | - |
| 3. Admin Builder UI | 0/? | Not started | - |
| 4. Enrollment Browse UI | 0/? | Not started | - |
| 5. Session View | 0/? | Not started | - |
| 6. Session Logging | 0/? | Not started | - |
| 7. Week Progression | 0/? | Not started | - |

---

*Roadmap created: 2026-04-17*
*Last updated: 2026-04-17 — Phase 1 planned: 2 plans in 2 waves*
