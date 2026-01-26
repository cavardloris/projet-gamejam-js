import "./style.css";
import { Ground } from "./Class/Ground.js";
import { Pipe } from "./Class/Pipe.js";
import { Duck } from "./Class/Duck.js";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.querySelector("#app").appendChild(canvas);

canvas.width = 400;
canvas.height = 600;

const ground = new Ground(canvas.width, canvas.height);
const duck = new Duck(50, 200);
let pipes = [];
let frameCount = 0;

function handleJump(e) {
  if (e.code === "Space" || e.type === "click") {
    duck.jump();
  }
}
window.addEventListener("keydown", handleJump);
window.addEventListener("click", handleJump);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (frameCount % 120 === 0) {
    const minGapY = 50;
    const maxGapY = canvas.height - 200;
    const randomGapY =
      Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;
    pipes.push(new Pipe(canvas.width, canvas.height, randomGapY));
  }

  pipes = pipes.filter((pipe) => {
    pipe.update();
    pipe.draw(ctx);
    return !pipe.isOffScreen();
  });

  duck.update();
  duck.draw(ctx);
  ground.update();
  ground.draw(ctx);

  frameCount++;
  requestAnimationFrame(gameLoop);
}

gameLoop();
