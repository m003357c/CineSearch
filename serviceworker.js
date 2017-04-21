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
    'https://code.jquery.com/jquery-3.2.1.slim.min.js'
  // Images
    BASEPATH + 'assets/images/fantastic-thumb.jpg',
    BASEPATH + 'assets/images/strange-thumb.jpg',
    BASEPATH + 'assets/images/arrival-thumb.jpg',
    BASEPATH + 'assets/images/rogue-thumb.jpg',
    BASEPATH + 'assets/images/passenger-thumb.jpg',
    BASEPATH + 'assets/images/sully-thumb.jpg',
    BASEPATH + 'assets/images/maona-thumb.jpg',
    BASEPATH + 'assets/images/assassin-thumb.jpg'
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
  } else if (requestURL.pathname === BASE_PATH + 'js/films.json') {
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
  } else if (requestURL.pathname === BASE_PATH + 'js/cinemas.json') {
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
