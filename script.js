/* =====================================
   SUVARNA JEWELLERS V5
   SCRIPT JS
===================================== */


/* =========================
   MOBILE MENU
========================= */


const menuToggle = document.getElementById("menu-toggle");

const navLinks = document.querySelector(".nav-links");


if(menuToggle && navLinks){


    menuToggle.addEventListener("click", function(){


        navLinks.classList.toggle("active");


    });


}



/* Close Menu After Click */


document.querySelectorAll(".nav-links a")
.forEach(function(link){


    link.addEventListener("click", function(){


        if(navLinks){

            navLinks.classList.remove("active");

        }


    });


});



/* =========================
   SCROLL TOP BUTTON
========================= */


const scrollBtn = document.getElementById("scrollTopBtn");



window.addEventListener("scroll", function(){


    if(window.scrollY > 400){


        if(scrollBtn){

            scrollBtn.style.display="block";

        }


    }

    else{


        if(scrollBtn){

            scrollBtn.style.display="none";

        }


    }


});



if(scrollBtn){


    scrollBtn.addEventListener("click", function(){


        window.scrollTo({

            top:0,

            behavior:"smooth"

        });


    });


}



/* =========================
   SMOOTH ANCHOR SCROLL
========================= */


document.querySelectorAll('a[href^="#"]')
.forEach(function(anchor){


    anchor.addEventListener("click", function(e){


        const target =
        document.querySelector(
        this.getAttribute("href")
        );


        if(target){


            e.preventDefault();


            target.scrollIntoView({

                behavior:"smooth"

            });


        }


    });


});



/* =========================
   YEAR AUTO UPDATE
========================= */


const yearElement =
document.querySelector(".footer-copy");


if(yearElement){


    const year =
    new Date().getFullYear();


    yearElement.innerHTML =
    "© " + year +
    " SUVARNA JEWELLERS. All Rights Reserved.";


}
