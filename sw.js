const CACHE_NAME = 'btc-strategy-lab-shell-v3';
const APP_CACHE_PREFIX = 'btc-strategy-lab-shell-';
const BASE_PATH = '/btc-strategy-lab-pwa/';
const SHELL_FILES = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.webmanifest'
];

// Install the shell first. Optional icons must not prevent the worker from installing.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL_FILES);
    const optionalIcons = [
      BASE_PATH + 'icons/icon-192-v2.png',
      BASE_PATH + 'icons/icon-512-v2.png'
    ];
    await Promise.allSettled(optionalIcons.map(async path => {
      const response = await fetch(path, { cache: 'no-cache' });
      if (response.ok) await cache.put(path, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(APP_CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Never intercept Apps Script, Google APIs, market data, or other external requests.
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(BASE_PATH)) return;

  // Let navigations try the live page first, then use the cached shell offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(request);
      } catch (_) {
        return (await caches.match(BASE_PATH + 'index.html')) ||
               new Response('BTC Strategy Lab is offline. Reconnect and reload.', {
                 status: 503,
                 headers: { 'Content-Type': 'text/plain; charset=utf-8' }
               });
      }
    })());
    return;
  }

  // Cache-first only for local PWA shell assets; external integrations are untouched.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (_) {
      return new Response('', { status: 504, statusText: 'Gateway Timeout' });
    }
  })());
});
