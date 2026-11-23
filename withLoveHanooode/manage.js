(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* =====================================
     WHERE THE SHOP LIVES
     Saved per device with the token.
  ===================================== */

  const storageKey = "withlove-editor-v1";

  const defaults = {
    owner: "hindhammad24",
    repo: "Portfolio_Summer2026",
    branch: "main",
    folder: "withLoveHanooode",
    token: "",
  };

  let settings = { ...defaults };

  try {
    settings = {
      ...defaults,
      ...JSON.parse(localStorage.getItem(storageKey) || "{}"),
    };
  } catch {
    // Editing still works for this visit without saved settings.
  }

  function remember() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
      // Private browsing: the token is kept until the page closes.
    }
  }

  const cataloguePath = () => `${settings.folder}/catalogue.json`;

  const photoFolders = {
    Canvas: "canvas",
    Frame: "canvas",
    Pot: "pots",
    Ornament: "ornaments",
    "Greeting Cards": "cards",
    "Tech Art": "tech",
  };

  const defaultShipping = {
    "Greeting Cards": "card",
    Ornament: "ornament",
    Pot: "pot",
  };

  /* =====================================
     GITHUB
     Every save reads the latest catalogue
     first and changes only what you edited,
     so an old tab can't undo a sale.
  ===================================== */

  function api(path, options = {}) {
    return fetch(
      `https://api.github.com/repos/${settings.owner}/${settings.repo}/${path}`,
      {
        ...options,
        cache: "no-store",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${settings.token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          ...(options.headers || {}),
        },
      },
    );
  }

  async function problem(response) {
    if (response.status === 401) {
      return new Error(
        "GitHub didn't accept the token. It may have expired: connect again with a new one.",
      );
    }

    if (response.status === 403 || response.status === 404) {
      return new Error(
        "This token can't edit the shop. Check it has Contents: Read and write on this repository.",
      );
    }

    let detail = "";

    try {
      detail = (await response.json()).message || "";
    } catch {
      // No details from GitHub.
    }

    return new Error(`GitHub said no (${response.status}). ${detail}`.trim());
  }

  function toBase64(bytes) {
    let text = "";

    for (let i = 0; i < bytes.length; i += 0x8000) {
      text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }

    return btoa(text);
  }

  const fromBase64 = (text) =>
    new TextDecoder().decode(
      Uint8Array.from(atob(text.replace(/\s/g, "")), (c) => c.charCodeAt(0)),
    );

  async function readCatalogue() {
    const response = await api(
      `contents/${cataloguePath()}?ref=${encodeURIComponent(settings.branch)}`,
    );

    if (!response.ok) throw await problem(response);

    const file = await response.json();

    return { data: JSON.parse(fromBase64(file.content)), sha: file.sha };
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function saveCatalogue(message, change) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const latest = await readCatalogue();

      change(latest.data);

      const response = await api(`contents/${cataloguePath()}`, {
        method: "PUT",
        body: JSON.stringify({
          message,
          branch: settings.branch,
          sha: latest.sha,
          content: toBase64(
            new TextEncoder().encode(JSON.stringify(latest.data, null, 2) + "\n"),
          ),
        }),
      });

      if (response.ok) {
        catalogue = latest.data;
        return;
      }

      // Someone else saved a moment ago: read again and retry.
      if (response.status === 409) {
        await wait(800 * (attempt + 1));
        continue;
      }

      throw await problem(response);
    }

    throw new Error("Another save happened at the same time. Please try again.");
  }

  async function fileExists(path) {
    const response = await api(
      `contents/${path}?ref=${encodeURIComponent(settings.branch)}`,
    );

    if (response.status === 404) return false;
    if (!response.ok) throw await problem(response);
    return true;
  }

  /* =====================================
     PHOTOS
     Phone photos are resized to 1600px
     before upload to keep the site fast.
  ===================================== */

  async function resizePhoto(file) {
    let bitmap;

    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      throw new Error(
        "This photo format can't be read here. Please choose a JPEG or PNG.",
      );
    }

    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");

    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );

    return new Uint8Array(await blob.arrayBuffer());
  }

  const slug = (text) =>
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "artwork";

  async function uploadPhoto(file, piece) {
    const bytes = await resizePhoto(file);
    const folder = `assets/artworks/${photoFolders[piece.category] || "other"}`;
    const base = slug(piece.title);

    let name = `${base}.jpg`;

    for (let n = 2; await fileExists(`${folder}/${name}`); n++) {
      name = `${base}_${n}.jpg`;
    }

    const response = await api(`contents/${folder}/${name}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Add photo for ${piece.title}`,
        branch: settings.branch,
        content: toBase64(bytes),
      }),
    });

    if (!response.ok) throw await problem(response);

    const image = `../${folder}/${name}`;
    freshPhotos[image] = URL.createObjectURL(file);

    return image;
  }

  /* =====================================
     STATE
  ===================================== */

  let catalogue = null;
  let editingId = null;
  let original = null;
  const freshPhotos = {};

  const connected = () => Boolean(settings.token);

  function bar(message, isError = false) {
    $("saving-bar").textContent = message;
    $("saving-bar").classList.toggle("error", isError);
    $("saving-bar").hidden = !message;
  }

  let busy = false;

  async function run(label, feedback, task, done) {
    if (busy) return;

    if (!connected()) {
      feedback.textContent = "Connect your website first (top of the page).";
      return;
    }

    busy = true;
    document.querySelectorAll("button").forEach((b) => (b.disabled = true));
    bar(label);
    feedback.textContent = "";

    try {
      await task();
      bar("");
      feedback.textContent =
        done + " Live on your shop in about a minute.";
      render();
    } catch (error) {
      bar(error.message, true);
      feedback.textContent = error.message;
    } finally {
      busy = false;
      document.querySelectorAll("button").forEach((b) => (b.disabled = false));
    }
  }

  const money = (value) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
      value,
    );

  const isSold = (piece) => piece.status === "sold" || piece.quantity === 0;

  const photoFor = (piece) => freshPhotos[piece.image] || piece.image || "";

  function findPiece(data, id) {
    const piece = data.artworks.find((p) => p.id === id);

    if (!piece) {
      throw new Error("That piece is no longer in the catalogue. Reload the page.");
    }

    return piece;
  }

  /* =====================================
     ARTWORK LIST
  ===================================== */

  function renderList() {
    const query = $("search").value.trim().toLowerCase();
    const showSold = $("show-sold").checked;

    const pieces = catalogue.artworks.filter(
      (piece) =>
        (showSold || (!isSold(piece) && piece.status !== "hidden")) &&
        (!query ||
          piece.title.toLowerCase().includes(query) ||
          piece.id.toLowerCase().includes(query)),
    );

    $("list-count").textContent =
      `${pieces.length} of ${catalogue.artworks.length} pieces shown`;

    $("catalogue-list").replaceChildren();

    for (const piece of pieces) {
      const row = document.createElement("div");
      row.className = `row${isSold(piece) ? " is-sold" : ""}`;

      const image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      // A new photo takes about a minute to go live.
      image.addEventListener("error", () => image.removeAttribute("src"), {
        once: true,
      });
      image.src = photoFor(piece);

      const text = document.createElement("div");
      text.className = "text";
      text.textContent = piece.title;

      if (piece.status !== "available" || piece.quantity === 0) {
        const pill = document.createElement("span");
        pill.className = `pill${isSold(piece) ? " sold" : ""}`;
        pill.textContent = isSold(piece) ? "Sold" : piece.status;
        text.append(pill);
      }

      const note = document.createElement("small");
      const left =
        Number.isInteger(piece.quantity) && piece.quantity > 1
          ? ` · ${piece.quantity} left`
          : "";
      note.textContent = `${piece.id} · ${money(piece.price)}${left}`;
      text.append(note);

      const actions = document.createElement("div");
      actions.className = "actions";

      const quick = document.createElement("button");
      quick.type = "button";

      if (isSold(piece) || piece.status !== "available") {
        quick.className = "secondary";
        quick.textContent = "Mark available";
        quick.addEventListener("click", () => markAvailable(piece.id));
      } else if (Number.isInteger(piece.quantity) && piece.quantity > 1) {
        quick.textContent = "Sold one";
        quick.addEventListener("click", () => soldOne(piece.id));
      } else {
        quick.textContent = "Mark sold";
        quick.addEventListener("click", () => markSold(piece.id));
      }

      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "secondary";
      edit.textContent = "Edit";
      edit.addEventListener("click", () => openEditor(piece));

      actions.append(quick, edit);
      row.append(image, text, actions);
      $("catalogue-list").append(row);
    }
  }

  const listFeedback = () => $("list-feedback");

  function markSold(id) {
    const title = findPiece(catalogue, id).title;

    run(
      `Marking ${title} as sold…`,
      listFeedback(),
      () =>
        saveCatalogue(`Mark ${title} as sold`, (data) => {
          findPiece(data, id).status = "sold";
        }),
      `${title} is marked sold.`,
    );
  }

  function soldOne(id) {
    const title = findPiece(catalogue, id).title;

    run(
      `Updating ${title}…`,
      listFeedback(),
      () =>
        saveCatalogue(`Sell one ${title}`, (data) => {
          const piece = findPiece(data, id);

          if (Number.isInteger(piece.quantity) && piece.quantity > 0) {
            piece.quantity -= 1;
          }

          if (piece.quantity === 0) piece.status = "sold";
        }),
      `One ${title} sold.`,
    );
  }

  function markAvailable(id) {
    const title = findPiece(catalogue, id).title;

    run(
      `Making ${title} available…`,
      listFeedback(),
      () =>
        saveCatalogue(`Mark ${title} as available`, (data) => {
          const piece = findPiece(data, id);
          piece.status = "available";
          if (piece.quantity === 0) piece.quantity = 1;
        }),
      `${title} is available again.`,
    );
  }

  /* =====================================
     ADD / EDIT A PIECE
  ===================================== */

  const form = $("artwork-editor");

  const editable = [
    "id",
    "title",
    "category",
    "status",
    "price",
    "size",
    "shipping",
    "quantity",
    "series",
    "alt",
    "description",
  ];

  function nextId() {
    const numbers = catalogue.artworks
      .map((piece) => Number((piece.id.match(/^HHH(\d+)$/) || [])[1]))
      .filter(Number.isFinite);

    return `HHH${Math.max(0, ...numbers) + 1}`;
  }

  function guessShipping(category, size) {
    if (defaultShipping[category]) return defaultShipping[category];

    const inches = (String(size).match(/[\d.]+/g) || []).map(Number);
    return Math.max(0, ...inches) > 12 ? "large" : "small";
  }

  function renderShippingTypes() {
    $("shipping-type").replaceChildren(
      ...catalogue.shipping.classes.map((type) => {
        const option = document.createElement("option");
        option.value = type.key;
        option.textContent = type.label;
        return option;
      }),
    );
  }

  function readForm() {
    const values = Object.fromEntries(new FormData(form));
    const piece = {};

    for (const key of editable) {
      piece[key] = String(values[key] ?? "").trim();
    }

    piece.price = Number(piece.price);
    piece.quantity = piece.quantity === "" ? null : Number(piece.quantity);
    piece.alt = piece.alt || piece.title;

    return piece;
  }

  function openEditor(piece) {
    editingId = piece ? piece.id : null;
    original = piece ? { ...piece } : null;

    form.reset();
    $("photo-preview").src = piece ? photoFor(piece) : "";
    $("editor-title").textContent = piece ? `Edit ${piece.title}` : "Add a piece";
    $("remove-piece").hidden = !piece;
    $("editor-feedback").textContent = "";

    const start = piece || {
      id: nextId(),
      category: "Canvas",
      status: "available",
      shipping: "small",
      quantity: 1,
    };

    for (const key of editable) {
      if (form.elements[key] && start[key] != null) {
        form.elements[key].value = start[key];
      }
    }

    $("editor-section").hidden = false;
    $("editor-section").scrollIntoView({ block: "start" });
    form.elements.title.focus();
  }

  function closeEditor() {
    editingId = null;
    original = null;
    form.reset();
    $("editor-section").hidden = true;
  }

  form.elements.category.addEventListener("change", () => {
    form.elements.shipping.value = guessShipping(
      form.elements.category.value,
      form.elements.size.value,
    );
  });

  form.elements.size.addEventListener("change", () => {
    if (!defaultShipping[form.elements.category.value]) {
      form.elements.shipping.value = guessShipping(
        form.elements.category.value,
        form.elements.size.value,
      );
    }
  });

  $("photo-preview").addEventListener("error", () =>
    $("photo-preview").removeAttribute("src"),
  );

  $("photo").addEventListener("change", () => {
    const file = $("photo").files[0];
    if (file) $("photo-preview").src = URL.createObjectURL(file);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const piece = readForm();
    const file = $("photo").files[0];
    const feedback = $("editor-feedback");

    if (!Number.isFinite(piece.price) || piece.price < 0) {
      feedback.textContent = "Please enter a price.";
      return;
    }

    if (
      piece.quantity !== null &&
      (!Number.isInteger(piece.quantity) || piece.quantity < 0)
    ) {
      feedback.textContent = "How many you have must be a whole number.";
      return;
    }

    if (!editingId && !file) {
      feedback.textContent = "Please add a photo of the piece.";
      return;
    }

    const clash = catalogue.artworks.some(
      (p) => p.id === piece.id && p.id !== editingId,
    );

    if (clash) {
      feedback.textContent = `${piece.id} is already used. Each piece needs its own ID.`;
      return;
    }

    const id = editingId;
    const before = original;

    run(
      file ? "Uploading the photo and saving…" : `Saving ${piece.title}…`,
      feedback,
      async () => {
        if (file) piece.image = await uploadPhoto(file, piece);

        await saveCatalogue(
          id ? `Update ${piece.title}` : `Add ${piece.title}`,
          (data) => {
            if (!id) {
              if (data.artworks.some((p) => p.id === piece.id)) {
                piece.id = nextIdIn(data);
              }

              data.artworks.unshift({ series: "", ...piece });
              return;
            }

            // Only write fields you changed, so a sale made
            // elsewhere since you opened this piece is kept.
            const current = findPiece(data, id);

            for (const key of [...editable, "image"]) {
              if (piece[key] === undefined) continue;
              if (before && String(before[key] ?? "") === String(piece[key] ?? "")) {
                continue;
              }
              current[key] = piece[key];
            }
          },
        );

        closeEditor();
      },
      `${piece.title} is saved.`,
    );
  });

  function nextIdIn(data) {
    const numbers = data.artworks
      .map((p) => Number((p.id.match(/^HHH(\d+)$/) || [])[1]))
      .filter(Number.isFinite);

    return `HHH${Math.max(0, ...numbers) + 1}`;
  }

  $("new-artwork").addEventListener("click", () => openEditor(null));
  $("cancel-edit").addEventListener("click", closeEditor);

  $("remove-piece").addEventListener("click", () => {
    const id = editingId;
    const title = original.title;

    if (
      !confirm(
        `Remove “${title}” from the catalogue? Choose Hidden as the status instead if you want to keep its entry.`,
      )
    ) {
      return;
    }

    run(
      `Removing ${title}…`,
      $("editor-feedback"),
      async () => {
        await saveCatalogue(`Remove ${title}`, (data) => {
          data.artworks = data.artworks.filter((p) => p.id !== id);
        });

        closeEditor();
      },
      `${title} is removed.`,
    );
  });

  /* =====================================
     SHIPPING PRICES
  ===================================== */

  function renderShipping() {
    const { zones, classes, extraItem } = catalogue.shipping;
    const table = $("shipping-table");

    const head = document.createElement("tr");
    head.append(document.createElement("th"));

    for (const zone of zones) {
      const th = document.createElement("th");
      th.textContent = zone.label;
      head.append(th);
    }

    table.replaceChildren(head);

    for (const type of classes) {
      const row = document.createElement("tr");
      const name = document.createElement("td");
      name.textContent = type.label;
      row.append(name);

      for (const zone of zones) {
        const cell = document.createElement("td");
        const input = document.createElement("input");

        input.type = "number";
        input.min = "0";
        input.step = "0.01";
        input.inputMode = "decimal";
        input.dataset.type = type.key;
        input.dataset.zone = zone.key;
        input.setAttribute("aria-label", `${type.label} to ${zone.label}`);
        input.value = type.rates[zone.key] ?? "";

        cell.append(input);
        row.append(cell);
      }

      table.append(row);
    }

    $("extra-item").value = extraItem ?? "";
  }

  $("shipping-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const rates = [...$("shipping-table").querySelectorAll("input")].map(
      (input) => ({
        type: input.dataset.type,
        zone: input.dataset.zone,
        value: input.value === "" ? null : Number(input.value),
      }),
    );

    const extra =
      $("extra-item").value === "" ? null : Number($("extra-item").value);

    run(
      "Saving shipping prices…",
      $("shipping-feedback"),
      () =>
        saveCatalogue("Update shipping prices", (data) => {
          for (const { type, zone, value } of rates) {
            const entry = data.shipping.classes.find((c) => c.key === type);
            if (entry) entry.rates[zone] = value;
          }

          data.shipping.extraItem = extra;
        }),
      "Shipping prices are saved.",
    );
  });

  /* =====================================
     SHOP DETAILS
  ===================================== */

  const detailFields = {
    email: "config-email",
    paymentEmail: "config-payment",
    commissionsUrl: "config-commissions",
    donationUrl: "config-donation",
  };

  function renderDetails() {
    for (const [key, id] of Object.entries(detailFields)) {
      $(id).value = catalogue.config[key] || "";
    }

    $("config-photos").checked = Boolean(catalogue.config.photosEnabled);
  }

  $("details-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const values = {};

    for (const [key, id] of Object.entries(detailFields)) {
      values[key] = $(id).value.trim();
    }

    values.photosEnabled = $("config-photos").checked;

    run(
      "Saving shop details…",
      $("details-feedback"),
      () =>
        saveCatalogue("Update shop details", (data) => {
          Object.assign(data.config, values);
        }),
      "Shop details are saved.",
    );
  });

  /* =====================================
     CONNECT / DISCONNECT
  ===================================== */

  const repoFields = {
    owner: "repo-owner",
    repo: "repo-name",
    branch: "repo-branch",
    folder: "repo-folder",
  };

  for (const [key, id] of Object.entries(repoFields)) {
    $(id).value = settings[key];
  }

  $("connect-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const previous = { ...settings };

    for (const [key, id] of Object.entries(repoFields)) {
      settings[key] = $(id).value.trim();
    }

    settings.token = $("token").value.trim();
    $("connect-feedback").textContent = "Checking…";

    try {
      catalogue = (await readCatalogue()).data;
      remember();
      $("token").value = "";
      $("connect-feedback").textContent = "";
      render();
    } catch (error) {
      settings = previous;
      $("connect-feedback").textContent = error.message;
    }
  });

  $("disconnect").addEventListener("click", () => {
    settings.token = "";
    remember();
    render();
  });

  $("search").addEventListener("input", renderList);
  $("show-sold").addEventListener("change", renderList);

  /* =====================================
     START
  ===================================== */

  function render() {
    $("connect-section").hidden = connected();
    $("disconnect").hidden = !connected();
    $("repo-name-hint").textContent = settings.repo;

    $("mode-notice").innerHTML = connected()
      ? "<strong>Connected.</strong> Saves go straight to your live shop and show up there in about a minute."
      : "<strong>Not connected yet.</strong> You can look around, but connect your website below to save changes.";

    if (!catalogue) return;

    renderShippingTypes();
    renderList();
    renderShipping();
    renderDetails();
  }

  async function start() {
    try {
      if (connected()) {
        catalogue = (await readCatalogue()).data;
      } else {
        const response = await fetch("catalogue.json", { cache: "no-cache" });
        catalogue = await response.json();
      }
    } catch (error) {
      if (connected()) {
        settings.token = "";
        $("connect-feedback").textContent = error.message;
        return start();
      }

      bar(error.message, true);
    }

    render();
  }

  start();
})();
