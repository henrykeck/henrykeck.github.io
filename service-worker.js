const CACHE_VERSION = 1;
const STATIC_CACHE_NAME = `static-cache-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `dynamic-cache-v${CACHE_VERSION}`;
const STATIC_ASSETS = [
    '/', // the main HTML file
    '/scripts.js',
    '/styles.css',
    '/artifacts/logos/logo.webp',
    '/artifacts/logos/logo-slim.webp',
    '/artifacts/content-photos/filler/marble_wallpaper.webp',
    '/artifacts/content-photos/filler/white_octagon_wallpaper.webp',
    '/artifacts/content-photos/filler/white_octagon_wallpaper.webp',
    '/artifacts/content-photos/headers/blue_stripe.webp',
    '/artifacts/content-photos/headers/orange_stripe.webp',
    '/artifacts/content-photos/headers/green_stripe.webp',
    '/artifacts/content-photos/personnel/dave_headshot.webp',
    '/artifacts/content-photos/personnel/dave_fun.webp',
    '/artifacts/content-photos/wallcovering-types/wood_square.webp',
    '/artifacts/content-photos/wallcovering-types/whiteboard_square.webp',
    '/artifacts/content-photos/wallcovering-types/sisal_square.webp',
    '/artifacts/content-photos/wallcovering-types/residential_square.webp',
    '/artifacts/content-photos/wallcovering-types/panel_square.webp',
    '/artifacts/content-photos/wallcovering-types/mural_square.webp',
    '/artifacts/content-photos/wallcovering-types/foil_square.webp',
    '/artifacts/content-photos/wallcovering-types/fabric_square.webp',
    '/artifacts/content-photos/wallcovering-types/commercial_square.webp'
];

self.addEventListener('install', (event) => {
    // Precache assets on install
    event.waitUntil(caches.open(cacheName).then((cache) => {
      return cache.addAll(precachedAssets);
    }));
  });
  
  self.addEventListener('fetch', (event) => {
    // Always try the cache for every request
    event.respondWith(caches.open(cacheName).then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || Promise.reject('No match in cache');
      });
    }));
  });