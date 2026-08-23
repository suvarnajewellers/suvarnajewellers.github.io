/* ==========================================
   SUVARNA JEWELLERS V9
   COLLECTIONS-HOME.JS
   PREMIUM + SAFE VERSION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initCollectionsHome
);

let allProducts = [];


/* ==========================================
   INIT COLLECTIONS
========================================== */

async function initCollectionsHome(){

    const grid =
        document.getElementById("collectionsGrid");

    if(!grid){

        return;

    }

    try{

        /* --------------------------------------
           CHECK API
        -------------------------------------- */

        if(typeof getProducts !== "function"){

            throw new Error(
                "getProducts() function is not available. Check api.js."
            );

        }


        /* --------------------------------------
           LOAD PRODUCTS
        -------------------------------------- */

        const products =
            await getProducts();


        /* --------------------------------------
           VALIDATE RESULT
        -------------------------------------- */

        if(!Array.isArray(products)){

            throw new Error(
                "Products data is not an array."
            );

        }


        allProducts = products;


        /* --------------------------------------
           RENDER
        -------------------------------------- */

        renderCollections(
            allProducts
        );


        /* --------------------------------------
           SEARCH
        -------------------------------------- */

        initSearch();


    }catch(error){

        console.error(
            "Collections Loading Error:",
            error
        );


        grid.innerHTML = `

            <div class="empty-state">

                <h3>
                    Unable to Load Products
                </h3>

                <p>
                    Please refresh the page and try again.
                </p>

            </div>

        `;

    }

}


/* ==========================================
   RENDER COLLECTIONS
========================================== */

function renderCollections(products){

    const grid =
        document.getElementById(
            "collectionsGrid"
        );


    if(!grid){

        return;

    }


    /* --------------------------------------
       PRODUCT COUNT
    -------------------------------------- */

    const count =
        document.getElementById(
            "productCount"
        );


    if(count){

        count.textContent =
            Array.isArray(products)
                ? products.length
                : 0;

    }


    /* --------------------------------------
       CLEAR GRID
    -------------------------------------- */

    grid.innerHTML = "";


    /* --------------------------------------
       EMPTY STATE
    -------------------------------------- */

    if(
        !Array.isArray(products) ||
        products.length === 0
    ){

        grid.innerHTML = `

            <div class="empty-state">

                <h3>
                    No Products Found
                </h3>

                <p>
                    Please check back soon for our
                    latest collections.
                </p>

            </div>

        `;

        return;

    }


    /* --------------------------------------
       CREATE CARDS
    -------------------------------------- */

    products.forEach(
        (product) => {

            if(!product){

                return;

            }


            /* ----------------------------------
               SAFE PRODUCT VALUES
            ---------------------------------- */

            const id =
                product.id ?? "";


            const name =
                product.name ||
                "Suvarna Jewellery";


            const category =
                product.category ||
                "Premium Collection";


            const image =
                product.image || "";


            /* ----------------------------------
               IMAGE HANDLING
            ---------------------------------- */

            let imageSrc = image;

            try{

                if(
                    typeof getImage === "function"
                ){

                    imageSrc =
                        getImage(image);

                }

            }catch(error){

                console.warn(
                    "Image path error:",
                    error
                );

                imageSrc = image;

            }


            /* ----------------------------------
               CARD
            ---------------------------------- */

            const card =
                document.createElement("a");


            card.href =
                `product.html?id=${encodeURIComponent(id)}`;


            card.className =
                "collection-link";


            card.innerHTML = `

                <div class="card">

                    <img
                        src="${imageSrc}"
                        alt="${escapeHTML(name)}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.style.opacity='0.35';"
                    >

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(category)}
                    </p>

                    <div class="card-btn">
                        View Product
                    </div>

                </div>

            `;


            grid.appendChild(card);

        }
    );

}


/* ==========================================
   SEARCH
========================================== */

function initSearch(){

    const search =
        document.getElementById(
            "collectionSearch"
        );


    if(!search){

        return;

    }


    /* --------------------------------------
       PREVENT DUPLICATE LISTENER
    -------------------------------------- */

    if(search.dataset.collectionsSearchBound){

        return;

    }


    search.dataset.collectionsSearchBound =
        "true";


    search.addEventListener(
        "input",
        function(){

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();


            /* ----------------------------------
               EMPTY SEARCH
            ---------------------------------- */

            if(!keyword){

                renderCollections(
                    allProducts
                );

                return;

            }


            /* ----------------------------------
               FILTER
            ---------------------------------- */

            const filtered =
                allProducts.filter(
                    (product) => {

                        if(!product){

                            return false;

                        }


                        const name =
                            String(
                                product.name || ""
                            ).toLowerCase();


                        const category =
                            String(
                                product.category || ""
                            ).toLowerCase();


                        const metal =
                            String(
                                product.metal || ""
                            ).toLowerCase();


                        return (
                            name.includes(keyword) ||
                            category.includes(keyword) ||
                            metal.includes(keyword)
                        );

                    }
                );


            renderCollections(
                filtered
            );

        }
    );

}


/* ==========================================
   HTML SAFETY
========================================== */

function escapeHTML(value){

    return String(value ?? "")
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
