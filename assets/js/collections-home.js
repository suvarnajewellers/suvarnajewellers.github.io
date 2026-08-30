/* ==========================================
   SUVARNA JEWELLERS V9
   COLLECTIONS-HOME.JS
   FINAL — ALL PRODUCTS CATALOG
   ------------------------------------------
   • Initial page = ALL PRODUCTS
   • No 6 product limit
   • No fixed product limit
   • Search filters ALL products
   • Gold / Silver search works
   • Existing getProducts() system
   • Existing getImage() system
   • Product cards use real product images
   • No category-card rendering in product grid
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initCollectionsHome
);


/* ==========================================
   GLOBAL PRODUCT DATA
========================================== */

let allProducts = [];


/* ==========================================
   INITIALIZE
========================================== */

async function initCollectionsHome() {

    const grid =
        document.getElementById(
            "collectionsGrid"
        );

    if (!grid) {

        console.warn(
            "Collections grid not found."
        );

        return;

    }


    /* ======================================
       LOADING STATE
    ====================================== */

    grid.innerHTML = `
        <div class="collections-loading">
            <span class="collections-loading-line"></span>
            <span>Curating Jewellery</span>
        </div>
    `;


    try {

        /* ==================================
           EXISTING API ONLY
        ================================== */

        if (
            typeof getProducts !== "function"
        ) {

            console.error(
                "getProducts() is not available."
            );

            allProducts = [];

            renderGracefulFallback();

            return;

        }


        /* ==================================
           LOAD ALL PRODUCTS
        ================================== */

        const products =
            await getProducts();


        if (
            !Array.isArray(products)
        ) {

            console.error(
                "Invalid products response."
            );

            allProducts = [];

            renderGracefulFallback();

            return;

        }


        /*
         * IMPORTANT
         * Keep every valid product.
         *
         * NO slice()
         * NO limit
         * NO category grouping
         */

        allProducts =
            products.filter(
                product => product
            );


        console.log(
            "SUVARNA COLLECTIONS — Total Products:",
            allProducts.length
        );


        /* ==================================
           PRODUCT COUNT
        ================================== */

        updateProductCount(
            allProducts.length
        );


        /* ==================================
           INITIAL PAGE
           
           SHOW EVERY PRODUCT
           
           NOT COLLECTION CATEGORY CARDS
        ================================== */

        renderSearchProducts(
            allProducts
        );


        /* ==================================
           SEARCH
        ================================== */

        initSearch();

    }

    catch (error) {

        console.error(
            "Collections Loading Error:",
            error
        );

        allProducts = [];

        updateProductCount(0);

        renderGracefulFallback();

        initSearch();

    }

}


/* ==========================================
   PRODUCT COUNT
========================================== */

function updateProductCount(
    count
) {

    const countElement =
        document.getElementById(
            "productCount"
        );


    if (!countElement) return;


    countElement.textContent =
        Number(count) || 0;

}


/* ==========================================
   GET PRODUCT IMAGE
   ------------------------------------------
   Existing image system only.
========================================== */

function getRealProductImage(
    product
) {

    if (!product) {

        return "";

    }


    let rawImage = "";


    /* --------------------------------------
       Standard image field
    -------------------------------------- */

    if (
        product.image
    ) {

        rawImage =
            product.image;

    }


    /* --------------------------------------
       Images array fallback
    -------------------------------------- */

    else if (
        Array.isArray(
            product.images
        ) &&
        product.images.length
    ) {

        rawImage =
            product.images[0];

    }


    if (!rawImage) {

        return "";

    }


    /* --------------------------------------
       Existing getImage() system
    -------------------------------------- */

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


    /* --------------------------------------
       Final fallback
    -------------------------------------- */

    return rawImage;

}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHtml(
    value
) {

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
   RENDER ALL PRODUCT CARDS
========================================== */

function renderSearchProducts(
    products
) {

    const grid =
        document.getElementById(
            "collectionsGrid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    /* ======================================
       EMPTY RESULT
    ====================================== */

    if (
        !Array.isArray(products) ||
        !products.length
    ) {

        updateProductCount(0);


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
                    current search.
                    Please try another keyword.
                </p>

            </div>

        `;


        injectPremiumStyles();

        return;

    }


    /* ======================================
       IMPORTANT
       COUNT MUST MATCH WHAT IS DISPLAYED
    ====================================== */

    updateProductCount(
        products.length
    );


    /* ======================================
       RENDER EVERY PRODUCT
       
       NO .slice()
       NO LIMIT
    ====================================== */

    products.forEach(
        (
            product,
            index
        ) => {

            if (!product) return;


            const image =
                getRealProductImage(
                    product
                );


            const name =
                product.name ||
                "Premium Jewellery";


            const category =
                product.category ||
                "Jewellery";


            const metal =
                product.metal ||
                "";


            /* ==================================
               PRODUCT URL
            ================================== */

            const href =
                product.id != null
                    ?
                    `product.html?id=${encodeURIComponent(
                        product.id
                    )}&source=collections`
                    :
                    "#";


            /* ==================================
               CARD
            ================================== */

            const card =
                document.createElement(
                    "a"
                );


            card.href =
                href;


            card.className =
                "collection-link premium-product-link";


            card.innerHTML = `

                <article
                    class="card premium-product-card"
                >

                    <!-- =========================
                         PRODUCT IMAGE
                    ========================== -->

                    <div
                        class="card-image premium-product-image"
                    >

                        ${
                            image
                            ?
                            `
                            <img
                                src="${escapeHtml(
                                    image
                                )}"
                                alt="${escapeHtml(
                                    name
                                )}"
                                loading="${
                                    index < 8
                                        ? "eager"
                                        : "lazy"
                                }"
                                decoding="async"
                            >
                            `
                            :
                            `
                            <div
                                class="product-image-fallback"
                            >

                                <span>
                                    SUVARNA JEWELLERS
                                </span>

                                <strong>
                                    ${escapeHtml(
                                        name
                                    )}
                                </strong>

                            </div>
                            `
                        }


                        <div
                            class="product-image-light"
                        ></div>


                        <span
                            class="product-category-pill"
                        >
                            ${escapeHtml(
                                category
                            )}
                        </span>


                        ${
                            metal
                            ?
                            `
                            <span
                                class="product-metal-pill"
                            >
                                ${escapeHtml(
                                    metal
                                )}
                            </span>
                            `
                            :
                            ""
                        }

                    </div>


                    <!-- =========================
                         PRODUCT CONTENT
                    ========================== -->

                    <div
                        class="card-content premium-product-content"
                    >

                        <span
                            class="product-index"
                        >
                            ${String(
                                index + 1
                            ).padStart(
                                2,
                                "0"
                            )}
                        </span>


                        <h3>
                            ${escapeHtml(
                                name
                            )}
                        </h3>


                        <p>
                            ${escapeHtml(
                                category
                            )}
                        </p>


                        <span
                            class="premium-product-button"
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


            /* ==================================
               IMAGE ERROR FALLBACK
            ================================== */

            const imageElement =
                card.querySelector(
                    "img"
                );


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
                                ".product-image-fallback"
                            )
                        ) {

                            return;

                        }


                        const fallback =
                            document.createElement(
                                "div"
                            );


                        fallback.className =
                            "product-image-fallback";


                        fallback.innerHTML = `

                            <span>
                                SUVARNA JEWELLERS
                            </span>

                            <strong>
                                ${escapeHtml(
                                    name
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


            grid.appendChild(
                card
            );

        }
    );


    /* ======================================
       PREMIUM CSS
    ====================================== */

    injectPremiumStyles();

}


/* ==========================================
   SEARCH SYSTEM
========================================== */

function initSearch() {

    const search =
        document.getElementById(
            "collectionSearch"
        );


    if (!search) {

        console.warn(
            "collectionSearch input not found."
        );

        return;

    }


    /* Prevent duplicate listener */

    if (
        search.dataset.initialized ===
        "true"
    ) {

        return;

    }


    search.dataset.initialized =
        "true";


    search.addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();


            /* ==================================
               EMPTY SEARCH
               SHOW ALL PRODUCTS AGAIN
            ================================== */

            if (!keyword) {

                renderSearchProducts(
                    allProducts
                );

                return;

            }


            /* ==================================
               SEARCH ALL PRODUCTS
               
               NAME
               CATEGORY
               METAL
               DESCRIPTION
            ================================== */

            const filtered =
                allProducts.filter(
                    product => {

                        if (!product) {

                            return false;

                        }


                        const name =
                            String(
                                product.name ||
                                ""
                            )
                            .toLowerCase();


                        const category =
                            String(
                                product.category ||
                                ""
                            )
                            .toLowerCase();


                        const metal =
                            String(
                                product.metal ||
                                ""
                            )
                            .toLowerCase();


                        const description =
                            String(
                                product.description ||
                                ""
                            )
                            .toLowerCase();


                        return (
                            name.includes(
                                keyword
                            ) ||
                            category.includes(
                                keyword
                            ) ||
                            metal.includes(
                                keyword
                            ) ||
                            description.includes(
                                keyword
                            )
                        );

                    }
                );


            /* ==================================
               SHOW ALL MATCHING PRODUCTS
            ================================== */

            renderSearchProducts(
                filtered
            );

        }
    );

}


/* ==========================================
   GRACEFUL FALLBACK
========================================== */

function renderGracefulFallback() {

    const grid =
        document.getElementById(
            "collectionsGrid"
        );


    if (!grid) return;


    grid.innerHTML = `

        <div
            class="collections-graceful-state"
        >

            <span>
                SUVARNA JEWELLERS
            </span>

            <h3>
                Premium Collections
            </h3>

            <p>
                Our jewellery collection is
                temporarily unavailable.
                Please try again.
            </p>

            <button
                type="button"
                class="premium-retry-button"
                onclick="retryCollections()"
            >
                Retry
            </button>

        </div>

    `;


    injectPremiumStyles();

}


/* ==========================================
   RETRY
========================================== */

window.retryCollections =
    function () {

        initCollectionsHome();

    };


/* ==========================================
   PREMIUM PRODUCT CARD STYLES
========================================== */

function injectPremiumStyles() {

    if (
        document.getElementById(
            "suvarna-collections-final-css"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "suvarna-collections-final-css";


    style.textContent = `

        /* ======================================
           PRODUCT LINK
        ====================================== */

        .premium-product-link {

            display:block;

            width:100%;
            height:100%;

            color:inherit;

            text-decoration:none;

        }


        /* ======================================
           PRODUCT CARD
        ====================================== */

        .premium-product-card {

            position:relative;

            display:flex;

            flex-direction:column;

            width:100%;
            height:100%;

            overflow:hidden;

            border-radius:22px;

            background:
                linear-gradient(
                    145deg,
                    #fffdf9 0%,
                    #f7efe4 100%
                );

            border:
                1px solid
                rgba(180,145,75,.18);

            box-shadow:
                0 9px 28px
                rgba(43,0,21,.075);

            transition:
                transform .4s ease,
                box-shadow .4s ease,
                border-color .4s ease;

        }


        .premium-product-link:hover
        .premium-product-card {

            transform:
                translateY(-6px);

            border-color:
                rgba(180,145,75,.38);

            box-shadow:
                0 20px 45px
                rgba(43,0,21,.14);

        }


        /* ======================================
           IMAGE AREA

           LARGE + CONSISTENT
        ====================================== */

        .premium-product-image {

            position:relative;

            width:100%;

            /*
             * Square image stage.
             * Every product gets the same visual area.
             */

            aspect-ratio:1 / 1;

            min-height:0;

            overflow:hidden;

            padding:8px;

            background:
                linear-gradient(
                    145deg,
                    #eee3d2,
                    #faf5ec
                );

        }


        /* ======================================
           INNER IVORY STAGE
        ====================================== */

        .premium-product-image::before {

            content:"";

            position:absolute;

            z-index:0;

            inset:10px;

            border-radius:
                20px 20px 32px 32px;

            background:
                linear-gradient(
                    145deg,
                    #fffefa 0%,
                    #eee2d0 100%
                );

            box-shadow:
                inset
                0 0 0 1px
                rgba(180,145,75,.12);

            pointer-events:none;

        }


        /* ======================================
           PRODUCT IMAGE

           IMPORTANT:
           DO NOT CROP
        ====================================== */

        .premium-product-image img {

            position:relative;

            z-index:1;

            display:block;

            width:100%;
            height:100%;

            /*
             * More usable image space.
             */

            padding:3px 4px;

            object-fit:contain;

            object-position:center;

            border-radius:
                20px 20px 32px 32px;

            /*
             * Slightly larger visual jewellery.
             */

            transform:
                scale(1.02);

            transition:
                transform .55s ease;

        }


        .premium-product-link:hover
        .premium-product-image img {

            transform:
                scale(1.075);

        }


        /* ======================================
           IMAGE LIGHT
        ====================================== */

        .product-image-light {

            position:absolute;

            z-index:2;

            inset:10px;

            border-radius:
                20px 20px 32px 32px;

            pointer-events:none;

            background:
                linear-gradient(
                    180deg,
                    rgba(255,255,255,.10),
                    rgba(255,255,255,0) 48%,
                    rgba(43,0,21,.035)
                );

        }


        /* ======================================
           CATEGORY
        ====================================== */

        .product-category-pill {

            position:absolute;

            z-index:4;

            left:18px;

            bottom:18px;

            max-width:
                calc(100% - 36px);

            overflow:hidden;

            white-space:nowrap;

            text-overflow:ellipsis;

            padding:
                6px 10px;

            border-radius:999px;

            color:#fff;

            background:
                rgba(43,0,21,.68);

            border:
                1px solid
                rgba(255,255,255,.28);

            backdrop-filter:
                blur(9px);

            -webkit-backdrop-filter:
                blur(9px);

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:7px;

            font-weight:500;

            letter-spacing:
                1.35px;

            text-transform:
                uppercase;

        }


        /* ======================================
           METAL
        ====================================== */

        .product-metal-pill {

            position:absolute;

            z-index:4;

            top:17px;

            right:17px;

            max-width:45%;

            overflow:hidden;

            white-space:nowrap;

            text-overflow:ellipsis;

            padding:
                6px 9px;

            border-radius:999px;

            color:#e6c969;

            background:
                rgba(43,0,21,.72);

            border:
                1px solid
                rgba(212,175,55,.35);

            backdrop-filter:
                blur(8px);

            -webkit-backdrop-filter:
                blur(8px);

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:7px;

            letter-spacing:
                1.15px;

            text-transform:
                uppercase;

        }


        /* ======================================
           CONTENT
        ====================================== */

        .premium-product-content {

            position:relative;

            display:flex;

            flex-direction:column;

            flex:1;

            padding:
                15px
                16px
                17px;

        }


        /* ======================================
           PRODUCT NUMBER
        ====================================== */

        .product-index {

            display:block;

            margin-bottom:5px;

            color:#a27b2c;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:8px;

            letter-spacing:
                1.8px;

            text-transform:
                uppercase;

        }


        /* ======================================
           PRODUCT NAME
        ====================================== */

        .premium-product-content h3 {

            margin:
                0 0 5px;

            color:#2b0015;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:16px;

            font-weight:600;

            line-height:1.35;

            display:
                -webkit-box;

            -webkit-line-clamp:2;

            -webkit-box-orient:vertical;

            overflow:hidden;

        }


        /* ======================================
           CATEGORY TEXT
        ====================================== */

        .premium-product-content p {

            margin:
                0 0 13px;

            color:#786b6e;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:10px;

            line-height:1.45;

        }


        /* ======================================
           VIEW PRODUCT
        ====================================== */

        .premium-product-button {

            display:inline-flex;

            align-items:center;

            justify-content:center;

            align-self:flex-start;

            gap:9px;

            min-height:32px;

            padding:
                0 12px;

            border:
                1px solid
                rgba(180,145,75,.40);

            border-radius:999px;

            color:#76551d;

            background:
                rgba(255,255,255,.52);

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:7.5px;

            font-weight:600;

            letter-spacing:
                1.15px;

            text-transform:
                uppercase;

            transition:
                all .3s ease;

        }


        .premium-product-button span {

            display:inline-flex;

            align-items:center;

            justify-content:center;

            width:19px;
            height:19px;

            border-radius:50%;

            color:#fff;

            background:#2b0015;

            font-size:12px;

            transition:
                transform .3s ease,
                background .3s ease,
                color .3s ease;

        }


        .premium-product-link:hover
        .premium-product-button {

            color:#fff;

            background:#2b0015;

            border-color:#2b0015;

        }


        .premium-product-link:hover
        .premium-product-button span {

            color:#2b0015;

            background:#d4af37;

            transform:
                translateX(3px);

        }


        /* ======================================
           IMAGE FALLBACK
        ====================================== */

        .product-image-fallback {

            position:relative;

            z-index:1;

            width:100%;
            height:100%;

            display:flex;

            flex-direction:column;

            align-items:center;

            justify-content:center;

            text-align:center;

            padding:25px;

            border-radius:
                20px 20px 32px 32px;

            color:#fff;

            background:
                radial-gradient(
                    circle at center,
                    rgba(212,175,55,.20),
                    transparent 58%
                ),
                linear-gradient(
                    145deg,
                    #3b071f,
                    #150008
                );

        }


        .product-image-fallback span {

            margin-bottom:10px;

            color:#d4af37;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:7px;

            letter-spacing:3px;

        }


        .product-image-fallback strong {

            color:#fff;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:20px;

            font-weight:500;

        }


        /* ======================================
           LOADING
        ====================================== */

        .collections-loading {

            grid-column:
                1 / -1;

            min-height:180px;

            display:flex;

            flex-direction:column;

            align-items:center;

            justify-content:center;

            gap:13px;

            color:#8c6721;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:10px;

            letter-spacing:2px;

            text-transform:uppercase;

        }


        .collections-loading-line {

            display:block;

            width:75px;

            height:1px;

            background:#d4af37;

            animation:
                suvarnaCollectionLoading
                1.5s
                ease-in-out
                infinite;

        }


        @keyframes suvarnaCollectionLoading {

            0%,
            100% {

                transform:
                    scaleX(.35);

                opacity:.4;

            }

            50% {

                transform:
                    scaleX(1);

                opacity:1;

            }

        }


        /* ======================================
           EMPTY / ERROR
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

            padding:
                30px 20px;

            border-radius:20px;

            border:
                1px solid
                rgba(180,145,75,.18);

            background:
                linear-gradient(
                    145deg,
                    #fffdf8,
                    #f5eee2
                );

            box-shadow:
                0 12px 35px
                rgba(43,0,21,.07);

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
                0 0 19px;

            color:#675b60;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:13px;

            line-height:1.7;

        }


        /* ======================================
           RETRY
        ====================================== */

        .premium-retry-button {

            min-height:38px;

            padding:
                0 18px;

            border:
                1px solid
                #d4af37;

            border-radius:999px;

            color:#fff;

            background:#2b0015;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:9px;

            font-weight:600;

            letter-spacing:
                1.3px;

            text-transform:uppercase;

            cursor:pointer;

        }


        /* ======================================
           MOBILE
        ====================================== */

        @media(max-width:700px) {

            .premium-product-card {

                border-radius:18px;

            }


            .premium-product-image {

                aspect-ratio:1 / 1;

                padding:7px;

            }


            .premium-product-image::before {

                inset:9px;

                border-radius:
                    17px 17px 27px 27px;

            }


            .premium-product-image img {

                padding:2px;

                border-radius:
                    17px 17px 27px 27px;

                transform:
                    scale(1.015);

            }


            .premium-product-link:hover
            .premium-product-image img {

                transform:
                    scale(1.055);

            }


            .product-image-light {

                inset:9px;

                border-radius:
                    17px 17px 27px 27px;

            }


            .product-category-pill {

                left:15px;

                bottom:15px;

                padding:
                    5px 8px;

                font-size:6.5px;

            }


            .product-metal-pill {

                top:14px;

                right:14px;

                padding:
                    5px 8px;

                font-size:6.5px;

            }


            .premium-product-content {

                padding:
                    13px
                    13px
                    15px;

            }


            .premium-product-content h3 {

                font-size:14px;

            }


            .premium-product-content p {

                font-size:9px;

                margin-bottom:10px;

            }


            .premium-product-button {

                min-height:30px;

                padding:
                    0 10px;

                font-size:7px;

            }


            .premium-product-button span {

                width:18px;
                height:18px;

                font-size:11px;

            }

        }


        /* ======================================
           SMALL MOBILE
        ====================================== */

        @media(max-width:380px) {

            .premium-product-content h3 {

                font-size:13px;

            }


            .premium-product-content p {

                font-size:8.5px;

            }


            .premium-product-button {

                font-size:6.5px;

            }

        }


        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media(prefers-reduced-motion:reduce) {

            .premium-product-card,
            .premium-product-image img,
            .premium-product-button,
            .premium-product-button span {

                transition:none !important;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}
