console.log("this is my robot from planet hind");
// all comments are refrences for me to remember what each thing is

function setup() {
  // this sets up the main board with size
  // createCanvas(width, height);
  createCanvas(800, 600);
}

function draw() {
  // navy blue dark background color
  // background(red, green, blue, alpha);
  background(30, 40, 60);

  //robot neck
  fill(255, 170, 200);
  // rect(x, y, width, height);
  rect(400, 270, 40, 40);

  // robot head
  // doesnt allow a outside outline
  noStroke();
  // light teal color
  fill(163, 214, 204);
  // x,y = center
  rectMode(CENTER);
  rect(400, 220, 130, 80);

  // robot eyes out
  //white
  fill(255);
  //circle(x, y, diameter);
  circle(375, 220, 15);
  circle(425, 220, 15);

  // robot eyes in
  // black
  fill(0);
  circle(375, 220, 5);
  circle(425, 220, 5);

  // robot mouth
  // no color for circle or arc
  noFill();
  // color of outline black
  stroke(0);
  //arc(x,y,width,height,startAngle,endAngle);
  arc(400, 240, 40, 20, 0, PI);

  // robot antena
  // white
  stroke(255);
  // line(x1, y1, x2, y2);
  line(400, 180, 400, 140);
  // light pink
  fill(255, 170, 200);
  noStroke();
  circle(400, 140, 15);

  //robot body
  //darker teal
  fill(90, 190, 180);
  rect(400, 350, 170, 150);

  // robot legs
  // tealish
  stroke(163, 214, 204);
  line(360, 425, 330, 520);
  line(440, 425, 470, 520);

  // triangle feet
  // light pink
  fill(255, 170, 200);
  noStroke();
  // triangle(x1, y1, x2, y2, x3, y3);
  triangle(300, 540, 350, 540, 330, 510);
  triangle(450, 540, 500, 540, 470, 510);

  // robot hands
  // tealish
  stroke(163, 214, 204);
  line(315, 330, 250, 400);
  line(485, 330, 550, 400);

  // hands using ellipse
  // ight pink
  fill(255, 170, 200);
  noStroke();
  //ellipse(x, y, width, height);
  ellipse(240, 420, 35, 50);
  ellipse(560, 420, 35, 50);

  // charger plug
  // light pink
  fill(255, 170, 200);
  noStroke();
  // x is with mouse x abd the y with mouse y
  rect(mouseX, mouseY, 60, 40, 10);

  // metal pins
  // grey
  fill(220);
  rect(mouseX - 15, mouseY - 25, 8, 20);
  rect(mouseX + 15, mouseY - 25, 8, 20);
}
