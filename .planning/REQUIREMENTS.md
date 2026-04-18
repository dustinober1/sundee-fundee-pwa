# Requirements: Sundee Fundee PWA

**Defined:** 2026-04-17
**Core Value:** A user can log, track, and follow structured training — all in one place that understands her cycle.

## v1.0 Requirements — Programs Milestone

### Template Data Model

- [ ] **TMPL-01**: Program template stores phases (name, start/end week) and weekly sessions (exercises with sets, reps, %1RM) as structured JSONB
- [ ] **TMPL-02**: Each prescribed exercise in a session specifies exercise_id, sets, reps, and %1RM percentage
- [ ] **TMPL-06**: Initial program templates can be added via SQL seed migration

### Admin Builder

- [ ] **ADMN-01**: Admin role exists on user profiles via `is_admin` flag with RLS-gated access
- [ ] **ADMN-02**: Admin can create a new program template (name, description, duration_weeks, sessions_per_week)
- [ ] **ADMN-03**: Admin can define phases (name, start_week, end_week) within a template
- [ ] **ADMN-04**: Admin can define weekly session prescriptions (day label, exercise list) for each week
- [ ] **ADMN-05**: Admin can add prescribed exercises to a session with sets, reps, and %1RM percentage

### Enrollment

- [ ] **ENRL-01**: User can browse all available program templates with name, duration, and sessions/week
- [ ] **ENRL-02**: User can view a program template's phase overview and session structure before enrolling
- [ ] **ENRL-03**: User can enroll in a program (one active program at a time)
- [ ] **ENRL-04**: User can see their currently enrolled program and current position (phase name, week number)

### Session View

- [ ] **SESS-01**: User can view the current week's scheduled sessions in their enrolled program
- [ ] **SESS-02**: User can view a session's prescribed exercises with calculated target weight (%1RM × stored max)
- [ ] **SESS-03**: User sees a clear indicator when no 1RM is stored for a prescribed exercise (prompts to set max first)

### Session Logging

- [ ] **LOG-01**: User can start a program session, which creates a linked workout entry in the existing workout log
- [ ] **LOG-02**: User can log actual reps and weight for each prescribed set during a session
- [ ] **LOG-03**: User can complete a program session, marking it done and finalizing the linked workout

### Week Progression

- [ ] **PROG-01**: User can advance to the next week in their enrolled program
- [ ] **PROG-02**: User can see their current position: phase name, week number, total weeks remaining
- [ ] **PROG-03**: User can end (leave) their enrolled program at any time

## v2 Requirements

### Program Analytics

- **PANA-01**: User can view a summary of completed program sessions and adherence rate
- **PANA-02**: User can compare actual vs. prescribed load across a program's history

### Advanced Load Models

- **LOAD-01**: Prescribed exercises can specify RPE instead of %1RM
- **LOAD-02**: Prescribed exercises can specify fixed weight (no relative load)

### Program Discovery

- **DISC-01**: Program templates are tagged by goal (strength, hypertrophy, endurance)
- **DISC-02**: User can filter templates by tag

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multiple simultaneous enrollments | One active program per user is enforced at DB level; multiple enrollment tracking would require significant query changes |
| Social/sharing of programs | No social graph exists in this app |
| Video or media in program sessions | Storage/bandwidth cost; not needed for v1.0 |
| RPE or fixed-weight load types | %1RM is the only load model for v1.0 to keep the data model simple |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TMPL-01 | — | Pending |
| TMPL-02 | — | Pending |
| TMPL-06 | — | Pending |
| ADMN-01 | — | Pending |
| ADMN-02 | — | Pending |
| ADMN-03 | — | Pending |
| ADMN-04 | — | Pending |
| ADMN-05 | — | Pending |
| ENRL-01 | — | Pending |
| ENRL-02 | — | Pending |
| ENRL-03 | — | Pending |
| ENRL-04 | — | Pending |
| SESS-01 | — | Pending |
| SESS-02 | — | Pending |
| SESS-03 | — | Pending |
| LOG-01 | — | Pending |
| LOG-02 | — | Pending |
| LOG-03 | — | Pending |
| PROG-01 | — | Pending |
| PROG-02 | — | Pending |
| PROG-03 | — | Pending |

**Coverage:**
- v1.0 requirements: 21 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 21 ⚠️

---
*Requirements defined: 2026-04-17*
*Last updated: 2026-04-17 after initial definition*
