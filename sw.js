const CACHE_NAME = 'btc-strategy-lab-shell-v3';
const APP_CACHE_PREFIX = 'btc-strategy-lab-shell-';
const BASE = '/btc-strategy-lab-pwa/';
const REQUIRED = [BASE, BASE + 'index.html', BASE + 'manifest.webmanifest'];
const OPTIONAL = [BASE + 'icons/icon-192-v2.png', BASE + 'icons/icon-512-v2.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await cache.addAll(REQUIRED);
      await Promise.all(OPTIONAL.map(u => cache.add(u).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith(APP_CACHE_PREFIX) && k !== CACHE_NAME)
            .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  // Never touch Apps Script, Sheets, Telegram, prices: cross-origin passes through.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(BASE) || url.pathname.endsWith('/sw.js')) return;

  event.respondWith(
    fetch(req).then(res => {
      const cacheable = res.ok && (req.mode === 'navigate' ||
        url.pathname.endsWith('/manifest.webmanifest') || url.pathname.includes('/icons/'));
      if (cacheable) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
      }
      return res;
    }).catch(async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') return caches.match(BASE + 'index.html');
      return Response.error();
    })
  );
});
