const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const parentEI = document.getElementById("parentEI");


var playerImage = document.createElement('img') ;
playerImage.src = "doodler-guy.png";
playerImage.alt = "doodler guy";
parentEI.appendChild(img);
var platformImage = document.createElement('img');
platformImage.src = "platform.png";
platformImage.alt = "platform"

let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    speedY: 0
};

let platforms = [];
const platformCount = 5

function createPlatform(x, y) {
    return {
        x: x,
        y: y,
        width: platformWidth,
        height: platformHeight,
    };
}

function initPlatforms() {
    for (let i = 0; i < platformCount; i++) {
        let x = Math.random() * (canvas.width - platformWidth);
        let y = i * (canvas.height / platformCount);
        platforms.push(createPlatform(x, y));
    }
}

function drawplatforms() {
    platforms.forEach(platform => {
       ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height) 
    });
};

platformImage.onlload = function() {
    initPlatforms();
    update();
};

let x = 100;
let y = 100;

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.y += player.speedY;
    ctx.drawImage(playerImage, x, y, 50, 50);
    drawplatforms();
    x += 1;
    y += 1;
    requestAnimationFrame(update);
}
  
playerImage.onload = function() {
    initPlatforms();
    update();
}

window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        y -= 5;
        break;
      case "ArrowDown":
        y += 5;
        break;
      case "Arrowleft":
        x -= 5;
        break;
      case "ArrowRight":
        x += 5;
        break;
    }   
});

let score = 0;

function increaseScore(points) {
    score += points;
    updateScoreDisplay();
}

function updateScoreDisplay() {
        const scoreElement = document.getElementById("score");
        scoreElement.textContent = `score> ${score} `;    
}
