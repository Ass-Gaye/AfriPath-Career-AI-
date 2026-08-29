/**
 * AfriPath AI — Production Service Worker
 * Version 1.0.0
 * Provides offline caching, network-resilient asset delivery, and update management.
 */

const CACHE_VERSION = 'afripath-v1.0.0';
const STATIC_CACHE_NAME = `afripath-static-${CACHE_VERSION}`;
const RUNTIME_CACHE_NAME = `afripath-runtime-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `afripath-data-${CACHE_VERSION}`;

// Application shell assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable.png',
  '/og-image.jpg',
];

// Sensitive or real-time endpoints that MUST NEVER be cached
const NETWORK_ONLY_PATTERNS = [
  /\/api\/auth\//,
  /\/api\/user\/password/,
  /\/api\/user\/reset/,
  /\/api\/mentor/,
  /\/api\/generate-/,
];

// 1. Install Event: Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Do not force immediate skipWaiting on install to avoid interrupting active sessions,
        // unless triggered by client update message.
      })
      .catch((err) => {
        console.warn('[SW] Precache failed during install:', err);
      })
  );
});

// 2. Activate Event: Clean up stale legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        const allowedCaches = [STATIC_CACHE_NAME, RUNTIME_CACHE_NAME, DATA_CACHE_NAME];
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!allowedCaches.includes(cacheName) && cacheName.startsWith('afripath-')) {
              console.log('[SW] Deleting legacy cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// 3. Message Handling: update controls, skip waiting & cache cleanup
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => {
        return Promise.all(names.map((name) => caches.delete(name)));
      })
    );
  }

  if (event.data.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  }
});

// 4. Fetch Event: Intelligent Strategy Based on Request Type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests or chrome-extension schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // A. Sensitive / Auth / AI requests: NETWORK ONLY
  const isNetworkOnly = NETWORK_ONLY_PATTERNS.some((pattern) => pattern.test(url.pathname));
  if (isNetworkOnly) {
    event.respondWith(fetch(request));
    return;
  }

  // B. Navigation requests (HTML documents for SPA routing)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // If offline, serve cached app shell
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const cachedIndex = await caches.match('/index.html');
          if (cachedIndex) return cachedIndex;
          const cachedRoot = await caches.match('/');
          if (cachedRoot) return cachedRoot;

          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>AfriPath AI — You're Offline</title>
                <style>
                  body { background: #090d16; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; text-align: center; }
                  .card { max-width: 440px; background: #0f172a; border: 1px solid #1e293b; border-radius: 1.5rem; padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
                  h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #34d399; }
                  p { color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem; }
                  button { background: #059669; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: background 0.2s; }
                  button:hover { background: #10b981; }
                </style>
              </head>
              <body>
                <div class="card">
                  <h1>You're Offline</h1>
                  <p>AfriPath AI could not reach the network. Your previously loaded career milestones and cached roadmaps are safe. Connect to the internet to use the AI Advisor and view live opportunities.</p>
                  <button onclick="window.location.reload()">Retry Connection</button>
                </div>
              </body>
            </html>`,
            {
              headers: { 'Content-Type': 'text/html' },
            }
          );
        })
    );
    return;
  }

  // C. Static Assets (JS, CSS, Images, Fonts, Icons) -> Cache-First with Stale-While-Revalidate
  const isStaticAsset =
    url.origin === self.location.origin &&
    (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2|woff|ttf|ico|webmanifest|json)$/) ||
      url.pathname.startsWith('/assets/'));

  const isExternalFont =
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticAsset || isExternalFont) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Fetch in background to update cache (Stale-While-Revalidate)
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failure is expected when offline; cachedResponse will be returned
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // D. General API Read Requests -> Network First with fallback to Data Cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // Default fallback to network
  event.respondWith(fetch(request));
});
