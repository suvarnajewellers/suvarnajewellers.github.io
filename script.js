document.addEventListener("DOMContentLoaded", function () {

    const images = document.querySelectorAll(".gallery img");

    images.forEach(img => {
        img.addEventListener("click", function () {
            alert("Full Screen Gallery આગળના સ્ટેપમાં ઉમેરશું.");
        });
    });

});
// Full Screen Gallery

const galleryImages = document.querySelectorAll(".gallery-img");

galleryImages.forEach(image => {

    image.addEventListener("click", function(){

        const popup = document.createElement("div");

        popup.className = "image-popup";

        popup.innerHTML = `
            <span class="close-popup">&times;</span>
            <img src="${this.src}">
        `;

        document.body.appendChild(popup);

        document.querySelector(".close-popup").onclick = function(){
            popup.remove();
        };

    });

});
