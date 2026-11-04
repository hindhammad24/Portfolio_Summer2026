// list of balls
let balls = [];

// how many balls
let numBalls = 3000;

let bodySegmentation;
let video;
let segmentation;

// this tells the model to make a person mask
let options = {
  maskType: "person",
};

// makes the canvas, balls and webcam
async function setup() {
  createCanvas(1280, 960);

  for (let i = 0; i < numBalls; i++) {
    balls.push(createRandomBall());
  }

  // this starts the webcam and makes it match the canvas size
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // waits for the body detection lloads
  bodySegmentation = await ml5.bodySegmentation("SelfieSegmentation", options);
  bodySegmentation.detectStart(video, gotResults);
}

// draws the video and updates every ball
function draw() {
  background(120);

  // this shows the webcam on the canvas
  image(video, 0, 0);

  for (let ball of balls) {
    let onBody = false;

    // checks if the ball is on the body
    if (segmentation) {
      onBody = ball.isOnBody(segmentation.mask);
    }
    ball.respond(ball.clicked || onBody);
    ball.update(1);
  }
}

// checks every ball when click
function mousePressed() {
  for (let ball of balls) {
    //if the click was inside this ball
    ball.clicked = ball.contains(mouseX, mouseY);
    // changes the color based on that click
    ball.respond(ball.clicked);
  }
}

// returns a ball with a random pos and color
function createRandomBall() {
  let ballX = random(0, width);
  let ballY = random(0, height);
  let ballC = color(140, 0, 140 + random(-100, 100), 50);
  let ballR = 5;
  let ball;

  // this makes most balls normal and some flicker balls
  if (Math.random() < 0.9) {
    ball = new Ball(ballX, ballY, ballC, ballR);
  } else {
    ball = new FlickerBall(ballX, ballY, ballC, ballR);
  }

  // not clicked
  ball.clicked = false;

  return ball;
}

//only saves
function gotResults(result) {
  segmentation = result;
}
