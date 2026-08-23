/* ==========================================
   SUVARNA JEWELLERS V9
   COLLECTIONS-HOME.JS
   PREMIUM + STABLE VERSION
========================================== */

document.addEventListener("DOMContentLoaded", initCollectionsHome);

let allProducts = [];


/* ==========================================
   INITIALIZE COLLECTIONS
========================================== */

async function initCollectionsHome(){

    const grid = document.getElementById("collectionsGrid");

    if(!grid){
        console.warn("Collections grid not found.");
        return;
    }

    /* Loading state */

    grid.innerHTML = `
        <div class="empty-state">
            <h3>Loading Collections...</h3>
            <p>Please wait...</p>
        </div>
    `;

    try{

        /* Make sure product API exists */

        if(typeof getProducts !== "function"){

            throw new Error(
                "getProducts() is not available. Check api.js loading order."
            );

        }

        /* Load products */

        allProducts = await getProducts();

        /* Validate response */

        if(!Array.isArray(allProducts)){

            throw new Error(
                "Invalid products data."
            );

        }

        /* Render */

        renderCollections(allProducts);

        /* Search */

        initSearch();

    }

    catch(error){

        console.error(
            "Collections Loading Error:",
            error
        );

        grid.innerHTML = `
            <div class="empty-state">
                <h3>Collections Temporarily Unavailable</h3>
                <p>
                    We are unable to load the collection right now.
                    Please refresh the page and try again.
                </p>

                <button
                    type="button"
                    class="card-btn"
                    onclick="location.reload()">
                    Retry
                </button>
            </div>
        `;

    }

}


/* ==========================================
   RENDER COLLECTIONS
========================================== */

function renderCollections(products){

    const grid =
        document.getElementById("collectionsGrid");

    const count =
        document.getElementById("productCount");

    if(!grid) return;


    /* Product count */

    if(count){

        count.textContent =
            Array.isArray(products)
                ? products.length
                : 0;

    }


    /* Clear grid */

    grid.innerHTML = "";


    /* Empty state */

    if(
        !Array.isArray(products) ||
        products.length === 0
    ){

        grid.innerHTML = `
            <div class="empty-state">
                <h3>No Products Found</h3>
                <p>
                    Please check back soon for our latest collection.
                </p>
            </div>
        `;

        return;

    }


    /* Render products */

    products.forEach(product => {

        if(!product) return;


        const id =
            product.id ?? "";

        const name =
            product.name ?? "Suvarna Jewellery";

        const category =
            product.category ?? "Jewellery";


        /* Safe image handling */

        let image = "";

        try{

            if(typeof getImage === "function"){

                image =
                    getImage(product.image);

            }

            else{

                image =
                    product.image ||
                    "assets/images/placeholder.jpg";

            }

        }

        catch(error){

            console.warn(
                "Product image error:",
                error
            );

            image =
                product.image ||
                "assets/images/placeholder.jpg";

        }


        /* Create card */

        const card = document.createElement("a");

        card.href =
            `product.html?id=${encodeURIComponent(id)}`;

        card.className =
            "collection-link";


        card.innerHTML = `

            <div class="card">

                <div class="card-image">

                    <img
                        src="${image}"
                        alt="${name}"
                        loading="lazy"
                        onerror="
                            this.onerror=null;
                            this.src='assets/images/placeholder.jpg';
                        "
                    >

                </div>

                <div class="card-content">

                    <h3>${name}</h3>

                    <p>${category}</p>

                    <div class="card-btn">
                        View Product
                    </div>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* ==========================================
   COLLECTION SEARCH
========================================== */

function initSearch(){

    const search =
        document.getElementById("collectionSearch");

    if(!search) return;


    /* Prevent duplicate listeners */

    if(search.dataset.initialized === "true"){
        return;
    }

    search.dataset.initialized = "true";


    search.addEventListener(
        "input",
        function(){

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();


            /* Show all products */

            if(!keyword){

                renderCollections(allProducts);

                return;

            }


            /* Filter */

            const filtered =
                allProducts.filter(product => {

                    if(!product) return false;


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

                });


            renderCollections(filtered);

        }
    );

}


/* ==========================================
   RETRY FUNCTION
========================================== */

window.retryCollections =
    function(){

        initCollectionsHome();

    };
