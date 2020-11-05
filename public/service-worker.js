const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';
//files for serviceworker to cache
const FILES_TO_CACHE = [
    '/',
    '/db.js',
    '/index.html',
    '/index.js',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
    

];

// install
self.addEventListener('install', function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log('Your files were pre-cached successfully!');
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });

//fetch
self.addEventListener('fetch', function(evt) {
  console.log(caches);
    if (evt.request.url.includes('/api/')) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
              return response;
            })
        })
      );
  
      return;
    }
   
  });
  