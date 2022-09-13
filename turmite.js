var WIDTH = 600;
var HEIGHT = 600;
var ROWS = 200;
var COLUMNS = 200;

var PALETTE = [
  '#FFFFFF', '#000000', '#FF33FF', '#FFFF99', '#00B3E6', 
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399'
]

function setup() {  
  canvas = createCanvas(WIDTH + 2, HEIGHT + 2).parent("p5canvas");
  noLoop();
}

function draw() {
  background(220);
  resetGrid();
}

function drawCell(i, j, colour) {
  tile_width = WIDTH / COLUMNS;
  tile_height = HEIGHT / ROWS;
  fill(colour);
  noStroke();
  rect(1 + j * tile_width, 1 + i * tile_height, tile_width, tile_height, 0);
}

function resetGrid() {
  var i, j;
  for (i = 0; i < ROWS; i += 1) {
    for (j = 0; j < COLUMNS; j += 1) {
      drawCell(i, j, 'white');
    }
  }
}

class Turmite {
  constructor(x, y, state, direction, rules) {
    this._x = x;
    this._y = y;
    this._state = state;
    this._direction = direction;
    this._rules = rules;
  }

  get state() {
    return this._state;
  }
  get direction() {
    return this._direction;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get rules() {
    return this._rules;
  }

  moveForward() {
    var coords = {
      'D' : {x: 1, y: 0},
      'U' : {x: -1, y: 0},
      'L' : {x: 0, y: -1},
      'R' : {x: 0, y: 1},
    };

    var newX = this.x + coords[this.direction].x;
    var newY = this.y + coords[this.direction].y;
    
    if (positionValid(newX, newY)) {
      this._x = newX;
      this._y = newY;
    } else {
      return 0;
    }

    function positionValid(x, y) {
      if (x < 0 || y < 0 || x >= ROWS || y >= COLUMNS) {
        return 0;
      } 
      return 1;
    }
    return 1;
  }

  changeDirection(turn) {
    var directionOrder = 'LURD';
    var turnOffsets = {'L' : -1, 'N' : 0, 'R' : 1, 'U' : 2};
    var directionsCount = 4;
    var turnOffset = turnOffsets[turn];
    var currentDirectionIndex = directionOrder.indexOf(this.direction);
    var offsetDirectionIndex = currentDirectionIndex + turnOffset;
    var wrappedDirectionIndex = (offsetDirectionIndex + directionsCount) % directionsCount;
    this._direction = directionOrder[wrappedDirectionIndex];
  }

  step(grid) {
    for (let rule of this.rules) {
      var currentState = rule[0];
      var currentColour = rule[1];
      var newState = rule[2];
      var newColour = rule[3];
      var turnDirection = rule[4];
      var tileColour = grid[this.x][this.y];

      if (this.state == currentState && tileColour == currentColour) {
        grid[this.x][this.y] = newColour;
        
        this._state = newState;
        this.changeDirection(turnDirection);
        if (!this.moveForward()) {
          return 0;
        }
      }
    }
    return 1;
  }
}


function redrawTurmite() {
  resetGrid();
  var rules = document.getElementById("turmite-input").value.split('\n').map(obj => obj.trim().split(' '));

  var grid = create2dArray(ROWS, COLUMNS, 0);
  var iter = 0;
  var ITER_MAX = 100000;
  var turmite = new Turmite(ROWS / 2, COLUMNS / 2, 'A', 'L', rules);

  while (iter < ITER_MAX) {
    var oldX = turmite.x;
    var oldY = turmite.y;
    if (!turmite.step(grid)) {
      break;
    }
    drawCell(oldX, oldY, PALETTE[grid[oldX][oldY]]);
    iter += 1;
  }

  function create2dArray(rows, columns, initialValue) {
    var i, j;
    var matrix = [];
    for (i = 0; i < rows; i += 1) {
      matrix[i] = [];
      for (j = 0; j < columns; j += 1) {
        matrix[i][j] = initialValue;
      }
    }
    return matrix;
  }
}
