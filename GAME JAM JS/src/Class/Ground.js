import { GameEntity } from "./GameEntity.js";

export class Ground extends GameEntity {
  ground;
  constructor(canvasWidth, canvasHeight) {
    const height = 50;
    super(0, canvasHeight - height, canvasWidth, height);
    this.ground = new GameEntity(0, canvasHeight - height, canvasWidth, height);
    this.speed = 2;
  }

  update(gameSpeed) {
    this.x -= this.speed * gameSpeed;
    if (this.x <= -this.width) {
      this.x = 0;
    }

    // Alterne entre deux rectangles : quand le premier sort de l’écran, le second apparaît
  }

  draw(ctx) {
    ctx.fillStyle = "#e1c699";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x + this.width, this.y, this.width, this.height);
  }

  collideWith(other) {
    if (this.ground.isColliding(other)) {
    }
    return this.ground.isColliding(other);
  }
}
