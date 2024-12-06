const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playerImage = document.getElementById("Doodle-guy");
const platformImage = document.getElementById("platform");
const url = "https://kool.krister.ee/chat/doodle-jump";
const backgroundMusic = new Audio("backround-music.mp3");
const jumpSound = new Audio("jumpSound.mp3");
const gameOverSound = new Audio("gameOverSound.mp3");
backgroundMusic.volume = 0.5;
jumpSound.volume = 0.2; // Устанавливаем громкость (от 0 до 1)
gameOverSound.volume = 0.2;

async function fetchScore() {
    let Highscore = 0;
    const response = await fetch(url);
    const data = await response.json();
    const element = document.querySelector("#hiscore");

    for (const item of data) {
        const ns = item.score;
        if (Highscore < ns) {
            Highscore = item.score;
        }
    }
    element.innerHTML = "<p>" + "High score: " + Highscore + "</p>";
}

async function sendScoreToServer() {
    const playerData = {
        name: userName,   // Имя игрока
        score: score      // Счёт игрока
    };

    await fetch(url, {
        method: "POST", // Отправка данных на сервер
        headers: {
            "Content-Type": "application/json" // Указываем, что отправляем данные в JSON-формате
        },
        body: JSON.stringify(playerData) // Преобразуем объект в JSON строку
    });
}

const platformWidth = 15;
const platformHeight = 2.5;

let touchInterval = null;

let player = {
    x: canvas.width / 2,
    y: canvas.height - 25,
    width: 15,
    height: 15,
    speedY: 0,
    gravity: 0.08,
    jumpStrength: -2.99
};

let platforms = [];
let gameOver = false;
let gameStarted = false;
let score = 0;
let userName = prompt("Enter your name");

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

function checkGameOver() {
    if (player.y > canvas.height) {
        endGame();
    }
}

function endGame() {
    gameOver = true;
    gameStarted = false;
    document.getElementById("gameOverScreen").style.display = "flex";
    sendScoreToServer();
    backgroundMusic.pause();  // Останавливаем фоновую музыку
    gameOverSound.play();  // Запуск звука окончания игры
    cancelAnimationFrame(update); // Останавливаем обновление игры
}

function retryGame() {
    gameOver = false;
    score = 0;
    player = {
        x: canvas.width / 2,
        y: canvas.height - 25,
        width: 15,
        height: 15,
        speedY: 0,
        gravity: 0.08,
        jumpStrength: -2.99
    };
    platforms = [];
    createInitialPlatform();
    initPlatforms();
    updateScoreDisplay();
    document.getElementById("gameOverScreen").style.display = "none";
    backgroundMusic.currentTime = 0;  // Устанавливаем время воспроизведения в 0 (сначала)
    backgroundMusic.play();  // Запуск музыки с начала
    startGame();
}

document.getElementById("retryButton").addEventListener("click", retryGame);

let move = 0

// Обновление игры
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameOver) return; // Остановить обновление, если игра окончена

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
            jumpSound.play();  // Воспроизведение звука прыжка
        }
    });

    player

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

    player.x += move
    drawPlayer();
    drawPlatforms();
    checkGameOver(); // Проверка на завершение игры

    if (!gameOver) requestAnimationFrame(update); // Вызываем только один раз
}

// Обновление счёта
function updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${score}`;
}



window.addEventListener("keydown", (event) => {
    if (gameOver) {
        // Если игра закончена, можно нажимать "R" для перезапуска игры
        if (event.key === "r" || event.key === "R") {
            retryGame();
        }
    } else if (event.key === "p" || event.key === "P") {
        // Если игра не началась, можно нажимать "P" для начала игры
        startGame();
    }

    // Управление движением игрока
    if (gameStarted) {
        switch (event.key) {
            case "ArrowLeft":
                move = -2;
                break;
            case "ArrowRight":
                move = 2;
                break;
        }
    }
});
window.addEventListener("keyup", (event) => {
    move = 0
});

// Запуск игры
function startGame() {
    fetchScore();
    gameStarted = true;
    player.speedY = player.jumpStrength;
    update();
    backgroundMusic.play();
    document.getElementById("gameStarted").style.display = "none";
}

// Инициализация игры
function initGame() {
    createInitialPlatform();
    initPlatforms();
    drawPlayer();
    drawPlatforms();
    document.getElementById("gameOverScreen").style.display = "none"; // Скрываем экран
    gameOver = false; // Сбрасываем статус Game Over
}

// Кнопка "Начать"
document.getElementById("gameStarted").addEventListener("click", startGame);

// Загружаем изображения и инициализируем игру
playerImage.onload = platformImage.onload = initGame;
