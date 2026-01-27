import { GameEntity } from "./GameEntity.js";
import duckSprite from "../assets/flappyDuck.png";

export class Duck extends GameEntity {
  constructor(x, y) {
    super(x, y, 60, 47);

    this.velocity = 0;
    this.gravity = 0.25;
    this.jumpStrength = 5.5;

    // creation de l'image du canard
    this.image = new Image();
    this.image.src = duckSprite;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity; // peut etre considéré comme la fonction de chute libre
  }

  jump() {
    this.velocity = -this.jumpStrength; // le saut
  }

  draw(ctx) {
    if (this.image.complete && this.image.naturalWidth > 0) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

      // --- DEBUG : AFFICHER LA HITBOX ---
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      // ----------------------------------
    } else {
      super.draw(ctx);
    }
  }

  isFalling() {
    if (this.velocity > 0) {
      return true;
    } else {
      return false;
    }
  }
}
