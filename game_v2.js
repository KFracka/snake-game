const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY =touch.clientY;
}, { passive: true });

canvas.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    //Determine swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
        //Horizontal swipe
        if (dx > 0 && direction.x === 0) direction = {x: CELL_SIZE, y: 0};
        if (dx < 0 && direction.x === 0) direction = {x: -CELL_SIZE, y: 0};
    } else {
        //Vertical swipe
        if (dy > 0 && direction.y === 0) direction = {x: 0, y: CELL_SIZE };
        if (dy < 0 && direction.y === 0) direction = {x: 0, y: -CELL_SIZE };
    }
}, { passive: true });
// Logical canvas size (game grid)
canvas.width = 600;
canvas.height = 600;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const CELL_SIZE = 30;
const HEAD_SCALE = 1.2; // slightly bigger than body

// Display scaling for mobile
function resizeCanvas() {
    const displaySize = Math.min(window.innerWidth * 0.9, 600);
    canvas.style.width = displaySize + "px";
    canvas.style.height = displaySize + "px";
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Load images
const headImg = new Image();
headImg.src = "assets/head.png";

const bodyImg = new Image();
bodyImg.src = "assets/body.png";

const foodImg = new Image();
foodImg.src = "assets/food.png";

// Snake
let snake = [
    { x: 300, y: 300 },
    { x: 270, y: 300 },
    { x: 240, y: 300 }
];

let direction = { x: CELL_SIZE, y: 0 };

// Food
let food = randomPosition();

// Wait for DOM to load before attaching button events
document.addEventListener("DOMContentLoaded", () => {
    // Keyboard input
    document.addEventListener("keydown", e => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.preventDefault();
        }
        
        if (e.key === "ArrowUp") direction = { x: 0, y: -CELL_SIZE };
        if (e.key === "ArrowDown") direction = { x: 0, y: CELL_SIZE };
        if (e.key === "ArrowLeft") direction = { x: -CELL_SIZE, y: 0 };
        if (e.key === "ArrowRight") direction = { x: CELL_SIZE, y: 0 };
    });

    // Mobile buttons
    document.getElementById("up").addEventListener("click", () => {
        direction = { x: 0, y: -CELL_SIZE };
    });
    document.getElementById("down").addEventListener("click", () => {
        direction = { x: 0, y: CELL_SIZE };
    });
    document.getElementById("left").addEventListener("click", () => {
        direction = { x: -CELL_SIZE, y: 0 };
    });
    document.getElementById("right").addEventListener("click", () => {
        direction = { x: CELL_SIZE, y: 0 };
    });
});

function randomPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH / CELL_SIZE) * CELL_SIZE,
        y: Math.floor(Math.random() * HEIGHT / CELL_SIZE) * CELL_SIZE
    };
}

function gameLoop() {
    // Move snake
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
        alert("Sem SaBOOR!");
        snake = [
            { x: 300, y: 300 },
            { x: 270, y: 300 },
            { x: 240, y: 300 }
        ];
        direction = { x: CELL_SIZE, y: 0 };
    }

    // Draw
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw food
    ctx.drawImage(foodImg, food.x, food.y, CELL_SIZE, CELL_SIZE);

    // Draw head
    const headSize = CELL_SIZE * HEAD_SCALE;
    const headOffset = (headSize - CELL_SIZE) / 2;
    ctx.drawImage(headImg, snake[0].x - headOffset, snake[0].y - headOffset, headSize, headSize);

    // Draw body
    for (let i = 1; i < snake.length; i++) {
        ctx.drawImage(bodyImg, snake[i].x, snake[i].y, CELL_SIZE, CELL_SIZE);
    }
}

// Start game
const SPEED = 220; // adjust for snake speed
setInterval(gameLoop, SPEED);


