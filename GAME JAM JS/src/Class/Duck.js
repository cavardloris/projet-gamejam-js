import { GameEntity } from "./GameEntity.js";
import duckSprite from "../assets/flappyDuck.png";

export class Duck extends GameEntity {
  constructor(x, y) {
    super(x, y, 60, 47);
    this.velocity = 0;
    this.gravity = -0.25; // gravité inversée
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
    this.velocity = this.jumpStrength; // le saut 
  }

  draw(ctx) {
    if (this.image.complete && this.image.naturalWidth > 0) {
      // Rotation si gravité inversée
      if (this.gravity < 0) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.scale(1, -1);
        ctx.drawImage(
          this.image,
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height,
        );
        ctx.restore();
      } else {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }

      // // --- DEBUG : AFFICHER LA HITBOX ---
      // ctx.strokeStyle = "red";
      // ctx.lineWidth = 2;
      // ctx.strokeRect(this.x, this.y, this.width, this.height);
      // // ----------------------------------
    } else {
      super.draw(ctx);
    }
  }

  getBounds() {
    const paddingleft = 11;
    const paddingtop = 7;

    return {
      startX: this.x + paddingleft, //11 px de padding a gauche
      startY: this.y + paddingtop, // 7 px de padding en haut
      endX: this.x + this.width,
      endY: this.y + this.height,
    };
  }

  isFalling() {
    // Si la gravité est négative (inversée), on tombe vers le haut (velocité < 0)
    if (this.gravity < 0) {
      return this.velocity < 0;
    } else {
      // Gravité normale, on tombe vers le bas (velocité > 0)
      return this.velocity > 0;
    }
  }

  setGravityMode(isInverted) {
    if (isInverted) {
      this.gravity = -0.25;
      this.jumpStrength = 5.5;
    } else {
      this.gravity = 0.25;
      this.jumpStrength = -5.5;
    }
  }
}
