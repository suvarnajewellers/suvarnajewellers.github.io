/* ==========================================
   SUVARNA JEWELLERS
   COLLECTIONS-HOME.JS
   PREMIUM V2
========================================== */

document.addEventListener("DOMContentLoaded", initCollectionsHome);

let allProducts = [];


/* ==========================================
   INITIALIZE COLLECTIONS
========================================== */

async function initCollectionsHome(){

    const grid = document.getElementById("collectionsGrid");

    if(!grid){
        console.warn("collectionsGrid not found.");
        return;
    }

    try{

        // Load products safely
        allProducts = await getProducts();

        // Make sure we always have an array
        if(!Array.isArray(allProducts)){
            allProducts = [];
        }

        // Render products
        renderCollections(allProducts);

        // Initialize search
        initSearch();

    }

    catch(error){

        console.error(
            "Collections Products Loading Error:",
            error
        );

        showCollectionsError(grid);

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


    /* --------------------------------------
       PRODUCT COUNT
    -------------------------------------- */

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

    if(!Array.isArray(products) || products.length === 0){

        grid.innerHTML = `

            <div class="empty-state">

                <h3>No Products Found</h3>

                <p>
                    Please try another search.
                </p>

            </div>

        `;

        return;

    }


    /* --------------------------------------
       CREATE PRODUCT CARDS
    -------------------------------------- */

    products.forEach(product => {

        if(!product) return;


        const productId =
            product.id ?? "";


        const productName =
            product.name ?? "Suvarna Jewellery";


        const productCategory =
            product.category ?? "Collection";


        let productImage = "";

        try{

            productImage =
                typeof getImage === "function"
                    ? getImage(product.image)
                    : (product.image || "");

        }

        catch(error){

            console.warn(
                "Product image error:",
                product,
                error
            );

            productImage =
                product.image || "";

        }


        /* ----------------------------------
           PRODUCT CARD
        ---------------------------------- */

        const card = document.createElement("a");

        card.href =
            `product.html?id=${encodeURIComponent(productId)}`;

        card.className =
            "collection-link";


        card.innerHTML = `

            <div class="card">

                <div class="card-image">

                    <img
                        src="${productImage}"
                        alt="${escapeHTML(productName)}"
                        loading="lazy"
                        onerror="
                            this.style.display='none';
                        "
                    >

                </div>


                <div class="card-content">

                    <h3>
                        ${escapeHTML(productName)}
                    </h3>

                    <p>
                        ${escapeHTML(productCategory)}
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
   COLLECTION SEARCH
========================================== */

function initSearch(){

    const search =
        document.getElementById("collectionSearch");

    if(!search) return;


    search.addEventListener("input", function(){

        const keyword =
            this.value
                .trim()
                .toLowerCase();


        /* ----------------------------------
           SHOW ALL PRODUCTS
        ---------------------------------- */

        if(!keyword){

            renderCollections(allProducts);

            return;

        }


        /* ----------------------------------
           FILTER PRODUCTS
        ---------------------------------- */

        const filtered =
            allProducts.filter(product => {

                if(!product) return false;


                const name =
                    String(product.name || "")
                        .toLowerCase();


                const category =
                    String(product.category || "")
                        .toLowerCase();


                const metal =
                    String(product.metal || "")
                        .toLowerCase();


                const description =
                    String(product.description || "")
                        .toLowerCase();


                return (

                    name.includes(keyword) ||

                    category.includes(keyword) ||

                    metal.includes(keyword) ||

                    description.includes(keyword)

                );

            });


        renderCollections(filtered);

    });

}


/* ==========================================
   ERROR STATE
========================================== */

function showCollectionsError(grid){

    grid.innerHTML = `

        <div class="empty-state">

            <h3>
                Collection Temporarily Unavailable
            </h3>

            <p>
                Please refresh the page and try again.
            </p>

        </div>

    `;

}


/* ==========================================
   SAFE HTML
========================================== */

function escapeHTML(value){

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* ==========================================
   GLOBAL
========================================== */

window.initCollectionsHome =
    initCollectionsHome;

window.renderCollections =
    renderCollections;
