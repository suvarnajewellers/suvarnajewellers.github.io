/* ==========================================
   SUVARNA JEWELLERS V8
   MAIN.JS
========================================== */


/* ==========================
   DOM READY
========================== */

document.addEventListener(
"DOMContentLoaded",
function(){

console.log("MAIN.JS LOADED");
    initLoader();


    initHeader();


    initMobileMenu();


    initScrollTop();


    initScrollProgress();


});



/* ==========================
   LOADER
========================== */

function initLoader(){


    window.addEventListener(
        "load",
        function(){

            hideLoader();

        }
    );


}



/* ==========================
   HEADER SCROLL
========================== */

function initHeader(){


    const header =
    document.querySelector(
        ".header"
    );


    if(!header) return;



    window.addEventListener(
    "scroll",
    function(){


        if(window.scrollY > 50){

            header.classList.add(
                "scrolled"
            );

        }

        else{

            header.classList.remove(
                "scrolled"
            );

        }


    });


}



/* ==========================
   MOBILE MENU
========================== */
function initMobileMenu(){

    const button =
    document.getElementById("menuToggle");

    const nav =
    document.getElementById("navbar");

    if(!button || !nav) return;

    button.addEventListener("click", function(){

        nav.classList.toggle("active");

    });

    nav.querySelectorAll("a").forEach(function(link){

        link.addEventListener("click", function(){

            nav.classList.remove("active");

        });

    });

}
/* ==========================
   SCROLL PROGRESS
========================== */

function initScrollProgress(){


    const bar =
    document.getElementById(
        "scrollProgress"
    );


    if(!bar) return;



    window.addEventListener(
    "scroll",
    function(){


        const scrollTop =
        document.documentElement.scrollTop;


        const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;


        const progress =
        (scrollTop / height) * 100;



        bar.style.width =
        progress + "%";


    });


}



/* ==========================
   BACK TO TOP
========================== */

function initScrollTop(){

    const button = document.getElementById("backToTop");

    if(!button) return;

    window.addEventListener("scroll", function(){

        if(window.scrollY > 400){
            button.classList.add("show");
        }else{
            button.classList.remove("show");
        }

    });


    button.addEventListener("click", function(e){

        e.preventDefault();
        e.stopPropagation();

        console.log("BACK TOP CLICKED");

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    });

}
