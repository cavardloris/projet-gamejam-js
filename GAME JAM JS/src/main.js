import "./style.css";
import { Ground } from "./Class/Ground.js";
import { Pipe } from "./Class/Pipe.js";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.querySelector("#app").appendChild(canvas);

canvas.width = 400;
canvas.height = 600;

const ground = new Ground(canvas.width, canvas.height);
let pipes = [];
let frameCount = 0;

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ground.update();
    ground.draw(ctx);

    if (frameCount % 120 === 0) {
        const minGapY = 50;
        const maxGapY = canvas.height - 200;
        const randomGapY = Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;
        pipes.push(new Pipe(canvas.width, canvas.height, randomGapY));
    }

    pipes = pipes.filter(pipe => {
        pipe.update();
        pipe.draw(ctx);
        return !pipe.isOffScreen();
    });

    frameCount++;
    requestAnimationFrame(gameLoop);
}

gameLoop();