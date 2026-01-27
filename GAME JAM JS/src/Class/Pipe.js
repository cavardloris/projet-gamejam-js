import { GameEntity } from "./GameEntity.js";

export class Pipe extends GameEntity {
  topPipe;
  bottomPipe;
  topElement;
  bottomElement;

  constructor(canvasWidth, canvasHeight, gapY, gapHeight = 150) {
    super(canvasWidth, 0, 35, canvasHeight);

    const hitboxWidth = 10;
    const hitboxPadding = 10;

    this.topPipe = new GameEntity(
        canvasWidth + hitboxPadding,
        hitboxPadding,
        hitboxWidth - (hitboxPadding * 2),
        gapY - hitboxPadding
    );

    this.bottomPipe = new GameEntity(
        canvasWidth + hitboxPadding,
        gapHeight + gapY + hitboxPadding,
        hitboxWidth - (hitboxPadding * 2),
        canvasHeight - (gapHeight + gapY) - hitboxPadding
    );

    this.gapY = gapY;
    this.gapHeight = gapHeight;
    this.speed = 2;
    this.passed = false;

    this.createPipeElements(canvasWidth, canvasHeight);
    console.log("Pipe créé à x:", this.x);
  }

  createPipeElements(canvasWidth, canvasHeight) {
    this.topElement = document.createElement('div');
    this.topElement.className = 'pipe pipe-top';
    document.body.appendChild(this.topElement);

    this.bottomElement = document.createElement('div');
    this.bottomElement.className = 'pipe pipe-bottom';
    document.body.appendChild(this.bottomElement);

    this.updatePipePositions();
  }

  updatePipePositions() {
    this.topElement.style.left = `${this.x}px`;
    this.topElement.style.top = '0px';
    this.topElement.style.height = `${this.gapY}px`;

    const bottomPipeY = this.gapY + this.gapHeight;
    this.bottomElement.style.left = `${this.x}px`;
    this.bottomElement.style.top = `${bottomPipeY}px`;
    this.bottomElement.style.height = `${this.height - bottomPipeY}px`;
  }

  update(gameSpeed) {
    const decrementValue = this.speed * gameSpeed;
    this.x -= decrementValue;
    this.topPipe.x -= decrementValue;
    this.bottomPipe.x -= decrementValue;

    this.updatePipePositions();
  }

  draw(ctx) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    ctx.strokeRect(this.topPipe.x, this.topPipe.y, this.topPipe.width, this.topPipe.height);

    ctx.strokeRect(this.bottomPipe.x, this.bottomPipe.y, this.bottomPipe.width, this.bottomPipe.height);
  }

  isOffScreen() {
    const offscreen = this.x + this.width < 0;
    if (offscreen) {
      console.log("Pipe hors écran à x:", this.x);
    }
    return offscreen;
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

  destroy() {
    console.log("Destruction du pipe");
    if (this.topElement && this.topElement.parentNode) {
      this.topElement.parentNode.removeChild(this.topElement);
    }
    if (this.bottomElement && this.bottomElement.parentNode) {
      this.bottomElement.parentNode.removeChild(this.bottomElement);
    }
  }
}