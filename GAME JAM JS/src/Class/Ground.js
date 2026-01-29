import { GameEntity } from "./GameEntity.js";
import img from "../assets/ground.png";

export class Ground extends GameEntity {
  ground;

  constructor(canvasWidth, canvasHeight) {
    const height = 50;
    super(0, canvasHeight - height, canvasWidth, height);
    this.ground = new GameEntity(0, canvasHeight - height, canvasWidth, height);
    this.groundImg = new Image();
    this.groundImg.src = img;
  }

  update(gameSpeed) { }

  draw(ctx) {
    if (this.groundImg.complete && this.groundImg.naturalWidth > 0) {
      ctx.drawImage(this.groundImg, this.x, this.y, this.width, this.height);
    }
  }

  setwidthheight(width, height) {
    this.width = width;
    this.y = height - this.height;
    this.ground.width = width;
    this.ground.y = height - this.height;
  }

  collideWith(other) {
    return this.ground.isColliding(other);
  }
}
