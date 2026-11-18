class Flower {
  constructor(side) {
    this.side = side;
    this.x = side === "left" ? 130 : 510;
    this.y = 235;
    this.opening = 0;
    this.bloomedAt = null;
  }

  update(raised) {
    this.opening = lerp(this.opening, raised ? 1 : 0, 0.18);
  }

  show() {
    const opening = this.opening;
    push();
    translate(this.x, this.y);
    stroke("#a7c892");
    strokeWeight(4);
    line(0, 10, 0, 96);
    noStroke();
    fill("#80a86d");
    ellipse(-11, 67, 26, 13);
    ellipse(11, 82, 26, 13);
    fill(this.side === "left" ? "#f5a8bc" : "#dfb4ff");
    for (let petal = 0; petal < 6; petal++) {
      push();
      rotate(petal * TWO_PI / 6);
      ellipse(0, -7 - 19 * opening, 20, 24 + 13 * opening);
      pop();
    }
    fill("#ffe6a1");
    circle(0, 0, 14 + 9 * opening);
    pop();
  }
}
