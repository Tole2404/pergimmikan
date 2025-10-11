// PERGIMMIKAN Service Worker File

// Nama cache dan versi untuk memudahkan update
const CACHE_NAME = 'pergimmikan-cache-v1';

// Aset yang akan di-cache saat install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/images/logo_gimik.png',
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching all assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Menghapus cache lama:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Mengambil alih halaman yang sudah terbuka
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch assets dan strategi caching
self.addEventListener('fetch', (event) => {
  // Abaikan request non-GET
  if (event.request.method !== 'GET') return;

  // Abaikan request ke API, admin, atau URL lain yg tidak perlu di-cache
  if (event.request.url.includes('/api/') || event.request.url.includes('/admin/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Gunakan cache jika tersedia
      if (cachedResponse) {
        return cachedResponse;
      }

      // Buat clone request untuk dapat digunakan beberapa kali
      const fetchRequest = event.request.clone();

      // Ambil resource dari network
      return fetch(fetchRequest)
        .then((response) => {
          // Pastikan response valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response untuk disimpan ke cache dan dikembalikan ke browser
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Jika offline, cek apakah request untuk HTML
          if (event.request.headers.get('Accept')?.includes('text/html')) {
            // Berikan halaman offline
            return caches.match('/offline.html');
          }

          // Untuk gambar, gunakan placeholder
          if (event.request.destination === 'image') {
            return caches.match('/images/offline-image.png');
          }

          // Untuk kasus lain, tidak ada fallback khusus
          return new Response('Konten tidak tersedia dalam mode offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
    })
  );
});

// Menerima pesan dari main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
