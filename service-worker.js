const CACHE_NAME = 'unicorn-numbers-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/translations.js',
  '/game.js',
  '/manifest.json',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/images/background.jpg',
  // Audio files
  '/assets/audio/en/0.mp3',
  '/assets/audio/en/1.mp3',
  '/assets/audio/en/2.mp3',
  '/assets/audio/en/3.mp3',
  '/assets/audio/en/4.mp3',
  '/assets/audio/en/5.mp3',
  '/assets/audio/en/6.mp3',
  '/assets/audio/en/7.mp3',
  '/assets/audio/en/8.mp3',
  '/assets/audio/en/9.mp3',
  '/assets/audio/de/0.mp3',
  '/assets/audio/de/1.mp3',
  '/assets/audio/de/2.mp3',
  '/assets/audio/de/3.mp3',
  '/assets/audio/de/4.mp3',
  '/assets/audio/de/5.mp3',
  '/assets/audio/de/6.mp3',
  '/assets/audio/de/7.mp3',
  '/assets/audio/de/8.mp3',
  '/assets/audio/de/9.mp3',
  // Sound effects
  '/assets/audio/effects/correct-answer.mp3',
  '/assets/audio/effects/wrong-answer.mp3',
  '/assets/audio/effects/transition.mp3',
  '/assets/audio/effects/game-complete.mp3',
  // Root-level icons
  '/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon.ico',
  // Reward unicorn images
  '/assets/rewards/01_luna.jpg',
  '/assets/rewards/02_stella.jpg',
  '/assets/rewards/03_aurora.jpg',
  '/assets/rewards/04_nova.jpg',
  '/assets/rewards/05_ginger.jpg',
  '/assets/rewards/06_sunny.jpg',
  '/assets/rewards/07_pixie.jpg',
  '/assets/rewards/08_rainbow.jpg',
  '/assets/rewards/09_snowflake.jpg',
  '/assets/rewards/10_starlight.jpg',
  '/assets/rewards/11_donna.jpg',
  '/assets/rewards/12_sparkle.jpg',
  '/assets/rewards/13_dreamy.jpg',
  '/assets/rewards/14_magic.jpg',
  '/assets/rewards/15_elsa.jpg',
  // External resources (CDN)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Comic+Neue:wght@400;700&family=Fredoka:wght@400;600&family=Nunito:wght@400;700;900&family=Poppins:wght@400;600;800&display=swap',
]

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...')
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell')
        return cache.addAll(
          urlsToCache.map(
            url => new Request(url, { credentials: 'same-origin' })
          )
        )
      })
      .then(() => {
        console.log('Service Worker: Cache complete')
        return self.skipWaiting()
      })
      .catch(err => {
        console.error('Service Worker: Cache failed', err)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...')
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cache)
              return caches.delete(cache)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Ready to handle fetches')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (
    !event.request.url.startsWith(self.location.origin) &&
    !event.request.url.startsWith('https://cdn.tailwindcss.com') &&
    !event.request.url.startsWith('https://fonts.googleapis.com')
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version or fetch from network
      if (response) {
        console.log('Service Worker: Serving from cache:', event.request.url)
        return response
      }

      console.log('Service Worker: Fetching from network:', event.request.url)
      return fetch(event.request)
        .then(response => {
          // Don't cache if not a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response
          }

          // Clone the response for caching
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Fallback for offline HTML requests
          if (event.request.destination === 'document') {
            return caches.match('/index.html')
          }
        })
    })
  )
})

// Handle background sync for when connection is restored
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync')
    event.waitUntil(
      // Add any background sync logic here
      Promise.resolve()
    )
  }
})

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
      actions: [
        {
          action: 'explore',
          title: 'Play Game',
          icon: '/assets/icons/icon-192x192.png',
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/assets/icons/icon-192x192.png',
        },
      ],
    }

    event.waitUntil(
      self.registration.showNotification('Unicorn Numbers', options)
    )
  }
})

// Handle notification click
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification click received.')

  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'))
  }
})
