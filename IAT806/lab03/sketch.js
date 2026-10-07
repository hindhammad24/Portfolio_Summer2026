// we have 8 frames to load
const FRAME_COUNT = 8;

// this is a empty box to put the list in
let frames = [];

// the first number of frames
let index = 0;

// STEP 5: parallel arrays, one entry per animated dancer
let xs = [240, 440, 640];
let speeds = [4, 8, 16]; // draw-frames per pose: smaller = faster

async function setup() {
  createCanvas(800, 420);
  textFont("monospace");
  textSize(14);

  // this is loading all the images in the file in a loop so one after the other
  for (let i = 0; i < FRAME_COUNT; i++) {
    frames.push(await loadImage("dance_frames/dance" + i + ".png"));
  }
}

function draw() {
  background(240);

  // STEP 3: contact sheet, a loop and an array doing visible work
  for (let i = 0; i < frames.length; i++) {
    image(frames[i], i * 100, 0, 100, 125);
  }

  // STEP 2: click-controlled dancer
  image(frames[index], 20, 160, 160, 200);
  fill(0);
  text("click: frames[" + index + "]", 20, 390);

  // STEP 4: animate, first attempt (60 fps, looks like a blur):
  //   let pose = frameCount % frames.length;
  // fixed: hold each pose for `speed` draw-frames
  // STEP 5: one loop draws every dancer, each at its own x and speed
  for (let i = 0; i < xs.length; i++) {
    let pose = floor(frameCount / speeds[i]) % frames.length;
    image(frames[pose], xs[i], 160, 160, 200);
  }
}

// STEP 2: advance the index, wrapping at the end
function mousePressed() {
  index = (index + 1) % frames.length; // delete "% frames.length" to get the out-of-range error
}
