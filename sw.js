/* Service worker del panel: red primero, caché de respaldo (para abrir sin conexión). */
const CACHE = 'yk-admin-v1';
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin && u.hostname !== 'www.gstatic.com' && u.hostname !== 'fonts.googleapis.com' && u.hostname !== 'fonts.gstatic.com') return;
  e.respondWith(fetch(r).then((res) => {
    if (res && res.ok) { const c = res.clone(); caches.open(CACHE).then((x) => x.put(r, c)); }
    return res;
  }).catch(() => caches.match(r)));
});
