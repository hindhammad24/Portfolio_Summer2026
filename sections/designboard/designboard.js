/* Designer Board Elements ---------------------------------- */

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


/* Show Selected Project Board ------------------------------ */

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


/* Open Design Board ---------------------------------------- */

function openDesignBoard(exhibit) {
  if (!designBoard || !exhibit) return;

  const boardName = exhibit.dataset.board;

  if (!boardName) return;

  updateDesignBoardPreview(exhibit);
  showSelectedProjectBoard(boardName);

  designBoard.classList.add("open");
  designBoard.setAttribute("aria-hidden", "false");

  document.body.classList.add("board-open");
}


/* Close Design Board --------------------------------------- */

function closeBoard() {
  if (!designBoard) return;

  designBoard.classList.remove("open");
  designBoard.setAttribute("aria-hidden", "true");

  document.body.classList.remove("board-open");
}


/* View More Buttons ---------------------------------------- */

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const exhibit =
      button.closest(".gallery-exhibit");

    openDesignBoard(exhibit);
  });
});


/* Clickable Project Artwork -------------------------------- */

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


/* Close Button --------------------------------------------- */

closeDesignBoard?.addEventListener(
  "click",
  closeBoard
);


/* Close When Clicking Backdrop ----------------------------- */

designBoard?.addEventListener("click", (event) => {
  if (
    event.target.classList.contains(
      "design-board-backdrop"
    )
  ) {
    closeBoard();
  }
});


/* Close With Escape Key ------------------------------------ */

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    designBoard?.classList.contains("open")
  ) {
    closeBoard();
  }
});


/* Update Selected Exhibit Preview -------------------------- */

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


/* Initial Board State -------------------------------------- */

function initialiseDesignBoards() {
  projectBoards.forEach((board, index) => {
    board.hidden = index !== 0;
  });
}

initialiseDesignBoards();