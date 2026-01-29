import "./style.css";
import { Ground } from "./Class/Ground.js";
import { Pipe } from "./Class/Pipe.js";
import { ManaBar } from "./Class/ManaBar.js";
import { Duck } from "./Class/Duck.js";
import { AudioManager } from "./Class/AudioManager.js";
import { Sky } from "./Class/Sky.js";
import { Ui } from "./Class/Ui.js";


//Chargement des sons + creation audiomanager
const audioManager = new AudioManager();

audioManager.loadSound("music", "src/assets/sounds/music_fixed.mp3");
audioManager.loadSound("jump", "src/assets/sounds/jump.mp3");
audioManager.loadSound("pause", "src/assets/sounds/pause_music.mp3")
audioManager.loadSound("gameOver", "src/assets/sounds/loose_music.mp3")

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

// Hauteur fixe du jeu, la largeur s'adapte pour garder le zoom
const windowsHeight = 600;
//clculs du ratio de la fenetre pour adapter la largeur
const getGameWidth = () => windowsHeight * (window.innerWidth / window.innerHeight);

canvas.height = windowsHeight;
canvas.width = getGameWidth();

// Gestion du redimensionnement
window.addEventListener("resize", () => {
  canvas.height = windowsHeight;
  canvas.width = getGameWidth();

  if (typeof ground !== "undefined") ground.setwidthheight(canvas.width, canvas.height);
  if (typeof sky !== "undefined") sky.setwidthheight(canvas.width, canvas.height);
});

//Différents états de jeu possible
const state = {
  start: 0,
  playing: 1,
  paused: 2,
  gameOver: 3,
};

const ground = new Ground(canvas.width, canvas.height);
const manabar = new ManaBar();
const duck = new Duck(50, 300); // canard à 300 pour être au milieu
const sky = new Sky(canvas.width, canvas.height);
const ui = new Ui();
let pipes = [];
let lastJumpTime = 0;

// Par défaut en mod einversé
duck.setGravityMode(true);
ui.updateGravityButtons(true);

let backgroundX = 0;

// UI Elements
const btnGravityNormal = document.getElementById("btn-gravity-normal");
const btnGravityInverted = document.getElementById("btn-gravity-inverted");

function updateUI() {
  ui.updateDOM(currentState, state);
}


//pour les controles sur mobiles
ui.pauseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  ui.pauseBtn.blur(); // Enlève le focus pour éviter que la barre espace réactive le bouton
  if (currentState === state.playing) {
    currentState = state.paused;
  } else if (currentState === state.paused) {
    currentState = state.playing;
  }
  updateUI();
});
ui.pauseBtn.addEventListener("mousedown", (e) => e.stopPropagation());

btnGravityNormal.addEventListener("click", (e) => {
  e.stopPropagation(); // Empêche le clic de lancer le jeu immédiatement
  console.log("Mode gravité normale activé (Bouton)");
  duck.setGravityMode(false);
  ui.updateGravityButtons(false);
  duck.y = 300;
});
btnGravityNormal.addEventListener("mousedown", (e) => e.stopPropagation());

btnGravityInverted.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("Mode gravité inversée activé (Bouton)");
  duck.setGravityMode(true);
  ui.updateGravityButtons(true);
  duck.y = 300;
});
btnGravityInverted.addEventListener("mousedown", (e) => e.stopPropagation());

// Récupération du nom du joueur
let playerName = localStorage.getItem("playerName");
if (!playerName) {
  playerName = prompt("Entrez votre pseudo :") || "Mets toi un pseudo";
  localStorage.setItem("playerName", playerName);
}
ui.setPlayerName(playerName);

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
    updateUI();
    return;
  }

  // Si les règles sont affichées, on les ferme
  if (ui.isRulesVisible()) {
    if (event.code === "Space" || event.code === "Enter" || event.type === "mousedown" || event.type === "click") {
      ui.hideRules();
    }
    return;
  }

  // Vérifie les appuis sur les différentes conditions de démarrage
  if (event.code === "Space" || event.type === "click" || event.type === "mousedown") {
    switch (currentState) {
      case state.start:
        currentState = state.playing;
        updateUI();
        break;

      case state.playing:
        //Change la valeur minimale de mana pour sauter (sur 100)
        if (manabar.getManaValue() > 10) {
          const currentTime = Date.now();
          duck.jump();
          if (currentTime - lastJumpTime >= 200) {
            manabar.update(false);
            lastJumpTime = currentTime;
            audioManager.play("jump", 0.2);
          }
        }
        break;

      case state.gameOver:
        resetGame();
        break;
    }
  }

  // Gestion ecran d'accueil
  if (currentState === state.start) {
    if (event.key === "1") {
      console.log("Mode gravité inversée activé");
      duck.setGravityMode(true);
      ui.updateGravityButtons(true);
      duck.y = 300;
    } else if (event.key === "0" || event.key === "2") {
      console.log("Mode gravité normale activé");
      duck.setGravityMode(false);
      ui.updateGravityButtons(false);
      duck.y = 300;
    }
  }
}
window.addEventListener("keydown", handleInput);
window.addEventListener("mousedown", handleInput);

//Audio suivant les différents modes du jeu
function checkaudio() {
  if (currentState === state.playing && audio !== 1) {
    audioManager.stop("pause");
    audioManager.stop("gameOver");
    audioManager.playLoop("music", 0.3);
    console.log("Musique de fond démarrée !");
    audio = 1;
  }

  if (currentState === state.paused && audio !== 2) {
    audioManager.stop("music");
    audioManager.stop("gameOver");
    audioManager.play("pause", 0.3);
    console.log("Musique de fond de jeu stoppée !");
    audio = 2;
  }
  if (currentState === state.gameOver && audio !== 3) {
    audioManager.stop("music");
    audioManager.stop("pause");
    audioManager.play("gameOver", 0.3);
    audio = 3;
  }
}

function gameLoop() {
  //Nettoyage du canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  checkaudio();

  switch (currentState) {
    case state.start:
      ground.draw(ctx);
      ui.drawStartScreen(ctx, canvas);
      break;

    case state.playing:
      updatePlayingState();
      break;

    case state.paused:
      pipes.forEach((pipe) => pipe.draw(ctx));
      ground.draw(ctx);
      duck.draw(ctx);
      ui.drawPauseScreen(ctx, canvas, pipeScore, duck.gravity < 0);
      break;

    case state.gameOver:
      pipes.forEach((pipe) => pipe.draw(ctx));
      ground.draw(ctx);
      duck.draw(ctx);
      ui.drawGameOverScreen(ctx, canvas, pipeScore);
      break;
  }

  requestAnimationFrame(gameLoop);
}


function updatePlayingState() {
  manabar.update(duck.isFalling());
  frameCount++;

  backgroundX -= 1;
  document.body.style.backgroundPosition = `${backgroundX}px 0`;

  duck.update();

  ground.update(gameSpeed);

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
    // On rajoute 50px pour que les tuyaus aient le tps de spawn
    pipes.push(new Pipe(canvas.width + 50, canvas.height, randomGapY));

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
      datastorage(pipeScore);
      updateUI();
    }
    return !pipe.isOffScreen();
  });

  ground.draw(ctx);
  duck.draw(ctx);

  if (ground.collideWith(duck) || sky.collidingWith(duck)) {
    currentState = state.gameOver;
    datastorage(pipeScore);
    updateUI();
  }
  ui.drawScore(ctx, canvas, pipeScore);
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
  duck.y = 300; // canard à 300 pour être au milieu
  duck.velocity = 0;
  pipes = [];
  frameCount = 0;
  pipeScore = 0; // Réinitialisation score tuyaux
  pipeSpawnDistance = 0; // Réinitialisation du délai d'apparition
  manabar.setValue(100);
  currentState = state.start;
  updateUI();
}

gameLoop();
updateUI();
