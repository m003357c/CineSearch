var CACHE_NAME = 'CineCache';
var BASEPATH = '/CineSearch/';
var CACHED_URLS = [
  // Our HTML
    BASEPATH + 'index.html',
  // Stylesheets and fonts    
    BASEPATH +  'css/styles.css',
    'https://fonts.googleapis.com/css?family=Roboto:400,300',
  // JavaScript
    BASEPATH +  'assets/icons/manifest.json',
    BASEPATH +  'js/films.json',
    BASEPATH +  'js/cinemas.json',
    BASEPATH +  'js/script.js',
    'https://code.jquery.com/jquery-3.2.1.min.js',
  // Images
    BASEPATH + 'assets/images/fantastic-thumb.jpg',
    BASEPATH + 'assets/images/strange-thumb.jpg',
    BASEPATH + 'assets/images/arrival-thumb.jpg',
    BASEPATH + 'assets/images/rogue-thumb.jpg',
    BASEPATH + 'assets/images/passenger-thumb.jpg',
    BASEPATH + 'assets/images/sully-thumb.jpg',
    BASEPATH + 'assets/images/moana-thumb.jpg',
    BASEPATH + 'assets/images/assassin-thumb.jpg',
    BASEPATH + 'assets/images/location.png',
    BASEPATH + 'assets/images/back.png',
    //App Icons
    BASEPATH + 'assets/icons/android-icon-144x144.png',
    BASEPATH + 'assets/icons/android-icon-192x192.png',
    BASEPATH + 'assets/icons/android-icon-36x36.png',
    BASEPATH + 'assets/icons/android-icon-48x48.png',
    BASEPATH + 'assets/icons/android-icon-72x72.png',
    BASEPATH + 'assets/icons/android-icon-96x96.png',
    BASEPATH + 'assets/icons/apple-icon-114x114.png',
    BASEPATH + 'assets/icons/apple-icon-120x120.png',
    BASEPATH + 'assets/icons/apple-icon-144x144.png',
    BASEPATH + 'assets/icons/apple-icon-152x152.png',
    BASEPATH + 'assets/icons/apple-icon-180x180.png',
    BASEPATH + 'assets/icons/apple-icon-57x57.png',
    BASEPATH + 'assets/icons/apple-icon-60x60.png',
    BASEPATH + 'assets/icons/apple-icon-72x72.png',
    BASEPATH + 'assets/icons/apple-icon-76x76.png',
    BASEPATH + 'assets/icons/apple-icon-precomposed.png',
    BASEPATH + 'assets/icons/apple-icon.png',
    BASEPATH + 'assets/icons/favicon-16x16.png',
    BASEPATH + 'assets/icons/favicon-32x32.png',
    BASEPATH + 'assets/icons/favicon-96x96.png',
    BASEPATH + 'assets/icons/favicon.ico',
    BASEPATH + 'assets/icons/ms-icon-144x144.png',
    BASEPATH + 'assets/icons/ms-icon-150x150.png',
    BASEPATH + 'assets/icons/ms-icon-310x310.png',
    BASEPATH + 'assets/icons/ms-icon-70x70.png',
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
  // Handle requests for events JSON file
  } else if ((requestURL.pathname === BASEPATH + 'js/films.json') || (requestURL.pathname === BASEPATH + 'js/cinemas.json')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(function() {
          return caches.match(event.request);
        });
      })
    );
  // Handle requests for event images.
  } else if (requestURL.pathname.includes('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(cacheResponse) {
          return cacheResponse||fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(function() {
            return cache.match('assets/images/cine-placeholder.png');
          });
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
          if (cacheName.startsWith('CineCache') && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
