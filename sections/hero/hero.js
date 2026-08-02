/* Homepage Sequence ---------------------------------------- */

const sequenceImage = document.getElementById("sequenceImage");
const sequenceSection = document.querySelector(".sequence-section");

const heroText = document.querySelector(".hero-text");
const heroPlaque = document.querySelector(".hero-plaque");
const heroScrollActions =
  document.querySelector(".hero-scroll-actions");

const scrollButton = document.querySelector(".scroll-button");
const bioScrollButton =
  document.querySelector(".bio-swatch-btn");

const heroCorners = document.querySelectorAll(".hero-corner");

const sequenceFolder = "assets/sequence/";
const sequenceExtension = "webp";
const sequenceFrames = 22;

let currentSequenceFrame = -1;
let scrollTicking = false;

/* Lazy load sequence frames -------------------------------- */
const loadedFrames = [];

function preloadSequenceFrames() {
    for (let frame = 0; frame <= sequenceFrames; frame++) {

        const image = new Image();

        image.src =
          `${sequenceFolder}${frame}.${sequenceExtension}`;

        loadedFrames[frame] = image;
    }
}

/* Calculate sequence progress ------------------------------ */

function getSequenceProgress() {
  if (!sequenceSection) {
    return 0;
  }

  const rect = sequenceSection.getBoundingClientRect();

  const scrollable =
    sequenceSection.offsetHeight - window.innerHeight;

  if (scrollable <= 0) {
    return 0;
  }

  const scrolled = Math.min(
    Math.max(-rect.top, 0),
    scrollable
  );

  return scrolled / scrollable;
}

/* Update sequence image ------------------------------------ */

function updateSequenceFrame(progress) {
  if (!sequenceImage) {
    return;
  }

  const frame = Math.min(
    sequenceFrames,
    Math.floor(progress * sequenceFrames)
  );

  /*
    Only update the image source when the frame actually changes.
    This avoids unnecessary image reload assignments while scrolling.
  */
  if (frame === currentSequenceFrame) {
    return;
  }

  currentSequenceFrame = frame;

sequenceImage.src = loadedFrames[frame].src;

}

/* Update hero visibility ----------------------------------- */

function updateHeroVisibility(progress) {
  const hideIntro = progress > 0.18;
  const showPlaque = progress > 0.9;

  heroText?.classList.toggle("hide", hideIntro);

  heroScrollActions?.classList.toggle(
    "hide",
    hideIntro
  );

  /*
    The corner illustrations disappear with the main identity,
    keeping the sequence clean once scrolling begins.
  */
  heroCorners.forEach((corner) => {
    corner.classList.toggle("hide", hideIntro);
  });

  heroPlaque?.classList.toggle("show", showPlaque);
}

/* Update homepage ------------------------------------------ */

function updateHomepage() {
  const progress = getSequenceProgress();

  updateSequenceFrame(progress);
  updateHeroVisibility(progress);

  scrollTicking = false;
}

/* Request one animation-frame update ----------------------- */

function requestHomepageUpdate() {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;

  window.requestAnimationFrame(updateHomepage);
}

/* Smoothly scroll through painting sequence ---------------- */

function scrollThroughSequence() {
  if (!sequenceSection) {
    return;
  }

  const sequenceEnd =
    sequenceSection.offsetTop +
    sequenceSection.offsetHeight -
    window.innerHeight;

  window.scrollTo({
    top: sequenceEnd,
    behavior: "smooth"
  });
}

/* Event Listeners ------------------------------------------ */

window.addEventListener(
  "scroll",
  requestHomepageUpdate,
  { passive: true }
);

window.addEventListener(
  "resize",
  requestHomepageUpdate
);

scrollButton?.addEventListener(
  "click",
  scrollThroughSequence
);

bioScrollButton?.addEventListener(
  "click",
  scrollThroughSequence
);

/* Start ---------------------------------------------------- */
preloadSequenceFrames();
updateHomepage();