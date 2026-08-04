if (window.innerWidth <= 48 * 16) {
    document.getElementById("paint-canvas")?.remove();
    document.querySelector(".paint-cursor")?.remove();
} else {
  
  /* Paint Brush Cursor -------------------------------------- */
const paintCanvas = document.getElementById("paint-canvas");
const paintCtx = paintCanvas.getContext("2d");
const paintCursor = document.querySelector(".paint-cursor");

let paintMouseMoved = false;

const paintPointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

const paintParams = {
  pointsNumber: 40,
  widthFactor: 0.3,
  spring: 0.4,
  friction: 0.5
};

const paintTrail = [];

for (let i = 0; i < paintParams.pointsNumber; i++) {
  paintTrail.push({
    x: paintPointer.x,
    y: paintPointer.y,
    dx: 0,
    dy: 0
  });
}

function resizePaintCanvas() {
  paintCanvas.width = window.innerWidth;
  paintCanvas.height = window.innerHeight;
}

function updatePaintPosition(x, y) {
  paintPointer.x = x;
  paintPointer.y = y;
}

window.addEventListener("mousemove", (e) => {
  paintMouseMoved = true;
  updatePaintPosition(e.clientX, e.clientY);
});

window.addEventListener("touchmove", (e) => {
  paintMouseMoved = true;
  updatePaintPosition(e.touches[0].clientX, e.touches[0].clientY);
});

function animatePaintCursor(time) {
  paintCursor.style.left = paintPointer.x + "px";
  paintCursor.style.top = paintPointer.y + "px";

  if (!paintMouseMoved) {
    paintPointer.x =
      (0.5 + 0.3 * Math.cos(0.002 * time) * Math.sin(0.005 * time)) *
      window.innerWidth;

    paintPointer.y =
      (0.5 + 0.2 * Math.cos(0.005 * time)) *
      window.innerHeight;
  }

  paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);

  paintTrail.forEach((point, index) => {
    const previous = index === 0 ? paintPointer : paintTrail[index - 1];
    const spring = index === 0 ? 0.4 * paintParams.spring : paintParams.spring;

    point.dx += (previous.x - point.x) * spring;
    point.dy += (previous.y - point.y) * spring;
    point.dx *= paintParams.friction;
    point.dy *= paintParams.friction;
    point.x += point.dx;
    point.y += point.dy;
  });

  paintCtx.beginPath();
  paintCtx.strokeStyle = "#242424";
  paintCtx.lineCap = "round";
  paintCtx.lineJoin = "round";
  paintCtx.moveTo(paintTrail[0].x, paintTrail[0].y);

  for (let i = 1; i < paintTrail.length - 1; i++) {
    const xc = (paintTrail[i].x + paintTrail[i + 1].x) / 2;
    const yc = (paintTrail[i].y + paintTrail[i + 1].y) / 2;

    paintCtx.quadraticCurveTo(paintTrail[i].x, paintTrail[i].y, xc, yc);
    paintCtx.lineWidth = paintParams.widthFactor * (paintParams.pointsNumber - i);
    paintCtx.stroke();
  }

  requestAnimationFrame(animatePaintCursor);
}

resizePaintCanvas();
window.addEventListener("resize", resizePaintCanvas);
requestAnimationFrame(animatePaintCursor);
}