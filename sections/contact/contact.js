/* CONTACT SECTION -------------------------------------------- */


document.addEventListener("DOMContentLoaded", () => {


    const contactSection = document.querySelector(".contact-section");

    const contactItems = document.querySelectorAll(".contact-link");

    const currentWork = document.querySelector(".current-work");



    // Reveal section -----------------------------------------


    if (contactSection) {

        contactSection.classList.add("contact-loaded");

    }




    // Stagger contact links ----------------------------------


    contactItems.forEach((item, index) => {


        item.style.transitionDelay = `${index * 0.08}s`;


    });





    // Artwork slight movement --------------------------------


    if (currentWork) {


        const image = currentWork.querySelector(".current-work-image");



        if (image) {


            currentWork.addEventListener("mouseenter", () => {


                image.style.transform =
                    "rotate(1deg) translateY(-8px)";


            });



            currentWork.addEventListener("mouseleave", () => {


                image.style.transform =
                    "rotate(-2deg)";


            });


        }


    }



});