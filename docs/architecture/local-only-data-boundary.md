# Local-only data boundary (privacy + migration contract)

**Audience:** engineers changing the app shell, persistence, or sync layers; privacy-sensitive users reading the repo/docs.

**Post-read action:** confidently change `/app` features without accidentally violating the local-only promise (no account + no cloud writes), and know which commands to run to verify the boundary.

## What “local-only” means

When the app is in **local-only** mode:

- **No account is required.** The app does not require Supabase auth.
- **No cloud writes occur.** The app must not upload or write user data to Supabase (or any other cloud backend).
- **App data lives on-device.** Workout/cycle/recovery/program state is stored in browser **IndexedDB**.

### Allowed on-device metadata

Local-only mode may still store **sync-related metadata locally** (on-device) if it is needed for local-first UX, including:

- locally queued mutation records (e.g. counts/labels surfaced in the UI)
- local timestamps / last-run markers

The privacy promise is **no account + no upload + no cloud writes** in local-only. It does **not** promise that the local database contains zero sync-related bookkeeping.

## How cloud sync is enabled (explicit opt-in)

Cloud sync is **opt-in** and requires all of the following:

1. The user selects **cloud-sync** mode (not local-only).
2. Supabase environment configuration is present.
3. The user connects an account (magic-link auth).
4. A sync run is triggered from the app.

If any of the above prerequisites are missing, cloud sync must behave as **disabled / not-run**.

## Enforced boundary (where the guarantee lives)

The local-only guarantee is enforced at the **cloud-sync / data-boundary layer**, not only at the screen/UI layer.

This is intentional: UI orchestration can drift over time, but the privacy promise must remain enforceable even if a future UI path attempts to trigger sync.

Key boundary modules (tracked):

- `src/lib/pwa/cloud-sync.ts` — **must** guard cloud entry points; local-only must not create Supabase clients or perform remote writes.
- `src/lib/pwa/local-repositories.ts` — local IndexedDB repositories and import/export boundaries.
- `src/lib/pwa/local-db.ts` — Dexie schema + local persistence wiring.
- `src/lib/pwa/schema.ts` — portable schema constants including export schema version.

Related tests (tracked):

- `src/lib/pwa/local-only-privacy.test.ts`

## Import/export schema policy (fail closed)

Exports include a `schemaVersion`.

Policy:

- **Only the current supported export schemaVersion is accepted for import.**
- Any unknown, missing, or mismatched `schemaVersion` must be rejected **before any IndexedDB writes occur**.

Rationale: This fails closed until an explicit migration path exists, preventing partial imports or silent corruption.

## Traceability

- **R004** — portability boundary for the app surface.
- **R005** — local-only privacy guarantee: no account + no cloud writes.
- **D004** — decision: local-only is enforced at the cloud-sync/data-boundary layer before any Supabase client/auth code runs.

## Verification commands

Run these before claiming changes preserve the boundary:

```bash
npm run verify:app-boundary
npm run lint
```

And for the docs contract itself:

```bash
test -f docs/architecture/local-only-data-boundary.md
grep -q "R005" docs/architecture/local-only-data-boundary.md
```
