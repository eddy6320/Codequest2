/* Service worker: la app funciona sin conexión (red primero). Sube V al publicar cambios grandes. */
const V = 'cq-v22';
const ASSETS = ['./', 'index.html', 'styles.css', 'fx.css', 'app.js', 'roadmap.js', 'pet.js', 'content/extras.js', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png',
  'content/helpers.js', 'content/python.plus2.js', 'content/javascript.plus2.js', 'content/c.plus2.js', 'content/cpp.plus2.js', 'content/java.plus2.js', 'content/bash.plus.js', 'content/typescript.plus2.js', 'content/sql.plus2.js', 'content/go.plus2.js', 'content/rust.plus.js', 'content/php.plus.js', 'content/kotlin.plus.js', 'content/csharp.plus2.js', 'content/pseint.plus2.js', 'content/html.plus2.js',  'content/python.js', 'content/javascript.js', 'content/html.js',
  'content/sql.js', 'content/java.js', 'content/c.js',
  'content/html.plus.js', 'content/javascript.plus.js', 'content/python.plus.js', 'content/java.plus.js', 'content/sql.plus.js', 'content/typescript.js', 'content/cpp.js', 'content/csharp.js', 'content/go.js', 'content/rust.js', 'content/php.js', 'content/kotlin.js', 'content/bash.js', 'content/c.plus.js', 'content/pseint.js', 'content/typescript.plus.js', 'content/pseint.plus.js', 'content/csharp.plus.js', 'content/go.plus.js', 'content/cpp.plus.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // Red primero (siempre la versión nueva); si no hay conexión, caché.
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); }
    return res;
  }).catch(() => caches.match(r, { ignoreSearch: true })));
});
