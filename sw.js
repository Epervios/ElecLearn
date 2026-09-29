/* Ressources locales uniquement, aucun manuel PDF n'est distribué. */
const CACHE = "eleclearn-v2-20260929";
const ASSETS = [
  "./","./index.html","./css/style-v2.css","./manifest.webmanifest","./assets/icon.svg",
  "./js/app-v2.js","./js/questions.js","./js/labs.js","./js/approfondissements.js","./js/sql-wasm.js","./js/sql-wasm.wasm",
  "./db/ElecLearn.db",
  "./contenu/f1.html","./contenu/f2.html","./contenu/f3.html","./contenu/f4.html",
  "./contenu/f5.html","./contenu/f6.html","./contenu/f7.html","./contenu/f8.html",
  "./contenu/f9.html","./contenu/f10.html","./contenu/f11.html","./contenu/f12.html",
  "./contenu/f13.html","./contenu/f14.html","./contenu/f15.html"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith("eleclearn-") && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, clone)).catch(console.warn);
        }
        return response;
      }).catch(async () => (await caches.match(request)) || (await caches.match("./index.html")))
    );
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) {
      const clone = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, clone)).catch(console.warn);
    }
    return response;
  })));
});