# Supabase readiness (local + hosted apply runbook)

**Audience:** engineers preparing cloud sync / donation persistence to run safely.

**Post-read action:** know exactly what is already ready, what is blocked locally, and which commands to run before applying migrations to the hosted Supabase project.

## Current status

What is already in repo:

- Initial migration: `supabase/migrations/20260428000000_pwa_core.sql`
- Generated database types: `src/lib/pwa/database.types.ts`
- Browser/server/admin clients:
  - `src/lib/pwa/supabase-browser.ts`
  - `src/lib/pwa/supabase-server.ts`
- Linked hosted project: `Sundee_Fundee` (`pufzehwzthropjmrrqgt`)

What has been verified:

- `supabase db lint --linked --fail-on error` ✅
- App code fails closed when Supabase env vars are absent ✅

What is still blocked locally:

- `supabase start` requires Docker Desktop / Docker daemon.
- Without Docker, local container-based migration replay and policy testing cannot run.

## Environment variables

Cloud sync requires:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

These are optional for local-only mode, but required for account-backed sync and server-side donation persistence.

## Local readiness checklist

### 1) Verify linked project and generated types

```bash
node scripts/check-supabase-readiness.mjs
```

Expected result:

- linked project metadata found
- migration file present
- generated database types present
- env keys reported as present/missing (without printing values)

### 2) Lint the linked remote schema

```bash
supabase db lint --linked --fail-on error
```

Expected result:

- `No schema errors found`

### 3) Start local Supabase stack (requires Docker)

```bash
supabase start
```

If this fails with Docker daemon errors, install/run Docker Desktop first.

### 4) Replay migrations locally once Docker is running

```bash
supabase db reset
npm run supabase:types
```

Expected result:

- migration applies cleanly
- generated types stay in sync with the schema

### 5) Verify app behavior

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

If Supabase env vars are configured, also verify:

- `/auth/sign-in` magic-link flow renders
- `/app` data screen shows cloud sync controls without throwing
- donation webhook persistence paths do not crash when admin env is present

## Hosted apply checklist

**Do not run these without explicit approval** if remote mutation needs confirmation.

### 1) Confirm linkage

```bash
supabase link --project-ref pufzehwzthropjmrrqgt
```

### 2) Preview migration impact

```bash
supabase db push --dry-run
```

Review output for:

- unexpected drops
- policy churn
- schema drift that does not match `supabase/migrations/20260428000000_pwa_core.sql`

### 3) Apply hosted migration

```bash
supabase db push
```

### 4) Regenerate types from hosted schema

```bash
npm run supabase:types
```

### 5) Verify hosted schema shape

```bash
supabase db lint --linked --fail-on error
```

## Known gaps

- No local policy test harness yet against a local Supabase DB.
- Local migration replay is blocked until Docker is running.
- Initial migration is now safer for policy replays, but that should still be proven with `supabase db reset` once local containers are available.

## Ready-to-go definition for this repo

Supabase is "ready to go" when all of the following are true:

1. `node scripts/check-supabase-readiness.mjs` passes.
2. `supabase db lint --linked --fail-on error` passes.
3. Local `supabase start` + `supabase db reset` pass on a Docker-enabled machine.
4. `npm run supabase:types` produces no unexpected drift.
5. App verification passes with Supabase env vars configured.
6. Hosted `supabase db push --dry-run` is reviewed before any remote apply.
