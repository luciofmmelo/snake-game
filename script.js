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

const incrementScore = () => score.innerText = +score.innerText + 10;

const randomNumber = (min, max) => Math.round(Math.random() * (max - min) + min);

const randomPosition = () => Math.round(randomNumber(0, snakeField.width - size) / size) * size;

const randomColor = () => `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)})`;


// Initialize Game State

const initializeSnake = () => snake = [initialTailSnake, initialBodySnake, initialHeadSnake];

const initializeFood = () => {
    return {
        x: randomPosition(),
        y: randomPosition(),
        color: randomColor()
    };
};

const initializeObstacles = () => {
    const obstacles = [];
    for (let i = 0; i <= 10 + 4 * level; i++) {
        obstacles.push({ x: randomPosition(), y: randomPosition() });
    }
    return obstacles;
};

let food = initializeFood();
let obstacles = initializeObstacles();


// Rendering Functions

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#121212";
    for (let i = size; i < snakeField.width; i += size) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, snakeField.width);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(snakeField.width, i);
        ctx.stroke();
    }
};

const drawSnake = () => {
    snake.forEach((position, index) => {
        ctx.fillStyle = index == snake.length - 1 ? "darkgrey" : "white";
        ctx.fillRect(position.x, position.y, size, size);
    });
};

const drawFood = () => {
    ctx.fillStyle = food.color;
    ctx.shadowColor = food.color;
    ctx.shadowBlur = 10;
    ctx.fillRect(food.x, food.y, size, size);
    ctx.shadowBlur = 0;
};

const drawObstacles = () => {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = "white";
        ctx.shadowColor = "red";
        ctx.shadowBlur = 4;
        ctx.fillRect(obstacle.x, obstacle.y, size, size);
        ctx.shadowBlur = 0;
    });
};


// Game Logic

const moveSnake = () => {
    if (!direction) return;
    const head = snake[snake.length - 1];
    let newHead;
    switch (direction) {
        case "right": newHead = { x: head.x + size, y: head.y }; break;
        case "left": newHead = { x: head.x - size, y: head.y }; break;
        case "up": newHead = { x: head.x, y: head.y - size }; break;
        case "down": newHead = { x: head.x, y: head.y + size }; break;
    }
    snake.push(newHead);
    if (head.x !== food.x || head.y !== food.y) {
        snake.shift();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];
    if (head.x === food.x && head.y === food.y) {
        snake.push({ ...head }); 
        eatSound.play();
        incrementScore();
        adjustLoopTime();
        relocateFood();
        checkLevel();
    }
};

const adjustLoopTime = () => {
    if (loopTime > 160) loopTime -= 20;
    else if (loopTime > 130) loopTime -= 15;
    else if (loopTime > 100) loopTime -= 10;
    else if (loopTime > 80) loopTime -= 8;
    else if (loopTime > 40) loopTime--;
};

const relocateFood = () => {
    let x = randomPosition();
    let y = randomPosition();
    food.color = randomColor();

    while (snake.some(pos => pos.x === x && pos.y === y) || obstacles.some(pos => pos.x === x && pos.y === y)) {
        x = randomPosition();
        y = randomPosition();
    }

    food.x = x;
    food.y = y;
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const wallCollision = head.x < 0 || head.x >= snakeField.width || head.y < 0 || head.y >= snakeField.height;
   
    const selfCollision = snake.slice(0, -1).some((pos, index) =>
        index < snake.length - 2 &&
        pos.x == head.x &&
        pos.y == head.y
    );
    const obstaclesCollision = obstacles.some(pos => pos.x === head.x && pos.y === head.y);

    if (wallCollision || selfCollision || obstaclesCollision) {
        gameOver();
    }
};

const checkLevel = () => {
    if (+score.innerText >= 50 * level) {
        level++;
        upLevel();
        obstacles = initializeObstacles();
        adjustLoopTimeForLevel();
        pause = !pause;
    }
};

const adjustLoopTimeForLevel = () => {
    const levelAdjustments = [0, 10, 9, 8, 7, 5, 4, 3, 2, 1];
    initialLoopTime -= levelAdjustments[level];
    loopTime = initialLoopTime;
};


// Event Handlers

const handleVelocity = ({ target }) => {
    if (!target.value || target.value == 1) {
        initialLoopTime = 200;
    } else {
        const loopTimeAdjustments = [0, 0, 10, 15, 19, 22, 24, 25, 26, 27, 28];
        initialLoopTime = 200 - loopTimeAdjustments[target.value];
    }
    loopTime = initialLoopTime;
};

const handleKeydown = ({ key }) => {
    if (!pause) {
        const directionMap = {
            ArrowRight: "right",
            ArrowLeft: "left",
            ArrowUp: "up",
            ArrowDown: "down"
        };
        if (directionMap[key] && direction !== oppositeDirection(directionMap[key])) {
            direction = directionMap[key];
        }
    }
    if (["Enter", "p", "Pause", " "].includes(key)) {
        pauseGame();
    }
};

const oppositeDirection = (dir) => {
    const oppositeMap = {
        right: "left",
        left: "right",
        up: "down",
        down: "up"
    };
    return oppositeMap[dir];
};

const handleClickPlay = () => {
    pause = !pause;
    menuPlay.style.display = "none";
    header.style.filter = "blur(0px)";
    snakeField.style.filter = "blur(0px)";
};

const handleClickPause = () => {
    pauseGame();
};

const handleClickReset = () => {
    resetGame();
};

const handleClickUpLevel = () => {
    menuNextLevel.style.display = "none";
    header.style.filter = "blur(0px)";
    snakeField.style.filter = "blur(0px)";
    pause = !pause;
};


// Game State Management

const pauseGame = () => {
    if (!pause) {
        auxDirection = direction;
        direction = undefined;
        menuPause.style.display = "flex";
        header.style.filter = "blur(4px)";
        snakeField.style.filter = "blur(4px)";
    } else {
        direction = auxDirection;
        menuPause.style.display = "none";
        header.style.filter = "blur(0px)";
        snakeField.style.filter = "blur(0px)";
    }
    pause = !pause;
};

const upLevel = () => {
    pause = !pause;
    direction = undefined;
    menuNextLevel.style.display = "flex";
    header.style.filter = "blur(4px)";
    snakeField.style.filter = "blur(4px)";
};

const gameOver = () => {
    if (!pause) {
        direction = undefined;
        snake = [];
        gameOverSound.play();
        menuGameOver.style.display = "flex";
        header.style.filter = "blur(4px)";
        finalScore.innerText = score.innerText;
        snakeField.style.filter = "blur(4px)";
        pause = !pause;
    }
};

const resetGame = () => {
    score.innerText = "00";
    snake = [initialTailSnake, initialBodySnake, initialHeadSnake];
    food = initializeFood();
    obstacles = initializeObstacles();
    loopTime = initialLoopTime;
    menuGameOver.style.display = "none";
    header.style.filter = "blur(0px)";
    snakeField.style.filter = "blur(0px)";
    pause = !pause;
    gameLoop();
};


// Main Game Loop

const gameLoop = () => {
    if (!pause) {
        clearInterval(loopId);
        ctx.clearRect(0, 0, snakeField.width, snakeField.height);
        drawGrid();
        drawFood();
        drawSnake();
        drawObstacles();
        // moveSnake();
        // checkEat();
        // checkCollision();
    }

    loopId = setTimeout(gameLoop, loopTime);
};


// Event Listeners
document.addEventListener("keydown", handleKeydown);
buttonPlay.addEventListener("click", handleClickPlay);
buttonPause.addEventListener("click", handleClickPause);
buttonReset.addEventListener("click", handleClickReset);
buttonNextLevel.addEventListener("click", handleClickUpLevel);
velocityInput.addEventListener("input", handleVelocity);


// Start the game
gameLoop();
