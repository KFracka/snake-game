const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 30;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const HEAD_SCALE = 1.8; // 20% bigger than body

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
		{x: 270, y: 300 },
			{x: 240, y: 300 }
];

let direction = { x: CELL_SIZE, y: 0 };

// Food
let food = randomPosition();

// Keyboard input
document.addEventListener("keydown", e => {
	if (e.key === "ArrowUp") direction = {x: 0, y: -CELL_SIZE };
	if (e.key === "ArrowDown") direction = {x: 0, y: CELL_SIZE };
	if (e.key === "ArrowLeft") direction = {x: -CELL_SIZE, y: 0};
	if (e.key === "ArrowRight") direction = {x: CELL_SIZE, y: 0};
});

function randomPosition() {
	return {
		x: Math.floor(Math.random() * WIDTH / CELL_SIZE) * CELL_SIZE,
		y: Math.floor(Math.random() * HEIGHT / CELL_SIZE) * CELL_SIZE
	};
}

function gameLoop(){
	//Move snake
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
	
	// Colision
	if (
	newHead.x < 0 || newHead.x >= WIDTH ||
	newHead.y < 0 || newHead.y >= HEIGHT ||
	snake.slice(1).some(p => p.x === newHead.x && p.y === newHead.y)
	) {
		alert("Sem SaBOOR");
		snake = [
		{ x: 300, y: 300 },
			{x: 270, y: 300 },
				{ x: 240, y: 300 }
				];
				direction = { x: CELL_SIZE, y: 0 };
	}
	
	// Draw
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	
	ctx.drawImage(foodImg, food.x, food.y, CELL_SIZE, CELL_SIZE);
	
	const headSize = CELL_SIZE * HEAD_SCALE;
	const headOffset = (headSize - CELL_SIZE) / 2;
	
	ctx.drawImage(
		headImg,
		snake[0].x - headOffset,
		snake[0].y - headOffset,
		headSize,
		headSize
	);
	// ctx.drawImage(headImg, snake[0].x, snake[0].y, CELL_SIZE, CELL_SIZE);
	
	for (let i = 1; i < snake.length; i++) {
		ctx.drawImage(bodyImg, snake[i].x, snake[i].y, CELL_SIZE, CELL_SIZE);
	}
}

// Start game
const SPEED = 220;
setInterval(gameLoop, SPEED);