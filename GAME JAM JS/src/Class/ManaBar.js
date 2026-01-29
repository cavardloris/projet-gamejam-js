export class ManaBar {
  constructor(maxValues = 100) {
    this.currentValue = maxValues;
    this.maxValue = maxValues;
    this.containerName = "app";

    this.createBarElement();
  }

  createBarElement() {
    const container = document.getElementById(this.containerName);
    if (!container)
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
    const emptyPercent = 100 - percentage;
    this.barFill.style.width = emptyPercent + "%";
  }

  getManaValue() {
    return this.currentValue;
  }

  //Fonction update qui s'occupe de la mana bar si elle doit diminuer ou augmenter
  update(isFalling) {
    if (isFalling) {
      const regenSpeed = 0.5;

      if (this.currentValue < this.maxValue) {
        this.setValue(this.currentValue + regenSpeed);
      }
    } else {
      const cost = 0.3;
      let newValue = this.currentValue - cost;

      if (newValue <= 0) {
        console.error("Mana épuisé !");
        newValue = 0;
      }

      this.setValue(newValue);
    }
  }
}
