import "./style.css";
import { Ground } from "./Class/Ground.js";
import { Pipe } from "./Class/Pipe.js";
import { ManaBar } from "./Class/ManaBar.js";
import { Duck } from "./Class/Duck.js";
import { AudioManager } from "./Class/AudioManager.js";

const audioManager = new AudioManager();

audioManager.loadSound('music', 'src/assets/sounds/music_fixed.mp3');

let gameSpeed = 1;
let gameStarted = false;
let frameCount = 0;
let speedIncreaseTimer = 0;
let pipeSpawnDistance = 0;
const PIPE_SPAWN_INTERVAL = 240;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.querySelector("#app").appendChild(canvas);

canvas.width = 400;
canvas.height = 600;

let GameOn = true;

const ground = new Ground(canvas.width, canvas.height);
const manabar = new ManaBar();
const duck = new Duck(50, 200);
let pipes = [];

function handleInput(e) {
  if (!GameOn) return;

  if (e.code === "Space" || e.type === "mousedown") {
    // Démarrer la musique au premier saut
    if (!gameStarted) {
      audioManager.playLoop('music', 0.3);
      gameStarted = true;
      console.log("Musique de fond démarrée !");
    }

    if (duck.jump) duck.jump();
  }
}

window.addEventListener("keydown", handleInput);
window.addEventListener("mousedown", handleInput);


function gameLoop() {
  if (GameOn === false) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);


  if (gameStarted) {
    pipeSpawnDistance += 2 * gameSpeed;

    if (pipeSpawnDistance >= PIPE_SPAWN_INTERVAL) {
      const minGapY = 50;
      const maxGapY = canvas.height - 200;
      const randomGapY = Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;
      pipes.push(new Pipe(canvas.width, canvas.height, randomGapY));
      pipeSpawnDistance = 0;
    }
  }

  // Mise à jour et dessin des tuyaux
  pipes = pipes.filter((pipe) => {
    pipe.update(gameSpeed);
    pipe.draw(ctx);
    return !pipe.isOffScreen();
  });


  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Score : " + frameCount, 10, 30);

  manabar.update();
  duck.update();
  duck.draw(ctx);

  ground.update(gameSpeed);
  ground.draw(ctx);

  if (gameStarted) {
    speedIncreaseTimer++;
    if (speedIncreaseTimer % 600 === 0) {
      gameSpeed = Math.min(gameSpeed + 0.1, 3);
      console.log(`Vitesse augmentée: ${gameSpeed.toFixed(1)}x`);
    }
    frameCount++;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();