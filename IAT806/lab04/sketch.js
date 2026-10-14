//bonus things
//disco background effect
// mouse interaction that changes the number of grid columns
// the closer dancer to the mouse is bigger the father away a little smaller
// under the mouse the nearby dancers are brighter and parther away are dimmer usin alpha

let frames = [];
let frames2 = [];
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

  //  the second jump frames
  for (let i = 0; i < 4; i++) {
    let fileName = "jump_frames/jump" + i + ".png";

    frames2.push(await loadImage(fileName));
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

      // ok so dancers reacting to the mouse
      //this is my logic
      // so the dancers need to know how close they are to the mouse
      // then i calculate the center of each dancer from the  column and row
      // then I use dist() i know this from before honestly
      // i find the distance between the dancer and the mouse and then
      //  change  that distance into a  speed using map() like in class.

      // the center of the boxes in the grid
      //  ok so x is the dancer horizontal center
      // so the column index i so is it the first the second or the third
      // and so on multipleed with column width so witch one on the columsn
      // then adding half of the column width to reach the middle of the box.
      // so like on paper it find witch column and takes half of it
      let x = i * colWidth + colWidth / 2;
      //same as the previous for the height
      let y = j * rowHeight + rowHeight / 2;

      //this will find the distance
      let d = dist(x, y, mouseX, mouseY);
      // this will find the max distance from the corner
      let maxDist = dist(0, 0, width, height);
      // now we map the dist to the speed father slower closer faster
      let speed = map(d, 0, maxDist, 2, 20);
      // dancer size changes from  how close it is to the mouse
      let dancerSize = map(d, 0, maxDist, colWidth * 1.5, colWidth);

      // spotlight effect where dancers on the mouse
      let brightness = map(d, 0, maxDist, 255, 80);
      tint(255, brightness);
      // found this with chatgpt help not to lie

      //  variable dance frames
      let danceFrames;

      // this checks if the grid position is even or odd i learned this in other classes so hopefully this is wht u mean
      if ((i + j) % 2 === 0) {
        // even numbers use the normal dance
        danceFrames = frames;
      } else {
        // odd numbers jump animation
        danceFrames = frames2;
      }

      animate(danceFrames, speed, colWidth * i, rowHeight * j, dancerSize);
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
  //added the frmaes so it is diffrenct from jump to regurar
  let index = getFrameIndex(frames, speed);
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
function getFrameIndex(frames, speed) {
  let slowFrame = floor(frameCount / speed);
  let index = slowFrame % frames.length;
  return index;
}
