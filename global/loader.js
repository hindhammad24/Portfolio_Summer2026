/*
Controls the loading introduction sequence.
This script manages when the signature animation appears,
when the homepage becomes visible, and prevents the animation
from replaying every time the user navigates back.
The goal was to create a memorable first interaction without
making repeated visits slower.
*/

const navbar = document.querySelector(".navbar");
const loader = document.getElementById("loader");
const loaderVideo = document.getElementById("loader-video");
const homepage = document.getElementById("homepage");

/*
Stores whether the introduction has already been shown during
the current browsing session.
Originally the animation played every time the page loaded,
but this became repetitive and increased waiting time.
*/
const introPlayed = sessionStorage.getItem("introPlayed");

/*
Checks the user's accessibility preference.
If reduced motion is enabled, the animation is skipped to provide
a faster and more accessible experience.
*/
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/*
Reveals the main portfolio content after the introduction.
This function keeps the transition logic in one place instead
of repeating the same actions in multiple events.
*/
function showHomepage() {
    // Starts the loader fade-out animation
    loader.classList.add("hide");
    homepage.classList.add("show");

    if (navbar) {
        navbar.classList.add("show");
    }

    document.body.style.overflow = "auto";
}

/*
Waits for the signature video to finish before revealing the
homepage.
Using the video's ended event ensures users see the complete
intro animation instead of relying on a fixed timer.
*/
function playLoader() {
    /*
    I used the video completion event instead of a set duration timer
    because the animation length could change in the future. 
    ( i already changed it like 3 times so i did this to save time)
    This keeps the transition connected to the actual asset timing.*/
    loaderVideo.addEventListener("ended", () => {
        sessionStorage.setItem(
            "introPlayed",
            "true"
        );
        setTimeout(showHomepage, 450);
    });
}

/*
Starts the loading logic after page resources are available.
Returning users skip the introduction, while first time visitors
experience the full animation.
*/
window.addEventListener("load", () => {
    if (introPlayed || prefersReducedMotion) {

        setTimeout(showHomepage, 150);

    } else {

        playLoader();
    }
});