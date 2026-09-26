console.log("i believe i can do this");

// create a variable
//gloabl barialbel
let watermelon = 300;
//say let only once for the same variable
let circleX = 50;
let circleY = 50;
let speedX = 5;
let sizeIncrement = 1;
let speedY = 5;
let size = 100;
let radius = size / 2;

function setup() {
  createCanvas(800, 600);
  //it happenes once
}

// this loops over and over again 60 frame per second
function draw() {
  background(20);

  // make it move with mouse
  //circle(mouseX, mouseY, 100);

  // how to use variables
  //circle(watermelon, 59, 100);

  //local variable
  //let circleX = mouseX;
  //changes the gloabl variable
  // watermelon = 70;
  //circle(watermelon, circleX, 100);

  circleX = circleX + speedX;
  circleY = circleY + speedY;

  if (circleX >= width - radius || circleX < radius) {
    speedX = speedX * -1;
    size = size + sizeIncrement;
    // so everythime it touches the waall it will choose a random color
    fill(random(0, 255), random(0, 255), random(0, 255));
  }

  if (circleY >= height - radius || circleY < radius) {
    speedY = speedY * -1;
  }

  if (size > width || size < 0) {
    // if it touches the wall and inclreases size but then gets bigger than the width
    // or smaller than zero it starts to reverse the increment so gets bigger or smaller
    sizeIncrement = sizeIncrement * -1;
  }

  circle(circleX, circleY, size);
}

function mousePressed() {
  // reverses direction when pressed the mouse
  speedX = speedX * -1;
  speedY = speedY * -1;
}
