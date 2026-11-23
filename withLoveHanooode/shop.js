(() => {
  "use strict";

  /* Show loading errors on the page instead of leaving it blank. */
  function showError(message) {
    console.error("Art shop:", message);

    let notice = document.getElementById("shop-load-error");

    if (!notice) {
      notice = document.createElement("p");
      notice.id = "shop-load-error";
      notice.setAttribute("role", "alert");

      notice.style.cssText = `
        padding: 1rem;
        margin: 1rem;
        background: white;
        color: #8b2e52;
        border: 1px solid #8b2e52;
        overflow-wrap: anywhere;
      `;

      const container =
        document.getElementById("shop-gallery") ||
        document.querySelector("main") ||
        document.body;

      container.append(notice);
    }

    notice.textContent = message;
  }

  function initialiseShop() {
    if (document.documentElement.dataset.shopInitialised === "true") {
      return;
    }

    /* Check that the catalogue loaded first. */
    if (!window.SHOP_CONFIG || !Array.isArray(window.ARTWORKS)) {
      showError(
        "catalogue.json has not loaded. Keep it beside shop.html " +
          "and check that it is valid JSON.",
      );
      return;
    }

    const $ = (id) => document.getElementById(id);

    /* These IDs belong to the gallery and checkout HTML. */
    const required = [
      "product-grid",
      "filters",
      "series-filter",
      "available-only",
      "empty-state",
      "result-count",
      "empty-message",
      "cart-count",
      "shop-toast",
      "cart-items",
      "cart-total",
      "checkout-fields",
      "checkout-feedback",
      "manual-order",
      "open-cart",
      "close-cart",
      "cart-dialog",
      "checkout-form",
      "delivery",
      "shipping-fields",
      "copy-order",
    ];

    const missing = required.filter((id) => !$(id));

    if (missing.length) {
      showError(
        "shop.html is missing elements required by shop.js: " +
          missing.join(", ") +
          ". Restore these element IDs or use the matching shop HTML.",
      );
      return;
    }

    const config = window.SHOP_CONFIG;
    const products = window.ARTWORKS;
    const shippingTable = window.SHOP_SHIPPING || null;

    /* Validate without changing your catalogue. */
    const ids = new Set();

    for (const product of products) {
      const invalid =
        !product ||
        typeof product.id !== "string" ||
        !product.id ||
        ids.has(product.id) ||
        typeof product.price !== "number" ||
        !Number.isFinite(product.price) ||
        product.price < 0 ||
        !["available", "reserved", "sold", "hidden"].includes(product.status) ||
        (product.quantity != null &&
          (!Number.isInteger(product.quantity) || product.quantity < 0));

      if (invalid) {
        showError(
          "Check catalogue.json: each artwork needs a unique ID, " +
            "a valid price and quantity, and a status of available, " +
            "reserved, sold, or hidden.",
        );
        return;
      }

      ids.add(product.id);
    }

    const money = (value) =>
      new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      }).format(value);

    function make(tag, className, text) {
      const element = document.createElement(tag);

      if (className) {
        element.className = className;
      }

      if (text !== undefined) {
        element.textContent = text;
      }

      return element;
    }

    const available = (product) =>
      product && product.status === "available" && product.quantity !== 0;

    const limit = (product) =>
      Number.isInteger(product.quantity) ? Math.max(0, product.quantity) : 99;

    /* Built-in placeholder: no separate image file required. */
    const placeholder =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="600"
          height="600"
          viewBox="0 0 600 600"
        >
          <rect width="600" height="600" fill="#faf7f8"/>
          <path
            d="M300 245c-80-70-120 30 0 100 120-70 80-170 0-100"
            fill="none"
            stroke="#8b2e52"
            stroke-width="3"
          />
          <text
            x="300"
            y="430"
            text-anchor="middle"
            font-family="monospace"
            font-size="18"
            fill="#8b2e52"
          >Photo coming soon</text>
        </svg>
      `);

    /* =====================================
       OPTIONAL COMMISSION / DONATION LINKS
       Missing links will not crash the shop.
    ===================================== */

    function https(link) {
      try {
        const url = new URL(link);
        return url.protocol === "https:" ? url.href : "";
      } catch {
        return "";
      }
    }

    const commission = https(config.commissionsUrl);
    const commissionLink = $("commission-link");
    const navCommissions = $("nav-commissions");

    if (commission && commissionLink) {
      commissionLink.href = commission;
      commissionLink.textContent = "Request a commission ↗";
    }

    if (commission && navCommissions) {
      navCommissions.href = commission;
    }

    const campaign = https(config.donationUrl);
    const campaignLink = $("campaign-link");

    if (campaign && campaignLink) {
      campaignLink.href = campaign;
      campaignLink.hidden = false;
    }

    /* =====================================
       CART STORAGE
       Only product IDs and quantities saved.
    ===================================== */

    const storageKey = "withlove-shop-bag-v2";
    let cart = {};
    let toastTimer;
    let category = "All";

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");

      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        for (const product of products) {
          const quantity = Number(saved[product.id]);

          if (
            available(product) &&
            Number.isInteger(quantity) &&
            quantity > 0
          ) {
            cart[product.id] = Math.min(quantity, limit(product));
          }
        }
      }
    } catch {
      cart = {};
    }

    function persist() {
      try {
        localStorage.setItem(storageKey, JSON.stringify(cart));
      } catch {
        // The cart still works when browser storage is unavailable.
      }

      $("cart-count").textContent = Object.values(cart).reduce(
        (total, quantity) => total + quantity,
        0,
      );
    }

    function toast(message) {
      $("shop-toast").textContent = message;
      clearTimeout(toastTimer);

      toastTimer = setTimeout(() => {
        $("shop-toast").textContent = "";
      }, 3500);
    }

    /* =====================================
       CATEGORY AND SERIES FILTERS
    ===================================== */

    const categories = [
      ["All", null],
      ["Pots", "Pot"],
      ["Ornaments", "Ornament"],
      ["Frames", "Frame"],
      ["Canvases", "Canvas"],
      ["Tech Art", "Tech Art"],
      ["Cards", "Greeting Cards"],
    ];

    $("filters").replaceChildren();

    for (const [label] of categories) {
      const button = make("button", "", label);
      button.type = "button";

      button.setAttribute("aria-pressed", String(label === category));

      button.addEventListener("click", () => {
        category = label;

        for (const filterButton of $("filters").children) {
          filterButton.setAttribute(
            "aria-pressed",
            String(filterButton === button),
          );
        }

        renderProducts();
      });

      $("filters").append(button);
    }

    const allSeries = make("option", "", "All series");
    allSeries.value = "all";
    $("series-filter").replaceChildren(allSeries);

    const series = [
      ...new Set(products.map((product) => product.series).filter(Boolean)),
    ];

    for (const name of series) {
      const option = make("option", "", name);
      option.value = name;
      $("series-filter").append(option);
    }

    $("series-filter").addEventListener("change", renderProducts);
    $("available-only").addEventListener("change", renderProducts);

    /* =====================================
       ARTWORK GALLERY
    ===================================== */

    function renderProducts() {
      const selectedCategory = categories.find(
        ([label]) => label === category,
      )[1];

      const selectedSeries = $("series-filter").value;

      const items = products.filter((product) => {
        return (
          product.status !== "hidden" &&
          (!selectedCategory || product.category === selectedCategory) &&
          (selectedSeries === "all" || product.series === selectedSeries) &&
          (!$("available-only").checked || available(product))
        );
      });

      $("product-grid").replaceChildren();
      $("empty-state").hidden = items.length > 0;

      $("result-count").textContent = `${items.length} pieces shown`;

      $("empty-message").textContent =
        category === "Pots"
          ? "Pots will be added soon."
          : category === "Tech Art"
            ? "Tech art will be added soon."
            : "No pieces match these filters. Try All or another series.";

      for (const product of items) {
        const active = available(product);

        const status =
          product.status === "reserved"
            ? "Reserved"
            : product.status === "sold" || product.quantity === 0
              ? "Sold"
              : "";

        const card = make(
          "article",
          `product-card${active ? "" : " unavailable"}`,
        );

        const media = make("div", "product-media");
        const image = make("img");

        const showPhoto = config.photosEnabled && Boolean(product.image);

        image.alt = showPhoto
          ? product.alt || product.title
          : `Photo coming soon: ${product.title}`;

        image.loading = "lazy";
        image.width = 600;
        image.height = 600;

        image.addEventListener(
          "error",
          () => {
            image.src = placeholder;
            image.alt = `Photo coming soon: ${product.title}`;
          },
          { once: true },
        );

        image.src = showPhoto ? product.image : placeholder;

        media.append(image);

        if (status) {
          media.append(make("span", "product-status", status));
        }

        card.append(
          media,
          make("h3", "", product.title),
          make("p", "product-id", `Artwork ID: ${product.id}`),
          make("p", "", product.size),
          make("p", "", product.description),
        );

        if (product.series) {
          card.append(make("p", "", product.series));
        }

        if (product.category === "Greeting Cards") {
          const quantityText =
            product.quantity == null
              ? "Price per card · quantity confirmed on request"
              : product.status === "reserved"
                ? "Currently reserved · price per card"
                : `${product.quantity} available · price per card`;

          card.append(make("p", "", quantityText));
        }

        card.append(make("p", "product-price", money(product.price)));

        const button = make("button", "", active ? "Add to bag +" : status);

        button.type = "button";
        button.disabled = !active;

        button.setAttribute(
          "aria-label",
          active
            ? `Add ${product.title} to bag`
            : `${product.title}: ${status}`,
        );

        button.addEventListener("click", () => {
          if ((cart[product.id] || 0) >= limit(product)) {
            toast("You have reached the available quantity for this piece.");
            return;
          }

          cart[product.id] = (cart[product.id] || 0) + 1;
          persist();
          toast(`${product.title} added to your bag.`);
        });

        card.append(button);
        $("product-grid").append(card);
      }
    }

    /* =====================================
       SHIPPING QUOTE
       The most expensive piece to ship sets the
       rate, then each extra piece adds a little.
       Returns null when a rate is still missing.
    ===================================== */

    const isRate = (value) =>
      typeof value === "number" && Number.isFinite(value) && value >= 0;

    function shippingQuote(province) {
      if (!shippingTable || !province) return null;

      const zone = shippingTable.zones.find((entry) =>
        entry.provinces.includes(province),
      );

      if (!zone) return null;

      let highest = 0;
      let pieces = 0;

      for (const product of products) {
        const quantity = cart[product.id];
        if (!quantity) continue;

        const type = shippingTable.classes.find(
          (entry) => entry.key === product.shipping,
        );

        const rate = type ? type.rates[zone.key] : null;
        if (!isRate(rate)) return null;

        highest = Math.max(highest, rate);
        pieces += quantity;
      }

      if (!pieces) return null;

      const extra = pieces > 1 ? shippingTable.extraItem : 0;
      if (pieces > 1 && !isRate(extra)) return null;

      return { zone: zone.label, amount: highest + extra * (pieces - 1) };
    }

    function shippingChoice() {
      const form = $("checkout-form");
      const shipping = $("delivery").value === "shipping";
      const province = form.elements.namedItem("province")?.value || "";

      return { shipping, province, quote: shipping ? shippingQuote(province) : null };
    }

    function renderTotal() {
      let subtotal = 0;

      for (const product of products) {
        subtotal += product.price * (cart[product.id] || 0);
      }

      const { shipping, province, quote } = shippingChoice();

      let text = `Artwork subtotal: ${money(subtotal)} CAD`;

      if (!shipping) {
        text += " · Pickup: free";
      } else if (quote) {
        text +=
          ` · Shipping to ${quote.zone}: ${money(quote.amount)}` +
          ` · Total: ${money(subtotal + quote.amount)} CAD`;
      } else if (province) {
        text += " · Shipping: confirmed by email";
      }

      $("cart-total").textContent = text;
    }

    /* =====================================
       CART DISPLAY
    ===================================== */

    function renderCart() {
      $("cart-items").replaceChildren();

      let total = 0;
      let count = 0;

      for (const product of products) {
        const quantity = cart[product.id];
        if (!quantity) continue;

        count += quantity;
        total += product.price * quantity;

        const line = make("div", "cart-line");

        line.append(
          make("p", "", `${product.title} · ${product.size}`),
          make("p", "product-id", `Artwork ID: ${product.id}`),
          make(
            "p",
            "",
            `${money(product.price)} each · ${money(product.price * quantity)}`,
          ),
        );

        const controls = make("div", "cart-line-controls");
        const label = make("label", "", "Quantity ");
        const input = make("input");

        input.type = "number";
        input.min = "1";
        input.max = String(limit(product));
        input.step = "1";
        input.value = quantity;

        input.setAttribute("aria-label", `Quantity for ${product.title}`);

        input.addEventListener("change", () => {
          const newQuantity = Number(input.value);

          if (
            !Number.isInteger(newQuantity) ||
            newQuantity < 1 ||
            newQuantity > limit(product)
          ) {
            input.value = cart[product.id];
            toast(`Choose a whole quantity from 1 to ${limit(product)}.`);
            return;
          }

          cart[product.id] = newQuantity;
          persist();
          renderCart();
        });

        label.append(input);

        const remove = make("button", "remove-item", "Remove");
        remove.type = "button";

        remove.setAttribute("aria-label", `Remove ${product.title} from bag`);

        remove.addEventListener("click", () => {
          delete cart[product.id];
          persist();
          renderCart();
        });

        controls.append(label, remove);
        line.append(controls);
        $("cart-items").append(line);
      }

      if (!count) {
        $("cart-items").append(
          make("p", "", "Your bag is empty. Find a little something you love."),
        );
      }

      renderTotal();

      $("checkout-fields").disabled = count === 0;
      $("checkout-feedback").textContent = "";
      $("manual-order").hidden = true;
      $("manual-order").value = "";
    }

    $("open-cart").addEventListener("click", () => {
      renderCart();

      if (!$("cart-dialog").open) {
        $("cart-dialog").showModal();
      }
    });

    $("close-cart").addEventListener("click", () => {
      $("cart-dialog").close();
    });

    $("cart-dialog").addEventListener("close", () => {
      $("checkout-form").reset();
      $("manual-order").value = "";
      $("manual-order").hidden = true;
      $("checkout-feedback").textContent = "";

      toggleShipping();
      $("open-cart").focus();
    });

    /* =====================================
       SHIPPING / PICKUP
    ===================================== */

    function toggleShipping() {
      const shipping = $("delivery").value === "shipping";

      $("shipping-fields").hidden = !shipping;

      for (const field of $("shipping-fields").querySelectorAll(
        "input, select",
      )) {
        field.required = shipping;
        field.disabled = !shipping;
      }
    }

    $("delivery").addEventListener("change", () => {
      toggleShipping();
      renderTotal();
    });

    $("checkout-form")
      .elements.namedItem("province")
      ?.addEventListener("change", renderTotal);

    /* =====================================
       PREPARE THE COMPLETE ORDER
    ===================================== */

    function orderText() {
      if (!Object.keys(cart).length) {
        $("checkout-feedback").textContent = "Your bag is empty.";
        return null;
      }

      const form = $("checkout-form");

      if (!form.reportValidity()) {
        return null;
      }

      const data = new FormData(form);
      const shipping = data.get("delivery") === "shipping";
      const postalCode = String(data.get("postal") || "").trim();

      const canadianPostalCode =
        /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

      if (shipping && !canadianPostalCode.test(postalCode)) {
        $("checkout-feedback").textContent =
          "Please enter a valid Canadian postal code.";

        form.elements.namedItem("postal")?.focus();
        return null;
      }

      const lines = [];
      let total = 0;

      for (const product of products) {
        const quantity = cart[product.id];
        if (!quantity) continue;

        if (
          !available(product) ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > limit(product)
        ) {
          $("checkout-feedback").textContent =
            "A piece in your bag is no longer available. " +
            "Please reload the shop and check your bag.";

          return null;
        }

        lines.push(
          `${quantity} × ${product.title} [${product.id}]` +
            ` — ${product.size}` +
            ` — ${money(product.price)} each` +
            ` — ${money(product.price * quantity)}`,
        );

        total += product.price * quantity;
      }

      if (!lines.length) {
        return null;
      }

      const address = shipping
        ? [
            `Shipping address: ${data.get("address")}`,
            `City: ${data.get("city")}`,
            `Province/territory: ${data.get("province")}`,
            `Postal code: ${postalCode}`,
            "Country: Canada",
          ].join("\n")
        : "Delivery: Pickup by arrangement";

      const paymentEmail = config.paymentEmail || config.email;
      const { quote } = shippingChoice();

      const shippingLines = !shipping
        ? ["Pickup: to be arranged (free)"]
        : quote
          ? [
              `Shipping to ${quote.zone}: ${money(quote.amount)}`,
              `Total: ${money(total + quote.amount)} CAD`,
            ]
          : ["Shipping: awaiting quote (not included above)"];

      return [
        "Hello Hind,",
        "",
        "I’d like to request these pieces:",
        "",
        ...lines,
        "",
        `Artwork subtotal: ${money(total)} CAD`,
        ...shippingLines,
        "",
        `Name: ${data.get("customer")}`,
        `Email: ${data.get("email")}`,
        `Phone / Instagram: ${data.get("contact") || "Not provided"}`,
        address,
        "",
        "Special requests / preferred colours:",
        data.get("requests") || "None",
        "",
        "Please confirm availability, card quantities/colours, " +
          "and the final total.",
        "I understand this request does not reserve the pieces.",
        "I’ll wait for confirmation before e-transferring " +
          `the final total to ${paymentEmail}.`,
      ].join("\n");
    }

    /* =====================================
       EMAIL DRAFT
       The customer must press Send.
    ===================================== */

    $("checkout-form").addEventListener("submit", (event) => {
      event.preventDefault();

      const body = orderText();
      if (!body) return;

      if (!config.email) {
        $("checkout-feedback").textContent =
          "The shop email is missing from the shop settings in the editor.";
        return;
      }

      const subject = "Artwork order request — withLoveHanooode";

      window.location.href =
        `mailto:${encodeURIComponent(config.email)}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      $("checkout-feedback").textContent =
        "Review the draft in your email app and press Send. " +
        "No email opened? Use Copy full order and paste it into an email. " +
        "Your bag stays here until you remove the items.";
    });

    /* =====================================
       COPY ORDER FALLBACK
    ===================================== */

    $("copy-order").addEventListener("click", async () => {
      const body = orderText();
      if (!body) return;

      try {
        await navigator.clipboard.writeText(body);

        $("checkout-feedback").textContent =
          `Copied. Paste into an email to ${config.email}, ` +
          "review it, and send.";
      } catch {
        $("manual-order").value = body;
        $("manual-order").hidden = false;
        $("manual-order").focus();
        $("manual-order").select();

        $("checkout-feedback").textContent =
          "Select and copy the order below, then send it by email.";
      }
    });

    /* =====================================
       START THE SHOP
    ===================================== */

    persist();
    toggleShipping();
    renderProducts();

    const photoNote = $("photo-note");

    if (photoNote) {
      photoNote.hidden = Boolean(config.photosEnabled);
    }

    document.documentElement.dataset.shopInitialised = "true";
  }

  /* Load the catalogue saved by the editor, then start. */
  async function boot() {
    try {
      const response = await fetch("catalogue.json", { cache: "no-cache" });

      if (!response.ok) {
        throw new Error(`catalogue.json returned ${response.status}`);
      }

      const catalogue = await response.json();

      window.SHOP_CONFIG = catalogue.config;
      window.ARTWORKS = catalogue.artworks;
      window.SHOP_SHIPPING = catalogue.shipping;

      initialiseShop();
    } catch (error) {
      showError("The shop could not load: " + error.message);
      console.error(error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, {
      once: true,
    });
  } else {
    boot();
  }
})();
