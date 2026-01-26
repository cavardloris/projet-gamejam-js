import "./style.css";
import { Ground } from "./Class/Ground.js";
import { Pipe } from "./Class/Pipe.js";
import { Duck } from "./Class/Duck.js";

let gameSpeed = 1;
let frameCount = 0;
let speedIncreaseTimer = 0;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.querySelector("#app").appendChild(canvas);

canvas.width = 400;
canvas.height = 600;

const ground = new Ground(canvas.width, canvas.height);
const duck = new Duck(50, 200);
let pipes = [];

function handleJump(e) {
  if (e.code === "Space" || e.type === "click") {
    duck.jump();
  }
}
window.addEventListener("keydown", handleJump);
window.addEventListener("click", handleJump);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Génération des tuyaux
  if (frameCount % 120 === 0) {
    const minGapY = 50;
    const maxGapY = canvas.height - 200;
    const randomGapY =
        Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;
    pipes.push(new Pipe(canvas.width, canvas.height, randomGapY));

    frameCount = 0;
  }

  // Mise à jour et dessin des tuyaux
  pipes = pipes.filter((pipe) => {
    pipe.update(gameSpeed);
    pipe.draw(ctx);
    return !pipe.isOffScreen();
  });

  // Mise à jour et dessin du canard
  duck.update();
  duck.draw(ctx);

  // Mise à jour et dessin du sol
  ground.update(gameSpeed);
  ground.draw(ctx);

  // Augmentation progressive de la vitesse
  speedIncreaseTimer++;
  if (speedIncreaseTimer % 600 === 0) { // Toutes les 10 secondes à 60 FPS
    gameSpeed = Math.min(gameSpeed + 0.1, 3); // Max à 3x la vitesse initiale
    console.log(`Vitesse augmentée: ${gameSpeed.toFixed(1)}x`);
  }

  frameCount++;
  requestAnimationFrame(gameLoop);
}

gameLoop();