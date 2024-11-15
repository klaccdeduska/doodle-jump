const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// canvas - элемент для рисования. ctx - засчёт чего мы рисуем.
const playerImage = document.getElementById("Doodle-guy");
const platformImage = document.getElementById("platform");
// изображения для игрока и платформ.

const platformWidth = 15;
const platformHeight = 2.5;
// Устанавливаются стандартные размеры платформ (ширина и высота).

let player = {
    x: canvas.width / 2, // координаты игрока
    y: canvas.height - 25, // координаты игрока
    width: 15,
    height: 15,
    speedY: 0, // вертикальная скорость игрока (для гравитации и прыжков).
    gravity: 0.1, // сила гравитации (ускоряет падение игрока).
    jumpStrength: -2.99 // сила, с которой игрок отталкивается от платформ.
};

let platforms = [];
// platforms — вещь, хранящая все платформы в игре
let gameStarted = false; // вещь, показывающая, началась ли игра.
let score = 0; // счёт игрока.

 // Создаётся начальная платформа под игроком, чтобы он не падал сразу.
function createInitialPlatform() {
    const platform = {
        x: player.x - (platformWidth - player.width) / 2, // Выравниваем по центру игрока
        y: player.y + player.height,                      // Платформа под игроком
        width: platformWidth,
        height: platformHeight,
    };
    platforms.push(platform);
}

// Создаёт платформу на указанных координатах
function createPlatform(x, y) {
    return { x, y, width: platformWidth, height: platformHeight };
}

// Инициализация платформ
function initPlatforms() {
    for (let i = 0; i < 70; i++) {
// Генерируются 70 платформ на случайных горизонтальных позициях.
        let x = Math.random() * (canvas.width - platformWidth);
        let y = canvas.height - (i * 20);  // Равномерное размещение платформ снизу вверх
        platforms.push(createPlatform(x, y));
    }
}

// Отрисовка платформ
function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
    });
}

// Отрисовка игрока
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Обновление игры
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Применяем гравитацию и обновляем позицию игрока только если игра началась
    if (gameStarted) {
        player.speedY += player.gravity;
        player.y += player.speedY;
    }

    // Проверка столкновения с платформами
    platforms.forEach(platform => {
        if (
            player.y + player.height >= platform.y &&
            player.y + player.height <= platform.y + platform.height &&
            player.x + player.width >= platform.x &&
            player.x <= platform.x + platform.width
        ) {
            player.speedY = player.jumpStrength;  // Прыжок вверх при столкновении
        }
    });

    // Если игрок поднимается выше середины экрана, сдвигаем все платформы вниз
    if (player.y < canvas.height / 2) {
        const displacement = canvas.height / 2 - player.y;
        player.y = canvas.height / 2;

        // Сдвигаем платформы вниз и создаём новые сверху
        platforms.forEach(platform => platform.y += displacement);

        // Удаляем платформы, вышедшие за нижний край экрана
        platforms = platforms.filter(platform => platform.y < canvas.height);

        // Добавляем новые платформы сверху
        while (platforms.length < 5) {
            let x = Math.random() * (canvas.width - platformWidth);
            let y = -platformHeight;  // Новая платформа за верхним краем
            platforms.push(createPlatform(x, y));
        }

        // Увеличиваем счёт за каждый пройденный сегмент
        score += 10;
        updateScoreDisplay();
    }

    drawPlayer();
    drawPlatforms();
    requestAnimationFrame(update);
}

// Обновление счёта
function updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${score}`;
}

window.addEventListener("keydown", (event) => {
    if (!gameStarted) return; // Игнорировать нажатия, если игра не началась

    switch (event.key) {
        case "ArrowUp":
            player.y -= 5;
            break;
        case "ArrowDown":
            player.y += 5;
            break;
        case "ArrowLeft":
            player.x -= 5;
            break;
        case "ArrowRight":
            player.x += 5;
            break;
    }
});

// Запуск игры
function startGame() {
    gameStarted = true;
    player.speedY = player.jumpStrength;
    update();
}

// Инициализация игры
function initGame() {
    createInitialPlatform();
    initPlatforms();
    drawPlayer();
    drawPlatforms();
}

// Кнопка "Начать"
document.getElementById("gameStarted").addEventListener("click", startGame);

// Загружаем изображения и инициализируем игру
playerImage.onload = platformImage.onload = initGame;
