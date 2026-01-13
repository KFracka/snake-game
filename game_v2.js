const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Canvas logical size
const WIDTH = 600;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const CELL_SIZE = 30;
const HEAD_SCALE = 1.2;
const SPEED = 220; // snake speed

// Responsive display
function resizeCanvas() {
    const displaySize = Math.min(window.innerWidth * 0.9, 600);
    canvas.style.width = displaySize + "px";
    canvas.style.height = displaySize + "px";
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Images
const bgImg = new Image();
bgImg.src = "assets/gym.png";

const headImg = new Image();
headImg.src = "assets/head.png";

const bodyImg = new Image();
bodyImg.src = "assets/body.png";

const foodImg = new Image();
foodImg.src = "assets/food.png";

// Preload all images before starting game
const images = [bgImg, headImg, bodyImg, foodImg];
let loadedCount = 0;

images.forEach(img => {
    img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
            // All images loaded, start game
            setInterval(gameLoop, SPEED);
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
        if (dx >
