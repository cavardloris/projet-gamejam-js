import {GameEntity} from "./GameEntity.js";

export class Ground extends GameEntity {
    constructor(canvasWidth, canvasHeight) {
        const height = 50;
        super(0, canvasHeight - height, canvasWidth, height);
        this.speed = 2;
    }
    // Le sol est positionné en bas de l'écran

    update() {
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }
    //quand le sol a glissé de toute sa largeur on recommence

    draw(ctx) {
        ctx.fillStyle = "#e1c699";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillRect(this.x + this.width, this.y, this.width, this.height);
    }
}