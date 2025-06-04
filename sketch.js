// dvd bouncing text animation with p5.js
let x, y; // position of text
let xSpeed, ySpeed; // speed in x and y directions
let textString = "leff is under development";
let textW, textH; // text width and height
let colors = [
  '#ff0000', '#00ff00', '#0000ff', '#ffff00', 
  '#ff00ff', '#00ffff', '#ff8000', '#8000ff'
];
let currentColor = 0;

function setup() {
  // get the html canvas element and create p5 canvas on it
  let canvasElement = document.getElementById('bg-canvas');
  let canvas = createCanvas(windowWidth, windowHeight, canvasElement);
  
  // initial position (center of screen)
  x = width / 2;
  y = height / 2;
  
  // random initial speed
  xSpeed = random(1, 2);
  ySpeed = random(1, 2);
  
  // set text properties
  textSize(18);
  textFont('Helvetica', 18);
  
  // calculate text dimensions
  textW = textWidth(textString);
  textH = textAscent();
}

function draw() {
  // dark background
  background(20);
  
  // update position
  x += xSpeed;
  y += ySpeed;
  
  // check for collision with edges and bounce
  if (x + textW >= width || x <= 0) {
    xSpeed *= -1;
    changeColor();
  }
  
  if (y >= height || y - textH <= 0) {
    ySpeed *= -1;
    changeColor();
  }
  
  // keep within bounds
  x = constrain(x, 0, width - textW);
  y = constrain(y, textH, height);
  
  // draw the bouncing text
  fill(colors[currentColor]);
  noStroke();
  textAlign(LEFT, BASELINE);
  text(textString, x, y);
}

function changeColor() {
  // change color when bouncing off edges
  currentColor = (currentColor + 1) % colors.length;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // recalculate bounds
  x = constrain(x, 0, width - textW);
  y = constrain(y, textH, height);
}
