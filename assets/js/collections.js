/* ==========================================
   SUVARNA JEWELLERS
   COLLECTIONS.JS — PREMIUM COLLECTION SYSTEM
   FINAL V2
   ------------------------------------------
   • All products shown — NO fixed limit
   • Future products automatically included
   • Existing getProducts() system
   • Existing getImage() system
   • Premium cards matching collection search
   • Search across ALL products
   • Product click opens correct product page
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initCollectionPage
);


async function initCollectionPage() {

    const grid =
        document.getElementById("productsGrid");

    if (!grid) return;


    const category =
        String(
            grid.dataset.category || ""
        ).trim();


    /* ==========================================
       LOAD ALL PRODUCTS
    ========================================== */

    let allProducts = [];

    try {

        if (
            typeof getProducts !== "function"
        ) {

            console.error(
                "getProducts() is not available."
            );

            renderProducts([]);

            return;

        }


        const products =
            await getProducts();


        allProducts =
            Array.isArray(products)
                ? products.filter(Boolean)
                : [];


    }

    catch (error) {

        console.error(
            "Collections loading error:",
            error
        );

        renderProducts([]);

        return;

    }


    /* ==========================================
       CURRENT COLLECTION
    ========================================== */

    function getCollectionProducts() {

        if (!category) {

            return allProducts;

        }


        const wantedCategory =
            category.toLowerCase();


        return allProducts.filter(
            product => {

                return String(
                    product.category || ""
                )
                .trim()
                .toLowerCase()
                === wantedCategory;

            }
        );

    }


    /* ==========================================
       SAFE HTML ESCAPE
    ========================================== */

    function escapeHtml(value) {

        return String(
            value ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* ==========================================
       PRODUCT IMAGE
    ========================================== */

    function getProductImage(product) {

        if (!product) {

            return "";

        }


        let rawImage = "";


        /* Standard image */

        if (product.image) {

            rawImage =
                product.image;

        }


        /* Images array fallback */

        else if (
            Array.isArray(product.images) &&
            product.images.length
        ) {

            rawImage =
                product.images[0];

        }


        if (!rawImage) {

            return "";

        }


        try {

            if (
                typeof getImage === "function"
            ) {

                const resolved =
                    getImage(rawImage);

                if (resolved) {

                    return resolved;

                }

            }

        }

        catch (error) {

            console.warn(
                "getImage() failed:",
                error
            );

        }


        return rawImage;

    }


    /* ==========================================
       RENDER PRODUCTS
       ------------------------------------------
       IMPORTANT:
       NO slice()
       NO 110 PRODUCT LIMIT
       NO fixed number
       
       Every product in products.json
       will automatically appear.
    ========================================== */

    function renderProducts(products) {

        grid.innerHTML = "";


        /* --------------------------------------
           EMPTY STATE
        -------------------------------------- */

        if (
            !Array.isArray(products) ||
            !products.length
        ) {

            grid.innerHTML = `

                <div
                    class="collections-graceful-state"
                >

                    <span>
                        SUVARNA JEWELLERS
                    </span>

                    <h3>
                        No Jewellery Found
                    </h3>

                    <p>
                        No products match your
                        current collection or search.
                    </p>

                </div>

            `;


            injectPremiumCollectionStyles();

            return;

        }


        /* ======================================
           CREATE EVERY PRODUCT CARD
        ====================================== */

        products.forEach(
            (product, index) => {

                if (!product) return;


                const image =
                    getProductImage(product);


                const productName =
                    product.name ||
                    "Premium Jewellery";


                const productCategory =
                    product.category ||
                    "Jewellery";


                const metal =
                    product.metal ||
                    "";


                /* --------------------------------
                   PRODUCT URL
                -------------------------------- */

                const href =
                    product.id != null
                        ?
                        `../product.html?id=${encodeURIComponent(
                            product.id
                        )}&source=collections`
                        :
                        "#";


                /* --------------------------------
                   CARD
                -------------------------------- */

                const card =
                    document.createElement("a");


                card.href =
                    href;


                card.className =
                    "collection-link premium-collection-link";


                card.innerHTML = `

                    <article
                        class="card premium-collection-card"
                    >

                        <div
                            class="card-image premium-collection-image"
                        >

                            ${
                                image
                                ?
                                `
                                <img
                                    src="${escapeHtml(image)}"
                                    alt="${escapeHtml(productName)}"
                                    loading="lazy"
                                    decoding="async"
                                >
                                `
                                :
                                `
                                <div
                                    class="collection-image-fallback"
                                >

                                    <span>
                                        SUVARNA JEWELLERS
                                    </span>

                                    <strong>
                                        ${escapeHtml(
                                            productName
                                        )}
                                    </strong>

                                </div>
                                `
                            }


                            <div
                                class="collection-image-overlay"
                            ></div>


                            <span
                                class="collection-category-label"
                            >
                                ${escapeHtml(
                                    productCategory
                                )}
                            </span>


                            ${
                                metal
                                ?
                                `
                                <span
                                    class="collection-metal-badge"
                                >
                                    ${escapeHtml(metal)}
                                </span>
                                `
                                :
                                ""
                            }

                        </div>


                        <div
                            class="card-content premium-collection-content"
                        >

                            <span
                                class="collection-number"
                            >
                                ${String(
                                    index + 1
                                ).padStart(2, "0")}
                            </span>


                            <h3>
                                ${escapeHtml(
                                    productName
                                )}
                            </h3>


                            <p>
                                ${escapeHtml(
                                    productCategory
                                )}
                            </p>


                            <span
                                class="card-btn premium-collection-btn"
                            >

                                View Product

                                <span
                                    aria-hidden="true"
                                >
                                    →
                                </span>

                            </span>

                        </div>

                    </article>

                `;


                /* =================================
                   IMAGE ERROR FALLBACK
                ================================= */

                const imageElement =
                    card.querySelector("img");


                if (imageElement) {

                    imageElement.addEventListener(
                        "error",
                        function () {

                            this.style.display =
                                "none";


                            const parent =
                                this.parentElement;


                            if (!parent) return;


                            if (
                                parent.querySelector(
                                    ".collection-image-fallback"
                                )
                            ) {

                                return;

                            }


                            const fallback =
                                document.createElement(
                                    "div"
                                );


                            fallback.className =
                                "collection-image-fallback";


                            fallback.innerHTML = `

                                <span>
                                    SUVARNA JEWELLERS
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        productName
                                    )}
                                </strong>

                            `;


                            parent.prepend(
                                fallback
                            );

                        },
                        {
                            once: true
                        }
                    );

                }


                grid.appendChild(card);

            }
        );


        injectPremiumCollectionStyles();

    }


    /* ==========================================
       INITIAL COLLECTION
    ========================================== */

    renderProducts(
        getCollectionProducts()
    );


    /* ==========================================
       SEARCH
       ------------------------------------------
       Searches ALL PRODUCTS.
       This is intentional.
    ========================================== */

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {

        return;

    }


    /* Prevent duplicate listeners */

    if (
        searchInput.dataset.initialized ===
        "true"
    ) {

        return;

    }


    searchInput.dataset.initialized =
        "true";


    searchInput.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();


            /* ================================
               EMPTY SEARCH
            ================================= */

            if (!keyword) {

                renderProducts(
                    getCollectionProducts()
                );

                return;

            }


            /* ================================
               SEARCH ALL PRODUCTS
               
               NAME
               CATEGORY
               METAL
               DESCRIPTION
            ================================= */

            const filtered =
                allProducts.filter(
                    product => {

                        if (!product) {

                            return false;

                        }


                        const name =
                            String(
                                product.name || ""
                            )
                            .toLowerCase();


                        const productCategory =
                            String(
                                product.category || ""
                            )
                            .toLowerCase();


                        const metal =
                            String(
                                product.metal || ""
                            )
                            .toLowerCase();


                        const description =
                            String(
                                product.description || ""
                            )
                            .toLowerCase();


                        return (
                            name.includes(keyword) ||
                            productCategory.includes(keyword) ||
                            metal.includes(keyword) ||
                            description.includes(keyword)
                        );

                    }
                );


            renderProducts(filtered);

        }
    );

}


/* ==========================================
   PREMIUM COLLECTION CARD CSS
   ------------------------------------------
   Scoped to collections page only.
========================================== */

function injectPremiumCollectionStyles() {

    if (
        document.getElementById(
            "suvarna-collections-product-card-css"
        )
    ) {

        return;

    }


    const style =
        document.createElement("style");


    style.id =
        "suvarna-collections-product-card-css";


    style.textContent = `

        /* ======================================
           PREMIUM PRODUCT CARD
        ====================================== */

        .premium-collection-link {

            display:block;
            height:100%;

            color:inherit;
            text-decoration:none;

        }


        .premium-collection-card {

            position:relative;

            height:100%;

            overflow:hidden;

            border-radius:18px;

            background:
                linear-gradient(
                    145deg,
                    #fffdf8 0%,
                    #f4ecdf 100%
                );

            border:
                1px solid
                rgba(180,145,75,.22);

            box-shadow:
                0 12px 35px
                rgba(43,0,21,.10);

            transition:
                transform .45s ease,
                box-shadow .45s ease,
                border-color .45s ease;

        }


        .premium-collection-link:hover
        .premium-collection-card {

            transform:
                translateY(-7px);

            border-color:
                rgba(180,145,75,.38);

            box-shadow:
                0 24px 55px
                rgba(43,0,21,.17);

        }


        /* ======================================
           IMAGE
        ====================================== */

        .premium-collection-image {

            position:relative;

            overflow:hidden;

            min-height:285px;

            background:
                linear-gradient(
                    145deg,
                    #eee0ca,
                    #fffaf1
                );

        }


        .premium-collection-image img {

            display:block;

            width:100%;
            height:285px;

            object-fit:cover;
            object-position:center;

            transition:
                transform .7s ease;

        }


        .premium-collection-link:hover
        .premium-collection-image img {

            transform:
                scale(1.045);

        }


        /* ======================================
           IMAGE OVERLAY
        ====================================== */

        .collection-image-overlay {

            position:absolute;

            inset:0;

            pointer-events:none;

            background:
                linear-gradient(
                    180deg,
                    rgba(43,0,21,0) 40%,
                    rgba(43,0,21,.34) 100%
                );

        }


        /* ======================================
           CATEGORY LABEL
        ====================================== */

        .collection-category-label {

            position:absolute;

            left:17px;
            bottom:16px;

            padding:
                7px 12px;

            color:#fff;

            background:
                rgba(43,0,21,.68);

            border:
                1px solid
                rgba(255,255,255,.35);

            backdrop-filter:
                blur(8px);

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:9px;

            letter-spacing:
                1.8px;

            text-transform:
                uppercase;

        }


        /* ======================================
           METAL BADGE
        ====================================== */

        .collection-metal-badge {

            position:absolute;

            top:14px;
            right:14px;

            padding:
                6px 9px;

            color:#f5df9b;

            background:
                rgba(43,0,21,.70);

            border:
                1px solid
                rgba(212,175,55,.32);

            backdrop-filter:
                blur(8px);

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:8px;

            letter-spacing:
                1.3px;

            text-transform:
                uppercase;

        }


        /* ======================================
           CONTENT
        ====================================== */

        .premium-collection-content {

            position:relative;

            padding:
                21px
                21px
                23px;

        }


        .collection-number {

            display:block;

            margin-bottom:8px;

            color:#b18a38;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:10px;

            letter-spacing:2px;

        }


        .premium-collection-content h3 {

            margin:
                0 0 7px;

            color:#2b0015;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:20px;

            font-weight:600;

            line-height:1.3;

        }


        .premium-collection-content p {

            margin:
                0 0 17px;

            color:#675b60;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:12px;

            line-height:1.6;

        }


        /* ======================================
           VIEW PRODUCT
        ====================================== */

        .premium-collection-btn {

            display:inline-flex;

            align-items:center;

            gap:9px;

            color:#8d6824;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:10px;

            font-weight:600;

            letter-spacing:
                1.25px;

            text-transform:
                uppercase;

        }


        .premium-collection-btn span {

            font-size:17px;

            transition:
                transform .3s ease;

        }


        .premium-collection-link:hover
        .premium-collection-btn span {

            transform:
                translateX(4px);

        }


        /* ======================================
           IMAGE FALLBACK
        ====================================== */

        .collection-image-fallback {

            width:100%;
            height:285px;

            display:flex;

            flex-direction:column;

            align-items:center;
            justify-content:center;

            text-align:center;

            padding:25px;

            color:#fff;

            background:
                radial-gradient(
                    circle at center,
                    rgba(212,175,55,.22),
                    transparent 58%
                ),
                linear-gradient(
                    145deg,
                    #3b071f,
                    #150008
                );

        }


        .collection-image-fallback span {

            margin-bottom:11px;

            color:#d4af37;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:8px;

            letter-spacing:3px;

        }


        .collection-image-fallback strong {

            color:#fff;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:23px;

            font-weight:500;

        }


        /* ======================================
           EMPTY STATE
        ====================================== */

        .collections-graceful-state {

            grid-column:
                1 / -1;

            min-height:225px;

            display:flex;

            flex-direction:column;

            align-items:center;
            justify-content:center;

            text-align:center;

            padding:30px 20px;

            border-radius:18px;

            border:
                1px solid
                rgba(180,145,75,.20);

            background:
                linear-gradient(
                    145deg,
                    #fffdf8,
                    #f5eee2
                );

            box-shadow:
                0 12px 35px
                rgba(43,0,21,.08);

        }


        .collections-graceful-state span {

            margin-bottom:10px;

            color:#b18a38;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:8px;

            letter-spacing:3px;

        }


        .collections-graceful-state h3 {

            margin:
                0 0 8px;

            color:#2b0015;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:24px;

        }


        .collections-graceful-state p {

            max-width:500px;

            margin:
                0;

            color:#675b60;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:13px;

            line-height:1.7;

        }


        /* ======================================
           MOBILE
        ====================================== */

        @media(max-width:700px) {

            .premium-collection-image {

                min-height:240px;

            }


            .premium-collection-image img {

                height:240px;

            }


            .collection-image-fallback {

                height:240px;

            }


            .premium-collection-content {

                padding:
                    18px
                    18px
                    20px;

            }


            .premium-collection-content h3 {

                font-size:18px;

            }


            .collection-category-label {

                left:12px;
                bottom:12px;

                padding:
                    6px 9px;

                font-size:8px;

            }


            .collection-metal-badge {

                top:11px;
                right:11px;

                font-size:7px;

            }

        }


        /* ======================================
           VERY SMALL MOBILE
        ====================================== */

        @media(max-width:380px) {

            .premium-collection-content h3 {

                font-size:16px;

            }


            .premium-collection-content p {

                font-size:10px;

            }


            .premium-collection-btn {

                font-size:8px;

            }

        }


        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media(prefers-reduced-motion:reduce) {

            .premium-collection-card,
            .premium-collection-image img,
            .premium-collection-btn span {

                transition:none !important;

            }

        }

    `;


    document.head.appendChild(style);

}
