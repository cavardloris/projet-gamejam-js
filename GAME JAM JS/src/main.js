import "./style.css";
import { Ground } from "./Class/Ground.js";
import { Pipe } from "./Class/Pipe.js";

let gameSpeed = 1;
let frameCount = 0;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.querySelector("#app").appendChild(canvas);

canvas.width = 400;
canvas.height = 600;

const ground = new Ground(canvas.width, canvas.height);
let pipes = [];

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gameSpeed += 0.0005;

  ground.update(gameSpeed);
  ground.draw(ctx);

  if (frameCount >= 120 / gameSpeed) {
    const minGapY = 100;
    const maxGapY = canvas.height - 250;
    const randomGapY = Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;

    pipes.push(new Pipe(canvas.width, canvas.height, randomGapY));

    frameCount = 0;
  }

  pipes = pipes.filter((pipe) => {
    pipe.update(gameSpeed);
    pipe.draw(ctx);
    return !pipe.isOffScreen();
  });

  frameCount++;
  requestAnimationFrame(gameLoop);
}

gameLoop();