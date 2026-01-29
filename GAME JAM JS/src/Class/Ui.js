export class Ui {
    constructor() {
        this.pauseBtn = document.getElementById("pause-btn");
        this.startControls = document.getElementById("start-controls");
        this.rules = document.getElementById("rules");
        this.closeBtn = document.getElementById("close-btn");
        this.pseudoDisplay = document.getElementById("player-pseudo");

        // Gestion fermeture règles
        if (this.closeBtn && this.rules) {
            this.closeBtn.addEventListener("click", () => {
                this.rules.classList.add("hidden");
            });
        }

        this.btnGravityNormal = document.getElementById("btn-gravity-normal");
        this.btnGravityInverted = document.getElementById("btn-gravity-inverted");
    }

    updateGravityButtons(isInverted) {
        if (isInverted) {
            this.btnGravityInverted.classList.add("selected");
            this.btnGravityNormal.classList.remove("selected");
        } else {
            this.btnGravityNormal.classList.add("selected");
            this.btnGravityInverted.classList.remove("selected");
        }
    }

    updateDOM(currentState, state) {
        if (currentState === state.start) {
            this.pauseBtn.classList.add("hidden");
            this.startControls.classList.remove("hidden");
        } else if (currentState === state.playing) {
            this.pauseBtn.classList.remove("hidden");
            this.pauseBtn.textContent = "⏸️";
            this.startControls.classList.add("hidden");
        } else if (currentState === state.paused) {
            this.pauseBtn.classList.remove("hidden");
            this.pauseBtn.textContent = "▶️";
            this.startControls.classList.add("hidden");
        } else {
            // Game Over
            this.pauseBtn.classList.add("hidden");
            this.startControls.classList.add("hidden");
        }
    }

    drawStartScreen(ctx, canvas) {
        ctx.fillStyle = "green";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("FLAPPY DUCK", canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = "20px Arial";
        ctx.fillText(
            "Appuyez sur Espace",
            canvas.width / 2,
            canvas.height / 2 + 10,
        );
        ctx.fillText(
            " ou clic pour commencer",
            canvas.width / 2,
            canvas.height / 2 + 50,
        );
        ctx.fillText(
            "Dernier score : " + (localStorage.getItem("lastScore") ?? 0),
            canvas.width / 2,
            canvas.height / 2 + 100,
        );
        ctx.fillText(
            "Meilleur score : " + (localStorage.getItem("bestScore") ?? 0),
            canvas.width / 2,
            canvas.height / 2 + 140,
        );
    }

    drawPauseScreen(ctx, canvas, score, gravityInverted) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
        ctx.fillText(
            "Score actuel : " + score,
            canvas.width / 2,
            canvas.height / 2 + 50,
        );
        let gravityText = gravityInverted ? "Inversée" : "Normale";
        ctx.fillText(
            "Gravité : " + gravityText,
            canvas.width / 2,
            canvas.height / 2 + 100,
        );
    }

    drawGameOverScreen(ctx, canvas, score) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        ctx.fillText("PERDU !", canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillText(
            "Score final : " + score,
            canvas.width / 2,
            canvas.height / 2 + 20,
        );
        ctx.fillText(
            "Appuyez sur espace pour rejouer",
            canvas.width / 2,
            canvas.height / 2 + 60,
        );
    }

    drawScore(ctx, canvas, score) {
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "center";
        ctx.strokeStyle = "#101010";
        ctx.lineWidth = 4;
        ctx.strokeText(score, canvas.width / 2, 120);
        ctx.fillStyle = "#EE5A29";
        ctx.fillText(score, canvas.width / 2, 120);
    }

    hideRules() {
        if (this.rules) this.rules.classList.add("hidden");
    }

    isRulesVisible() {
        return this.rules && !this.rules.classList.contains("hidden");
    }

    setPlayerName(name) {
        if (this.pseudoDisplay) {
            this.pseudoDisplay.textContent = name;
        }
    }
}
