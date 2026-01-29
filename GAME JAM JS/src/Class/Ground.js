import { GameEntity } from "./GameEntity.js";

export class Ground extends GameEntity {
  ground;

  constructor(canvasWidth, canvasHeight) {
    const height = 50;

    super(0, canvasHeight - height, canvasWidth, height);
    this.ground = new GameEntity(0,700, canvasWidth, height);

    console.log(`Ground créé: y=${canvasHeight - height}, height=${height}`);
  }

  update(gameSpeed) {

  }

  draw(ctx) {

    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.fillRect(this.ground.x, this.ground.y, this.ground.width, this.ground.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.ground.x, this.ground.y, this.ground.width, this.ground.height);
  }

  collideWith(other) {
    const collision = this.ground.isColliding(other);
    if (collision) {
      console.log(`Collision avec le sol détectée! Duck y=${other.y}, Ground y=${this.ground.y}`);
    }
    return collision;
  }
}