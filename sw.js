const cacheName = 'static-cache'

self.addEventListener('install', evt => {
  // console.log("install: " + evt)
  const cachePromise = caches.open(cacheName).then(cache => {
    return cache.addAll([['views/index.pug', 'views/login.pug']])
  })
  evt.waitUntil(cachePromise)
})

// self.addEventListener('install', event => {
//   console.info('Event: install')
//   event.waitUntil(
//     caches
//       .open('static-cache')
//       .then(cache => cache.addAll(['views/index.pug', 'views/login.pug']))
//       .then(() => {
//         console.info('All files cached')
//         return self.skipWaiting()
//       })
//       .catch(err => {
//         console.error('failed to cache', err)
//       })
//   )
// })

// self.addEventListener( )

self.addEventListener('activate', evt => {
  console.log('active: ' + evt)
  const cacheCleanedPromise = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== cacheName) {
        return caches.delete(key)
      }
    })
  })
  evt.waitUntil(cacheCleanedPromise)
})
self.addEventListener('fetch', evt => {
  if (!navigator.onLine) {
    const headers = { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    evt.respondWith(
      new Response(
        "<h1  class='alert alert-error'>Pas de connexion </h1><p>Veuillez vous reconnecter<p> ",
        headers
      )
    )
  }
  console.log('url:', evt.request.url)
  evt.respondWith(
    caches.match(evt.request).then(res => {
      if (res) {
        console.log(`fetched url: ${evt.request.url} ${res}`)
        // console.log(res)
        return res
      }
      return fetch(evt.request).then(newRes => {
        console.log(
          `url récupérée sur le réseau puis mise en cache: ${evt.request.url} ${newRes}`
        )
        caches.open(cacheName).then(cache => cache.put(evt.request, newRes))
        return newRes.clone()
      })
    })
  )
})
const options = {
  body: 'Je suis persistante'
  // icon: 'icon/apple-icon-76x76-dunplab-manifest-32518.png'
}
self.registration.showNotification('notification coté service worker', options)

self.addEventListener('notificationclose', evt => {
  console.log('notification fermée', evt)
})

// self.addEventListener('activate', event => {
//   console.info('event: activate')

//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cache => {
//           if (cache != 'static-cache') return caches.delete(cache)
//         })
//       )
//     })
//   )
// })

// self.addEventListener('fetch', event => {
//   console.info('event: fetch')
//   const request = event.request

//   event.respondWith(
//     caches.match(request).then(response => {
//       if (response) return response

//       return fetch(request).then(response => {
//         const responseToCache = response.clone()
//         cache.open('static-cache').then(cache => {
//           cache
//             .put(request, responseToCache)
//             .catch(err => console.warn(`${request.url}: ${err.message}`))
//         })
//         return response
//       })
//     })
//   )
// })
