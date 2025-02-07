const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const menu = document.querySelector(".menu");
const singleplayerBtn = document.getElementById("singleplayer");
const versusBtn = document.getElementById("versus");

let playerName = localStorage.getItem("player-name") || "Player";
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let score = 0;
let isVersusMode = false;
let computerScore = 0;
let computerScoreElement;
let computerSnakeX = 15, computerSnakeY = 15;
let computerSnakeBody = [];
let computerVelocityX = 0, computerVelocityY = 0;
let setIntervalId;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Fim de jogo! Aperte espaço para jogar novamente...");
    location.reload();
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY != 1) { velocityX = 0; velocityY = -1; }
    else if (e.key === "ArrowDown" && velocityY != -1) { velocityX = 0; velocityY = 1; }
    else if (e.key === "ArrowLeft" && velocityX != 1) { velocityX = -1; velocityY = 0; }
    else if (e.key === "ArrowRight" && velocityX != -1) { velocityX = 1; velocityY = 0; }
};

const moveComputerSnake = () => {
    if (computerSnakeX < foodX) computerVelocityX = 1, computerVelocityY = 0;
    else if (computerSnakeX > foodX) computerVelocityX = -1, computerVelocityY = 0;
    else if (computerSnakeY < foodY) computerVelocityX = 0, computerVelocityY = 1;
    else if (computerSnakeY > foodY) computerVelocityX = 0, computerVelocityY = -1;
};

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `${playerName} Score: ${score}`;
    }
    
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];
    snakeX += velocityX;
    snakeY += velocityY;
    
    if (isVersusMode) {
        moveComputerSnake();
        for (let i = computerSnakeBody.length - 1; i > 0; i--) {
            computerSnakeBody[i] = computerSnakeBody[i - 1];
        }
        computerSnakeBody[0] = [computerSnakeX, computerSnakeY];
        computerSnakeX += computerVelocityX;
        computerSnakeY += computerVelocityY;
        
        if (computerSnakeX === foodX && computerSnakeY === foodY) {
            changeFoodPosition();
            computerSnakeBody.push([foodX, foodY]);
            computerScore++;
            computerScoreElement.innerText = `Computer Score: ${computerScore}`;
        }
    }
    
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30 ||
        (isVersusMode && (computerSnakeX <= 0 || computerSnakeX > 30 || computerSnakeY <= 0 || computerSnakeY > 30))) {
        gameOver = true;
    }
    
    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
        }
    }
    
    if (isVersusMode) {
        for (let i = 0; i < computerSnakeBody.length; i++) {
            htmlMarkup += `<div class="head" style="grid-area: ${computerSnakeBody[i][1]} / ${computerSnakeBody[i][0]}; background: #FF5733"></div>`;
            if (computerSnakeBody[i][0] === snakeX && computerSnakeBody[i][1] === snakeY) {
                gameOver = true;
            }
        }
    }
    
    playBoard.innerHTML = htmlMarkup;
};

const askPlayerName = () => {
    const name = prompt("Digite seu nome:") || "Player";
    localStorage.setItem("player-name", name);
    playerName = name;
    scoreElement.innerText = `${playerName} Score: 0`;
};

document.addEventListener("DOMContentLoaded", askPlayerName);
singleplayerBtn.addEventListener("click", () => {
    menu.style.display = "none";
    isVersusMode = false;
    setIntervalId = setInterval(initGame, 125);
});

versusBtn.addEventListener("click", () => {
    menu.style.display = "none";
    isVersusMode = true;
    computerScoreElement = document.createElement("span");
    computerScoreElement.classList.add("computer-score");
    computerScoreElement.innerText = "Computer Score: 0";
    document.querySelector(".detalhes-jogo").appendChild(computerScoreElement);
    setIntervalId = setInterval(initGame, 125);
});

document.addEventListener("keydown", changeDirection);
changeFoodPosition();
