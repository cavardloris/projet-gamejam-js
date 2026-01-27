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

  getBounds() {
    const p = this.padding || 0;
    return {
      startX: this.x,
      startY: this.y,
      endX: this.x + this.width,
      endY: this.y + this.height,
    };
  }

  isColliding(other) {
    const thisBounds = this.getBounds();
    const otherBounds = other.getBounds();

    return (
      thisBounds.startX < otherBounds.endX &&
      thisBounds.endX > otherBounds.startX &&
      thisBounds.startY < otherBounds.endY &&
      thisBounds.endY > otherBounds.startY
    );
  }
}
