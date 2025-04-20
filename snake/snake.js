const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  parent: 'gameArea', // Apunta al contenedor donde se muestra el juego
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

function preload() {}

function create() {
  // Crear el texto de puntaje
  scoreText = this.add.text(10, 10, `Puntaje: ${score}`, { fontSize: '16px', fill: '#fff' });
  
  // Crear la serpiente inicial
  snake = this.add.rectangle(200, 200, 10, 10, 0x00ff00);
  snakeBody.push(snake);

  // Generar la comida
  food = createFood(this);

  // Crear los controles
  cursors = this.input.keyboard.createCursorKeys();

  // Crear el texto de Game Over, oculto al principio
  gameOverText = document.getElementById('gameOverText');

  // Evento de reinicio
  this.input.keyboard.on('keydown-R', () => {
    if (gameOver) {
      restartGame(this);
    }
  });
}

function update() {
  if (gameOver) {
    return;
  }

  // Actualizar dirección
  if (cursors.left.isDown && lastDirection !== 'RIGHT') {
    direction = 'LEFT';
  } else if (cursors.right.isDown && lastDirection !== 'LEFT') {
    direction = 'RIGHT';
  } else if (cursors.up.isDown && lastDirection !== 'DOWN') {
    direction = 'UP';
  } else if (cursors.down.isDown && lastDirection !== 'UP') {
    direction = 'DOWN';
  }

  // Mover la serpiente
  moveSnake(this);

  // Verificar colisiones con la pared o consigo misma
  checkCollisions(this);

  // Verificar si la serpiente ha comido la comida
  if (Phaser.Geom.Intersects.RectangleToRectangle(snake, food)) {
    eatFood(this);
  }

  // Actualizar el puntaje
  scoreText.setText(`Puntaje: ${score}`);
}

function moveSnake(scene) {
  lastDirection = direction;

  // Mover la cabeza
  if (direction === 'LEFT') snake.x -= 10;
  if (direction === 'RIGHT') snake.x += 10;
  if (direction === 'UP') snake.y -= 10;
  if (direction === 'DOWN') snake.y += 10;

  // Mover el cuerpo de la serpiente
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i].x = snakeBody[i - 1].x;
    snakeBody[i].y = snakeBody[i - 1].y;
  }

  // Colocar la cabeza en el inicio del arreglo
  snakeBody[0] = snake;

  // Dibujar la serpiente
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
  // Aumentar el tamaño de la serpiente
  snakeLength++;
  score += 10;

  // Crear una nueva comida
  food.destroy();
  food = createFood(scene);
}

function checkCollisions(scene) {
  // Chocar con las paredes
  if (snake.x < 0 || snake.x >= 400 || snake.y < 0 || snake.y >= 400) {
    gameOver = true;
    endGame(scene);
  }

  // Chocar consigo misma
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
