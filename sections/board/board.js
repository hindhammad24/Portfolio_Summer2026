const boardData = {
  catalyst: {
    statue: "assets/competetion/catalystactive.webp",
    eyebrow: "Catalyst Entrepreneurship Challenge · Spring 2025",
    title: "SkyConnect",
    award: "1st Place Winners",
    team: "Hind Hammad, Mohammad Hammad, Malk Hayder, Aliya Dif",
    overview:
      "SkyConnect was created for the Catalyst Entrepreneurship Challenge in partnership with TransLink. Our team designed a Family-Friendly Transit Zone for SkyTrain cars to make transit feel safer and more welcoming for families, children, caregivers, and vulnerable riders.",
    role: [
      "Research and idea development",
      "3D model of the proposed transit zone",
      "Animated final presentation",
      "Visual assets and illustrations",
      "Final project presentation"
    ],
    process:
      "We examined TransLink safety reports, ridership data, surveys, and user feedback. From this research, we developed a practical transit-zone concept with family seating, stroller space, safety signage, and emergency communication features.",
    reflection:
      "This project helped me improve my research, teamwork, presentation, and design skills. Winning first place showed me the value of creativity, preparation, and collaboration.",
    tools: ["Figma", "PowerPoint", "Onshape", "UX Research", "3D Modeling", "Presentation Design"],
    images: [
      ["Presentation Photo", "Presenting the SkyConnect project during the final competition."],
      ["Award Photo", "Receiving the First Place award with my team."],
      ["3D Prototype", "Family-Friendly Transit Zone model created in Onshape."],
      ["Animated Pitch Deck", "Custom presentation with original graphics and motion."]
    ]
  },

  sma: {
    statue: "assets/competetion/smaactive.webp",
    eyebrow: "Brandstorm 2025",
    title: "Brandstorm 2025",
    award: "Honorary Participation",
    team: "Add team / individual info",
    overview: "Add your Brandstorm overview here.",
    role: ["Add role point", "Add role point", "Add role point"],
    process: "Add process here.",
    reflection: "Add reflection here.",
    tools: ["Tool", "Tool", "Tool"],
    images: [
      ["Main Image", "Add caption here."],
      ["Process Image", "Add caption here."]
    ]
  },

  opp: {
    statue: "assets/competetion/oppactive.webp",
    eyebrow: "Opportunity Fest 2026",
    title: "Opportunity Fest 2026",
    award: "First Ever SIAT Group",
    team: "Add team / group info",
    overview: "Add your Opportunity Fest overview here.",
    role: ["Add role point", "Add role point", "Add role point"],
    process: "Add process here.",
    reflection: "Add reflection here.",
    tools: ["Tool", "Tool", "Tool"],
    images: [
      ["Main Image", "Add caption here."],
      ["Event Photo", "Add caption here."]
    ]
  }
};

const boardOverlay = document.getElementById("boardOverlay");
const boardClose = document.getElementById("boardClose");
const designBoard = document.getElementById("designBoard");
const boardStatueImg = document.getElementById("boardStatueImg");

function openBrochure(id) {
  const data = boardData[id];
  if (!data) return;

  boardStatueImg.src = data.statue;
  boardStatueImg.alt = `${data.title} sculpture`;

  designBoard.innerHTML = `
    <header class="board-title-area">
      <p>${data.eyebrow}</p>
      <h2>${data.title}</h2>
    </header>

    <section class="board-item board-award">
      <span>Award</span>
      <strong>${data.award}</strong>
    </section>

    <section class="board-item board-overview">
      <h3>Overview</h3>
      <p>${data.overview}</p>
    </section>

    <section class="board-item board-role">
      <h3>My Role</h3>
      <ul>
        ${data.role.map(item => `<li>${item}</li>`).join("")}
      </ul>
    </section>

    <section class="board-item board-process">
      <h3>Process</h3>
      <p>${data.process}</p>
    </section>

    <section class="board-item board-reflection">
      <h3>Reflection</h3>
      <p>${data.reflection}</p>
    </section>

    <section class="board-item board-tools">
      <h3>Tools + Skills</h3>
      <div class="board-tags">
        ${data.tools.map(tool => `<span>${tool}</span>`).join("")}
      </div>
    </section>

    <section class="board-item board-team">
      <span>Team</span>
      <strong>${data.team}</strong>
    </section>

    ${data.images.map(([title, caption], index) => `
      <figure class="board-photo board-photo-${index + 1}">
        <div class="board-photo-placeholder">${title}</div>
        <figcaption>
          <strong>${title}</strong>
          ${caption}
        </figcaption>
      </figure>
    `).join("")}
  `;

  boardOverlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeBrochure() {
  boardOverlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

boardClose.addEventListener("click", closeBrochure);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBrochure();
});