const CACHE_NAME = 'habit-tracker-stamp-v1';
const assetsToCache = [
    './',
    './index.html',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (
        event.request.url.includes('firebaseio.com') ||
        event.request.url.includes('googleapis.com') ||
        event.request.url.includes('gstatic.com')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});