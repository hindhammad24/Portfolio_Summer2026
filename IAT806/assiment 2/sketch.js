const goal = 5;
const bloomDuration = 750;
let score = 0;
let gameState = "start";
// Each hand must come down before it can score again.
let ready = { left: true, right: true };

let flowers = [];
let bodyPose;
let video;
let poses = [];
let lastPoseTime = -Infinity;
let statusMessage;

async function setup() {
  createCanvas(640, 420).parent("sketch");
  statusMessage = document.getElementById("status");

  let sides = ["left", "right"];
  for (let side of sides) {
    flowers.push(new Flower(side));
  }

  if (location.hostname.endsWith(".github.io")) {
    let owner = location.hostname.split(".")[0];
    let folder = location.pathname.split("/").filter(Boolean)[0];
    let repo = folder && folder !== "projects" ? folder : location.hostname;
    let source = document.getElementById("source");
    source.firstElementChild.href = "https://github.com/" + owner + "/" + repo;
    source.hidden = false;
  }

  try {
    bodyPose = await ml5.bodyPose("MoveNet");
    statusMessage.textContent = "Allow webcam access when your browser asks.";
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    await bodyPose.detectStart(video, gotResults);
  } catch (error) {
    statusMessage.textContent = "Could not start tracking. Check camera permissions and reload the page.";
    console.error(error);
  }
}

function draw() {
  background("#202b25");

  if (gameState === "start") {
    if (handIsRaised("left") || handIsRaised("right")) {
      gameState = "playing";
    }
  }

  if (gameState === "playing") {
    updateFlowers(millis());
    if (score === goal && flowers.length === 0) {
      gameState = "won";
    }
  }

  for (let flower of flowers) {
    flower.update(flower.bloomedAt !== null);
    flower.show();
  }

  fill("#f5efe4");
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(26);
  text("Blooms: " + score + " / " + goal, width / 2, 36);

  textSize(19);
  if (gameState === "start") {
    text("Raise either hand to begin", width / 2, 76);
  } else if (gameState === "playing") {
    text("Lower your hand before raising it again", width / 2, 76);
  } else {
    textSize(30);
    text("You bloomed the garden!", width / 2, height / 2);
    textSize(18);
    text("Reload to play again", width / 2, height / 2 + 44);
  }
}

function updateFlowers(now) {
  // Loop backward so removing a flower does not skip one.
  for (let i = flowers.length - 1; i >= 0; i--) {
    let flower = flowers[i];
    let raised = handIsRaised(flower.side);

    if (raised === false) ready[flower.side] = true;

    if (flower.bloomedAt !== null) {
      if (now - flower.bloomedAt >= bloomDuration) {
        flowers.splice(i, 1);
        if (score < goal) flowers.push(new Flower(flower.side));
      }
    } else if (score === goal) {
      flowers.splice(i, 1);
    } else if (raised === true && ready[flower.side]) {
      flower.bloomedAt = now;
      ready[flower.side] = false;
      score++;
    }
  }
}

function handIsRaised(side) {
  let points = poses[0]?.keypoints;
  if (!points || millis() - lastPoseTime > 1500) return null;

  // MoveNet puts left/right shoulders at 5/6 and left/right wrists at 9/10.
  let offset = side === "left" ? 0 : 1;
  let shoulder = points[5 + offset];
  let wrist = points[9 + offset];
  if ((shoulder?.confidence ?? shoulder?.score ?? 0) < 0.2 ||
      (wrist?.confidence ?? wrist?.score ?? 0) < 0.2) return null;

  return wrist.y < shoulder.y;
}

function gotResults(results) {
  poses = results;
  lastPoseTime = millis();
  let message = poses.length
    ? "Raise your left hand, right hand, or both."
    : "Step back so your shoulders and hands are in view.";
  if (statusMessage.textContent !== message) statusMessage.textContent = message;
}
