/*
  PAINT PALETTE NAVIGATION

  Opens and closes the palette menu.
  CSS controls the horizontal desktop layout
  and vertical mobile layout.
*/

(() => {
  function initialisePaintNavigation() {
    const navigationMenus = document.querySelectorAll(".paint-nav");

    navigationMenus.forEach((paintNav) => {
      const paletteButton = paintNav.querySelector(".paint-palette-button");

      const paintSwatches = paintNav.querySelectorAll(".paint-swatch");

      if (!paletteButton) return;

      // Avoid duplicate listeners if loaded more than once.
      if (paintNav.dataset.navigationReady === "true") return;
      paintNav.dataset.navigationReady = "true";

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
        if (paintNav.classList.contains("is-open")) {
          closePaintMenu();
        } else {
          openPaintMenu();
        }
      }

      // Toggle when the palette is clicked.
      paletteButton.addEventListener("click", togglePaintMenu);

      // Close after selecting a link.
      paintSwatches.forEach((swatch) => {
        swatch.addEventListener("click", closePaintMenu);
      });

      // Close when clicking outside the navigation.
      document.addEventListener("pointerdown", (event) => {
        if (!paintNav.contains(event.target)) {
          closePaintMenu();
        }
      });

      // Escape closes the menu and returns focus.
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && paintNav.classList.contains("is-open")) {
          closePaintMenu();
          paletteButton.focus();
        }
      });

      // Close when keyboard focus leaves the menu.
      paintNav.addEventListener("focusout", (event) => {
        if (!paintNav.contains(event.relatedTarget)) {
          closePaintMenu();
        }
      });

      // Begin with the menu closed.
      closePaintMenu();
    });
  }

  // Works whether the script loads before or after the HTML.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialisePaintNavigation, {
      once: true,
    });
  } else {
    initialisePaintNavigation();
  }
})();
