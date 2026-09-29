// Service worker: apre l'app anche senza rete (i dati restano nella cache Firestore)
const CACHE = 'gymtracker-v2';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './vendor/jspdf.umd.min.js',
  './vendor/jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const own = u.origin === location.origin;
  const fbLib = u.hostname === 'www.gstatic.com' && u.pathname.includes('/firebasejs/');
  if (!own && !fbLib) return;              // le chiamate a Firestore non passano dal SW
  e.respondWith(
    fetch(e.request).then(r => {             // prima la rete (versione aggiornata), poi la cache
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
  );
});
