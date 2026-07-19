document.addEventListener("DOMContentLoaded", function () {

document.addEventListener("click", function(e){

    if(e.target.classList.contains("gallery-img")){

        const popup = document.createElement("div");
        popup.className = "image-popup";

        popup.innerHTML = `
            <span class="close-popup">&times;</span>
            <img src="${e.target.src}" class="popup-image">
        `;

        document.body.appendChild(popup);

        popup.addEventListener("click", function(event){

            if(
                event.target.classList.contains("close-popup") ||
                event.target === popup
            ){
                popup.remove();
            }

        });

    }

});

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

const productId = params.get("id") || "G001";

const product = products.find(p => p.id === productId);

    document.getElementById("product-name").textContent = product.name;
    let categoryName = "";

if (product.category === "gold") {
    categoryName = "Gold Jewellery";
} else if (product.category === "silver") {
    categoryName = "Silver Jewellery";
} else if (product.category === "rudraksha-mala") {
    categoryName = "Rudraksha Mala";
} else if (product.category === "pendants") {
    categoryName = "Pendant Collection";
} else if (product.category === "bracelets") {
    categoryName = "Bracelet Collection";
}

document.getElementById("product-category").textContent = categoryName;
    document.getElementById("breadcrumb-category").textContent = categoryName;
    document.getElementById("product-code").textContent = product.id;
    document.getElementById("product-metal").textContent = product.metal;
    document.getElementById("product-gross").textContent = product.grossWeight;
    document.getElementById("product-net").textContent = product.netWeight;
    document.getElementById("product-size").textContent = product.size;
    document.getElementById("product-description").textContent = product.description;

    document.getElementById("main-image").src = product.image;

});
// ===== Dynamic Collection Loader =====

const productGrid = document.getElementById("product-grid");

if (productGrid) {

    fetch("products.json")
    .then(response => response.json())
    .then(products => {

        const page = window.location.pathname;

        let currentCategory = "";

        if (page.includes("gold-jewellery")) {
            currentCategory = "gold";
        }

        if (page.includes("silver-jewellery")) {
            currentCategory = "silver";
        }

        if (page.includes("rudraksha-mala")) {
            currentCategory = "rudraksha-mala";
        }

        if (page.includes("pendant")) {
            currentCategory = "pendants";
        }

        if (page.includes("bracelet")) {
            currentCategory = "bracelets";
        }

        const filteredProducts = products.filter(product =>
            product.category === currentCategory
        );

        filteredProducts.forEach(product => {

            productGrid.innerHTML += `

            <div class="card">

                <a href="product.html?id=${product.id}">

                    <img src="${product.image}" alt="${product.name}" class="gallery-img">

                </a>

                <h3>${product.name}</h3>

            </div>

            `;

        });

    });

}
