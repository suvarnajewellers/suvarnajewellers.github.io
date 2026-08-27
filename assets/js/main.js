/* ==========================================
   SUVARNA JEWELLERS V10
   MAIN.JS
   FINAL STABLE VERSION
========================================== */


/* ==========================
   DOM READY
========================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("SUVARNA MAIN.JS LOADED");

    initLoader();
    initHeader();
    initMobileMenu();
    initScrollTop();
    initScrollProgress();

});


/* ==========================
   LOADER
========================== */

function initLoader() {

    window.addEventListener("load", function () {

        hideLoader();

    });

}


/* ==========================
   HEADER SCROLL
========================== */

function initHeader() {

    const header = document.querySelector(".header");

    if (!header) return;

    function updateHeader() {

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();

}


/* ==========================
   MOBILE MENU
   SINGLE UNIVERSAL CONTROLLER
========================== */

function initMobileMenu() {

    const button = document.getElementById("menuToggle");
    const nav = document.getElementById("navbar");

    if (!button || !nav) {

        console.warn(
            "Mobile menu elements not found:",
            {
                menuToggle: !!button,
                navbar: !!nav
            }
        );

        return;

    }


    /* Prevent duplicate initialization */

    if (button.dataset.menuInitialized === "true") {

        return;

    }

    button.dataset.menuInitialized = "true";


    /* --------------------------------------
       INITIAL STATE
    -------------------------------------- */

    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "navbar");


    function closeMenu() {

        nav.classList.remove("active");
        nav.classList.remove("open");

        button.classList.remove("active");

        button.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    function openMenu() {

        nav.classList.add("active");

        button.classList.add("active");

        button.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    function toggleMenu(event) {

        if (event) {

            event.preventDefault();

        }

        const isOpen =
            nav.classList.contains("active") ||
            nav.classList.contains("open");


        if (isOpen) {

            closeMenu();

        } else {

            openMenu();

        }

    }


    /* --------------------------------------
       MENU BUTTON
    -------------------------------------- */

    button.addEventListener(
        "click",
        toggleMenu
    );


    /* --------------------------------------
       NAVIGATION LINKS
       Close after selecting a page
    -------------------------------------- */

    nav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                closeMenu();

            }
        );

    });


    /* --------------------------------------
       ESCAPE KEY
    -------------------------------------- */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );


    /* --------------------------------------
       CLICK OUTSIDE MENU
    -------------------------------------- */

    document.addEventListener(
        "click",
        function (event) {

            const isOpen =
                nav.classList.contains("active") ||
                nav.classList.contains("open");


            if (!isOpen) return;


            if (
                !nav.contains(event.target) &&
                !button.contains(event.target)
            ) {

                closeMenu();

            }

        }
    );


    /* --------------------------------------
       RESIZE CLEANUP
    -------------------------------------- */

    window.addEventListener(
        "resize",
        function () {

            /*
             * Desktop breakpoint cleanup.
             * CSS remains responsible for
             * actual responsive display.
             */

            if (window.innerWidth > 900) {

                closeMenu();

            }

        },
        {
            passive: true
        }
    );

}


/* ==========================
   SCROLL PROGRESS
========================== */

function initScrollProgress() {

    const bar =
        document.getElementById(
            "scrollProgress"
        );

    if (!bar) return;


    function updateProgress() {

        const scrollTop =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            0;


        const documentHeight =
            document.documentElement.scrollHeight;


        const viewportHeight =
            document.documentElement.clientHeight;


        const scrollableHeight =
            documentHeight -
            viewportHeight;


        if (scrollableHeight <= 0) {

            bar.style.width = "0%";

            return;

        }


        const progress =
            (scrollTop / scrollableHeight) * 100;


        bar.style.width =
            Math.min(
                100,
                Math.max(
                    0,
                    progress
                )
            ) + "%";

    }


    window.addEventListener(
        "scroll",
        updateProgress,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        updateProgress,
        {
            passive: true
        }
    );


    updateProgress();

}


/* ==========================
   BACK TO TOP
========================== */

function initScrollTop() {

    const button =
        document.querySelector(
            ".back-to-top"
        );

    if (!button) return;


    function toggleButton() {

        if (window.scrollY > 300) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    }


    window.addEventListener(
        "scroll",
        toggleButton,
        {
            passive: true
        }
    );


    toggleButton();


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}
