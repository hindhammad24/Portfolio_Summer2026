// KardunTurtle — give the turtle instructions and watch it draw.
//
// Everything you need to change is in this file.

let turtle;

async function setup() {
  createCanvas(800, 600);

  // The turtle's face. Drop any image into this folder and point at it here —
  // it gets scaled and cropped into a circle, so anything roughly square works.
  const face = await loadImage("hind_picture.jpg");

  // Make a turtle near the bottom left, facing up.
  turtle = new KardunTurtle(200, 420, face);

  giveInstructions();
}

// ---------------------------------------------------------------
// YOUR INSTRUCTIONS GO HERE
// ---------------------------------------------------------------

function giveInstructions() {
  // speed
  // face size
  turtle.setSpeed(6);
  turtle.setSize(70);

  // pen color piiink
  turtle.penColor("#ffb3c7");

  // first H for hind
  turtle.penUp();
  turtle.goTo(120, 180);
  turtle.setHeading(90); // down
  turtle.penDown();
  turtle.forward(140); // left line
  turtle.backward(70); // go to middle
  turtle.left(90); // face right
  turtle.forward(60); // middle line
  turtle.left(90); // face up
  turtle.forward(70); // go to top right
  turtle.backward(140); // right line down

  // second H for hesham my middle name
  turtle.penUp();
  turtle.goTo(280, 180);
  turtle.setHeading(90); // down
  turtle.penDown();
  turtle.forward(140); // left line
  turtle.backward(70); // go to middle
  turtle.left(90); // face right
  turtle.forward(60); // middle line
  turtle.left(90); // face up
  turtle.forward(70); // go to top right
  turtle.backward(140); // right line down

  // third H for hammad my family name
  turtle.penUp();
  turtle.goTo(440, 180);
  turtle.setHeading(90); // down
  turtle.penDown();
  turtle.forward(140); // left line
  turtle.backward(70); // go to middle
  turtle.left(90); // face right
  turtle.forward(60); // middle line
  turtle.left(90); // face up
  turtle.forward(70); // go to top right
  turtle.backward(140); // right line down
}

function draw() {
  background("#14161a");
  turtle.update(); // runs the next bit of the instructions and draws everything
}

// Press R to start over.
function keyPressed() {
  if (key === "r" || key === "R") {
    turtle.reset();
    giveInstructions();
  }
}

// ---------------------------------------------------------------
// Everything the turtle understands
// ---------------------------------------------------------------
//
//   turtle.forward(100)        walk forward, drawing if the pen is down
//   turtle.backward(100)       walk backward
//   turtle.right(90)           turn clockwise, in degrees
//   turtle.left(90)            turn counter-clockwise
//
//   turtle.penUp()             stop drawing
//   turtle.penDown()           start drawing again
//   turtle.penColor("red")     any p5 color
//   turtle.penWidth(8)         line thickness
//
//   turtle.goTo(100, 200)      jump to a point
//   turtle.setHeading(0)       0 = right, 90 = down, -90 = up
//   turtle.home()              back to the start, facing up
//   turtle.stamp()             print the turtle's face onto the drawing
//   turtle.erase()             wipe the drawing, keep the turtle
//   turtle.repeat(4, fn)       do a set of instructions n times
//
//   turtle.setSpeed(4)         pixels per frame — bigger is faster
//   turtle.instant()           no animation, draw it all at once
//   turtle.setSize(80)         how big the turtle is drawn
//   turtle.hide() / .show()    show or hide the turtle itself
//   turtle.reset()             clear everything
