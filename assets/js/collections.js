/* ==========================================
   SUVARNA JEWELLERS V9
   COLLECTIONS.JS
   PREMIUM COLLECTION SEARCH + FILTER
========================================== */

document.addEventListener("DOMContentLoaded", initCollectionPage);

let collectionProducts = [];
let collectionCategory = "";

async function initCollectionPage() {

    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    collectionCategory = grid.dataset.category || "";

    if (!collectionCategory) return;

    try {

        collectionProducts = await getProductsByCategory(collectionCategory);

        if (!Array.isArray(collectionProducts)) {
            collectionProducts = [];
        }

        renderCollectionProducts(collectionProducts);
        initCollectionSearch();

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
   RENDER PRODUCTS
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


    /*
       IMPORTANT:
       Use one complete HTML build instead of
       repeated innerHTML +=.
       This prevents unnecessary DOM rebuilding
       and avoids cards appearing to override each other.
    */

    grid.innerHTML = products.map(product => {

        const productId = encodeURIComponent(product.id || "");
        const productName = escapeHTML(product.name || "Jewellery");
        const productCategory = escapeHTML(product.category || "");
        const image = getImage(product.image);

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

                            <span>${productCategory}</span>

                            <h3>${productName}</h3>

                        </div>

                    </div>

                </div>

            </a>
        `;

    }).join("");

    updateCollectionCount(products.length);
}


/* ==========================================
   SEARCH
========================================== */

function initCollectionSearch() {

    /*
       Try the common search selectors used
       across the Suvarna website.
    */

    const searchInput =
        document.querySelector("#productSearch") ||
        document.querySelector("#searchInput") ||
        document.querySelector(".search-input") ||
        document.querySelector('input[type="search"]') ||
        document.querySelector('input[placeholder*="Search"]') ||
        document.querySelector('input[placeholder*="search"]');

    if (!searchInput) {
        console.warn("Collection search input not found.");
        return;
    }


    let searchTimer = null;

    searchInput.addEventListener("input", function () {

        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();

            if (!searchTerm) {

                renderCollectionProducts(collectionProducts);
                return;

            }


            /*
               SEARCH ACROSS ALL IMPORTANT PRODUCT FIELDS.

               A product matches if the entered text
               exists in ANY of these fields.
            */

            const filteredProducts = collectionProducts.filter(product => {

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


            renderCollectionProducts(filteredProducts);

        }, 120);

    });


    /*
       Clear search with Escape
    */

    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            searchInput.value = "";

            renderCollectionProducts(collectionProducts);

            searchInput.blur();

        }

    });

}


/* ==========================================
   PRODUCT COUNT
========================================== */

function updateCollectionCount(count) {

    const countElements = [

        document.getElementById("productCount"),
        document.getElementById("resultsCount"),
        document.querySelector(".product-count"),
        document.querySelector(".count-box")

    ].filter(Boolean);


    countElements.forEach(element => {

        /*
           Do not destroy existing styling/content
           if the element contains more complex markup.
        */

        const numberElement =
            element.querySelector(".count-number") ||
            element.querySelector("strong") ||
            element.querySelector("span");


        if (numberElement) {

            numberElement.textContent = count;

        } else {

            element.textContent = count;

        }

    });

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
