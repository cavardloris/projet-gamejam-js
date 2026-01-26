export class ManaBar {
  constructor(maxValues = 100) {
    this.currentValue;
    this.maxValue = maxValues;
    this.containerName = "app";

    this.createBarElement();
  }

  createBarElement() {
    const container = document.getElementById(this.containerName);
    if (container == false)
      return console.error(`Conteneur #${this.containerName} introuvable !`);
    // S'occupe de créer une div pour mettre la bar
    this.barContainer = document.createElement("div");
    this.barContainer.className = "mana-bar-container";
    this.barBackground = document.createElement("div");
    this.barBackground.className = "mana-bar-background";

    // Remplit la barre dans une div
    this.barFill = document.createElement("div");
    this.barFill.className = "mana-bar-fill";
    this.barFill.style.width = "100%";

    //Connecte tout
    this.barBackground.appendChild(this.barFill);
    this.barContainer.appendChild(this.barBackground);
    container.appendChild(this.barContainer);
  }

  setValue(newValue) {
    this.currentValue = Math.max(0, Math.min(newValue, this.maxValue));

    const percentage = (this.currentValue / this.maxValue) * 100;
    this.barFill.style.width = percentage + "%";
  }
}
