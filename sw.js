var CACHE_NAME = 'axa-travel-v0.4';
var CACHE_VERSION = 1;

var filesToCache = [
  '/',
  '/index.ejs',
  '/css/styles.css',
  '/js/app.js',
  '/views/index.ejs',
  '/views/payment-status.ejs',
  '/images/icons/icon-48.png',
  '/images/icons/icon-96.png',
  '/images/icons/icon-192.png',
  '/images/icons/icon-512.png'
];

self.oninstall = function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
};

self.onactivate = function(event) {
  var currentCacheName = CACHE_NAME + '-v' + CACHE_VERSION;
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        if (cacheName.indexOf(CACHE_NAME) == -1) {
          return;
        }

        if (cacheName != currentCacheName) {
          return caches.delete(cacheName);
        }
      })
    );
  });
};

self.onfetch = function(event) {
  var request = event.request;
  event.respondWith(
    caches.match(request).then(function(response) {
      if (response) {
         return response;
      }

      return fetch(request).then(function(response) {
        var responseToCache = response.clone();
        caches.open(CACHE_NAME + '-v' + CACHE_VERSION).then(
          function(cache) {
            cache.put(request, responseToCache).catch(function(err) {
              console.warn(request.url + ': ' + err.message);
            });
          });
        return response;
      });
    })
  );
};


// Communicate via MessageChannel.
self.addEventListener('message', function(event) {
  console.log(`Received message from main thread: ${event.data}`);
  event.ports[0].postMessage(`Got message! Sending direct message back - "${event.data}"`);
});

// Broadcast via postMessage.
function sendMessage(message) {
  self.clients.matchAll().then(function(clients) {
    clients.map(function(client) {
      return client.postMessage(message);
    })
  });
}

/*
  PUSH EVENT:
    will be triggered when a push notification is received
*/

//To send notification to client
self.addEventListener('push', function(event) {
  console.log('Event: Push', event);

  var title = 'Stand a chance to win a Samsonite Bag!';
  var body = 'When you buy travel insurance from axa';
  var tag = 'demo';
  var icon = '/images/icons/icon-192.png';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      tag: tag,
      icon: icon
    })
  );
});

/*
  NOTIFICATION EVENT:
    Will be triggered when user click the notification
*/

//On click event for notification to close
self.addEventListener('notificationclick', function(event) {
  console.log('Notification is clicked ', event);
  event.notification.close();
  var notification = event.notification;
  var action = event.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('https://axamy-google-hackathon-2017.herokuapp.com/');
    notification.close();
  }
});

