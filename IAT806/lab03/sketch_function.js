// IAT 806 · Arrays, loops, functions · COMPLETE VERSION
// Run with Live Server. Uses p5 2.x (async setup, await loadImage).

const FRAME_COUNT = 8;

// STEP 2: one array replaces dance0 ... dance7
let frames = [];

// STEP 2: which frame the click-controlled dancer shows
let index = 0;

// STEP 7: parallel arrays, one entry per animated dancer
let xs = [240, 440, 640];
let speeds = [4, 8, 16]; // draw-frames per pose: smaller = faster

async function setup() {
  createCanvas(800, 420);
  textFont("monospace");
  textSize(14);

  // STEP 1 was a single:  img = await loadImage('dance_frames/dance0.png');
  // STEP 3: load all eight with a loop and string concatenation
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

  // STEPS 5-7: several animated dancers from one function
  for (let i = 0; i < xs.length; i++) {
    animate(frames, xs[i], 160, speeds[i]);
  }
}

// STEP 2: advance the index, wrapping at the end
function mousePressed() {
  index = (index + 1) % frames.length; // delete "% frames.length" to get the out-of-range error
}

// STEP 6: RETURNS a value (like random()). Picks which image to show.
function currentFrame(list, speed) {
  // STEP 4, first attempt (60 fps, looks like a blur):
  //   return list[frameCount % list.length];
  // STEP 4, fixed: hold each pose for `speed` draw-frames
  return list[floor(frameCount / speed) % list.length];
}

// STEP 5: DOES something (like ellipse()). Draws one dancer.
function animate(list, x, y, speed) {
  image(currentFrame(list, speed), x, y, 160, 200);
}
