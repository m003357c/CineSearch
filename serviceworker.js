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
    BASEPATH +  'js/offline-map.js',
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
    BASEPATH + 'assets/images/back.png'
    BASEPATH + 'assets/images/offlinemap.jpg'
];

var googleMapsAPIJS = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAIQ0fiOINDNybmeceuZqZhzKLc_0JLXpk&callback=initMap';

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
  //Handle offline Google Maps
  } else if (requestURL.href === googleMapsAPIJS) {
  event.respondWith(
    fetch(
      googleMapsAPIJS+'&'+Date.now(),
      { mode: 'no-cors', cache: 'no-store' }
    ).catch(function() {
      return caches.match('js/offline-map.js');
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
