// Service Worker for offline support

const CACHE_NAME = 'planora-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/data.js',
    '/manifest.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('✓ Cache opened');
            return cache.addAll(urlsToCache).catch((err) => {
                console.log('Cache addAll error:', err);
                // Don't fail installation if some resources aren't available
                return Promise.resolve();
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('✓ Old cache deleted:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(event.request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                })
                .catch(() => {
                    // Return a fallback response or cached response
                    return caches.match(event.request).then((response) => {
                        return response || new Response('Offline - Resource not available', { status: 503 });
                    });
                });
        })
    );
});

// Handle background sync for notifications
self.addEventListener('sync', (event) => {
    if (event.tag === 'daily-reminder') {
        event.waitUntil(
            self.registration.showNotification('Planora Reminder', {
                body: "Don't forget to update your timetable!",
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect fill="%236366f1" width="180" height="180"/><text x="50%" y="50%" font-size="90" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">⏰</text></svg>',
                badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%236366f1" width="192" height="192" rx="45"/><text x="50%" y="50%" font-size="100" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">✓</text></svg>',
                tag: 'planora-reminder',
                requireInteraction: false
            })
        );
    }
});

// Handle push notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        title: data.title || 'Planora',
        body: data.body || 'You have a new update',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect fill="%236366f1" width="180" height="180"/><text x="50%" y="50%" font-size="90" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">⏰</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%236366f1" width="192" height="192" rx="45"/><text x="50%" y="50%" font-size="100" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">✓</text></svg>',
        tag: 'planora-notification',
        actions: [
            {
                action: 'open',
                title: 'Open App'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(options.title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                // Check if app is already open
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].url === '/' && 'focus' in clientList[i]) {
                        return clientList[i].focus();
                    }
                }
                // Open new window if not open
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
});
