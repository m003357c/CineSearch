var CACHE_NAME = 'JuiceBoxCache';
var BASEPATH = '/Juice_Box/';
var CACHED_URLS = [
  // Our HTML
    BASEPATH + 'index.html',
    BASEPATH + 'basket.html',
    BASEPATH + 'checkout.html',
  // Stylesheets and fonts    
    BASEPATH +  'css/styles.css',
  // JavaScript
    BASEPATH +  'assets/icons/manifest.json',
    BASEPATH +  'js/script.js',
  // Images
    BASEPATH +  'assets/images/menu-citrus.svg',
    BASEPATH +  'assets/images/menu-berry.svg',
    BASEPATH +  'assets/images/menu-green.svg',
    BASEPATH +  'assets/images/menu-red.svg',
    BASEPATH +  'assets/images/prod-citrus.svg',
    BASEPATH +  'assets/images/prod-berry.svg',
    BASEPATH +  'assets/images/prod-green.svg',
    BASEPATH +  'assets/images/prod-red.svg',
    BASEPATH +  'assets/images/basket-citrus.svg',
    BASEPATH +  'assets/images/basket-berry.svg',
    BASEPATH +  'assets/images/basket-green.svg',
    BASEPATH +  'assets/images/basket-red.svg'
];

self.addEventListener('install', function(event) {
  // Cache everything in CACHED_URLS. Installation will fail if something fails to cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);
  if (requestURL.pathname === BASEPATH + 'index.html') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('index.html').then(function(cachedResponse) {
          var fetchPromise = fetch('index.html').then(function(networkResponse) {
            cache.put('index.html', networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  } else if (
    CACHED_URLS.includes(requestURL.href) ||
    CACHED_URLS.includes(requestURL.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        })
      })
    );
  }
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.startsWith('JuiceBoxCache') && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
