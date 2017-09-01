var grid, next;

var gridWidth; 
var gridHeight;

var dASlider, dBSlider, gridWidthSlider, gridHeightSlider;

var dA, dB;
var dt = 0.5;

var rho = 0.001;
var rhoA = 0.001;
var muI = 0.03;
var muA = 0.02;
var kappa ;

var maxA;
var minA;

var iter = 100;

function setup() {
  canvas = createCanvas(851, 251);
  canvas.position(0,300);
  textSize(15);
  noStroke();

  dASlider = createSlider(0.0, 0.05, 0.02, 0.001); 
  dASlider.position(300, canvas.y );
  dBSlider = createSlider(0.0, 2.0, 1.0, 0.001); 
  dBSlider.position(300, dASlider.y + 30); 

  kappaSlider = createSlider(0.0, 0.2, 0.10, 0.001);
  kappaSlider.position(300, dBSlider.y + 30); 

  gridWidthSlider = createSlider(25, 200, 200, 1);
  gridWidthSlider.position(300, kappaSlider.y + 30);
  gridHeightSlider = createSlider(25, 200, 200, 1);
  gridHeightSlider.position(300, gridWidthSlider.y + 30); 

  resetSketch();
  pixelDensity(1);
  createP('');
  
  
  var restartButton = createButton("Restart with new parameters");
  restartButton.mousePressed(restartSketch);
  restartButton.position(300, gridHeightSlider.y + 30);
  createP('');
  var resetButton = createButton("Reset");
  resetButton.mousePressed(resetSketch);
  resetButton.position(300, restartButton.y + 30);
  frameRate(100);
}

function updateGridWidth(){
  gridWidth = gridWidthSlider.value();
}

function updateGridHeight(){
  gridHeight = gridHeightSlider.value();
}

function updatedA(){
  dA = dASlider.value();
}

function updatedB(){
  dB = dBSlider.value();
}

function updateKappa(){
  kappa = kappaSlider.value();
}

function draw() {
  background(255);
  for (var count = 0; count < iter; count++){
          minA = 0.5;
	  maxA = 0.5;
	  for (var x = 0; x < gridWidth; x++) {
	    for (var y = 0; y < gridHeight; y++) {
	      var a = grid[x][y].a;
	      var b = grid[x][y].b;
	      next[x][y].a = a +
		dt*((rho/b)*((a*a)/(1 + (kappa*a*a))) - muA * a + rhoA + (dA * laplaceA(x,y)));
		
	      next[x][y].b = b +
		dt*(rho*((a*a)/(1 + (kappa*a*a))) - muI *b + (dB * laplaceB(x,y)));
	      if (next[x][y].a < 0.0) next[n][x][y].a = 0.0
	      if (next[x][y].b < 0.0) next[n][x][y].b = 0.0
	      if (next[x][y].a < minA) minA = next[x][y].a
	      if (next[x][y].a > maxA) maxA = next[x][y].a
	    }
	  }
        swap();
  }
  loadPixels();
	  for (var x = 0; x < gridWidth; x++) {
	    for (var y = 0; y < gridHeight; y++) {
	      var pix = (x + y * width) * 4;
	      var c = map(next[x][y].a, minA, maxA, 0, 255);
	      pixels[pix + 0] = c;
	      pixels[pix + 1] = c;
	      pixels[pix + 2] = c;
	      pixels[pix + 3] = 255;
	    }
	  }
  
  updatePixels();
  
  text("Diffusion of Activator = "+ dA, dASlider.x + dASlider.width + 20, dASlider.y-canvas.y+20);
  text("Diffusion of Inhibitor = "+ dB, dBSlider.x + dBSlider.width + 20, dBSlider.y-canvas.y+20);
  text("Interaction = "+ kappa, kappaSlider.x + kappaSlider.width + 20, kappaSlider.y-canvas.y+20);
  text("GridWidth = "+ gridWidth, gridWidthSlider.x + gridWidthSlider.width + 20, gridWidthSlider.y-canvas.y+20);
  text("GridHeight = " + gridHeight , gridHeightSlider.x + gridHeightSlider.width + 20, gridHeightSlider.y-canvas.y+20);
  
}

function resetSketch(){
  
  dASlider.value(0.02);
  dBSlider.value(1.0);
  kappaSlider.value(0.1);
  gridWidthSlider.value(200);
  gridHeightSlider.value(200);
  restartSketch();
}

function restartSketch(){
  
  updatedA();
  updatedB();
  updateKappa();
  updateGridWidth();
  updateGridHeight();
  dASlider.input(updatedA);
  dBSlider.input(updatedB);
  kappaSlider.input(updateKappa);
  gridWidthSlider.input(updateGridWidth);
  gridHeightSlider.input(updateGridHeight);

  grid = [];
  next = [];
	  minA = 0.5;
	  maxA = 0.5;
	  for (var x = 0; x < gridWidth; x++) {
	    grid[x] = [];
	    next[x] = [];
	    for (var y = 0; y < gridHeight; y++) {
	      grid[x][y] = {
		a: 0,
		b: 0
	      };
	      next[x][y] = {
		a: 0,
		b: 0
	      };
	    }
          }

  for (var i = 0; i < gridWidth; i++) {
    for (var j = 0; j < gridHeight; j++) {
      grid[i][j].a = randomGaussian(0.5,0.1);
      grid[i][j].b = 0.1;
    }
  }
      
}

function laplaceA(x, y) {
  var sumA = 0;
  var xplus1 = x+1;
  var xminus1 = x-1;
  var yplus1 = y+1;
  var yminus1 = y-1;
  if( x == 0 ) xminus1 = gridWidth - 1;
  if( x == gridWidth - 1 ) xplus1 = 0;
  if( y == 0 ) yminus1 = gridHeight - 1;
  if( y == gridHeight - 1 ) yplus1 = 0;
  sumA += grid[x][y].a * -1;
  sumA += grid[xminus1][y].a * 0.25;
  sumA += grid[xplus1][y].a * 0.25;
  sumA += grid[x][yplus1].a * 0.25;
  sumA += grid[x][yminus1].a * 0.25;
  return sumA;
}

function laplaceB(x, y) {
  var sumB = 0;
  var xplus1 = x+1;
  var xminus1 = x-1;
  var yplus1 = y+1;
  var yminus1 = y-1;
  if( x == 0 ) xminus1 = gridWidth - 1;
  if( x == gridWidth - 1 ) xplus1 = 0;
  if( y == 0 ) yminus1 = gridHeight - 1;
  if( y == gridHeight - 1 ) yplus1 = 0;
  sumB += grid[x][y].b * -1;
  sumB += grid[xminus1][y].b * 0.25;
  sumB += grid[xplus1][y].b * 0.25;
  sumB += grid[x][yplus1].b * 0.25;
  sumB += grid[x][yminus1].b * 0.25;
  return sumB;
}



function swap() {
  var temp = grid;
  grid = next;
  next = temp;
}
