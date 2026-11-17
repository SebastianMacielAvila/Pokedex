// If you change data.json or index.html, bump the version so the phone updates.
const VERSION = "pokedex-v5";
const BASE = ["./", "index.html", "data.json", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASE)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});

// Cached copy first; otherwise fetch it and cache it for next time.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(guardado => guardado || fetch(e.request).then(res => {
      const copia = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copia));
      return res;
    }))
  );
});
