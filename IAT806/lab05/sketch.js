let myBall;
let myBall2;

function setup() {
  createCanvas(800, 600);

  // using class to make  one object
  myBall = new Ball();
  // anbother instance
  myBall2 = new Ball();
}

function draw() {
  background(120);
  myBall.x;
  myBall.move();
  myBall.show();
}

class Ball {
  constructor() {
    //atributes
    this.x = 400;
    this.y = 500;
    this.r = 20;
  }

  //method
  // functions that are defined for a class
  show() {
    fill(120, 130, 150);
    // herew we use the atributes
    circle(this.x, this.y, this.r);
  }

  move() {
    this.x += random(-5, 5);
    this.y += random(-5, 5);
  }
}
