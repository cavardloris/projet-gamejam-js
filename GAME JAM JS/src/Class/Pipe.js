import { GameEntity } from "./GameEntity.js";

export class Pipe extends GameEntity {
    constructor(canvasWidth, canvasHeight, gapY, gapHeight = 150) {
        super(canvasWidth, 0, 50, canvasHeight);
        this.gapY = gapY;
        this.gapHeight = gapHeight;
        this.speed = 2;
        this.passed = false;
    }

    update(gameSpeed) {
        this.x -= this.speed * gameSpeed;
    }

    //met à jour le gamespeed

    draw(ctx) {
        ctx.fillStyle = "#2ecc71";

        ctx.fillRect(this.x, 0, this.width, this.gapY);

        const bottomPipeY = this.gapY + this.gapHeight;
        ctx.fillRect(this.x, bottomPipeY, this.width, this.height - bottomPipeY);
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    //Quand le tuyau est hors de l’écran, il est supprimé
}