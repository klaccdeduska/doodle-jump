const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d")
const playerImage = new Image();
playerImage.src = "doodler-guy.png";
const platformImage = new Image();
platformImage.src = "platform.png"


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
    for (let i = 0; i <
        platformCount; 1++) {
         let x = Math.random() *
            (canvaWight - platformWight);
         let y = 1 * (canvasHeght / 
       platformCount);
       platforms.push(createPlaform(x,
        y));

    }
}

function drawplatforms() {
    platforms.forEach(platform => {
       ctx.drawImage(platformImage,
    platform.x , platform.y,
    platform.width, platform.height) 
    });
};

platformImage.onlload = function() {
    initPlatforms();
    update();
};