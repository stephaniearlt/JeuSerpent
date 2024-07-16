window.onload = function () {
  const canvasWidth = 900;
  const canvasHeight = 600;
  const blockSize = 30;
  const delay = 100;

  let ctx;
  let snake;
  let apple;
  let canvas;

  // Classe Snake pour représenter le serpent
  class Snake {
    constructor(body, direction) {
      this.body = body;
      this.direction = direction;
    }

    // Méthode pour dessiner le serpent sur le canvas
    draw() {
      ctx.save();
      ctx.fillStyle = "#8388EF";
      this.body.forEach(position => this.drawBlock(position));
      ctx.restore();
    }

    // Méthode pour dessiner un bloc individuel du serpent
    drawBlock(position) {
      const x = position[0] * blockSize;
      const y = position[1] * blockSize;
      ctx.fillRect(x, y, blockSize, blockSize);
    }

    // Méthode pour faire avancer le serpent dans sa direction actuelle
    advance() {
      const nextPosition = this.getNextPosition();
      this.body.unshift(nextPosition);
      this.body.pop();
    }

    // Méthode pour obtenir la prochaine position du serpent en fonction de sa direction
    getNextPosition() {
      const head = this.body[0];
      let [x, y] = head;
      switch (this.direction) {
        case "left":
          x -= 1;
          break;
        case "right":
          x += 1;
          break;
        case "down":
          y += 1;
          break;
        case "up":
          y -= 1;
          break;
        default:
          throw new Error("Invalid Direction");
      }
      return [x, y];
    }

    // Méthode pour définir la nouvelle direction du serpent
    setDirection(newDirection) {
      const allowedDirections = {
        left: ["up", "down"],
        right: ["up", "down"],
        up: ["left", "right"],
        down: ["left", "right"]
      };

      if (allowedDirections[this.direction].includes(newDirection)) {
        this.direction = newDirection;
      } else {
        throw new Error("Invalid Direction");
      }
    }

    // Méthode pour vérifier la collision du serpent avec les murs ou lui-même
    checkCollision() {
      const head = this.body[0];
      const rest = this.body.slice(1);
      const [snakeX, snakeY] = head;
      const minX = 0;
      const minY = 0;
      const maxX = canvas.width / blockSize - 1;
      const maxY = canvas.height / blockSize - 1;

      const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
        return true;
      }

      for (const segment of rest) {
        if (snakeX === segment[0] && snakeY === segment[1]) {
          return true;
        }
      }

      return false;
    }
  }

  // Classe Apple pour représenter la pomme
  class Apple {
    constructor(position) {
      this.position = position;
    }

    // Méthode pour dessiner la pomme sur le canvas
    draw() {
      const radius = blockSize / 2;
      const [x, y] = this.position;
      ctx.save();
      ctx.fillStyle = "#B6D173";
      ctx.beginPath();
      ctx.arc(x * blockSize + radius, y * blockSize + radius, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Fonction d'initialisation du jeu
  function init() {
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");

    snake = new Snake(
      [
        [6, 4],
        [5, 4],
        [4, 4],
      ],
      "right"
    );

    apple = new Apple([10, 10]);

    refreshCanvas();
  }

  // Fonction pour rafraîchir le canvas à intervalle régulier
  function refreshCanvas() {
    snake.advance();
    if (snake.checkCollision()) {
      alert("Game Over");
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snake.draw();
      apple.draw();
      setTimeout(refreshCanvas, delay);
    }
  }

  // Écouteur d'événement pour détecter les touches de clavier et changer la direction du serpent
  document.onkeydown = function handleKeyDown(e) {
    const key = e.key;
    let newDirection;
    switch (key) {
      case "ArrowLeft":
        newDirection = "left";
        break;
      case "ArrowUp":
        newDirection = "up";
        break;
      case "ArrowRight":
        newDirection = "right";
        break;
      case "ArrowDown":
        newDirection = "down";
        break;
      default:
        return;
    }
    snake.setDirection(newDirection);
  };

  // Appel initial pour démarrer le jeu
  init();
};
