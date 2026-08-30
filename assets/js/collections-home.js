/* ==========================================
   SUVARNA JEWELLERS V9
   COLLECTIONS-HOME.JS
   FINAL PREMIUM + STABLE VERSION

   PURPOSE
   ------------------------------------------
   • Homepage initially shows COLLECTION cards
   • Search shows ALL matching PRODUCTS
   • "Gold" => all Gold products
   • "Silver" => all Silver products
   • Product count shows ALL loaded products
   • No .slice()
   • No fixed product limit
   • Existing getProducts() system
   • Existing getImage() system
   • Existing product.html?id= system
   • Exact product image paths preserved
   • Premium ivory luxury presentation
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
   COLLECTION ORDER
========================================== */

const COLLECTION_ORDER = [

    "Gold Jewellery",
    "Silver Jewellery",
    "Rudraksha Mala",
    "Rudraksha Bracelet",
    "Pendant",
    "Tulsi Mala"

];


/* ==========================================
   COLLECTION META
========================================== */

const COLLECTION_META = {

    "Gold Jewellery": {

        title: "Gold Jewellery",
        subtitle: "Premium Gold Collection",
        button: "Explore Gold"

    },

    "Silver Jewellery": {

        title: "Silver Jewellery",
        subtitle: "Refined Silver Collection",
        button: "Explore Silver"

    },

    "Rudraksha Mala": {

        title: "Rudraksha Mala",
        subtitle: "Premium Rudraksha Collection",
        button: "Explore Collection"

    },

    "Rudraksha Bracelet": {

        title: "Rudraksha Bracelet",
        subtitle: "Premium Bracelet Collection",
        button: "Explore Collection"

    },

    "Pendant": {

        title: "Pendants",
        subtitle: "Elegant Pendant Collection",
        button: "Explore Collection"

    },

    "Tulsi Mala": {

        title: "Tulsi Mala",
        subtitle: "Traditional Tulsi Collection",
        button: "Explore Collection"

    }

};


/* ==========================================
   INITIALIZE COLLECTION HOME
========================================== */

async function initCollectionsHome(){

    const grid =
        document.getElementById(
            "collectionsGrid"
        );

    if(!grid){

        console.warn(
            "Collections grid not found."
        );

        return;

    }


    /* ======================================
       LOADING
    ====================================== */

    grid.innerHTML = `

        <div class="collections-loading">

            <span class="collections-loading-line"></span>

            <span>
                Curating Collections
            </span>

        </div>

    `;


    try{

        /* ==================================
           EXISTING API ONLY
        ================================== */

        if(
            typeof getProducts !== "function"
        ){

            console.error(
                "getProducts() is not available."
            );

            allProducts = [];

            renderGracefulFallback();

            initSearch();

            return;

        }


        /* ==================================
           LOAD ALL PRODUCTS
        ================================== */

        const products =
            await getProducts();


        if(!Array.isArray(products)){

            console.error(
                "Invalid products response."
            );

            allProducts = [];

            renderGracefulFallback();

            initSearch();

            return;

        }


        /* ==================================
           STORE ALL PRODUCTS
           NO LIMIT
        ================================== */

        allProducts =
            products.filter(
                product => product
            );


        console.log(
            "Suvarna Collections:",
            allProducts.length,
            "products loaded."
        );


        /* ==================================
           UPDATE PRODUCT COUNT
        ================================== */

        updateProductCount(
            allProducts.length
        );


        /* ==================================
           INITIAL VIEW
           SHOW COLLECTION CARDS
        ================================== */

        renderCollections(
            allProducts
        );


        /* ==================================
           INITIALIZE SEARCH
        ================================== */

        initSearch();

    }

    catch(error){

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

function updateProductCount(count){

    const countElement =
        document.getElementById(
            "productCount"
        );


    if(!countElement) return;


    countElement.textContent =
        Number.isFinite(count)
            ? count
            : 0;

}


/* ==========================================
   GROUP PRODUCTS BY CATEGORY
========================================== */

function buildCollections(products){

    if(
        !Array.isArray(products) ||
        !products.length
    ){

        return [];

    }


    const grouped = {};


    products.forEach(
        product => {

            if(!product) return;


            const category =
                String(
                    product.category || ""
                ).trim();


            if(!category) return;


            if(!grouped[category]){

                grouped[category] = [];

            }


            grouped[category].push(
                product
            );

        }
    );


    const collections = [];


    /* ======================================
       PREFERRED ORDER
    ====================================== */

    COLLECTION_ORDER.forEach(
        category => {

            if(
                grouped[category]
            ){

                collections.push({

                    category:
                        category,

                    products:
                        grouped[category]

                });

            }

        }
    );


    /* ======================================
       FUTURE / OTHER CATEGORIES
       AUTOMATICALLY INCLUDED
    ====================================== */

    Object.keys(grouped).forEach(
        category => {

            if(
                !COLLECTION_ORDER.includes(
                    category
                )
            ){

                collections.push({

                    category:
                        category,

                    products:
                        grouped[category]

                });

            }

        }
    );


    return collections;

}


/* ==========================================
   GET PRODUCT IMAGE
========================================== */

function getRealProductImage(
    products
){

    if(
        !Array.isArray(products) ||
        !products.length
    ){

        return "";

    }


    for(
        const product of products
    ){

        if(!product) continue;


        let rawImage = "";


        /* ----------------------------------
           Standard image
        ---------------------------------- */

        if(product.image){

            rawImage =
                product.image;

        }


        /* ----------------------------------
           Images array fallback
        ---------------------------------- */

        else if(
            Array.isArray(product.images) &&
            product.images.length
        ){

            rawImage =
                product.images[0];

        }


        if(!rawImage) continue;


        /* ----------------------------------
           Existing getImage()
        ---------------------------------- */

        try{

            if(
                typeof getImage === "function"
            ){

                const resolved =
                    getImage(rawImage);

                if(resolved){

                    return resolved;

                }

            }

        }

        catch(error){

            console.warn(
                "getImage() failed:",
                error
            );

        }


        /* ----------------------------------
           Existing path fallback
        ---------------------------------- */

        return rawImage;

    }


    return "";

}


/* ==========================================
   RENDER COLLECTION CARDS
   ------------------------------------------
   INITIAL HOMEPAGE VIEW

   This shows the collection categories,
   NOT individual products.
========================================== */

function renderCollections(
    products
){

    const grid =
        document.getElementById(
            "collectionsGrid"
        );


    if(!grid) return;


    const collections =
        buildCollections(
            products
        );


    grid.innerHTML = "";


    /* ======================================
       EMPTY
    ====================================== */

    if(!collections.length){

        renderGracefulFallback();

        return;

    }


    /* ======================================
       CREATE COLLECTION CARDS
    ====================================== */

    collections.forEach(
        (
            collection,
            index
        ) => {

            const category =
                collection.category;


            const meta =
                COLLECTION_META[
                    category
                ] ||
                {

                    title:
                        category,

                    subtitle:
                        "Premium Jewellery Collection",

                    button:
                        "Explore Collection"

                };


            const image =
                getRealProductImage(
                    collection.products
                );


            /* ==================================
               COLLECTION URL
            ================================== */

            const href =
                `collections.html?category=${encodeURIComponent(
                    category
                )}`;


            const card =
                document.createElement(
                    "a"
                );


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
                                alt="${escapeHtml(meta.title)}"
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
                                        meta.title
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
                                meta.title
                            )}
                        </span>

                    </div>


                    <div
                        class="card-content premium-collection-content"
                    >

                        <span
                            class="collection-number"
                        >
                            ${String(
                                index + 1
                            ).padStart(2,"0")}
                        </span>


                        <h3>
                            ${escapeHtml(
                                meta.title
                            )}
                        </h3>


                        <p>
                            ${escapeHtml(
                                meta.subtitle
                            )}
                        </p>


                        <span
                            class="card-btn premium-collection-btn"
                        >

                            ${escapeHtml(
                                meta.button
                            )}

                            <span
                                aria-hidden="true"
                            >
                                →
                            </span>

                        </span>

                    </div>

                </article>

            `;


            attachImageFallback(
                card,
                meta.title
            );


            grid.appendChild(
                card
            );

        }
    );


    injectPremiumStyles();

}


/* ==========================================
   SEARCH
   ------------------------------------------
   IMPORTANT:

   Empty search:
   → Collection cards

   Search keyword:
   → ALL matching PRODUCT cards

   Example:
   Gold
   → every product whose category,
     name, metal or description matches Gold
========================================== */

function initSearch(){

    /*
     * Support both possible IDs so the
     * existing HTML does not break.
     */

    const search =
        document.getElementById(
            "collectionSearch"
        ) ||
        document.getElementById(
            "searchInput"
        );


    if(!search){

        console.warn(
            "Collection search input not found."
        );

        return;

    }


    /* Prevent duplicate listener */

    if(
        search.dataset.initialized ===
        "true"
    ){

        return;

    }


    search.dataset.initialized =
        "true";


    search.addEventListener(
        "input",
        function(){

            const keyword =
                String(
                    this.value || ""
                )
                .trim()
                .toLowerCase();


            /* ==================================
               EMPTY SEARCH
            ================================== */

            if(!keyword){

                updateProductCount(
                    allProducts.length
                );


                renderCollections(
                    allProducts
                );


                return;

            }


            /* ==================================
               SEARCH ALL PRODUCTS
            ================================== */

            const filtered =
                allProducts.filter(
                    product => {

                        if(!product){

                            return false;

                        }


                        const name =
                            normalizeSearchValue(
                                product.name
                            );


                        const category =
                            normalizeSearchValue(
                                product.category
                            );


                        const metal =
                            normalizeSearchValue(
                                product.metal
                            );


                        const description =
                            normalizeSearchValue(
                                product.description
                            );


                        /*
                         * SEARCH ACROSS ALL
                         * IMPORTANT PRODUCT FIELDS
                         */

                        return (

                            name.includes(
                                keyword
                            )

                            ||

                            category.includes(
                                keyword
                            )

                            ||

                            metal.includes(
                                keyword
                            )

                            ||

                            description.includes(
                                keyword
                            )

                        );

                    }
                );


            /* ==================================
               COUNT MATCHING PRODUCTS
            ================================== */

            updateProductCount(
                filtered.length
            );


            /* ==================================
               SHOW ALL MATCHING PRODUCTS
               NO SLICE
               NO LIMIT
            ================================== */

            renderSearchProducts(
                filtered
            );

        }
    );

}


/* ==========================================
   NORMALIZE SEARCH VALUE
========================================== */

function normalizeSearchValue(
    value
){

    return String(
        value ?? ""
    )
    .trim()
    .toLowerCase();

}


/* ==========================================
   RENDER SEARCH PRODUCTS
   ------------------------------------------
   THIS IS THE IMPORTANT PART

   Search results are INDIVIDUAL PRODUCTS.

   If 110 products match:
   → 110 cards are created.

   If 47 Gold products match:
   → 47 cards are created.

   NO .slice()
   NO LIMIT
========================================== */

function renderSearchProducts(
    products
){

    const grid =
        document.getElementById(
            "collectionsGrid"
        );


    if(!grid) return;


    grid.innerHTML = "";


    /* ======================================
       NO RESULTS
    ====================================== */

    if(
        !Array.isArray(products) ||
        !products.length
    ){

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
                    search. Try another
                    product, category or metal.
                </p>

            </div>

        `;


        injectPremiumStyles();

        return;

    }


    /* ======================================
       CREATE EVERY PRODUCT
    ====================================== */

    products.forEach(
        (
            product,
            index
        ) => {

            if(!product) return;


            const image =
                getRealProductImage([
                    product
                ]);


            const productName =
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
                    )}`
                    :
                    "#";


            const card =
                document.createElement(
                    "a"
                );


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
                                category
                            )}
                        </span>


                        ${
                            metal
                            ?
                            `
                            <span
                                class="collection-metal-badge"
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


                    <div
                        class="card-content premium-collection-content"
                    >

                        <span
                            class="collection-number"
                        >
                            ${String(
                                index + 1
                            ).padStart(2,"0")}

                        </span>


                        <h3>
                            ${escapeHtml(
                                productName
                            )}
                        </h3>


                        <p>
                            ${escapeHtml(
                                category
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


            attachImageFallback(
                card,
                productName
            );


            grid.appendChild(
                card
            );

        }
    );


    injectPremiumStyles();

}


/* ==========================================
   IMAGE ERROR FALLBACK
========================================== */

function attachImageFallback(
    card,
    title
){

    const imageElement =
        card.querySelector(
            "img"
        );


    if(!imageElement) return;


    imageElement.addEventListener(
        "error",
        function(){

            this.style.display =
                "none";


            const parent =
                this.parentElement;


            if(!parent) return;


            if(
                parent.querySelector(
                    ".collection-image-fallback"
                )
            ){

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
                        title
                    )}
                </strong>

            `;


            parent.prepend(
                fallback
            );

        },
        {
            once:true
        }
    );

}


/* ==========================================
   GRACEFUL FALLBACK
========================================== */

function renderGracefulFallback(){

    const grid =
        document.getElementById(
            "collectionsGrid"
        );


    if(!grid) return;


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
                Explore our Gold, Silver and
                premium jewellery collections.
            </p>


            <a
                href="collections.html"
                class="card-btn premium-collection-btn"
            >
                Explore Collections
            </a>

        </div>

    `;


    injectPremiumStyles();

}


/* ==========================================
   PREMIUM STYLES
   ------------------------------------------
   ONE CLEAN CSS SYSTEM

   IMPORTANT:
   Product image gets larger visual area.
   object-fit: contain preserves jewellery.
========================================== */

function injectPremiumStyles(){

    if(
        document.getElementById(
            "suvarna-collections-final-css"
        )
    ){

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
           LINK
        ====================================== */

        .premium-collection-link{

            display:block;

            height:100%;

            color:inherit;

            text-decoration:none;

        }


        /* ======================================
           CARD
        ====================================== */

        .premium-collection-card{

            position:relative;

            display:flex;

            flex-direction:column;

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
                transform .35s ease,
                box-shadow .35s ease,
                border-color .35s ease;

        }


        .premium-collection-link:hover
        .premium-collection-card{

            transform:
                translateY(-5px);

            border-color:
                rgba(180,145,75,.35);

            box-shadow:
                0 19px 42px
                rgba(43,0,21,.13);

        }


        /* ======================================
           IMAGE AREA

           Larger image area so jewellery does
           NOT look tiny.
        ====================================== */

        .premium-collection-image{

            position:relative;

            width:100%;

            aspect-ratio:
                1 / 1.04;

            overflow:hidden;

            padding:8px;

            background:
                #eee3d2;

        }


        /* ======================================
           INNER IVORY STAGE
        ====================================== */

        .premium-collection-image::before{

            content:"";

            position:absolute;

            inset:10px;

            border-radius:
                20px 20px 34px 34px;

            background:
                linear-gradient(
                    145deg,
                    #fffefa 0%,
                    #eee2d1 100%
                );

            box-shadow:
                inset
                0 0 0 1px
                rgba(180,145,75,.11);

            pointer-events:none;

        }


        /* ======================================
           PRODUCT IMAGE
        ====================================== */

        .premium-collection-image img{

            position:relative;

            z-index:1;

            display:block;

            width:100%;

            height:100%;

            object-fit:contain;

            object-position:center;

            /*
             * Reduced padding = jewellery
             * appears larger.
             */

            padding:5px;

            border-radius:
                20px 20px 34px 34px;

            transition:
                transform .55s ease;

        }


        .premium-collection-link:hover
        .premium-collection-image img{

            transform:
                scale(1.035);

        }


        /* ======================================
           IMAGE OVERLAY
        ====================================== */

        .collection-image-overlay{

            position:absolute;

            z-index:2;

            inset:10px;

            border-radius:
                20px 20px 34px 34px;

            pointer-events:none;

            background:
                linear-gradient(
                    180deg,
                    rgba(255,255,255,.04),
                    transparent 55%,
                    rgba(43,0,21,.035)
                );

        }


        /* ======================================
           CATEGORY
        ====================================== */

        .collection-category-label{

            position:absolute;

            z-index:3;

            left:20px;

            bottom:20px;

            padding:
                6px 10px;

            border-radius:999px;

            color:#fff;

            background:
                rgba(43,0,21,.70);

            border:
                1px solid
                rgba(255,255,255,.28);

            backdrop-filter:
                blur(8px);

            -webkit-backdrop-filter:
                blur(8px);

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:7px;

            font-weight:600;

            letter-spacing:
                1.45px;

            text-transform:
                uppercase;

        }


        /* ======================================
           METAL BADGE
        ====================================== */

        .collection-metal-badge{

            position:absolute;

            z-index:4;

            top:18px;

            right:18px;

            padding:
                6px 9px;

            border-radius:999px;

            color:#e1c46d;

            background:
                rgba(43,0,21,.76);

            border:
                1px solid
                rgba(212,175,55,.30);

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

        .premium-collection-content{

            position:relative;

            flex:1;

            padding:
                16px
                17px
                18px;

        }


        .collection-number{

            display:block;

            margin-bottom:6px;

            color:#a27b2c;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:8px;

            letter-spacing:
                1.8px;

        }


        .premium-collection-content h3{

            margin:
                0 0 5px;

            color:#2b0015;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:17px;

            font-weight:600;

            line-height:1.3;

        }


        .premium-collection-content p{

            margin:
                0 0 12px;

            color:#75686c;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:10px;

            line-height:1.5;

        }


        /* ======================================
           BUTTON
        ====================================== */

        .premium-collection-btn{

            display:inline-flex;

            align-items:center;

            justify-content:center;

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
                rgba(255,255,255,.55);

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


        .premium-collection-btn span{

            display:inline-flex;

            align-items:center;

            justify-content:center;

            width:19px;

            height:19px;

            border-radius:50%;

            color:#fff;

            background:#2b0015;

            font-size:12px;

            line-height:1;

            transition:
                transform .3s ease,
                background .3s ease;

        }


        .premium-collection-link:hover
        .premium-collection-btn{

            color:#fff;

            background:#2b0015;

            border-color:#2b0015;

        }


        .premium-collection-link:hover
        .premium-collection-btn span{

            color:#2b0015;

            background:#d4af37;

            transform:
                translateX(3px);

        }


        /* ======================================
           FALLBACK IMAGE
        ====================================== */

        .collection-image-fallback{

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
                20px 20px 34px 34px;

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


        .collection-image-fallback span{

            margin-bottom:10px;

            color:#d4af37;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:7px;

            letter-spacing:3px;

        }


        .collection-image-fallback strong{

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

        .collections-loading{

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

            font-size:9px;

            letter-spacing:2px;

            text-transform:uppercase;

        }


        .collections-loading-line{

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


        @keyframes suvarnaCollectionLoading{

            0%,
            100%{

                transform:
                    scaleX(.35);

                opacity:.4;

            }

            50%{

                transform:
                    scaleX(1);

                opacity:1;

            }

        }


        /* ======================================
           EMPTY STATE
        ====================================== */

        .collections-graceful-state{

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


        .collections-graceful-state span{

            margin-bottom:10px;

            color:#b18a38;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:8px;

            letter-spacing:3px;

        }


        .collections-graceful-state h3{

            margin:
                0 0 8px;

            color:#2b0015;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:24px;

        }


        .collections-graceful-state p{

            max-width:500px;

            margin:
                0 0 18px;

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

        @media(max-width:700px){

            .premium-collection-card{

                border-radius:18px;

            }


            .premium-collection-image{

                aspect-ratio:
                    1 / 1.02;

                padding:7px;

            }


            .premium-collection-image::before{

                inset:9px;

                border-radius:
                    17px 17px 28px 28px;

            }


            .premium-collection-image img{

                padding:3px;

                border-radius:
                    17px 17px 28px 28px;

            }


            .collection-image-overlay{

                inset:9px;

                border-radius:
                    17px 17px 28px 28px;

            }


            .collection-category-label{

                left:17px;

                bottom:17px;

                padding:
                    5px 8px;

                font-size:6.5px;

            }


            .collection-metal-badge{

                top:14px;

                right:14px;

                padding:
                    5px 7px;

                font-size:6.5px;

            }


            .premium-collection-content{

                padding:
                    13px
                    13px
                    15px;

            }


            .premium-collection-content h3{

                font-size:14px;

            }


            .premium-collection-content p{

                font-size:9px;

            }


            .premium-collection-btn{

                min-height:30px;

                padding:
                    0 10px;

                font-size:7px;

            }


            .premium-collection-btn span{

                width:18px;

                height:18px;

                font-size:11px;

            }

        }


        /* ======================================
           REDUCED MOTION
        ====================================== */

        @media(prefers-reduced-motion:reduce){

            .premium-collection-card,
            .premium-collection-image img,
            .premium-collection-btn,
            .premium-collection-btn span{

                transition:none !important;

            }


            .collections-loading-line{

                animation:none !important;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* ==========================================
   SAFE HTML ESCAPE
========================================== */

function escapeHtml(
    value
){

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
   RETRY
========================================== */

window.retryCollections =
    function(){

        /*
         * Reset search state so retry
         * never gets blocked.
         */

        const search =
            document.getElementById(
                "collectionSearch"
            ) ||
            document.getElementById(
                "searchInput"
            );


        if(search){

            delete search.dataset.initialized;

        }


        initCollectionsHome();

    };
