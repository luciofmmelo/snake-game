// Element References
const header = document.getElementById('header');
const player = document.getElementById('player-name');
const score = document.getElementById('score-value');
const finalScore = document.getElementById('final-score');

const menuPlay = document.getElementById('menu-screen-play');
const menuPause = document.getElementById('menu-screen-pause');
const menuNextLevel = document.getElementById('menu-screen-next-level');
const menuGameOver = document.getElementById('menu-screen-game-over');

const buttonPlay = document.getElementById("button-play");
const buttonPause = document.getElementById("button-pause");
const buttonNextLevel = document.getElementById("button-next-level");
const buttonReset = document.getElementById("button-reset");

const velocityInput = document.getElementById("velocity-input");

const snakeField = document.querySelector('canvas');
const ctx = snakeField.getContext('2d');

const size = 10;
const initialTailSnake = { x: 100, y: 100 };
const initialBodySnake = { x: 100 + size, y: 100 };
const initialHeadSnake = { x: 100 + 2 * size, y: 100 };

let initialLoopTime = 200;
let loopTime = initialLoopTime;
let pause = true;
let level = 1;
let direction, auxDirection, loopId;
let snake = [initialTailSnake, initialBodySnake, initialHeadSnake];

score.innerHTML = '00';
player.innerHTML = localStorage.getItem('name') ?? 'Alma Penada';
const eatSound = new Audio('./assets/audios/eating.mp3');
const gameOverSound = new Audio('./assets/audios/game-over.wav');

snakeField.style.filter = "blur(4px)";
header.style.filter = "blur(4px)";

// Utility Functions
const incrementScore = () => { }

const randomNumber = () => { }

const randomPosition = () => { }

const randomColor = () => { }

// Initialize Game State
const initializeFood = () => { }

const initializeObstacles = () => { };

let food = initializeFood();
let obstacles = initializeObstacles();

// Game State Management
const pauseGame = () => { };

const gameOver = () => { };

const upLevel = () => { };

// Event Handlers
const handleVelocity = () => { };

const handleKeydown = () => { };

const oppositeDirection = () => { };

const handleClickPlay = () => { };

const handleClickPause = () => { };

const handleClickReset = () => { };

const handleClickUpLevel = () => { };

const resetGame = () => { };

// Rendering Functions
const drawGrid = () => { };

const drawSnake = () => { };

const drawFood = () => { };

const drawObstacles = () => { };

// Game Logic
const moveSnake = () => { };

const checkEat = () => { };

const adjustLoopTime = () => { };

const relocateFood = () => { };

const checkCollision = () => { };

const checkLevel = () => { };

const adjustLoopTimeForLevel = () => { };

// Main Game Loop
const gameLoop = () => { };

// Event Listeners
document.addEventListener("keydown", handleKeydown);
buttonPlay.addEventListener("click", handleClickPlay);
buttonPause.addEventListener("click", handleClickPause);
buttonReset.addEventListener("click", handleClickReset);
buttonNextLevel.addEventListener("click", handleClickUpLevel);
velocityInput.addEventListener("input", handleVelocity);

// Start the game
gameLoop();
