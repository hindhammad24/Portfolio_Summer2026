// extra things i added
// i made it when the click is clicke it changes the background liek disco
// when the c is presses on keypad the cat tint changes
// when the mouse click at its position i added a poop that slides down then disapears

// we have 8 frames to load
const FRAME_COUNT = 8;

// this is a empty box to put the list in
let frames = [];
let sounds = [];
let poops = [];
let poopImage;

// the first number of frames
let index = 0;
let soundIndex = 0;
let discoColor;
let catColor;

// so each cat dance is entered once for  the 3 on the front
let xs = [240, 440, 640];
let speeds = [4, 8, 16]; //this lests us experiment with diffrent speeds

async function setup() {
  createCanvas(800, 420);
  textFont("monospace");
  textSize(14);

  // starting disco background color
  discoColor = color(255, 150, 200);
  catColor = color(200, 130, 130);

  // this is loading all the images in the file in a loop so one after the other
  for (let i = 0; i < FRAME_COUNT; i++) {
    frames.push(await loadImage("dance_frames/dance" + i + ".png"));
  }

  // loading all cat meow sounds in a loop
  for (let i = 0; i < 4; i++) {
    sounds.push(await loadSound("sounds/sound" + i + ".mp3"));
  }

  // loading poop image
  poopImage = await loadImage("images/poop.png");
}

function draw() {
  background(discoColor);

  // here we load all the images nect to one another to show all the frames
  //for (let i = 0; i < frames.length; i++) {
  //image(frames[i], i * 100, 0, 100, 125);
  //}

  // this puts the cat that is click-controlled by press
  //so it advaces by click
  // change cat color based on disco background
  tint(red(catColor), green(catColor), blue(catColor));
  image(frames[index], 20, 160, 160, 200);
  noTint();
  text("click: frames[" + index + "]", 20, 390);

  // so first the cat is too fast
  // let pose = frameCount % frames.length;
  // so now we have to hold it for a certain time so its not too fast
  // and we create a loop that draws every dancer, each at its own x and speed
  for (let i = 0; i < xs.length; i++) {
    let pose = floor(frameCount / speeds[i]) % frames.length;
    image(frames[pose], xs[i], 160, 160, 200);
  }

  //  falling poop image when clicks
  for (let i = 0; i < poops.length; i++) {
    image(poopImage, poops[i].x, poops[i].y, 40, 40);
    // make poop fall down  like the ball from last week but easier no y
    poops[i].y += 3;
  }
}

// once the mouse is pressed the  images change to the next oen
function mousePressed() {
  userStartAudio(); // allows browser sound after clicking
  index = (index + 1) % frames.length; // vhnages the cat pose

  // play cat meow
  sounds[soundIndex].play();
  // move to next sound
  soundIndex = (soundIndex + 1) % sounds.length;

  // change disco color every click
  discoColor = color(random(255), random(255), random(255));

  // create a poop when the mouse is clicked at thje mouse postion
  poops.push({
    x: mouseX,
    y: mouseY,
  });
}

// press space to stop and start the animation
function keyPressed() {
  //  ok so how it works if it is pressed the spaced bar
  // it checks if the space bar is pressed

  if (key === " ") {
    // if the loop is running then  it stosp no loops

    if (isLooping()) {
      noLoop();
    } else {
      // else  it starts the loop
      loop();
    }
  }

  // change cat color with the C key  only the left one
  if (key === "c") {
    catColor = color(random(255), random(255), random(255));
  }
}
