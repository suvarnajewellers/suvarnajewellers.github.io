/* ==========================================
   SUVARNA JEWELLERS V9
   COLLECTIONS-HOME.JS
   PREMIUM + STABLE + GRACEFUL FALLBACK
========================================== */

document.addEventListener("DOMContentLoaded", initCollectionsHome);

let allProducts = [];


/* ==========================================
   STATIC COLLECTION FALLBACK
   Used only when product data is unavailable.
========================================== */

const COLLECTION_FALLBACK = [
    {
        name: "Gold Jewellery",
        category: "Gold Jewellery",
        image: "assets/images/gold-jewellery-1.jpg",
        link: "gold-jewellery.html"
    },
    {
        name: "Silver Jewellery",
        category: "Silver Jewellery",
        image: "assets/images/silver-jewellery-1.jpg",
        link: "silver-jewellery.html"
    },
    {
        name: "Rudraksha Mala",
        category: "Rudraksha Mala",
        image: "assets/images/rudraksha-mala-1.jpg",
        link: "rudraksha-mala.html"
    },
    {
        name: "Pendants",
        category: "Pendant",
        image: "assets/images/pendant-1.jpg",
        link: "pendant-collection.html"
    },
    {
        name: "Bracelets",
        category: "Rudraksha Bracelet",
        image: "assets/images/bracelet-1.jpg",
        link: "bracelet-collection.html"
    }
];


/* ==========================================
   INITIALIZE COLLECTIONS
========================================== */

async function initCollectionsHome(){

    const grid =
        document.getElementById("collectionsGrid");

    if(!grid){
        console.warn("Collections grid not found.");
        return;
    }


    /* ------------------------------------------
       Loading state
    ------------------------------------------ */

    grid.innerHTML = `
        <div class="empty-state">
            <h3>Loading Collections...</h3>
            <p>Please wait...</p>
        </div>
    `;


    try{

        /* ------------------------------------------
           Existing API ONLY
           No duplicate product loading
        ------------------------------------------ */

        if(typeof getProducts !== "function"){

            console.warn(
                "getProducts() is not available."
            );

            renderFallbackCollections();
            return;

        }


        /* ------------------------------------------
           Load through existing api.js system
        ------------------------------------------ */

        const products = await getProducts();


        /* ------------------------------------------
           Validate response
        ------------------------------------------ */

        if(!Array.isArray(products)){

            console.warn(
                "Collections received invalid product data."
            );

            renderFallbackCollections();
            return;

        }


        allProducts = products;


        /* ------------------------------------------
           Product data available
        ------------------------------------------ */

        if(products.length > 0){

            renderCollections(products);

        }

        else{

            /*
             * IMPORTANT:
             * Do NOT show "Temporarily Unavailable".
             * api.js intentionally returns [] on loading
             * failure, so homepage gets a graceful fallback.
             */

            renderFallbackCollections();

        }


        initSearch();

    }

    catch(error){

        /*
         * Collections must NEVER break the homepage.
         */

        console.error(
            "Collections Loading Error:",
            error
        );

        allProducts = [];

        renderFallbackCollections();

        initSearch();

    }

}


/* ==========================================
   RENDER PRODUCT COLLECTIONS
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


    grid.innerHTML = "";


    if(
        !Array.isArray(products) ||
        products.length === 0
    ){

        renderFallbackCollections();
        return;

    }


    /* ------------------------------------------
       Render products
    ------------------------------------------ */

    products.forEach(product => {

        if(!product) return;


        const id =
            product.id ?? "";

        const name =
            product.name || "Suvarna Jewellery";

        const category =
            product.category || "Jewellery";


        /* Safe image */

        let image =
            "assets/images/placeholder.jpg";


        try{

            if(
                product.image &&
                typeof getImage === "function"
            ){

                image = getImage(product.image);

            }
            else if(product.image){

                image = product.image;

            }

        }
        catch(error){

            console.warn(
                "Product image error:",
                error
            );

        }


        /* Product link */

        const card =
            document.createElement("a");

        card.href =
            `product.html?id=${encodeURIComponent(id)}`;

        card.className =
            "collection-link";


        card.innerHTML = `

            <div class="card">

                <div class="card-image">

                    <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(name)}"
                        loading="lazy"
                        decoding="async"
                        onerror="
                            this.onerror=null;
                            this.src='assets/images/placeholder.jpg';
                        "
                    >

                </div>

                <div class="card-content">

                    <h3>
                        ${escapeHtml(name)}
                    </h3>

                    <p>
                        ${escapeHtml(category)}
                    </p>

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
   GRACEFUL STATIC COLLECTION FALLBACK
========================================== */

function renderFallbackCollections(){

    const grid =
        document.getElementById("collectionsGrid");

    const count =
        document.getElementById("productCount");

    if(!grid) return;


    if(count){

        count.textContent = "5";

    }


    grid.innerHTML = "";


    COLLECTION_FALLBACK.forEach(collection => {

        const card =
            document.createElement("a");

        card.href =
            collection.link;

        card.className =
            "collection-link";


        card.innerHTML = `

            <div class="card">

                <div class="card-image">

                    <img
                        src="${escapeHtml(collection.image)}"
                        alt="${escapeHtml(collection.name)}"
                        loading="lazy"
                        decoding="async"
                        onerror="
                            this.onerror=null;
                            this.src='assets/images/placeholder.jpg';
                        "
                    >

                </div>

                <div class="card-content">

                    <h3>
                        ${escapeHtml(collection.name)}
                    </h3>

                    <p>
                        ${escapeHtml(collection.category)}
                    </p>

                    <div class="card-btn">
                        Explore Collection
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


            /* ------------------------------------------
               No search keyword
            ------------------------------------------ */

            if(!keyword){

                if(allProducts.length){

                    renderCollections(allProducts);

                }
                else{

                    renderFallbackCollections();

                }

                return;

            }


            /* ------------------------------------------
               Search product data
            ------------------------------------------ */

            if(!allProducts.length){

                renderFallbackSearch(keyword);
                return;

            }


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
   FALLBACK SEARCH
========================================== */

function renderFallbackSearch(keyword){

    const grid =
        document.getElementById("collectionsGrid");

    if(!grid) return;


    const filtered =
        COLLECTION_FALLBACK.filter(collection => {

            const name =
                collection.name.toLowerCase();

            const category =
                collection.category.toLowerCase();

            return (
                name.includes(keyword) ||
                category.includes(keyword)
            );

        });


    if(!filtered.length){

        grid.innerHTML = `
            <div class="empty-state">
                <h3>No Collection Found</h3>
                <p>
                    Try another collection name.
                </p>
            </div>
        `;

        return;

    }


    grid.innerHTML = "";


    filtered.forEach(collection => {

        const card =
            document.createElement("a");

        card.href =
            collection.link;

        card.className =
            "collection-link";


        card.innerHTML = `

            <div class="card">

                <div class="card-image">

                    <img
                        src="${escapeHtml(collection.image)}"
                        alt="${escapeHtml(collection.name)}"
                        loading="lazy"
                        decoding="async"
                        onerror="
                            this.onerror=null;
                            this.src='assets/images/placeholder.jpg';
                        "
                    >

                </div>

                <div class="card-content">

                    <h3>
                        ${escapeHtml(collection.name)}
                    </h3>

                    <p>
                        ${escapeHtml(collection.category)}
                    </p>

                    <div class="card-btn">
                        Explore Collection
                    </div>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* ==========================================
   SAFE HTML ESCAPE
========================================== */

function escapeHtml(value){

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   RETRY
========================================== */

window.retryCollections =
    function(){

        initCollectionsHome();

    };
