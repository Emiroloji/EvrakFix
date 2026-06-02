const CACHE_NAME = 'evrakfix-cache-v1.9.0';
const PRE_CACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.webmanifest'
];

// On install, pre-cache critical app shell components
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// On activate, clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('ServiceWorker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Intercept requests and apply Stale-While-Revalidate caching strategy
self.addEventListener('fetch', (event) => {
  // Only handle standard GET requests (ignore chrome-extension, POST, etc.)
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Skip browser extension requests
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // SPA navigation fallback to support offline routing
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Only cache successful standard responses
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn('ServiceWorker fetch failed, serving from cache:', err);
            // Fallback is handled by cachedResponse if it exists
          });

        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});
