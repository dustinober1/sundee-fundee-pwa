# R011 — Private public-URL launchability contract (web PWA)

## Reader + goal

**Reader:** someone who can run npm scripts and (optionally) deploy to Cloudflare.

**After reading, you can:** publish the Sundee Fundee training PWA to a **public but unadvertised** URL for **private testing**, and validate that `/app` works in **local-only mode** without any accounts or cloud credentials.

## Scope (what this doc claims)

This contract is intentionally narrow:

- ✅ **Public URL, private testing:** the app can be reachable on the public internet, but shared only with a small set of testers.
- ✅ **Local-only works without accounts:** `/app` can be used without signing in and without cloud writes.
- ✅ **Noindex posture for `/app`:** `/app` is configured to discourage indexing by search engines.
- ✅ **PWA installable shell:** the web app declares a web manifest with `start_url: /app`.
- ✅ **Service worker provides a small offline shell:** best-effort caching for a minimal set of routes/assets.

Out of scope (non-claims):

- ❌ “Public launch” readiness (marketing, SEO, broad support, scale, etc.).
- ❌ iOS-native parity features like background timers, push notifications, HealthKit, etc.
- ❌ Cloud sync correctness/scale (Supabase is optional and opt-in).

## Supported publish paths

### 1) Production-like build + preview (local operator proof)

Use this when you want a production-like build running locally to validate that a deployment build can start and serve `/app`.

- `npm run build`
- `npm run preview`

Notes:

- `preview` is intentionally treated as **operator-run proof** (it can be long-running).
- This proof does **not** require Supabase credentials.

### 2) Cloudflare/OpenNext publish (supported hosting path)

The repo is designed to deploy using the existing Cloudflare/OpenNext path:

- `npm run deploy`

This contract does **not** require automated verification to actually deploy (credentials are environment/operator-specific). Instead, it documents acceptance checks to run once a URL exists.

## Local-only behavior (no account required)

Local-only mode means:

- No authentication is required to use `/app`.
- Workout/program/training data can stay on-device in browser storage (IndexedDB).
- Missing Supabase environment variables must **not** prevent local-only usage.

Cloud sync is optional and explicitly out of scope for this launchability contract:

- If Supabase env vars are not present, the app should still function for local-only proof.
- If Supabase env vars are present, sync behavior is still opt-in; testers should not be asked to sign in to validate launchability.

## `/app` noindex posture

`/app` is configured to discourage search indexing.

- The `/app` layout sets `robots: { index: false, follow: false }`.

This supports the “public but unadvertised URL” posture for private testing.

## PWA metadata (what a private tester should expect)

The web manifest declares:

- `start_url: "/app"`
- `display: "standalone"`

Private testers should be able to:

- Add the app to the home screen (device support varies).
- Launch directly into `/app` via the installed PWA.

## Service worker + offline shell limits

The service worker caches a small “app shell” list:

- `/app`
- `/offline`
- `/Logo.jpeg`
- `/manifest.webmanifest`

Limits and honesty checks:

- This is **not** a full offline-first sync engine.
- Caching is best-effort; network failures fall back to cached `/app` or `/offline`.
- Background execution and timers are not guaranteed (platform-dependent).

## Acceptance checks (private tester contract)

Run these checks against either:

- a local preview URL, or
- a Cloudflare-deployed URL.

### A. Verify `/app` is discoverable but unindexed

1. Visit `<BASE_URL>/app`.
2. Confirm the page renders the training app shell.
3. Confirm the page is marked `noindex` (e.g., view page source / verify robots meta).

### B. Verify local-only usage without credentials

1. Open `<BASE_URL>/app` in a fresh browser profile.
2. Confirm you are **not required** to sign in to reach the training UI.
3. Create or enroll in a program (as supported by the UI).
4. Log at least one performed set/session action.

### C. Verify persistence across reload

1. Reload the page.
2. Confirm the previously created/enrolled state still appears.

### D. Verify “offline shell” fallback is not over-claimed

1. With the app loaded once, go offline (airplane mode or devtools offline).
2. Reload.
3. Confirm you get either:
   - cached `/app`, or
   - the `/offline` fallback.

If these checks fail on a deployed URL:

- The correct outcome is **“launchability not yet proven for this environment”**, not weakening local-only parity claims.

## Evidence hygiene

- This document is tracked under `docs/parity/` and must remain citation-safe.
- Do not rely on `.gsd/` artifacts as proof.
