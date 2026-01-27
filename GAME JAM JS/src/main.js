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
let currentState = 0;

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.querySelector("#app").appendChild(canvas);

canvas.width = 400;
canvas.height = 600;

const state = {
  start: 0,
  playing: 1,
  paused: 2,
  gameOver: 3,
};

const ground = new Ground(canvas.width, canvas.height);
const manabar = new ManaBar();
const duck = new Duck(50, 200);
let pipes = [];
let lastJumpTime = 0;

// Fonction handlejump qui permet de gérer le saut du canard et la diminution du mana
// si on a pas attendu 0,2 sec entre chaque saut alors ça n'enlève pas de mana
function handleJump(event) {
  //Partie pause du jeu avec la touche P et reprise du jeu avec espace ou p
  if (event.code === "KeyP") {
    if (currentState === state.playing) {
      currentState = state.paused;
    } else if (currentState === state.paused) {
      currentState = state.playing;
    }
    return;
  }
  if (event.key === "Escape" && currentState === state.paused) {
    currentState = state.playing;
    return;
  }
  if (event.code === "Space" || event.type === "click") {
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
          }
        }
        break;

      case state.gameOver:
        resetGame();
        currentState = state.playing;
        break;
    }
  }
}
window.addEventListener("keydown", handleJump);
window.addEventListener("click", handleJump);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoyage du canvas
  if (currentState === state.start) {
    ground.draw(ctx); // Affichage du sol
    duck.draw(ctx); // Affichage canard avant de démarrer
    // * Rajouter tout les élements une fois push ou les enlever pour vraiment faire une présentation du jeu
    // Présentation du jeu
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("FLAPPY DUCK", canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = "20px Arial";
    ctx.fillText(
      "Appuyez sur Espace pour commencer",
      canvas.width / 2,
      canvas.height / 2,
    );
  } else if (currentState === state.playing) {
    manabar.update(duck.isFalling());
    // La mise à jour des points pour que ça augmente que quand on joue
    frameCount++;

    // Mise à jour et dessin du canard
    duck.update();
    duck.draw(ctx);

    // Mise à jour et dessin du sol
    ground.update(gameSpeed);
    ground.draw(ctx);

    pipeSpawnDistance += 2 * gameSpeed; // 2 est la vitesse de base des tuyaux
    if (pipeSpawnDistance >= PIPE_SPAWN_INTERVAL) {
      const minGapY = 50;
      const maxGapY = canvas.height - 200;
      const randomGapY =
        Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;
      pipes.push(new Pipe(canvas.width, canvas.height, randomGapY));

      pipeSpawnDistance = 0; // Réinitialise le compteur de distance
    }
    pipes = pipes.filter((pipe) => {
      pipe.update(gameSpeed);
      pipe.draw(ctx);
      return !pipe.isOffScreen();
    });
  }

  // Mise à jour et dessin des tuyaux

  ctx.fillStyle = "red";
  ctx.font = "20px Arial";
  ctx.fillText("Compteur : " + frameCount, 10, 30);

  // manabar.update();

  // Augmentation progressive de la vitesse
  speedIncreaseTimer++;

  if (speedIncreaseTimer % 600 === 0) {
    gameSpeed = Math.min(gameSpeed + 0.1, 3);
    console.log(`Vitesse augmentée: ${gameSpeed.toFixed(1)}x`);
  }

  if (currentState === state.paused) {
    pipes.forEach((pipe) => pipe.draw(ctx));
    duck.draw(ctx);
    ground.draw(ctx);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
  } else if (currentState === state.gameOver) {
    pipes.forEach((pipe) => pipe.draw(ctx));
    ground.draw(ctx);
    duck.draw(ctx);

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "40px Arial";
    ctx.fillText("PERDU !", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "20px Arial";
    ctx.fillText(
      "Score final : " + frameCount,
      canvas.width / 2,
      canvas.height / 2 + 20,
    );
    ctx.fillText(
      "Appuyez pour rejouer",
      canvas.width / 2,
      canvas.height / 2 + 60,
    );
  }

  requestAnimationFrame(gameLoop);
}

function resetGame() {
  duck.y = 200;
  duck.velocity = 0;
  pipes = [];
  frameCount = 0;
  gameSpeed = 1;
  manabar.setValue(100);
  currentState = state.start;
}

gameLoop();

document.addEventListener("a", () => {
  GameOn = false;
  console.log("Jeu arrêté au clic !");
});
