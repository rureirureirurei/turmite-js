var WIDTH = 600;
var HEIGHT = 600;
var ROWS = 200;
var COLUMNS = 200;

var COLOURS = [
  {}
]

function setup() {  
  createCanvas(WIDTH + 2, HEIGHT + 2).parent("p5canvas");
  noLoop();
}

function draw() {
  background(220);
  resetGrid();
}

function drawCell(i, j, colour) {
  if (i < 0 | j < 0 | i >= ROWS | j >= COLUMNS) {
    return;
  }
  tile_width = WIDTH / COLUMNS;
  tile_height = HEIGHT / ROWS;
  fill(colour.r, colour.g, colour.b);
  noStroke();
  rect(1 + j * tile_width, 1 + i * tile_height, tile_width, tile_height, 0);
  
}

function resetGrid() {
  var i, j;
  for (i = 0; i < ROWS; i += 1) {
    for (j = 0; j < COLUMNS; j += 1) {
      drawCell(i, j, {r: 255, g:255, b:255});
    }
  }
}

function redrawTurmite() {
  resetGrid();

  var rules = document.getElementById("turmite-input").value.split('\n').map(obj => obj.trim().split(' '));

  var turmite = {x: ROWS / 2, y: COLUMNS / 2, orientation: 'L', state: 'A'};
  
  function create2dArray(rows, columns, initial_value) {
    var i;
    var matrix = new Array(rows);
    for (i = 0; i < rows; i += 1) {
      matrix[i] = new Array(columns);
      for (j = 0; j < columns; j += 1) {
        matrix[i][j] = initial_value;
      }
    }
    return matrix;
  }

  function positionValid(turmite) {
    let x = turmite.x;
    let y = turmite.y;
    if (x < 0 | y < 0 | x >= ROWS | y >= COLUMNS) {
      return 0;
    } 
    return 1;
  }

  function nextPosition() {
    if (positionValid(turmite) == 0) {
      return;
    } 
    for (let rule of rules) {
      if (turmite.state == rule[0] && grid[turmite.x][turmite.y] == rule[1]) {
        turmite.state = rule[2];
        grid[turmite.x][turmite.y] = rule[3];
        drawCell(turmite.x, turmite.y, {r:255 - rule[3] * 255,g:255 - rule[3] * 255,b:255 - rule[3] * 255});
        updateDirection(rule[4]);
        moveInDirection();
        return;
      }
    }
  }

  function moveInDirection() {
    coords = {
      'D' : {x: 1, y: 0},
      'U' : {x: -1, y: 0},
      'L' : {x: 0, y: -1},
      'R' : {x: 0, y: 1},
    };
    turmite.x += coords[turmite.orientation].x;
    turmite.y += coords[turmite.orientation].y;
  }

  function updateDirection(turn) {

    if (turn == 'R') {
      turnRight();
    }
    if (turn == 'L') {
      turnRight();
      turnRight();
      turnRight();
    } 
    if (turn == 'U') {
      turnRight();
      turnRight();
    }

    function turnRight() {
      let turnedOrientation = {'U' : 'R', 'R' : 'D', 'D' : 'L', 'L' : 'U'};
      turmite.orientation = turnedOrientation[turmite.orientation];
    }
  }

  var grid = create2dArray(ROWS, COLUMNS, 0);

  while (positionValid(turmite)) {
    nextPosition();
  }

}
