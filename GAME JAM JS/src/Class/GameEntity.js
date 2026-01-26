export class GameEntity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isColliding(otherX, otherY, otherW, otherH) {
    return (
      this.x < otherX + otherW &&
      this.x + this.width > otherX &&
      this.y < otherY + otherH &&
      this.y + this.height > otherY
    );
  }
}
