import { GameEntity } from "./GameEntity.js";

export class Sky extends GameEntity {
  sky;

  constructor(canvasWidth, canvasHeight) {
    super(0, canvasHeight, canvasWidth, 0);
    this.sky = new GameEntity(0, 0, canvasWidth, 1);
  }
  collidingWith(other) {
    if (this.sky.isColliding(other)) {
    }
    return this.sky.isColliding(other);
  }
}
