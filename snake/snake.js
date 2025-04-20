const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  parent: 'gameArea',
  backgroundColor: '#222',
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let snake;
let food;
let cursors;
let snakeLength = 3;
let direction = 'RIGHT';
let lastDirection = 'RIGHT';
let snakeBody = [];
let gameOver = false;
let score = 0;
let scoreText;
let gameOverText;
let moveTime = 0; // Variable para controlar el intervalo de movimiento

function preload() {}

function create() {
  scoreText = this.add.text(10, 10, `Puntaje: ${score}`, { fontSize: '16px', fill: '#fff' });
  
  snake = this.add.rectangle(200, 200, 10, 10, 0x00ff00);
  snakeBody.push(snake);

  food = createFood(this);

  cursors = this.input.keyboard.createCursorKeys();
  
  gameOverText = document.getElementById('gameOverText');
  
  this.input.keyboard.on('keydown-R', () => {
    if (gameOver) {
      restartGame(this);
    }
  });
}

function update(time, delta) {
  if (gameOver) {
    return;
  }

  // Controlamos el intervalo de movimiento de la serpiente
  moveTime += delta;

  if (moveTime > 150) {  // 150 milisegundos entre cada movimiento
    moveSnake(this);
    moveTime = 0;  // Resetear el tiempo para el siguiente movimiento
  }

  if (cursors.left.isDown && lastDirection !== 'RIGHT') {
    direction = 'LEFT';
  } else if (cursors.right.isDown && lastDirection !== 'LEFT') {
    direction = 'RIGHT';
  } else if (cursors.up.isDown && lastDirection !== 'DOWN') {
    direction = 'UP';
  } else if (cursors.down.isDown && lastDirection !== 'UP') {
    direction = 'DOWN';
  }

  checkCollisions(this);

  if (Phaser.Geom.Intersects.RectangleToRectangle(snake, food)) {
    eatFood(this);
  }

  scoreText.setText(`Puntaje: ${score}`);
}

function moveSnake(scene) {
  lastDirection = direction;

  if (direction === 'LEFT') snake.x -= 10;
  if (direction === 'RIGHT') snake.x += 10;
  if (direction === 'UP') snake.y -= 10;
  if (direction === 'DOWN') snake.y += 10;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i].x = snakeBody[i - 1].x;
    snakeBody[i].y = snakeBody[i - 1].y;
  }

  snakeBody[0] = snake;
  
  scene.add.rectangle(snakeBody[0].x, snakeBody[0].y, 10, 10, 0x00ff00);
  
  for (let i = 1; i < snakeBody.length; i++) {
    scene.add.rectangle(snakeBody[i].x, snakeBody[i].y, 10, 10, 0x008000);
  }
}

function createFood(scene) {
  const foodX = Phaser.Math.Between(0, 39) * 10;
  const foodY = Phaser.Math.Between(0, 39) * 10;
  return scene.add.rectangle(foodX, foodY, 10, 10, 0xff0000);
}

function eatFood(scene) {
  snakeLength++;
  score += 10;
  
  food.destroy();
  food = createFood(scene);
}

function checkCollisions(scene) {
  if (snake.x < 0 || snake.x >= 400 || snake.y < 0 || snake.y >= 400) {
    gameOver = true;
    endGame(scene);
  }

  for (let i = 1; i < snakeBody.length; i++) {
    if (snake.x === snakeBody[i].x && snake.y === snakeBody[i].y) {
      gameOver = true;
      endGame(scene);
    }
  }
}

function endGame(scene) {
  gameOverText.style.display = 'block';
}

function restartGame(scene) {
  gameOver = false;
  score = 0;
  snake.x = 200;
  snake.y = 200;
  snakeLength = 3;
  snakeBody = [snake];
  direction = 'RIGHT';
  lastDirection = 'RIGHT';
  scoreText.setText(`Puntaje: ${score}`);
  gameOverText.style.display = 'none';
  scene.scene.restart();
}
