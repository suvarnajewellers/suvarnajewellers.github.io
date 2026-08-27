/* ==========================================
   SUVARNA JEWELLERS V9
   COLLECTIONS.JS
   GLOBAL COLLECTION SEARCH
========================================== */

document.addEventListener("DOMContentLoaded", initCollectionPage);

let allCollectionProducts = [];
let currentCategory = "";


/* ==========================================
   INIT
========================================== */

async function initCollectionPage() {

    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    currentCategory = (grid.dataset.category || "").trim();

    try {

        /*
         * IMPORTANT:
         * Load ALL products first.
         * Do NOT use getProductsByCategory() here,
         * otherwise global search cannot find products
         * from other categories.
         */

        allCollectionProducts = await getProducts();

        if (!Array.isArray(allCollectionProducts)) {
            allCollectionProducts = [];
        }

        initCollectionSearch();

        renderCollection();

    } catch (error) {

        console.error("Collections Error:", error);

        grid.innerHTML = `
            <div class="collection-empty">
                <h3>Unable to load products</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}


/* ==========================================
   SEARCH
========================================== */

function initCollectionSearch() {

    const searchInput =
        document.querySelector(".premium-search");

    if (!searchInput) {
        console.warn("Collection search input not found.");
        return;
    }

    let searchTimer = null;

    searchInput.addEventListener("input", function () {

        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {

            renderCollection();

        }, 100);

    });


    /* ESC = Clear Search */

    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            searchInput.value = "";

            renderCollection();

            searchInput.blur();
        }

    });
}


/* ==========================================
   MAIN FILTER
========================================== */

function renderCollection() {

    const grid = document.getElementById("productsGrid");

    if (!grid) return;


    const searchInput =
        document.querySelector(".premium-search");

    const searchTerm =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    /*
     * STEP 1
     * Filter by current collection/category.
     */

    let filteredProducts;

if (searchTerm) {

    /*
     * SEARCH ACTIVE:
     * Search ALL categories.
     */

    filteredProducts = allCollectionProducts.filter(product => {

        const searchableText = [
            product.id,
            product.name,
            product.category,
            product.metal,
            product.description,
            product.size,
            product.grossWeight,
            product.netWeight
        ]
        .filter(value =>
            value !== undefined &&
            value !== null
        )
        .join(" ")
        .toLowerCase();

        return searchableText.includes(searchTerm);

    });

} else {

    /*
     * NO SEARCH:
     * Show only this collection.
     */

    filteredProducts = allCollectionProducts.filter(product => {

        return normalize(product.category) ===
               normalize(currentCategory);

    });

}


    /*
     * STEP 2
     * Search inside the CURRENT collection.
     *
     * If the user searches "માળા", every product
     * in the collection containing that word in
     * any relevant field will be returned.
     */

    if (searchTerm) {

        filteredProducts = filteredProducts.filter(product => {

            const searchableText = [

                product.id,
                product.name,
                product.category,
                product.metal,
                product.description,
                product.size,
                product.grossWeight,
                product.netWeight

            ]
            .filter(value =>
                value !== undefined &&
                value !== null
            )
            .join(" ")
            .toLowerCase();


            return searchableText.includes(searchTerm);

        });

    }


    renderCollectionProducts(filteredProducts);

}


/* ==========================================
   RENDER PRODUCT CARDS
========================================== */

function renderCollectionProducts(products) {

    const grid = document.getElementById("productsGrid");

    if (!grid) return;


    if (!products.length) {

        grid.innerHTML = `
            <div class="collection-empty">
                <h3>No Products Found</h3>
                <p>Try another product name or category.</p>
            </div>
        `;

        updateCollectionCount(0);

        return;
    }


    grid.innerHTML = products.map(product => {

        const productId =
            encodeURIComponent(product.id || "");

        const productName =
            escapeHTML(product.name || "Jewellery");

        const productCategory =
            escapeHTML(product.category || "");

        const image =
            getImage(product.image);


        return `
            <a
                href="../product.html?id=${productId}&source=collections"
                class="collection-link"
                data-product-id="${productId}">

                <div class="collection-card">

                    <img
                        src="${image}"
                        alt="${productName}"
                        loading="lazy"
                        decoding="async">

                    <div class="collection-overlay">

                        <div>

                            <span>
                                ${productCategory}
                            </span>

                            <h3>
                                ${productName}
                            </h3>

                        </div>

                    </div>

                </div>

            </a>
        `;

    }).join("");


    updateCollectionCount(products.length);
}


/* ==========================================
   NORMALIZE CATEGORY
========================================== */

function normalize(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}


/* ==========================================
   PRODUCT COUNT
========================================== */

function updateCollectionCount(count) {

    const countElement =
        document.querySelector(".product-count strong");

    if (countElement) {

        countElement.textContent = count;

    }

}


/* ==========================================
   SAFE HTML
========================================== */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
