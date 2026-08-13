/*
This file controls the interactions inside the creative studio section.
Each object in the workspace reveals information about my background
and skills through interaction.
I separated these interactions from the HTML and CSS so the studio
objects can be modified independently while keeping the experience
organized.
*/
/* studio section*/

/*Logic explained:
JavaScript controls the interaction by detecting hover and click events, 
changing object states, and dynamically updating one reusable information card. 
For the transition into projects, I used scroll progress similar to the hero 
section. JavaScript calculates the user's position and controls CSS variables 
that move the desk left and bring the exhibition sign into view. This creates 
a continuous movement from learning about me into exploring my work." */

let activeStudioObject = null;

/*
This function controls opening and closing information for studio
objects.
I created a reusable function instead of repeating the same logic
for every object because each object follows the same interaction:
change image, show information, and reset previous selections.
*/
function openStudioInfo(button, img, hover, normal, text) {

  if (activeStudioObject === button) {

    img.src = normal;
    studioInfoCard.classList.remove("show");
    activeStudioObject = null;

    return;
  }


  if (activeStudioObject) {

    activeStudioObject.click();
  }


  img.src = hover;

  studioInfoCard.innerHTML = text;

  studioInfoCard.classList.add("show");

  activeStudioObject = button;
}

/* ..... ART OBJECT INTERACTION ..... */
/*
The canvas interaction introduces my artistic background.
Hovering changes the artwork and reveals information creating a
connection between the physical object and the digital interface.
*/
const studioCanvas = document.querySelector(".studio-canvas");
const studioCanvasImg = studioCanvas.querySelector("img");
const studioInfoCard = document.getElementById("studioInfoCard");
const canvasNormal = studioCanvasImg.src;
const canvasHover = studioCanvasImg.dataset.hover;

/*
How I created the information card?
The information card uses a reusable HTML element that starts empty
and is filled dynamically using JavaScript. Instead of creating 
separate cards for every studio object, I created one <article> 
element in the HTML and used JavaScript to change its content 
depending on which object the user interacts with. When the user 
hovers over or clicks an object, JavaScript changes the image, 
inserts the related information using innerHTML, and adds a class 
that makes the card visible. I chose this approach because creating 
separate cards for every object would make the HTML more repetitive 
and harder to maintain. Using one reusable card keeps the layout cleaner 
while still allowing each object to reveal detailed information.
*/
const artText = `
  <h2>Art & Creative Practice</h2>
  <p>Art was my first creative language and continues to influence how I approach design and technology.</p>
  <p>I enjoy acrylic painting, digital illustration, and mixed media creation.</p>
  <p>Many projects begin with sketches and hand-drawn ideas.</p>
  <p>Traditional art influences my design process.</p>
  <p>I enjoy combining physical and digital forms of making.</p>
`;
studioCanvas.addEventListener("mouseenter", () => {
  studioCanvasImg.src = canvasHover;
  studioInfoCard.innerHTML = artText;
  studioInfoCard.classList.add("show");
});
studioCanvas.addEventListener("focus", () => {
  studioCanvasImg.src = canvasHover;
  studioInfoCard.innerHTML = artText;
  studioInfoCard.classList.add("show");
});
studioCanvas.addEventListener("mouseleave", () => {
  studioCanvasImg.src = canvasNormal;
  studioInfoCard.classList.remove("show");
});

/* ..... DESIGN PROCESS INTERACTION ..... */
/*
The board reveals my design skills and methods.
I chose to represent design through a workspace object because my
process is based on planning, sketching, and iteration.
*/
const studioBoard = document.querySelector(".studio-board");
const boardImg = document.getElementById("boardImg");

const boardNormal =
  "assets/desk/board.webp";

const boardHover =
  "assets/desk/boardhover.webp";

const designText = `
  <h2>Design Skills</h2>
  <div class="skill-tags">
    <span>UX/UI Design</span>
    <span>Interaction Design</span>
    <span>Branding</span>
    <span>Experience Design</span>
    <span>Visual Storytelling</span>
    <span>Information Architecture</span>
    <span>Design Systems</span>
    <span>Accessibility</span>
  </div>
  <h2>Tools & Methods</h2>
  <div class="skill-tags">
    <span>Wireframing</span>
    <span>Prototyping</span>
    <span>Design Frameworks</span>
    <span>Blueprints</span>
    <span>Human-Centered Design</span>
  </div>
`;

if (studioBoard) {

  studioBoard.addEventListener("mouseenter", () => {

    boardImg.src = boardHover;

    studioInfoCard.innerHTML = designText;

    studioInfoCard.classList.add("show");

  });
  
  studioBoard.addEventListener("focus", () => {

    boardImg.src = boardHover;

    studioInfoCard.innerHTML = designText;

    studioInfoCard.classList.add("show");

  });

  studioBoard.addEventListener("mouseleave", () => {

    boardImg.src = boardNormal;

    studioInfoCard.classList.remove("show");

  });

}

/* ..... CODING AND TECHNOLOGY INTERACTION ..... */
/*
The laptop represents how I combine technical development with
creative design.
The information focuses on using technology as a tool for creativity
rather than separating coding from design.
*/
const studioLaptop = document.querySelector(".studio-laptop");
const laptopImg = document.getElementById("laptopImg");

const laptopNormal = "assets/desk/laptop.webp";
const laptopHover = "assets/desk/laptophover.webp";

const laptopText = `
  <h2>Code & Human-AI Interaction</h2>

  <div class="skill-tags">
    <span>HTML</span>
    <span>CSS</span>
    <span>JavaScript</span>
    <span>Java</span>
    <span>Processing</span>
    <span>Firebase</span>
    <span>Python</span>
  </div>

  <h3>My Approach</h3>

  <p>
    I enjoy both coding and design.
  </p>

  <p>
    Interested in Human-AI Interaction and
    how emerging technologies can support
    creativity and problem solving.
  </p>

  <p>
    I use AI to enhance workflows,
    not replace thinking.
  </p>

  <p>
    Technology should support creativity
    rather than replace it.
  </p>
`;

studioLaptop.addEventListener("mouseenter", () => {

  laptopImg.src = laptopHover;

  studioInfoCard.innerHTML = laptopText;


  studioInfoCard.classList.add("show");

});

studioLaptop.addEventListener("focus", () => {

  laptopImg.src = laptopHover;

  studioInfoCard.innerHTML = laptopText;

  studioInfoCard.classList.add("show");

});
studioLaptop.addEventListener("mouseleave", () => {

  laptopImg.src = laptopNormal;

  studioInfoCard.classList.remove("show");

});

/* educaytion hover */
const studioEducation =
  document.querySelector(".studio-education");

const educationImg =
  document.getElementById("educationImg");

const educationNormal =
  "assets/desk/education.webp";

const educationHover =
  "assets/desk/educationhover.webp";

const educationText = `
  <h2>Education</h2>

  <p>
    Currently pursuing a Bachelor of Science
    in Interactive Arts & Technology at
    Simon Fraser University.
  </p>

  <div class="skill-tags">
    <span>Expected Graduation: June 2027</span>
    <span>GPA: 3.8</span>
  </div>

  <h3>Concentrations</h3>

  <div class="skill-tags">
    <span>AI & Data Science</span>
    <span>Web & Mobile Development</span>
  </div>

  <h3>Recognition</h3>

  <div class="skill-tags">
    <span>Dean's Honour Roll ×4</span>
    <span>President's Honour Roll</span>
  </div>
`;

studioEducation.addEventListener("mouseenter", () => {

  educationImg.src = educationHover;

  studioInfoCard.innerHTML = educationText;


  studioInfoCard.classList.add("show");

});

studioEducation.addEventListener("focus", () => {

  educationImg.src = educationHover;

  studioInfoCard.innerHTML = educationText;


  studioInfoCard.classList.add("show");

});

studioEducation.addEventListener("mouseleave", () => {

  educationImg.src = educationNormal;

  studioInfoCard.classList.remove("show");

});

/*chair*/
const studioChair = document.querySelector(".studio-chair");
const chairImg = document.getElementById("chairImg");

const chairNormal = "assets/desk/chair.webp";
const chairHover = "assets/desk/chairhover.webp";

const careerText = `
  <h2>Career Interests</h2>

  <div class="skill-tags">
    <span>Interaction Designer</span>
    <span>UX/UI Designer</span>
    <span>Product Designer</span>
    <span>Creative Technologist</span>
    <span>Human-AI Interaction Designer</span>
    <span>Experience Designer</span>
    <span>Web Designer</span>
    <span>Front-End / Back-End Developer</span>
  </div>

  <h3>What Interests Me</h3>

  <p>
    Bridging design and development to create
    meaningful user experiences.
  </p>

  <p>
    Combining creativity, technology,
    and human-centered thinking.
  </p>
`;

studioChair.addEventListener("mouseenter", () => {

  chairImg.src = chairHover;

  studioInfoCard.innerHTML = careerText;


  studioInfoCard.classList.add("show");

});

studioChair.addEventListener("focus", () => {

  chairImg.src = chairHover;

  studioInfoCard.innerHTML = careerText;


  studioInfoCard.classList.add("show");

});

studioChair.addEventListener("mouseleave", () => {

  chairImg.src = chairNormal;

  studioInfoCard.classList.remove("show");

});

/* ..... MOBILE INTERACTION SUPPORT ..... */
/*
Originally, these interactions relied mainly on hover because they
were designed for desktop.
I added click interactions so mobile users can still explore the
studio objects without needing a hover state.
*/
const studioObjects = [
  {
    button: studioCanvas,
    img: studioCanvasImg,
    normal: canvasNormal,
    hover: canvasHover,
    text: artText
  },

  {
    button: studioBoard,
    img: boardImg,
    normal: boardNormal,
    hover: boardHover,
    text: designText
  },

  {
    button: studioLaptop,
    img: laptopImg,
    normal: laptopNormal,
    hover: laptopHover,
    text: laptopText
  },

  {
    button: studioEducation,
    img: educationImg,
    normal: educationNormal,
    hover: educationHover,
    text: educationText
  },

  {
    button: studioChair,
    img: chairImg,
    normal: chairNormal,
    hover: chairHover,
    text: careerText
  }
];


let activeObject = null;


studioObjects.forEach((object) => {


  object.button.addEventListener("click", (event) => {

    event.stopPropagation();


    if (activeObject === object) {

      object.img.src = object.normal;

      studioInfoCard.classList.remove("show");

      activeObject = null;

      return;
    }


    if (activeObject) {

      activeObject.img.src =
        activeObject.normal;
    }


    object.img.src = object.hover;

    studioInfoCard.innerHTML =
      object.text;


    studioInfoCard.classList.add("show");


    activeObject = object;

  });

});



document.addEventListener("click", (event) => {


  if (
    !event.target.closest(".desk-group") &&
    !event.target.closest(".studio-info-card")
  ) {

    if (activeObject) {

      activeObject.img.src =
        activeObject.normal;

    }


    studioInfoCard.classList.remove("show");

    activeObject = null;

  }

});

/* ..... TRANSITION FROM STUDIO TO PROJECT EXHIBITION ..... */
/*
This controls the movement from my personal workspace into the
project exhibition.
I created this transition because I wanted the portfolio to feel
like a continuous experience instead of separate webpage sections.
The desk moves away while the project sign appears guiding users
toward my work.
*/
const studioSection = document.querySelector(".studio-section");
const studioDesk = document.querySelector(".desk-group");
const studioDirection = document.querySelector(".studio-direction");
const studioFeatured = document.querySelector(".studio-featured");

function updateStudioTransition() {
  if (!studioSection || !studioDesk || !studioDirection) return;

  const rect = studioSection.getBoundingClientRect();

  const scrollable =
    studioSection.offsetHeight - window.innerHeight;

  const scrolled = Math.min(
    Math.max(-rect.top, 0),
    scrollable
  );

  const progress =
    scrollable > 0
      ? scrolled / scrollable
      : 0;

  /*
  The transition starts later in the scroll because users need time
  to explore the studio objects first.
  I intentionally delayed movement so interaction and discovery happen
  before navigation toward projects.
  */
  const transitionStart = .55;

  const movementProgress = Math.min(
    Math.max(
      (progress - transitionStart) /
      (1 - transitionStart),
      0
    ),
    1
  );

  /* Move the entire desk scene toward the left */
  /*How I moved the desk to the left?
  I moved the desk using a combination of CSS variables and JavaScript 
  scroll calculations. In the CSS, I created a movable position using 
  transform with a custom variable called --studio-desk-shift. Instead 
  of setting a fixed position, I allowed JavaScript to control how far 
  the desk moves. As the user scrolls through the studio section, JavaScript 
  calculates the scroll progress and changes the value of this variable. The 
  desk starts in its original position, then gradually shifts left as the user 
  reaches the transition area. I chose this approach because I wanted the 
  movement to feel connected to the user's scrolling rather than having a 
  separate animation that plays automatically. */
  const deskShift = movementProgress * -60;

  /* Bring the direction stand in from the right */
  /*How I brought the direction stand into the scene?
  The direction stand uses the same idea as the desk movement.
  In CSS, I prepared the stand to be positioned outside the screen 
  using a transform controlled by the --studio-sign-shift variable. 
  JavaScript then updates this value based on the user's scrolling progress.
  At the beginning of the section, the sign is pushed to the right and 
  hidden from the main composition. As the user continues scrolling, 
  the value decreases and the sign smoothly moves into its final position. 
  I designed it this way because I wanted the transition from the creative 
  studio to the projects exhibition to feel like a physical space changing, 
  similar to moving through an art gallery. */
  const signShift = (1 - movementProgress) * 20;

  studioDesk.style.setProperty(
    "--studio-desk-shift",
    `${deskShift}vw`
  );

  studioDirection.style.setProperty(
    "--studio-sign-shift",
    `${signShift}vw`
  );

  studioDirection.style.opacity =
    Math.min(movementProgress * 1.6, 1);
  studioDirection.classList.toggle(
    "show",
    movementProgress > .05
  );

  if (studioFeatured) {

    studioFeatured.classList.toggle(
      "show",
      movementProgress > .45
    );

  }

  /*
    Hide any open information card once the horizontal
    transition begins.
  */
  if (movementProgress > .08) {
    studioInfoCard.classList.remove("show");
  }
}

window.addEventListener("scroll", updateStudioTransition, {
  passive: true
});

window.addEventListener("resize", updateStudioTransition);

updateStudioTransition();
