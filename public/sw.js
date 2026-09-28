const CACHE_VERSION = "crp-shell-v1";
const RUNTIME_CACHE = "crp-runtime-v2";
const CORE = ["/", "/curriculum", "/reviews", "/progress", "/settings", "/offline", "/manifest.webmanifest", "/favicon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![CACHE_VERSION, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Clone synchronously, before the response is handed to the page: once the
  // page starts reading the body, a later clone() throws "body already used".
  const store = (response) => {
    if (!response.ok) return;
    const copy = response.clone();
    event.waitUntil(caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)));
  };
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      store(response);
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match("/offline"))));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    store(response);
    return response;
  })));
});
