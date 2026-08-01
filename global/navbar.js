/* Paint Palette Navigation -------------------------------- */

const paintNav = document.querySelector(".paint-nav");
const paletteButton = document.getElementById("paintPaletteButton");
const paintSwatches = document.querySelectorAll(".paint-swatch");

if (paintNav && paletteButton) {
  function openPaintMenu() {
    paintNav.classList.add("is-open");

    paletteButton.setAttribute("aria-expanded", "true");
    paletteButton.setAttribute("aria-label", "Close navigation menu");
  }

  function closePaintMenu() {
    paintNav.classList.remove("is-open");

    paletteButton.setAttribute("aria-expanded", "false");
    paletteButton.setAttribute("aria-label", "Open navigation menu");
  }

  function togglePaintMenu() {
    const menuIsOpen = paintNav.classList.contains("is-open");

    if (menuIsOpen) {
      closePaintMenu();
    } else {
      openPaintMenu();
    }
  }

  /* Open and close when the palette is clicked */
  paletteButton.addEventListener("click", togglePaintMenu);

  /* Close after selecting a swatch */
  paintSwatches.forEach((swatch) => {
    swatch.addEventListener("click", () => {
      closePaintMenu();
    });
  });

  /* Close when clicking outside the navigation */
  document.addEventListener("pointerdown", (event) => {
    const clickedInsideMenu = paintNav.contains(event.target);

    if (!clickedInsideMenu) {
      closePaintMenu();
    }
  });

  /* Close with the Escape key */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePaintMenu();
      paletteButton.focus();
    }
  });
}