const CACHE_NAME = 'btc-strategy-lab-shell-v1';
const SHELL_FILES = ['./', './index.html', './manifest.webmanifest', './icons/btc-alert-192.png', './icons/btc-alert-512.png', './icons/btc-alert-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  // Cache only this GitHub Pages app shell. Never cache the Apps Script dashboard, prices, or signals.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith(fetch(request).then(response => {
    if (response && response.ok && (url.pathname === self.location.pathname || url.pathname.endsWith('/index.html') || url.pathname.endsWith('.webmanifest') || url.pathname.includes('/icons/'))) {
      const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request).then(cached => cached || caches.match('./index.html'))));
});
