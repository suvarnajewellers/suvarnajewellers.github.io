/* =====================================
   SUVARNA JEWELLERS V2.0
   Luxury Intro
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const intro = document.getElementById("luxury-intro");

    // જો intro નથી તો કંઈ કરવાનું નથી
    if (!intro) return;

    // Homepage scroll lock
    document.body.style.overflow = "hidden";

    // 2.5 સેકન્ડ પછી intro hide
    setTimeout(() => {

        intro.classList.add("hide");

        document.body.style.overflow = "";

        // Animation પૂરી થયા પછી remove
        setTimeout(() => {
            intro.remove();
        }, 800);

    }, 2500);

});
