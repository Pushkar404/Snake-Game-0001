let snake = [];
let food;
let gridSize = 20;
let tileSize = 20;
let direction = "right";
let score = 0;
let gameOver = false;
let allowBodyPass = false;
let speed = 10;
let startTime;
let playerName;
let scores = JSON.parse(localStorage.getItem("snakeScores")) || [];
let highScore = parseInt(localStorage.getItem("snakeHighScore")) || 0;

function generatePlayerName() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let name = "Snake";
  for (let i = 0; i < 8; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return name.length > 16 ? name.substring(0, 16) : name;
}

function setup() {
  try {
    let canvas = createCanvas(400, 400);
    canvas.parent("gameCanvas");
    console.log("Canvas initialized");
    frameRate(speed);
    snake = [createVector(5, 5)];
    placeFood();
    startTime = millis();
    playerName = localStorage.getItem("playerName") || generatePlayerName();
    localStorage.setItem("playerName", playerName);
    document.getElementById("playerName").textContent = playerName;
    document.getElementById("highScore").textContent = highScore;
    document.getElementById("gameMode").addEventListener("change", function () {
      allowBodyPass = this.checked;
      console.log("Allow Body Pass:", allowBodyPass);
    });
    document
      .getElementById("snakeSpeed")
      .addEventListener("input", function () {
        speed = parseInt(this.value);
        frameRate(speed);
        console.log("Speed set to:", speed);
      });
  } catch (error) {
    console.error("Setup error:", error);
  }
}

function placeFood() {
  try {
    let x = floor(random(0, width / tileSize));
    let y = floor(random(0, height / tileSize));
    food = createVector(x, y);
    console.log("Food placed at:", x, y);
  } catch (error) {
    console.error("Food placement error:", error);
  }
}

function saveScore() {
  try {
    let timeTaken = (millis() - startTime) / 1000;
    scores.push({ player: playerName, score: score, time: timeTaken });
    localStorage.setItem("snakeScores", JSON.stringify(scores));
    console.log("Score saved:", {
      player: playerName,
      score: score,
      time: timeTaken,
    });
  } catch (error) {
    console.error("Save score error:", error);
  }
}

function updateHighScore() {
  try {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
      document.getElementById("highScore").textContent = highScore;
      console.log("New high score:", highScore);
    }
  } catch (error) {
    console.error("Update high score error:", error);
  }
}

function draw() {
  try {
    background("#fff9c4");
    if (!gameOver) {
      let head = snake[0].copy();
      if (direction === "right") head.x += 1;
      else if (direction === "left") head.x -= 1;
      else if (direction === "up") head.y -= 1;
      else if (direction === "down") head.y += 1;

      if (
        head.x < 0 ||
        head.x >= width / tileSize ||
        head.y < 0 ||
        head.y >= height / tileSize
      ) {
        gameOver = true;
        saveScore();
      }

      if (!allowBodyPass) {
        for (let i = 1; i < snake.length; i++) {
          if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            saveScore();
          }
        }
      }

      if (head.x === food.x && head.y === food.y) {
        score += 1;
        document.getElementById("score").textContent = score;
        updateHighScore();
        placeFood();
      } else {
        snake.pop();
      }

      snake.unshift(head);
    }

    fill(255, 0, 0);
    rect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    let snakeColor = document.getElementById("snakeColor").value;
    fill(snakeColor);
    for (let segment of snake) {
      rect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    }

    if (gameOver) {
      fill(0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("Game Over", width / 2, height / 2);
    }
  } catch (error) {
    console.error("Draw error:", error);
  }
}

function keyPressed() {
  try {
    // Arrow keys
    if (keyCode === LEFT_ARROW && direction !== "right") {
      direction = "left";
    } else if (keyCode === RIGHT_ARROW && direction !== "left") {
      direction = "right";
    } else if (keyCode === UP_ARROW && direction !== "down") {
      direction = "up";
    } else if (keyCode === DOWN_ARROW && direction !== "up") {
      direction = "down";
    }
    // WASD keys
    else if (key === "a" && direction !== "right") {
      direction = "left";
    } else if (key === "d" && direction !== "left") {
      direction = "right";
    } else if (key === "w" && direction !== "down") {
      direction = "up";
    } else if (key === "s" && direction !== "up") {
      direction = "down";
    }
    // Spacebar to restart
    else if (keyCode === 32 && gameOver) {
      snake = [createVector(5, 5)];
      direction = "right";
      score = 0;
      document.getElementById("score").textContent = score;
      placeFood();
      gameOver = false;
      speed = parseInt(document.getElementById("snakeSpeed").value);
      frameRate(speed);
      startTime = millis();
      console.log("Game restarted");
    }
  } catch (error) {
    console.error("Key press error:", error);
  }
}
