/* ==========================================
   SUVARNA JEWELLERS V9
   COLLECTIONS-HOME.JS
   FINAL PREMIUM + STABLE VERSION

   IMAGE SYSTEM:
   ------------------------------------------
   • Only existing product image paths are used.
   • Gold products may contain Rudraksha,
     Pendant, Bracelet etc.
   • Silver products may contain their related
     jewellery images.
   • NO separate category image folders assumed.
   • Existing getProducts() / getImage() system used.
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initCollectionsHome
);

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
   COLLECTION DISPLAY META
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
   INITIALIZE
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


    /* Loading */

    grid.innerHTML = `
        <div class="collections-loading">
            <span class="collections-loading-line"></span>
            <span>Curating Collections</span>
        </div>
    `;


    try{

        /* --------------------------------------
           EXISTING API ONLY
        -------------------------------------- */

        if(
            typeof getProducts !== "function"
        ){

            console.warn(
                "getProducts() is not available."
            );

            renderGracefulFallback();

            return;

        }


        /* --------------------------------------
           LOAD PRODUCTS
        -------------------------------------- */

        const products =
            await getProducts();


        if(!Array.isArray(products)){

            console.warn(
                "Invalid products response."
            );

            renderGracefulFallback();

            return;

        }


        allProducts =
            products.filter(Boolean);


        /* --------------------------------------
           RENDER
        -------------------------------------- */

        renderCollections(
            allProducts
        );


        initSearch();

    }

    catch(error){

        console.error(
            "Collections Loading Error:",
            error
        );

        allProducts = [];

        renderGracefulFallback();

        initSearch();

    }

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


    products.forEach(product => {

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

    });


    const collections = [];


    /* Preferred order */

    COLLECTION_ORDER.forEach(
        category => {

            if(grouped[category]){

                collections.push({

                    category: category,

                    products:
                        grouped[category]

                });

            }

        }
    );


    /* Any other categories */

    Object.keys(grouped).forEach(
        category => {

            if(
                !COLLECTION_ORDER.includes(
                    category
                )
            ){

                collections.push({

                    category: category,

                    products:
                        grouped[category]

                });

            }

        }
    );


    return collections;

}


/* ==========================================
   GET REAL PRODUCT IMAGE
========================================== */

/*
   IMPORTANT:

   We DO NOT construct:

   gold/pendant.jpg
   silver/bracelet.jpg
   rudraksha/...
   
   Instead we use the exact image path
   already stored in the product data.

   Therefore Gold/Silver folders can contain
   ANY type of jewellery.
*/

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


        /* --------------------------------------
           Standard existing field
        -------------------------------------- */

        if(product.image){

            rawImage =
                product.image;

        }


        /* --------------------------------------
           Optional images array support
        -------------------------------------- */

        else if(
            Array.isArray(product.images) &&
            product.images.length
        ){

            rawImage =
                product.images[0];

        }


        if(!rawImage) continue;


        /* --------------------------------------
           Use existing getImage()
        -------------------------------------- */

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


        /*
         * If getImage() is unavailable or
         * doesn't resolve, use the actual
         * product.image value as-is.
         */

        return rawImage;

    }


    return "";

}


/* ==========================================
   RENDER COLLECTIONS
========================================== */

function renderCollections(
    products
){

    const grid =
        document.getElementById(
            "collectionsGrid"
        );

    const count =
        document.getElementById(
            "productCount"
        );


    if(!grid) return;


    const collections =
        buildCollections(
            products
        );


    /* Product count */

    if(count){

        count.textContent =
            Array.isArray(products)
                ? products.length
                : 0;

    }


    grid.innerHTML = "";


    /* --------------------------------------
       No product data
    -------------------------------------- */

    if(!collections.length){

        renderGracefulFallback();

        return;

    }


    /* --------------------------------------
       Create collection cards
    -------------------------------------- */

    collections.forEach(
        (collection, index) => {

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


            /*
             * IMPORTANT:
             * Image comes from an ACTUAL product.
             *
             * It does not matter whether the
             * image physically lives inside
             * /gold/ or /silver/.
             */

            const image =
                getRealProductImage(
                    collection.products
                );

            /* --------------------------------------
   OPEN FULL COLLECTION
   --------------------------------------
   Collection card must open the complete
   collection, NOT the first product.
-------------------------------------- */

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
                            ).padStart(2, "0")}
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


            /* ----------------------------------
               Image error fallback
            ---------------------------------- */

            const imageElement =
                card.querySelector(
                    "img"
                );


            if(imageElement){

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
                                    meta.title
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


    injectPremiumStyles();

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
                class="card-btn"
            >
                Explore Collections
            </a>

        </div>

    `;


    injectPremiumStyles();

}


/* ==========================================
   SEARCH
========================================== */
function initSearch(){

    const search =
        document.getElementById(
            "collectionSearch"
        );

    if(!search) return;

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
                this.value
                    .trim()
                    .toLowerCase();

            /* -----------------------------
               EMPTY SEARCH
            ----------------------------- */

            if(!keyword){

                renderCollections(
                    allProducts
                );

                return;

            }


            /* -----------------------------
               SEARCH ALL PRODUCTS
               NAME + CATEGORY + METAL
            ----------------------------- */

            const filtered =
                allProducts.filter(
                    product => {

                        if(!product){
                            return false;
                        }

                        const name =
                            String(
                                product.name || ""
                            )
                            .toLowerCase()
                            .trim();

                        const category =
                            String(
                                product.category || ""
                            )
                            .toLowerCase()
                            .trim();

                        const metal =
                            String(
                                product.metal || ""
                            )
                            .toLowerCase()
                            .trim();


                        return (
                            name.includes(keyword) ||
                            category.includes(keyword) ||
                            metal.includes(keyword)
                        );

                    }
                );


            /* -----------------------------
               SHOW EVERY MATCHING PRODUCT
               NOT ONLY COLLECTION CARD
            ----------------------------- */

            renderSearchProducts(
                filtered
            );

        }
    );

}
/* ==========================================
   RENDER SEARCH RESULTS
   SHOW ALL MATCHING PRODUCTS
========================================== */

function renderSearchProducts(products){

    const grid =
        document.getElementById(
            "collectionsGrid"
        );

    if(!grid) return;


    grid.innerHTML = "";


    /* --------------------------------------
       NO RESULTS
    -------------------------------------- */

    if(
        !Array.isArray(products) ||
        !products.length
    ){

        grid.innerHTML = `

            <div class="collections-graceful-state">

                <span>
                    SUVARNA JEWELLERS
                </span>

                <h3>
                    No Jewellery Found
                </h3>

                <p>
                    No products match your search.
                    Please try another product,
                    category or metal.
                </p>

            </div>

        `;

        return;

    }


    /* --------------------------------------
       SHOW ALL MATCHING PRODUCTS
       NO .slice()
       NO 5 PRODUCT LIMIT
    -------------------------------------- */

    products.forEach(
        product => {

            if(!product) return;


            const image =
                getRealProductImage([
                    product
                ]);


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
                                alt="${escapeHtml(
                                    product.name || ""
                                )}"
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
                                        product.name || "Jewellery"
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
                                product.category || ""
                            )}
                        </span>

                    </div>


                    <div
                        class="card-content premium-collection-content"
                    >

                        <span
                            class="collection-number"
                        >
                            ${escapeHtml(
                                product.metal || ""
                            )}
                        </span>


                        <h3>
                            ${escapeHtml(
                                product.name || "Jewellery"
                            )}
                        </h3>


                        <p>
                            ${escapeHtml(
                                product.category || ""
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


            /* ----------------------------------
               IMAGE ERROR FALLBACK
            ---------------------------------- */

            const imageElement =
                card.querySelector(
                    "img"
                );


            if(imageElement){

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
                                    product.name || "Jewellery"
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

}
/* ==========================================
   PREMIUM COLLECTION STYLES
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

        /* --------------------------------------
           COLLECTION CARD
        -------------------------------------- */

        .premium-collection-link{

            display:block;
            height:100%;
            color:inherit;
            text-decoration:none;

        }


        .premium-collection-card{

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
                box-shadow .45s ease;

        }


        .premium-collection-link:hover
        .premium-collection-card{

            transform:
                translateY(-7px);

            box-shadow:
                0 24px 55px
                rgba(43,0,21,.17);

        }


        /* --------------------------------------
           IMAGE
        -------------------------------------- */

        .premium-collection-image{

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


        .premium-collection-image img{

            display:block;

            width:100%;
            height:285px;

            object-fit:cover;
            object-position:center;

            transition:
                transform .7s ease;

        }


        .premium-collection-link:hover
        .premium-collection-image img{

            transform:
                scale(1.045);

        }


        .collection-image-overlay{

            position:absolute;
            inset:0;

            pointer-events:none;

            background:
                linear-gradient(
                    180deg,
                    rgba(43,0,21,0) 45%,
                    rgba(43,0,21,.30) 100%
                );

        }


        .collection-category-label{

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
                sans-serif;

            font-size:9px;

            letter-spacing:
                1.8px;

            text-transform:
                uppercase;

        }


        /* --------------------------------------
           CONTENT
        -------------------------------------- */

        .premium-collection-content{

            position:relative;

            padding:
                21px
                21px
                23px;

        }


        .collection-number{

            display:block;

            margin-bottom:8px;

            color:#b18a38;

            font-family:
                Cinzel,
                serif;

            font-size:10px;

            letter-spacing:2px;

        }


        .premium-collection-content h3{

            margin:
                0 0 7px;

            color:#2b0015;

            font-family:
                Cinzel,
                serif;

            font-size:21px;

            font-weight:600;

            line-height:1.3;

        }


        .premium-collection-content p{

            margin:
                0 0 17px;

            color:#675b60;

            font-family:
                Inter,
                sans-serif;

            font-size:12.5px;

            line-height:1.6;

        }


        .premium-collection-btn{

            display:inline-flex;

            align-items:center;

            gap:9px;

            color:#8d6824;

            font-family:
                Inter,
                sans-serif;

            font-size:10px;

            font-weight:600;

            letter-spacing:1.25px;

            text-transform:
                uppercase;

        }


        .premium-collection-btn span{

            font-size:17px;

            transition:
                transform .3s ease;

        }


        .premium-collection-link:hover
        .premium-collection-btn span{

            transform:
                translateX(4px);

        }


        /* --------------------------------------
           IMAGE FALLBACK
        -------------------------------------- */

        .collection-image-fallback{

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


        .collection-image-fallback span{

            margin-bottom:11px;

            color:#d4af37;

            font-family:
                Inter,
                sans-serif;

            font-size:8px;

            letter-spacing:3px;

        }


        .collection-image-fallback strong{

            color:#fff;

            font-family:
                Cinzel,
                serif;

            font-size:24px;

            font-weight:500;

        }


        /* --------------------------------------
           LOADING
        -------------------------------------- */

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
                sans-serif;

            font-size:10px;

            letter-spacing:2px;

            text-transform:
                uppercase;

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


        /* --------------------------------------
           GRACEFUL EMPTY
        -------------------------------------- */

        .collections-graceful-state{

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


        .collections-graceful-state span{

            margin-bottom:10px;

            color:#b18a38;

            font-family:
                Inter,
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
                serif;

            font-size:24px;

        }


        .collections-graceful-state p{

            max-width:500px;

            margin:
                0 0 19px;

            color:#675b60;

            font-family:
                Inter,
                sans-serif;

            font-size:13px;

            line-height:1.7;

        }


        /* --------------------------------------
           MOBILE
        -------------------------------------- */

        @media(max-width:700px){

            .premium-collection-image{

                min-height:240px;

            }


            .premium-collection-image img{

                height:240px;

            }


            .collection-image-fallback{

                height:240px;

            }


            .premium-collection-content{

                padding:
                    18px
                    18px
                    20px;

            }


            .premium-collection-content h3{

                font-size:19px;

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

function escapeHtml(value){

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

        initCollectionsHome();

    };
