/* =====================================
   SUVARNA JEWELLERS V2.0
   Luxury Intro
===================================== */

window.addEventListener("load", () => {

    const intro = document.getElementById("luxury-intro");

    if (!intro) return;

    document.body.style.overflow = "hidden";

    // Logo અને બધી files load થયા પછી 2 સેકન્ડ બતાવો
    setTimeout(() => {

        intro.classList.add("hide");

        setTimeout(() => {

            intro.remove();
            document.body.style.overflow = "";

        }, 800);

    }, 2000);

});
