// this class is like the main for making balls
class Ball {
  // this saves the main info
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    //saves the original color so we can change it back
    this.origColor = c;
    this.c = c;

    //color used for reacts
    this.highlightColor = color(100, 100, 100, 50);

    // color of the outline
    this.defaultStrokeColor = "black";
  }

  // moves the ball and changes its size and shows it
  update(n) {
    this.move(n);
    this.changeSize(n);
    this.show();
  }

  // this moves the ball a little
  move(n) {
    this.x += random(-n, n);
    this.y += random(-n, n);
  }

  // adius keeps between 2 and 30
  changeSize(n) {
    this.r = constrain(this.r + random(-n, n), 2, 30);
  }

  //checks if a point is inside the ball
  contains(px, py) {
    if (dist(this.x, this.y, px, py) < this.r) {
      return true;
    } else {
      return false;
    }
  }

  // this highlights the ball if active is true
  // otherwise it changes the ball back to its original color
  respond(active) {
    if (active) {
      this.highlight();
    } else {
      this.deHighlight();
    }
  }

  // highlight color
  highlight() {
    this.c = this.highlightColor;
  }

  //changes the ball back to its orig color
  deHighlight() {
    this.c = this.origColor;
  }

  // this checks the mask pixel at the ball's position
  // low alpha means the pixel is mostly transparent
  isOnBody(mask) {
    let px = mask.get(floor(this.x), floor(this.y));
    return px[3] < 128;
  }

  //draws the ball with its color and size
  show() {
    fill(this.c);
    stroke(this.defaultStrokeColor);
    circle(this.x, this.y, this.r * 2);
  }
}

// this is a type of ball that also changes size when respond runs
class FlickerBall extends Ball {
  // the normal color response and adds another size change
  respond(active) {
    super.respond(active);
    this.changeSize(3);
  }
}
