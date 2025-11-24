const CACHE_NAME = 'lumiose-pokedex-v1';
const STATIC_CACHE = 'lumiose-static-v1';
const IMAGE_CACHE = 'lumiose-images-v1';

// Static assets that need to be pre-cached
const STATIC_ASSETS = [
  '/',
  '/lumiose/manifest.json',
  '/lumiose/images/appIcon/pwa-512x512.png',
  '/lumiose/images/appIcon/pwa-maskable-512x512.png',
];

// Install event - pre-cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(async (cache) => {
        console.log('Caching static assets');
        // Add assets individually to avoid entire cache failure due to single asset failure
        for (const asset of STATIC_ASSETS) {
          try {
            await cache.add(asset);
            console.log(`Cached: ${asset}`);
          } catch (error) {
            console.warn(`Failed to cache: ${asset}`, error);
          }
        }
      }),
      self.skipWaiting(),
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== CACHE_NAME
            ) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Intercept network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle image requests - cache-first strategy
  if (
    request.destination === 'image' ||
    url.pathname.includes('/images/') ||
    url.pathname.includes('/pmIcon/') ||
    url.pathname.includes('/type/')
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // console.log('Image served from cache:', url.pathname);
            return cachedResponse;
          }

          // If not in cache, fetch from network and cache
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                // console.log('Image cached from network:', url.pathname);
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Fallback when network fails
              console.error('Failed to fetch image:', url.pathname);
              return new Response('Image not available offline', {
                status: 404,
                statusText: 'Not Found',
              });
            });
        });
      })
    );
    return;
  }
});

// Handle background sync (if needed)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
});

// Handle push notifications (if needed)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
});
