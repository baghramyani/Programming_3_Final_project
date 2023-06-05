var express = require("express");
var app = express();
app.use(express.static("."));
app.get("/", function (req, res) {
  res.redirect("index.html");
});

var server = require("http").createServer(app);
var io = require("socket.io")(server);
server.listen(3000, function () {
  console.log("Server is running on port 3000");
});

var fs = require("fs");

const Grass = require("./Grass");
const Mard = require("./Mard");
const GrassEater = require("./GrassEater");
const Kendani = require("./Kendani");
const Vampire = require("./Vampire");
const Amenaker = require("./Amenaker");

genMatrix = (n, m) => {
  var matrix = [];
  for (var y = 0; y < n; y++) {
    matrix[y] = [];
    for (var x = 0; x < m; x++) {
      var r = Math.floor(Math.random() * 130);
      if (r < 20) r = 0;
      else if (r < 40) r = 1;
      else if (r < 55) r = 2;
      else if (r < 75) r = 3;
      else if (r < 85) r = 4;
      else if (r < 95) r = 5;
      else if (r < 105) r = 6;
      matrix[y][x] = r;
    }
  }
  return matrix;
};

matrix = [];
grassArr = [];
grassEaterArr = [];
kendaniArr = [];
mardArr = [];
vampireArr = [];
amenakerArr = [];

grass_count = 0;
grassEater_count = 0;
kendani_count = 0;
mard_count = 0;
vampire_count = 0;
amenaker_count = 0;

function createObjects() {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 1) {
        const gr = new Grass(j, i, 1);
        grassArr.push(gr);
        grass_count++;
      } else if (matrix[i][j] === 2) {
        const great = new GrassEater(j, i, 2);
        grassEaterArr.push(great);
        grassEater_count++;
      } else if (matrix[i][j] === 3) {
        const knd = new Kendani(j, i, 3);
        kendaniArr.push(knd);
        kendani_count++;
      } else if (matrix[i][j] === 4) {
        const mrd = new Mard(j, i, 4);
        mardArr.push(mrd);
        mard_count++;
      } else if (matrix[i][j] === 5) {
        const vmp = new Vampire(j, i, 5);
        vampireArr.push(vmp);
        vampire_count++;
      } else if (matrix[i][j] === 6) {
        const amk = new Amenaker(j, i, 6);
        amenakerArr.push(amk);
        amenaker_count++;
      }
    }
  }
}

matrix = genMatrix(50, 50);
createObjects();

function drawGame() {
  for (let i = 0; i < grassArr.length; i++) {
    grassArr[i].mul();
  }
  for (let i = 0; i < grassEaterArr.length; i++) {
    grassEaterArr[i].eat();
    grassEaterArr[i].move();
    grassEaterArr[i].mul();
    grassEaterArr[i].die();
  }
  for (let i = 0; i < kendaniArr.length; i++) {
    kendaniArr[i].eat();
    kendaniArr[i].move();
    kendaniArr[i].mul();
    kendaniArr[i].die();
  }
  for (let i = 0; i < mardArr.length; i++) {
    mardArr[i].eat();
    mardArr[i].move();
    mardArr[i].mul();
    mardArr[i].die();
  }
  for (let i = 0; i < vampireArr.length; i++) {
    vampireArr[i].eat();
    vampireArr[i].move();
    vampireArr[i].mul();
    vampireArr[i].die();
  }
  for (let i = 0; i < amenakerArr.length; i++) {
    amenakerArr[i].eat();
    amenakerArr[i].eatMard();
    amenakerArr[i].move();
    amenakerArr[i].mul();
    amenakerArr[i].die();
  }

  io.sockets.emit("send matrix", matrix);
}

io.on("connection", function (socket) {
  console.log("New connection: " + socket.id);

  socket.emit("initial", matrix);

  socket.on("canvasClicked", function () {
    matrix = genMatrix(50, 50);
    createObjects();
    io.emit("send matrix", matrix);
  });

  socket.on("transposeClicked", function () {
    matrix = transposeMatrix(matrix);
    io.emit("send matrix", matrix);
  });

  socket.on("change season", function () {
    io.emit("season changed");
  });
});

function transposeMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const transposedMatrix = [];
  for (let y = 0; y < cols; y++) {
    transposedMatrix[y] = [];
    for (let x = 0; x < rows; x++) {
      transposedMatrix[y][x] = matrix[x][y];
    }
  }

  return transposedMatrix;
}

var obj = { info: [] };

main = () => {
  var statistics = {
    "grass's quantity": grass_count,
    "grasseater's quantity": grassEater_count,
    "kendani's quantity": kendani_count,
    "mard's quantity": mard_count,
    "vampire's quantity": vampire_count,
    "amenaker's quantity": amenaker_count,
  };

  obj.info[0] = statistics;

  fs.readFile("Statistics.json", function (err, data) {
    if (!err) {
      var existingData = JSON.parse(data);
      existingData.info[0] = obj.info[0];
      obj = existingData;
    }
    fs.writeFile(
      "Statistics.json",
      JSON.stringify(obj, null, 2),
      function (err) {
        if (err) {
          console.error(err);
        }
      }
    );
  });
};

setInterval(main, 15000);
setInterval(drawGame, 10000);
