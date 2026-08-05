/* Projects Gallery*/
/*
This file controls the interactive behaviour of the project
exhibition.
It manages project selection, horizontal gallery movement,
paint swatch navigation, and the connection between vertical
page scrolling and horizontal project exploration.
The goal was to create a portfolio experience where users
discover projects through interaction rather than simply
opening separate project pages.
*/

/*Logic explained:
I designed the project section as an interactive exhibition rather than a traditional
portfolio grid. The gallery uses a horizontal track inside a sticky viewport,
while JavaScript converts vertical scrolling into horizontal project movement.
Projects become active based on their position in the gallery, 
which controls scaling, opacity, and artwork transitions. I created reusable 
systems for project navigation, paint swatches, and design boards so adding future 
projects requires less duplicated code. The design board opens as an overlay 
and reuses existing project visuals, allowing users to explore my process 
without leaving the exhibition experience */
const projectRoom = document.querySelector(".project-room");
const galleryWindow = document.querySelector(".gallery-window");
const galleryTrack = document.querySelector("#galleryTrack");
const galleryExhibits = [...document.querySelectorAll(".gallery-exhibit")];
const projectStepNavigation = document.querySelector(
  "#projectStepNavigation"
);

let activeProjectIndex = 0;
let scrollUpdateFrame = null;
let mediaActivationTimer = null;

/*
This function controls which project is currently highlighted.
I separated this logic into its own function because multiple
interactions can change the active project, including scrolling,
keyboard controls, and swatch navigation.
Keeping one function responsible for the active state prevents
different interactions from creating conflicting behaviours.
*/
function setActiveProject(index) {
  if (index < 0 || index >= galleryExhibits.length) return;

  const projectChanged = index !== activeProjectIndex;

  activeProjectIndex = index;

  if (mediaActivationTimer) {
    clearTimeout(mediaActivationTimer);
  }

  galleryExhibits.forEach((exhibit, exhibitIndex) => {
    const isActive = exhibitIndex === activeProjectIndex;

    exhibit.classList.toggle("active", isActive);
    exhibit.classList.remove("media-active");

    exhibit.setAttribute(
      "aria-current",
      isActive ? "true" : "false"
    );
  });

  const activeExhibit = galleryExhibits[activeProjectIndex];

  mediaActivationTimer = setTimeout(() => {
    activeExhibit?.classList.add("media-active");
  }, projectChanged ? 260 : 120);

  updateProjectSwatches();
}

/* Find project closest to centre   */
/*
This function detects which project is closest to the centre
of the gallery.
I used the centre position instead of only tracking scroll
distance because the gallery behaves like an exhibition where
the currently viewed artwork should become the focus.
*/
function updateActiveProjectFromScroll() {
  if (!galleryWindow) return;

  const galleryBounds = galleryWindow.getBoundingClientRect();
  const galleryCentre = galleryBounds.left + galleryBounds.width / 2;

  let closestIndex = 0;
  let closestDistance = Infinity;

  galleryExhibits.forEach((exhibit, index) => {
    const exhibitBounds = exhibit.getBoundingClientRect();
    const exhibitCentre = exhibitBounds.left + exhibitBounds.width / 2;
    const distanceFromCentre = Math.abs(exhibitCentre - galleryCentre);

    if (distanceFromCentre < closestDistance) {
      closestDistance = distanceFromCentre;
      closestIndex = index;
    }
  });

  setActiveProject(closestIndex);
}


/* Scroll directly to project */
/*
This function moves the gallery directly to a selected project.

It allows different navigation methods, such as paint swatches
and URL links, to reuse the same movement behaviour instead of
creating separate scrolling logic.
*/
function scrollToProject(index) {
  const selectedExhibit = galleryExhibits[index];

  if (!selectedExhibit || !galleryWindow) return;

  const targetPosition =
    selectedExhibit.offsetLeft -
    galleryWindow.clientWidth / 2 +
    selectedExhibit.clientWidth / 2;

  galleryWindow.scrollTo({
    left: targetPosition,
    behavior: "smooth"
  });
}


/* Create paint swatch navigation   */
/*
This function creates the paint swatch navigation dynamically.
Instead of manually creating a button for every project, the
navigation is generated from the existing project data.
This makes adding future projects easier because the navigation
updates automatically.
*/
function createProjectSwatches() {
  if (!projectStepNavigation) return;

  projectStepNavigation.innerHTML = "";

  galleryExhibits.forEach((exhibit, index) => {
    const swatchColour = exhibit.dataset.swatch || "blue";

    const swatchButton = document.createElement("button");

    swatchButton.className = "project-step";
    swatchButton.type = "button";
    swatchButton.dataset.projectIndex = index;

    swatchButton.setAttribute(
      "aria-label",
      `Go to project ${index + 1}`
    );

    swatchButton.innerHTML = `
      <img
        class="project-step-image project-step-basic"
        src="assets/projects/steps/basic.webp"
        alt=""
        aria-hidden="true"
      >

      <img
        class="project-step-image project-step-colour"
        src="assets/projects/steps/${swatchColour}.webp"
        alt=""
        aria-hidden="true"
      >
    `;

    swatchButton.addEventListener("click", () => {
      scrollToProject(index);
    });

    projectStepNavigation.appendChild(swatchButton);
  });

  const galleryDirection = document.querySelector(
    ".gallery-direction"
  );

  if (galleryDirection) {
    const isLastProject =
      activeProjectIndex === galleryExhibits.length - 1;

    galleryDirection.style.opacity = isLastProject ? "0" : ".55";
    galleryDirection.style.transform =
      isLastProject
        ? "translateX(1rem)"
        : "translateX(0)";
  }

  updateProjectSwatches();
}


/* Update active paint swatch   */
function updateProjectSwatches() {
  const projectSteps = document.querySelectorAll(".project-step");

  projectSteps.forEach((step, index) => {
    const isActive = index === activeProjectIndex;

    step.classList.toggle("active", isActive);
    step.setAttribute("aria-current", isActive ? "true" : "false");
  });
}


/* Gallery scroll listener   */
galleryWindow?.addEventListener(
  "scroll",
  () => {
    if (scrollUpdateFrame) {
      cancelAnimationFrame(scrollUpdateFrame);
    }

    scrollUpdateFrame = requestAnimationFrame(
      updateActiveProjectFromScroll
    );
  },
  { passive: true }
);


/* Keyboard navigation   */
galleryWindow?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();

    scrollToProject(
      Math.min(activeProjectIndex + 1, galleryExhibits.length - 1)
    );
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();

    scrollToProject(
      Math.max(activeProjectIndex - 1, 0)
    );
  }
});


/* Vertical gallery scrolling   */
let isUpdatingFromPageScroll = false;
let isDirectlyInteracting = false;
let interactionEndTimer = null;


/* Calculate gallery section height  */
/*
This function calculates the height needed for the horizontal
gallery movement.
Because the user scrolls vertically but the projects move
horizontally, I needed to convert vertical scrolling distance
into horizontal gallery progress.
*/
function updateProjectRoomHeight() {
  if (!projectRoom || !galleryWindow || !galleryTrack) return;

  const horizontalDistance =
    galleryTrack.scrollWidth - galleryWindow.clientWidth;

  const scrollSpeed = 0.9;

  const galleryHeight =
    window.innerHeight +
    Math.max(horizontalDistance * scrollSpeed, 0);

  projectRoom.style.setProperty(
    "--project-room-height",
    `${galleryHeight}px`
  );
}

/* Convert vertical page position to horizontal movement  */
/*
This function connects normal page scrolling with horizontal
gallery movement.

I created this interaction so users can experience the project
gallery naturally through scrolling instead of needing a special
horizontal scroll action.
*/
function updateGalleryFromPageScroll() {
  if (
    !projectRoom ||
    !galleryWindow ||
    isDirectlyInteracting
  ) {
    return;
  }

  const roomTop =
    window.scrollY + projectRoom.getBoundingClientRect().top;

  const verticalDistance =
    projectRoom.offsetHeight - window.innerHeight;

  if (verticalDistance <= 0) return;

  const travelledDistance = window.scrollY - roomTop;

  const progress = Math.max(
    0,
    Math.min(1, travelledDistance / verticalDistance)
  );

  const maximumHorizontalScroll =
    galleryWindow.scrollWidth - galleryWindow.clientWidth;

  isUpdatingFromPageScroll = true;

  galleryWindow.scrollLeft =
    progress * maximumHorizontalScroll;

  requestAnimationFrame(() => {
    isUpdatingFromPageScroll = false;
  });
}

/* Match page position after direct horizontal movement */
/*
This function keeps the page position synchronized after direct
horizontal interaction.
Without this, dragging the gallery could create a mismatch
between the visible project position and the actual page scroll.
*/
function syncPageToGalleryPosition() {
  if (
    !projectRoom ||
    !galleryWindow ||
    isUpdatingFromPageScroll
  ) {
    return;
  }

  const maximumHorizontalScroll =
    galleryWindow.scrollWidth - galleryWindow.clientWidth;

  if (maximumHorizontalScroll <= 0) return;

  const progress =
    galleryWindow.scrollLeft / maximumHorizontalScroll;

  const roomTop =
    window.scrollY + projectRoom.getBoundingClientRect().top;

  const verticalDistance =
    projectRoom.offsetHeight - window.innerHeight;

  const targetPagePosition =
    roomTop + progress * verticalDistance;

  window.scrollTo({
    top: targetPagePosition,
    behavior: "auto"
  });
}


/* Direct interaction state   */
function beginDirectInteraction() {
  isDirectlyInteracting = true;

  galleryWindow?.classList.add("is-dragging");

  if (interactionEndTimer) {
    clearTimeout(interactionEndTimer);
  }
}


function finishDirectInteraction() {
  galleryWindow?.classList.remove("is-dragging");

  if (interactionEndTimer) {
    clearTimeout(interactionEndTimer);
  }

  interactionEndTimer = setTimeout(() => {
    syncPageToGalleryPosition();
    isDirectlyInteracting = false;
  }, 120);
}


/* Mouse and touch interaction  */
galleryWindow?.addEventListener(
  "pointerdown",
  beginDirectInteraction
);

galleryWindow?.addEventListener(
  "pointerup",
  finishDirectInteraction
);

galleryWindow?.addEventListener(
  "pointercancel",
  finishDirectInteraction
);

galleryWindow?.addEventListener(
  "touchstart",
  beginDirectInteraction,
  { passive: true }
);

galleryWindow?.addEventListener(
  "touchend",
  finishDirectInteraction,
  { passive: true }
);


/* Initial gallery setup  */
/*
This function prepares the gallery when the page loads.
It sets up navigation, calculates dimensions, and establishes
the initial project state before user interaction begins.
*/
function initialiseProjectGallery() {
  if (
    !projectRoom ||
    !galleryWindow ||
    !galleryTrack ||
    !galleryExhibits.length
  ) {
    return;
  }

  galleryWindow.setAttribute("tabindex", "0");

  createProjectSwatches();
  updateProjectRoomHeight();

  galleryWindow.scrollLeft = 0;
  setActiveProject(0);

  requestAnimationFrame(() => {
    updateProjectRoomHeight();
    updateGalleryFromPageScroll();
    updateActiveProjectFromScroll();
  });
}


/* Page listeners  ---------------- */

window.addEventListener(
  "scroll",
  updateGalleryFromPageScroll,
  { passive: true }
);

window.addEventListener("resize", () => {
  updateProjectRoomHeight();
  updateGalleryFromPageScroll();
  updateActiveProjectFromScroll();
});

window.addEventListener(
  "load",
  initialiseProjectGallery
);

const urlParams = new URLSearchParams(window.location.search);
const selectedBoard = urlParams.get("board");

if (selectedBoard) {

  setTimeout(() => {

    const project = document.querySelector(
      `[data-board="${selectedBoard}"]`
    );

    if (project) {

      const index = galleryExhibits.indexOf(project);

      // first move gallery to correct card
      scrollToProject(index);

      // wait for movement, then open board
      setTimeout(() => {

        project.querySelector(".view-project-btn")?.click();

      }, 700);
    }

  }, 500);

}