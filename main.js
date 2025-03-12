document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
    }
});
    
document.addEventListener("keydown", function (e) {
    if (e.key === "PrintScreen") {
        e.preventDefault();
        alert("Скриншот запрещен!");
    }
    if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        alert("Сохранение страницы запрещено!");
    }
});

document.addEventListener("keyup", function (e) {
    if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("Скриншот запрещен!");
    }
});

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    alert("Контекстное меню отключено!");
});

navigator.mediaDevices.addEventListener("devicechange", function () {
    alert("Обнаружена попытка записи экрана!");
});
