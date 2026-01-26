import "./style.css";
import { Ground } from "./Class/Ground.js";
import { Pipe } from "./Class/Pipe.js";
import { ManaBar } from "./Class/ManaBar.js";
import { Duck } from "./Class/Duck.js";

let gameSpeed = 1;
let frameCount = 0;
let speedIncreaseTimer = 0;
let pipeSpawnDistance = 0; // Distance parcourue depuis le dernier tuyau
const PIPE_SPAWN_INTERVAL = 240; // Distance fixe entre les tuyaux

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.querySelector("#app").appendChild(canvas);

canvas.width = 400;
canvas.height = 600;

let GameOn = true;

const GAP_SIZE = 150;

const ground = new Ground(canvas.width, canvas.height);
const manabar = new ManaBar();
const duck = new Duck(50, 200);
let pipes = [];

function handleJump(event) {
  if (!GameOn) {
  } else {
    if (event.code === "Space" || event.type === "click") {
      duck.jump();
    }
  }
}
window.addEventListener("keydown", handleJump);
window.addEventListener("click", handleJump);

function gameLoop() {
  if (GameOn === false) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pipeSpawnDistance += 2 * gameSpeed; // 2 est la vitesse de base des tuyaux

  if (pipeSpawnDistance >= PIPE_SPAWN_INTERVAL) {
    const minGapY = 50;
    const maxGapY = canvas.height - 200;
    const randomGapY =
      Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;
    pipes.push(new Pipe(canvas.width, canvas.height, randomGapY));

    pipeSpawnDistance = 0; // Réinitialise le compteur de distance
  }

  // Mise à jour et dessin des tuyaux
  pipes = pipes.filter((pipe) => {
    pipe.update(gameSpeed);
    pipe.draw(ctx);
    return !pipe.isOffScreen();
  });

  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Compteur : " + frameCount, 10, 30);

  manabar.update();
  // Mise à jour et dessin du canard
  duck.update();
  duck.draw(ctx);

  // Mise à jour et dessin du sol
  ground.update(gameSpeed);
  ground.draw(ctx);

  // Augmentation progressive de la vitesse
  speedIncreaseTimer++;
  if (speedIncreaseTimer % 600 === 0) {
    gameSpeed = Math.min(gameSpeed + 0.1, 3);
    console.log(`Vitesse augmentée: ${gameSpeed.toFixed(1)}x`);
  }

  frameCount++;
  requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener("click", () => {
  GameOn = false;
  console.log("Jeu arrêté au clic !");
});
