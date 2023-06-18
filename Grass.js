const LivingCreature = require("./LivingCreature");

module.exports = class Grass extends LivingCreature {
  constructor(x, y, index) {
    super(x, y, index);
    this.energy = 8;
    this.gender = Math.random() > 0.5 ? "male" : "female";
  }

  mul() {
    this.multiply++;
    var newCell = this.random(this.chooseCell(0));
    if (this.multiply >= 5 && newCell) {
      var newGrass = new Grass(newCell[0], newCell[1], this.index);
      grassArr.push(newGrass);
      matrix[newCell[1]][newCell[0]] = this.index;
      this.multiply = 0;
    }
  }

  updateWeather(weatherType) {
    if (weatherType === "summer") {
      this.energy += 1;
    } else if (weatherType === "winter") {
      this.energy -= 2;
    } else if (weatherType === "spring") {
      this.energy += 2;
    } else if (weatherType === "autumn") {
      this.energy -= 1;
    }
  }
};
