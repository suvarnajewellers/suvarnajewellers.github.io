/* ==========================================
   SUVARNA JEWELLERS
   COLLECTIONS.JS
   FINAL PREMIUM PRODUCT COLLECTION SYSTEM
   ------------------------------------------
   • Same product card language as Search
   • All products included
   • Category filtering
   • Search across all products
   • Existing getProducts()
   • Existing getImage()
   • No duplicate API
   • No fixed product limit
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initCollectionPage
);


/* ==========================================
   MAIN
========================================== */

async function initCollectionPage(){

    const grid =
        document.getElementById(
            "collectionsGrid"
        );

    const searchInput =
        document.getElementById(
            "collectionSearch"
        );

    const count =
        document.getElementById(
            "productCount"
        );


    if(!grid){

        console.warn(
            "collectionsGrid not found."
        );

        return;

    }


    let allProducts = [];


    /* ======================================
       LOAD PRODUCTS
    ====================================== */

    try{

        if(
            typeof getProducts !== "function"
        ){

            console.error(
                "getProducts() is not available."
            );

            renderEmpty();

            return;

        }


        const products =
            await getProducts();


        allProducts =
            Array.isArray(products)
                ? products.filter(Boolean)
                : [];


    }

    catch(error){

        console.error(
            "Collection products loading error:",
            error
        );

        renderEmpty();

        return;

    }


    /* ======================================
       URL CATEGORY
       --------------------------------------
       Supports:
       collections.html?category=Gold%20Jewellery
    ====================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const requestedCategory =
        String(
            params.get("category") || ""
        )
        .trim()
        .toLowerCase();


    /* ======================================
       CATEGORY FILTER
    ====================================== */

    function getCategoryProducts(){

        if(!requestedCategory){

            return allProducts;

        }


        return allProducts.filter(
            product => {

                const category =
                    String(
                        product.category || ""
                    )
                    .trim()
                    .toLowerCase();


                return (
                    category ===
                    requestedCategory
                );

            }
        );

    }


    /* ======================================
       SEARCH TEXT
       --------------------------------------
       Same philosophy as Search
    ====================================== */

    function searchableText(product){

        return [

            product.name,

            product.category,

            product.metal,

            product.description,

            product.size,

            product.netWeight,

            product.grossWeight,

            product.id

        ]
        .filter(
            value =>
                value !== null &&
                value !== undefined
        )
        .map(
            value =>
                String(value)
        )
        .join(" ")
        .toLowerCase();

    }


    /* ======================================
       SAFE ESCAPE
    ====================================== */

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


    /* ======================================
       PRODUCT IMAGE
    ====================================== */

    function getProductImage(product){

        if(!product){

            return "";

        }


        let rawImage = "";


        if(product.image){

            rawImage =
                product.image;

        }

        else if(
            Array.isArray(product.images) &&
            product.images.length
        ){

            rawImage =
                product.images[0];

        }


        if(!rawImage){

            return "";

        }


        try{

            if(
                typeof getImage ===
                "function"
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


        return rawImage;

    }


    /* ======================================
       RENDER
       --------------------------------------
       THIS IS THE IMPORTANT PART

       Collection cards now use the same
       premium visual structure as the
       Search product cards.
    ====================================== */

    function renderProducts(products){

        grid.innerHTML = "";


        if(count){

            count.textContent =
                Array.isArray(products)
                    ? products.length
                    : 0;

        }


        if(
            !Array.isArray(products) ||
            !products.length
        ){

            renderEmpty();

            return;

        }


        products.forEach(
            (product,index) => {

                if(!product) return;


                const image =
                    getProductImage(
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


                const id =
                    product.id != null
                        ?
                        encodeURIComponent(
                            product.id
                        )
                        :
                        "";


                const href =
                    id
                        ?
                        `product.html?id=${id}&from=collection`
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


                card.setAttribute(
                    "aria-label",
                    `View ${name}`
                );


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
                                    alt="${escapeHtml(name)}"
                                    loading="lazy"
                                    decoding="async"
                                    draggable="false"
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
                                        ${escapeHtml(name)}
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
                                ${escapeHtml(category)}
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
                                ).padStart(2,"0")}
                            </span>


                            <h3>
                                ${escapeHtml(name)}
                            </h3>


                            <p>
                                ${escapeHtml(category)}
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
                   IMAGE ERROR
                ================================= */

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


                            if(!parent){

                                return;

                            }


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
                                    ${escapeHtml(name)}
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


                grid.appendChild(
                    card
                );

            }
        );


        injectPremiumStyles();

    }


    /* ======================================
       SEARCH
       --------------------------------------
       IMPORTANT:

       Empty search =
       Current Collection

       Search text =
       ALL PRODUCTS
    ====================================== */

    function applySearch(){

        if(!searchInput){

            renderProducts(
                getCategoryProducts()
            );

            return;

        }


        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();


        /* -------------------------------
           EMPTY SEARCH
        -------------------------------- */

        if(!keyword){

            renderProducts(
                getCategoryProducts()
            );

            return;

        }


        /* -------------------------------
           SEARCH ALL PRODUCTS
        -------------------------------- */

        const filtered =
            allProducts.filter(
                product => {

                    if(!product){

                        return false;

                    }


                    return searchableText(
                        product
                    ).includes(
                        keyword
                    );

                }
            );


        renderProducts(
            filtered
        );

    }


    /* ======================================
       FIRST RENDER
    ====================================== */

    renderProducts(
        getCategoryProducts()
    );


    /* ======================================
       SEARCH LISTENER
    ====================================== */

    if(searchInput){

        if(
            searchInput.dataset.initialized
            ===
            "true"
        ){

            return;

        }


        searchInput.dataset.initialized =
            "true";


        searchInput.addEventListener(
            "input",
            applySearch
        );

    }

}


/* ==========================================
   EMPTY STATE
========================================== */

function renderEmpty(){

    const grid =
        document.getElementById(
            "collectionsGrid"
        );


    const count =
        document.getElementById(
            "productCount"
        );


    if(count){

        count.textContent =
            "0";

    }


    if(!grid) return;


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


    injectPremiumStyles();

}


/* ==========================================
   PREMIUM CARD SYSTEM
   ------------------------------------------
   SEARCH-STYLE IVORY / CREAM LUXURY
========================================== */

function injectPremiumStyles(){

    if(
        document.getElementById(
            "suvarna-final-collection-card-css"
        )
    ){

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "suvarna-final-collection-card-css";


    style.textContent = `

        /* =====================================
           GRID
        ===================================== */

        #collectionsGrid{

            display:grid;

            grid-template-columns:
                repeat(
                    4,
                    minmax(0,1fr)
                );

            gap:24px;

            align-items:stretch;

        }


        /* =====================================
           CARD LINK
        ===================================== */

        #collectionsGrid
        .premium-collection-link{

            display:block;

            height:100%;

            color:inherit;

            text-decoration:none;

        }


        /* =====================================
           PREMIUM CARD
        ===================================== */

        #collectionsGrid
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
                rgba(
                    180,
                    145,
                    75,
                    .18
                );

            box-shadow:
                0 9px 28px
                rgba(
                    43,
                    0,
                    21,
                    .075
                );

            transition:
                transform .42s ease,
                box-shadow .42s ease,
                border-color .42s ease;

        }


        #collectionsGrid
        .premium-collection-link:hover
        .premium-collection-card{

            transform:
                translateY(-6px);

            border-color:
                rgba(
                    180,
                    145,
                    75,
                    .34
                );

            box-shadow:
                0 20px 44px
                rgba(
                    43,
                    0,
                    21,
                    .14
                );

        }


        /* =====================================
           IMAGE STAGE
        ===================================== */

        #collectionsGrid
        .premium-collection-image{

            position:relative;

            width:100%;

            aspect-ratio:1 / 1;

            overflow:hidden;

            padding:12px;

            background:
                #f0e5d5;

        }


        #collectionsGrid
        .premium-collection-image::before{

            content:"";

            position:absolute;

            inset:12px;

            border-radius:
                20px
                20px
                34px
                34px;

            background:
                linear-gradient(
                    145deg,
                    #fffefa 0%,
                    #eee1cf 100%
                );

            box-shadow:
                inset 0 0 0 1px
                rgba(
                    180,
                    145,
                    75,
                    .13
                );

            pointer-events:none;

        }


        /* =====================================
           PRODUCT IMAGE

           NO CROPPING
        ===================================== */

        #collectionsGrid
        .premium-collection-image img{

            position:relative;

            z-index:1;

            display:block;

            width:100%;

            height:100%;

            object-fit:contain;

            object-position:center;

            padding:18px;

            border-radius:
                20px
                20px
                34px
                34px;

            transition:
                transform .65s ease;

        }


        #collectionsGrid
        .premium-collection-link:hover
        .premium-collection-image img{

            transform:
                scale(1.035);

        }


        /* =====================================
           IMAGE OVERLAY
        ===================================== */

        #collectionsGrid
        .collection-image-overlay{

            position:absolute;

            z-index:2;

            inset:12px;

            border-radius:
                20px
                20px
                34px
                34px;

            pointer-events:none;

            background:
                linear-gradient(
                    180deg,
                    rgba(
                        255,
                        255,
                        255,
                        .055
                    ) 0%,

                    transparent 52%,

                    rgba(
                        43,
                        0,
                        21,
                        .035
                    ) 100%
                );

        }


        /* =====================================
           CATEGORY
        ===================================== */

        #collectionsGrid
        .collection-category-label{

            position:absolute;

            z-index:3;

            left:22px;

            bottom:22px;

            padding:
                6px 10px;

            border-radius:999px;

            color:#fff;

            background:
                rgba(
                    43,
                    0,
                    21,
                    .67
                );

            border:
                1px solid
                rgba(
                    255,
                    255,
                    255,
                    .28
                );

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
                1.45px;

            text-transform:
                uppercase;

        }


        /* =====================================
           METAL BADGE
        ===================================== */

        #collectionsGrid
        .collection-metal-badge{

            position:absolute;

            z-index:3;

            top:16px;

            right:16px;

            padding:
                6px 9px;

            border-radius:999px;

            color:#76551d;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .82
                );

            border:
                1px solid
                rgba(
                    180,
                    145,
                    75,
                    .25
                );

            backdrop-filter:
                blur(8px);

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:7px;

            font-weight:600;

            letter-spacing:
                1.1px;

            text-transform:
                uppercase;

        }


        /* =====================================
           CONTENT
        ===================================== */

        #collectionsGrid
        .premium-collection-content{

            position:relative;

            flex:1;

            padding:
                16px
                17px
                18px;

        }


        #collectionsGrid
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
                1.7px;

            text-transform:
                uppercase;

        }


        #collectionsGrid
        .premium-collection-content h3{

            margin:
                0 0 5px;

            color:#2b0015;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:16px;

            font-weight:600;

            line-height:1.32;

            display:
                -webkit-box;

            -webkit-line-clamp:2;

            -webkit-box-orient:
                vertical;

            overflow:hidden;

        }


        #collectionsGrid
        .premium-collection-content p{

            margin:
                0 0 12px;

            color:#786b6e;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:10px;

            line-height:1.45;

        }


        /* =====================================
           BUTTON
        ===================================== */

        #collectionsGrid
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
                rgba(
                    180,
                    145,
                    75,
                    .42
                );

            border-radius:999px;

            color:#76551d;

            background:
                rgba(
                    255,
                    255,
                    255,
                    .48
                );

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
                all .32s ease;

        }


        #collectionsGrid
        .premium-collection-btn span{

            display:inline-flex;

            align-items:center;

            justify-content:center;

            width:20px;

            height:20px;

            border-radius:50%;

            color:#fff;

            background:#2b0015;

            font-size:12px;

            transition:
                transform .3s ease;

        }


        #collectionsGrid
        .premium-collection-link:hover
        .premium-collection-btn{

            color:#fff;

            background:#2b0015;

            border-color:#2b0015;

        }


        #collectionsGrid
        .premium-collection-link:hover
        .premium-collection-btn span{

            color:#2b0015;

            background:#d4af37;

            transform:
                translateX(3px);

        }


        /* =====================================
           FALLBACK
        ===================================== */

        #collectionsGrid
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
                20px
                20px
                34px
                34px;

            color:#fff;

            background:
                radial-gradient(
                    circle at center,
                    rgba(
                        212,
                        175,
                        55,
                        .22
                    ),
                    transparent 58%
                ),
                linear-gradient(
                    145deg,
                    #3b071f,
                    #150008
                );

        }


        #collectionsGrid
        .collection-image-fallback span{

            margin-bottom:9px;

            color:#d4af37;

            font-family:
                Inter,
                Arial,
                sans-serif;

            font-size:7px;

            letter-spacing:2.5px;

        }


        #collectionsGrid
        .collection-image-fallback strong{

            color:#fff;

            font-family:
                Cinzel,
                Georgia,
                serif;

            font-size:20px;

            font-weight:500;

        }


        /* =====================================
           RESPONSIVE
        ===================================== */

        @media(max-width:1000px){

            #collectionsGrid{

                grid-template-columns:
                    repeat(
                        3,
                        minmax(0,1fr)
                    );

            }

        }


        @media(max-width:700px){

            #collectionsGrid{

                grid-template-columns:
                    repeat(
                        2,
                        minmax(0,1fr)
                    );

                gap:14px;

            }


            #collectionsGrid
            .premium-collection-card{

                border-radius:18px;

            }


            #collectionsGrid
            .premium-collection-image{

                padding:9px;

            }


            #collectionsGrid
            .premium-collection-image::before{

                inset:9px;

                border-radius:
                    17px
                    17px
                    27px
                    27px;

            }


            #collectionsGrid
            .premium-collection-image img{

                padding:13px;

                border-radius:
                    17px
                    17px
                    27px
                    27px;

            }


            #collectionsGrid
            .collection-image-overlay{

                inset:9px;

                border-radius:
                    17px
                    17px
                    27px
                    27px;

            }


            #collectionsGrid
            .collection-category-label{

                left:16px;

                bottom:16px;

                padding:
                    5px 7px;

                font-size:6px;

            }


            #collectionsGrid
            .collection-metal-badge{

                top:12px;

                right:12px;

                padding:
                    5px 7px;

                font-size:6px;

            }


            #collectionsGrid
            .premium-collection-content{

                padding:
                    12px
                    12px
                    14px;

            }


            #collectionsGrid
            .premium-collection-content h3{

                font-size:14px;

            }


            #collectionsGrid
            .premium-collection-content p{

                font-size:9px;

                margin-bottom:10px;

            }


            #collectionsGrid
            .premium-collection-btn{

                min-height:29px;

                padding:
                    0 9px;

                font-size:6.5px;

            }


            #collectionsGrid
            .premium-collection-btn span{

                width:18px;

                height:18px;

                font-size:11px;

            }

        }


        @media(max-width:380px){

            #collectionsGrid{

                gap:10px;

            }


            #collectionsGrid
            .premium-collection-content h3{

                font-size:13px;

            }

        }


        /* =====================================
           REDUCED MOTION
        ===================================== */

        @media(prefers-reduced-motion:reduce){

            #collectionsGrid
            .premium-collection-card,

            #collectionsGrid
            .premium-collection-image img,

            #collectionsGrid
            .premium-collection-btn span{

                transition:none !important;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}
