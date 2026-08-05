/* Designer Board Elements */
/*
This file controls the interactive behaviour of the project
design boards.
It manages opening and closing project case studies, switching
between different project boards, and dynamically updating the
preview panel.
The goal was to create a reusable system where every project can
share the same interaction pattern while keeping its own content.
*/
const designBoard =
  document.querySelector("#designBoard");

const closeDesignBoard =
  document.querySelector("#closeDesignBoard");

const designBoardPreviewArt =
  document.querySelector("#designBoardPreviewArt");

const designBoardPreviewPlaque =
  document.querySelector("#designBoardPreviewPlaque");

const designBoardContent =
  document.querySelector(".design-board-content");

const projectButtons =
  document.querySelectorAll(".view-project-btn");

const projectBoards =
  document.querySelectorAll("[data-project-board]");

/*
This function controls which project board is visible.
Instead of creating separate pages for every project, I created
one reusable overlay system where JavaScript displays the selected
case study.
This keeps the experience consistent and makes adding future
projects easier.
*/
function showSelectedProjectBoard(boardName) {
  projectBoards.forEach((board) => {
    const isSelected =
      board.dataset.projectBoard === boardName;

    board.hidden = !isSelected;
  });

  if (designBoardContent) {
    designBoardContent.scrollTop = 0;
  }
}

/*
This function opens the detailed project experience.
It collects the selected project information, updates the preview,
loads the correct board, and changes the page state.
Separating this process into one function keeps every project
interaction consistent.
*/
function openDesignBoard(exhibit) {
  if (!designBoard || !exhibit) return;

  const boardName = exhibit.dataset.board;

  if (!boardName) return;

  updateDesignBoardPreview(exhibit);
  showSelectedProjectBoard(boardName);

  designBoard.classList.add("open");
  designBoard.setAttribute("aria-hidden", "false");

  document.body.classList.add("board-open");


  requestAnimationFrame(() => {

    if (designBoardContent) {
      designBoardContent.scrollTop = 0;
    }

  });
}

/*
This function returns the user from the case study back to the
gallery.
Keeping closing behaviour separate makes it easier to trigger
from different interactions such as the close button, backdrop,
or Escape key.
*/
function closeBoard() {
  if (!designBoard) return;

  designBoard.classList.remove("open");
  designBoard.setAttribute("aria-hidden", "true");

  document.body.classList.remove("board-open");
}


/* View More Buttons */

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const exhibit =
      button.closest(".gallery-exhibit");

    openDesignBoard(exhibit);
  });
});

/*
Projects can be opened through both the button and the artwork
itself.
Adding keyboard support ensures the interaction remains accessible
while keeping the gallery experience natural.
*/
document.querySelectorAll(
  ".gallery-exhibit[data-board] .exhibit-visual"
).forEach((visual) => {
  visual.setAttribute("role", "button");
  visual.setAttribute("tabindex", "0");

  visual.addEventListener("click", () => {
    const exhibit =
      visual.closest(".gallery-exhibit");

    openDesignBoard(exhibit);
  });

  visual.addEventListener("keydown", (event) => {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();

    const exhibit =
      visual.closest(".gallery-exhibit");

    openDesignBoard(exhibit);
  });
});


/* Close Button */
closeDesignBoard?.addEventListener(
  "click",
  closeBoard
);


/* Close When Clicking Backdrop  */
designBoard?.addEventListener("click", (event) => {
  if (
    event.target.classList.contains(
      "design-board-backdrop"
    )
  ) {
    closeBoard();
  }
});


/* Close With Escape Key  */
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    designBoard?.classList.contains("open")
  ) {
    closeBoard();
  }
});

/*
This function duplicates the selected project's visual preview and
information into the design board sidebar.
I used cloning instead of rebuilding the artwork because the same
gallery elements can be reused in the expanded case-study view.
*/
function updateDesignBoardPreview(exhibit) {
  if (
    !exhibit ||
    !designBoardPreviewArt ||
    !designBoardPreviewPlaque
  ) {
    return;
  }

  const visual =
    exhibit.querySelector(".exhibit-visual");

  const plaque =
    exhibit.querySelector(".plaque");

  designBoardPreviewArt.innerHTML = "";
  designBoardPreviewPlaque.innerHTML = "";

  if (visual) {
    /*
    The artwork is cloned from the existing gallery element so the
    design board and gallery maintain the same visual language.
    This avoids creating duplicate HTML structures for every preview.
    */
    const visualClone =
      visual.cloneNode(true);

    visualClone.classList.add(
      "design-board-artwork"
    );

    const previewWrapper =
      document.createElement("article");

    previewWrapper.className =
      "gallery-exhibit active media-active";

    previewWrapper.dataset.focusType =
      exhibit.dataset.focusType || "colour";

    previewWrapper.appendChild(
      visualClone
    );

    designBoardPreviewArt.appendChild(
      previewWrapper
    );
  }

  if (plaque) {
    const plaqueClone =
      plaque.cloneNode(true);

    designBoardPreviewPlaque.appendChild(
      plaqueClone
    );
  }
}

/*
This function sets the initial state of the project boards.
Only one board exists visually at a time, while the others remain
hidden until selected by the user.
*/
function initialiseDesignBoards() {
  projectBoards.forEach((board, index) => {
    board.hidden = index !== 0;
  });
}

initialiseDesignBoards();