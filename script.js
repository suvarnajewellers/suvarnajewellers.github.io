document.addEventListener("DOMContentLoaded", function () {

    const images = document.querySelectorAll(".gallery img");

    images.forEach(img => {
        img.addEventListener("click", function () {
            alert("Full Screen Gallery આગળના સ્ટેપમાં ઉમેરશું.");
        });
    });

});
// Full Screen Gallery

document.addEventListener("DOMContentLoaded", function(){

const galleryImages = document.querySelectorAll(".gallery-img");

galleryImages.forEach(img => {

    img.onclick = function(){

        let popup = document.createElement("div");

        popup.className = "image-popup";

        popup.innerHTML = `
            <span class="close-popup">&times;</span>
            <img src="${this.src}" class="popup-image">
        `;

        document.body.appendChild(popup);

        popup.querySelector(".close-popup").onclick = function(){
            popup.remove();
        };

    };

});

});

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
