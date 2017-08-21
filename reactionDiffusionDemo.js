var grid, next;

var gridWidth = 401;
var gridHeight = 401;

var dASlider, dBSlider;

var dA, dB;

var feed = 0.055;
var k = 0.062;

function setup() {
  createCanvas(1001, 401);
  textSize(15);
  noStroke();

  dASlider = createSlider(0.5, 1.5, 1, 0.001);
  dASlider.position(gridWidth, 110 + 140);
  dBSlider = createSlider(0, 1, 0.5, 0.001);
  dBSlider.position(gridWidth, 240 + 140); 

  resetSketch();
  pixelDensity(1);
  createP('');
  
  var resetButton = createButton("Reset");
  resetButton.mousePressed(resetSketch);
  frameRate(150);
}

function updatedA(){
  dA = dASlider.value();
}

function updatedB(){
  dB = dBSlider.value();
}

function draw() {
  background(255);
  //fill(0,255,0);
  //ellipse(940,150,50,50);
  //fill(255,0,0);
  //ellipse(940,250,50,50);
  //fill(0);
  //line(965,
  for (var x = 1; x < gridWidth - 1; x++) {
    for (var y = 1; y < gridHeight - 1; y++) {
      var a = grid[x][y].a;
      var b = grid[x][y].b;
      next[x][y].a = a +
        (dA * laplaceA(x, y)) -
        (a * b * b) +
        (feed * (1 - a));
      next[x][y].b = b +
        (dB * laplaceB(x, y)) +
        (a * b * b) -
        ((k + feed) * b);

      next[x][y].a = constrain(next[x][y].a, 0, 1);
      next[x][y].b = constrain(next[x][y].b, 0, 1);
    }
  }

  loadPixels();
  for (var x = 0; x < gridWidth; x++) {
    for (var y = 0; y < gridHeight; y++) {
      var pix = (x + y * width) * 4;
      var a = next[x][y].a;
      var b = next[x][y].b;
      var c = floor((a - b) * 255);
      c = constrain(c, 0, 255);
      pixels[pix + 0] = c;
      pixels[pix + 1] = c;
      pixels[pix + 2] = c;
      pixels[pix + 3] = 255;
    }
  }
  
  updatePixels();
  
  text("Diffusion constant of Activator = "+ dA, dASlider.x + dASlider.width + 20, 125);
  text("Diffusion constant of Inhibitor = "+ dB, dBSlider.x + dBSlider.width + 20, 255);
  
  swap();
}

function resetSketch(){
  
  dASlider.value(1);
  dBSlider.value(0.5);
  updatedA();
  updatedB();
  dASlider.input(updatedA);
  dBSlider.input(updatedB);

  grid = [];
  next = [];
  for (var x = 0; x < gridWidth; x++) {
    grid[x] = [];
    next[x] = [];
    for (var y = 0; y < gridHeight; y++) {
      grid[x][y] = {
        a: 1,
        b: 0
      };
      next[x][y] = {
        a: 1,
        b: 0
      };
    }
  }
 
  for (var i = 0; i < gridWidth; i++) {
    for (var j = 0; j < gridHeight; j++) {
      if(sqrt(((200-i)*(200-i))+((200-j)*(200-j))) < 20){
        grid[i][j].b = 1;
      }
    }
  }
}

function laplaceA(x, y) {
  var sumA = 0;
  sumA += grid[x][y].a * -1;
  sumA += grid[x - 1][y].a * 0.2;
  sumA += grid[x + 1][y].a * 0.2;
  sumA += grid[x][y + 1].a * 0.2;
  sumA += grid[x][y - 1].a * 0.2;
  sumA += grid[x - 1][y - 1].a * 0.05;
  sumA += grid[x + 1][y - 1].a * 0.05;
  sumA += grid[x + 1][y + 1].a * 0.05;
  sumA += grid[x - 1][y + 1].a * 0.05;
  return sumA;
}

function laplaceB(x, y) {
  var sumB = 0;
  sumB += grid[x][y].b * -1;
  sumB += grid[x - 1][y].b * 0.2;
  sumB += grid[x + 1][y].b * 0.2;
  sumB += grid[x][y + 1].b * 0.2;
  sumB += grid[x][y - 1].b * 0.2;
  sumB += grid[x - 1][y - 1].b * 0.05;
  sumB += grid[x + 1][y - 1].b * 0.05;
  sumB += grid[x + 1][y + 1].b * 0.05;
  sumB += grid[x - 1][y + 1].b * 0.05;
  return sumB;
}



function swap() {
  var temp = grid;
  grid = next;
  next = temp;
}
