/*
This file controls the small interactions inside the contact section.
The JavaScript is intentionally lightweight because the main focus
of this page is the layout and visual presentation.
It handles loading behaviour, contact link timing, and the small
movement interaction for the artwork.
*/

/*.....CONTACT SECTION..... */

document.addEventListener("DOMContentLoaded", () => {


    const contactSection = document.querySelector(".contact-section");

    const contactItems = document.querySelectorAll(".contact-link");

    const currentWork = document.querySelector(".current-work");

    /* ..... CONTACT SECTION INITIALIZATION ..... */
    /*
    This prepares the contact section once the page loads.
    I kept this separate from the HTML so future animation or loading
    changes can be added without changing the structure.
    */
    if (contactSection) {

        contactSection.classList.add("contact-loaded");

    }

    /* ..... CONTACT LINK TIMING ..... */
    /*
    The delay creates a small sequence when the contact items appear.
    I added this to make the section feel more intentional instead of
    having every element appear at the exact same moment.
    */
    contactItems.forEach((item, index) => {


        item.style.transitionDelay = `${index * 0.08}s`;


    });

    /* ..... CURRENT WORK ART INTERACTION ..... */
    /*
    This controls the small movement of the artwork when users hover.
    I added this interaction to continue the physical and handmade feeling
    used throughout the portfolio while keeping the movement subtle.

    Originally, I used JavaScript to control the artwork movement, but I 
    later moved more visual hover effects into CSS because CSS is better suited 
    for presentation-based interactions.
    */
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