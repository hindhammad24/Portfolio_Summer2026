/* Projects Gallery ----------------------------------------- */
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


/* Set active project --------------------------------------- */
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

/* Find project closest to centre --------------------------- */

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


/* Scroll directly to project ------------------------------- */

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


/* Create paint swatch navigation --------------------------- */

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


/* Update active paint swatch ------------------------------- */

function updateProjectSwatches() {
  const projectSteps = document.querySelectorAll(".project-step");

  projectSteps.forEach((step, index) => {
    const isActive = index === activeProjectIndex;

    step.classList.toggle("active", isActive);
    step.setAttribute("aria-current", isActive ? "true" : "false");
  });
}


/* Gallery scroll listener ---------------------------------- */

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


/* Keyboard navigation -------------------------------------- */

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


/* Vertical gallery scrolling ------------------------------- */

let isUpdatingFromPageScroll = false;
let isDirectlyInteracting = false;
let interactionEndTimer = null;


/* Calculate gallery section height ------------------------- */

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


/* Convert vertical page position to horizontal movement ---- */

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


/* Match page position after direct horizontal movement ------ */

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


/* Direct interaction state --------------------------------- */

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


/* Mouse and touch interaction ------------------------------ */

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


/* Initial gallery setup ------------------------------------ */

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


/* Page listeners ------------------------------------------- */

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