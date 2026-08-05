/*
Controls the custom paint cursor interaction.
The cursor uses a canvas-based drawing system to create a smooth
paint trail following the user's movement.
The effect was implemented with JavaScript instead of CSS because
CSS transitions cannot create the dynamic trailing movement needed
for this interaction.

again this was adopted from 
I adopted this from https://github.com/DigitalCodeHub/satisfying-curvy-cursor/tree/main by DigitalCodeHub
*/

/*
The cursor effect is removed on mobile devices because touch
screens do not use a mouse pointer.

Removing the elements completely avoids running unnecessary
animation calculations that slow it down.
*/
if (window.innerWidth <= 48 * 16) {
  document.getElementById("paint-canvas")?.remove();
  document.querySelector(".paint-cursor")?.remove();
} else {

  const paintCanvas = document.getElementById("paint-canvas");
  const paintCtx = paintCanvas.getContext("2d");
  const paintCursor = document.querySelector(".paint-cursor");

  let paintMouseMoved = false;

  const paintPointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  /*
  These values control the physics of the paint trail.
  I used multiple points with spring and friction values to create
  a smoother natural brush movement instead of directly following
  the cursor position.
  */
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

  /*
  Keeps the canvas size synchronized with the browser window.
  Without resizing the canvas, the drawing area would not match
  the screen after changing window size.
  */
  function resizePaintCanvas() {
    paintCanvas.width = window.innerWidth;
    paintCanvas.height = window.innerHeight;
  }

  /*
  Updates the target position that the brush animation follows.
  Separating the position update from the animation loop keeps the
  movement logic easier to control.
  */
  function updatePaintPosition(x, y) {
    paintPointer.x = x;
    paintPointer.y = y;
  }

  /*
  Tracks mouse movement and updates the brush location.
  The same logic is also applied to touch movement to support
  different input devices.
  */
  window.addEventListener("mousemove", (e) => {
    paintMouseMoved = true;
    updatePaintPosition(e.clientX, e.clientY);
  });

  window.addEventListener("touchmove", (e) => {
    paintMouseMoved = true;
    updatePaintPosition(e.touches[0].clientX, e.touches[0].clientY);
  });


  /*
  Main animation loop for the paint cursor.
  Each frame updates the brush position, calculates the trailing
  movement, redraws the canvas, and creates the continuous paint
  stroke effect.
  
  at the beginign i tried making it with circles it
  looked like poka dots then i tried with a bruch techture rectangle also didnt work.
  */
  function animatePaintCursor(time) {
    paintCursor.style.left = paintPointer.x + "px";
    paintCursor.style.top = paintPointer.y + "px";

    /*
    When the user has not interacted yet the brush moves slowly by itself.
    I added this because a completely static cursor before interaction
    felt empty when entering the website. The subtle movement introduces
    the interactive nature of the portfolio immediately.
    */
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

      /*
      The trail uses a spring based movement system where each point follows the previous point.
      This creates a natural brush stroke effect instead of a rigid line
      that immediately follows the cursor.
      */
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