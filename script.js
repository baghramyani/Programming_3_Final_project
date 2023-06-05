var socket = io();
var side = 10;
let myMatrix = [];
let season = "spring";

for (let i = 0; i < 50; i++) {
  myMatrix[i] = [];
  for (let j = 0; j < 50; j++) {
    myMatrix[i][j] = 0;
  }
}

function setup() {
  createCanvas(myMatrix[0].length * side, myMatrix.length * side);
}

function draw(matrix) {
  if (!matrix) return;

  background("#acacac");

  for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] == 1) {
        if (season === "spring") {
          fill("green");
        } else if (season === "summer") {
          fill("#3CB371");
        } else if (season === "autumn") {
          fill("#FFA500");
        } else if (season === "winter") {
          fill("#ADD8E6");
        }
      } else if (matrix[y][x] == 2) {
        if (season === "spring") {
          fill("yellow");
        } else if (season === "summer") {
          fill("#FFD700");
        } else if (season === "autumn") {
          fill("#FF4500");
        } else if (season === "winter") {
          fill("#B0E0E6");
        }
      } else if (matrix[y][x] == 3) {
        if (season === "spring") {
          fill("black");
        } else if (season === "summer") {
          fill("#A9A9A9");
        } else if (season === "autumn") {
          fill("#8B0000");
        } else if (season === "winter") {
          fill("#808080");
        }
      } else if (matrix[y][x] == 4) {
        fill("#FBCB7B");
      } else if (matrix[y][x] == 5) {
        fill("#FA0404");
      } else if (matrix[y][x] == 6) {
        fill("#04EFFA");
      } else if (matrix[y][x] == 0) {
        fill("#acacac");
      }
      rect(x * side, y * side, side, side);
    }
  }
}

socket.on("initial", function (data) {
  myMatrix = data;
  setup();
  draw(myMatrix);
});

socket.on("send matrix", function (data) {
  myMatrix = data;
  draw(myMatrix);
});

document.addEventListener("DOMContentLoaded", function () {
  var gameContainer = document.getElementById("game-container");

  var canvas = document.createElement("canvas");
  canvas.id = "game-canvas";
  gameContainer.appendChild(canvas);

  var button = document.createElement("button");
  button.id = "change-diagonal-btn";
  button.textContent = "Change Diagonals";
  button.addEventListener("click", function () {
    var diagonalValue = Math.floor(Math.random() * 6) + 1;
    for (var i = 0; i < myMatrix.length; i++) {
      myMatrix[i][i] = diagonalValue;
      myMatrix[i][myMatrix.length - 1 - i] = diagonalValue;
    }

    draw(myMatrix);
  });
  gameContainer.appendChild(button);
});

function changeSeason() {
  if (season === "spring") {
    season = "summer";
  } else if (season === "summer") {
    season = "autumn";
  } else if (season === "autumn") {
    season = "winter";
  } else if (season === "winter") {
    season = "spring";
  }

  draw(myMatrix);
}

function sendChangeSeason() {
  socket.emit("change season");
}

socket.on("season changed", function () {
  changeSeason();
});

setInterval(sendChangeSeason, 4000);
