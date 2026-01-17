// =====================
// CONSTANTS
// =====================
const WIDTH = 600;
const HEIGHT = 600;

const CELL_SIZE = 30;        // LOGIC size (movement & collisions)
const SNAKE_SCALE = 1.4;     // VISUAL scale only
const HEAD_SCALE = 1.2;
const SPEED = 220;

// =====================
// CANVAS SETUP
// =====================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

// =====================
// START POSITION
// =====================
const START_X = Math.floor(WIDTH / 2 / CELL_SIZE) * CELL_SIZE;
const START_Y = Math.floor(HEIGHT / 2 / CELL_SIZE) * CELL_SIZE;

// =====================
// GAME STATE
// =====================
let snake = [
    { x: START_X, y: START_Y },
    { x: START_X - CELL_SIZE, y: START_Y },
    { x: START_X - CELL_SIZE * 2, y: START_Y }
];

let direction = { x: CELL_SIZE, y: 0 };
let food = randomPosition();
let lastTime = 0;

// =====================
// RESPONSIVE CANVAS
// =====================
function resizeCanvas() {
    const displaySize = Math.min(window.innerWidth * 0.9, 600);
    canvas.style.width = displaySize + "px";
    canvas.style.height = displaySize + "px";
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// =====================
// IMAGES
// =====================
const bgImg = new Image();
bgImg.src = "assets/gym.png";

const headImg = new Image();
headImg.src = "assets/head.png";

const bodyImg = new Image();
bodyImg.src = "assets/body.png";

const foodImg = new Image();
foodImg.src = "assets/food.png";

// =====================
// PRELOAD IMAGES
// =====================
let imagesLoaded = 0;
const images = [bgImg, headImg, bodyImg, foodImg];

images.forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
            requestAnimationFrame(gameLoop);
        }
    };
});

// =====================
// INPUT
// =====================
document.addEventListener("keydown", e => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();

    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -CELL_SIZE };
    if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: CELL_SIZE };
    if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -CELL_SIZE, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0) direction = { x: CELL_SIZE, y: 0 };
});

// =====================
// FOOD
// =====================
function randomPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH / CELL_SIZE) * CELL_SIZE,
        y: Math.floor(Math.random() * HEIGHT / CELL_SIZE) * CELL_SIZE
    };
}

// =====================
// GAME LOOP
// =====================
function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;

    if (timestamp - lastTime > SPEED) {
        lastTime = timestamp;

        // -----------------
        // MOVE SNAKE
        // -----------------
        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };
        snake.unshift(newHead);

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
            food = randomPosition();
        } else {
            snake.pop();
        }

        // Collision
        if (
            newHead.x < 0 || newHead.x >= WIDTH ||
            newHead.y < 0 || newHead.y >= HEIGHT ||
            snake.slice(1).some(p => p.x === newHead.x && p.y === newHead.y)
        ) {
            snake = [
                { x: START_X, y: START_Y },
                { x: START_X - CELL_SIZE, y: START_Y },
                { x: START_X - CELL_SIZE * 2, y: START_Y }
            ];
            direction = { x: CELL_SIZE, y: 0 };
        }

        // -----------------
        // DRAW
        // -----------------
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Background
        ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

        // Food
        const foodScale = 1.2;
        const foodSize = CELL_SIZE * foodScale;
        const foodOffset = (foodSize - CELL_SIZE) / 2;

        ctx.drawImage(
            foodImg,
            food.x - foodOffset,
            food.y - foodOffset,
            foodSize,
            foodSize
        );

        // Snake head
        const headSize = CELL_SIZE * SNAKE_SCALE * HEAD_SCALE;
        const headOffset = (headSize - CELL_SIZE) / 2;

        ctx.drawImage(
            headImg,
            snake[0].x - headOffset,
            snake[0].y - headOffset,
            headSize,
            headSize
        );

        // Snake body
        const bodySize = CELL_SIZE * SNAKE_SCALE;
        const bodyOffset = (bodySize - CELL_SIZE) / 2;

        for (let i = 1; i < snake.length; i++) {
            ctx.drawImage(
                bodyImg,
                snake[i].x - bodyOffset,
                snake[i].y - bodyOffset,
                bodySize,
                bodySize
            );
        }
    }

    requestAnimationFrame(gameLoop);
}
