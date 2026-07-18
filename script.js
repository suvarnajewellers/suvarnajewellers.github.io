document.addEventListener("DOMContentLoaded", function () {

    const galleryImages = document.querySelectorAll(".gallery-img");

    galleryImages.forEach(function(img){

        img.addEventListener("click", function(){

            const popup = document.createElement("div");
            popup.className = "image-popup";

            popup.innerHTML = `
                <span class="close-popup">&times;</span>
                <img src="${this.src}" class="popup-image" alt="">
            `;

            document.body.appendChild(popup);

            popup.addEventListener("click", function(e){

                if(
                    e.target.classList.contains("close-popup") ||
                    e.target === popup
                ){
                    popup.remove();
                }

            });

        });

    });

});
// ===== Product Thumbnail Gallery =====

const mainImage = document.getElementById("main-image");
const thumbnails = document.querySelectorAll(".thumb");

thumbnails.forEach((thumb) => {

    thumb.addEventListener("click", function () {

        mainImage.src = this.src;

        thumbnails.forEach(t => t.classList.remove("active"));

        this.classList.add("active");

    });

});
