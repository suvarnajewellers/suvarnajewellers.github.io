/* ==========================================
   SUVARNA JEWELLERS
   COLLECTIONS.JS — FINAL SEARCH FIX
========================================== */

document.addEventListener("DOMContentLoaded", initCollectionPage);


async function initCollectionPage() {

    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    const category = grid.dataset.category || "";

    /* ------------------------------------------
       LOAD ALL PRODUCTS
       IMPORTANT:
       Search must work across ALL collections
    ------------------------------------------ */

    const allProducts = await getProducts();

    let visibleProducts = category
        ? allProducts.filter(product =>
            String(product.category || "").toLowerCase() ===
            String(category).toLowerCase()
        )
        : allProducts;


    /* ------------------------------------------
       RENDER PRODUCTS
    ------------------------------------------ */

    function renderProducts(products) {

        grid.innerHTML = "";

        if (!products.length) {

            grid.innerHTML = `
                <div class="no-result">
                    No jewellery found.
                </div>
            `;

            return;
        }


        products.forEach(product => {

            grid.innerHTML += `

                <a
                    href="../product.html?id=${encodeURIComponent(product.id)}&source=collections"
                    class="collection-link"
                >

                    <div class="collection-card">

                        <img
                            src="${getImage(product.image)}"
                            alt="${product.name || "Suvarna Jewellers Jewellery"}"
                            loading="lazy"
                            decoding="async"
                        >

                        <div class="collection-overlay">

                            <div>

                                <span>
                                    ${product.category || ""}
                                </span>

                                <h3>
                                    ${product.name || ""}
                                </h3>

                            </div>

                        </div>

                    </div>

                </a>

            `;

        });

    }


    /* ------------------------------------------
       INITIAL COLLECTION
    ------------------------------------------ */

    renderProducts(visibleProducts);


    /* ------------------------------------------
       COLLECTION SEARCH
       SEARCHES ALL PRODUCTS
       NOT ONLY CURRENT CATEGORY
    ------------------------------------------ */

    const searchInput =
        document.getElementById("searchInput");


    if (!searchInput) return;


    searchInput.addEventListener("input", function () {

        const keyword =
            this.value.trim().toLowerCase();


        /* Empty search = return to collection */

        if (!keyword) {

            visibleProducts = category
                ? allProducts.filter(product =>
                    String(product.category || "").toLowerCase() ===
                    String(category).toLowerCase()
                )
                : allProducts;

            renderProducts(visibleProducts);

            return;
        }


        /* --------------------------------------
           SEARCH ALL PRODUCTS

           Example:
           "માળા"
           "mala"
           "rudraksha"
           "tulsi"

           will search name + category +
           metal + description
        -------------------------------------- */

        visibleProducts = allProducts.filter(product => {

            const name =
                String(product.name || "").toLowerCase();

            const productCategory =
                String(product.category || "").toLowerCase();

            const metal =
                String(product.metal || "").toLowerCase();

            const description =
                String(product.description || "").toLowerCase();


            return (
                name.includes(keyword) ||
                productCategory.includes(keyword) ||
                metal.includes(keyword) ||
                description.includes(keyword)
            );

        });


        renderProducts(visibleProducts);

    });

}
