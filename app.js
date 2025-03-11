if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker зарегистрирован: ', registration);
            })
            .catch((error) => {
                console.log('Ошибка при регистрации Service Worker: ', error);
            });
    });
}
let deferredPrompt;
const installButton = document.getElementById('installButton'); // Кнопка для установки

window.addEventListener('beforeinstallprompt', (e) => {
    // Предотвращаем стандартное поведение
    e.preventDefault();
    deferredPrompt = e;

    // Показываем кнопку для установки
    installButton.style.display = 'block';

    installButton.addEventListener('click', () => {
        // Показываем диалог установки
        deferredPrompt.prompt();

        deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Пользователь установил приложение');
                } else {
                    console.log('Пользователь отклонил установку');
                }
                deferredPrompt = null;
            });
    });
});

