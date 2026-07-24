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

    // 2 સેકન્ડ સુધી logo દેખાડો
setTimeout(() => {

    intro.classList.add("hide");

    document.body.style.overflow = "";

    setTimeout(() => {
        intro.remove();
    }, 800);

}, 2000);

});
