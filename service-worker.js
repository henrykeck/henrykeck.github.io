const CACHE_VERSION = 1;
const STATIC_CACHE_NAME = `static-cache-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `dynamic-cache-v${CACHE_VERSION}`;
const STATIC_ASSETS = [
    '/', // the main HTML file
    '/scripts.js',
    '/styles.css', // Replace with your actual CSS path
    '/artifacts/logos/logo.png',
    '/artifacts/logos/logo-slim.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    const requestUrl = event.request.url;

    // Check if the request URL matches any of the directories you want to cache
    const isTargetedRequest = [
        '/artifacts/content-photos/wallcovering-types',
        '/artifacts/content-photos/personnel',
        '/artifacts/content-photos/headers',
        '/artifacts/content-photos/filler',
        '/artifacts/wallcovering-type-descriptions'
    ].some(directory => requestUrl.includes(directory));

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return cachedResponse;

            // Cache the request if it's targeted
            if (isTargetedRequest) {
                return fetch(event.request).then(fetchResponse => {
                    return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            }

            // If it's not a targeted request, just forward it
            return fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    const expectedCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
    event.waitUntil(
        caches.keys().then((keys) => 
            Promise.all(keys.map(key => {
                if (!expectedCaches.includes(key)) return caches.delete(key);
            }))
        )
    );
});
