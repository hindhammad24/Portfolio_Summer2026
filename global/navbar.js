/*
Controls the interactive behaviour of the paint palette navigation.
This script handles opening and closing the menu, updating
accessibility states, and closing the menu through different
user interactions.
*/

/* ...Paint Palette Navigation.... */

/* Logic explained:
I created the paint swatch interactions using two image states 
layered on top of each other. CSS controls the opacity transition 
between the neutral and colored versions on hover, creating the effect 
of the paint changing color. JavaScript was only used for controlling
the navigation opening and closing behavior, not the hover color transition itself */

const paintNav = document.querySelector(".paint-nav");
const paletteButton = document.getElementById("paintPaletteButton");
const paintSwatches = document.querySelectorAll(".paint-swatch");

if (paintNav && paletteButton) {


  /*
  Opens the navigation menu by adding the active state.
  The CSS handles the animation, while JavaScript only controls
  the interaction state.
  */
  function openPaintMenu() {
    paintNav.classList.add("is-open");

    paletteButton.setAttribute("aria-expanded", "true");
    paletteButton.setAttribute("aria-label", "Close navigation menu");
  }

  /*
  Centralizes the closing behaviour so every interaction method
  (mouse click, outside click, keyboard input) uses the same logic.
  */
  function closePaintMenu() {
    paintNav.classList.remove("is-open");

    paletteButton.setAttribute("aria-expanded", "false");
    paletteButton.setAttribute("aria-label", "Open navigation menu");
  }

  /*
  Checks the current menu state and switches between open and
  closed states when the palette button is pressed.
  */
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

  /* ..... CLOSE AFTER NAVIGATION ..... */
  /*
  The menu closes after selecting a page because keeping the
  expanded palette open after navigation creates unnecessary
  visual clutter.
  */
  paintSwatches.forEach((swatch) => {
    swatch.addEventListener("click", () => {
      closePaintMenu();
    });
  });

/*
Allows users to dismiss the menu naturally by clicking anywhere
outside the palette.
This makes the interaction behave like familiar modern menus while
keeping the custom visual design.
*/
  document.addEventListener("pointerdown", (event) => {
    const clickedInsideMenu = paintNav.contains(event.target);

    if (!clickedInsideMenu) {
      closePaintMenu();
    }
  });

  /*
  Adds keyboard accessibility by allowing users to close the menu
  without using a mouse.
  */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePaintMenu();
      paletteButton.focus();
    }
  });
}