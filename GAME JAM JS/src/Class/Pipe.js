import { GameEntity } from "./GameEntity.js";

export class Pipe extends GameEntity {
  topPipe;
  bottomPipe;

  constructor(canvasWidth, canvasHeight, gapY, gapHeight = 150) {
    super(canvasWidth, 0, 50, canvasHeight);

    this.topPipe = new GameEntity(canvasWidth, 0, 50, gapY);
    this.bottomPipe = new GameEntity(
      canvasWidth,
      gapHeight + gapY,
      50,
      canvasHeight,
    );
    this.gapY = gapY;
    this.gapHeight = gapHeight;
    this.speed = 2;
    this.passed = false;
  }

  update(gameSpeed) {
    const decrementValue = this.speed * gameSpeed;
    this.x -= decrementValue;
    this.topPipe.x -= decrementValue;
    this.bottomPipe.x -= decrementValue;
  }

  //met à jour le gamespeed

  draw(ctx) {
    ctx.fillStyle = "#2ecc71";

    ctx.fillRect(this.x, 0, this.width, this.gapY);

    const bottomPipeY = this.gapY + this.gapHeight;
    ctx.fillRect(this.x, bottomPipeY, this.width, this.height - bottomPipeY);
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  doesCollideWith(other) {
    if (this.topPipe.isColliding(other)) {
      console.log("Collide with top");
    }

    if (this.bottomPipe.isColliding(other)) {
      console.log("Collide with bottom");
    }

    return (
      this.topPipe.isColliding(other) || this.bottomPipe.isColliding(other)
    );
  }

  //Quand le tuyau est hors de l’écran, il est supprimé
}
