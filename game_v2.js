const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Logical canvas size
const WIDTH = 600;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const CELL_SIZE = 50;
const HEAD_SCALE = 1.2;
const SPEED = 220;

// Responsive display scaling
function resizeCanvas() {
    const displaySize = Math.min(window.innerWidth * 0.9, 600);
    canvas.style.width = displaySize + "px";
    canvas.style.height = displaySize + "px";
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Load images
const bgImg = new Image();
bgImg.src = "assets/gym.png";

const headImg = new Image();
headImg.src = "assets/head.png";

const bodyImg = new Image();
bodyImg.src = "assets/body.png";

const foodImg = new Image();
foodImg.src = "assets/food.png";

// Preload all images before starting game
let imagesLoaded = 0;
const images = [bgImg, headImg, bodyImg, foodImg];
images.forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === images.length) {
            requestAnimationFrame(gameLoop); // start game
        }
    };
});

// Snake and food
let snake = [
    { x: 300, y: 300 },
    { x: 270, y: 300 },
    { x: 240, y: 300 }
];
let direction = { x: CELL_SIZE, y: 0 };
let food = randomPosition();

// Keyboard controls
document.addEventListener("keydown", e => {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
    if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -CELL_SIZE };
    if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: CELL_SIZE };
    if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -CELL_SIZE, y: 0 };
    if (e.key === "ArrowRight" && direction.x === 0) direction = { x: CELL_SIZE, y: 0 };
});

// Mobile swipe controls
let touchStartX = 0, touchStartY = 0;
const SWIPE_THRESHOLD = 30;

canvas.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: false });

canvas.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

canvas.addEventListener("touchend", e => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction.x === 0) direction = { x: CELL_SIZE, y: 0 };
        if (dx < 0 && direction.x === 0) direction = { x: -CELL_SIZE, y: 0 };
    } else {
        if (dy > 0 && direction.y === 0) direction = { x: 0, y: CELL_SIZE };
        if (dy < 0 && direction.y === 0) direction = { x: 0, y: -CELL_SIZE };
    }
}, { passive: false });

// Random food position
function randomPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH / CELL_SIZE) * CELL_SIZE,
        y: Math.floor(Math.random() * HEIGHT / CELL_SIZE) * CELL_SIZE
    };
}

// Game loop using requestAnimationFrame for smooth rendering
let lastTime = 0;
function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    if (timestamp - lastTime > SPEED) {
        lastTime = timestamp;

        // Draw background
        ctx.drawImage(bgImg, 0, 0, WIDTH, HEIGHT);

        // Move snake
        const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
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
            // alert("Sem SabOOOR :c");
            snake = [
                { x: 300, y: 300 },
                { x: 270, y: 300 },
                { x: 240, y: 300 }
            ];
            direction = { x: CELL_SIZE, y: 0 };
        }

        // Draw food
        ctx.drawImage(foodImg, food.x, food.y, CELL_SIZE, CELL_SIZE);

        // Draw snake head
        const headSize = CELL_SIZE * HEAD_SCALE;
        const headOffset = (headSize - CELL_SIZE) / 2;
        ctx.drawImage(headImg, snake[0].x - headOffset, snake[0].y - headOffset, headSize, headSize);

        // Draw snake body
        for (let i = 1; i < snake.length; i++) {
            ctx.drawImage(bodyImg, snake[i].x, snake[i].y, CELL_SIZE, CELL_SIZE);
        }
    }

    requestAnimationFrame(gameLoop);
}





