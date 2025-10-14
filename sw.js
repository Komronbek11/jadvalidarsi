// Имя кэша. Меняйте его, когда обновляете файлы, чтобы SW обновил кэш.
const CACHE_NAME = 'schedule-cache-v2';

// Список файлов, которые нужно кэшировать для работы офлайн.
// Добавьте сюда все важные CSS, JS, иконки и основной HTML файл.
const urlsToCache = [
  '/', // Главная страница (index.html)
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=DM+Sans:wght@500;700&display=swap',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js',
  'https://raw.githubusercontent.com/Komronbek11/jadvalidarsi/refs/heads/main/neon2.jpg',
    'sky.jpg',
    'neon1.jpg',
    'neon2.jpg',
    'https://raw.githubusercontent.com/Komronbek11/jadvalidarsi/refs/heads/main/neon2.jpg',
    // Иконки для PWA
    'icons/icon-192x192.png',
    'icons/icon-512x512.png',
    'raspisanie.png'
    'https://raw.githubusercontent.com/Komronbek11/jadvalidarsi/refs/heads/main/raspisanie.png'
    // Пример иконки, добавьте свои
  // Добавьте другие важные ассеты, если они есть
];

// 1. Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Установка');
  // Ждем, пока все ресурсы из urlsToCache будут загружены и закэшированы.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэширование основных файлов');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('Ошибка при кэшировании:', err);
      })
  );
  // Принудительно активируем новый SW сразу после установки
  self.skipWaiting();
});

// 2. Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Активация');
  event.waitUntil(
    // Получаем все имена кэшей
    caches.keys().then((cacheNames) => {
      return Promise.all(
        // Удаляем старые кэши, которые не совпадают с текущим CACHE_NAME
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
});

// 3. Перехват запросов (Fetch)
self.addEventListener('fetch', (event) => {
  // Мы не кэшируем запросы к Firebase, они всегда должны идти в сеть
  if (event.request.url.includes('firebasedatabase.app')) {
    return;
  }

  // Стратегия "Кэш, затем сеть" (Cache-First)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Если ресурс есть в кэше, отдаем его
        if (cachedResponse) {
          return cachedResponse;
        }

        // Если ресурса нет в кэше, пытаемся загрузить его из сети
        return fetch(event.request).then((networkResponse) => {
            // Клонируем ответ, так как его можно прочитать только один раз
            const responseToCache = networkResponse.clone();
            
            // Открываем наш кэш и сохраняем новый ресурс
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            // Возвращаем ответ браузеру
            return networkResponse;
          })
          .catch(() => {
            // Если сеть недоступна, можно вернуть "запасной" офлайн-ресурс,
            // например, специальную офлайн-страницу.
            // В данном случае, если файла нет в кэше и сети, будет ошибка.
            console.log('Не удалось загрузить ресурс: ни в кэше, ни в сети.');
          });
      })
  );
});
