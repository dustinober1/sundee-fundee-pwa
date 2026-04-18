// Sundee Fundee service worker — app-shell + runtime GET caches.
// Non-GET requests bypass the SW entirely; the client-side outbox (IndexedDB)
// handles offline writes, so we don't try to replay them here.

const SHELL_CACHE = "sundee-shell-v2";
const RUNTIME_CACHE = "sundee-runtime-v2";
const SHELL_URLS = ["/", "/login", "/manifest.webmanifest"];

// Paths for which we serve a cached copy when offline so the logging UI
// is still reachable. Navigations are network-first with a cached fallback.
const RUNTIME_PATH_PREFIXES = [
  "/workouts",
  "/dashboard",
  "/recovery",
  "/pain",
  "/maxes",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const keep = new Set([SHELL_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))),
      ),
  );
  self.clients.claim();
});

function isRuntimePath(pathname) {
  return RUNTIME_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache auth or API routes.
  if (url.pathname.startsWith("/auth") || url.pathname.startsWith("/api")) {
    return;
  }

  // Navigations: network-first, falling back to a cached runtime copy, then
  // the shell root.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok && isRuntimePath(url.pathname)) {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          } else if (res.ok) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((r) => r || caches.match("/"))
            .then((r) => r || Response.error()),
        ),
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const networked = fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || networked;
    }),
  );
});
