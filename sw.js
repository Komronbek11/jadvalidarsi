const CACHE_NAME = 'schedule-app-cache-v1';
// Добавьте сюда все файлы, которые должны работать офлайн
const urlsToCache = [
    '/',
    'index.html',
    'fakultet.html', // Добавьте другие HTML страницы, если они есть
    'profile.html',
    'contact.html',
    // Изображения для тем
    'sky.jpg',
    'neon1.jpg',
    'neon2.jpg',
    // Иконки для PWA
    'icons/icon-192x192.png',
    'icons/icon-512x512.png',
    // Внешние ресурсы (CDN)
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://cdn.jsdelivr.net/npm/alpinejs@3.13.10/dist/cdn.min.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=DM+Sans:wght@500;700&display=swap'
];

// Установка Service Worker и кэширование всех ресурсов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching assets');
                return cache.addAll(urlsToCache);
            })
    );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Перехват сетевых запросов
self.addEventListener('fetch', event => {
    // Используем стратегию "Cache first, then network"
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Если ресурс есть в кэше, отдаем его
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Если нет, делаем запрос к сети, кэшируем и отдаем
                return fetch(event.request).then(networkResponse => {
                    // Проверяем, что ответ корректный, прежде чем кэшировать
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                    }
                    return networkResponse;
                });
            })
            .catch(() => {
                // В случае полной ошибки можно вернуть страницу-заглушку
                // return caches.match('offline.html');
            })
    );
});
