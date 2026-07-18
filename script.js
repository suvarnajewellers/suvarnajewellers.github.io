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
// ===== Dynamic Product Loader =====

fetch("products.json")
.then(response => response.json())
.then(products => {

    const params = new URLSearchParams(window.location.search);

const productId = params.get("id") || "SJ-1001";

const product = products.find(p => p.id === productId);

    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-category").textContent = product.category;
    document.getElementById("product-code").textContent = product.id;
    document.getElementById("product-metal").textContent = product.metal;
    document.getElementById("product-gross").textContent = product.grossWeight;
    document.getElementById("product-net").textContent = product.netWeight;
    document.getElementById("product-size").textContent = product.size;
    document.getElementById("product-description").textContent = product.description;

    document.getElementById("main-image").src = product.image;

});
