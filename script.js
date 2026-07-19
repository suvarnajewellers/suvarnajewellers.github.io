document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // Image Popup Gallery
    // ===============================

    document.addEventListener("click", function (e) {

        if (e.target.classList.contains("gallery-img")) {

            const popup = document.createElement("div");
            popup.className = "image-popup";

            popup.innerHTML = `
                <span class="close-popup">&times;</span>
                <img src="${e.target.src}" class="popup-image">
            `;

            document.body.appendChild(popup);

            popup.addEventListener("click", function (event) {

                if (
                    event.target.classList.contains("close-popup") ||
                    event.target === popup
                ) {
                    popup.remove();
                }

            });

        }

    });


    // ===============================
    // Product Thumbnail Gallery
    // ===============================

    const mainImage = document.getElementById("main-image");
    const thumbnails = document.querySelectorAll(".thumb");

    thumbnails.forEach((thumb) => {

        thumb.addEventListener("click", function () {

            if (mainImage) {
                mainImage.src = this.src;
            }

            thumbnails.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

        });

    });


    // ===============================
    // Product Details Loader
    // ===============================

    fetch("products.json")
        .then(res => res.json())
        .then(products => {

            const productId =
                new URLSearchParams(window.location.search).get("id") || "G001";

            const product = products.find(p => p.id === productId);

            if (!product) return;

            const categoryMap = {
                gold: "Gold Jewellery",
                silver: "Silver Jewellery",
                "rudraksha-mala": "Rudraksha Mala",
                pendants: "Pendant Collection",
                bracelets: "Bracelet Collection",
                "rudraksha-bracelet": "Bracelet Collection",
                "tulsi-mala": "Tulsi Mala"
            };

            document.getElementById("product-name")?.replaceChildren(document.createTextNode(product.name));
            document.getElementById("product-category")?.replaceChildren(document.createTextNode(categoryMap[product.category] || ""));
            document.getElementById("breadcrumb-category")?.replaceChildren(document.createTextNode(categoryMap[product.category] || ""));
            document.getElementById("product-code")?.replaceChildren(document.createTextNode(product.id));
            document.getElementById("product-metal")?.replaceChildren(document.createTextNode(product.metal));
            document.getElementById("product-gross")?.replaceChildren(document.createTextNode(product.grossWeight));
            document.getElementById("product-net")?.replaceChildren(document.createTextNode(product.netWeight));
            document.getElementById("product-size")?.replaceChildren(document.createTextNode(product.size));
            document.getElementById("product-description")?.replaceChildren(document.createTextNode(product.description));

            if (mainImage) {
                mainImage.src = product.image;
            }

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

        })
        .catch(console.error);


    // ===============================
    // Collection Loader
    // ===============================

    const productGrid = document.getElementById("product-grid");

    if (productGrid) {

        fetch("products.json")
            .then(res => res.json())
            .then(products => {

                const page = window.location.pathname;

                let currentCategory = "";

                if (page.includes("gold-jewellery")) currentCategory = "gold";
                else if (page.includes("silver-jewellery")) currentCategory = "silver";
                else if (page.includes("rudraksha-mala")) currentCategory = "rudraksha-mala";
                else if (page.includes("pendant")) currentCategory = "pendants";
                else if (page.includes("bracelet")) currentCategory = "rudraksha-bracelet";

                productGrid.innerHTML = "";

                products
                    .filter(p => p.category === currentCategory)
                    .forEach(product => {

                        productGrid.innerHTML += `
                        <div class="card">
                            <a href="product.html?id=${product.id}">
                                <img src="${product.image}" alt="${product.name}" class="gallery-img">
                            </a>
                            <h3>${product.name}</h3>
                        </div>
                        `;

                    });

            })
            .catch(console.error);

    }


    // ===============================
    // Mobile Menu
    // ===============================

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });

        document.addEventListener("click", function (e) {

            if (
                !menuToggle.contains(e.target) &&
                !navLinks.contains(e.target)
            ) {
                navLinks.classList.remove("active");
            }

        });

    }


    // ===============================
    // Scroll To Top
    // ===============================

    const scrollBtn = document.getElementById("scrollTopBtn");

    if (scrollBtn) {

        window.addEventListener("scroll", function () {

            scrollBtn.style.display =
                window.scrollY > 300 ? "block" : "none";

        });

        scrollBtn.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }

});
