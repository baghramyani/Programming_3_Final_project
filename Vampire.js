const LivingCreature = require("./LivingCreature");

module.exports = class Vampire extends LivingCreature {
  constructor(x, y, index) {
    super(x, y, index);
    this.energy = 10;
    this.gender = Math.random() > 0.5 ? "male" : "female";
  }

  chooseCell(character) {
    this.updateTimeout();
    return super.chooseCell(character);
  }

  move() {
    this.updateTimeout();
    var newCell = this.random(this.chooseCell(0));
    if (newCell) {
      this.energy--;
      matrix[this.y][this.x] = 0;
      this.x = newCell[0];
      this.y = newCell[1];
      matrix[this.y][this.x] = this.index;

      if (this.energy <= 0) {
        this.die();
      }
    } else {
      this.energy--;
      if (this.energy <= 0) {
        this.die();
      }
    }
  }

  eat() {
    this.updateTimeout();
    var newCell = this.random(this.chooseCell(2));
    if (newCell) {
      this.energy += 2;
      matrix[newCell[1]][newCell[0]] = 0;

      for (var i = 0; i < mardArr.length; i++) {
        if (mardArr[i].x === newCell[0] && mardArr[i].y === newCell[1]) {
          mardArr.splice(i, 1);
          break;
        }
      }

      if (this.energy >= 15) {
        this.mul();
      }
    } else {
      this.move();
    }
  }

  mul() {
    this.updateTimeout();
    var newCell = this.random(this.chooseCell(0));
    if (this.multiply >= 10 && newCell) {
      var newVampire = new Vampire(newCell[0], newCell[1], this.index);
      vampireArr.push(newVampire);
      matrix[newCell[1]][newCell[0]] = this.index;
      this.multiply = 0;
    }
  }

  die() {
    this.updateTimeout();
    matrix[this.y][this.x] = 0;

    for (var i = 0; i < vampireArr.length; i++) {
      if (vampireArr[i].x === this.x && vampireArr[i].y === this.y) {
        vampireArr.splice(i, 1);
        break;
      }
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

  updateTimeout() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.eat();
      this.mul();
      this.die();
    }, 5000);
  }
};
