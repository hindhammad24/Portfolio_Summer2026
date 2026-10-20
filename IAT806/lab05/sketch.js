let balls = [];
let numBalls = 1000;

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent("sketch-holder");
  for (let i = 0; i < numBalls; i++) {
    let ballX = random(0, 600);
    let ballY = 300;
    let ballC = color(20, 130, 140 + random(-100, 100), 180);
    let ballR = 10;
    let ball = new Ball(ballX, ballY, ballC, ballR);
    balls.push(ball);
  }
}

function draw() {
  background(120);
  for (let ball of balls) {
    ball.change(2);
  }
}

class Ball {
  constructor(x, y, c, r) {
    this.x = x;
    this.y = y;
    this.color = c;
    this.r = r;
    // the first two balls are the eaters
    this.isEater = balls.length < 2;
    // poop or inside the belly
    this.isPoop = false;
    this.isEaten = false;

    //as if it is in the belly
    this.stomach = [];

    //makes the eater bigger
    if (this.isEater) {
      this.r = 35;
    }

    // counts frames since the last poop
    this.poopTimer = 0;
  }

  change(byHowMuch) {
    this.changeSize(byHowMuch);
    this.move(byHowMuch);
    this.show();
  }
  change(byHowMuch) {
    // swallowed balls do nothing and hid
    // maybe not the best way to return nothing (feel free to recommend better)
    if (this.isEaten) {
      return;
    }

    // only living ball moves and eats and then poops

    if (!this.isPoop) {
      this.move(byHowMuch);
      this.eatNearby(5);
      this.poopAfter(30);
    }
    this.show();
  }

  move(byHowMuch) {
    this.x += random(-byHowMuch, byHowMuch);
    this.y += random(-byHowMuch, byHowMuch);
  }

  changeSize(byHowMuch) {
    this.r = constrain(this.r + random(-byHowMuch, byHowMuch), 2, 50);
  }

  // my first method:
  // it allows the bigger balls to eat nearby smaller ones
  // and then they grow bigger as if they eat
  eatNearby(reach) {
    // so this says if it is not the eater then do tnothing
    if (!this.isEater) {
      return;
    }

    // but for eavery small ball which is the snack loop over them
    for (let snack of balls) {
      //  if it is not the snack and eater and is not snack and is ppoped and is not snack and is eaten
      if (!snack.isEater && !snack.isPoop && !snack.isEaten) {
        // then we measure the distance
        let distance = dist(this.x, this.y, snack.x, snack.y);

        // if the distance is smaller that half the raduis and a bonus for reaching it
        if (distance < this.r / 2 + reach) {
          // then the snack is eaten and and going into the stomach and the belly grows
          snack.isEaten = true;
          this.stomach.push(snack);
          this.r += 0.5;
          return;
        }
      }
    }
  }

  // my secodn method is the poop one
  // makes after a delay a poop that is brown and smaller
  poopAfter(delay) {
    // if the stomach is empty then nothign
    if (this.stomach.length === 0) {
      return;
    }

    // this counts for the poop how long it is in there
    this.poopTimer += 1;

    //if the pooptimer is equal to the delay time i set then
    if (this.poopTimer >= delay) {
      // then the ball goes out of the stoomach and becomes poop
      let poop = this.stomach.shift();

      // the poop is then no longer eaten but pooped
      poop.isEaten = false;
      poop.isPoop = true;
      // the color changes to brown
      poop.color = color(110, 65, 30);
      // smmaller in size
      poop.r = 5;

      poop.x = this.x;
      poop.y = this.y + this.r / 2 + poop.r / 2;

      this.r -= 2;
      this.poopTimer = 0;
    }
  }

  show() {
    fill(this.color);
    circle(this.x, this.y, this.r);
  }
}
