// ok so here is the steps i want to take to make this
// step one make the normal looking landscape using shapes
// sun circle yellow pastel , background gradient using rect ontop of one another then triangles for mountains and color
// then when mousepressed on the sun  click changes to mode disco
// the moon i want made out of arc background will be clolumns and rows arrays that draw ellipse to create hexagon colorfull all neons or random colors but random very colorful
// for mouse x and y when it is over  the area the background hexagons get smaller and futher away from then bigger with the mouse movements
// the for key pressed when pressed key s then random squares going down horizontally squares rain
// function for animating the characters  make all the chanracters dance

// my background colors from top to bottom in pastels
// so syntax here is that it is an array holds or list  []
// each color is a string inside quotes
let skyColors = [
  "#f1dcac",
  "#eec2a4",
  "#ed9a94",
  "#f98dbd",
  "#f98de3",
  "#d38df9",
  "#a68df9",
  "#9d8df9",
  "#8da8f9",
];

// my neon colors to randomly choose from
let neonColors = [
  "#fc3636",
  "#f4e83d",
  "#61f950",
  "#60fae8",
  "#4b7af9",
  "#ff53fc",
];

// my sun position and size
// the syntax to any variable is let variableName = value;
let sunX = 650;
let sunY = 120;
let sunSize = 110;
let discoMode = false;
let numCols = 14;
let numRows = 12;
let discoColors = [];
let rainOn = false;
let rainXs = [];
let rainYs = [];
let rainSpeeds = [];
let numSquares = 20;
let uniFrames = [];
let treeFrames = [];
let octoFrames = [];
let numFrames = 8;

// runs once when the sketch starts as we learned in week 1
// chat told me that async lets setup wait for the images
async function setup() {
  // creates the canvas that is 800 pixels wide and 600 pixels tall why this idk
  // the syntax is createCanvas(width, height)
  createCanvas(800, 600);

  // removes the outlines from the shapes becouse i like the aesthetics
  noStroke();

  // gives each square a random starting position and speed for rain
  // this to figure out i used a little ai help
  for (let i = 0; i < numSquares; i++) {
    rainXs[i] = random(0, width);
    rainYs[i] = random(-height, 0);
    rainSpeeds[i] = random(2, 6);
  }

  // loads all 8 pictures for each character
  // same as in lab4
  for (let i = 0; i < numFrames; i++) {
    // syntac loadImage(path)
    //  waits until the image has loaded
    uniFrames[i] = await loadImage("uni_dance/dance" + i + ".png");
    treeFrames[i] = await loadImage("tree_dance/dance" + i + ".png");
    octoFrames[i] = await loadImage("Octo_dance/dance" + i + ".png");
  }
}

// runs again and again to draw the sketch so here i can animate
function draw() {
  // out of setup so it flashes
  // goes through every column
  for (let col = 0; col < numCols; col++) {
    // gives each column its own list of row colors
    // this makes an array inside another array
    discoColors[col] = [];

    // goes through every row in this column
    for (let row = 0; row < numRows; row++) {
      // picks a random color from my neon array
      // the sintax for random is random(array) so it chooses one color
      // so for each box in the array[col][row] it gives a random  color
      discoColors[col][row] = random(neonColors);
    }
  }

  // checks if disco mode is on
  // the syntax is if (condition) { code } else { other code }
  // if discoMode is true it draws night otherwise it draws day
  if (discoMode) {
    // draws my disco background before the moon
    drawDisco();

    // draws crazy characters
    // so i want them above the mountains
    //animateCharacters();

    // moon almost white
    fill("#f0fefe");

    // draws half a circle for the moon
    // the syntax is arc(x, y, width, height, start, stop, mode)
    // angles use radians by default so PI is half a turn this i needed ai to figure out
    // CHORD joins the ends of the arc with a straight line i hated this part and figuring it out
    // same position as sun and sizes
    arc(sunX, sunY, sunSize, sunSize, HALF_PI, PI + HALF_PI, CHORD);
  } else {
    // draws the sky using my own function
    // the syntax just functionName()
    drawSky();

    // sun yellow pastelly
    fill("#F0E2C3");
    // draws the sun
    // syntax of my first shape circle(x, y, diameter)
    circle(sunX, sunY, sunSize);
  }

  // mountains stay in both modes becouse they are outside the if else
  // mountain color grenish pastel
  fill("#5d8b67");

  // draws mountains shape triangle
  // the syntax is triangle(x1, y1, x2, y2, x3, y3)
  // no specific tiqhnique just trail and error here
  triangle(-100, 600, 160, 260, 430, 600);
  triangle(180, 600, 450, 220, 730, 600);
  triangle(500, 600, 730, 320, 950, 600);

  // draws rain over the mountains only when both modes are on
  // so syntax is if both modes so && means both conditions must be true
  if (discoMode && rainOn) {
    drawRain();
  }

  // the characters only appear and dance in disco mode
  // but above the mountains i could have put it iside the current
  // if statemnt and copy pasted the mountain in both but this is less lines
  if (discoMode) {
    animateCharacters();
  }
}

// draws colored rectangles stacked on top of each other for cool sunset look
// so the syntax is function functionName() { code }
function drawSky() {
  // divides the canvas height by the number of color instead of incoding i used len i learned it from before
  // the syntax behind it arrayName.length gives the number of items so colors
  let bandHeight = height / skyColors.length;

  // repeats the code once for each sky color
  // the syntax to it for (starting value; condition; update) { code }
  // so i start at 0, repeat while it is less than the array length i++ adds 1 to i after each repeat untill all colors
  for (let i = 0; i < skyColors.length; i++) {
    // chooses the color at position index in the array
    // the syntax here is arrayName[index] starts from 0 never more
    fill(skyColors[i]);

    // places each rectangle below the previous one
    //  the syntax to it is rect(x, y, width, height) but for height  i * bandHeight where each rectangle starts verticslly
    // the extra 1 pixel helps prevent gaps between rectangles becouse it hsappened so as a cute debug
    // to find the solution i used ai couldnt think of it
    rect(0, i * bandHeight, width, bandHeight + 1);
  }
}

// runs once mouse is pressed
// no need to call it happens auto
function mousePressed() {
  // measures how far the mouse is from the center of the sun usinf dist
  // the syntax is dist(x1, y1, x2, y2)
  // so mouseX and mouseY are the current mouse position to the sun so i am trying to know when it is on it
  let distance = dist(mouseX, mouseY, sunX, sunY);

  // only changes mode if the click is inside the circle area so not just center of it
  // sunSize / 2 gives the radius which is half the diameter
  // so if the distance between the mouse is <=  less than or equal to the raduis it is stil in it
  if (distance <= sunSize / 2) {
    // flips the mode so i can click again to go back to day
    discoMode = !discoMode;
  }
}

// draws my colorful disco circles in staggered rows
function drawDisco() {
  // clears the old circles so they can change size without leaving trails i needed ai for this couse it was going crazy
  background("#2c1942");

  // the space between each column and row
  let spacingX = width / numCols;
  let spacingY = height / numRows;

  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      // puts each circle in the middle of its box space
      // so for each colum number it goes to it then finds the space between then and goes to half of it so center
      let x = col * spacingX + spacingX / 2;
      let y = row * spacingY + spacingY / 2;

      // i used ai to figure this part out i couldnt just come up with it and dont really get it perfectly
      // shifts every other row sideways for a honeycomb look
      // % gives the remainder after dividing
      // row % 2 is 1 for odd rows and 0 for even rows
      // === checks if two values are equal
      if (row % 2 === 1) {
        x = x + spacingX / 2;
      }

      // measures how far this circle is from my mouse
      let distance = dist(mouseX, mouseY, x, y);

      // makes circles near the mouse smaller and far ones bigger
      // the syntax for it is that it map(value, old minimum, old maximum, new minimum, new maximum)
      // true just keeps the result within the new minimum and maximum so it sows look weird
      let circleSize = map(distance, 0, 250, 8, 48, true);

      // uses the color saved for this column and row from before
      fill(discoColors[col][row]);

      // draws the circle with its changing size
      // ellipse(x, y, width, height, virtacies so hexagon like honeycomb)
      // it does draw hexagon although it shows it on the https://p5js.org/reference/p5/ellipse/
      ellipse(x, y, circleSize, circleSize, 6);
    }
  }
}

// runs automatically when a key is pressed
function keyPressed() {
  // checks for lowercase or uppercase s
  // syntax for this key stores the key that was pressed or || means either can be true so if s or S
  if (key === "s" || key === "S") {
    // switches the rain on or off
    rainOn = !rainOn;
  }
}

// draws and moves my pink square rain
// why square idk
function drawRain() {
  fill("#f500e9");

  for (let i = 0; i < numSquares; i++) {
    // draws each square at its saved position
    // syntax is square(x, y, size)
    square(rainXs[i], rainYs[i], 12);

    // moves the square down by adding its speed to y
    // += adds a value to what is already stored
    rainYs[i] += rainSpeeds[i];

    // checks if the square has fallen below the canvas
    // so before it would keep going down now the same 20 go back up
    if (rainYs[i] > height) {
      // this start at the canvos random again
      rainYs[i] = random(-150, -12);
      rainXs[i] = random(0, width);
    }
  }
}

// draws each character using the animation function from lab 4
function animateCharacters() {
  // higher speed numbers make the animation slower
  let speed = 8;

  // animate(frames, speed, x position, y position, width, height)
  animate(octoFrames, speed, 30, 330, 240, 240);
  animate(uniFrames, speed, 280, 310, 240, 240);
  animate(treeFrames, speed, 530, 330, 240, 240);
}

// so syntax is function animate takes the pictures, speed, position and size as inputs
function animate(frames, speed, xPos, yPos, xSize, ySize) {
  // gets the frame number from my other function
  let index = getFrameIndex(frames, speed);
  // draws the picture at that index
  image(frames[index], xPos, yPos, xSize, ySize);
}

// calculates which picture to show and gives back its index
function getFrameIndex(frames, speed) {
  // frameCount and floor(number) this syntax is rounds down to a whole number
  // dividing by speed slows it
  let slowFrame = floor(frameCount / speed);

  // % gives the remainder so the index repeats from 0 to 7 as we did in lab 4
  let index = slowFrame % frames.length;

  // return result back to the function that called it
  return index;
}
