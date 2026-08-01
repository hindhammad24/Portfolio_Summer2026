const navbar = document.querySelector(".navbar");
const loader = document.getElementById("loader");
const loaderVideo = document.getElementById("loader-video");
const homepage = document.getElementById("homepage");

const introPlayed = sessionStorage.getItem("introPlayed");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


function showHomepage() {
    loader.classList.add("hide");
    homepage.classList.add("show");

    if (navbar) {
        navbar.classList.add("show");
    }

    document.body.style.overflow = "auto";
}


function playLoader() {

    loaderVideo.addEventListener("ended", () => {

        sessionStorage.setItem(
            "introPlayed",
            "true"
        );

        setTimeout(showHomepage, 450);

    });

}


window.addEventListener("load", () => {

    if (introPlayed || prefersReducedMotion) {

        setTimeout(showHomepage, 150);

    } else {

        playLoader();

    }

});