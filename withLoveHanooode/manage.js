(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const config = structuredClone(window.SHOP_CONFIG);
  const pieces = structuredClone(window.ARTWORKS);
  let editing = -1;
  const form = $("artwork-editor");
  const fields = {
    email: "config-email",
    paymentEmail: "config-payment",
    commissionsUrl: "config-commissions",
    donationUrl: "config-donation",
  };
  Object.entries(fields).forEach(([key, id]) => {
    $(id).value = config[key] || "";
  });
  $("config-photos").checked = config.photosEnabled;
  function render() {
    $("catalogue-list").replaceChildren();
    pieces.forEach((piece, index) => {
      const row = document.createElement("div");
      row.className = "row";
      const text = document.createElement("div");
      text.textContent = piece.title;
      const note = document.createElement("small");
      note.textContent = `${piece.id} · ${piece.status.toUpperCase()} · $${Number(piece.price).toFixed(2)} CAD`;
      text.append(note);
      const actions = document.createElement("div");
      actions.className = "actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Edit / change status";
      edit.addEventListener("click", () => {
        editing = index;
        Object.keys(piece).forEach((key) => {
          if (form.elements[key]) form.elements[key].value = piece[key];
        });
        $("editor-title").textContent = `Edit ${piece.id}`;
        form.scrollIntoView({ block: "start" });
        form.elements.title.focus();
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "secondary";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        if (
          !confirm(
            `Remove “${piece.title}” from the catalogue? You can use Hidden instead to keep its entry.`,
          )
        )
          return;
        pieces.splice(index, 1);
        reset();
        render();
      });
      actions.append(edit, remove);
      row.append(text, actions);
      $("catalogue-list").append(row);
    });
  }
  function reset() {
    editing = -1;
    form.reset();
    $("editor-title").textContent = "Add a piece";
  }
  $("new-artwork").addEventListener("click", () => {
    reset();
    form.scrollIntoView({ block: "start" });
    form.elements.id.focus();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const piece = Object.fromEntries(new FormData(form));
    Object.keys(piece).forEach((key) => {
      piece[key] = piece[key].trim();
    });
    if (
      !piece.id ||
      !piece.title ||
      !piece.category ||
      !piece.image ||
      !piece.alt
    ) {
      $("editor-feedback").textContent = "Please fill in all required fields.";
      return;
    }
    if (pieces.some((p, index) => p.id === piece.id && index !== editing)) {
      $("editor-feedback").textContent = "Each artwork needs a different ID.";
      return;
    }
    piece.quantity = piece.quantity === "" ? null : Number(piece.quantity);
    if (
      piece.quantity !== null &&
      (!Number.isInteger(piece.quantity) || piece.quantity < 0)
    )
      return;
    piece.price = Number(piece.price);
    if (!Number.isFinite(piece.price) || piece.price < 0) return;
    if (editing < 0) pieces.push(piece);
    else pieces[editing] = piece;
    reset();
    render();
    $("editor-feedback").textContent =
      "Saved to this session. Download artworks.js below to keep and publish this change.";
  });
  $("download-catalogue").addEventListener("click", () => {
    for (const [key, id] of Object.entries(fields)) {
      const input = $(id);
      if (!input.reportValidity()) return;
      config[key] = input.value.trim();
      if (
        key !== "email" &&
        key !== "paymentEmail" &&
        config[key] &&
        !config[key].startsWith("https://")
      ) {
        $("download-feedback").textContent =
          "Please use public https:// links for commissions and donations.";
        input.focus();
        return;
      }
    }
    config.photosEnabled = $("config-photos").checked;
    const source = `/* Generated catalogue. Upload this file beside shop.html. */\nwindow.SHOP_CONFIG = ${JSON.stringify(config, null, 2)};\n\nwindow.ARTWORKS = ${JSON.stringify(pieces, null, 2)};\n`;
    const url = URL.createObjectURL(
      new Blob([source], { type: "text/javascript" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "artworks.js";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("download-feedback").textContent =
      "Download prepared. Replace your existing artworks.js, preview shop.html, then upload it to your website. Unsaved artwork form edits are not included.";
  });
  render();
})();
