const CACHE_NAME = 'kalapato-v2-cache';
const DYNAMIC_CACHE_NAME = 'kalapato-dynamic-cache';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/login',
  '/register',
  '/dashboard',
  '/profile',
];

// Skip waiting and claim clients immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // Strategy: Network First for Pages and API
  if (
    request.mode === 'navigate' || 
    url.pathname.startsWith('/api') || 
    url.pathname.startsWith('/dashboard') || 
    url.pathname.startsWith('/profile')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a copy of the successful response
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(request);
        })
    );
    return;
  }

  // Strategy: Cache First for static assets and images
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((response) => {
        // Cache new static assets
        if (
          url.pathname.startsWith('/_next/static') || 
          url.pathname.includes('.png') || 
          url.pathname.includes('.svg') ||
          url.pathname.includes('.woff2')
        ) {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});
