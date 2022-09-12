var WIDTH = 600;
var HEIGHT = 600;
var ROWS = 60;
var COLUMNS = 60;

var COLOURS = [
  {}
]

function setup() {  
  createCanvas(WIDTH + 2, HEIGHT + 2).parent("p5canvas");
  noLoop();
}

function draw() {
  background(220);
  var i, j;
  for (i = 0; i < COLUMNS; i += 1) {
    for (j = 0; j < ROWS; j += 1) {
      drawCell(i, j);    
    }
  }

  function drawCell(i, j) {
    tile_width = WIDTH / COLUMNS;
    tile_height = HEIGHT / ROWS;
    rect(1 + i * tile_width, 1 + j * tile_height, tile_width, tile_height, 1);
  }
}

function redrawTurmite() {
  i=10;
  j=20;
  tile_width = WIDTH / COLUMNS;
  tile_height = HEIGHT / ROWS;
  fill(255, 255, 255);
  rect(1 + i * tile_width, 1 + j * tile_height, tile_width, tile_height, 1);

}
