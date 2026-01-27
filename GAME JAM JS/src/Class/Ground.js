import { GameEntity } from "./GameEntity.js";

export class Ground extends GameEntity {
  ground;

  constructor(canvasWidth, canvasHeight) {
    const height = 0;
    super(0, canvasHeight - height, canvasWidth, height);
    this.ground = new GameEntity(0, canvasHeight - height, canvasWidth, height);
  }

  update(gameSpeed) {
  }

  draw(ctx) {
  }

  collideWith(other) {
    return this.ground.isColliding(other);
  }
}