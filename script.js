document.addEventListener("DOMContentLoaded", function () {


    // ===== Image Popup Gallery =====

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



    // ===== Product Thumbnail Gallery =====

    const mainImage = document.getElementById("main-image");
    const thumbnails = document.querySelectorAll(".thumb");


    thumbnails.forEach((thumb) => {

        thumb.addEventListener("click", function () {

            if(mainImage){
                mainImage.src = this.src;
            }

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


        if(!product){
            console.log("Product not found");
            return;
        }



        const productName = document.getElementById("product-name");
        const productCategory = document.getElementById("product-category");
        const breadcrumbCategory = document.getElementById("breadcrumb-category");
        const productCode = document.getElementById("product-code");
        const productMetal = document.getElementById("product-metal");
        const productGross = document.getElementById("product-gross");
        const productNet = document.getElementById("product-net");
        const productSize = document.getElementById("product-size");
        const productDescription = document.getElementById("product-description");
        const mainImg = document.getElementById("main-image");



        let categoryName = "";


        if(product.category === "gold"){
            categoryName = "Gold Jewellery";
        }

        else if(product.category === "silver"){
            categoryName = "Silver Jewellery";
        }

        else if(product.category === "rudraksha-mala"){
            categoryName = "Rudraksha Mala";
        }

        else if(product.category === "pendants"){
            categoryName = "Pendant Collection";
        }

        else if(product.category === "bracelets"){
            categoryName = "Bracelet Collection";
        }



        if(productName) productName.textContent = product.name;

        if(productCategory) productCategory.textContent = categoryName;

        if(breadcrumbCategory) breadcrumbCategory.textContent = categoryName;

        if(productCode) productCode.textContent = product.id;

        if(productMetal) productMetal.textContent = product.metal;

        if(productGross) productGross.textContent = product.grossWeight;

        if(productNet) productNet.textContent = product.netWeight;

        if(productSize) productSize.textContent = product.size;

        if(productDescription) productDescription.textContent = product.description;

        if(mainImg) mainImg.src = product.image;

        // ===== WhatsApp Enquiry =====

const whatsappBtn = document.getElementById("whatsapp-btn");

if (whatsappBtn) {

    const phone = "917777991118";

    const message =
`Hello SUVARNA JEWELLERS,

I am interested in this product.

Product Name: ${product.name}
Product Code: ${product.id}
Metal: ${product.metal}
Gross Weight: ${product.grossWeight}
Net Weight: ${product.netWeight}

Please share more details.`;

    whatsappBtn.href =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    }



    });



    // ===== Dynamic Collection Loader =====


    const productGrid = document.getElementById("product-grid");


    if(productGrid){


        fetch("products.json")

        .then(response => response.json())

        .then(products => {


            const page = window.location.pathname;


            let currentCategory = "";



            if(page.includes("gold-jewellery")){
                currentCategory = "gold";
            }


            else if(page.includes("silver-jewellery")){
                currentCategory = "silver";
            }


            else if(page.includes("rudraksha-mala")){
                currentCategory = "rudraksha-mala";
            }


            else if(page.includes("pendant")){
                currentCategory = "pendants";
            }


            else if(page.includes("bracelet")){
                currentCategory = "bracelets";
            }



            const filteredProducts = products.filter(product =>
                product.category === currentCategory
            );



            filteredProducts.forEach(product => {


                productGrid.innerHTML += `

                <div class="card">


                    <a href="product.html?id=${product.id}">

                        <img 
                        src="${product.image}" 
                        alt="${product.name}" 
                        class="gallery-img">

                    </a>


                    <h3>${product.name}</h3>


                </div>

                `;


            });



        });


    }


});
// Scroll To Top

const scrollBtn = document.getElementById("scrollTopBtn");

window.onscroll = function () {

    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }

};

scrollBtn.onclick = function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if(menuToggle && navLinks){

    menuToggle.addEventListener("click", function(){

        navLinks.classList.toggle("active");

    });

}
