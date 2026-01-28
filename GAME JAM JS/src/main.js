import "./style.css";
import { Ground } from "./Class/Ground.js";
import { Pipe } from "./Class/Pipe.js";
import { ManaBar } from "./Class/ManaBar.js";
import { Duck } from "./Class/Duck.js";
import { AudioManager } from "./Class/AudioManager.js";
import { Sky } from "./Class/Sky.js";

//Chargement des sons + creation audiomanager
const audioManager = new AudioManager();

audioManager.loadSound("music", "src/assets/sounds/music_fixed.mp3");
audioManager.loadSound("jump", "src/assets/sounds/jump.mp3");

let gameSpeed = 1;
let frameCount = 0;
let pipeScore = 0; // Nouveau score basé sur les tuyaux passés
let speedIncreaseTimer = 0;
let pipeSpawnDistance = 0; // Distance parcourue depuis le dernier tuyau
const PIPE_SPAWN_INTERVAL = 240; // Distance fixe entre les tuyaux
let currentState = 0;
let audio = 0; // 0 pour pas de musique, 1 musique de jeu, 2 musique de pause, 3 musique de game over

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.querySelector("#app").appendChild(canvas);

canvas.width = 400;
canvas.height = 600;
//Différents états de jeu possible
const state = {
  start: 0,
  playing: 1,
  paused: 2,
  gameOver: 3,
};

const ground = new Ground(canvas.width, canvas.height);
const manabar = new ManaBar();
const duck = new Duck(50, 200);
const sky = new Sky(canvas.width, canvas.height);
let pipes = [];
let lastJumpTime = 0;

let backgroundX = 0;

const rules = document.getElementById("rules");
const closeBtn = document.getElementById("close-btn");

// Récupération du nom du joueur
let playerName = localStorage.getItem("playerName");
if (!playerName) {
  playerName = prompt("Entrez votre pseudo :") || "Mets toi un pseudo";
  localStorage.setItem("playerName", playerName);
}
const pseudoDisplay = document.getElementById("player-pseudo");
if (pseudoDisplay) {
  pseudoDisplay.textContent = playerName;
}

closeBtn.addEventListener("click", () => {
  rules.classList.add("hidden");
});
// Fonction handleinput qui permet de gérer le saut du canard et la diminution du mana
// si on a pas attendu 0,2 sec entre chaque saut alors ça n'enlève pas de mana
function handleInput(event) {
  //Partie pause du jeu avec la touche échap
  if (event.key === "Escape") {
    if (currentState === state.playing) {
      currentState = state.paused;
    } else if (currentState === state.paused) {
      currentState = state.playing;
    }
    return;
  }
  if (
    rules.classList.contains("hidden") &&
    (event.code === "Space" || event.type === "click")
  ) {
    switch (currentState) {
      case state.start:
        currentState = state.playing;
        break;

      case state.playing:
        //Change la valeur minimale de mana pour sauter (sur 100)
        if (manabar.getManaValue() > 10) {
          const currentTime = Date.now();
          duck.jump();
          if (currentTime - lastJumpTime >= 200) {
            manabar.update(false);
            lastJumpTime = currentTime;
            audioManager.play("jump", 0.3);
          }
        }
        break;

      case state.gameOver:
        resetGame();
        break;
    }
  }
}

window.addEventListener("keydown", handleInput);
window.addEventListener("mousedown", handleInput);

function checkaudio() {
  if (currentState === state.playing && audio !== 1) {
    audioManager.playLoop("music", 0.3);
    console.log("Musique de fond démarrée !");
    audio = 1;
  }

  if (currentState === state.paused && audio !== 2) {
    audioManager.stop("music");
    console.log("Musique de fond de jeu stoppée !");
    audio = 2;
  }
  if (currentState === state.gameOver && audio !== 3) {
    audioManager.stop("music");
    audio = 3;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  checkaudio();

  switch (currentState) {
    case state.start:
      drawStartScreen();
      break;

    case state.playing:
      updatePlayingState();
      break;

    case state.paused:
      PauseScreen();
      break;

    case state.gameOver:
      GameOverScreen();
      break;
  }

  requestAnimationFrame(gameLoop);
}
function drawStartScreen() {
  ground.draw(ctx);
  // duck.draw(ctx);
  ctx.fillStyle = "green";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("FLAPPY DUCK", canvas.width / 2, canvas.height / 2 - 50);
  ctx.font = "20px Arial";
  ctx.fillText(
    "Appuyez sur Espace ou clic pour commencer",
    canvas.width / 2,
    canvas.height / 2,
  );
  ctx.fillText(
    "Dernier score : " + (localStorage.getItem("lastScore") ?? 0),
    canvas.width / 2,
    canvas.height / 2 + 100,
  );
  ctx.fillText(
    "Meilleur score : " + (localStorage.getItem("bestScore") ?? 0),
    canvas.width / 2,
    canvas.height / 2 + 150,
  );
}

function updatePlayingState() {
  manabar.update(duck.isFalling());
  frameCount++;

  backgroundX -= 1;
  document.body.style.backgroundPosition = `${backgroundX}px 0`;

  duck.update();
  duck.draw(ctx);

  ground.update(gameSpeed);
  ground.draw(ctx);

  speedIncreaseTimer++;

  if (speedIncreaseTimer % 600 === 0) {
    gameSpeed = Math.min(gameSpeed + 0.1, 3);
    console.log(`Vitesse augmentée: ${gameSpeed.toFixed(1)}x`);
  }

  pipeSpawnDistance += 2 * gameSpeed;
  if (pipeSpawnDistance >= PIPE_SPAWN_INTERVAL) {
    const minGapY = 50;
    const maxGapY = canvas.height - 200;
    const randomGapY =
      Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;
    pipes.push(new Pipe(canvas.width, canvas.height, randomGapY));

    pipeSpawnDistance = 0;
  }
  pipes = pipes.filter((pipe) => {
    pipe.update(gameSpeed);
    pipe.draw(ctx);

    // A chaque tuyaux passés on augmente le score
    if (!pipe.passed && duck.x > pipe.x + pipe.width) {
      pipe.passed = true;
      pipeScore++;
      console.log("Score:", pipeScore);
    }

    if (pipe.doesCollideWith(duck)) {
      currentState = state.gameOver;
    }
    return !pipe.isOffScreen();
  });

  if (ground.collideWith(duck) || sky.collidingWith(duck)) {
    currentState = state.gameOver;
  }
  ctx.font = "bold 50px Arial";
  ctx.textAlign = "center";
  ctx.strokeStyle = "#101010";
  ctx.lineWidth = 4;
  ctx.strokeText(pipeScore, canvas.width / 2, 80);
  ctx.fillStyle = "#EE5A29";
  ctx.fillText(pipeScore, canvas.width / 2, 80);
}

function PauseScreen() {
  pipes.forEach((pipe) => pipe.draw(ctx));
  duck.draw(ctx);
  ground.draw(ctx);

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
  ctx.fillText(
    "Score actuel : " + pipeScore,
    canvas.width / 2,
    canvas.height / 2 +
    50,
  );
}

function GameOverScreen() {
  pipes.forEach((pipe) => pipe.draw(ctx));
  ground.draw(ctx);
  duck.draw(ctx);

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.font = "20px Arial";
  ctx.fillText("PERDU !", canvas.width / 2, canvas.height / 2 - 20);

  ctx.fillText(
    "Score final : " + pipeScore,
    canvas.width / 2,
    canvas.height / 2 + 20,
  );
  ctx.fillText(
    "Appuyez sur espace pour rejouer",
    canvas.width / 2,
    canvas.height / 2 + 60,
  );
  datastorage(pipeScore);
}

function datastorage(score) {
  localStorage.setItem("lastScore", score);
  if (
    localStorage.getItem("bestScore") === null ||
    score > parseInt(localStorage.getItem("bestScore"))
  ) {
    localStorage.setItem("bestScore", score);
  }
}

function resetGame() {
  pipes.forEach((pipe) => pipe.destroy());
  duck.y = 200;
  duck.velocity = 0;
  pipes = [];
  frameCount = 0;
  pipeScore = 0; // Réinitialisation score tuyaux
  gameSpeed = 1;
  manabar.setValue(100);
  currentState = state.start;
}

gameLoop();
