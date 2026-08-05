/*
This file controls the interactive behaviour of the hero section.
The main interaction is a scroll-based painting sequence where
users reveal my artwork through scrolling.
I separated this logic from the CSS because the animation depends
on user movement, frame calculation, and dynamic changes during
the browsing experience.
*/

/*.....HOMEPAGE SEQUENCE.....*/
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

/* ..... PRELOADING PAINTING FRAMES ..... */
/*
Originally I tested lazy loading for the sequence images to improve
performance.
However, because the animation depends on immediate frame changes,
lazy loading caused missing frames during scrolling.
I changed this approach to preload the sequence frames so the
interaction remains smooth while keeping the visual experience intact.
*/
const loadedFrames = [];
function preloadSequenceFrames() {
  for (let frame = 0; frame <= sequenceFrames; frame++) {
    const image = new Image();
    image.src =
      `${sequenceFolder}${frame}.${sequenceExtension}`;

    loadedFrames[frame] = image;
  }
}

/* ..... SCROLL PROGRESS CALCULATION ..... */
/*
This function converts the user's scroll position into a percentage
that controls which painting frame should appear.
I used scroll progress instead of a timed animation because I wanted
the user to control the pace of the experience.
*/
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

/* ..... FRAME-BY-FRAME PAINTING UPDATE ..... */
/*
This function controls which image appears during scrolling.
I separated the frame update from the scroll event because it makes
the animation easier to control and prevents unnecessary image changes.
*/
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

/* ..... TRANSITION BETWEEN HERO STATES ..... */
/*
The hero changes depending on the user's progress.
At the beginning, the focus is my identity and introduction.
As users scroll, the artwork becomes the focus.
Near the end, the plaque appears to provide additional information.
This creates a guided storytelling sequence instead of showing all
information at once.
*/
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

/* Update homepage */
function updateHomepage() {
  const progress = getSequenceProgress();

  updateSequenceFrame(progress);
  updateHeroVisibility(progress);

  scrollTicking = false;
}

/*
I used requestAnimationFrame because scroll events can fire many
times per second.
This limits updates to the browser's animation cycle, making the
interaction smoother and reducing unnecessary calculations.
*/
function requestHomepageUpdate() {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;

  window.requestAnimationFrame(updateHomepage);
}

/* ..... CONTROLLED HERO NAVIGATION ..... */
/*
I added this function so users who do not immediately understand
the scroll interaction still have a clear way to continue.
The button scrolls to the end of the sequence instead of jumping,
so the user still experiences the animation.
*/
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

/* Event Listeners  */
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

/* ..... INITIALIZE HERO EXPERIENCE ..... */
/*
The sequence is prepared when the page loads by preloading frames
and displaying the first correct state.
Keeping initialization at the bottom makes the flow of the script
easier to understand and maintain.
*/
preloadSequenceFrames();
updateHomepage();