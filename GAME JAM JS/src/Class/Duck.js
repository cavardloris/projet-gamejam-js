import { GameEntity } from "./GameEntity";

class Duck extends GameEntity {
  constructor(x, y) {
    super(x, y, 50, 150);

    this.velocity = 0;
    this.gravity = 0.25;
    this.jumpStrength = 4.5;

    // creation de l'image du canard
    this.image = new Image();
    this.image.src = "./assets/flappyDuck.png";
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity; // peut etre considéré comme la fonction de chute libre
  }

  jump() {
    this.velocity = -this.jumpStrength; // le saut
  }

  draw(ctx) {
    if (this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      super.draw(ctx);
    }
  }
}
