let frames = [];
let myAge = 10;
let myName = "Hind";
let myStudentsAges = [];
let numFrames = 8;

// let firstName = "Hind";
// let lastName = "Hammad";
// let fullName = firstName + " " + lastName;

let numCols = 15;
let numRows = 15;
let colWidth;
let rowHeight;

let colors = [];
async function setup() {
  createCanvas(800, 420);

  colWidth = width / numCols;
  rowHeight = height / numRows;

  for (i = 0; i < numCols; i++) {
    colors[i] = [];
    for (j = 0; j < numRows; j++) {
      colors[i][j] = color(random(0, 255), random(0, 255), random(0, 255));
    }
  }

  for (let i = 0; i < numFrames; i++) {
    // let fileName = `dance_frames/dance${i}.png`;
    let fileName = "dance_frames/dance" + i + ".png";

    frames.push(await loadImage(fileName));
  }
}

function draw() {
  background(120);
  if (mouseX < width) {
    numCols = Math.floor(map(mouseX, 0, width, 1, 20));
    colWidth = width / numCols;
  }
  // fill("black");
  // text(fullName, 100, 100);

  // old way without funciton
  // let speed = 10;
  // let slowFrame = floor(frameCount / speed);
  // let index = slowFrame % frames.length;
  // text(index, 500, 160);
  // image(frames[index], 600, 300, 100, 100);

  // trying the coppy paste
  // speed = 30;
  // slowFrame = floor(frameCount / speed);
  // index = slowFrame % frames.length;
  // image(frames[index], 30, 30, 200, 200);

  // //new way with funciton
  // fill(0,0,0,255);
  // rect (0,0, colWidth,height);

  for (let i = 0; i < numCols; i++) {
    for (let j = 0; j < numRows; j++) {
      //fill(random(0, 255), random(0, 255), random(0, 255), 200);
      // can be doen by using each one too
      fill(colors[i][j]);
      rect(colWidth * i, rowHeight * j, colWidth, rowHeight);
      animate(frames, 10, colWidth * i, rowHeight * j, colWidth);
    }
  }

  let xSize = 200;
  //let ySize = ;
  let speed = 8;
  animate(frames, speed, 100, 100, xSize);
  // animate(frames, speed, 400, 150, xSize);
  // animate(frames, speed, 300, 250, xSize);
}

// function collection of stuff that can take inputs and with set of rules u ask it to give you an output.
// a function in a function.
function animate(frames, speed, xPos, yPos, xSize, ySize) {
  //   let slowFrame = floor(frameCount / speed);
  //   let index = slowFrame % frames.length;
  let index = getFrameIndex(speed);
  let currentFrame = frames[index];

  // just to figure out the ration its a square 1254, 1254
  let origW = currentFrame.width;
  let origH = currentFrame.height;
  // text(origW + " " + origH, 200, 200);

  // so this says if i was  given only the width i can find hwo much of a chnage and find the hieght.
  if (xSize && !ySize) {
    let scale = xSize / origW;
    ySize = scale * origH;
  }

  image(currentFrame, xPos, yPos, xSize, ySize);
}

// function with return means it can give u vback somehting.
function getFrameIndex(speed) {
  let slowFrame = floor(frameCount / speed);
  let index = slowFrame % frames.length;
  return index;
}
