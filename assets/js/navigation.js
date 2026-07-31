/* ==========================================
   SUVARNA JEWELLERS V8
   NAVIGATION.JS
========================================== */

import { Utils } from "./utilities.js";

export function initNavigation() {

    initMobileMenu();
    initStickyNavbar();
    highlightActiveLink();
    initSmoothScroll();

}

/* ==========================================
   MOBILE MENU
========================================== */

function initMobileMenu() {

    const toggle = Utils.id("menu-toggle");
    const nav = Utils.select(".nav-links");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {

        nav.classList.toggle("active");
        toggle.classList.toggle("active");

    });

    Utils.all(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("active");
            toggle.classList.remove("active");

        });

    });

}

/* ==========================================
   STICKY NAVBAR
========================================== */

function initStickyNavbar() {

    const navbar = Utils.select(".navbar");

    if (!navbar) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 30) {
            navbar.classList.add("nav-scrolled");
        } else {
            navbar.classList.remove("nav-scrolled");
        }

    });

}

/* ==========================================
   ACTIVE LINK
========================================== */

function highlightActiveLink() {

    const currentPage = window.location.pathname.split("/").pop();

    Utils.all(".nav-links a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage || (currentPage === "" && href === "index.html")) {
            link.classList.add("active");
        }

    });

}

/* ==========================================
   SMOOTH SCROLL
========================================== */

function initSmoothScroll() {

    Utils.all('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (event) {

            const target = document.querySelector(
                this.getAttribute("href")
            );

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

    }
