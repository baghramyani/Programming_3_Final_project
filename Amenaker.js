const LivingCreature = require("./LivingCreature");

module.exports = class Amenaker extends LivingCreature {
  constructor(x, y, index) {
    super(x, y, index);
    this.energy = 8;
    this.directions = [];
    this.timeout = null;
  }

  chooseCell(character) {
    this.getNewCoordinates();
    return super.chooseCell(character);
  }

  getNewCoordinates() {
    this.directions = [
      [this.x - 1, this.y - 1],
      [this.x, this.y - 1],
      [this.x + 1, this.y - 1],
      [this.x - 1, this.y],
      [this.x + 1, this.y],
      [this.x - 1, this.y + 1],
      [this.x, this.y + 1],
      [this.x + 1, this.y + 1],
    ];
  }

  move() {
    this.updateTimeout();
    var newCell = this.random(this.chooseCell(0));
    if (newCell) {
      this.energy -= 2;
      matrix[this.y][this.x] = 0;
      matrix[newCell[1]][newCell[0]] = this.index;
      this.x = newCell[0];
      this.y = newCell[1];

      if (this.energy <= 0) {
        this.die();
      }
    }
  }

  eat() {
    this.updateTimeout();
    var newCell = this.random(this.chooseCell(1));
    if (newCell) {
      this.energy++;
      matrix[this.y][this.x] = 0;
      matrix[newCell[1]][newCell[0]] = this.index;
      this.x = newCell[0];
      this.y = newCell[1];

      for (var i = 0; i < grassArr.length; i++) {
        if (grassArr[i].x === newCell[0] && grassArr[i].y === newCell[1]) {
          grassArr.splice(i, 1);
          break;
        }
      }

      if (this.energy >= 10) {
        this.mul();
      }
    } else {
      this.move();
    }
  }

  eatMard() {
    this.updateTimeout();
    var newCell = this.random(this.chooseCell(4));
    if (newCell) {
      this.energy += 2;
      matrix[newCell[1]][newCell[0]] = 0;

      for (var i = 0; i < mardArr.length; i++) {
        if (mardArr[i].x === newCell[0] && mardArr[i].y === newCell[1]) {
          mardArr.splice(i, 1);
          break;
        }
      }

      if (this.energy >= 20) {
        this.mul();
      }
    } else {
      this.move();
    }
  }

  mul() {
    this.updateTimeout();
    var newCell = this.random(this.chooseCell(0));
    if (newCell) {
      var newAmenaker = new Amenaker(newCell[0], newCell[1], this.index);
      amenakerArr.push(newAmenaker);
      matrix[newCell[1]][newCell[0]] = this.index;
      this.energy = 8;
    }
  }

  die() {
    this.updateTimeout();
    matrix[this.y][this.x] = 0;

    for (var i = 0; i < amenakerArr.length; i++) {
      if (amenakerArr[i].x === this.x && amenakerArr[i].y === this.y) {
        amenakerArr.splice(i, 1);
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
      this.eatMard();
      this.mul();
      this.die();
    }, 8000);
  }
};
