const width = 600;
const height = 400;
let score = 0;
let lives = 3;

class MainScene {
  preload() {
    this.load.image("ball", "assets/ball.png");
    this.load.image("paddle", "assets/paddle.png");
    this.load.image("brick", "assets/brick.png");
  }

  create() {
    const style = { font: "16px 'Press Start 2P'", fill: "#fff" };

    this.physics.world.checkCollision.down = false;

    this.ball = this.physics.add.sprite(width * 0.5, height - 30, "ball");
    this.ball.body.setVelocity(150, -150);
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.setBounce(1, 1);
    this.ball.setScale(1.5, 1.5);

    this.paddle = this.physics.add.sprite(width * 0.5, height - 20, "paddle");
    this.paddle.setOrigin(0.5, 1);
    this.paddle.setScale(1, 1);
    this.paddle.body.setImmovable(true);

    this.initBricks();

    this.scoreText = this.add.text(8, 8, "Score: " + score, style);

    this.livesText = this.add.text(width - 5, 5, `Lives: ${lives}`, style);
    this.livesText.setOrigin(1, 0);
    this.lifeLostText = this.add.text(
      width * 0.5,
      height * 0.5,
      "Life lost, click to continue",
      style,
    );
    this.lifeLostText.setOrigin(0.5, 0.5);
    this.lifeLostText.visible = false;
  }

  initBricks() {
    const bricksLayout = {
      width: 50,
      height: 20,
      count: { row: 3, col: 9 },
      offset: { top: 50, left: 60 },
      padding: 10,
    };

    this.bricks = this.add.group();

    for (let c = 0; c < bricksLayout.count.col; c++) {
      for (let r = 0; r < bricksLayout.count.row; r++) {
        const brickX =
          c * (bricksLayout.width + bricksLayout.padding) +
          bricksLayout.offset.left;
        const brickY =
          r * (bricksLayout.height + bricksLayout.padding) +
          bricksLayout.offset.top;

        const newBrick = this.add.sprite(brickX, brickY, "brick");
        newBrick.setScale(1.5);

        this.physics.add.existing(newBrick);
        newBrick.body.setImmovable(true);
        this.bricks.add(newBrick);
      }
    }
  }

  bounceBallAnimation() {
    this.tweens.add({
      targets: this.ball,
      scaleX: 1,
      scaleY: 1,
      duration: 70,
      yoyo: true,
      ease: "Quad.easeOut",
    });
  }

  hitBrick(ball, brick) {
    this.tweens.add({
      targets: brick,
      ease: "Bounce",
      duration: 900,
      props: {
        scaleX: 0,
        scaleY: 0,
      },
      onComplete: () => {
        brick.destroy();
      },
    });

    score += 1;
    this.scoreText.setText(`Score: ${score}`);
  }

  ballLeaveScreen() {
    lives--;
    if (lives > 0) {
      this.livesText.setText(`Lives: ${lives}`);
      this.lifeLostText.visible = true;
      this.ball.body.reset(width * 0.5, height - 25);

      this.input.once(
        "pointerdown",
        () => {
          this.lifeLostText.visible = false;
          this.ball.body.setVelocity(150, -150);
        },
        this,
      );
    } else {
      alert("You lost!");
      location.reload();
    }
  }

  update() {
    this.paddle.x = Phaser.Math.Clamp(
      this.input.x,
      this.paddle.width / 2,
      width - this.paddle.width / 2,
    );

    this.physics.collide(this.ball, this.paddle, () => {
      this.bounceBallAnimation();
    });
    this.physics.collide(this.ball, this.bricks, (ball, brick) =>
      this.hitBrick(ball, brick),
    );

    const ballIsOutOfBounds = !Phaser.Geom.Rectangle.Overlaps(
      this.physics.world.bounds,
      this.ball.getBounds(),
    );
    if (ballIsOutOfBounds) {
      this.ballLeaveScreen();
    }

    if (this.bricks.countActive() === 0) {
      alert("You won!");
      location.reload();
    }
  }
}

new Phaser.Game({
  width: width,
  height: height,
  backgroundColor: "#000000",
  scene: MainScene,
  physics: { default: "arcade" },
  parent: "game",
});
