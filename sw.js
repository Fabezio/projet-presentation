// const staticAssets = new Set(to_cache)

self.addEventListener('install', event => {
  console.info('Event: install')
  event.waitUntil(
    caches
      .open('static-cache')
      .then(cache => cache.addAll(['./']))
      .then(() => {
        console.info('All files cached')
        return self.skipWaiting()
      })
      .catch(err => {
        console.error('failed to cache', err)
      })
  )
})

// self.addEventListener( )

self.addEventListener('activate', event => {
  console.info('event: activate')

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache != 'static-cache') return caches.delete(cache)
        })
      )
    })
  )
})

self.addEventListener('fetch', event => {
  console.info('event: fetch')
  const request = event.request

  event.respondWith(
    caches.match(request).then(response => {
      if (response) return response

      return fetch(request).then(response => {
        const responseToCache = response.clone()
        cache.open('static-cache').then(cache => {
          cache
            .put(request, responseToCache)
            .catch(err => console.warn(`${request.url}: ${err.message}`))
        })
        return response
      })
    })
  )
})
