class MainScene {
  preload() {
    this.load.image("ball", "assets/ball.png");
    this.load.image("paddle", "assets/paddle.png");
    this.load.image("brick", "assets/brick.png");
  }

  create() {
    this.physics.world.checkCollision.down = false;

    this.ball = this.physics.add.sprite(600 * 0.5, 400, "ball");
    this.ball.body.setVelocity(150, -150);
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.setBounce(1, 1);

    this.paddle = this.physics.add.sprite(600 * 0.5, 400, "paddle");
    this.paddle.setOrigin(0.5, 1);
    this.paddle.setScale(2, 1);
    this.paddle.body.setImmovable(true);

    this.initBricks();

    this.score = 0;
    let style = { font: "16px 'Press Start 2P'", fill: "#fff" };
    this.scoreText = this.add.text(8, 8, "Score: " + this.score, style);
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
        this.physics.add.existing(newBrick);
        newBrick.body.setImmovable(true);
        this.bricks.add(newBrick);
      }
    }
  }

  hitBrick(ball, brick) {
    brick.destroy();
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  update() {
    this.paddle.x = this.input.x || 600 * 0.5;
    this.physics.collide(this.ball, this.paddle);
    this.physics.collide(this.ball, this.bricks, (ball, brick) =>
      this.hitBrick(ball, brick),
    );

    const ballIsOutOfBounds = !Phaser.Geom.Rectangle.Overlaps(
      this.physics.world.bounds,
      this.ball.getBounds(),
    );
    if (ballIsOutOfBounds) {
      alert("Game over!");
      location.reload();
    }

    if (this.bricks.countActive() === 0) {
      alert("You won!");
      location.reload();
    }
  }
}

new Phaser.Game({
  width: 600,
  height: 400,
  backgroundColor: "#000000",
  scene: MainScene,
  physics: { default: "arcade" },
  parent: "game",
});
